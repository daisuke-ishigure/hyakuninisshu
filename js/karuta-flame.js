/* 対戦ゲームの演出。
   burst：「鬼」（英語版は Oni）を選んだときに、ボタンの後ろから炎が一瞬立ちのぼる（karuta-taisen.html・karuta-taisen_en.html。画像は使わず canvas に描く）
   tip ：どの強さでも、ゲームを始める前（暗記中）に、上の句を出す白い帯へ助言を右から左へ流す（上の2ページの平面版と、3D版 karuta-taisen-3d.html）
   nearText・nearMiss：1枚差で負けたときに「4対5　あと1枚！」と見せる（上の3ページ。オンライン対戦でも使う）
   result・flow・setOverlayText：ロボット対戦の勝ち負けのメッセージを、強さと試合の流れで選んで出す（上の3ページ）
   onlineResult・reach・streak・pop：オンライン対戦の結果のメッセージ・「あと1枚で勝ち」・取った人の表示（karuta-taisen.html・karuta-taisen_en.html）

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
      master: '鬼に勝つ鍵は、対戦前の暗記にあり！ 札の配置を頭に入れてから挑戦しましょう。',
    },
    en: {
      easy: 'Start by taking just one card! Listen to the first half of the poem and take your time finding the card with the second half.',
      normal: 'Don\'t wait for the second half of the poem! Go for the card while the first half is being read.',
      hard: 'Swipe the moment you hear the kimariji! A split second of hesitation decides the match.',
      master: 'The key to beating the Oni is memorizing before the match! Learn where every card is, then take on the challenge.',
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

  /* 1枚差で負けたときの文言。1枚差でなければ空文字。
     me：自分の枚数 ／ top：1位の枚数 ／ duo：2人の対戦か（3人以上では点数を並べず「1位まであと1枚！」） */
  function nearText(me, top, duo, lang) {
    if (top - me !== 1) return '';
    if (lang === 'en') return duo ? `${me}–${top}  One card short!` : 'One card short of 1st!';
    return duo ? `${me}対${top}　あと1枚！` : '1位まであと1枚！';
  }
  /* 負けたときの画面（#oshii-overlay）で、「惜しい！」の代わりにその文言を大きく出す（点数と「あと1枚！」の2行）。
     overlay は animationend で消えるので、ここでは CSS アニメーションを使わない（子の animationend が伝わって、早く消えてしまう） */
  /* el に text を入れる。「…」は縦中横（縦書きの中で1文字分だけ横に組む）にして、どの端末でも横に3つ並んだ点で見せる。
     縦中横は縦書きのときだけ効くので、横書きでは何も変わらない */
  function setText(el, text) {
    el.textContent = '';
    String(text).split('…').forEach((part, k) => {
      if (k) {
        const t = document.createElement('span');
        t.className = 'tcy';
        t.textContent = '…';
        t.style.textCombineUpright = 'all';
        t.style.webkitTextCombine = 'horizontal';            // 古い Safari 用
        el.appendChild(t);
      }
      if (part) el.appendChild(document.createTextNode(part));
    });
  }

  function nearMiss(overlay, text) {
    if (!overlay || !text) return;
    const el = document.createElement('div');
    el.className = 'near-miss';
    setText(el, text.replace(/\u3000| {2}/, '\n'));
    // 1行が画面に収まる大きさにする（全角は1字ぶん、半角はおよそ0.58字ぶん）。
    // スマホ縦向きの日本語は縦書き（ページの CSS）なので、高さと、猫の絵の横に残る幅で決める
    const lines = el.textContent.split('\n');
    const em = Math.max(...lines.map(l => [...l].reduce((n, c) => n + (/[\u0000-\u024f\u2013]/.test(c) ? 0.58 : 1.08), 0)));
    const vertical = document.documentElement.lang !== 'en' && window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;
    const size = vertical
      ? Math.min(80, Math.floor(window.innerHeight * 0.6 / (em * 1.1)), Math.floor((window.innerWidth - Math.min(200, window.innerWidth * 0.4) - 40) / (lines.length * 1.2)))
      : Math.min(80, Math.floor((window.innerWidth - 44) / em));
    const lose = overlay.querySelector('span');
    if (lose) lose.remove();
    const w = '#fff';
    Object.assign(el.style, {
      marginTop: '6px', fontFamily: '"Noto Serif JP", serif', fontWeight: '700', color: '#c0392b', lineHeight: '1.2',
      fontSize: size + 'px', letterSpacing: '0.04em', textAlign: 'center', whiteSpace: 'pre',
      textShadow: `0 0 4px ${w}, 2px 2px 0 ${w}, -2px 2px 0 ${w}, 2px -2px 0 ${w}, -2px -2px 0 ${w}, 3px 0 0 ${w}, -3px 0 0 ${w}, 0 3px 0 ${w}, 0 -3px 0 ${w}`,
    });
    overlay.appendChild(el);
    overlay.style.zIndex = '10000';          // 雨の暗い幕（9999）より手前に出して、文字をはっきり見せる
    if (el.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.animate([{ transform: 'scale(2.2)', opacity: 0 }, { transform: 'scale(0.92)', opacity: 1, offset: 0.7 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 420, delay: 250, easing: 'ease-out', fill: 'backwards' });
    }
  }

  /* ===== ロボット対戦の、勝ち負けのメッセージ =====
     強さ（easy／normal／hard／master＝鬼）と試合の流れで選ぶ。上から順に見て、最初に当てはまったものを出す。
       勝ち：5対0（perfect）→ 2枚以上リードされてからの逆転（comeback）→ 1枚差で、途中でリードされた（grit）／されなかった（close）→ ふだん（usual）
       負け：0対5（zero）→ 1枚差（点数を添えて「4対5　あと1枚！」。2枚以上リードしていたら「4対5　逆転された…」）→ 2枚以上リードしていた（overtaken）→ ふだん（usual） */
  const RESULT = {
    ja: {
      win: {
        perfect: { easy: '全部取れた！', normal: '全部取れた！', hard: 'パーフェクト！', master: '鬼に完勝！' },
        comeback: { easy: '逆転！', normal: '逆転！', hard: '大逆転！', master: '大逆転！' },
        grit: { easy: '粘り勝ち！', normal: '粘り勝ち！', hard: '粘り勝ち！', master: '鬼退治！' },
        close: { easy: '粘り勝ち！', normal: '粘り勝ち！', hard: 'ギリギリ勝ち！', master: '鬼退治！' },
        usual: { easy: 'よくできました！', normal: 'めでたし！', hard: 'すごい！', master: '鬼退治！' },
      },
      lose: {
        zero: { easy: 'もう一回！', normal: 'もう一回！', hard: 'また挑戦！', master: '鬼は強い…' },
        overtaken: { easy: '惜しい！', normal: '逆転された…', hard: '逆転された…', master: '鬼の逆転…' },
        close: { easy: 'あと1枚！', normal: 'あと1枚！', hard: 'あと1枚！', master: 'あと1枚！' },
        usual: { easy: '惜しい！', normal: '惜しい！', hard: '惜しい！', master: '鬼は強い…' },
      },
    },
    en: {
      win: {
        perfect: { easy: 'Perfect!', normal: 'Perfect!', hard: 'Perfect!', master: 'Oni crushed!' },
        comeback: { easy: 'Comeback!', normal: 'Comeback!', hard: 'Big comeback!', master: 'Big comeback!' },
        grit: { easy: 'Never gave up!', normal: 'Never gave up!', hard: 'Never gave up!', master: 'Oni defeated!' },
        close: { easy: 'Never gave up!', normal: 'Never gave up!', hard: 'Close win!', master: 'Oni defeated!' },
        usual: { easy: 'Well done!', normal: 'Win!', hard: 'Amazing!', master: 'Oni defeated!' },
      },
      lose: {
        zero: { easy: 'Try again!', normal: 'Try again!', hard: 'Keep at it!', master: 'The Oni is strong…' },
        overtaken: { easy: 'So close!', normal: 'Overtaken…', hard: 'Overtaken…', master: 'Oni came back…' },
        close: { easy: 'One card short!', normal: 'One card short!', hard: 'One card short!', master: 'One card short!' },
        usual: { easy: 'So close!', normal: 'So close!', hard: 'So close!', master: 'The Oni is strong…' },
      },
    },
  };
  /* 点数の流れ：読んだ順（order）に、だれが取ったか（taken：歌番号 → 取った人）を見て、いちばん大きくリードされた枚数・した枚数を数える */
  function flow(order, taken, me) {
    let a = 0, b = 0, maxBehind = 0, maxAhead = 0;
    order.forEach(n => {
      const who = taken[n];
      if (!who) return;
      if (who === me) a++; else b++;
      maxBehind = Math.max(maxBehind, b - a); maxAhead = Math.max(maxAhead, a - b);
    });
    return { maxBehind, maxAhead };
  }
  /* 結果のメッセージ。kind：'win'／'lose'／'near'（1枚差の負け。text は「4対5　あと1枚！」の形で、点数の行にも使う） */
  function result({ me, other, level, maxBehind = 0, maxAhead = 0, lang = 'ja' }) {
    const T = RESULT[lang] || RESULT.ja, lv = T.win.usual[level] ? level : 'normal';
    if (me > other) {
      const k = other === 0 ? 'perfect' : maxBehind >= 2 ? 'comeback' : me - other === 1 ? (maxBehind >= 1 ? 'grit' : 'close') : 'usual';
      return { kind: 'win', text: T.win[k][lv] };
    }
    if (me === 0) return { kind: 'lose', text: T.lose.zero[lv] };
    if (other - me === 1) {
      const msg = maxAhead >= 2 ? T.lose.overtaken[lv] : T.lose.close[lv];
      return { kind: 'near', text: lang === 'en' ? `${me}–${other}  ${msg}` : `${me}対${other}\u3000${msg}` };
    }
    return { kind: 'lose', text: T.lose[maxAhead >= 2 ? 'overtaken' : 'usual'][lv] };
  }
  /* 勝ち・負けの画面の大きな文字（span）を text にして、画面に収まる大きさにする（縦書きのスマホは高さで決める） */
  function setOverlayText(overlay, text) {
    const span = overlay && overlay.querySelector('span');
    if (!span || !text) return;
    setText(span, text);
    const em = [...text].reduce((n, c) => n + (/[\u0000-\u024f\u2013]/.test(c) ? 0.58 : 1.12), 0) * 1.12;   // 字の間（letter-spacing）のぶんも見込む
    const vertical = document.documentElement.lang !== 'en' && window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;
    const base = Math.min(80, Math.max(60, window.innerWidth * 0.15));
    const fit = vertical ? Math.floor(window.innerHeight * 0.62 / em) : Math.floor((window.innerWidth - 32) / em);
    if (fit < base) span.style.fontSize = fit + 'px';
    span.style.whiteSpace = 'nowrap';
    if (overlay.id === 'oshii-overlay') overlay.style.zIndex = '10000';   // 負け：雨の暗い幕（9999）より手前に出して、文字をはっきり見せる
  }

  /* ===== オンライン対戦 =====
     onlineResult：結果のメッセージ（2人対戦と3〜4人で言葉を変える）。上から順に、最初に当てはまったものを出す。
       1位：同点（tie）→ ほかの人が1枚も取れない（perfect）→ 2枚以上リードされてからの逆転（comeback）→ 2位と1枚差（close）→ ふだん（usual）
       負け：0枚（zero）→ 1位と1枚差（nearText：「4対5　あと1枚！」／「1位まであと1枚！」）→ ふだん（usual）
     reach：次の1枚で1位が決まる人（ほかの人が残りを全部取っても追いつけない）。オンラインは9枚すべてを取り合う
     streak：いちばん新しく取った人が、続けて何枚取っているか
     pop：画面の上のほうに大きく一瞬出す（「🐻 が取った！」など） */
  const ONLINE = {
    ja: {
      tie: '同点1位！', perfect: '完勝！', comeback: ['逆転勝ち！', '逆転で1位！'], close: ['ギリギリ勝ち！', 'ギリギリ1位！'], usual: ['勝った！', '1位！'],
      zero: '次こそ！', lose: '惜しい！',
      took: icon => `${icon} が取った！`, tookMe: '取った！', streak: (icon, n) => `${icon} ${n}連取！`, streakMe: n => `🔥 ${n}連取！`,
      reach: who => `${who} あと1枚で勝ち！`, you: 'あなた',
    },
    en: {
      tie: 'Tied for 1st!', perfect: 'Flawless!', comeback: ['Comeback win!', 'Comeback to 1st!'], close: ['Close win!', 'Close 1st!'], usual: ['You win!', '1st place!'],
      zero: 'Next time!', lose: 'So close!',
      took: icon => `${icon} took it!`, tookMe: 'Got it!', streak: (icon, n) => `${icon} ${n} in a row!`, streakMe: n => `🔥 ${n} in a row!`,
      reach: who => `${who} one card from winning!`, you: 'You',
    },
  };
  // 読んだ順（order）に、だれが取ったか（taken：歌番号 → 取った人）を見た点数の流れ。me が1位の人にいちばん大きく離された枚数
  function onlineFlow(order, taken, me) {
    const score = {};
    let maxBehind = 0;
    order.forEach(n => {
      const who = taken[n];
      if (!who) return;
      score[who] = (score[who] || 0) + 1;
      const best = Math.max(0, ...Object.keys(score).filter(id => id !== me).map(id => score[id]));
      maxBehind = Math.max(maxBehind, best - (score[me] || 0));
    });
    return maxBehind;
  }
  /* scoreboard：[{ score, isMe }]（多い順） ／ order・taken・me：点数の流れを数えるため */
  function onlineResult({ scoreboard, order, taken, me, lang = 'ja' }) {
    const T = ONLINE[lang] || ONLINE.ja, i = scoreboard.length === 2 ? 0 : 1;
    const my = scoreboard.find(s => s.isMe).score, top = scoreboard[0].score;
    const others = scoreboard.filter(s => !s.isMe).map(s => s.score), second = Math.max(0, ...others);
    if (my === top) {
      if (others.includes(my)) return { kind: 'win', text: T.tie };
      if (second === 0) return { kind: 'win', text: T.perfect };
      if (onlineFlow(order, taken, me) >= 2) return { kind: 'win', text: T.comeback[i] };
      return { kind: 'win', text: my - second === 1 ? T.close[i] : T.usual[i] };
    }
    if (my === 0) return { kind: 'lose', text: T.zero };
    const near = nearText(my, top, scoreboard.length === 2, lang);
    return near ? { kind: 'near', text: near } : { kind: 'lose', text: T.lose };
  }
  /* 次の1枚で1位が決まる人の一覧。ids：参加者（途中で抜けた人も含める） ／ total：札の枚数 */
  function reach(taken, ids, total) {
    const score = {};
    ids.forEach(id => { score[id] = 0; });
    Object.values(taken).forEach(id => { score[id] = (score[id] || 0) + 1; });
    const left = total - Object.keys(taken).length;
    if (left <= 0) return [];
    return Object.keys(score).filter(id => {
      const best = Math.max(0, ...Object.keys(score).filter(o => o !== id).map(o => score[o]));
      // 次の1枚を取ると、ほかの人が残り（left - 1 枚）を全部取っても上回る。ただし、もう決まっている人は出さない
      return score[id] + 1 > best + left - 1 && score[id] <= best + left;
    });
  }
  function reachText(ids, me, iconOf, lang = 'ja') {
    if (!ids.length) return '';
    const T = ONLINE[lang] || ONLINE.ja;
    return T.reach(ids.map(id => id === me ? T.you : iconOf(id)).join(ids.length > 2 ? '' : (lang === 'en' ? ' & ' : '・')));
  }
  // いちばん新しく取った人と、その人が続けて取った枚数（読んだ順に数える）
  function streak(order, taken) {
    const seq = order.filter(n => taken[n]).map(n => taken[n]);
    if (!seq.length) return { who: null, n: 0 };
    const who = seq[seq.length - 1];
    let n = 0;
    for (let k = seq.length - 1; k >= 0 && seq[k] === who; k--) n++;
    return { who, n };
  }
  function tookText(isMe, icon, n, lang = 'ja') {
    const T = ONLINE[lang] || ONLINE.ja;
    if (n >= 2) return isMe ? T.streakMe(n) : T.streak(icon, n);
    return isMe ? T.tookMe : T.took(icon);
  }
  let popEl = null;
  function pop(text, color = '#ff6b35') {
    if (!text) return;
    if (popEl) popEl.remove();
    const el = popEl = document.createElement('div');
    el.textContent = text;
    el.setAttribute('aria-live', 'polite');
    const w = '#fff';
    Object.assign(el.style, {
      position: 'fixed', top: '24%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '10002', pointerEvents: 'none',
      fontFamily: '"Noto Serif JP", serif', fontWeight: '900', fontSize: 'clamp(28px, 8vw, 48px)', color, whiteSpace: 'nowrap', letterSpacing: '0.05em',
      textShadow: `0 0 4px ${w}, 0 0 8px ${w}, 2px 2px 0 ${w}, -2px 2px 0 ${w}, 2px -2px 0 ${w}, -2px -2px 0 ${w}`,
    });
    document.body.appendChild(el);
    const done = () => { if (el.parentNode) el.remove(); if (popEl === el) popEl = null; };
    if (el.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.animate([
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.4)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1.15)', offset: 0.15 },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', offset: 0.3 },
        { opacity: 1, transform: 'translate(-50%, -60%) scale(1)', offset: 0.75 },
        { opacity: 0, transform: 'translate(-50%, -75%) scale(1)' },
      ], { duration: 1300, easing: 'ease-out' }).onfinish = done;
    } else setTimeout(done, 1300);
  }

  window.KarutaFlame = { burst, tip, nearText, nearMiss, flow, result, setOverlayText, onlineResult, reach, reachText, streak, tookText, pop };
})();
