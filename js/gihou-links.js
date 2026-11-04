/* 技法（掛詞・縁語・序詞・枕詞・本歌取り）の説明から gihou シリーズへのリンクボタンを付ける。
   付ける場所は、マーク（.mark）で開くパネルと、技法を説明するツールチップ（.tippy）。
   tooltips.js / tooltips_en.js と poems.js / poems_en.js の処理が終わった後に動かすため、load で実行する。 */
(function () {
  if (/gihou-/.test(location.pathname)) return;
  const EN = document.documentElement.lang === 'en';

  // 各 gihou ページで、歌ごとの見出し（id="NN"）がある歌番号
  const KAKE = [1, 8, 9, 10, 13, 16, 19, 20, 22, 24, 25, 27, 28, 51, 55, 57, 58, 60, 62, 67, 72, 75, 77, 80, 88, 89, 91, 95, 96, 97, 98, 100];
  const TECH = {
    kakekotoba: { page: 'gihou-kakekotoba', nums: KAKE, ja: '掛詞', en: 'kakekotoba' },
    engo: { page: 'gihou-kakekotoba', nums: KAKE, ja: '縁語', en: 'engo' },
    jokotoba: { page: 'gihou-jokotoba', nums: [3, 13, 14, 18, 19, 27, 39, 46, 48, 49, 51, 58, 77, 88, 92, 97], ja: '序詞', en: 'jokotoba' },
    makurakotoba: { page: 'gihou-makurakotoba', nums: [2, 3, 4, 17, 33, 76], ja: '枕詞', en: 'makurakotoba' },
    honkadori: { page: 'gihou-honkadori', nums: [1, 2, 3, 6, 23, 32, 51, 56, 89, 90, 91, 92, 95], ja: '本歌取り', en: 'honkadori' },
  };

  const match = location.pathname.match(/(?:^|[\/_-])(\d+)(?:_[a-z]+)?\.html$/);
  const num = match ? parseInt(match[1], 10) : 0;

  function button(tech) {
    const t = TECH[tech];
    const hash = t.nums.includes(num) ? '#' + String(num).padStart(2, '0') : '';
    const label = EN ? `About ${t.en}` : `${t.ja}の解説を見る`;
    return `<a class="gihou-btn" href="${t.page}${EN ? '_en' : ''}.html${hash}">${label}</a>`;
  }

  // ツールチップの内容から、どの技法の説明かを判定する（人物などの説明で語句が出てくるだけのものは除く）
  function techOf(content) {
    const h3 = /<h3[^>]*>(.*?)<\/h3>/.exec(content);
    const title = (h3 ? h3[1] : '').replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');
    if (EN) {
      if (/jokotoba|preface/i.test(title)) return 'jokotoba';
      if (/kakekotoba|pivot word/i.test(title)) return 'kakekotoba';
      if (/associated word|\bengo\b/i.test(title)) return 'engo';
      if (/makurakotoba|pillow word/i.test(title)) return 'makurakotoba';
      if (/honkadori/i.test(title)) return 'honkadori';
      return null;
    }
    if (/序詞/.test(title)) return 'jokotoba';
    if (/掛詞/.test(title) || /の掛詞/.test(content)) return 'kakekotoba';
    if (/縁語/.test(title)) return 'engo';
    if (/枕詞/.test(title) || /【枕詞】/.test(content)) return 'makurakotoba';
    if (/本歌取/.test(title)) return 'honkadori';
    return null;
  }

  window.addEventListener('load', function () {
    // マークのパネル：その歌に該当する技法だけ（該当しないマークは .trigger / .has-badge を持たない）
    Object.keys(TECH).forEach(function (tech) {
      const panel = document.querySelector('.explanation > .' + tech);
      const mark = document.querySelector('#' + tech + ' img.trigger, #' + tech + '.has-badge');
      if (panel && mark) panel.insertAdjacentHTML('beforeend', button(tech));
    });

    document.querySelectorAll('.tippy').forEach(function (el) {
      const tip = el._tippy;
      if (!tip || typeof tip.props.content !== 'string') return;
      const tech = techOf(tip.props.content);
      if (!tech) return;
      tip.setProps({
        content: tip.props.content + button(tech),
        interactive: true,
        appendTo: document.body,
      });
    });
  });
})();
