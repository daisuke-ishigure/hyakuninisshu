/*
 * 枕詞の図（gihou-makurakotoba_en.html）
 *
 * 歌の本文・ローマ字・ラベルは HTML に書いておき、このスクリプトは
 * 枕詞（.mk-mk）から導かれる語（.mk-t）への矢印だけを SVG で描く。
 *
 *   <figure class="mk-fig">
 *     <span class="mk-label">Makurakotoba</span>
 *     <p class="mk-poem">
 *       <span class="mk-ku mk-mk"><span class="mk-ja">白妙の</span><span class="mk-ro">shirotaheno</span></span>
 *       <span class="mk-break"></span>
 *       <span class="mk-ku"><span class="mk-ja"><span class="mk-t">衣</span>ほすてふ</span><span class="mk-ro">koromohosutefu</span></span>
 *     </p>
 *   </figure>
 *
 * 句は画面幅によって折り返すので、位置は実際の表示から測り、
 * サイズ変更・フォント読み込みのたびに描き直す。
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var COLOR = '#b82343';
  var HEAD_W = 5; // 矢じりの幅の半分
  var HEAD_H = 8; // 矢じりの高さ
  var DROP = 12;  // 同じ行のとき、行の下へ回り込む深さ

  function rel(el, box) {
    var r = el.getBoundingClientRect();
    return {
      left: r.left - box.left,
      right: r.right - box.left,
      top: r.top - box.top,
      bottom: r.bottom - box.top,
      cx: (r.left + r.right) / 2 - box.left
    };
  }

  function svgEl(name, attrs) {
    var el = document.createElementNS(NS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function draw(fig) {
    var from = fig.querySelector('.mk-mk');
    var to = fig.querySelector('.mk-t');
    if (!from || !to) return;

    var svg = fig.querySelector('svg.mk-arrow');
    if (!svg) {
      svg = svgEl('svg', { 'class': 'mk-arrow', 'aria-hidden': 'true', focusable: 'false' });
      fig.appendChild(svg);
    }
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var box = fig.getBoundingClientRect();
    svg.setAttribute('width', box.width);
    svg.setAttribute('height', box.height);
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);

    var a = rel(from, box);
    var b = rel(to, box);                         // 導かれる語（句の一部）
    var ku = rel(to.closest('.mk-ku') || to, box); // それを含む句（ローマ字まで）
    var x1 = a.cx;
    var x2 = b.cx;
    var y, tip, dir;

    if (ku.top >= a.bottom - 1) {
      // 導かれる語が次の行：行の間を通って上から指す
      y = (a.bottom + ku.top) / 2;
      tip = b.top - 1;
      dir = 1;
    } else {
      // 同じ行：行の下へ回り込んで、句の下（ローマ字の下）から指す
      y = Math.max(a.bottom, ku.bottom) + DROP;
      tip = ku.bottom + 1;
      dir = -1;
    }

    var base = tip - dir * HEAD_H;
    svg.appendChild(svgEl('path', {
      d: 'M' + x1 + ' ' + a.bottom + 'V' + y + 'H' + x2 + 'V' + base,
      fill: 'none',
      stroke: COLOR,
      'stroke-width': 1.2
    }));
    svg.appendChild(svgEl('polygon', {
      points: (x2 - HEAD_W) + ',' + base + ' ' + (x2 + HEAD_W) + ',' + base + ' ' + x2 + ',' + tip,
      fill: COLOR
    }));
  }

  function init() {
    var figs = Array.prototype.slice.call(document.querySelectorAll('.mk-fig'));
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
