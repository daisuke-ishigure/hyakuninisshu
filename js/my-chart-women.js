$(function () {
  $('#chartWomen').on('inview', function (event, isInView) {
    if (isInView) {
      var container = $('.chart-wrapper');
      var ctx = $('#chartWomen');

      // 既存のChartオブジェクトを取得
      let existingChart = Chart.getChart("chartWomen");

      // 既存のChartオブジェクトが存在する場合は破棄
      if (existingChart) {
        existingChart.destroy();
      }

      ctx.attr('width', container.width());
      ctx.attr('height', 300);

      let data = [2, 1, 0, 1, 0, 7, 4, 2, 3, 1];
      let maxValue = Math.max(...data);

      // プラグインを読み込む
      Chart.register(ChartDataLabels);

      let barConfig = {
        type: 'bar',
        data: {
          labels: ["1〜10番", "11〜20番", "21〜30番", "31〜40番", "41〜50番", "51〜60番", "61〜70番", "71〜80番", "81〜90番", "91〜100番"],
          datasets: [{
            data: data,
            label: 'label',
            backgroundColor: '#F07E97',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 20, // 最大値の棒の上にラベル分の余白を確保
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: maxValue + 2, // 棒の上にラベルが表示される余白を確保
              ticks: {
                stepSize: 1,
              }
            }
          },
          plugins: {
            title: {
              display: true,
              position: 'top',
              fontColor: '#000',
              fontSize: '20',
              text: '10首ごとに見る女性歌人の数',
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#333', // ラベルの色
              anchor: 'end', // アンカーの位置（start, center, end）
              align: 'top', // テキストの配置（start, center, end）
              formatter: (value) => {
                return value + '人';
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {  // ツールチップに表示するラベルを設定するコールバック関数
                  let label = '女性歌人：';  // 空のラベルを初期化
                  if (context.parsed.y !== null) {  // データポイントのy値がnullでない場合
                    label += new Intl.NumberFormat('ja-JP').format(context.parsed.y) + '人';
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
