/* ============================================================
   決まり字シューター - main.js
   PixiJS 7 + GSAP 3 を使用
   ============================================================ */

// ============================================================
// 定数
// ============================================================
const CARD_COUNT    = 3;    // 場に出る札の枚数
const CARD_W        = 82;   // 札の幅 (px) ※style.cssと合わせる
const CARD_H        = 170;  // 札の高さ (px)
const PLAYER_W      = 110;  // 台座の幅 (px)
const PLAYER_SPEED  = 6;    // 台座の移動速度 (px/フレーム)
const ALIGN_RANGE   = 55;   // 「真下」と判定する水平距離 (px)
const TIMER_SEC     = 6;    // 制限時間 (秒)
const FLOAT_RANGE_Y = 18;   // 浮遊の縦振れ幅 (px)
const CARD_BASE_Y   = 0.12; // 札の基準Y (画面高さに対する比率)

// ============================================================
// ゲーム状態（グローバル変数として一元管理）
// ============================================================
let allValidPoems = []; // 全データのマスターコピー（プールが空になった際に再利用）

const state = {
  score: 0,
  combo: 0,
  playerX: 0,        // 台座の中心X
  moveLeft: false,
  moveRight: false,
  cards: [],         // 場に出ている札オブジェクトの配列
  poemPool: [],      // まだ使っていない歌のプール
  targetCard: null,  // 現在台座が真下にある札
  timerStart: null,  // タイマー開始時刻 (ms)
  timerActive: false,
  cooldownUntil: 0,       // 不正解後のクールダウン終了時刻 (ms)
  currentChoices: [],     // 表示中の3択 [{text, isCorrect}]
  selectedChoiceIndex: 0, // PCキーボードで選択中のボタンインデックス
  tiltVelocity: 0,        // 傾きセンサーから得た速度 (スマホ用)
  orientationEnabled: false,
  pixiApp: null,
  bgParticles: [],   // 背景パーティクル
  running: false,    // ゲームが動いているか
};

// ============================================================
// 起動 — JSONを読み込んでからゲームを準備する
// ============================================================
async function init() {
  // 決まり字データを読み込む（kimariji_head がひらがなのものだけ使用）
  const res = await fetch('../kimariji.json?20260630');
  const all = await res.json();
  allValidPoems = all.filter(p => /^[ぁ-ん]+$/.test(p.kimariji_head));
  state.poemPool = shuffle([...allValidPoems]);

  // PixiJS の背景・エフェクト用キャンバスを初期化
  setupPixi();

  // 入力イベントを登録
  setupInput();

  // スタートボタンのイベント（iOS傾きセンサー許可はユーザー操作内で行う）
  document.getElementById('start-btn').addEventListener('click', async () => {
    await requestOrientationPermission();
    startGame();
  });
}

// ============================================================
// ゲーム開始
// ============================================================
function startGame() {
  document.getElementById('start-screen').classList.add('hidden');

  state.score = 0;
  state.combo = 0;
  state.playerX = window.innerWidth / 2;
  state.running = true;

  updateScoreUI();
  updatePlayerDOM();

  // 初期の3枚を順番に少しずらして出現させる
  for (let slot = 0; slot < CARD_COUNT; slot++) {
    setTimeout(() => spawnCard(slot), slot * 200);
  }

  // ゲームループをPixiJSのtickerに登録
  state.pixiApp.ticker.add(gameLoop);
}

// ============================================================
// ゲームループ — 毎フレーム呼ばれる
// ============================================================
function gameLoop() {
  if (!state.running) return;

  // 台座を移動
  movePLayer();

  // 背景パーティクルを更新
  updateBgParticles();

  // 台座が どの札の真下か判定
  checkAlignment();

  // タイマーを更新
  updateTimer();
}

// ============================================================
// PixiJS 初期化（背景 + エフェクト専用）
// ============================================================
function setupPixi() {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0d1b3e,
    resizeTo: window,
    antialias: true,
    resolution: Math.min(devicePixelRatio, 2),
    autoDensity: true,
  });
  // canvasを最初の要素として挿入（DOM要素の下になる）
  document.body.insertBefore(app.view, document.body.firstChild);
  state.pixiApp = app;

  // 背景パーティクルを生成（小さな光の粒子）
  for (let i = 0; i < 60; i++) {
    const p = createBgParticle(true);
    app.stage.addChild(p.gfx);
    state.bgParticles.push(p);
  }
}

