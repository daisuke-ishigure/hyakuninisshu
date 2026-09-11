(function () {
  'use strict';

  const FLIP_INTERVAL = 1300;   // 自動フリップの間隔（ms）

  const explainEl  = document.getElementById('kake-explain');
  const glossaryEl = document.getElementById('kake-glossary');
  const nekoImg    = document.getElementById('daruma-neko-img');
  const instrEl    = document.getElementById('kake-instr');
  const poemCard   = document.getElementById('poem-card');
  const btnWrap    = document.getElementById('kg-btn-wrap');
  const retryBtn   = document.getElementById('kg-retry-btn');

  const IS_EN = document.documentElement.lang === 'en';
  const HAPPY_MSG       = IS_EN
    ? 'Amazing! You found the kakekotoba♪<br>Feel free to read the commentary on this poem\'s kakekotoba too.'
    : 'すごい。掛詞を見つけられたね♪<br>よかったらこの歌の掛詞の解説も読んでみてね。';
  const MULTI_HAPPY_MSG = IS_EN
    ? 'Amazing!<br>There are more kakekotoba hidden here. Keep looking♪'
    : 'すごい！<br>他にもまだ掛詞あるよ。探してみてね♪';
  const SAD_MSG         = IS_EN
    ? 'So close!<br>Try looking for the kakekotoba again.'
    : '惜しい。<br>もう一度掛詞の言葉を探してみてね。';
  const CONTINUE_MSG    = IS_EN
    ? 'Keep searching for the kakekotoba♪'
    : '引き続き掛詞を探してね♪';
  const NEKO_NORMAL     = 'img/neko_normal.webp';
  const ORIGINAL_INSTR  = instrEl ? instrEl.innerHTML : '';

  /* 掛詞を発見できたら解説と語句解説を表示する（一度表示したら出しっぱなし） */
  function revealExplain() {
    if (!explainEl || !explainEl.hidden) return;
    explainEl.hidden = false;
    if (glossaryEl) glossaryEl.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      explainEl.classList.add('show');
      if (glossaryEl) glossaryEl.classList.add('show');
    }));
  }

  const triggerEls = Array.from(document.querySelectorAll('.kg-trigger'))
    .filter(el => (el.dataset.meanings || '').split(',').map(s => s.trim()).filter(Boolean).length >= 2);
  const foundTriggers = new Set();
  const triggerResets = [];
  let allFound = false;
  let sadTimer = null;

  function clearSadTimer() {
    if (sadTimer) { clearTimeout(sadTimer); sadTimer = null; }
  }

  function updateHappyMessage() {
    clearSadTimer();
    const isPartial = !allFound && triggerEls.length > 1;
    if (nekoImg && !isPartial) nekoImg.src = 'img/neko_happy.webp';
    if (instrEl) instrEl.innerHTML = isPartial ? MULTI_HAPPY_MSG : HAPPY_MSG;
  }

  triggerEls.forEach(el => {
    const meanings = (el.dataset.meanings || '').split(',').map(s => s.trim()).filter(Boolean);

    const idleEl    = el.querySelector('.kg-idle');
    const flipEl    = el.querySelector('.kg-flip');
    const flipInner = el.querySelector('.kg-flip-inner');
    const frontFace = el.querySelector('.kg-front');
    const backFace  = el.querySelector('.kg-back');
    const originalWord = idleEl.textContent;
    /* 「意味1 → 意味2 → もとの言葉」を繰り返す3段階サイクル */
    const sequence = [meanings[0], meanings[1], originalWord];
    frontFace.textContent = sequence[0];
    backFace.textContent  = sequence[1];
    /* 意味・もとの言葉の文字数に応じて折り返しが起きないようにカードの高さを調整 */
    const maxLen = Math.max(meanings[0].length, meanings[1].length, originalWord.length, 2);
    flipEl.style.height = (maxLen * 1.2) + 'em';

    let timer = null;
    let step = 0;
    let active = false;

    function stopFlip() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function activate() {
      const wasAllFound = allFound;
      active = true;
      idleEl.hidden = true;
      flipEl.hidden = false;
      stopFlip();
      timer = setInterval(() => {
        step++;
        const idx = step % 3;
        const content = sequence[idx];
        const isOriginal = idx === 2;
        const face = (step % 2 === 0) ? frontFace : backFace;
        face.textContent = content;
        face.classList.toggle('kg-original', isOriginal);
        flipInner.style.transform = `rotateY(${step * 180}deg)`;
      }, FLIP_INTERVAL);
      if (!foundTriggers.has(el)) {
        foundTriggers.add(el);
        if (foundTriggers.size >= triggerEls.length) allFound = true;
      }
      if (allFound) {
        revealExplain();
        if (btnWrap) btnWrap.hidden = false;
      }
      if (!wasAllFound) updateHappyMessage();
    }

    function deactivate() {
      active = false;
      stopFlip();
      flipEl.hidden = true;
      idleEl.hidden = false;
      if (!allFound) updateHappyMessage();
    }

    function reset() {
      active = false;
      step = 0;
      stopFlip();
      flipEl.hidden = true;
      idleEl.hidden = false;
      frontFace.textContent = sequence[0];
      backFace.textContent  = sequence[1];
      frontFace.classList.remove('kg-original');
      backFace.classList.remove('kg-original');
      flipInner.style.transform = 'rotateY(0deg)';
    }
    triggerResets.push(reset);

    const trigger = () => { active ? deactivate() : activate(); };
    el.addEventListener('click', trigger);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });

  /* 「もう一度する」：ゲームの状態を最初に戻す */
  function resetGame() {
    clearSadTimer();
    triggerResets.forEach(fn => fn());
    foundTriggers.clear();
    allFound = false;
    if (explainEl) { explainEl.hidden = true; explainEl.classList.remove('show'); }
    if (glossaryEl) { glossaryEl.hidden = true; glossaryEl.classList.remove('show'); }
    if (nekoImg) nekoImg.src = NEKO_NORMAL;
    if (instrEl) instrEl.innerHTML = ORIGINAL_INSTR;
    if (btnWrap) btnWrap.hidden = true;
  }
  if (retryBtn) retryBtn.addEventListener('click', resetGame);

  /* 掛詞ではない場所をタップしたら残念な顔にする(すべて発見済みなら切り替えない)。1秒後に元の画像に戻す */
  if (poemCard) {
    poemCard.addEventListener('click', e => {
      if (e.target.closest('.kg-trigger')) return;
      if (allFound) return;
      clearSadTimer();
      if (nekoImg) nekoImg.src = 'img/neko_sad.webp';
      if (instrEl) instrEl.innerHTML = SAD_MSG;
      sadTimer = setTimeout(() => {
        if (nekoImg) nekoImg.src = NEKO_NORMAL;
        if (instrEl) instrEl.innerHTML = CONTINUE_MSG;
        sadTimer = null;
      }, 1000);
    });
  }

})();

