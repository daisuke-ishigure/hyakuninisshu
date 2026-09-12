(function () {
  'use strict';

  /* ── ▼ Firebaseプロジェクトの設定をここに入力 ▼ ── */
  var FIREBASE_CONFIG = {
    apiKey:            "AIzaSyAEyZBFp9QCAC65nNXroQXJHe8lB3xoW3U",
    authDomain:        "word-cloud-5ff7c.firebaseapp.com",
    projectId:         "word-cloud-5ff7c",
    storageBucket:     "word-cloud-5ff7c.firebasestorage.app",
    messagingSenderId: "458438786353",
    appId:             "1:458438786353:web:5cfc01e61e746c5eda4410"
  };
  /* ── ▲ ここまで ▲ ── */

  var COOLDOWN_MS     = 24 * 60 * 60 * 1000;
  var MAX_CLOUD_WORDS = 100;

  var isEn    = document.documentElement.lang === 'en';
  var poetNum = window.KAKE_CONFIG && window.KAKE_CONFIG.pageNum;
  if (!poetNum) return;

  var _pad        = String(poetNum).padStart(2, '0');
  var DOC_ID      = _pad + (isEn ? '_en' : '');
  var STORAGE_KEY = 'wc_' + _pad;
  var DONE_KEY    = 'gk_done_' + _pad;

  var T = {
    title:       isEn ? 'How would you describe this poem in one word?' : 'この歌をひと言で表すと？',
    desc:        isEn
      ? "Once you've arranged all the phrases, you can share your impression of the poem. What is the first word or short phrase that came to mind after reading it? You may submit one entry per poem each day. Your words will be added to a word cloud, where words chosen by more people will appear larger. Up to 100 entries will be displayed. No personal information is collected, so feel free to join in!"
      : 'すべての句を並べ終えると歌の感想を投稿できます。この歌を読んで最初に浮かんだ言葉を投稿してください。\n投稿は1首につき1日1回までです。投稿された言葉はワードクラウドに集計され、最大100件まで表示されます。また、多くの人が選んだ言葉ほど大きく表示されます。個人情報は収集していませんので、お気軽にご参加ください。',
    placeholder: isEn ? 'Describe in one word…'                        : 'ひと言で表すと…',
    submit:      isEn ? 'Submit'                                        : '送信',
    ok:          isEn ? 'Thank you!'                                    : '共有ありがとうございます！',
    cooldown:    isEn ? 'Already submitted today. (Once per day.)'      : '今日はすでに送信済みです。(1日1回まで送信できます。)',
    loading:     isEn ? 'Loading…'                                      : '読み込み中…',
    noWords:     isEn ? 'Be the first to add a word!'                   : '最初の一言を投稿してみよう！',
    responses:   isEn ? 'responses'                                     : '件の回答',
    empty:       isEn ? 'Please enter a word.'                          : '言葉を入力してください。',
    notPlayed:   isEn ? 'Complete the poem game to participate.'        : '五句並べを完成させると参加できます。',
    cancel:      isEn ? 'Cancel'                                        : 'キャンセル',
  };

  /* ── DOM注入 ── */
  var sectionEl = document.createElement('div');
  sectionEl.id = 'wordcloud-section';
  sectionEl.innerHTML =
    '<h2 class="wc-title">' + T.title + '</h2>' +
    '<p class="wc-desc">' + T.desc + '</p>' +
    '<div class="wc-input-row">' +
      '<input type="text" id="wc-input" maxlength="30" placeholder="' + T.placeholder + '">' +
      '<button id="wc-submit">' + T.submit + '</button>' +
    '</div>' +
    '<p id="wc-message"></p>' +
    '<div id="wc-canvas"><p class="wc-loading">' + T.loading + '</p></div>' +
    '<p class="wc-count-badge" id="wc-count"></p>';

  var descEl = document.getElementById('kake-desc');
  if (descEl && descEl.parentNode) {
    descEl.parentNode.insertBefore(sectionEl, descEl.nextSibling);
  } else {
    var s = document.querySelector('.section');
    if (s) s.appendChild(sectionEl);
  }

  var inputEl  = document.getElementById('wc-input');
  var submitEl = document.getElementById('wc-submit');
  var msgEl    = document.getElementById('wc-message');
  var canvasEl = document.getElementById('wc-canvas');
  var countEl  = document.getElementById('wc-count');

  var isAdminMode = new URLSearchParams(location.search).has('wc-admin');

  /* ── 送信制限 ── */
  function hasSubmitted() {
    if (isAdminMode) return false;
    var ts = localStorage.getItem(STORAGE_KEY);
    return ts && (Date.now() - parseInt(ts, 10) < COOLDOWN_MS);
  }
  function markSubmitted() {
    if (!isAdminMode) localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  function hasCompleted() { return isAdminMode || !!localStorage.getItem(DONE_KEY); }

  /* ── 入力フォーム初期状態 ── */
  if (isAdminMode) {
    inputEl.disabled  = false;
    submitEl.disabled = false;
  } else if (!hasCompleted()) {
    inputEl.disabled  = true;
    submitEl.disabled = true;
    showMsg(T.notPlayed, 'info');
  } else if (hasSubmitted()) {
    inputEl.disabled  = true;
    submitEl.disabled = true;
    showMsg(T.cooldown, 'info');
  }

  /* ── 五句並べ完成イベントで入力を開放 ── */
  document.addEventListener('gk-completed', function () {
    if (!hasSubmitted()) {
      inputEl.disabled  = false;
      submitEl.disabled = false;
      showMsg('', '');
    }
  });

  /* ── カスタム確認ダイアログ ── */
  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showConfirm(word, onOk) {
    var wordEsc = escHtml(word);
    var msg = isEn
      ? 'Your submission:<br><strong>' + wordEsc + '</strong><br>Are you sure you want to post this?'
      : '投稿内容：<br><strong>' + wordEsc + '</strong><br>この内容で投稿してよいですか？';
    var overlay = document.createElement('div');
    overlay.className = 'wc-dialog-overlay';
    overlay.innerHTML =
      '<div class="wc-dialog">' +
        '<p class="wc-dialog-msg">' + msg + '</p>' +
        '<div class="wc-dialog-btns">' +
          '<button class="wc-dialog-cancel">' + T.cancel + '</button>' +
          '<button class="wc-dialog-ok">OK</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    function close() { document.body.removeChild(overlay); }
    overlay.querySelector('.wc-dialog-cancel').addEventListener('click', close);
    overlay.querySelector('.wc-dialog-ok').addEventListener('click', function () {
      close();
      onOk();
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
  }

  /* ── 送信イベント ── */
  submitEl.addEventListener('click', function () {
    var word = inputEl.value.trim();
    if (!word) { showMsg(T.empty, 'error'); return; }
    showConfirm(word, function () { handleSubmit(word); });
  });
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submitEl.click();
  });

  /* ── Firebase初期化 ── */
  if (typeof firebase === 'undefined') {
    canvasEl.innerHTML = '<p class="wc-empty">Firebase not loaded.</p>';
    return;
  }
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
  var db       = firebase.firestore();
  var wordsRef = db.collection('wordclouds').doc(DOC_ID).collection('words');

  /* ── 単語正規化（全角→半角、大文字→小文字、カタカナ→ひらがな） ── */
  function normalizeWord(word) {
    return word
      .normalize('NFKC')
      .toLowerCase();
  }

  /* ── 送信処理 ── */
  function handleSubmit(word) {
    if (hasSubmitted()) { showMsg(T.cooldown, 'info'); return; }
    inputEl.disabled  = true;
    submitEl.disabled = true;
    var normalized = normalizeWord(word);
    var docId = normalized.replace(/\//g, '_');
    wordsRef.doc(docId).set(
      { text: normalized, count: firebase.firestore.FieldValue.increment(1) },
      { merge: true }
    ).then(function () {
      markSubmitted();
      showMsg(T.ok, 'success');
      if (isAdminMode) {
        inputEl.value     = '';
        inputEl.disabled  = false;
        submitEl.disabled = false;
        inputEl.focus();
      }
    }).catch(function (err) {
      console.error('[wordcloud] submit error:', err.code, err.message);
      showMsg(isEn ? 'Failed to submit. Please try again.' : '送信に失敗しました。もう一度お試しください。', 'error');
      inputEl.disabled  = false;
      submitEl.disabled = false;
    });
  }

  function showMsg(text, type) {
    msgEl.textContent = text;
    msgEl.className   = 'wc-msg-' + type;
    clearTimeout(msgEl._t);
    if (type !== 'info') {
      msgEl._t = setTimeout(function () { msgEl.textContent = ''; }, 3000);
    }
  }

  /* ── ワードクラウド描画 ── */
  var renderPending = null;

  function renderCloud(words) {
    canvasEl.innerHTML = '';
    if (!words.length) {
      canvasEl.innerHTML = '<p class="wc-empty">' + T.noWords + '</p>';
      return;
    }

    var W = canvasEl.offsetWidth || 360;
    var H = Math.round(Math.max(240, Math.min(words.length * 14, 900)));

    var maxCount = Math.max.apply(null, words.map(function (w) { return w.count; }));

    var fontSize = d3.scaleLog()
      .domain([1, Math.max(maxCount, 2)])
      .range([12, 44])
      .clamp(true);

    var palette = ['#b82343', '#007e5e', '#c07a20', '#4a6fa5', '#7c3aed', '#0e7490'];

    d3.layout.cloud()
      .size([W, H])
      .words(words.map(function (w, i) {
        return { text: w.text, size: fontSize(w.count), count: w.count, idx: i };
      }))
      .padding(5)
      .rotate(0)
      .font('"Noto Serif JP", serif')
      .fontSize(function (d) { return d.size; })
      .on('end', function (placed) {
        var svg = d3.select(canvasEl)
          .append('svg')
            .attr('width', W)
            .attr('height', H)
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('style', 'max-width:100%;height:auto;display:block');

        svg.append('g')
          .attr('transform', 'translate(' + (W / 2) + ',' + (H / 2) + ')')
          .selectAll('text')
          .data(placed)
          .enter().append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', function (d) {
              return 'translate(' + d.x + ',' + d.y + ')rotate(' + d.rotate + ')';
            })
            .style('font-family', '"Noto Serif JP", serif')
            .style('font-weight', '700')
            .style('font-size', function (d) { return d.size + 'px'; })
            .style('fill', function (d) { return palette[d.idx % palette.length]; })
            .style('opacity', 0)
            .text(function (d) { return d.text; })
            .append('title').text(function (d) { return d.text + ': ' + d.count; });

        svg.selectAll('text').transition().duration(500).style('opacity', 1);
      })
      .start();
  }

  function tryRender(words) {
    if (typeof d3 !== 'undefined' && d3.layout && d3.layout.cloud) {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { renderCloud(words); });
      } else {
        renderCloud(words);
      }
    } else {
      clearTimeout(renderPending);
      renderPending = setTimeout(function () { tryRender(words); }, 300);
    }
  }

  /* ── Firestoreリアルタイム購読 ── */
  wordsRef
    .orderBy('count', 'desc')
    .limit(MAX_CLOUD_WORDS)
    .onSnapshot(function (snapshot) {
      var words = [];
      snapshot.forEach(function (doc) {
        var d = doc.data();
        if (d.text && d.count > 0) words.push({ text: d.text, count: d.count });
      });

      var total = words.reduce(function (s, w) { return s + w.count; }, 0);
      countEl.textContent = total > 0 ? total + ' ' + T.responses : '';

      tryRender(words);
    }, function (err) {
      console.error(err);
      canvasEl.innerHTML = '<p class="wc-empty">読み込みに失敗しました。</p>';
    });

})();
