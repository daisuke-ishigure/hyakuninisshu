const loading = document.getElementById('loading');
let startX; // startXの定義がない場合は追加する

function handleTouchMove(e) {
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    // 何かしらの処理を追加する
}

document.addEventListener('DOMContentLoaded', function() {
    loading.classList.add('loaded');
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
});
