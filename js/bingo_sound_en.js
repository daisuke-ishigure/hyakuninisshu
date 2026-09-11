/**
 * Hyakunin Isshu Bingo Game (English)
 */

let allSongs = [];
let colorGroups = { '青': [], 'ピンク': [], '黄': [], '緑': [], '橙': [] };
const colorMap = { '青': '#007bff', 'ピンク': '#ff69b4', '黄': '#ffc107', '緑': '#28a745', '橙': '#fd7e14' };

let bingoGrid = [];
let matchedIndices = new Set();
let targetSong = null;
let isProcessing = false;
let startTime;
let missCount = 0;
let currentAudio = null; // 歌の音声管理用
let finishAudio = null;  // クリア音の管理用

const BINGO_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
    [0, 4, 8], [2, 4, 6]             // 斜め
];

/**
 * 音声を再生する関数（歌用）
 */
function playSongSound(id) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(`/sound/${id}.mp3`);
    currentAudio.play().catch(e => console.warn("Audio play blocked:", e));
}

/**
 * クリア音を再生する関数
 */
function playFinishSound() {
    if (finishAudio) {
        finishAudio.pause();
        finishAudio.currentTime = 0;
    }
    finishAudio = new Audio(`/sound/finish.m4a`);
    finishAudio.play().catch(e => console.warn("Finish audio play blocked:", e));
}

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
            <li><a href="index_en.html">Top</a></li>
            <li><a href="introduction-app_en.html">Apps</a></li>
            <li>Hyakunin Isshu Bingo Game</li>
        </ol>
    </nav>
    <hr>
            <div class="title"><h1>Hyakunin Isshu Bingo Game</h1></div>
            <ul id="karuta_ul">
                <li>Complete any row, column, or diagonal to win.</li>
                <li>Your clear time is shown when you finish.</li>
                <li>Each wrong tap adds a 5-second penalty.</li>
            </ul>
            <p class="kome" style="margin: 0.25em 0 0.75em 2em;"><small>Audio: NHK Creative Library</small></p>
            <div class="quiz-controls" style="text-align:center;">
                <select id="quiz-type-select">
                    <option value="全歌対象">All poems</option>
                    <option value="青">Blue</option><option value="ピンク">Pink</option>
                    <option value="黄">Yellow</option><option value="緑">Green</option><option value="橙">Orange</option>
                </select>
                <div id="start-button_en"></div>
            </div>
        </div>
    </main>`;
    document.getElementById('start-button_en').onclick = () => startBingo(document.getElementById('quiz-type-select').value);
}

function startBingo(quizType) {
    let source = (quizType === '全歌対象') ? [...allSongs] : colorGroups[quizType];
    if (source.length < 9) return alert('Not enough cards.');

    startTime = Date.now();
    missCount = 0;
    matchedIndices.clear();
    isProcessing = false;

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
                <p style="font-size:0.8rem; color:#888; margin-bottom:5px;">Find the card with the matching lower verse</p>
                <h3 id="current-kami" style="font-size:1.25rem; line-height:1.5;"></h3>
                <p class="kome" style="margin: 0.5em 0 0 0;"><small style="font-size:0.8rem;">Audio: NHK Creative Library</small></p>
            </div>
            <div id="grid-container"></div>
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

    if (targetSong.id) {
        playSongSound(targetSong.id);
    }

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
        missCount++;
        card.classList.add('incorrect-image');
        setTimeout(() => { card.classList.remove('incorrect-image'); isProcessing = false; }, 500);
    }
}

function checkBingo() {
    return BINGO_LINES.some(line => line.every(idx => matchedIndices.has(idx)));
}

let resultTimer;

function showResults() {
    // 歌の音声を止めて、クリア音を鳴らす
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    playFinishSound();

    const rawTime = Math.floor((Date.now() - startTime) / 1000);
    const penaltyTime = missCount * 5;
    const finalTime = rawTime + penaltyTime;

    const container = document.getElementById('quiz-container');
    showConfettiBlast(); // 花吹雪を表示

    container.innerHTML = `
        <div class="section" style="text-align:center;">
            <h2 style='text-align:center;'>Bingo! You cleared it!</h2>
            <p style="text-align:center;">Clear time: <strong>${finalTime}s</strong></p>
            <p style="font-size: 0.8rem; color: #666; text-align:center;">(Time: ${rawTime}s + Miss penalty: ${penaltyTime}s)</p>
            <button id='replay-button_en' style="margin: 20px auto; cursor: pointer; border:none;"></button>
            <p style="font-size: 0.8rem; color: #666; text-align:center;">Returning to the start screen in 5 seconds</p>
        </div>`;

    const replayBtn = document.getElementById('replay-button_en');
    if (replayBtn) {
        replayBtn.onclick = function () {
            if (finishAudio) finishAudio.pause(); // 戻るときにクリア音も止める
            clearTimeout(resultTimer);
            createSelectionScreen();
        };
    }

    resultTimer = setTimeout(() => {
        if (finishAudio) finishAudio.pause();
        createSelectionScreen();
    }, 5000);
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

    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 40;
        confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
    }, 250);
}
