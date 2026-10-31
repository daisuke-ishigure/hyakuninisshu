/*
 * 本歌取りの図（gihou-honkadori_en.html）
 *
 * 左に本歌、右に本歌取りした歌を一句ずつ縦に並べて HTML に書いておき、
 * このスクリプトは、本歌から取った句どうしを結ぶ線だけを SVG で描く。
 * 結ぶ句の組は figure の data-links に「左の句番号-右の句番号」をカンマ区切りで書く（句番号は 0 から）。
 * 取った語句のハイライト（.hk-kept）は HTML 側で付ける。
 *
 *   <figure class="hk-fig" data-links="0-0,2-2">
 *     <div class="hk-col hk-col--honka">
 *       <p class="hk-head">…</p>
 *       <span class="hk-ku"><span class="hk-ja"><span class="hk-kept">秋の田の</span></span><span class="hk-ro">akinotano</span></span>
 *       …（5 句）
 *     </div>
 *     <div class="hk-col hk-col--new"> … </div>
 *   </figure>
 *
 * 線は左の句の文字の右端から右の句の文字の左端へ、日本語の行の高さの中央どうしを結ぶ。
 * 句の幅は画面幅とフォントで変わるので、サイズ変更・フォント読み込みのたびに描き直す。
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var COLOR = '#c08a00';
  var PAD = 6; // 文字と線の端の間
  var DOT = 3; // 線の両端の丸の半径

  function svgEl(name, attrs) {
    var el = document.createElementNS(NS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function draw(fig) {
    var cols = fig.querySelectorAll('.hk-col');
    if (cols.length < 2) return;
    var left = cols[0].querySelectorAll('.hk-ja');
    var right = cols[1].querySelectorAll('.hk-ja');
    var links = (fig.getAttribute('data-links') || '').split(',').filter(Boolean);

    var svg = fig.querySelector('svg.hk-lines');
    if (!svg) {
      svg = svgEl('svg', { 'class': 'hk-lines', 'aria-hidden': 'true' });
      fig.insertBefore(svg, fig.firstChild); // 文字より後ろに描く
    }
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var box = fig.getBoundingClientRect();
    svg.setAttribute('width', box.width);
    svg.setAttribute('height', box.height);

    links.forEach(function (pair) {
      var p = pair.split('-');
      var a = left[+p[0]], b = right[+p[1]];
      if (!a || !b) return;
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      var x1 = ra.right - box.left + PAD;
      var y1 = (ra.top + ra.bottom) / 2 - box.top;
      var x2 = rb.left - box.left - PAD;
      var y2 = (rb.top + rb.bottom) / 2 - box.top;
      var mid = (x1 + x2) / 2;
      var d = Math.abs(y1 - y2) < 1
        ? 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2
        : 'M' + x1 + ',' + y1 + ' C' + mid + ',' + y1 + ' ' + mid + ',' + y2 + ' ' + x2 + ',' + y2;
      svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: COLOR, 'stroke-width': 1.5 }));
      svg.appendChild(svgEl('circle', { cx: x1, cy: y1, r: DOT, fill: COLOR }));
      svg.appendChild(svgEl('circle', { cx: x2, cy: y2, r: DOT, fill: COLOR }));
    });
  }

  function init() {
    var figs = Array.prototype.slice.call(document.querySelectorAll('.hk-fig'));
    if (!figs.length) return;
    var redraw = function () { figs.forEach(draw); };
    redraw();

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (e) { draw(e.target); });
      });
      figs.forEach(function (f) { ro.observe(f); });
    } else {
      window.addEventListener('resize', redraw);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
