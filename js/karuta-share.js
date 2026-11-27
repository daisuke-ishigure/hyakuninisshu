/* 対戦の結果を X（旧 Twitter）に投稿する（「Xでシェア」ボタン）。
   X の投稿画面（Web Intent：x.com/intent/tweet）を新しいタブで開き、文面とページの URL を入れておくだけ。
   投稿するかどうか・文面の手直しは、開いた X の画面で本人が決める。ログイン情報などは扱わない。
   使うページ：karuta-taisen.html・karuta-taisen_en.html（平面版・オンライン）、karuta-taisen-3d.html（ロボット対戦の3D版）、
             karuta-taisen-pro.html・karuta-taisen-pro_en.html

   KarutaShare.robot({ lang, me, cpu, level, msg })                       かるた対戦のロボット対戦（先に5枚）
   KarutaShare.online({ lang, rank, players, me, top, second, tied, msg }) かるた対戦のオンライン対戦・合言葉の対戦
   KarutaShare.pro({ lang, win, margin, level, cards, msg })               競技かるた対戦ゲーム
     → どれも投稿の文面（結果の事実＋ハッシュタグ）を返す。msg（結果画面の大きなメッセージ）は受け取るが文面には使わない
   KarutaShare.open(text, page, game)  X の投稿画面を開く。page：'taisen'／'pro'（URL を選ぶ）、game：記録用の名前
   KarutaShare.label(lang)             ボタンの中身（X のロゴ＋「シェア」）の HTML */
(function () {
  const SITE = 'https://hyakuninisshu.com/';
  const PAGE = {
    taisen: { ja: 'karuta-taisen.html', en: 'karuta-taisen_en.html' },
    pro: { ja: 'karuta-taisen-pro.html', en: 'karuta-taisen-pro_en.html' },
  };
  const LV = {
    ja: { easy: 'やさしい', normal: 'ふつう', hard: 'つよい', master: '鬼' },
    en: { easy: 'Easy', normal: 'Normal', hard: 'Hard', master: 'Oni' },
  };
  const TAGS = { ja: '#百人一首 #かるた #時雨の百人一首', en: '#HyakuninIsshu #karuta' };
  const L = (lang) => (lang === 'en' ? 'en' : 'ja');
  // 文面は結果の事実（勝ち負け・点数・順位）だけ。感想などは投稿する人が X の画面で書き足す
  const join = (lang, main) => main + '\n\n' + TAGS[lang];
  const ordinal = (n) => n + (n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th');

  function robot({ lang, me, cpu, level, msg }) {
    lang = L(lang);
    const lv = LV[lang][level] || LV[lang].normal, win = me > cpu;
    if (lang === 'en') {
      return join(lang, win ? `I beat the Robot (${lv}) ${me}–${cpu} at Hyakunin Isshu karuta!` : `I lost to the Robot (${lv}) ${me}–${cpu} at Hyakunin Isshu karuta.`);
    }
    return join(lang, `百人一首かるた対戦で、ロボット（${lv}）に${me}対${cpu}で${win ? '勝ちました！' : '負けました。'}`);
  }

  // 2人の対戦は「5対4で勝ち」、3〜4人や同点は「3人中1位」
  function online({ lang, rank, players, me, top, second, tied, msg }) {
    lang = L(lang);
    const duo = players === 2 && !tied;
    if (lang === 'en') {
      if (duo) return join(lang, rank === 1 ? `I won an online Hyakunin Isshu karuta match ${me}–${second}!` : `I lost an online Hyakunin Isshu karuta match ${me}–${top}.`);
      return join(lang, `I placed ${ordinal(rank)} of ${players} in an online Hyakunin Isshu karuta match!`);
    }
    if (duo) return join(lang, rank === 1 ? `百人一首かるたのオンライン対戦で、${me}対${second}で勝ちました！` : `百人一首かるたのオンライン対戦で、${me}対${top}で負けました。`);
    return join(lang, `百人一首かるたのオンライン対戦で、${players}人中${rank}位になりました！`);
  }

  // 競技かるたは「○枚差で勝ち」（勝負がついたとき、負けた側の陣に残っていた枚数）
  function pro({ lang, win, margin, level, cards, msg }) {
    lang = L(lang);
    const lv = LV[lang][level] || LV[lang].normal;
    if (lang === 'en') {
      const by = margin > 0 ? ` by ${margin} card${margin === 1 ? '' : 's'}` : '';
      return join(lang, win ? `I beat the Robot (${lv}, ${cards} cards)${by} in competitive karuta!` : `I lost to the Robot (${lv}, ${cards} cards)${by} in competitive karuta.`);
    }
    const by = margin > 0 ? `${margin}枚差で` : '';
    return join(lang, `競技かるた対戦ゲームで、ロボット（${lv}・${cards}枚）に${by}${win ? '勝ちました！' : '負けました。'}`);
  }

  function open(text, page = 'taisen', game = page) {
    const lang = document.documentElement.lang === 'en' || /[?&]lang=en\b/.test(location.search) ? 'en' : 'ja';
    const url = SITE + (PAGE[page] || PAGE.taisen)[lang];
    const intent = 'https://x.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
    // Google アナリティクスの「share」（おすすめイベント）。gtag の無いページ（3D版の中）では何もしない
    try { if (typeof gtag === 'function') gtag('event', 'share', { method: 'x', content_type: 'game_result', item_id: game, lang }); } catch (e) { }
    window.open(intent, '_blank', 'noopener');
  }

  // X のロゴ（公式の形）＋「シェア」
  const LOGO = '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" style="vertical-align:-0.125em;fill:currentColor">' +
    '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
  const label = (lang) => LOGO + (L(lang) === 'en' ? ' Share' : ' でシェア');

  window.KarutaShare = { robot, online, pro, open, label };
})();
