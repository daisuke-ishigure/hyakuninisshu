////////////////////////////////////////////////////////////
// アコーディオン
////////////////////////////////////////////////////////////
'use strict';
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});