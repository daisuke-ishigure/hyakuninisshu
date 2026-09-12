/**
 * 百人一首 かるたクイズ
 */

// ─── スタイル注入（一度だけ） ────────────────────────────────────────
(function injectKimarijiStyles() {
    if (document.getElementById('kim-injected-styles')) return;
    const s = document.createElement('style');
    s.id = 'kim-injected-styles';
    s.textContent = `
/* ── 正解カード：和風ポップ ── */
@keyframes kimCorrectPop {
    0%   { transform: scale(1);    box-shadow: 0 0 0 0   rgba(184,35,67,0); }
    40%  { transform: scale(1.02); box-shadow: 0 0 0 5px rgba(184,35,67,0.5), 0 0 22px 8px rgba(212,175,55,0.35); border-color: #D4AF37 !important; }
    100% { transform: scale(1);    box-shadow: 0 0 0 2px rgba(212,175,55,0.45); border-color: #D4AF37 !important; }
}
.kimariji-card.correct-image {
    animation: kimCorrectPop 0.6s ease-out forwards !important;
    border-color: #D4AF37 !important;
    position: relative; z-index: 10;
}

/* ── 不正解カード：即時グレーアウト ── */
.kimariji-card.incorrect-image {
    opacity: 0.28 !important;
    filter: grayscale(80%) !important;
    transition: opacity 0.15s ease, filter 0.15s ease !important;
    cursor: default !important;
}

/* ── 花びら粒子 ── */
@keyframes kimPetalOut {
    0%   { opacity: 1;   transform: translate(-50%,-50%) rotate(0deg) scale(1.3); }
    40%  { opacity: 1; }
    100% { opacity: 0;   transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot,120deg)) scale(0.2); }
}
.kim-sparkle {
    position: fixed; pointer-events: none; z-index: 9999;
    animation: kimPetalOut var(--dur,1.1s) ease-out forwards;
}

/* ════════════════════════════════════════
   コンボ・スコア表示
   ════════════════════════════════════════ */
#combo-display {
    text-align: center; pointer-events: none; line-height: 1.1;
    font-family: 'Noto Sans JP', sans-serif;
    margin-top: 12px;
}
#combo-count {
    font-size: 2rem; font-weight: 900; color: #B82343;
    display: block;
}
#combo-label  { font-size: 0.68rem; color: #888; display: block; letter-spacing: 0.05em; }
#combo-multiplier { font-size: 0.8rem; font-weight: bold; color: #D4AF37; display: block; }
@keyframes comboBounce {
    0%{transform:scale(1)} 40%{transform:scale(1.45)} 70%{transform:scale(0.92)} 100%{transform:scale(1)}
}
#combo-count.bounce { animation: comboBounce 0.28s ease-out; }
@keyframes titlePop {
    0%{opacity:0;transform:translateY(6px) scale(0.85)} 20%{opacity:1;transform:translateY(0) scale(1.08)}
    80%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-10px)}
}
#combo-title {
    font-size: 1.1rem; font-weight: bold; color: #fff; background: #B82343;
    border-radius: 6px; padding: 3px 10px; display: block; margin-top: 4px;
    white-space: nowrap; letter-spacing: 0.08em; font-family: 'Noto Serif JP', serif;
}
#combo-title.show { animation: titlePop 1.8s ease forwards; }

/* ── Combo Break ── */
@keyframes comboBreakFadeIn  { from{opacity:0} to{opacity:1} }
@keyframes comboBreakFadeOut { from{opacity:1} to{opacity:0} }
@keyframes comboBreakShake {
    0%,100%{transform:translateX(0)} 15%{transform:translateX(-12px)}
    35%{transform:translateX(10px)} 55%{transform:translateX(-8px)} 75%{transform:translateX(6px)}
}
@keyframes comboBreakScale {
    0%{transform:scale(0.5) rotate(-6deg);opacity:0} 30%{transform:scale(1.2) rotate(2deg);opacity:1}
    60%{transform:scale(0.95) rotate(-1deg)} 100%{transform:scale(1) rotate(0deg);opacity:1}
}
#combo-break-overlay {
    position:fixed; inset:0; z-index:9500; display:flex; flex-direction:column;
    align-items:center; justify-content:center; background:rgba(0,0,0,0.45);
    pointer-events:none; animation:comboBreakFadeIn 0.15s ease forwards;
}
#combo-break-overlay.fade-out { animation:comboBreakFadeOut 0.3s ease forwards; }
#combo-break-text {
    font-size:2.8rem; font-weight:900; color:#FF3355; letter-spacing:0.06em;
    font-family:'Noto Sans JP',sans-serif; text-align:center; white-space:pre-line;
    animation:comboBreakScale 0.4s cubic-bezier(.2,1.4,.4,1) forwards,
              comboBreakShake 0.55s ease 0.35s;
}
#combo-break-lost {
    font-size:1.1rem; color:#ffcccc; margin-top:8px;
    font-family:'Noto Serif JP',serif; opacity:0;
    animation:comboBreakFadeIn 0.3s ease 0.25s forwards;
}

/* ── スコア加算フロート ── */
@keyframes scoreFloat {
    0%{opacity:1;transform:translateY(0) scale(1)} 60%{opacity:1;transform:translateY(-28px) scale(1.1)}
    100%{opacity:0;transform:translateY(-52px) scale(0.9)}
}
.score-float {
    position:fixed; z-index:9000; font-size:1.25rem; font-weight:bold; color:#B82343;
    font-family:'Noto Sans JP',sans-serif;
    pointer-events:none; animation:scoreFloat 0.9s ease-out forwards;
}

    `;
    (document.head || document.documentElement).appendChild(s);
})();

