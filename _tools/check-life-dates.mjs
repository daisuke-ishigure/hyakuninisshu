// 歌人の生没年がサイト内の各所で食い違っていないかを調べるスクリプト（読むだけで、ファイルは書き換えない）。
//
// 使い方（リポジトリのルートで）:
//   node _tools/check-life-dates.mjs
//
// 生没年は手書きで何か所にも重複しているため、どこかを直したら実行して取りこぼしを確認する。
// 基準は各歌ページ（N.html）の略年表（<dl class="nenpyo">）の「誕生」「死去・崩御」の年。
// 略年表に誕生・死去の行が無いときは、その部分だけ N.html の作者の行（作者：〇〇（生年～没年））を基準にする。
//
// 比べる箇所:
//   N.html 作者の行 / N_en.html の Author 行 / N.html のページ内年表（.timeline-item、一部のページのみ）
//   js/keizu-tips.js・js/tenno-keizu-tooltips.js・js/fujiwara-keizu-tooltips.js（系図のツールチップ。「百人一首：N番」を含む人物）
//   chronology.html（ツールチップの生没年とバーの範囲）/ js/zukan.js・js/zukan_en.js（人物図鑑）
//   sound-list.html・sound-list_en.html / sanjurokkasen.html / js/poems.js の "date"
//
// 年は数字だけで比べ、「頃」「？」「以降」などの違いは見ない（「901年または907年」は 901・907 のどちらかが合えば一致）。
// 結果:
//   × 食い違い … 両方に年があるのに一致しない（終了コード 1）
//   △ 注意     … 片方は「不詳」なのに、もう片方には年がある
//
// フォルダ名が「_」で始まるのは、GitHub Pages（Jekyll）の公開対象から外すため（_ 始まりは配信されない）。

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const strip = (s) => decode(s).replace(/<rt>[\s\S]*?<\/rt>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const years = (s) => (s || "").match(/\d{3,4}/g) || [];

// 「626年～672年」「生年不詳～901年」「dates unknown–901」「c. 845–907」などを [生年側, 没年側] に分ける
function splitLife(life) {
  if (!life) return null;
  const s = life.trim();
  // 「生没年不詳（946年没とする説あり）」のような補足付きも、生没年とも不詳として扱う
  if (/^(不明|不詳)$/.test(s) || /^(生没年不詳|dates unknown)(?![～\-–])/.test(s)) return ["", ""];
  // 英語版の「d. 1025」（没年だけ分かる）・「b. 976」（生年だけ分かる）
  if (/^d\. /.test(s)) return ["", s.slice(3)];
  if (/^b\. /.test(s)) return [s.slice(3), ""];
  // 区切り：～（全角チルダ）、半角 -、英語版の –（en dash）。「1058〜1065年」の 〜（波ダッシュ）は区切りにしない
  const m = s.match(/^(.*?)\s*[～\-–]\s*(.*)$/);
  return m ? [m[1], m[2]] : [s, ""];
}

// 三十六歌仙ページのカードid → 歌番号（カードに歌番号のリンクが無いため）
const KASEN_CARD_IDS = {
  3: "01", 4: "06", 5: "11", 6: "05", 9: "12", 12: "08", 17: "07", 18: "21",
  19: "04", 21: "09", 27: "13", 28: "23", 29: "03", 30: "18", 31: "29", 33: "10",
  34: "27", 35: "02", 40: "35", 41: "34", 42: "28", 43: "15", 44: "14", 48: "22",
  49: "33",
};

// ---- 各ソースを読み込む（歌番号 → 生没年の文字列）----
const sources = {}; // name → { [n]: life }
const add = (name, n, life) => ((sources[name] ||= {})[n] = life);

// 系図のツールチップ
const ctx = vm.createContext({ window: {} });
ctx.window.window = ctx.window;
for (const f of ["js/keizu-tips.js", "js/tenno-keizu-tooltips.js", "js/fujiwara-keizu-tooltips.js"]) {
  vm.runInContext(read(f), ctx);
}
for (const [file, key] of [["keizu-tips.js", "KD_TIPS"], ["tenno-keizu-tooltips.js", "TK_TOOLTIPS"], ["fujiwara-keizu-tooltips.js", "FK_TOOLTIPS"]]) {
  for (const lines of Object.values(ctx.window[key] || {})) {
    const head = lines.find((l) => /百人一首：\d+番/.test(l));
    const life = lines.find((l) => /^生没年：/.test(l));
    if (head && life) add(`系図 ${file}`, +head.match(/百人一首：(\d+)番/)[1], life.replace(/^生没年：/, ""));
  }
}

// chronology.html（同じ歌人の2行目以降は出来事の行なので、歌番号付きの最初の行だけ）
// ツールチップは「貞信公（藤原忠平）:<br>（880年-949年）<br>補足…」の形なので、最初の <br> の直後の（…）を生没年とする
const chrono = read("chronology.html");
const chronoBars = {};
const chronoNames = {};
for (const m of chrono.matchAll(/\['([^']+)', '（(\d+)）[^']*', '([^']*)', new Date\((\d+), \d+\), new Date\((\d+), \d+\)\]/g)) {
  const n = +m[2];
  if (sources["chronology.html"]?.[n]) continue;
  add("chronology.html", n, (m[3].match(/<br>（(.*?)）(?:<br>|$)/) || [])[1]);
  chronoBars[n] = [m[4], m[5]];
  chronoNames[n] = m[1];
}

