/**
 * firebase-karuta.js
 * ─────────────────────────────────────────────────────────────────────────
 * 目で勝負するかるたゲーム　
 * ─────────────────────────────────────────────────────────────────────────
 */
// ═══════════════════════════════════════════════════════════════════════════
//  オンラインかるたと同一
// ═══════════════════════════════════════════════════════════════════════════
const KARUTA_FIREBASE_CONFIG = {
    apiKey:            "AIzaSyDsKsuYsYZYaNVuFvnzQsZiKIrSAMFZQus",
    authDomain:        "fire-karuta.firebaseapp.com",
    projectId:         "fire-karuta",
    storageBucket:     "fire-karuta.firebasestorage.app",
    messagingSenderId: "202669803794",
    appId:             "1:202669803794:web:2b2eb18bb0a065dff04bcb",
    // Realtime DB はニックネーム変更をオンライン対戦側のランキングへ反映するときだけ使う
    databaseURL:       "https://fire-karuta-default-rtdb.asia-southeast1.firebasedatabase.app"
};
// ═══════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── Firebase 初期化（二重初期化防止） ─────────────────────────────────
    let app;
    try {
        app = firebase.app();
    } catch (_) {
        app = firebase.initializeApp(KARUTA_FIREBASE_CONFIG);
    }
    const auth = firebase.auth();
    const db   = firebase.firestore();
    const rtdb = firebase.database ? firebase.database() : null;

    // ── 状態 ─────────────────────────────────────────────────────────────
    let currentUser  = null;
    let currentNickname = null; // users/{uid}.nickname（未設定なら null）
    let _pendingSave = null;    // 結果画面で未ログイン→ログイン後に自動保存

    // ── かるたゲーム 称号（累積スコア基準） ───────────────────────────────
    const KARUTA_TITLES = [
        { score: 1500000, title: '天神様' },
        { score: 1000000, title: '太政大臣' },
        { score:  700000, title: '左大臣' },
        { score:  500000, title: '怨霊' },
        { score:  400000, title: '大宰権帥' },
        { score:  300000, title: '右大臣' },
        { score:  200000, title: '大納言' },
        { score:  120000, title: '中納言' },
        { score:   70000, title: '参議' },
        { score:   40000, title: '左中弁' },
        { score:   20000, title: '蔵人頭' },
        { score:   10000, title: '文章博士' },
        { score:    5000, title: '少内記' },
        { score:    2000, title: '文章得業生' },
        { score:     500, title: '文章生' },
    ];

    function _getKarutaTitle(score) {
        for (const t of KARUTA_TITLES) {
            if ((score || 0) >= t.score) return t.title;
        }
        return null;
    }

    // ── Auth 状態変化 ──────────────────────────────────────────────────────
    auth.onAuthStateChanged(async user => {
        currentUser = user;
        currentNickname = null;
        if (user) {
            try {
                const snap = await db.collection('users').doc(user.uid).get();
                currentNickname = (snap.exists && snap.data().nickname) || null;
            } catch (e) {
                console.warn('[KarutaAuth] nickname load error:', e);
            }
        }
        _refreshAuthAreas();

        // 結果画面でログインした場合に自動保存
        if (user && _pendingSave) {
            const params = _pendingSave;
            _pendingSave = null;
            const el = document.getElementById('karuta-save-result');
            if (el) await _doSaveAndRender(el, user, params);
        }
    });

    // ── Google ログイン / ログアウト ───────────────────────────────────────
    function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => {
            console.error('[KarutaAuth] signIn error:', err);
        });
    }

    function signOut() {
        auth.signOut();
    }

    // ── Firestore: スコア保存 ─────────────────────────────────────────────
    async function _saveGameScore({ totalScore, correctAnswers, totalQuestions, color, lang, skipCumulative }) {
        if (!currentUser) return;

        const uid   = currentUser.uid;
        const FV    = firebase.firestore.FieldValue;

        // ゲーム結果ログ（全件保持）。Google の表示名・写真は保存しない
        await db.collection('gameResults').add({
            uid,
            totalScore, correctAnswers, totalQuestions,
            color, lang,
            playedAt: FV.serverTimestamp()
        });

        // ユーザー累積スコアをアトミックに更新
        const userRef   = db.collection('users').doc(uid);
        const gameKey   = color ? 'gameScore_' + color : null;
        const gameGames = color ? 'gameGames_' + color : null;
        await db.runTransaction(async tx => {
            const snap = await tx.get(userRef);
            const d    = snap.exists ? snap.data() : {};
            const gameExtra = gameKey ? {
                [gameKey]:   ((d[gameKey]   || 0) + totalScore),
                [gameGames]: ((d[gameGames] || 0) + 1),
            } : {};
            // skipCumulative: true のゲームは全ゲーム共通スコアを更新しない
            const cumulExtra = skipCumulative ? {} : {
                cumulativeScore: (d.cumulativeScore || 0) + totalScore,
                gamesPlayed:     (d.gamesPlayed     || 0) + 1,
                bestScore:       Math.max(d.bestScore || 0, totalScore),
            };
            const payload = { ...cumulExtra, ...gameExtra };
            if (snap.exists) {
                // 以前保存していた Google の表示名・写真・最終プレイ日時を消す
                tx.update(userRef, {
                    ...payload,
                    displayName:  FV.delete(),
                    photoURL:     FV.delete(),
                    lastPlayedAt: FV.delete()
                });
            } else {
                tx.set(userRef, payload);
            }
        });
    }

    // ── Firestore: ランキング取得（上位 10 ＋ 自分の順位） ────────────────
    async function _fetchLeaderboard(scoreField = 'cumulativeScore') {
        const base = scoreField === 'cumulativeScore'
            ? db.collection('users').orderBy(scoreField, 'desc')
            : db.collection('users').where(scoreField, '>', 0).orderBy(scoreField, 'desc');
        const snap = await base.limit(10).get();
        const rows = snap.docs.map((d, i) => ({ rank: i + 1, uid: d.id, ...d.data() }));

        // 自分が圏外の場合、自分の順位を別途取得
        let myRow = null;
        if (currentUser) {
            const inTop = rows.some(r => r.uid === currentUser.uid);
            if (!inTop) {
                const mySnap = await db.collection('users').doc(currentUser.uid).get();
                if (mySnap.exists) {
                    const myData = mySnap.data();
                    const myScore = myData[scoreField] || 0;
                    if (myScore > 0) {
                        try {
                            const countSnap = await db.collection('users')
                                .where(scoreField, '>', myScore)
                                .count().get();
                            const myRank = countSnap.data().count + 1;
                            myRow = { rank: myRank, uid: currentUser.uid, ...myData };
                        } catch (_) {}
                    }
                }
            }
        }
        return { rows, myRow };
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  UI: 認証エリア（選択画面）
    // ═══════════════════════════════════════════════════════════════════════

    // 登録済みコンテナを記録して onAuthStateChanged で再描画
    const _authTargets = new Map(); // id → lang

    function _refreshAuthAreas() {
        _authTargets.forEach((lang, id) => {
            const el = document.getElementById(id);
            if (el) _renderAuthInto(el, lang);
        });
    }

    /**
     * 選択画面の認証エリアを描画・更新する
     * @param {string} containerId  - 描画先 div の id
     * @param {string} lang         - 'ja' | 'en'
     */
    function renderAuthArea(containerId, lang = 'ja') {
        _authTargets.set(containerId, lang);
        const el = document.getElementById(containerId);
        if (el) _renderAuthInto(el, lang);
    }

    function _renderAuthInto(el, lang) {
        const isJa = lang !== 'en';
        if (currentUser) {
            el.innerHTML = `
            <div style="margin-top:1em;background:linear-gradient(135deg,#e8f5e9,#f1f8e9);
                        border:1px solid #a5d6a7;border-radius:10px;padding:8px 16px;
                        display:flex;align-items:center;justify-content:space-between;
                        flex-wrap:wrap;gap:8px;font-family:'Noto Sans JP',sans-serif;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <img src="${_esc(currentUser.photoURL || '')}" width="32" height="32"
                         style="border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #81c784;"
                         onerror="this.style.display='none'">
                    <span style="font-weight:bold;color:#2d5a27;font-size:0.88rem;">
                        ${_esc(currentNickname || (isJa ? '名無し（ニックネーム未設定）' : 'Anonymous (no nickname set)'))}
                    </span>
                    <span id="karuta-title-badge" style="display:none;font-size:11px;padding:2px 8px;
                        border-radius:10px;font-weight:bold;background:#fff3cd;color:#856404;"></span>
                </div>
                <div style="display:flex;gap:6px;">
                    <button id="karuta-nickname-btn"
                        style="background:none;border:1px solid #aaa;border-radius:12px;
                               padding:3px 10px;font-size:12px;color:#555;cursor:pointer;font-family:inherit;">
                        ${isJa ? '名前変更' : 'Change name'}
                    </button>
                    <button id="karuta-signout-btn"
                        style="background:none;border:1px solid #aaa;border-radius:12px;
                               padding:3px 10px;font-size:12px;color:#666;cursor:pointer;font-family:inherit;">
                        ${isJa ? 'ログアウト' : 'Sign out'}
                    </button>
                    <button id="karuta-delete-btn"
                        style="background:none;border:1px solid #e8b4b8;border-radius:12px;
                               padding:3px 10px;font-size:12px;color:#c0392b;cursor:pointer;font-family:inherit;">
                        ${isJa ? 'データ削除' : 'Delete my data'}
                    </button>
                </div>
            </div>`;
            document.getElementById('karuta-nickname-btn').onclick = () => _changeNickname(lang);
            document.getElementById('karuta-signout-btn').onclick = signOut;
            document.getElementById('karuta-delete-btn').onclick = () => {
                _handleDeleteMyData(el, lang);
            };
            // 称号バッジを非同期で取得・表示
            db.collection('users').doc(currentUser.uid).get().then(snap => {
                if (!snap.exists) return;
                const title = _getKarutaTitle(snap.data().gameScore_karuta);
                if (!title) return;
                const badge = document.getElementById('karuta-title-badge');
                if (badge) { badge.textContent = '🎖 ' + title; badge.style.display = 'inline-block'; }
            }).catch(() => {});
        } else {
            el.innerHTML = `
            <div style="margin-top:1em;background:linear-gradient(135deg,#fff9e6,#fef3c7);
                        border:1px solid #f0d060;border-radius:10px;padding:10px 16px;
                        display:flex;align-items:center;justify-content:center;
                        flex-wrap:wrap;gap:10px;font-family:'Noto Sans JP',sans-serif;">
                <p style="margin:0;font-size:13px;color:#555;">
                    🏆 ${isJa ? 'Googleログインするとランキングに参加できます' : 'Sign in to appear on the leaderboard'}
                </p>
                <button id="karuta-signin-btn"
                    style="display:inline-flex;align-items:center;gap:8px;
                           background:#fff;border:1px solid #ccc;border-radius:20px;
                           padding:6px 16px;font-size:13px;cursor:pointer;
                           box-shadow:0 1px 3px rgba(0,0,0,0.1);transition:box-shadow 0.2s;
                           font-family:inherit;">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                         width="18" height="18" alt="Google">
                    ${isJa ? 'Googleでログイン' : 'Sign in with Google'}
                </button>
            </div>`;
            document.getElementById('karuta-signin-btn').onclick = signInWithGoogle;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  UI: ランキング（選択画面）
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * ランキングを描画する
     * @param {string} containerId
     * @param {string} lang  - 'ja' | 'en'
     */
    const _leaderboardTargets = new Map(); // id → [lang, scoreField, title]

    function _refreshLeaderboards() {
        _leaderboardTargets.forEach((args, id) => renderLeaderboard(id, ...args));
    }

    async function renderLeaderboard(containerId, lang = 'ja', scoreField = 'cumulativeScore', title = null) {
        _leaderboardTargets.set(containerId, [lang, scoreField, title]);
        const el = document.getElementById(containerId);
        if (!el) return;
        const isJa = lang !== 'en';

        el.innerHTML = `
        <p style="text-align:center;color:#bbb;font-size:0.83rem;
                  font-family:'Noto Sans JP',sans-serif;margin:10px 0;">
            ${isJa ? 'ランキング読み込み中…' : 'Loading ranking…'}
        </p>`;

        try {
            const { rows, myRow } = await _fetchLeaderboard(scoreField);
            if (rows.length === 0) {
                el.innerHTML = `
                <p style="text-align:center;color:#bbb;font-size:0.83rem;
                           font-family:'Noto Sans JP',sans-serif;margin:10px 0;">
                    ${isJa ? 'まだ記録がありません' : 'No records yet'}
                </p>`;
                return;
            }
            _renderLeaderboardTable(el, rows, isJa, scoreField, title, myRow);
        } catch (e) {
            console.error('[KarutaAuth] leaderboard error:', e);
            el.innerHTML = `
            <p style="text-align:center;color:#bbb;font-size:0.83rem;
                       font-family:'Noto Sans JP',sans-serif;margin:10px 0;">
                ${isJa ? 'まだ記録がありません' : 'No records yet'}
            </p>`;
        }
    }

    function _renderLeaderboardTable(el, rows, isJa, scoreField = 'cumulativeScore', title = null, myRow = null) {
        const medals = ['🥇', '🥈', '🥉'];

        // scoreField が 'gameScore_xxx' の形式なら対応する gamesField を導出
        const gamesField = scoreField.startsWith('gameScore_')
            ? 'gameGames_' + scoreField.slice('gameScore_'.length)
            : 'gamesPlayed';
        const footerNote = scoreField === 'cumulativeScore'
            ? (isJa ? '累積スコア = 全ゲームの得点合計' : 'Cumulative = sum of all game scores')
            : (isJa ? 'このゲームの累積スコア' : 'Cumulative score for this game');

        const showTitle = true;
        const rowsHTML = rows.map(r => {
            const medal = medals[r.rank - 1] || '';
            const rankCell = medal
                ? `<span style="font-size:1.1rem;">${medal}</span>`
                : `<span style="font-size:0.85rem;font-weight:bold;color:#B82343;">${r.rank}${isJa ? '位' : '.'}</span>`;
            const gamesCount = r[gamesField] || 0;
            const games = isJa ? `${gamesCount}回` : `${gamesCount} games`;
            // 自分の行をハイライト
            const isMine = currentUser && currentUser.uid === r.uid;
            const rowBg  = isMine ? 'background:#fff8ee;' : '';
            // 称号バッジ
            const titleText = showTitle ? _getKarutaTitle(r[scoreField]) : null;
            const titleBadge = titleText
                ? `<span style="font-size:10px;padding:1px 6px;border-radius:8px;
                               font-weight:bold;background:#fff3cd;color:#856404;
                               white-space:nowrap;flex-shrink:0;">🎖 ${_esc(titleText)}</span>`
                : '';

            return `
            <tr style="border-bottom:1px solid #f0e8d0;${rowBg}">
                <td style="padding:6px 8px;text-align:center;width:36px;">${rankCell}</td>
                <td style="padding:6px 8px;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <span style="flex-shrink:0;">${_fallbackIcon(r.uid)}</span>
                        <span style="font-size:0.86rem;color:${isMine ? '#B82343' : '#333'};
                                     font-weight:${isMine ? 'bold' : 'normal'};
                                     overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px;">
                            ${_esc(r.nickname || (isJa ? '名無し' : 'Anonymous'))}
                        </span>
                        ${titleBadge}
                    </div>
                </td>
                <td style="padding:6px 8px;text-align:right;font-size:0.95rem;
                           font-weight:bold;color:#B82343;white-space:nowrap;">
                    ${(r[scoreField] || 0).toLocaleString()}
                </td>
                <td style="padding:6px 4px;text-align:right;font-size:0.74rem;
                           color:#aaa;white-space:nowrap;">${games}</td>
            </tr>`;
        }).join('');

        // 圏外の自分の行
        let myRowHTML = '';
        if (myRow) {
            const titleText = _getKarutaTitle(myRow[scoreField]);
            const titleBadge = titleText
                ? `<span style="font-size:10px;padding:1px 6px;border-radius:8px;
                               font-weight:bold;background:#fff3cd;color:#856404;
                               white-space:nowrap;flex-shrink:0;">🎖 ${_esc(titleText)}</span>`
                : '';
            const gamesCount = myRow[gamesField] || 0;
            const games = isJa ? `${gamesCount}回` : `${gamesCount} games`;
            myRowHTML = `
            <tr><td colspan="4" style="padding:3px 8px;text-align:center;
                font-size:11px;color:#bbb;background:#fafaf5;border-top:1px dashed #e0d8c0;">
                ・・・
            </td></tr>
            <tr style="background:#fff8ee;">
                <td style="padding:6px 8px;text-align:center;width:36px;">
                    <span style="font-size:0.85rem;font-weight:bold;color:#B82343;">
                        ${myRow.rank}${isJa ? '位' : '.'}
                    </span>
                </td>
                <td style="padding:6px 8px;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <span style="flex-shrink:0;">${_fallbackIcon(myRow.uid)}</span>
                        <span style="font-size:0.86rem;color:#B82343;font-weight:bold;
                                     overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px;">
                            ${_esc(myRow.nickname || (isJa ? '名無し' : 'Anonymous'))}
                        </span>
                        ${titleBadge}
                    </div>
                </td>
                <td style="padding:6px 8px;text-align:right;font-size:0.95rem;
                           font-weight:bold;color:#B82343;white-space:nowrap;">
                    ${(myRow[scoreField] || 0).toLocaleString()}
                </td>
                <td style="padding:6px 4px;text-align:right;font-size:0.74rem;
                           color:#aaa;white-space:nowrap;">${games}</td>
            </tr>`;
        }

        el.innerHTML = `
        <div style="margin:14px 0 4px;font-family:'Noto Sans JP',sans-serif;">
            <p style="font-size:0.8rem;font-weight:bold;color:#666;text-align:center;
                      margin-bottom:8px;letter-spacing:0.08em;">
                ── ${title || (isJa ? '累積スコア ランキング TOP 10' : 'Cumulative Score Ranking TOP 10')} ──
            </p>
            <p class="ranking-privacy-note" style="font-size:0.78rem;line-height:1.6;color:#555;background:#faf6ea;
                      border-left:3px solid #D4AF37;border-radius:4px;padding:6px 10px;margin:0 0 10px;text-align:left;">
                ${isJa
                    ? '個人情報保護のため、ランキングにはGoogleのお名前・写真を表示せず、ご自身で付けたニックネームを表示しています。ログイン後の「名前変更」からニックネームを設定できます（これまでの成績はそのまま引き継がれます）。'
                    : 'To protect your privacy, the leaderboard shows the nickname you choose instead of your Google name or photo. After signing in, use "Change name" to set your nickname (your previous scores carry over).'}
            </p>
            <div style="border:1.5px solid #D4AF37;border-radius:8px;
                        overflow:hidden;background:#fdf8e8;">
                <table style="width:100%;border-collapse:collapse;
                              font-family:'Noto Sans JP',sans-serif;">
                    <tbody>${rowsHTML}${myRowHTML}</tbody>
                </table>
            </div>
        </div>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  UI: スコア保存バナー（結果画面）
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * 結果画面でスコアを Firestore に保存し、保存結果バナーを描画する。
     * 未ログインの場合はログインボタンを表示し、ログイン後に自動保存する。
     *
     * @param {string} containerId
     * @param {{ totalScore, correctAnswers, totalQuestions, color, lang }} params
     */
    async function renderSaveResult(containerId, params) {
        const el = document.getElementById(containerId);
        if (!el) return;
        const isJa = params.lang !== 'en';

        if (!currentUser) {
            // 未ログイン → ログインボタン表示 ＋ ログイン後に自動保存
            _pendingSave = params;
            el.innerHTML = `
            <div style="margin:16px 0;padding:12px 16px;background:#fdf8e8;
                        border:1.5px solid #D4AF37;border-radius:10px;
                        text-align:center;font-family:'Noto Sans JP',sans-serif;">
                <p style="margin:0 0 8px;font-size:0.88rem;color:#555; text-align:left;">
                    ${isJa
                        ? 'ログインするとスコアを記録してランキングに参加できます！'
                        : 'Log in to save your score and join the leaderboard!'}
                </p>
                <button id="karuta-result-signin"
                    style="display:inline-flex;align-items:center;gap:8px;
                           padding:8px 18px;border:1.5px solid #ddd;border-radius:8px;
                           background:#fff;cursor:pointer;font-size:0.88rem;color:#333;
                           box-shadow:0 1px 4px rgba(0,0,0,0.12);">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                         width="16" height="16" alt="G">
                    ${isJa ? 'Googleでログイン' : 'Sign in with Google'}
                </button>
            </div>`;
            document.getElementById('karuta-result-signin').onclick = signInWithGoogle;
            return;
        }

        await _doSaveAndRender(el, currentUser, params);
    }

    async function _doSaveAndRender(el, user, params) {
        const isJa = params.lang !== 'en';
        el.innerHTML = `
        <p style="text-align:center;font-size:0.85rem;color:#aaa;
                  font-family:'Noto Sans JP',sans-serif;margin:14px 0;">
            ${isJa ? 'スコア保存中…' : 'Saving score…'}
        </p>`;

        try {
            await _saveGameScore(params);
            el.innerHTML = `
            <div style="margin:14px 0;padding:10px 16px;background:#f0fff4;
                        border:1.5px solid #2E9E5B;border-radius:10px;
                        text-align:center;font-family:'Noto Sans JP',sans-serif;">
                <p style="margin:0;font-size:0.9rem;color:#2E9E5B;font-weight:bold;">
                    ✅ ${isJa ? 'スコアを記録しました！' : 'Score saved!'}<br>
                    <span style="font-size:0.8rem;color:#555;font-weight:normal;">
                        ${_esc(currentNickname || (isJa ? '名無し' : 'Anonymous'))} &nbsp;＋${params.totalScore.toLocaleString()} pts
                    </span>
                </p>
            </div>`;
        } catch (e) {
            console.error('[KarutaAuth] save error:', e);
            el.innerHTML = `
            <p style="color:#B82343;text-align:center;font-size:0.82rem;
                      font-family:'Noto Sans JP',sans-serif;margin:10px 0;">
                ${isJa ? '⚠ 保存に失敗しました。再度お試しください。' : '⚠ Failed to save. Please try again.'}
            </p>`;
        }
    }

    // ── ニックネーム変更 ─────────────────────────────────────────────────
    // js/karuta-nickname.js（モジュール版 SDK 用）と同じ処理。変更するときは両方直すこと。
    const NICKNAME_MAX = 12;

    async function _changeNickname(lang) {
        if (!currentUser) return;
        const isJa = lang !== 'en';
        const input = prompt(isJa
            ? `ランキングに表示するニックネームを入力してください（${NICKNAME_MAX}文字まで）。\n空欄にすると「名無し」になります。\n※本名など、個人が特定できる名前は避けてください。`
            : `Enter a nickname to show on the leaderboard (up to ${NICKNAME_MAX} characters).\nLeave it blank to appear as "Anonymous".\n* Please avoid your real name or anything that identifies you.`,
            currentNickname || '');
        if (input === null) return;
        const nick = String(input).replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim();
        if ([...nick].length > NICKNAME_MAX) {
            alert(isJa ? `ニックネームは${NICKNAME_MAX}文字までです。` : `Nicknames can be up to ${NICKNAME_MAX} characters.`);
            return;
        }
        try {
            await _saveNicknameEverywhere(currentUser.uid, nick || null);
        } catch (e) {
            console.error('[KarutaAuth] nickname save error:', e);
            alert(isJa ? 'ニックネームの保存に失敗しました。再度お試しください。' : 'Failed to save your nickname. Please try again.');
            return;
        }
        currentNickname = nick || null;
        _refreshAuthAreas();
        _refreshLeaderboards();
    }

    async function _saveNicknameEverywhere(uid, nick) {
        const FV = firebase.firestore.FieldValue;
        // 正本（失敗したらエラーにする）
        await db.collection('users').doc(uid).set({
            nickname:     nick || FV.delete(),
            displayName:  FV.delete(),
            photoURL:     FV.delete(),
            lastPlayedAt: FV.delete()
        }, { merge: true });

        // Realtime DB（オンライン対戦側）: 本人の記録があるノードだけ書き換える（無いノードは作らない）
        if (!rtdb) return;
        const fix = { nickname: nick, displayName: null, photoURL: null };
        const paths = [`user_stats/${uid}`, `pro_user_stats/${uid}`];
        for (const base of ['rankings/online', 'rankings/cpu', 'pro_rankings/cpu']) {
            try {
                const snap = await rtdb.ref(base).once('value');
                snap.forEach(day => { if (day.child(uid).exists()) paths.push(`${base}/${day.key}/${uid}`); });
            } catch (_) {
                // 全日付を読めない場合は直近 7 日分（ランキングページの表示範囲）だけ
                for (let i = 0; i < 7; i++) {
                    const d = new Date(Date.now() + 9 * 60 * 60 * 1000 - i * 86400000).toISOString().slice(0, 10);
                    paths.push(`${base}/${d}/${uid}`);
                }
            }
        }
        await Promise.all(paths.map(async p => {
            try {
                const snap = await rtdb.ref(p).once('value');
                if (snap.exists()) await rtdb.ref(p).update(fix);
            } catch (e) {
                console.warn('[KarutaAuth] nickname skip', p, e);
            }
        }));
    }

    // ── Firestore: ユーザーデータ削除 ────────────────────────────────────
    async function _handleDeleteMyData(authEl, lang) {
        const isJa = lang !== 'en';
        const msg = isJa
            ? '記録したスコアデータをすべて削除します。\nこの操作は元に戻せません。本当に削除しますか？'
            : 'All your score data will be permanently deleted.\nThis cannot be undone. Are you sure?';
        if (!confirm(msg)) return;

        if (!currentUser) return;
        const uid = currentUser.uid;

        authEl.innerHTML = `
        <p style="text-align:center;font-size:0.85rem;color:#aaa;
                  font-family:'Noto Sans JP',sans-serif;margin:10px 0;">
            ${isJa ? 'データ削除中…' : 'Deleting data…'}
        </p>`;

        try {
            // 1. users ドキュメントを削除
            await db.collection('users').doc(uid).delete();

            // 2. gameResults を uid で検索してバッチ削除
            const snap = await db.collection('gameResults').where('uid', '==', uid).get();
            if (!snap.empty) {
                const BATCH_SIZE = 400;
                for (let i = 0; i < snap.docs.length; i += BATCH_SIZE) {
                    const batch = db.batch();
                    snap.docs.slice(i, i + BATCH_SIZE).forEach(doc => batch.delete(doc.ref));
                    await batch.commit();
                }
            }

            // 3. サインアウト（_refreshAuthAreas で UI も更新される）
            await auth.signOut();
            location.reload();
        } catch (e) {
            console.error('[KarutaAuth] deleteMyData error:', e);
            authEl.innerHTML = `
            <p style="text-align:center;font-size:0.82rem;color:#B82343;
                      font-family:'Noto Sans JP',sans-serif;margin:10px 0;">
                ${isJa ? '⚠ 削除に失敗しました。再度お試しください。' : '⚠ Failed to delete. Please try again.'}
            </p>`;
        }
    }

    // ── 写真の代わりのアイコン（uid から決まる絵文字） ─────────────────────
    function _fallbackIcon(uid) {
        const icons = ['🐻', '🐼', '🐰', '🐨', '🐱', '🦁', '🐶', '🦊', '🐵'];
        const s = String(uid);
        let h = 0;
        for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
        return icons[h % icons.length];
    }

    // ── XSS 防止 ──────────────────────────────────────────────────────────
    function _esc(str) {
        return String(str).replace(/[&<>"']/g, c =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
        );
    }

    // ── グローバル公開 ─────────────────────────────────────────────────────
    window.KarutaAuth = {
        renderAuthArea,
        renderLeaderboard,
        renderSaveResult,
        getUser: () => currentUser
    };

})();