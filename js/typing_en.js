/**
 * Kimariji Typing (English)
 */

let allSongs = [];
let filteredSongs = [];
let targetSong = { answer: "", displayVerse: "", revealVerse: "", cardColor: "" };
let answerCandidates = []; // [{str, idx}] 正規形＋濁音バリアントを並行追跡
let solvedCount = 0;
let isPlaying = false;
let gameActive = false; // ゲームボード表示中（問題間の待機も含む）
let questionStartTime;
let completedQuestions = []; // [{song, timeTaken}]
let TOTAL_QUESTIONS = 10;
let selectedColor = "すべて";
let gameMode = "A"; // "A": 上の句→下の句  "B": 下の句→上の句決まり字  "C": 下の句→上の句全文
let songQueue = []; // シャッフル済みの出題キュー（重複なし）
let hideTyping = false; // タイプ文字を隠すモード
let typingAreaHovered = false;

// ── ひらがな → ローマ字変換 ──────────────────────────────────────
const KANA_MAP = [
  ["きゃ","kya"],["きゅ","kyu"],["きょ","kyo"],
  ["しゃ","sha"],["しゅ","shu"],["しょ","sho"],
  ["ちゃ","cha"],["ちゅ","chu"],["ちょ","cho"],
  ["にゃ","nya"],["にゅ","nyu"],["にょ","nyo"],
  ["ひゃ","hya"],["ひゅ","hyu"],["ひょ","hyo"],
  ["みゃ","mya"],["みゅ","myu"],["みょ","myo"],
  ["りゃ","rya"],["りゅ","ryu"],["りょ","ryo"],
  ["ぎゃ","gya"],["ぎゅ","gyu"],["ぎょ","gyo"],
  ["じゃ","ja"], ["じゅ","ju"], ["じょ","jo"],
  ["びゃ","bya"],["びゅ","byu"],["びょ","byo"],
  ["ぴゃ","pya"],["ぴゅ","pyu"],["ぴょ","pyo"],
  ["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],
  ["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"],
  ["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"],
  ["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"],
  ["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],
  ["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"],
  ["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"],
  ["や","ya"],["ゆ","yu"],["よ","yo"],
  ["ら","ra"],["り","ri"],["る","ru"],["れ","re"],["ろ","ro"],
  ["わ","wa"],["ゐ","i"],["ゑ","e"],["を","o"],
  ["ん","n"],
  ["が","ga"],["ぎ","gi"],["ぐ","gu"],["げ","ge"],["ご","go"],
  ["ざ","za"],["じ","ji"],["ず","zu"],["ぜ","ze"],["ぞ","zo"],
  ["だ","da"],["ぢ","di"],["づ","du"],["で","de"],["ど","do"],
  ["ば","ba"],["び","bi"],["ぶ","bu"],["べ","be"],["ぼ","bo"],
  ["ぱ","pa"],["ぴ","pi"],["ぷ","pu"],["ぺ","pe"],["ぽ","po"],
];

function kanaToRomaji(str) {
  let result = "";
  let i = 0;
  while (i < str.length) {
    let matched = false;
    if (i + 1 < str.length) {
      const two = str.slice(i, i + 2);
      const found = KANA_MAP.find(([k]) => k === two);
      if (found) { result += found[1]; i += 2; matched = true; }
    }
    if (!matched) {
      const one = str[i];
      const found = KANA_MAP.find(([k]) => k === one);
      if (found) result += found[1];
      i++;
    }
  }
  return result;
}

// ── バリアント生成 ───────────────────────────────────────────
const VOICED_PAIRS = [
  ['ha', 'wa']
];

function generateVoicedVariants(answer) {
  const variants = new Set([answer]);
  for (const [a, b] of VOICED_PAIRS) {
    for (const [from, to] of [[a, b], [b, a]]) {
      let i = 0;
      while ((i = answer.indexOf(from, i)) !== -1) {
        variants.add(answer.slice(0, i) + to + answer.slice(i + from.length));
        i += from.length;
      }
    }
  }
  // mu→n は末尾のみ（語中の mu は変換しない）
  if (answer.endsWith('mu')) {
    variants.add(answer.slice(0, -2) + 'n');
  }
  return [...variants];
}

// ── 色の表示ラベル（内部値は日本語のまま） ──────────────────────
const COLOR_LABELS_EN = { "すべて": "All", "黄": "Yellow", "ピンク": "Pink", "青": "Blue", "橙": "Orange", "緑": "Green" };

// ── データ読み込み ──────────────────────────────────────────────
fetch('../js/kimariji.json?20260630')
  .then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    allSongs = data;
    showStartScreen();
  })
  .catch(err => {
    console.error("Failed to load data:", err);
    const container = document.getElementById('quiz-container');
    if (container) {
      container.innerHTML = `<div style="text-align:center; padding:50px;"><p>Data not found</p></div>`;
    }
  });

