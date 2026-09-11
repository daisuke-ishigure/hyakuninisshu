/**
 * 決まり字タイピング - フリック入力対応版
 * typing.htmlの全機能を実装しつつ、フリック入力（かな入力）を維持
 */

let allSongs = [];
let filteredSongs = [];
let targetSong = { answer: "", displayVerse: "", revealVerse: "", cardColor: "" };
let currentIdx = 0;
let solvedCount = 0;
let isPlaying = false;
let gameActive = false;
let questionStartTime;
let completedQuestions = [];
let TOTAL_QUESTIONS = 10;
let selectedColor = "すべて";
let gameMode = "A"; // "A": 上の句→下の句  "B": 下の句→決まり字  "C": 下の句→上の句
let songQueue = [];
let hideTyping = false;
let typingAreaHovered = false;

// HTMLタグを除去してプレーンなひらがなを取得
function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, '');
}

// データ読み込み
fetch('../js/kimariji.json?2026630')
  .then(res => {
    if (!res.ok) throw new Error('ネットワーク応答が正常ではありません');
    return res.json();
  })
  .then(data => {
    allSongs = data;
    showStartScreen();
  })
  .catch(err => {
    console.error("データの読み込みに失敗しました:", err);
    const container = document.getElementById('quiz-container');
    if (container) {
      container.innerHTML = `<div style="text-align:center; padding:50px;"><p>データが見つかりません</p></div>`;
    }
  });

function getColorCode(colorName) {
  const codes = {
    "すべて": "#B82343", "黄": "#f1c40f", "ピンク": "#e84393",
    "青": "#0984e3", "橙": "#e67e22", "緑": "#27ae60"
  };
  return codes[colorName] || "#444";
}

function setPageHeaderVisible(visible) {
  const display = visible ? '' : 'none';
  ['game_header', 'typing_nav', 'typing_h1'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
  });
}

// スタート画面
function showStartScreen() {
  isPlaying = false;
  gameActive = false;
  setPageHeaderVisible(true);
  const container = document.getElementById('quiz-container');
  const colors = ["すべて", "黄", "ピンク", "青", "橙", "緑"];

  container.innerHTML = `
    <div style="font-family: 'Noto Sans JP', sans-serif;">

      <p style="color: #666; margin-bottom: 8px; text-align: center;">モードを選んでください</p>
      <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
        <button class="mode-select-btn" data-mode="A"
          style="width:160px; padding: 10px 16px; cursor: pointer; border: 2px solid #B82343;
                 background: ${ gameMode === 'A' ? '#B82343' : '#fff' };
                 color: ${ gameMode === 'A' ? '#fff' : '#B82343' };
                 border-radius: 8px; font-size: 0.85rem; font-weight: bold; line-height: 1.4; transition: 0.2s;">
          上の句を見て<br>下の句をタイプ
        </button>
        <button class="mode-select-btn" data-mode="B"
          style="width:160px; padding: 10px 16px; cursor: pointer; border: 2px solid #0984e3;
                 background: ${ gameMode === 'B' ? '#0984e3' : '#fff' };
                 color: ${ gameMode === 'B' ? '#fff' : '#0984e3' };
                 border-radius: 8px; font-size: 0.85rem; font-weight: bold; line-height: 1.4; transition: 0.2s;">
          下の句を見て<br>決まり字をタイプ
        </button>
        <button class="mode-select-btn" data-mode="C"
          style="width:160px; padding: 10px 16px; cursor: pointer; border: 2px solid #27ae60;
                 background: ${ gameMode === 'C' ? '#27ae60' : '#fff' };
                 color: ${ gameMode === 'C' ? '#fff' : '#27ae60' };
                 border-radius: 8px; font-size: 0.85rem; font-weight: bold; line-height: 1.4; transition: 0.2s;">
          下の句を見て<br>上の句をタイプ
        </button>
      </div>

      <p style="color: #666; margin-bottom: 8px; text-align: center;">札の色を選んでください</p>
      <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
        ${colors.map(c => `
          <button class="color-select-btn" data-color="${c}"
            style="padding: 8px 16px; cursor: pointer; border: 2px solid ${getColorCode(c)};
                   background: ${c === selectedColor ? getColorCode(c) : '#fff'};
                   color: ${c === selectedColor ? (c === '黄' ? '#333' : '#fff') : '#333'};
                   border-radius: 20px; font-weight: bold; transition: 0.2s;">
            ${c}
          </button>
        `).join('')}
      </div>

      <p style="color: #666; margin: 0 0 10px; text-align: center;">問題数を選んで開始</p>
      <div style="display: flex; justify-content: center; gap: 15px;">
        ${[3, 5, 10].map(num => `
          <button class="start-btn" data-num="${num}"
            style="width:80px; padding: 12px 0; font-size: 1rem; cursor: pointer;
                   background-color: #e8e0d4; color: #333; border: none;
                   border-radius: 8px; box-shadow: 0 4px 0 #b8a898;">
            ${num}問
          </button>
        `).join('')}
      </div>

      <div style="text-align:center; margin-top:24px;">
        <label style="font-size:1.1rem; color:#666; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
          <input type="checkbox" id="hide-typing-checkbox" ${hideTyping ? 'checked' : ''}
                 style="-webkit-appearance: auto; appearance: auto; width:1rem; height:1rem; cursor:pointer;">
          タイプする文字を隠す<br>（ホバー時は表示）
        </label>
      </div>
    </div>`;
}

