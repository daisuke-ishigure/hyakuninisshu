/* ============================================================
   上の句だんご - kaminoku-dango.js
   下の句をお題にして、上の句（三句）を順番に串へ刺していくゲーム。
   jokotoba-dango.js のゲームエンジンを流用し、データは五句並べ
   （js/kaminoku.json）から読み込む。
   PixiJS 7 + GSAP 3 を使用
   ============================================================ */

// ============================================================
// 定数
// ============================================================
let CARD_WIDTH = 108;

const DIFFICULTIES = {
  easy:   { laneCount: 2, fallMax: 15, fallMin: 12, spawnGap: 1900 },
  normal: { laneCount: 3, fallMax: 13, fallMin: 10, spawnGap: 1600 },
  hard:   { laneCount: 4, fallMax: 11, fallMin: 8,  spawnGap: 1300 },
};

const DANGO_COLORS = ['color-pink', 'color-white', 'color-green'];
const CLEAR_TARGET = 5; // このお団子の数を完成させたら大花火クリア演出
const KUSHI_SPEED = 16;   // 串の移動速度(px/フレーム)
const ALIGN_RANGE  = 60;  // 「今狙っている札」をハイライト・突き上げで狙える範囲(px)

// 串の団子数が少ないほど団子を大きく描く（[直径px, 団子どうしの重なりpx]）
const DANGO_SIZE_TABLE = {
  pc:     { 2: [110, 7],  3: [76, 7],  4: [59, 7]  },
  base:   { 2: [90, 6],   3: [62, 6],  4: [48, 6]  },
  mobile: { 2: [80, 5],   3: [55, 5],  4: [43, 5]  },
};
// #dango-stack の bottom オフセット（串の持ち手部分）と同じ値
const DANGO_HANDLE = { pc: 46, base: 36, mobile: 30 };

function getSizeTier() {
  if (window.innerWidth > 1000) return 'pc';
  if (window.innerWidth > 600) return 'base';
  return 'mobile';
}

function getDangoBallMetrics(segmentCount) {
  const tier = getSizeTier();
  const table = DANGO_SIZE_TABLE[tier];
  const n = Math.min(4, Math.max(2, segmentCount));
  return { size: table[n][0], overlap: table[n][1] };
}

// 串を「完成時の団子の高さぴったり」に合わせ、先端が団子で隠れるようにする
function updateKushiHeight() {
  if (!state.currentPoem) return;
  const segCount = state.currentPoem.segments.length;
  const tier = getSizeTier();
  const { size, overlap } = getDangoBallMetrics(segCount);
  // flex-direction:column-reverse + margin-bottom:-overlap は各要素すべてに
  // 適用される（先頭要素もコンテナ端でオーバーラップ分めり込む）ため、
  // 実際の描画高さは N×(size-overlap) になる（N-1個分ではない）
  const stackHeight = segCount * (size - overlap);
  const kushi = document.getElementById('kushi');
  if (kushi) kushi.style.height = (DANGO_HANDLE[tier] + stackHeight) + 'px';
}

// 串の「持ち手部分を除いた、実際に団子が並ぶ範囲」の下端Y（#dango-areaのbottom値）
const DANGO_AREA_BOTTOM = 14;

// 串の先端（一番上）のY座標（ゲームエリア上端からの距離）
function getKushiTipY() {
  const kushi = document.getElementById('kushi');
  const kushiHeight = kushi ? kushi.getBoundingClientRect().height : 150;
  return getGameHeight() - DANGO_AREA_BOTTOM - kushiHeight;
}

function getKushiHalfWidth() {
  const el = document.getElementById('dango-area');
  return el ? el.offsetWidth / 2 : 30;
}

function updateKushiDOM() {
  const el = document.getElementById('dango-area');
  if (el) el.style.left = state.kushiX + 'px';
}

// ============================================================
// ゲーム状態
// ============================================================
let allPoems = [];
let gameInitialized = false;

const state = {
  difficulty: 'normal',
  cards: [],
  segmentPool: [],       // { text, poemId } の全候補（ダミー抽出用）
  poemQueue: [],
  currentPoem: null,
  targetIndex: 0,
  dangoCount: 0,
  running: false,
  cooldownUntil: 0,
  pixiApp: null,
  kushiX: 0,
  moveLeft: false,
  moveRight: false,
  stabbing: false,
  tiltVelocity: 0,
  orientationEnabled: false,
};