let allSongs = [];
let colorGroups = {
    '青': [],
    'ピンク': [],
    '黄': [],
    '緑': [],
    '橙': []
};

const colorMap = {
    '青': '#007bff',
    'ピンク': '#ff69b4',
    '黄': '#ffc107',
    '緑': '#28a745',
    '橙': '#fd7e14'
};

let currentSongs = [];
let score = 0;
let totalScore = 0;          // コンボ倍率込みの合計スコア
let combo = 0;               // 現在のコンボ数
let currentQuestionIndex = 0;
let quizQuestionsLimit = 5;
let useKanaMode = true;
let isFirstAttempt = true;
let missedSongs = [];
let typewriterVersion = 0;   // インクリメントで実行中アニメーションをキャンセル
let kimarijiStats = {};      // 決まり字別 正答数・出題数 { 1:{correct,total}, 2:…, … }
let selectedColorGroup = '全歌対象';

/** コンボ数から倍率を返す */
function getComboMultiplier(c) {
    if (c >= 10) return 2.0;
    if (c >= 5) return 1.5;
    if (c >= 3) return 1.25;
    return 1.0;
}

/** コンボ数に応じた称号メッセージ（なければ null） */
function getComboTitle(c) {
    if (c === 15) return '神のごとし';
    if (c === 10) return 'いとめでたし';
    if (c === 5) return 'あはれ、みごとなり';
    if (c === 3) return 'おみごと';
    return null;
}

const correctMessages = ['天晴れ！', 'お見事！', 'めでたし！', 'いとをかし！'];
// パンくず・h1は静的HTML側（<main>先頭）に移動済み（SEO対応）。

// JSON読み込み
fetch('../js/hyakunin.json?04')
    .then(r => r.json())
    .then(data => {
        allSongs = Object.values(data);
        allSongs.forEach(song => {
            if (song.color && colorGroups[song.color]) colorGroups[song.color].push(song);
        });
        createSelectionScreen();
    })
    .catch(err => console.error('Error:', err));

