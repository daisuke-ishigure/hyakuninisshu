"use strict";
// 百人一首一覧の「表の1行」を作るテンプレート。
// list.html（js/list.js がブラウザで hyakunin.json から表を作る）と、
// index.html（_tools/build-index-poem-table.mjs が Node で表を作り、HTMLに直書きする）の両方で使う。
// 行の見た目・バッジを変えたら、_tools/build-index-poem-table.mjs を実行して index.html の表も作り直すこと。

////////////////////////////////////////////////////////////
// カラー定義
////////////////////////////////////////////////////////////

const colorMap = {
  "赤": "#fde8e8",
  "橙": "#fef0e0",
  "黄": "#fefbe0",
  "緑": "#e8f5e8",
  "青": "#e8f0fe",
  "紫": "#f3e8fe",
  "ピンク": "#fde8f3",
  "白": "#f9f9f9",
  "灰": "#efefef",
};

// 掛詞ゲーム（kakekotoba-game-NNN.html）はまだ全100首分は無く、
// 現時点で作成済みの歌番号のみ一覧に表示する。
// /kakekotoba-game スキルで新しい番号を追加したら、ここにも追記すること。
const KAKEKOTOBA_GAME_NUMS = new Set([
  1, 8, 9, 10, 13, 14, 16, 20, 22, 24, 25, 27, 28,
  51, 58, 60, 62, 67, 72, 77, 88, 91, 95, 96, 97, 98, 100,
]);

// 三十六歌仙に選ばれている歌人の歌番号 → sanjurokkasen.html 内の歌人カードのid。
// バッジから該当歌人のカードへ直接飛べるようにする。
const SANJUROKKASEN_CARD_IDS = {
  3: "01", 4: "06", 5: "11", 6: "05", 9: "12", 12: "08", 17: "07", 18: "21",
  19: "04", 21: "09", 27: "13", 28: "23", 29: "03", 30: "18", 31: "29", 33: "10",
  34: "27", 35: "02", 40: "35", 41: "34", 42: "28", 43: "15", 44: "14", 48: "22",
  49: "33",
};

function escapeHTMLText(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// hyakunin.json の1首分から、表の <tr>…</tr> のHTML文字列を作る
function buildPoemRowHTML(poem) {
  const num = poem.number;
  // poem.number は hyakunin.json 上では文字列("1"など)なので、
  // 数値のSetと比較する前に必ずNumber()で変換する（変換し忘れると
  // .has()が常にfalseになり、バッジが一切表示されなくなる）。
  const poemNum = Number(num);
  const paddedNum = String(num).padStart(2, "0");
  const paddedNum3 = String(num).padStart(3, "0");
  const flat = (s) => s.replace(/<br\s*\/?>/g, " ");
  const hiragana = poem.hiragana || (poem.yomihuda || "").replace(/<br\s*\/?>/g, "");
  const modernText = poem.modern || "";
  const bg = poem.color && colorMap[poem.color];
  const kasenCardId = SANJUROKKASEN_CARD_IDS[poemNum];
  const poetName = poem.name.replace(/<rt>.*?<\/rt>/g, "");

  // 上の句と下の句の間の改行は、画面幅960px未満だけCSS（list.css の .waka-br）で出す
  const wakaHTML = flat(poem.first) + ' <br class="waka-br">' + flat(poem.second);

  const gameLinksHTML =
    '<div class="waka-game-links">' +
    `<a class="game-badge game-badge--poet" href="/${num}.html" data-tooltip="解説ページへ">${poetName}の歌</a>` +
    `<a class="game-badge game-badge--daruma" href="/daruma-otoshi-${paddedNum}.html" data-tooltip="だるま落としで遊ぶ">だるま落とし</a>` +
    `<a class="game-badge game-badge--gokunarabe" href="/gokunarabe_${paddedNum}.html" data-tooltip="歌人に会える五句並べ">五句並べ</a>` +
    (KAKEKOTOBA_GAME_NUMS.has(poemNum)
      ? `<a class="game-badge game-badge--kakekotoba" href="/kakekotoba-game-${paddedNum3}.html" data-tooltip="掛詞クルッと発見で遊ぶ">掛詞クルッと発見</a>`
      : "") +
    (kasenCardId
      ? `<a class="game-badge game-badge--kasen" href="/sanjurokkasen.html#${kasenCardId}" data-tooltip="三十六歌仙の紹介へ">三十六歌仙</a>`
      : "") +
    '<span class="small">' + poem.name + (poem.date ? "（" + poem.date + "）" : "") + "</span>" +
    "</div>";

  return (
    `<tr data-number="${num}" data-color="${escapeHTMLText(poem.color || "")}" data-theme="${escapeHTMLText(poem.theme || "")}" data-hiragana="${escapeHTMLText(hiragana)}">` +
    `<td${bg ? ` style="background-color: ${bg};"` : ""}>` +
    `<a class="num-badge" href="/${num}.html" data-number="${num}" data-tooltip="解説ページへ">${num}</a></td>` +
    `<td style="background-color: #F7F1E0; cursor: pointer; position: relative;"${modernText ? ' data-has-modern="1"' : ""}>` +
    wakaHTML +
    (modernText ? '<span class="modern-toggle">▼ 現代語訳</span>' : "") +
    (modernText ? '<span class="modern-text" style="display:none;">' + modernText + "</span>" : "") +
    gameLinksHTML +
    "</td>" +
    // 以下3列は検索用（list.css で非表示）
    `<td style="background-color: #F7F1E0;">${poem.yomihuda.replace(/<rt>.*?<\/rt>/g, "")}</td>` +
    `<td style="background-color: #F7F1E0;">${escapeHTMLText(poem.hiragana || "")}</td>` +
    `<td style="background-color: #F7F1E0;">${poem.forConsole.replace(/ /g, "")}</td>` +
    "</tr>"
  );
}