let targetedCard = null; // 現在、串と横位置が合っている落下中の札

// 短冊のフォントサイズ（CSSの .card-text / @media 指定値と対応）
const CARD_FONT_TABLE = { pc: 22, base: 17, mobile: 15 };
// 短冊の縦方向の余白合計（border×2 + padding(縦)×2。CSSの .card の値と対応）
const CARD_CHROME_TABLE = { pc: 30, base: 26, mobile: 20 };

// 文字数に応じた短冊の高さ（幅と同じ値を最小値にする）
function getCardHeight(text) {
  const tier = getSizeTier();
  const fontSize = CARD_FONT_TABLE[tier];
  const chrome = CARD_CHROME_TABLE[tier];
  const textHeight = text.length * fontSize * 1.3;
  return Math.max(CARD_WIDTH, Math.ceil(textHeight + chrome));
}

// ============================================================
// 画面幅に応じてカード幅を設定
// ============================================================
function initCardSize() {
  if (window.innerWidth > 1000) {
    CARD_WIDTH = 70;
  } else if (window.innerWidth > 600) {
    CARD_WIDTH = 56;
  } else {
    CARD_WIDTH = 44;
  }
}

function getGameSection() { return document.getElementById('game-section'); }
function getGameWidth()   { return getGameSection().clientWidth; }
function getGameHeight()  { return getGameSection().clientHeight; }

function getGameArea() {
  const w = Math.min(900, getGameWidth());
  return { left: (getGameWidth() - w) / 2, width: w };
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

// ============================================================
// 起動
// ============================================================
async function init() {
  initCardSize();

  const res = await fetch('js/kaminoku.json?v1');
  const raw = await res.json();
  // 五句並べの5句データから、上の句（1〜3句目＝刺していく札）と
  // 下の句（4〜5句目＝お題として表示）を組み立てる
  allPoems = raw.map(poem => ({
    id: poem.id,
    poet: poem.poet,
    phrases: poem.phrases,
    segments: poem.phrases.slice(0, 3),
    target: poem.phrases[3] + ' ' + poem.phrases[4],
  }));

  buildSegmentPool();

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
  });

  document.getElementById('start-btn').addEventListener('click', async () => {
    unlockSounds();
    await requestOrientationPermission();
    startGame();
  });

  setupInput();
}

// ============================================================
// 串の左右移動・入力処理
// ============================================================
function setupInput() {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') state.moveLeft  = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.moveRight = true;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter') { e.preventDefault(); tryStab(); }
  });
  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') state.moveLeft  = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.moveRight = false;
  });

  const section = document.getElementById('game-section');
  let touchX = 0;
  let touchMoved = false;
  section.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
    touchMoved = false;
  }, { passive: true });
  section.addEventListener('touchmove', e => {
    if (!state.running) return;
    const dx = e.touches[0].clientX - touchX;
    if (Math.abs(dx) > 4) touchMoved = true;
    touchX = e.touches[0].clientX;
    if (!state.orientationEnabled) moveKushiBy(dx);
  }, { passive: true });
  section.addEventListener('touchend', () => {
    if (!touchMoved) tryStab();
  });

  // PC: ドラッグでない単純クリックで刺す
  section.addEventListener('click', () => tryStab());
}

// ============================================================
// タップ／クリックで串を真上へ突き上げ、狙っている札を刺す
// ============================================================
function tryStab() {
  if (!state.running || state.stabbing) return;
  if (Date.now() < state.cooldownUntil) return;

  const dangoArea = document.getElementById('dango-area');
  const card = targetedCard;

  if (!card || card.state !== 'falling') {
    // 何も狙っていない時の空振り演出
    state.stabbing = true;
    gsap.to(dangoArea, {
      y: -30, duration: 0.14, ease: 'power2.out',
      onComplete: () => gsap.to(dangoArea, {
        y: 0, duration: 0.18, ease: 'power2.in',
        onComplete: () => { state.stabbing = false; },
      }),
    });
    return;
  }

  state.stabbing = true;
  const cardCenterY = gsap.getProperty(card.el, 'y') + card.height / 2;
  const lift = Math.max(20, getKushiTipY() - cardCenterY);

  gsap.to(dangoArea, {
    y: -lift,
    duration: 0.16,
    ease: 'power2.out',
    onComplete: () => {
      handleCardCatch(card, card.slot);
      gsap.to(dangoArea, {
        y: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => { state.stabbing = false; },
      });
    },
  });
}

