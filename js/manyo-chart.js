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

      let data = [2000, 473, 88, 84, 78];

      // パイチャート用のプラグインを読み込む
      Chart.register(ChartDataLabels);

      let barConfig = {
        type: 'bar',
        data: {
          labels: ["詠み人知らず", "大伴家持", "柿本人麻呂", "大伴坂上郎女", "大伴旅人"],

          datasets: [{
            data: data,
            label: 'label',
            backgroundColor: [
              '#F07E97',
              '#DF9E76',
              '#C2DC9F',
              '#859EBC',
              '#AF8C7F'
            ],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false,
              position: 'top',
              fontColor: '#000',
              fontSize: '20',
              text: '収録された歌が多い万葉歌人ベスト5',
            },
            legend: {
              display: false,
              position: 'bottom',
            },
            datalabels: {
              color: '#333', // ラベルの色
              anchor: 'center', // アンカーの位置（start, center, end）
              align: 'center', // テキストの配置（start, center, end）

              formatter: (value, context) => {
                // 数値にカンマを追加して、最後に '首' を付ける
                let formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return formattedValue + '首';
              },
              offset: 40, // ラベルの位置を微調整
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
