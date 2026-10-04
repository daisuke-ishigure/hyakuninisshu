// 英語版の歌人図鑑（kajin-zukan_en.html）の各カードに表示する「Modern Translation」の
// データファイル js/zukan-translation-en.js を作るスクリプト。
//
// 英語の現代語訳は各歌ページ（1_en.html〜100_en.html）の
// <dt>Modern Translation</dt><dd>…</dd> にだけ書かれているため、そこから抜き出す
// （注記の <br><small>…</small> 以降は図鑑のカードでは省く。例：25_en.html）。
//
// 使い方（リポジトリのルートで）:
//   node _tools/build-zukan-translation-en.mjs
//
// N_en.html の Modern Translation を書き換えたら再実行する。

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const data = {};
for (let n = 1; n <= 100; n++) {
  const html = readFileSync(join(root, `${n}_en.html`), "utf8");
  const m = html.match(/<dt>\s*Modern Translation\s*<\/dt>\s*<dd>([\s\S]*?)<\/dd>/);
  if (!m) throw new Error(`${n}_en.html: Modern Translation が見つからない`);
  data[n] = m[1].split(/<br\s*\/?>/)[0].replace(/\s+/g, " ").trim();
}

const out =
  "// 自動生成ファイル：node _tools/build-zukan-translation-en.mjs で 1_en.html〜100_en.html の\n" +
  "// 「Modern Translation」から作成。直接編集しないこと。\n" +
  "window.ZUKAN_TRANSLATION_EN = " + JSON.stringify(data, null, 2) + ";\n";
writeFileSync(join(root, "js/zukan-translation-en.js"), out);
console.log("js/zukan-translation-en.js を書き出しました（100首）");
