// 百人一首 ビンゴゲーム

let allSongs = [];
let colorGroups = { '青': [], 'ピンク': [], '黄': [], '緑': [], '橙': [] };
const colorMap = { '青': '#007bff', 'ピンク': '#ff69b4', '黄': '#ffc107', '緑': '#28a745', '橙': '#fd7e14' };

let bingoGrid = [];
let matchedIndices = new Set();
let targetSong = null;
let isProcessing = false;
let startTime;
let missCount = 0; // ミス回数を保持する

const BINGO_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
    [0, 4, 8], [2, 4, 6]             // 斜め
];

function stripRuby(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    div.querySelectorAll('rt').forEach(rt => rt.remove());
    div.querySelectorAll('ruby').forEach(ruby => { ruby.replaceWith(...ruby.childNodes); });
    return div.innerHTML;
}

fetch('../js/kimariji.json?20260630')
    .then(res => res.json())
    .then(data => {
        allSongs = data;
        allSongs.forEach(s => { if (s.color && colorGroups[s.color]) colorGroups[s.color].push(s); });
        createSelectionScreen();
    });

function createSelectionScreen() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
    
    <main class="main_about-main">
    
        <div class="section">
        <nav>
        <ol class="breadcrumb">
            <li><a href="index.html">トップ</a></li>
            <li><a href="introduction-app.html">アプリ</a></li>
            <li>百人一首 ビンゴゲーム</li>
        </ol>
    </nav>
    <hr>
            <div class="title"><h2>百人一首 ビンゴゲーム</h2></div>
            <ul id="karuta_ul">
                <li>縦・横・斜めのいずれか1列揃えればクリアです。</li>
                <li>クリアするまでにかかった時間が表示されます。</li>
                <li>お手つきのたびに5秒のペナルティが加算されます。</li>
            </ul>
            <div class="quiz-controls" style="text-align:center;">
                <select id="quiz-type-select">
                    <option value="全歌対象">すべての歌</option>
                    <option value="青">青色</option><option value="ピンク">ピンク</option>
                    <option value="黄">黄色</option><option value="緑">緑色</option><option value="橙">橙</option>
                </select>
                <div id="start-button"></div>
            </div>
        </div>
    </main>`;
    document.getElementById('start-button').onclick = () => startBingo(document.getElementById('quiz-type-select').value);
}

function startBingo(quizType) {
    let source = (quizType === '全歌対象') ? [...allSongs] : colorGroups[quizType];
    if (source.length < 9) return alert('札が足りません');
    
    // --- 初期化処理 ---
    startTime = Date.now();
    missCount = 0;
    matchedIndices.clear();
    isProcessing = false; // ここで必ずfalseに戻す
    // ----------------------------

    bingoGrid = shuffleArray([...source]).slice(0, 9);
    renderBoard(quizType);
    nextQuestion();
}

function renderBoard(quizType) {
    const container = document.getElementById('quiz-container');
    const borderColor = colorMap[quizType] || '#333';

    container.innerHTML = `
        <div class="section">
            <div class="question-box-compact" style="border-color:${borderColor};">
                <p style="font-size:0.8rem; color:#888; margin-bottom:5px;">この上の句を探してね</p>
                <h3 id="current-kami" style="font-size:1.25rem; line-height:1.5;"></h3>
            </div>
            <div id="grid-container">
                </div>
        </div>`;

    const grid = document.getElementById('grid-container');
    bingoGrid.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'kimariji-card bingo-card';
        card.style.borderColor = borderColor;
        card.id = `card-${index}`;
        card.innerHTML = `<p>${stripRuby(song.shimo_no_ku_kana)}</p>`;
        card.onclick = () => handleTap(index);
        grid.appendChild(card);
    });
}

function nextQuestion() {
    const remain = bingoGrid.map((s, i) => i).filter(i => !matchedIndices.has(i));
    if (remain.length === 0) return;

    const nextIdx = remain[Math.floor(Math.random() * remain.length)];
    targetSong = bingoGrid[nextIdx];

    let displayText = targetSong.kami_no_ku;
    if (window.innerWidth >= 375) {
        displayText = displayText.replace(/<br\s*\/?>/gi, ' ');
    }

    document.getElementById('current-kami').innerHTML = displayText;
}

function handleTap(idx) {
    if (isProcessing || matchedIndices.has(idx)) return;
    const card = document.getElementById(`card-${idx}`);

    if (bingoGrid[idx].id === targetSong.id) {
        isProcessing = true;
        card.classList.add('correct-image', 'matched');
        card.style.backgroundColor = '#e3f9e5';
        matchedIndices.add(idx);

        if (checkBingo()) {
            setTimeout(showResults, 500);
        } else {
            setTimeout(() => { isProcessing = false; nextQuestion(); }, 400);
        }
    } else {
        isProcessing = true;
        missCount++; // 不正解の時にカウントアップ
        card.classList.add('incorrect-image');
        setTimeout(() => { card.classList.remove('incorrect-image'); isProcessing = false; }, 500);
    }
}

function checkBingo() {
    return BINGO_LINES.some(line => line.every(idx => matchedIndices.has(idx)));
}

let resultTimer; // タイマー管理用の変数をグローバル（外側）で定義

function showResults() {
    const rawTime = Math.floor((Date.now() - startTime) / 1000);
    const penaltyTime = missCount * 5;
    const finalTime = rawTime + penaltyTime;

    const container = document.getElementById('quiz-container');
    showConfettiBlast();

    container.innerHTML = `
        <div class="section" style="text-align:center;">
            <h2 style='text-align:center;'>ゲームクリア！</h2>
            <p style="text-align:center;">クリアタイム: <strong>${finalTime}秒</strong></p>
            <p style="font-size: 0.8rem; color: #666; text-align:center;">(かかった時間:${rawTime}秒 + お手付きのペナルティ:${penaltyTime}秒)</p>
            <button id='replay-button' style="margin: 20px auto; cursor: pointer; border:none;"></button>
            <p style="font-size: 0.8rem; color: #666; text-align:center;">5秒後に最初の画面に戻ります</p>
        </div>`;

    const replayBtn = document.getElementById('replay-button');
    if (replayBtn) {
        replayBtn.onclick = function () {
            clearTimeout(resultTimer); // 自動遷移をキャンセル
            createSelectionScreen();
        };
    }

    if (typeof confetti !== 'undefined') showConfettiBlast();

    // タイマーを変数に格納
    resultTimer = setTimeout(createSelectionScreen, 5000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showConfettiBlast() {
    if (typeof confetti === 'undefined') return;

    const duration = 2 * 1000; // 2秒間
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 40;
        // 画面のランダムな位置（x軸0〜1, y軸は少し上から）から放出
        confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
    }, 250);
}