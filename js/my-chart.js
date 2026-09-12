$(function () {
  $('#chart').on('inview', function (event, isInView) {
    if (isInView) {
      var container = $('.chart-wrapper');
      var ctx = $('#chart');

      // 既存のChartオブジェクトを取得
      let existingChart = Chart.getChart("chart");

      // 既存のChartオブジェクトが存在する場合は破棄
      if (existingChart) {
        existingChart.destroy();
      }

      ctx.attr('width', container.width());
      ctx.attr('height', 300);

      let data = [24, 7, 10, 14, 5, 5, 15, 14, 4, 2];
      let total = data.reduce((a, b) => a + b, 0);
      let percentages = data.map(value => (value / total) * 100);

      let barConfig = {
        type: 'bar',
        data: {
          labels: ["古今和歌集", "後撰和歌集", "拾遺和歌集", "後拾遺和歌集", "金葉和歌集", "詞花和歌集", "千載和歌集", "新古今和歌集", "新勅撰和歌集", "続後撰和歌集"],
          datasets: [{
            data: percentages,
            label: 'label',
            backgroundColor: [
              '#c7768a',
              '#F5E695',
              '#af8c7f',
              '#DEC002',
              '#01A99C',
              '#7DCAB6',
              '#6CC068',
              '#DF7659',
              '#F07E97',
              '#F8B6C4'
            ],
            borderWidth: 1,
          }]
        },
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              position: 'top',
              fontColor: '#000',
              fontSize: '20',
              text: '百人一首の出典（勅撰和歌集）',
            },
            legend: {
              display: false,
            },
            datalabels: {
              formatter: (value, context) => {
                return Math.round(value) + '首'; // 数値を整数に丸めて表示
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {  // ツールチップに表示するラベルを設定するコールバック関数
                  let label = '歌の数：';  // 空のラベルを初期化
                  if (context.parsed.y !== null) {  // データポイントのy値がnullでない場合
                    // 〇首にフォーマットし、ラベルに追加
                    label += new Intl.NumberFormat('ja-JP').format(context.parsed.y) + '首';
                  }
                  return label;  // 最終的なラベルを返す
                }
              }
            }
          }
        }
      };

      let barChart = new Chart(ctx, barConfig);
    }
  });
});
