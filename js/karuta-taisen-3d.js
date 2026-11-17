/* 競技かるた 3D（試作）― karuta-taisen-3d.html
   karuta-taisen.html（9枚・ロボット対戦）の 3D 版。Three.js で
   札の自動配置・払い（浮く／回る／巻き込み）を行う。
   単位は cm。プレイヤーは +z 側（手前）に座り、札はすべてプレイヤー向き。 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// ===== 定数 =====
const W = 5.2, D = 7.3, T = 0.14;          // 札の横・縦・厚み
const GAP = 1.0;                           // 札と札の間
const TOTAL = 9, WIN = 5;                  // 9枚。先に5枚取ったほうの勝ち（＝勝敗が決まる）
const G = 700;                             // 重力（少しふわっとさせる）
const FRICTION = 420;                      // 畳との摩擦による減速 cm/s²
const CARD_SPEED = 0.45;                   // 指の速さ → 札の速さ（飛びすぎて見失わないように抑える）
const DEAL_TOTAL = 3.0, DEAL_DUR = 0.42;   // 自動配置：全体3秒・1枚の移動時間
const LIFT_FROM = 140;                     // これより速い払いで札が浮く
const FLIP_FROM = 220;                     // これより速いと宙で回転する
const SWEEP_FROM = 110;                    // これより速いと、払った方向にある札を巻き込む（ふつうの払いでも起きる）
const MAX_SPEED = 480;
// 払いの強さは画面上の速さで測る（PC でもスマホでも同じ手ごたえ）：画面の短辺を1秒で横切る速さ = この値
const SWIPE_SCALE = 150;
// 取った札・取られた札を見せる演出：払われて飛ぶ → 回りながら目の前（カメラの手前）へ浮き上がる → 少し見せる → 取った側へ去りながら消える
const SHOW_AFTER = 0.22, SHOW_RISE = 0.42, SHOW_HOLD = 0.5, SHOW_OUT = 0.3;   // それぞれの秒数（合計で次の読みまでの1.5秒に収める）
const KEEP_BACK = 0.4;                     // オンライン：見せた札が元の場所へ戻るまでの秒数
const SHOW_SCALE = 2.2;                    // 見せるときの大きさ（並んでいる札の何倍に見えるか。画面が狭いときは収まるまで小さくする）
const CPU_SETTINGS = {                     // karuta-taisen.html と同じ
  easy: { reactionTimeMin: 5000, reactionTimeMax: 7000, accuracy: 0.5 },
  normal: { reactionTimeMin: 3000, reactionTimeMax: 4500, accuracy: 0.75 },
  hard: { reactionTimeMin: 1600, reactionTimeMax: 2500, accuracy: 0.97 }
};
// 確認用：?speed=0.2 でスローモーション（動きを目で追える）
const PARAMS = new URLSearchParams(location.search);
const DEBUG_SPEED = Number(PARAMS.get('speed')) || 1;
// karuta-taisen.html の「ロボットと対戦」から iframe で開かれたとき：強さは親ページで選び済みなので、
// 開始画面を出さずにすぐ始める。終了・勝敗は親ページへ知らせる（ランキングの記録は親ページが行う）
const EMBED = PARAMS.get('embed') === '1' && window.parent !== window;
if (EMBED) document.documentElement.classList.add('embed');
// オンライン対戦（?mode=online）：部屋・読み上げ・だれが取ったかは親ページ（Firebase）が決め、このページは札を見せて
// 払いを親ページへ知らせるだけ。読み上げの音声も親ページが鳴らす（下の「オンライン対戦」を参照）
const ONLINE = EMBED && PARAMS.get('mode') === 'online';
// 表示の言語（karuta-taisen_en.html から開かれたときは ?lang=en）。ボタンなど HTML 側の文言は html の末尾で差し替える
const EN = PARAMS.get('lang') === 'en';
const TXT = EN ? {
  score: (me, cpu) => `You ${me} – ${cpu} Robot`, even: 'Deciding card',
  reachMe: 'One more card to win', reachCpu: 'One more and you lose',
  players: (icons, me) => `Players: ${icons} · You: ${me}`, rivalTook: 'Your opponent took it', soon: 'Starting soon…',
  dealing: 'Dealing the cards…', startIn: sec => `Starting in… ${sec}`, card: n => `Card ${n}`,
  cpuMiss: 'Robot false-started. Your chance!', over: 'Game over', took: 'You got it!', cpuTook: 'The robot took it',
  miss: 'False start! Wait 3 seconds', win: 'Win!', lose: 'So close!', winAlt: 'Happy cat character', loseAlt: 'Sad cat character',
  noWebgl: '3D display (WebGL) is not available on this device or browser.',
} : {
  score: (me, cpu) => `あなた ${me} － ${cpu} ロボット`, even: '勝敗の分かれ目',
  reachMe: 'あと一枚で勝利', reachCpu: 'あと一枚取られたら敗北',
  players: (icons, me) => `参加者：${icons} ・ あなた：${me}`, rivalTook: '相手が取りました', soon: 'まもなく開始…',
  dealing: '札を並べています…', startIn: sec => `開始まで… ${sec}`, card: n => `第 ${n} 首`,
  cpuMiss: 'ロボットがお手つき。チャンスです！', over: '勝負あり', took: '取りました！', cpuTook: 'ロボットが取りました',
  miss: 'お手つき！ 3秒間待機', win: 'めでたし！', lose: '惜しい！', winAlt: '喜ぶ猫キャラ', loseAlt: '悲しむ猫キャラ',
  noWebgl: 'この端末・ブラウザでは 3D 表示（WebGL）が使えません。',
};
const toParent = msg => { if (EMBED) window.parent.postMessage({ source: 'k3d', ...msg }, location.origin); };

// ===== 状態 =====
const $ = id => document.getElementById(id);
const canvas = $('stage'), trailCanvas = $('trail');
let renderer, scene, camera, camBase = new THREE.Vector3(), camLook = new THREE.Vector3();
let cards = [], halfW = 10, halfD = 12;
let poems = null, kimariji = null, backMat = null, sideMat = null, tatamiTex = null;
let simTime = 0, lastReal = 0, dealing = false;
let freezeUntil = 0, slowUntil = 0, shake = 0;
let shakeOn = true;                        // 払ったときに画面をゆらすか（開始前に選ぶ）
const game = {
  phase: 'title',                          // title → deal → memorize → countdown → reading ⇄ between → over
  difficulty: 'normal', order: [], index: -1, current: null,
  score: { me: 0, cpu: 0 }, penaltyUntil: 0, timers: [],
  players: { icons: [], me: '' }           // オンライン：部屋にいる全員の動物バッジと、自分のバッジ
};
const audio = new Audio(); audio.preload = 'auto';
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeOutBack = t => 1 + 2.3 * Math.pow(t - 1, 3) + 1.3 * Math.pow(t - 1, 2);   // 少し行きすぎて戻る
const later = (fn, ms) => { const t = setTimeout(fn, ms); game.timers.push(t); return t; };

// ===== 音（効果音は素材なしで合成） =====
let actx = null, noiseBuf = null;
function initAudio() {
  if (actx) { if (actx.state !== 'running') actx.resume().catch(() => { }); return; }
  // 埋め込み時：親ページが「ロボットと対戦」ボタンのタップ中に作って解錠した AudioContext を使う。
  // （このページ内ではまだ操作が無いので、ここで作るとスマホでは止まったままになり、札を配る音が鳴らない）
  try { if (EMBED && window.parent._k3dAudioCtx) actx = window.parent._k3dAudioCtx; } catch (e) { }
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
  }
  if (actx.state !== 'running') actx.resume().catch(() => { });
  noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.4, actx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}
function noise(vol, dur, freq, q) {
  if (!actx || actx.state !== 'running') return;
  const src = actx.createBufferSource(); src.buffer = noiseBuf;
  const f = actx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
  const g = actx.createGain(); const t = actx.currentTime;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(actx.destination);
  src.start(t, Math.random() * 0.2, dur + 0.02);
}
function tone(vol, f0, f1, dur) {
  if (!actx || actx.state !== 'running') return;
  const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
  o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.8);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
}
const sfxPlace = () => noise(0.7, 0.07, rand(2600, 3400), 1.2);         // スッ
const sfxLand = v => noise(0.05 * v, 0.04, 1800, 1.0);                     // 札が畳に落ちる
function sfxHit(k) {                                                       // 払い（k: 0〜1）
  noise(0.18 + 0.5 * k, 0.06 + 0.05 * k, 2200 - 600 * k, 0.8);
  if (k > 0.35) tone(0.5 * k, 120, 45, 0.18);
}
const sfxMiss = () => { tone(0.25, 150, 90, 0.35); noise(0.12, 0.25, 300, 0.7); };

// ===== 札のテクスチャ =====
function makeFaceTexture(torihuda, texW = faceTexW) {
  const cw = 312, ch = 438;
  // 文字がぼやけないよう、画面に映る札の大きさのちょうど2倍の細かさで描く（faceTexW は fitCamera が決める）
  const K = texW / cw;
  const c = document.createElement('canvas'); c.width = Math.round(cw * K); c.height = Math.round(ch * K);
  const g = c.getContext('2d');
  g.scale(K, K);
  g.fillStyle = '#2e6a4c'; g.fillRect(0, 0, cw, ch);                       // 緑のふち
  const m = 15;
  g.fillStyle = '#fbf9f3'; g.fillRect(m, m, cw - m * 2, ch - m * 2);        // 紙
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.5; g.strokeRect(m, m, cw - m * 2, ch - m * 2);
  const lines = torihuda.split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]+>/g, ''));
  const cell = (ch - m * 2 - 26) / 5, fs = cell * 0.9;
  g.fillStyle = '#16130f'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${fs}px "Yuji Syuku","Yu Mincho","Hiragino Mincho ProN","Noto Serif JP",serif`;
  const colW = (cw - m * 2 - 16) / 3;
  lines.forEach((line, li) => {
    const x = cw - m - 8 - colW * (li + 0.5);                              // 右から左へ
    // 6文字以上の行（21番「いてつるかな」）は平体をかけて字送りをつめ、1文字目の上端と
    // 最後の文字の下端を5文字の行とそろえる（の・ち・な の下がそろう）
    const chars = [...line], n = chars.length;
    const flat = n > 5 ? 0.86 : 1;
    const y0 = m + 13 + cell * 0.5 - fs * (1 - flat) / 2;                    // 1文字目の中心
    const pitch = n > 5 ? (cell * 4 + fs * (1 - flat)) / (n - 1) : cell;
    chars.forEach((chr, ci) => {
      g.save(); g.translate(x, y0 + pitch * ci); g.scale(1, flat); g.fillText(chr, 0, 0); g.restore();
    });
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  // ちょうど2倍の画像を、縮小用の画像（ミップマップ）を使わずにそのまま縮める。ミップマップをはさむと文字が甘くなる
  tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  return tex;
}
function makeBackTexture() {
  const c = document.createElement('canvas'); c.width = 156; c.height = 219;
  const g = c.getContext('2d');
  g.fillStyle = '#2e6a4c'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = 'rgba(255,255,255,.05)';
  for (let y = 0; y < c.height; y += 6) for (let x = (y / 6 % 2) * 3; x < c.width; x += 6) g.fillRect(x, y, 2, 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ===== 場面 =====
const PC_CARD_PX = 148;                     // PC 表示での札の幅 px（karuta-taisen.html の平面版の実測値）
let faceTexW = 936;                         // 札の表の画像の幅 px
const FLOOR = 800;                         // 畳の一辺 cm
function initScene() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x17120d);
  scene.fog = new THREE.Fog(0x17120d, 150, 380);
  camera = new THREE.PerspectiveCamera(38, 1, 1, 1200);
  camera.up.set(0, 0, -1);                                                 // 真上から見下ろすので、画面の上＝奥（-z）

  scene.add(new THREE.HemisphereLight(0xfffaf2, 0x857c6c, 1.15));
  const sun = new THREE.DirectionalLight(0xfff3e2, 2.0);                   // 障子ごしの光
  sun.position.set(-55, 110, 35);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera; sc.left = -90; sc.right = 90; sc.top = 90; sc.bottom = -90; sc.near = 10; sc.far = 300;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.05; sun.shadow.radius = 3;
  scene.add(sun);

  // 畳：karuta-taisen.html の背景と同じ画像を、光で色を変えずにそのまま映す（大きさは fitCamera で合わせる）
  // 畳の画像が読めてから 3D の画面を見せる（それまでは黒く映るので、ページ背景の畳を見せておく）
  const showStage = () => requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('ready')));
  tatamiTex = new THREE.TextureLoader().load('/img/tatami.webp', showStage, undefined, showStage);
  tatamiTex.colorSpace = THREE.SRGBColorSpace;
  tatamiTex.wrapS = tatamiTex.wrapT = THREE.RepeatWrapping;
  tatamiTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR, FLOOR), new THREE.MeshBasicMaterial({ map: tatamiTex, fog: false }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  // 札の影だけを畳の上に重ねる
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR, FLOOR), new THREE.ShadowMaterial({ opacity: 0.32, fog: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02; shadow.receiveShadow = true;
  scene.add(shadow);

  sideMat = new THREE.MeshStandardMaterial({ color: 0xe9e3d0, roughness: 0.9 });
  backMat = new THREE.MeshStandardMaterial({ map: makeBackTexture(), roughness: 0.85 });
}

/* 札の並びが画面いっぱいに収まるカメラ位置を求める */
function fitCamera() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  const elev = 90 * Math.PI / 180;                                          // 真俯瞰（真上から見るので、どの札も同じ大きさに映る）
  const zFar = -halfD, zNear = halfD, hx = halfW + 1.2;                    // 札をできるだけ大きく
  const pts = [[-hx, zFar], [hx, zFar], [-hx, zNear], [hx, zNear]];
  const place = dist => {
    camera.position.set(0, Math.sin(elev) * dist, camLook.z + Math.cos(elev) * dist);
    camera.lookAt(camLook); camera.updateMatrixWorld();
    return pts.map(([x, z]) => new THREE.Vector3(x, 0, z).project(camera));
  };
  // 下は暗記中のボタンの上まで（ボタンが隠れている間も同じ場所を空けておく）
  const act = $('actions'), wasHidden = act.classList.contains('hide');
  act.classList.remove('hide');
  const actTop = act.getBoundingClientRect().top;
  act.classList.toggle('hide', wasHidden);
  // 「あなた X － X ロボット」・白い帯・札・下のボタンの間隔が同じになるように、白い帯の位置と札の位置を決める。
  // 帯を動かすと札の置き場も変わるので、数回くり返して合わせる
  const GAP_MIN = 12, kami = $('kami');
  // PC 表示（幅 768px 以上）では、札を karuta-taisen.html の平面版と同じ大きさ（幅 148px）にとどめる
  const minDist = w >= 768 ? h * W / (PC_CARD_PX * 2 * Math.tan(camera.fov * Math.PI / 360)) : 0;
  let gap = GAP_MIN, best = null;
  for (let it = 0; it < 6; it++) {
    kami.style.marginTop = (gap - 3) + 'px';                               // 3px：スコアの文字の下にある行の余白ぶん
    const top = kami.getBoundingClientRect().bottom + GAP_MIN, bottom = actTop - GAP_MIN;
    const topLimit = 1 - 2 * top / h, bottomLimit = 1 - 2 * bottom / h;
    const fits = dist => place(dist).every(p => Math.abs(p.x) < 0.985 && p.y > bottomLimit && p.y < topLimit);
    // 見る位置を前後にずらしながら、いちばん近づける（＝札が大きく映る）位置を探す。同じなら上下の中央に来るものを選ぶ
    best = null;
    for (let k = -80; k <= 80; k++) {
      const zl = k / 10;
      camLook.set(0, 0, zl);
      let lo = 10, hi = 900;
      for (let i = 0; i < 18; i++) { const mid = (lo + hi) / 2; if (fits(mid)) hi = mid; else lo = mid; }
      hi = Math.max(hi, minDist);
      const ys = place(hi).map(p => p.y), off = Math.abs((Math.max(...ys) + Math.min(...ys)) / 2 - (topLimit + bottomLimit) / 2);
      const cost = hi * (1 + 0.3 * off);
      if (!best || cost < best.cost) best = { cost, zl, dist: hi, cardsH: (Math.max(...ys) - Math.min(...ys)) / 2 * h };
    }
    // 空いている高さを3等分（スコア—帯、帯—札、札—ボタン）
    const free = actTop - $('scoreline').getBoundingClientRect().bottom + 3 - kami.offsetHeight - best.cardsH;
    const next = Math.max(GAP_MIN, free / 3);
    if (Math.abs(next - gap) < 0.25) break;
    gap = next;
  }
  camLook.set(0, 0, best.zl);
  place(best.dist);
  camBase.copy(camera.position);
  // 畳の目の大きさを karuta-taisen.html に合わせる：画像（800×500px）が画面上でほぼ原寸になるように敷く
  const pxPerCm = h / (2 * best.dist * Math.tan(camera.fov * Math.PI / 360));
  tatamiTex.repeat.set(FLOOR * pxPerCm / 800, FLOOR * pxPerCm / 500);
  // PC 表示：白い帯の幅を、並べた札のいちばん左からいちばん右までに合わせる（スマホは画面幅いっぱいのまま）
  kami.style.width = w >= 768 ? (2 * halfW * pxPerCm * best.dist / (best.dist - T)).toFixed(1) + 'px' : '';   // 札の表は厚みのぶんカメラに近い
  // 札の表の画像は、画面に映る札の幅（実ピクセル）の2倍で描く。画面の大きさが変わったら描きなおす
  const wantW = clamp(Math.round(pxPerCm * W * renderer.getPixelRatio() * 2), 200, 1600);
  if (Math.abs(wantW - faceTexW) > faceTexW * 0.03) {
    faceTexW = wantW;
    cards.forEach(c => { const old = c.faceMat.map; c.faceMat.map = makeFaceTexture(c.torihuda); old.dispose(); });
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  trailCanvas.width = w * dpr; trailCanvas.height = h * dpr;
}

