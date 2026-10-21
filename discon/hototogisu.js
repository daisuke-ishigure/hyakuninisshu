// $(document).ready(function() {
//   let audioLoaded = false;
//   let isPlaying = false;

//   // Document Ready イベント内で、ボディ要素にクリックイベントを追加
//   $(document.body).on('click', '#play-pause-btn3', function() {
//       // オーディオが読み込まれていない場合は初期化
//       if (!audioLoaded) {
//           let audioElement = document.getElementById('audio');
//           if (audioElement) {
//               audioElement.load();
//               audioLoaded = true;
//           } else {
//               console.error('audioElement is null or not yet created.');
//           }
//       }

//       // オーディオが読み込まれている場合、再生・停止を切り替える
//       if (audioLoaded) {
//           let audioElement = document.getElementById('audio');
//           if (audioElement) {
//               if (!isPlaying) {
//                   audioElement.play();
//                   isPlaying = true;
//                   $("#play-pause-btn3").addClass("current");
//               } else {
//                   audioElement.pause();
//                   isPlaying = false;
//                   $("#play-pause-btn3").removeClass("current");
//               }
//           } else {
//               console.error('audioElement is null or not yet created.');
//           }
//       }
//   });
// });

