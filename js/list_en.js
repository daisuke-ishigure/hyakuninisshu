"use strict";
$();
const jsonAddress = "../js/hyakunin.json?04";

// The HTML for one table row (colorMap, badge number lists, buildPoemRowHTML) lives in
// js/list-rows_en.js. Load it before this file.

// Color order used by "By colour"
const colorOrder = ["赤", "橙", "黄", "緑", "青", "紫", "ピンク", "白", "灰"];

////////////////////////////////////////////////////////////
// Poem list
////////////////////////////////////////////////////////////

// Once the table exists, enable the translation toggle, sorting and filters
function initTable(table) {
  // Click a poem to open/close its translation (except the badge links)
  table.addEventListener("click", (event) => {
    const td = event.target.closest("td[data-has-modern]");
    if (!td || event.target.closest(".waka-game-links")) return;
    const el = td.querySelector(".modern-text");
    const toggle = td.querySelector(".modern-toggle");
    const isOpen = el.style.display !== "none";
    el.style.display = isOpen ? "none" : "block";
    toggle.textContent = isOpen ? "▼ translation" : "▲ close";
  });

  initSortButtons(table);
}

// If the table is prebuilt in the HTML (so crawlers can follow every link), use it.
// Otherwise build it from hyakunin.json.
const prebuiltTable = document.querySelector("#table table");
if (prebuiltTable) {
  // Run after searchInput etc. further down this file have been initialised
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
// Sort & filter
////////////////////////////////////////////////////////////

// Current colour / theme filter (null = no filter)
// The theme filter buttons (.theme-filter-btn) are only used on pages that have them (currently the top page)
let activeColorFilter = null;
let activeThemeFilter = null;

// Show only rows that match the colour filter, the theme filter and the search text
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
    // Rows live inside <tbody>, so put the sorted rows back into that same parent
    const parent = rows[0].parentNode;
    rows.sort(compareFn);
    rows.forEach((row) => parent.appendChild(row));
  }

  btnNumber.addEventListener("click", () => {
    sortRows((a, b) => parseInt(a.dataset.number) - parseInt(b.dataset.number));
    setActiveSort(btnNumber);
    activeColorFilter = null;
    activeThemeFilter = null;
    colorFilterBtns.forEach((b) => b.classList.remove("active"));
    themeFilterBtns.forEach((b) => b.classList.remove("active"));
    applyFilters(table);
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
      applyFilters(table);
    });
  });

  // Theme filter buttons (toggle, same behaviour as the colour filter)
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
// Search
////////////////////////////////////////////////////////////
let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", () => {
  // While a colour filter is active, only show rows that also match it
  applyFilters(document.getElementById("table"));
});

function clearSearch() {
  searchInput.value = "";
  applyFilters(document.getElementById("table"));
}

////////////////////////////////////////////////////////////
// Click number to navigate
////////////////////////////////////////////////////////////
document.addEventListener("click", function (event) {
  // num-badge and game-badge (Daruma Otoshi / Meet the Poet / kakekotoba games)
  // are real <a> tags, so leave the click to the browser's normal navigation
  // instead of intercepting it here.
  if (event.target.closest(".game-badge")) {
    return;
  }
  const td = event.target.closest("td");
  if (td && td.parentNode.firstChild === td) {
    const numBadge = td.querySelector(".num-badge");
    const linkNumber = numBadge ? parseInt(numBadge.dataset.number) : parseInt(td.textContent.trim());
    window.location.href = `/${linkNumber}_en.html`;
  }
});