// イベントリスナー
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
      alert("データがありません");
      return;
    }

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

// 問題作成
function nextQuestion() {
  if (solvedCount >= TOTAL_QUESTIONS) {
    showResults();
    return;
  }

  const song = songQueue[solvedCount];
  currentIdx = 0;

  if (gameMode === "A") {
    targetSong = {
      song,
      answer: song.type_shimonoku_kana_gendai || "",
      displayVerse: song.kami_no_ku || "",
      displayLabel: "上の句",
      revealVerse: song.shimo_no_ku_kana || "",
      revealLabel: "下の句",
      cardColor: getColorCode(song.color),
    };
  } else if (gameMode === "B") {
    targetSong = {
      song,
      answer: song.kimariji_head || "",
      displayVerse: song.shimo_no_ku || "",
      displayLabel: "下の句",
      revealVerse: song.kami_no_ku_kana || "",
      revealLabel: "上の句",
      cardColor: getColorCode(song.color),
    };
  } else {
    targetSong = {
      song,
      answer: song.type_kakminoku_kana_gendai || "",
      displayVerse: song.shimo_no_ku || "",
      displayLabel: "下の句",
      revealVerse: song.kami_no_ku_kana || "",
      revealLabel: "上の句",
      cardColor: getColorCode(song.color),
    };
  }

  // 答えの先頭スペースをスキップ
  while (currentIdx < targetSong.answer.length && targetSong.answer[currentIdx] === ' ') currentIdx++;

  gameActive = true;
  renderBoard();
  isPlaying = true;
  // モードBは問題表示時点からタイム計測、A/Cは最初のキー入力時から
  questionStartTime = gameMode === "B" ? Date.now() : null;
}

function renderBoard() {
  setPageHeaderVisible(false);
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <div id="typing-area" style="text-align:center; margin-top:20px; position:relative; font-family: 'Noto Sans JP', sans-serif;">

      <input type="text" id="mobile-input"
             inputmode="text"
             autocorrect="off"
             autocapitalize="off"
             autocomplete="off"
             spellcheck="false"
             style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; z-index:10; cursor:pointer;">

      <div id="card-display" style="border: 4px solid ${targetSong.cardColor}; padding: 10px; border-radius: 12px; display: inline-block; width: 90%; max-width: 350px; background: #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.05); position:relative; z-index:1;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
          <p style="color:#888; font-size:0.8rem; margin:0;">第 ${solvedCount + 1} 問 / ${TOTAL_QUESTIONS}</p>
          <p style="color:${targetSong.cardColor}; font-size:0.75rem; margin:0; font-weight:bold;">${targetSong.displayLabel}</p>
        </div>
        <div style="font-size:1.4rem; font-family:'Kaisei HarunoUmi', serif; margin:6px 0 0; line-height:1.8; color: #333;">
          ${targetSong.displayVerse}
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

// タイピング判定（フリック/かな入力 - toLowerCase不使用）
function handleInput(char) {
  if (!isPlaying) return;
  if (char === ' ') return; // 入力スペースは無視
  const targetKey = targetSong.answer[currentIdx];

  if (char === targetKey) {
    if (questionStartTime === null) questionStartTime = Date.now();
    currentIdx++;
    // 答えの途中のスペースをスキップ
    while (currentIdx < targetSong.answer.length && targetSong.answer[currentIdx] === ' ') currentIdx++;
    if (currentIdx >= targetSong.answer.length) {
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
    } else {
      updateDisplay();
    }
  } else {
    const area = document.getElementById('card-display');
    area.style.borderColor = "red";
    setTimeout(() => area.style.borderColor = targetSong.cardColor, 150);
  }
}

// PCキー
window.addEventListener('keydown', (e) => {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) handleInput(e.key);
});

