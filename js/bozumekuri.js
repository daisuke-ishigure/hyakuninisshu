/**
 * 百人一首 神経衰弱ゲーム
 */

let allSongs = [];
let colorGroups = {
    '青': [],
    'ピンク': [],
    '黄': [],
    '緑': [],
    '橙': []
};

const colorMap = {
    '青': '#007bff',
    'ピンク': '#ff69b4',
    '黄': '#ffc107',
    '緑': '#28a745',
    '橙': '#fd7e14'
};

let flippedCards = [];
let matchedPairs = 0;
let quizQuestionsLimit = 8;
let isProcessing = false;
let startTime;

/**
 * 共通：パンくずリストとヘッダーのHTMLを生成
 * @param {boolean} showTitle - タイトルを表示するかどうか
 */
function getCommonHeaderHTML(showTitle = true) {
    let html = `
    <nav>
        <ol class="breadcrumb">
            <li><a href="index.html">トップ</a></li>
            <li><a href="introduction-app.html">アプリ</a></li>
            <li>百人一首 神経衰弱</li>
        </ol>
    </nav>
    <hr>`;

    if (showTitle) {
        html += `
        <div class="title">
            <h1>百人一首 神経衰弱</h1>
        </div>`;
    }
    return html;
}

/**
 * ルビを除去する関数
 */
function stripRuby(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    div.querySelectorAll('rt').forEach(rt => rt.remove());
    div.querySelectorAll('ruby').forEach(ruby => {
        ruby.replaceWith(...ruby.childNodes);
    });
    return div.innerHTML;
}

// JSONファイルを読み込み
fetch('../js/kimariji.json?20260630')
    .then(response => {
        if (!response.ok) throw new Error('JSON読み込み失敗');
        return response.json();
    })
    .then(data => {
        allSongs = data;
        allSongs.forEach(song => {
            if (song.color && colorGroups[song.color]) {
                colorGroups[song.color].push(song);
            }
        });
        createSelectionScreen();
    })
    .catch(error => console.error('エラー:', error));

/**
 * 1. 選択画面の生成
 */
function createSelectionScreen() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    container.classList.remove('play');
    container.innerHTML = `
    <main class="main_about-main">
        <div class="section">
            ${getCommonHeaderHTML(true)}
            <ul id="karuta_ul">
                <li>同じ歌の「上の句」と「下の句」を当てるゲームです。</li>
                <li>五色百人一首の各色20首ずつに絞って練習できます。</li>
                <li>指定したペア数がランダムに出題されます。</li>
            </ul>
            <div class="quiz-controls-wrapper">
                <div class="quiz-controls">
                    <p>①札の色を選んでください。</p>
                    <select id="quiz-type-select">
                        <option value="青">青</option>
                        <option value="ピンク">ピンク</option>
                        <option value="黄">黄</option>
                        <option value="緑">緑</option>
                        <option value="橙">橙</option>
                        <option value="全歌対象" selected>すべての歌を対象</option>
                    </select>
                </div> 
                <div class="quiz-controls">
                    <p>②ペア数を選んでください。</p>
                    <select id="quiz-limit-select">
                        <option value="2">2ペア (4枚)</option>
                        <option value="4" selected>4ペア (8枚)</option>
                        <option value="6">6ペア (12枚)</option>
                        <option value="8">8ペア (16枚)</option>
                    </select>
                </div>
            </div>
            <div id="start-button"></div>
        </div>
    </main>`;

    const startBtn = document.getElementById('start-button');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const quizType = document.getElementById('quiz-type-select').value;
            quizQuestionsLimit = parseInt(document.getElementById('quiz-limit-select').value, 10);
            startMemoryGame(quizType);
        });
    }
}

/**
 * テキストの実質文字数を取得（<br>で分割した各ブロックの最長文字数）
 */
function getTextLength(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    // rt（ルビ）を除去
    div.querySelectorAll('rt').forEach(rt => rt.remove());
    // <br>要素をセパレータ文字に置換
    div.querySelectorAll('br').forEach(br => br.replaceWith('|'));
    const fullText = div.textContent.replace(/\s/g, '');
    // | で分割して最長ブロックの文字数を返す
    return Math.max(...fullText.split('|').map(s => s.length));
}

/**
 * 2. ゲーム開始（プレイ画面）
 */
