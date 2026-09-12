'use strict';
let snowContainer = document.querySelector('.card-front');

// 雪を作成する関数（従来通り）
const createSnow = () => {
  let snow = document.createElement('span');
  snow.className = 'snow';

  let minSize = 2;
  let maxSize = 6;
  let snowSize = Math.random() * (maxSize - minSize) + minSize;
  snow.style.width = snowSize + "px";
  snow.style.height = snowSize + "px";

  let minLeft = 5; 
  let maxLeft = 93;
  let leftPosition = Math.random() * (maxLeft - minLeft) + minLeft;
  snow.style.left = leftPosition + '%';
  
  snowContainer.appendChild(snow);
  setTimeout(() => snow.remove(), 8000);
};

// ランダムな流れ星を作成する関数
const createShootingStar = () => {
  let shootingStar = document.createElement('span');
  shootingStar.className = 'shooting-star';

  // ランダムな開始位置 (右上のどこか)
  let startTop = Math.random() * 20 - 5; // -5% 〜 20% の範囲
  let startLeft = Math.random() * 30 + 70; // 70% 〜 100% の範囲
  shootingStar.style.top = startTop + '%';
  shootingStar.style.left = startLeft + '%';

  // 流れ星のサイズ
  let starSize = Math.random() * 70 + 80; // 80px 〜 150px
  shootingStar.style.width = starSize + 'px';

  // 角度固定（-45度）
  shootingStar.style.transform = `rotate(-45deg)`;

  // ランダムなアニメーション時間（3秒～6秒）
  let duration = Math.random() * 3 + 3;
  shootingStar.style.animationDuration = duration + 's';

  snowContainer.appendChild(shootingStar);
  setTimeout(() => shootingStar.remove(), duration * 1000);

  // 次の流れ星をランダムな間隔（10秒～20秒）で発生させる
  let nextTime = Math.random() * 10000 + 10000; // 10,000ms ～ 20,000ms
  setTimeout(createShootingStar, nextTime);
};

// 初回の流れ星を発生
setTimeout(createShootingStar, Math.random() * 10000 + 10000);
