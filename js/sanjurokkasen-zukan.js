////////////////////////////////////////////////////////////
// 検索機能（三十六歌仙 歌仙絵と和歌）
// 歌人名・和歌・現代語訳・人物紹介を対象に、入力した文字で歌人カードを絞り込む
////////////////////////////////////////////////////////////
(function () {
  const searchInput = document.getElementById("searchInput");
  const searchResult = document.getElementById("searchResult");
  if (!searchInput) return;

  const pairs = document.querySelectorAll(".kasen-pair");
  const cards = document.querySelectorAll(".kasen-card");

  // カタカナ→ひらがな、空白除去、小文字化
  function normalize(text) {
    return text
      .replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  // ルビの読みを除いた本文と、ルビの読みで置き換えた本文の両方を検索対象にする
  // （textContent のままだと「朝霧あさぎり」のように漢字と読みが混ざるため）
  const index = Array.from(cards, (card) => {
    const plain = card.cloneNode(true);
    plain.querySelectorAll("rt").forEach((rt) => rt.remove());
    const reading = card.cloneNode(true);
    reading.querySelectorAll("ruby").forEach((ruby) => {
      const rt = ruby.querySelector("rt");
      ruby.replaceWith(rt ? rt.textContent : ruby.textContent);
    });
    return normalize(plain.textContent) + "\n" + normalize(reading.textContent);
  });

  function filter() {
    const value = normalize(searchInput.value);
    let count = 0;
    cards.forEach((card, i) => {
      const hit = !value || index[i].includes(value);
      card.hidden = !hit;
      // 拡大表示（lightbox）の前後送りを、表示中の歌人だけに限定する
      const zoom = card.querySelector("[data-lightbox]");
      if (zoom) zoom.dataset.lightbox = hit ? "kasen" : "kasen-hidden";
      if (hit) count++;
    });
    pairs.forEach((pair) => {
      pair.hidden = !pair.querySelector(".kasen-card:not([hidden])");
    });
    searchResult.textContent = value
      ? count ? `${count}人が該当しました。` : "該当する歌人が見つかりませんでした。"
      : "";
  }

  searchInput.addEventListener("input", filter);
})();
