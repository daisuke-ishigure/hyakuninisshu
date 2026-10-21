"use strict";
$();

////////////////////////////////////////////////////////////
// ハンバーガーメニュー
////////////////////////////////////////////////////////////
$("#burger").on("click", function () {
  $(this).toggleClass("active");
  $("body").toggleClass("active");
  $("#sp-menu").toggleClass("drawer");
  $("#table").toggleClass("active");
});

$("#close").on("click", function () {
  $("#burger").removeClass("active");
  $("body").removeClass("active");
  $("#sp-menu").toggleClass("drawer");
  $("#table").removeClass("active");
  clearSearch();
});
////////////////////////////////////////////////////////////
// sp-menu
////////////////////////////////////////////////////////////

// // JSONデータを取得し、テーブルを生成する関数
// fetch(jsonAddress)
//   .then((response) => response.json())
//   .then((data) => {
//     // テーブル要素を作成
//     let table = document.createElement("table");
//     // table.id = 'myTable'; // テーブルのIDを設定

//     // テーブルの各行を生成
//     for (let key in data) {
//       let poem = data[key];
//       // tr要素を生成
//       let tr = document.createElement("tr");

//       // number, first, nameの情報をセルに追加
//       let numberTd = document.createElement("td");
//       numberTd.textContent = poem.number;
//       tr.appendChild(numberTd);

//       let wakaTd = document.createElement("td");
//       wakaTd.innerHTML =
//         poem.first.replace(/<br\s*\/?>/g, " ") +
//         "<br>" +
//         poem.second.replace(/<br\s*\/?>/g, " ") +
//         '<span class="small">' +
//         poem.name +
//         "（" +
//         poem.date +
//         "）" +
//         "</span>";
//       tr.appendChild(wakaTd);

//       let kanaTd = document.createElement("td");
//       kanaTd.innerHTML = poem.yomihuda.replace(
//         /<rt>.*?<\/rt>/g,/* rt要素を削除する */
//         ""
//       );
//       tr.appendChild(kanaTd);

//       let hiraganaTd = document.createElement("td");
//       hiraganaTd.textContent = poem.hiragana;
//       tr.appendChild(hiraganaTd);

//       let sourceTd = document.createElement("td");
//       sourceTd.textContent = poem.source;
//       tr.appendChild(sourceTd);

//       // tr要素をテーブルに追加
//       table.appendChild(tr);
//     }

//     // 生成したtable要素をHTMLの要素（idが'dbTable'の要素）に追加する
//     document.getElementById("table").appendChild(table);
//   })
//   .catch((error) => console.error("Error fetching JSON:", error));