function moveKushiBy(dx) {
  const ga = getGameArea();
  const halfW = getKushiHalfWidth();
  const max = ga.left + ga.width - halfW;
  const min = ga.left + halfW;
  state.kushiX = Math.max(min, Math.min(max, state.kushiX + dx));
  updateKushiDOM();
}

function moveKushi() {
  let dx = 0;
  if (state.moveLeft)  dx -= KUSHI_SPEED;
  if (state.moveRight) dx += KUSHI_SPEED;
  dx += state.tiltVelocity;
  if (dx !== 0) moveKushiBy(dx);
}

// ============================================================
// 傾きセンサー（スマホ）
// ============================================================
async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent === 'undefined') return;
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === 'granted') activateOrientationSensor();
    } catch (e) { /* 拒否時はドラッグ操作にフォールバック */ }
  } else {
    activateOrientationSensor();
  }
}

function activateOrientationSensor() {
  if (state.orientationEnabled) return; // リプレイのたびにリスナーが重複登録されるのを防ぐ
  window.addEventListener('deviceorientation', e => {
    if (!state.running || e.gamma === null) return;
    const tilt = e.gamma;
    if (Math.abs(tilt) < 3) { state.tiltVelocity = 0; return; }
    // 3°〜45° で 0〜KUSHI_SPEED に線形スケール、45°超えは最大速度
    const ratio = Math.min(1, (Math.abs(tilt) - 3) / 42);
    state.tiltVelocity = Math.sign(tilt) * ratio * KUSHI_SPEED;
  });
  state.orientationEnabled = true;
}

function buildSegmentPool() {
  state.segmentPool = [];
  allPoems.forEach(poem => {
    poem.segments.forEach((text, idx) => {
      state.segmentPool.push({ text, poemId: poem.id, idx });
    });
  });
}

// ============================================================
// ゲーム開始 / リスタート
// ============================================================
function startGame() {
  document.getElementById('start-section').classList.add('hidden');
  document.getElementById('game-section').classList.remove('hidden');
  document.body.classList.add('game-active');

  initCardSize();

  if (!gameInitialized) {
    setupPixi();
    setupPetals();
    gameInitialized = true;
  }

  for (const card of state.cards) {
    if (card.fallTween) card.fallTween.kill();
    gsap.killTweensOf(card.el);
    card.el.remove();
  }
  state.cards = [];
  clearDangoStack();

  const poemRevealEl = document.getElementById('poem-reveal');
  gsap.killTweensOf(poemRevealEl);
  poemRevealEl.classList.add('hidden');

  state.dangoCount    = 0;
  state.running       = true;
  state.cooldownUntil = 0;
  state.moveLeft      = false;
  state.moveRight     = false;
  state.poemQueue     = shuffle([...allPoems]);

  const ga = getGameArea();
  state.kushiX = ga.left + ga.width / 2;
  updateKushiDOM();

  pickNextPoem();

  const laneCount = DIFFICULTIES[state.difficulty].laneCount;
  const gap = DIFFICULTIES[state.difficulty].spawnGap;
  for (let slot = 0; slot < laneCount; slot++) {
    setTimeout(() => spawnCard(slot), slot * gap * 0.6);
  }

  state.pixiApp.ticker.remove(gameLoop);
  state.pixiApp.ticker.add(gameLoop);
}

// ============================================================
// ゲームループ — 串の移動と衝突判定を毎フレーム行う
// ============================================================
function gameLoop() {
  if (!state.running) return;
  moveKushi();
  checkAlignment();
}

// ============================================================
// 次のお題（歌）を選ぶ
// ============================================================
function pickNextPoem() {
  if (state.poemQueue.length === 0) {
    state.poemQueue = shuffle([...allPoems]);
  }
  state.currentPoem = state.poemQueue.shift();
  state.targetIndex = 0;
  updateOdaiUI();
  updateKushiHeight();
}