// スマホ・フリック入力（ひらがなが入力値に現れた瞬間に処理）
document.addEventListener('input', (e) => {
  if (e.target.id === 'mobile-input') {
    const val = e.target.value;
    if (!val) return;
    // ひらがな文字のみ抽出して即処理（ローマ字変換中の中間状態は無視）
    const kana = val.replace(/[^ぁ-ゖ]/g, '');
    if (kana) {
      for (const char of [...kana]) handleInput(char);
      e.target.value = "";
    }
  }
});

function updateDisplay() {
  const tView = document.getElementById('type-view');
  if (!tView) return;
  const answer = targetSong.answer;
  const typed = answer.slice(0, currentIdx);
  const nextChar = currentIdx < answer.length ? answer[currentIdx] : '';
  const rest = answer.slice(currentIdx + 1);

  const isHidden = hideTyping && !typingAreaHovered;
  const dispNext = isHidden && nextChar ? '*' : nextChar;
  const dispRest = isHidden ? rest.replace(/./g, '*') : rest;

  tView.innerHTML = `
    <span style="color:#488056;">${typed}</span><span style="color:#B82343; border-bottom:3px solid #B82343; font-size:3rem">${dispNext}</span><span style="color:#ccc;">${dispRest}</span>
  `;
}

// 結果画面
function showResults() {
  isPlaying = false;
  gameActive = false;
  setPageHeaderVisible(false);

  function formatVerse(html) {
    return (html || '')
      .replace(/<br>/g, '　')
      .replace(/<span class='red'>/g, "<span style='color:#B82343;font-weight:bold;'>");
  }

  const wpmData = completedQuestions.map(q => {
    return Math.round(q.answer.length / (Math.max(q.timeTaken, 0.05) / 60));
  });
  const maxWpm = Math.max(...wpmData, 1);
  const avgKpm = Math.round(wpmData.reduce((a, b) => a + b, 0) / wpmData.length);

  const RANKS = [
    { min: 150, label: "歌聖" },
    { min: 100, label: "六歌仙" },
    { min: 50, label: "名人" },
    { min:  30, label: "歌詠み" },
    { min:   0, label: "手習い" },
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
        第${i + 1}問 — ${q.timeTaken.toFixed(2)}秒
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
      <p style="text-align:center; font-size:1rem; color:#666; margin:0 0 4px;">平均KPM: <strong>${avgKpm}</strong></p>
      <p style="text-align:center; font-size:1.4rem; font-weight:bold; margin:0 0 16px;">あなたは<span style="color:#B82343;">「${rank}」</span>です！</p>
      <div style="margin:0 auto 16px; max-width:260px; border:1px solid #e0d8c8; border-radius:8px; overflow:hidden; font-size:0.8rem;">
        <div style="background:#f5ede0; padding:4px 0; text-align:center; font-weight:bold; color:#666;">ランク表</div>
        ${[
          ["〜29", "手習い"],
          ["30〜49", "歌詠み"],
          ["50〜99", "名人"],
          ["100〜149", "六歌仙"],
          ["150〜", "歌聖"],
        ].map(([range, label]) => `
          <div style="display:flex; justify-content:space-between; padding:5px 16px;
                      background:${label === rank ? '#fff0f0' : '#fff'};
                      font-weight:${label === rank ? 'bold' : 'normal'};
                      color:${label === rank ? '#B82343' : '#333'};
                      border-top:1px solid #f0e8d8;">
            <span>${range} KPM</span><span>${label}</span>
          </div>`).join('')}
      </div>
      <div style="text-align:center;">
        <div style="text-align:center;"><div id="replay-button"></div></div>
      </div>
      <div style="margin:16px auto 0; max-width:420px; padding:0 8px;">
        <p style="text-align:center; color:#666; font-size:0.8rem; margin:0 0 6px;">タイピング速度（KPM）</p>
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

  document.getElementById('replay-button').onclick = () => location.reload();
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
