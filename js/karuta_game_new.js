// --- 百人一首 かるたゲーム ---

// ─── Style injection (once only) ────────────────────────────────────
(function injectStyles() {
    if (document.getElementById('karuta-injected-styles')) return;
    const s = document.createElement('style');
    s.id = 'karuta-injected-styles';
    s.textContent = `


/* ── Correct card: pop ── */
@keyframes karutaCorrectPop {
    0%   { transform: scale(1);    box-shadow: 0 0 0 0   rgba(184,35,67,0); }
    40%  { transform: scale(1.02); box-shadow: 0 0 0 5px rgba(184,35,67,0.5), 0 0 22px 8px rgba(212,175,55,0.35); border-color: #D4AF37 !important; }
    100% { transform: scale(1);    box-shadow: 0 0 0 2px rgba(212,175,55,0.45); border-color: #D4AF37 !important; }
}
.karuta_card.correct-pop { animation: karutaCorrectPop 0.6s ease-out forwards; }

/* ── Incorrect card: grayout → auto-restore ── */
@keyframes karutaWrongFlash   { 0% { opacity:1; filter:none; } 15%,100% { opacity:0.25; filter:grayscale(80%); } }
@keyframes karutaWrongRestore { from { opacity:0.25; filter:grayscale(80%); } to { opacity:1; filter:none; } }
.karuta_card.wrong-flash   { animation: karutaWrongFlash   0.15s ease forwards; }
.karuta_card.wrong-restore { animation: karutaWrongRestore 0.4s  ease forwards; }

/* ── Petal particles ── */
@keyframes karutaPetalOut {
    0%   { opacity: 1;   transform: translate(-50%,-50%) rotate(0deg) scale(1.3); }
    40%  { opacity: 1; }
    100% { opacity: 0;   transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot,120deg)) scale(0.2); }
}
.karuta-sparkle { position:fixed; pointer-events:none; z-index:9999; animation:karutaPetalOut var(--dur,1.1s) ease-out forwards; }

/* ── Donut chart fade-in ── */
@keyframes karutaDonutFadeIn { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:translateY(0);} }

/* ── Mobile: 3列・カード＆文字を大きく ── */
@media (max-width: 600px) {
    #karuta_container {
        display: grid;
        grid-template-columns: repeat(3, 1fr) !important;
        grid-auto-rows: calc((100vw - 60px) / 3 * 10 / 7) !important;
        row-gap: 16px !important;
        column-gap: 10px !important;
        padding: 4px !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    #karuta_container .karuta_card {
        width: 100% !important;
        height: 100% !important;
        min-width: 0 !important;
        min-height: 0 !important;
        box-sizing: border-box !important;
    }
    #karuta_container .karuta_card p {
        font-size: 5vw !important;
        line-height: 1.6 !important;
    }
    .karuta-missed-wrapper {
        width:  clamp(108px, 36vw, 156px) !important;
        height: clamp(138px, 46vw, 198px) !important;
    }
}

/* ── Missed card flip ── */
.karuta-missed-wrapper {
    width: clamp(90px, 30vw, 130px);
    height: clamp(115px, 38vw, 165px);
    perspective: 600px;
    cursor: pointer;
    flex-shrink: 0;
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    -webkit-tap-highlight-color: transparent;
}
.karuta-missed-inner {
    position: relative;
    width: 100%; height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.45s ease;
}
.karuta-missed-wrapper.flipped .karuta-missed-inner { transform: rotateY(180deg); }

.karuta-missed-front,
.karuta-missed-back {
    position: absolute; inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    overflow: hidden; box-sizing: border-box;
    padding: 6px 5px;
    background: #fdf8e8;
    border: 2px solid #c8a84b;
    border-radius: 4px;
}
.karuta-missed-front p {
    margin: 0;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    line-height: 1.6;
    max-height: 100%; max-width: 100%;
    box-sizing: border-box;
    font-family: 'Kaisei HarunoUmi', serif;
}
.karuta-missed-back {
    transform: rotateY(180deg);
    background: #f0e8cc;
    border-color: #a07830;
    color: #333;
}
.karuta-missed-back__uta {
    display: block;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    white-space: pre-line;
    line-height: 1.6;
    max-height: 100%;
    font-family: 'Kaisei HarunoUmi', serif;
}
.karuta-missed-number {
    position: absolute; bottom: 4px; left: 5px;
    font-size: 9px; color: #bbb;
    writing-mode: horizontal-tb;
    font-family: 'Noto Sans JP', sans-serif;
    line-height: 1; pointer-events: none;
}
.karuta-missed-badge {
    position: absolute; top: 4px; right: 4px;
    font-size: 10px; font-weight: bold;
    color: #fff; background: #B82343;
    border-radius: 3px; padding: 1px 4px;
    writing-mode: horizontal-tb;
    font-family: 'Noto Sans JP', sans-serif;
    line-height: 1.4; pointer-events: none;
}
    `;
    (document.head || document.documentElement).appendChild(s);
})();

