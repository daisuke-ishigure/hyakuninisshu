function scrollToKeyword() {
  let searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  let searchText = searchInput.value.trim().toLowerCase();
  if (searchText === '') return;

  let rows = document.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].querySelectorAll('td, th');
    for (let j = 0; j < cells.length; j++) {
      if (cells[j].textContent.toLowerCase().includes(searchText)) {
        let originalColor = rows[i].style.backgroundColor; // 元の色を保存

        // 黄色にハイライト
        rows[i].style.backgroundColor = '#FFFF66';

        // 3回点滅
        let count = 0;
        let blinkInterval = setInterval(function() {
          if (count % 2 === 0) {
            rows[i].style.backgroundColor = '#FFFF66';
          } else {
            rows[i].style.backgroundColor = originalColor;
          }
          count++;
          if (count === 6) { // 3回点滅するために6回実行
            clearInterval(blinkInterval);
            rows[i].style.backgroundColor = originalColor; // 元の色に戻す
          }
        }, 300); // 300ミリ秒ごとに点滅

        let rowPosition = rows[i].getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: rowPosition, behavior: 'smooth' });

        return;
      }
    }
  }
  alert('検索ワードの該当するものがありません。');
}