// ─── 1. 選択画面 ────────────────────────────────────────────────────
function createSelectionScreen() {
    const container = document.getElementById('quiz-container');
    if (container) container.classList.remove('play');
    // コンボ HUD を除去
    const hud = document.getElementById('combo-display');
    if (hud) hud.remove();

    const contentEl = document.getElementById('quiz-content');
    contentEl.innerHTML = `
        <ul id="karuta_ul" style="margin-bottom:1em">
            <li>お題の上の句に対応する下の句を選ぶゲームです。</li>
            <li>五色百人一首の各色20首ずつに絞って練習できます。</li>
            <li>決まり字モードでは、札がひらがなになり、決まり字が強調されます。</li>
        </ul>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:1.2em;">
            <div style="display:flex; align-items:flex-start; gap:10px; background:#fdf8e8; border:1.5px solid #D4AF37; border-radius:8px; padding:10px 14px;">
                <span style="font-size:1.5rem; line-height:1; flex-shrink:0;">🔥</span>
                <div>
                    <strong style="font-size:0.9rem; color:#B82343;">連続正解ボーナス</strong>
                    <p style="margin:3px 0 0; font-size:0.82rem; color:#555; line-height:1.7;">
                        正解を続けると得点の倍率がアップ！<br>
                        3連続 → <strong>1問125点</strong>・5連続 → <strong>1問150点</strong>・10連続 → <strong>1問200点</strong><br>
                        ミスすると連続記録はリセットされます。
                    </p>
                </div>
            </div>
            <div style="display:flex; align-items:flex-start; gap:10px; background:#fdf8e8; border:1.5px solid #c8a84b; border-radius:8px; padding:10px 14px;">
                <span style="font-size:1.5rem; line-height:1; flex-shrink:0;">🧠</span>
                <div>
                    <strong style="font-size:0.9rem; color:#B82343;">間違えた札の復習</strong>
                    <p style="margin:3px 0 0; font-size:0.82rem; color:#555; line-height:1.7;">
                        ゲーム終了後、間違えた札を一覧で確認できます。<br>
                        タップで裏返すと和歌全体を見ることができます。
                    </p>
                </div>
            </div>
            
        </div>
        <div class="quiz-controls-wrapper">
            <div class="quiz-controls">
                <p>①札の色を選んでください。</p>
                <select id="quiz-type-select">
                    <option value="青">青</option>
                    <option value="ピンク">ピンク</option>
                    <option value="黄">黄</option>
                    <option value="緑">緑</option>
                    <option value="橙">橙</option>
                    <option value="全歌対象" selected>すべての歌を対象</option>
                </select>
            </div>
            <div class="quiz-controls">
                <p>②出題数を選んでください。</p>
                <select id="quiz-limit-select">
                    <option value="5">5問</option>
                    <option value="10" selected>10問</option>
                    <option value="20">20問</option>
                </select>
            </div>
            <div class="quiz-controls">
                <p>③モード設定</p>
                <div style="display:flex; justify-content:center; align-items:center; gap:10px;">
                    <span>通常</span>
                    <input type="checkbox" id="toggle2" ${useKanaMode ? 'checked' : ''}>
                    <span>決まり字</span>
                </div>
            </div>
        </div>
        <div id="start-button"></div>
        <hr style=" border-top: 1px solid #e0e0e0;">
        <h4>ランキング</h4>
        <ul class="em-usage-list">
            <li>Googleアカウントでログインしてゲームを完了すると、スコアが累積ランキングにリアルタイムで反映されます。</li>
            <li>ログインすると、Googleアカウントの表示名・メールアドレス・プロフィール画像URLの情報を取得します。これらの情報はランキング表示のためにのみ使用し、法令に基づく場合を除き、第三者に提供することはありません。詳しくは<a href="policy.html">プライバシーポリシー</a>をご参照ください。</li>
            <li>ログインすると、「ログアウト」ボタンの横に「データ削除」ボタンが表示されます。「データ削除」ボタンを押すと、ランキングに登録されたデータを削除できます。ただし、削除すると元に戻せないのでご注意ください。</li>
            <li>ログインしなくてもゲームは楽しめます。ただし、その場合はスコアがランキングに記録されません。</li>
            <li>累積スコアに応じて称号バッジが表示されます。下記の「🎖 称号一覧」をクリックすると詳細をご覧いただけます。</li>
        </ul>
        <div id="karuta-auth-area"></div>
        <div id="karuta-leaderboard"></div>
        <details class="title-accordion" open>
                <summary>🎖 称号一覧</summary>
                <table class="title-table">
                    <thead><tr><th>累積スコア</th><th>称号</th><th>説明</th></tr></thead>
                    <tbody>
                        <tr><td>500〜</td><td>文章生</td><td>大学寮の学生。</td></tr>
                        <tr><td>2,000〜</td><td>文章得業生</td><td>優秀な学生。</td></tr>
                        <tr><td>5,000〜</td><td>少内記</td><td>詔書を扱う官僚。</td></tr>
                        <tr><td>10,000〜</td><td>文章博士</td><td>大学寮の教授。</td></tr>
                        <tr><td>20,000〜</td><td>蔵人頭</td><td>天皇の秘書。</td></tr>
                        <tr><td>40,000〜</td><td>左中弁</td><td>エリート官僚。</td></tr>
                        <tr><td>70,000〜</td><td>参議</td><td>公卿の仲間入り。</td></tr>
                        <tr><td>120,000〜</td><td>中納言</td><td>朝廷の幹部。</td></tr>
                        <tr><td>200,000〜</td><td>大納言</td><td>朝廷の重鎮。</td></tr>
                        <tr><td>300,000〜</td><td>右大臣</td><td>朝廷の最高幹部。</td></tr>
                        <tr><td>400,000〜</td><td>大宰権帥</td><td>左遷。</td></tr>
                        <tr><td>500,000〜</td><td>怨霊</td><td>清涼殿に雷。</td></tr>
                        <tr><td>700,000〜</td><td>左大臣</td><td>死後に贈られる。</td></tr>
                        <tr><td>1,000,000〜</td><td>太政大臣</td><td>死後に贈られる。</td></tr>
                        <tr><td>1,500,000〜</td><td>天神様</td><td>学問の神様。</td></tr>
                    </tbody>
                </table>
                <p class="title-note">※ きまり字ゲームの累積スコアで集計されます。</p>
                <p class="title-note">※ 称号は菅原道真をモデルに構成しています。</p>
            </details>`;

    document.getElementById('start-button').addEventListener('click', () => {
        useKanaMode = document.getElementById('toggle2').checked;
        quizQuestionsLimit = parseInt(document.getElementById('quiz-limit-select').value, 10);
        startQuiz(document.getElementById('quiz-type-select').value);
    });
    if (window.KarutaAuth) {
        window.KarutaAuth.renderAuthArea('karuta-auth-area', 'ja');
        window.KarutaAuth.renderLeaderboard('karuta-leaderboard', 'ja');
    }
}

// ─── 2. クイズ開始 ──────────────────────────────────────────────────
function startQuiz(quizType) {
    let source = (quizType === '全歌対象') ? [...allSongs] : colorGroups[quizType];
    if (!source || source.length === 0) return alert('歌が見つかりません');
    selectedColorGroup = quizType;
    currentSongs = shuffleArray([...source]).slice(0, quizQuestionsLimit);
    score = 0;
    totalScore = 0;
    combo = 0;
    currentQuestionIndex = 0;
    missedSongs = [];
    kimarijiStats = {};

    const container = document.getElementById('quiz-container');
    if (container) container.classList.add('play');

    displayNextQuestion(quizType);
}

