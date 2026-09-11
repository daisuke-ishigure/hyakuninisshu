// --- 百人一首 かるたゲーム ---
const gameHeader = document.getElementById('game_header');
const jsonAddress = "../js/karuta_tokkun.json";
const container = document.getElementById('karuta_container');
const startButton = document.getElementById('start_button');
const resultText = document.getElementById('result_text');
const cardCountSelector = document.getElementById('cardCountSelector');
const cardCountLabel = document.querySelector('label[for="cardCountSelector"]');
const selectElement = document.getElementById('cardCountSelector');
const shareButton = document.getElementById('share_button');

// --- 状態管理変数 ---
let currentAudioInstance = null; // 現在再生中のAudioオブジェクト
let currentSongNumber = null;
let startTime = null;
let mistakeCount = 0;
let totalCards = 0;
let isProcessing = false;
let jsonData = null;

// Audioオブジェクトを保持するキャッシュ
let audioCache = {}; 

// --- 初期設定 ---
async function initialize() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  const defaultCardCount = screenWidth >= 960 ? 10 : 6;

  selectElement.innerHTML = '';
  for (let i = 1; i <= 100; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    if (i === defaultCardCount) option.selected = true;
    selectElement.add(option);
  }

  try {
    const response = await fetch(jsonAddress);
    if (!response.ok) throw new Error('JSONの読み込みに失敗しました');
    jsonData = await response.json();
    setupGame(defaultCardCount);
  } catch (error) {
    console.error(error);
    resultText.textContent = "データの読み込みに失敗しました。";
  }
}

// すべての音声を停止するヘルパー関数
function stopAllAudio() {
  // 再生中のメイン音声を停止
  if (currentAudioInstance) {
    currentAudioInstance.pause();
    currentAudioInstance.currentTime = 0;
    currentAudioInstance = null;
  }
  // キャッシュに残っている全ての音声を停止（これが二重再生を防ぎます）
  Object.values(audioCache).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

// ゲーム盤面をセットアップ
function setupGame(count) {
  // 【重要】新しいゲームを作る前に、前の音声を確実に止める
  stopAllAudio();
  audioCache = {}; // キャッシュもクリア

  container.innerHTML = '';
  totalCards = count;
  mistakeCount = 0;

  const selectedSongs = getRandomSongs(jsonData, count);

  selectedSongs.forEach(song => {
    const card = document.createElement('div');
    card.classList.add('karuta_card');
    card.dataset.number = song.number;
    card.innerHTML = `<p>${song.torihuda}</p>`;
    card.addEventListener('click', () => cardClickHandler(song, card));
    container.appendChild(card);

    // Audioオブジェクト生成
    const audio = new Audio(`../sound/${song.number}.mp3`);
    audio.preload = "auto";
    audio.load();
    audioCache[song.number] = audio;
  });
}

function getRandomSongs(data, count) {
  const keys = Object.keys(data);
  const shuffled = keys.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(key => data[key]);
}

// --- ゲーム進行ロジック ---

function playNextAudio() {
  const remainingCards = Array.from(document.querySelectorAll('.karuta_card'))
    .filter(card => !card.classList.contains('played'));

  if (remainingCards.length === 0) {
    finishGame();
    return;
  }

  const targetCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
  currentSongNumber = targetCard.dataset.number;
  targetCard.classList.add('played');

  // 直前の音声があれば停止
  if (currentAudioInstance) {
    currentAudioInstance.pause();
    currentAudioInstance.currentTime = 0;
  }

  // キャッシュから次の音声を取得
  currentAudioInstance = audioCache[currentSongNumber];
  
  if (currentAudioInstance) {
    currentAudioInstance.muted = false; // 念のためミュート解除
    currentAudioInstance.currentTime = 0;

    const playPromise = currentAudioInstance.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("再生エラーリトライ:", err);
        currentAudioInstance.load();
        currentAudioInstance.play();
      });
    }
  }
}

function cardClickHandler(song, element) {
  if (!startTime || isProcessing) return;

  if (String(song.number) === String(currentSongNumber)) {
    isProcessing = true;
    element.style.opacity = '0';
    element.style.pointerEvents = 'none';
    resultText.textContent = "";

    if (currentAudioInstance) {
      currentAudioInstance.pause();
    }

    setTimeout(() => {
      isProcessing = false;
      playNextAudio();
    }, 500);
  } else {
    resultText.textContent = 'お手付きです';
    mistakeCount++;
  }
}

function finishGame() {
  // ゲーム終了時も音声を止める
  stopAllAudio();

  const endTime = new Date();
  const elapsedSec = (endTime - startTime) / 1000;
  const penaltySec = mistakeCount * 5;
  const finalScore = elapsedSec + penaltySec;
  const avgTime = finalScore / totalCards;

  let mistakeMsg = mistakeCount === 0 ? "完璧です！" : `お手付き: ${mistakeCount}回`;

  resultText.innerHTML = `
        <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 10px;">
            ゲームクリアしました！
        </div>
        タイム: ${finalScore.toFixed(2)} 秒<br>
        1枚あたり: ${avgTime.toFixed(2)} 秒<br>
        ${mistakeMsg}
    `;

  resultText.style.display = 'block';
  container.style.display = 'none';

  // クリア音の再生
  const finishAudio = new Audio('../sound/finish.m4a');
  finishAudio.play().catch(() => { });

  setupShareButton(finalScore.toFixed(2), totalCards, mistakeCount);
  if (typeof confetti === 'function') showConfetti();
}

// --- イベントリスナー ---

startButton.addEventListener('click', () => {
  // 【修正】二重再生防止のため、まずロック解除処理をすべて完了させる
  // Promise.allを使って、「全ての音声の空回し」が終わるのを待つ
  const promises = Object.values(audioCache).map(audio => {
    audio.muted = true;
    return audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false; // ここでミュート解除しておく
    }).catch(e => {
      // エラーが出てもゲーム進行は止めない
      console.log("Unlock skipped:", e);
    });
  });

  // 全ての準備（ロック解除）が整ってからゲームを開始する
  Promise.all(promises).then(() => {
    startTime = new Date();
    if (gameHeader) gameHeader.style.display = 'none';
    startButton.style.display = 'none';
    cardCountSelector.style.display = 'none';
    cardCountLabel.style.display = 'none';
    
    // 準備完了後に再生開始
    playNextAudio();
  });
});

cardCountSelector.addEventListener('change', () => {
  const newCount = parseInt(cardCountSelector.value, 10);
  setupGame(newCount);
});

document.getElementById('replay_button').addEventListener('click', () => {
  window.location.reload();
});

function setupShareButton(score, cards, mistakes) {
  if (!shareButton) return;
  shareButton.style.display = 'flex';
  shareButton.style.justifyContent = 'center';
  shareButton.style.alignItems = 'center';
  shareButton.onclick = () => {
    const text = encodeURIComponent(
      `【百人一首かるたゲーム】\nクリアタイム: ${score} 秒\n${cards}枚を ${mistakes}回のお手付きでクリア！\n`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };
}

function showConfetti() {
  if (typeof confetti !== 'function') return;
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 1000 };

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 40;
    confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
  }, 250);
}

document.addEventListener('DOMContentLoaded', initialize);