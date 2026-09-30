/* --------------------------------------------
歌のページ（N.html）の相関図
天皇の略系図（js/tenno-keizu.js）と同じ見た目の SVG を、座標を指定したデータから描く。
スタイルは css/fujiwara-keizu.css を共用する。ツールチップの文面は js/tenno-keizu-tooltips.js。

SVG は node _tools/build-keizu.mjs で前もって作り、HTML に直接書き込んでおく
（JavaScript を実行しない検索エンジン・AI のクローラーにも系図が読めるように）。
ブラウザではツールチップなどを付けるだけ。データを直したのにビルドし忘れたときは、ブラウザ側で描き直す。

HTML の形：
  <div class="kd-chart" aria-label="〇〇の相関図">
    <script type="application/json">{…データ…}</script>
    <!-- KEIZU:START --> …ここに SVG が書き込まれる… <!-- KEIZU:END -->
  </div>

データ：
  nodes:   [{ id, n: 名前, x: 名前の左端, y: 名前の中心, k: 天皇（色字）, t: 代数, p: 歌番号,
              note: 名前の後ろの注記, sub: 名前の下の札, self: このページの歌人（黄色の枠）, key: ツールチップを探す名前 }]
  couples: [{ id, top, bottom }]  … 上下に並べた夫婦を縦の「＝」で結ぶ（同じ x に置くこと）
  kids:    [{ from: 人物か夫婦の id, to: [子の id], bar: 縦線の x（省略時は子の左端 − 14） }]
  arrows:  [{ points: [[x, y], …], label: { text, x, y } }]  … 赤い矢印（最後の点が矢の先）
  tips:    { 名前: [見出し, 説明の行, …] }  … js/tenno-keizu-tooltips.js に無い人物のツールチップ
-------------------------------------------- */
(function (root) {
  'use strict';

  var FS = 15;          // 名前の文字サイズ（全角1文字の幅とみなす）
  var NOTE_FS = 11;     // 注記・札の文字サイズ
  var BADGE_R = 10;     // 歌番号バッジの半径
  var TNO_TOP = 25;     // 代数の札の上端（名前の中心から上へ）
  var TNO_H = 13;       // 代数の札の高さ

  /* ---------- SVG の文字列を作る（ブラウザと _tools/build-keizu.mjs で共用） ---------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // <name attrs>…</name>。body が無ければ空要素
  function tag(name, attrs, body) {
    var a = '';
    for (var k in attrs) {
      if (attrs[k] === '' || attrs[k] === undefined || attrs[k] === null) continue;
      a += ' ' + k + '="' + esc(attrs[k]) + '"';
    }
    return '<' + name + a + (body === undefined ? '/>' : '>' + body + '</' + name + '>');
  }

  function tnoWidth(t) {
    return String(t).length * 6.3 + 6;
  }

  function measure(d) {
    var w = d.n.length * FS;
    if (d.note) { d.noteX = w + 2; w += (d.note.length + 2) * NOTE_FS + 2; }
    if (d.p) { d.badgeCx = w + 4 + BADGE_R; w += 4 + BADGE_R * 2; }
    d.w = w;
  }

  function tooltipLines(d, tips) {
    var t = tips[d.key || d.n];
    if (t && t.length) return t;
    var lines = [d.k ? d.n + '天皇' : d.n];
    if (d.t) lines.push('第' + d.t + '代天皇');
    if (d.p) lines.push('百人一首' + d.p + '番の歌人');
    return lines;
  }

  // js/tenno-keizu.js と同じ形（見出し＋1行ずつの div）。スマホ用の歌のページへのリンクはブラウザで足す
  function tooltipHtml(d, tips) {
    var lines = tooltipLines(d, tips);
    var body = lines.slice(1).map(function (line) {
      var m = line.match(/^<u>(.*)<\/u>$/);
      return m ? '<div class="fk-tip-line is-rule">' + m[1] + '</div>' : '<div class="fk-tip-line">' + line + '</div>';
    });
    return '<h3>' + lines[0] + '</h3>' + body.join('');
  }

  function plainText(html) {
    return html.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');
  }

  function nodeSvg(d, tips) {
    var inner = '';
    if (d.self) inner += tag('rect', { class: 'kd-self-box', x: -5, y: -14, width: d.w + 10, height: 28, rx: 3 });

    var main = '';
    // 歌人は名前とバッジをまとめて歌のページへのリンクにする（このページの歌人は除く）
    var link = d.p && !d.self;
    if (link) main += tag('rect', { class: 'fk-hit', x: -2, y: -13, width: d.w + 4, height: 26 });
    main += tag('text', { class: 'fk-name', x: 0, y: 0.5 }, esc(d.n));
    if (d.note) main += tag('text', { class: 'fk-note', x: d.noteX, y: 1 }, esc('（' + d.note + '）'));
    if (d.p) {
      main += tag('circle', { class: 'fk-badge', cx: d.badgeCx, cy: 0, r: BADGE_R });
      main += tag('text', { class: 'fk-badge-num', x: d.badgeCx, y: 0.5, style: d.p >= 100 ? 'font-size:8.5px' : '' }, esc(d.p));
    }
    inner += link
      ? tag('a', { href: '/' + d.p + '.html', 'aria-label': plainText(tooltipLines(d, tips)[0]) + '（百人一首' + d.p + '番）' }, main)
      : main;

    if (d.t) {
      var tw = tnoWidth(d.t);
      inner += tag('rect', { class: 'fk-tno-box', x: 0, y: -TNO_TOP, width: tw, height: TNO_H, rx: 1.5 });
      inner += tag('text', { class: 'fk-tno', x: tw / 2, y: -TNO_TOP + TNO_H / 2 + 0.5 }, esc(d.t));
    }
    if (d.sub) {
      var sw = d.sub.length * NOTE_FS + 12;
      inner += tag('rect', { class: 'fk-sub-box', x: 0, y: 11, width: sw, height: 16, rx: 8 });
      inner += tag('text', { class: 'fk-sub', x: sw / 2, y: 19.5 }, esc(d.sub));
    }
    return tag('g', {
      class: 'fk-node' + (d.k ? ' is-tenno' : '') + (d.p ? ' is-poet' : '') + (d.self ? ' is-self' : ''),
      transform: 'translate(' + d.x + ',' + d.y + ')',
      'data-tip': tooltipHtml(d, tips),
      'data-p': link ? d.p : ''
    }, inner);
  }

  // データの文字列から作る短い値。SVG に書いておき、データを直したのにビルドし忘れていないかをブラウザで確かめる
  function hash(s) {
    s = String(s).replace(/\r\n?/g, '\n').trim(); // HTML の読み込みで改行は LF になるのでそろえる
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  /* data: 相関図のデータ / tips: ツールチップの文面（TK_TOOLTIPS）/ label: SVG の aria-label / src: データの文字列（hash 用） */
  function toSvg(data, tips, label, src) {
    tips = Object.assign({}, tips || {}, data.tips || {});
    var byId = {};
    var maxX = 0;
    var maxY = 0;
    data.nodes.forEach(function (d) {
      measure(d);
      byId[d.id] = d;
      maxX = Math.max(maxX, d.x + d.w);
      maxY = Math.max(maxY, d.y + (d.sub ? 28 : 14));
    });

    var edges = '';
    // 夫婦：縦の「＝」。子への線は＝の中ほどから出す
    (data.couples || []).forEach(function (c) {
      var a = byId[c.top];
      var b = byId[c.bottom];
      var ex = b.x + Math.min(a.n.length, b.n.length) * FS / 2;
      var y1 = a.y + (a.sub ? 28 : 9);
      var y2 = b.y - (b.t ? TNO_TOP + 2 : 9);
      // 子への線を出す高さ（＝の中ほど）。代数の札の上端までの＝で決める
      var outY = (y1 + y2) / 2;
      // ＝が代数の札より右を通るとき（後朱雀など3文字の天皇）は、札で止めずに名前の上まで伸ばす
      if (b.t && ex - 2 > b.x + tnoWidth(b.t)) y2 = b.y - 9;
      edges += tag('path', { d: 'M' + (ex - 2) + ' ' + y1 + 'V' + y2 + 'M' + (ex + 2) + ' ' + y1 + 'V' + y2, class: 'fk-edge fk-eq' });
      byId[c.id] = { outX: ex + 2, outY: outY };
    });

    // 親から子へ：横線を縦線（bar）まで引き、縦線で子を束ねて各子へ横線を引く
    (data.kids || []).forEach(function (k) {
      var from = byId[k.from];
      var fx = from.outX !== undefined ? from.outX : from.x + from.w + 3;
      var fy = from.outY !== undefined ? from.outY : from.y;
      var kids = k.to.map(function (id) { return byId[id]; });
      var barX = k.bar !== undefined ? k.bar : Math.min.apply(null, kids.map(function (c) { return c.x; })) - 14;
      var ys = kids.map(function (c) { return c.y; }).concat(fy);
      edges += tag('path', { d: 'M' + fx + ' ' + fy + 'H' + barX, class: 'fk-edge' });
      var top = Math.min.apply(null, ys);
      var bottom = Math.max.apply(null, ys);
      if (bottom > top) edges += tag('path', { d: 'M' + barX + ' ' + top + 'V' + bottom, class: 'fk-edge' });
      kids.forEach(function (c) {
        edges += tag('path', { d: 'M' + barX + ' ' + c.y + 'H' + (c.x - 3), class: 'fk-edge' });
      });
    });

    // 赤い矢印（護持僧として仕えた、など）
    var defs = tag('defs', {}, tag('marker', { id: 'kdArrowHead', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' },
      tag('path', { d: 'M0 0L10 5L0 10z', class: 'kd-arrow-head' })));
    var arrows = '';
    (data.arrows || []).forEach(function (a) {
      var d = a.points.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join('');
      arrows += tag('path', { d: d, class: 'kd-arrow', 'marker-end': 'url(#kdArrowHead)' });
      a.points.forEach(function (p) { maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); });
      if (a.label) {
        arrows += tag('text', { class: 'kd-arrow-label', x: a.label.x, y: a.label.y }, esc(a.label.text));
        maxY = Math.max(maxY, a.label.y + 8);
      }
    });

    var nodes = data.nodes.map(function (d) { return nodeSvg(d, tips); }).join('\n');

    var width = Math.ceil(maxX + 16);
    var height = Math.ceil(maxY + 12);
    return tag('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 ' + width + ' ' + height,
      width: width,
      height: height,
      role: 'img',
      'aria-label': label || '相関図',
      class: 'fk-svg kd-svg',
      'data-src': src === undefined ? '' : hash(src)
    }, '\n' + tag('g', { class: 'fk-edges' }, edges) + '\n' + defs + '\n' + tag('g', { class: 'kd-arrows' }, arrows) + '\n' + tag('g', {}, '\n' + nodes + '\n') + '\n');
  }

  root.KeizuDiagram = { toSvg: toSvg, hash: hash };

  /* ---------- ブラウザ：ツールチップを付ける（ビルドし忘れのときは描き直す） ---------- */
  if (typeof document === 'undefined') return;
  var touchUI = window.matchMedia('(hover: none)'); // スマホなど、ホバーできない端末

  function enhance(box) {
    var src = box.querySelector('script[type="application/json"]');
    var svg = box.querySelector('svg');
    if (src && (!svg || svg.getAttribute('data-src') !== hash(src.textContent))) {
      if (svg) console.warn('相関図のデータが変わっています。node _tools/build-keizu.mjs を実行してください');
      var tmp = document.createElement('div');
      tmp.innerHTML = toSvg(JSON.parse(src.textContent), window.TK_TOOLTIPS, box.getAttribute('aria-label'), src.textContent);
      if (svg) svg.replaceWith(tmp.firstChild);
      else box.appendChild(tmp.firstChild);
      svg = box.querySelector('svg');
    }
    if (!svg) return;

    if (window.tippy) {
      var opts = {
        allowHTML: true,
        theme: 'fk',
        // スマホなど（ホバーできない端末）では、歌人のツールチップの中に歌のページへのリンクを置く
        content: function (ref) {
          var html = ref.getAttribute('data-tip');
          var p = ref.getAttribute('data-p');
          if (p && touchUI.matches) html += '<a class="fk-tip-link" href="/' + p + '.html">' + p + '番の歌のページへ</a>';
          return html;
        }
      };
      if (touchUI.matches) {
        opts.interactive = true;
        opts.appendTo = document.body;
      }
      tippy(svg.querySelectorAll('[data-tip]'), opts);
    }
    // スマホ：歌人をタップしてもすぐには移動せず、ツールチップを開くだけにする（移動はツールチップの中のリンクから）
    svg.addEventListener('click', function (e) {
      if (touchUI.matches && e.target.closest('a')) e.preventDefault();
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.kd-chart'), enhance);
})(typeof window !== 'undefined' ? window : globalThis);
