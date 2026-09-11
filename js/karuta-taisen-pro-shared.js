    const LANG = window.LANG;

    const myId = "P-" + Math.floor(Math.random() * 900 + 100);
    document.getElementById('my_id').innerText = myId;

    // ===== 上の句・決まり字表示オプション =====
    let showKaminoKu = false;
    let showKimariji = false;
    let playJoka = false;
    let _typewriterTimers = [];
    let kimarijiData = null;

    function _getKaminoKu(num) {
      if (!kimarijiData) return '';
      const entry = kimarijiData.find(e => String(e.id) === String(num));
      if (!entry || !entry.kami_no_ku_kana) return '';
      return entry.kami_no_ku_kana
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, '');
    }

    function _getKimariji(num) {
      if (!kimarijiData) return '';
      const entry = kimarijiData.find(e => String(e.id) === String(num));
      return entry ? (entry.kimariji_head || '') : '';
    }

    function _getKimarijiDelay(num) {
      if (!kimarijiData) return 3 * KIMARIJI_MS_PER_CHAR;
      const kj = _getKimariji(num);
      return (kj.length > 0 ? kj.length : 3) * KIMARIJI_MS_PER_CHAR;
    }

    function _startTypewriter(text, el, charDelay) {
      charDelay = charDelay || 200;
      _typewriterTimers.forEach(clearTimeout);
      _typewriterTimers = [];
      el.textContent = '';
      el.classList.remove('done');
      for (let i = 1; i <= text.length; i++) {
        (function (idx) {
          const t = setTimeout(() => {
            el.textContent = text.slice(0, idx);
            if (idx === text.length) el.classList.add('done');
          }, idx * charDelay);
          _typewriterTimers.push(t);
        })(i);
      }
    }

    function _stopTypewriter() {
      _typewriterTimers.forEach(clearTimeout);
      _typewriterTimers = [];
    }

    // ===== ゲーム状態 =====
    let jsonData = null, hyakuninData = null, currentSongNumber = null, playOrder = [];
    let isGameOver = false;
    let localPenaltyTimeout = null;

    const isMobileTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    let isCpuMode = false;
    let cpuDifficulty = 'normal';
    let cardMode = 1;             // 0=6枚, 1=12枚, 2=24枚, 3=50枚（2・3はPC横向きのみ）
    let currentCardWidth = 75;    // カード列幅（px）、モードと向きで変わる
    let currentEnemyPositions = null; // buildPcBoard で設定
    let cpuPlayers = [];
    let cpuTimers = [];
    let selectedSongs = [];
    let takenCards = {};
    let currentSongIndex = -1;
    let isPcGame = false;
    let cardFields = {};         // num -> 'mine' | 'enemy'
    let pendingSendCard = false;      // 送り札選択待ち（送る側）
    let pendingAdvance = false;       // 送り札/配置中に advanceCpuGame が呼ばれた場合の遅延フラグ
    let pendingCardPlacement = false; // 受け取った送り札の配置待ち
    let pendingPlacementCard = null;  // 配置待ちの札要素
    let sendCardCallback = null;
    let totalCards = 12;         // PC:50、スマホ:12
    let fieldCardSet = new Set(); // 場に存在する取り札（50枚）
    let emptyCardTimers = [];     // 空札自動進行タイマー
    let lastGameWon = null;       // ランキング登録用：最後の対戦結果
    let _initialMyCount = 0;
    let _initialEnemyCount = 0;
    let _prevLeader = null;
    let _reversalTimer = null;
    let _postSendPauseTimer = null; // startPostSendPause の setInterval ハンドル
    let _postSendPauseTimeout = null; // startPostSendPause の 5秒 setTimeout ハンドル
    let _shownAtoHitoki = false;
    let _scheduledGameWin = null; // scheduleEndGame()が確定させた勝敗（後からcardFields変更されても正しい値を保持）
    let isArrangeMode = false;    // 暗記フェーズ中の配置変更モード
    let isPostSendArrange = false; // 送り札後5秒間の自陣整理モード
    let _arrDragCard = null, _arrDragClone = null, _arrOrigRect = null;
    let _arrStartX = 0, _arrStartY = 0, _arrMoved = false;

    const globalAudio = new Audio();
    globalAudio.preload = "auto";
    const finishAudioSrc = "../sound/finish.m4a";
    // 効果音: 宣言時は src を設定しない（ブラウザのプリロードを防ぐ）。
    // unlockAudio() 内でアンロック後に src をセットして読み込む。
    const tapAudio = new Audio();
    const missAudio = new Audio();
    const robotAudio = new Audio();
    const rainAudio = new Audio();
    tapAudio.preload = "none";
    missAudio.preload = "none";
    robotAudio.preload = "none";
    rainAudio.preload = "none";

    let audioUrlCache = {};

    const KIMARIJI_MS_PER_CHAR = 300; // 決まり字1文字あたりの読み上げ時間(ms)
    const CPU_SETTINGS = {
      easy: { reactionOffsetMin: 1200, reactionOffsetMax: 2500, accuracy: 0.65, mistakeChance: 0.3 },
      normal: { reactionOffsetMin: 800, reactionOffsetMax: 2200, accuracy: 0.75, mistakeChance: 0.25 },
      hard: { reactionOffsetMin: 700, reactionOffsetMax: 900, accuracy: 0.90, mistakeChance: 0.08 }
    };

    // 暗記時間（秒）― デフォルト1分（1段）
    let memoryTimeSec = 60;
    let memoryTimerActive = false;

    function getIcon(pid, allPids) {
      if (pid === 'ロボット' || pid.startsWith('CPU-')) return '👾';
      const icons = ['🐻', '🐼', '🐰', '🐨', '🐱', '🦁', '🐶', '🦊', '🐵'];
      const sortedPids = [...allPids].sort();
      const index = sortedPids.indexOf(pid);
      if (index === -1) { const num = parseInt(pid.replace('P-', '')) || 0; return icons[num % icons.length]; }
      return icons[index % icons.length];
    }

    // 難易度ボタン
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        cpuDifficulty = this.dataset.level;
      });
    });

    // 暗記時間ボタン
    document.querySelectorAll('#memory_time_buttons .memory-time-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#memory_time_buttons .memory-time-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        memoryTimeSec = parseInt(this.dataset.sec);
      });
    });

    // スマホではモード1・2・3（12枚・24枚・50枚）を非表示にして6枚のみ選択可能に
    if (isMobileTouch) {
      document.querySelectorAll('#card_mode_buttons .memory-time-btn').forEach(btn => {
        if (parseInt(btn.dataset.mode) > 0) btn.style.display = 'none';
        btn.classList.toggle('selected', parseInt(btn.dataset.mode) === 0);
      });
      cardMode = 0;
    }

    // 札枚数モードボタン（PCのみ表示）
    const modeDefaultSec = { 0: 30, 1: 60, 2: 300, 3: 900 };
    document.querySelectorAll('#card_mode_buttons .memory-time-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#card_mode_buttons .memory-time-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        cardMode = parseInt(this.dataset.mode);
        // モードに応じてデフォルト暗記時間を切り替える
        const sec = modeDefaultSec[cardMode] || 900;
        memoryTimeSec = sec;
        document.querySelectorAll('#memory_time_buttons .memory-time-btn').forEach(b => {
          b.classList.toggle('selected', parseInt(b.dataset.sec) === sec);
        });
      });
    });

    // ===== 初期化 =====
    async function init() {
      try {
        const [resKaruta, resKimariji, resHyakunin] = await Promise.all([
          fetch("../js/karuta.json?v=" + Date.now()),
          fetch("../js/kimariji.json?v2=" + Date.now()),
          fetch("../js/hyakunin.json?v2=" + Date.now())
        ]);
        jsonData = await resKaruta.json();
        kimarijiData = await resKimariji.json();
        hyakuninData = await reshyakunin.json();
      } catch (e) { console.error("❌ JSONエラー:", e); }
    }

    // 無音WAVデータ（0.1秒）― globalAudio のアンロック専用
    const SILENT_WAV = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

    // Web Audio API の AudioContext（無音バッファ再生によるアンロック用）
    let _audioCtx = null;

    function unlockAudio() {
      // ① Web Audio API: AudioContext を生成し無音バッファを再生してアンロックする。
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !_audioCtx) {
        try {
          _audioCtx = new AudioCtx();
          const buf = _audioCtx.createBuffer(1, 1, 22050);
          const bufSrc = _audioCtx.createBufferSource();
          bufSrc.buffer = buf;
          bufSrc.connect(_audioCtx.destination);
          bufSrc.start(0);
          _audioCtx.resume().catch(() => { });
        } catch (e) { _audioCtx = null; }
      }

      // ② globalAudio: 無音WAVでアンロック（後でplaySongByIndexが正しいsrcをセットする）
      globalAudio.src = SILENT_WAV;
      globalAudio.play().then(() => globalAudio.pause()).catch(() => { });

      // ③ 効果音: アンロック後に初めて src をセットして読み込む。
      //    宣言時は src を設定しないことでブラウザのプリロードを防ぎ、
      //    ボタン押下時にバッファ済みの音が出る問題を根本から防ぐ。
      const sfxSrcs = [
        [tapAudio, '../sound/tap.mp3'],
        [missAudio, '../sound/miss.mp3'],
        [robotAudio, '../sound/robot.mp3'],
        [rainAudio, '../sound/rain.mp3'],
      ];
      sfxSrcs.forEach(([audio, src]) => {
        audio.src = src;
        audio.preload = "auto";
        audio.load();
      });
    }

    function preloadSongs(keys) {
      if (!window._preloadedAudio) window._preloadedAudio = {};
      keys.forEach(num => {
        audioUrlCache[num] = `../sound/d_${String(num).padStart(3, '0')}.mp3`;
        if (window._preloadedAudio[num]) return;
        const a = new Audio();
        a.preload = 'auto';
        a.src = audioUrlCache[num];
        window._preloadedAudio[num] = a;
      });
    }

    // 指定曲が再生可能になるまで待つ Promise（最大8秒でタイムアウト）
    function waitForAudio(num) {
      return new Promise((resolve) => {
        const a = window._preloadedAudio && window._preloadedAudio[num];
        if (!a) { resolve(); return; }
        if (a.readyState >= 3) { resolve(); return; }
        const onReady = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); resolve(); };
        const timeout = setTimeout(onReady, 8000);
        function cleanup() { clearTimeout(timeout); a.removeEventListener('canplaythrough', onReady); a.removeEventListener('error', onError); }
        a.addEventListener('canplaythrough', onReady, { once: true });
        a.addEventListener('error', onError, { once: true });
      });
    }

    document.getElementById('audio_resume_btn').onclick = function () {
      unlockAudio();
      if (currentSongNumber) {
        globalAudio.src = audioUrlCache[currentSongNumber];
        globalAudio.play().then(() => this.style.display = 'none');
      }
    };

    // ===== ロボット対戦ボタン =====
    document.getElementById('cpu_battle_button').onclick = () => {
      if (!jsonData) return;
      unlockAudio();
      showKaminoKu = document.getElementById('show_kami_no_ku_cb').checked;
      showKimariji = document.getElementById('show_kimariji_cb').checked;
      playJoka = document.getElementById('play_joka_cb').checked;
      isCpuMode = true;
      cpuPlayers = ['ロボット'];
      startCpuGame();
    };

    // ===== ゲーム画面へ遷移（CPU） =====
    function startCpuGame() {
      document.querySelectorAll('.header, footer').forEach(el => el.style.display = 'none');
      document.querySelector('.section').style.display = 'none';
      document.getElementById('room_setup').style.display = 'none';
      document.getElementById('login_area').style.display = 'none';
      document.getElementById('player_info').style.display = 'flex';
      document.getElementById('player_info').style.overflow = cardMode === 3 ? '' : 'hidden';
      ['ci_my_bar', 'ci_my_count', 'ci_badge', 'ci_enemy_bar', 'ci_enemy_count'].forEach(id => {
        document.getElementById(id).style.display = '';
      });
      const allPlayers = [myId, ...cpuPlayers];
      document.getElementById('my_id').innerText = `${myId} ${getIcon(myId, allPlayers)}`;
      document.getElementById('others_icons').innerText = LANG.othersIconsText;

      const statusEl = document.getElementById('status_text');
      statusEl.style.display = 'block';
      statusEl.innerText = LANG.statusPreparingCards;

      const pcMode = true;
      const allKeys = Object.keys(jsonData);
      let keys, fieldKeysForBoard;
      if (pcMode) {
        const modeCfg = { 0: [6, 0], 1: [12, 0], 2: [24, 4], 3: [50, 10] };
        const [fieldCount, emptyCount] = modeCfg[cardMode] || modeCfg[3];
        const s = shuffle([...allKeys]);
        fieldKeysForBoard = s.slice(0, fieldCount);
        const emptyKeys = s.slice(fieldCount, fieldCount + emptyCount);
        keys = [...fieldKeysForBoard, ...emptyKeys];
        selectedSongs = [...fieldKeysForBoard];
      } else {
        keys = shuffle([...allKeys]).slice(0, 12);
        fieldKeysForBoard = keys;
        selectedSongs = keys;
      }
      playOrder = shuffle([...keys]);
      takenCards = {};
      currentSongIndex = -1;
      isGameOver = false;
      isPcGame = false;
      cardFields = {};
      fieldCardSet = new Set();
      emptyCardTimers = [];
      isArrangeMode = false;
      isPostSendArrange = false;
      pendingSendCard = false;
      pendingAdvance = false;
      pendingCardPlacement = false;
      pendingPlacementCard = null;
      sendCardCallback = null;
      totalCards = keys.length;
      if (_reversalTimer) { clearTimeout(_reversalTimer); _reversalTimer = null; }
      if (_postSendPauseTimer) { clearInterval(_postSendPauseTimer); _postSendPauseTimer = null; }
      if (_postSendPauseTimeout) { clearTimeout(_postSendPauseTimeout); _postSendPauseTimeout = null; }
      _shownAtoHitoki = false;
      _prevLeader = null;
      _prevMyLeft = -1;
      _scheduledGameWin = null;
      cpuTimers.forEach(t => clearTimeout(t));
      cpuTimers = [];

      preloadSongs(keys);
      buildMemorizationBoard(fieldKeysForBoard, playOrder);
      requestAnimationFrame(fitCardsToScreen);

      const container = document.getElementById('karuta_container');
      if (pcMode) {
        container.style.pointerEvents = 'auto';
        isArrangeMode = true;
      } else {
        container.style.pointerEvents = 'none';
      }

      startMemorizationCountdown(memoryTimeSec, async () => {
        isArrangeMode = false;
        if (_arrDragClone) { _arrDragClone.remove(); _arrDragClone = null; }
        _arrDragCard = null; _arrOrigRect = null;
        _hideArrangePlaceholders();
        document.querySelectorAll('#pc_my_field .drop-target').forEach(el => el.classList.remove('drop-target'));
        document.querySelectorAll('.arrange-hint').forEach(el => el.remove());
        container.style.pointerEvents = 'none';

        // 序歌再生
        if (playJoka) {
          await new Promise(resolve => {
            const jokaAudio = new Audio('../sound/joka.mp3');
            const memoryRow = document.getElementById('memory_info_row');
            const skipBtn = document.getElementById('memory_skip_btn');
            const timerEl = document.getElementById('memory_countdown_timer');

            function endJoka() {
              jokaAudio.pause();
              jokaAudio.src = '';
              skipBtn.onclick = null;
              if (memoryRow) memoryRow.style.display = 'none';
              resolve();
            }

            if (memoryRow) {
              memoryRow.querySelector('span').textContent = LANG.jokaLabel;
              timerEl.textContent = '';
              skipBtn.textContent = LANG.btnSkip;
              skipBtn.onclick = endJoka;
              memoryRow.style.display = 'flex';
            }
            statusEl.innerText = LANG.statusPlayingJoka;

            jokaAudio.addEventListener('ended', endJoka);
            jokaAudio.addEventListener('error', endJoka);
            jokaAudio.play().catch(endJoka);
          });
        }

        statusEl.innerText = LANG.statusLoadingAudio;

        await waitForAudio(playOrder[0]);

        let sec = 3;
        const timer = setInterval(() => {
          statusEl.innerText = LANG.statusStartingIn(sec);
          if (sec-- <= 0) {
            clearInterval(timer);
            container.style.pointerEvents = 'auto';
            currentSongIndex = 0;
            statusEl.innerText = LANG.statusCardNumber(totalCards);
            playSongByIndex(0);
            scheduleCpuActions();
            if (isPcGame) updateCardIndicator();
          }
        }, 1000);
      });
    }

    function buildMemorizationBoard(keys, order) {
      playOrder = order;
      buildPcBoard(keys, cardMode);
    }

    // ===== PC 競技かるたレイアウト =====
    // 14列グリッド、中央 col7-8 は常時空き
    // ── モード0（3枚/陣、1段、3列グリッド）──
    const MY_POSITIONS_0 = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }
    ];
    const ENEMY_POSITIONS_0 = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }
    ];
    // ── モード1（6枚/陣、1段、6列グリッド・ギャップなし）──
    const MY_POSITIONS_1 = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 4, row: 1 }, { col: 5, row: 1 }, { col: 6, row: 1 }
    ];
    const ENEMY_POSITIONS_1 = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 4, row: 1 }, { col: 5, row: 1 }, { col: 6, row: 1 }
    ];
    // ── モード2（12枚/陣、2段、8列グリッド・ギャップなし）──
    // 自陣: Row1=4枚(中央線寄り、col3-6)、Row2=8枚(手前、col1-8)
    // 敵陣: Row1=8枚(奥、col1-8)、Row2=4枚(中央線寄り、col3-6)
    const MY_POSITIONS_2 = [
      { col: 3, row: 1 }, { col: 4, row: 1 }, { col: 5, row: 1 }, { col: 6, row: 1 },
      { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 }, { col: 6, row: 2 }, { col: 7, row: 2 }, { col: 8, row: 2 }
    ];
    const ENEMY_POSITIONS_2 = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 4, row: 1 }, { col: 5, row: 1 }, { col: 6, row: 1 }, { col: 7, row: 1 }, { col: 8, row: 1 },
      { col: 3, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 }, { col: 6, row: 2 }
    ];
    // ── モード3（25枚/陣、3段）──
    // 自陣: Row1=5枚(少、中央線寄り)、Row2=9枚、Row3=11枚(多、手前)
    // 敵陣: Row1=11枚(多、奥)、Row2=9枚、Row3=5枚(少、中央線寄り)
    const MY_POSITIONS = [
      // Row1(5): 左3(col1-3) + 右2(col13-14)
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 13, row: 1 }, { col: 14, row: 1 },
      // Row2(9): 左5(col1-5) + 右4(col11-14)
      { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 },
      { col: 11, row: 2 }, { col: 12, row: 2 }, { col: 13, row: 2 }, { col: 14, row: 2 },
      // Row3(11): 左6(col1-6) + 右5(col10-14)
      { col: 1, row: 3 }, { col: 2, row: 3 }, { col: 3, row: 3 }, { col: 4, row: 3 }, { col: 5, row: 3 }, { col: 6, row: 3 },
      { col: 10, row: 3 }, { col: 11, row: 3 }, { col: 12, row: 3 }, { col: 13, row: 3 }, { col: 14, row: 3 }
    ]; // 5+9+11=25
    const ENEMY_POSITIONS = [
      // Row1(11): 左6(col1-6) + 右5(col10-14)
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 4, row: 1 }, { col: 5, row: 1 }, { col: 6, row: 1 },
      { col: 10, row: 1 }, { col: 11, row: 1 }, { col: 12, row: 1 }, { col: 13, row: 1 }, { col: 14, row: 1 },
      // Row2(9): 左5(col1-5) + 右4(col11-14)
      { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 },
      { col: 11, row: 2 }, { col: 12, row: 2 }, { col: 13, row: 2 }, { col: 14, row: 2 },
      // Row3(5): 左3(col1-3) + 右2(col13-14)
      { col: 1, row: 3 }, { col: 2, row: 3 }, { col: 3, row: 3 }, { col: 13, row: 3 }, { col: 14, row: 3 }
    ]; // 11+9+5=25

    // ── モバイル縦向き モード0（3枚/陣、1段、3列グリッド）──
    const MY_POSITIONS_MOBILE_0 = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }
    ];
    const ENEMY_POSITIONS_MOBILE_0 = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }
    ];
    // ── モバイル縦向き モード1（6枚/陣、2段、3列グリッド）──
    const MY_POSITIONS_MOBILE = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 },
      { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }
    ];
    const ENEMY_POSITIONS_MOBILE = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 },
      { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }
    ];

    function buildPcBoard(keys, mode) {
      isPcGame = true;
      cardFields = {};
      fieldCardSet = new Set();

      const mobilePortrait = isMobileTouch; // スマホは縦向き2段3列レイアウト
      let myPos, enemyPos, rowCount, colCount;
      if (mobilePortrait) {
        myPos = mode === 0 ? MY_POSITIONS_MOBILE_0 : MY_POSITIONS_MOBILE;
        enemyPos = mode === 0 ? ENEMY_POSITIONS_MOBILE_0 : ENEMY_POSITIONS_MOBILE;
        colCount = 3;
        rowCount = mode === 0 ? 1 : 2;
      } else {
        myPos = mode === 0 ? MY_POSITIONS_0 : mode === 1 ? MY_POSITIONS_1 : mode === 2 ? MY_POSITIONS_2 : MY_POSITIONS;
        enemyPos = mode === 0 ? ENEMY_POSITIONS_0 : mode === 1 ? ENEMY_POSITIONS_1 : mode === 2 ? ENEMY_POSITIONS_2 : ENEMY_POSITIONS;
        colCount = mode === 0 ? 3 : mode === 1 ? 6 : mode === 2 ? 8 : 14;
        rowCount = mode === 0 ? 1 : mode === 1 ? 1 : mode === 2 ? 2 : 3;
      }
      currentEnemyPositions = enemyPos;

      const cardGap = mobilePortrait ? 3 : 8; // スマホ3px、PC8px
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;

      // スマホ全幅: 測定前に親要素の padding を 0 にして実際の利用可能幅を取得
      const container = document.getElementById('karuta_container');
      if (mobilePortrait) {
        const mainEl = document.querySelector('main.main_about-main');
        const sectionEl = container.closest('.section');
        if (mainEl) mainEl.style.padding = '0';
        if (sectionEl) sectionEl.style.padding = '0';
        container.style.padding = '0';
      }

      let cardW;
      if (mode === 3 && !mobilePortrait) {
        cardW = 75;
      } else if (isPortrait && !isMobileTouch) {
        cardW = 56;
      } else if (isMobileTouch) {
        const viewW = container.clientWidth; // 実際の利用可能幅
        const ptH = window.visualViewport?.height ?? window.innerHeight; // dvh 相当
        const cardW_byWidth = Math.floor(
          (viewW - 14 - (colCount - 1) * cardGap) / colCount
        );
        const cardW_byHeight = Math.floor(
          0.7 * (ptH - 160 - (rowCount - 1) * cardGap * 2) / (rowCount * 2)
        );
        cardW = Math.max(30, Math.min(cardW_byWidth, cardW_byHeight, 130));
      } else {
        cardW = mode === 0 ? 130 : mode === 1 ? 130 : 100;
      }
      currentCardWidth = cardW;
      const gridCols = `repeat(${colCount}, ${cardW}px)`;
      // スマホは行高さを明示的に固定して上下段のカードサイズを揃える
      const cardH = mobilePortrait ? Math.round(cardW / 0.7) : null;
      const gridRows = cardH ? `repeat(${rowCount}, ${cardH}px)` : `repeat(${rowCount}, auto)`;
      // スマホ: フィールド幅（帯の幅合わせにも使用）
      const fw = mobilePortrait ? colCount * cardW + (colCount - 1) * cardGap + 14 : null;

      const half = Math.floor(keys.length / 2);
      const fieldShuffled = shuffle([...keys]);
      fieldShuffled.forEach((k, i) => {
        cardFields[k] = i < half ? 'enemy' : 'mine';
        fieldCardSet.add(String(k));
      });
      _initialMyCount = fieldShuffled.filter(k => cardFields[k] === 'mine').length;
      _initialEnemyCount = fieldShuffled.filter(k => cardFields[k] === 'enemy').length;
      _prevLeader = null;
      _shownAtoHitoki = false;
      _scheduledGameWin = null;

      container.style.cssText = mobilePortrait
        ? `display:block; padding:0; transform:none; overflow-x:hidden;`
        : 'display:block; transform:none;';
      container.innerHTML = '';

      const enemyField = document.createElement('div');
      enemyField.id = 'pc_enemy_field';
      enemyField.dataset.cardMode = String(mode);
      enemyField.style.display = 'grid';
      enemyField.style.gap = `${cardGap}px`;
      enemyField.style.gridTemplateColumns = gridCols;
      enemyField.style.gridTemplateRows = gridRows;
      if (mobilePortrait) {
        enemyField.style.boxSizing = 'border-box';
        enemyField.style.width = fw + 'px';
        enemyField.style.margin = '0 auto';
        enemyField.style.background = 'rgba(255,255,255,0.3)';
        enemyField.style.border = '1px solid rgba(200,200,200,0.7)';
        enemyField.style.borderRadius = '6px';
        enemyField.style.padding = '6px';
      } else if (mode !== 3) {
        enemyField.style.width = 'fit-content';
        enemyField.style.margin = '0 auto';
      }

      const centerLine = document.createElement('div');
      centerLine.id = 'pc_center_line';
      centerLine.innerHTML = LANG.centerLineHtml;

      const myField = document.createElement('div');
      myField.id = 'pc_my_field';
      myField.dataset.cardMode = String(mode);
      myField.style.display = 'grid';
      myField.style.gap = `${cardGap}px`;
      myField.style.gridTemplateColumns = gridCols;
      myField.style.gridTemplateRows = gridRows;
      if (mobilePortrait) {
        myField.style.boxSizing = 'border-box';
        myField.style.width = fw + 'px';
        myField.style.margin = '0 auto';
        myField.style.background = 'rgba(255,255,255,0.3)';
        myField.style.border = '1px solid rgba(200,200,200,0.7)';
        myField.style.borderRadius = '6px';
        myField.style.padding = '6px';
      } else if (mode !== 3) {
        myField.style.width = 'fit-content';
        myField.style.margin = '0 auto';
      }

      const arrangeHint = document.createElement('div');
      arrangeHint.className = 'arrange-hint';
      arrangeHint.textContent = LANG.arrangeHintText;
      if (mobilePortrait) arrangeHint.style.display = 'none';

      container.appendChild(enemyField);
      container.appendChild(centerLine);
      container.appendChild(myField);
      container.appendChild(arrangeHint);

      const myCards = fieldShuffled.filter(k => cardFields[k] === 'mine');
      const enemyCards = fieldShuffled.filter(k => cardFields[k] === 'enemy');

      myCards.forEach((k, i) => {
        const pos = myPos[i];
        const song = Object.values(jsonData).find(s => String(s.number) === String(k));
        if (!song || !pos) return;
        const card = makePcCard(k, song);
        card.style.gridColumn = pos.col;
        card.style.gridRow = pos.row;
        myField.appendChild(card);
      });

      enemyCards.forEach((k, i) => {
        const pos = enemyPos[i];
        const song = Object.values(jsonData).find(s => String(s.number) === String(k));
        if (!song || !pos) return;
        const card = makePcCard(k, song);
        card.style.gridColumn = pos.col;
        card.style.gridRow = pos.row;
        enemyField.appendChild(card);
      });
    }

    function makePcCard(key, song) {
      const card = document.createElement('div');
      card.className = 'karuta_card';
      card.dataset.number = key;
      card.style.position = 'relative';
      card.innerHTML = `<p>${song.torihuda}</p>`;
      if (showKimariji) {
        const kj = _getKimariji(key);
        if (kj) {
          const badge = document.createElement('span');
          badge.className = 'kimariji-badge';
          badge.textContent = kj;
          card.appendChild(badge);
          card.classList.add('has-kimariji');
          card.style.setProperty('padding-top', '0', 'important');
          card.style.setProperty('padding-bottom', '10px', 'important');
        }
      }
      let touching = false;
      card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (isArrangeMode && isPcGame) return;
        touching = true; handleCardClick(key);
      }, { passive: false });
      card.addEventListener('click', () => {
        if (touching) { touching = false; return; }
        if (isArrangeMode && isPcGame) return;
        handleCardClick(key);
      });
      card.addEventListener('pointerdown', (e) => {
        if (!isPcGame) return;
        const isPlacement = pendingCardPlacement && card === pendingPlacementCard;
        if (!isPlacement && (!isArrangeMode && !isPostSendArrange)) return;
        if (!isPlacement && cardFields[key] !== 'mine') return;
        e.preventDefault();
        _startArrangeDrag(card, e);
      }, { passive: false });
      return card;
    }

    function showTakenCardFlash(cardNumber) {
      if (!jsonData) return;
      const song = Object.values(jsonData).find(s => String(s.number) === String(cardNumber));
      if (!song) return;
      const existing = document.getElementById('card-taken-overlay');
      if (existing) existing.remove();
      const overlay = document.createElement('div');
      overlay.id = 'card-taken-overlay';
      const card = document.createElement('div');
      card.className = 'karuta_card';
      card.style.position = 'relative';
      card.innerHTML = `<p>${song.torihuda}</p>`;
      if (showKimariji) {
        const kj = _getKimariji(String(cardNumber));
        if (kj) {
          const badge = document.createElement('span');
          badge.className = 'kimariji-badge';
          badge.textContent = kj;
          card.appendChild(badge);
          card.classList.add('has-kimariji');
          card.style.setProperty('padding-top', '0', 'important');
          card.style.setProperty('padding-bottom', '10px', 'important');
        }
      }
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 1500);
    }

    function updatePcReadCard(num) {
      const el = document.getElementById('pc_read_card_text');
      if (!el) return;
      const song = Object.values(jsonData).find(s => String(s.number) === String(num));
      el.textContent = song ? song.torihuda : '－';
    }

    function showPcSendCardSelection(onComplete) {
      // 既に送り札選択中なら callback をチェーンして上書きしない
      if (pendingSendCard) {
        const prev = sendCardCallback;
        sendCardCallback = prev ? () => { prev(); if (onComplete) onComplete(); } : onComplete;
        return;
      }
      pendingSendCard = true;
      sendCardCallback = onComplete;
      const notice = document.getElementById('send_card_notice');
      if (notice) notice.style.display = 'block';
      const kamiElS = document.getElementById('kami_no_ku_display');
      if (kamiElS) kamiElS.style.display = 'none';
      document.getElementById('status_text').innerText = LANG.statusSendCardPrompt;
      document.getElementById('status_text').style.color = '#27ae60';
      Object.keys(cardFields)
        .filter(k => cardFields[k] === 'mine' && !takenCards[k])
        .forEach(key => {
          const el = document.querySelector(`.karuta_card[data-number="${key}"]`);
          if (el) el.classList.add('send-card-highlight');
        });
    }

    function executeSendCard(num) {
      pendingSendCard = false;
      document.querySelectorAll('.send-card-highlight').forEach(el => el.classList.remove('send-card-highlight'));
      const notice = document.getElementById('send_card_notice');
      if (notice) notice.style.display = 'none';
      const kamiElE = document.getElementById('kami_no_ku_display');
      if (kamiElE) kamiElE.style.display = '';
      document.getElementById('status_text').style.color = '#B82343';
      cardFields[num] = 'enemy';
      updateCardIndicator();
      const willWin = isPcGame && checkPcWin(); // 勝敗を確認（アニメ後に処理するため先に保持）
      const card = document.querySelector(`.karuta_card[data-number="${num}"]`);
      const enemyField = document.getElementById('pc_enemy_field');
      if (card && enemyField) {
        if (cardMode === 3) {
          const pos = _findFreeCenterPos(enemyField);
          card.style.gridColumn = String(pos.col);
          card.style.gridRow = String(pos.row);
          enemyField.appendChild(card);
          void card.offsetWidth;
          card.classList.add('incoming-sent-card');
        } else {
          const pos = _getExtendedPos(enemyField);
          card.style.gridColumn = String(pos.col);
          card.style.gridRow = String(pos.row);
          enemyField.appendChild(card);
          void card.offsetWidth;
          card.classList.add('incoming-sent-card');
          setTimeout(() => card.classList.remove('incoming-sent-card'), 1200);
          const myFieldEl = document.getElementById('pc_my_field');
          if (myFieldEl) _repackField(myFieldEl);
        }
      }
      // アニメーション完了後（sent-card-arrive 0.5s < 1500ms）に勝敗判定・ゲーム継続処理
      setTimeout(() => {
        if (card && cardMode === 3) _placeSentCardAuto(card, document.getElementById('pc_enemy_field'), currentEnemyPositions || ENEMY_POSITIONS);
        if (willWin) { sendCardCallback = null; scheduleEndGame(); return; }
        if (sendCardCallback) {
          const cb = sendCardCallback;
          sendCardCallback = null;
          pendingAdvance = false; // callback が advanceCpuGame を呼ぶので二重進行を防ぐ
          cb();
        } else if (pendingAdvance) {
          pendingAdvance = false;
          setTimeout(advanceCpuGame, 800);
        } else if (isPcGame) {
          scheduleCpuActions();
        }
      }, 1500);
    }

    function startPostSendPause(label) {
      label = label || LANG.statusPostSendDone;
      const statusEl = document.getElementById('status_text');
      isPostSendArrange = true;
      let remaining = 5;
      const tick = () => {
        statusEl.style.color = '#27ae60';
        statusEl.innerText = LANG.statusPostSendCountdown(label, remaining);
      };
      tick();
      _postSendPauseTimer = setInterval(() => { if (--remaining > 0) tick(); else clearInterval(_postSendPauseTimer); }, 1000);
      _postSendPauseTimeout = setTimeout(() => {
        clearInterval(_postSendPauseTimer);
        if (isGameOver) return;
        isPostSendArrange = false;
        document.removeEventListener('pointermove', _onArrDragMove);
        document.removeEventListener('pointerup', _onArrDragEnd);
        document.removeEventListener('pointercancel', _onArrDragEnd);
        if (_arrDragClone) { _arrDragClone.remove(); _arrDragClone = null; }
        _arrDragCard = null; _arrOrigRect = null;
        _hideArrangePlaceholders();
        document.querySelectorAll('#pc_my_field .drop-target').forEach(el => el.classList.remove('drop-target'));
        if (pendingCardPlacement) {
          if (pendingPlacementCard) pendingPlacementCard.classList.remove('incoming-sent-card');
          pendingCardPlacement = false;
          pendingPlacementCard = null;
          if (pendingAdvance) { pendingAdvance = false; setTimeout(advanceCpuGame, 800); }
          else if (sendCardCallback) { const cb = sendCardCallback; sendCardCallback = null; cb(); }
          else if (isPcGame) { scheduleCpuActions(); }
        } else if (pendingAdvance) {
          // pendingCardPlacement がドラッグ配置で先に解除されたが pendingAdvance が残っている場合
          pendingAdvance = false;
          setTimeout(advanceCpuGame, 800);
        }
        if (!isArrangeMode) {
          statusEl.style.color = '#B82343';
          statusEl.innerText = LANG.statusCardDisplay(currentSongIndex, totalCards);
        }
      }, 5000);
    }

    function cpuSendToMyField() {
      const available = Object.keys(cardFields).filter(k => cardFields[k] === 'enemy' && !takenCards[k]);
      if (!available.length) return;
      const chosen = available[Math.floor(Math.random() * available.length)];
      cardFields[chosen] = 'mine';
      updateCardIndicator();
      const card = document.querySelector(`.karuta_card[data-number="${chosen}"]`);
      const myField = document.getElementById('pc_my_field');
      if (card && myField) {
        if (cardMode === 3) {
          // mode3: 勝敗確定ならカード配置UIを出す前に即終了
          if (isPcGame && checkPcWin()) { scheduleEndGame(); return; }
          const pos = _findFreeCenterPos(myField);
          card.style.gridColumn = String(pos.col);
          card.style.gridRow = String(pos.row);
          myField.appendChild(card);
          void card.offsetWidth;
          card.classList.add('incoming-sent-card');
          pendingCardPlacement = true;
          pendingPlacementCard = card;
          const statusEl = document.getElementById('status_text');
          statusEl.style.color = '#c0392b';
          statusEl.innerText = LANG.statusReceiveSentCard;
          startPostSendPause(LANG.statusCardReceived);
        } else {
          // mode1/2: 送り札アニメーションを最後まで見せてから勝敗確認
          const pos = _getExtendedPos(myField);
          card.style.gridColumn = String(pos.col);
          card.style.gridRow = String(pos.row);
          myField.appendChild(card);
          void card.offsetWidth;
          card.classList.add('incoming-sent-card');
          setTimeout(() => {
            card.classList.remove('incoming-sent-card');
            if (isPcGame && checkPcWin()) { scheduleEndGame(); }
          }, 1200);
          // 敵陣のアキを即詰め
          const enemyFieldEl = document.getElementById('pc_enemy_field');
          if (enemyFieldEl) _repackField(enemyFieldEl);
        }
      } else {
        // カード要素が見つからない場合は即座に勝敗確認
        if (isPcGame && checkPcWin()) { scheduleEndGame(); }
      }
    }

    function _findFreeCenterPos(field) {
      // モード3: 中央ギャップ(col7-8)に一時配置
      // モード1/2: 通常行の下の追加行に一時配置
      let candidates;
      if (cardMode === 3) {
        candidates = [{ col: 7, row: 2 }, { col: 8, row: 2 }, { col: 7, row: 1 }, { col: 8, row: 1 }, { col: 7, row: 3 }, { col: 8, row: 3 }];
      } else if (cardMode === 2) {
        candidates = [{ col: 4, row: 3 }, { col: 5, row: 3 }, { col: 3, row: 3 }, { col: 6, row: 3 }];
      } else {
        candidates = [{ col: 3, row: 2 }, { col: 4, row: 2 }, { col: 2, row: 2 }, { col: 5, row: 2 }];
      }
      const occupied = new Set();
      field.querySelectorAll('.karuta_card').forEach(c => {
        if (c.dataset.hidden) return;
        if (c.style.gridColumn && c.style.gridRow)
          occupied.add(`${c.style.gridColumn},${c.style.gridRow}`);
      });
      return candidates.find(p => !occupied.has(`${p.col},${p.row}`)) || candidates[0];
    }

    // カード枚数 → モバイルグリッドのcols/rows
    function _mobileLayout(count) {
      // 6枚モードは通常3×1固定。ただし送り札で3枚を超える場合（自陣の札が
      // 1枚も減っていない状態で送り札を受けた場合など）は既存カードと重ならないよう
      // 3×2（6枠）へ広げる。6枚モードの1陣あたり最大枚数は6枚なのでこれで足りる。
      if (cardMode === 0 && count <= 3) return { cols: 3, rows: 1 };
      if (count <= 6) return { cols: 3, rows: 2 };
      if (count <= 8) return { cols: 4, rows: 2 };
      return { cols: 3, rows: 3 };
    }

    // cols×rows の行優先ポジション配列を生成
    function _buildMobilePositions(cols, rows) {
      const positions = [];
      for (let r = 1; r <= rows; r++)
        for (let c = 1; c <= cols; c++)
          positions.push({ col: c, row: r });
      return positions;
    }

    // モバイルフィールドのグリッドテンプレートと幅を更新
    function _applyMobileFieldLayout(field, cols, rows) {
      const cardGap = 3;
      const viewW = document.documentElement.clientWidth;
      const ptH = window.visualViewport?.height ?? window.innerHeight; // dvh 相当
      // スマホ全幅: viewport幅からfieldのpadding(6×2)+border(1×2)=14pxとgapだけ引く
      const cardW_byWidth = Math.floor((viewW - 14 - (cols - 1) * cardGap) / cols);
      const cardW_byHeight = Math.floor(0.7 * (ptH - 160 - (rows - 1) * cardGap * 2) / (rows * 2));
      const cardW = Math.max(30, Math.min(cardW_byWidth, cardW_byHeight, 130));
      const cardH2 = Math.round(cardW / 0.7);
      field.style.gridTemplateColumns = `repeat(${cols}, ${cardW}px)`;
      field.style.gridTemplateRows = `repeat(${rows}, ${cardH2}px)`;
      field.style.width = (cols * cardW + (cols - 1) * cardGap + 14) + 'px';
      return cardW;
    }

    // 指定positionsリストから空きスロットを返す（取得済み・非表示カードはスキップ）
    function _findFreePos(field, positions) {
      const occupied = new Set();
      field.querySelectorAll('.karuta_card').forEach(c => {
        if (c.dataset.hidden) return;
        if (c.dataset.number && takenCards[c.dataset.number]) return;
        if (c.style.gridColumn && c.style.gridRow)
          occupied.add(`${c.style.gridColumn},${c.style.gridRow}`);
      });
      return positions.find(p => !occupied.has(`${p.col},${p.row}`)) || null;
    }

    function _getExtendedPos(field) {
      // モバイル縦向き：送り先フィールドのカード数+1でレイアウトを決め空きを返す
      if (isMobileTouch) {
        let activeCount = 0;
        field.querySelectorAll('.karuta_card').forEach(c => {
          if (!c.dataset.hidden && !(c.dataset.number && takenCards[c.dataset.number])) activeCount++;
        });
        const { cols, rows } = _mobileLayout(activeCount + 1);
        _applyMobileFieldLayout(field, cols, rows);
        const positions = _buildMobilePositions(cols, rows);
        return _findFreePos(field, positions) || positions[positions.length - 1];
      }
      // mode1/2: 既存の段を横に広げて次の列位置を返す
      // mode1は常にrow1、mode2は自陣がrow2・敵陣がrow1（枚数の多い段）
      const rowMaxCol = {};
      field.querySelectorAll('.karuta_card').forEach(c => {
        if (c.dataset.hidden) return;
        const col = parseInt(c.style.gridColumn);
        const row = parseInt(c.style.gridRow);
        if (!isNaN(col) && !isNaN(row)) {
          rowMaxCol[row] = Math.max(rowMaxCol[row] || 0, col);
        }
      });
      const baseRow = (cardMode === 2 && field.id === 'pc_my_field') ? 2 : 1;
      // #karuta_container の max-width（css/karuta-taisen-pro-shared.css）に収まる
      // 1段あたりの最大列数。これを超える場合、表示範囲からはみ出さないよう次の段へ折り返す。
      // （札が1枚も減っていない＝段が既に満杯の状態で送り札を受けたときに発生していた不具合）
      const PC_FIELD_GAP = 8; // buildPcBoard の非モバイル時 cardGap と合わせる
      const CONTAINER_MAX_WIDTH = 900; // #karuta_container の max-width と合わせる
      const maxColsPerRow = Math.max(1, Math.floor((CONTAINER_MAX_WIDTH + PC_FIELD_GAP) / (currentCardWidth + PC_FIELD_GAP)));
      let targetRow = baseRow;
      while ((rowMaxCol[targetRow] || 0) >= maxColsPerRow) targetRow++;
      const newCol = (rowMaxCol[targetRow] || 0) + 1;
      const overallMaxCol = Math.max(newCol, ...Object.values(rowMaxCol), 0);
      field.style.gridTemplateColumns = `repeat(${overallMaxCol}, ${currentCardWidth}px)`;
      return { col: newCol, row: targetRow };
    }

    function _repackField(field, excludeCard) {
      if (cardMode === 3) return;
      if (isMobileTouch) {
        // モバイル：残り札数でレイアウトを決め、先頭から順に詰め直す
        const allCards = Array.from(field.querySelectorAll('.karuta_card'))
          .filter(c => c !== excludeCard && !c.dataset.hidden);
        const { cols, rows } = _mobileLayout(allCards.length);
        _applyMobileFieldLayout(field, cols, rows);
        const positions = _buildMobilePositions(cols, rows);
        allCards.forEach((card, i) => {
          const pos = positions[i];
          if (pos) { card.style.gridColumn = String(pos.col); card.style.gridRow = String(pos.row); }
        });
        return;
      }
      const byRow = (row) => Array.from(field.querySelectorAll('.karuta_card'))
        .filter(c => c !== excludeCard && !c.dataset.hidden && parseInt(c.style.gridRow) === row)
        .sort((a, b) => parseInt(a.style.gridColumn) - parseInt(b.style.gridColumn));

      if (cardMode === 1) {
        const cards = byRow(1);
        cards.forEach((c, i) => { c.style.gridColumn = String(i + 1); });
        field.style.gridTemplateColumns = `repeat(${Math.max(cards.length, 1)}, ${currentCardWidth}px)`;
      } else if (cardMode === 2) {
        const isMyField = field.id === 'pc_my_field';
        const bottomRow = isMyField ? 2 : 1;
        const topRow = isMyField ? 1 : 2;
        let bottomCards = byRow(bottomRow);
        let topCards = byRow(topRow);
        // 下段が空になったら上段を下段へ移動
        if (bottomCards.length === 0 && topCards.length > 0) {
          topCards.forEach(c => { c.style.gridRow = String(bottomRow); });
          bottomCards = topCards; topCards = [];
        }
        bottomCards.forEach((c, i) => { c.style.gridColumn = String(i + 1); });
        const bc = bottomCards.length;
        if (topCards.length > 0) {
          const tc = topCards.length;
          const start = Math.max(1, Math.floor((bc - tc) / 2) + 1);
          topCards.forEach((c, i) => { c.style.gridColumn = String(start + i); });
        }
        field.style.gridTemplateColumns = `repeat(${Math.max(bc, 1)}, ${currentCardWidth}px)`;
      }
    }

    function _placeSentCardAuto(card, field, positions) {
      card.classList.remove('incoming-sent-card');
      const occupied = new Set();
      field.querySelectorAll('.karuta_card').forEach(c => {
        if (c === card || c.dataset.hidden) return;
        if (c.style.gridColumn && c.style.gridRow)
          occupied.add(`${c.style.gridColumn},${c.style.gridRow}`);
      });
      for (const pos of positions) {
        const key = `${pos.col},${pos.row}`;
        if (!occupied.has(key)) {
          card.style.gridColumn = String(pos.col);
          card.style.gridRow = String(pos.row);
          return;
        }
      }
    }

    function _showArrangePlaceholders() {
      const field = document.getElementById('pc_my_field');
      if (!field) return;
      const occupied = new Set();
      field.querySelectorAll('.karuta_card').forEach(c => {
        if (c === _arrDragCard || c.dataset.hidden) return;
        const col = c.style.gridColumn, row = c.style.gridRow;
        if (col && row) occupied.add(`${col},${row}`);
      });
      const colMatch = field.style.gridTemplateColumns.match(/repeat\((\d+)/);
      const rowMatch = field.style.gridTemplateRows.match(/repeat\((\d+)/);
      const maxCol = colMatch ? parseInt(colMatch[1]) : (isMobileTouch ? 3 : (cardMode === 1 ? 6 : cardMode === 2 ? 8 : 14));
      const maxRow = isMobileTouch
        ? (rowMatch ? parseInt(rowMatch[1]) : 2)
        : (cardMode === 1 ? 1 : cardMode === 2 ? 2 : 3);
      for (let r = 1; r <= maxRow; r++) {
        for (let c = 1; c <= maxCol; c++) {
          if (cardMode === 3 && (c === 7 || c === 8)) continue;
          if (occupied.has(`${c},${r}`)) continue;
          const ph = document.createElement('div');
          ph.className = 'arr-placeholder';
          ph.style.gridColumn = c;
          ph.style.gridRow = r;
          ph.dataset.phCol = c;
          ph.dataset.phRow = r;
          field.appendChild(ph);
        }
      }
    }

    function _hideArrangePlaceholders() {
      document.querySelectorAll('#pc_my_field .arr-placeholder').forEach(el => el.remove());
    }

    function _startArrangeDrag(card, e) {
      _arrDragCard = card;
      _arrOrigRect = card.getBoundingClientRect();
      _arrStartX = e.clientX; _arrStartY = e.clientY;
      _arrMoved = false;
      const cs = window.getComputedStyle(card);
      _arrDragClone = card.cloneNode(true);
      _arrDragClone.className = 'karuta_card arr-drag-clone';
      Object.assign(_arrDragClone.style, {
        position: 'fixed',
        left: _arrOrigRect.left + 'px', top: _arrOrigRect.top + 'px',
        width: _arrOrigRect.width + 'px', height: _arrOrigRect.height + 'px',
        zIndex: '9999', opacity: '0.88', pointerEvents: 'none',
        background: cs.background, border: cs.border, borderRadius: cs.borderRadius,
        transform: 'rotate(2deg) scale(1.06)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.28)', transition: 'none'
      });
      document.body.appendChild(_arrDragClone);
      _showArrangePlaceholders();
      card.style.opacity = '0.25';
      document.addEventListener('pointermove', _onArrDragMove, { passive: false });
      document.addEventListener('pointerup', _onArrDragEnd);
      document.addEventListener('pointercancel', _onArrDragEnd);
    }

    function _onArrDragMove(e) {
      if (!_arrDragClone || !_arrOrigRect) return;
      e.preventDefault();
      const dx = e.clientX - _arrStartX, dy = e.clientY - _arrStartY;
      _arrDragClone.style.left = (_arrOrigRect.left + dx) + 'px';
      _arrDragClone.style.top = (_arrOrigRect.top + dy) + 'px';
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) _arrMoved = true;
      const target = _arrGetDropTarget(e.clientX, e.clientY);
      document.querySelectorAll('#pc_my_field .drop-target').forEach(el => el.classList.remove('drop-target'));
      if (target) target.classList.add('drop-target');
    }

    function _onArrDragEnd(e) {
      document.removeEventListener('pointermove', _onArrDragMove);
      document.removeEventListener('pointerup', _onArrDragEnd);
      document.removeEventListener('pointercancel', _onArrDragEnd);
      if (_arrDragClone) { _arrDragClone.remove(); _arrDragClone = null; }
      document.querySelectorAll('#pc_my_field .drop-target').forEach(el => el.classList.remove('drop-target'));
      if (_arrDragCard) {
        _arrDragCard.style.opacity = '';
        const droppedCard = _arrDragCard;
        if (_arrMoved && e.clientX !== undefined) {
          const target = _arrGetDropTarget(e.clientX, e.clientY);
          if (target && target !== droppedCard) {
            if (target.classList.contains('arr-placeholder')) {
              droppedCard.style.gridColumn = target.dataset.phCol;
              droppedCard.style.gridRow = target.dataset.phRow;
            } else {
              const col1 = droppedCard.style.gridColumn, row1 = droppedCard.style.gridRow;
              droppedCard.style.gridColumn = target.style.gridColumn;
              droppedCard.style.gridRow = target.style.gridRow;
              target.style.gridColumn = col1;
              target.style.gridRow = row1;
            }
          }
        }
        _arrDragCard = null;
        // 送り札配置完了チェック（一時保留エリアから正規の位置に移動したか）
        if (pendingCardPlacement && droppedCard === pendingPlacementCard) {
          const col = parseInt(droppedCard.style.gridColumn);
          const row = parseInt(droppedCard.style.gridRow);
          const maxRow = cardMode === 1 ? 1 : cardMode === 2 ? 2 : 3;
          // mode3: center gap(col7-8)が一時置き場 / mode1-2: maxRowを超えた行が一時置き場
          const isAtTempPos = cardMode === 3 ? (col === 7 || col === 8) : (row > maxRow);
          if (col && !isAtTempPos) {
            droppedCard.classList.remove('incoming-sent-card');
            pendingCardPlacement = false;
            pendingPlacementCard = null;
            const statusEl = document.getElementById('status_text');
            statusEl.style.color = '#B82343';
            statusEl.innerText = LANG.statusCardDisplay(currentSongIndex, totalCards);
            if (pendingAdvance) { pendingAdvance = false; setTimeout(advanceCpuGame, 800); }
            else if (sendCardCallback) { const cb = sendCardCallback; sendCardCallback = null; cb(); }
            else if (isPcGame) { scheduleCpuActions(); }
          }
        }
      }
      _hideArrangePlaceholders();
      _arrOrigRect = null;
    }

    function _arrGetDropTarget(x, y) {
      const el = document.elementFromPoint(x, y);
      const field = document.getElementById('pc_my_field');
      if (el && field) {
        const card = el.closest('.karuta_card');
        if (card && field.contains(card) && card !== _arrDragCard && !card.dataset.hidden) return card;
        const ph = el.closest('.arr-placeholder');
        if (ph && field.contains(ph)) return ph;
      }
      if (!field) return null;
      const fr = field.getBoundingClientRect();
      if (x < fr.left || x > fr.right || y < fr.top || y > fr.bottom) return null;
      let closest = null, closestDist = Infinity;
      field.querySelectorAll('.karuta_card, .arr-placeholder').forEach(el => {
        if (el === _arrDragCard || el.dataset.hidden) return;
        const r = el.getBoundingClientRect();
        const dist = Math.hypot(x - (r.left + r.right) / 2, y - (r.top + r.bottom) / 2);
        if (dist < closestDist) { closestDist = dist; closest = el; }
      });
      return closestDist < 60 ? closest : null;
    }

    // 送り先フィールドが25枚未満のときのみ送り可能
    function canSendTo(field) {
      const limit = field === 'enemy' ? _initialEnemyCount : _initialMyCount;
      return Object.keys(cardFields).filter(k => cardFields[k] === field && !takenCards[k]).length < limit;
    }

    function checkPcWin() {
      if (!isPcGame) return false;
      const myLeft = Object.keys(cardFields).filter(k => cardFields[k] === 'mine' && !takenCards[k]).length;
      const enemyLeft = Object.keys(cardFields).filter(k => cardFields[k] === 'enemy' && !takenCards[k]).length;
      return myLeft === 0 || enemyLeft === 0;
    }

    function advanceCpuGame() {
      if (pendingSendCard || pendingCardPlacement) { pendingAdvance = true; return; }
      if (isPcGame && checkPcWin()) { scheduleEndGame(); return; }
      pendingAdvance = false;
      // 空札タイマーが残っている場合は即クリアして二重進行を防ぐ
      emptyCardTimers.forEach(t => clearTimeout(t));
      emptyCardTimers = [];
      if (!isPcGame && Object.keys(takenCards).length >= totalCards) { endCpuGame(); return; }
      currentSongIndex++;
      if (currentSongIndex >= totalCards) { endCpuGame(); return; }
      document.getElementById('status_text').innerText = LANG.statusCardDisplay(currentSongIndex, totalCards);
      document.getElementById('status_text').style.color = '#B82343';
      playSongByIndex(currentSongIndex);
      scheduleCpuActions();
    }

    function startMemorizationCountdown(totalSec, onFinish) {
      const timerEl = document.getElementById('memory_countdown_timer');
      const skipBtn = document.getElementById('memory_skip_btn');
      const memoryRow = document.getElementById('memory_info_row');

      let remaining = totalSec;
      memoryTimerActive = true;

      function formatTime(s) {
        const m = Math.floor(s / 60);
        const ss = s % 60;
        return `${m}:${ss.toString().padStart(2, '0')}`;
      }

      timerEl.innerText = formatTime(remaining);
      if (memoryRow) memoryRow.style.display = 'flex';

      const interval = setInterval(() => {
        remaining--;
        timerEl.innerText = formatTime(remaining);
        if (remaining <= 0) { clearInterval(interval); finishMemorization(); }
      }, 1000);

      function finishMemorization() {
        memoryTimerActive = false;
        if (memoryRow) memoryRow.style.display = 'none';
        skipBtn.onclick = null;
        onFinish();
      }
      skipBtn.onclick = () => { clearInterval(interval); finishMemorization(); };
    }

    // ===== レスポンシブカードスケーリング（スマホのみ） =====
    function fitCardsToScreen() {
      const container = document.getElementById('karuta_container');
      if (!container.children.length) return;

      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      // 横向き・スマホ縦向きはカードサイズを事前計算済みのためズーム不要
      if (isLandscape || isMobileTouch) {
        container.style.zoom = '';
        return;
      }

      container.style.zoom = '';
      void container.offsetWidth;

      const naturalW = container.scrollWidth;
      const naturalH = container.scrollHeight;
      if (!naturalW || !naturalH) return;

      const availW = document.documentElement.clientWidth - 4;

      let occupiedH = 0;
      ['player_info', 'status_text'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none') return;
        occupiedH += el.offsetHeight + parseFloat(cs.marginTop || 0) + parseFloat(cs.marginBottom || 0);
      });
      const footer = document.querySelector('footer');
      if (footer) {
        const fcs = getComputedStyle(footer);
        occupiedH += (fcs.position === 'fixed' || fcs.position === 'sticky') ? footer.offsetHeight : 20;
      } else {
        occupiedH += 20;
      }
      const availH = window.innerHeight - occupiedH - 4;

      const scaleW = availW / naturalW;
      const scaleH = availH / naturalH;
      const scale = Math.min(scaleW, scaleH);

      if (Math.abs(scale - 1.0) < 0.01) return;
      container.style.zoom = scale;
    }

    window.addEventListener('resize', () => {
      if (document.getElementById('karuta_container').children.length > 0) fitCardsToScreen();
    });

    function initializeCpuGame() {
      // 暗記フェーズ内で初期化済み。互換性のため残す。
    }

    function scheduleCpuActions() {
      cpuTimers.forEach(t => clearTimeout(t));
      cpuTimers = [];
      if (isGameOver || currentSongIndex >= totalCards) return;
      const correctCard = playOrder[currentSongIndex];
      // 空札：場にない札はCPUも取れない
      if (isPcGame && !fieldCardSet.has(String(correctCard))) return;
      const settings = CPU_SETTINGS[cpuDifficulty];
      const kimarijiDelay = _getKimarijiDelay(correctCard);
      cpuPlayers.forEach(cpuId => {
        if (takenCards[correctCard]) return;
        const willTakeCorrect = Math.random() < settings.accuracy;
        const reactionOffset = settings.reactionOffsetMin + Math.random() * (settings.reactionOffsetMax - settings.reactionOffsetMin);
        const reactionTime = kimarijiDelay + reactionOffset;
        const timer = setTimeout(() => {
          if (isGameOver || takenCards[correctCard]) return;
          if (pendingSendCard || pendingCardPlacement) {
            // 送り札・配置待ち中はCPUアクションを少し遅らせて再試行
            const retryTimer = setTimeout(() => {
              if (isGameOver || takenCards[correctCard]) return;
              if (pendingSendCard || pendingCardPlacement) {
                // まだ待機中 → pendingAdvance を立てて解除側に委ねる
                pendingAdvance = true;
                return;
              }
              if (willTakeCorrect) {
                cpuTakeCard(cpuId, correctCard);
              } else {
                const available = selectedSongs.filter(s => !takenCards[s] && s !== correctCard);
                if (available.length > 0) {
                  const wrongCard = available[Math.floor(Math.random() * available.length)];
                  const sameField = cardFields[String(correctCard)] === cardFields[String(wrongCard)];
                  cpuMistake(cpuId, wrongCard, sameField);
                } else {
                  // 取れる札がない場合は次へ進める
                  setTimeout(advanceCpuGame, 800);
                }
              }
            }, 1200);
            cpuTimers.push(retryTimer);
            return;
          }
          if (willTakeCorrect) {
            cpuTakeCard(cpuId, correctCard);
          } else {
            const available = selectedSongs.filter(s => !takenCards[s] && s !== correctCard);
            if (available.length > 0) {
              const wrongCard = available[Math.floor(Math.random() * available.length)];
              const sameField = cardFields[String(correctCard)] === cardFields[String(wrongCard)];
              cpuMistake(cpuId, wrongCard, sameField);
            }
          }
        }, reactionTime);
        cpuTimers.push(timer);
      });
    }

    function cpuTakeCard(cpuId, cardNumber) {
      if (takenCards[cardNumber] || isGameOver) return;
      const tookFromPlayerField = isPcGame && cardFields[cardNumber] === 'mine';
      takenCards[cardNumber] = cpuId;
      showTakenCardFlash(cardNumber);
      updateBoardStateCpu();
      // 敵陣が空 → CPUの勝ち（送り札より優先）
      if (isPcGame) {
        const enemyLeft = Object.keys(cardFields).filter(k => cardFields[k] === 'enemy' && !takenCards[k]).length;
        if (enemyLeft === 0) { scheduleEndGame(); return; }
      }
      if (tookFromPlayerField) {
        // CPU が自陣（プレイヤー側）から取った → 敵陣から1枚自陣へ送る
        // cpuSendToMyField が mode3 で pendingCardPlacement を立てる場合があるため、
        // advanceCpuGame はその完了後に呼ぶ。pendingAdvance フラグ経由で安全に連鎖させる。
        setTimeout(() => {
          cpuSendToMyField();
          if (pendingCardPlacement) {
            pendingAdvance = true;
          } else {
            cpuTimers.push(setTimeout(advanceCpuGame, 1000));
          }
        }, 500);
        return;
      }
      if (isPcGame && checkPcWin()) { scheduleEndGame(); return; }
      cpuTimers.push(setTimeout(advanceCpuGame, 1500));
    }

    function cpuMistake(cpuId, cardNumber, nopenalty = false) {
      const statusEl = document.getElementById('status_text');
      const originalText = statusEl.innerText;
      const originalColor = statusEl.style.color;
      missAudio.currentTime = 0; missAudio.play().catch(() => { });
      const el = document.querySelector(`.karuta_card[data-number="${cardNumber}"]`);
      if (el && !el.classList.contains('taken')) {
        el.style.border = "3px solid #f39c12"; el.style.transform = "scale(1.05)";
        setTimeout(() => { el.style.border = ""; el.style.transform = ""; }, 500);
      }
      // 正解と同じ陣の札をさわった → お手付きなし、フラッシュのみ
      if (nopenalty) {
        if (isPcGame) {
          const correctCardNow = playOrder[currentSongIndex];
          setTimeout(() => {
            if (!takenCards[correctCardNow] && !pendingSendCard && !pendingCardPlacement) scheduleCpuActions();
          }, 700);
        } else setTimeout(() => { statusEl.innerText = originalText; statusEl.style.color = originalColor; }, 1000);
        return;
      }
      statusEl.innerText = LANG.statusRobotMistake;
      statusEl.style.color = "#f39c12";
      if (isPcGame) {
        // ロボットのお手付き → プレイヤーが自陣の1枚を敵陣に送れる（その後ゲーム続行）
        const correctCardAtMistake = playOrder[currentSongIndex]; // タイマー発火前に正解が取られた場合の判定用
        setTimeout(() => {
          // 正解がまだ取られていない場合のみ再スケジュール（取得済みなら advanceCpuGame が既に走っている）
          if (!takenCards[correctCardAtMistake]) scheduleCpuActions();
          const myCards = Object.keys(cardFields).filter(k => cardFields[k] === 'mine' && !takenCards[k]);
          // ① pendingSendCard が true: プレイヤーが敵陣から正解を取った直後→上書きしない
          // ② correctCardAtMistake 取得済み: タイマー発火前にプレイヤー/CPUが正解を取った→ペナルティ不要
          if (myCards.length > 0 && !pendingSendCard && !takenCards[correctCardAtMistake]) {
            showPcSendCardSelection(() => {
              statusEl.innerText = originalText;
              statusEl.style.color = originalColor;
            });
          } else {
            statusEl.innerText = originalText;
            statusEl.style.color = originalColor;
          }
        }, 700);
        return;
      }
      setTimeout(() => { statusEl.innerText = originalText; statusEl.style.color = originalColor; }, 1000);
    }

    function playSongByIndex(index) {
      if (isGameOver || index >= totalCards) return;
      const num = playOrder[index];
      // 同じ曲・同じindex の再呼び出しのみスキップ（indexが進んでいれば同番号でも再生する）
      if (currentSongNumber === num && currentSongIndex === index) return;
      currentSongNumber = num;
      const emptyNotice = document.getElementById('empty_card_notice');
      if (emptyNotice) emptyNotice.style.display = 'none';
      // 上の句タイプライター：前の句をクリアして新しい句を表示
      _stopTypewriter();
      const kamiEl = document.getElementById('kami_no_ku_display');
      if (kamiEl) { kamiEl.textContent = ''; kamiEl.classList.add('done'); }
      if (showKaminoKu && kamiEl) {
        const kamiText = _getKaminoKu(num);
        if (kamiText) _startTypewriter(kamiText, kamiEl);
      }
      globalAudio.pause();
      globalAudio.src = audioUrlCache[num];
      globalAudio.play().then(() => {
        document.getElementById('audio_resume_btn').style.display = 'none';
      }).catch((err) => {
        if (!isGameOver && err.name === 'NotAllowedError') document.getElementById('audio_resume_btn').style.display = 'block';
      });
      // 空札：3秒後にメッセージ0.5秒表示→次のターンへ
      if (isPcGame && !fieldCardSet.has(String(num))) {
        const t1 = setTimeout(() => {
          if (!isGameOver && emptyNotice) emptyNotice.style.display = 'block';
          const kamiElT = document.getElementById('kami_no_ku_display');
          if (kamiElT) kamiElT.style.display = 'none';
        }, 3000);
        const t2 = setTimeout(() => {
          if (emptyNotice) emptyNotice.style.display = 'none';
          const kamiElT2 = document.getElementById('kami_no_ku_display');
          if (kamiElT2) kamiElT2.style.display = '';
          if (!isGameOver) advanceCpuGame();
        }, 3500);
        emptyCardTimers.push(t1, t2);
      }
    }

    function handleCardClick(num) {
      if (isGameOver) return;

      if (isArrangeMode && isPcGame) return;

      // PC 送り札選択モード
      if (pendingSendCard) {
        if (isPcGame && cardFields[num] === 'mine') {
          const el = document.querySelector(`.karuta_card[data-number="${num}"]`);
          if (el && !el.classList.contains('taken')) executeSendCard(num);
        }
        return;
      }

      if (localPenaltyTimeout) return;
      const cardEl = document.querySelector(`.karuta_card[data-number="${num}"]`);
      if (cardEl && (cardEl.dataset.hidden || cardEl.classList.contains('taken') || cardEl.classList.contains('taken-by-me') || cardEl.classList.contains('taken-by-others'))) return;

      if (String(num) === String(currentSongNumber)) {
        tapAudio.currentTime = 0; tapAudio.play().catch(() => { });
        if (isCpuMode) {
          if (takenCards[num]) return; // ロボットが既に取った札は無効（PCモードでは視覚的フラグの付与が遅延するためここで判定）
          const tookFromEnemy = isPcGame && cardFields[num] === 'enemy';
          takenCards[num] = myId;
          showTakenCardFlash(num);
          updateBoardStateCpu();
          cpuTimers.forEach(t => clearTimeout(t));
          cpuTimers = [];
          // 自陣が空 → プレイヤーの勝ち（送り札より優先）
          if (isPcGame) {
            const myLeft = Object.keys(cardFields).filter(k => cardFields[k] === 'mine' && !takenCards[k]).length;
            if (myLeft === 0) { scheduleEndGame(); return; }
          }
          if (isPcGame && tookFromEnemy && canSendTo('enemy')) {
            // 敵陣から取った → 自陣から1枚送る
            const myRemaining = Object.keys(cardFields).filter(k => cardFields[k] === 'mine' && !takenCards[k]);
            if (myRemaining.length > 0) {
              // sendCardSelection 中に advanceCpuGame が二重起動しないよう pendingAdvance をリセット
              pendingAdvance = false;
              showPcSendCardSelection(() => setTimeout(advanceCpuGame, 800));
              return;
            }
          }
          // 送り札なしで敵陣が空になった場合など残余チェック
          if (isPcGame && checkPcWin()) { scheduleEndGame(); return; }
          setTimeout(advanceCpuGame, 1500);
        }
      } else {
        if (isPcGame && isCpuMode) {
          // 新ルール：お手付き判定
          // ・空札クリック
          // ・正解が敵陣なのに自陣をクリック
          // ・正解が自陣なのに敵陣をクリック
          const correctNum = String(currentSongNumber);
          const isEmptyCard = !fieldCardSet.has(correctNum);           // 真の空札
          const isStillOnField = !isEmptyCard && !takenCards[correctNum]; // 場にあって未取得
          const clickedField = cardFields[String(num)];
          const correctField = isEmptyCard ? null : cardFields[correctNum];
          // ペナルティ条件:
          //   空札のとき → 自陣・相手陣に関わらず無条件でペナルティ
          //   正解と異なる陣の札をさわる → ペナルティ（送り札配置待ち中はスキップ）
          //   正解と同じ陣の札をさわる → セーフ
          const isPenalty =
            isEmptyCard ||
            (!pendingCardPlacement && isStillOnField && clickedField !== correctField);
          if (isPenalty) {
            missAudio.currentTime = 0; missAudio.play().catch(() => { });
            const statusEl = document.getElementById('status_text');
            statusEl.innerText = LANG.statusPlayerFalseStart;
            statusEl.style.color = '#e74c3c';
            // お手付き後 1.5秒間はクリックを受け付けない
            localPenaltyTimeout = setTimeout(() => { localPenaltyTimeout = null; }, 1500);
            cpuSendToMyField();
            // mode3 では cpuSendToMyField が pendingCardPlacement を立てることがある。
            // その場合は配置完了後にゲームを再開するよう pendingAdvance を立てる。
            if (pendingCardPlacement) {
              pendingAdvance = true;
            }
            setTimeout(() => {
              if (!isGameOver && !pendingSendCard && !pendingCardPlacement) {
                statusEl.style.color = '#B82343';
                statusEl.innerText = LANG.statusCardDisplay(currentSongIndex, totalCards);
              }
            }, 1800);
          }
          // 同じ陣地内の別の札クリック → お手付きでない、何もしない
        }
      }
    }

    let _prevMyLeft = -1; // 前回の自陣枚数（送り札リセット検出用）

    function updateCardIndicator() {
      if (!isPcGame) return;
      if (_scheduledGameWin !== null) return;
      if (_prevLeader === null) {
        ['ci_player_label', 'ci_my_bar', 'ci_my_count', 'ci_badge', 'ci_enemy_bar', 'ci_enemy_count', 'others_icons'].forEach(id => {
          const el = document.getElementById(id); if (el) el.style.display = '';
        });
      }
      const myLeft = Object.keys(cardFields).filter(k => cardFields[k] === 'mine' && !takenCards[k]).length;
      const enemyLeft = Object.keys(cardFields).filter(k => cardFields[k] === 'enemy' && !takenCards[k]).length;
      const myEmpty = Math.max(0, _initialMyCount - myLeft);
      const enemyEmpty = Math.max(0, _initialEnemyCount - enemyLeft);

      // 送り札を受け取って自陣が増えた場合は「あと一息」フラグをリセット
      if (_prevMyLeft > 0 && myLeft > _prevMyLeft) {
        _shownAtoHitoki = false;
      }
      _prevMyLeft = myLeft;

      const myBarEl = document.getElementById('ci_my_bar');
      const myCountEl = document.getElementById('ci_my_count');
      const badgeEl = document.getElementById('ci_badge');
      const enBarEl = document.getElementById('ci_enemy_bar');
      const enCountEl = document.getElementById('ci_enemy_count');
      if (!myBarEl) return;

      myBarEl.innerHTML = '■'.repeat(myLeft) + `<span class="ci-empty">${'□'.repeat(myEmpty)}</span>`;
      myCountEl.textContent = myLeft + LANG.countSuffix;
      enBarEl.innerHTML = '■'.repeat(enemyLeft) + `<span class="ci-empty">${'□'.repeat(enemyEmpty)}</span>`;
      enCountEl.textContent = enemyLeft + LANG.countSuffix;

      const leader = myLeft < enemyLeft ? 'mine' : enemyLeft < myLeft ? 'enemy' : 'tied';
      const isLastOne = myLeft === 1 && enemyLeft === 1;
      const isReversal = !isLastOne && _prevLeader && _prevLeader !== 'tied' && _prevLeader !== 'lastone' && leader !== 'tied' && leader !== _prevLeader;

      // myLeft === 1 かつ enemyLeft > 1 のときだけ「あと一息」を表示
      if (myLeft === 1 && enemyLeft > 1 && !_shownAtoHitoki && _prevLeader !== null) {
        _shownAtoHitoki = true;
        if (_reversalTimer) { clearTimeout(_reversalTimer); _reversalTimer = null; }
        badgeEl.textContent = LANG.badgeAlmostWon;
        badgeEl.className = 'ci-badge advantage-mine';
        badgeEl.style.display = '';
        _reversalTimer = setTimeout(() => { _reversalTimer = null; updateCardIndicator(); }, 2000);
        _prevLeader = leader;
        return;
      }

      if (isLastOne) {
        if (_reversalTimer) { clearTimeout(_reversalTimer); _reversalTimer = null; }
        _setBadgeState(badgeEl, 'lastone');
      } else if (isReversal && !_reversalTimer) {
        badgeEl.textContent = LANG.badgeReversal;
        badgeEl.className = 'ci-badge ' + (leader === 'mine' ? 'advantage-reversal-good' : 'advantage-reversal-bad');
        _reversalTimer = setTimeout(() => {
          _setBadgeState(badgeEl, leader);
          _reversalTimer = null;
        }, 2000);
      } else if (!_reversalTimer) {
        _setBadgeState(badgeEl, leader);
      }
      _prevLeader = isLastOne ? 'lastone' : leader;
    }

    function _setBadgeState(el, leader) {
      if (leader === 'lastone') { el.textContent = LANG.badgeLastOne; el.className = 'ci-badge advantage-reversal'; }
      else if (leader === 'mine') { el.textContent = LANG.badgeYouLead; el.className = 'ci-badge advantage-mine'; }
      else if (leader === 'enemy') { el.textContent = LANG.badgeOppLeads; el.className = 'ci-badge advantage-enemy'; }
      else { el.textContent = LANG.badgeEven; el.className = 'ci-badge advantage-even'; }
    }

    // ── Pixi.js 演出 ─────────────────────────────────────────────
    let _pixiApp = null;

    function _getPixiApp() {
      if (_pixiApp) return _pixiApp;
      try {
        _pixiApp = new PIXI.Application({
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundAlpha: 0,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
        });
        const cv = _pixiApp.view;
        Object.assign(cv.style, {
          position: 'fixed', top: '0', left: '0',
          zIndex: '9999', pointerEvents: 'none',
        });
        document.body.appendChild(cv);
        window.addEventListener('resize', () => {
          if (_pixiApp) _pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
        });
      } catch (e) {
        console.warn('Pixi.js 初期化失敗:', e);
        _pixiApp = null;
      }
      return _pixiApp;
    }

    function _flyCardEffect(rect, withPetals = true) {
      const app = _getPixiApp();
      if (!app) return;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const W = rect.width, H = rect.height;

      // カードコンテナ
      const root = new PIXI.Container();
      root.x = cx;
      root.y = cy;

      // カード面（和紙風）
      const face = new PIXI.Graphics();
      face.beginFill(0xFFFBF0);
      face.lineStyle(2, 0xC8A448, 1);
      face.drawRoundedRect(-W / 2, -H / 2, W, H, 6);
      face.endFill();
      root.addChild(face);

      // 光沢
      const shine = new PIXI.Graphics();
      shine.beginFill(0xFFFFFF, 0.35);
      shine.drawRoundedRect(-W / 2 + 4, -H / 2 + 4, W * 0.28, H - 8, 3);
      shine.endFill();
      root.addChild(shine);

      // 金枠グロー
      const glow = new PIXI.Graphics();
      glow.lineStyle(8, 0xFFD700, 0.9);
      glow.drawRoundedRect(-W / 2 - 4, -H / 2 - 4, W + 8, H + 8, 10);
      root.addChild(glow);

      app.stage.addChild(root);

      // 桜の花びらパーティクル（プレイヤーが取ったときのみ）
      const sparks = [];
      if (withPetals) {
        const SAKURA = [
          0xFFB7C5, 0xFFD0DA, 0xFF8FAB, 0xFFC0CB,
          0xFF69B4, 0xFFE4E8, 0xDE5B8A, 0xFFCDD5,
          0xF4A7B9, 0xFF4D79,
        ];
        for (let i = 0; i < 40; i++) {
          const g = new PIXI.Graphics();
          const c = SAKURA[Math.floor(Math.random() * SAKURA.length)];
          const s = 0.75 + Math.random() * 0.85;
          const pw = 11 * s, ph = 18 * s;
          g.beginFill(c, 0.82 + Math.random() * 0.18);
          g.moveTo(0, ph / 2);
          g.bezierCurveTo(pw / 2, ph / 4, pw / 2, -ph / 8, 1.8, -ph / 2 + 3.5);
          g.quadraticCurveTo(0, -ph / 2 - 2, -1.8, -ph / 2 + 3.5);
          g.bezierCurveTo(-pw / 2, -ph / 8, -pw / 2, ph / 4, 0, ph / 2);
          g.endFill();
          g.beginFill(0xFFFFFF, 0.18);
          g.drawEllipse(pw * 0.08, -ph * 0.05, pw * 0.18, ph * 0.32);
          g.endFill();

          const angle = (i / 40) * Math.PI * 2 + (Math.random() - 0.5) * 0.9;
          const speed = 3 + Math.random() * 10;
          g.vx = Math.cos(angle) * speed;
          g.vy = Math.sin(angle) * speed - 2.5;
          g.gravity = 0.18;
          g.flutter = 0.6 + Math.random() * 1.2;
          g.fp = Math.random() * Math.PI * 2;
          g.rotSpeed = (Math.random() - 0.5) * 0.12;
          g.x = cx + (Math.random() - 0.5) * W;
          g.y = cy + (Math.random() - 0.5) * H;
          g.rotation = Math.random() * Math.PI * 2;
          app.stage.addChild(g);
          sparks.push(g);
        }
      }

      // 飛ぶ方向（カードの画面内位置から決定）
      const dirX = cx < window.innerWidth / 2 ? -1 : 1;
      const inTop = cy < window.innerHeight / 2;
      const DEST_X = dirX * (window.innerWidth * 0.9 + W);
      const DEST_Y = inTop ? -window.innerHeight * 0.55 : window.innerHeight * 0.6;

      let frame = 0;
      const DUR = 52;

      const tick = () => {
        frame++;
        const t = Math.min(frame / DUR, 1);
        const et = 1 - Math.pow(1 - t, 2); // ease-out

        root.x = cx + DEST_X * et;
        root.y = cy + DEST_Y * et + (inTop ? -80 : 80) * Math.sin(t * Math.PI);
        root.rotation = dirX * t * Math.PI * 2.5;
        root.scale.set(1 + 0.35 * Math.sin(t * Math.PI));
        root.alpha = t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45;

        sparks.forEach(p => {
          // 横ゆれ（サイン波）でふわふわ感を演出
          p.x += p.vx + Math.sin(frame * 0.12 + p.fp) * p.flutter;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.98;
          p.alpha -= 0.018;
          p.rotation += p.rotSpeed;
        });

        if (frame >= DUR) {
          app.ticker.remove(tick);
          app.stage.removeChild(root);
          root.destroy({ children: true });
          sparks.forEach(p => { app.stage.removeChild(p); p.destroy(); });
        }
      };
      app.ticker.add(tick);
    }
    function _sakuraEndGame() {
      const overlay = document.createElement('div');
      overlay.id = 'medetashi-overlay';
      overlay.innerHTML = '<img src="../img/dango_win.webp" alt="喜ぶ猫キャラ"><span>' + LANG.endGameVictory + '</span>';
      document.body.appendChild(overlay);
      overlay.addEventListener('animationend', () => overlay.remove());

      const app = _getPixiApp();
      if (!app) return;
      const SW = window.innerWidth, SH = window.innerHeight;
      const SAKURA = [
        0xFFB7C5, 0xFFD0DA, 0xFF8FAB, 0xFFC0CB,
        0xFF69B4, 0xFFE4E8, 0xDE5B8A, 0xFFCDD5,
        0xF4A7B9, 0xFF4D79,
      ];

      function burst(ox, oy, count) {
        const petals = [];
        for (let i = 0; i < count; i++) {
          const g = new PIXI.Graphics();
          const c = SAKURA[Math.floor(Math.random() * SAKURA.length)];
          const s = 0.9 + Math.random() * 1.1;
          const pw = 12 * s, ph = 19 * s;
          g.beginFill(c, 0.82 + Math.random() * 0.18);
          g.moveTo(0, ph / 2);
          g.bezierCurveTo(pw / 2, ph / 4, pw / 2, -ph / 8, 1.8, -ph / 2 + 3.5);
          g.quadraticCurveTo(0, -ph / 2 - 2, -1.8, -ph / 2 + 3.5);
          g.bezierCurveTo(-pw / 2, -ph / 8, -pw / 2, ph / 4, 0, ph / 2);
          g.endFill();
          g.beginFill(0xFFFFFF, 0.18);
          g.drawEllipse(pw * 0.08, -ph * 0.05, pw * 0.18, ph * 0.32);
          g.endFill();

          const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
          const speed = 5 + Math.random() * 14;
          g.vx = Math.cos(angle) * speed;
          g.vy = Math.sin(angle) * speed;
          g.gravity = 0.22;
          g.flutter = 0.7 + Math.random() * 1.3;
          g.fp = Math.random() * Math.PI * 2;
          g.rotSpeed = (Math.random() - 0.5) * 0.13;
          g.x = ox; g.y = oy;
          g.rotation = Math.random() * Math.PI * 2;
          g.alpha = 1;
          app.stage.addChild(g);
          petals.push(g);
        }
        let f = 0;
        const tick = () => {
          f++;
          petals.forEach(p => {
            p.x += p.vx + Math.sin(f * 0.12 + p.fp) * p.flutter;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.alpha -= 0.011;
            p.rotation += p.rotSpeed;
          });
          if (f >= 130) {
            app.ticker.remove(tick);
            petals.forEach(p => { app.stage.removeChild(p); p.destroy(); });
          }
        };
        app.ticker.add(tick);
      }

      burst(SW * 0.5, SH * 0.5, 80);
    }

    function _defeatInkEffect() {
      const app = _getPixiApp();
      if (!app) return;
      const SW = window.innerWidth, SH = window.innerHeight;

      // 60fps想定: フェードイン0.6s・本編3.8s・フェードアウト0.6s = 計5秒
      const F_FADEIN = 36;
      const F_HOLD = 264;
      const F_FADEOUT = 300;

      const container = new PIXI.Container();
      app.stage.addChild(container);

      const overlayG = new PIXI.Graphics();
      container.addChild(overlayG);
      const rainG = new PIXI.Graphics();
      container.addChild(rainG);
      const rippleG = new PIXI.Graphics();
      container.addChild(rippleG);

      // 雨粒（画面全体を斜めに流れる細い線）
      const drops = Array.from({ length: 120 }, () => ({
        x: Math.random() * SW * 1.4 - SW * 0.2,
        y: Math.random() * SH,
        speed: 10 + Math.random() * 10,
        len: 12 + Math.random() * 20,
        slant: 0.05 + Math.random() * 0.08,
        alpha: 0.18 + Math.random() * 0.42,
      }));

      // 波紋プール
      const ripples = [];
      // 波紋が広がる縦範囲（画面下半分を「水たまり」に見立てる）
      const PUDDLE_TOP = SH * 0.55;
      let nextSpawn = 0;

      function spawnRipple() {
        ripples.push({
          x: SW * 0.02 + Math.random() * SW * 0.96,
          y: PUDDLE_TOP + Math.random() * (SH - PUDDLE_TOP) * 0.9,
          r: 0,
          maxR: 15 + Math.random() * 55,
          alpha: 0.55 + Math.random() * 0.38,
          scaleY: 0.18 + Math.random() * 0.2, // 楕円の縦圧縮（俯瞰の水面感）
        });
      }

      // ── 縦書きテキスト（DOM） ────────────────────────────────────
      const textEl = document.createElement('div');
      textEl.style.cssText = [
        'position:fixed',
        'top:50%', 'left:50%',
        'transform:translate(-50%,-50%)',
        'display:flex',
        `flex-direction:${LANG.defeatFlexDirection || 'column'}`,
        'align-items:center',
        'gap:0',
        'font-family:"Noto Serif JP",serif',
        'font-weight:700',
        'color:#333',
        'text-shadow:0 0 2px #fff,0 0 4px #fff,3px 3px 0 #fff,-3px 3px 0 #fff,3px -3px 0 #fff,-3px -3px 0 #fff,3px 0 0 #fff,-3px 0 0 #fff,0 3px 0 #fff,0 -3px 0 #fff,4px 0 0 #fff,-4px 0 0 #fff,0 4px 0 #fff,0 -4px 0 #fff',
        ...LANG.defeatTextStyles,
        'pointer-events:none',
        'z-index:10000',
        'opacity:1',
        'transition:opacity 0.6s ease',
      ].join(';');

      const loseImgEl = document.createElement('img');
      loseImgEl.src = '../img/dango_lose.webp';
      loseImgEl.style.cssText = 'width:clamp(120px,40vw,200px);display:block;text-shadow:none;filter:none;';
      textEl.appendChild(loseImgEl);

      const loseTextEl = document.createElement('span');
      loseTextEl.textContent = LANG.defeatText;
      loseTextEl.style.cssText = [
        'display:block',
        'opacity:0',
        'transform:translateY(-10px)',
        'transition:opacity 0.55s ease, transform 0.55s ease',
        'transition-delay:0.5s',
      ].join(';');
      textEl.appendChild(loseTextEl);
      document.body.appendChild(textEl);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        textEl.querySelectorAll('span').forEach(s => {
          s.style.opacity = '1';
          s.style.transform = 'translateY(0)';
        });
      }));

      // ── メインループ ─────────────────────────────────────────────
      let f = 0;
      let textFadedOut = false;
      const tick = () => {
        f++;

        const master =
          f <= F_FADEIN ? f / F_FADEIN :
            f <= F_HOLD ? 1 :
              f <= F_FADEOUT ? 1 - (f - F_HOLD) / (F_FADEOUT - F_HOLD) : 0;

        // 薄暗いオーバーレイ（夜雨の暗さ）
        overlayG.clear();
        overlayG.beginFill(0x060818, 0.58 * master);
        overlayG.drawRect(0, 0, SW, SH);
        overlayG.endFill();

        // 波紋を定期生成（F_HOLDまで）
        if (f >= F_FADEIN && f < F_HOLD && f >= nextSpawn) {
          const n = 2 + Math.floor(Math.random() * 3);
          for (let k = 0; k < n; k++) spawnRipple();
          nextSpawn = f + 2 + Math.floor(Math.random() * 4);
        }

        // テキストをF_HOLDでフェードアウト開始（1回だけ）
        if (f >= F_HOLD && !textFadedOut) {
          textFadedOut = true;
          textEl.style.opacity = '0';
        }

        // 雨を描画
        rainG.clear();
        drops.forEach(d => {
          d.y += d.speed;
          d.x += d.speed * d.slant;
          if (d.y > SH + d.len) {
            d.x = Math.random() * SW * 1.4 - SW * 0.2;
            d.y = -d.len - Math.random() * 60;
          }
          rainG.lineStyle(1, 0x7a9ab8, d.alpha * master);
          rainG.moveTo(d.x, d.y);
          rainG.lineTo(d.x + d.len * d.slant, d.y + d.len);
        });
        rainG.lineStyle(0);

        // 波紋を描画
        rippleG.clear();
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          rp.r += (rp.maxR - rp.r) * 0.07 + 0.55;
          rp.alpha *= 0.962;
          if (rp.alpha < 0.02) { ripples.splice(i, 1); continue; }

          const a = rp.alpha * master;
          const ry = rp.r * rp.scaleY;
          rippleG.lineStyle(1.5, 0x7ab4cc, a);
          rippleG.drawEllipse(rp.x, rp.y, rp.r, ry);
          if (rp.r > 14) {
            rippleG.lineStyle(0.9, 0x9ccce0, a * 0.42);
            rippleG.drawEllipse(rp.x, rp.y, rp.r * 0.5, ry * 0.5);
          }
        }
        rippleG.lineStyle(0);

        if (f >= F_FADEOUT) {
          app.ticker.remove(tick);
          app.stage.removeChild(container);
          container.destroy({ children: true });
          if (textEl.parentNode) textEl.parentNode.removeChild(textEl);
        }
      };

      app.ticker.add(tick);
    }
    // ─────────────────────────────────────────────────────────────

    function updateBoardStateCpu() {
      const allPlayers = [myId, ...cpuPlayers];
      Object.keys(takenCards).forEach(num => {
        const el = document.querySelector(`.karuta_card[data-number="${num}"]`);
        if (!el || el.dataset.hidden) return;
        const takerId = takenCards[num];
        if (!el.classList.contains('taken')) {
          el.classList.add('taken'); // 即座に付与して二重取りを防ぐ
          if (isPcGame) {
            const rect = el.getBoundingClientRect();
            el.style.visibility = 'hidden';
            el.dataset.hidden = '1';
            const parentField = el.closest('#pc_enemy_field, #pc_my_field');
            if (parentField) _repackField(parentField, el);
            if (takerId === myId) {
              _flyCardEffect(rect, true);  // プレイヤー → 花びらあり
            } else {
              _flyCardEffect(rect, false); // ロボット → 花びらなし
              robotAudio.currentTime = 0;
              robotAudio.play().catch(() => { });
            }
          } else {
            el.classList.add('flash');
            setTimeout(() => el.classList.remove('flash'), 500);
          }
        }
        if (!isPcGame) {
          el.classList.add('taken', takerId === myId ? 'taken-by-me' : 'taken-by-others');
          if (!el.querySelector('.taker-icon')) {
            const badge = document.createElement('div');
            badge.className = 'taker-icon';
            badge.innerHTML = getIcon(takerId, allPlayers);
            badge.style = `position:absolute;top:-10px;right:-10px;font-size:1.4rem;background:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.3);z-index:10;opacity:1!important;`;
            el.appendChild(badge);
          }
        }
      });
      updateCardIndicator();
    }

    // ── 取られた札の一覧を結果画面に表示 ────────────────────────────
    // フォントサイズを縮小して枠内に収める（二分探索でリフロー回数を削減）・同期版（戻り値あり）
    function calcFitSize(textEl, faceEl, startPx, minPx) {
      const maxW = faceEl.clientWidth - 10;
      const maxH = faceEl.clientHeight - 10;
      let lo = minPx, hi = startPx, best = minPx;
      while (hi - lo > 0.5) {
        const mid = (lo + hi) / 2;
        textEl.style.fontSize = mid + 'px';
        if (textEl.scrollWidth <= maxW && textEl.scrollHeight <= maxH) {
          best = mid; lo = mid + 0.5;
        } else {
          hi = mid - 0.5;
        }
      }
      textEl.style.fontSize = best + 'px';
      return best;
    }

    function fitTextToFace(textEl, faceEl, startPx, minPx) {
      requestAnimationFrame(() => { calcFitSize(textEl, faceEl, startPx, minPx); });
    }

    function showMissedCards(takenCardsMap, winnerId) {
      const missed = Object.entries(takenCardsMap).filter(([, taker]) => taker !== winnerId);
      const section = document.getElementById('missed_cards_section');
      const list = document.getElementById('missed_cards_list');
      if (!missed.length) { section.style.display = 'none'; return; }

      list.innerHTML = '';
      missed.forEach(([num]) => {
        const song = Object.values(jsonData).find(s => String(s.number) === String(num));
        if (!song) return;

        const spaceToBreak = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '<br>');

        const wrapper = document.createElement('div');
        wrapper.className = 'missed-card-wrapper karuta_card';

        const inner = document.createElement('div');
        inner.className = 'missed-card-inner';

        const front = document.createElement('div');
        front.className = 'missed-card-front';
        const frontP = document.createElement('p');
        frontP.innerHTML = song.torihuda;
        front.appendChild(frontP);
        const kj = _getKimariji(num);
        if (kj) {
          const kjBadge = document.createElement('span');
          kjBadge.className = 'kimariji-badge';
          kjBadge.textContent = kj;
          front.appendChild(kjBadge);
        }

        const back = document.createElement('div');
        back.className = 'missed-card-back';

        const hyakunin = hyakuninData ? hyakuninData[String(num)] : null;
        const backContent = document.createElement('div');
        backContent.className = 'missed-back-content';

        if (hyakunin) {
          const utaP = document.createElement('p');
          utaP.className = 'missed-back-uta';
          utaP.innerHTML = spaceToBreak(hyakunin.first) + '<br>' + spaceToBreak(hyakunin.second);
          backContent.appendChild(utaP);
        } else {
          backContent.innerHTML = spaceToBreak(song.uta);
        }
        back.appendChild(backContent);

        inner.appendChild(front);
        inner.appendChild(back);
        wrapper.appendChild(inner);

        wrapper.addEventListener('click', () => wrapper.classList.toggle('flipped'));
        wrapper.addEventListener('touchstart', (e) => {
          e.preventDefault();
          wrapper.classList.toggle('flipped');
        }, { passive: false });

        list.appendChild(wrapper);
      });
      section.style.display = 'block';

      // レイアウト確定後にフォントを縮小
      requestAnimationFrame(() => {
        const wrappers = list.querySelectorAll('.missed-card-wrapper');

        // ① 全カードの表面フォントサイズを計算
        const frontSizes = [];
        wrappers.forEach(wrapper => {
          const front = wrapper.querySelector('.missed-card-front');
          const frontP = front.querySelector('p');
          const size = calcFitSize(frontP, front, 28, 6);
          frontSizes.push({ frontP, size });
        });

        // ② 最小フォントサイズに統一（全カードで同じ文字サイズにする）
        const minFrontSize = Math.min(...frontSizes.map(x => x.size));
        frontSizes.forEach(({ frontP }) => { frontP.style.fontSize = minFrontSize + 'px'; });

        // ③ 裏面は各カード個別にフィット
        wrappers.forEach(wrapper => {
          const back = wrapper.querySelector('.missed-card-back');
          const bc = back.querySelector('.missed-back-content');
          if (bc) fitTextToFace(bc, back, 20, 8);
        });
      });
    }

    function scheduleEndGame() {
      if (_scheduledGameWin !== null || isGameOver) return; // 既に確定済み or 終了済みなら無視
      _scheduledGameWin = false; // 多重呼び出し防止: 計算前に仮値でフラグを立てる
      const myLeft = Object.keys(cardFields).filter(k => cardFields[k] === 'mine' && !takenCards[k]).length;
      const isWin = myLeft === 0;
      _scheduledGameWin = isWin; // 確定した勝敗を保存。900ms後にcardFieldsが書き換えられても影響を受けない
      const badgeEl = document.getElementById('ci_badge');
      if (badgeEl && isPcGame) {
        badgeEl.textContent = isWin ? LANG.badgeWin : LANG.badgeLose;
        badgeEl.className = 'ci-badge ' + (isWin ? 'advantage-mine' : 'advantage-enemy');
        badgeEl.style.display = '';
      }
      setTimeout(endCpuGame, 900);
    }

    function endCpuGame() {
      if (isGameOver) return;
      isGameOver = true;
      _stopTypewriter();
      document.querySelectorAll('.header, footer').forEach(el => el.style.display = '');
      if (_reversalTimer) { clearTimeout(_reversalTimer); _reversalTimer = null; }
      const myLeftEnd = Object.keys(cardFields).filter(k => cardFields[k] === 'mine' && !takenCards[k]).length;
      const isWin = _scheduledGameWin !== null ? _scheduledGameWin : myLeftEnd === 0;
      _scheduledGameWin = null;
      ['ci_player_label', 'ci_my_bar', 'ci_my_count', 'ci_badge', 'ci_enemy_bar', 'ci_enemy_count', 'others_icons'].forEach(id => {
        const el = document.getElementById(id); if (el) el.style.display = 'none';
      });
      const kamiEl = document.getElementById('kami_no_ku_display');
      if (kamiEl) { kamiEl.textContent = ''; kamiEl.classList.add('done'); }
      emptyCardTimers.forEach(t => clearTimeout(t));
      emptyCardTimers = [];
      cpuTimers.forEach(t => clearTimeout(t));
      cpuTimers = [];
      if (_postSendPauseTimer) { clearInterval(_postSendPauseTimer); _postSendPauseTimer = null; }
      if (_postSendPauseTimeout) { clearTimeout(_postSendPauseTimeout); _postSendPauseTimeout = null; }
      sendCardCallback = null;
      pendingAdvance = false;
      pendingSendCard = false;
      pendingCardPlacement = false;
      if (localPenaltyTimeout) { clearTimeout(localPenaltyTimeout); localPenaltyTimeout = null; }
      document.getElementById('karuta_container').style.display = 'none';
      globalAudio.pause();
      if (isWin) { globalAudio.src = finishAudioSrc; globalAudio.play().catch(() => { }); }
      else { rainAudio.currentTime = 0; rainAudio.play().catch(() => { }); }

      const allPlayers = [myId, ...cpuPlayers];
      const scoreboard = allPlayers.map(pid => ({
        id: pid, score: Object.values(takenCards).filter(id => id === pid).length, isMe: pid === myId
      })).sort((a, b) => b.score - a.score);

      let myRank = 1;
      const myScore = scoreboard.find(s => s.isMe)?.score ?? 0;
      const enemyScore = scoreboard.find(s => !s.isMe)?.score ?? 0;
      if (myScore >= enemyScore) myRank = 1; else myRank = 2;
      const rankListHtml = LANG.rankListHtml(enemyScore, myScore);

      let resultHeader;
      if (isPcGame) {
        if (isWin) {
          resultHeader = ``;
          myRank = 1;
        } else {
          resultHeader = `<div style="font-size:2rem;color:#555;margin-bottom:10px;">${LANG.badgeLose}</div>`;
          myRank = 2;
        }
      } else {
        resultHeader = LANG.resultRank(myRank, getIcon(myId, allPlayers));
      }
      lastGameWon = myRank === 1;

      document.getElementById('result_text').innerHTML =
        resultHeader +
        `<div style="font-size:1.1rem;line-height:1.6;">${rankListHtml}</div>`;
      document.getElementById('result_container').style.display = 'block';

      showMissedCards(takenCards, myId);

      if (myRank === 1 && scoreboard.find(s => s.isMe).score > 0) {
        _sakuraEndGame();
      } else if (myRank !== 1) {
        _defeatInkEffect();
      }

      // ランキングエリアを表示
      document.getElementById('win_recorded_notice').style.display = 'none';
      document.getElementById('win_recorded_notice').innerText = '';
      document.getElementById('ranking_login_note').style.display = window.currentUser ? 'none' : 'block';
      document.getElementById('ranking_section').style.display = 'block';
      document.getElementById('ranking_view_btn').style.display = 'block';
      if (lastGameWon) {
        if (typeof window.recordCpuWin === 'function') {
          window.recordCpuWin(cpuDifficulty, cardMode);
        } else {
          window._pendingWin = { difficulty: cpuDifficulty, mode: cardMode };
        }
      }

      const statusEl = document.getElementById('status_text');
      statusEl.style.display = 'none';
    }

    // ===== ランキング機能 =====
    function openRankingOverlay() {
      document.getElementById('ranking_overlay').classList.add('open');
      _loadRankingIntoOverlay();
    }

    function closeRankingOverlay() {
      document.getElementById('ranking_overlay').classList.remove('open');
    }

    function _loadRankingIntoOverlay() {
      const el = document.getElementById('ranking_overlay_content');
      if (typeof window._fbLoadRanking === 'function') {
        el.innerHTML = LANG.rankingLoadingHtml;
        window._fbLoadRanking(el);
      } else {
        el.innerHTML = LANG.rankingLoginPromptHtml;
      }
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Firebase モジュールの読み込みが遅い場合のタイムアウト表示
    setTimeout(() => {
      const el = document.getElementById('inline_ranking_content');
      if (el && el.innerHTML.includes(LANG.rankingLoadingCheckStr)) {
        el.innerHTML = LANG.rankingTimeoutHtml;
      }
    }, 12000);

    init();
