---
description: 百人一首の歌から掛詞を見つけるミニゲームページ（kakekotoba-game-NNN.html）を新規作成する。引数に百人一首の番号を渡す（例: /kakekotoba-game 30）。
---

# 掛詞クルッと発見！ ページ作成スキル

## 概要

指定された番号の歌をもとに `kakekotoba-game-NNN.html`（3桁ゼロ埋め、例: `kakekotoba-game-030.html`）を新規作成する。
テンプレートは既存の最新ページ（例: `kakekotoba-game-028.html`）をコピーして流用すること。

---

## 手順

### Step 1 — 歌と掛詞の確認

1. 対象番号の `NN.html`（該当する歌人ページ）を読み、歌の本文・ルビ・歌人名を確認する。
2. その歌に**教科書的に有名な掛詞が本当にあるか**を確認する。
   - 序詞（じょことば）や縁語（えんご）は掛詞ではない。無理にこじつけない。
   - 掛詞が見当たらない場合は、ユーザーに確認を取ってから別の番号を提案する（過去に19番でこの問題が発生した）。
   - 1つの歌に掛詞が複数ある場合は、すべてトリガーにする（過去に9番・16番・25番で複数掛詞に対応済み）。

### Step 2 — テンプレートをコピー

既存の最新ページ（直近に作成した番号、例 `kakekotoba-game-028.html`）を `kakekotoba-game-NNN.html` にコピーする。

### Step 3 — 内容を差し替え

以下を対象の歌に合わせて書き換える：

- `<meta name="description">` — 番号・掛詞の言葉・二つの意味を簡潔に
- `<title>` — `掛詞クルッと発見！　NN番・歌人名 | 時雨の百人一首`（breadcrumbと同じ文言 + ` | 時雨の百人一首`）
- breadcrumb（`<li>掛詞クルッと発見！　NN番・歌人名</li>`）
- `<h1>` の `img#poet-img`（`src="img/zNN.webp"` 2桁ゼロ埋め、`alt="歌人名"`）とテキスト
- `#poem-text` — 歌本文。掛詞の言葉を `.kg-trigger` で囲む（下記「掛詞トリガーの書き方」参照）
- `#kake-explain` — 解説（下記「解説文のルール」参照）
- `#kake-glossary` — 単語など（下記「解説文のルール」参照）
- `#kg-btn-wrap`（`#kake-glossary` の直後）— 「もう一度する」「詳しくはこちら」ボタン（下記「クリア後ボタン」参照）

### Step 4 — ナビゲーションのチェーンを繋ぐ

既存ページのどこかに新規ページを挿入する形で `◀`（back）`▶`（next）のリンクを設定する。

- 新規ページの `back` は挿入位置の前のページ、`next` は挿入位置の後のページを指す。
- **挿入位置の前後のページ側のリンクも書き換える**のを忘れないこと（例: 028→001 だったところに 030 を挿入するなら、028 の next を 030 に、030 の next を 001 にする）。

### Step 5 — ブラウザで実際に確認する

`python -m http.server` などでローカルサーバーを立て、Playwright（`npx playwright`）で実際にページを開いてスクリーンショットを撮り、以下を確認する：

- 掛詞をタップ→カードがめくれて意味が交互に表示される
- 複数掛詞がある場合、すべて見つけるまで解説・単語などが表示されない
- 縦書きレイアウトが崩れていない（特に複数行にまたがる長い意味の言葉）
- ナビゲーション（◀▶）のリンク先が正しい

---

## 掛詞トリガーの書き方

```html
<span class="kg-trigger" data-meanings="表の意味,裏の意味" tabindex="0" role="button">
  <span class="kg-idle">ひらがな表記</span>
  <span class="kg-flip" hidden>
    <span class="kg-flip-inner">
      <span class="kg-face kg-front"></span>
      <span class="kg-face kg-back"></span>
    </span>
  </span>
</span>
```

### ⚠️ 最重要: `#poem-text` 内は改行・インデントを入れず1行で書く

`<p id="poem-text">` の中で、タグとタグの間に改行やインデント（スペース）を入れると、その空白がHTML上は1個のスペース文字として扱われる。縦書き（`writing-mode: vertical-rl`）ではこの余分なスペースが折り返しポイントになり、掛詞トリガーのカードだけが列からはみ出して浮いた状態になるバグが起きる（9番で実際に発生した既知の不具合）。

**必ず `<p id="poem-text">` の開始タグから終了タグまでを改行なしの1行で書くこと。**