// ===== 札 =====
const _qy = new THREE.Quaternion(), _qf = new THREE.Quaternion(), _up = new THREE.Vector3(0, 1, 0);
function applyPose(c) {
  c.mesh.position.set(c.x, c.y + T / 2, c.z);
  _qy.setFromAxisAngle(_up, c.yaw);
  _qf.setFromAxisAngle(c.axis, c.flip);
  c.mesh.quaternion.copy(_qf).multiply(_qy);
}

/* karuta-taisen.html と同じ並べ方：スマホ（縦長）は3列×3段、PC（横長）は5枚＋4枚を中央寄せ */
function layout() {
  const cols = canvas.clientHeight > canvas.clientWidth ? 3 : 5;
  const rows = Math.ceil(TOTAL / cols), px = W + GAP, pz = D + GAP;
  halfW = (cols * px - GAP) / 2; halfD = (rows * pz - GAP) / 2;
  const out = [];
  for (let i = 0; i < TOTAL; i++) {
    const r = Math.floor(i / cols), n = Math.min(cols, TOTAL - r * cols), k = i - r * cols;
    out.push({ x: (k - (n - 1) / 2) * px, z: -halfD + D / 2 + r * pz, yaw: 0 });   // 縦・横の線に対してまっすぐ置く
  }
  return out;
}
function clearCards() {
  cards.forEach(c => { scene.remove(c.mesh); c.faceMat.map.dispose(); c.faceMat.dispose(); if (c.showTex) c.showTex.dispose(); if (c.fadeMats) c.fadeMats.forEach(m => m.dispose()); });
  cards = [];
}

