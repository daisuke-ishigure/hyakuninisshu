/* ============================================================
   決まり字シューター - kimariji-shooter.js
   PixiJS 7 + GSAP 3 を使用
   ============================================================ */

// ============================================================
// 定数
// ============================================================
let   CARD_COUNT   = 3;
let   CARD_W       = 110;
let   CARD_H       = 158;
const PLAYER_W     = 110;
const PLAYER_SPEED = 16;
const ALIGN_RANGE  = 58;
const TIMER_SEC    = 6;

const DIFFICULTIES = {
  easy:   { cardCount: 2, spawnGap: 1400, respawn: 1200, fallMax: 22, fallMin: 14, accelScore: 10000 },
  normal: { cardCount: 3, spawnGap: 1400, respawn: 1200, fallMax: 22, fallMin: 14, accelScore: 10000 },
  hard:   { cardCount: 4, spawnGap: 1400, respawn: 1200, fallMax: 22, fallMin: 14, accelScore: 10000 },
};

// ============================================================
// ゲーム状態
// ============================================================
let allValidPoems  = [];
let gameInitialized = false;

const COLOR_BG = {
  '青':     '#ddeeff',
  'ピンク': '#ffe4f0',
  '黄':     '#fff6cc',
  '緑':     '#d6f5e3',
  'オレンジ': '#ffeedd',
};

const state = {
  score: 0,
  combo: 0,
  difficulty: 'normal',
  colorFilter: '全部',
  playerX: 0,
  moveLeft: false,
  moveRight: false,
  cards: [],
  poemPool: [],
  shownCards: [],
  targetCard: null,
  timerStart: null,
  timerActive: false,
  cooldownUntil: 0,
  currentChoices: [],
  selectedChoiceIndex: 0,
  choiceMode: 'kimariji',
  tiltVelocity: 0,
  orientationEnabled: false,
  pixiApp: null,
  running: false,
};

// ============================================================
// 画面幅に応じてカードサイズを設定（CSS の breakpoint と同期）
// ============================================================
function initCardSize() {
  if (window.innerWidth > 1000) {
    CARD_W = 140; CARD_H = 202;
  } else if (window.innerWidth > 600) {
    CARD_W = 110; CARD_H = 158;
  } else {
    CARD_W = 100; CARD_H = 144;
  }
}

// ゲームセクション参照
function getGameSection() { return document.getElementById('game-section'); }
function getGameWidth()   { return getGameSection().clientWidth; }
function getGameHeight()  { return getGameSection().clientHeight; }

// 危険ラインの CSS bottom 値
function getDangerBottom() {
  return window.innerWidth <= 600 ? 30 : 34;
}

// ゲームエリア（最大 900px・中央寄せ）
function getGameArea() {
  const w = Math.min(900, getGameWidth());
  return { left: (getGameWidth() - w) / 2, width: w };
}

// ============================================================
// 色フィルター適用後の歌リストを返す
// ============================================================
function getFilteredPoems() {
  if (state.colorFilter === '全部') return allValidPoems;
  return allValidPoems.filter(p => p.color === state.colorFilter);
}

// ============================================================
// 難易度設定
// ============================================================
function setDifficulty(diff) {
  state.difficulty = diff;
  document.querySelectorAll('.diff-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.diff === diff);
  });
}

function setChoiceMode(mode) {
  state.choiceMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.mode === mode);
  });
}

// ============================================================
// 起動
// ============================================================
async function init() {
  initCardSize();

  const res = await fetch('js/kimariji.json?v2');
  const all = await res.json();
  allValidPoems = all.filter(p => /^[ぁ-ん]+$/.test(p.kimariji_head));
  state.poemPool = shuffle([...allValidPoems]);

  setupInput();

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
  });

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setChoiceMode(btn.dataset.mode));
  });

  document.getElementById('start-btn').addEventListener('click', async () => {
    await requestOrientationPermission();
    startGame();
  });

  document.getElementById('retry-btn').addEventListener('click', () => {
    document.getElementById('game-result').classList.add('hidden');
    document.getElementById('shown-cards-section').classList.add('hidden');
    document.getElementById('retry-btn').classList.add('hidden');
    document.getElementById('start-btn').classList.remove('hidden');
  });
}

