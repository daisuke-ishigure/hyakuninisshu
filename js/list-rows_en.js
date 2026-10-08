"use strict";
// Row template for the English poem list (list_en.html).
// The table in list_en.html is prebuilt from this template by _tools/build-index-poem-table.mjs
// (run in Node) and written straight into the HTML so crawlers see all 100 links.
// js/list_en.js only builds the table from hyakunin.json when the page has no prebuilt table.
// After changing the row markup or badges here, rerun _tools/build-index-poem-table.mjs.

////////////////////////////////////////////////////////////
// Color definitions
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

// Anthology name translation
const sourceNameEN = {
  "古今集": "Kokinshū",
  "新古今集": "Shin Kokinshū",
  "後撰集": "Gosen Wakashū",
  "拾遺集": "Shūi Wakashū",
  "後拾遺集": "Goshūi Wakashū",
  "金葉集": "Kin'yō Wakashū",
  "詞花集": "Shika Wakashū",
  "千載集": "Senzai Wakashū",
  "新勅撰集": "Shin Chokusen Wakashū",
  "続後撰集": "Shoku Gosen Wakashū",
  "続古今集": "Shoku Kokin Wakashū",
};

const sectionNameEN = {
  "春": "Spring",
  "夏": "Summer",
  "秋": "Autumn",
  "冬": "Winter",
  "恋": "Love",
  "雑": "Miscellaneous",
  "羇旅": "Travel",
  "賀": "Celebration",
  "哀傷": "Elegy",
};

function escapeHTMLText(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function translateSource(source) {
  if (!source) return "";
  const parts = source.split(" ");
  const anthology = parts[0] || "";
  const section = parts[1] || "";
  const anthEN = sourceNameEN[anthology] || anthology;
  const secEN = sectionNameEN[section] || section;
  return secEN ? `${anthEN} · ${secEN}` : anthEN;
}

function translateDate(date) {
  if (!date) return "";
  // "生没年不詳" → "dates unknown"
  // "生年不詳～996年" → "b. unknown – 996"
  // "626年-671年" or "626年～671年" → "626–671"
  if (date === "生没年不詳") return "dates unknown";
  date = date.replace("生没年不詳", "dates unknown")
             .replace("生年不詳", "b. unknown")
             .replace("没年不詳", "d. unknown")
             .replace(/年頃/g, " (approx.)")
             .replace(/年/g, "")
             .replace(/[～\-–]/g, "–");
  return date;
}

// Convert hiragana to romaji (basic Hepburn)
function hiraganaToRomaji(str) {
  if (!str) return "";
  const map = {
    'あ':'a','い':'i','う':'u','え':'e','お':'o',
    'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
    'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
    'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
    'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
    'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
    'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
    'や':'ya','ゆ':'yu','よ':'yo',
    'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
    'わ':'wa','ゐ':'i','ゑ':'e','を':'o','ん':'n',
    'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
    'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
    'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
    'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
    'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
    'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
    'しゃ':'sha','しゅ':'shu','しょ':'sho',
    'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
    'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
    'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
    'みゃ':'mya','みゅ':'myu','みょ':'myo',
    'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
    'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
    'じゃ':'ja','じゅ':'ju','じょ':'jo',
    'びゃ':'bya','びゅ':'byu','びょ':'byo',
    'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
    'っ':'', // double consonant handled below
  };
  // Handle digraphs first
  let result = '';
  let i = 0;
  while (i < str.length) {
    const two = str.slice(i, i+2);
    if (map[two]) { result += map[two]; i += 2; continue; }
    const one = str[i];
    if (one === 'っ') {
      // double next consonant
      const next = str.slice(i+1, i+3);
      const nextR = map[next] || map[str[i+1]] || '';
      result += nextR[0] || '';
    } else {
      result += map[one] || one;
    }
    i++;
  }
  return result;
}

function stripRuby(html) {
  if (!html) return "";
  return html.replace(/<rt>.*?<\/rt>/g, "").replace(/<[^>]+>/g, "");
}

// Build the <tr>…</tr> HTML string for one poem from hyakunin.json
function buildPoemRowHTML(poem) {
  const num = poem.number;
  const hiragana = poem.hiragana || (poem.yomihuda || "").replace(/<br\s*\/?>/g, "");
  const bg = poem.color && colorMap[poem.color];

  // Kanji text: within each phrase (first / second), <br> → space
  const kanjiFirst  = stripRuby(poem.first.replace(/<br\s*\/?>/g, " "));
  const kanjiSecond = stripRuby(poem.second.replace(/<br\s*\/?>/g, " "));

  // Romaji: yomihuda has 5 lines (5-7-5 / 7-7); the first 3 are the upper verse
  const yomiLines = poem.yomihuda.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "").split("\n");
  const romajiFirst  = yomiLines.slice(0, 3).map(hiraganaToRomaji).join(" ");
  const romajiSecond = yomiLines.slice(3).map(hiraganaToRomaji).join(" ");

  const poetName = stripRuby(poem.name);
  const poetNameEN = poem.name_en || "";
  const dates = poem.date ? translateDate(poem.date) : "";
  const modernText = poem.modern_en || "";

  // Poet name (the commentary/game buttons that used to sit here were removed, same as js/list-rows.js)
  const gameLinksHTML =
    '<div class="waka-game-links">' +
    `<span class="small">${poetName}（${poetNameEN || dates}）</span>` +
    "</div>";

  // The line break between upper and lower verse only shows below 960px (.waka-br in list.css)
  return (
    `<tr data-number="${num}" data-color="${escapeHTMLText(poem.color || "")}" data-theme="${escapeHTMLText(poem.theme || "")}" data-hiragana="${escapeHTMLText(hiragana)}">` +
    `<td${bg ? ` style="background-color: ${bg};"` : ""}>` +
    `<a class="num-badge" href="/${num}_en.html" data-number="${num}" data-tooltip="Poem details">${num}</a></td>` +
    `<td style="background-color: #F7F1E0; cursor: pointer; position: relative;"${modernText ? ' data-has-modern="1"' : ""}>` +
    `<span class="kanji-text">${kanjiFirst} <br class="waka-br">${kanjiSecond}</span> ` +
    `<span class="romaji-text">${romajiFirst} <br class="waka-br">${romajiSecond}</span>` +
    (modernText ? '<span class="modern-toggle">▼ translation</span>' : "") +
    (modernText ? `<span class="modern-text" style="display:none;">${modernText}</span>` : "") +
    gameLinksHTML +
    "</td>" +
    // The next 3 columns are for search (hidden by list.css)
    `<td style="background-color: #F7F1E0;">${poem.yomihuda.replace(/<rt>.*?<\/rt>/g, "").replace(/<\/?ruby>/g, "")}</td>` +
    `<td style="background-color: #F7F1E0;">${escapeHTMLText(romajiFirst + " " + romajiSecond)}</td>` +
    `<td style="background-color: #F7F1E0;">${escapeHTMLText(translateSource(poem.source))}</td>` +
    "</tr>"
  );
}
