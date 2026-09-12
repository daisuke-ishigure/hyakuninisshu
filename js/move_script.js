$(function () {
  let pagetop = $("#page-top");
  pagetop.hide();
  $(window).scroll(function () {
    const scrollTop = $(this).scrollTop();
    // フッター（お問い合わせフォーム等のリンク）に重なるのを防ぐため、
    // ページ最下部付近では非表示にする
    const nearBottom = scrollTop + $(this).height() > $(document).height() - 150;
    if (scrollTop > 100 && !nearBottom) {
      pagetop.fadeIn();
    } else {
      pagetop.fadeOut();
    }
  });
  pagetop.click(function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  });
});

////////////////////////////////////////////////////////////
// ページ内リンク
////////////////////////////////////////////////////////////
$(function(){
  $('a[href^="#"]').click(function(){
    console.log('test');
    var adjust = 0;
    var speed = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top + adjust;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });
});

////////////////////////////////////////////////////////////
// 横スクロールする表（.js-table）の上部にもスクロールバーを表示する
// PCだと表が縦長の場合、下端のスクロールバーまで届きにくいための対策
////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.js-table').forEach(function (tableWrap) {
    var mirror = document.createElement('div');
    mirror.className = 'table-scroll-mirror';
    var mirrorInner = document.createElement('div');
    mirror.appendChild(mirrorInner);
    mirror.style.display = 'none';
    tableWrap.parentNode.insertBefore(mirror, tableWrap);

    function syncWidth() {
      mirrorInner.style.width = tableWrap.scrollWidth + 'px';
      mirror.style.display = tableWrap.scrollWidth > tableWrap.clientWidth + 1 ? '' : 'none';
    }
    syncWidth();

    var target = tableWrap.querySelector('table') || tableWrap;
    if (window.ResizeObserver) {
      new ResizeObserver(syncWidth).observe(target);
    } else {
      window.addEventListener('resize', syncWidth);
    }

    var syncing = false;
    mirror.addEventListener('scroll', function () {
      if (syncing) return;
      syncing = true;
      tableWrap.scrollLeft = mirror.scrollLeft;
      syncing = false;
    });
    tableWrap.addEventListener('scroll', function () {
      if (syncing) return;
      syncing = true;
      mirror.scrollLeft = tableWrap.scrollLeft;
      syncing = false;
    });
  });
});