// ============================================================
// ゲーム開始 / リスタート
// ============================================================
function startGame() {
  // ゲームオーバー後の表示をリセット
  document.getElementById('game-result').classList.add('hidden');
  document.getElementById('start-btn').classList.remove('hidden');
  document.getElementById('retry-btn').classList.add('hidden');
  document.getElementById('start-section').classList.add('hidden');
  document.getElementById('game-section').classList.remove('hidden');
  document.body.classList.add('game-active');

  initCardSize();

  // PixiJS と星空は初回のみセットアップ
  if (!gameInitialized) {
    setupPixi();
    setupStars();
    gameInitialized = true;
  }

  // 前回のカードを全削除
  for (const card of state.cards) {
    if (card.fallTween) card.fallTween.kill();
    gsap.killTweensOf(card.el);
    card.el.remove();
  }
  state.cards = [];

  CARD_COUNT          = DIFFICULTIES[state.difficulty].cardCount;
  state.colorFilter   = document.getElementById('color-select').value;
  state.score         = 0;
  state.combo         = 0;
  state.shownCards    = [];
  const ga = getGameArea();
  state.playerX       = ga.left + ga.width / 2;
  state.running       = true;
  state.timerActive   = false;
  state.cooldownUntil = 0;
  state.targetCard    = null;

  state.poemPool = shuffle([...getFilteredPoems()]);

  hideChoiceButtons();
  updateScoreUI();
  updatePlayerDOM();

  const gap = DIFFICULTIES[state.difficulty].spawnGap;
  for (let slot = 0; slot < CARD_COUNT; slot++) {
    setTimeout(() => spawnCard(slot), slot * gap);
  }

  state.pixiApp.ticker.remove(gameLoop);
  state.pixiApp.ticker.add(gameLoop);
}

// ============================================================
// ゲームループ
// ============================================================
function gameLoop() {
  if (!state.running) return;
  movePLayer();
  checkAlignment();
  updateTimer();
  checkGameOver();
}

// ============================================================
// ゲームオーバー判定
// ============================================================
function checkGameOver() {
  const threshold = getGameHeight() - getDangerBottom() - CARD_H;
  for (const card of state.cards) {
    if (card.state !== 'falling') continue;
    if (gsap.getProperty(card.el, 'y') > threshold) {
      triggerGameOver();
      return;
    }
  }
}

function triggerGameOver() {
  state.running = false;
  state.pixiApp.ticker.remove(gameLoop);
  hideChoiceButtons();

  const thunder = new Audio('sound/kaminari.mp3');
  thunder.volume = 0.7;
  thunder.play().catch(() => {});

  // 雨・雷演出が終わる頃にフェードアウトして停止
  setTimeout(() => {
    const fadeOut = setInterval(() => {
      if (thunder.volume > 0.05) {
        thunder.volume = Math.max(0, thunder.volume - 0.05);
      } else {
        thunder.pause();
        clearInterval(fadeOut);
      }
    }, 50);
  }, 1700);

  for (const card of state.cards) {
    if (card.fallTween) card.fallTween.kill();
    gsap.killTweensOf(card.el);
    gsap.to(card.el, { opacity: 0, duration: 0.5 });
  }

  // 雨・雷演出（2000ms）
  spawnRainAndLightning(2000);

  // ゲームオーバーメッセージをフェードイン
  const msg = document.getElementById('gameover-msg');
  gsap.killTweensOf(msg);
  gsap.fromTo(msg, { opacity: 0 }, {
    opacity: 1, duration: 0.55, delay: 0.2, ease: 'power2.out',
  });

  setTimeout(() => {
    gsap.to(msg, { opacity: 0, duration: 0.3 });

    for (const card of state.cards) card.el.remove();
    state.cards = [];
    const correctCount = state.shownCards.filter(e => e.result === 'correct').length;
    document.getElementById('final-score-display').textContent = correctCount;
    setDifficulty(state.difficulty);
    // スコアとリトライボタンを表示し、スタート画面に戻る
    document.getElementById('game-result').classList.remove('hidden');
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('retry-btn').classList.remove('hidden');
    document.getElementById('game-section').classList.add('hidden');
    document.body.classList.remove('game-active');
    document.getElementById('start-section').classList.remove('hidden');
    renderShownCardsTable();
  }, 2200);
}