function deal(keys) {
  clearCards();
  const homes = layout();
  fitCamera();
  const geo = new THREE.BoxGeometry(W, T, D);
  const stagger = (DEAL_TOTAL - DEAL_DUR) / (TOTAL - 1);
  homes.forEach((home, i) => {
    const poem = poems[keys[i]];
    const faceMat = new THREE.MeshStandardMaterial({ map: makeFaceTexture(poem.torihuda), roughness: 0.8 });
    const mesh = new THREE.Mesh(geo, [sideMat, sideMat, faceMat, backMat, sideMat, sideMat]);
    mesh.castShadow = true; mesh.receiveShadow = true;
    scene.add(mesh);
    // 手前の山札から、裏→表に返りながら1枚ずつ
    const deck = { x: rand(-0.3, 0.3), y: (TOTAL - 1 - i) * T, z: halfD + 9, yaw: rand(-0.18, 0.18), flip: Math.PI };
    const c = {
      mesh, faceMat, number: String(poem.number), torihuda: poem.torihuda, home,
      x: deck.x, y: deck.y, z: deck.z, yaw: deck.yaw, flip: deck.flip, axis: new THREE.Vector3(1, 0, 0),
      vx: 0, vy: 0, vz: 0, yawVel: 0, flipVel: 0,
      state: 'deal', tw: { from: deck, to: { x: home.x, y: 0, z: home.z, yaw: home.yaw, flip: 0 },
        t0: simTime + 0.25 + i * stagger, dur: DEAL_DUR, arc: 5, ease: easeOutQuart, next: 'rest', sound: true },
      role: null, owner: null, settled: 0, flyTime: 0, sweep: null, fade: -1, fadeMats: null, showTex: null, icon: null, badge: null, showT0: -1, showY: 0, showZ: 0
    };
    applyPose(c);
    cards.push(c);
  });
  dealing = true;
}

// ===== 当たり判定の小道具 =====
function toLocal(c, px, pz) {
  const dx = px - c.x, dz = pz - c.z, cs = Math.cos(c.yaw), sn = Math.sin(c.yaw);
  return [dx * cs - dz * sn, dx * sn + dz * cs];
}
function contains(c, px, pz) {
  const [lx, lz] = toLocal(c, px, pz);
  return Math.abs(lx) <= W / 2 && Math.abs(lz) <= D / 2;
}
/* 線分 a→b が札に入る位置 t（0〜1）。当たらなければ -1 */
function segmentHit(c, ax, az, bx, bz) {
  const [x0, z0] = toLocal(c, ax, az), [x1, z1] = toLocal(c, bx, bz);
  let t0 = 0, t1 = 1;
  for (const [p, d, h] of [[x0, x1 - x0, W / 2], [z0, z1 - z0, D / 2]]) {
    if (Math.abs(d) < 1e-9) { if (Math.abs(p) > h) return -1; continue; }
    let a = (-h - p) / d, b = (h - p) / d; if (a > b) [a, b] = [b, a];
    t0 = Math.max(t0, a); t1 = Math.min(t1, b);
    if (t0 > t1) return -1;
  }
  return t0;
}
function corners(c) {
  const cs = Math.cos(c.yaw), sn = Math.sin(c.yaw), ax = [cs * W / 2, -sn * W / 2], az = [sn * D / 2, cs * D / 2];
  return [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([i, j]) => [c.x + ax[0] * i + az[0] * j, c.z + ax[1] * i + az[1] * j]);
}
function overlap(a, b) {
  if (Math.hypot(a.x - b.x, a.z - b.z) > 9) return false;
  const ca = corners(a), cb = corners(b);
  for (const c of [a, b]) {
    const cs = Math.cos(c.yaw), sn = Math.sin(c.yaw);
    for (const [nx, nz] of [[cs, -sn], [sn, cs]]) {
      let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
      for (const [x, z] of ca) { const p = x * nx + z * nz; a0 = Math.min(a0, p); a1 = Math.max(a1, p); }
      for (const [x, z] of cb) { const p = x * nx + z * nz; b0 = Math.min(b0, p); b1 = Math.max(b1, p); }
      if (a1 < b0 || b1 < a0) return false;
    }
  }
  return true;
}
/* 下にある札の上面（札の上をすべるため） */
function baseHeight(c) {
  let base = 0;
  if (c.y > 4) return 0;
  for (const o of cards) if (o !== c && (o.state === 'rest' || o.state === 'kept') && overlap(c, o)) base = Math.max(base, o.y + T);
  return base;
}

// ===== 払い =====
function launch(c, vx, vz, role, rx = 0, rz = 0, spinBias = 0) {
  const s = Math.hypot(vx, vz) || 1;
  c.state = 'fly'; c.role = role; c.settled = 0; c.flyTime = 0; c.sweep = null;
  c.vx = vx * CARD_SPEED; c.vz = vz * CARD_SPEED;
  c.vy = s > LIFT_FROM ? Math.min(135, (s - LIFT_FROM) * 0.42) * rand(0.8, 1.15) : 0;       // 浮く
  c.yawVel = clamp((rz * vx - rx * vz) * 0.012 + spinBias, -26, 26);                        // 当てた位置で回る
  c.axis.set(vz / s, 0, -vx / s);                                                           // 進行方向へ転がる軸
  c.flip -= Math.PI * 2 * Math.round(c.flip / (Math.PI * 2));
  c.flipVel = s > FLIP_FROM ? (s - FLIP_FROM) * 0.034 * rand(0.5, 1.25) : 0;                // 宙返り
}

