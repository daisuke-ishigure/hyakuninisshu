// index.html「百首から選ぶ」の表（全100首）を HTML に直書きするためのスクリプト。
// 検索エンジンが100首へのリンクを確実に辿れるよう、JavaScript で作らず静的に埋め込んでいる。
//
// 使い方（リポジトリのルートで）:
//   node _tools/build-index-poem-table.mjs
//
// js/hyakunin.json（歌のデータ）や js/list-rows.js（行のテンプレート・バッジ）を変えたら実行すること。
// index.html の <!-- POEM-TABLE:START --> と <!-- POEM-TABLE:END --> の間を書き換える。
//
// フォルダ名が「_」で始まるのは、GitHub Pages（Jekyll）の公開対象から外すため（_ 始まりは配信されない）。

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

// list.html と同じ行テンプレート（js/list-rows.js）をそのまま使う
const context = vm.createContext({});
vm.runInContext(read("js/list-rows.js"), context);

const data = JSON.parse(read("js/hyakunin.json"));
const rows = Object.keys(data).map((key) => "            " + context.buildPoemRowHTML(data[key]));
if (rows.length !== 100) throw new Error(`100首ではありません: ${rows.length}`);

const START = "<!-- POEM-TABLE:START -->";
const END = "<!-- POEM-TABLE:END -->";
const indexPath = join(root, "index.html");
const html = readFileSync(indexPath, "utf8");
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a < 0 || b < a) throw new Error("index.html に POEM-TABLE のマーカーが見つかりません");

const table =
  START + "\n" +
  "        <table>\n" +
  "          <tbody>\n" +
  rows.join("\n") + "\n" +
  "          </tbody>\n" +
  "        </table>\n" +
  "        " + END;

writeFileSync(indexPath, html.slice(0, a) + table + html.slice(b + END.length));
console.log(`index.html の表を更新しました（${rows.length}首）`);
