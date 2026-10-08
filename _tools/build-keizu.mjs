// 歌のページ（N.html）の相関図の SVG を HTML に直書きするためのスクリプト。
// JavaScript を実行しない検索エンジン・AI のクローラーにも系図（人名と歌のページへのリンク）が読めるよう、
// ブラウザで描かずに前もって SVG を作って埋め込んでいる。描き方は js/keizu-diagram.js（ブラウザと共用）。
//
// 使い方（リポジトリのルートで）:
//   node _tools/build-keizu.mjs
//
// 相関図のデータ（各ページの <div class="kd-chart"> の中の <script type="application/json">）や、
// ツールチップの文面（js/tenno-keizu-tooltips.js・js/fujiwara-keizu-tooltips.js・js/keizu-tips.js、英語版は js/keizu-tips_en.js）、js/keizu-diagram.js を変えたら実行すること。
// データの直後の <!-- #region KEIZU:START --> と <!-- #endregion KEIZU:END --> の間を書き換える（無ければ足す）。
// ルートにある .html のうち、class="kd-chart" を含むものをすべて対象にする。
//
// あわせて、天皇の略系図（tenno-keizu.html）・藤原氏の略系図（fujiwara-keizu.html）の「全体」の系図も書き込む。
// こちらは各ページの js（js/tenno-keizu.js・js/fujiwara-keizu.js）を、ブラウザの代わりの簡易 DOM の上でそのまま動かして作る。
// 系図のデータ（js の TREE・FILTERS）やツールチップの文面を変えたら、同じく実行すること。
// #fkChart の中の <!-- #region KEIZU:START -->〜<!-- #endregion KEIZU:END --> と、#fkDesc（系統の説明）の中身を書き換える。
// ブラウザではページを開いたときに js が描き直すので、見た目・操作は変わらない。
//
// フォルダ名が「_」で始まるのは、GitHub Pages（Jekyll）の公開対象から外すため（_ 始まりは配信されない）。

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

// ブラウザと同じファイルを読み込む（window.TK_TOOLTIPS・FK_TOOLTIPS と window.KeizuDiagram ができる）
const context = vm.createContext({});
context.window = context;
vm.runInContext(read("js/tenno-keizu-tooltips.js"), context);
vm.runInContext(read("js/fujiwara-keizu-tooltips.js"), context);
vm.runInContext(read("js/keizu-tips.js"), context);
vm.runInContext(read("js/keizu-tips_en.js"), context);
vm.runInContext(read("js/keizu-diagram.js"), context);
const { KeizuDiagram, TK_TOOLTIPS, FK_TOOLTIPS, KD_TIPS, KD_TIPS_EN } = context;
const TIP_SETS = { tenno: TK_TOOLTIPS, fujiwara: FK_TOOLTIPS, kd: KD_TIPS, en: KD_TIPS_EN };

const OPEN = '<div class="kd-chart"';
const JSON_OPEN = '<script type="application/json">';
const JSON_CLOSE = "</script>";
const START = "<!-- #region KEIZU:START -->";
const END = "<!-- #endregion KEIZU:END -->";

const pages = readdirSync(root).filter((f) => f.endsWith(".html") && read(f).includes('class="kd-chart"'));
if (!pages.length) console.log("相関図（class=\"kd-chart\"）のあるページはありません");

for (const page of pages) {
  let html = read(page);
  let from = 0;
  let count = 0;
  for (;;) {
    const open = html.indexOf(OPEN, from);
    if (open < 0) break;
    const openEnd = html.indexOf(">", open);
    const label = (html.slice(open, openEnd).match(/aria-label="([^"]*)"/) || [])[1] || "相関図";
    const a = html.indexOf(JSON_OPEN, openEnd);
    const b = html.indexOf(JSON_CLOSE, a);
    if (a < 0 || b < 0) throw new Error(`${page}: 相関図のデータ（<script type="application/json">）が見つかりません`);
    const src = html.slice(a + JSON_OPEN.length, b);
    let data;
    try {
      data = JSON.parse(src);
    } catch (e) {
      throw new Error(`${page}: 相関図のデータが JSON として読めません（${e.message}）`);
    }

    // データの <script> と同じ字下げで書き込む
    const lineStart = html.lastIndexOf("\n", a) + 1;
    const indent = html.slice(lineStart, a).match(/^\s*/)[0];
    const svg = KeizuDiagram.toSvg(data, TIP_SETS, label, src);
    const block = START + "\n" + indent + svg + "\n" + indent + END;

    // 既にある START〜END を置き換える（データの直後にあるものだけ。無ければ足す）
    const after = b + JSON_CLOSE.length;
    const rest = html.slice(after);
    const lead = rest.match(/^\s*/)[0];
    let tail;
    if (rest.startsWith(START, lead.length)) {
      const e = html.indexOf(END, after);
      if (e < 0) throw new Error(`${page}: ${START} に対応する ${END} がありません`);
      tail = html.slice(e + END.length);
    } else {
      tail = html.slice(after);
    }
    html = html.slice(0, after) + "\n" + indent + block + tail;
    from = after + block.length;
    count++;
  }
  writeFileSync(join(root, page), html);
  console.log(`${page} の相関図を更新しました（${count}個）`);
}