// ─── 3. 問題表示 ────────────────────────────────────────────────────
function displayNextQuestion(selectedColor) {
    // 実行中のタイプライターをキャンセル
    typewriterVersion++;
    const myVersion = typewriterVersion;

    if (currentQuestionIndex >= currentSongs.length) {
        showResults();
        return;
    }

    isFirstAttempt = true;
    const currentSong = currentSongs[currentQuestionIndex];

    // 選択肢準備（songオブジェクトごと管理して表示・判定を確実に）
    let allOtherSongs = allSongs.filter(s => s.number !== currentSong.number);
    shuffleArray(allOtherSongs);
    const incorrectSongs = allOtherSongs.slice(0, 2);
    const shuffledChoiceSongs = shuffleArray([currentSong, ...incorrectSongs]);

    // 上の句テキスト生成（通常モード・決まり字モード共にyomihudaを使用）
    let kami_no_ku_text;
    if (currentSong.yomihuda) {
        kami_no_ku_text = currentSong.yomihuda.split('<br>').slice(0, 3).join('<br>');
    } else {
        kami_no_ku_text = currentSong.first;
    }

    // 決まり字ハイライト（決まり字モードのみ）
    if (useKanaMode && currentSong.kimariji) {
        let remaining = currentSong.kimariji.length;
        kami_no_ku_text = kami_no_ku_text.split('<br>').map(seg => {
            if (remaining <= 0) return seg;
            if (remaining >= seg.length) { remaining -= seg.length; return "<span class='letter-red'>" + seg + "</span>"; }
            const red = seg.slice(0, remaining); remaining = 0;
            return "<span class='letter-red'>" + red + "</span>" + seg.slice(red.length);
        }).join('<br>');
    }

    // HTML描画（上の句は空で開始）
    const contentEl = document.getElementById('quiz-content');
    contentEl.innerHTML = `
        <h2 class="question-number">問題 ${currentQuestionIndex + 1} / ${currentSongs.length}</h2>
        <div class="question-card vertical-text typewriter-card" id="question-card-el">
            <p id="kami-text-el"></p>
            <div class="card-id">${currentSong.number}</div>
            <span class="skip-hint">タップでスキップ</span>
        </div>
        <div id="choices-container"></div>
        <div id="combo-display">
            <span id="combo-count"></span>
            <span id="combo-label"></span>
            <span id="combo-multiplier"></span>
            <span id="combo-title"></span>
        </div>
        <div id="message-container"></div>`;

    updateComboHUD();

    // 選択肢ボタン（アニメーション中も回答可能）
    const choicesContainer = document.getElementById('choices-container');
    const borderColor = colorMap[selectedColor] || '#333';
    shuffledChoiceSongs.forEach(choiceSong => {
        const button = document.createElement('button');
        button.classList.add('kimariji-card');
        button.style.borderColor = borderColor;
        button.disabled = false;
        const display = choiceSong.torihuda;
        button.innerHTML = `<p>${display}</p>`;
        button.addEventListener('click', (e) => handleAnswer(button, display, currentSong, selectedColor, e));
        choicesContainer.appendChild(button);
    });

    // アニメーション完了コールバック（選択肢はすでに有効なのでスキップヒントを消すだけ）
    function enableChoices() {
        const hint = document.querySelector('.skip-hint');
        if (hint) hint.style.opacity = '0';
    }

    // タイプライター開始（先に実行してskipAllを取得）
    const units = splitIntoVisualChars(kami_no_ku_text);
    const skipAll = typewriterAnimate(myVersion, units, document.getElementById('kami-text-el'), 250, enableChoices);

    // カードをタップでスキップ
    document.getElementById('question-card-el').addEventListener('click', function skipHandler() {
        if (typewriterVersion !== myVersion) return;
        typewriterVersion++;   // アニメーションをキャンセル
        skipAll();             // 非表示の文字を全部即座に表示
        enableChoices();
    });
}