function updateOdaiUI() {
  const poem = state.currentPoem;
  document.getElementById('odai-text').textContent = poem ? poem.target : '';

  const dotsWrap = document.getElementById('progress-dots');
  dotsWrap.innerHTML = '';

  // やさしいモードでは、次に刺すべき句の一文字目をヒントとして表示する
  const hintEl = document.getElementById('hint-text');
  if (poem && state.difficulty === 'easy' && state.targetIndex < poem.segments.length) {
    const nextWord = poem.segments[state.targetIndex];
    hintEl.textContent = document.documentElement.lang === 'en'
      ? 'Hint: "' + nextWord[0] + '"'
      : 'ヒント：「' + nextWord[0] + '」';
    hintEl.classList.remove('hidden');
  } else {
    hintEl.classList.add('hidden');
  }

  if (!poem) return;
  poem.segments.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'progress-dot' + (i < state.targetIndex ? ' done' : '');
    dotsWrap.appendChild(dot);
  });
}

// ============================================================
// PixiJS 初期化
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
  const petalField = document.getElementById('petal-field');
  petalField.insertAdjacentElement('afterend', app.view);
  state.pixiApp = app;
}

// ============================================================
// 花びら（CSS アニメーション）
// ============================================================
function setupPetals() {
  const field = document.getElementById('petal-field');
  for (let i = 0; i < 26; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    const size = 8 + Math.random() * 10;
    petal.style.cssText =
      `left:${Math.random() * 100}%;` +
      `width:${size}px;height:${size * 0.8}px;` +
      `--drift:${(Math.random() - 0.5) * 120}px;` +
      `animation-duration:${9 + Math.random() * 8}s;` +
      `animation-delay:${-(Math.random() * 12)}s;`;
    field.appendChild(petal);
  }
}

// ============================================================
// 落下速度
// ============================================================
function getFallDuration() {
  const d = DIFFICULTIES[state.difficulty];
  return d.fallMin + Math.random() * (d.fallMax - d.fallMin);
}

// ============================================================
// 現在アクティブな札の中に「正解の次の札」があるか
// ============================================================
function hasCorrectCardActive() {
  if (!state.currentPoem) return false;
  // 歌の完成後、次のお題に切り替わるまでの一瞬は「今刺すべき句」が存在しない
  if (state.targetIndex >= state.currentPoem.segments.length) return true;
  const correctText = state.currentPoem.segments[state.targetIndex];
  return state.cards.some(c => c.state === 'falling' && c.text === correctText && c.poemId === state.currentPoem.id);
}