// ============================================================
// クリア演出（10枚正解）
// ============================================================
function triggerClear() {
  hideChoiceButtons();

  const renzoku = new Audio('sound/hanabi_renzoku.mp3');
  renzoku.volume = 0.8;
  renzoku.play().catch(() => {});

  const w = getGameWidth();
  const h = getGameHeight();

  // 花火を画面各所に連続で打ち上げ
  const bursts = [
    { xr: 0.5,  yr: 0.5,  delay: 0    },
    { xr: 0.25, yr: 0.35, delay: 350  },
    { xr: 0.75, yr: 0.35, delay: 650  },
    { xr: 0.15, yr: 0.6,  delay: 950  },
    { xr: 0.85, yr: 0.6,  delay: 1200 },
    { xr: 0.5,  yr: 0.22, delay: 1500 },
    { xr: 0.35, yr: 0.65, delay: 1750 },
    { xr: 0.65, yr: 0.65, delay: 2000 },
  ];
  bursts.forEach(({ xr, yr, delay }) => {
    setTimeout(() => {
      spawnFirework(w * xr, h * yr, 1.8 + Math.random() * 1.4);
      playHanabiSound();
    }, delay);
  });

  // めでたし 文字を表示
  const msg = document.getElementById('clear-msg');
  gsap.killTweensOf(msg);
  gsap.fromTo(msg, { opacity: 0 }, {
    opacity: 1, duration: 0.8, delay: 0.4, ease: 'power2.out',
  });

  // スタート画面へ戻る
  setTimeout(() => {
    gsap.to(msg, { opacity: 0, duration: 0.5 });
    for (const card of state.cards) card.el.remove();
    state.cards = [];
    const correctCount = state.shownCards.filter(e => e.result === 'correct').length;
    document.getElementById('final-score-display').textContent = correctCount;
    setDifficulty(state.difficulty);
    document.getElementById('game-result').classList.remove('hidden');
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('retry-btn').classList.remove('hidden');
    document.getElementById('game-section').classList.add('hidden');
    document.body.classList.remove('game-active');
    document.getElementById('start-section').classList.remove('hidden');
    renderShownCardsTable();
  }, 3800);
}

// ============================================================
// PixiJS 初期化（ゲームセクション内に挿入、透過背景）
// ============================================================
function setupPixi() {
  const section = getGameSection();
  const app = new PIXI.Application({
    width: section.clientWidth,
    height: section.clientHeight,
    backgroundAlpha: 0,
    resizeTo: section,
    antialias: true,
    resolution: Math.min(devicePixelRatio, 2),
    autoDensity: true,
  });
  // 星フィールドの直後に挿入（z-index: 2 で星の上に重なる）
  const starField = document.getElementById('star-field');
  starField.insertAdjacentElement('afterend', app.view);
  state.pixiApp = app;
}

// ============================================================
// 星空（CSS アニメーション）
// ============================================================
function setupStars() {
  const field = document.getElementById('star-field');
  for (let i = 0; i < 130; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    const size = 0.7 + Math.random() * 2.2;
    star.style.cssText =
      `left:${Math.random() * 100}%;` +
      `top:${Math.random() * 100}%;` +
      `width:${size}px;height:${size}px;` +
      `animation-duration:${1.8 + Math.random() * 4}s;` +
      `animation-delay:${-(Math.random() * 4)}s;`;
    field.appendChild(star);
  }
}

// ============================================================
// 台座（プレイヤー）
// ============================================================
function movePLayer() {
  const ga = getGameArea();
  const max = ga.left + ga.width - PLAYER_W / 2;
  const min = ga.left + PLAYER_W / 2;
  let dx = 0;
  if (state.moveLeft)  dx -= PLAYER_SPEED;
  if (state.moveRight) dx += PLAYER_SPEED;
  dx += state.tiltVelocity;
  if (dx !== 0) {
    state.playerX = Math.max(min, Math.min(max, state.playerX + dx));
    updatePlayerDOM();
  }
}

function updatePlayerDOM() {
  document.getElementById('player').style.left = (state.playerX - PLAYER_W / 2) + 'px';
}

// ============================================================
// 落下速度（スコア増加で徐々に速くなる）
// ============================================================
function getFallDuration() {
  const d = DIFFICULTIES[state.difficulty];
  const ratio = Math.min(1, state.score / d.accelScore);
  return d.fallMax - (d.fallMax - d.fallMin) * ratio;
}