// ─── 花びら粒子エフェクト（和風） ────────────────────────────────
function spawnSparkles(button, event) {
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // ── 花びら 3ウェーブ（計45枚） ──
    const colors = ['#FFB7C5', '#FADADD', '#F4A7B9', '#FF8FAB', '#FFD6E0', '#FFCCD5', '#F8A0B0', '#FFFFFF', '#FFF0F5', '#FFF5F7'];
    const shapes = [
        '50% 50% 50% 0  / 80% 80% 20% 20%',
        '50% 50% 0  50% / 80% 80% 20% 20%',
        '50%',
        '40% 60% 60% 40% / 40% 40% 60% 60%'
    ];
    const waves = [
        { count: 14, distMin: 35, distMax: 70, baseDelay: 0 },
        { count: 18, distMin: 60, distMax: 110, baseDelay: 30 },
        { count: 13, distMin: 90, distMax: 150, baseDelay: 60 }
    ];

    waves.forEach(({ count, distMin, distMax, baseDelay }) => {
        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'kim-sparkle';
            const angle = (360 / count) * i + (Math.random() * 28 - 14);
            const dist = distMin + Math.random() * (distMax - distMin);
            const rad = angle * Math.PI / 180;
            const delay = baseDelay + Math.random() * 35;
            const w = 9 + Math.random() * 8;
            const h = w * (1.5 + Math.random() * 0.8);
            const gravity = 25 + Math.random() * 40;
            const tx = (Math.cos(rad) * dist).toFixed(1);
            const ty = (Math.sin(rad) * dist + gravity).toFixed(1);
            const rot = (Math.random() * 540 - 270).toFixed(0) + 'deg';
            const dur = (0.5 + Math.random() * 0.3).toFixed(2) + 's';

            el.style.cssText = [
                `left:${cx}px`, `top:${cy}px`,
                `width:${w.toFixed(1)}px`, `height:${h.toFixed(1)}px`,
                `background:${colors[Math.floor(Math.random() * colors.length)]}`,
                `border-radius:${shapes[i % shapes.length]}`,
                `--tx:${tx}px`, `--ty:${ty}px`,
                `--rot:${rot}`, `--dur:${dur}`,
                `animation-delay:${delay.toFixed(0)}ms`
            ].join(';');

            document.documentElement.appendChild(el);
            setTimeout(() => el.remove(), 850 + delay);
        }
    });
}

// ─── 4. 回答判定 ────────────────────────────────────────────────────
function handleAnswer(button, selectedChoice, currentSong, selectedColor, event) {
    const messageContainer = document.getElementById('message-container');

    if (selectedChoice === currentSong.torihuda) {
        if (isFirstAttempt) {
            score++;
            combo++;

            // コンボ倍率でスコア加算
            const mult = getComboMultiplier(combo);
            const gained = Math.round(100 * mult);
            totalScore += gained;

            // 決まり字の長さを記録（正解）
            const kLen = currentSong.kimariji ? currentSong.kimariji.length : 0;
            if (!kimarijiStats[kLen]) kimarijiStats[kLen] = { correct: 0, total: 0 };
            kimarijiStats[kLen].correct++;
            kimarijiStats[kLen].total++;

            // コンボ HUD 更新 & バウンス
            updateComboHUD(true);

            // スコア加算フロート
            spawnScoreFloat(button, gained, mult);

            // 称号メッセージ
            const title = getComboTitle(combo);
            if (title) showComboTitle(title);
        }

        document.querySelectorAll('.kimariji-card').forEach(btn => btn.disabled = true);
        button.classList.add('correct-image');
        spawnSparkles(button, event);
        messageContainer.innerHTML = `<span class="correct-message">+${Math.round(100 * getComboMultiplier(combo))} pts</span>`;
        setTimeout(() => { currentQuestionIndex++; displayNextQuestion(selectedColor); }, 650);

    } else {
        if (isFirstAttempt) {
            // 決まり字の長さを記録（不正解）
            const kLen = currentSong.kimariji ? currentSong.kimariji.length : 0;
            if (!kimarijiStats[kLen]) kimarijiStats[kLen] = { correct: 0, total: 0 };
            kimarijiStats[kLen].total++;
            const consoleParts = (currentSong.forConsole || '').split('\n');
            missedSongs.push({
                torihuda: currentSong.torihuda,
                uta: consoleParts[0] || '',
                author: consoleParts[1] || '',
                number: currentSong.number,
                kimariji: currentSong.kimariji || ''
            });

            // コンボが1以上だったら崩壊エフェクト
            if (combo >= 1) showComboBreak(combo);
            combo = 0;
            updateComboHUD();
        }
        isFirstAttempt = false;
        button.classList.add('incorrect-image');
        button.disabled = true;
        messageContainer.innerHTML = `<span class="incorrect-message">違います。もう一度選んでください！</span>`;
    }
}

// ─── コンボ HUD 更新 ────────────────────────────────────────────────
function updateComboHUD(bounce = false) {
    const countEl = document.getElementById('combo-count');
    const labelEl = document.getElementById('combo-label');
    const multEl = document.getElementById('combo-multiplier');
    if (!countEl) return;

    if (combo <= 0) {
        countEl.textContent = '';
        if (labelEl) labelEl.textContent = '';
        if (multEl) multEl.textContent = '';
        return;
    }

    const mult = getComboMultiplier(combo);
    countEl.textContent = combo + ' 連続正解';
    if (labelEl) labelEl.textContent = `Score: ${totalScore}`;
    if (multEl) multEl.textContent = mult > 1.0 ? `×${mult.toFixed(2)}` : '';

    if (bounce) {
        countEl.classList.remove('bounce');
        void countEl.offsetWidth; // reflow
        countEl.classList.add('bounce');
    }
}

// ─── 称号テキスト表示 ────────────────────────────────────────────────
function showComboTitle(text) {
    const el = document.getElementById('combo-title');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
}

// ─── Combo Break エフェクト ──────────────────────────────────────────
function showComboBreak(lostCombo) {
    // 既存を除去
    const old = document.getElementById('combo-break-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'combo-break-overlay';
    overlay.innerHTML = `
        <div id="combo-break-text">連続正解<br>途絶えたり…</div>
        <div id="combo-break-lost">${lostCombo}連続、消えました</div>`;
    document.body.appendChild(overlay);

    // 0.75秒後にフェードアウト → 削除
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 350);
    }, 650);
}