// ── スタート画面 ────────────────────────────────────────────────
function showStartScreen() {
  isPlaying = false;
  gameActive = false;
  setPageHeaderVisible(true);
  const container = document.getElementById('quiz-container');
  const colors = ["すべて", "黄", "ピンク", "青", "橙", "緑"];

  container.innerHTML = `
    <div style="font-family: 'Noto Sans JP', sans-serif;">

      <p style="color: #666; margin-bottom: 8px; text-align: center;">Choose a mode</p>
      <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
        <button class="mode-select-btn" data-mode="A"
          style="width:160px; padding: 10px 16px; cursor: pointer; border: 2px solid #B82343;
                 background: ${ gameMode === 'A' ? '#B82343' : '#fff' };
                 color: ${ gameMode === 'A' ? '#fff' : '#B82343' };
                 border-radius: 8px; font-size: 0.85rem; font-weight: bold; line-height: 1.4; transition: 0.2s;">
          See upper verse,<br>type lower verse
        </button>
        <button class="mode-select-btn" data-mode="B"
          style="width:160px; padding: 10px 16px; cursor: pointer; border: 2px solid #0984e3;
                 background: ${ gameMode === 'B' ? '#0984e3' : '#fff' };
                 color: ${ gameMode === 'B' ? '#fff' : '#0984e3' };
                 border-radius: 8px; font-size: 0.85rem; font-weight: bold; line-height: 1.4; transition: 0.2s;">
          See lower verse,<br>type kimariji
        </button>
        <button class="mode-select-btn" data-mode="C"
          style="width:160px; padding: 10px 16px; cursor: pointer; border: 2px solid #27ae60;
                 background: ${ gameMode === 'C' ? '#27ae60' : '#fff' };
                 color: ${ gameMode === 'C' ? '#fff' : '#27ae60' };
                 border-radius: 8px; font-size: 0.85rem; font-weight: bold; line-height: 1.4; transition: 0.2s;">
          See lower verse,<br>type upper verse
        </button>
      </div>

      <p style="color: #666; margin-bottom: 8px; text-align: center;">Choose a card color</p>
      <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
        ${colors.map(c => `
          <button class="color-select-btn" data-color="${c}"
            style="padding: 8px 16px; cursor: pointer; border: 2px solid ${getColorCode(c)};
                   background: ${c === selectedColor ? getColorCode(c) : '#fff'};
                   color: ${c === selectedColor ? (c === '黄' ? '#333' : '#fff') : '#333'};
                   border-radius: 20px; font-weight: bold; transition: 0.2s;">
            ${COLOR_LABELS_EN[c]}
          </button>
        `).join('')}
      </div>

      <p style="color: #666; margin: 0 0 10px; text-align: center;">Choose the number of questions to start</p>
      <div style="display: flex; justify-content: center; gap: 15px;">
        ${[3, 5, 10].map(num => `
          <button class="start-btn" data-num="${num}"
            style="width:80px; padding: 12px 0; font-size: 1rem; cursor: pointer;
                   background-color: #e8e0d4; color: #333; border: none;
                   border-radius: 8px; box-shadow: 0 4px 0 #b8a898;">
            ${num} Qs
          </button>
        `).join('')}
      </div>

      <div style="text-align:center; margin-top:24px;">
        <label style="font-size:1.1rem; color:#666; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
          <input type="checkbox" id="hide-typing-checkbox" ${hideTyping ? 'checked' : ''}
                 style="-webkit-appearance: auto; appearance: auto; width:1rem; height:1rem; cursor:pointer;">
          Hide the character to type<br>(shown on hover)
        </label>
      </div>
    </div>`;
}

