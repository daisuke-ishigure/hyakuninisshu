"use strict";
const jsonAddress = "../js/hyakunin.json?04";

// JSONデータを格納する変数を初期化する
let poems = [];

// 変数selectedThemを作成
let selectedTheme = "";

// テーマが変更されたら、設定値をselectedThemeに格納する
$("#themeSelector").on("change", function () {
  selectedTheme = $(this).val();
  // console.log(selectedTheme);
  // テーマによって、歌人をソートする
  updateJsonSelectorOptions();
});

// JSONデータを取得する(修正版)
async function fetchData() {
  try {
    const response = await fetch(jsonAddress);

    if (!response.ok) {
      throw new Error(`データの取得に失敗! HTTPエラーコード: ${response.status}`);
    }

    const data = await response.json();
    poems = data;
  } catch (error) {
    console.error("データの取得に失敗:", error);
    
    // エラーが発生した場合にページをリロードする
    console.error('エラーが発生しました:', error);
    location.reload();
  }
}

// fetchData関数の実行
fetchData();



// 選択されたテーマの歌人を抽出する
function getThemePoems() {
  let themePoems = [];
  for (let key in poems) {
    if (poems[key].theme === selectedTheme) {
      themePoems.push(poems[key]);
    } else if (selectedTheme === "all") {
      themePoems.push(poems[key]);
    }
  }
  return themePoems;
}

// 選択されたテーマの歌人を抽出する
function updateJsonSelectorOptions() {
  let themePoems = getThemePoems();
  $("#jsonSelector").html('<option value="all">歌人を選ぶ</option>');
  themePoems.forEach(function (poem) {
    let strippedName = poem.name.replace(
      /<rt>.*?<\/rt>/g,
      ""
    );
    $("#jsonSelector").append(
      `<option value="${poem.number}">${poem.number}番歌・${strippedName}</option>`
    );
  });
}

// ----------------------------------------------
// スイッチで札を裏返すトグル
// ----------------------------------------------
$("#toggle2").on("change", function (event) {
  $(".card-item").toggleClass("active");
  event.stopPropagation();
});