// ─── スコアフロート ──────────────────────────────────────────────────
function spawnScoreFloat(button, pts, mult) {
    const rect = button.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'score-float';
    el.textContent = mult > 1.0 ? `+${pts} ×${mult.toFixed(2)}` : `+${pts}`;
    el.style.left = (rect.left + rect.width / 2 - 40) + 'px';
    el.style.top = (rect.top - 10) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 950);
}



// ─── 5. 結果表示 ────────────────────────────────────────────────────
function showResults() {
    // コンボ HUD を除去
    const hud = document.getElementById('combo-display');
    if (hud) hud.remove();

    const scoreRatio = score / currentSongs.length;
    let comment = "ぜひまた挑戦してくださいね♪";
    if (scoreRatio === 1) { comment = "全問正解おめでとうございます！"; showConfettiBlast(); }
    else if (scoreRatio >= 0.8) { comment = "すごい！あと一歩で満点ですよ！"; }

    const missedSection = missedSongs.length > 0 ? `
        <div id="missed_cards_section" style="margin-top:24px; text-align:left;">
            <p class="missed-cards-heading">❌ 間違えた札</p>
            <div id="missed_cards_list"></div>
            <p class="missed-card-hint">タップで裏返すと和歌全体を確認できます</p>
        </div>` : '';

    let maxScore = 0;
    for (let i = 1; i <= currentSongs.length; i++) {
        maxScore += Math.round(100 * getComboMultiplier(i));
    }

    const contentEl = document.getElementById('quiz-content');
    contentEl.innerHTML = `
        <div style="text-align: center;">
            <h2>ゲームをクリアしました！</h2>
            <p style="font-size: 1.4rem; margin-bottom: 8px;">
                正解数: <strong>${score} / ${currentSongs.length}</strong><br>
                <small style="font-size:1rem; color:#666;">※一発で正解した数を表示しています。</small>
            </p>
            <div style="margin:16px auto 20px; padding:14px 24px;
                        background:linear-gradient(135deg,#fdf8e8,#f5ead0);
                        border:2px solid #D4AF37; border-radius:12px;
                        display:inline-block; min-width:220px;">
                <div style="font-size:0.8rem; color:#888; letter-spacing:0.08em; margin-bottom:4px;">TOTAL SCORE</div>
                <div style="font-size:2.6rem; font-weight:900; color:#B82343;
                            font-family:'Noto Sans JP',sans-serif; line-height:1;">
                    ${totalScore.toLocaleString()}
                </div>
                <div style="font-size:0.75rem; color:#aaa; margin-top:4px;">
                    満点: ${maxScore.toLocaleString()} pts
                </div>
            </div>
            <p>${comment}</p>
            ${buildKimarijiChartHTML()}
            ${missedSection}
            <div id="karuta-save-result"></div>
            <button onclick="createSelectionScreen()"
                style="margin-top:24px; padding:10px 28px; background:#B82343; color:white;
                       border:none; border-radius:8px; cursor:pointer; font-size:1rem;">
                もう一度チャレンジ
            </button>
        </div>`;

    if (missedSongs.length > 0) showMissedCards(missedSongs);
    if (window.KarutaAuth) {
        window.KarutaAuth.renderSaveResult('karuta-save-result', {
            totalScore,
            correctAnswers: score,
            totalQuestions: currentSongs.length,
            color: selectedColorGroup,
            lang: 'ja'
        });

    }
}

// ─── 6. 決まり字別パイチャート ──────────────────────────────────────

/**
 * 1つのドーナツチャート SVG を返す
 * @param {string} label   - "1文字決まり" など
 * @param {number} correct - 正解数
 * @param {number} total   - 出題数
 */
