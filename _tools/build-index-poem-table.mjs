// index.html「百首から選ぶ」・list.html「百人一首一覧」・list_en.html の表（全100首）を HTML に直書きするためのスクリプト。
// 検索エンジンが100首へのリンクを確実に辿れるよう、JavaScript で作らず静的に埋め込んでいる。
//
// 使い方（リポジトリのルートで）:
//   node _tools/build-index-poem-table.mjs
//
// js/hyakunin.json（歌のデータ）や js/list-rows.js・js/list-rows_en.js（行のテンプレート・バッジ）を変えたら実行すること。
// 各ページの <!-- POEM-TABLE:START --> と <!-- POEM-TABLE:END --> の間を書き換える。
//
// フォルダ名が「_」で始まるのは、GitHub Pages（Jekyll）の公開対象から外すため（_ 始まりは配信されない）。

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

// 行テンプレート（ブラウザ側と同じファイル）と、その表を直書きするページ
// head は <tbody> の前に入れる <caption>・<thead>（無ければ入れない）。
// list.html・list_en.html は「百人一首 一覧」の検索で上位を狙うページなので、見出し行を付けている（作者は和歌の列の中・右揃え）。
const LIST_HEAD =
  "          <caption>百人一首 一覧（歌番号・和歌・作者）</caption>\n" +
  "          <thead>\n" +
  '            <tr><th scope="col">番号</th><th scope="col">和歌・作者</th></tr>\n' +
  "          </thead>\n";
const LIST_HEAD_EN =
  "          <caption>Hyakunin Isshu Poem List (No., Poem, Poet)</caption>\n" +
  "          <thead>\n" +
  '            <tr><th scope="col">No.</th><th scope="col">Poem / Poet</th></tr>\n' +
  "          </thead>\n";
const TARGETS = [
  {
    template: "js/list-rows.js",
    pages: [{ page: "index.html" }, { page: "list.html", head: LIST_HEAD }],
  },
  { template: "js/list-rows_en.js", pages: [{ page: "index_en.html" }, { page: "list_en.html", head: LIST_HEAD_EN }] },
];

const data = JSON.parse(read("js/hyakunin.json"));
const START = "<!-- POEM-TABLE:START -->";
const END = "<!-- POEM-TABLE:END -->";

for (const { template, pages } of TARGETS) {
  const context = vm.createContext({});
  vm.runInContext(read(template), context);

  for (const { page, head = "" } of pages) {
    const rows = Object.keys(data).map((key) => "            " + context.buildPoemRowHTML(data[key]));
    if (rows.length !== 100) throw new Error(`100首ではありません: ${rows.length}`);

    const table =
      START + "\n" +
      "        <table>\n" +
      head +
      "          <tbody>\n" +
      rows.join("\n") + "\n" +
      "          </tbody>\n" +
      "        </table>\n" +
      "        " + END;

    const path = join(root, page);
    const html = readFileSync(path, "utf8");
    const a = html.indexOf(START);
    const b = html.indexOf(END);
    if (a < 0 || b < a) throw new Error(`${page} に POEM-TABLE のマーカーが見つかりません`);
    writeFileSync(path, html.slice(0, a) + table + html.slice(b + END.length));
    console.log(`${page} の表を更新しました（${rows.length}首）`);
  }
}