/* by: 'me'（プレイヤー）か 'cpu'（ロボット）。正解なら取り札に、それ以外は飛んだあと元の場所へ戻る */
function strike(c, hitX, hitZ, vx, vz, curve, by, force = false) {
  let s = Math.hypot(vx, vz);
  if (s < 25) { vx = 0; vz = -110; s = 110; }                               // タップ：軽く奥へ押す
  if (s > MAX_SPEED) { vx *= MAX_SPEED / s; vz *= MAX_SPEED / s; s = MAX_SPEED; }
  const dx = vx / s, dz = vz / s, k = clamp((s - 60) / (MAX_SPEED - 60), 0, 1);
  const ox = c.x, oz = c.z;
  const correct = force || (game.phase === 'reading' && c.number === game.current);
  launch(c, vx, vz, correct ? 'target' : 'swept', hitX - c.x, hitZ - c.z, curve * 5);
  if (correct) c.owner = by;

  // 勢いのある払い：払った方向にある札を、波のように順に巻き込む
  if (s > SWEEP_FROM) {
    const reach = 9 + (s - SWEEP_FROM) * 0.06, half = 4.6;
    for (const o of cards) {
      if (o.state !== 'rest') continue;
      const ex = o.x - ox, ez = o.z - oz, along = ex * dx + ez * dz, lat = -ex * dz + ez * dx;
      if (along < 1 || along > reach || Math.abs(lat) > half) continue;
      const sp = s * 0.62 * (1 - along / (reach * 1.7)), side = lat / half;
      o.sweep = { at: simTime + along / (s * CARD_SPEED), vx: (dx - dz * side * 0.45) * sp * rand(0.85, 1.1), vz: (dz + dx * side * 0.45) * sp * rand(0.85, 1.1), spin: -side * rand(4, 12) };
    }
  }

  sfxHit(k);
  if (by === 'me' && navigator.vibrate) navigator.vibrate(Math.round(8 + 28 * k));
  if (shakeOn) shake = Math.max(shake, k * k * 0.9);
  if (s > 300) {                                                            // ヒットストップ＋一瞬のスロー
    const now = performance.now();
    freezeUntil = now + 45; slowUntil = now + 45 + 240;
  }
  if (ONLINE) {
    // オンライン：取れたかどうかは親ページが決める。札は先に飛ばしておき、結果はあとで受け取る（onlineResult / onlineTaken）
    if (by === 'me' && game.phase === 'reading') {
      toParent({ type: 'strike', num: c.number });
      if (correct) game.phase = 'between'; else onMiss();
    }
  } else if (correct) onTake(by);
  else if (game.phase === 'reading' && by === 'me') onMiss();
}

function startTween(c, to, dur, arc, ease, next) {
  const twoPi = Math.PI * 2;
  const flip = c.flip - twoPi * Math.round(c.flip / twoPi);
  const yaw = to.yaw + (c.yaw - to.yaw) - twoPi * Math.round((c.yaw - to.yaw) / twoPi);
  c.state = 'tween';
  c.vx = c.vy = c.vz = c.yawVel = c.flipVel = 0;
  c.tw = { from: { x: c.x, y: c.y, z: c.z, yaw, flip }, to, t0: simTime, dur, arc, ease, next };
}

// ===== 更新 =====
function updateTween(c) {
  const tw = c.tw, t = (simTime - tw.t0) / tw.dur;
  if (t <= 0) return;
  const k = Math.min(1, t), e = tw.ease(k), a = tw.from, b = tw.to;
  c.x = a.x + (b.x - a.x) * e; c.z = a.z + (b.z - a.z) * e;
  c.y = a.y + (b.y - a.y) * e + Math.sin(Math.PI * k) * tw.arc;
  c.yaw = a.yaw + (b.yaw - a.yaw) * e; c.flip = a.flip + (b.flip - a.flip) * e;
  if (k >= 1) {
    c.state = tw.next; c.tw = null;
    if (tw.sound) sfxPlace();
    if (tw.next === 'kept') markKept(c);
  }
  applyPose(c);
}

function updateFly(c, dt) {
  c.flyTime += dt;
  c.vy -= G * dt;
  c.x += c.vx * dt; c.z += c.vz * dt; c.y += c.vy * dt;
  c.yaw += c.yawVel * dt; c.flip += c.flipVel * dt;
  const near = Math.PI * Math.round(c.flip / Math.PI);                       // 表か裏で平らになる角度
  const minY = baseHeight(c) + Math.abs(Math.sin(c.flip)) * 3.2;            // 傾いた札の角が畳に当たる高さ
  let onGround = false;
  if (c.y <= minY) {
    c.y = minY; onGround = true;
    if (c.vy < -45) { sfxLand(Math.min(1, -c.vy / 200)); c.vy = -c.vy * 0.28; c.flipVel *= 0.55; }
    else if (c.vy < 0) c.vy = 0;
    const sp = Math.hypot(c.vx, c.vz);
    if (sp > 0) { const n = Math.max(0, sp - FRICTION * dt) / sp; c.vx *= n; c.vz *= n; }
    c.yawVel -= Math.sign(c.yawVel) * Math.min(Math.abs(c.yawVel), 16 * dt);
    c.flipVel *= Math.exp(-5 * dt);
    if (Math.abs(c.flipVel) < 4) {                                          // ぱたんと倒れる
      c.flip += (near - c.flip) * (1 - Math.exp(-16 * dt));
      c.flipVel *= Math.exp(-12 * dt);
    }
  } else {
    const drag = Math.exp(-1.2 * dt); c.vx *= drag; c.vz *= drag;
  }
  const still = onGround && Math.hypot(c.vx, c.vz) < 3 && Math.abs(c.yawVel) < 0.3 && Math.abs(c.flip - near) < 0.03 && Math.abs(c.vy) < 5;
  c.settled = still ? c.settled + dt : 0;
  if (c.role === 'swept' && (c.settled > 0.22 || c.flyTime > 2.2)) {
    // 巻き込まれた札・お手つきの札は、スッと元の場所へ戻る
    startTween(c, { x: c.home.x, y: 0, z: c.home.z, yaw: c.home.yaw, flip: 0 }, 0.36, 1.4, easeOutCubic, 'rest');
  } else if (c.role === 'target' && c.flyTime > SHOW_AFTER) {
    startShow(c);                                                           // 取った札・取られた札を目の前に見せる
  }
  applyPose(c);
}

/* 取った札・取られた札：飛んでいる途中から、1回転しながらカメラの手前へ浮き上がらせる。
   本当に高く持ち上げるので、遠近で大きく映り、畳に落ちる影も離れていく */
function showScale() {                                                      // 見せるときに何倍に映すか
  const visH = 2 * camBase.y * Math.tan(camera.fov * Math.PI / 360), visW = visH * camera.aspect;
  return clamp(Math.min(0.58 * visW / W, 0.5 * visH / D), 1.3, SHOW_SCALE);
}
/* 大きく映しても文字がぼやけないよう、見せるとき専用の細かい画像を用意する（読みはじめに、その首の札のぶんだけ）。
   faceTexW は「並んでいるときの札の幅の2倍」なので、見せるときの幅（showScale 倍）の2倍になるように描く */
function prepareShowTexture(c) {
  if (c.showTex) return;
  const w = Math.min(Math.round(faceTexW * showScale()), 2048, renderer.capabilities.maxTextureSize);
  if (w <= faceTexW) return;
  c.showTex = makeFaceTexture(c.torihuda, w);
  c.showTex.anisotropy = renderer.capabilities.getMaxAnisotropy();          // 傾けて見せるときも甘くならないように
}
function startShow(c) {
  const dist = camBase.y, s = showScale();
  if (c.showTex) { const old = c.faceMat.map; c.faceMat.map = c.showTex; c.showTex = null; old.dispose(); }
  // 高さ y に置いた札は dist / (dist - y) 倍に映る。画面上で札の並びの中央に来るよう、前後の位置も合わせる
  startTween(c, { x: 0, y: dist * (1 - 1 / s), z: camLook.z * (1 - 1 / s), yaw: 0, flip: 0 }, SHOW_RISE, 0, easeOutBack, 'show');
  c.tw.from.yaw += Math.PI * 2 * (c.owner === 'cpu' ? -1 : 1);
}
/* オンライン：取られた札は元の場所に置いたまま、少し暗くして、取った人の動物バッジを右上につける
   （karuta-taisen.html の平面版と同じ見せ方。3人以上で遊んでも、だれが取ったかわかる） */