jsonSelector.addEventListener("change", () => {
  let selectedDataSet = jsonSelector.value;

  //表に要素があれば削除する
  if ($(".card-front").children().length > 0) {
    /* '.card-front' 要素に子要素がある場合 */
    $(".card-front").empty(); /* '.card-front' 要素の子要素をすべて削除 */
  }
  //表の写真に要素があれば削除する
  if ($(".photo").children().length > 0) {
    $(".photo").empty(); // photoの子要素をすべて削除する
  }
  //  //裏に要素があれば削除する
  if ($(".card-back").children().length > 0) {
    $(".card-back").empty(); // coard-backの子要素をすべて削除する
  }
  if ($(".explanation").children().length > 0) {
    $(".explanation").empty(); // explanationの子要素をすべて削除する
  }
  if ($(".words").children().length > 0) {
    $(".words").empty(); // wordsの子要素をすべて削除する
  }

  fetch(jsonAddress)

      .then((response) => {
        if (!response.ok) {
            // JSONの読み込みに失敗した場合、ページを1回だけリロードする
            location.reload();
        } else {
            return response.json();
        }
    })
    .then((data) => {
      /* jsonデータを取り込んだときの動作ここから */
      const selectedData = data[selectedDataSet];
      const yomihuda = selectedData.yomihuda;
      const torihuda = selectedData.torihuda;
      const source = selectedData.source;
      const first = selectedData.first;
      const second = selectedData.second;
      const name = selectedData.name;
      const date = selectedData.date
      const nameKana = selectedData.nameKana;
      const theme = selectedData.theme;
      const translation = selectedData.translation;
      const bg = selectedData.background;
      const number = selectedData.number;
      const personality = selectedData.personality;
      const words = selectedData.words;
      const metaTitle = selectedData.metaTitle;
      const metaDesc = selectedData.metaDesc;
      const forConsole = selectedData.forConsole;
      const metaKeyWords = selectedData.metaKeyWords;
      const kakekotobaMark = selectedData.kakekotobaMark;
      const kakekotobaLink = selectedData.kakekotobaLink;
      const engoMark = selectedData.engoMark;
      const engoLink = selectedData.engoLink;
      const makurakotobaMark = selectedData.makurakotobaMark;
      const makurakotobaLink = selectedData.makurakotobaLink;
      const jokotobaMark = selectedData.jokotobaMark;
      const jokotobaLink = selectedData.jokotobaLink;
      const utamakuraMark = selectedData.utamakuraMark;
      const utamakuraLink = selectedData.utamakuraLink;
      const honkadoriMark = selectedData.honkadoriMark;
      const honkadoriLink = selectedData.honkadoriLink;
      const kimariji = selectedData.kimariji;
      console.log(forConsole);
      console.log(name);
      // タイトルの設定
      $(document).ready(function () {
        document.title = metaTitle;

        // Descriptionの設定
        let metaDescription = $('meta[name="description"]');
        metaDescription.attr('content', metaDesc);

        // キーワードの設定
        let metaKeyWordsDescription = $('meta[name="Keywords"]');
        metaKeyWordsDescription.attr('content', metaKeyWords);

        // OGP タイトルの設定
        let metaOgTitle = $('meta[property="og:title"]');
        metaOgTitle.attr('content', metaTitle);

        // OGP Descriptionの設定
        let metaOgDescription = $('meta[property="og:description"]');
        metaOgDescription.attr('content', metaDesc);

        // OGP 画像URLの設定
        const baseImgUrl = "https://hyakuninisshu.com/img/";
        let imgUrl = baseImgUrl + number + ".svg";
        let metaOgImg = $('meta[property="og:image"]');
        metaOgImg.attr('content', imgUrl);

        // OGP サイトURLの設定
        const url = "https://hyakuninisshu.com/?jsonSelectorValue="
        let pageUrl = url + number;
        let metaOgUrl = $('meta[property="og:url"]');
        metaOgUrl.attr('content', pageUrl);
      });

      // HTMLの内容を入れ替える
      const nameWithoutRubyTags = name.replace(/<ruby>(.*?)<\/ruby>/g, "$1").replace(/<rt>(.*?)<\/rt>/g, "");
      
      $(".card-front").append(`
      <div id="frontContent">
        <h1 id="poemName">${name}</h1>
        <h3>${first}<br>${second}</h3>
      </div>
      <img src="../img/${number}.svg" alt="${nameWithoutRubyTags}">
      <canvas id = "confetti-canvas"></canvas>
      `);

      // ---------------------------------------------------
      // ひらがなトグルボタンについて
      // ---------------------------------------------------

      const checkbox = document.getElementById("toggle2");
      let startX;

      checkbox.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      checkbox.addEventListener("touchmove", (e) => {
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;

        if (deltaX > 10) {
          // Swiped to the right, toggle checkbox to checked
          checkbox.checked = true;
          updatePoemContent();
          updateNameContent();
        } else if (deltaX < -10) {
          // Swiped to the left, toggle checkbox to unchecked
          checkbox.checked = false;
          updatePoemContent();
          updateNameContent();
        }
      }, { passive: true });

      function updateNameContent() {
        const poemName = !$("#toggle1").is(":checked") ? nameKana : `${name}`;

        /* ?はif elseの意味 */
        $("#poemName").html(poemName);
      }




      // explanationに要素を追加する部分
      $(".explanation").append(`
          <div class='mark'></div>
        `);


      if (selectedData.makurakotobaLink) {
        const makurakotobaLinkElement = `<span id='makurakotoba'>${selectedData.makurakotobaMark}</span>`;
        const makurakotobaExplanation = `${selectedData.makurakotobaLink}`;

        // makurakotobaLinkElementを".explanation .mark"に追加
        $(".explanation .mark").append(makurakotobaLinkElement);

        // 新しいdiv要素を作成し、その背景画像を設定
        const makurakotobaDiv = $(`<div class='makurakotoba'"><dt>枕詞</dt><dd>枕詞とは、特定の語句を導き出すための<span>5</span>文字の言葉です。導き出す語句の直前に置かれ、語調を整えたり、ある種の情緒を添えます。</dd><hr><p>${makurakotobaExplanation}</p></div>`);

        // 新しいdivを".explanation"に追加
        $(".explanation").append(makurakotobaDiv);
      }

      // 掛詞　kakekotobaLinkが空でない場合
      if (selectedData.kakekotobaLink) {
        const kakekotobaLinkElement = `<span id='kakekotoba'>${selectedData.kakekotobaMark}</span>`;
        const kakekotobaExplanation = `${selectedData.kakekotobaLink}`;

        // kakekotobaLinkElementを".explanation .mark"に追加
        $(".explanation .mark").append(kakekotobaLinkElement);

        // 新しいdiv要素を作成し、その背景画像を設定
        const kakekotobaDiv = $(`<div class='kakekotoba'"><dt>掛詞</dt><dd>掛詞とは、同音異義語の語句（景物と心情）を重ねて用いることで、言葉の連想により世界を広げる技法です。</dd><hr><p>${kakekotobaExplanation}</p></div>`);

        // 新しいdivを".explanation"に追加
        $(".explanation").append(kakekotobaDiv);
      }

      // 縁語　engoLinkが空でない場合
      if (selectedData.engoLink) {
        const engoLinkElement = `<span id='engo'>${selectedData.engoMark}</span>`;
        const engoExplanation = `${selectedData.engoLink}`;

        // engoLinkElementを".explanation .mark"に追加
        $(".explanation .mark").append(engoLinkElement);

        // 新しいdiv要素を作成し、その背景画像を設定
        const engoDiv = $(`<div class='engo'"><dt>縁語</dt><dd>縁語とは意味的に関連の深い語句を用いることで、言葉の連想により、味わい深いものにする技法です。</dd><hr><p>${engoExplanation}</p></div>`);

        // 新しいdivを".explanation"に追加
        $(".explanation").append(engoDiv);
      }

      // 序詞　jokotobaLinkが空でない場合
      if (selectedData.jokotobaLink) {
        const jokotobaLinkElement = `<span id='jokotoba'>${selectedData.jokotobaMark}</span>`;
        const jokotobaExplanation = `${selectedData.jokotobaLink}`;

        // jokotobaLinkElementを".explanation .mark"に追加
        $(".explanation .mark").append(jokotobaLinkElement);

        // 新しいdiv要素を作成し、その背景画像を設定
        const jokotobaDiv = $(`<div class='jokotoba'"><dt>序詞</dt><dd>序詞とは、言いたい言葉を導き出すために前置きされる言葉のことです。序詞は歌人が独自に作成し、<span>7</span>文字以上で構成されます。比喩によるもの、掛詞にかかるもの、同音を繰り返すものの<span>3</span>種類があります。</dd><hr><p>${jokotobaExplanation}</p></div>`);

        // 新しいdivを".explanation"に追加
        $(".explanation").append(jokotobaDiv);
      }

      // 本歌取り　honkadoriLinkが空でない場合
      if (selectedData.honkadoriLink) {
        let honkadoriLinkElement = `<span id='honkadori'>${selectedData.honkadoriMark}</span>`;
        const honkadoriExplanation = `${selectedData.honkadoriLink}`;

        // honkadoriLinkElementを".explanation .mark"に追加
        $(".explanation .mark").append(honkadoriLinkElement);

        // 新しいdiv要素を作成し、その背景画像を設定
        const honkadoriDiv = $(`<div class='honkadori'"><dt>本歌取り</dt><dd>本歌取りとは、古歌の一部を借用することで、古歌の心情や趣向を取り込む技法のことです。本歌は左記のとおりです。</dd><hr><p>${honkadoriExplanation}</p></div>`);

        // 新しいdivを".explanation"に追加
        $(".explanation").append(honkadoriDiv);
      } else {
        let honkadoriLinkElement = `<span id='honkadori'>${selectedData.honkadoriMark}</span>`;
      }



      // 歌枕　utamakuraLinkが空でない場合
      if (selectedData.utamakuraLink) {
        // 歌枕地図に遷移
        let utamakuraLinkElement = `<a href="${selectedData.utamakuraLink}" target="_blank">${selectedData.utamakuraMark}</a>`;
        $(".explanation .mark").append(utamakuraLinkElement);
      } else {
        let utamakuraLinkElement = `<span id='utamakura'><img src='../img/mark_utamakura_none.svg' alt='歌枕なし'></span>`;
        $(".explanation .mark").append(utamakuraLinkElement);
        // 和歌に歌枕がない説明を表示
        const utamakuraDiv = $(`<div class='utamakura'"><dt>歌枕</dt><dd>歌枕とは、和歌に登場する景勝地のことです。</dd><hr><p>この歌に歌枕はありません。</p></div>`);
        $(".explanation").append(utamakuraDiv);
      }


      // explanationにdl要素を追加する部分
      $(".explanation").append(`
      <dl>
        <dt id='utabangou'>${selectedData.number}番歌</dt>
        <dd>${window.innerWidth <= 760 ? first : first.replace(/<br\s*\/?>/g, " ")}<br>${window.innerWidth <= 760 ? second : second.replace(/<br\s*\/?>/g, " ")}<br>
        <span class="small">作者：${name}（${date}）<br>出典：${source}</span>
        </dd>
      </dl>
      <dl>
        <dt>現代語訳</dt>
        <dd>${translation}</dd>
      </dl>
      <dl>
        <dt>歌の背景</dt>
        <dd>${bg}</dd>
      </dl>
      <dl>
        <dt>歌人の人となり</dt>
        <dd>${personality}</dd>
      </dl>
    `);

      $(".words").append(`
    <dl>
        <dt class='title'>語句・豆知識</dt>
        <dd>${words}</dd>
    `);

      $("#sp_menu").append(`
        <table>
      `);
    }) /* jsonデータを取り込んだときの動作ここまで */
    .catch((error) => console.error("Error fetching JSON:", error));
});

