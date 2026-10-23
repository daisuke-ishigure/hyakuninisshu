/* --------------------------------------------
English version of js/chronology-tips.js (chronology_en.html).
Clicking a poet's bar shows the same tooltip as on the English family trees.
The first column of the timeline data keeps the Japanese name, which is used to look up the English text:
js/keizu-tips_en.js (KD_TIPS_EN, poem-page charts) → js/tenno-keizu_en.js (TK_EN.tips, emperors) → js/fujiwara-keizu_en.js (FK_EN.tips, Fujiwara clan).
When a person appears in several files, the one with a "Lived:" line is used (this is a timeline page).
Poets who appear in none of the family trees are built from EXTRA below and the lifespan written in the timeline.

Usage: in onDraw() of chronology_en.html, pass the chart (ChartWrapper) and the data (DataTable)
  window.chronologyTipsEn(projectTimechart, dataTable);
-------------------------------------------- */
(function () {
  'use strict';

  // Japanese timeline names that are looked up under a different name
  var ALIAS = {
    '九条良経': '良経',
    '西園寺公経': '公経',
    '藤原賢子': '賢子' // Daini no Sanmi (KD_TIPS_EN '藤原賢子' is Emperor Shirakawa's empress)
  };

  // Poets in none of the family trees: [heading, first words of the poem (romaji)]
  var EXTRA = {
    '柿本人麻呂': ['Kakinomoto no Hitomaro', 'Ashibiki no'],
    '山部赤人': ['Yamabe no Akahito', 'Tago no ura ni'],
    '猿丸太夫': ['Sarumaru Dayū', 'Okuyama ni'],
    '安倍仲麻呂': ['Abe no Nakamaro', 'Ama no hara'],
    '喜撰法師': ['Priest Kisen', 'Waga io wa'],
    '蝉丸': ['Semimaru', 'Kore ya kono'],
    '春道列樹': ['Harumichi no Tsuraki', 'Yamagawa ni'],
    '曾禰好忠': ['Sone no Yoshitada', 'Yura no to o'],
    '良暹': ['Priest Ryōzen', 'Sabishisa ni']
  };

  // Japanese name → candidate keys (天皇 / 院 dropped, 藤原〇〇 → 〇〇), same as js/chronology-tips.js
  function candidates(name) {
    var list = [ALIAS[name] || name];
    if (/天皇$/.test(name)) list.push(name.replace(/天皇$/, ''));
    if (/院$/.test(name)) list.push(name.replace(/院$/, ''));
    if (/^藤原/.test(name)) list.push(name.replace(/^藤原/, ''));
    return list;
  }

  function findLines(name) {
    var found = [];
    candidates(name).forEach(function (key) {
      var kd = window.KD_TIPS_EN && window.KD_TIPS_EN[key];
      if (kd && kd.tip && kd.tip.length) found.push(kd.tip);
      var tk = window.TK_EN && window.TK_EN.tips && window.TK_EN.tips[key];
      if (tk && tk.length) found.push(tk);
      var fk = window.FK_EN && window.FK_EN.tips && window.FK_EN.tips[key];
      if (fk && fk.length) found.push(fk);
    });
    var withLife = found.filter(function (t) { return t.some(function (l) { return /^Lived:/.test(l); }); })[0];
    return withLife || found[0] || null;
  }

  // Same as the family trees: "Label: text" lines keep the text aligned after the colon
  function tipLineHtml(line, cls) {
    var m = line.match(/^([A-Z][^:<]{0,20}:\s)([\s\S]*)$/);
    var body = m ? '<span class="fk-tip-label">' + m[1] + '</span><span class="fk-tip-body">' + m[2] + '</span>' : line;
    return '<div class="fk-tip-line' + (cls ? ' ' + cls : '') + (m ? ' has-label' : '') + '">' + body + '</div>';
  }

  // name: Japanese name in the timeline / num: poem number (or null) / life: lifespan written in the timeline ("Unknown–c. 708" etc.)
  function tipHtml(name, num, life) {
    var lines = findLines(name);
    var lifeLine = life ? 'Lived: ' + life : null;
    if (!lines && EXTRA[name]) {
      var ex = EXTRA[name];
      lines = [ex[0]];
      if (lifeLine) lines.push(lifeLine);
      if (num) lines.push('Hyakunin Isshu: Poet of Poem ' + num + ', "' + ex[1] + '..."');
    }
    if (!lines) return null;
    // add the lifespan from the timeline right after the heading when the family-tree text has none
    if (lifeLine && !lines.some(function (l) { return /^Lived:/.test(l); })) {
      lines = [lines[0], lifeLine].concat(lines.slice(1));
    }
    var body = lines.slice(1).map(function (line) {
      var m = line.match(/^<u>(.*)<\/u>$/);
      return m ? tipLineHtml(m[1], 'is-rule') : tipLineHtml(line);
    });
    if (num) body.push('<a class="fk-tip-link" href="/' + num + '_en.html">Go to Poem ' + num + '</a>');
    return '<h3>' + lines[0] + '</h3>' + body.join('');
  }

  window.chronologyTipsEn = function (chartWrapper, dataTable) {
    if (!window.tippy || !window.google) return;

    // poem number and lifespan (the "(…)" in the tooltip column) for each name
    var info = {};
    for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
      var name = dataTable.getValue(i, 0);
      var num = (String(dataTable.getValue(i, 1)).match(/^\((\d+)\)/) || [])[1];
      var life = (String(dataTable.getValue(i, 2)).match(/<br>\(([^()]*)\)/) || [])[1];
      if (!info[name]) info[name] = {};
      if (num && !info[name].num) {
        info[name].num = +num;
        info[name].life = life;
      }
    }

    // show the tooltip where the bar was clicked (the timeline's 'select' event has no position)
    var point = { x: 0, y: 0 };
    var container = document.getElementById(chartWrapper.getContainerId());
    container.addEventListener('pointerdown', function (e) { point = { x: e.clientX, y: e.clientY }; }, true);

    var anchor = document.createElement('span');
    anchor.style.cssText = 'position:fixed;width:0;height:0;';
    document.body.appendChild(anchor);
    var tip = tippy(anchor, {
      allowHTML: true,
      theme: 'fk',
      trigger: 'manual',
      interactive: true,
      interactiveBorder: 20,
      appendTo: document.body,
      placement: 'top',
      getReferenceClientRect: function () {
        return { width: 0, height: 0, top: point.y, bottom: point.y, left: point.x, right: point.x, x: point.x, y: point.y };
      }
    });
    // close when the page scrolls (it would drift away from the clicked point)
    window.addEventListener('scroll', function () { tip.hide(); }, { passive: true });

    var busy = false;
    google.visualization.events.addListener(chartWrapper, 'select', function () {
      // setSelection([]) below fires 'select' again, so ignore it while busy (otherwise it loops forever)
      if (busy) return;
      var chart = chartWrapper.getChart();
      var sel = chart.getSelection()[0];
      busy = true;
      try {
        chart.setSelection([]); // clear the selection so the same poet can be clicked again
      } finally {
        busy = false;
      }
      if (!sel || sel.row === null || sel.row === undefined) return;
      // the chart only gets the rows within the slider range, so map the shown row to the data row
      var view = chartWrapper.getView();
      var row = view && view.rows ? view.rows[sel.row] : sel.row;
      var name = dataTable.getValue(row, 0);
      var meta = info[name] || {};
      var html = tipHtml(name, meta.num, meta.life);
      if (!html) return;
      tip.setContent(html);
      tip.show();
    });
  };
})();