// ============================================================
// 札の生成（上から落下）
// ============================================================
function spawnCard(slot) {
  if (state.poemPool.length === 0) {
    const activeIds = new Set(state.cards.map(c => c.data.id));
    state.poemPool = shuffle(getFilteredPoems().filter(p => !activeIds.has(p.id)));
    if (state.poemPool.length === 0) return;
  }

  const poem = state.poemPool.shift();
  const resultEntry = { poem, result: 'missed' };
  state.shownCards.push(resultEntry);
  const ga = getGameArea();
  const slotCenterX = ga.left + (ga.width / CARD_COUNT) * (slot + 0.5);
  const startY = -CARD_H - 20;

  const el = document.createElement('div');
  el.className = 'card';
  const textEl = document.createElement('div');
  textEl.className = 'card-text';
  textEl.textContent = htmlToPlainText(poem.shimo_no_ku);
  el.appendChild(textEl);
  document.getElementById('card-area').appendChild(el);

  const swingAmp = 6 + Math.random() * 5;
  const swingDir = Math.random() < 0.5 ? 1 : -1;

  gsap.set(el, {
    x: slotCenterX - CARD_W / 2,
    y: startY,
    opacity: 0,
    rotation: swingDir * swingAmp * 0.5,
  });

  gsap.to(el, { opacity: 1, duration: 0.4, delay: 0.1 });

  const fallTween = gsap.to(el, {
    y: getGameHeight() + CARD_H,
    duration: getFallDuration(),
    ease: 'none',
    delay: 0.15,
  });

  const swingTween = gsap.to(el, {
    rotation: -swingDir * swingAmp,
    duration: 1.1 + Math.random() * 0.7,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  state.cards.push({ slot, slotCenterX, data: poem, el, fallTween, swingTween, state: 'falling', resultEntry });
}

// ============================================================
// 整列判定（ハイライトのみ・選択肢はロック操作で表示）
// ============================================================
function checkAlignment() {
  if (state.timerActive) return;

  let closest = null;
  let closestDist = ALIGN_RANGE;

  for (const card of state.cards) {
    if (card.state !== 'falling') continue;
    if (gsap.getProperty(card.el, 'y') < -CARD_H + 20) continue;
    const dist = Math.abs(card.slotCenterX - state.playerX);
    if (dist < closestDist) { closestDist = dist; closest = card; }
  }

  if (closest === state.targetCard) return;

  if (state.targetCard) {
    state.targetCard.el.classList.remove('targeted');
  }

  state.targetCard = closest;
  if (closest) {
    closest.el.classList.add('targeted');
  }
}

// ============================================================
// 台座ロック（タップ or ↑ キー）→ 選択肢を表示
// ============================================================
function tryLockCard() {
  if (!state.running || state.timerActive) return;
  if (Date.now() < state.cooldownUntil) return;
  if (!state.targetCard || state.targetCard.state !== 'falling') return;
  showChoiceButtons(state.targetCard);
}

// ============================================================
// 3択ボタン（縦並び）
// ============================================================
function showChoiceButtons(card) {
  const isKami = state.choiceMode === 'kami';

  let correct, wrongs;
  if (isKami) {
    const brToSpace = html => html.replace(/<br\s*\/?>/gi, ' ');
    correct = brToSpace(card.data.kami_no_ku);
    wrongs = shuffle(allValidPoems.filter(p => p.id !== card.data.id))
      .slice(0, 2).map(p => brToSpace(p.kami_no_ku));
  } else {
    correct = card.data.kimariji_head;
    wrongs = shuffle(allValidPoems.filter(
      p => p.id !== card.data.id && p.kimariji_head !== correct
    )).slice(0, 2).map(p => p.kimariji_head);
  }

  const choices = shuffle([
    { text: correct,   isCorrect: true  },
    { text: wrongs[0], isCorrect: false },
    { text: wrongs[1], isCorrect: false },
  ]);
  state.currentChoices      = choices;
  state.selectedChoiceIndex = 0;

  const wrap = document.getElementById('choices-wrap');
  wrap.innerHTML = '';
  wrap.classList.toggle('kami-mode', isKami);
  document.getElementById('kimari-area').classList.toggle('kami-mode', isKami);
  choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    if (isKami) {
      btn.innerHTML = choice.text;
    } else {
      btn.textContent = choice.text;
    }
    btn.dataset.index = i;
    btn.addEventListener('click',    () => pressChoice(i));
    btn.addEventListener('touchend', e => { e.preventDefault(); pressChoice(i); });
    wrap.appendChild(btn);
  });

  wrap.classList.remove('hidden');
  updateChoiceHighlight();

  document.getElementById('timer-bar-wrap').style.display = 'block';
  document.getElementById('timer-bar').style.width      = '100%';
  document.getElementById('timer-bar').style.background = '#4caf50';
  state.timerStart  = Date.now();
  state.timerActive = true;

  gsap.fromTo(wrap.querySelectorAll('.choice-btn'),
    { scaleY: 0.5, opacity: 0 },
    { scaleY: 1, opacity: 1, duration: 0.18, ease: 'back.out(2)', stagger: 0.07 }
  );
}