function buildDonutSVG(label, correct, total, delayMs) {
    const SIZE = 90, CX = 45, CY = 45, R = 30, SW = 10;
    const circ = 2 * Math.PI * R;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    const filled = circ * (correct / total);
    const empty = circ - filled;

    const color = pct >= 80 ? '#2E9E5B'
        : pct >= 50 ? '#F0A500'
            : '#B82343';

    const dur = '0.7s';
    const begin = (delayMs / 1000).toFixed(2) + 's';

    // 弧：0 → filled のアニメーション付き
    let arcSVG = '';
    if (correct > 0) {
        if (filled >= circ) {
            // 100%：フル円をアニメーション
            arcSVG = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${color}" stroke-width="${SW}"
                transform="rotate(-90 ${CX} ${CY})">
                <animate attributeName="stroke-dasharray"
                    from="0 ${circ.toFixed(2)}"
                    to="${circ.toFixed(2)} 0"
                    dur="${dur}" begin="${begin}" fill="freeze" calcMode="spline"
                    keySplines="0.4 0 0.2 1" keyTimes="0;1"/>
            </circle>`;
        } else {
            arcSVG = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${color}" stroke-width="${SW}"
                transform="rotate(-90 ${CX} ${CY})">
                <animate attributeName="stroke-dasharray"
                    from="0 ${circ.toFixed(2)}"
                    to="${filled.toFixed(2)} ${empty.toFixed(2)}"
                    dur="${dur}" begin="${begin}" fill="freeze" calcMode="spline"
                    keySplines="0.4 0 0.2 1" keyTimes="0;1"/>
            </circle>`;
        }
    }

    // 中央テキストのフェードイン（弧アニメーション終了後）
    const textDelay = ((delayMs + 600) / 1000).toFixed(2) + 's';

    return `
    <div style="text-align:center; width:90px; flex-shrink:0;
                opacity:0; animation: kimDonutFadeIn 0.4s ease ${begin} forwards;">
        <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" aria-label="${label} 正答率${pct}%">
            <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#e0d9cc" stroke-width="${SW}"/>
            ${arcSVG}
            <text x="${CX}" y="${CY - 4}" text-anchor="middle"
                  font-size="15" font-weight="bold" fill="${color}"
                  font-family="'Noto Sans JP', sans-serif"
                  opacity="0">
                ${pct}%
                <animate attributeName="opacity" from="0" to="1"
                    dur="0.3s" begin="${textDelay}" fill="freeze"/>
            </text>
            <text x="${CX}" y="${CY + 11}" text-anchor="middle"
                  font-size="9" fill="#888"
                  font-family="'Noto Sans JP', sans-serif"
                  opacity="0">
                ${correct}/${total}
                <animate attributeName="opacity" from="0" to="1"
                    dur="0.3s" begin="${textDelay}" fill="freeze"/>
            </text>
        </svg>
        <div style="font-size:11px; color:#555; line-height:1.4; margin-top:2px;">${label}</div>
    </div>`;
}

/**
 * 決まり字別チャートセクション全体の HTML を返す
 */
function buildKimarijiChartHTML() {
    const entries = Object.entries(kimarijiStats)
        .filter(([, v]) => v.total > 0)
        .sort(([a], [b]) => Number(a) - Number(b));

    if (entries.length === 0) return '';

    // チャートごとに 120ms ずつずらして順番に表示
    const donuts = entries.map(([len, { correct, total }], i) =>
        buildDonutSVG(len + '文字決まり', correct, total, 200 + i * 120)
    ).join('');

    return `
    <style>
        @keyframes kimDonutFadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0);   }
        }
    </style>
    <div style="margin: 20px auto 8px; max-width: 600px; text-align: center;">
        <p style="font-size:0.85rem; font-weight:bold; color:#666; margin-bottom:10px; text-align:center;">
            ── 決まり字別 正答率 ──
        </p>
        <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;
                    background:#f7f2e8; border-radius:10px; padding:14px;">
            ${donuts}
        </div>
    </div>`;
}

// ─── タイプライター ──────────────────────────────────────────────────


function splitIntoVisualChars(html) {
    const units = [];
    let i = 0;
    while (i < html.length) {
        // <ruby>～</ruby> を1単位
        if (html.startsWith('<ruby', i)) {
            const end = html.indexOf('</ruby>', i);
            if (end !== -1) { units.push({ html: html.slice(i, end + 7), pause: false }); i = end + 7; continue; }
        }
        // <br> は改行ポーズ
        if (html.startsWith('<br>', i)) {
            units.push({ html: '<br>', pause: true }); i += 4; continue;
        }
        // <span …>X</span> → X を1文字ずつ spanで包む
        if (html.startsWith('<span', i)) {
            const openEnd = html.indexOf('>', i);
            const closeIdx = html.indexOf('</span>', i);
            if (openEnd !== -1 && closeIdx !== -1) {
                const spanTag = html.slice(i, openEnd + 1);
                const content = html.slice(openEnd + 1, closeIdx);
                for (const ch of content) units.push({ html: spanTag + ch + '</span>', pause: false });
                i = closeIdx + 7; continue;
            }
        }
        // その他タグ → 即時（ポーズなし）
        if (html[i] === '<') {
            const end = html.indexOf('>', i);
            if (end !== -1) { units.push({ html: html.slice(i, end + 1), pause: false, instant: true }); i = end + 1; continue; }
        }
        // 通常文字
        units.push({ html: html[i], pause: false }); i++;
    }
    return units;
}

/**
 * タイプライターアニメーション
 * @param {number}   version   - キャンセル判定用バージョン
 * @param {Array}    units     - splitIntoVisualChars の結果
 * @param {Element}  el        - 表示先要素
 * @param {number}   msPerChar - 1文字あたり ms（改行は×3）
 * @param {Function} onComplete
 */
