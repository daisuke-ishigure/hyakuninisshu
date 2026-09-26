"use strict";
$();
const jsonAddress = "../js/hyakunin.json?05";

// 表の1行分のHTML（colorMap・バッジ用の番号リスト・buildPoemRowHTML）は js/list-rows.js にある。
// このファイルより先に読み込むこと。

// 「色順」で並べるときの色の順番
const colorOrder = ["赤", "橙", "黄", "緑", "青", "紫", "ピンク", "白", "灰"];

////////////////////////////////////////////////////////////
// 歌の一覧
////////////////////////////////////////////////////////////

// 表の準備ができたら、現代語訳の開閉・並べ替え・フィルターを有効にする
function initTable(table) {
  // 和歌をクリックすると現代語訳を開閉（バッジのリンクは除く）
  table.addEventListener("click", (event) => {
    const td = event.target.closest("td[data-has-modern]");
    if (!td || event.target.closest(".waka-game-links")) return;
    const el = td.querySelector(".modern-text");
    const toggle = td.querySelector(".modern-toggle");
    const isOpen = el.style.display !== "none";
    el.style.display = isOpen ? "none" : "block";
    toggle.textContent = isOpen ? "▼ 現代語訳" : "▲ 閉じる";
  });

  initSortButtons(table);

  // トップページの検索フォーム（list.html?q=...）から来たときは、その語で絞り込んだ状態で開く
  const initialQuery = new URLSearchParams(location.search).get("q");
  if (initialQuery) {
    searchInput.value = initialQuery;
    searchInput.dispatchEvent(new Event("keyup"));
  }
}

// index.html のように表がHTMLに直書きされていればそれを使う（検索エンジンがリンクを確実に辿れるよう）。
// 無ければ（list.html）hyakunin.json から表を作る。
const prebuiltTable = document.querySelector("#table table");
if (prebuiltTable) {
  // このファイルの後半で宣言する searchInput などが初期化されてから実行する
  queueMicrotask(() => initTable(prebuiltTable));
} else {
  fetch(jsonAddress)
    .then((response) => response.json())
    .then((data) => {
      const table = document.createElement("table");
      table.innerHTML = "<tbody>" + Object.keys(data).map((key) => buildPoemRowHTML(data[key])).join("") + "</tbody>";
      document.getElementById("table").appendChild(table);
      initTable(table);
    })
    .catch((error) => console.error("Error fetching JSON:", error));
}

////////////////////////////////////////////////////////////
// ソート・フィルター機能
////////////////////////////////////////////////////////////

// 現在のフィルター色・テーマ（null = フィルターなし）
// テーマの絞り込みボタン（.theme-filter-btn）は、置いてあるページ（現在はトップページ）でだけ使われる
let activeColorFilter = null;
let activeThemeFilter = null;

// 色・テーマ・検索語をすべて満たす行だけを表示する
function applyFilters(table) {
  const rows = Array.from(table.getElementsByTagName("tr"));
  const searchValue = searchInput.value.toLowerCase();
  rows.forEach((row) => {
    const colorOk = !activeColorFilter || row.dataset.color === activeColorFilter;
    const themeOk = !activeThemeFilter || row.dataset.theme === activeThemeFilter;
    const textOk = !searchValue || row.textContent.toLowerCase().includes(searchValue);
    row.style.display = colorOk && themeOk && textOk ? "" : "none";
  });
}

function initSortButtons(table) {
  const btnNumber = document.getElementById("sortByNumber");
  const btnColor  = document.getElementById("sortByColor");
  const btnKana   = document.getElementById("sortByKana");
  const colorFilterBtns = document.querySelectorAll(".color-filter-btn");
  const themeFilterBtns = document.querySelectorAll(".theme-filter-btn");

  function setActiveSort(activeBtn) {
    [btnNumber, btnColor, btnKana].forEach((b) => b.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function sortRows(compareFn) {
    const rows = Array.from(table.getElementsByTagName("tr"));
    if (!rows.length) return;
    // 行は <tbody> の中にあるので、並べ替えた行も同じ親（tbody）に戻す
    const parent = rows[0].parentNode;
    rows.sort(compareFn);
    rows.forEach((row) => parent.appendChild(row));
  }

  // 番号順
  btnNumber.addEventListener("click", () => {
    sortRows((a, b) => parseInt(a.dataset.number) - parseInt(b.dataset.number));
    setActiveSort(btnNumber);

    // カラー・テーマのフィルターを解除
    activeColorFilter = null;
    activeThemeFilter = null;
    colorFilterBtns.forEach((b) => b.classList.remove("active"));
    themeFilterBtns.forEach((b) => b.classList.remove("active"));
    applyFilters(table);
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

      applyFilters(table);
    });
  });

  // テーマフィルターボタン（toggle式・カラーフィルターと同じ動き）
  themeFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;

      if (activeThemeFilter === theme) {
        activeThemeFilter = null;
        btn.classList.remove("active");
      } else {
        themeFilterBtns.forEach((b) => b.classList.remove("active"));
        activeThemeFilter = theme;
        btn.classList.add("active");
      }

      applyFilters(table);
    });
  });
}

////////////////////////////////////////////////////////////
// 検索機能
////////////////////////////////////////////////////////////
let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", () => {
  // 色・テーマのフィルター中は、その条件も満たす行だけを表示
  applyFilters(document.getElementById("table"));
});

function clearSearch() {
  searchInput.value = "";
  applyFilters(document.getElementById("table"));
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