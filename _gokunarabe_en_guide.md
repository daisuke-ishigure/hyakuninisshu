# gokunarabe 英語版 制作ガイド

> 対象: `gokunarabe_NN_en.html`（NN = 01〜100）  
> 最新の基準ページ: `gokunarabe_26_en.html` / `gokunarabe_27_en.html`

---

## 1. ファイル命名

```
gokunarabe_NN_en.html   （NN は2桁ゼロ埋め: 01, 02 … 100）
```

---

## 2. HTML テンプレート（現行フォーマット）

```html
<!DOCTYPE html>
<html lang="en">   <!-- ← lang="en" 必須 -->
<head>
  <!-- Google tag (gtag.js) ... -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="A Hyakunin Isshu game where you arrange the phrases of [英語歌人名]'s poem '[ローマ字書き出し句]…' in the correct order. The poem's meaning and commentary are also available.">
  <title>Hyakunin Isshu: Meet the Poets – [英語歌人名] | Shigure no Hyakunin Isshu</title>
  <!-- Google Fonts, style.css, gokunarabe.css, wordcloud.css, favicon -->
</head>
<body>

  <!-- ヘッダー（日本語版と同一構造。alt は英語） -->
  <header class="header">
    <p class="site-title">
      <a href="https://hyakuninisshu.sakura.ne.jp/">Shigure no Hyakunin Isshu</a>
      <!-- ※ フッターも同じ表記 "Shigure no Hyakunin Isshu" -->
    </p>
    <div class="header_list">
      <a href="index_en.html"><img src="img/icon_top.svg?ver-03" alt="Top" class="icon"></a>
      <a href="about_en.html" style="color:#333"><img src="img/icon_column.svg?ver-03" alt="Column" class="icon"></a>
      <a href="introduction-app.html" style="color:#333"><img src="img/icon_app.svg?ver-03" alt="App" class="icon"></a>
      <a href="list_en.html"><img src="img/icon_search.svg?ver-03" alt="Poem list / Search" class="icon"></a>
    </div>
  </header>

  <main class="main_about-main">
    <div class="section">

      <!-- パンくずリスト -->
      <nav>
        <ol class="breadcrumb">
          <li><a href="index_en.html">Top</a></li>
          <li><a href="kajin-zukan_en.html">Hyakunin Isshu Poet Encyclopedia</a></li>
          <li>Hyakunin Isshu: Meet the Poets – [英語歌人名]</li>
        </ol>
      </nav>

      <!-- h1（z[NN].webp は歌人顔画像） -->
      <h1 class="h1-badge">
        <img src="img/z[NN].webp" alt="[英語歌人名]">Hyakunin Isshu: Meet the Poets <br class="br-sp">[英語歌人名]
      </h1>

      <!-- 言語切替 -->
      <p class="lang-wrapper">
        <a href="gokunarabe_[NN].html" class="lang-tag">日本語</a>
        <a href="gokunarabe_[NN]_en.html" class="lang-tag">English</a>
      </p>

      <div id="kake-app">
        <!-- 猫エリア（日本語版と同一） -->
        <div id="neko-area">...</div>

        <div id="step1-area">
          <div id="float-area"></div>
          <div id="card-nav-wrap">
            <div id="waka-card"></div>
          </div>

          <!-- 解説（英語で記述） -->
          <div id="kake-desc">
            <h2 class="imi">Meaning</h2>
            <p class="kaisetsu">（和訳・意訳）</p>
            <h2 class="kaisetsu">Commentary</h2>
            <p class="kaisetsu">（解説 1〜3 段落）</p>
            <a href="[NN]_en.html" class="detail-btn">Learn More</a>
            <!-- NN はゼロ埋めなし: 1_en.html, 27_en.html など -->
          </div>
        </div>
      </div>

    </div>
  </main>

  <!-- フッター -->
  <footer>
    <div class="footer-inner">
      <span class="footer-copy">&copy;2023 Shigure no Hyakunin Isshu</span>
      <ul>
        <li><a href="policy.html">Privacy Policy</a></li>
        <li><a href="[ContactFormURL]" target="_blank" rel="noopener">Contact Form</a></li>
      </ul>
    </div>
  </footer>

  <!-- KAKE_CONFIG（下記セクション参照） -->
  <script>window.KAKE_CONFIG = { ... };</script>

  <!-- スクリプト（順番を守る） -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="js/gokunarabe.js?ver=1.0.12"></script>
  <!-- tippy.js（解説にツールチップを使う場合） -->
  <script src="../js/popper.min.js"></script>
  <script src="../js/tippy.umd.min.js"></script>
  <script src="../js/tooltips.js?2026906"></script>
  <!-- Word Cloud -->
  <script src="js/poet-index.js?ver002"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/d3-cloud@1/build/d3.layout.cloud.js"></script>
  <script src="js/wordcloud.js?ver006"></script>

</body>
</html>
```

---

## 3. KAKE_CONFIG テンプレート