function typewriterAnimate(version, units, el, msPerChar, onComplete) {
    let idx = 0;
    let waitUntil = 0;
    const revealQueue = [];   // { node: HTMLElement|null, pause: bool }

    // HTML文字列 → DOMノード
    function unitToNode(unit) {
        if (unit.html === '<br>') return document.createElement('br');
        if (!unit.html.startsWith('<')) return document.createTextNode(unit.html);
        const tmp = document.createElement('span');
        tmp.innerHTML = unit.html;
        if (tmp.childNodes.length === 1) return tmp.firstChild;
        const frag = document.createDocumentFragment();
        while (tmp.firstChild) frag.appendChild(tmp.firstChild);
        return frag;
    }

    // 全ノードを先にDOMへ配置（文字は非表示）→レイアウトが最初から確定してずれない
    units.forEach(unit => {
        if (unit.instant) { el.appendChild(unitToNode(unit)); return; }
        if (unit.html === '<br>') {
            el.appendChild(document.createElement('br'));
            revealQueue.push({ node: null, pause: true });
            return;
        }
        const wrapper = document.createElement('span');
        wrapper.style.visibility = 'hidden';
        wrapper.appendChild(unitToNode(unit));
        el.appendChild(wrapper);
        revealQueue.push({ node: wrapper, pause: unit.pause });
    });

    // 残りを全部即表示（スキップ時に呼ぶ）
    function revealAll() {
        for (let i = idx; i < revealQueue.length; i++) {
            if (revealQueue[i].node) revealQueue[i].node.style.visibility = '';
        }
        idx = revealQueue.length;
    }

    function next(timestamp) {
        if (typewriterVersion !== version) return;   // キャンセル済み

        if (idx >= revealQueue.length) { if (onComplete) onComplete(); return; }

        if (timestamp < waitUntil) { requestAnimationFrame(next); return; }

        const item = revealQueue[idx++];
        if (item.node) item.node.style.visibility = '';   // 1文字だけ表示に切り替え
        waitUntil = timestamp + (item.pause ? msPerChar * 3 : msPerChar);
        requestAnimationFrame(next);
    }

    requestAnimationFrame(next);
    return revealAll;   // スキップ用に返す
}

// ─── 演出・ユーティリティ ────────────────────────────────────────────
function showConfettiBlast() {
    if (typeof confetti === 'undefined') return;
    const end = Date.now() + 2000;
    const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        confetti({ particleCount: 40, startVelocity: 25, spread: 360, origin: { x: Math.random(), y: Math.random() - 0.2 }, zIndex: 1000 });
    }, 250);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* ─── 間違えた札フリップカード ─────────────────────────────────────── */

function fitTextToFace(textEl, faceEl, startPx, minPx) {
    let size = startPx;
    textEl.style.fontSize = size + 'px';
    requestAnimationFrame(function () {
        while (size > minPx && (textEl.scrollHeight > faceEl.clientHeight - 10 || textEl.scrollWidth > faceEl.clientWidth - 10)) {
            size -= 0.5;
            textEl.style.fontSize = size + 'px';
        }
    });
}

function showMissedCards(songs) {
    const section = document.getElementById('missed_cards_section');
    const list = document.getElementById('missed_cards_list');
    if (!section || !list || !songs || songs.length === 0) return;

    list.innerHTML = '';
    songs.forEach(function (song) {
        const utaText = song.uta ? song.uta.trim().replace(/ /g, '\n') : '';
        const numText = song.number ? String(song.number) : '';

        const wrapper = document.createElement('div');
        wrapper.className = 'missed-card-wrapper';
        const inner = document.createElement('div');
        inner.className = 'missed-card-inner';

        const front = document.createElement('div'); front.className = 'missed-card-front';
        const frontP = document.createElement('p'); frontP.innerHTML = song.torihuda || '';
        const frontNum = document.createElement('span'); frontNum.className = 'missed-card-number'; frontNum.textContent = numText;
        // 決まり字バッジ
        if (song.kimariji) {
            const badge = document.createElement('span');
            badge.textContent = song.kimariji;
            badge.style.cssText = [
                'position:absolute', 'top:4px', 'right:4px',
                'font-size:10px', 'font-weight:bold',
                'color:#fff', 'background:#B82343',
                'border-radius:3px', 'padding:1px 4px',
                'writing-mode:horizontal-tb',
                "font-family:'Noto Sans JP',sans-serif",
                'line-height:1.4', 'pointer-events:none'
            ].join(';');
            front.appendChild(badge);
        }
        front.appendChild(frontP); front.appendChild(frontNum);

        const back = document.createElement('div'); back.className = 'missed-card-back';
        const backSpan = document.createElement('span'); backSpan.className = 'missed-card-back__uta'; backSpan.textContent = utaText;
        const backNum = document.createElement('span'); backNum.className = 'missed-card-number'; backNum.textContent = numText;
        back.appendChild(backSpan); back.appendChild(backNum);

        inner.appendChild(front); inner.appendChild(back); wrapper.appendChild(inner);

        wrapper.addEventListener('click', function () { wrapper.classList.toggle('flipped'); });
        wrapper.addEventListener('touchstart', function (e) { e.preventDefault(); wrapper.classList.toggle('flipped'); }, { passive: false });
        list.appendChild(wrapper);
    });

    section.style.display = 'block';
    requestAnimationFrame(function () {
        list.querySelectorAll('.missed-card-wrapper').forEach(function (w) {
            fitTextToFace(w.querySelector('.missed-card-front p'), w.querySelector('.missed-card-front'), 28, 6);
            fitTextToFace(w.querySelector('.missed-card-back__uta'), w.querySelector('.missed-card-back'), 22, 6);
        });
    });
}