const badgeMats = {};
function badgeMaterial(icon) {
  if (badgeMats[icon]) return badgeMats[icon];
  const S = 160, c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
  g.fillStyle = '#fff'; g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 12, 0, Math.PI * 2); g.fill();
  g.shadowColor = 'transparent';
  g.font = `${S * 0.56}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(icon, S / 2, S / 2 + S * 0.04);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return (badgeMats[icon] = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false }));
}
const BADGE = 2.7;                                                          // バッジの直径 cm
let badgeGeo = null;
function setBadge(c) {
  if (!c.icon || c.badge) return;
  badgeGeo = badgeGeo || new THREE.PlaneGeometry(BADGE, BADGE);
  c.badge = new THREE.Mesh(badgeGeo, badgeMaterial(c.icon));
  c.badge.rotation.x = -Math.PI / 2;
  c.badge.position.set(W / 2 - 0.5, T / 2 + 0.05, -D / 2 + 0.5);            // 右上の角に、少しはみ出して
  c.badge.renderOrder = 2;
  c.mesh.add(c.badge);
}
function markKept(c) {
  c.state = 'kept'; c.tw = null; c.vx = c.vy = c.vz = 0;
  // 大きく見せるための細かい画像のままだと、小さく映したときに文字がちらつくので、並べるときの画像に戻す
  const old = c.faceMat.map; c.faceMat.map = makeFaceTexture(c.torihuda); old.dispose();
  c.faceMat.color.setScalar(0.6);
  setBadge(c);
}

function updateShow(c) {
  if (c.showT0 < 0) { c.showT0 = simTime; c.showY = c.y; c.showZ = c.z; }
  const t = simTime - c.showT0, a = t * 5;
  // 見せている間は、傾きの向きをゆっくり回して立体に見せる
  c.axis.set(Math.cos(a), 0, Math.sin(a));
  c.flip = 0.16 * Math.min(1, t / 0.12);
  if (t > SHOW_HOLD && ONLINE) {
    // オンライン：見せ終わったら元の場所へ戻して置いておく（だれが取ったかは動物のバッジで示す）
    startTween(c, { x: c.home.x, y: 0, z: c.home.z, yaw: c.home.yaw, flip: 0 }, KEEP_BACK, 0, easeOutCubic, 'kept');
    c.tw.sound = true;
  } else if (t > SHOW_HOLD) {
    // 取った側（自分＝手前、ロボット＝奥）へ下りながら消える
    const k = Math.min(1, (t - SHOW_HOLD) / SHOW_OUT), e = k * k;
    if (c.fade < 0) {
      c.fade = 0; c.mesh.castShadow = false;
      c.fadeMats = c.mesh.material.map(m => { const n = m.clone(); n.transparent = true; return n; });
      c.mesh.material = c.fadeMats;
    }
    c.fade = e;
    c.fadeMats.forEach(m => { m.opacity = 1 - e; });
    c.z = c.showZ + (c.owner === 'cpu' ? -1 : 1) * e * (halfD + 14);
    c.y = c.showY * (1 - 0.75 * e);
    if (k >= 1) { c.state = 'taken'; c.mesh.visible = false; }
  }
  applyPose(c);
}

function step(dt) {
  simTime += dt;
  let stillDealing = false;
  for (const c of cards) {
    if (c.state === 'deal') { stillDealing = true; updateTween(c); }
    else if (c.state === 'tween') updateTween(c);
    else if (c.state === 'fly') updateFly(c, dt);
    else if (c.state === 'show') updateShow(c);
    else if (c.state === 'rest' && c.sweep && simTime >= c.sweep.at) {
      const s = c.sweep; launch(c, s.vx, s.vz, 'swept', 0, 0, s.spin);
      sfxLand(0.8);
    }
  }
  if (dealing && !stillDealing && cards.length) { dealing = false; onDealt(); }
}

// ===== ゲーム進行（karuta-taisen.html のロボット対戦と同じ流れ） =====
function setStatus(text, warn) { $('status').textContent = text; $('status').classList.toggle('warn', !!warn); }
function updateScore() {
  if (ONLINE) {                                                             // オンライン：点数のかわりに「参加者：🐻🐼 ・ あなた：🐻」（動物バッジ）を出す
    $('dots_me').textContent = $('dots_cpu').textContent = '';
    $('score_text').textContent = game.players.icons.length ? TXT.players(game.players.icons.join(''), game.players.me) : '';
    return;
  }
  const { me, cpu } = game.score, R = WIN - 1;
  // あと1枚で決まる場面は、点数のかわりに赤い文字で知らせる（4－4／自分が先に4枚／ロボットが先に4枚）
  const alert = me === R && cpu === R ? 'even' : me === R && cpu < R ? 'reachMe' : cpu === R && me < R ? 'reachCpu' : '';
  $('dots_me').textContent = '■'.repeat(me); $('dots_cpu').textContent = '■'.repeat(cpu);
  $('score_text').textContent = alert ? TXT[alert] : TXT.score(me, cpu);
  const line = $('scoreline');
  if (line.dataset.alert !== alert) {                                       // 表示が切り替わった瞬間だけ点滅しなおす
    line.dataset.alert = alert;
    line.classList.remove('alert');
    if (alert) { void line.offsetWidth; line.classList.add('alert'); }
  }
}
function clearTimers() { game.timers.forEach(clearTimeout); game.timers = []; }

function newGame() {
  clearTimers(); audio.pause(); rainAudio.pause();
  document.body.classList.remove('penalty');
  $('result').classList.add('hide'); $('actions').classList.add('hide'); $('kami').textContent = '';
  game.score.me = game.score.cpu = 0; game.index = -1; game.current = null; game.penaltyUntil = 0;
  const keys = Object.keys(poems).sort(() => Math.random() - 0.5).slice(0, TOTAL);
  game.order = keys.map(k => String(poems[k].number)).sort(() => Math.random() - 0.5);
  game.order.forEach(n => { const a = new Audio(); a.preload = 'auto'; a.src = audioUrl(n); });   // 先読み
  game.phase = 'deal';
  updateScore(); setStatus(TXT.dealing);
  deal(keys);
}
const audioUrl = n => `/sound/d_${String(n).padStart(3, '0')}.mp3?v=20260527`;

function onDealt() {
  if (ONLINE) {                                                             // オンライン：暗記の時間はなく、親ページからの読み上げ開始を待つ
    if (game.phase === 'deal') { game.phase = 'memorize'; setStatus(TXT.soon); }
    return;
  }
  game.phase = 'memorize';
  setStatus('');
  $('actions').classList.remove('hide');
}

function startCountdown() {
  $('actions').classList.add('hide');
  game.phase = 'countdown';
  let sec = 3;
  const tick = () => {
    if (sec > 0) { setStatus(TXT.startIn(sec--)); later(tick, 1000); }
    else startReading(0);
  };
  tick();
}

function startReading(i) {
  showReading(i, game.order[i]);
  audio.src = audioUrl(game.current);
  audio.play().catch(() => { });
  scheduleCpu();
}
/* 読みはじめの表示（第○首・上の句を1文字ずつ）。音声は呼び出し側が鳴らす */
function showReading(i, num) {
  game.index = i; game.current = num; game.phase = 'reading';
  setStatus(TXT.card(i + 1));
  const target = cards.find(c => c.number === game.current);
  if (target) prepareShowTexture(target);
  const entry = kimariji.find(e => String(e.id) === game.current);
  // 上の句を1文字ずつ表示
  const text = entry.kami_no_ku_kana.replace(/<br\s*\/?>/gi, '　').replace(/<[^>]+>/g, '');
  // 白い帯に1行で入りきらない歌は、最初に全文の幅を測って、入る大きさまで文字を小さくする（必ず1行）
  const kami = $('kami');
  kami.style.fontSize = '';
  kami.textContent = text;
  const range = document.createRange(); range.selectNodeContents(kami);
  const full = range.getBoundingClientRect().width, avail = kami.clientWidth - 20;
  if (full > avail) kami.style.fontSize = Math.floor(parseFloat(getComputedStyle(kami).fontSize) * avail / full * 10) / 10 + 'px';
  kami.textContent = '';
  for (let n = 1; n <= text.length; n++) later(() => { if (game.phase === 'reading' && game.index === i) $('kami').textContent = text.slice(0, n); }, n * 120);
}

function scheduleCpu() {
  const s = CPU_SETTINGS[game.difficulty], i = game.index;
  const correct = Math.random() < s.accuracy;
  later(function act() {
    if (game.phase !== 'reading' || game.index !== i) return;
    const free = cards.filter(c => c.state === 'rest');
    const target = correct ? cards.find(c => c.number === game.current) : free.filter(c => c.number !== game.current)[Math.floor(Math.random() * Math.max(1, free.length - 1))];
    if (!target) return;
    if (target.state !== 'rest') { later(act, 150); return; }              // 宙にある間は待つ
    if (!correct) { setStatus(TXT.cpuMiss, true); sfxMiss(); later(() => { if (game.phase === 'reading' && game.index === i && performance.now() > game.penaltyUntil) setStatus(TXT.card(i + 1)); }, 1200); }
    rivalStrike(target, correct ? rand(320, 430) : rand(150, 230));
  }, s.reactionTimeMin + Math.random() * (s.reactionTimeMax - s.reactionTimeMin));
}

/* 相手（ロボット・オンラインの相手）は奥から、近いほうの外側へ払う。force：読まれている札でなくても取り札として扱う */
function rivalStrike(target, sp, force = false) {
  const side = target.x === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(target.x), a = rand(-0.2, 0.5);
  strike(target, target.x - side * rand(0.5, 2), target.z + rand(-2.5, 2.5), side * Math.cos(a) * sp, Math.sin(a) * sp, rand(-0.3, 0.3), 'cpu', force);
}

function onTake(by) {
  clearTimers(); audio.pause();
  game.score[by]++; game.phase = 'between';
  game.penaltyUntil = 0; document.body.classList.remove('penalty');
  updateScore();
  if (game.score[by] >= WIN) {                                              // 先に5枚で勝負あり
    game.phase = 'over';
    setStatus(TXT.over);
    later(showResult, 1400);
  } else {
    setStatus(by === 'me' ? TXT.took : TXT.cpuTook);
    later(() => startReading(game.index + 1), 1500);
  }
}

function onMiss() {                                                         // お手つき：3秒間さわれない
  sfxMiss();
  const i = game.index;
  game.penaltyUntil = performance.now() + (ONLINE ? 3100 : 3000);           // オンライン：親ページ側の3秒が終わってから触れるように少し長く
  document.body.classList.add('penalty');
  setStatus(TXT.miss, true);
  later(() => {
    document.body.classList.remove('penalty');
    if (game.phase === 'reading' && game.index === i) setStatus(TXT.card(i + 1));
  }, 3000);
}

// ===== オンライン対戦（親ページ karuta-taisen.html からの知らせで動く） =====
/* 親 → このページ：setup（札を並べる）／read（読みはじめ）／taken（だれかが取った）／result（自分の払いの結果）／over（終了）
   このページ → 親：ready（準備できた）／strike（読み上げ中に札を払った） */
function setOnlineScore(msg) {
  if (msg.me == null) return;
  game.score.me = msg.me; game.score.cpu = msg.other || 0;
}
function finishDealNow() {                                                  // 配っている途中の札を、すぐ置き場所へ
  for (const c of cards) {
    if (c.state !== 'deal') continue;
    const b = c.tw.to;
    c.x = b.x; c.y = b.y; c.z = b.z; c.yaw = b.yaw; c.flip = b.flip; c.state = 'rest'; c.tw = null;
    applyPose(c);
  }
  if (dealing) { dealing = false; onDealt(); }
}
function onlineSetup(msg) {
  const keys = (msg.keys || []).map(n => Object.keys(poems).find(k => String(poems[k].number) === String(n)));
  if (keys.length !== TOTAL || keys.some(k => !k)) { toParent({ type: 'unsupported' }); return; }
  clearTimers();
  document.body.classList.remove('penalty');
  $('result').classList.add('hide'); $('actions').classList.add('hide'); $('kami').textContent = '';
  game.index = -1; game.current = null; game.penaltyUntil = 0; game.phase = 'deal';
  setOnlineScore(msg); setStatus(TXT.dealing);
  deal(keys);
  const taken = msg.taken || {};                                            // 途中から参加したとき：もう取られた札は、バッジをつけて置いておく
  cards.forEach(c => {
    const t = taken[c.number]; if (!t) return;
    const b = c.tw.to;
    c.x = b.x; c.y = b.y; c.z = b.z; c.yaw = b.yaw; c.flip = b.flip; c.role = 'target'; c.owner = t.by === 'me' ? 'me' : 'cpu'; c.icon = t.icon || null;
    applyPose(c); markKept(c);
  });
  if (msg.instant) finishDealNow();
}
function onlineRead(msg) {
  if (game.phase === 'over' || !cards.length) return;
  finishDealNow();
  showReading(msg.index, String(msg.num));
}
function onlineTaken(msg) {
  setOnlineScore(msg);
  const num = String(msg.num), c = cards.find(c => c.number === num), by = msg.by === 'me' ? 'me' : 'cpu';
  if (num === game.current && game.phase !== 'over') { game.phase = 'between'; setStatus(by === 'me' ? TXT.took : TXT.rivalTook); }
  if (!c || c.state === 'taken') return;
  if (msg.icon) c.icon = String(msg.icon);
  if (c.state === 'kept') { c.owner = by; setBadge(c); return; }           // もう置いてある札：バッジだけ（まだなら）つける
  if (c.role === 'target' && c.state !== 'rest') { c.owner = by; return; }  // 自分が払って飛んでいる札：だれの札になったかだけ決まる
  if (c.state === 'rest' && by === 'cpu') { rivalStrike(c, rand(320, 430), true); return; }   // 相手に取られた：相手が払ったように飛ばす
  c.owner = by; c.role = 'target';                                          // 巻き込まれて宙にある・戻る途中など：そのまま見せる演出へ
  if (c.state !== 'fly') { prepareShowTexture(c); startShow(c); }
}
function onlineResult(msg) {
  const num = String(msg.num), c = cards.find(c => c.number === num);
  if (msg.result === 'lost') {                                              // わずかな差で相手が先に取っていた
    if (c && c.role === 'target') c.owner = 'cpu';
    if (num === game.current) setStatus(TXT.rivalTook);
  } else if (msg.result === 'ignored' && c && c.role === 'target' && c.state !== 'taken' && c.state !== 'kept' && c.fade < 0) {
    // 親ページが受け付けなかった（お手つきの待ち時間中など）：札を元の場所へ戻す
    c.owner = null; c.role = 'swept';
    if (c.state !== 'fly') { c.showT0 = -1; startTween(c, { x: c.home.x, y: 0, z: c.home.z, yaw: c.home.yaw, flip: 0 }, 0.36, 1.4, easeOutCubic, 'rest'); }
    if (num === game.current && game.phase === 'between') game.phase = 'reading';
  }
}
function onlineOver() {
  game.phase = 'over';
  document.body.classList.remove('penalty');
  setStatus(TXT.over);
}

function showResult() {
  const win = game.score.me > game.score.cpu;
  $('result').classList.remove('hide');
  $('kami').textContent = '';
  toParent({ type: 'result', win, me: game.score.me, cpu: game.score.cpu, difficulty: game.difficulty });
  // 勝ち：終わりの音＋「めでたし！」＋桜吹雪／負け：雨の音＋「惜しい！」＋雨
  if (win) { audio.src = FINISH_AUDIO; audio.play().catch(() => { }); _sakuraEndGame(); }
  else { rainAudio.muted = false; rainAudio.currentTime = 0; rainAudio.play().catch(() => { }); _defeatInkEffect(); }
}

// ===== 勝ったとき・負けたときの演出（karuta-taisen.html と同じもの。PIXI は html で読み込む） =====
const PIXI = window.PIXI;
const rainAudio = new Audio('/sound/rain.mp3?v=20260527');
const FINISH_AUDIO = '/sound/finish.m4a?v=20260527';
// 桜吹雪
let _pixiApp = null;
function _getPixiApp() {
  if (_pixiApp) return _pixiApp;
  try {
    _pixiApp = new PIXI.Application({
      width: window.innerWidth, height: window.innerHeight,
      backgroundAlpha: 0, antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true,
    });
    const cv = _pixiApp.view;
    Object.assign(cv.style, { position: 'fixed', top: '0', left: '0', zIndex: '9999', pointerEvents: 'none' });
    document.body.appendChild(cv);
    window.addEventListener('resize', () => { if (_pixiApp) _pixiApp.renderer.resize(window.innerWidth, window.innerHeight); });
  } catch (e) { _pixiApp = null; }
  return _pixiApp;
}
function _sakuraEndGame() {
  const overlay = document.createElement('div');
  overlay.id = 'medetashi-overlay';
  overlay.innerHTML = `<img src="/img/dango_win.webp" alt="${TXT.winAlt}"><span>${TXT.win}</span>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('animationend', () => overlay.remove());

  const app = _getPixiApp();
  if (!app) return;
  const SW = window.innerWidth, SH = window.innerHeight;
  const SAKURA = [0xFFB7C5, 0xFFD0DA, 0xFF8FAB, 0xFFC0CB, 0xFF69B4, 0xFFE4E8, 0xDE5B8A, 0xFFCDD5, 0xF4A7B9, 0xFF4D79];
  function burst(ox, oy, count) {
    const petals = [];
    for (let i = 0; i < count; i++) {
      const g = new PIXI.Graphics();
      const c = SAKURA[Math.floor(Math.random() * SAKURA.length)];
      const s = 0.9 + Math.random() * 1.1;
      const pw = 12 * s, ph = 19 * s;
      g.beginFill(c, 0.82 + Math.random() * 0.18);
      g.moveTo(0, ph / 2);
      g.bezierCurveTo(pw / 2, ph / 4, pw / 2, -ph / 8, 1.8, -ph / 2 + 3.5);
      g.quadraticCurveTo(0, -ph / 2 - 2, -1.8, -ph / 2 + 3.5);
      g.bezierCurveTo(-pw / 2, -ph / 8, -pw / 2, ph / 4, 0, ph / 2);
      g.endFill();
      g.beginFill(0xFFFFFF, 0.18);
      g.drawEllipse(pw * 0.08, -ph * 0.05, pw * 0.18, ph * 0.32);
      g.endFill();
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const speed = 5 + Math.random() * 14;
      g.vx = Math.cos(angle) * speed; g.vy = Math.sin(angle) * speed;
      g.gravity = 0.22; g.flutter = 0.7 + Math.random() * 1.3;
      g.fp = Math.random() * Math.PI * 2; g.rotSpeed = (Math.random() - 0.5) * 0.13;
      g.x = ox; g.y = oy; g.rotation = Math.random() * Math.PI * 2; g.alpha = 1;
      app.stage.addChild(g); petals.push(g);
    }
    let f = 0;
    const tick = () => {
      f++;
      petals.forEach(p => {
        p.x += p.vx + Math.sin(f * 0.12 + p.fp) * p.flutter;
        p.y += p.vy; p.vy += p.gravity; p.vx *= 0.98;
        p.alpha -= 0.011; p.rotation += p.rotSpeed;
      });
      if (f >= 130) { app.ticker.remove(tick); petals.forEach(p => { app.stage.removeChild(p); p.destroy(); }); }
    };
    app.ticker.add(tick);
  }
  burst(SW * 0.5, SH * 0.5, 80);
}