// --- DOM references ---
const gameHeader        = document.getElementById('game_header');
const jsonAddress       = "../js/karuta.json?20240620";
const hyakuninAddress   = "../js/hyakunin.json?04";
const container         = document.getElementById('karuta_container');
const startButton       = document.getElementById('start_button');
const resultText        = document.getElementById('result_text');
const cardCountSelector = document.getElementById('cardCountSelector');
const cardCountLabel    = document.querySelector('label[for="cardCountSelector"]');
const selectElement     = document.getElementById('cardCountSelector');
const shareButton       = document.getElementById('share_button');
const replayButton      = document.getElementById('replay_button');

// --- State variables ---
let currentAudioInstance = null;
let currentSongNumber    = null;
let currentSong          = null;   // full data for the card currently being read
let hasFaultedOnCurrent  = false;  // whether user has faulted on the current card
let startTime            = null;
let mistakeCount         = 0;
let totalCards           = 0;
let isProcessing         = false;
let jsonData             = null;
let kimarijiMap          = {};   // number → kimariji string
let hyakuninMap          = {};   // number → full hyakunin.json song object
let kimarijiStats        = {};   // { 1:{correct,total}, 2:…, … }  — fault-free only
let missedSongs          = [];   // cards where a fault was made
let audioCache           = {};

// --- Initialization ---
async function initialize() {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth;
    const defaultCardCount = screenWidth >= 960 ? 10 : 6;

    selectElement.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        if (i === defaultCardCount) option.selected = true;
        selectElement.add(option);
    }

    try {
        const [karRes, hyaRes] = await Promise.all([
            fetch(jsonAddress),
            fetch(hyakuninAddress)
        ]);
        if (!karRes.ok) throw new Error('Failed to load JSON');
        jsonData = await karRes.json();

        if (hyaRes.ok) {
            const hyaData = await hyaRes.json();
            Object.values(hyaData).forEach(s => {
                const key = String(s.number);
                if (s.kimariji) kimarijiMap[key] = s.kimariji;
                hyakuninMap[key] = s;
            });
        }

        setupGame(defaultCardCount);
    } catch (error) {
        console.error(error);
        resultText.textContent = "データの読み込みに失敗しました。";
    }
}

