/* 歌のページ（N.html）の .explanation：PC表示で内容が枠に収まらないときだけ、
   data-fit の段階を上げて見出しまわりの余白や行間を詰める（段階の中身は css/style.css）。 */
(function () {
  const box = document.querySelector('.explanation');
  if (!box) return;
  const MAX_LEVEL = 5;

  function fits() {
    const dds = box.querySelectorAll(':scope > dl > dd');
    const last = dds[dds.length - 1];
    if (!last) return true;
    const range = document.createRange();
    range.selectNodeContents(last);
    const textBottom = Math.max(...Array.from(range.getClientRects(), r => r.bottom));
    const limit = box.getBoundingClientRect().bottom - parseFloat(getComputedStyle(box).paddingBottom);
    return textBottom <= limit;
  }

  function adjust() {
    box.removeAttribute('data-fit');
    if (!window.matchMedia('(min-width: 1001px)').matches) return;
    for (let level = 0; level <= MAX_LEVEL && !fits(); level++) {
      box.setAttribute('data-fit', level + 1);
    }
  }

  adjust();
  window.addEventListener('load', adjust);
  window.addEventListener('resize', adjust);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(adjust);
})();
