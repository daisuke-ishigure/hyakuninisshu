const jsonAddress = "../js/hyakunin.json?04";
fetch(jsonAddress)
  .then((response) => response.json())
  .then((data) => {
    // テーブル要素を作成
    let table = document.createElement("table");

    // テーブルの各行を生成
    for (let key in data) {
      let poem = data[key];

      // 「花」が含まれているかチェック
      if (poem.first.includes("花") || poem.second.includes("花")) {
        // tr要素を生成
        let tr = document.createElement("tr");

        // number, first, nameの情報をセルに追加
        let numberTd = document.createElement("td");
        numberTd.textContent = poem.number;
        tr.appendChild(numberTd);

        let wakaTd = document.createElement("td");

        if (window.innerWidth >= 960) {
          wakaTd.innerHTML =
            poem.first.replace(/<br\s*\/?>/g, " ") +
            " " +
            poem.second.replace(/<br\s*\/?>/g, " ") +
            '<span class="small">' +
            poem.name +
            "（" +
            poem.date +
            "）" +
            "</span>";
        } else {
          wakaTd.innerHTML = 
            poem.first.replace(/<br\s*\/?>/g, " ") +
            '<br>' +
            poem.second.replace(/<br\s*\/?>/g, " ") +
            '<span class="small">' +
            poem.name +
            "（" +
            poem.date +
            "）" +
            "</span>";
        }
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

        let sourceTd = document.createElement("td");
        sourceTd.innerHTML = poem.metaDesc.replace(/<br\s*\/?>/g, '').replace(/ /g, '');
        tr.appendChild(sourceTd);

        // tr要素をテーブルに追加
        table.appendChild(tr);
      }
    }

    // 生成したtable要素をHTMLの要素（idが'dbTable'の要素）に追加する
    document.getElementById("table").appendChild(table);
  })
  .catch((error) => console.error("Error fetching JSON:", error));


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
