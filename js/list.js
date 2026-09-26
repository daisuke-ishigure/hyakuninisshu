"use strict";
$();
const jsonAddress = "../js/hyakunin.json?04";

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

const colorOrder = ["赤", "橙", "黄", "緑", "青", "紫", "ピンク", "白", "灰"];

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

////////////////////////////////////////////////////////////
// 歌の一覧
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

      let numberTd = document.createElement("td");
      const paddedNum = String(poem.number).padStart(2, "0");
      const paddedNum3 = String(poem.number).padStart(3, "0");
      numberTd.innerHTML = `<a class="num-badge" href="/${poem.number}.html" data-number="${poem.number}" data-tooltip="解説ページへ">${poem.number}</a>`;
      if (poem.color && colorMap[poem.color]) {
        numberTd.style.backgroundColor = colorMap[poem.color];
      }
      tr.appendChild(numberTd);

      let wakaTd = document.createElement("td");
      wakaTd.style.backgroundColor = "#F7F1E0";
      wakaTd.style.cursor = "pointer";
      wakaTd.style.position = "relative";
      const modernText = poem.modern || "";
      const wakaHTML = window.innerWidth >= 960
        ? poem.first.replace(/<br\s*\/?>/g, " ") + " " + poem.second.replace(/<br\s*\/?>/g, " ")
        : poem.first.replace(/<br\s*\/?>/g, " ") + "<br>" + poem.second.replace(/<br\s*\/?>/g, " ");
      // poem.number は hyakunin.json 上では文字列("1"など)なので、
      // 数値のSetと比較する前に必ずNumber()で変換する（変換し忘れると
      // .has()が常にfalseになり、バッジが一切表示されなくなる）。
      const poemNum = Number(poem.number);
      const hasKakekotobaGame = KAKEKOTOBA_GAME_NUMS.has(poemNum);
      const kasenCardId = SANJUROKKASEN_CARD_IDS[poemNum];
      const poetName = poem.name.replace(/<rt>.*?<\/rt>/g, "");
      const gameLinksHTML =
        '<div class="waka-game-links">' +
        `<a class="game-badge game-badge--poet" href="/${poem.number}.html" data-tooltip="解説ページへ">${poetName}の歌</a>` +
        `<a class="game-badge game-badge--daruma" href="/daruma-otoshi-${paddedNum}.html" data-tooltip="だるま落としで遊ぶ">だるま落とし</a>` +
        `<a class="game-badge game-badge--gokunarabe" href="/gokunarabe_${paddedNum}.html" data-tooltip="歌人に会える五句並べ">五句並べ</a>` +
        (hasKakekotobaGame
          ? `<a class="game-badge game-badge--kakekotoba" href="/kakekotoba-game-${paddedNum3}.html" data-tooltip="掛詞クルッと発見で遊ぶ">掛詞クルッと発見</a>`
          : '') +
        (kasenCardId
          ? `<a class="game-badge game-badge--kasen" href="/sanjurokkasen.html#${kasenCardId}" data-tooltip="三十六歌仙の紹介へ">三十六歌仙</a>`
          : '') +
        '<span class="small">' + poem.name + (poem.date ? "（" + poem.date + "）" : "") + "</span>" +
        '</div>';

      wakaTd.innerHTML =
        wakaHTML +
        (modernText ? '<span class="modern-toggle">▼ 現代語訳</span>' : '') +
        (modernText ? '<span class="modern-text" style="display:none;">' + modernText + '</span>' : '') +
        gameLinksHTML;
      if (modernText) {
        wakaTd.dataset.hasModern = "1";
        wakaTd.addEventListener("click", function (event) {
          if (event.target.closest(".waka-game-links")) return;
          const el = this.querySelector(".modern-text");
          const toggle = this.querySelector(".modern-toggle");
          const isOpen = el.style.display !== "none";
          el.style.display = isOpen ? "none" : "block";
          toggle.textContent = isOpen ? "▼ 現代語訳" : "▲ 閉じる";
        });
      }
      tr.appendChild(wakaTd);

      let kanaTd = document.createElement("td");
      kanaTd.style.backgroundColor = "#F7F1E0";
      kanaTd.innerHTML = poem.yomihuda.replace(/<rt>.*?<\/rt>/g, "");
      tr.appendChild(kanaTd);

      let hiraganaTd = document.createElement("td");
      hiraganaTd.style.backgroundColor = "#F7F1E0";
      hiraganaTd.textContent = poem.hiragana;
      tr.appendChild(hiraganaTd);

      let sourceTd = document.createElement("td");
      sourceTd.style.backgroundColor = "#F7F1E0";
      sourceTd.innerHTML = poem.forConsole.replace(/ /g, "");
      tr.appendChild(sourceTd);

      table.appendChild(tr);
    }

    document.getElementById("table").appendChild(table);
    initSortButtons(table);
  })
  .catch((error) => console.error("Error fetching JSON:", error));

////////////////////////////////////////////////////////////
// ソート・フィルター機能
////////////////////////////////////////////////////////////

// 現在のフィルター色（null = フィルターなし）
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

  // 番号順
  btnNumber.addEventListener("click", () => {
    sortRows((a, b) => parseInt(a.dataset.number) - parseInt(b.dataset.number));
    setActiveSort(btnNumber);

    // カラーフィルターを解除
    activeColorFilter = null;
    colorFilterBtns.forEach((b) => b.classList.remove("active"));
    applyColorFilter(table);
  });

  // 色順
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

  // あいうえお順
  btnKana.addEventListener("click", () => {
    sortRows((a, b) =>
      a.dataset.hiragana.localeCompare(b.dataset.hiragana, "ja")
    );
    setActiveSort(btnKana);
  });

  // カラーフィルターボタン（toggle式）
  colorFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.dataset.color;

      if (activeColorFilter === color) {
        // 同じボタンをもう一度押したら解除
        activeColorFilter = null;
        btn.classList.remove("active");
      } else {
        // 別の色ボタンを押したら切り替え
        colorFilterBtns.forEach((b) => b.classList.remove("active"));
        activeColorFilter = color;
        btn.classList.add("active");
      }

      applyColorFilter(table);
    });
  });
}

////////////////////////////////////////////////////////////
// 検索機能
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
    // フィルター中は対象色以外は常に非表示
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
// 番号をクリックしたときのリンク処理
////////////////////////////////////////////////////////////
document.addEventListener("click", function (event) {
  // num-badge・game-badge（だるま落とし・五句並べ・掛詞ゲーム）は実体が<a>タグなので、
  // ここではクリックを奪わずブラウザ標準のリンク遷移に任せる（早期return）
  if (event.target.closest(".game-badge")) {
    return;
  }
  const td = event.target.closest("td");
  if (td && td.parentNode.firstChild === td) {
    const numBadge = td.querySelector(".num-badge");
    const linkNumber = numBadge ? parseInt(numBadge.dataset.number) : parseInt(td.textContent.trim());
    window.location.href = `/${linkNumber}.html`;
  }
});