function _defeatInkEffect() {
  const loseOverlay = document.createElement('div');
  loseOverlay.id = 'oshii-overlay';
  loseOverlay.innerHTML = `<img src="/img/dango_lose.webp" alt="${TXT.loseAlt}"><span>${TXT.lose}</span>`;
  document.body.appendChild(loseOverlay);
  loseOverlay.addEventListener('animationend', () => loseOverlay.remove());

  const app = _getPixiApp();
  if (!app) return;
  const SW = window.innerWidth, SH = window.innerHeight;

  const F_FADEIN = 36;
  const F_HOLD = 264;
  const F_FADEOUT = 300;

  const container = new PIXI.Container();
  app.stage.addChild(container);

  const overlayG = new PIXI.Graphics();
  container.addChild(overlayG);
  const rainG = new PIXI.Graphics();
  container.addChild(rainG);
  const rippleG = new PIXI.Graphics();
  container.addChild(rippleG);

  const drops = Array.from({ length: 120 }, () => ({
    x: Math.random() * SW * 1.4 - SW * 0.2,
    y: Math.random() * SH,
    speed: 10 + Math.random() * 10,
    len: 12 + Math.random() * 20,
    slant: 0.05 + Math.random() * 0.08,
    alpha: 0.18 + Math.random() * 0.42,
  }));

  const ripples = [];
  const PUDDLE_TOP = SH * 0.55;
  let nextSpawn = 0;

  function spawnRipple() {
    ripples.push({
      x: SW * 0.02 + Math.random() * SW * 0.96,
      y: PUDDLE_TOP + Math.random() * (SH - PUDDLE_TOP) * 0.9,
      r: 0,
      maxR: 15 + Math.random() * 55,
      alpha: 0.55 + Math.random() * 0.38,
      scaleY: 0.18 + Math.random() * 0.2,
    });
  }

  let f = 0;
  const tick = () => {
    f++;

    const master =
      f <= F_FADEIN ? f / F_FADEIN :
        f <= F_HOLD ? 1 :
          f <= F_FADEOUT ? 1 - (f - F_HOLD) / (F_FADEOUT - F_HOLD) : 0;

    overlayG.clear();
    overlayG.beginFill(0x060818, 0.58 * master);
    overlayG.drawRect(0, 0, SW, SH);
    overlayG.endFill();

    if (f >= F_FADEIN && f < F_HOLD && f >= nextSpawn) {
      const n = 2 + Math.floor(Math.random() * 3);
      for (let k = 0; k < n; k++) spawnRipple();
      nextSpawn = f + 2 + Math.floor(Math.random() * 4);
    }

    rainG.clear();
    drops.forEach(d => {
      d.y += d.speed;
      d.x += d.speed * d.slant;
      if (d.y > SH + d.len) {
        d.x = Math.random() * SW * 1.4 - SW * 0.2;
        d.y = -d.len - Math.random() * 60;
      }
      rainG.lineStyle(1, 0x7a9ab8, d.alpha * master);
      rainG.moveTo(d.x, d.y);
      rainG.lineTo(d.x + d.len * d.slant, d.y + d.len);
    });
    rainG.lineStyle(0);

    rippleG.clear();
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += (rp.maxR - rp.r) * 0.07 + 0.55;
      rp.alpha *= 0.962;
      if (rp.alpha < 0.02) { ripples.splice(i, 1); continue; }

      const a = rp.alpha * master;
      const ry = rp.r * rp.scaleY;
      rippleG.lineStyle(1.5, 0x7ab4cc, a);
      rippleG.drawEllipse(rp.x, rp.y, rp.r, ry);
      if (rp.r > 14) {
        rippleG.lineStyle(0.9, 0x9ccce0, a * 0.42);
        rippleG.drawEllipse(rp.x, rp.y, rp.r * 0.5, ry * 0.5);
      }
    }
    rippleG.lineStyle(0);

    if (f >= F_FADEOUT) {
      app.ticker.remove(tick);
      app.stage.removeChild(container);
      container.destroy({ children: true });
    }
  };

  app.ticker.add(tick);
}

