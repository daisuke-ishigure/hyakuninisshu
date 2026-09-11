(function () {
  'use strict';

  const CFG = window.KAKE_CONFIG;
  if (!CFG) { console.error('KAKE_CONFIG が未定義です'); return; }

  /* ===== hyakunin.json が利用可能なら英語版の意味（Meaning）を上書き =====
     JP側は意味欄にtippyツールチップ（<span class="tippy ...">）が
     埋め込まれているため対象外。EN側はプレーンテキストのみなので安全に上書きできる。 */
  if (document.documentElement.lang === 'en' && CFG.pageNum) {
    fetch('js/hyakunin.json?04')
      .then(r => r.json())
      .then(json => {
        const v = json[CFG.pageNum];
        const el = document.getElementById('kake-meaning');
        if (v && v.modern_en && el) el.textContent = v.modern_en;
      })
      .catch(() => {}); // ファイルがなくても動作継続
  }

  const WAKA = CFG.waka;

  const MSG = Object.assign({
    correctMsgs:   ['いいにゃ！', 'その調子にゃ！', '冴えてるにゃ！', 'なかなかやるにゃ！', '絶好調にゃ！'],
    initTitle:     '順番どおりに句を<span class="pc">クリック</span><span class="sp">タップ</span>してね。',
    initBody:      document.documentElement.lang === 'en'
      ? 'Complete the poem and the poet will appear! Use "👀 Show complete poem" to preview if you need help♪'
      : '歌が完成したら歌人が現れるよ！ 難しかったら「👀 完成形を見る」で予習してから遊んでね♪',
    keepGoing:     'その調子！',
    completeTitle: '歌が完成したね♪',
    completeBody:  name => `${name}から一言🎤`,
    retry:         'もう一度する',
    wrong:         'ちがうよ〜！歌の順番どおりに<span class="pc">クリック</span><span class="sp">タップ</span>してね。',
    encourage1:    'がんばってね',
    wrong3:        'あーあ、3回まちがえた！句がバラバラに…',
    wrong2:        'ちがうよ〜！<strong>あと1回まちがえると句がバラバラになるよ！</strong>',
    encourage2:    '慎重にがんばってにゃ',
    donmai:        'どんまい',
    wcInvite:      document.documentElement.lang === 'en'
      ? 'Try "How would you describe this poem in one word?" below!'
      : '正しく句を並べられましたにゃ！<br>よかったら歌の感想を書きこんでね♪',
    hintNext:      document.documentElement.lang === 'en'
      ? '💡 Show next phrase'
      : '💡 次の句を見る',
    hintComplete:  document.documentElement.lang === 'en'
      ? '👀 Show complete poem'
      : '👀 完成形を見る',
    previewTitle:  document.documentElement.lang === 'en'
      ? 'Here\'s the complete poem!'
      : 'まずは完成形をどうぞ♪',
    previewBody:   document.documentElement.lang === 'en'
      ? 'Take a look at the whole poem, then press the button below to try arranging it yourself!'
      : '歌の全体を確認したら、下のボタンから五句並べに挑戦してみよう！',
    challenge:     document.documentElement.lang === 'en'
      ? 'Try arranging the phrases!'
      : '五句並べに挑戦する',
  }, CFG.messages || {});

  let nextSlot   = 0;
  let resetTimer = null;
  let wrongCount = 0;
  let demoTimers = [];   // プレビューのデモ再生（1句ずつ表示）用の setTimeout ID

  function slotHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    tmp.querySelectorAll('rt').forEach(rt => rt.remove());
    tmp.querySelectorAll('ruby').forEach(ruby => ruby.replaceWith(...ruby.childNodes));
    return tmp.innerHTML;
  }

  /* ── ヒント機能 ── */
  function hintNextSlot() {
    if (nextSlot >= WAKA.length) return;
    const chip = document.querySelector(`#float-area .word-chip[data-idx="${nextSlot}"]`);
    if (chip) chip.click();
  }

  function hintShowComplete() {
    if (nextSlot >= WAKA.length) return;
    clearReset();

    for (let i = nextSlot; i < WAKA.length; i++) {
      const slot = document.getElementById(`slot-${i}`);
      if (!slot) continue;
      slot.querySelector('.slot-text').innerHTML =
        document.getElementById('waka-card').classList.contains('romaji-mode')
          ? _htmlToRomaji(WAKA[i].html)
          : (window.innerWidth < 760 ? slotHtml(WAKA[i].html) : WAKA[i].html);
      slot.classList.add('filled');
      const chip = document.querySelector(`#float-area .word-chip[data-idx="${i}"]`);
      if (chip) { chip.classList.add('placed'); chip.style.cssText = ''; }
    }
    nextSlot = WAKA.length;

    setNeko('happy');
    const _cb = typeof MSG.completeBody === 'function'
      ? MSG.completeBody(CFG.poetName)
      : String(MSG.completeBody).replace('{name}', CFG.poetName);
    setBalloon(MSG.completeTitle, _cb, 'balloon-happy');

    const pa = document.querySelector('.card-poem-area');
    if (pa) pa.classList.add('complete');
    document.getElementById('float-area').classList.add('hidden');
    const ha = document.getElementById('hint-area');
    if (ha) {
      ha.querySelectorAll('.hint-btn:not(.hint-retry-btn)').forEach(b => b.style.display = 'none');
      const hrb = ha.querySelector('.hint-retry-btn');
      if (hrb) hrb.style.display = 'block';
    }
    setTimeout(() => revealDivineCard(true), 350);
  }

  /* ── 吹き出し位置のデバイス自動補正 ──
   * PC（カード幅290px）で調整した bubblePos をスマホでも同じ図上位置に表示する。
   * object-fit:contain + object-position:bottom-center の描画矩形をもとに補正する。 */
  const DESIGN_CARD_W = 290; // 位置調整時の基準カード幅（PC）

  function _figureRenderedRect(cW, cH, natW, natH) {
    const scale = Math.min(cW / natW, cH / natH);
    const rW = natW * scale, rH = natH * scale;
    return { left: (cW - rW) / 2, top: cH - rH, width: rW, height: rH };
  }

  function applyBubblePosTo(el, posObj, figureArea) {
    ['top', 'left', 'right', 'bottom', 'transform'].forEach(k => { el.style[k] = ''; });

    if (!posObj || !Object.keys(posObj).length) {
      el.style.left = Math.max(4, Math.round(figureArea.offsetWidth / 2 - el.offsetWidth - 24)) + 'px';
      el.style.top  = '8px';
      return;
    }

    const cW = figureArea.offsetWidth;
    const cH = figureArea.offsetHeight || DESIGN_CARD_W;

    /* 基準幅と同じならそのまま適用 */
    if (Math.abs(cW - DESIGN_CARD_W) < 1) {
      Object.keys(posObj).forEach(k => { el.style[k] = posObj[k]; });
      return;
    }

    /* 図の naturalWidth/naturalHeight を取得 */
    const figEl = figureArea.querySelector('img');
    const natW  = figEl ? figEl.naturalWidth  : 0;
    const natH  = figEl ? figEl.naturalHeight : 0;

    if (!natW || !natH) {
      /* 自然サイズ不明時はそのまま適用 */
      Object.keys(posObj).forEach(k => { el.style[k] = posObj[k]; });
      return;
    }

    const dR = _figureRenderedRect(DESIGN_CARD_W, cH, natW, natH); // 基準矩形
    const aR = _figureRenderedRect(cW,            cH, natW, natH); // 実機矩形

    /* top の補正（基準カード高さ cH は両方共通） */
    let newTop = null;
    if (posObj.top !== undefined) {
      const dTop = String(posObj.top).endsWith('%')
        ? parseFloat(posObj.top) / 100 * cH
        : parseFloat(posObj.top);
      const frac = dR.height > 0 ? (dTop - dR.top) / dR.height : 0;
      newTop = aR.top + frac * aR.height;
    }

    /* left の補正（left は基準カード幅 DESIGN_CARD_W に対する割合） */
    let newLeft = null;
    if (posObj.left !== undefined) {
      const dLeft = String(posObj.left).endsWith('%')
        ? parseFloat(posObj.left) / 100 * DESIGN_CARD_W
        : parseFloat(posObj.left);
      const frac = dR.width > 0 ? (dLeft - dR.left) / dR.width : 0.5;
      newLeft = aR.left + frac * aR.width;
    }

    /* top / left 以外はそのまま適用 */
    Object.keys(posObj).forEach(k => {
      if (k !== 'top' && k !== 'left') el.style[k] = posObj[k];
    });
    if (newTop  !== null) el.style.top  = Math.round(newTop)  + 'px';
    if (newLeft !== null) el.style.left = Math.round(newLeft) + 'px';
  }

  /* ── 吹き出しの尻尾クラスを返す ── */
  function _bubbleTailClass() {
    const t = CFG.bubbleTail || '';
    if (t === 'left')       return ' tail-left';
    if (t === 'top-left')   return ' tail-top tail-top-left';
    if (t === 'top-right')  return ' tail-top tail-top-right';
    if (t === 'top')        return ' tail-top';
    /* 'right' or unset: horizontal mode falls back to centered top tail */
    return CFG.bubbleHorizontal ? ' tail-top' : '';
  }

  /* ── 猫・吹き出し ── */
  function setNeko(state) {
    const img = document.getElementById('neko-img');
    const map = { normal: 'img/neko_normal.webp', happy: 'img/neko_happy.webp', sad: 'img/neko_sad.webp' };
    img.src = map[state] || map.normal;
    img.classList.remove('neko-bounce');
    void img.offsetWidth;
    img.classList.add('neko-bounce');
  }

  function setBalloon(title, body, colorClass) {
    document.getElementById('neko-balloon').className = colorClass || '';
    let html = '';
    if (title) html += `<div class="balloon-step-title">${title}</div>`;
    html += `<p class="balloon-body">${body}</p>`;
    document.getElementById('neko-balloon-text').innerHTML = html;
  }

  function clearReset() {
    if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
  }

  /* プレビューのデモ再生を止める（ゲーム開始時などに呼ぶ） */
  function clearDemo() {
    demoTimers.forEach(id => clearTimeout(id));
    demoTimers = [];
  }

  /* ── ゲーム初期化 ── */
  function initGame() {
    clearReset();
    clearDemo();
    nextSlot   = 0;
    wrongCount = 0;

    document.getElementById('neko-area').classList.toggle('tail-right', CFG.nekoTail === 'right');

    const oldBtn = document.querySelector('.retry-btn');
    if (oldBtn) oldBtn.remove();
    const oldHint = document.getElementById('hint-area');
    if (oldHint) oldHint.remove();
    const oldChallenge = document.querySelector('.challenge-btn');
    if (oldChallenge) oldChallenge.remove();

    setNeko('normal');
    setBalloon(MSG.initTitle, MSG.initBody);

    const floatArea = document.getElementById('float-area');
    floatArea.innerHTML = '';
    floatArea.style.cssText = '';
    floatArea.classList.remove('hidden');

    /* 本物のチップ */
    const allChips = [...WAKA].map(line => {
      const chip = document.createElement('div');
      chip.className  = 'word-chip';
      chip.innerHTML  = line.html;
      chip.dataset.idx = line.idx;
      chip.addEventListener('click', () => onChipClick(chip, line.idx));
      return chip;
    });

    /* 全チップをシャッフルして追加 */
    allChips.sort(() => Math.random() - 0.5).forEach(chip => floatArea.appendChild(chip));

    /* 英語版：ローマ字切り替えボタン */
    if (document.documentElement.lang === 'en') {
      const oldBtn = document.getElementById('romaji-toggle-btn');
      if (oldBtn) oldBtn.remove();
      const romajiBtn = document.createElement('button');
      romajiBtn.id = 'romaji-toggle-btn';
      romajiBtn.textContent = 'Show Romaji';
      let romajiOn = false;
      romajiBtn.addEventListener('click', () => {
        romajiOn = !romajiOn;
        romajiBtn.textContent = romajiOn ? 'Hide Romaji' : 'Show Romaji';
        floatArea.querySelectorAll('.word-chip:not(.placed)').forEach(chip => {
          const idx = parseInt(chip.dataset.idx, 10);
          chip.innerHTML = romajiOn ? _htmlToRomaji(WAKA[idx].html) : WAKA[idx].html;
        });
        document.querySelectorAll('.waka-slot.filled').forEach(slot => {
          const idx = parseInt(slot.id.replace('slot-', ''), 10);
          const slotText = slot.querySelector('.slot-text');
          if (slotText) {
            slotText.innerHTML = romajiOn
              ? _htmlToRomaji(WAKA[idx].html)
              : (window.innerWidth < 760 ? slotHtml(WAKA[idx].html) : WAKA[idx].html);
          }
        });
        const nameEl = document.querySelector('.poet-name-text');
        if (nameEl && window.GK_POETS) {
          const poetEntry = window.GK_POETS.find(p => p[0] === CFG.pageNum);
          nameEl.textContent = romajiOn && poetEntry ? poetEntry[2] : CFG.poetName;
        }
        document.getElementById('waka-card').classList.toggle('romaji-mode', romajiOn);
        document.getElementById('float-area').classList.toggle('romaji-mode', romajiOn);
      });
      const oldWrap = document.querySelector('.romaji-toggle-wrap');
      if (oldWrap) oldWrap.remove();
      const romajiWrap = document.createElement('div');
      romajiWrap.className = 'romaji-toggle-wrap';
      romajiWrap.appendChild(romajiBtn);
      const h1Badge = document.querySelector('h1.h1-badge');
      if (h1Badge) h1Badge.insertAdjacentElement('afterend', romajiWrap);
    }

    const NUMS = ['一', '二', '三', '四', '五'];
    const card = document.getElementById('waka-card');
    card.innerHTML  = '';
    card.style.cssText = '';

    const poemArea = document.createElement('div');
    poemArea.className = 'card-poem-area';

    /* 歌人名スロット（DOM先頭 = row-reverse で右端） */
    const nameSlot = document.createElement('div');
    nameSlot.className = 'poet-name-slot';
    const nameText = document.createElement('span');
    nameText.className   = 'poet-name-text';
    nameText.textContent = CFG.poetName;
    nameSlot.appendChild(nameText);
    poemArea.appendChild(nameSlot);

    for (let i = 0; i < 5; i++) {
      const slot = document.createElement('div');
      slot.className = 'waka-slot';
      slot.id = `slot-${i}`;
      slot.innerHTML =
        `<span class="slot-num">${NUMS[i]}</span>` +
        `<span class="slot-text"></span>`;
      poemArea.appendChild(slot);
    }

    const figureArea = document.createElement('div');
    figureArea.className = 'card-figure-area';
    const figImg = document.createElement('img');
    figImg.src = CFG.figureSrc;
    figImg.id  = 'card-figure';
    figImg.alt = CFG.poetName;
    figureArea.appendChild(figImg);

    card.appendChild(poemArea);
    card.appendChild(figureArea);

    /* 歌番号（左下） */
    const cardNum = document.createElement('span');
    cardNum.className = 'card-page-num';
    cardNum.textContent = CFG.pageNum;
    card.appendChild(cardNum);

    /* 前後ナビゲーションボタン（#card-nav-wrap の両端に挿入） */
    if (CFG.pageNum) {
      const num  = CFG.pageNum;
      const pad  = n => String(n).padStart(2, '0');
      const prev = num ===   1 ? 100 : num - 1;
      const next = num === 100 ?   1 : num + 1;
      const wrap = document.getElementById('card-nav-wrap');

      /* 既存ボタンを削除 */
      const oldBack = document.getElementById('back');
      const oldNext = document.getElementById('next');
      if (oldBack) oldBack.remove();
      if (oldNext) oldNext.remove();

      /* カードだけを囲むラッパー（初回のみ生成） */
      let posWrap = document.getElementById('card-pos-wrap');
      if (!posWrap) {
        posWrap = document.createElement('div');
        posWrap.id = 'card-pos-wrap';
        wrap.insertBefore(posWrap, card);
        posWrap.appendChild(card);
      }

      const backBtn = document.createElement('div');
      backBtn.id = 'back';
      backBtn.innerHTML = '<img src="/img/arrow_left.svg?01" alt="前へ">';
      const suffix = CFG.pageSuffix || '';
      backBtn.addEventListener('click', () => { location.href = `gokunarabe_${pad(prev)}${suffix}.html`; });
      posWrap.insertBefore(backBtn, card);

      const nextBtn = document.createElement('div');
      nextBtn.id = 'next';
      nextBtn.innerHTML = '<img src="/img/arrow_right.svg?01" alt="次へ">';
      nextBtn.addEventListener('click', () => { location.href = `gokunarabe_${pad(next)}${suffix}.html`; });
      posWrap.appendChild(nextBtn);
    }

    /* 「もう一度する」ボタン（下・元のデザイン） */
    const retryBtn = document.createElement('button');
    retryBtn.className = 'retry-btn';
    retryBtn.textContent = MSG.retry;
    retryBtn.addEventListener('click', initGame);
    document.getElementById('card-nav-wrap').appendChild(retryBtn);

    /* ヒントエリア（札の上） */
    const hintArea = document.createElement('div');
    hintArea.id = 'hint-area';
    const nextHintBtn = document.createElement('button');
    nextHintBtn.className = 'hint-btn';
    nextHintBtn.textContent = MSG.hintNext;
    nextHintBtn.addEventListener('click', hintNextSlot);
    const completeHintBtn = document.createElement('button');
    completeHintBtn.className = 'hint-btn';
    completeHintBtn.textContent = MSG.hintComplete;
    completeHintBtn.addEventListener('click', hintShowComplete);
    hintArea.appendChild(nextHintBtn);
    hintArea.appendChild(completeHintBtn);
    const navWrap = document.getElementById('card-nav-wrap');
    navWrap.insertBefore(hintArea, navWrap.firstChild);
  }

  /* ── チップ→スロット飛翔アニメーション ── */
  function flyChipToSlot(chip, slotEl, callback) {
    const chipRect = chip.getBoundingClientRect();
    const slotRect = slotEl.getBoundingClientRect();

    const clone = chip.cloneNode(true);
    clone.style.cssText = [
      'position:fixed',
      `left:${chipRect.left}px`, `top:${chipRect.top}px`,
      `width:${chipRect.width}px`, `height:${chipRect.height}px`,
      'margin:0', 'animation:none', 'z-index:999', 'pointer-events:none',
      'transition:left .44s cubic-bezier(.4,0,.15,1),top .44s cubic-bezier(.4,0,.15,1),transform .44s ease,opacity .44s ease',
    ].join(';');
    document.body.appendChild(clone);

    chip.style.animation  = 'none';
    chip.style.transition = 'opacity .1s';
    chip.style.opacity    = '0';

    const tx = slotRect.left + slotRect.width / 2 - chipRect.width / 2;
    const ty = slotRect.top + 6;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clone.style.left      = `${tx}px`;
        clone.style.top       = `${ty}px`;
        clone.style.transform = 'scale(0.28)';
        clone.style.opacity   = '0.1';
      });
    });

    setTimeout(() => { clone.remove(); callback(); }, 460);
  }

  /* ── ローマ字変換（英語版チップ用・ヘボン式） ── */
  const _H2R = (function () {
    const t = {};
    'きゃkya きゅkyu きょkyo しゃsha しゅshu しょsho ちゃcha ちゅchu ちょcho にゃnya にゅnyu にょnyo ひゃhya ひゅhyu ひょhyo みゃmya みゅmyu みょmyo りゃrya りゅryu りょryo ぎゃgya ぎゅgyu ぎょgyo じゃja じゅju じょjo びゃbya びゅbyu びょbyo ぴゃpya ぴゅpyu ぴょpyo'
      .split(' ').forEach(s => { t[s.slice(0, 2)] = s.slice(2); });
    'あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa ゐwi ゑwe をwo んn がga ぎgi ぐgu げge ごgo ざza じji ずzu ぜze ぞzo だda ぢji づzu でde どdo ばba びbi ぶbu べbe ぼbo ぱpa ぴpi ぷpu ぺpe ぽpo'
      .split(' ').forEach(s => { t[s[0]] = s.slice(1); });
    return t;
  })();

  function _kanaToRomaji(kana) {
    let r = '', i = 0;
    while (i < kana.length) {
      if (kana[i] === 'っ') {
        const nx = _H2R[kana.slice(i + 1, i + 3)] || _H2R[kana[i + 1]] || '';
        r += nx ? nx[0] : '';
        i++; continue;
      }
      const two = _H2R[kana.slice(i, i + 2)];
      if (two) { r += two; i += 2; continue; }
      r += _H2R[kana[i]] || kana[i];
      i++;
    }
    return r;
  }

  function _htmlToRomaji(html) {
    const kana = html
      .replace(/<ruby>[^<]*<rt>([^<]*)<\/rt><\/ruby>/g, '$1')
      .replace(/<[^>]+>/g, '');
    return _kanaToRomaji(kana);
  }

  /* ── チップクリック ── */
  function onChipClick(chip, lineIdx) {
    if (chip.classList.contains('placed')) return;

    clearReset();

    if (lineIdx === nextSlot) {
      const slotIdx = nextSlot;
      const slot    = document.getElementById(`slot-${slotIdx}`);
      chip.style.pointerEvents = 'none';
      nextSlot++;

      flyChipToSlot(chip, slot, () => {
        chip.classList.add('placed');
        chip.style.cssText = '';

        slot.querySelector('.slot-text').innerHTML =
          document.getElementById('waka-card').classList.contains('romaji-mode')
            ? _htmlToRomaji(WAKA[slotIdx].html)
            : (window.innerWidth < 760 ? slotHtml(WAKA[slotIdx].html) : WAKA[slotIdx].html);
        slot.classList.add('filled');

        if (slotIdx === WAKA.length - 1) {
          setNeko('happy');
          setBalloon('', MSG.correctMsgs[WAKA.length - 1], 'balloon-happy');
          setTimeout(() => {
            const _cb = typeof MSG.completeBody === 'function'
              ? MSG.completeBody(CFG.poetName)
              : String(MSG.completeBody).replace('{name}', CFG.poetName);
            setBalloon(MSG.completeTitle, _cb, 'balloon-happy');
          }, 1200);
          const pa = document.querySelector('.card-poem-area');
          if (pa) pa.classList.add('complete');
          localStorage.setItem('gk_done_' + String(CFG.pageNum).padStart(2, '0'), '1');
          document.dispatchEvent(new CustomEvent('gk-completed'));
          setTimeout(revealDivineCard, 350);
          document.getElementById('float-area').classList.add('hidden');
          const ha = document.getElementById('hint-area');
          if (ha) ha.style.display = 'none';
        } else {
          setNeko('happy');
          setBalloon('', MSG.correctMsgs[slotIdx], 'balloon-happy');
          resetTimer = setTimeout(() => {
            setNeko('normal');
            setBalloon(MSG.keepGoing, '');
            resetTimer = null;
          }, 1500);
        }
      });

    } else {
      chip.classList.add('do-shake');
      setTimeout(() => chip.classList.remove('do-shake'), 500);

      if (nextSlot === 0) {
        /* 1句目はペナルティなし */
        setNeko('sad');
        setBalloon('', MSG.wrong, 'balloon-sad');
        resetTimer = setTimeout(() => {
          setNeko('normal');
          setBalloon(MSG.encourage1, '');
          resetTimer = null;
        }, 2200);
      } else {
        wrongCount++;
        if (wrongCount >= 3) {
          setNeko('sad');
          setBalloon('', MSG.wrong3, 'balloon-sad');
          setTimeout(triggerScatterBreak, 700);
        } else if (wrongCount === 2) {
          setNeko('sad');
          setBalloon('', MSG.wrong2, 'balloon-sad');
          resetTimer = setTimeout(() => {
            setNeko('normal');
            setBalloon(MSG.encourage2, '');
            resetTimer = null;
          }, 2200);
        } else {
          setNeko('sad');
          setBalloon('', MSG.wrong, 'balloon-sad');
          resetTimer = setTimeout(() => {
            setNeko('normal');
            setBalloon(MSG.donmai, '');
            resetTimer = null;
          }, 2200);
        }
      }
    }
  }

  /* ── 3回ミス：カードを揺らして文字が重力で落下 → やり直し ── */
  /* ── 3回ミス：GSAP でカードを揺らして文字をはじけ飛ばす ── */
  function triggerScatterBreak() {
    clearReset();
    const card = document.getElementById('waka-card');

    /* GSAP（CDN）が読み込めなかった場合の ReferenceError でゲームが
       止まらないよう、フォールバックでそのままリセットする */
    if (typeof gsap === 'undefined') {
      setTimeout(initGame, 1200);
      return;
    }

    /* ① GSAP でカードをシェイク → 完了後に文字を散らす */
    gsap.timeline({ onComplete: scatterChars })
      .to(card, { x: -12, rotation: -2,   duration: 0.08, ease: 'none' })
      .to(card, { x:  12, rotation:  2,   duration: 0.08, ease: 'none' })
      .to(card, { x:  -8, rotation: -1.2, duration: 0.07, ease: 'none' })
      .to(card, { x:   8, rotation:  1.2, duration: 0.07, ease: 'none' })
      .to(card, { x:   0, rotation:  0,   duration: 0.06, ease: 'none' });

    function scatterChars() {
      const slotTexts = card.querySelectorAll('.waka-slot.filled .slot-text');
      const fixedEls  = [];

      slotTexts.forEach(textEl => {
        const cs    = window.getComputedStyle(textEl);
        const fSize = parseFloat(cs.fontSize);
        const step  = fSize * 1.25;  /* 文字の縦ピッチ（letter-spacing込み） */
        const rect  = textEl.getBoundingClientRect();

        /* ruby の <rt> を除いた本文字だけ抽出 */
        const tmp = textEl.cloneNode(true);
        tmp.querySelectorAll('rt').forEach(rt => rt.remove());
        const chars = [...tmp.textContent];

        chars.forEach((ch, i) => {
          const el = document.createElement('div');
          el.textContent = ch;
          el.style.cssText = [
            'position:fixed',
            `left:${rect.left}px`,
            `top:${rect.top + i * step}px`,
            `width:${rect.width}px`,
            `height:${fSize}px`,
            'margin:0; padding:0; line-height:1',
            'display:flex; align-items:center; justify-content:center',
            'z-index:2000; pointer-events:none',
            `font-family:${cs.fontFamily}`,
            `font-size:${cs.fontSize}`,
            `font-weight:${cs.fontWeight}`,
            `color:${cs.color}`,
          ].join(';');
          document.body.appendChild(el);
          fixedEls.push(el);
        });

        textEl.style.opacity = '0';  /* 元テキストを隠す */
      });

      /* ② カードをフェードアウト */
      gsap.to(card, { opacity: 0, duration: 0.6, delay: 0.2 });

      /* ③ 全方向にはじけ飛ぶ（文字をランダムに大きくしながら消失） */
      gsap.to(fixedEls, {
        x:        () => gsap.utils.random(-700, 700),
        y:        () => gsap.utils.random(-500, 700),
        rotation: () => gsap.utils.random(-720, 720),
        scale:    () => gsap.utils.random(2, 7),
        opacity:  0,
        duration: () => gsap.utils.random(0.9, 1.5),
        ease:     'expo.out',
        stagger:  { amount: 0.18, from: 'random' },
      });

      /* ④ リセット */
      setTimeout(() => {
        fixedEls.forEach(el => el.remove());
        gsap.set(card, { clearProps: 'all' });
        initGame();
      }, 2500);
    }
  }

  /* ── 歌人登場アニメーション ── */
  function revealDivineCard(fromHint) {
    const figureArea = document.querySelector('.card-figure-area');
    const figure     = document.getElementById('card-figure');
    if (!figureArea || !figure) return;

    const STREAK_COLORS = [
      ['rgba(255,248,180,', 'rgba(255,235,80,'],
      ['rgba(255,255,230,', 'rgba(255,245,140,'],
      ['rgba(255,230,120,', 'rgba(255,210,50,'],
      ['rgba(240,255,210,', 'rgba(220,255,160,'],
      ['rgba(255,240,200,', 'rgba(255,220,100,'],
    ];
    const particles = [];
    for (let i = 0; i < 100; i++) {
      const p   = document.createElement('div');
      p.className = 'divine-particle';
      const w   = (1.2 + Math.random() * 2.2).toFixed(1);
      const h   = Math.round(22 + Math.random() * 52);
      const col = STREAK_COLORS[Math.floor(Math.random() * STREAK_COLORS.length)];
      const a1  = (.7  + Math.random() * .3).toFixed(2);
      const a2  = (.4  + Math.random() * .5).toFixed(2);
      const gradient =
        `linear-gradient(to top,` +
        `transparent 0%,` +
        `${col[1]}${a2}) 20%,` +
        `${col[0]}${a1}) 50%,` +
        `${col[1]}${a2}) 80%,` +
        `transparent 100%)`;
      p.style.cssText = [
        `width:${w}px`,
        `height:${h}px`,
        `left:${(4 + Math.random() * 92).toFixed(1)}%`,
        `bottom:${Math.round(Math.random() * 24)}px`,
        `background:${gradient}`,
        `box-shadow:0 0 4px ${col[0]}${a1})`,
        `animation-duration:${(0.43 + Math.random() * 0.77).toFixed(2)}s`,
        `animation-delay:${(Math.random() * 1.1).toFixed(2)}s`,
      ].join(';');
      figureArea.appendChild(p);
      particles.push(p);
    }

    const glow = document.createElement('div');
    glow.className = 'divine-glow-bg';
    const beam = document.createElement('div');
    beam.className = 'divine-beam';
    figureArea.insertBefore(beam, figureArea.firstChild);
    figureArea.insertBefore(glow, figureArea.firstChild);

    figure.classList.add('divine-rise');

    setTimeout(() => {
      figure.classList.remove('divine-rise');
      figure.style.opacity   = '1';
      figure.style.transform = 'none';

      /* 実行中の CSS アニメーション（fill: forwards）はインラインの opacity を
         上書きするため、従来はフェードされず remove 時に「パッ」と消えて
         吹き出し表示の直後にがたつきが生じていた。
         現在の不透明度を固定 → アニメーション停止 → transition でフェードする */
      [glow, beam].forEach(el => {
        el.style.opacity   = getComputedStyle(el).opacity;
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.opacity   = '0';
      });
      particles.forEach(p => { p.style.transition = 'opacity .5s ease'; p.style.opacity = '0'; });
      setTimeout(() => {
        glow.remove(); beam.remove();
        particles.forEach(p => p.remove());
      }, 900);

      /* 完成時：「ありがとう」→ランダムセリフの順で吹き出し表示 */
      const applyBubblePos = (el, posObj) => applyBubblePosTo(el, posObj, figureArea);

      const bubble = document.createElement('div');
      bubble.className = 'card-bubble' + _bubbleTailClass() + (CFG.bubbleHorizontal ? ' bubble-h' : '');
      figureArea.appendChild(bubble);
      if (CFG.bubbleHorizontal) {
        const _card = document.getElementById('waka-card');
        _card.style.overflow = 'visible';
        bubble.style.width    = 'max-content';
        bubble.style.maxWidth = Math.round(_card.offsetWidth * 0.8) + 'px';
      }

      /* ランダムセリフを表示するヘルパー（空・不正な値は除外して TypeError を防ぐ） */
      const texts = (Array.isArray(CFG.bubbleText) ? CFG.bubbleText : [CFG.bubbleText])
        .filter(t => typeof t === 'string' && t.length > 0);
      let bubbleTimer = null;

      function getPosForText(text) {
        const lines = (text.match(/\n/g) || []).length;
        if (lines >= 2) return CFG.bubblePosThank3 || CFG.bubblePosThank || CFG.bubblePos || {};
        if (lines === 1) return CFG.bubblePosThank  || CFG.bubblePos || {};
        return CFG.bubblePos || {};
      }

      function showRandomBubble() {
        if (!texts.length) return;
        clearTimeout(bubbleTimer);
        const randomText = texts[Math.floor(Math.random() * texts.length)];

        /* がたつき防止：不可視のまま「テキスト→位置」を同一タスク内で確定し、
           リフローでアニメーションをリセットしてから表示を開始する。
           （従来は rAF を2回またいで位置適用していたため、端末・タイミングに
             よって位置確定前のフレームが描画され、表示がぶれることがあった） */
        bubble.classList.remove('bubble-pop-in');
        bubble.style.transition = 'none';
        bubble.style.opacity    = '0';
        bubble.textContent      = randomText;
        applyBubblePos(bubble, getPosForText(randomText));
        void bubble.offsetWidth; // 新テキスト＋新位置でレイアウト確定＆アニメーションをリセット
        bubble.classList.add('bubble-pop-in');

        bubbleTimer = setTimeout(() => {
          bubble.style.transition = 'none';
          bubble.style.opacity    = '1';        // インラインで1を確定（クラス削除後に引き継ぐ）
          bubble.classList.remove('bubble-pop-in'); // アニメーション解除、インライン値が即適用
          void bubble.offsetWidth;              // リフロー：ブラウザに opacity=1 を認識させる
          bubble.style.transition = 'opacity 0.6s ease';
          bubble.style.opacity    = '0';        // 1→0 のスムーズなフェード
        }, 3000);
      }

      /* 歌人登場後にランダムセリフを表示＋クリックリスナーを同時に有効化
         （先にリスナーを追加すると500ms以内のタップで二重発火するため） */
      setTimeout(() => {
        showRandomBubble();
        figure.style.cursor = 'pointer';
        figure.addEventListener('click', showRandomBubble);

        /* 歌人セリフ表示から3秒後にワードクラウドへ誘導
           （「完成形を見る」ヒントで表示した場合は自力で解いておらず
             投稿欄も未解放のため、猫のセリフは切り替えない） */
        if (!fromHint && document.getElementById('wordcloud-section') && MSG.wcInvite) {
          setTimeout(() => {
            setNeko('normal');
            setBalloon('', MSG.wcInvite);
          }, 3000);
        }
      }, 500);

      /* 「もう一度する」ボタンを表示（initGame で既にDOM配置済み） */
      const retryBtn = document.querySelector('.retry-btn');
      if (retryBtn) requestAnimationFrame(() => requestAnimationFrame(() => retryBtn.classList.add('visible')));
    }, 1200);
  }

  /* ── 初期表示：完成形プレビュー ──
     ページを開いた時点ではまず完成した歌を見せ、「五句並べに挑戦する」
     ボタンを押した時にだけ実際のゲーム（チップのシャッフル配置）を始める。
     カード自体は initGame() でまるごと組み立て、その上から
     「全スロットに正解を入れて固定表示」の見た目だけ被せる。 */
  function initPreview() {
    initGame();          // カードを組み直す（内部で clearDemo 済み・スロットは空）
    clearReset();

    document.getElementById('float-area').classList.add('hidden');

    const hintArea = document.getElementById('hint-area');
    if (hintArea) hintArea.style.display = 'none';

    const figure = document.getElementById('card-figure');
    figure.style.opacity   = '1';
    figure.style.transform = 'none';

    const retryBtn = document.querySelector('.retry-btn');
    if (retryBtn) retryBtn.remove();

    /* 「五句並べに挑戦する」ボタン（デモ再生中でも押せば即ゲーム開始 → initGame が clearDemo する） */
    const challengeBtn = document.createElement('button');
    challengeBtn.className = 'challenge-btn';
    challengeBtn.textContent = MSG.challenge;
    challengeBtn.addEventListener('click', () => {
      challengeBtn.remove();
      initGame();
    });
    const navWrap = document.getElementById('card-nav-wrap');
    navWrap.insertBefore(challengeBtn, navWrap.firstChild);

    setNeko('normal');
    setBalloon(MSG.previewTitle, MSG.previewBody);

    /* ── デモ再生：1句目 → 5句目 を1句ずつ順番に表示する ──
       .waka-slot.filled .slot-text には slot-drop-in アニメが定義済みなので、
       .filled を時間差で付けるだけで「1句ずつ現れる」演出になる。 */
    const STEP = 700;   // 各句の間隔(ms)
    const LEAD = 250;   // 最初の句までの間(ms)
    const card = document.getElementById('waka-card');
    const romajiOn = card && card.classList.contains('romaji-mode');

    for (let i = 0; i < WAKA.length; i++) {
      demoTimers.push(setTimeout(() => {
        const slot = document.getElementById(`slot-${i}`);
        if (!slot) return;
        slot.querySelector('.slot-text').innerHTML =
          romajiOn ? _htmlToRomaji(WAKA[i].html)
                   : (window.innerWidth < 760 ? slotHtml(WAKA[i].html) : WAKA[i].html);
        slot.classList.add('filled');
      }, LEAD + i * STEP));
    }

    /* 全句出しきったら完成形（文字を大きく組み直す）にする */
    demoTimers.push(setTimeout(() => {
      const pa = document.querySelector('.card-poem-area');
      if (pa) pa.classList.add('complete');
    }, LEAD + WAKA.length * STEP + 200));
  }

  /* ページ読み込みごとに「クリア済み」フラグをリセットする。
     このフラグは localStorage に永続保存されるため、リセットしないと
     過去に一度でもクリアした端末では、今回まだ句を並べていなくても
     ワードクラウドの投稿欄が最初から入力可能になってしまう。 */
  localStorage.removeItem('gk_done_' + String(CFG.pageNum).padStart(2, '0'));

  initPreview();

  /* ── デバッグモード（吹き出し位置調整用） ── */
  if (CFG.debug) {
    const oldChallenge = document.querySelector('.challenge-btn');
    if (oldChallenge) oldChallenge.remove();
    for (let i = 0; i < 5; i++) {
      const slot = document.getElementById(`slot-${i}`);
      slot.querySelector('.slot-text').innerHTML =
        document.getElementById('waka-card').classList.contains('romaji-mode')
          ? _htmlToRomaji(WAKA[i].html)
          : (window.innerWidth < 760 ? slotHtml(WAKA[i].html) : WAKA[i].html);
      slot.classList.add('filled');
    }
    document.querySelector('.card-poem-area').classList.add('complete');
    document.getElementById('float-area').classList.add('hidden');

    const figure     = document.getElementById('card-figure');
    const figureArea = document.querySelector('.card-figure-area');
    figure.style.opacity   = '1';
    figure.style.transform = 'none';

    const dbgBubble = document.createElement('div');
    dbgBubble.className     = 'card-bubble' + _bubbleTailClass() + (CFG.bubbleHorizontal ? ' bubble-h' : '');
    dbgBubble.style.opacity       = '1';
    dbgBubble.style.cursor        = 'grab';
    dbgBubble.style.pointerEvents = 'auto';
    figureArea.appendChild(dbgBubble);
    if (CFG.bubbleHorizontal) {
      const _card = document.getElementById('waka-card');
      _card.style.overflow = 'visible';
      dbgBubble.style.width    = 'fit-content';
      dbgBubble.style.maxWidth = Math.round(_card.offsetWidth * 0.8) + 'px';
    }

    const allTexts = Array.isArray(CFG.bubbleText) ? CFG.bubbleText : [CFG.bubbleText];

    function sampleForLines(n) {
      const match = allTexts.find(t => (t.match(/\n/g) || []).length === n);
      if (match) return match;
      const parts = allTexts[0].split('\n');
      if (n === 0) return parts[0] || 'サンプル';
      if (n === 1) return parts.slice(0, 2).join('\n') || parts[0] + '\n二行目';
      return parts.slice(0, 3).join('\n') || parts[0] + '\n二行目\n三行目';
    }

    /* 横書き吹き出しは実際の bubbleText をそのまま使う（サイズが一致するように） */
    const _dbgSample = key => CFG.bubbleHorizontal
      ? allTexts[0]
      : sampleForLines({ bubblePos: 0, bubblePosThank: 1, bubblePosThank3: 2 }[key]);
    const POS_DEFS = [
      { key: 'bubblePos',       label: '1行', sample: _dbgSample('bubblePos') },
      { key: 'bubblePosThank',  label: '2行', sample: _dbgSample('bubblePosThank') },
      { key: 'bubblePosThank3', label: '3行', sample: _dbgSample('bubblePosThank3') },
    ];
    let curDef = POS_DEFS[0];

    const dbgPanel = document.createElement('div');
    dbgPanel.style.cssText = [
      'position:fixed', 'bottom:16px', 'right:16px',
      'background:rgba(20,20,20,0.93)', 'color:#eee',
      'padding:14px 16px', 'border-radius:12px',
      'font-family:monospace', 'font-size:13px',
      'z-index:9999', 'min-width:270px',
      'box-shadow:0 4px 24px rgba(0,0,0,0.6)',
      'line-height:1.5',
    ].join(';');
    document.body.appendChild(dbgPanel);

    const inputStyle = [
      'width:64px', 'padding:3px 6px',
      'background:#333', 'color:#eee',
      'border:1px solid #666', 'border-radius:4px',
      'font-family:monospace', 'font-size:13px',
      'text-align:right',
    ].join(';');

    function applyPos(topPct, leftPct) {
      applyBubblePosTo(dbgBubble, {
        top:       topPct  + '%',
        left:      leftPct + '%',
        transform: 'translateX(-50%)',
      }, figureArea);
    }

    function updateSnippet() {
      const top  = dbgPanel.querySelector('#dbg-top').value;
      const left = dbgPanel.querySelector('#dbg-left').value;
      dbgPanel.querySelector('#dbg-snippet').textContent =
        `${curDef.key}: {\n` +
        `  top:       '${top}%',\n` +
        `  left:      '${left}%',\n` +
        `  transform: 'translateX(-50%)',\n` +
        `},`;
    }

    function buildPanel() {
      const posObj  = CFG[curDef.key] || CFG.bubblePos || {};
      const topPct  = parseFloat(posObj.top)  || 0;
      const leftPct = parseFloat(posObj.left) || 0;

      dbgPanel.innerHTML =
        `<div style="font-weight:bold;color:#ffd700;margin-bottom:10px">&#x1F41E; 吹き出し位置調整</div>` +
        (POS_DEFS.length > 1 ?
          `<div style="margin-bottom:10px">` +
            POS_DEFS.map(d =>
              `<button data-dbg-key="${d.key}" style="margin-right:4px;padding:3px 10px;` +
              `background:${d === curDef ? '#ffd700' : '#555'};` +
              `color:${d === curDef ? '#000' : '#eee'};` +
              `border:none;border-radius:5px;cursor:pointer;font-size:12px">${d.label}</button>`
            ).join('') +
          `</div>`
        : '') +
        `<div style="margin-bottom:10px">` +
          `<label style="display:flex;align-items:center;gap:8px;margin-bottom:6px">` +
            `top&nbsp; <input id="dbg-top"  type="number" step="0.5" value="${topPct}"  style="${inputStyle}"> %` +
          `</label>` +
          `<label style="display:flex;align-items:center;gap:8px">` +
            `left <input id="dbg-left" type="number" step="0.5" value="${leftPct}" style="${inputStyle}"> %` +
          `</label>` +
        `</div>` +
        `<pre id="dbg-snippet" style="background:#111;padding:8px;border-radius:6px;font-size:11px;color:#afe;margin:0 0 8px;overflow-x:auto"></pre>` +
        `<button id="dbg-copy-btn" style="padding:4px 12px;background:#007e5e;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:12px">コピー</button>` +
        `<span id="dbg-copied-msg" style="margin-left:8px;color:#7ef;font-size:12px;opacity:0;transition:opacity .3s"></span>`;

      dbgBubble.textContent = curDef.sample;
      applyPos(topPct, leftPct);
      updateSnippet();

      dbgPanel.querySelectorAll('[data-dbg-key]').forEach(btn => {
        btn.addEventListener('click', () => {
          const def = POS_DEFS.find(d => d.key === btn.dataset.dbgKey);
          if (def) { curDef = def; buildPanel(); }
        });
      });

      ['#dbg-top', '#dbg-left'].forEach(sel => {
        dbgPanel.querySelector(sel).addEventListener('input', () => {
          applyPos(
            parseFloat(dbgPanel.querySelector('#dbg-top').value)  || 0,
            parseFloat(dbgPanel.querySelector('#dbg-left').value) || 0
          );
          updateSnippet();
        });
      });

      dbgPanel.querySelector('#dbg-copy-btn').addEventListener('click', () => {
        const snippet = dbgPanel.querySelector('#dbg-snippet').textContent;
        navigator.clipboard.writeText(snippet).then(() => {
          const msg = dbgPanel.querySelector('#dbg-copied-msg');
          msg.textContent   = 'コピーしました！';
          msg.style.opacity = '1';
          setTimeout(() => { msg.style.opacity = '0'; }, 2000);
        });
      });
    }

    /* 画像ロード完了後にパネルを初期化（座標変換を正確にするため） */
    if (figure.complete && figure.naturalWidth > 0) {
      buildPanel();
    } else {
      figure.addEventListener('load', buildPanel, { once: true });
    }

    /* ドラッグで位置調整 */
    let dbgDragging = false, dbgDragX, dbgDragY, dbgStartL, dbgStartT;

    function syncInputsFromBubble() {
      const br       = dbgBubble.getBoundingClientRect();
      const ar       = figureArea.getBoundingClientRect();
      const cW       = figureArea.offsetWidth;
      const cH       = figureArea.offsetHeight || 290;
      const topPx    = br.top  - ar.top;
      /* translateX(-50%) では style.left がそのまま視覚的中心になる。
         ドラッグ中は transform なし・left edge 基準なので center を計算する */
      const centerPx = (br.left - ar.left) + br.width / 2;

      const figEl = figureArea.querySelector('img');
      const natW  = figEl ? figEl.naturalWidth  : 0;
      const natH  = figEl ? figEl.naturalHeight : 0;

      let topPct, leftPct;
      if (natW && natH) {
        /* applyBubblePosTo の逆変換：実画面座標 → design 座標 → config % */
        const dR    = _figureRenderedRect(DESIGN_CARD_W, cH, natW, natH);
        const aR    = _figureRenderedRect(cW,            cH, natW, natH);
        const fracL = aR.width  > 0 ? (centerPx - aR.left) / aR.width  : 0.5;
        const dLeft = dR.left   + fracL * dR.width;
        leftPct = (dLeft / DESIGN_CARD_W * 100).toFixed(1);
        const fracT = aR.height > 0 ? (topPx - aR.top) / aR.height : 0;
        const dTop  = dR.top    + fracT * dR.height;
        topPct = (dTop / cH * 100).toFixed(1);
      } else {
        topPct  = (topPx    / cH          * 100).toFixed(1);
        leftPct = (centerPx / DESIGN_CARD_W * 100).toFixed(1);
      }

      const topEl  = dbgPanel.querySelector('#dbg-top');
      const leftEl = dbgPanel.querySelector('#dbg-left');
      if (topEl)  topEl.value  = topPct;
      if (leftEl) leftEl.value = leftPct;
      updateSnippet();
    }

    dbgBubble.addEventListener('mousedown', e => {
      dbgDragging = true;
      dbgDragX    = e.clientX;
      dbgDragY    = e.clientY;
      const br    = dbgBubble.getBoundingClientRect();
      const ar    = figureArea.getBoundingClientRect();
      dbgStartL   = br.left - ar.left;
      dbgStartT   = br.top  - ar.top;
      ['right','bottom','transform'].forEach(k => { dbgBubble.style[k] = ''; });
      dbgBubble.style.left   = dbgStartL + 'px';
      dbgBubble.style.top    = dbgStartT + 'px';
      dbgBubble.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!dbgDragging) return;
      dbgBubble.style.left = (dbgStartL + e.clientX - dbgDragX) + 'px';
      dbgBubble.style.top  = (dbgStartT + e.clientY - dbgDragY) + 'px';
      syncInputsFromBubble();
    });

    document.addEventListener('mouseup', () => {
      if (!dbgDragging) return;
      dbgDragging = false;
      dbgBubble.style.cursor = 'grab';
    });
  }


  // パンくず構造化データ（全gokunarabeページ共通）
  const _ldPadded = String(CFG.pageNum).padStart(2, '0');
  const _ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "時雨の百人一首", "item": "https://hyakuninisshu.com/" },
      { "@type": "ListItem", "position": 2, "name": "百人一首の一覧", "item": "https://hyakuninisshu.com/list.html" },
      { "@type": "ListItem", "position": 3, "name": `歌人に会える百人一首 ${CFG.poetName}`, "item": `https://hyakuninisshu.com/gokunarabe_${_ldPadded}.html` }
    ]
  };
  const _ldScript = document.createElement('script');
  _ldScript.type = 'application/ld+json';
  _ldScript.textContent = JSON.stringify(_ld);
  document.head.appendChild(_ldScript);

})();
