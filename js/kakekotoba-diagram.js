/*
 * 掛詞の図（gihou-kakekotoba_en.html）
 *
 * 歌の本文・掛詞の枠・縁語の枠・2つの意味の吹き出しは HTML に書いておき、
 * このスクリプトは「吹き出しを掛詞の下へ寄せる」ことと
 * 「掛詞から吹き出しへの線を SVG で描く」ことだけをする。
 *
 *   <figure class="kk-fig">
 *     <p class="kk-line">                      … 上の句（.kk-ku が3つ）
 *       <span class="kk-ku"><span class="kk-ja">秋の田の</span><span class="kk-ro">akinotano</span></span>
 *       <span class="kk-ku"><span class="kk-ja"><span class="kk-k" id="kk01-1">かりほ</span>の庵の</span>…</span>
 *     </p>
 *     <div class="kk-callouts">                … 上の句の掛詞の吹き出し
 *       <div class="kk-callout" data-for="kk01-1"><span class="kk-label">…</span>…</div>
 *     </div>
 *     <p class="kk-line">…</p>                 … 下の句
 *     <div class="kk-callouts">…</div>
 *   </figure>
 *
 * 句は画面幅によって折り返すので、位置は実際の表示から測り、
 * サイズ変更・フォント読み込みのたびに並べ直して描き直す。
 * 線は本文の後ろに描き、句の背景色で隠れるようにしてある（折り返した行をまたぐとき用）。
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var COLOR = '#b82343';

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

  // 吹き出しを、つながる掛詞の真下あたりまで右へずらす（はみ出さない範囲で）
  function place(fig) {
    var callouts = fig.querySelectorAll('.kk-callout');
    Array.prototype.forEach.call(callouts, function (c) { c.style.marginLeft = ''; });
    Array.prototype.forEach.call(fig.querySelectorAll('.kk-callouts'), function (row) {
      var rowBox = row.getBoundingClientRect();
      Array.prototype.forEach.call(row.querySelectorAll('.kk-callout'), function (c) {
        var anchor = document.getElementById(c.getAttribute('data-for'));
        if (!anchor) return;
        var a = anchor.getBoundingClientRect();
        var cb = c.getBoundingClientRect();
        var label = c.querySelector('.kk-label') || c;
        var lw = label.getBoundingClientRect().width;
        var shift = (a.left + a.right) / 2 - lw / 2 - cb.left;
        shift = Math.min(shift, rowBox.right - cb.right);
        if (shift > 0) c.style.marginLeft = shift + 'px';
      });
    });
  }

  function draw(fig) {
    place(fig);

    var svg = fig.querySelector('svg.kk-lines');
    if (!svg) {
      svg = svgEl('svg', { 'class': 'kk-lines', 'aria-hidden': 'true', focusable: 'false' });
      fig.insertBefore(svg, fig.firstChild);
    }
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var box = fig.getBoundingClientRect();
    svg.setAttribute('width', box.width);
    svg.setAttribute('height', box.height);
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);

    var callouts = Array.prototype.slice.call(fig.querySelectorAll('.kk-callout'));
    var boxes = callouts.map(function (c) { return rel(c, box); });

    callouts.forEach(function (c, i) {
      var anchor = document.getElementById(c.getAttribute('data-for'));
      if (!anchor) return;
      var a = rel(anchor, box);
      var ku = rel(anchor.closest('.kk-ku') || anchor, box); // ローマ字の下から線を出す
      var label = rel(c.querySelector('.kk-label') || c, box);
      var row = rel(c.parentNode, box);
      var y = (ku.bottom + row.top) / 2; // 句と吹き出しの列の間を横に走る
      // 真下へ降ろすと別の吹き出しを横切る（吹き出しが縦に積まれたとき）
      var blockers = boxes.filter(function (b, j) {
        return j !== i && b.left <= label.cx && label.cx <= b.right && b.top < label.top && b.bottom > y;
      });
      var d;
      if (blockers.length) {
        var right = Math.max.apply(null, blockers.map(function (b) { return b.right; })) + 10;
        var below = Math.max.apply(null, blockers.map(function (b) { return b.bottom; }));
        if (right <= row.right) {
          // 右に余白があれば、じゃまな吹き出しの右を回って上から入る
          var y2 = (below + boxes[i].top) / 2; // 吹き出し同士の間（ラベルより背の高い意味の列にかからない高さ）
          d = 'M' + a.cx + ' ' + a.bottom + 'V' + y + 'H' + right + 'V' + y2 + 'H' + label.cx + 'V' + label.top;
        } else {
          // 右に余白がなければ、列の左の余白を降りてラベルの左から入る
          var gx = row.left + 4;
          var my = (label.top + label.bottom) / 2;
          d = 'M' + a.cx + ' ' + a.bottom + 'V' + y + 'H' + gx + 'V' + my + 'H' + label.left;
        }
      } else if (a.cx >= label.left + 6 && a.cx <= label.right - 6) {
        // 掛詞の真下がラベルの幅に収まるなら、折らずにまっすぐ降ろす
        d = 'M' + a.cx + ' ' + a.bottom + 'V' + label.top;
      } else {
        d = 'M' + a.cx + ' ' + a.bottom + 'V' + y + 'H' + label.cx + 'V' + label.top;
      }
      svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: COLOR, 'stroke-width': 1.2 }));
    });
  }

  function init() {
    var figs = Array.prototype.slice.call(document.querySelectorAll('.kk-fig'));
    if (!figs.length) return;
    var redraw = function () { figs.forEach(draw); };
    redraw();

    if (window.ResizeObserver) {
      // 吹き出しをずらすと高さが変わることがあるので、幅が変わったときだけ描き直す
      var widths = new WeakMap();
      var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (e) {
          var w = Math.round(e.contentRect.width);
          if (widths.get(e.target) === w) return;
          widths.set(e.target, w);
          draw(e.target);
        });
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
