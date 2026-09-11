// カジカガエルの音声再生
let sound; // 変更点: soundを宣言
let pausedTime = 0; // 変更点: pausedTimeを宣言

$("#play-pause-btn2").click(function () {
  const audioSrc = '../sound/kajikagaeru.mp3';
  console.log('音声再生');

  if (!sound || sound._src !== audioSrc) {
    if (sound) {
      sound.stop();
    }

    sound = new Howl({
      src: [audioSrc],
      onend: function () {
        $("#play-pause-btn2").removeClass("current");
      },
    });
  }

  if (!sound.playing()) {
    // 一時停止した位置から再生
    sound.seek(pausedTime);
    sound.play();
    $("#play-pause-btn2").addClass("current");
  } else {
    // 一時停止して、再生位置を記録
    pausedTime = sound.seek();
    sound.pause();
    $("#play-pause-btn2").removeClass("current");
  }
});
