document.addEventListener('DOMContentLoaded', () => {

  const audioPlayLists = document.querySelectorAll('.audio-playlist');

  audioPlayLists.forEach((playList) => {
    // リストの親要素（.track-list）を取得
    const trackList = playList.querySelector('.track-list');
    // 再生する音声データのタイトルを表示する要素
    const playingTitle = playList.querySelector('.playing-title');

    // リスト項目（音声データを表す track）の要素を全て取得
    const tracks = trackList.querySelectorAll('li');

    // リスト項目（トラック）がなければメッセージを表示して終了
    if (tracks.length < 1) {
      console.warn('No Track Error: Please add track to the track list');
      playingTitle.textContent = 'No Track Data! Add track(s)'
      return;
    }
    // 現在再生中の項目を表す変数 currentTrackLi を停止して先頭のリスト項目を代入
    let currentTrackLi = tracks[0];

    // currentTrackLi の更新などを行う関数を実行して初期化
    updateTrack(currentTrackLi);
    //音声データを取得
    const src = currentTrackLi.dataset.audioSrc;

    // audio を生成
    const audio = new Audio(src);
    // 初期ボリューム（必要に応じて設定）
    //audio.volume = 0.5;
    // iPhone 対策
    audio.preload = 'metadata';

    // 現在の再生位置（時間）を表示する要素を取得
    const ctSpan = playList.querySelector('.time .current-time');
    // 現在の再生位置（時間）を hh:mm:ss に変換して表示
    ctSpan.textContent = secToHMS(audio.currentTime);
    // 再生時間の長さを表示する要素を取得
    const durSpan = playList.querySelector('.time .duration');

    // ループボタン
    const loopBtn = playList.querySelector('.loop');
    // ループが有効かどうかのフラグを定義して初期化
    let isLoopActive = false;
    // ループボタンにクリックイベントを設定
    loopBtn.addEventListener('click', () => {
      if (isLoopActive) {
        isLoopActive = false;
        loopBtn.classList.remove('looped');
        // aria-label 属性の値を更新
        loopBtn.setAttribute('aria-label', 'Loop');
      } else {
        isLoopActive = true;
        loopBtn.classList.add('looped');
        // aria-label 属性の値を更新
        loopBtn.setAttribute('aria-label', 'Unloop');
      }
    });

    //  ランダムボタン
    const randomBtn = playList.querySelector('.random');
    // ランダムが有効かどうかのフラグを定義して初期化
    let isRandomActive = true;
    // 初期状態でランダムをONにする
    randomBtn.classList.add('randomed');
    randomBtn.setAttribute('aria-label', 'Unrandom');
    // ランダムボタンにクリックイベントを設定
    randomBtn.addEventListener('click', () => {
      if (isRandomActive) {
        isRandomActive = false;
        randomBtn.classList.remove('randomed');
        randomBtn.setAttribute('aria-label', 'Random');
      } else {
        isRandomActive = true;
        randomBtn.classList.add('randomed');
        randomBtn.setAttribute('aria-label', 'Unrandom');
      }
    });


    // ランダムなトラックを再生する関数
    function playRandomTrack() {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      const randomTrack = tracks[randomIndex];
      updateTrack(randomTrack);
      audio.src = randomTrack.dataset.audioSrc;
      playAudio();
    }

    // ボリュームスライダー
    const volumeBar = playList.querySelector('input[name="vol"]');
    // ボリュームスライダーに voluem の初期値を設定
    volumeBar.value = audio.volume;
    // ボリュームスライダーに input イベントを設定
    volumeBar.addEventListener('input', (e) => {
      // 変更された値を volume プロパティに設定（ボリュームを変更）
      audio.volume = e.currentTarget.value;
      if (audio.muted) {
        audio.muted = false;
        // アイコンを変更
        muteBtn.classList.remove('muted');
        // aria-label 属性の値を更新
        muteBtn.setAttribute('aria-label', 'Mute');
      }
    });

    // ミュートボタン
    const muteBtn = playList.querySelector('.mute');
    // ミュートボタンに click イベントを設定
    muteBtn.addEventListener('click', () => {
      if (audio.muted) {
        audio.muted = false;
        // ボリュームバーの位置を更新
        volumeBar.value = audio.volume;
        // ボリュームバーのトラックの背景色の領域を更新
        updateSlider(volumeBar);
        muteBtn.classList.remove('muted');
        // aria-label 属性の値を更新
        muteBtn.setAttribute('aria-label', 'Mute');
      } else {
        audio.muted = true;
        volumeBar.value = 0;
        updateSlider(volumeBar);
        muteBtn.classList.add('muted');
        // aria-label 属性の値を更新
        muteBtn.setAttribute('aria-label', 'Unmute');
      }
    });

    // シークバー
    const seekBar = playList.querySelector('input[name="seek"]');
    // シークバーに input イベントを設定
    seekBar.addEventListener('input', (e) => {
      audio.currentTime = e.currentTarget.value;
    });

    // 再生時間（音声データの長さ）の変数を定義
    let duration;
    // メタデータの読み込みが完了した時点で再生時間を取得して時間を表示
    audio.addEventListener('loadedmetadata', () => {
      // 再生時間の変数の値を更新
      duration = audio.duration;
      // 再生時間を hh:mm:ss に変換して表示
      durSpan.textContent = secToHMS(Math.floor(duration));
      // シークバー（レンジ入力欄）の max 属性に再生時間を設定
      seekBar.setAttribute('max', Math.floor(duration));
    });

    // currentTime プロパティの値が更新される際に発火するイベント
    audio.addEventListener('timeupdate', updateTime, false);
    function updateTime() {
      // 現在の再生位置（時間）を取得
      const cTime = audio.currentTime;
      // 現在の再生位置（時間）の表示を更新
      ctSpan.textContent = secToHMS(Math.floor(cTime));
      // シークバーの現在の再生位置を更新
      seekBar.value = cTime;
      updateSlider(seekBar);
    }

    // トグルボタン（再生・停止ボタン）
    const toggleBtn = playList.querySelector('.toggle');
    // トグルボタンのクリックイベント
    toggleBtn.addEventListener('click', togglePlayPause, false);
    // トグルボタンの関数
    function togglePlayPause() {
      if (audio.paused) {
        // 再生用関数を呼び出す
        playAudio();
      } else {
        audio.pause();
        toggleBtn.classList.remove('playing');
        // aria-label 属性の値を更新
        toggleBtn.setAttribute('aria-label', 'Play');
      }
    }

    // track の li 要素に click イベントのリスナーを登録
    tracks.forEach((track) => {
      track.addEventListener('click', playTrack, false)
    });

    // track の li 要素のリスナー
    function playTrack(e) {
      // 現在再生中の項目を表す変数 currentTrackLi にクリックされた要素を代入
      currentTrackLi = e.currentTarget;
      // currentTrackLi（li 要素）に active クラスを追加してそのテキストをタイトルに表示
      updateTrack(currentTrackLi);
      // li 要素のカスタムデータ属性から音声データの URL を取得
      const trackSrc = e.currentTarget.dataset.audioSrc;
      if (audio.paused) {
        //停止中であれば src に URL を設定して再生
        audio.src = trackSrc;
        playAudio();
      } else {
        //再生中であれば一度停止して src に URL を設定して再生
        audio.pause();
        audio.src = trackSrc;
        playAudio();
      }
    }

    // currentTrackLi の更新と track の li 要素のクラスの着脱及びタイトルの更新

    function updateTrack(li) {
      tracks.forEach((track) => {
        track.classList.remove('active');
      });
      currentTrackLi = li;
      li.classList.add('active');
      playingTitle.innerHTML = li.innerHTML;
      displayAudioFileName(li.dataset.audioSrc);


      li.style.scrollMarginTop = '275px';
      li.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // 要素の上端を基準にスクロール
      });
      li.style.scrollMarginTop = ''; // 元に戻す (必要に応じて)
    }

    // 歌番号の取得
    function displayAudioFileName(audioSrc) {
      let fileName = audioSrc.split('/').pop();
      fileName = fileName.slice(0, -4);

      // 要素を取得
      const playingNumber = playList.querySelector('.playing-number');

      // ファイル名を要素に表示
      if (playingNumber) {
        playingNumber.textContent = `Poem ${fileName}`;
      } else {
        console.log(`Poem ${fileName}`);
      }
    }



    // Skip Forward ボタン（次のオーディオへ進むボタン）

    const skipForwardBtn = playList.querySelector('.skip-forward');
    // Skip Forward ボタンにクリックイベントを設定
    skipForwardBtn.addEventListener('click', skipForward, false);

    function skipForward() {
      if (isRandomActive) {
        playRandomTrack();
      } else {
        // 次の兄弟要素を取得
        const nextTrackLi = currentTrackLi.nextElementSibling;
        // 次のトラックが存在すれば（兄弟要素があれば）
        if (nextTrackLi) {
          audio.pause();
          updateTrack(nextTrackLi);
          // src に次のトラックを設定
          audio.src = nextTrackLi.dataset.audioSrc;
          playAudio();
        } else {
          // 次のトラックが存在しなければ先頭のトラックを再生
          updateTrack(tracks[0]);
          // src に最初のトラックを設定
          audio.src = tracks[0].dataset.audioSrc;
          playAudio();
        }
      }
    }

    // Skip Backward ボタン（前のオーディオへ進むボタン）
    const skipBackwardBtn = playList.querySelector('.skip-backward');
    // Skip Backward ボタンにクリックイベントを設定
    skipBackwardBtn.addEventListener('click', skipFBackward, false);
    function skipFBackward() {
      const prevTrackLi = currentTrackLi.previousElementSibling;
      // 前のトラックが存在すれば（前の兄弟要素があれば）
      if (prevTrackLi) {
        audio.pause();
        updateTrack(prevTrackLi)
        // src に前のトラックを設定
        audio.src = prevTrackLi.dataset.audioSrc;
        playAudio();
      } else {
        updateTrack(tracks[tracks.length - 1])
        // src に最後のトラックを設定
        audio.src = tracks[tracks.length - 1].dataset.audioSrc;
        playAudio();
      }
    }




    // 再生用関数（play() で再生し、戻り値の Promise を監視する関数）
    async function playAudio() {
      try {
        await audio.play();
        toggleBtn.classList.add('playing');
        // aria-label 属性の値を更新
        toggleBtn.setAttribute('aria-label', 'Pause');
      } catch (err) {
        // 再生できなければコンソールにエラーを出力
        console.warn(err)
      }
    }

    // 再生終了時に発火するイベント
    audio.addEventListener('ended', audioEnded, false);
    // 再生終了時に呼び出す関数
    function audioEnded() {
      if (isRandomActive) {
        playRandomTrack();
      } else {
        const nextTrackLi = currentTrackLi.nextElementSibling;
      }
      const nextTrackLi = currentTrackLi.nextElementSibling;
      // 次のトラックが存在すれば
      if (nextTrackLi) {
        audio.pause();
        updateTrack(nextTrackLi)
        // src に次のトラックを設定
        audio.src = nextTrackLi.dataset.audioSrc;
        playAudio();
      } else {
        if (!isLoopActive) {
          // paused クラスを削除してアイコンを変更
          toggleBtn.classList.remove('playing');
          // aria-label 属性の値を更新
          toggleBtn.setAttribute('aria-label', 'Play');
        } else {
          audio.pause();
          updateTrack(tracks[0]);
          // src に次のトラック（先頭のトラック）を設定
          audio.src = tracks[0].dataset.audioSrc;
          playAudio();
        }
      }
    }

    // リストが１つしかない場合は single モード
    if (tracks.length === 1) {
      // リスト、スキップボタン、タイトルを非表示
      trackList.style.display = 'none';
      skipBackwardBtn.style.display = 'none';
      skipForwardBtn.style.display = 'none';
      playingTitle.style.display = 'none';
      // .audio-playlist に single クラスを追加
      playList.classList.add('single');
    }

    // レンジスライダー
    const rangeSliders = playList.querySelectorAll('.range-slider');
    rangeSliders.forEach((slider) => {
      // レンジスライダーの input イベントに関数 updateSlider を登録
      slider.addEventListener('input', (e) => {
        updateSlider(e.target);
      });
      updateSlider(slider);
    });
  });

  /**
  * 秒数を引数に受け取り hh:mm:ss に変換する関数（前述の例と同じ）
  * @param {Number}  seconds 秒数
  */
  function secToHMS(seconds) {
    const hour = Math.floor(seconds / 3600);
    const min = Math.floor(seconds % 3600 / 60);
    const sec = seconds % 60;
    let hh;
    // 3桁未満ならゼロパディング
    if (hour < 100) {
      hh = (`00${hour}`).slice(-2);
    } else {
      hh = hour;
    }
    // mm:ss の形式にするためゼロパディング
    const mm = (`00${min}`).slice(-2);
    const ss = (`00${sec}`).slice(-2);
    let time = '';
    if (hour !== 0) {
      // 1時間以上であれば hh:mm:ss
      time = `${hh}:${mm}:${ss}`;
    } else {
      // 1時間未満であれば mm:ss
      time = `${mm}:${ss}`;
    }
    return time;
  }

  /**
  * レンジスライダーのトラックの塗りの範囲と色を更新する関数（前述の例と同じ）
  * @param {HTMLElement}  slider レンジスライダー（input type="range"）
  * @param {String}  bgc ベースとなるトラックの背景色（デフォルト #ccc）
  * @param {String}  color 変化する領域（ツマミの左側）の背景色（デフォルト #432847）
  */
  function updateSlider(slider, bgc = '#ccc', color = '#432847') {
    if (!slider.max) {
      // max 属性が設定されていなければ 100 を設定
      slider.max = 100;
    }
    // 現在の値から割合（%）を取得
    const progress = (slider.value / slider.max) * 100;
    // linear-gradient でトラックの背景色の領域を引数の色で更新
    slider.style.background =
      `linear-gradient(to right, ${color} ${progress}%, ${bgc} ${progress}%)`;
  }
});