// 人物図鑑
for (const f of ["js/zukan.js", "js/zukan_en.js"]) {
  for (const m of read(f).matchAll(/n: (\d+), name: '[^']*', date: '([^']*)'/g)) add(f, +m[1], m[2]);
}

// js/poems.js
for (const m of read("js/poems.js").matchAll(/"number": "(\d+)",[\s\S]*?"date": "([^"]*)"/g)) add("js/poems.js", +m[1], m[2]);

// 音声一覧
for (const f of ["sound-list.html", "sound-list_en.html"]) {
  for (const m of read(f).matchAll(/href="\/?(\d+)(?:_en)?\.html"><ruby>(?:(?!<\/ruby>)[\s\S])*<\/ruby>（([^（）]*)）/g)) add(f, +m[1], m[2]);
}

// 三十六歌仙
const kasen = read("sanjurokkasen.html");
for (const [n, id] of Object.entries(KASEN_CARD_IDS)) {
  const i = kasen.indexOf(`<article class="kasen-card" id="${id}">`);
  const card = i >= 0 ? kasen.slice(i, kasen.indexOf("</article>", i)) : "";
  const m = card.match(/kasen-card__life">（([^（）]*)）/);
  if (m) add("sanjurokkasen.html", +n, m[1]);
}

// ---- 歌ページごとに比べる ----
const OTHERS_DEATH = /(の|が)(崩御|死去|薨去)|崩御後|死去後|説|伝承|伝わる|(父|母|夫|妻|娘|息子|兄|弟|姉|妹)・/;
let errors = 0, warnings = 0;
const report = [];

for (let n = 1; n <= 100; n++) {
  const page = read(`${n}.html`);
  const pageEn = read(`${n}_en.html`);

  // 略年表
  const nenpyo = (page.match(/<dl class="nenpyo">([\s\S]*?)<\/dl>/) || [])[1];
  const rows = nenpyo ? [...nenpyo.matchAll(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g)].map((m) => [strip(m[1]), strip(m[2])]) : [];
  const birthRow = rows.find(([y, t]) => /\d/.test(y) && /誕生/.test(t));
  const deathRow = rows.filter(([y, t]) => /\d/.test(y) && /死去|崩御|薨去|暗殺|没/.test(t) && !OTHERS_DEATH.test(t)).pop();

  // 作者の行
  const authorM = page.match(/作者：([\s\S]*?)(出典：|<\/span>\s*<\/)/);
  const authorText = authorM ? strip(authorM[1]) : "";
  const author = (authorText.match(/（([^（）]*)）$/) || [])[1];
  const authorName = authorText.replace(/（[^（）]*）$/, "").trim();
  const enM = pageEn.match(/Author: [^<]*?\(([^()]*)\)/);

  const issues = [];
  if (!nenpyo) issues.push(["×", "略年表（dl.nenpyo）が見つからない"]);
  if (!author) issues.push(["×", "作者の行の生没年が読めない"]);

  // 基準：略年表 → 無い部分は作者の行
  const [aB, aD] = splitLife(author) || ["", ""];
  const ref = {
    birth: birthRow ? birthRow[0] : aB,
    death: deathRow ? deathRow[0] : aD,
    from: [birthRow ? "略年表" : "作者の行", deathRow ? "略年表" : "作者の行"],
  };

  const compare = (label, life) => {
    const parts = splitLife(life);
    if (!parts) return;
    [["生年", ref.birth, parts[0], ref.from[0]], ["没年", ref.death, parts[1], ref.from[1]]].forEach(([what, r, v, from]) => {
      const ry = years(r), vy = years(v);
      if (ry.length && vy.length && !ry.some((y) => vy.includes(y))) issues.push(["×", `${label}の${what}「${life}」が${from}（${r}）と違う`]);
      else if (ry.length && !vy.length) issues.push(["△", `${label}の${what}が不詳（${life}）、${from}は ${r}`]);
      else if (!ry.length && vy.length) issues.push(["△", `${label}の${what}は ${v}（${life}）、${from}は不詳`]);
    });
  };

  if (birthRow || deathRow) compare("作者の行", author);
  if (enM) compare(`${n}_en.html の Author 行`, enM[1]);
  else issues.push(["△", `${n}_en.html の Author 行の生没年が読めない`]);
  for (const [name, map] of Object.entries(sources)) if (map[n] !== undefined) compare(name, map[n]);

  // chronology.html のバーの範囲（生年・没年が分かっているのにバーがずれていないか）
  if (chronoBars[n]) {
    const [s, e] = chronoBars[n];
    if (years(ref.birth).length && !years(ref.birth).includes(s)) issues.push(["△", `chronology.html のバーの開始 ${s} が生年（${ref.birth}）と違う`]);
    if (years(ref.death).length && !years(ref.death).includes(e)) issues.push(["△", `chronology.html のバーの終了 ${e} が没年（${ref.death}）と違う`]);
  }

  // ページ内年表（.timeline-item）：本人の誕生・死去の項目
  // 見出しに本人の名前（作者の行・略年表の見出し・chronology.html の名前のどれか）を含むものだけを本人の項目とみなす
  // （「父・天智天皇が崩御」「藤原温子崩御」「一条天皇が崩御」などの他人の項目を拾わないため）
  const names = [authorName, (page.match(/<dt class='title'>(.*?)の略年表<\/dt>/) || [])[1], chronoNames[n]].filter(Boolean);
  for (const m of page.matchAll(/class="timeline-item" date-is='([^']*)'>([\s\S]*?)<\/div>/g)) {
    const y = years(m[1])[0];
    for (const h of m[2].matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)) {
      const t = strip(h[1]);
      const self = !/・/.test(t) && names.some((nm) => t.includes(nm));
      if (!self) continue;
      if (/誕生/.test(t) && !/出産/.test(t) && years(ref.birth).length && !years(ref.birth).includes(y)) issues.push(["×", `ページ内年表「${t}」(${m[1]}) が生年（${ref.birth}）と違う`]);
      if (/死去|崩御|薨去/.test(t) && years(ref.death).length && !years(ref.death).includes(y)) issues.push(["×", `ページ内年表「${t}」(${m[1]}) が没年（${ref.death}）と違う`]);
    }
  }

  if (issues.length) {
    report.push(`#${n} ${authorName}（略年表：${ref.birth || "生年なし"}～${ref.death || "没年なし"}）`);
    for (const [mark, msg] of issues) {
      report.push(`   ${mark} ${msg}`);
      if (mark === "×") errors++; else warnings++;
    }
  }
}

console.log(report.join("\n") || "食い違いはありません。");
console.log(`\n× 食い違い ${errors} 件 / △ 注意 ${warnings} 件`);
process.exitCode = errors ? 1 : 0;
