(function () {
  // 日本語キー（radarScores のキーは常に日本語）
  const AXES_JA = ["愛情", "孤独", "情熱", "哀愁", "無常", "自然"];
  // 英語ラベル（英語ページで表示用）
  const AXES_EN = ["Romance", "Solitude", "Passion", "Melancholy", "Transience", "Nature"];

  // html[lang="en"] なら英語ラベルを使用、スコア取得は常に日本語キーで行う
  const isEN = document.documentElement.lang === 'en';
  const LABELS = isEN ? AXES_EN : AXES_JA;
  const SCORE_KEYS = AXES_JA;
  let chartInstance = null;
  let isInView = false;

  function renderRadarChart() {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;

    const scores = window.radarScores || {};

    // 既存インスタンスを破棄してアニメーションをリセット
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: LABELS,
        datasets: [{
          data: SCORE_KEYS.map(a => scores[a] ?? 0),
          fill: true,
          borderColor: "rgba(160, 50, 70, 1)",
          backgroundColor: "rgba(160, 50, 70, 0.2)",
          borderWidth: 1,
          pointBackgroundColor: "rgba(184, 35, 67, 1)",
          pointRadius: 2
        }]
      },
      options: {
        animation: { duration: 1000, easing: 'easeInOutQuart' },
        plugins: { legend: { display: false } },
        scales: {
          r: {
            // 英語ラベルは単語が長いため、少し小さめのフォントで収まりを確保する
            pointLabels: { color: "#222", font: { size: isEN ? 12 : 14 } },
            min: 0, max: 5,
            ticks: { display: false },
            grid: { color: "rgba(0,0,0,0.1)" },
            angleLines: { color: "rgba(0,0,0,0.1)" }
          }
        }
      }
    });
  }

  function checkInView() {
    const wrapper = document.getElementById('radarChartWrapper');
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const nowInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

    if (nowInView && !isInView) {
      // 画面外 → 画面内：アニメーション再生
      isInView = true;
      setTimeout(renderRadarChart, 50);
    } else if (!nowInView && isInView) {
      // 画面内 → 画面外：次回のために状態リセット
      isInView = false;
    }
  }

  window.addEventListener('load', function () {
    window.addEventListener('scroll', checkInView, { passive: true });
    setTimeout(checkInView, 300);
  });

  // モーダルなど、スクロール検知に頼らず任意のタイミングで描画したい場合のために公開
  window.renderRadarChart = renderRadarChart;
})();