/* ── 一覧モーダル ─────────────────────────────────────────── */
(function () {
  const IS_EN = document.documentElement.lang === 'en';
  const POEMS = [
    { num: 1,   poet: '天智天皇', poetEn: 'Emperor Tenji' },
    { num: 8,   poet: '喜撰法師', poetEn: 'Priest Kisen' },
    { num: 9,   poet: '小野小町', poetEn: 'Ono no Komachi' },
    { num: 10,  poet: '蝉丸', poetEn: 'Semimaru' },
    { num: 13,  poet: '陽成院', poetEn: 'Retired Emperor Yōzei' },
    { num: 14,  poet: '河原左大臣', poetEn: 'Minister of the Left of Kawara' },
    { num: 16,  poet: '中納言行平', poetEn: 'Middle Counselor Yukihira' },
    { num: 20,  poet: '元良親王', poetEn: 'Prince Motoyoshi' },
    { num: 22,  poet: '文屋康秀', poetEn: 'Fun’ya no Yasuhide' },
    { num: 24,  poet: '菅家', poetEn: 'Kanke' },
    { num: 25,  poet: '三条右大臣', poetEn: 'Minister of the Right of Sanjō' },
    { num: 27,  poet: '中納言兼輔', poetEn: 'Middle Counselor Kanesuke' },
    { num: 28,  poet: '源宗于朝臣', poetEn: 'Minamoto no Muneyuki Ason' },
    { num: 51,  poet: '藤原実方朝臣', poetEn: 'Fujiwara no Sanekata Ason' },
    { num: 58,  poet: '大弐三位', poetEn: 'Daini no Sanmi' },
    { num: 60,  poet: '小式部内侍', poetEn: 'Koshikibu no Naishi' },
    { num: 62,  poet: '清少納言', poetEn: 'Sei Shōnagon' },
    { num: 67,  poet: '周防内侍', poetEn: 'Suō no Naishi' },
    { num: 72,  poet: '祐子内親王家紀伊', poetEn: 'Kii of Princess Yūshi’s Household' },
    { num: 77,  poet: '崇徳院', poetEn: 'Retired Emperor Sutoku' },
    { num: 88,  poet: '皇嘉門院別当', poetEn: 'Attendant to Empress Kōka' },
    { num: 91,  poet: '後京極摂政前太政大臣', poetEn: 'Gokyōgoku Regent and former Chancellor of the Realm' },
    { num: 95,  poet: '前大僧正慈円', poetEn: 'Former Senior High Priest Jien' },
    { num: 96,  poet: '入道前太政大臣', poetEn: 'Lay Novice and former Chancellor of the Realm' },
    { num: 97,  poet: '権中納言定家', poetEn: 'Acting Middle Counselor Sadaie' },
    { num: 98,  poet: '従二位家隆', poetEn: 'Junior Second Rank Ietaka' },
    { num: 100, poet: '順徳院', poetEn: 'Retired Emperor Juntoku' },
  ];

  const CURRENT_NUM = (() => {
    const m = location.pathname.match(/kakekotoba-game-(\d+)(?:_en)?\.html/);
    return m ? parseInt(m[1], 10) : null;
  })();

  const style = document.createElement('style');
  style.textContent = [
    '@keyframes kg-list-grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}',
    '#kg-list-btn{',
    '  flex-shrink:0;margin-left:auto;',
    '  font-family:"Noto Sans JP",sans-serif;font-size:11px;font-weight:700;',
    '  background:linear-gradient(135deg,#B82343,#e05c00,#7b1fa2,#B82343);',
    '  background-size:300% 300%;animation:kg-list-grad 4s ease infinite;',
    '  color:#fff;border:none;border-radius:4px;',
    '  padding:4px 10px;cursor:pointer;',
    '  letter-spacing:0.06em;line-height:1.5;white-space:nowrap;',
    '  box-shadow:0 2px 6px rgba(0,0,0,0.2);',
    '}',
    '#kg-list-btn:hover{opacity:0.88;}',
    '#kg-list-overlay{',
    '  position:fixed;inset:0;z-index:960;',
    '  background:rgba(0,0,0,0.4);backdrop-filter:blur(2px);',
    '  display:flex;align-items:flex-start;justify-content:center;',
    '  overflow-y:auto;padding:20px 0;',
    '  opacity:0;visibility:hidden;transition:opacity 0.25s,visibility 0.25s;',
    '}',
    '#kg-list-overlay.active{opacity:1;visibility:visible;}',
    '#kg-list-modal{',
    '  background:#faf7f2;border-radius:12px;padding:24px 24px 20px;',
    '  width:min(520px,92vw);',
    '  box-shadow:0 20px 40px rgba(0,0,0,0.25);position:relative;margin:auto;',
    '}',
    '#kg-list-modal h2{',
    '  font-family:"Noto Sans JP",sans-serif;font-size:1rem;font-weight:700;color:#333;',
    '  text-align:center;margin:0 0 16px;',
    '  border-bottom:2px solid #b82343;padding-bottom:10px;',
    '}',
    '#kg-list-close{',
    '  position:absolute;top:12px;right:14px;background:none;border:none;',
    '  font-size:18px;color:#888;cursor:pointer;line-height:1;padding:4px;',
    '}',
    '#kg-list-close:hover{color:#333;}',
    '.kg-list-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}',
    '@media(min-width:480px){.kg-list-grid{grid-template-columns:repeat(3,1fr);}}',
    '.kg-list-item{',
    '  display:flex;align-items:center;gap:8px;padding:8px 10px;',
    '  background:#fff;border:1px solid #e8a0ae;border-radius:7px;',
    '  text-decoration:none;color:#333;',
    '  font-family:"Noto Sans JP",sans-serif;font-size:13px;',
    '  transition:background 0.15s,border-color 0.15s;',
    '}',
    '.kg-list-item:hover{background:#faeef1;border-color:#b82343;color:#7a0020;}',
    '.kg-list-item.current{',
    '  background:#f5d5db;border-color:#b82343;color:#7a0020;',
    '  font-weight:bold;pointer-events:none;',
    '}',
    '.kg-list-num{',
    '  flex-shrink:0;width:24px;height:24px;',
    '  background:linear-gradient(135deg,#e05c7a,#b82343);color:#fff;',
    '  border-radius:50%;display:flex;align-items:center;justify-content:center;',
    '  font-size:11px;font-weight:bold;',
    '  box-shadow:0 2px 6px rgba(184,35,67,0.45);letter-spacing:0;',
    '}',
    '.kg-list-name{font-size:12px;line-height:1.4;}',
  ].join('\n');
  document.head.appendChild(style);

  const items = POEMS.map(p => {
    const isCurrent = p.num === CURRENT_NUM;
    const href = 'kakekotoba-game-' + String(p.num).padStart(3, '0') + (IS_EN ? '_en' : '') + '.html';
    return '<a class="kg-list-item' + (isCurrent ? ' current' : '') + '" href="' + href + '">'
      + '<span class="kg-list-num">' + p.num + '</span>'
      + '<span class="kg-list-name">' + (IS_EN ? p.poetEn : p.poet) + '</span>'
      + '</a>';
  }).join('');

  document.body.insertAdjacentHTML('beforeend',
    '<div id="kg-list-overlay">'
    + '<div id="kg-list-modal">'
    + '<button id="kg-list-close">✕</button>'
    + '<h2>' + (IS_EN ? 'Spin &amp; Discover Kakekotoba! — All Poems' : '掛詞クルッと発見！ 一覧') + '</h2>'
    + '<div class="kg-list-grid">' + items + '</div>'
    + '</div></div>'
  );

  const breadcrumbNav = document.querySelector('.breadcrumb')
    ? document.querySelector('.breadcrumb').closest('nav') : null;
  if (breadcrumbNav) {
    breadcrumbNav.style.display = 'flex';
    breadcrumbNav.style.alignItems = 'center';
    const btn = document.createElement('button');
    btn.id = 'kg-list-btn';
    btn.textContent = IS_EN ? 'List' : '一覧';
    breadcrumbNav.appendChild(btn);
  }

  const overlay  = document.getElementById('kg-list-overlay');
  const closeBtn = document.getElementById('kg-list-close');
  const listBtn  = document.getElementById('kg-list-btn');

  function openModal()  { overlay.classList.add('active');    document.body.style.overflow = 'hidden'; }
  function closeModal() { overlay.classList.remove('active'); document.body.style.overflow = ''; }

  if (listBtn) listBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();
