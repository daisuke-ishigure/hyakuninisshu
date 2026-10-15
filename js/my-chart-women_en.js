// English version of js/my-chart-women.js (kyutei-salon_en.html): number of women poets in each group of ten poems
$(function () {
  $('#chartWomen').on('inview', function (event, isInView) {
    if (isInView) {
      var container = $('.chart-wrapper');
      var ctx = $('#chartWomen');

      // Destroy the existing chart, if any, before drawing it again
      let existingChart = Chart.getChart("chartWomen");
      if (existingChart) {
        existingChart.destroy();
      }

      ctx.attr('width', container.width());
      ctx.attr('height', 300);

      let data = [2, 1, 0, 1, 0, 7, 4, 2, 3, 1];
      let maxValue = Math.max(...data);

      Chart.register(ChartDataLabels);

      let barConfig = {
        type: 'bar',
        data: {
          labels: ["1–10", "11–20", "21–30", "31–40", "41–50", "51–60", "61–70", "71–80", "81–90", "91–100"],
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
              top: 20, // room above the tallest bar for its label
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: maxValue + 2,
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
              text: 'Women poets in each group of ten poems',
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#333',
              anchor: 'end',
              align: 'top',
              formatter: (value) => {
                return value;
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = 'Women poets: ';
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                  }
                  return label;
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
