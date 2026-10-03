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
    // ページの HTML を読み終え、配置が落ち着いてから表示する（CSS で .is-ready が付くまでは透明）。
    // 読み込み中に画面の途中へ一瞬描かれ、上から下へ移動して見えるのを防ぐため
    var reveal = function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { bar.classList.add('is-ready'); });
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reveal);
    else reveal();

    // リンクで別のページへ移るときは、その瞬間にバーを隠す。
    // iPhone の Chrome / Safari（WebKit）は、ページの読み込みが始まるとアドレスバーとツールバーを広げ、
    // そのときの再配置の途中で、このバーの半透明の残像を画面の上から下へ描いてしまうため。
    // 同じページ内のリンク・新しいタブ・スクリプトが止めたクリックでは隠さない。
    // 戻るボタンで戻ってきたとき（bfcache）や、3秒たってもページが移らなかったときは、表示し直す
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (!/^https?:$/.test(url.protocol)) return;
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) return;
      bar.classList.remove('is-ready');
      setTimeout(function () { bar.classList.add('is-ready'); }, 3000);
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) bar.classList.add('is-ready');
    });
  }
})();

////////////////////////////////////////////////////////////
// 旧ドメインからの訪問者向け「アドレス変更」お知らせバナー（全ページ共通）
// 旧ドメイン(hyakuninisshu.sakura.ne.jp)の.htaccessが301リダイレクト時に
// 付与する #from_old_domain を検知したときだけ表示する。
// （# 以降は検索エンジンに送られないので、転送先が canonical と同じURLになる。
//   以前の ?from_old_domain=1 も、ブラウザに古い転送が残っている間のために受け付ける）
// 表示後はURLからこの目印を取り除く（履歴・共有URLを汚さないため）。
////////////////////////////////////////////////////////////
(function () {
  var params = new URLSearchParams(location.search);
  var fromHash = location.hash === '#from_old_domain';
  if (!fromHash && params.get('from_old_domain') !== '1') return;

  params.delete('from_old_domain');
  var newSearch = params.toString();
  var cleanUrl = location.pathname + (newSearch ? '?' + newSearch : '') + (fromHash ? '' : location.hash);
  if (window.history && history.replaceState) {
    history.replaceState(null, '', cleanUrl);
  }

  var isEn = document.documentElement.lang === 'en';

  // 画面全体を覆う半透明オーバーレイ＋天地中央のボックス
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;' +
    'background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:16px;';

  var bar = document.createElement('div');
  bar.setAttribute('role', 'status');
  bar.style.cssText = 'position:relative;max-width:32em;width:100%;box-sizing:border-box;' +
    'background:#f7f1e0;color:#333;padding:24px 40px;font-size:0.95rem;border-radius:8px;' +
    'line-height:1.8;text-align:left;box-shadow:0 4px 16px rgba(0,0,0,0.3);';
  overlay.appendChild(bar);

  var lines = isEn
    ? ['This site has moved to a new address: https://hyakuninisshu.com/',
       'This message is shown when you visit the old address.',
       'If you have bookmarked the old address, we would appreciate it if you could replace it with the URL currently shown. Thank you for your continued support.']
    : ['サイトのアドレスが https://hyakuninisshu.com/ に変わりました。',
       'このメッセージは旧アドレスにアクセスしていただいた場合に表示されます。',
       '旧アドレスをお気に入り登録してくださっている場合は、現在表示されているURLに置き換えていただけたら幸いです。今後ともよろしくお願いいたします。'];
  lines.forEach(function (line) {
    var p = document.createElement('p');
    p.textContent = line;
    p.style.cssText = 'margin:0;color:#333;';
    bar.appendChild(p);
  });

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', isEn ? 'Close' : '閉じる');
  closeBtn.style.cssText = 'position:absolute;right:6px;top:6px;' +
    'background:transparent;border:none;color:#333;font-size:1.4rem;cursor:pointer;line-height:1;padding:4px 8px;';
  closeBtn.addEventListener('click', close);
  bar.appendChild(closeBtn);

  // ボックスの外側（暗い部分）クリックや Esc でも閉じる
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);

  document.body.appendChild(overlay);
})();
