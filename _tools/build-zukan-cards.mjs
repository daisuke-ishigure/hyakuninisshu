// kajin-zukan.html・kajin-zukan_en.html（人物図鑑）の歌人カード100枚を HTML に直書きするためのスクリプト。
// カードは js/zukan.js・js/zukan_en.js がブラウザで作るが、JavaScript を実行しないクローラー
// （一部の検索エンジン・AI系クローラー・SNSのリンクプレビュー等）にも紹介文・和歌・各歌のページへのリンクが
// 見えるよう、初期表示（歌番号順・絞り込みなし）と同じカードを静的に埋め込んでおく。
// ブラウザでは従来どおり zukan(.js|_en.js) の render() が読み込み時に同じ内容で描き直し、並べ替え・絞り込みも動く。
//
// 使い方（リポジトリのルートで）:
//   node _tools/build-zukan-cards.mjs
//
// js/zukan.js・js/zukan_en.js（カードの構成・紹介文などのデータ）や js/poems.js（和歌）、
// js/poet-names-en.js（英語名）を変えたら実行すること。
// 各ページの <!-- ZUKAN-CARDS:START --> と <!-- ZUKAN-CARDS:END --> の間（#poet-grid の中身）と、
// 件数表示（#result-count）を書き換える。
//
// ブラウザのスクリプトを無改造のまま、最小限の偽の document（FakeElement）の上で buildCard() を呼んでいる。
// zukan(.js|_en.js) の buildCard() が FakeElement に無い DOM API を使い始めたら、FakeElement を拡張すること。

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const TARGETS = [
  { page: "kajin-zukan.html", scripts: ["js/poems.js", "js/zukan.js"], count: (n) => `${n} 人` },
  {
    page: "kajin-zukan_en.html",
    scripts: ["js/poems.js", "js/poet-names-en.js", "js/zukan_en.js"],
    count: (n) => `${n} poet${n !== 1 ? "s" : ""}`,
  },
];

const START = "<!-- ZUKAN-CARDS:START -->";
const END = "<!-- ZUKAN-CARDS:END -->";

const escAttr = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

// buildCard() が使う範囲だけを持つ要素：className・dataset・innerHTML を outerHTML に直す
class FakeElement {
  constructor(tag) {
    this.tagName = tag;
    this.className = "";
    this.dataset = {};
    this.innerHTML = "";
  }
  get outerHTML() {
    const attrs = [];
    if (this.className) attrs.push(`class="${escAttr(this.className)}"`);
    for (const [k, v] of Object.entries(this.dataset)) attrs.push(`data-${kebab(k)}="${escAttr(v)}"`);
    return `<${this.tagName}${attrs.length ? " " + attrs.join(" ") : ""}>${this.innerHTML}</${this.tagName}>`;
  }
}

// js/poems.js は和歌データ（poems）のほかに、jQuery（$）や location を使うページ用の処理も含むため、
// 何を呼ばれても何もせず自分自身を返す代役（noop）で受け流す。ここで必要なのは poems のデータだけ
const noop = new Proxy(function () {}, {
  get: (_t, key) => (key === Symbol.toPrimitive ? () => "" : noop),
  apply: () => noop,
  construct: () => noop,
});

for (const { page, scripts, count } of TARGETS) {
  const document = new Proxy(
    {
      createElement: (tag) => new FakeElement(tag),
      addEventListener: () => {}, // DOMContentLoaded（フィルター生成・初回描画）は動かさない
    },
    { get: (t, key) => (key in t ? t[key] : noop) },
  );
  const context = vm.createContext({
    document,
    $: noop,
    jQuery: noop,
    location: { origin: "https://hyakuninisshu.com", href: "https://hyakuninisshu.com/", pathname: "/", search: "", hash: "" },
  });
  context.window = context;
  // ページ用の処理がイベント登録・保存などを行っても何もしない
  Object.assign(context, {
    addEventListener: () => {},
    removeEventListener: () => {},
    localStorage: noop,
    sessionStorage: noop,
    setTimeout: () => 0,
    clearTimeout: () => {},
  });
  for (const s of scripts) vm.runInContext(read(s), context, { filename: s });

  // 初期表示（state.sortMode === 'number'・絞り込みなし）と同じく歌番号順。
  // POETS・buildCard はスクリプトのトップレベルの const/function なので、同じコンテキストで式を評価して取り出す
  const cards = vm.runInContext(
    "[...POETS].sort((a, b) => a.number - b.number).map(p => buildCard(p).outerHTML)",
    context,
  );
  if (cards.length !== 100) throw new Error(`${page}: 100人ではありません: ${cards.length}`);

  const block =
    START + "\n" +
    cards.map((c) => "          " + c.replace(/\n\s*\n/g, "\n")).join("\n") + "\n" +
    "          " + END;

  const path = join(root, page);
  let html = readFileSync(path, "utf8");
  const nl = html.includes("\r\n") ? "\r\n" : "\n";
  html = html.replace(/\r\n/g, "\n");

  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a < 0 || b < a) throw new Error(`${page} に ZUKAN-CARDS のマーカーが見つかりません`);
  html = html.slice(0, a) + block + html.slice(b + END.length);

  // 件数表示もブラウザの初回描画と同じ文言にしておく
  const countRe = /(<span id="result-count">)[^<]*(<\/span>)/;
  if (!countRe.test(html)) throw new Error(`${page} に #result-count が見つかりません`);
  html = html.replace(countRe, `$1${count(cards.length)}$2`);

  writeFileSync(path, html.replace(/\n/g, nl));
  console.log(`${page} のカードを更新しました（${cards.length}人）`);
}
