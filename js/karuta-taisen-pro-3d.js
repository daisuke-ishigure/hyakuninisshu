// 競技かるた 対戦ゲーム（karuta-taisen-pro.html / _en.html）の3D表示。
//
// 盤面の配置・並び替え・送り札・タップの判定は、これまでどおり js/karuta-taisen-pro-shared.js が
// 平面の盤面（DOM）で行う。このファイルは、その盤面の真上に透明な3Dの画面を重ね、
// 札だけを3Dで描く（真上から見下ろす視点。置かれた札の位置と大きさは平面の札とぴったり同じ）。
// 平面の札は透明にして残してあり、タップやドラッグはそのまま平面の札が受ける。
//
// shared.js からは window.K3DPro の build / take / miss / end を呼ぶ。
// WebGL が使えない・three.js が読み込めない場合は何もせず、平面の表示のまま遊べる。
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const FOV = 30;                 // 視野角。小さいほど真上からの見た目に近い
const DEAL_TIME = 0.3;          // 札1枚が配られる時間（秒）
const FLY_TIME = 0.24;          // 払われた札が滑る時間
const SHOW_RISE = 0.42, SHOW_HOLD = 0.5, SHOW_OUT = 0.3;   // 取った札を見せる演出
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeOutBack = t => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
// 札の文字は karuta-taisen-3d.js と同じ書体（Yuji Syuku。ページ側で Google Fonts から読み込む）
const FONT = '"Yuji Syuku","Yu Mincho","Hiragino Mincho ProN","Noto Serif JP",serif';

let renderer = null, scene = null, camera = null, sun = null, shadowPlane = null, canvas = null;
let sideMat = null, backMat = null, boxGeo = null;
let W = 0, H = 0, D = 0;
let cards = [];                 // 3Dの札
let running = false, lastT = 0, snap = true, lastScrollX = 0, lastScrollY = 0;
let failed = false;
// 画面のゆれ（karuta-taisen.html のロボット対戦と同じ程度）。設定は karuta-taisen.html と同じ場所（localStorage の karuta3d_shake）
let shake = 0;                  // ゆれの大きさ（画面のピクセル）。毎フレーム減っていく
const shakeOn = () => { try { return localStorage.getItem('karuta3d_shake') !== 'off'; } catch (e) { return true; } };
function addShake(px) { if (shakeOn()) shake = Math.max(shake, px); }