function stopAllAudio() {
    if (currentAudioInstance) {
        currentAudioInstance.pause();
        currentAudioInstance.currentTime = 0;
        currentAudioInstance = null;
    }
    Object.values(audioCache).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function setupGame(count) {
    stopAllAudio();
    audioCache          = {};
    kimarijiStats       = {};
    missedSongs         = [];
    currentSong         = null;
    hasFaultedOnCurrent = false;

    container.innerHTML = '';
    totalCards          = count;
    mistakeCount        = 0;

    const selectedSongs = getRandomSongs(jsonData, count);

    selectedSongs.forEach(song => {
        const card = document.createElement('div');
        card.classList.add('karuta_card');
        card.dataset.number = song.number;
        card.innerHTML = `<p>${song.torihuda}</p>`;
        card.addEventListener('click', () => cardClickHandler(song, card));
        container.appendChild(card);

        const audio = new Audio(`../sound/d_${String(song.number).padStart(3, '0')}.mp3?v=20260527`);
        audio.preload = "auto";
        audio.load();
        audioCache[song.number] = audio;
    });

    if (window.innerWidth <= 600) {
        requestAnimationFrame(() => {
            const cards = container.querySelectorAll('.karuta_card');
            if (!cards.length) return;
            const w = cards[0].offsetWidth;
            if (w > 0) cards.forEach(c => { c.style.height = Math.round(w * 10 / 7) + 'px'; });
        });
    }
}

function getRandomSongs(data, count) {
    const keys    = Object.keys(data);
    const shuffled = keys.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(key => data[key]);
}

// --- Game logic ---

function playNextAudio() {
    const remainingCards = Array.from(document.querySelectorAll('.karuta_card'))
        .filter(card => !card.classList.contains('played'));

    if (remainingCards.length === 0) { finishGame(); return; }

    const targetCard       = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    currentSongNumber      = targetCard.dataset.number;
    hasFaultedOnCurrent    = false;  // reset for new card
    currentSong = hyakuninMap[currentSongNumber] || { number: currentSongNumber };

    targetCard.classList.add('played');

    if (currentAudioInstance) {
        currentAudioInstance.pause();
        currentAudioInstance.currentTime = 0;
    }

    // ローカル変数に固定する（クロージャが currentAudioInstance を名前参照すると
    // 次カードに進んだ後でスタールなコールバックが別の音声に誤作動するため）
    const audio = audioCache[currentSongNumber];
    currentAudioInstance = audio;

    if (audio) {
        audio.pause();      // iOS キューに積まれた play() が後から発火しても無音になるよう先に止める
        audio.muted = false;

        const doPlay = () => {
            if (audio !== currentAudioInstance) return; // 別カードに進んでいたら無視
            window._karutaCardStartTime = Date.now();
            audio.play().catch(err => console.warn("Audio play error:", err));
        };

        if (audio.currentTime === 0 && !audio.seeking) {
            doPlay();
        } else {
            // seek 完了を待ってから再生（iOS で途中から再生されるのを防ぐ）
            const onSeeked = () => {
                audio.removeEventListener('seeked', onSeeked);
                doPlay();
            };
            audio.addEventListener('seeked', onSeeked);
            audio.currentTime = 0;
        }
    }
}

// ─── Petal + ripple effect (wa style) ───────────────────────────────
function spawnSparkles(button) {
    const rect = button.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    // ── Petal burst — 3 waves (45 petals total) ──
    const colors = ['#FFB7C5','#FADADD','#F4A7B9','#FF8FAB','#FFD6E0','#FFCCD5','#F8A0B0','#FFFFFF','#FFF0F5','#FFF5F7'];
    const shapes = [
        '50% 50% 50% 0  / 80% 80% 20% 20%',
        '50% 50% 0  50% / 80% 80% 20% 20%',
        '50%',
        '40% 60% 60% 40% / 40% 40% 60% 60%'
    ];
    const waves = [
        { count: 14, distMin:  35, distMax:  70, baseDelay:  0 },
        { count: 18, distMin:  60, distMax: 110, baseDelay: 30 },
        { count: 13, distMin:  90, distMax: 150, baseDelay: 60 }
    ];

    waves.forEach(({ count, distMin, distMax, baseDelay }) => {
        for (let i = 0; i < count; i++) {
            const el     = document.createElement('span');
            el.className = 'karuta-sparkle';
            const angle  = (360 / count) * i + (Math.random() * 28 - 14);
            const dist   = distMin + Math.random() * (distMax - distMin);
            const rad    = angle * Math.PI / 180;
            const delay  = baseDelay + Math.random() * 35;
            const w      = 9 + Math.random() * 8;
            const h      = w * (1.5 + Math.random() * 0.8);
            const gravity = 25 + Math.random() * 40;
            const tx     = (Math.cos(rad) * dist).toFixed(1);
            const ty     = (Math.sin(rad) * dist + gravity).toFixed(1);
            const rot    = (Math.random() * 540 - 270).toFixed(0) + 'deg';
            const dur    = (0.50 + Math.random() * 0.30).toFixed(2) + 's';

            el.style.cssText = [
                `left:${cx}px`, `top:${cy}px`,
                `width:${w.toFixed(1)}px`, `height:${h.toFixed(1)}px`,
                `background:${colors[Math.floor(Math.random() * colors.length)]}`,
                `border-radius:${shapes[i % shapes.length]}`,
                `--tx:${tx}px`, `--ty:${ty}px`,
                `--rot:${rot}`, `--dur:${dur}`,
                `animation-delay:${delay.toFixed(0)}ms`
            ].join(';');

            document.body.appendChild(el);
            setTimeout(() => el.remove(), 850 + delay);
        }
    });
}

function cardClickHandler(song, element) {
    if (!startTime || isProcessing) return;

    if (String(song.number) === String(currentSongNumber)) {
        isProcessing = true;
        resultText.textContent = "";

        // Only count toward kimariji stats if no fault was made on this card
        if (!hasFaultedOnCurrent) {
            const kLen = kimarijiMap[String(song.number)]
                ? kimarijiMap[String(song.number)].length : 0;
            if (!kimarijiStats[kLen]) kimarijiStats[kLen] = { correct: 0, total: 0 };
            kimarijiStats[kLen].correct++;
            kimarijiStats[kLen].total++;
        }

        // Correct animation: pop → sparkles → fade out
        element.classList.add('correct-pop');
        spawnSparkles(element);

        if (currentAudioInstance) currentAudioInstance.pause();

        setTimeout(() => {
            element.style.opacity      = '0';
            element.style.pointerEvents = 'none';
            setTimeout(() => { isProcessing = false; playNextAudio(); }, 200);
        }, 560);

    } else {
        resultText.textContent = 'お手付きです';
        mistakeCount++;

        // Add to missed list only on the first fault for this card + record as incorrect in stats
        if (!hasFaultedOnCurrent && currentSong) {
            const consoleParts = (currentSong.forConsole || '').split('\n');
            missedSongs.push({
                number   : currentSong.number,
                torihuda : currentSong.torihuda || '',
                uta      : consoleParts[0] || '',
                kimariji : currentSong.kimariji || ''
            });
            hasFaultedOnCurrent = true;

            // Increment total only (not correct) → recorded as incorrect in the chart
            const kLen = kimarijiMap[String(currentSongNumber)]
                ? kimarijiMap[String(currentSongNumber)].length : 0;
            if (!kimarijiStats[kLen]) kimarijiStats[kLen] = { correct: 0, total: 0 };
            kimarijiStats[kLen].total++;
        }

        // Incorrect animation: grayout → auto-restore
        element.classList.remove('wrong-restore');
        element.classList.add('wrong-flash');
        setTimeout(() => {
            element.classList.remove('wrong-flash');
            element.classList.add('wrong-restore');
            setTimeout(() => element.classList.remove('wrong-restore'), 400);
        }, 650);
    }
}

function finishGame() {
    stopAllAudio();

    const endTime    = new Date();
    const elapsedSec = (endTime - startTime) / 1000;
    const penaltySec = mistakeCount * 5;
    const finalScore = elapsedSec + penaltySec;
    const avgTime    = finalScore / totalCards;

    const mistakeMsg = mistakeCount === 0 ? "完璧です！" : `お手付き: ${mistakeCount}回`;

    resultText.innerHTML = `
        <div style="font-size:1.4rem; font-weight:bold; margin-bottom:10px;">
            ゲームをクリアしました！
        </div>
        タイム: ${finalScore.toFixed(2)} 秒<br>
        1枚あたり: ${avgTime.toFixed(2)} 秒<br>
        ${mistakeMsg}
        ${buildKimarijiChartHTML()}
    `;
    resultText.style.display = 'block';
    container.style.display  = 'none';
    const nhkCredit = document.getElementById('nhk-credit');
    if (nhkCredit) nhkCredit.style.display = 'none';

    if (replayButton) {
        replayButton.style.display = '';
        resultText.appendChild(replayButton);
    }

    // Inject missed cards section after resultText
    if (missedSongs.length > 0) {
        let missedSection = document.getElementById('karuta-missed-section');
        if (!missedSection) {
            missedSection = document.createElement('div');
            missedSection.id = 'karuta-missed-section';
            resultText.parentNode.insertBefore(missedSection, resultText.nextSibling);
        }
        missedSection.innerHTML = `
            <p class="missed-cards-heading" style="font-size:14px;font-weight:bold;color:#B82343;margin:24px 0 10px;text-align:center;">
                ❌ お手付き札
            </p>
            <div id="karuta-missed-list"
                 style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;
                        background:#f0ebe0;border-radius:8px;padding:10px;"></div>
            <p style="font-size:11px;color:#999;text-align:center;margin-top:6px;">
                タップで裏返すと和歌全体を確認できます
            </p>`;
        showMissedCards(missedSongs);
    }

    const finishAudio = new Audio('../sound/finish.m4a?v=20260527');
    finishAudio.play().catch(() => {});

    setupShareButton(finalScore.toFixed(2), totalCards, mistakeCount);
    if (typeof confetti === 'function') showConfetti();
}

// ─── Missed card flip display ─────────────────────────────────────────

function fitTextToFace(textEl, faceEl, startPx, minPx) {
    let size = startPx;
    textEl.style.fontSize = size + 'px';
    requestAnimationFrame(function () {
        while (size > minPx &&
               (textEl.scrollHeight > faceEl.clientHeight - 10 ||
                textEl.scrollWidth  > faceEl.clientWidth  - 10)) {
            size -= 0.5;
            textEl.style.fontSize = size + 'px';
        }
    });
}

function showMissedCards(songs) {
    const list = document.getElementById('karuta-missed-list');
    if (!list || !songs || songs.length === 0) return;

    list.innerHTML = '';
    songs.forEach(function (song) {
        const utaText = song.uta  ? song.uta.trim().replace(/ /g, '\n') : '';
        const numText = song.number ? String(song.number) : '';

        const wrapper = document.createElement('div');
        wrapper.className = 'karuta-missed-wrapper';

        const inner = document.createElement('div');
        inner.className = 'karuta-missed-inner';

        // ── Front face ──
        const front    = document.createElement('div');  front.className = 'karuta-missed-front';
        const frontP   = document.createElement('p');    frontP.innerHTML = song.torihuda || '';
        const frontNum = document.createElement('span'); frontNum.className = 'karuta-missed-number'; frontNum.textContent = numText;

        if (song.kimariji) {
            const badge = document.createElement('span');
            badge.className   = 'karuta-missed-badge';
            badge.textContent = song.kimariji;
            front.appendChild(badge);
        }
        front.appendChild(frontP);
        front.appendChild(frontNum);

        // ── Back face ──
        const back     = document.createElement('div');  back.className = 'karuta-missed-back';
        const backSpan = document.createElement('span'); backSpan.className = 'karuta-missed-back__uta'; backSpan.textContent = utaText;
        const backNum  = document.createElement('span'); backNum.className  = 'karuta-missed-number'; backNum.textContent = numText;
        back.appendChild(backSpan);
        back.appendChild(backNum);

        inner.appendChild(front);
        inner.appendChild(back);
        wrapper.appendChild(inner);

        wrapper.addEventListener('click',      function ()  { wrapper.classList.toggle('flipped'); });
        wrapper.addEventListener('touchstart', function (e) { e.preventDefault(); wrapper.classList.toggle('flipped'); }, { passive: false });

        list.appendChild(wrapper);
    });

    requestAnimationFrame(function () {
        list.querySelectorAll('.karuta-missed-wrapper').forEach(function (w) {
            fitTextToFace(w.querySelector('.karuta-missed-front p'),   w.querySelector('.karuta-missed-front'), 28, 6);
            fitTextToFace(w.querySelector('.karuta-missed-back__uta'), w.querySelector('.karuta-missed-back'),  22, 6);
        });
    });
}

// ─── Kimariji accuracy donut charts ──────────────────────────────────

function buildDonutSVG(label, correct, total, delayMs) {
    const SIZE = 90, CX = 45, CY = 45, R = 30, SW = 10;
    const circ = 2 * Math.PI * R;
    const pct  = total > 0 ? Math.round(correct / total * 100) : 0;

    const filled = circ * (correct / total);
    const empty  = circ - filled;

    const color = pct >= 80 ? '#2E9E5B' : pct >= 50 ? '#F0A500' : '#B82343';

    const begin     = (delayMs / 1000).toFixed(2) + 's';
    const textDelay = ((delayMs + 600) / 1000).toFixed(2) + 's';

    let arcSVG = '';
    if (correct > 0) {
        const toVal = filled >= circ
            ? `${circ.toFixed(2)} 0`
            : `${filled.toFixed(2)} ${empty.toFixed(2)}`;
        arcSVG = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${color}" stroke-width="${SW}"
            transform="rotate(-90 ${CX} ${CY})">
            <animate attributeName="stroke-dasharray"
                from="0 ${circ.toFixed(2)}" to="${toVal}"
                dur="0.7s" begin="${begin}" fill="freeze" calcMode="spline"
                keySplines="0.4 0 0.2 1" keyTimes="0;1"/>
        </circle>`;
    }

    return `
    <div style="text-align:center;width:90px;flex-shrink:0;
                opacity:0;animation:karutaDonutFadeIn 0.4s ease ${begin} forwards;">
        <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" aria-label="${label} 正答率${pct}%">
            <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#e0d9cc" stroke-width="${SW}"/>
            ${arcSVG}
            <text x="${CX}" y="${CY-4}" text-anchor="middle" font-size="15" font-weight="bold"
                  fill="${color}" font-family="'Noto Sans JP',sans-serif" opacity="0">
                ${pct}%
                <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${textDelay}" fill="freeze"/>
            </text>
            <text x="${CX}" y="${CY+11}" text-anchor="middle" font-size="9"
                  fill="#888" font-family="'Noto Sans JP',sans-serif" opacity="0">
                ${correct}/${total}
                <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${textDelay}" fill="freeze"/>
            </text>
        </svg>
        <div style="font-size:11px;color:#555;line-height:1.4;margin-top:2px;">${label}</div>
    </div>`;
}

function buildKimarijiChartHTML() {
    const entries = Object.entries(kimarijiStats)
        .filter(([, v]) => v.total > 0)
        .sort(([a], [b]) => Number(a) - Number(b));

    if (entries.length === 0) return '';

    const donuts = entries.map(([len, { correct, total }], i) =>
        buildDonutSVG(len + '文字決まり', correct, total, 300 + i * 120)
    ).join('');

    return `
    <div style="margin:20px auto 8px;max-width:600px;text-align:center;">
        <p style="font-size:0.85rem;font-weight:bold;color:#666;margin-bottom:10px;text-align:center;">
            ── 決まり字別 正答率（お手付きなし） ──
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;
                    background:#f7f2e8;border-radius:10px;padding:14px;">
            ${donuts}
        </div>
    </div>`;
}

// --- Event listeners ---

startButton.addEventListener('click', function onStartClick() {
    startButton.removeEventListener('click', onStartClick); // 二重クリック防止

    const audios = Object.values(audioCache);
    const total  = audios.length;

    // ── STEP 1: iOS unlock ──
    // user gesture の同期処理内で play() を呼ぶ必要がある。
    // playPromise を保持しておき、resolve 後に pause() を呼ぶ（iOS unlock が破壊されないよう）
    const playPromises = audios.map(audio => {
        audio.muted = true;
        return audio.play().catch(() => null);
    });

    // ── ローディング表示 ──
    startButton.style.opacity       = '0.45';
    startButton.style.pointerEvents = 'none';
    const loadingEl = document.createElement('div');
    loadingEl.id = 'karuta-loading';
    loadingEl.style.cssText = 'text-align:center;font-size:0.85rem;color:#888;margin:2px 0 6px;';
    loadingEl.textContent = `音声を読み込み中... 0 / ${total}`;
    const opArea = document.getElementById('operatin_area');
    if (opArea) opArea.insertAdjacentElement('afterend', loadingEl);

    let loadedCount = 0;
    let gameReady = false; // true になったら settle() はゲーム中の音声に干渉しない

    // ── STEP 2: play() が開始してから canplaythrough → pause → seek 0 → unmute ──
    // play() resolve 前に pause() すると iOS unlock が無効になるため、必ず resolve 後に処理する
    const readyPromises = audios.map((audio, i) =>
        playPromises[i].then(() => new Promise(resolve => {
            const settle = () => {
                audio.removeEventListener('canplaythrough', settle);
                audio.removeEventListener('error', settle);
                // ゲーム開始後に遅れて発火した場合は音声を止めずに終了
                if (gameReady) { resolve(); return; }
                audio.pause();
                const done = () => {
                    loadingEl.textContent = `音声を読み込み中... ${++loadedCount} / ${total}`;
                    resolve();
                };
                // 先頭付近なら即 resolve、そうでなければ seek 完了を待つ
                if (audio.currentTime < 0.05) {
                    audio.currentTime = 0;
                    done();
                } else {
                    const onSeeked = () => {
                        audio.removeEventListener('seeked', onSeeked);
                        done();
                    };
                    audio.addEventListener('seeked', onSeeked);
                    audio.currentTime = 0;
                }
            };
            if (audio.readyState >= 4) {
                settle();
            } else {
                audio.addEventListener('canplaythrough', settle);
                audio.addEventListener('error', settle);
            }
        }))
    );

    const timeoutGuard = new Promise(resolve => setTimeout(resolve, 15000));

    Promise.race([Promise.all(readyPromises), timeoutGuard]).then(() => {
        gameReady = true; // 以降の settle() はゲーム中の音声に干渉しない
        // タイムアウト時も残りを強制リセット
        audios.forEach(audio => {
            if (!audio.paused) audio.pause();
            audio.currentTime = 0;
        });
        loadingEl.remove();

        // コントロールを非表示
        if (gameHeader) gameHeader.style.display = 'none';
        startButton.style.display       = 'none';
        cardCountSelector.style.display = 'none';
        cardCountLabel.style.display    = 'none';

        // 3 秒カウントダウン後にゲーム開始
        const cdEl = document.createElement('div');
        cdEl.style.cssText =
            'text-align:center;font-size:4.5rem;font-weight:900;' +
            'color:#B82343;font-family:"Noto Sans JP",sans-serif;' +
            'margin:24px 0;line-height:1;';
        const opArea = document.getElementById('operatin_area');
        if (opArea) opArea.insertAdjacentElement('afterend', cdEl);

        let count = 3;
        cdEl.textContent = count;

        const tick = setInterval(() => {
            count--;
            if (count > 0) {
                cdEl.textContent = count;
            } else {
                clearInterval(tick);
                cdEl.remove();
                startTime = new Date();
                playNextAudio();
            }
        }, 1000);
    });
});

cardCountSelector.addEventListener('change', () => {
    setupGame(parseInt(cardCountSelector.value, 10));
});

replayButton.addEventListener('click', () => {
    window.location.reload();
});

function setupShareButton(score, cards, mistakes) {
    if (!shareButton) return;
    shareButton.style.cssText = 'display:flex;justify-content:center;align-items:center;';
    shareButton.onclick = () => {
        const text = encodeURIComponent(
            `[百人一首 かるたゲーム]\nクリアタイム: ${score}秒\n${cards}枚をお手付き${mistakes}回でクリア！\n`
        );
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    };
}

function showConfetti() {
    if (typeof confetti !== 'function') return;
    const animationEnd = Date.now() + 2000;
    const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 1000 };
    const interval = setInterval(() => {
        if (Date.now() > animationEnd) return clearInterval(interval);
        confetti({ ...defaults, particleCount: 40, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);
}

document.addEventListener('DOMContentLoaded', initialize);