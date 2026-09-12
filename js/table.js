"use strict";
$();
const jsonAddress = "../js/hyakunin.json?04";

////////////////////////////////////////////////////////////
// sp-menu
////////////////////////////////////////////////////////////

// JSONデータを取得し、テーブルを生成する関数
fetch(jsonAddress)
  .then((response) => response.json())
  .then((data) => {
    // テーブル要素を作成
    let table = document.createElement("table");

    // テーブルの各行を生成
    for (let key in data) {
      let poem = data[key];
      // tr要素を生成
      let tr = document.createElement("tr");

      // number, first, nameの情報をセルに追加
      let numberTd = document.createElement("td");
      numberTd.textContent = poem.number;
      tr.appendChild(numberTd);

      let wakaTd = document.createElement("td");
      wakaTd.innerHTML =
        poem.first.replace(/<br\s*\/?>/g, " ") +
        "<br>" +
        poem.second.replace(/<br\s*\/?>/g, " ") +
        '<span class="small">' +
        poem.name +
        "（" +
        poem.date +
        "）" +
        "</span>";
      tr.appendChild(wakaTd);

      let kanaTd = document.createElement("td");
      kanaTd.innerHTML = poem.yomihuda.replace(
        /<rt>.*?<\/rt>/g,/* rt要素を削除する */
        ""
      );
      tr.appendChild(kanaTd);

      let hiraganaTd = document.createElement("td");
      hiraganaTd.textContent = poem.hiragana;
      tr.appendChild(hiraganaTd);

      // let sourceTd = document.createElement("td");
      // sourceTd.textContent = poem.source;
      // tr.appendChild(sourceTd);

      // tr要素をテーブルに追加
      table.appendChild(tr);
    }

    // 生成したtable要素をHTMLの要素（idが'dbTable'の要素）に追加する
    document.getElementById("table").appendChild(table);
  })
  .catch((error) => console.error("Error fetching JSON:", error));

////////////////////////////////////////////////////////////
// 検索機能
////////////////////////////////////////////////////////////
// let searchInput = document.getElementById("searchInput");
// let tableRows;

// searchInput.addEventListener("keyup", () => {
//   if (table && !tableRows) {
//     tableRows = table.getElementsByTagName("tr");
//   }

//   let searchValue = searchInput.value.toLowerCase();
//   for (let i = 0; i < tableRows.length; i++) {
//     let rowText = tableRows[i].textContent.toLowerCase();
//     if (rowText.includes(searchValue)) {
//       tableRows[i].style.display = "";
//     } else {
//       tableRows[i].style.display = "none";
//     }
//   }
// });

// // 検索を初期化する(番号をクリックして、sp-menuを閉じるときに使う）
// function clearSearch() {
//   // tableRowsが未定義の場合は何もせず関数を終了する
//   if (!tableRows) {
//     return;
//   }

//   // 検索欄の値を空にする
//   searchInput.value = "";

//   // テーブルの全ての行を表示する
//   for (let i = 0; i < tableRows.length; i++) {
//     tableRows[i].style.display = "";
//   }
// }

////////////////////////////////////////////////////////////
// 番号をクリックしたときのリンク処理
////////////////////////////////////////////////////////////
document.addEventListener("click", function (event) {
  if (
    event.target.tagName === "TD" &&
    event.target.parentNode.firstChild === event.target
  ) {
    // クリックされた数字を取得し、整数に変換
    let linkNumber = parseInt(event.target.textContent.trim());
    console.log("クリックされた数字:", linkNumber);

    // 枠の形式に合わせて URL を構築
    let url = `https://hyakuninisshu.com/?jsonSelectorValue=${linkNumber}`;

    // URL への遷移（新しいウィンドウで開く場合は window.open を使用）
    window.location.href = url;
  }
});
