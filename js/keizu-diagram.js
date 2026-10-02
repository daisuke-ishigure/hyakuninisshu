/* --------------------------------------------
歌のページ（N.html）の相関図
天皇の略系図（js/tenno-keizu.js）と同じ見た目の SVG を、座標を指定したデータから描く。
スタイルは css/fujiwara-keizu.css を共用する。ツールチップの文面は js/keizu-tips.js（相関図用・最優先）、js/tenno-keizu-tooltips.js、js/fujiwara-keizu-tooltips.js。

SVG は node _tools/build-keizu.mjs で前もって作り、HTML に直接書き込んでおく
（JavaScript を実行しない検索エンジン・AI のクローラーにも系図が読めるように）。
ブラウザではツールチップなどを付けるだけ。データを直したのにビルドし忘れたときは、ブラウザ側で描き直す。

HTML の形：
  <div class="kd-chart" aria-label="〇〇の相関図">
    <script type="application/json">{…データ…}</script>
    <!-- #region KEIZU:START --> …ここに SVG が書き込まれる… <!-- #endregion KEIZU:END -->
  </div>

データ：
  nodes:   [{ id, n: 名前, x: 名前の左端, y: 名前の中心, k: 天皇（色字）, kan: 摂政・関白になった人物（紫字）, t: 代数, p: 歌番号,
              note: 名前の後ろの注記, sub: 名前の下の札, pre: 名前の前の赤枠の家名（西園寺・徳大寺など）, self: このページの歌人（黄色の枠）, key: ツールチップを探す名前,
              href: 歌のページ以外へのリンク先（三十六歌仙のページなど。歌番号より優先）, hrefText: そのときのツールチップのボタンの文字 }]
  couples: [{ id, top, bottom }]  … 上下に並べた夫婦を縦の「＝」で結ぶ（同じ x に置くこと）
  eqs:     [{ id, points: [[x, y], …], out: [x, y] }]  … 離れた位置の夫婦を、折れ線の「＝」で結ぶ。子への線は out から出す
  kids:    [{ from: 人物・夫婦の id か [x, y], to: [子の id], bar: 縦線の x（省略時は子の左端 − 14）, over: 交差する線の上を通す }]
  lines:   [{ points: [[x, y], …], over, dash: 点線（養子・猶子など）, label: { text, x, y } }]
           … 決まった形にならない親子の線（上から子に下ろす、養父から養子へ、など）。label は線に添える文字（「養子」など）
  boxes:   [{ text, x, y, w, h }]  … 赤い枠の囲み（「暗殺の嫌疑」など。矢印の行き先・出どころにする）
  bands:   [{ text, from, to }]  … from から to まで（同じ行に並ぶ子孫）の名前の下にまたがる札
  arrows:  [{ points: [[x, y], …], label: { text, x, y }, curve: [x, y], head: false }]  … 赤い矢印（最後の点が矢の先）
           curve を付けると、最初と最後の点を curve の点に引き寄せた曲線にする（「対立」など）。head: false で矢じりを付けない
  groups:  [{ points: [[x, y], …], label: { text, x, y } }]  … 一族などをまとめて囲む枠（点線の多角形。「中関白家」など）。label は枠に添える文字
  tooltips: 'fujiwara' … ツールチップの文面を js/fujiwara-keizu-tooltips.js から優先して探す（省略時は js/tenno-keizu-tooltips.js を優先。無い人物はもう一方から探す）
  tips:    { 名前: [見出し, 説明の行, …] }  … このページだけ文面を変えたいときのツールチップ（ふだんは js/keizu-tips.js に書いて共有する）
-------------------------------------------- */
(function (root) {
  'use strict';

  var FS = 15;          // 名前の文字サイズ（全角1文字の幅とみなす）
  var NOTE_FS = 11;     // 注記・札の文字サイズ
  var BADGE_R = 10;     // 歌番号バッジの半径
  var TNO_TOP = 25;     // 代数の札の上端（名前の中心から上へ）
  var TNO_H = 13;       // 代数の札の高さ
  var MAX_FIT = 1.5;    // 幅に合わせるときの最大の倍率

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
    var w = 0;
    d.preW = d.pre ? d.pre.length * NOTE_FS + 8 : 0;
    if (d.preW) w += d.preW + 4;
    d.nameX = w;
    w += d.n.length * FS;
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

  function pathD(points) {
    return points.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join('');
  }

  // over：線の下に背景色の太い線を敷き、先に描いた線と交差しても、この線が上を通って見えるようにする
  function edge(d, cls, over) {
    return (over ? tag('path', { d: d, class: 'kd-halo' }) : '') + tag('path', { d: d, class: cls || 'fk-edge' });
  }

  function plainText(html) {
    return html.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');
  }

  function nodeSvg(d, tips) {
    var inner = '';
    if (d.self) inner += tag('rect', { class: 'kd-self-box', x: -5, y: -14, width: d.w + 10, height: 28, rx: 3 });

    var main = '';
    // 歌人は名前とバッジをまとめて歌のページへのリンクにする（このページの歌人は除く）。href があればそちらへのリンクにする
    var href = d.self ? '' : d.href || (d.p ? '/' + d.p + '.html' : '');
    var link = !!href;
    // ホバーで名前の背景に色を付けるための四角（歌人以外も）
    main += tag('rect', { class: 'fk-hit', x: -2, y: -13, width: d.w + 4, height: 26 });
    if (d.pre) {
      main += tag('rect', { class: 'fk-pre-box', x: 0, y: -9, width: d.preW, height: 18, rx: 2 });
      main += tag('text', { class: 'fk-pre', x: d.preW / 2, y: 0.5 }, esc(d.pre));
    }
    main += tag('text', { class: 'fk-name', x: d.nameX, y: 0.5 }, esc(d.n));
    if (d.note) main += tag('text', { class: 'fk-note', x: d.noteX, y: 1 }, esc('（' + d.note + '）'));
    if (d.p) {
      main += tag('circle', { class: 'fk-badge', cx: d.badgeCx, cy: 0, r: BADGE_R });
      main += tag('text', { class: 'fk-badge-num', x: d.badgeCx, y: 0.5, style: d.p >= 100 ? 'font-size:8.5px' : '' }, esc(d.p));
    }
    inner += link
      ? tag('a', { href: href, 'aria-label': plainText(tooltipLines(d, tips)[0]) + (d.href ? '（' + (d.hrefText || 'リンク') + '）' : '（百人一首' + d.p + '番）') }, main)
      : tag('g', { class: 'fk-main' }, main);

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
      class: 'fk-node' + (d.k ? ' is-tenno' : '') + (d.kan ? ' is-kanpaku' : '') + (d.p ? ' is-poet' : '') + (d.self ? ' is-self' : ''),
      transform: 'translate(' + d.x + ',' + d.y + ')',
      'data-tip': tooltipHtml(d, tips),
      'data-p': link && !d.href ? d.p : '',
      'data-href': link && d.href ? d.href : '',
      'data-href-text': link && d.href ? d.hrefText || 'リンク' : ''
    }, inner);
  }

  // データの文字列から作る短い値。SVG に書いておき、データを直したのにビルドし忘れていないかをブラウザで確かめる
  function hash(s) {
    s = String(s).replace(/\r\n?/g, '\n').trim(); // HTML の読み込みで改行は LF になるのでそろえる
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  /* data: 相関図のデータ / tipSets: ツールチップの文面 { tenno: TK_TOOLTIPS, fujiwara: FK_TOOLTIPS, kd: KD_TIPS }
     label: SVG の aria-label / src: データの文字列（hash 用） */
  function toSvg(data, tipSets, label, src) {
    // 指定したファイル（tooltips）の文面を優先し、無い人物はもう一方のファイルからも探す（天皇と藤原氏が並ぶ系図のため）
    var main = data.tooltips || 'tenno';
    var tips = {};
    // 相関図用の共有ファイル（kd：js/keizu-tips.js）、ページごとの tips の順にさらに優先する
    Object.keys(tipSets || {}).forEach(function (k) { if (k !== main && k !== 'kd') Object.assign(tips, tipSets[k]); });
    Object.assign(tips, (tipSets || {})[main] || {}, (tipSets || {}).kd || {}, data.tips || {});
    var byId = {};
    var maxX = 0;
    var maxY = 0;
    data.nodes.forEach(function (d) {
      measure(d);
      byId[d.id] = d;
      maxX = Math.max(maxX, d.x + d.w, d.sub ? d.x + d.sub.length * NOTE_FS + 12 : 0); // 名前より長い札も切れないように
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
      // 札の上に来るときは、札とのすき間を空けずに札の上端までつなぐ（すき間があると途切れて見える）
      if (b.t) y2 = ex - 2 > b.x + tnoWidth(b.t) ? b.y - 9 : b.y - TNO_TOP;
      edges += tag('path', { d: 'M' + (ex - 2) + ' ' + y1 + 'V' + y2 + 'M' + (ex + 2) + ' ' + y1 + 'V' + y2, class: 'fk-edge fk-eq' });
      byId[c.id] = { outX: ex + 2, outY: outY };
    });

    // 離れた位置の夫婦：折れ線の「＝」（太い線の上に背景色の細い線を重ねて二重線にする）
    (data.eqs || []).forEach(function (e) {
      var d = pathD(e.points);
      edges += tag('path', { d: d, class: 'kd-eq-out' }) + tag('path', { d: d, class: 'kd-eq-in' });
      byId[e.id] = { outX: e.out[0], outY: e.out[1] };
    });

    // 親から子へ：横線を縦線（bar）まで引き、縦線で子を束ねて各子へ横線を引く
    (data.kids || []).forEach(function (k) {
      var from = Array.isArray(k.from) ? { outX: k.from[0], outY: k.from[1] } : byId[k.from];
      var fx = from.outX !== undefined ? from.outX : from.x + from.w + 3;
      var fy = from.outY !== undefined ? from.outY : from.y;
      var kids = k.to.map(function (id) { return byId[id]; });
      var barX = k.bar !== undefined ? k.bar : Math.min.apply(null, kids.map(function (c) { return c.x; })) - 14;
      var ys = kids.map(function (c) { return c.y; }).concat(fy);
      edges += edge('M' + fx + ' ' + fy + 'H' + barX, '', k.over);
      var top = Math.min.apply(null, ys);
      var bottom = Math.max.apply(null, ys);
      if (bottom > top) edges += edge('M' + barX + ' ' + top + 'V' + bottom, '', k.over);
      kids.forEach(function (c) {
        edges += edge('M' + barX + ' ' + c.y + 'H' + (c.x - 3), '', k.over);
      });
    });

    (data.lines || []).forEach(function (l) {
      edges += edge(pathD(l.points), 'fk-edge' + (l.dash ? ' is-dash' : ''), l.over);
      if (l.label) {
        edges += tag('text', { class: 'fk-adopt', x: l.label.x, y: l.label.y }, esc(l.label.text));
        maxX = Math.max(maxX, l.label.x + l.label.text.length * 5); // 中央揃えの文字（10px）が切れないよう幅に含める
      }
    });

    // 赤い矢印（護持僧として仕えた、など）
    var defs = tag('defs', {}, tag('marker', { id: 'kdArrowHead', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' },
      tag('path', { d: 'M0 0L10 5L0 10z', class: 'kd-arrow-head' })));
    var arrows = '';
    // 赤い枠の囲み（「暗殺の嫌疑」など、矢印を集める箱）
    (data.boxes || []).forEach(function (b) {
      arrows += tag('rect', { class: 'kd-box', x: b.x, y: b.y, width: b.w, height: b.h, rx: 3 });
      arrows += tag('text', { class: 'kd-box-text', x: b.x + b.w / 2, y: b.y + b.h / 2 + 0.5 }, esc(b.text));
      maxX = Math.max(maxX, b.x + b.w);
      maxY = Math.max(maxY, b.y + b.h);
    });
    (data.arrows || []).forEach(function (a) {
      var p0 = a.points[0];
      var p1 = a.points[a.points.length - 1];
      var ad = a.curve ? 'M' + p0[0] + ' ' + p0[1] + 'Q' + a.curve[0] + ' ' + a.curve[1] + ' ' + p1[0] + ' ' + p1[1] : pathD(a.points);
      var attrs = { d: ad, class: 'kd-arrow' };
      if (a.head !== false) attrs['marker-end'] = 'url(#kdArrowHead)';
      arrows += tag('path', attrs);
      a.points.forEach(function (p) { maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); });
      if (a.label) {
        arrows += tag('text', { class: 'kd-arrow-label', x: a.label.x, y: a.label.y }, esc(a.label.text));
        maxY = Math.max(maxY, a.label.y + 8);
        maxX = Math.max(maxX, a.label.x + a.label.text.length * 12); // 文字（12px）が切れないよう幅に含める
      }
    });

    // 一族などの囲み枠：線や名前より奥に描く
    var groups = '';
    (data.groups || []).forEach(function (gr) {
      groups += tag('path', { d: pathD(gr.points) + 'Z', class: 'kd-group' });
      gr.points.forEach(function (p) { maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); });
      if (gr.label) {
        groups += tag('text', { class: 'kd-group-label', x: gr.label.x, y: gr.label.y }, esc(gr.label.text));
        maxX = Math.max(maxX, gr.label.x + gr.label.text.length * 12);
      }
    });

    var nodes = data.nodes.map(function (d) { return nodeSvg(d, tips); }).join('\n');
    // band：from から to までの名前の下にまたがる札（奥州藤原氏の4代など）
    (data.bands || []).forEach(function (b) {
      var a = byId[b.from];
      var z = byId[b.to];
      var x2 = z.x + z.w;
      nodes += '\n' + tag('g', { class: 'kd-band' },
        tag('rect', { class: 'fk-sub-box', x: a.x, y: a.y + 11, width: x2 - a.x, height: 16, rx: 8 }) +
        tag('text', { class: 'fk-sub', x: (a.x + x2) / 2, y: a.y + 19.5 }, esc(b.text)));
      maxY = Math.max(maxY, a.y + 28);
    });

    var width = Math.ceil(maxX + 16);
    var height = Math.ceil(maxY + 12);
    // 最初の大きさ：枠の幅に合わせるが、本来の大きさの 150% を超えないようにする（小さい系図が大きくなりすぎないように）
    var maxW = Math.round(width * MAX_FIT);
    return tag('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 ' + width + ' ' + height,
      width: width,
      height: height,
      role: 'img',
      'aria-label': label || '相関図',
      class: 'fk-svg kd-svg',
      style: 'max-width:' + maxW + 'px;min-width:min(640px,' + maxW + 'px)',
      'data-src': src === undefined ? '' : hash(src)
    }, '\n' + (groups ? tag('g', { class: 'kd-groups' }, groups) + '\n' : '') + tag('g', { class: 'fk-edges' }, edges) + '\n' + defs + '\n' + tag('g', { class: 'kd-arrows' }, arrows) + '\n' + tag('g', {}, '\n' + nodes + '\n') + '\n');
  }

  root.KeizuDiagram = { toSvg: toSvg, hash: hash };

  /* ---------- ブラウザ：ツールチップを付ける（ビルドし忘れのときは描き直す） ---------- */
  if (typeof document === 'undefined') return;

  function enhance(box) {
    var src = box.querySelector('script[type="application/json"]');
    var svg = box.querySelector('svg');
    if (src && (!svg || svg.getAttribute('data-src') !== hash(src.textContent))) {
      if (svg) console.warn('相関図のデータが変わっています。node _tools/build-keizu.mjs を実行してください');
      var tmp = document.createElement('div');
      tmp.innerHTML = toSvg(JSON.parse(src.textContent), { tenno: window.TK_TOOLTIPS, fujiwara: window.FK_TOOLTIPS, kd: window.KD_TIPS }, box.getAttribute('aria-label'), src.textContent);
      if (svg) svg.replaceWith(tmp.firstChild);
      else box.appendChild(tmp.firstChild);
      svg = box.querySelector('svg');
    }
    if (!svg) return;

    if (window.tippy) {
      tippy(svg.querySelectorAll('[data-tip]'), {
        allowHTML: true,
        theme: 'fk',
        // 歌人のツールチップの中に歌のページへのリンクのボタンを置く（PC・スマホとも）。
        // ボタンを押せるよう、マウスがツールチップに移っても閉じないようにする。
        // 斜めに動かしても途中で消えないよう、ツールチップの周りの余白を広めにとる
        interactive: true,
        interactiveBorder: 20,
        appendTo: document.body,
        // 位置は名前の四角（.fk-hit）に合わせる。ノード全体だと、上の代数の札や下の札の分だけツールチップが離れてしまう
        onCreate: function (inst) {
          var hit = inst.reference.querySelector('.fk-hit');
          if (hit) inst.setProps({ getReferenceClientRect: function () { return hit.getBoundingClientRect(); } });
        },
        content: function (ref) {
          var html = ref.getAttribute('data-tip');
          var p = ref.getAttribute('data-p');
          var href = ref.getAttribute('data-href');
          if (p) html += '<a class="fk-tip-link" href="/' + p + '.html">' + p + '番の歌のページへ</a>';
          else if (href) html += '<a class="fk-tip-link" href="' + esc(href) + '">' + esc(ref.getAttribute('data-href-text')) + '</a>';
          return html;
        }
      });
    }
    // 歌人をクリック・タップしてもすぐには移動せず、ツールチップを開くだけにする（移動はツールチップの中のボタンから）。
    // キーボードの Enter（detail が 0）では、そのまま歌のページへ移動する
    svg.addEventListener('click', function (e) {
      if (e.detail > 0 && e.target.closest('a')) e.preventDefault();
    });

    setupZoom(box, svg);
    setupDrag(box);
  }

  /* マウスのドラッグで移動（fujiwara-keizu.html と同じ）
     横は枠内（scrollLeft）、縦はページごと動かす。タッチ操作はブラウザ標準のスワイプに任せる */
  function setupDrag(box) {
    var drag = null;
    box.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      e.preventDefault(); // 文字選択・リンクのドラッグを防ぐ
      drag = { x: e.clientX, y: e.clientY, left: box.scrollLeft, top: window.scrollY, moved: false };
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      var dy = e.clientY - drag.y;
      if (!drag.moved) {
        if (Math.abs(dx) + Math.abs(dy) < 5) return; // わずかな動きはクリック扱い
        drag.moved = true;
        box.classList.add('is-dragging');
      }
      box.scrollLeft = drag.left - dx;
      window.scrollTo(window.scrollX, drag.top - dy);
    });
    window.addEventListener('pointerup', function () {
      if (!drag) return;
      if (drag.moved) {
        box.classList.remove('is-dragging');
        // ドラッグ直後のクリックでツールチップを開かないようにする
        var block = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
        };
        box.addEventListener('click', block, true);
        // 枠の外で離したときは click が来ないので、次の操作に残さない
        setTimeout(function () { box.removeEventListener('click', block, true); }, 0);
      }
      drag = null;
    });
    box.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* 拡大・縮小（tenno-keizu.html と同じボタン）。系図の手前にある .fk-zoom を使う
     最初は「幅に合わせる」（CSS で枠の幅いっぱい。ただし SVG の style の max-width で本来の 150% まで）。
     ボタンを押したら、本来の大きさ × 倍率の幅にする */
  function setupZoom(box, svg) {
    var zoom = box.parentNode.querySelector('.fk-zoom');
    if (!zoom) return;
    var label = zoom.querySelector('.fk-zoom__label');
    var natural = parseFloat(svg.getAttribute('width')) || svg.viewBox.baseVal.width;
    var fitMax = svg.style.maxWidth;
    var fitMin = svg.style.minWidth;
    var scale = null; // null：幅に合わせる

    function current() {
      return scale === null ? svg.getBoundingClientRect().width / natural : scale;
    }
    function apply() {
      if (scale === null) {
        svg.style.width = '';
        svg.style.maxWidth = fitMax;
        svg.style.minWidth = fitMin;
      } else {
        svg.style.width = Math.round(natural * scale) + 'px';
        svg.style.maxWidth = 'none';
        svg.style.minWidth = '0';
      }
      if (label) label.textContent = Math.round(current() * 100) + '%';
    }
    function setScale(s) {
      scale = Math.min(2, Math.max(0.3, Math.round(s * 100) / 100));
      apply();
    }

    zoom.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-zoom]');
      if (!b) return;
      var z = b.getAttribute('data-zoom');
      if (z === 'in') setScale(current() + 0.1);
      else if (z === 'out') setScale(current() - 0.1);
      else if (z === 'reset') setScale(1);
      else { scale = null; apply(); }
    });
    // 幅に合わせているときは、画面の幅が変わると倍率の表示も変わる
    window.addEventListener('resize', function () { if (scale === null) apply(); });
    apply();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.kd-chart'), enhance);
})(typeof window !== 'undefined' ? window : globalThis);
