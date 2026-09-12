$(function () {
  $('#chart4').on('inview', function (event, isInView) {
    if (isInView) {
      var container = $('.chart-wrapper');
      var ctx = document.getElementById('chart4').getContext('2d');

      // 既存のChartオブジェクトを取得し、存在する場合は破棄
      let existingChart = Chart.getChart("chart4");
      if (existingChart) {
        existingChart.destroy();
      }

      $('#chart4').attr('width', container.width());
      $('#chart4').attr('height', 400);

      

      const years = [700, 900, 1100, 1300];
      const population = [5230000, 6000000, 6960000, 8180000];

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: years,
          datasets: [{
            label: '700年～1300年の人口推移',
            data: population,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let value = context.raw.toLocaleString(); // カンマ区切り
                  return `${value} 人`; // 「人」の単位を追加
                }
              }
            },
            annotation: {
              annotations: {
                highlightPeriod: {
                  type: 'box',
                  xMin: 794,
                  xMax: 1185,
                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                  borderWidth: 0
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: '年'
              }
            },
            y: {
              title: {
                display: true,
                text: '人口'
              },
              beginAtZero: false
            }
          }
        }
      });
    }
  });
});
