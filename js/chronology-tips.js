/* --------------------------------------------
歌人の生没年年表（chronology.html）
年表の歌人（バー）をクリックすると、系図のページと同じツールチップを出す。
文面は系図と同じファイルから探す：js/keizu-tips.js（相関図用）→ js/tenno-keizu-tooltips.js（天皇）→ js/fujiwara-keizu-tooltips.js（藤原氏）
同じ人物が複数のファイルにあるときは、「生没年」の行があるものを優先する（年表のページなので）。
どの系図にも出てこない歌人は、下の EXTRA（読みと歌の書き出しは js/hyakunin.json から）と、年表に書いた生没年で組み立てる。
見た目は系図と同じ（css/fujiwara-keizu.css の [data-theme~="fk"]）。

使い方：chronology.html の onDraw() で、年表（ChartWrapper）と元のデータ（DataTable）を渡す
  window.chronologyTips(projectTimechart, dataTable);
-------------------------------------------- */
(function () {
  'use strict';

  // 年表の名前（1列目）と、ツールチップを探す名前が違う人物
  var ALIAS = {
    '九条良経': '良経',
    '西園寺公経': '公経'
  };

  // どの系図にも出てこない歌人：[見出し（ルビ付き）, 歌の書き出し]
  var EXTRA = {
    '柿本人麻呂': ['<ruby>柿本人麻呂<rt>かきのもとひとまろ</rt></ruby>', 'あしびきの'],
    '山部赤人': ['<ruby>山部赤人<rt>やまべのあかひと</rt></ruby>', '田子の浦に'],
    '猿丸太夫': ['<ruby>猿丸太夫<rt>さるまるだゆう</rt></ruby>', '奥山に'],
    '阿倍仲麻呂': ['<ruby>阿倍仲麻呂<rt>あべのなかまろ</rt></ruby>', '天の原'],
    '喜撰法師': ['<ruby>喜撰法師<rt>きせんほうし</rt></ruby>', 'わが庵は'],
    '蝉丸': ['<ruby>蝉丸<rt>せみまる</rt></ruby>', 'これやこの'],
    '春道列樹': ['<ruby>春道列樹<rt>はるみちのつらき</rt></ruby>', '山川に'],
    '曽禰好忠': ['<ruby>曽禰好忠<rt>そねのよしただ</rt></ruby>', '由良のとを'],
    '良暹': ['<ruby>良暹法師<rt>りょうぜんほうし</rt></ruby>', 'さびしさに']
  };

  // 年表の名前から、ツールチップを探す名前の候補（天皇 → 「天皇」なし、〇〇院 → 「院」なし、藤原〇〇 → 〇〇）
  // 「阿倍仲麻呂」と藤原氏系図の「仲麻呂」（藤原仲麻呂）のような別人を拾わないよう、「藤原」以外の姓は外さない
  function candidates(name) {
    var list = [ALIAS[name] || name];
    if (/天皇$/.test(name)) list.push(name.replace(/天皇$/, ''));
    if (/院$/.test(name)) list.push(name.replace(/院$/, ''));
    if (/^藤原/.test(name)) list.push(name.replace(/^藤原/, ''));
    return list;
  }

  function findLines(name) {
    var sets = [window.KD_TIPS, window.TK_TOOLTIPS, window.FK_TOOLTIPS].filter(Boolean);
    var found = [];
    candidates(name).forEach(function (key) {
      sets.forEach(function (set) {
        if (set[key] && set[key].length) found.push(set[key]);
      });
    });
    var withLife = found.filter(function (t) { return t.some(function (l) { return /^生没年：/.test(l); }); })[0];
    return withLife || found[0] || null;
  }

  // 系図と同じ：「項目：本文」の行は、本文が折り返しても「：」の後ろにそろえる
  function tipLineHtml(line, cls) {
    var m = line.match(/^([^：<]{1,8}：)([\s\S]*)$/);
    var body = m ? '<span class="fk-tip-label">' + m[1] + '</span><span class="fk-tip-body">' + m[2] + '</span>' : line;
    return '<div class="fk-tip-line' + (cls ? ' ' + cls : '') + (m ? ' has-label' : '') + '">' + body + '</div>';
  }

  // name：年表の名前 / num：歌番号（無ければ null） / life：年表に書いた生没年（「生年不詳～708年頃」など）
  function tipHtml(name, num, life) {
    var lines = findLines(name);
    if (!lines && EXTRA[name]) {
      var ex = EXTRA[name];
      lines = [ex[0]];
      if (life) lines.push('生没年：' + life);
      if (num) lines.push('百人一首：' + num + '番「' + ex[1] + '…」の歌人');
    }
    if (!lines) return null;
    var body = lines.slice(1).map(function (line) {
      var m = line.match(/^<u>(.*)<\/u>$/);
      return m ? tipLineHtml(m[1], 'is-rule') : tipLineHtml(line);
    });
    if (num) body.push('<a class="fk-tip-link" href="/' + num + '.html">' + num + '番の歌のページへ</a>');
    return '<h3>' + lines[0] + '</h3>' + body.join('');
  }

  window.chronologyTips = function (chartWrapper, dataTable) {
    if (!window.tippy || !window.google) return;

    // 年表の名前ごとの歌番号と、年表に書いた生没年（ツールチップ列の「（…）」）
    var info = {};
    for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
      var name = dataTable.getValue(i, 0);
      var num = (String(dataTable.getValue(i, 1)).match(/^（(\d+)）/) || [])[1];
      var life = (String(dataTable.getValue(i, 2)).match(/（([^（）]*)）/) || [])[1];
      if (!info[name]) info[name] = {};
      if (num && !info[name].num) {
        info[name].num = +num;
        info[name].life = life;
      }
    }

    // クリックした位置にツールチップを出す（年表の 'select' イベントには位置が無いので、押した位置を覚えておく）
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
    // ページをスクロールしたら閉じる（クリックした位置から離れてしまうため）
    window.addEventListener('scroll', function () { tip.hide(); }, { passive: true });

    var busy = false;
    google.visualization.events.addListener(chartWrapper, 'select', function () {
      // 下の setSelection([]) で年表がもう一度 'select' を出すので、処理中は無視する（しないと呼び出しが無限に続く）
      if (busy) return;
      var chart = chartWrapper.getChart();
      var sel = chart.getSelection()[0];
      busy = true;
      try {
        chart.setSelection([]); // 同じ歌人をもう一度押しても開けるよう、選択を外しておく
      } finally {
        busy = false;
      }
      if (!sel || sel.row === null || sel.row === undefined) return;
      // 年表にはスライダーで絞り込んだ行だけを渡しているので、表示上の行番号から元のデータの行を引く
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
