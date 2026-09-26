// 古いURLから現在のページへ転送する「転送用ページ」を作るスクリプト。
//
// このサイトは GitHub Pages で配信しており、.htaccess の RewriteRule（301リダイレクト）は効かない。
// そのため、古いURLの場所に「すぐ新しいURLへ移動する小さなHTML」を置いて転送する。
// （canonical ＋ meta refresh 0秒 ＋ JavaScript。Google は 0秒の meta refresh を恒久的な転送として扱う。
//   GitHub Pages 公式の jekyll-redirect-from が出力するものと同じ形）
//
// 使い方（リポジトリのルートで）:
//   node _tools/build-redirects.mjs
//
// 転送を追加・変更したら、下の REDIRECTS を編集してから実行する。
// ここに無い「/noNN〜」形式のURLは、404.html のスクリプトが歌番号を読み取って転送する。

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// 旧サイト（WordPress時代）の歌ページ。Internet Archive に記録のあったURL（29番は記録なし → 404.html で転送）
const OLD_POEM_SLUGS = {
  1: "akinotano", 2: "harusugite", 3: "ashihikino", 4: "tagonoura", 5: "okuyamani",
  6: "kasasagino", 7: "amanohara", 8: "wagaiowa", 9: "hananoirowa", 10: "koreyakono",
  11: "watanohara", 12: "amatsukaze", 13: "tsukubaneno", 14: "michinokuno", 15: "kimigatame",
  16: "tachiwakare", 17: "chihayaburu", 18: "suminoeno", 19: "naniwagata", 20: "wabinureba",
  21: "imakomuto", 22: "fukukarani", 23: "tsukimireba", 24: "konotabiwa", 25: "nanishiowaba",
  26: "ogurayama", 27: "mikanohara", 28: "yamazatoha", 30: "ariakeno",
  31: "asaborake", 32: "yamagawani", 33: "hisakatano", 34: "tarewokamo", 35: "hitowaisa",
  36: "natsunoyoruwa", 37: "shiratsuyuni", 38: "wasuraruru", 39: "asadifuo", 40: "shinoburedo",
  41: "kohisutefu", 42: "chigirikina", 43: "ahimiteno", 44: "agukotono", 45: "aharetomo",
  46: "yuranomonwo", 47: "yahemugura", 48: "kazewoitami", 49: "mikakimori", 50: "kimigatame",
  51: "kakutodani", 52: "akenureba", 53: "nagekitsutsu", 54: "wasurejino", 55: "takinootoha",
  56: "arazaramu", 57: "meguriahite", 58: "arimayama", 59: "yasurahade", 60: "ohoeyama",
  61: "inishiheno", 62: "yowokomete", 63: "imahatada", 64: "asaborake", 65: "uramiwabi",
  66: "morotomoni", 67: "harunoyono", 68: "kokoronimo", 69: "arashihuku", 70: "sabishisani",
  71: "yusareba", 72: "otonikiku", 73: "takasagono", 74: "ukarikeru", 75: "chigiriokishi",
  76: "watanohara", 77: "sewohayami", 78: "awajishima", 79: "akikazeni", 80: "nagakaramu",
  81: "hototogisu", 82: "omoiwabite", 83: "yononakayo", 84: "nagaraheba", 85: "yomosugara",
  86: "nageketote", 87: "murasameno", 88: "naniwaeno", 89: "tamanowoyo", 90: "misebayana",
  91: "kirigirisu", 92: "wagasodeha", 93: "yononakaha", 94: "miyoshinono", 95: "ohokenaku",
  96: "hanasasofu", 97: "konuhitowo", 98: "kazesoyogu", 99: "hitomowoshi", 100: "momoshikiya",
};

// 古いURL（先頭の / なし）→ 転送先
const REDIRECTS = {
  // 名前を変えた・統合したページ（旧 .htaccess の RewriteRule と同じ）
  "bozumekuri.html": "/memory.html",
  "yakushoku.html": "/kanshoku.html",
  "kajin-sort.html": "/kajin-zukan.html",
  "hudanagashi.html": "/hudanagashi-flash.html",
  "karuta_tokkun.html": "/karuta.html",
  // 削除したページ
  "leaflet-map.html": "/utamakura.html",
};
for (const [num, slug] of Object.entries(OLD_POEM_SLUGS)) {
  REDIRECTS[`no${num}${slug}/index.html`] = `/${num}.html`;
}

function redirectPage(to) {
  const abs = "https://hyakuninisshu.com" + to;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ページを移動しました｜時雨の百人一首</title>
  <link rel="canonical" href="${abs}">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url=${to}">
  <script>location.replace(${JSON.stringify(to)} + location.search + location.hash);</script>
</head>
<body>
  <p>このページは移動しました。<a href="${to}">${abs}</a> へお進みください。</p>
</body>
</html>
`;
}

let count = 0;
for (const [from, to] of Object.entries(REDIRECTS)) {
  const target = join(root, to.slice(1));
  if (!existsSync(target)) throw new Error(`転送先がありません: ${from} → ${to}`);
  const file = join(root, from);
  // 転送用ページ以外（実在のページ）を上書きしないよう確認
  if (existsSync(file) && !readFileSync(file, "utf8").includes('<meta http-equiv="refresh" content="0;')) {
    throw new Error(`転送用ではないファイルが既にあります: ${from}`);
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, redirectPage(to));
  count++;
}
console.log(`転送用ページを ${count} 件作りました`);