let currentPoemIndex = 0;
// Function to display the poem with a given index
function displayPoem(index) {
  // ... (display code remains the same)
  currentPoemIndex = index; // Update the current poem index
}

////////////////////////////////////////////////////////////
// 決まり字ボタンで決まり字の表示をトグルする
$(document).on("click", "#kimariji-icon", function () {
  // $(".kimariji-moji").toggleClass("active");
  console.log('あいうえお');
});


////////////////////////////////////////////////////////////

// 掛詞ボタンで表示をトグルする
$(document).on("click", "#kakekotoba", function (event) {
  event.stopPropagation();
  $(".kakekotoba").toggleClass("active");
  $(".engo, .jokotoba, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});

// 縁語ボタンで表示をトグルする
$(document).on("click", "#engo", function (event) {
  event.stopPropagation();
  $(".engo").toggleClass("active");
  $(".kakekotoba, .jokotoba, .makurakotoba,.honkadori, .utamakura").removeClass("active");
});

// 序詞ボタンで表示をトグルする
$(document).on("click", "#jokotoba", function (event) {
  event.stopPropagation();
  $(".jokotoba").toggleClass("active");
  $(".kakekotoba, .engo, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});

// 枕詞ボタンで表示をトグルする
$(document).on("click", "#makurakotoba", function (event) {
  event.stopPropagation();
  $(".makurakotoba").toggleClass("active");
  $(".kakekotoba, .engo, .jokotoba, .honkadori, .utamakura").removeClass("active");
});

// 本歌取りボタンで表示をトグルする
$(document).on("click", "#honkadori", function (event) {
  event.stopPropagation();
  $(".honkadori").toggleClass("active");
  $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .utamakura").removeClass("active");
});

// 歌枕ボタンで表示をトグルする
$(document).on("click", "#utamakura", function (event) {
  event.stopPropagation();
  $(".utamakura").toggleClass("active");
  $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .honkadori").removeClass("active");
});

// どこかをクリックしたら全ての要素から "active" クラスを削除する
$(document).on("click", function () {
  $(".kakekotoba, .engo, .jokotoba, .makurakotoba, .honkadori, .utamakura").removeClass("active");
});


////////////////////////////////////////////////////////////
//次へボタンの実装
$(function () {
  $("#next, #next2.bottom").on("click", function (event) {
    const selectMenu = document.getElementById("jsonSelector");
    // 現在の選択肢を取得する
    let currentOptionIndex = selectMenu.selectedIndex;
    // 次の選択肢のインデックスを計算する
    let nextOptionIndex = currentOptionIndex + 1;
    // もし次の選択肢が存在しない場合、最初の選択肢を選択する
    if (nextOptionIndex >= selectMenu.options.length) {
      nextOptionIndex = 0;
    }
    if (window.innerWidth <= 960) {
      window.scrollTo(0, 330);
    } else {
      window.scrollTo(0, 0);
    }
    // セレクトメニューを次の選択肢に設定する
    selectMenu.selectedIndex = nextOptionIndex;
    const changeEvent = new Event("change");
    selectMenu.dispatchEvent(changeEvent);
    //「歌人を選んでください」のoption要素を削除する
    removeOptionByValue(jsonSelector, "all");
    event.stopPropagation();
  });
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//前へボタンの実装

$(function () {
  $("#back, #back2.bottom").on("click", function (event) {
    //「歌人を選んでください」のoption要素を削除する
    removeOptionByValue(jsonSelector, "all");
    // セレクトメニュー要素を取得します
    const selectMenu = document.getElementById("jsonSelector");
    // 現在の選択肢を取得します
    let currentOptionIndex = selectMenu.selectedIndex;
    // 前の選択肢のインデックスを計算します
    let previousOptionIndex = currentOptionIndex - 1;
    // もし前の選択肢が存在しない場合、最後の選択肢を選択します
    if (previousOptionIndex < 0) {
      previousOptionIndex = selectMenu.options.length - 1;
    }

    if (window.innerWidth <= 960) {
      window.scrollTo(0, 340);
    } else {
      window.scrollTo(0, 0);
    }

    // セレクトメニューを前の選択肢に設定します
    selectMenu.selectedIndex = previousOptionIndex;
    const changeEvent = new Event("change");
    selectMenu.dispatchEvent(changeEvent);
    event.stopPropagation();
  });
});

/* 前へボタン、戻るボタンの誤動作を防止するため、
ダブルクリックの親要素への伝播をstopさせる */
$(function () {
  $("#back").on("click", function (event) {
    event.stopPropagation();
  });
});
$(function () {
  $("#next").on("click", function (event) {
    event.stopPropagation();
  });
});
/* 親要素への伝播をstopさせる　ここまで */


fetch(jsonAddress)
  .then((response) => response.json())
  .then((data) => {
    poems = data;
    // JSONデータが取得されたら、ここに実行したいコードを記述します
    // 例：JSONデータがdata変数に格納されているので、これを使用して処理を行う
    // console.log(data);

    // ここで実行したい処理を記述します
    // 例：テーマセレクターを更新する関数を呼び出す
    updateJsonSelectorOptions();

    // themeSelectorの値を設定します
    const desiredTheme = "all";
    themeSelector.value = desiredTheme;

    // 'change'イベントを新しく作成します
    const changeEvent = new Event("change");

    // themeSelector上で'change'イベントを発生させます
    themeSelector.dispatchEvent(changeEvent);

    // Initialize the page with the first poem
    initializePageWithFirstPoem();
  })
  .catch((error) => {
    console.error("データの取得に失敗!:", error);
  });

////////////////////////////////////////////////////////////
// option要素「歌人を選んでください」を削除する関数
////////////////////////////////////////////////////////////
function removeOptionByValue(selector, valueToRemove) {
  // selectorから指定した値のoption要素を取得します
  const optionToRemove = selector.querySelector(
    `option[value = "${valueToRemove}"]`
  );
  // option要素が存在する場合に削除します
  if (optionToRemove) {
    selector.removeChild(optionToRemove);
  }
}


////////////////////////////////////////////////////////////
// 音声再生
////////////////////////////////////////////////////////////

let sound; // 音声ファイルの再生を制御するための変数
let pausedTime = 0; // 一時停止した位置を記録する変数

$("#play-pause-btn").click(function () {
  const selectedDataSet = jsonSelector.value;
  const selectedData = poems[selectedDataSet];
  const audioSrc = `../sound/${selectedData.number}.m4a`;

  if (!sound || sound._src !== audioSrc) {
    if (sound) {
      sound.off(); // イベントリスナーをクリア
      sound.stop();
    }

    sound = new Howl({
      src: [audioSrc],
      onend: function () {
        $("#play-pause-btn").removeClass("current");
        pausedTime = 0; // 音声が終了したら pausedTime をリセット
      },
    });
  }

  if (!sound.playing()) {
    // 一時停止した位置から再生
    sound.seek(pausedTime);
    sound.play();
    $("#play-pause-btn").addClass("current");
  } else {
    // 一時停止して、再生位置を記録
    pausedTime = sound.seek();
    sound.pause();
    $("#play-pause-btn").removeClass("current");
  }
});





////////////////////////////////////////////////////////////
// 歌人を変更したら音声をリセットする
////////////////////////////////////////////////////////////

$("#jsonSelector").on("change", function () {
  // 音声を停止してリセット
  if (sound) {
    sound.stop();
    sound.unload();
    sound = null;
    pausedTime = 0;
  }


  // 表示内容の更新などの処理を行う...

  // 選択された歌人に関する処理が完了したら、再生ボタンの表示を初期化
  $("#play-pause-btn").removeClass("current");
});



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

// JSONデータを取得し、テーブルを生成する関数
fetch(jsonAddress)
  .then((response) => response.json())
  .then((data) => {
    // テーブル要素を作成
    let table = document.createElement("table");
    // table.id = 'myTable'; // テーブルのIDを設定

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

      let sourceTd = document.createElement("td");
      sourceTd.textContent = poem.source;
      tr.appendChild(sourceTd);

      // tr要素をテーブルに追加
      table.appendChild(tr);
    }

    // 生成したtable要素をHTMLの要素（idが'dbTable'の要素）に追加する
    // document.getElementById("table").appendChild(table);
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
    let linkNumber = parseInt(event.target.textContent.trim());
    console.log("クリックされた数字:", linkNumber);
    themeSelector.value = "all";
    themeSelector.dispatchEvent(new Event("change"));
    jsonSelector.value = linkNumber;
    jsonSelector.dispatchEvent(new Event("change"));
    $("#sp-menu").removeClass("drawer");
    $("#burger").removeClass("active");
    $("body").removeClass("active");
    $("body, html").animate({ scrollTop: 0 }, 500);
    clearSearch();
  }
});

////////////////////////////////////////////////////////////
// リンク設定
////////////////////////////////////////////////////////////


document.addEventListener("click", function (event) {
  if (event.target.tagName === "SPAN" && event.target.dataset.link !== undefined) {
    // クリックされた要素が <span> タグであり、data-link属性が存在する場合
    let linkNumber = parseInt(event.target.dataset.link);

    console.log("クリックされた数字:", linkNumber);

    // jsonSelectorに値を設定
    jsonSelector.value = linkNumber;
    jsonSelector.dispatchEvent(new Event("change"));
  }
});

////////////////////////////////////////////////////////////
// トップに戻る
////////////////////////////////////////////////////////////
$(function () {
  var pagetop = $("#page-top");
  pagetop.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      pagetop.fadeIn();
    } else {
      pagetop.fadeOut();
    }
  });
  pagetop.click(function () {
    $("html,body").animate({ scrollTop: 0 }, 800);
    return false;
  });
});

// function initializePageWithFirstPoem() {
//   const firstPoemNumber = 1; // Assuming the first poem has the number 1
//   jsonSelector.value = firstPoemNumber;
//   const changeEvent = new Event("change");
//   jsonSelector.dispatchEvent(changeEvent);
// }

////////////////////////////////////////////////////////////
// URLから所望する番号の歌に遷移させる
////////////////////////////////////////////////////////////
function initializePageWithFirstPoem() {
  // URLから番号を取得する
  const urlParams = new URLSearchParams(window.location.search);
  const jsonSelectorValue = urlParams.get('jsonSelectorValue');
  // URLに番号が含まれている場合は初期化処理をスキップする
  if (jsonSelectorValue === null || jsonSelectorValue === "") {
    const firstPoemNumber = 1; // Assuming the first poem has the number 1
    jsonSelector.value = firstPoemNumber;
    const changeEvent = new Event("change");
    jsonSelector.dispatchEvent(changeEvent);
  }
}

////////////////////////////////////////////////////////////////////////////////
// URLで表示を切り替える
// 例：https://hyakuninisshu.com/?jsonSelectorValue=100
////////////////////////////////////////////////////////////////////////////////
// 初期化関数
function initializeJsonSelector() {

  // クリア処理を追加
  clearContent();

  // URLから番号を取得する
  const urlParams = new URLSearchParams(window.location.search);
  const jsonSelectorValue = urlParams.get('jsonSelectorValue');

  console.log('番号:', jsonSelectorValue);

  // Check if jsonSelectorValue is present in the URL
  if (jsonSelectorValue !== null) {
    setTimeout(() => {
      // Set the value of jsonSelector to the specified value
      jsonSelector.value = jsonSelectorValue;

      console.log('Before setting jsonSelector:', jsonSelector.value);

      // Dispatch a change event to trigger the associated functionality
      const changeEvent = new Event('change');
      jsonSelector.dispatchEvent(changeEvent);

      console.log('After setting jsonSelector:', jsonSelector.value);
    }, 300);
  }
}

// クリア処理を行う関数
function clearContent() {
  // jsonSelector以外のコンテンツを取得し、削除する
  const contentToClear = document.querySelectorAll('.card-front, .card-back, .explanation, .words, .photo');

  contentToClear.forEach((element) => {
    element.innerHTML = ''; // 要素の中身をクリア
  });

  // console.log('コンテンツをクリアしています');
}

// エラーハンドリング
window.addEventListener('error', function (event) {
  // エラーが発生した場合にページをリロードする
  console.error('Error occurred:', event.error);
  location.reload();
});


// ウィンドウのloadイベントハンドラ
window.addEventListener('load', (event) => {
  // jsonSelectorを取得する
  const jsonSelector = document.getElementById('jsonSelector');

  // Check if jsonSelector is present in the document
  if (jsonSelector !== null) {

    // URLから番号を取得する
    const urlParams = new URLSearchParams(window.location.search);
    const jsonSelectorValue = urlParams.get('jsonSelectorValue');

    // Check if jsonSelectorValue is present in the URL
    if (jsonSelectorValue !== null) {
      setTimeout(() => {
        // Set the value of jsonSelector to the specified value
        jsonSelector.value = jsonSelectorValue;

        // Dispatch a change event to trigger the associated functionality
        const changeEvent = new Event('change');
        jsonSelector.dispatchEvent(changeEvent);

        // クリア処理を行う
        clearContent();

        // console.log('After setting jsonSelector:', jsonSelector.value);
      }, 300);
    }
  } else {
    console.error('jsonSelector not found in the document.');
  }
});
