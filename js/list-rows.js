"use strict";
// 百人一首一覧の「表の1行」を作るテンプレート。
// index.html・list.html の表は _tools/build-index-poem-table.mjs が Node でこのテンプレートから作り、HTMLに直書きしている。
// （js/list.js は、表が直書きされていないページではブラウザで hyakunin.json から表を作る）
// 行の見た目・バッジを変えたら、_tools/build-index-poem-table.mjs を実行して両ページの表も作り直すこと。

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

function escapeHTMLText(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// hyakunin.json の1首分から、表の <tr>…</tr> のHTML文字列を作る
function buildPoemRowHTML(poem) {
  const num = poem.number;
  const flat = (s) => s.replace(/<br\s*\/?>/g, " ");
  const hiragana = poem.hiragana || (poem.yomihuda || "").replace(/<br\s*\/?>/g, "");
  const modernText = poem.modern || "";
  const bg = poem.color && colorMap[poem.color];

  // 上の句と下の句の間の改行は、画面幅960px未満だけCSS（list.css の .waka-br）で出す
  const wakaHTML = flat(poem.first) + ' <br class="waka-br">' + flat(poem.second);

  // 歌人名・生没年（以前はここに解説ページ・各ゲームへのボタンも並べていたが、削除した）
  const gameLinksHTML =
    '<div class="waka-game-links">' +
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