function startMemoryGame(quizType) {
    let sourceSongs = (quizType === '全歌対象') ? [...allSongs] : colorGroups[quizType];
    if (!sourceSongs || sourceSongs.length === 0) return alert('歌が見つかりません');

    startTime = Date.now();
    const selectedSongs = shuffleArray([...sourceSongs]).slice(0, quizQuestionsLimit);

    let deck = [];
    selectedSongs.forEach(song => {
        deck.push({ id: song.id, text: stripRuby(song.kami_no_ku_kana),  rawText: song.kami_no_ku_kana });
        deck.push({ id: song.id, text: stripRuby(song.shimo_no_ku_kana), rawText: song.shimo_no_ku_kana });
    });
    deck = shuffleArray(deck);

    const container = document.getElementById('quiz-container');
    container.classList.add('play');
    container.innerHTML = `
        <main class="main_about-main">
            <div class="section">
                ${getCommonHeaderHTML(true)}
                <h3 class="question-number">揃えたペア: <span id="match-count">0</span> / ${quizQuestionsLimit}</h3>
                <div id="choices-container" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top:20px;"></div>
            </div>
        </main>`;

    const choicesContainer = document.getElementById('choices-container');
    matchedPairs = 0;
    flippedCards = [];
    const borderColor = colorMap[quizType] || '#333';

    deck.forEach(cardData => {
        const card = document.createElement('div');
        card.classList.add('kimariji-card');
        if (quizQuestionsLimit >= 6) card.classList.add('small-size');

        // 8文字以上（brより前）のカードは letter-spacing を詰める dense クラスを付与
        if (getTextLength(cardData.rawText) >= 8) {
            card.classList.add('dense');
        }

        card.style.borderColor = borderColor;
        card.dataset.id = cardData.id;
        card.innerHTML = `<p style="visibility: hidden;">${cardData.text}</p>`;
        card.addEventListener('click', () => handleCardClick(card));
        choicesContainer.appendChild(card);
    });
}

/**
 * 3. カードクリック・判定
 */
function handleCardClick(card) {
    if (isProcessing || card.classList.contains('matched') || flippedCards.includes(card)) return;

    card.querySelector('p').style.visibility = 'visible';
    card.style.backgroundColor = '#fff';
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        isProcessing = true;
        const [card1, card2] = flippedCards;

        if (card1.dataset.id === card2.dataset.id) {
            setTimeout(() => {
                card1.classList.add('correct-image', 'matched');
                card2.classList.add('correct-image', 'matched');
                matchedPairs++;
                document.getElementById('match-count').textContent = matchedPairs;
                flippedCards = [];
                isProcessing = false;
                if (matchedPairs === quizQuestionsLimit) showResults();
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.add('incorrect-image');
                card2.classList.add('incorrect-image');
                setTimeout(() => {
                    card1.classList.remove('incorrect-image');
                    card2.classList.remove('incorrect-image');
                    card1.querySelector('p').style.visibility = 'hidden';
                    card2.querySelector('p').style.visibility = 'hidden';
                    card1.style.backgroundColor = card2.style.backgroundColor = '';
                    flippedCards = [];
                    isProcessing = false;
                }, 800);
            }, 500);
        }
    }
}

/**
 * 4. 結果表示
 */
function showResults() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const clearTime = Math.floor((Date.now() - startTime) / 1000);
    const container = document.getElementById('quiz-container');

    // X共有用リンク作成
    const tweetText = encodeURIComponent(`百人一首 神経衰弱【${quizQuestionsLimit}ペア】を【${clearTime}秒】でクリアしました！`);
    const tweetUrl = encodeURIComponent(window.location.href);
    const twitterLink = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;

    container.innerHTML = `
        <main class="main_about-main">
            <div class="section" style="text-align: center;">
                ${getCommonHeaderHTML(false)}
                <div class="title">
                <h2>全ペア達成しました！</h2>
                </div>
                <p style="font-size: 1rem; margin-bottom: 20px; text-align:center;">
                    クリアタイム: <strong>${clearTime}秒</strong>
                </p>
                <div style="margin-bottom: 25px;">
                    <a href="${twitterLink}" target="_blank" rel="noopener noreferrer">
                        <div id="share_button" style="display: block;"></div>
                    </a>
                </div>
                <p style="font-size: 0.9rem; color: #666; text-align:center;">5秒後に最初の画面に戻ります</p>
            </div>
        </main>`;

    if (typeof confetti !== 'undefined') showConfettiBlast();
    setTimeout(createSelectionScreen, 5000);
}

// ユーティリティ関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * 花吹雪（ランダムな位置から2秒間降り注ぐ）
 */
function showConfettiBlast() {
    if (typeof confetti === 'undefined') return;

    const duration = 2 * 1000; // 2秒間
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 40; 
        confetti({ 
            ...defaults, 
            particleCount, 
            origin: { x: Math.random(), y: Math.random() - 0.2 } 
        });
    }, 250);
}