////////////////////////////////////////////////////////////
// 上に戻るボタン（全ページ共通）
// このスクリプトタグを1つ追加するだけで、ボタンのHTML生成・
// スクロールに応じた表示/非表示・クリック時のスムーズスクロールまで
// すべて自己完結する。ページ側にHTMLを書く必要はない。
// 見た目（.back-to-top）は css/style.scss / css/style.css で定義。
////////////////////////////////////////////////////////////
(function () {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'back-to-top';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Back to top' : 'ページの上に戻る');
  btn.textContent = '▲';
  document.body.appendChild(btn);

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      btn.classList.toggle('is-visible', window.scrollY > 400);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 読み込み時点ですでにスクロール済みの場合に対応

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

////////////////////////////////////////////////////////////
// スマホ用フッターナビ（全ページ共通）
// スマホ幅では、ヘッダーの「トップ / コラム / アプリ / 検索」を画面下部に固定した
// 常に見えるアプリ風タブバーへ移し替える（＋ヘッダーに無い「図鑑」を追加）。
// 言語切替(JA/EN)はフッターには入れず、ヘッダー右端に残す。
// ・ヘッダー内の該当リンクには .sp-moved を付与し、CSS 側で
//   スマホ幅のときだけ非表示にする（ヘッダーはサイト名＋JA/ENだけになる）。
// ・タブバーの HTML はこのスクリプトが生成するので、各ページの
//   HTML を編集する必要はない。見た目は css/style.(scss|css) の .sp-appbar で定義。
// ・アイコンは img/sp-nav/*.svg（現状はアタリ画像）。本番は同名ファイルで差し替え。
//   リンク先はヘッダーから取得するので和文／英文とも自動で正しい URL になる
//   （ヘッダーに無い「図鑑」だけは href を明示）。
// ・歌ページ（1〜100.html）も他ページと同じこのバーに統一。旧・歌ページ専用の
//   #bottomMenu/#bottomNav（load-bottom.js）は廃止済み。
////////////////////////////////////////////////////////////
(function () {
  if (document.getElementById('bottomNav')) return;            // 万一 #bottomNav を出すページがあれば重複させない（保険）
  if (document.body.classList.contains('no-sp-appbar')) return; // ページ側で無効化したいとき用

  var headerList = document.querySelector('.header_list');
  if (!headerList) return;

  var isEn = document.documentElement.lang === 'en';

  // keys: ヘッダー内アイコンの alt に含まれる語（小文字比較・和英どちらのヘッダーにも対応）。
  //   一致したリンクの href を流用し、ヘッダー側は .sp-moved で隠す。
  // href: ヘッダーに無い項目はここでリンク先を明示（keys は空にする）。
  // file: フッター専用アイコンのファイル名（現状はアタリ画像。本番は img/sp-nav/ の同名ファイルで差し替え）。
  var ICON_VER = '?v2'; // 画像差し替え時はここを更新するとキャッシュが更新される
  var ITEMS = [
    { keys: ['トップ', 'Top'],    file: 'top.svg',    label: isEn ? 'Top' : 'トップ' },
    { keys: [], href: isEn ? '/kajin-zukan_en.html' : '/kajin-zukan.html',
      file: 'zukan.svg',  label: isEn ? 'Poets' : '図鑑' },
    { keys: ['コラム', 'Column'], file: 'column.svg', label: isEn ? 'Columns' : 'コラム' },
    { keys: ['アプリ', 'App'],    file: 'app.svg',    label: isEn ? 'Apps' : 'アプリ' },
    { keys: ['検索', 'Search'],   file: 'search.svg', label: isEn ? 'List' : '一覧' }
  ];

  // フッターアイコンのベースURLは、既存ヘッダーアイコンの src と同じ "img/" 接頭辞に合わせる
  // （ヘッダーのアイコンが読めている環境なら、同じ規則でフッターのアイコンも読める）
  var iconBase = '/img/sp-nav/';
  var refImg = headerList.querySelector('img[src*="img/"]');
  if (refImg) {
    var m = (refImg.getAttribute('src') || '').match(/^(.*?img\/)/);
    if (m) iconBase = m[1] + 'sp-nav/';
  }

  function normPath(p) {
    return p.replace(/\/(?:index(?:_en)?\.html)?$/, '/');
  }
  var herePath = normPath(location.pathname);

  var bar = document.createElement('nav');
  bar.className = 'sp-appbar';
  bar.setAttribute('aria-label', isEn ? 'Site menu' : 'サイト内メニュー');

  var anchors = headerList.querySelectorAll('a');

  ITEMS.forEach(function (item) {
    var href = item.href || null; // 明示 href（ヘッダーに無い項目）があればそれを使う

    if (item.keys && item.keys.length) {
      for (var i = 0; i < anchors.length; i++) {
        var img = anchors[i].querySelector('img');
        if (!img) continue;
        var alt = (img.getAttribute('alt') || '').toLowerCase(); // ページによって大小表記が揺れるため小文字で比較
        var hit = item.keys.some(function (k) { return alt.indexOf(k.toLowerCase()) !== -1; });
        if (hit) {
          if (!href) href = anchors[i].getAttribute('href'); // リンク先はヘッダーから取得（言語別 URL に自動対応）
          anchors[i].classList.add('sp-moved');              // ヘッダー側は（スマホ幅で）隠す
          break;
        }
      }
    }
    if (!href) return;

    var a = document.createElement('a');
    a.className = 'sp-appbar__item';
    a.href = href;

    var icon = document.createElement('img');
    icon.className = 'sp-appbar__icon';
    icon.src = iconBase + item.file + ICON_VER;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('loading', 'lazy');

    var span = document.createElement('span');
    span.className = 'sp-appbar__label';
    span.textContent = item.label;

    a.appendChild(icon);
    a.appendChild(span);

    if (normPath(a.pathname) === herePath) {
      a.classList.add('is-current');
      a.setAttribute('aria-current', 'page');
    }

    bar.appendChild(a);
  });

  if (bar.children.length) {
    document.body.appendChild(bar);
    document.body.classList.add('has-sp-appbar');
  }
})();