function getColorCode(colorName) {
  const codes = {
    "すべて": "#B82343", "黄": "#f1c40f", "ピンク": "#e84393",
    "青": "#0984e3", "橙": "#e67e22", "緑": "#27ae60"
  };
  return codes[colorName] || "#444";
}

// ── イベントリスナー ────────────────────────────────────────────
document.addEventListener('change', (e) => {
  if (e.target.id === 'hide-typing-checkbox') {
    hideTyping = e.target.checked;
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('mode-select-btn')) {
    gameMode = e.target.getAttribute('data-mode');
    showStartScreen();
  }

  if (e.target.classList.contains('color-select-btn')) {
    selectedColor = e.target.getAttribute('data-color');
    showStartScreen();
  }

  if (e.target.classList.contains('start-btn')) {
    TOTAL_QUESTIONS = parseInt(e.target.getAttribute('data-num'));
    filteredSongs = (selectedColor === "すべて")
      ? [...allSongs]
      : allSongs.filter(s => s.color === selectedColor);

    if (filteredSongs.length === 0) {
      alert("No data available.");
      return;
    }

    // シャッフルして出題キューを作成（重複なし）
    const shuffled = [...filteredSongs].sort(() => Math.random() - 0.5);
    songQueue = shuffled.slice(0, TOTAL_QUESTIONS);

    solvedCount = 0;
    completedQuestions = [];
    nextQuestion();

    const container = document.getElementById('quiz-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// <br> 位置を記録しながらローマ字変換
function romajiWithBreaks(str) {
  const parts = (str || '').split(/<br>/);
  const rParts = parts.map(p => kanaToRomaji(p.replace(/<[^>]+>/g, '')).toLowerCase());
  const answer = rParts.join('');
  const breakPositions = [];
  let pos = 0;
  for (let i = 0; i < rParts.length - 1; i++) {
    pos += rParts[i].length;
    breakPositions.push(pos);
  }
  return { answer, breakPositions };
}

// type_shimonoku_gendai（スペース区切りローマ字）をパース
function parseGendaiType(str) {
  return { answer: (str || '').toLowerCase(), breakPositions: [] };
}

// お題表示用：スペース区切りローマ字を行ごとに<br>で表示
function toDisplayRomaji(str) {
  return (str || '').trim().split(/\s+/).join('<br>');
}

// ── 問題作成 ────────────────────────────────────────────────────
function nextQuestion() {
  if (solvedCount >= TOTAL_QUESTIONS) {
    showResults();
    return;
  }

  const song = songQueue[solvedCount];

  if (gameMode === "A") {
    const { answer, breakPositions } = parseGendaiType(song.type_shimonoku_gendai);
    targetSong = {
      song,
      answer,
      breakPositions,
      displayVerse: song.kami_no_ku || "",
      displayRomaji: toDisplayRomaji(song.type_kakminoku_gendai),
      displayLabel: "Upper Verse",
      revealVerse: song.shimo_no_ku_kana || "",
      revealLabel: "Lower Verse",
      cardColor: getColorCode(song.color),
    };
  } else if (gameMode === "B") {
    const { answer, breakPositions } = parseGendaiType(song.type_kimariji_gendai);
    targetSong = {
      song,
      answer,
      breakPositions,
      displayVerse: song.shimo_no_ku || "",
      displayRomaji: toDisplayRomaji(song.type_shimonoku_gendai),
      displayLabel: "Lower Verse",
      revealVerse: song.kami_no_ku_kana || "",
      revealLabel: "Upper Verse",
      cardColor: getColorCode(song.color),
    };
  } else {
    const { answer, breakPositions } = parseGendaiType(song.type_kakminoku_gendai);
    targetSong = {
      song,
      answer,
      breakPositions,
      displayVerse: song.shimo_no_ku || "",
      displayRomaji: toDisplayRomaji(song.type_shimonoku_gendai),
      displayLabel: "Lower Verse",
      revealVerse: song.kami_no_ku_kana || "",
      revealLabel: "Upper Verse",
      cardColor: getColorCode(song.color),
    };
  }

  // 正規形＋濁音バリアントを候補として登録
  answerCandidates = generateVoicedVariants(targetSong.answer).map(str => ({ str, idx: 0 }));

  gameActive = true;
  renderBoard();
  isPlaying = true;
  questionStartTime = gameMode === "B" ? Date.now() : null;
}

function setPageHeaderVisible(visible) {
  const display = visible ? '' : 'none';
  ['game_header', 'typing_nav', 'typing_h1'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
  });
}

function renderBoard() {
  setPageHeaderVisible(false);
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <div id="typing-area" style="text-align:center; margin-top:20px; position:relative; font-family: 'Noto Sans JP', sans-serif;">

      <input type="text" id="mobile-input"
             inputmode="url"
             autocorrect="off"
             autocapitalize="off"
             spellcheck="false"
             style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; z-index:10; cursor:pointer;">

      <div id="card-display" style="border: 4px solid ${targetSong.cardColor}; padding: 10px; border-radius: 12px; display: inline-block; width: 90%; max-width: 350px; background: #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.05); position:relative; z-index:1;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
          <p style="color:#888; font-size:0.8rem; margin:0;">Question ${solvedCount + 1} / ${TOTAL_QUESTIONS}</p>
          <p style="color:${targetSong.cardColor}; font-size:0.75rem; margin:0; font-weight:bold;">${targetSong.displayLabel}</p>
        </div>
        <div style="font-size:1.4rem; font-family:'Kaisei HarunoUmi', serif; margin:6px 0 0; line-height:1.8; color: #333;">
          ${targetSong.displayVerse}
        </div>
        <div style="font-size:0.85rem; font-family:'Noto Sans JP', sans-serif; font-style:italic; color:#7a6655; margin-top:4px; line-height:1.5;">
          ${targetSong.displayRomaji}
        </div>
        <div id="reveal-text" style="font-size:1.4rem; font-family:'Kaisei HarunoUmi', serif; margin-top:0; padding-top:12px; border-top: 1px dashed #eee; display: none;">
          <p style="color:${targetSong.cardColor}; font-size:0.75rem; margin:0 0 4px; font-weight:bold;">${targetSong.revealLabel}</p>
          ${targetSong.revealVerse}
        </div>
      </div>

      <div id="input-ui" style="margin-top:15px; position:relative; z-index:1;">
        <div id="type-view" style="font-size: 1.5rem; letter-spacing: 0.1em; min-height:1.5em; word-break: break-all; overflow-wrap: break-word;"></div>
      </div>
    </div>`;

  const input = document.getElementById('mobile-input');
  input.addEventListener('blur', () => {
    if (gameActive) {
      setTimeout(() => {
        const inp = document.getElementById('mobile-input');
        if (inp) inp.focus();
      }, 50);
    }
  });
  if (hideTyping) {
    typingAreaHovered = false;
    input.addEventListener('mouseenter', () => { typingAreaHovered = true;  updateDisplay(); });
    input.addEventListener('mouseleave', () => { typingAreaHovered = false; updateDisplay(); });
  }
  input.focus();
  updateDisplay();
}

// ── タイピング判定 ──────────────────────────────────────────────
function handleInput(char) {
  if (!isPlaying) return;
  const c = char.toLowerCase();

  // 現在位置の文字が一致する候補だけ残す
  const matched = answerCandidates.filter(cand => cand.str[cand.idx] === c);

  if (matched.length === 0) {
    const area = document.getElementById('card-display');
    area.style.borderColor = "red";
    setTimeout(() => area.style.borderColor = targetSong.cardColor, 150);
    return;
  }

  if (questionStartTime === null) questionStartTime = Date.now();

  matched.forEach(cand => {
    cand.idx++;
    while (cand.idx < cand.str.length && cand.str[cand.idx] === ' ') cand.idx++;
  });
  answerCandidates = matched;

  // いずれかの候補が末尾に達したら正解
  if (answerCandidates.some(cand => cand.idx >= cand.str.length)) {
    completedQuestions.push({
      song: targetSong.song,
      timeTaken: (Date.now() - questionStartTime) / 1000,
      answer: targetSong.answer,
    });
    if (window.confetti) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    isPlaying = false;
    solvedCount++;
    updateDisplay();
    document.getElementById('reveal-text').style.display = 'block';
    document.getElementById('input-ui').style.visibility = 'hidden';
    setTimeout(nextQuestion, 1000);
    return;
  }

  updateDisplay();
}

// PC キー
window.addEventListener('keydown', (e) => {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) handleInput(e.key);
});

// スマホ入力
document.addEventListener('input', (e) => {
  if (e.target.id === 'mobile-input') {
    const val = e.target.value;
    if (val.length > 0) {
      handleInput(val.slice(-1));
      e.target.value = "";
    }
  }
});

function updateDisplay() {
  const tView = document.getElementById('type-view');
  if (!tView || answerCandidates.length === 0) return;

  const disp = answerCandidates.find(c => c.str === targetSong.answer) || answerCandidates[0];
  const breaks = targetSong.breakPositions || [];
  const str = disp.str;
  const idx = disp.idx;

  function segment(from, to) {
    let s = '';
    for (let i = from; i < to; i++) {
      if (breaks.includes(i)) s += '　';
      s += (str[i] === ' ' ? '　' : str[i]);
    }
    return s;
  }

  const typed = segment(0, idx);
  const breakBeforeNext = idx < str.length && breaks.includes(idx) ? '　' : '';
  const nextChar = idx < str.length ? str[idx] : '';
  const rest = segment(idx + 1, str.length);

  const isHidden = hideTyping && !typingAreaHovered;
  const dispNext = isHidden && nextChar ? '*' : nextChar;
  const dispRest = isHidden ? rest.replace(/[^　]/g, '*') : rest;

  tView.innerHTML = `
    <span style="color:#488056;">${typed}</span>${breakBeforeNext}<span style="color:#B82343; border-bottom:3px solid #B82343; font-size:3rem">${dispNext}</span><span style="color:#ccc;">${dispRest}</span>
  `;
}

// ── 結果画面 ────────────────────────────────────────────────────
function showResults() {
  isPlaying = false;
  gameActive = false;
  setPageHeaderVisible(false);
  const finalTime = completedQuestions.reduce((sum, q) => sum + q.timeTaken, 0).toFixed(2);

  // <span class='red'> を赤インラインスタイルに変換し、<br> を半角スペースに置換
  function formatVerse(html) {
    return (html || '')
      .replace(/<br>/g, '　')
      .replace(/<span class='red'>/g, "<span style='color:#B82343;font-weight:bold;'>");
  }

  const wpmData = completedQuestions.map(q => {
    const chars = q.answer.replace(/ /g, '').length;
    return Math.round(chars / (Math.max(q.timeTaken, 0.05) / 60));
  });
  const maxWpm = Math.max(...wpmData, 1);
  const avgKpm = Math.round(wpmData.reduce((a, b) => a + b, 0) / wpmData.length);

  const RANKS = [
    { min: 300, label: "Saint of Poetry" },
    { min: 200, label: "Poetry Immortal" },
    { min: 100, label: "Master" },
    { min: 50, label: "Poet" },
    { min:   0, label: "Beginner" },
  ];
  const rank = RANKS.find(r => avgKpm >= r.min).label;

  const chartBars = wpmData.map((wpm, i) => {
    const color = getColorCode(completedQuestions[i].song.color);
    return `
      <div class="wpm-bar-wrap" data-wpm="${wpm}"
           style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
        <span class="wpm-label" style="font-size:0.65rem; color:#333; font-weight:bold; margin-bottom:2px; opacity:0; min-height:1em; display:block;"></span>
        <div class="wpm-bar" style="width:80%; background:${color}; height:0%; border-radius:3px 3px 0 0;"></div>
      </div>`;
  }).join('');

  const chartLabels = wpmData.map((_, i) =>
    `<div style="flex:1; text-align:center; font-size:0.7rem; color:#888; padding-top:4px;">${i + 1}</div>`
  ).join('');

  const cards = completedQuestions.map((q, i) => `
    <div style="border:1px solid #e0d8c8; border-radius:8px; padding:10px 14px; margin:8px 0; background:#fdf8f2;">
      <p style="color:#888; font-size:0.78rem; margin:0 0 6px; font-family:'Noto Sans JP',sans-serif;">
        Question ${i + 1} — ${q.timeTaken.toFixed(2)}s
      </p>
      <div style="font-family:'Kaisei HarunoUmi',serif; font-size:0.95rem; line-height:1.9; color:#333;">
        ${formatVerse(q.song.kami_no_ku_kana || q.song.kami_no_ku)}
      </div>
      <div style="font-family:'Kaisei HarunoUmi',serif; font-size:0.95rem; line-height:1.9; color:#555; margin-top:6px; padding-top:6px; border-top:1px dashed #e0d8c8;">
        ${formatVerse(q.song.shimo_no_ku_kana || q.song.shimo_no_ku)}
      </div>
    </div>
  `).join('');

  document.getElementById('quiz-container').innerHTML = `
    <div style="font-family:'Noto Sans JP',sans-serif; margin-top:20px;">
<p style="text-align:center; font-size:1rem; color:#666; margin:0 0 4px;">Average KPM: <strong>${avgKpm}</strong></p>
      <p style="text-align:center; font-size:1.4rem; font-weight:bold; margin:0 0 16px;">You've earned the rank of <span style="color:#B82343;">${rank}</span>!</p>
      <div style="margin:0 auto 16px; max-width:260px; border:1px solid #e0d8c8; border-radius:8px; overflow:hidden; font-size:0.8rem;">
        <div style="background:#f5ede0; padding:4px 0; text-align:center; font-weight:bold; color:#666;">Rank Table</div>
        ${[
          ["0–49", "Beginner"],
          ["50–99", "Poet"],
          ["100–199", "Master"],
          ["200–299", "Poetry Immortal"],
          ["300+", "Saint of Poetry"],
        ].map(([range, label]) => `
          <div style="display:flex; justify-content:space-between; padding:5px 16px;
                      background:${label === rank ? '#fff0f0' : '#fff'};
                      font-weight:${label === rank ? 'bold' : 'normal'};
                      color:${label === rank ? '#B82343' : '#333'};
                      border-top:1px solid #f0e8d8;">
            <span>${range} KPM</span><span>${label}</span>
          </div>`).join('')}
      </div>
      <div style="text-align:center;"><div id="replay-button_en"></div></div>
      <div style="margin:16px auto 0; max-width:420px; padding:0 8px;">
        <p style="text-align:center; color:#666; font-size:0.8rem; margin:0 0 6px;">Typing Speed (KPM)</p>
        <div style="display:flex; align-items:flex-end; height:100px; border-bottom:1px solid #e0d0c0;">
          ${chartBars}
        </div>
        <div style="display:flex;">
          ${chartLabels}
        </div>
      </div>
      <div style="margin-top:12px; max-width:420px; margin-left:auto; margin-right:auto;">
        ${cards}
      </div>
    </div>`;

  document.getElementById('replay-button_en').onclick = () => location.reload();
  animateWpmChart(maxWpm);

  if (window.confetti) {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) { clearInterval(interval); return; }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }
}

function animateWpmChart(maxWpm) {
  const TOTAL = 2000;
  const RAND_END = 1500;
  const start = performance.now();
  const wraps = [...document.querySelectorAll('.wpm-bar-wrap')];
  const freqs = wraps.map(() => 0.007 + Math.random() * 0.007);
  const phases = wraps.map(() => Math.random() * Math.PI * 2);
  let snapHeights = null;

  function frame(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / TOTAL, 1);

    wraps.forEach((wrap, i) => {
      const targetPct = Math.round((+wrap.dataset.wpm / maxWpm) * 100);
      const bar = wrap.querySelector('.wpm-bar');
      const label = wrap.querySelector('.wpm-label');

      let h;
      if (elapsed < RAND_END) {
        h = 50
          + Math.sin(elapsed * freqs[i] + phases[i]) * 40
          + Math.sin(elapsed * freqs[i] * 2.3 + phases[i]) * 15;
        h = Math.max(5, Math.min(100, h));
      } else {
        if (!snapHeights) {
          snapHeights = wraps.map(w => parseFloat(w.querySelector('.wpm-bar').style.height) || 0);
        }
        const st = (elapsed - RAND_END) / (TOTAL - RAND_END);
        const eased = 1 - Math.pow(1 - st, 3);
        h = snapHeights[i] + (targetPct - snapHeights[i]) * eased;
      }

      bar.style.height = h + '%';

      if (t >= 1) {
        bar.style.height = targetPct + '%';
        label.textContent = wrap.dataset.wpm;
        label.style.opacity = '1';
      }
    });

    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
