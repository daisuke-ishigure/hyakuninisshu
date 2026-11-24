/* ロボット対戦で、ロボットが「どの札かを聞き分けられる」前に札を取らないようにするための計算。
   karuta-taisen.html・karuta-taisen_en.html（平面版）と、3D版 karuta-taisen-3d.html が使う。

   聞き分けられる時刻は、読まれた歌と、まだ読まれる可能性のあるほかの歌の「出だしが何文字同じか」で決まる。
   例：場に「あさぼらけ」の2枚があれば6文字目まで待つ。出だしが同じ札がほかに無ければ1文字目で分かる。
   1枚取られて残りが1枚になれば、その分だけ早くなる（実際の競技かるたの決まり字の変化と同じ）。

   時間は sound/d_NNN.mp3 の実測から決めた：声が出るまで平均約130ms、1文字あたり約210ms
   （出だしが同じ歌どうしの音声を重ね、音が分かれる位置を測った。共通2文字で約390ms、5文字で約1000〜1160ms）。
   読み上げの音声を差し替えたら測り直すこと */
(() => {
  'use strict';
  const ONSET = 130;                         // 音声の先頭から声が出るまで
  const PER_CHAR = 230;                      // 1文字あたり（個体差があるので実測より少し長め）
  const NEXT = 130;                          // 違いの出る文字が聞こえて分かるまで
  // 聞き分けてから手が届くまで（強さごとの最小・最大。ミリ秒）
  const REACT = { easy: [800, 1200], normal: [800, 1200], hard: [450, 700], master: [350, 550] };

  // 決まり字は、書かれた文字ではなく読まれる音で決まる。データの読みと音が違う歌は、ここで音のほうに直す。
  // 44番「あふことの」は「おおことの」と読まれるので、60番「おおえ」・95番「おおけ」と3文字目まで聞き分けがつかない（三字決まり）
  const SOUND = { 44: 'おおことのたえてしなくは' };

  let heads = null;                          // 歌番号 → 上の句の読み（音。空白なし）
  function setHeads(kimariji) {
    heads = {};
    (kimariji || []).forEach(k => { heads[String(k.id)] = SOUND[k.id] || String(k.type_kakminoku_kana_gendai || '').replace(/\s/g, ''); });
  }
  function common(a, b) {
    let n = 0;
    while (n < a.length && n < b.length && a[n] === b[n]) n++;
    return n;
  }

  /* 読み上げの音声の先頭から、どの札か聞き分けられるまでの時間（ミリ秒）
     num：読まれた歌の番号 ／ others：まだ読まれる可能性のある歌の番号 ／ kimariji：js/kimariji.json の中身 */
  function heardAt(num, others, kimariji) {
    if (!heads) setHeads(kimariji);
    const me = heads[String(num)] || '';
    let same = 0;
    for (const o of others) if (String(o) !== String(num)) same = Math.max(same, common(me, heads[String(o)] || ''));
    return ONSET + PER_CHAR * same + NEXT;
  }

  // ロボットがいちばん早く手を出せる時刻（聞き分けた時刻＋強さに応じた反応の時間）
  function readyAt(num, others, kimariji, level) {
    const [a, b] = REACT[level] || REACT.normal;
    return heardAt(num, others, kimariji) + a + Math.random() * (b - a);
  }

  /* 音声の読み込みが遅れて、まだそこまで読み上げられていないときの、あと待つ時間（ミリ秒）。待たなくてよければ 0。
     再生できなかった・終わった音声なら待たない（止まったままにならないように） */
  function audioLag(audio, ready) {
    if (!audio || audio.paused || audio.ended || audio.error) return 0;
    const lag = ready - audio.currentTime * 1000;
    return lag > 30 ? Math.min(lag, 300) : 0;
  }

  window.KarutaHear = { heardAt, readyAt, audioLag };
})();