// ===== 音（札を置く音だけ合成する。札を取る音は shared.js の音声を使う） =====
let noiseBuf = null;
function sfxPlace() {
  const actx = window._proAudioCtx;
  if (!actx || actx.state !== 'running') return;
  if (!noiseBuf) {
    noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.4, actx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = actx.createBufferSource(); src.buffer = noiseBuf;
  const f = actx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = rand(2600, 3400); f.Q.value = 1.2;
  const g = actx.createGain(); const t = actx.currentTime;
  g.gain.setValueAtTime(0.7, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
  src.connect(f).connect(g).connect(actx.destination);
  src.start(t, Math.random() * 0.2, 0.09);
}

// ===== 札の絵柄 =====
function makeFaceTexture(lines, kimariji, texW) {
  const cw = 312, ch = 438;
  const K = texW / cw;
  const c = document.createElement('canvas'); c.width = Math.round(cw * K); c.height = Math.round(ch * K);
  const g = c.getContext('2d');
  g.scale(K, K);
  g.fillStyle = '#2e6a4c'; g.fillRect(0, 0, cw, ch);                       // 緑のふち
  const m = 15;
  g.fillStyle = '#fbf9f3'; g.fillRect(m, m, cw - m * 2, ch - m * 2);        // 紙
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.5; g.strokeRect(m, m, cw - m * 2, ch - m * 2);
  const pad = kimariji ? 40 : 0;                                           // 決まり字を左下に入れる分、文字を上につめる
  const cell = (ch - m * 2 - 26 - pad) / 5, fs = cell * 0.9;
  g.fillStyle = '#16130f'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${fs}px ${FONT}`;
  const colW = (cw - m * 2 - 16) / 3;
  lines.forEach((line, li) => {
    const x = cw - m - 8 - colW * (li + 0.5);                              // 右から左へ
    const chars = [...line], n = chars.length;
    const flat = n > 5 ? 0.86 : 1;                                         // 6文字の行は平たくして5文字分の高さに収める
    const y0 = m + 13 + cell * 0.5 - fs * (1 - flat) / 2;
    const pitch = n > 5 ? (cell * 4 + fs * (1 - flat)) / (n - 1) : cell;
    chars.forEach((chr, ci) => {
      g.save(); g.translate(x, y0 + pitch * ci); g.scale(1, flat); g.fillText(chr, 0, 0); g.restore();
    });
  });
  if (kimariji) {
    g.fillStyle = '#c0392b'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.font = `36px ${FONT}`;
    g.fillText(kimariji, m + 8, ch - m - 9);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  // 画面に映る大きさの2倍で描いた画像を、そのまま縮めて使う（縮小用の画像をはさむと文字が甘くなる）
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
const dpr = () => Math.min(window.devicePixelRatio || 1, 2);
const texWidthFor = px => clamp(Math.round(px * dpr() * 2), 128, Math.min(2048, renderer.capabilities.maxTextureSize));

// ===== 場面 =====
function initScene() {
  if (renderer || failed) return !failed;
  try {
    canvas = document.createElement('canvas');
    canvas.id = 'k3dpro_canvas';
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    console.warn('3D表示を使えないため、平面の表示で続けます:', e);
    failed = true; renderer = null;
    return false;
  }
  renderer.setPixelRatio(dpr());
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  Object.assign(canvas.style, { position: 'fixed', left: '0', top: '0', width: '100%', height: '100%', zIndex: '9000', pointerEvents: 'none' });
  document.body.appendChild(canvas);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FOV, 1, 10, 10000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9a917f, 2.1));
  sun = new THREE.DirectionalLight(0xfff6ea, 1.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.05; sun.shadow.radius = 3;
  scene.add(sun); scene.add(sun.target);
  // 影だけが映る透明な床（畳はページの背景がそのまま見える）
  shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ opacity: 0.3 }));
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  sideMat = new THREE.MeshStandardMaterial({ color: 0xe9e3d0, roughness: 0.9 });
  backMat = new THREE.MeshStandardMaterial({ map: makeBackTexture(), roughness: 0.85 });
  boxGeo = new THREE.BoxGeometry(1, 1, 1);
  window.addEventListener('resize', fit);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); fallback(); });
  fit();
  return true;
}

// 画面の1pxを3D空間の1に対応させる。x は右、y は上（画面の y と逆向き）、z は手前（カメラ側）。
function fit() {
  if (!renderer) return;
  // スクロールバーを除いた表示領域の大きさ（3Dの画面はこの領域いっぱいに重ねてある）
  W = document.documentElement.clientWidth || window.innerWidth; H = document.documentElement.clientHeight || window.innerHeight;
  renderer.setPixelRatio(dpr());
  renderer.setSize(W, H, false);
  D = (H / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  camera.aspect = W / H; camera.near = D * 0.05; camera.far = D * 2;
  camera.position.set(W / 2, -H / 2, D);
  camera.up.set(0, 1, 0);
  camera.lookAt(W / 2, -H / 2, 0);
  camera.updateProjectionMatrix();
  // 光はほぼ真上（少し左上）から。札が浮くと、影が右下へ少しずれて落ちる
  const R = Math.hypot(W, H) * 0.75;
  sun.position.set(W / 2 - D * 0.07, -H / 2 + D * 0.1, D * 0.9);
  sun.target.position.set(W / 2, -H / 2, 0);
  const sc = sun.shadow.camera;
  sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R; sc.near = D * 0.1; sc.far = D * 2.5;
  sc.updateProjectionMatrix();
  shadowPlane.scale.set(W * 3, H * 3, 1);
  shadowPlane.position.set(W / 2, -H / 2, 0);
  snap = true;
}

// 3D表示をやめて平面の表示に戻す（WebGL が途中で使えなくなったときなど）
function fallback() {
  failed = true; api.active = false;
  cards.forEach(disposeCard); cards = [];
  running = false;
  document.body.classList.remove('k3dpro-on');
  if (canvas) canvas.style.display = 'none';
}

// ===== 札 =====
function fieldRotation(el) {
  // 札はその陣の持ち主が読める天地で置く：敵陣（ロボット側）は180度回転、自陣はそのまま。
  // 送り札も、移った先の陣の向きにくるりと回る。
  // （CSS の transform は、送り札が届いたときのアニメーション中は回転を含まないので、陣で決める）
  return el.closest('#pc_enemy_field') ? Math.PI : 0;
}

function makeCard(el) {
  const p = el.querySelector('p');
  const lines = (p ? p.innerHTML : '').split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]+>/g, '').trim());
  const badge = el.querySelector('.kimariji-badge');
  const kimariji = badge ? badge.textContent : '';
  const r = el.getBoundingClientRect();
  const faceMat = new THREE.MeshStandardMaterial({ map: makeFaceTexture(lines, kimariji, texWidthFor(r.width || 100)), roughness: 0.8 });
  const mesh = new THREE.Mesh(boxGeo, [sideMat, sideMat, sideMat, sideMat, faceMat, backMat]);
  mesh.castShadow = true; mesh.receiveShadow = true; mesh.visible = false;
  scene.add(mesh);
  return {
    num: String(el.dataset.number), el, mesh, faceMat, lines, kimariji,
    state: 'deal', t0: 0, parent: null, baseRot: 0,
    x: 0, y: 0, z: 0, w: r.width || 100, h: r.height || 140, rz: 0, rx: 0, ry: 0,
    vx: 0, vy: 0, spin: 0, shake: 0, from: null, byMe: false, showTex: null, ownMats: null,
  };
}
function disposeCard(c) {
  scene.remove(c.mesh);
  if (c.faceMat.map) c.faceMat.map.dispose();
  c.faceMat.dispose();
  if (c.showTex) c.showTex.dispose();
  if (c.ownMats) c.ownMats.forEach(m => m.dispose());
  c.state = 'gone';
}
const thickness = c => clamp(c.w * 0.025, 1.5, 3.5);

function place(c) {
  const T = thickness(c);
  c.mesh.position.set(c.x, -c.y, c.z + T / 2);
  c.mesh.scale.set(c.w, c.h, T);
  c.mesh.rotation.set(c.rx, c.ry, c.rz, 'ZYX');
}

// 平面の札がいまある場所（ドラッグ中は、指についてくる複製の場所）
function targetOf(c, dragClone) {
  const el = dragClone && dragClone.dataset.number === c.num && c.el.style.opacity === '0.25' ? dragClone : c.el;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, drag: el !== c.el };
}

const TINT_NONE = new THREE.Color(1, 1, 1), TINT_SEND = new THREE.Color(0.72, 1, 0.8), TINT_IN = new THREE.Color(1, 0.8, 0.76),
  TINT_MISS = new THREE.Color(1, 0.62, 0.55), TINT_ROBOT = new THREE.Color(1, 0.82, 0.5), TINT_DROP = new THREE.Color(0.75, 1, 0.82);

function updateRest(c, dt, now, dragClone) {
  const el = c.el;
  if (!el.isConnected) { disposeCard(c); return; }
  if (el.parentElement !== c.parent) { c.parent = el.parentElement; c.baseRot = fieldRotation(el); }
  const tg = targetOf(c, dragClone);
  if (!tg.w) return;                                   // 盤面が隠れている間は動かさない
  const cl = el.classList;
  let lift = 0, tint = TINT_NONE, tilt = 0;
  if (tg.drag) { lift = 46; tilt = 0.05; }
  else if (cl.contains('send-card-highlight')) { lift = 5 + 3 * Math.sin(now * 7); tint = TINT_SEND; }
  else if (cl.contains('incoming-sent-card')) { lift = 12; tint = TINT_IN; }
  else if (cl.contains('drop-target')) { lift = 3; tint = TINT_DROP; }
  if (el.style.border) { lift = 16; tint = TINT_ROBOT; }       // ロボットのお手付き（shared.js が枠を付ける）
  if (c.shake > 0) { c.shake -= dt; tint = TINT_MISS; }
  const k = snap ? 1 : 1 - Math.exp(-dt * 16);
  c.x += (tg.x - c.x) * k; c.y += (tg.y - c.y) * k;
  c.w += (tg.w - c.w) * k; c.h += (tg.h - c.h) * k;
  c.z += (lift - c.z) * (snap ? 1 : 1 - Math.exp(-dt * 14));
  const rot = c.baseRot + tilt + (c.shake > 0 ? Math.sin(now * 46) * 0.09 * (c.shake / 0.4) : 0);
  c.rz += (rot - c.rz) * (snap ? 1 : 1 - Math.exp(-dt * 10));
  c.rx += (0 - c.rx) * k; c.ry += (0 - c.ry) * k;
  c.faceMat.color.lerp(tint, snap ? 1 : 1 - Math.exp(-dt * 12));
  place(c);
}

// 配る：盤面の中央の上から、1枚ずつ自分の場所へ
function updateDeal(c, now, dragClone) {
  const t = (now - c.t0) / DEAL_TIME;
  if (t < 0) return;
  const el = c.el;
  if (!el.isConnected) { disposeCard(c); return; }
  if (el.parentElement !== c.parent) { c.parent = el.parentElement; c.baseRot = fieldRotation(el); }
  const tg = targetOf(c, dragClone);
  if (!tg.w) return;
  if (!c.from) {
    const box = document.getElementById('karuta_container').getBoundingClientRect();
    c.from = { x: box.left + box.width / 2 + rand(-6, 6), y: box.top + box.height / 2 + rand(-6, 6), rz: c.baseRot + rand(-0.9, 0.9) };
    c.mesh.visible = true;
  }
  const e = easeOutCubic(clamp(t, 0, 1));
  c.x = c.from.x + (tg.x - c.from.x) * e; c.y = c.from.y + (tg.y - c.from.y) * e;
  c.w = tg.w; c.h = tg.h;
  c.z = 90 * (1 - e) + 26 * Math.sin(Math.PI * clamp(t, 0, 1));
  c.rz = c.from.rz + (c.baseRot - c.from.rz) * e;
  place(c);
  if (t >= 1) { c.state = 'rest'; c.z = 0; sfxPlace(); }
}

// 払われた札：滑って飛ぶ → 画面の中央へ浮き上がって見せる → 取った側へ消える
function updateTaken(c, dt, now) {
  const t = now - c.t0;
  if (c.state === 'fly') {
    c.x += c.vx * dt; c.y += c.vy * dt;
    const damp = Math.exp(-dt * 4); c.vx *= damp; c.vy *= damp;
    c.rz += c.spin * dt; c.spin *= Math.exp(-dt * 2.5);
    c.z = 8 + 34 * Math.sin(Math.PI * clamp(t / FLY_TIME, 0, 1));
    if (t >= FLY_TIME) {
      c.state = 'rise'; c.t0 = now;
      c.rz = Math.atan2(Math.sin(c.rz), Math.cos(c.rz));              // -π〜π にそろえる
      c.from = { x: c.x, y: c.y, z: c.z, rz: c.rz };
      const showW = clamp(Math.min(W * 0.5, H * 0.42 * 0.71), 140, 300);
      c.showS = Math.max(1.3, showW / c.w);
      // 大きく見せても文字がぼやけないよう、見せる大きさに合わせた細かい絵柄に差し替える
      const tw = texWidthFor(c.w * c.showS);
      if (tw > c.faceMat.map.image.width * 1.2) {
        c.showTex = makeFaceTexture(c.lines, c.kimariji, tw);
        c.showTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        c.faceMat.map.dispose(); c.faceMat.map = c.showTex; c.showTex = null; c.faceMat.needsUpdate = true;
      }
      c.faceMat.color.copy(TINT_NONE);
    }
  } else if (c.state === 'rise') {
    const p = clamp(t / SHOW_RISE, 0, 1), e = easeOutCubic(p);
    const zTop = D * (1 - 1 / c.showS);                               // この高さで、見かけの大きさが showS 倍になる
    c.x = c.from.x + (W / 2 - c.from.x) * e; c.y = c.from.y + (H * 0.46 - c.from.y) * e;
    c.z = c.from.z + (zTop - c.from.z) * easeOutBack(p);
    c.rz = c.from.rz * (1 - e);
    c.ry = (1 - e) * Math.PI * 2;                                     // くるりと1回転して表を向ける
    if (p >= 1) { c.state = 'hold'; c.t0 = now; c.zTop = zTop; }
  } else if (c.state === 'hold') {
    c.ry = Math.sin(t * 5.2) * 0.07; c.rx = Math.sin(t * 3.9) * 0.04;
    c.z = c.zTop + Math.sin(t * 4) * 2;
    if (t >= SHOW_HOLD) {
      c.state = 'out'; c.t0 = now; c.from = { y: c.y, z: c.z };
      // 消すときだけ、この札専用の材質にする（側面・裏は全部の札で共有しているため）
      const s = sideMat.clone(), b = backMat.clone();
      c.ownMats = [s, b];
      [s, b, c.faceMat].forEach(m => { m.transparent = true; });
      c.mesh.material = [s, s, s, s, c.faceMat, b];
      c.mesh.castShadow = false;
    }
  } else if (c.state === 'out') {
    const p = clamp(t / SHOW_OUT, 0, 1), e = p * p;
    c.y = c.from.y + (c.byMe ? 1 : -1) * H * 0.42 * e;                // 自分が取ったら手前へ、ロボットなら奥へ
    c.z = c.from.z * (1 - 0.55 * e);
    c.rx = (c.byMe ? -1 : 1) * 0.7 * e;
    const o = 1 - e;
    c.faceMat.opacity = o; c.ownMats.forEach(m => { m.opacity = o; });
    if (p >= 1) { disposeCard(c); return; }
  }
  place(c);
}

function frame(ms) {
  if (!running) return;
  const now = ms / 1000;
  const dt = Math.min(0.05, Math.max(0, now - lastT)); lastT = now;
  if (window.scrollX !== lastScrollX || window.scrollY !== lastScrollY) { lastScrollX = window.scrollX; lastScrollY = window.scrollY; snap = true; }
  const dragClone = document.querySelector('.arr-drag-clone');
  for (const c of cards) {
    if (c.state === 'rest') updateRest(c, dt, now, dragClone);
    else if (c.state === 'deal') updateDeal(c, now, dragClone);
    else if (c.state !== 'gone') updateTaken(c, dt, now);
  }
  cards = cards.filter(c => c.state !== 'gone');
  snap = false;
  shake *= Math.exp(-9 * dt);
  const ox = shake > 0.05 ? rand(-1, 1) * shake : 0, oy = shake > 0.05 ? rand(-1, 1) * shake : 0;
  camera.position.set(W / 2 + ox, -H / 2 + oy, D);
  camera.lookAt(W / 2 + ox, -H / 2 + oy, 0);
  renderer.render(scene, camera);
  if (!cards.length) { running = false; canvas.style.display = 'none'; return; }
  requestAnimationFrame(frame);
}
function start() {
  if (running) return;
  running = true; canvas.style.display = ''; lastT = performance.now() / 1000; snap = true;
  requestAnimationFrame(frame);
}

// ===== shared.js から呼ばれる入口 =====
const api = {
  active: false,
  get shakePx() { return shake; },   // 動作確認用：今の画面のゆれの大きさ（ピクセル）

  // 盤面（平面の札）ができた直後に呼ぶ。札を3Dで作り、1枚ずつ配る
  build() {
    if (!initScene()) return false;
    cards.forEach(disposeCard); cards = [];
    const els = [...document.querySelectorAll('#pc_enemy_field .karuta_card, #pc_my_field .karuta_card')];
    if (!els.length) return false;
    api.active = true;
    document.body.classList.add('k3dpro-on');
    const begin = () => {
      if (!api.active) return;
      fit();
      // 敵陣と自陣を1枚ずつ交互に配る
      const en = els.filter(e => e.closest('#pc_enemy_field')), my = els.filter(e => e.closest('#pc_my_field'));
      const order = [];
      for (let i = 0; i < Math.max(en.length, my.length); i++) { if (en[i]) order.push(en[i]); if (my[i]) order.push(my[i]); }
      const gap = clamp(1.8 / order.length, 0.04, 0.12);
      const t0 = performance.now() / 1000 + 0.25;
      order.forEach((el, i) => { const c = makeCard(el); c.t0 = t0 + i * gap; cards.push(c); });
      start();
    };
    // 札の文字の書体が読み込まれてから絵柄を描く（待つのは最長1.2秒）
    const text = els.map(e => e.textContent).join('');
    let done = false;
    const go = () => { if (!done) { done = true; begin(); } };
    try { document.fonts.load('40px "Yuji Syuku"', text).then(go, go); } catch (e) { go(); }
    setTimeout(go, 1200);
    return true;
  },

  // 札が取られた。byMe: 自分が取ったら true。3Dで演出できたら true を返す
  take(num, byMe) {
    if (!api.active) return false;
    const c = cards.find(c => c.num === String(num) && (c.state === 'rest' || c.state === 'deal'));
    if (!c || !c.mesh.visible) return false;
    const box = document.getElementById('karuta_container').getBoundingClientRect();
    // 盤面の中心から外へ向かって払う（中心に近い札は左右どちらかへ）
    let dx = c.x - (box.left + box.width / 2), dy = (c.y - (box.top + box.height / 2)) * 0.35;
    if (Math.abs(dx) < 20) dx = Math.random() < 0.5 ? -40 : 40;
    const len = Math.hypot(dx, dy) || 1, sp = rand(900, 1300);
    c.vx = dx / len * sp; c.vy = dy / len * sp;
    c.spin = (dx > 0 ? -1 : 1) * rand(9, 15);
    c.byMe = !!byMe; c.state = 'fly'; c.t0 = performance.now() / 1000;
    addShake(rand(9, 17));          // karuta-taisen.html でロボットが払ったときと同じくらい
    return true;
  },

  // お手付きで触れた札をふるわせる
  miss(num) {
    if (!api.active) return;
    const c = cards.find(c => c.num === String(num) && c.state === 'rest');
    if (c) c.shake = 0.4;
    addShake(rand(6, 12));
  },

  // 試合が終わった。場に残っている札は片付け、見せている途中の札は最後まで見せる
  end() {
    if (!api.active) return;
    api.active = false;
    cards.forEach(c => { if (c.state === 'rest' || c.state === 'deal') disposeCard(c); });
    cards = cards.filter(c => c.state !== 'gone');
    document.body.classList.remove('k3dpro-on');
  },
};
window.K3DPro = api;