function hideChoiceButtons() {
  document.getElementById('choices-wrap').classList.add('hidden');
  document.getElementById('choices-wrap').innerHTML = '';
  document.getElementById('choices-wrap').classList.remove('kami-mode');
  document.getElementById('kimari-area').classList.remove('kami-mode');
  document.getElementById('timer-bar-wrap').style.display = 'none';
  state.timerActive    = false;
  state.timerStart     = null;
  state.currentChoices = [];
}

function pressChoice(index) {
  if (!state.timerActive) return;
  const choice = state.currentChoices[index];
  if (!choice) return;

  if (choice.isCorrect) {
    onCorrectAnswer();
  } else {
    const btns = document.querySelectorAll('.choice-btn');
    if (btns[index]) btns[index].classList.add('wrong-flash');
    state.timerActive = false;
    setTimeout(() => onWrongAnswer(), 380);
  }
}

function updateChoiceHighlight() {
  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === state.selectedChoiceIndex);
  });
}

// ============================================================
// タイマー更新
// ============================================================
function updateTimer() {
  if (!state.timerActive || !state.timerStart) return;
  const elapsed   = (Date.now() - state.timerStart) / 1000;
  const remaining = Math.max(0, TIMER_SEC - elapsed);
  const ratio     = remaining / TIMER_SEC;

  document.getElementById('timer-bar').style.width = (ratio * 100) + '%';
  if      (ratio > 0.5)  document.getElementById('timer-bar').style.background = '#4caf50';
  else if (ratio > 0.25) document.getElementById('timer-bar').style.background = '#ff9800';
  else                   document.getElementById('timer-bar').style.background = '#f44336';

  if (remaining <= 0) onWrongAnswer();
}

// ============================================================
// 正解処理 — 花火として打ち上げ
// ============================================================
function onCorrectAnswer() {
  const card = state.targetCard;
  if (!card || card.state !== 'falling') return;

  playHanabiSound();

  const currentY = gsap.getProperty(card.el, 'y');
  const screenH  = getGameHeight();

  const ratio   = Math.max(0, Math.min(1, 1 - currentY / screenH));
  const fwScale = 0.4 + ratio * 2.2;

  card.state = 'launching';
  card.fallTween.kill();
  if (card.swingTween) card.swingTween.kill();
  if (card.resultEntry) card.resultEntry.result = 'correct';
  state.targetCard = null;
  card.el.classList.remove('targeted');
  hideChoiceButtons();

  state.combo++;
  const heightBonus = Math.floor(ratio * 300);
  state.score += (100 + heightBonus) * Math.max(1, state.combo);
  updateScoreUI();
  showComboEffect();

  const correctCount = state.shownCards.filter(e => e.result === 'correct').length;
  const isClear = correctCount >= 10;
  if (isClear) {
    state.running = false;
    state.pixiApp.ticker.remove(gameLoop);
  }

  const launchCX = card.slotCenterX;

  let trailId = setInterval(() => {
    if (!card.el.parentNode) { clearInterval(trailId); return; }
    spawnTrailParticles(launchCX, gsap.getProperty(card.el, 'y') + CARD_H / 2);
  }, 35);

  gsap.to(card.el, {
    y: -CARD_H - 40,
    rotation: `+=${20 + Math.random() * 25}`,
    opacity: 0,
    duration: 0.85,
    ease: 'power2.in',
    onComplete: () => {
      clearInterval(trailId);
      card.el.remove();
      state.cards = state.cards.filter(c => c !== card);
      const explodeY = window.innerWidth <= 600
        ? screenH / 2
        : Math.max(40, currentY - screenH * ratio * 0.65);
      if (isClear) {
        setTimeout(() => {
          spawnFirework(getGameWidth() / 2, explodeY, fwScale);
          triggerClear();
        }, 1000);
      } else {
        replenishCard(card.slot);
        setTimeout(() => spawnFirework(getGameWidth() / 2, explodeY, fwScale), 1000);
      }
    },
  });
}

