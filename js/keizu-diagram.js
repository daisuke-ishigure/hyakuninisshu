/* --------------------------------------------
歌のページ（N.html）の相関図
天皇の略系図（js/tenno-keizu.js）と同じ見た目の SVG を、座標を指定したデータから描く。
スタイルは css/fujiwara-keizu.css を共用する。ツールチップの文面は js/tenno-keizu-tooltips.js。

使い方：<div class="kd-chart"><script type="application/json">{…}</script></div>
  nodes:   [{ id, n: 名前, x: 名前の左端, y: 名前の中心, k: 天皇（青字）, t: 代数, p: 歌番号,
              note: 名前の後ろの注記, sub: 名前の下の札, self: このページの歌人（黄色の枠）, key: ツールチップを探す名前 }]
  couples: [{ id, top, bottom }]  … 上下に並べた夫婦を縦の「＝」で結ぶ（同じ x に置くこと）
  kids:    [{ from: 人物か夫婦の id, to: [子の id], bar: 縦線の x（省略時は子の左端 − 14） }]
  arrows:  [{ points: [[x, y], …], label: { text, x, y } }]  … 赤い矢印（最後の点が矢の先）
  tips:    { 名前: [見出し, 説明の行, …] }  … js/tenno-keizu-tooltips.js に無い人物のツールチップ
-------------------------------------------- */
(function () {
  'use strict';

  var FS = 15;          // 名前の文字サイズ（全角1文字の幅とみなす）
  var NOTE_FS = 11;     // 注記・札の文字サイズ
  var BADGE_R = 10;     // 歌番号バッジの半径
  var TNO_TOP = 25;     // 代数の札の上端（名前の中心から上へ）
  var TNO_H = 13;       // 代数の札の高さ
  var SVGNS = 'http://www.w3.org/2000/svg';
  var touchUI = window.matchMedia('(hover: none)'); // スマホなど、ホバーできない端末

  function el(name, attrs, parent) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
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

  // js/tenno-keizu.js と同じ形（見出し＋1行ずつの div）
  function tooltipHtml(d, tips) {
    var lines = tooltipLines(d, tips);
    var body = lines.slice(1).map(function (line) {
      var m = line.match(/^<u>(.*)<\/u>$/);
      return m ? '<div class="fk-tip-line is-rule">' + m[1] + '</div>' : '<div class="fk-tip-line">' + line + '</div>';
    });
    if (d.p && !d.self && touchUI.matches) {
      body.push('<a class="fk-tip-link" href="/' + d.p + '.html">' + d.p + '番の歌のページへ</a>');
    }
    return '<h3>' + lines[0] + '</h3>' + body.join('');
  }

  function drawNode(g, d, tips) {
    var cls = 'fk-node' + (d.k ? ' is-tenno' : '') + (d.p ? ' is-poet' : '') + (d.self ? ' is-self' : '');
    var node = el('g', { class: cls, transform: 'translate(' + d.x + ',' + d.y + ')' }, g);
    node.setAttribute('data-tippy-content', tooltipHtml(d, tips));

    if (d.self) el('rect', { class: 'kd-self-box', x: -5, y: -14, width: d.w + 10, height: 28, rx: 3 }, node);

    // 歌人は名前とバッジをまとめて歌のページへのリンクにする（このページの歌人は除く）
    var target = node;
    if (d.p && !d.self) {
      target = el('a', { href: '/' + d.p + '.html', 'aria-label': tooltipLines(d, tips)[0].replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '') + '（百人一首' + d.p + '番）' }, node);
      el('rect', { class: 'fk-hit', x: -2, y: -13, width: d.w + 4, height: 26 }, target);
    }
    el('text', { class: 'fk-name', x: 0, y: 0.5 }, target).textContent = d.n;
    if (d.note) el('text', { class: 'fk-note', x: d.noteX, y: 1 }, target).textContent = '（' + d.note + '）';
    if (d.p) {
      el('circle', { class: 'fk-badge', cx: d.badgeCx, cy: 0, r: BADGE_R }, target);
      el('text', { class: 'fk-badge-num', x: d.badgeCx, y: 0.5, style: d.p >= 100 ? 'font-size:8.5px' : '' }, target).textContent = d.p;
    }
    if (d.t) {
      var tw = String(d.t).length * 6.3 + 6;
      el('rect', { class: 'fk-tno-box', x: 0, y: -TNO_TOP, width: tw, height: TNO_H, rx: 1.5 }, node);
      el('text', { class: 'fk-tno', x: tw / 2, y: -TNO_TOP + TNO_H / 2 + 0.5 }, node).textContent = d.t;
    }
    if (d.sub) {
      var sw = d.sub.length * NOTE_FS + 12;
      el('rect', { class: 'fk-sub-box', x: 0, y: 11, width: sw, height: 16, rx: 8 }, node);
      el('text', { class: 'fk-sub', x: sw / 2, y: 19.5 }, node).textContent = d.sub;
    }
  }

  function render(box) {
    var src = box.querySelector('script[type="application/json"]');
    if (!src) return;
    var data = JSON.parse(src.textContent);
    var tips = Object.assign({}, window.TK_TOOLTIPS || {}, data.tips || {});

    var byId = {};
    var maxX = 0;
    var maxY = 0;
    data.nodes.forEach(function (d) {
      measure(d);
      byId[d.id] = d;
      maxX = Math.max(maxX, d.x + d.w);
      maxY = Math.max(maxY, d.y + (d.sub ? 28 : 14));
    });

    var svg = el('svg', { role: 'img', 'aria-label': box.getAttribute('aria-label') || '相関図', class: 'fk-svg kd-svg' });
    var edges = el('g', { class: 'fk-edges' }, svg);

    // 夫婦：縦の「＝」。子への線は＝の中ほどから出す
    (data.couples || []).forEach(function (c) {
      var a = byId[c.top];
      var b = byId[c.bottom];
      var ex = b.x + Math.min(a.n.length, b.n.length) * FS / 2;
      var y1 = a.y + (a.sub ? 28 : 9);
      var y2 = b.y - (b.t ? TNO_TOP + 2 : 9);
      el('path', { d: 'M' + (ex - 2) + ' ' + y1 + 'V' + y2 + 'M' + (ex + 2) + ' ' + y1 + 'V' + y2, class: 'fk-edge fk-eq' }, edges);
      byId[c.id] = { outX: ex + 2, outY: (y1 + y2) / 2 };
    });

    // 親から子へ：横線を縦線（bar）まで引き、縦線で子を束ねて各子へ横線を引く
    (data.kids || []).forEach(function (k) {
      var from = byId[k.from];
      var fx = from.outX !== undefined ? from.outX : from.x + from.w + 3;
      var fy = from.outY !== undefined ? from.outY : from.y;
      var kids = k.to.map(function (id) { return byId[id]; });
      var barX = k.bar !== undefined ? k.bar : Math.min.apply(null, kids.map(function (c) { return c.x; })) - 14;
      var ys = kids.map(function (c) { return c.y; }).concat(fy);
      el('path', { d: 'M' + fx + ' ' + fy + 'H' + barX, class: 'fk-edge' }, edges);
      var top = Math.min.apply(null, ys);
      var bottom = Math.max.apply(null, ys);
      if (bottom > top) el('path', { d: 'M' + barX + ' ' + top + 'V' + bottom, class: 'fk-edge' }, edges);
      kids.forEach(function (c) {
        el('path', { d: 'M' + barX + ' ' + c.y + 'H' + (c.x - 3), class: 'fk-edge' }, edges);
      });
    });

    // 赤い矢印（護持僧として仕えた、など）
    var defs = el('defs', {}, svg);
    var marker = el('marker', { id: 'kdArrowHead', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0 0L10 5L0 10z', class: 'kd-arrow-head' }, marker);
    var arrows = el('g', { class: 'kd-arrows' }, svg);
    (data.arrows || []).forEach(function (a) {
      var d = a.points.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join('');
      el('path', { d: d, class: 'kd-arrow', 'marker-end': 'url(#kdArrowHead)' }, arrows);
      a.points.forEach(function (p) { maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); });
      if (a.label) {
        el('text', { class: 'kd-arrow-label', x: a.label.x, y: a.label.y }, arrows).textContent = a.label.text;
        maxY = Math.max(maxY, a.label.y + 8);
      }
    });

    var nodesG = el('g', {}, svg);
    data.nodes.forEach(function (d) { drawNode(nodesG, d, tips); });

    var width = Math.ceil(maxX + 16);
    var height = Math.ceil(maxY + 12);
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    box.appendChild(svg);

    if (window.tippy) {
      var opts = { allowHTML: true, theme: 'fk' };
      if (touchUI.matches) {
        opts.interactive = true;
        opts.appendTo = document.body;
      }
      tippy(svg.querySelectorAll('[data-tippy-content]'), opts);
    }
    // スマホ：歌人をタップしてもすぐには移動せず、ツールチップを開くだけにする（移動はツールチップの中のリンクから）
    svg.addEventListener('click', function (e) {
      if (touchUI.matches && e.target.closest('a')) e.preventDefault();
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.kd-chart'), render);
})();