// ============================================================
// 背景パーティクル — 一粒を生成する
// ============================================================
function createBgParticle(randomY = false) {
  const gfx = new PIXI.Graphics();
  const r = 0.8 + Math.random() * 1.8;
  const alpha = 0.08 + Math.random() * 0.22;
  gfx.beginFill(0x8899cc, alpha);
  gfx.drawCircle(0, 0, r);
  gfx.endFill();

  return {
    gfx,
    x:  Math.random() * window.innerWidth,
    y:  randomY ? Math.random() * window.innerHeight : window.innerHeight + 10,
    vy: -(0.08 + Math.random() * 0.25), // 上昇速度
    vx: (Math.random() - 0.5) * 0.08,
  };
}

// 毎フレーム、背景パーティクルを動かす
function updateBgParticles() {
  for (const p of state.bgParticles) {
    p.x += p.vx;
    p.y += p.vy;
    // 画面上端を超えたら下から再出発
    if (p.y < -10) {
      p.y = window.innerHeight + 10;
      p.x = Math.random() * window.innerWidth;
    }
    p.gfx.x = p.x;
    p.gfx.y = p.y;
  }
}

// ============================================================
// 台座（プレイヤー）
// ============================================================

// 毎フレーム: キー入力 + 傾きセンサーに応じて台座を動かす
function movePLayer() {
  const max = window.innerWidth - PLAYER_W / 2;
  const min = PLAYER_W / 2;
  let dx = 0;
  if (state.moveLeft)  dx -= PLAYER_SPEED;
  if (state.moveRight) dx += PLAYER_SPEED;
  // スマホ傾き（キー入力と共存可能）
  dx += state.tiltVelocity;
  if (dx !== 0) {
    state.playerX = Math.max(min, Math.min(max, state.playerX + dx));
    updatePlayerDOM();
  }
}

// DOM上の台座位置を更新する
function updatePlayerDOM() {
  const playerEl = document.getElementById('player');
  // transform を使わず left で配置（計算が単純になる）
  playerEl.style.left = (state.playerX - PLAYER_W / 2) + 'px';
}

// ============================================================
// 札（カード）の生成
// ============================================================

// slot: 0=左, 1=中央, 2=右
function spawnCard(slot) {
  if (state.poemPool.length === 0) {
    // プールが空になったらマスターから再シャッフル（場に出ている歌は除く）
    const activeIds = new Set(state.cards.map(c => c.data.id));
    state.poemPool = shuffle(allValidPoems.filter(p => !activeIds.has(p.id)));
    if (state.poemPool.length === 0) return;
  }

  const poem = state.poemPool.shift();

  // スロットの中心X（画面を3等分した中心）
  const slotCenterX = (window.innerWidth / CARD_COUNT) * (slot + 0.5);
  const baseY = window.innerHeight * CARD_BASE_Y;

  // 札のDOM要素を作成
  const el = document.createElement('div');
  el.className = 'card';

  const textEl = document.createElement('div');
  textEl.className = 'card-text';
  textEl.textContent = htmlToPlainText(poem.shimo_no_ku);
  el.appendChild(textEl);

  document.getElementById('card-area').appendChild(el);

  // GSAP で初期位置をセット（左上基点 → 変換 x/y でカード中心を合わせる）
  gsap.set(el, {
    x: slotCenterX - CARD_W / 2,
    y: baseY,
    scale: 0.5,
    opacity: 0,
    rotation: (Math.random() - 0.5) * 6, // わずかに傾ける
  });

  // 出現アニメーション（下から浮かび上がる）
  gsap.to(el, {
    scale: 1,
    opacity: 1,
    y: baseY,
    duration: 0.7,
    ease: 'back.out(1.5)',
  });

  // 浮遊アニメーション — 各カードで速さ・振れ幅を少し変える
  const floatDuration = 2.2 + Math.random() * 1.8;
  const floatRange    = FLOAT_RANGE_Y + (Math.random() - 0.5) * 8;
  const floatTween = gsap.to(el, {
    y: baseY + floatRange,
    duration: floatDuration,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: Math.random() * 1.5, // 位相をずらす
  });

  const cardObj = {
    slot,
    slotCenterX,   // 整列判定に使う
    baseY,
    data: poem,
    el,
    floatTween,
    state: 'floating', // 'floating' | 'releasing'
  };

  state.cards.push(cardObj);
}