// ============================================================
// 不正解処理
// ============================================================
function onWrongAnswer() {
  const card = state.targetCard;
  state.targetCard = null;
  state.combo = 0;
  updateScoreUI();
  hideChoiceButtons();
  state.cooldownUntil = Date.now() + 5000; // 揺れ終了時にクリア

  if (!card || card.state !== 'falling') return;
  card.el.classList.remove('targeted');

  gsap.to(card.el, {
    x: `+=${14}`,
    duration: 0.07,
    ease: 'power1.inOut',
    yoyo: true, repeat: 7,
    onComplete: () => {
      gsap.set(card.el, { x: card.slotCenterX - CARD_W / 2 });
      state.cooldownUntil = 0;
    },
  });

  gsap.to(card.el, {
    filter: 'brightness(0.3)',
    duration: 0.1,
    yoyo: true, repeat: 3,
    onComplete: () => gsap.set(card.el, { filter: 'none' }),
  });

  spawnInkParticles(card.slotCenterX, gsap.getProperty(card.el, 'y') + CARD_H / 2);
}

// ============================================================
// 札の補充（難易度に応じた遅延）
// ============================================================
function replenishCard(slot) {
  if (!state.running) return;
  const delay = DIFFICULTIES[state.difficulty].respawn;
  setTimeout(() => { if (state.running) spawnCard(slot); }, delay);
}

// ============================================================
// エフェクト — 打ち上げトレイル
// ============================================================
function spawnTrailParticles(cx, cy) {
  const app = state.pixiApp;
  for (let i = 0; i < 3; i++) {
    const gfx = new PIXI.Graphics();
    gfx.beginFill(0xfff0a0, 0.65 + Math.random() * 0.35);
    gfx.drawCircle(0, 0, 0.8 + Math.random() * 1.4);
    gfx.endFill();
    gfx.x = cx + (Math.random() - 0.5) * CARD_W * 0.55;
    gfx.y = cy + (Math.random() - 0.5) * 12;
    app.stage.addChild(gfx);
    gsap.to(gfx, {
      y: gfx.y + 18 + Math.random() * 22,
      alpha: 0,
      duration: 0.3 + Math.random() * 0.22,
      onComplete: () => { if (gfx.parent) app.stage.removeChild(gfx); },
    });
  }
}

// ============================================================
// エフェクト — 花火爆発
// ============================================================
function spawnFirework(cx, cy, scale) {
  const app = state.pixiApp;
  const particles = [];

  const count    = Math.floor(38 + scale * 52);
  const maxSpeed = 2.8 + scale * 5.0;

  const palettes = [
    [0xf0c040, 0xffe080, 0xffffff],
    [0xff6080, 0xff2840, 0xffc0c0],
    [0x60aaff, 0x3060ff, 0xb0d0ff],
    [0x50ff80, 0x28b050, 0xb0ffcc],
    [0xff80f0, 0xff28c0, 0xffc0f0],
    [0xff8830, 0xff4010, 0xffbb80],
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];

  // 閃光
  const flash = new PIXI.Graphics();
  flash.beginFill(0xffffff, 0.9);
  flash.drawCircle(0, 0, Math.max(8, 18 * scale));
  flash.endFill();
  flash.x = cx; flash.y = cy;
  app.stage.addChild(flash);
  gsap.to(flash, {
    alpha: 0, duration: 0.22,
    onComplete: () => { if (flash.parent) app.stage.removeChild(flash); },
  });

  // メインバースト
  for (let i = 0; i < count; i++) {
    const gfx = new PIXI.Graphics();
    const color = palette[Math.floor(Math.random() * palette.length)];
    const r = Math.max(1, (1.2 + Math.random() * 1.8) * Math.min(scale * 0.7, 1.8));
    gfx.beginFill(color, 0.95);
    gfx.drawCircle(0, 0, r);
    gfx.endFill();
    gfx.x = cx + (Math.random() - 0.5) * 6;
    gfx.y = cy + (Math.random() - 0.5) * 6;
    app.stage.addChild(gfx);

    const angle = Math.random() * Math.PI * 2;
    const speed = (0.35 + Math.random() * 0.9) * maxSpeed;
    particles.push({
      gfx, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 1.0, decay: 0.0045 + Math.random() * 0.007,
    });
  }

  // スパークルリング
  const ringCount = Math.floor(7 + scale * 5);
  for (let i = 0; i < ringCount; i++) {
    const gfx = new PIXI.Graphics();
    gfx.beginFill(0xffffff, 0.88);
    gfx.drawCircle(0, 0, 1.0 + Math.random() * 0.8);
    gfx.endFill();
    gfx.x = cx; gfx.y = cy;
    app.stage.addChild(gfx);

    const angle = (i / ringCount) * Math.PI * 2;
    const speed = maxSpeed * (1.15 + Math.random() * 0.35);
    particles.push({
      gfx, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 1.0, decay: 0.009 + Math.random() * 0.006,
    });
  }

  const tick = () => {
    let anyAlive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      p.life -= p.decay;
      p.vy  += 0.05; p.vx *= 0.994;
      p.gfx.x += p.vx; p.gfx.y += p.vy;
      p.gfx.alpha = Math.max(0, p.life * p.life);
      if (p.life > 0) anyAlive = true;
    }
    if (!anyAlive) {
      app.ticker.remove(tick);
      particles.forEach(p => { if (p.gfx.parent) app.stage.removeChild(p.gfx); });
    }
  };
  app.ticker.add(tick);
}

