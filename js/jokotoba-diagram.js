/*
 * 序詞の図（gihou-jokotoba_en.html）
 *
 * 歌の本文・ローマ字・ラベル・序詞のハイライト・導かれる語の二重下線は HTML に書いておき、
 * このスクリプトは序詞（.jk-jo）から導かれる語（.jk-t）への矢印だけを SVG で描く。
 * 序詞は句をまたぐので .jk-jo は複数あってよい（句まるごとなら .jk-ku に、句の一部なら .jk-ja 内の span に付ける）。
 * 導かれる語も複数あってよく、矢印は最初の .jk-t を指す。
 *
 *   <figure class="jk-fig">
 *     <p class="jk-poem">
 *       <span class="jk-ku jk-jo"><span class="jk-label">Jokotoba</span><span class="jk-ja">あしびきの</span><span class="jk-ro">ashibikino</span></span>
 *       …
 *       <span class="jk-break"></span>
 *       <span class="jk-ku"><span class="jk-ja"><span class="jk-t">ながながし夜</span>を</span><span class="jk-ro">…</span></span>
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
  var DROP = 12;  // 同じ行のとき、かっこの下へ回り込む深さ
  var GAP = 6;    // 句の下端からかっこまでの間
  var TICK = 7;   // かっこの両端の立ち上がり
  var EXT = 24;   // 行をまたぐかっこが、句からはみ出して続く長さ

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

  function kuOf(el) {
    return el.closest('.jk-ku') || el;
  }

  function draw(fig) {
    var jos = Array.prototype.slice.call(fig.querySelectorAll('.jk-jo'));
    var tos = Array.prototype.slice.call(fig.querySelectorAll('.jk-t'));
    if (!jos.length || !tos.length) return;

    var svg = fig.querySelector('svg.jk-arrow');
    if (!svg) {
      // 本文の後ろに描く（折り返した句をまたぐ線は、句の背景で隠れる）
      svg = svgEl('svg', { 'class': 'jk-arrow', 'aria-hidden': 'true', focusable: 'false' });
      fig.insertBefore(svg, fig.firstChild);
    }
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var box = fig.getBoundingClientRect();
    svg.setAttribute('width', box.width);
    svg.setAttribute('height', box.height);
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);

    // 序詞を行ごとにまとめ、それぞれの下に「⊔」形のかっこを描く
    var groups = [];
    jos.forEach(function (el) {
      var r = rel(el, box), ku = rel(kuOf(el), box);
      var g = groups.filter(function (x) { return Math.abs(x.top - ku.top) < 2; })[0];
      if (!g) {
        g = { top: ku.top, left: r.left, right: r.right, bottom: ku.bottom, last: r };
        groups.push(g);
      }
      g.left = Math.min(g.left, r.left);
      g.right = Math.max(g.right, r.right);
      g.bottom = Math.max(g.bottom, ku.bottom);
      g.last = r;
    });
    // 序詞が行をまたぐときは、かっこが行末で切れて次の行頭へ続くように描く
    // （続く側の端は立ち上げず、句から少しはみ出したところまで線を伸ばす）
    groups.forEach(function (g, i) {
      g.y = g.bottom + GAP;
      var open = i > 0, cont = i < groups.length - 1;
      var x0 = open ? Math.max(0, g.left - EXT) : g.left;
      var x9 = cont ? Math.min(box.width, g.right + EXT) : g.right;
      var d = (open ? 'M' + x0 + ' ' + g.y : 'M' + x0 + ' ' + (g.y - TICK) + 'V' + g.y) +
        'H' + x9 + (cont ? '' : 'V' + (g.y - TICK));
      svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: COLOR, 'stroke-width': 1.2 }));
    });

    // 導かれる語の真上の行にある序詞のかっこ（なければ null）
    function groupAbove(t) {
      var tKu = rel(kuOf(t), box);
      var above = groups.filter(function (g) { return g.bottom <= tKu.top + 1; });
      if (!above.length) return null;
      return above.reduce(function (p, g) { return g.top > p.top ? g : p; });
    }
    function inside(g, x) {
      return g && g.left + 4 <= x && x <= g.right - 4;
    }

    // 導かれる語が複数あるときは、かっこの真下にあるものを指す（なければ最初のもの）
    var to = tos[0], g = groupAbove(to);
    tos.forEach(function (t) {
      if (inside(g, rel(to, box).cx)) return;
      var g2 = groupAbove(t);
      if (inside(g2, rel(t, box).cx)) { to = t; g = g2; }
    });

    var b = rel(to, box);
    var bKu = rel(kuOf(to), box);
    var x1, x2 = b.cx, y, tip, dir, d;
    // 序詞の終わりが導かれる語と同じ行まで来ているなら（18・88・97番）、その行のかっこから回り込む
    var lastG = groups[groups.length - 1];
    var sameRow = lastG.top >= bKu.top - 1;

    if (g && !sameRow) {
      // 導かれる語が次の行：かっこの真下にあればまっすぐ、なければかっこの端から折れて降ろす
      tip = b.top - 1;
      dir = 1;
      x1 = Math.min(Math.max(x2, g.left), g.right);
      if (x1 === x2) {
        d = 'M' + x1 + ' ' + g.y + 'V' + (tip - HEAD_H);
      } else {
        y = (g.y + bKu.top) / 2;
        d = 'M' + x1 + ' ' + g.y + 'V' + y + 'H' + x2 + 'V' + (tip - HEAD_H);
      }
    } else {
      // 同じ行：かっこから行の下へ回り込み、導かれる語を下から指す
      x1 = lastG.last.cx;
      y = Math.max(lastG.y, bKu.bottom) + DROP;
      tip = bKu.bottom + 1;
      dir = -1;
      d = 'M' + x1 + ' ' + lastG.y + 'V' + y + 'H' + x2 + 'V' + (tip + HEAD_H);
    }

    var base = tip - dir * HEAD_H;
    svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: COLOR, 'stroke-width': 1.2 }));
    svg.appendChild(svgEl('polygon', {
      points: (x2 - HEAD_W) + ',' + base + ' ' + (x2 + HEAD_W) + ',' + base + ' ' + x2 + ',' + tip,
      fill: COLOR
    }));
  }

  function init() {
    var figs = Array.prototype.slice.call(document.querySelectorAll('.jk-fig'));
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
