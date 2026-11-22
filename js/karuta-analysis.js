/* 対戦ゲームの「振り返り」：ゲーム中に出てきた札を「今回の札一覧」として、list.html と同じ見た目の表で分類して見せる。
   karuta-taisen.html・karuta-taisen_en.html（平面版のロボット対戦・オンライン対戦）と
   karuta-taisen-3d.html（3D版のロボット対戦）が、終了画面の「振り返り」ボタンから呼ぶ。

   使い方：KarutaAnalysis.open({ lang: 'ja' | 'en', groups: [{ kind, title, nums }] })
     kind：'took'（取った札）／'lost'（取られた札）／'left'（場に残った札）／'empty'（空札）。見出しの色と数え方に使う
     nums：歌番号の配列（並べたい順）

   表の1行は list.html と同じ js/list-rows.js（英語は js/list-rows_en.js）の buildPoemRowHTML で作り、
   データは js/hyakunin.json。どちらも初めて開いたときに読み込む。
   見た目は css/karuta-analysis.css（css/list.css の表の指定を .ka-overlay の中だけに効くよう写したもの）。 */
(() => {
  'use strict';
  const FILES = {
    css: '/css/karuta-analysis.css?20261123-01',
    // list.html・list_en.html が表の字に使っている書体（style.css の @import と、ページの Google Fonts）。
    // style.css を読み込んでいないページ（3D版）では、同じものをここで読み込む
    fonts: ['https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
      'https://fonts.googleapis.com/css2?family=Kaisei+HarunoUmi:wght@500&family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@700&display=swap'],
    rows: '/js/list-rows.js?20261112-02',
    rowsEn: '/js/list-rows_en.js?20261112-01',
    json: '/js/hyakunin.json?20261112-01',
  };
  const TEXT = {
    ja: {
      title: '今回の札一覧', close: '閉じる', loading: '読み込み中…', none: 'なし', error: '読み込めませんでした。通信状態を確かめて、もう一度お試しください。',
      hint: '歌番号を押すと、その歌の解説ページが新しいタブで開きます。和歌を押すと、現代語訳と決まり字が表示されます。',
      count: (n, kind) => `${n}${kind === 'empty' ? '首' : '枚'}`,
      th: ['番号', '和歌・作者'], open: '▼ 現代語訳', shut: '▲ 閉じる',
    },
    en: {
      title: 'List of Cards in This Game', close: 'Close', loading: 'Loading…', none: 'None', error: 'Could not load the data. Please check your connection and try again.',
      hint: 'Tap a poem number to open that poem\'s page in a new tab. Tap a poem to show its translation and kimariji.',
      count: (n, kind) => kind === 'empty' ? `${n} poem${n === 1 ? '' : 's'}` : `${n} card${n === 1 ? '' : 's'}`,
      th: ['No.', 'Poem / Poet'], open: '▼ translation', shut: '▲ close',
    },
  };

  let poemsPromise = null, rowsPromise = null, fontsLoaded = false;
  function loadCss() {
    if (document.querySelector('link[data-karuta-analysis]')) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = FILES.css; l.dataset.karutaAnalysis = '1';
    document.head.appendChild(l);
  }
  function loadFonts() {
    if (fontsLoaded || document.querySelector('link[href*="css/style.css"]')) return;
    fontsLoaded = true;
    FILES.fonts.forEach(href => {
      const f = document.createElement('link');
      f.rel = 'stylesheet'; f.href = href;
      document.head.appendChild(f);
    });
  }

  /* 「振り返り」ボタンの枠に沿って光が回る演出（After Effects のパスのトリミングのように、枠の線の一部だけを光らせて動かす）。
     ボタンと同じ大きさ・角丸の四角を SVG で重ね、pathLength=100 の線の破線（光の筋）をずらし続ける。
     ボタンの大きさが変わったとき（非表示から表示に変わったときも）は ResizeObserver で四角を合わせ直す */
  function decorate(btn) {
    if (!btn || btn.dataset.kaGlow) return;
    btn.dataset.kaGlow = '1';
    loadCss();
    btn.classList.add('ka-glow-btn');
    const NS = 'http://www.w3.org/2000/svg', PAD = 3;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'ka-glow');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const rects = ['ka-glow-head'].map(cls => {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('class', cls);
      r.setAttribute('pathLength', '100');
      svg.appendChild(r);
      return r;
    });
    btn.appendChild(svg);
    const fit = () => {
      const w = btn.offsetWidth, h = btn.offsetHeight;
      if (!w || !h) return;
      const radius = Math.min(parseFloat(getComputedStyle(btn).borderTopLeftRadius) || 0, h / 2);
      svg.setAttribute('width', w + PAD * 2);
      svg.setAttribute('height', h + PAD * 2);
      svg.setAttribute('viewBox', `0 0 ${w + PAD * 2} ${h + PAD * 2}`);
      rects.forEach(r => {
        // ボタンの枠線（1px）の真ん中に光の線が来るよう、半ピクセル内側に描く
        r.setAttribute('x', PAD + 0.5); r.setAttribute('y', PAD + 0.5);
        r.setAttribute('width', Math.max(0, w - 1)); r.setAttribute('height', Math.max(0, h - 1));
        r.setAttribute('rx', Math.max(0, radius - 0.5)); r.setAttribute('ry', Math.max(0, radius - 0.5));
      });
    };
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(btn);
    else window.addEventListener('resize', fit);
  }
  // 歌番号 → hyakunin.json の1首分
  function loadPoems() {
    if (!poemsPromise) {
      poemsPromise = fetch(FILES.json).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(data => {
        const byNum = {};
        Object.keys(data).forEach(k => { byNum[String(data[k].number)] = data[k]; });
        return byNum;
      });
      poemsPromise.catch(() => { poemsPromise = null; });             // 失敗したら次に開いたときに読み直す
    }
    return poemsPromise;
  }
  // 表の1行を作る buildPoemRowHTML（list.html と同じもの）
  function loadRows(lang) {
    if (typeof window.buildPoemRowHTML === 'function' || typeof buildPoemRowHTML === 'function') return Promise.resolve();
    if (!rowsPromise) {
      rowsPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = lang === 'en' ? FILES.rowsEn : FILES.rows;
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
      rowsPromise.catch(() => { rowsPromise = null; });
    }
    return rowsPromise;
  }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function open({ lang = 'ja', groups = [] } = {}) {
    const T = TEXT[lang] || TEXT.ja;
    loadCss();
    loadFonts();
    const prev = document.querySelector('.ka-overlay');
    if (prev) prev.remove();
    const root = document.createElement('div');
    root.className = 'ka-overlay';
    root.lang = lang === 'en' ? 'en' : 'ja';
    root.innerHTML =
      `<div class="ka-panel" role="dialog" aria-modal="true" aria-label="${esc(T.title)}">` +
      `<div class="ka-head"><div class="ka-title">${esc(T.title)}</div><button type="button" class="ka-close">${esc(T.close)}</button></div>` +
      `<div class="ka-body"><p class="ka-msg">${esc(T.loading)}</p></div>` +
      `</div>`;
    document.body.appendChild(root);
    const body = root.querySelector('.ka-body');
    const close = () => { root.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    root.querySelector('.ka-close').addEventListener('click', close);
    root.addEventListener('click', e => { if (e.target === root) close(); });   // 外側（暗いところ）を押しても閉じる
    root.querySelector('.ka-close').focus({ preventScroll: true });

    Promise.all([loadPoems(), loadRows(lang)]).then(([poems]) => {
      if (!root.isConnected) return;
      const build = window.buildPoemRowHTML || buildPoemRowHTML;            // eslint-disable-line no-undef
      body.innerHTML = `<p class="ka-hint">${esc(T.hint)}</p>` + groups.map(g => {
        const nums = (g.nums || []).map(String).filter(n => poems[n]);
        return `<section class="ka-group" data-kind="${esc(g.kind || '')}">` +
          `<div class="ka-group-title">${esc(g.title)}<span class="ka-count">${esc(T.count(nums.length, g.kind))}</span></div>` +
          (nums.length
            ? `<table><thead><tr><th scope="col">${esc(T.th[0])}</th><th scope="col">${esc(T.th[1])}</th></tr></thead><tbody>${nums.map(n => build(poems[n])).join('')}</tbody></table>`
            : `<p class="ka-none">${esc(T.none)}</p>`) +
          `</section>`;
      }).join('');
      // 解説ページはゲームの画面を残したまま、新しいタブで開く
      body.querySelectorAll('a[href]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
      // 和歌を押すと現代語訳を開閉（list.html と同じ。開いている間だけ決まり字を見せる）
      body.addEventListener('click', e => {
        const td = e.target.closest('td[data-has-modern]');
        if (!td || e.target.closest('.waka-game-links')) return;
        const el = td.querySelector('.modern-text'), toggle = td.querySelector('.modern-toggle');
        const isOpen = el.style.display !== 'none';
        el.style.display = isOpen ? 'none' : 'block';
        toggle.textContent = isOpen ? T.open : T.shut;
        td.classList.toggle('is-open', !isOpen);
      });
    }).catch(() => {
      if (root.isConnected) body.innerHTML = `<p class="ka-msg">${esc(T.error)}</p>`;
    });
  }

  window.KarutaAnalysis = { open, decorate };
})();
