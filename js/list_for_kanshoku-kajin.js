"use strict";
$();

////////////////////////////////////////////////////////////
// HTMLテーブルから抽出・検索機能
////////////////////////////////////////////////////////////

// 既存のHTMLテーブルを取得
const existingTable = document.querySelector('.ikai4_table');
let tableRows;

// テーブルが存在する場合、tbody内の行を取得
if (existingTable) {
  tableRows = existingTable.querySelector('tbody').getElementsByTagName('tr');
  console.log(`テーブルから${tableRows.length}行を取得しました`);
}

////////////////////////////////////////////////////////////
// 検索機能
////////////////////////////////////////////////////////////
let searchInput = document.getElementById("searchInput");

if (searchInput && tableRows) {
  searchInput.addEventListener("keyup", () => {
    let searchValue = searchInput.value.toLowerCase();
    
    for (let i = 0; i < tableRows.length; i++) {
      let rowText = tableRows[i].textContent.toLowerCase();
      if (rowText.includes(searchValue)) {
        tableRows[i].style.display = "";
      } else {
        tableRows[i].style.display = "none";
      }
    }
  });
}

// 検索を初期化する関数
function clearSearch() {
  // tableRowsが未定義の場合は何もせず関数を終了する
  if (!tableRows) {
    return;
  }

  // 検索欄の値を空にする
  searchInput.value = "";

  // テーブルの全ての行を表示する
  for (let i = 0; i < tableRows.length; i++) {
    tableRows[i].style.display = "";
  }
}

////////////////////////////////////////////////////////////
// 番号をクリックしたときのリンク処理
////////////////////////////////////////////////////////////
document.addEventListener("click", function (event) {
  // クリックされた要素が最初の列（番号列）のtd要素かチェック
  if (
    event.target.tagName === "TD" &&
    event.target.parentNode.tagName === "TR" &&
    event.target.cellIndex === 0 && // 最初の列（番号列）
    existingTable && 
    existingTable.contains(event.target)
  ) {
    // クリックされた数字を取得し、整数に変換
    let linkNumber = parseInt(event.target.textContent.trim());
    console.log("クリックされた数字:", linkNumber);

    // 英語版では歌のページ（gokunarabe_XX_en.html）にリンクする
    let isEN = document.documentElement.lang === "en";
    let url = isEN
      ? `/gokunarabe_${String(linkNumber).padStart(2, "0")}_en.html`
      : `/${linkNumber}.html`;

    // URL への遷移（新しいウィンドウで開く場合は window.open を使用）
    window.location.href = url;
  }
});

////////////////////////////////////////////////////////////
// テーブルからデータを抽出する関数（必要に応じて使用）
////////////////////////////////////////////////////////////
function extractTableData() {
  if (!existingTable || !tableRows) {
    console.error("テーブルが見つかりません");
    return [];
  }

  let data = [];
  
  for (let i = 0; i < tableRows.length; i++) {
    let row = tableRows[i];
    let cells = row.getElementsByTagName('td');
    
    if (cells.length >= 5) {
      data.push({
        number: cells[0].textContent.trim(),
        name: cells[1].textContent.trim(),
        rank: cells[2].textContent.trim(),
        post: cells[3].textContent.trim(),
        notes: cells[4].textContent.trim()
      });
    }
  }
  
  console.log("抽出したデータ:", data);
  return data;
}

// ページ読み込み時にデータを抽出（オプション）
// window.addEventListener('DOMContentLoaded', extractTableData);