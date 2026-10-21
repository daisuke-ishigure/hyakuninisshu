$(function () {
  let pagetop = $("#page-top");
  pagetop.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
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


