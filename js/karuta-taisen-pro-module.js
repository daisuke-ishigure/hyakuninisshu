    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, get, runTransaction, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
    import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

    const LANG = window.LANG;


    const firebaseConfig = {
      apiKey: "AIzaSyDsKsuYsYZYaNVuFvnzQsZiKIrSAMFZQus",
      authDomain: "fire-karuta.firebaseapp.com",
      databaseURL: "https://fire-karuta-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "fire-karuta",
      appId: "1:202669803794:web:2b2eb18bb0a065dff04bcb"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    // ===== 称号 =====
    const TITLES = LANG.rankTitles;
    function getTitle(wins) {
      for (const t of TITLES) { if ((wins || 0) >= t.wins) return t.title; }
      return null;
    }

    function getTodayKey() {
      const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
      return jst.toISOString().slice(0, 10);
    }

    function escHtml(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function fallbackIcon(uid) {
      const icons = ['🐻', '🐼', '🐰', '🐨', '🐱', '🦁', '🐶', '🦊', '🐵'];
      let h = 0;
      for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) & 0xffff;
      return icons[h % icons.length];
    }

    async function loadAndShowMyBadge(user) {
      try {
        const snap = await get(ref(db, `pro_user_stats/${user.uid}`));
        const stats = snap.val() || {};
        const el = document.getElementById('my_title_badge');
        const ct = getTitle(stats.cpu_total_wins);
        if (el) el.innerHTML = ct ? `<span style="font-size:12px;background:#B82343;color:#fff;border-radius:10px;padding:2px 8px;">👾 ${ct}</span>` : '';
      } catch (e) { console.error('バッジ取得エラー:', e); }
    }

    // ===== Auth =====
    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
      window.currentUser = user;
      currentUser = user;
      if (user) {
        document.getElementById('login_prompt_box').style.display = 'none';
        document.getElementById('user_info_box').style.display = 'flex';
        document.getElementById('user_avatar').src = user.photoURL || '';
        document.getElementById('user_display_name').innerText = user.displayName || user.email;
        loadAndShowMyBadge(user);
        const loginNote = document.getElementById('ranking_login_note');
        if (loginNote) loginNote.style.display = 'none';
      } else {
        window.currentUser = null;
        document.getElementById('login_prompt_box').style.display = 'flex';
        document.getElementById('user_info_box').style.display = 'none';
      }
    });

    document.getElementById('google_login_btn').onclick = async () => {
      try { await signInWithPopup(auth, provider); }
      catch (e) { console.error('ログインエラー:', e); alert(LANG.alertLoginFailed); }
    };
    document.getElementById('logout_btn').onclick = () => signOut(auth);

    document.getElementById('delete_data_btn').onclick = async () => {
      if (!currentUser) return;
      if (!confirm(LANG.confirmDeleteData)) return;

      const uid = currentUser.uid;
      try {
        // pro_user_stats 削除
        await remove(ref(db, `pro_user_stats/${uid}`));
      } catch (e) {
        console.error('データ削除エラー:', e);
        alert(LANG.alertDeleteFailed);
        return;
      }

      // pro_rankings 削除（全日付）— 権限不足でも続行
      try {
        const snap = await get(ref(db, 'pro_rankings/cpu'));
        if (snap.exists()) {
          const updates = {};
          snap.forEach(dateSnap => {
            if (dateSnap.child(uid).exists()) {
              updates[`pro_rankings/cpu/${dateSnap.key}/${uid}`] = null;
            }
          });
          if (Object.keys(updates).length) await update(ref(db), updates);
        }
      } catch (e) {
        console.warn('ランキング削除スキップ:', e);
      }

      await signOut(auth);
      location.reload();
    };

    // ===== 勝利記録 =====
    window.recordCpuWin = async (difficulty, mode) => {
      if (!currentUser) return;
      const multiplier = mode === 3 ? 5 : mode === 2 ? 2 : mode === 0 ? 1 : 1;
      try {
        const dateKey = getTodayKey();
        const rankRef = ref(db, `pro_rankings/cpu/${dateKey}/${currentUser.uid}`);
        await runTransaction(rankRef, (cur) => {
          if (cur === null) return { displayName: currentUser.displayName || LANG.defaultName, photoURL: currentUser.photoURL || '', wins: multiplier, updatedAt: Date.now() };
          return { ...cur, displayName: currentUser.displayName || cur.displayName, photoURL: currentUser.photoURL || cur.photoURL, wins: (cur.wins || 0) + multiplier, updatedAt: Date.now() };
        });
        const statsRef = ref(db, `pro_user_stats/${currentUser.uid}`);
        await runTransaction(statsRef, (cur) => {
          const name = currentUser.displayName || (cur && cur.displayName) || null;
          const photo = currentUser.photoURL || (cur && cur.photoURL) || null;
          if (cur === null) return { cpu_total_wins: multiplier, displayName: name, photoURL: photo };
          return { ...cur, cpu_total_wins: (cur.cpu_total_wins || 0) + multiplier, displayName: name, photoURL: photo };
        });
        const notice = document.getElementById('win_recorded_notice');
        if (notice) {
          const suffix = multiplier > 1 ? LANG.winMultiplierSuffix(multiplier) : '';
          notice.innerText = LANG.winRecordedNotice(suffix);
          notice.style.display = 'block';
        }
        await loadAndShowMyBadge(currentUser);
      } catch (e) { console.error('勝利記録エラー:', e); }
    };

    // モジュールロード前に勝利が記録されていた場合に処理
    if (window._pendingWin) {
      const { difficulty, mode } = window._pendingWin;
      window._pendingWin = null;
      window.recordCpuWin(difficulty, mode);
    }

    // ===== ランキング読み込み =====
    window._fbLoadRanking = async (targetEl) => {
      const MEDALS = ['🥇', '🥈', '🥉'];

      function renderEntries(entries) {
        if (!entries.length) {
          targetEl.innerHTML = LANG.rankingNoRecordsHtml;
          return;
        }
        let html = `<div style="max-height:340px;overflow-y:auto;">`;
        let rank = 1;
        entries.forEach((e, i) => {
          if (i > 0 && e.wins < entries[i - 1].wins) rank = i + 1;
          const isMe = currentUser && e.uid === currentUser.uid;
          const cls = isMe ? 'is-me' : (i % 2 === 0 ? 'even-row' : '');
          const medal = rank <= 3 ? MEDALS[rank - 1] : `${rank}.`;
          const avatar = e.photoURL
            ? `<img src="${escHtml(e.photoURL)}" style="width:22px;height:22px;border-radius:50%;margin-right:4px;vertical-align:middle;" onerror="this.style.display='none'">`
            : `<span style="margin-right:4px;">${fallbackIcon(e.uid)}</span>`;
          const meBadge = isMe ? ` <span style="font-size:0.75em;background:#B82343;color:#fff;border-radius:8px;padding:1px 6px;">${LANG.meBadgeText}</span>` : '';
          const titleStr = getTitle(e.wins);
          const titleBadge = titleStr ? ` <span style="font-size:0.72em;background:#555;color:#fff;border-radius:8px;padding:1px 6px;">${titleStr}</span>` : '';
          const name = escHtml(e.displayName || LANG.defaultName);
          html += `<div class="rank-card-simple ${cls}">
            <span>${medal} ${avatar}${name}${titleBadge}${meBadge}</span>
            <span style="color:#666;white-space:nowrap;">${LANG.winCount(e.wins)}</span>
          </div>`;
        });
        html += `</div>`;
        targetEl.innerHTML = html;
      }

      try {
        const statsSnap = await get(ref(db, 'pro_user_stats'));
        const data = statsSnap.val() || {};
        const entries = Object.entries(data)
          .map(([uid, v]) => ({ uid, wins: v.cpu_total_wins || 0, displayName: v.displayName, photoURL: v.photoURL }))
          .filter(e => e.wins > 0)
          .sort((a, b) => b.wins - a.wins)
          .slice(0, 100);
        renderEntries(entries);
      } catch (e) {
        console.error('ランキング読み込みエラー:', e);
        const msg = e && e.code ? `(${e.code})` : '';
        targetEl.innerHTML = LANG.rankingLoadErrorHtml(msg);
      }
    };

    // ===== ページ読み込み時にインラインランキングを表示 =====
    (async () => {
      const el = document.getElementById('inline_ranking_content');
      if (el) await window._fbLoadRanking(el);
    })();

    // 勝利記録後にインラインランキングも更新
    const _origRecordCpuWin = window.recordCpuWin;
    window.recordCpuWin = async (...args) => {
      await _origRecordCpuWin(...args);
      const el = document.getElementById('inline_ranking_content');
      if (el) await window._fbLoadRanking(el);
    };