// ============================================================
// 整列判定 — 台座が どの札の真下か調べる
// ============================================================
function checkAlignment() {
  // 3択ボタン表示中はターゲットを変えない（台座を動かしても選択継続）
  if (state.timerActive) return;

  let closest = null;
  let closestDist = ALIGN_RANGE;

  for (const card of state.cards) {
    if (card.state !== 'floating') continue;
    const dist = Math.abs(card.slotCenterX - state.playerX);
    if (dist < closestDist) {
      closestDist = dist;
      closest = card;
    }
  }

  // ターゲットが変わったときだけ更新する
  if (closest === state.targetCard) return;

  // 前のターゲットのハイライトを消す
  if (state.targetCard) {
    state.targetCard.el.classList.remove('targeted');
    hideChoiceButtons();
  }

  state.targetCard = closest;

  // クールダウン中はボタンを表示しない（不正解直後の即再表示を防ぐ）
  if (closest && Date.now() >= state.cooldownUntil) {
    closest.el.classList.add('targeted');
    showChoiceButtons(closest);
  } else if (closest) {
    closest.el.classList.add('targeted');
  }
}

// ============================================================
// 3択ボタン 表示・非表示
// ============================================================

// 正解1択 + ランダムな誤答2択を作り、シャッフルして表示する
function showChoiceButtons(card) {
  const correct = card.data.kimariji_head;

  // 誤答候補: 正解以外のひらがな決まり字をランダムに2つ選ぶ
  const wrongPool = allValidPoems
    .filter(p => p.id !== card.data.id && p.kimariji_head !== correct);
  const wrongs = shuffle(wrongPool).slice(0, 2).map(p => p.kimariji_head);

  // 3択をシャッフル
  const choices = shuffle([
    { text: correct,  isCorrect: true  },
    { text: wrongs[0], isCorrect: false },
    { text: wrongs[1], isCorrect: false },
  ]);
  state.currentChoices    = choices;
  state.selectedChoiceIndex = 0;

  // ボタンをDOMに生成
  const wrap = document.getElementById('choices-wrap');
  wrap.innerHTML = '';
  choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.dataset.index = i;
    btn.addEventListener('click', () => pressChoice(i));
    btn.addEventListener('touchend', e => { e.preventDefault(); pressChoice(i); });
    wrap.appendChild(btn);
  });

  wrap.classList.remove('hidden');
  updateChoiceHighlight(); // 最初の選択肢をハイライト

  // タイマー開始
  document.getElementById('timer-bar-wrap').style.display = 'block';
  document.getElementById('timer-bar').style.width = '100%';
  document.getElementById('timer-bar').style.background = '#4caf50';
  state.timerStart = Date.now();
  state.timerActive = true;

  // ボタン出現アニメーション（順にポップ）
  gsap.fromTo(wrap.querySelectorAll('.choice-btn'),
    { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(2)', stagger: 0.06 }
  );
}

function hideChoiceButtons() {
  document.getElementById('choices-wrap').classList.add('hidden');
  document.getElementById('choices-wrap').innerHTML = '';
  document.getElementById('timer-bar-wrap').style.display = 'none';
  state.timerActive = false;
  state.timerStart  = null;
  state.currentChoices = [];
}

// ボタンを押したとき（正解・不正解の分岐）
function pressChoice(index) {
  if (!state.timerActive) return; // 二重押し防止
  const choice = state.currentChoices[index];
  if (!choice) return;

  if (choice.isCorrect) {
    onCorrectAnswer();
  } else {
    // 押したボタンを赤くフラッシュしてから不正解処理
    const btns = document.querySelectorAll('.choice-btn');
    if (btns[index]) btns[index].classList.add('wrong-flash');
    state.timerActive = false; // 二重発動を防ぐ
    setTimeout(() => onWrongAnswer(), 380);
  }
}

// PCキーボード用: 選択中ボタンのハイライトを更新する
function updateChoiceHighlight() {
  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === state.selectedChoiceIndex);
  });
}

// ============================================================
// タイマー更新 — 毎フレーム呼ばれる
// ============================================================
function updateTimer() {
  if (!state.timerActive || !state.timerStart) return;

  const elapsed   = (Date.now() - state.timerStart) / 1000;
  const remaining = Math.max(0, TIMER_SEC - elapsed);
  const ratio     = remaining / TIMER_SEC;

  // バー幅を更新
  document.getElementById('timer-bar').style.width = (ratio * 100) + '%';

  // 残り時間に応じてバーの色を変える: 緑 → 黄 → 赤
  if (ratio > 0.5) {
    document.getElementById('timer-bar').style.background = '#4caf50';
  } else if (ratio > 0.25) {
    document.getElementById('timer-bar').style.background = '#ff9800';
  } else {
    document.getElementById('timer-bar').style.background = '#f44336';
  }

  // 時間切れ → 不正解
  if (remaining <= 0) {
    onWrongAnswer();
  }
}