```html
<!-- ❌ 悪い例（バグる） -->
<p id="poem-text">
  わが身世に
  <span class="kg-trigger" ...>ふる</span><br>
  ...
</p>

<!-- ✅ 良い例 -->
<p id="poem-text">わが身世に<span class="kg-trigger" ...>ふる</span><br>...</p>
```

### 意味の文字数が長い場合の折り返し対策

`js/kakekotoba-game.js` が `data-meanings` の長い方の文字数に応じて `.kg-flip` の高さを自動計算する（1文字あたり1.2em、最低2文字分）ので、5文字程度（例:「身を尽くし」）までは特に何もしなくても折り返さない。この仕組みは既にJS側に実装済みなので、新規ページ追加時に個別対応は不要。

---

## 解説文のルール

### `#kake-explain`（解説）

- h2見出し「解説」＋ 掛詞の説明段落。
- **意味の説明に括弧書き（例: `「逢う(人と出会うという意味)」`）を使わない。** 括弧の中身は `#kake-glossary` に単語カードとして分離する。
- 掛詞が1つの歌: 「「〇〇」は掛詞になっています。〜」で始める。
- 掛詞が複数の歌: 「この歌には掛詞が◯つ隠れています。〜」で始め、「一つ目は「〇〇」。〜」「二つ目は「〇〇」。〜」と列挙する。

### `#kake-glossary`（単語など）

- h2見出し「単語など」＋ `.glossary-item`（`.glossary-badge` + `<p>`）の並び。
- 掛詞の両方の意味（例: 「逢う」と「逢坂」）はそれぞれ独立した `.glossary-item` として追加する。**explain文中の括弧書きの内容はここに移す。**
- ルビを含むバッジは `.glossary-badge:has(rt)` により自動で上余白が調整されるので、通常通り `<ruby>` を使ってよい。
- 掛詞以外の古語・重要語句（例:「むべ」「とりあへず」など）も適宜追加する。

---

## クリア後ボタン（`#kg-btn-wrap`）

すべての掛詞を発見してゲームがクリアされたタイミングで、`#kake-glossary` の下に「もう一度する」「詳しくはこちら」の2つのボタンを横並びで表示する。表示・リセットのロジックは `js/kakekotoba-game.js` 側に実装済みなので、HTML側は以下のブロックを `#kake-glossary` の直後・`</div><!-- /.section -->` の直前に置くだけでよい。

```html
<div id="kg-btn-wrap" hidden>
  <button id="kg-retry-btn" type="button">もう一度する</button>
  <a id="kg-detail-btn" href="NN.html">詳しくはこちら</a>
</div>
```

- `href="NN.html"` はゼロ埋めなしの歌番号（例: `kakekotoba-game-008.html` なら `href="8.html"`、`kakekotoba-game-100.html` なら `href="100.html"`）。該当する歌人ページへのリンク。
- 「もう一度する」をクリックすると、`resetGame()`（`js/kakekotoba-game.js`）がトリガーの状態・解説・単語など・猫の表情とセリフをすべて初期状態に戻し、同じページで再度ゲームができるようになる。
- `#kg-btn-wrap` は `hidden` 属性で初期非表示にする。CSS側で `#kg-btn-wrap[hidden] { display: none; }` を明示しているので、`display: flex` の通常スタイルと衝突しない（`.kg-flip[hidden]` と同じ理由。上記「掛詞トリガーの書き方」参照）。

---

## その他の注意点

- `css/kakekotoba-game.css` / `js/kakekotoba-game.js` を修正した場合は、**全ての `kakekotoba-game-*.html` のキャッシュバスター**（`?NN`）を一括で上げること。
- 新規ページ自体は既存の共有CSS/JSを参照するだけなので、HTML作成だけならキャッシュバスターの変更は不要。
- **`css/*.css` を編集する前に、同名の `css/*.scss` が存在しないか必ず確認すること。** 存在する場合は `.scss` ソース側を編集する（コンパイル後の `.css` を直接編集しない）。例: `css/style.css` には `css/style.scss` という対応するソースファイルがあり、ネスト構文（`@media` がセレクタ内にネストされる形）で書かれている。`.css` だけを直接編集すると、次回 SCSS から再コンパイルされた際に変更が消えてしまう。（`kakekotoba-game.css` / `daruma-otoshi.css` / `gokunarabe.css` には対応する `.scss` が存在しないため、これらは直接編集してよい。）
