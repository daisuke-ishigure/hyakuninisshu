$(function () {
  $('#chart3').on('inview', function (event, isInView) {
    if (isInView) {
      var container = $('.chart-wrapper');
      var ctx = $('#chart3');

      // 既存のChartオブジェクトを取得
      let existingChart = Chart.getChart("chart3");

      // 既存のChartオブジェクトが存在する場合は破棄
      if (existingChart) {
        existingChart.destroy();
      }

      ctx.attr('width', container.width());
      ctx.attr('height', 300);

      let data = [7, 38, 26, 15, 14];
      let total = data.reduce((a, b) => a + b, 0);
      let percentages = data.map(value => (value / total) * 100);

      // パイチャート用のプラグインを読み込む
      Chart.register(ChartDataLabels);

      let barConfig = {
        type: 'pie',
        data: {
          labels: ["飛鳥・\r\n奈良\r\n", "平安前期\r\n", "平安中期\r\n", "平安後期\r\n", "鎌倉\r\n"],
          datasets: [{
            data: percentages,
            label: 'label',
            backgroundColor: [
              '#C7768A',
              '#6CC068',
              '#DEC002',
              '#AF8C7F',
              '#DF7659'
            ],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              position: 'top',
              fontColor: '#000',
              fontSize: '20',
              text: '百人一首の時代区分',
            },
            legend: {
              display: true,
              position: 'bottom', // 凡例を下側に表示
            },
            datalabels: {
              color: '#fff', // ラベルの色
              anchor: 'end', // アンカーの位置（start, center, end）
              align: 'start', // テキストの配置（start, center, end）
              formatter: (value, context) => {
                let label = context.chart.data.labels[context.dataIndex]; // ラベルを取得
                return label + ' ' + Math.round(value) + '首'; // ラベル + 〇 + 首
              },
              offset: 10, // ラベルの位置を微調整
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.chart.data.labels[context.dataIndex] || '';
                  let value = context.raw;
                  return '歌の数: ' + Math.round(value) + '首';
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