// ===== 指の軌跡 =====
const trail = [];
function drawTrail(now) {
  const g = trailCanvas.getContext('2d'), dpr = trailCanvas.width / canvas.clientWidth;
  g.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  while (trail.length && now - trail[0].t > 220) trail.shift();
  g.lineCap = 'round';
  for (let i = 1; i < trail.length; i++) {
    const a = trail[i - 1], b = trail[i];
    if (a.id !== b.id) continue;
    const k = 1 - (now - b.t) / 220;
    g.strokeStyle = `rgba(255,248,225,${0.55 * k})`; g.lineWidth = (2 + 9 * k) * dpr;
    g.beginPath(); g.moveTo(a.x * dpr, a.y * dpr); g.lineTo(b.x * dpr, b.y * dpr); g.stroke();
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  const real = Math.min(0.05, (now - lastReal) / 1000 || 0); lastReal = now;
  let scale = 1;
  if (now < freezeUntil) scale = 0;
  else if (now < slowUntil) scale = 0.35 + 0.65 * (1 - (slowUntil - now) / 240);
  const dt = real * scale * DEBUG_SPEED;
  for (let i = 0; i < 2; i++) step(dt / 2);
  shake *= Math.exp(-9 * real);
  camera.position.set(camBase.x + rand(-1, 1) * shake, camBase.y + rand(-1, 1) * shake, camBase.z + rand(-1, 1) * shake * 0.5);
  camera.lookAt(camLook);
  camera.updateMatrixWorld();
  renderer.render(scene, camera);
  drawTrail(now);
}

// ===== 入力 =====
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -T), hit3 = new THREE.Vector3();
let ptr = null;   // { id, samples:[{x,z,t}], pending:{card,x,z,sx,sz}, spent }
const canPlay = () => (game.phase === 'memorize' || (game.phase === 'reading' && performance.now() >= game.penaltyUntil));
function groundPoint(e) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.ray.intersectPlane(plane, hit3) ? { x: hit3.x, z: hit3.z, px: e.clientX, py: e.clientY, t: performance.now() } : null;
}
function fire() {
  const s = ptr.samples, last = s[s.length - 1], p = ptr.pending;
  let first = last;
  for (let i = s.length - 1; i >= 0 && last.t - s[i].t <= 70; i--) first = s[i];
  const dtm = Math.max(8, last.t - first.t) / 1000;
  // 向きは畳の上での動き、強さは画面上の速さ（画面の大きさに対する割合）から決める
  const wx = last.x - first.x, wz = last.z - first.z, wl = Math.hypot(wx, wz);
  const sp = wl < 1e-6 ? 0 : Math.hypot(last.px - first.px, last.py - first.py) / dtm / Math.min(canvas.clientWidth, canvas.clientHeight) * SWIPE_SCALE;
  const vx = wl ? wx / wl * sp : 0, vz = wl ? wz / wl * sp : 0;
  // 軌跡の曲がり具合（弧を描く払いは札を回す）
  const mid = s[Math.max(0, s.length - 1 - Math.floor((s.length - s.indexOf(first)) / 2))];
  const ax = mid.x - first.x, az = mid.z - first.z, bx = last.x - mid.x, bz = last.z - mid.z;
  const curve = clamp((az * bx - ax * bz) / ((Math.hypot(ax, az) * Math.hypot(bx, bz)) || 1), -1, 1);
  ptr.pending = null; ptr.spent = true;
  if (p.card.state === 'rest' && canPlay()) strike(p.card, p.x, p.z, vx, vz, curve, 'me');
}
canvas.addEventListener('pointerdown', e => {
  initAudio();
  if (!canPlay() || ptr) return;
  const p = groundPoint(e); if (!p) return;
  canvas.setPointerCapture(e.pointerId);
  ptr = { id: e.pointerId, samples: [p], pending: null, spent: false };
  trail.push({ x: e.offsetX, y: e.offsetY, t: p.t, id: e.pointerId });
  const c = cards.find(c => c.state === 'rest' && contains(c, p.x, p.z));
  if (c) ptr.pending = { card: c, x: p.x, z: p.z, sx: p.x, sz: p.z };
});
canvas.addEventListener('pointermove', e => {
  if (!ptr || e.pointerId !== ptr.id) return;
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  for (const ev of (evs.length ? evs : [e])) {
    const p = groundPoint(ev); if (!p) continue;
    const prev = ptr.samples[ptr.samples.length - 1];
    ptr.samples.push(p); if (ptr.samples.length > 40) ptr.samples.shift();
    if (ptr.spent) continue;
    if (!ptr.pending) {                                                     // 指が最初に触れた札を探す
      let best = null, bt = 2;
      for (const c of cards) {
        if (c.state !== 'rest') continue;
        const t = segmentHit(c, prev.x, prev.z, p.x, p.z);
        if (t >= 0 && t < bt) { bt = t; best = c; }
      }
      if (best) {
        const hx = prev.x + (p.x - prev.x) * bt, hz = prev.z + (p.z - prev.z) * bt;
        ptr.pending = { card: best, x: hx, z: hz, sx: hx, sz: hz };
      }
    }
    if (ptr.pending && Math.hypot(p.x - ptr.pending.sx, p.z - ptr.pending.sz) > 1.0) fire();
  }
  trail.push({ x: e.offsetX, y: e.offsetY, t: performance.now(), id: e.pointerId });
});
function endPointer(e) {
  if (!ptr || e.pointerId !== ptr.id) return;
  if (ptr.pending && e.type === 'pointerup') fire();
  ptr = null;
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);

