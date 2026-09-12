(function () {
  'use strict';

  /* ── 言語判定 ── */
  var isEn = document.documentElement.lang === 'en';

  /* ── 現在ページ番号（gokunarabe pages で KAKE_CONFIG が存在する場合） ── */
  var currentNum = (window.KAKE_CONFIG && window.KAKE_CONFIG.pageNum) || null;

  /* ── テキスト ── */
  var t = {
    btn: isEn ? 'List' : '一覧',
    modalTitle: isEn ? 'Meet the Poets of Hyakunin Isshu' : '歌人に会える百人一首',
    btnFont: isEn ? 'Arial, sans-serif' : "'Noto Sans JP', sans-serif",
  };

  /* ── 歌人データ [番号, 日本語名, 英語名] ── */
  var POETS = [
    [1, '天智天皇', 'Emperor Tenji'],
    [2, '持統天皇', 'Empress Jitō'],
    [3, '柿本人麻呂', 'Kakinomoto no Hitomaro'],
    [4, '山部赤人', 'Yamabe no Akahito'],
    [5, '猿丸太夫', 'Sarumaru Dayū'],
    [6, '中納言家持', 'Middle Counselor Yakamochi'],
    [7, '阿倍仲麻呂', 'Abe no Nakamaro'],
    [8, '喜撰法師', 'Priest Kisen'],
    [9, '小野小町', 'Ono no Komachi'],
    [10, '蝉丸', 'Semimaru'],
    [11, '参議篁', 'Councillor Takamura'],
    [12, '僧正遍昭', 'High Priest Henjō'],
    [13, '陽成院', 'Retired Emperor Yōzei'],
    [14, '河原左大臣', 'Minister of the Left of Kawara'],
    [15, '光孝天皇', 'Emperor Kōkō'],
    [16, '中納言行平', 'Middle Counselor Yukihira'],
    [17, '在原業平朝臣', 'Ariwara no Narihira Ason'],
    [18, '藤原敏行朝臣', 'Fujiwara no Toshiyuki Ason'],
    [19, '伊勢', 'Ise'],
    [20, '元良親王', 'Prince Motoyoshi'],
    [21, '素性法師', 'Priest Sosei'],
    [22, '文屋康秀', "Fun'ya no Yasuhide"],
    [23, '大江千里', 'Ōe no Chisato'],
    [24, '菅家', 'Kanke'],
    [25, '三条右大臣', 'Minister of the Right of Sanjō'],
    [26, '貞信公', 'Teishin-kō'],
    [27, '中納言兼輔', 'Middle Counselor Kanesuke'],
    [28, '源宗于朝臣', 'Minamoto no Muneyuki Ason'],
    [29, '凡河内躬恒', 'Ōshikōchi no Mitsune'],
    [30, '壬生忠岑', 'Mibu no Tadamine'],
    [31, '坂上是則', 'Sakanoue no Korenori'],
    [32, '春道列樹', 'Harumichi no Tsuraki'],
    [33, '紀友則', 'Ki no Tomonori'],
    [34, '藤原興風', 'Fujiwara no Okikaze'],
    [35, '紀貫之', 'Ki no Tsurayuki'],
    [36, '清原深養父', 'Kiyohara no Fukayabu'],
    [37, '文屋朝康', "Fun'ya no Asayasu"],
    [38, '右近', "Ukon"],
    [39, '参議等', "Councillor Hitoshi"],
    [40, '平兼盛', "Taira no Kanemori"],
    [41, '壬生忠見', "Mibu no Tadami"],
    [42, '清原元輔', "Kiyohara no Motosuke"],
    [43, '権中納言敦忠', "Acting Middle Counselor Atsutada"],
    [44, '中納言朝忠', "Middle Counselor Asatada"],
    [45, '謙徳公', "Kentoku-kō"],
    [46, '曽禰好忠', "Sone no Yoshitada"],
    [47, '恵慶法師', "Priest Egyō"],
    [48, '源重之', "Minamoto no Shigeyuki"],
    [49, '大中臣能宣朝臣', "Ōnakatomi no Yoshinobu Ason"],
    [50, '藤原義孝', "Fujiwara no Yoshitaka"],
    [51, '藤原実方朝臣', "Fujiwara no Sanekata Ason"],
    [52, '藤原道信朝臣', "Fujiwara no Michinobu Ason"],
    [53, '右大将道綱母', "Mother of the Right Captain Michitsuna"],
    [54, '儀同三司母', "Mother of the Honorary Grand Minister"],
    [55, '大納言公任', "Upper Counselor Kintō"],
    [56, '和泉式部', "Izumi Shikibu"],
    [57, '紫式部', "Murasaki Shikibu"],
    [58, '大弐三位', "Daini no Sanmi"],
    [59, '赤染衛門', "Akazome Emon"],
    [60, '小式部内侍', "Koshikibu no Naishi"],
    [61, '伊勢大輔', "Ise no Taifu"],
    [62, '清少納言', "Sei Shōnagon"],
    [63, '左京大夫道雅', "Master of the Left Capital Michimasa"],
    [64, '権中納言定頼', "Acting Middle Counselor Sadayori"],
    [65, '相模', "Sagami"],
    [66, '前大僧正行尊', "Senior High Priest Gyōson"],
    [67, '周防内侍', "Suō no Naishi"],
    [68, '三条院', "Retired Emperor Sanjō"],
    [69, '能因法師', "Priest Nōin"],
    [70, '良暹法師', "Priest Ryōzen"],
    [71, '大納言経信', "Upper Counselor Tsunenobu"],
    [72, '祐子内親王家紀伊', "Kii of Princess Yūshi's Household"],
    [73, '権中納言匡房', "Acting Middle Counselor Masafusa"],
    [74, '源俊頼朝臣', "Minamoto no Toshiyori Ason"],
    [75, '藤原基俊', "Fujiwara no Mototoshi"],
    [76, '法性寺入道前関白太政大臣', "Lay Novice of Hosshō-ji Temple, former Kampaku and Chancellor of the Realm"],
    [77, '崇徳院', "Retired Emperor Sutoku"],
    [78, '源兼昌', "Minamoto no Kanemasa"],
    [79, '左京大夫顕輔', "Master of the Left Capital Akisuke"],
    [80, '待賢門院堀河', "Horikawa, attendant to Empress Taiken"],
    [81, '後徳大寺左大臣', "Later Tokudaiji Minister of the Left"],
    [82, '道因法師', "Priest Dōin"],
    [83, '皇太后宮大夫俊成', "Master of the Empress Dowager's Household Toshinari"],
    [84, '藤原清輔朝臣', "Fujiwara no Kiyosuke Ason"],
    [85, '俊恵法師', "Priest Shun'e"],
    [86, '西行法師', "Priest Saigyō"],
    [87, '寂蓮法師', "Priest Jakuren"],
    [88, '皇嘉門院別当', "Attendant to Empress Kōka"],
    [89, '式子内親王', "Princess Shikishi"],
    [90, '殷富門院大輔', "Attendant to Empress Inpu"],
    [91, '後京極摂政前太政大臣', "Gokyōgoku Regent and former Chancellor of the Realm"],
    [92, '二条院讃岐', "Sanuki, attendant to retired Emperor Nijō"],
    [93, '鎌倉右大臣', "Minister of the Right of Kamakura"],
    [94, '参議雅経', "Councillor Masatsune"],
    [95, '前大僧正慈円', "Former Senior High Priest Jien"],
    [96, '入道前太政大臣', "Lay Novice and former Chancellor of the Realm"],
    [97, '権中納言定家', "Acting Middle Counselor Sadaie"],
    [98, '従二位家隆', "Junior Second Rank Ietaka"],
    [99, '後鳥羽院', "Retired Emperor Go-Toba"],
    [100, '順徳院', "Retired Emperor Juntoku"]
  ];

  window.GK_POETS = POETS;

  /* ── 歌人リンク生成 ── */
  function poetHref(num) {
    var n = String(num).padStart(2, '0');
    return isEn ? 'gokunarabe_' + n + '_en.html' : 'gokunarabe_' + n + '.html';
  }

  var gridItems = POETS.map(function (p) {
    var num = p[0], name = isEn ? p[2] : p[1];
    var isCurrent = num === currentNum;
    return '<a class="gk-item' + (isCurrent ? ' current' : '') + '" href="' + poetHref(num) + '">'
      + '<span class="gk-num">' + num + '</span>'
      + '<span class="gk-name">' + name + '</span>'
      + '</a>';
  }).join('');

  /* ── CSS 注入 ── */
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes gk-grad-shift{',
    '  0%{background-position:0% 50%}',
    '  50%{background-position:100% 50%}',
    '  100%{background-position:0% 50%}',
    '}',
    /* sectionの右肩バッジ */
    '.section{position:relative;}',
    '#gk-h1-badge{',
    '  position:absolute;top:16px;right:16px;',
    '  writing-mode:horizontal-tb;',
    '  font-family:' + t.btnFont + ';font-size:11px;font-weight:700;',
    '  background:linear-gradient(135deg,#B82343,#e05c00,#7b1fa2,#B82343);',
    '  background-size:300% 300%;animation:gk-grad-shift 4s ease infinite;',
    '  color:#fff;border:none;border-radius:4px;',
    '  padding:4px 10px;cursor:pointer;',
    '  letter-spacing:0.06em;line-height:1.5;white-space:nowrap;',
    '  box-shadow:0 2px 6px rgba(0,0,0,0.2);',
    '}',
    '#gk-h1-badge:hover{opacity:0.88;}',
    /* モーダル */
    '#gokunarabe-overlay{',
    '  position:fixed;inset:0;z-index:960;',
    '  background:rgba(0,0,0,0.4);backdrop-filter:blur(2px);',
    '  display:flex;align-items:flex-start;justify-content:center;',
    '  overflow-y:auto;padding:20px 0;',
    '  opacity:0;visibility:hidden;transition:opacity 0.25s,visibility 0.25s;',
    '}',
    '#gokunarabe-overlay.active{opacity:1;visibility:visible;}',
    '#gokunarabe-modal{',
    '  background:#faf7f2;border-radius:12px;padding:24px 24px 20px;',
    '  width:min(520px,92vw);',
    '  box-shadow:0 20px 40px rgba(0,0,0,0.25);position:relative;',
    '  margin:auto;',
    '}',
    '#gokunarabe-modal h2{',
    '  font-family:' + t.btnFont + ';font-size:1rem;font-weight:700;color:#333;',
    '  text-align:center;margin:0 0 16px;letter-spacing:0.1em;',
    '  border-bottom:2px solid #75bba9;padding-bottom:10px;',
    '}',
    '#gokunarabe-close{',
    '  position:absolute;top:12px;right:14px;background:none;border:none;',
    '  font-size:18px;color:#888;cursor:pointer;line-height:1;padding:4px;',
    '}',
    '#gokunarabe-close:hover{color:#333;}',
    '.gk-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}',
    '@media(min-width:480px){.gk-grid{grid-template-columns:repeat(3,1fr);}}',
    '.gk-item{',
    '  display:flex;align-items:center;gap:8px;padding:8px 10px;',
    '  background:#fff;border:1px solid #97e2cf;border-radius:7px;',
    '  text-decoration:none;color:#333;',
    '  font-family:' + t.btnFont + ';font-size:13px;',
    '  transition:background 0.15s,border-color 0.15s;',
    '}',
    '.gk-item:hover{background:#e6f5f1;border-color:#007e5e;color:#005843;}',
    '.gk-item.current{',
    '  background:#ddf0ea;border-color:#007e5e;color:#005843;',
    '  font-weight:bold;pointer-events:none;',
    '}',
    '.gk-num{',
    '  flex-shrink:0;width:24px;height:24px;',
    '  background:linear-gradient(135deg,#4ade80,#16a34a);color:#fff;',
    '  border-radius:50%;display:flex;align-items:center;justify-content:center;',
    '  font-size:11px;font-weight:bold;',
    '  box-shadow:0 2px 6px rgba(22,163,74,0.45);letter-spacing:0;',
    '}',
    '.gk-name{font-size:12px;line-height:1.4;}',
  ].join('\n');
  document.head.appendChild(style);

  /* ── HTML 注入 ── */
  /* モーダルオーバーレイ */
  document.body.insertAdjacentHTML('beforeend', [
    '<div id="gokunarabe-overlay">',
    '  <div id="gokunarabe-modal">',
    '    <button id="gokunarabe-close">✕</button>',
    '    <h2>' + t.modalTitle + '</h2>',
    '    <div class="gk-grid">' + gridItems + '</div>',
    '  </div>',
    '</div>',
  ].join(''));

  /* sectionの右肩バッジ */
  var section = document.querySelector('.section');
  if (section) {
    var badgeBtn = document.createElement('button');
    badgeBtn.id = 'gk-h1-badge';
    badgeBtn.textContent = t.btn;
    section.appendChild(badgeBtn);
  }

  /* ── イベント ── */
  var btn = document.getElementById('gk-h1-badge');
  var zukanUrl = isEn ? '/kajin-zukan_en.html' : '/kajin-zukan.html';

  if (btn) btn.addEventListener('click', function () { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; });

  var overlay = document.getElementById('gokunarabe-overlay');
  var closeBtn = document.getElementById('gokunarabe-close');

  function closeModal() { overlay.classList.remove('active'); document.body.style.overflow = ''; }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
})();