// ============================================================
// エフェクト — 不正解時の墨パーティクル
// ============================================================
function spawnInkParticles(cx, cy) {
  const app = state.pixiApp;
  const particles = [];

  for (let i = 0; i < 14; i++) {
    const gfx = new PIXI.Graphics();
    gfx.beginFill(0x0a0208, 0.6 + Math.random() * 0.3);
    gfx.drawCircle(0, 0, 2 + Math.random() * 5);
    gfx.endFill();
    gfx.x = cx + (Math.random() - 0.5) * 60;
    gfx.y = cy + (Math.random() - 0.5) * 40;
    app.stage.addChild(gfx);

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    particles.push({
      gfx, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 1.0, decay: 0.015 + Math.random() * 0.01,
    });
  }

  const tick = () => {
    let anyAlive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      p.life -= p.decay;
      p.vy  += 0.04;
      p.gfx.x += p.vx; p.gfx.y += p.vy;
      p.gfx.alpha = Math.max(0, p.life);
      if (p.life > 0) anyAlive = true;
    }
    if (!anyAlive) {
      app.ticker.remove(tick);
      particles.forEach(p => { if (p.gfx.parent) app.stage.removeChild(p.gfx); });
    }
  };
  app.ticker.add(tick);
}

// ============================================================
// ============================================================
// ゲーム終了後：出題された札テーブルを描画
// ============================================================
function renderShownCardsTable() {
  const tbody = document.getElementById('shown-cards-tbody');
  tbody.innerHTML = '';

  const correctCount = state.shownCards.filter(e => e.result === 'correct').length;
  const total = state.shownCards.length;
  document.getElementById('result-summary').textContent =
    document.documentElement.lang === 'en'
      ? `${correctCount} correct out of ${total}`
      : `${total}問中 ${correctCount}問正解`;

  state.shownCards.slice(0, 10).forEach(({ poem, result }, i) => {
    const tr = document.createElement('tr');
    tr.style.background = result === 'correct' ? '#eaf7ee' : '#fdf0f0';

    const tdResult = document.createElement('td');
    tdResult.textContent = result === 'correct' ? '○' : '×';
    tdResult.className = result === 'correct' ? 'result-correct' : 'result-missed';

    const tdNum   = document.createElement('td');
    const tdId    = document.createElement('td');
    const tdKami  = document.createElement('td');
    const tdShimo = document.createElement('td');

    tdNum.textContent   = i + 1;
    tdId.textContent    = poem.id;
    tdKami.innerHTML    = poem.kami_no_ku_kana;
    tdShimo.innerHTML   = poem.shimo_no_ku.replace(/<br>/g, '\n');

    tr.append(tdResult, tdNum, tdId, tdKami, tdShimo);
    tbody.appendChild(tr);
  });

  document.getElementById('shown-cards-section').classList.remove('hidden');
}

// サウンド — 花火
// ============================================================
function playHanabiSound() {
  const audio = new Audio('sound/hanabi.mp3');
  audio.volume = 0.55;
  audio.play().catch(() => {});
}