// ===== 画面まわり =====
function begin(difficulty) {
  initAudio();
  audio.play().catch(() => { }); audio.pause();
  unlockRain();                                                            // iOS：最初の操作で音声を解錠
  game.difficulty = difficulty;
  $('start').classList.add('hide');
  newGame();
}
document.querySelectorAll('[data-difficulty]').forEach(btn => btn.addEventListener('click', () => begin(btn.dataset.difficulty)));
// 画面のゆれ あり／なし（選んだ設定は端末に覚えておく）
function setShake(on) {
  shakeOn = on;
  document.querySelectorAll('[data-shake]').forEach(b => b.classList.toggle('on', (b.dataset.shake === 'on') === on));
  try { localStorage.setItem('karuta3d_shake', on ? 'on' : 'off'); } catch (e) { }
}
document.querySelectorAll('[data-shake]').forEach(btn => btn.addEventListener('click', () => setShake(btn.dataset.shake === 'on')));
try { setShake(localStorage.getItem('karuta3d_shake') !== 'off'); } catch (e) { setShake(true); }
$('go').addEventListener('click', () => { initAudio(); startCountdown(); });
// 出題札の振りなおし：暗記中なら何回でも、別の9枚を配りなおす
$('reroll').addEventListener('click', () => { initAudio(); if (game.phase === 'memorize') newGame(); });
// 設定に戻る：強さ・画面のゆれを選ぶ最初の画面へ
$('back').addEventListener('click', () => {
  if (game.phase !== 'memorize') return;
  if (EMBED) { toParent({ type: 'close' }); return; }                      // 埋め込み時：設定は親ページにある
  clearTimers(); game.phase = 'title';
  $('actions').classList.add('hide'); $('start').classList.remove('hide');
});
$('again').addEventListener('click', () => { initAudio(); newGame(); });
window.addEventListener('resize', () => { if (renderer) fitCamera(); });
// 最初に画面に触れたときに音を解錠する（埋め込み時は、このページ内での操作がまだ無いまま始まるため）
function unlockMedia() {
  initAudio();
  if (audio.paused) { audio.play().then(() => { if (game.phase !== 'reading' && game.phase !== 'over') audio.pause(); }).catch(() => { }); }
  unlockRain();
}
// 雨の音（負けたとき用）の解錠。音を消したまま一瞬だけ再生して止める。
// 消さずに再生すると、スマホでは読み込みが終わった時点（札を配っている最中）に雨の音が一瞬聞こえてしまう。
function unlockRain() {
  if (!rainAudio.paused) return;
  rainAudio.muted = true;
  rainAudio.play().then(() => {
    if (game.phase !== 'over') { rainAudio.pause(); rainAudio.currentTime = 0; }
    rainAudio.muted = false;
  }).catch(() => { rainAudio.muted = false; });
}
if (EMBED) {
  window.addEventListener('pointerdown', unlockMedia, { capture: true, once: true });
  $('exit').addEventListener('click', e => { e.preventDefault(); toParent({ type: 'close' }); });
  // 親ページからのお知らせ（ランキングに記録した、など）を状態表示に出す
  window.addEventListener('message', e => {
    if (e.origin !== location.origin || e.source !== window.parent || !e.data || e.data.source !== 'k3d-host') return;
    if (e.data.type === 'note' && game.phase === 'over') setStatus(String(e.data.text || ''));
    if (!ONLINE || !poems) return;
    if (e.data.type === 'players') { game.players = { icons: (e.data.icons || []).map(String), me: String(e.data.me || '') }; updateScore(); }
    else if (e.data.type === 'setup') onlineSetup(e.data);
    else if (e.data.type === 'read') onlineRead(e.data);
    else if (e.data.type === 'taken') onlineTaken(e.data);
    else if (e.data.type === 'result') onlineResult(e.data);
    else if (e.data.type === 'over') onlineOver();
  });
}

async function boot() {
  try {
    initScene();
  } catch (err) {
    $('start').innerHTML = `<p>${TXT.noWebgl}</p>`;
    toParent({ type: 'unsupported' });
    return;
  }
  fitCamera();
  requestAnimationFrame(frame);
  const fontReady = document.fonts && document.fonts.load
    ? Promise.race([document.fonts.load('40px "Yuji Syuku"', 'あ'), new Promise(r => setTimeout(r, 2500))]).catch(() => { })
    : Promise.resolve();
  const [r1, r2] = await Promise.all([fetch('/js/karuta.json'), fetch('/js/kimariji.json'), fontReady]);
  poems = await r1.json(); kimariji = await r2.json();
  $('loading').classList.add('hide');
  document.querySelectorAll('[data-difficulty]').forEach(b => { b.disabled = false; });
  if (ONLINE) { initAudio(); updateScore(); toParent({ type: 'ready' }); }   // オンライン：親ページからの setup を待つ
  else if (EMBED) begin(CPU_SETTINGS[PARAMS.get('difficulty')] ? PARAMS.get('difficulty') : 'normal');
}
boot();

// 動作確認用（コンソールやテストから状態を見る・動かす）
window.__k3d = { get cards() { return cards; }, get camera() { return camera; }, THREE, game, step, strike, startCountdown, showResult, updateScore };
