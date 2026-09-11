"use strict";
$();
const jsonAddress = "../js/hyakunin.json?04";

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

const colorOrder = ["赤", "橙", "黄", "緑", "青", "紫", "ピンク", "白", "灰"];

const colorNameEN = {
  "赤": "Red",
  "橙": "Orange",
  "黄": "Yellow",
  "緑": "Green",
  "青": "Blue",
  "紫": "Purple",
  "ピンク": "Pink",
  "白": "White",
  "灰": "Gray",
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

function yomihudaToRomaji(yomihuda) {
  if (!yomihuda) return "";
  // Strip HTML tags, replace <br> with space
  const text = yomihuda.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "");
  return hiraganaToRomaji(text);
}

function stripRuby(html) {
  if (!html) return "";
  return html.replace(/<rt>.*?<\/rt>/g, "").replace(/<[^>]+>/g, "");
}

////////////////////////////////////////////////////////////
// Build the poem list
////////////////////////////////////////////////////////////

fetch(jsonAddress)
  .then((response) => response.json())
  .then((data) => {
    let table = document.createElement("table");

    for (let key in data) {
      let poem = data[key];
      let tr = document.createElement("tr");

      tr.dataset.number = poem.number;
      tr.dataset.color = poem.color || "";
      tr.dataset.hiragana = poem.hiragana || (poem.yomihuda || "").replace(/<br\s*\/?>/g, "");

      // Number cell
      let numberTd = document.createElement("td");
      numberTd.innerHTML = `<span class="num-badge" data-number="${poem.number}" data-tooltip="Poem details">${poem.number}</span><br><span class="gokunarabe-badge" data-number="${poem.number}" data-tooltip="Meet the poet">${poem.number}</span>`;
      if (poem.color && colorMap[poem.color]) {
        numberTd.style.backgroundColor = colorMap[poem.color];
      }
      tr.appendChild(numberTd);

      // Poem cell – show kanji text + romaji + poet name + dates
      // Within each phrase (first / second), <br> → space to preserve phrase-breaks
      const kanjiFirst  = stripRuby(poem.first.replace(/<br\s*\/?>/g, " "));
      const kanjiSecond = stripRuby(poem.second.replace(/<br\s*\/?>/g, " "));

      // Romaji: split yomihuda on the midpoint to get upper/lower verse
      // yomihuda has 5 lines (5-7-5 / 7-7), split after 3rd <br> for upper verse
      const yomiLines = poem.yomihuda.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "").split("\n");
      const romajiFirst  = yomiLines.slice(0, 3).map(hiraganaToRomaji).join(" ");
      const romajiSecond = yomiLines.slice(3).map(hiraganaToRomaji).join(" ");

      const poetName = stripRuby(poem.name);
      const poetNameEN = poem.name_en || '';
      const dates = poem.date ? translateDate(poem.date) : '';

      let wakaTd = document.createElement("td");
      wakaTd.style.backgroundColor = "#F7F1E0";
      wakaTd.style.cursor = "pointer";
      wakaTd.style.position = "relative";
      const modernText = poem.modern_en || "";
      if (window.innerWidth >= 960) {
        wakaTd.innerHTML =
          `<span class="kanji-text">${kanjiFirst} ${kanjiSecond}</span> ` +
          `<span class="romaji-text">${romajiFirst} ${romajiSecond}</span>` +
          `<span class="small">${poetName}（${poetNameEN || dates}）</span>` +
          (modernText ? `<span class="modern-toggle">▼ translation</span>` : '') +
          (modernText ? `<span class="modern-text" style="display:none;">${modernText}</span>` : '');
      } else {
        wakaTd.innerHTML =
          `<span class="kanji-text">${kanjiFirst}<br>${kanjiSecond}</span>` +
          `<span class="romaji-text">${romajiFirst}<br>${romajiSecond}</span>` +
          `<span class="small">${poetName}（${poetNameEN || dates}）</span>` +
          (modernText ? `<span class="modern-toggle">▼ translation</span>` : '') +
          (modernText ? `<span class="modern-text" style="display:none;">${modernText}</span>` : '');
      }
      if (modernText) {
        wakaTd.dataset.hasModern = "1";
        wakaTd.addEventListener("click", function () {
          const el = this.querySelector(".modern-text");
          const toggle = this.querySelector(".modern-toggle");
          const isOpen = el.style.display !== "none";
          el.style.display = isOpen ? "none" : "block";
          toggle.textContent = isOpen ? "▼ translation" : "▲ close";
        });
      }
      tr.appendChild(wakaTd);

      // Yomihuda cell (hiragana reading, no ruby)
      let kanaTd = document.createElement("td");
      kanaTd.style.backgroundColor = "#F7F1E0";
      kanaTd.innerHTML = poem.yomihuda.replace(/<rt>.*?<\/rt>/g, "").replace(/<ruby>/g,"").replace(/<\/ruby>/g,"");
      tr.appendChild(kanaTd);

      // Romaji cell
      let romajiTd = document.createElement("td");
      romajiTd.style.backgroundColor = "#F7F1E0";
      romajiTd.textContent = romajiFirst + " " + romajiSecond;
      tr.appendChild(romajiTd);

      // Source cell (translated)
      let sourceTd = document.createElement("td");
      sourceTd.style.backgroundColor = "#F7F1E0";
      sourceTd.textContent = translateSource(poem.source);
      tr.appendChild(sourceTd);

      table.appendChild(tr);
    }

    document.getElementById("table").appendChild(table);
    initSortButtons(table);
  })
  .catch((error) => console.error("Error fetching JSON:", error));

