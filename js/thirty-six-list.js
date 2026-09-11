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
    if (rowText.includes(searchValue)) {
      tableRows[i].style.display = "";
    } else {
      tableRows[i].style.display = "none";
    }
  }
});

// 検索を初期化する(番号をクリックして、sp-menuを閉じるときに使う）
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