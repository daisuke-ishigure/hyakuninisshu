---
description: 共有CSS/JS/画像ファイルを修正した後、それを参照している全HTMLファイルのキャッシュバスター（?ver= や ?日付 のクエリ文字列）を一括更新する。引数に修正したファイルパスを渡す（例: /bump-cache-buster css/style.css）。修正・バグ修正が完了するたびに必ず実行すること。
---

# キャッシュバスター更新スキル

## 概要

このサイトはビルドパイプラインを持たない静的サイトで、CSS/JS/画像の変更をブラウザに確実に反映させる手段は `<link>`/`<script>`/`<img>` の `?バージョン文字列` だけである。
**ファイルの中身を変更しても、参照元HTMLのクエリ文字列を変えなければ、既にサイトを訪れたユーザーのブラウザには古い内容がキャッシュされたまま残る。**

そのため、共有ファイル（`css/*.css`、`js/*.js`、`img/*.svg` など複数ページから参照されるもの）を修正・バグ修正したら、**必ず**このスキルの手順で参照元HTMLのバージョン文字列を更新すること。1ページだけに存在する独自CSS/JS（例: `karuta-taisen.html` 内のインラインスクリプト）は対象外。

---

## 手順

### Step 1 — 対象ファイルと現在のバージョン文字列を確認

```
Grep pattern: <対象ファイル名>\?[^"]*
```

同じファイルでも参照箇所によってバージョン文字列がバラバラなことがある（例: 一部のページは `style.css?20260802-01`、別のページ群は `style.css?20260726` のまま、ということが実際にあった）。**その事実自体は放置してよい**（このスキルの目的はキャッシュ無効化であり、サイト全体の統一ではない）。今回のスキルでは、修正した内容が確実に配信されるようにするため、既存の文字列を起点に新しいバージョンへ更新することだけを考える。

### Step 2 — このプロジェクトで使われている命名規則を確認する

ファイルごとに既存の慣習が異なるため、**その対象ファイル自身が既に使っている形式をそのまま踏襲する**（勝手に別形式を持ち込まない）。観測されている形式の例：

| 形式 | 例 |
|---|---|
| 日付のみ | `move_script.js?20260729` |
| 日付＋連番 | `style.css?20260802-01` → `style.css?20260802-02` |
| `verNN` | `icon_top.svg?ver-02` → `icon_top.svg?ver-03` |

今日の日付は `date /T` 相当（会話の `currentDate` コンテキストや `Get-Date` で確認）。同じ日付に複数回バンプする場合は `-01`, `-02`... と連番を伸ばす。

### Step 3 — 参照している全HTMLファイルを一括置換

Node.js のワンショットスクリプトで実施する（このプロジェクトではこのパターンを繰り返し使っている）。スクラッチパッドに書いて実行し、置換件数をログに出して確認すること。

```js
const fs = require('fs');
const path = require('path');
const dir = 'c:\\Users\\USER\\Documents\\百人一首_20260125';

const OLD = 'style.css?20260802-01'; // 変更前の文字列（Step1で確認した値）
const NEW = 'style.css?20260802-02'; // 変更後の文字列

let updated = 0;
const allHtml = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.html'));
for (const filename of allHtml) {
  const p = path.join(dir, filename);
  const content = fs.readFileSync(p, 'utf8');
  if (!content.includes(OLD)) continue;
  fs.writeFileSync(p, content.split(OLD).join(NEW), 'utf8');
  updated++;
}
console.log('updated:', updated);
```

同じファイルで複数の旧バージョン文字列が混在している場合（Step1で判明）は、`OLD`/`NEW` の組を複数回に分けて実行する。

### Step 4 — 確認

Grep で旧バージョン文字列が残っていないか（意図せず対象外にしたファイルがないか）を確認し、置換後のファイルを1つ Read して結果が正しく反映されているか目視確認する。

---

## 注意点

- **SCSS ソースがある場合**：`css/*.css` を直接編集する前に `css/*.scss`（同名）が存在するか確認し、あればそちらを編集してから `.css` も手動で同期する（このプロジェクトにはビルド自動化が無いため、`.scss` と `.css` は常に手動同期。過去に `.css` だけ編集して `.scss` との乖離を招いた事例がある）。
- キャッシュバスターの更新は**その修正で変更したファイルを参照している箇所すべて**が対象。JA版とEN版で別ファイル（例: `poems.js` / `poems_en.js`、`style.css` は共通）を使っているケースがあるので、修正がどちらに影響するかを見極めてから対象HTMLを絞り込むこと。
- 新規作成したファイル（例: 新しい `N_en.html`）はまだブラウザにキャッシュされ得ないため、バージョン文字列は何でもよい（既存の最新値に合わせておけば十分）。バンプが必要なのは**既存の共有ファイルの中身を変更したとき**だけ。
- **`fetch()` 経由で読み込まれるJSはバージョン文字列がHTMLではなくJSファイル側にある**：`utamakura.html`/`utamakura_en.html` は `js/utamakura.js`/`js/utamakura_en.js` を `<script src>` で読み込むが、その `utamakura.js`/`utamakura_en.js` 自身が内部で `fetch("../js/utamakuralocation.js?...")`/`fetch("../js/utamakuralocation_en.js?...")` を呼んで歌枕の位置データを取得している（2段構成）。そのため：
  - `utamakura.js`/`utamakura_en.js`（ロジック）を修正した場合 → `utamakura.html`/`utamakura_en.html` 内の `<script src>` のクエリ文字列をバンプする（通常のケース）。
  - `utamakuralocation.js`/`utamakuralocation_en.js`（位置データ）を修正した場合 → バンプすべき文字列は **HTMLではなく `utamakura.js`/`utamakura_en.js` ファイル内の `fetch(...)` 呼び出しのクエリ文字列**。Step 3 の一括置換スクリプトは既定で `.html` しか対象にしていないため、この場合は対象リストに該当 `.js` ファイルも含めること（さもないと置換されずキャッシュが残る）。