// ============================================================
// 札の生成（上からふわふわ落下）
// ============================================================
function spawnCard(slot) {
  if (!state.running || !state.currentPoem) return;

  const laneCount = DIFFICULTIES[state.difficulty].laneCount;
  let cardData;

  const needsCorrectCard = state.targetIndex < state.currentPoem.segments.length && !hasCorrectCardActive();
  if (needsCorrectCard) {
    const correctText = state.currentPoem.segments[state.targetIndex];
    cardData = { text: correctText, poemId: state.currentPoem.id, isCorrect: true };
  } else {
    const decoyPool = state.segmentPool.filter(s => {
      if (s.poemId === state.currentPoem.id && s.idx === state.targetIndex) return false;
      return true;
    });
    const pick = decoyPool[Math.floor(Math.random() * decoyPool.length)];
    const isActuallyCorrect = pick.poemId === state.currentPoem.id && pick.idx === state.targetIndex;
    cardData = { text: pick.text, poemId: pick.poemId, isCorrect: isActuallyCorrect };
  }

  const cardHeight = getCardHeight(cardData.text);

  const ga = getGameArea();
  const slotCenterX = ga.left + (ga.width / laneCount) * (slot + 0.5);
  const startY = -cardHeight - 20;

  const el = document.createElement('div');
  el.className = 'card';
  const textEl = document.createElement('div');
  textEl.className = 'card-text';
  textEl.textContent = cardData.text;
  el.appendChild(textEl);
  document.getElementById('card-area').appendChild(el);
  el.style.height = cardHeight + 'px';

  const swingAmp = 5 + Math.random() * 4;
  const swingDir = Math.random() < 0.5 ? 1 : -1;

  gsap.set(el, {
    x: slotCenterX - CARD_WIDTH / 2,
    y: startY,
    opacity: 0,
    rotation: swingDir * swingAmp * 0.5,
  });

  gsap.to(el, { opacity: 1, duration: 0.4, delay: 0.1 });

  const fallTween = gsap.to(el, {
    y: getGameHeight() + cardHeight,
    duration: getFallDuration(),
    ease: 'none',
    delay: 0.15,
    onComplete: () => {
      // 誰にもタップされず落ちきったら静かに消える
      const card = state.cards.find(c => c.el === el);
      if (card && card.state === 'falling') {
        card.el.remove();
        state.cards = state.cards.filter(c => c !== card);
        replenishCard(slot);
      }
    },
  });

  const swingTween = gsap.to(el, {
    rotation: -swingDir * swingAmp,
    duration: 1.6 + Math.random() * 1.0,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  const card = {
    slot, slotCenterX, el, fallTween, swingTween,
    state: 'falling',
    text: cardData.text,
    poemId: cardData.poemId,
    isCorrect: cardData.isCorrect,
    height: cardHeight,
  };
  state.cards.push(card);
}

function replenishCard(slot) {
  if (!state.running) return;
  const delay = 250 + Math.random() * 350;
  setTimeout(() => { if (state.running) spawnCard(slot); }, delay);
}

// ============================================================
// 「今串が狙っている札」をハイライト（視覚フィードバックのみ）
// ============================================================
function checkAlignment() {
  let closest = null;
  let closestDist = ALIGN_RANGE;
  for (const card of state.cards) {
    if (card.state !== 'falling') continue;
    const dist = Math.abs(card.slotCenterX - state.kushiX);
    if (dist < closestDist) { closestDist = dist; closest = card; }
  }
  if (closest === targetedCard) return;
  if (targetedCard) targetedCard.el.classList.remove('aligned');
  targetedCard = closest;
  if (targetedCard) targetedCard.el.classList.add('aligned');
}

// ============================================================
// 札を捕らえた（串に刺さった）時の処理
// ============================================================
function handleCardCatch(card, slot) {
  if (!state.running) return;
  if (card.state !== 'falling') return;
  if (Date.now() < state.cooldownUntil) return;

  card.state = 'resolved';
  card.fallTween.kill();
  if (card.swingTween) card.swingTween.kill();
  if (card === targetedCard) {
    targetedCard.el.classList.remove('aligned');
    targetedCard = null;
  }

  if (card.isCorrect) {
    onCorrectTap(card, slot);
  } else {
    onWrongTap(card, slot);
  }
}

// ============================================================
// 正解 — 串に刺さる
// ============================================================
function onCorrectTap(card, slot) {
  card.el.classList.add('correct-flash');
  playStabSound();

  const cx = card.slotCenterX;
  const cy = gsap.getProperty(card.el, 'y') + card.height / 2;
  spawnSmokePuff(cx, cy);

  const dangoRect = document.getElementById('dango-area').getBoundingClientRect();
  const sectionRect = getGameSection().getBoundingClientRect();
  const targetX = dangoRect.left + dangoRect.width / 2 - sectionRect.left;
  const targetY = dangoRect.top - sectionRect.top;

  gsap.to(card.el, {
    x: targetX - CARD_WIDTH / 2,
    y: targetY - card.height / 2,
    scale: 0.15,
    opacity: 0,
    duration: 0.55,
    ease: 'power2.in',
    onComplete: () => {
      card.el.remove();
      state.cards = state.cards.filter(c => c !== card);
      replenishCard(slot);
    },
  });

  addDangoBall();
  state.targetIndex++;
  updateOdaiUI();

  if (state.targetIndex >= state.currentPoem.segments.length) {
    setTimeout(() => completeDango(), 650);
  }
}

// ============================================================
// 不正解 — 串の団子が四方八方に飛び散る
// ============================================================
function onWrongTap(card, slot) {
  card.el.classList.add('wrong-flash');
  state.cooldownUntil = Date.now() + 600;

  gsap.to(card.el, {
    y: `+=${20}`,
    opacity: 0,
    rotation: `+=${(Math.random() < 0.5 ? -1 : 1) * 40}`,
    duration: 0.4,
    ease: 'power1.in',
    onComplete: () => {
      card.el.remove();
      state.cards = state.cards.filter(c => c !== card);
      replenishCard(slot);
    },
  });

  scatterDango();
  state.targetIndex = 0;
  updateOdaiUI();
}

// ============================================================
// 串だんご — 追加・散乱・クリア
// ============================================================
function addDangoBall() {
  const stack = document.getElementById('dango-stack');
  const ball = document.createElement('div');
  const colorClass = DANGO_COLORS[stack.children.length % DANGO_COLORS.length];
  ball.className = 'dango-ball ' + colorClass;

  const segCount = state.currentPoem.segments.length;
  const { size, overlap } = getDangoBallMetrics(segCount);
  ball.style.width = size + 'px';
  ball.style.height = size + 'px';
  ball.style.marginBottom = -overlap + 'px';

  gsap.set(ball, { scale: 0 });
  stack.appendChild(ball);
  gsap.to(ball, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
}

function clearDangoStack() {
  const stack = document.getElementById('dango-stack');
  gsap.killTweensOf(stack.children);
  stack.innerHTML = '';
}

function scatterDango() {
  const stack = document.getElementById('dango-stack');
  const balls = Array.from(stack.children);
  if (balls.length === 0) return;

  balls.forEach(ball => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 90;
    document.body.appendChild(ball); // フロー外に出して自由に飛ばす
    const rect = stack.getBoundingClientRect();
    gsap.set(ball, { position: 'fixed', left: rect.left, top: rect.top, margin: 0, zIndex: 200 });
    gsap.to(ball, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 40,
      opacity: 0,
      rotation: (Math.random() - 0.5) * 260,
      duration: 0.65,
      ease: 'power2.out',
      onComplete: () => ball.remove(),
    });
  });
  stack.innerHTML = '';
}

// 団子完成のたびに、その歌の全文を一瞬（約1秒）表示する
function showPoemReveal(poem) {
  if (!poem || !poem.phrases) return;
  playPoemRevealSound();
  const el = document.getElementById('poem-reveal');
  document.getElementById('poem-reveal-text').innerHTML = poem.phrases.join('<br>');
  document.getElementById('poem-reveal-poet').textContent = poem.poet;
  gsap.killTweensOf(el);
  el.classList.remove('hidden');
  gsap.set(el, { opacity: 0 });
  gsap.to(el, {
    opacity: 1, duration: 0.25,
    onComplete: () => {
      gsap.to(el, {
        opacity: 0, duration: 0.4, delay: 1.0,
        onComplete: () => el.classList.add('hidden'),
      });
    },
  });
}

function completeDango() {
  const dangoRect = document.getElementById('dango-area').getBoundingClientRect();
  const sectionRect = getGameSection().getBoundingClientRect();
  const cx = dangoRect.left + dangoRect.width / 2 - sectionRect.left;
  const cy = dangoRect.top - sectionRect.top;
  spawnFirework(cx, cy, 1.1 + Math.random() * 0.6);

  showPoemReveal(state.currentPoem);

  state.dangoCount++;

  if (state.dangoCount >= CLEAR_TARGET) {
    triggerClear();
    return;
  }

  setTimeout(() => {
    gsap.to('#dango-stack', {
      opacity: 0, duration: 0.4,
      onComplete: () => {
        clearDangoStack();
        gsap.set('#dango-stack', { opacity: 1 });
        pickNextPoem();
      },
    });
  }, 1000);
}

// ============================================================
// クリア演出（5串完成）
// ============================================================
function triggerClear() {
  state.running = false;
  playClearSound();
  for (const card of state.cards) {
    if (card.fallTween) card.fallTween.kill();
    gsap.killTweensOf(card.el);
    gsap.to(card.el, { opacity: 0, duration: 0.4 });
  }

  const w = getGameWidth();
  const h = getGameHeight();
  const bursts = [
    { xr: 0.5,  yr: 0.5,  delay: 0    },
    { xr: 0.25, yr: 0.35, delay: 350  },
    { xr: 0.75, yr: 0.35, delay: 650  },
    { xr: 0.35, yr: 0.62, delay: 1000 },
    { xr: 0.65, yr: 0.62, delay: 1300 },
  ];
  bursts.forEach(({ xr, yr, delay }) => {
    setTimeout(() => spawnFirework(w * xr, h * yr, 1.6 + Math.random() * 1.2), delay);
  });

  const msg = document.getElementById('clear-msg');
  gsap.killTweensOf(msg);
  gsap.fromTo(msg, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.3, ease: 'power2.out' });

  setTimeout(() => {
    gsap.to(msg, { opacity: 0, duration: 0.5 });
    clearDangoStack();
    document.getElementById('game-section').classList.add('hidden');
    document.body.classList.remove('game-active');
    document.getElementById('start-section').classList.remove('hidden');
  }, 4200);
}