// ============================================================
// エフェクト — ゲームオーバー時の雨・雷
// ============================================================
function spawnRainAndLightning(durationMs) {
  const app = state.pixiApp;
  const w = getGameWidth(), h = getGameHeight();

  // 雨粒
  const NUM_DROPS = 140;
  const drops = [];
  for (let i = 0; i < NUM_DROPS; i++) {
    const gfx = new PIXI.Graphics();
    const len = 14 + Math.random() * 14;
    gfx.lineStyle(1, 0x99ccff, 0.35 + Math.random() * 0.45);
    gfx.moveTo(0, 0);
    gfx.lineTo(2, len);
    gfx.x = Math.random() * w;
    gfx.y = Math.random() * h;
    app.stage.addChild(gfx);
    drops.push({ gfx, speed: 10 + Math.random() * 7 });
  }

  const rainTick = () => {
    for (const d of drops) {
      d.gfx.x += 1.8;
      d.gfx.y += d.speed;
      if (d.gfx.y > h + 30) { d.gfx.x = Math.random() * w; d.gfx.y = -20; }
    }
  };
  app.ticker.add(rainTick);

  // 雷
  let boltCount = 0;
  function doLightning() {
    if (boltCount >= 3) return;
    boltCount++;

    // 画面フラッシュ
    const flash = new PIXI.Graphics();
    flash.beginFill(0xddeeff, 0.55);
    flash.drawRect(0, 0, w, h);
    flash.endFill();
    app.stage.addChild(flash);
    gsap.to(flash, { alpha: 0, duration: 0.14,
      onComplete: () => { if (flash.parent) app.stage.removeChild(flash); } });

    // 稲妻（ジグザグ線）
    const bolt = new PIXI.Graphics();
    bolt.lineStyle(1.5 + Math.random() * 2, 0xe8f0ff, 1.0);
    let bx = w * (0.2 + Math.random() * 0.6), by = 0;
    bolt.moveTo(bx, by);
    while (by < h * 0.75) {
      bx += (Math.random() - 0.5) * 70;
      by += 18 + Math.random() * 28;
      bolt.lineTo(bx, by);
    }
    app.stage.addChild(bolt);
    gsap.to(bolt, { alpha: 0, duration: 0.28, delay: 0.06,
      onComplete: () => { if (bolt.parent) app.stage.removeChild(bolt); } });

    if (boltCount < 3) setTimeout(doLightning, 350 + Math.random() * 450);
  }
  setTimeout(doLightning, 120);

  // 指定時間後に雨を片付ける
  setTimeout(() => {
    app.ticker.remove(rainTick);
    drops.forEach(d => { if (d.gfx.parent) app.stage.removeChild(d.gfx); });
  }, durationMs);
}

// ============================================================
// 入力処理
// ============================================================
function setupInput() {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') state.moveLeft  = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.moveRight = true;

    if (!state.timerActive && (e.key === 'ArrowUp' || e.key === ' ')) {
      e.preventDefault();
      tryLockCard();
    }

    if (state.timerActive) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.selectedChoiceIndex = (state.selectedChoiceIndex - 1 + 3) % 3;
        updateChoiceHighlight();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.selectedChoiceIndex = (state.selectedChoiceIndex + 1) % 3;
        updateChoiceHighlight();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        pressChoice(state.selectedChoiceIndex);
      }
    }
  });

  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') state.moveLeft  = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.moveRight = false;
  });

  // 台座タップでロック
  const playerEl = document.getElementById('player');
  playerEl.addEventListener('touchend', e => { e.preventDefault(); tryLockCard(); });
  playerEl.addEventListener('click', () => tryLockCard());

  let touchX = 0;
  document.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!state.running || state.orientationEnabled) return;
    const dx = e.touches[0].clientX - touchX;
    touchX = e.touches[0].clientX;
    const ga = getGameArea();
    const max = ga.left + ga.width - PLAYER_W / 2;
    const min = ga.left + PLAYER_W / 2;
    state.playerX = Math.max(min, Math.min(max, state.playerX + dx));
    updatePlayerDOM();
  }, { passive: true });
}

// ============================================================
// 傾きセンサー
// ============================================================
async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent === 'undefined') return;
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === 'granted') activateOrientationSensor();
    } catch (e) { /* 拒否時はタッチ操作にフォールバック */ }
  } else {
    activateOrientationSensor();
  }
}

function activateOrientationSensor() {
  window.addEventListener('deviceorientation', e => {
    if (!state.running || e.gamma === null) return;
    const tilt = e.gamma;
    if (Math.abs(tilt) < 3) { state.tiltVelocity = 0; return; }
    // 3°〜45° で 0〜PLAYER_SPEED に線形スケール、45°超えは最大速度
    const ratio = Math.min(1, (Math.abs(tilt) - 3) / 42);
    state.tiltVelocity = Math.sign(tilt) * ratio * PLAYER_SPEED;
  });
  state.orientationEnabled = true;
}

// ============================================================
// UI 更新
// ============================================================
function updateScoreUI() {}

function showComboEffect() {}

// ============================================================
// ユーティリティ
// ============================================================
function htmlToPlainText(html) {
  return html
    .replace(/<rt>[\s\S]*?<\/rt>/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .trim();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

init();