// ============================================================
// 正解処理
// ============================================================
function onCorrectAnswer() {
  const card = state.targetCard;
  if (!card || card.state !== 'floating') return;

  card.state = 'releasing';
  state.targetCard = null;
  card.el.classList.remove('targeted');
  hideChoiceButtons();

  // スコア・コンボを更新
  state.combo++;
  state.score += 100 * Math.max(1, state.combo);
  updateScoreUI();
  showComboEffect();

  // 解放演出: 上空へ飛んでいく + 回転 + フェードアウト
  card.floatTween.kill();
  gsap.to(card.el, {
    y: -280,
    rotation: `+=${25 + Math.random() * 20}`,
    opacity: 0,
    duration: 1.1,
    ease: 'power2.in',
    onComplete: () => {
      card.el.remove();
      state.cards = state.cards.filter(c => c !== card);
      // 新しい札を補充
      replenishCard(card.slot);
    },
  });

  // PixiJS で金色パーティクルを放出（解放の気持ちよさ）
  spawnGoldParticles(card.slotCenterX, card.baseY + CARD_H / 2);
}

// ============================================================
// 不正解処理（タイムアップ）
// ============================================================
function onWrongAnswer() {
  const card = state.targetCard;
  state.targetCard = null;
  state.combo = 0;
  updateScoreUI();
  hideChoiceButtons();

  // 2秒間クールダウン（同じ札の真下にいても即ボタン再表示しない）
  state.cooldownUntil = Date.now() + 2000;

  if (!card || card.state !== 'floating') return;

  card.el.classList.remove('targeted');

  // 揺れアニメーション
  gsap.to(card.el, {
    x: `+=${14}`,
    duration: 0.07,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: 7,
    onComplete: () => {
      // 揺れ後に元のX位置に戻す
      gsap.set(card.el, { x: card.slotCenterX - CARD_W / 2 });
    },
  });

  // 墨にじみ: カードを一瞬暗くする
  gsap.to(card.el, {
    filter: 'brightness(0.35)',
    duration: 0.12,
    yoyo: true,
    repeat: 3,
    onComplete: () => gsap.set(card.el, { filter: 'none' }),
  });

  // PixiJS で墨色パーティクル
  spawnInkParticles(card.slotCenterX, card.baseY + CARD_H / 2);
}

// ============================================================
// 札の補充 — 解放された後に新しい1枚を出す
// ============================================================
function replenishCard(slot) {
  setTimeout(() => spawnCard(slot), 400); // 少し間をあけてから出現
}

// ============================================================
// PixiJS エフェクト — 正解時の金色パーティクル
// ============================================================
function spawnGoldParticles(cx, cy) {
  const app = state.pixiApp;
  const particles = [];

  for (let i = 0; i < 30; i++) {
    const gfx = new PIXI.Graphics();
    const isGold = Math.random() < 0.7;
    const r = 1.5 + Math.random() * 3;
    gfx.beginFill(isGold ? 0xf0c040 : 0xfffae0, 0.9);
    gfx.drawCircle(0, 0, r);
    gfx.endFill();
    gfx.x = cx + (Math.random() - 0.5) * 30;
    gfx.y = cy;
    app.stage.addChild(gfx);

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
    const speed = 2.5 + Math.random() * 4.5;
    particles.push({
      gfx,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.022 + Math.random() * 0.015,
    });
  }

  // パーティクルを毎フレーム動かすticker
  const tick = () => {
    let anyAlive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      p.life -= p.decay;
      p.vy += 0.12; // 重力
      p.gfx.x += p.vx;
      p.gfx.y += p.vy;
      p.gfx.alpha = Math.max(0, p.life);
      if (p.life > 0) anyAlive = true;
    }
    if (!anyAlive) {
      app.ticker.remove(tick);
      particles.forEach(p => app.stage.removeChild(p.gfx));
    }
  };
  app.ticker.add(tick);
}

// ============================================================
// PixiJS エフェクト — 不正解時の墨パーティクル
// ============================================================
function spawnInkParticles(cx, cy) {
  const app = state.pixiApp;
  const particles = [];

  for (let i = 0; i < 14; i++) {
    const gfx = new PIXI.Graphics();
    const r = 2 + Math.random() * 5;
    gfx.beginFill(0x0a0208, 0.6 + Math.random() * 0.3);
    gfx.drawCircle(0, 0, r);
    gfx.endFill();
    gfx.x = cx + (Math.random() - 0.5) * 60;
    gfx.y = cy + (Math.random() - 0.5) * 40;
    app.stage.addChild(gfx);

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    particles.push({
      gfx,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.015 + Math.random() * 0.01,
    });
  }

  const tick = () => {
    let anyAlive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      p.life -= p.decay;
      p.vy += 0.04;
      p.gfx.x += p.vx;
      p.gfx.y += p.vy;
      p.gfx.alpha = Math.max(0, p.life);
      if (p.life > 0) anyAlive = true;
    }
    if (!anyAlive) {
      app.ticker.remove(tick);
      particles.forEach(p => app.stage.removeChild(p.gfx));
    }
  };
  app.ticker.add(tick);
}