// ============================================================
// エフェクト — 正解時のカラフルな煙幕
// ============================================================
function spawnSmokePuff(cx, cy) {
  const app = state.pixiApp;
  if (!app) return;
  const particles = [];
  const palette = [0xffb6c1, 0xffffff, 0x9bc97e, 0xffe6b8, 0xd9b8ff];

  for (let i = 0; i < 26; i++) {
    const gfx = new PIXI.Graphics();
    const color = palette[Math.floor(Math.random() * palette.length)];
    const r = 3 + Math.random() * 6;
    gfx.beginFill(color, 0.75 + Math.random() * 0.2);
    gfx.drawCircle(0, 0, r);
    gfx.endFill();
    gfx.x = cx + (Math.random() - 0.5) * 10;
    gfx.y = cy + (Math.random() - 0.5) * 10;
    app.stage.addChild(gfx);

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.6 + Math.random() * 2.2;
    particles.push({
      gfx, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.6,
      life: 1.0, decay: 0.012 + Math.random() * 0.012,
      grow: 0.06 + Math.random() * 0.08,
    });
  }

  const tick = () => {
    let anyAlive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      p.life -= p.decay;
      p.vy += 0.01; p.vx *= 0.98;
      p.gfx.x += p.vx; p.gfx.y += p.vy;
      p.gfx.scale.set(1 + (1 - p.life) * p.grow * 4);
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
// エフェクト — 花火爆発（三色だんご完成時）
// ============================================================
function spawnFirework(cx, cy, scale) {
  const app = state.pixiApp;
  if (!app) return;
  const particles = [];

  const count    = Math.floor(30 + scale * 40);
  const maxSpeed = 2.4 + scale * 4.2;

  const palettes = [
    [0xff9fbb, 0xffe0e8, 0xffffff],
    [0x9bc97e, 0xd4f0c0, 0xffffff],
    [0xffe6b8, 0xfff3d6, 0xffffff],
    [0xd9b8ff, 0xf0e0ff, 0xffffff],
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];

  const flash = new PIXI.Graphics();
  flash.beginFill(0xffffff, 0.85);
  flash.drawCircle(0, 0, Math.max(8, 16 * scale));
  flash.endFill();
  flash.x = cx; flash.y = cy;
  app.stage.addChild(flash);
  gsap.to(flash, { alpha: 0, duration: 0.22, onComplete: () => { if (flash.parent) app.stage.removeChild(flash); } });

  for (let i = 0; i < count; i++) {
    const gfx = new PIXI.Graphics();
    const color = palette[Math.floor(Math.random() * palette.length)];
    const r = Math.max(1, (1.2 + Math.random() * 1.6) * Math.min(scale * 0.7, 1.6));
    gfx.beginFill(color, 0.95);
    gfx.drawCircle(0, 0, r);
    gfx.endFill();
    gfx.x = cx + (Math.random() - 0.5) * 6;
    gfx.y = cy + (Math.random() - 0.5) * 6;
    app.stage.addChild(gfx);

    const angle = Math.random() * Math.PI * 2;
    const speed = (0.35 + Math.random() * 0.9) * maxSpeed;
    particles.push({ gfx, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1.0, decay: 0.0045 + Math.random() * 0.007 });
  }

  const tick = () => {
    let anyAlive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      p.life -= p.decay;
      p.vy += 0.05; p.vx *= 0.994;
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
// サウンド
// ============================================================
// iOSなどスマホのブラウザは「ユーザー操作の瞬間から離れた再生」をブロックするため、
// setTimeout/アニメーション完了後に鳴らす音（団子完成・クリア音）だけが無音になっていた。
// 対策として、音源を使い回し（毎回 new Audio しない）、「はじめる」タップという
// 確実なユーザー操作の中で一度再生してアンロックしておく。
const SOUNDS = {
  stab:  Object.assign(new Audio('sound/kozutsumi.mp3'), { volume: 0.4 }),
  clear: Object.assign(new Audio('sound/hyoushigi.mp3'), { volume: 0.5 }),
  poem:  Object.assign(new Audio('sound/shakeen.mp3'),   { volume: 0.5 }),
};

function unlockSounds() {
  Object.values(SOUNDS).forEach(audio => {
    // muted で再生するので、pause() が間に合わず一瞬再生されても無音のまま
    audio.muted = true;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
    }).catch(() => {
      audio.muted = false;
    });
  });
}

function playSound(key) {
  const audio = SOUNDS[key];
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function playStabSound() { playSound('stab'); }
function playClearSound() { playSound('clear'); }
function playPoemRevealSound() { playSound('poem'); }

// ============================================================
// ユーティリティ
// ============================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

init();
