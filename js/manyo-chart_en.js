// English version of js/manyo-chart.js (6_en.html): the poets with the most poems in the Man'yōshū
$(function () {
  $('#chart').on('inview', function (event, isInView) {
    if (isInView) {
      var container = $('.chart-wrapper');
      var ctx = $('#chart');

      // Destroy the existing chart, if any
      let existingChart = Chart.getChart("chart");
      if (existingChart) {
        existingChart.destroy();
      }

      ctx.attr('width', container.width());
      ctx.attr('height', 300);

      let data = [2000, 473, 88, 84, 78];

      Chart.register(ChartDataLabels);

      let barConfig = {
        type: 'bar',
        data: {
          labels: ["Author unknown", "Ōtomo no Yakamochi", "Kakinomoto no Hitomaro", "Lady Sakanoue", "Ōtomo no Tabito"],
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
            legend: {
              display: false,
            },
            datalabels: {
              color: '#333',
              anchor: 'center',
              align: 'center',
              // e.g. "2,000"
              formatter: (value) => value.toLocaleString('en-US'),
              offset: 40,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.parsed.y !== null ? 'Poems: ' + context.parsed.y.toLocaleString('en-US') : '';
                }
              }
            }
          }
        }
      };

      new Chart(ctx, barConfig);
    }
  });
});
