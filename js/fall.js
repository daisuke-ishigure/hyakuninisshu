'use strict';
let snowContainer = document.querySelector('.card-front');

// span要素を作成し、class「snow」を付与する。
const createSnow = () => {
  let snow = document.createElement('span');
  snow.className = 'snow';

  // 雪のサイズをランダムに設定する
  let minSize = 20;
  let maxSize = 40;

  let snowSize = Math.random() * (maxSize - minSize) + minSize;
  snow.style.width = snowSize + "px";
  snow.style.height = snowSize + "px";

  // 雪が降る位置をランダムに設定する（左右の端5%に出現しないようにする）
  let minLeft = 5; // 左端からの最小の距離（%）
  let maxLeft = 93; // 右端からの最大の距離（%）
  let leftPosition = Math.random() * (maxLeft - minLeft) + minLeft;
  snow.style.left = leftPosition + '%';
  
  snowContainer.appendChild(snow);

  // 9秒後に雪のspan要素を削除する
  setTimeout(()=>{
    snow.remove();
  },8000)
};


setInterval(createSnow, 1200);

