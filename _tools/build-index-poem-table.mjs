// list.html「百人一首一覧」・list_en.html の表（全100首）と、index.html・index_en.html「百首から選ぶ」の表（最初の5首）を
// HTML に直書きするためのスクリプト。検索エンジンがリンクを確実に辿れるよう、JavaScript で作らず静的に埋め込んでいる。
// トップページは5首だけにして、全100首の一覧は list.html・list_en.html に一本化している（「百人一首 一覧」の検索で
// 同じ表のページが2つ並ばないように）。
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
// head は <tbody> の前に入れる <caption>・<thead>（無ければ入れない）。limit は載せる首数（無ければ全100首）。
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
    pages: [{ page: "index.html", limit: 5 }, { page: "list.html", head: LIST_HEAD }],
  },
  { template: "js/list-rows_en.js", pages: [{ page: "index_en.html", limit: 5 }, { page: "list_en.html", head: LIST_HEAD_EN }] },
];

const data = JSON.parse(read("js/hyakunin.json"));
const START = "<!-- POEM-TABLE:START -->";
const END = "<!-- POEM-TABLE:END -->";

for (const { template, pages } of TARGETS) {
  const context = vm.createContext({});
  vm.runInContext(read(template), context);

  for (const { page, head = "", limit } of pages) {
    const all = Object.keys(data).map((key) => "            " + context.buildPoemRowHTML(data[key]));
    if (all.length !== 100) throw new Error(`100首ではありません: ${all.length}`);
    const rows = limit ? all.slice(0, limit) : all;

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

// list.html・list_en.html の構造化データ：全100首を、それぞれの解説ページ（N.html／N_en.html）へのリンクとして並べた ItemList。
// 「100首の一覧のページ」だと検索エンジンに伝えるためのもの。各ページの CollectionPage の mainEntity（@id）から指している。
// <!-- POEM-ITEMLIST:START --> と <!-- POEM-ITEMLIST:END --> の間を書き換える。
// 名前は表の行と同じもの：日本語は「1. 歌（作者）」、英語は「1. ローマ字の読み (英語の作者名)」（js/list-rows_en.js の関数で作る）
{
  const ISTART = "<!-- POEM-ITEMLIST:START -->";
  const IEND = "<!-- POEM-ITEMLIST:END -->";
  const en = vm.createContext({});
  vm.runInContext(read("js/list-rows_en.js"), en);
  const romaji = (p) => p.yomihuda.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "").split("\n").map(en.hiraganaToRomaji).join(" ");
  const LISTS = [
    {
      page: "list.html", id: "https://hyakuninisshu.com/list.html#poems", listName: "百人一首 一覧（全100首）",
      url: (p) => `https://hyakuninisshu.com/${p.number}.html`,
      // forConsole は「歌（句の間は空白）\n作者名」
      name: (p) => { const [poem, poet] = p.forConsole.split("\n").map((s) => s.trim()); return `${p.number}. ${poem}（${poet}）`; },
    },
    {
      page: "list_en.html", id: "https://hyakuninisshu.com/list_en.html#poems", listName: "Hyakunin Isshu – Complete Poem List (100 poems)",
      url: (p) => `https://hyakuninisshu.com/${p.number}_en.html`,
      name: (p) => `${p.number}. ${romaji(p)} (${p.name_en})`,
    },
  ];
  for (const L of LISTS) {
    const items = Object.values(data)
      .sort((x, y) => Number(x.number) - Number(y.number))
      .map((p) => ({ "@type": "ListItem", position: Number(p.number), url: L.url(p), name: L.name(p) }));
    if (items.length !== 100 || items.some((it, i) => it.position !== i + 1)) throw new Error(`${L.page}: ItemList が1〜100番になっていません`);
    if (items.some((it) => /undefined|\(\)|（）/.test(it.name))) throw new Error(`${L.page}: 名前の欠けている歌があります`);
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": L.id,
      name: L.listName,
      numberOfItems: 100,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: items,
    };
    const block =
      ISTART + "\n" +
      '  <script type="application/ld+json">\n' +
      JSON.stringify(itemList, null, 2).replace(/^/gm, "  ") + "\n" +
      "  </script>\n" +
      "  " + IEND;
    const path = join(root, L.page);
    const html = readFileSync(path, "utf8");
    const a = html.indexOf(ISTART);
    const b = html.indexOf(IEND);
    if (a < 0 || b < a) throw new Error(`${L.page} に POEM-ITEMLIST のマーカーが見つかりません`);
    writeFileSync(path, html.slice(0, a) + block + html.slice(b + IEND.length));
    console.log(`${L.page} の構造化データ（ItemList）を更新しました（100首）`);
  }
}
