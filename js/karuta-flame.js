/* ロボット対戦の強さに応じた演出。
   burst：「名人」（英語版は Master）を選んだときに、ボタンの後ろから炎が一瞬立ちのぼる（karuta-taisen.html・karuta-taisen_en.html。画像は使わず canvas に描く）
   tip ：どの強さでも、ゲームを始める前（暗記中）に、上の句を出す白い帯へ助言を右から左へ流す（上の2ページの平面版と、3D版 karuta-taisen-3d.html）

   使い方：KarutaFlame.tip(白い帯の要素, 'ja' | 'en', 'easy' | 'normal' | 'hard' | 'master')
     流すのをやめるには、帯の textContent を空にする。動きを減らす設定の端末では流さず、小さい文字で止めて見せる

   使い方：KarutaFlame.burst(ボタンの要素)
     ボタンの親（position: relative にしておく）に canvas を重ね、約1秒で消す。押せる範囲には影響しない。
     ボタンは z-index: 1 以上にして、炎がボタンの文字にかぶらないようにする。
     動きを減らす設定の端末では何もしない */
(() => {
  'use strict';
  const EMIT = 520, LIFE = 640;              // 炎が出続ける時間・1つの炎が消えるまでの時間（ミリ秒）
  const UP = 150, DOWN = 14, SIDE = 46;      // ボタンのまわりに取る余白（px）
  const rand = (a, b) => a + Math.random() * (b - a);
  let current = null;                        // 表示中の炎（続けて押されたら前の炎を消してやり直す）

  // 炎の色：出はじめは黄色、のぼるにつれて橙→紅→消える（t は 0〜1）
  function color(t) {
    if (t < 0.22) return [255, 205 - t * 250, 50 - t * 90];
    if (t < 0.55) return [252, 150 - (t - 0.22) * 290, 24];
    return [222 - (t - 0.55) * 110, 54 - (t - 0.55) * 60, 26];
  }

  function burst(btn) {
    const host = btn && btn.offsetParent;
    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (current) current();

    const bw = btn.offsetWidth, bh = btn.offsetHeight;
    // 横スクロールが出ないよう、余白は画面の端まで
    const rect = btn.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    const padL = Math.max(0, Math.min(SIDE, rect.left)), padR = Math.max(0, Math.min(SIDE, vw - rect.right));
    const w = bw + padL + padR, h = bh + UP + DOWN, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute', left: (btn.offsetLeft - padL) + 'px', top: (btn.offsetTop - UP) + 'px',
      width: w + 'px', height: h + 'px', maxWidth: 'none', pointerEvents: 'none', zIndex: '0',
    });
    host.appendChild(canvas);
    const g = canvas.getContext('2d');
    g.scale(dpr, dpr);

    const flames = [], sparks = [], start = performance.now();
    let last = start, raf = 0, owed = 0;
    const stop = () => { cancelAnimationFrame(raf); canvas.remove(); if (current === stop) current = null; };
    current = stop;

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000), t = now - start;
      last = now;
      // 新しい炎：ボタンの幅いっぱいから。最初に勢いよく、だんだん弱く
      if (t < EMIT) {
        const power = 1 - t / EMIT;
        owed += dt * (110 + 190 * power);
        while (owed >= 1) {
          owed--;
          const k = rand(-1, 1), x = padL + bw / 2 + k * bw * 0.54;
          flames.push({
            x, y: UP + bh * rand(0.45, 0.95), r: rand(8, 15) * (1 - 0.3 * Math.abs(k)),
            vx: rand(-10, 10) - k * 14, vy: -rand(110, 215) * (1.1 - 0.5 * Math.abs(k)) * (0.6 + 0.4 * power),
            born: now, life: LIFE * rand(0.6, 1), sway: rand(0, 6.28),
          });
          if (Math.random() < 0.14) sparks.push({ x, y: UP + bh * 0.4, vx: rand(-50, 50), vy: -rand(120, 220), born: now, life: rand(350, 700) });
        }
      }
      g.clearRect(0, 0, w, h);
      // 古い（＝上のほうの紅い）炎から描き、新しい黄色い炎を手前に重ねる
      for (let i = 0; i < flames.length; i++) {
        const p = flames[i], a = (now - p.born) / p.life;
        if (a >= 1) continue;
        p.x += (p.vx + Math.sin(p.sway + now / 70) * 26) * dt;
        p.y += p.vy * dt;
        const r = p.r * (1 - a * 0.75), [R, G, B] = color(a), alpha = 0.85 * Math.min(1, (1 - a) * 1.6) * Math.min(1, a * 8 + 0.3);
        // 先のとがった炎の形（下が丸く、上がゆらいで細くなる）。ふちは薄くぼかす
        const tip = Math.sin(p.sway + now / 60) * r * 0.5, hgt = r * (2.1 + a * 0.8);
        const grad = g.createLinearGradient(0, p.y + r, 0, p.y - hgt);
        grad.addColorStop(0, `rgba(${R | 0},${G | 0},${B | 0},${alpha * 0.55})`);
        grad.addColorStop(0.4, `rgba(${R | 0},${G | 0},${B | 0},${alpha})`);
        grad.addColorStop(1, `rgba(${R | 0},${Math.max(0, G - 40) | 0},${B | 0},0)`);
        g.fillStyle = grad;
        g.beginPath();
        g.moveTo(p.x + tip, p.y - hgt);
        g.bezierCurveTo(p.x + tip * 0.3 + r * 0.35, p.y - r * 1.1, p.x + r, p.y - r * 0.5, p.x + r * 0.85, p.y + r * 0.25);
        g.bezierCurveTo(p.x + r * 0.7, p.y + r * 1.05, p.x - r * 0.7, p.y + r * 1.05, p.x - r * 0.85, p.y + r * 0.25);
        g.bezierCurveTo(p.x - r, p.y - r * 0.5, p.x + tip * 0.3 - r * 0.35, p.y - r * 1.1, p.x + tip, p.y - hgt);
        g.fill();
      }
      // 火の粉
      for (const s of sparks) {
        const a = (now - s.born) / s.life;
        if (a >= 1) continue;
        s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 60 * dt;
        g.fillStyle = `rgba(230,90,20,${1 - a})`;
        g.beginPath(); g.arc(s.x, s.y, 1.4 * (1 - a * 0.5), 0, Math.PI * 2); g.fill();
      }
      if (t > EMIT + 720) stop(); else raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  const TIP = {
    ja: {
      easy: 'まずは気軽に一枚！ 上の句を聞いて、続く下の句の札をゆっくり探しましょう。',
      normal: '下の句が読まれるのを待たずに、上の句で取りにいきましょう！',
      hard: '決まり字を聞いたら、すかさず払う！ 一瞬の迷いが勝負を分けます。',
      master: '名人に勝つ鍵は、対戦前の暗記にあり！ 札の配置を頭に入れてから挑戦しましょう。',
    },
    en: {
      easy: 'Start by taking just one card! Listen to the first half of the poem and take your time finding the card with the second half.',
      normal: 'Don\'t wait for the second half of the poem! Go for the card while the first half is being read.',
      hard: 'Swipe the moment you hear the kimariji! A split second of hesitation decides the match.',
      master: 'The key to beating the Master is memorizing before the match! Learn where every card is, then take on the challenge.',
    },
  };
  const TIP_SPEED = 110;                     // 文字の流れる速さ（1秒あたりの px）
  function tip(band, lang, level) {
    const text = (TIP[lang] || TIP.ja)[level];
    if (!band || !text) return;
    const span = document.createElement('span');
    span.textContent = text;
    band.style.fontSize = '';
    band.style.position = 'relative';
    band.textContent = '';
    band.appendChild(span);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !span.animate) {
      Object.assign(span.style, {
        position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
        whiteSpace: 'normal', fontSize: '11px', lineHeight: '1.3', letterSpacing: '0', textAlign: 'center',
      });
      // 長い文が帯からはみ出すときは、収まるまで文字を小さくする
      for (let size = 11; size > 8 && span.scrollHeight > span.clientHeight; size -= 0.5) span.style.fontSize = (size - 0.5) + 'px';
      return;
    }
    Object.assign(span.style, { position: 'absolute', left: '100%', top: '0', height: '100%', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' });
    // 帯の右端の外から、左端の外まで。位置を％で指定するので、途中で帯の幅が変わってもずれない
    span.animate([{ left: '100%', transform: 'translateX(0)' }, { left: '0', transform: 'translateX(-100%)' }],
      { duration: (band.clientWidth + span.offsetWidth) / TIP_SPEED * 1000, iterations: Infinity });
  }

  window.KarutaFlame = { burst, tip };
})();