////////////////////////////////////////////////////////////
// Sort & filter
////////////////////////////////////////////////////////////

let activeColorFilter = null;

function applyColorFilter(table) {
  const rows = Array.from(table.getElementsByTagName("tr"));
  rows.forEach((row) => {
    if (!activeColorFilter || row.dataset.color === activeColorFilter) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function initSortButtons(table) {
  const btnNumber = document.getElementById("sortByNumber");
  const btnColor  = document.getElementById("sortByColor");
  const btnKana   = document.getElementById("sortByKana");
  const colorFilterBtns = document.querySelectorAll(".color-filter-btn");

  function setActiveSort(activeBtn) {
    [btnNumber, btnColor, btnKana].forEach((b) => b.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function sortRows(compareFn) {
    const rows = Array.from(table.getElementsByTagName("tr"));
    rows.sort(compareFn);
    rows.forEach((row) => table.appendChild(row));
  }

  btnNumber.addEventListener("click", () => {
    sortRows((a, b) => parseInt(a.dataset.number) - parseInt(b.dataset.number));
    setActiveSort(btnNumber);
    activeColorFilter = null;
    colorFilterBtns.forEach((b) => b.classList.remove("active"));
    applyColorFilter(table);
  });

  btnColor.addEventListener("click", () => {
    sortRows((a, b) => {
      const ai = colorOrder.indexOf(a.dataset.color);
      const bi = colorOrder.indexOf(b.dataset.color);
      const an = ai === -1 ? 999 : ai;
      const bn = bi === -1 ? 999 : bi;
      if (an !== bn) return an - bn;
      return parseInt(a.dataset.number) - parseInt(b.dataset.number);
    });
    setActiveSort(btnColor);
  });

  btnKana.addEventListener("click", () => {
    sortRows((a, b) =>
      a.dataset.hiragana.localeCompare(b.dataset.hiragana, "ja")
    );
    setActiveSort(btnKana);
  });

  colorFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.dataset.color;
      if (activeColorFilter === color) {
        activeColorFilter = null;
        btn.classList.remove("active");
      } else {
        colorFilterBtns.forEach((b) => b.classList.remove("active"));
        activeColorFilter = color;
        btn.classList.add("active");
      }
      applyColorFilter(table);
    });
  });
}

////////////////////////////////////////////////////////////
// Search
////////////////////////////////////////////////////////////
let searchInput = document.getElementById("searchInput");
let tableRows;

searchInput.addEventListener("keyup", () => {
  if (table && !tableRows) {
    tableRows = table.getElementsByTagName("tr");
  }

  let searchValue = searchInput.value.toLowerCase();
  for (let i = 0; i < tableRows.length; i++) {
    let rowText = tableRows[i].textContent.toLowerCase();
    const colorOk = !activeColorFilter || tableRows[i].dataset.color === activeColorFilter;
    if (colorOk && rowText.includes(searchValue)) {
      tableRows[i].style.display = "";
    } else {
      tableRows[i].style.display = "none";
    }
  }
});

function clearSearch() {
  if (!tableRows) return;
  searchInput.value = "";
  for (let i = 0; i < tableRows.length; i++) {
    const colorOk = !activeColorFilter || tableRows[i].dataset.color === activeColorFilter;
    tableRows[i].style.display = colorOk ? "" : "none";
  }
}

////////////////////////////////////////////////////////////
// Click number to navigate
////////////////////////////////////////////////////////////
document.addEventListener("click", function (event) {
  const gokuBadge = event.target.closest(".gokunarabe-badge");
  if (gokuBadge) {
    const num = parseInt(gokuBadge.dataset.number);
    const padded = String(num).padStart(2, "0");
    window.location.href = `/gokunarabe_${padded}_en.html`;
    return;
  }
  const td = event.target.closest("td");
  if (td && td.parentNode.firstChild === td) {
    const numBadge = td.querySelector(".num-badge");
    const linkNumber = numBadge ? parseInt(numBadge.dataset.number) : parseInt(td.textContent.trim());
    window.location.href = `/${linkNumber}_en.html`;
  }
});