// ============================================================
// 入力処理 — キーボード・タッチ（スワイプ）・傾きセンサー
// ============================================================
function setupInput() {
  // ---- キーボード ----
  document.addEventListener('keydown', e => {
    // 左右: 台座移動
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') state.moveLeft  = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.moveRight = true;

    // 3択ボタン表示中: 上下で選択、Enter/Spaceで決定
    if (state.timerActive) {
      if (e.key === 'ArrowUp') {
        e.preventDefault(); // ページスクロール防止
        state.selectedChoiceIndex = (state.selectedChoiceIndex - 1 + 3) % 3;
        updateChoiceHighlight();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.selectedChoiceIndex = (state.selectedChoiceIndex + 1) % 3;
        updateChoiceHighlight();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pressChoice(state.selectedChoiceIndex);
      }
    }
  });

  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') state.moveLeft  = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.moveRight = false;
  });

  // ---- タッチ操作（スワイプ） ----
  // 傾きセンサーが有効になったらスワイプは無効化する
  let touchX = 0;
  document.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (state.orientationEnabled) return; // 傾き操作中はスワイプを使わない
    const dx = e.touches[0].clientX - touchX;
    touchX = e.touches[0].clientX;
    const max = window.innerWidth - PLAYER_W / 2;
    const min = PLAYER_W / 2;
    state.playerX = Math.max(min, Math.min(max, state.playerX + dx));
    updatePlayerDOM();
  }, { passive: true });
}

// ============================================================
// 傾きセンサー — スマホの左右傾きで台座を動かす
// ============================================================

// startGame が呼ばれる前（ユーザー操作内）に実行してiOSの許可を得る
async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent === 'undefined') return;

  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13 以降は明示的な許可が必要
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === 'granted') activateOrientationSensor();
    } catch (e) { /* 許可拒否は無視してタッチ操作にフォールバック */ }
  } else {
    // Android・PCなど: 許可不要
    activateOrientationSensor();
  }
}

// センサーリスナーを登録する
function activateOrientationSensor() {
  window.addEventListener('deviceorientation', e => {
    if (!state.running || e.gamma === null) return;

    const tilt     = e.gamma;   // 左右傾き: -90(左)〜+90(右) 度
    const deadzone = 4;         // ±4度以内は無反応（誤検知防止）

    if (Math.abs(tilt) < deadzone) {
      state.tiltVelocity = 0;
      return;
    }
    // 傾き30度で最大速度になるようにマッピング、クランプ
    state.tiltVelocity = Math.max(-PLAYER_SPEED, Math.min(PLAYER_SPEED,
      (tilt / 30) * PLAYER_SPEED
    ));
  });
  state.orientationEnabled = true;
}

// ============================================================
// UI 更新
// ============================================================

// スコアとコンボの表示を更新する
function updateScoreUI() {
  document.getElementById('score').textContent = state.score.toLocaleString();
  const comboEl = document.getElementById('combo-display');
  if (state.combo >= 2) {
    document.getElementById('combo').textContent = state.combo;
    comboEl.classList.remove('hidden');
  } else {
    comboEl.classList.add('hidden');
  }
}

// コンボが増えたとき、数字を弾ませる
function showComboEffect() {
  if (state.combo < 2) return;
  const comboEl = document.getElementById('combo-display');
  gsap.fromTo(comboEl,
    { scale: 1.6, color: '#ffffff' },
    { scale: 1, color: '#f0d060', duration: 0.4, ease: 'back.out(2)' }
  );
}

// ============================================================
// ユーティリティ
// ============================================================

// HTML文字列からルビタグを除去してプレーンテキストを返す
function htmlToPlainText(html) {
  return html
    .replace(/<rt>[\s\S]*?<\/rt>/g, '') // ルビ（読み仮名）を除去
    .replace(/<br\s*\/?>/gi, '\n')       // <br> を改行に
    .replace(/<[^>]+>/g, '')             // 残りのタグを除去
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .trim();
}

// 配列をランダムに並び替える（Fisher-Yates）
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
// ゲーム開始
// ============================================================
init();
