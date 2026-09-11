// function showTooltip(element, text) {
//   // すでにあるツールチップを削除
//   const oldTip = document.querySelector('.tooltip-box');
//   if (oldTip) oldTip.remove();

//   // ツールチップ要素を作成
//   const tip = document.createElement('div');
//   tip.className = 'tooltip-box';
//   tip.textContent = text;  // innerTextではなくtextContentを使用
  
//   // 親要素に追加
//   element.parentElement.appendChild(tip);
  
//   // マーカーと同じ位置を使用（CSSのtransformで調整される）
//   tip.style.left = element.style.left;
//   tip.style.top = element.style.top;

//   // 3秒後に消す
//   setTimeout(() => tip.remove(), 3000);
// }
function showTooltip(element, text, url = null) {

  // 既存ツールチップ削除
  const oldTip = document.querySelector('.tooltip-box');
  if (oldTip) oldTip.remove();

  // ツールチップ作成
  const tip = document.createElement('div');
  tip.className = 'tooltip-box';

  // ▼ リンクあり／なし分岐
  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;

    // marker の onclick が再発火しないよう停止
    link.onclick = function(e) {
      e.stopPropagation();
    };

    tip.appendChild(link);
  } else {
    tip.textContent = text;
  }

  // 親へ追加
  element.parentElement.appendChild(tip);

  // markerと同じ位置
  tip.style.left = element.style.left;
  tip.style.top = element.style.top;

  // 3秒後に削除
  setTimeout(() => {
    if (tip) tip.remove();
  }, 3000);
}
