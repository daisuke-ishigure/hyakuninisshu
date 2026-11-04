/* gihou ページ：#28 などで開いたとき、上の図や画像の読み込みでページが伸びて見出しの位置がずれるので、
   読み込みが落ち着くまで見出しの位置に合わせ直す。ユーザーが操作したらそこで止める。 */
(function () {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id && document.getElementById(id);
  if (!target) return;

  let timer = null;
  function stop() {
    clearInterval(timer);
  }
  function align() {
    if (Math.abs(target.getBoundingClientRect().top) > 1) target.scrollIntoView({ behavior: 'instant' });
  }

  timer = setInterval(align, 150);
  setTimeout(stop, 6000);
  ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach(function (type) {
    window.addEventListener(type, stop, { once: true, passive: true });
  });
})();
