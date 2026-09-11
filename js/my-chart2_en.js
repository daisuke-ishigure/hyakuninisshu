$(function () {
  $('#chart2').on('inview', function (event, isInView) {
    if (isInView) {
      var container = $('.chart-wrapper');
      var ctx = $('#chart2');

      // 既存のChartオブジェクトを取得
      let existingChart = Chart.getChart("chart2");

      // 既存のChartオブジェクトが存在する場合は破棄
      if (existingChart) {
        existingChart.destroy();
      }

      ctx.attr('width', container.width());
      ctx.attr('height', 300);

      let data = [43, 16, 6, 6, 4, 4, 1, 20];
      let total = data.reduce((a, b) => a + b, 0);
      let percentages = data.map(value => (value / total) * 100);

      // パイチャート用のプラグインを読み込む
      Chart.register(ChartDataLabels);

      let barConfig = {
        type: 'pie',
        data: {
        labels: ["Love", "Autumn", "Spring", "Winter", "Summer", "Travel", "Parting", "Miscellaneous"],          datasets: [{
            data: percentages,
            label: 'label',
            backgroundColor: [
              '#F07E97',
              '#DF9E76',
              '#C2DC9F',
              '#DEC002',
              '#659DCC',
              '#7DCAB6',
              '#555555',
              '#888888'
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
              text: 'Thematic Categories of the Included Poems',
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
                return label + ' ' + Math.round(value) + ' poems'; // ラベル + 〇 + 首
              },
              offset: 10, // ラベルの位置を微調整
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.chart.data.labels[context.dataIndex] || '';
                  let value = context.raw;
                  return Math.round(value) + ' poems';
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