```javascript
window.KAKE_CONFIG = {

  /* 位置調整用（公開時は false） */
  debug: false,

  pageNum: [NN],          // 数値（ゼロ埋めなし）
  pageSuffix: '_en',      // ← 英語版は必須

  poetName: '[日本語歌人名]',   // SVG ファイル名や Firebase キーに使用
  figureSrc: 'img/[NN].svg',   // NN はゼロ埋めなし（1.svg, 27.svg）

  /* 和歌（日本語版と同一） */
  waka: [
    { text: '句1', html: '句1（ruby付き）', idx: 0 },
    { text: '句2', html: '句2（ruby付き）', idx: 1 },
    { text: '句3', html: '句3（ruby付き）', idx: 2 },
    { text: '句4', html: '句4（ruby付き）', idx: 3 },
    { text: '句5', html: '句5（ruby付き）', idx: 4 },
  ],

  /* ネコのセリフ（英語固定テンプレート） */
  messages: {
    correctMsgs: ['Nice!', 'Keep it up!', 'Brilliant!', "You're on fire!", 'Perfect!'],
    initTitle: 'Tap the phrases in order.',
    initBody: 'Complete the poem to meet the poet!<br>If it’s too difficult, click 👀 "Show complete poem" ♪',
    keepGoing: 'Keep going!',
    completeTitle: 'Poem complete! ♪',
    completeBody: 'A word from [英語歌人名] 🎤',   // ← 歌人名だけ変える
    retry: 'Try again',
    wrong: 'Not quite! Tap the phrases in the correct order.',
    encourage1: 'You can do it!',
    wrong3: 'Oh no — 3 mistakes! The poem is scattered…',
    wrong2: 'Wrong! <strong>One more mistake and the poem scatters!</strong>',
    encourage2: 'Be careful!',
    donmai: "Don't give up!",
  },

  /* ★ 英語版では必須 ★
     bubbleHorizontal: true がないとデバッグ座標と通常表示でズレが生じる
     （英語テキストは長いため、フォント読込タイミングで幅が変わるため） */
  bubbleHorizontal: true,

  /* 吹き出しセリフ（\n で改行） */
  bubbleText: [
    'セリフ1行目\n2行目\n3行目',
    // 複数セリフはここに追加（ランダム表示）
  ],

  /* 吹き出し位置
     \n の数で自動選択:
       0個 → bubblePos
       1個 → bubblePosThank
       2個以上 → bubblePosThank3          */
  bubblePos: {
    top: '??%',
    left: '??%',
    transform: 'translateX(-50%)',
  },
  bubblePosThank: {
    top: '??%',
    left: '??%',
    transform: 'translateX(-50%)',
  },
  bubblePosThank3: {
    top: '??%',
    left: '??%',
    transform: 'translateX(-50%)',
  },

  nekoTail: 'right',      // 'right' or 'left'
  bubbleTail: 'top-left', // 'top-left' / 'top-right' / 'top-center' / 'left' など
};
```

---

## 4. 吹き出し位置調整の手順

1. `debug: true` に設定してブラウザで開く
2. 吹き出しをドラッグして位置を決める
3. デバッグパネルのタブで3パターン（1行・2行・3行）それぞれ調整
   - タブ「1行」→ `bubblePos`（`\n` 0個のセリフ用）
   - タブ「2行」→ `bubblePosThank`（`\n` 1個のセリフ用）
   - タブ「3行」→ `bubblePosThank3`（`\n` 2個以上のセリフ用）
4. 「コピー」ボタンでクリップボードにコピーし KAKE_CONFIG に貼り付け
5. `debug: false` に戻す

> **注意**: `bubbleHorizontal: true` を設定しないと、デバッグ座標と通常表示がズレる。英語版では常に設定すること。

---

## 5. 日本語版との主な違い

| 項目 | 日本語版 | 英語版 |
|------|---------|--------|
| `<html lang>` | `ja` | `en` |
| `pageSuffix` | `''` | `'_en'` |
| `bubbleHorizontal` | 任意 | **必須** `true` |
| `messages` | 日本語 | 英語 |
| パンくず第2階層 | `kajin-zukan.html`「百人一首 人物図鑑」| `kajin-zukan_en.html`「Hyakunin Isshu Poet Encyclopedia」|
| h1 フォーマット | `歌人に会える百人一首 [歌人名]` | `Hyakunin Isshu: Meet the Poets – [英語歌人名]` |
| detail-btn リンク | `[NN].html` | `[NN]_en.html` |
| `.site-title` | `時雨の百人一首` | `時雨の百人一首`（**日本語のまま**） |
| `<title>` タグ末尾 | `時雨の百人一首` | `Shigure no Hyakunin Isshu` |
| フッターコピー | `時雨の百人一首` | `Shigure no Hyakunin Isshu` |
| `lang-wrapper` | コメントアウト（非表示）| 表示 |

---

## 6. チェックリスト（新規作成時）

- [ ] `<html lang="en">`
- [ ] `pageSuffix: '_en'`
- [ ] `bubbleHorizontal: true`
- [ ] `messages` がすべて英語（`completeBody` の歌人名を変更済み）
- [ ] パンくず → `kajin-zukan_en.html`「Hyakunin Isshu Poet Encyclopedia」
- [ ] h1 → `Hyakunin Isshu: Meet the Poets – [英語歌人名]`
- [ ] `lang-wrapper` のリンクが正しい（日本語版 ↔ 英語版）
- [ ] `figureSrc` の NN はゼロ埋めなし
- [ ] `detail-btn` リンクが `[NN]_en.html`（NN はゼロ埋めなし）
- [ ] `debug: false`（公開前）
- [ ] 吹き出し位置を3パターン（bubblePos / bubblePosThank / bubblePosThank3）設定済み

---

## 7. 既存ページの状況（2026-06-21 時点）

| 番号 | ファイル | 備考 |
|------|---------|------|
| 01〜24 | 作成済み | 旧フォーマット（h1 が "Meet the Poets of Hyakunin Isshu..."）。一部 tippy.js なし、breadcrumb が旧形式のページあり |
| 25 | 作成済み | breadcrumb が旧形式（`introduction-app.html` → "App"）のまま残っている可能性あり |
| 26 | 作成済み | 現行フォーマット準拠 |
| 27 | 作成済み | 現行フォーマット準拠 |
| 28〜100 | **未作成** | |