/* ---------- 天皇の略系図・藤原氏の略系図（「全体」の表示） ---------- */
const TREE_PAGES = [
  { page: "tenno-keizu.html", scripts: ["js/tenno-keizu-tooltips.js", "js/tenno-keizu.js"] },
  { page: "fujiwara-keizu.html", scripts: ["js/fujiwara-keizu-tooltips.js", "js/fujiwara-keizu.js"] },
];

const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => escText(s).replace(/"/g, "&quot;");

// 系図の js が使う分だけの、ブラウザの代わりの DOM
class FakeElement {
  constructor(name) {
    this.name = name;
    this.attrs = new Map();
    this.children = [];
    this.text = null;
    this.dataset = {};
    this.style = {};
    this.classList = { add() {}, remove() {} };
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.clientWidth = 1000;
  }
  setAttribute(k, v) { this.attrs.set(k, String(v)); }
  getAttribute(k) { return this.attrs.has(k) ? this.attrs.get(k) : null; }
  appendChild(c) { this.children.push(c); return c; }
  replaceChildren(...c) { this.children = c; }
  addEventListener() {}
  removeEventListener() {}
  querySelectorAll(sel) {
    // filterBox.querySelectorAll('button') だけ使われる
    return this.children.filter((c) => c.name === sel);
  }
  getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }; }
  set textContent(v) { this.text = String(v); this.children = []; }
  get textContent() { return this.text ?? ""; }
  set className(v) { this.setAttribute("class", v); }
  toString() {
    let a = "";
    for (const [k, v] of this.attrs) a += ` ${k}="${escAttr(v)}"`;
    const body = this.text !== null ? escText(this.text) : this.children.map(String).join("");
    return `<${this.name}${a}>${body}</${this.name}>`;
  }
}

for (const { page, scripts } of TREE_PAGES) {
  const byId = {};
  const getElementById = (id) => (byId[id] ??= new FakeElement("div"));
  const ctx = vm.createContext({
    console,
    document: {
      getElementById,
      createElement: (n) => new FakeElement(n),
      createElementNS: (ns, n) => new FakeElement(n),
      body: new FakeElement("body"),
    },
    location: { hash: "", pathname: "/" + page },
    history: { replaceState() {} },
    matchMedia: () => ({ matches: false }),
    addEventListener() {},
    scrollTo() {},
    scrollX: 0,
    scrollY: 0,
    innerHeight: 800,
  });
  ctx.window = ctx;
  for (const s of scripts) vm.runInContext(read(s), ctx);

  const chart = byId.fkChart;
  const svgEl = chart && chart.children[0];
  if (!svgEl || svgEl.name !== "svg") throw new Error(`${page}: 系図の SVG が作れませんでした`);
  // ブラウザで作り直すまでの仮の SVG なので、ツールチップ用の属性は省く（ページが軽くなる）
  (function strip(e) {
    if (!(e instanceof FakeElement)) return;
    e.attrs.delete("data-tippy-content");
    e.children.forEach(strip);
  })(svgEl);
  const svg = String(svgEl);
  const desc = byId.fkDesc ? byId.fkDesc.textContent : "";

  let html = read(page);
  // #fkChart の中身
  const open = html.indexOf('<div class="fk-chart" id="fkChart">');
  if (open < 0) throw new Error(`${page}: <div class="fk-chart" id="fkChart"> が見つかりません`);
  const inner = open + '<div class="fk-chart" id="fkChart">'.length;
  const close = html.indexOf("</div>", html.includes(END, inner) ? html.indexOf(END, inner) : inner);
  const lineStart = html.lastIndexOf("\n", open) + 1;
  const indent = html.slice(lineStart, open).match(/^\s*/)[0];
  html = html.slice(0, inner) +
    "\n" + indent + "  " + START + "\n" + indent + "  " + svg + "\n" + indent + "  " + END + "\n" + indent +
    html.slice(close);
  // #fkDesc（「全体」の説明）
  html = html.replace(/(<p class="fk-desc" id="fkDesc"[^>]*>)[\s\S]*?(<\/p>)/, (m, a, b) => a + escText(desc) + b);

  writeFileSync(join(root, page), html);
  console.log(`${page} の系図（全体）を更新しました`);
}
