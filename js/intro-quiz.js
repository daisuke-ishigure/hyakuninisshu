/**
 * 百人一首 歌人サイコロクイズ
 * ・五句をすべて縦書き・平仮名で表示し、各文字をフリップクロード風のコマに見立てる
 * ・コマの表側は常に真っ白（伏せ札）で、裏側にあらかじめ文字が書かれている
 * ・1秒おきに、いずれかのコマが1つパタンとめくれて裏の文字が現れる
 * ・出題モードは「上の句モード／下の句モード／決まり字モード／ランダムモード」の4種類：
 *     上の句モード…上の句（五・七・五）を優先してめくる
 *     下の句モード…下の句（七・七）を優先してめくる
 *     決まり字モード…決まり字（その歌だと特定できる最初の文字列）を優先してめくる
 *     ランダムモード…歌全体からばらばらの順でめくる
 * ・全3問、正解時に何文字目だったかを記録し、その平均の少なさを競う（ポイント制なし）
 * ・スタート前は文字を一切表示しない。五・七・五・七・七＝31個の白いコマを静止した状態で並べるだけで、
 *   アニメーションは行わない。スタートボタンを押すと、選択中の出題モードに沿ってめくり始める
 */
(function () {
  'use strict';

  // 歌を五句・5行ぶんの文字列配列にする（すべて平仮名の読み札表記）
  function poemLines(poem) {
    return poem.yomihuda.split('<br>');
  }

  const BOARD_LINE_LENGTHS = [5, 7, 5, 7, 7]; // 五・七・五・七・七。スタート前の白紙盤面のコマ数（1行目5個・2行目7個…）に使う
  function buildBlankLines() {
    return BOARD_LINE_LENGTHS.map(len => ' '.repeat(len)); // 中身はダミー（スペース）。スタート前は絶対にめくらないので文字は使われない
  }

  const KAMI_KU_LINE_COUNT = 3; // 上の句（五・七・五）＝先頭3行。残り2行（七・七）が下の句

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const REVEAL_INTERVAL_MS = 1000;
  const CHOICE_COUNT = 3;
  const QUESTION_COUNT = 3;

  let allPoems = [];
  const state = {
    mode: 'attract', // 'attract'（スタート前の静止した白紙盤面）| 'quiz'
    revealMode: null, // 'kami' | 'shimo' | 'kimariji' | 'random'（出題モード）。初期状態はいずれも未選択
    questions: [],
    index: 0,
    questionResults: [], // 全3問ぶんの結果（正誤を問わず）。結果画面の内訳表示・平均文字数の算出に使う：{ revealedAtAnswer, total, isCorrect }
    correctCount: 0,
    current: null,
    dieEls: [],
    total: 0,
    revealedCount: 0,
    revealQueue: [],
    revealTimer: null,
    revealAllTimeoutIds: [], // revealAllRemaining()が仕掛けた「残りを一気にめくる」setTimeout群。
                              // 次のサイクル開始時に必ず全部キャンセルする（下記startRevealCycle参照）
    answered: false,
    questionStartTime: 0,
    timerRAF: null,
  };
  /* ── データ読み込み ── */
  fetch('js/hyakunin.json?01')
    .then(r => r.json())
    .then(data => {
      allPoems = Object.values(data).filter(p => p.yomihuda && p.name);
      initApp();
    })
    .catch(err => {
      console.error('hyakunin.json の読み込みに失敗しました', err);
      const wrap = document.getElementById('dq-poem-wrap');
      if (wrap) wrap.insertAdjacentHTML('beforebegin', '<p style="color:#B82343;font-weight:700;text-align:center;">データの読み込みに失敗しました。ページを再読み込みしてください。</p>');
    });

  /* ── 初期化 ── */
  function initApp() {
    document.getElementById('dq-next-btn').addEventListener('click', () => {
      if (!state.answered) return;
      document.getElementById('dq-next-btn').classList.add('dq-hidden');
      advance();
    });
    document.getElementById('dq-retry-btn').addEventListener('click', () => {
      document.getElementById('dq-result-screen').classList.add('dq-hidden');
      document.getElementById('dq-game-screen').classList.remove('dq-hidden');
      enterAttractMode();
    });

    bindModeSelect();
    updateModeDesc();
    enterAttractMode();

    // 画面回転・ウィンドウ幅変更で列数が変わることがあるため、選択肢の「1行に収まるか」
    // 判定も追随させる（クイズ表示中でなくても無害なので、常時バインドしてよい）
    let choicesResizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(choicesResizeTimer);
      choicesResizeTimer = setTimeout(adjustWideChoices, 150);
    });
  }

  /* ── 出題モード切替（上の句／下の句／決まり字／ランダム）
     スタート前の盤面は静止しているだけなので見た目への影響はなく、次にめくり始める問題（スタート直後の1問目、
     または次の問題）から反映される ── */
  const MODE_DESCRIPTIONS = {
    kami: '上の句（五・七・五）から先に表示されます。',
    shimo: '下の句（七・七）から先に表示されます。',
    kimariji: '決まり字（その歌だと特定できる最初の文字列）を1文字目から順に表示され、その後下の句→上の句の残りの順に表示されます。',
    random: '歌全体からばらばらの順に表示されます。',
  };
  function updateModeDesc() {
    const descEl = document.getElementById('dq-mode-desc');
    descEl.classList.remove('dq-mode-desc-error');
    const desc = MODE_DESCRIPTIONS[state.revealMode];
    // モード未選択（初期状態）のときは空のままにし、「モードの説明：」だけが浮かないようにする
    descEl.textContent = desc ? ('モードの説明：' + desc) : '';
  }
  function showModeRequiredWarning() {
    const descEl = document.getElementById('dq-mode-desc');
    descEl.classList.add('dq-mode-desc-error');
    descEl.textContent = 'いずれかのモードを選択してください。';
  }
  function bindModeSelect() {
    document.querySelectorAll('.dq-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.revealMode = btn.dataset.mode;
        document.querySelectorAll('.dq-mode-btn').forEach(b => b.classList.toggle('dq-mode-active', b === btn));
        updateModeDesc();
      });
    });
  }

  /* ── 待機画面（スタート前は文字を一切表示しない静止した白紙盤面。
     1行目5個・2行目7個・3行目5個・4行目7個・5行目7個の白いコマを並べるだけで、アニメーションはしない。
     選択肢の位置にスタートボタンを出す） ── */
  function enterAttractMode() {
    state.mode = 'attract';
    clearInterval(state.revealTimer);
    stopQuestionTimer();

    document.getElementById('dq-feedback').className = 'dq-feedback dq-hidden';
    document.getElementById('dq-feedback').textContent = '';
    document.getElementById('dq-next-btn').classList.add('dq-hidden');
    document.getElementById('dq-hud').classList.add('dq-hidden');
    // リード文（遊び方・モード説明）は、スタート前だけ見せればよいので再表示する
    document.querySelectorAll('.dq-lead').forEach((el) => el.classList.remove('dq-hidden'));

    renderAttractStartArea();
    renderBlankBoard();
  }

  function renderAttractStartArea() {
    const container = document.getElementById('dq-choices');
    container.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.className = 'dq-demo-start';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'dq-start-btn';
    btn.className = 'dq-primary-btn';
    btn.textContent = 'スタート';
    btn.addEventListener('click', startGame);
    wrap.appendChild(btn);

    container.appendChild(wrap);
  }

  /* ── スタート前の静止盤面を並べる（revealQueueもrevealTimerも一切使わない＝アニメーションなし） ── */
  function renderBlankBoard() {
    state.dieEls = buildPoemDOM(buildBlankLines());
    state.total = state.dieEls.length;
    state.revealedCount = 0;
    updateStatus();
  }

  /* ── ゲーム開始 ── */
  function startGame() {
    if (allPoems.length < QUESTION_COUNT) return;
    if (!state.revealMode) {
      showModeRequiredWarning();
      return;
    }
    state.mode = 'quiz';
    state.questions = shuffleArray(allPoems).slice(0, QUESTION_COUNT);
    state.index = 0;
    state.questionResults = [];
    state.correctCount = 0;

    document.getElementById('dq-hud').classList.remove('dq-hidden');
    document.getElementById('dq-timer').classList.remove('dq-hidden');
    // 遊び方・モード説明のリード文は、ゲーム開始後は不要なので隠す
    document.querySelectorAll('.dq-lead').forEach((el) => el.classList.add('dq-hidden'));

    loadQuestion();
  }

  /* ── 問題の読み込み ── */
  function loadQuestion() {
    stopQuestionTimer();
    state.current = state.questions[state.index];
    state.answered = false;

    document.getElementById('dq-feedback').className = 'dq-feedback dq-hidden';
    document.getElementById('dq-feedback').textContent = '';
    document.getElementById('dq-next-btn').classList.add('dq-hidden');

    buildChoices(state.current);
    updateHUD();
    startRevealCycle(poemLines(state.current), null, (state.current.kimariji || '').length);
    startQuestionTimer();
  }

  /* ── 五句・コマの伏せ〜1秒おきの順次めくりを1サイクル実行する（待機中の呼び込み演出・本問題で共用） ──
     kimarijiLenは決まり字モード専用。決まり字は「歌の読みの先頭からN文字」として定義されるため、
     歌全体を先頭から数えたN番目までのコマ（＝インデックス0〜N-1）がそのまま決まり字にあたる ── */
  function startRevealCycle(lines, onComplete, kimarijiLen) {
    clearInterval(state.revealTimer);
    // 前の問題でrevealAllRemaining()が仕掛けた「残りを一気にめくる」setTimeoutが、次の問題に
    // 進んだ後まで生き残っていると、新しい問題のstate.dieElsに対して古いインデックスで
    // revealDie()が呼ばれてしまい、まだめくられていないはずのコマが先にめくれる・
    // 表示済み文字数がずれる、といった不具合になる（特に決まり字モードは1文字目から順番に
    // めくる想定なので、この不具合が起きると順番が崩れて目立つ）。次のサイクルを始める前に
    // 必ず全部キャンセルする。
    state.revealAllTimeoutIds.forEach(id => clearTimeout(id));
    state.revealAllTimeoutIds = [];
    state.dieEls = buildPoemDOM(lines);
    state.total = state.dieEls.length;
    state.revealedCount = 0;
    state.revealQueue = buildRevealQueue(state.dieEls, state.revealMode, kimarijiLen || 0);
    updateStatus();

    state.revealTimer = setInterval(() => {
      if (state.revealQueue.length === 0) {
        clearInterval(state.revealTimer);
        if (onComplete) onComplete();
        return;
      }
      const idx = state.revealQueue.shift();
      revealDie(idx);
      updateStatus();
    }, REVEAL_INTERVAL_MS);
  }

  /* ── 1問ごとの回答タイム計測 ── */
  function startQuestionTimer() {
    state.questionStartTime = performance.now();
    updateTimerDisplay(0);
    const tick = () => {
      if (state.answered) return;
      updateTimerDisplay((performance.now() - state.questionStartTime) / 1000);
      state.timerRAF = requestAnimationFrame(tick);
    };
    state.timerRAF = requestAnimationFrame(tick);
  }
  function stopQuestionTimer() {
    if (state.timerRAF) cancelAnimationFrame(state.timerRAF);
    state.timerRAF = null;
  }
  function updateTimerDisplay(sec) {
    document.getElementById('dq-timer').textContent = `⏱ ${sec.toFixed(1)}秒`;
  }

  /* ── 歌の縦書き・フリップ式コマ表示を組み立てる ── */
  function buildPoemDOM(lines) {
    const wrap = document.getElementById('dq-poem-wrap');
    wrap.innerHTML = '';
    const dieEls = [];
    let idx = 0;
    lines.forEach((ku, lineIdx) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'dq-line';
      for (const ch of ku) {
        const dieEl = buildDie(ch, idx);
        dieEl.dataset.line = lineIdx; // 0〜2＝上の句、3〜4＝下の句
        lineEl.appendChild(dieEl);
        dieEls.push(dieEl);
        idx++;
      }
      wrap.appendChild(lineEl);
    });
    return dieEls;
  }

  /* ── コマを1つ作る。表側（front）は常に空欄＝真っ白、裏側（back）にだけ
     あらかじめ正解の文字を書いておき、めくられるまでは見えないようにする ── */
  function buildDie(targetChar, idx) {
    const die = document.createElement('span');
    die.className = 'dq-die';
    die.dataset.idx = idx;
    die.dataset.char = targetChar;

    // 下半分：常に固定表示。めくられるまでは空欄のまま
    const bottomHalf = document.createElement('span');
    bottomHalf.className = 'dq-half-bottom';
    const bottomFace = document.createElement('span');
    bottomFace.className = 'dq-half-face';
    bottomHalf.appendChild(bottomFace);

    // 上半分：ここだけが下端（カード中央の水平線）を軸に1回だけパタンとめくれる
    const topHalf = document.createElement('span');
    topHalf.className = 'dq-half-top';
    const topInner = document.createElement('span');
    topInner.className = 'dq-half-top-inner';
    ['front', 'back'].forEach(pos => {
      const face = document.createElement('span');
      face.className = 'dq-half-face dq-half-face-' + pos;
      if (pos === 'back') face.textContent = targetChar; // 裏面にだけ正解の文字を書いておく
      topInner.appendChild(face);
    });
    topHalf.appendChild(topInner);

    die.appendChild(bottomHalf);
    die.appendChild(topHalf);
    return die;
  }

  /* ── 出題モードに応じて、めくる順番（インデックスの列）を組み立てる ──
     kami: 上の句を優先（上の句を先にすべてめくり切ってから下の句へ）
     shimo: 下の句を優先（下の句を先にすべてめくり切ってから上の句へ）
     kimariji: 決まり字→下の句→上の句の残りの3段階で優先（決まり字＝歌の先頭からkimarijiLen文字ぶんのコマ。
       決まり字は必ず上の句の中に収まるため、決まり字を表示し終えたら、上の句の残り（決まり字より後ろの部分）
       より先に下の句を優先してめくる）。決まり字の部分だけは、実際の決まり字を覚える／聞き取る感覚に
       近づけるため、シャッフルせず1文字目→2文字目→3文字目…と歌の先頭から順番にめくる
       （下の句・上の句の残りは、従来どおりそれぞれの中でランダムな順にする）
     random: 歌全体からばらばらの順（従来どおり） */
  function buildRevealQueue(dieEls, mode, kimarijiLen) {
    if (mode === 'kami' || mode === 'shimo') {
      const kamiIdx = [], shimoIdx = [];
      dieEls.forEach((el, i) => {
        (Number(el.dataset.line) < KAMI_KU_LINE_COUNT ? kamiIdx : shimoIdx).push(i);
      });
      return mode === 'kami'
        ? shuffleArray(kamiIdx).concat(shuffleArray(shimoIdx))
        : shuffleArray(shimoIdx).concat(shuffleArray(kamiIdx));
    }
    if (mode === 'kimariji' && kimarijiLen > 0) {
      const kimarijiIdx = [], shimoIdx = [], restKamiIdx = [];
      dieEls.forEach((el, i) => {
        if (i < kimarijiLen) kimarijiIdx.push(i);
        else if (Number(el.dataset.line) >= KAMI_KU_LINE_COUNT) shimoIdx.push(i);
        else restKamiIdx.push(i);
      });
      return kimarijiIdx.concat(shuffleArray(shimoIdx)).concat(shuffleArray(restKamiIdx));
    }
    return shuffleArray(dieEls.map((_, i) => i));
  }

  /* ── 1つのコマをめくって正体を現す ──
     裏面の文字はbuildDie時点で既に書き込んであるので、ここでは
     「dq-revealedクラスを付ける」だけでCSSのtransitionが自動でパタンと1回めくれる。
     下半分は実物のフリップクロックと同様、めくれ始めと同時に正解の文字へ切り替える。 */
  function revealDie(idx) {
    const die = state.dieEls[idx];
    if (!die || die.classList.contains('dq-revealed')) return;
    die.querySelector('.dq-half-bottom .dq-half-face').textContent = die.dataset.char;
    die.classList.add('dq-revealed');
    state.revealedCount++;
  }

  // 残り全部を一気にめくる。onDoneは、最後の1枚までめくり終わったタイミングで呼ばれる
  // （呼び出し側は、これを「次の問題へ」ボタンを有効化するタイミングに使う）。
  function revealAllRemaining(onDone) {
    clearInterval(state.revealTimer);
    const queue = state.revealQueue.slice();
    state.revealQueue = [];
    state.revealAllTimeoutIds.forEach(id => clearTimeout(id));
    state.revealAllTimeoutIds = [];
    if (queue.length === 0) {
      if (onDone) onDone();
      return;
    }
    queue.forEach((idx, i) => {
      const isLast = i === queue.length - 1;
      const id = setTimeout(() => {
        revealDie(idx);
        updateStatus();
        if (isLast && onDone) onDone();
      }, i * 45);
      state.revealAllTimeoutIds.push(id);
    });
  }

  function updateStatus() {
    const remaining = state.total - state.revealedCount;
    document.getElementById('dq-reveal-status').textContent =
      remaining > 0 ? `表示：${state.revealedCount} / ${state.total} 文字` : '表示終了';
    const pct = state.total ? Math.round(state.revealedCount / state.total * 100) : 0;
    document.getElementById('dq-reveal-bar-fill').style.width = pct + '%';
  }

  /* ── 歌人 選択肢（3択・横書き） ── */
  function buildChoices(poem) {
    const others = shuffleArray(allPoems.filter(p => p.number !== poem.number)).slice(0, CHOICE_COUNT - 1);
    const opts = shuffleArray([poem, ...others]);
    const container = document.getElementById('dq-choices');
    container.innerHTML = '';
    opts.forEach(p => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dq-choice-btn';
      btn.dataset.num = p.number;
      btn.innerHTML = p.name;
      btn.addEventListener('click', () => selectChoice(btn, poem.number));
      container.appendChild(btn);
    });
    adjustWideChoices();
  }

  /* ── 歌人名が長くて今の列幅に収まりきらない選択肢だけ、行全体に広げて1行表示にする ──
     文字数だけで判定すると振り仮名（ruby）の有無やフォントの文字ごとの幅の違いで
     ズレるため、実際に1行に収まるかを幅の実測で判定する（nowrapにしたときの
     scrollWidthが、今のボタン幅（clientWidth）を超えていれば「収まらない」）。 */
  function adjustWideChoices() {
    document.querySelectorAll('.dq-choice-btn').forEach(btn => {
      btn.classList.remove('dq-choice-wide');
      const prevWhiteSpace = btn.style.whiteSpace;
      btn.style.whiteSpace = 'nowrap';
      const overflows = btn.scrollWidth > btn.clientWidth + 1;
      btn.style.whiteSpace = prevWhiteSpace;
      if (overflows) btn.classList.add('dq-choice-wide');
    });
  }

  function selectChoice(btn, correctNumber) {
    if (state.answered) return;
    state.answered = true;

    const elapsedSec = (performance.now() - state.questionStartTime) / 1000;
    stopQuestionTimer();
    updateTimerDisplay(elapsedSec);

    const revealedAtAnswer = state.revealedCount;

    document.querySelectorAll('.dq-choice-btn').forEach(b => b.disabled = true);

    const isCorrect = btn.dataset.num === String(correctNumber);
    btn.classList.add(isCorrect ? 'dq-correct' : 'dq-wrong');
    if (!isCorrect) {
      const correctBtn = document.querySelector(`.dq-choice-btn[data-num="${correctNumber}"]`);
      if (correctBtn) correctBtn.classList.add('dq-correct');
    }
    if (isCorrect) {
      state.correctCount++;
    }
    state.questionResults.push({ revealedAtAnswer, total: state.total, isCorrect });

    const feedback = document.getElementById('dq-feedback');
    feedback.classList.remove('dq-hidden');
    if (isCorrect) {
      feedback.className = 'dq-feedback dq-feedback-correct';
      feedback.textContent = `${revealedAtAnswer}文字目で正解！`;
    } else {
      feedback.className = 'dq-feedback dq-feedback-wrong';
      feedback.textContent = `😢 不正解…（${elapsedSec.toFixed(1)}秒）`;
    }

    // 残りのコマがすべてめくり終わるまでは押せないようにする（早押しで次の問題に進んでしまうと、
    // めくり途中のコマがまだ残っていて演出が中断されたように見えるうえ、前の問題ぶんの
    // revealAllRemaining()がずれ込んで次の問題のコマに影響する不具合の元にもなるため）。
    const nextBtn = document.getElementById('dq-next-btn');
    nextBtn.textContent = (state.index + 1 >= state.questions.length) ? '結果を見る' : '次の問題へ';
    nextBtn.classList.remove('dq-hidden');
    nextBtn.disabled = true;
    revealAllRemaining(() => { nextBtn.disabled = false; });
  }

  function updateHUD() {
    document.getElementById('dq-progress').textContent = `問題 ${state.index + 1} / ${state.questions.length}`;
  }

  function advance() {
    state.index++;
    if (state.index >= state.questions.length) {
      showResults();
    } else {
      loadQuestion();
    }
  }

  /* ── 結果画面：問題ごとの内訳（0〜31文字のインジケーター）
     百人一首は五・七・五・七・七＝31文字が基本形なので、全問共通の物差しとして0〜31を使う ── */
  const INDICATOR_MAX_CHARS = 31;
  function renderResultBreakdown() {
    const container = document.getElementById('dq-result-breakdown');
    container.innerHTML = '';
    state.questionResults.forEach((r, i) => {
      const row = document.createElement('div');
      row.className = 'dq-result-row';

      const label = document.createElement('div');
      label.className = 'dq-result-row-label';
      label.textContent = `${i + 1}問目：${r.revealedAtAnswer}文字目で${r.isCorrect ? '正解' : '不正解'}`;
      row.appendChild(label);

      const barWrap = document.createElement('div');
      barWrap.className = 'dq-result-row-bar-wrap';
      const barFill = document.createElement('div');
      barFill.className = 'dq-result-row-bar-fill' + (r.isCorrect ? '' : ' is-wrong');
      barFill.style.width = Math.min(100, (r.revealedAtAnswer / INDICATOR_MAX_CHARS) * 100) + '%';
      barWrap.appendChild(barFill);
      row.appendChild(barWrap);

      container.appendChild(row);
    });
  }

  /* ── 結果画面：ランク判定
     平均文字数（正解した問題の「何文字目で正解したか」の平均）が少ないほど上位のランクになる。
     1問も正解できなかった場合はランクなしとみなし、最下位の「修行中」を返す ── */
  const RANK_TIERS = [
    { max: 5, name: '神速' },
    { max: 7, name: '超高速' },
    { max: 10, name: '高速' },
  ];
  function getRank(avgChars) {
    if (avgChars == null) return '修行中';
    const tier = RANK_TIERS.find(t => avgChars <= t.max);
    return tier ? tier.name : '修行中';
  }

  /* ── 結果画面：ランクに応じたconfetti演出
     「神速」ほど派手（連打・左右からの追加噴出）に、「修行中」はごく控えめに ── */
  const CONFETTI_CONFIGS = {
    '神速': { bursts: 4, particleCount: 140, spread: 110, startVelocity: 55, colors: ['#FFD700', '#FFFFFF', '#B82343', '#D4AF37'] },
    '超高速': { bursts: 2, particleCount: 90, spread: 80, startVelocity: 45, colors: ['#B82343', '#D4AF37', '#FFFFFF'] },
    '高速': { bursts: 1, particleCount: 55, spread: 65, startVelocity: 35, colors: ['#B82343', '#D4AF37'] },
    '修行中': { bursts: 1, particleCount: 18, spread: 45, startVelocity: 20, colors: ['#999999', '#cccccc'] },
  };
  function fireConfetti(rank) {
    if (typeof confetti !== 'function') return; // CDNが読み込めなかった場合などは静かに諦める
    const cfg = CONFETTI_CONFIGS[rank] || CONFETTI_CONFIGS['修行中'];
    for (let i = 0; i < cfg.bursts; i++) {
      setTimeout(() => {
        confetti({
          particleCount: cfg.particleCount,
          spread: cfg.spread,
          startVelocity: cfg.startVelocity,
          colors: cfg.colors,
          origin: { y: 0.6 },
        });
        // 神速のときだけ、左右の端からも追加で打ち上げてより派手に演出する
        if (rank === '神速') {
          confetti({ particleCount: Math.round(cfg.particleCount * 0.6), angle: 60, spread: 55, startVelocity: cfg.startVelocity, colors: cfg.colors, origin: { x: 0, y: 0.7 } });
          confetti({ particleCount: Math.round(cfg.particleCount * 0.6), angle: 120, spread: 55, startVelocity: cfg.startVelocity, colors: cfg.colors, origin: { x: 1, y: 0.7 } });
        }
      }, i * 350);
    }
  }

  /* ── 結果画面 ── */
  function showResults() {
    clearInterval(state.revealTimer);
    stopQuestionTimer();

    document.getElementById('dq-game-screen').classList.add('dq-hidden');
    document.getElementById('dq-result-screen').classList.remove('dq-hidden');

    renderResultBreakdown();

    document.getElementById('dq-result-correct').textContent =
      `正解数: ${state.correctCount} / ${state.questions.length}`;

    // 不正解の問題は「INDICATOR_MAX_CHARS（31）文字」扱いにして、平均・ランクの計算にペナルティとして含める
    const hasAnswers = state.questionResults.length > 0;
    const avgChars = hasAnswers
      ? state.questionResults.reduce((sum, r) => sum + (r.isCorrect ? r.revealedAtAnswer : INDICATOR_MAX_CHARS), 0) / state.questionResults.length
      : null;
    const allCorrect = hasAnswers && state.questionResults.every(r => r.isCorrect);

    document.getElementById('dq-result-current').textContent = allCorrect
      ? `今回の記録→平均${avgChars.toFixed(1)}文字目で正解`
      : `今回の記録→平均${avgChars.toFixed(1)}文字（不正解は${INDICATOR_MAX_CHARS}文字として計算）`;

    const rank = getRank(avgChars);
    document.getElementById('dq-result-rank-name').textContent = rank;
    fireConfetti(rank);
  }
})();
