document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById('timeSeriesChart').getContext('2d');
  let chart = null;

  function loadChart(dayCount = 10) {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today.setDate(today.getDate() - dayCount + 1)).toISOString().split('T')[0];

    // 3 ayrı API çağrısı (USD, EUR, GBP)
    const urls = {
      USD: `https://api.frankfurter.app/${startDate}..${endDate}?from=USD&to=TRY`,
      EUR: `https://api.frankfurter.app/${startDate}..${endDate}?from=EUR&to=TRY`,
      GBP: `https://api.frankfurter.app/${startDate}..${endDate}?from=GBP&to=TRY`
    };

    Promise.all([
      fetch(urls.USD).then(res => res.json()),
      fetch(urls.EUR).then(res => res.json()),
      fetch(urls.GBP).then(res => res.json())
    ]).then(([usdData, eurData, gbpData]) => {
      const labels = Object.keys(usdData.rates).sort();
      const usdRates = labels.map(date => usdData.rates[date]?.TRY ?? null);
      const eurRates = labels.map(date => eurData.rates[date]?.TRY ?? null);
      const gbpRates = labels.map(date => gbpData.rates[date]?.TRY ?? null);

      if (chart) chart.destroy();

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Dolar (USD)',
              data: usdRates,
              borderColor: '#3e95cd',
              backgroundColor: 'rgba(62, 149, 205, 0.1)',
              pointBackgroundColor: '#3e95cd',
              tension: 0.3,
              borderWidth: 2,
              pointRadius: 4
            },
            {
              label: 'Euro (EUR)',
              data: eurRates,
              borderColor: '#8e5ea2',
              backgroundColor: 'rgba(142, 94, 162, 0.1)',
              pointBackgroundColor: '#8e5ea2',
              tension: 0.3,
              borderWidth: 2,
              pointRadius: 4
            },
            {
              label: 'Sterlin (GBP)',
              data: gbpRates,
              borderColor: '#3cba9f',
              backgroundColor: 'rgba(60, 186, 159, 0.1)',
              pointBackgroundColor: '#3cba9f',
              tension: 0.3,
              borderWidth: 2,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: getComputedStyle(document.body).color
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: "TL (1 Birim Yabancı Para Karşılığı)",
                color: getComputedStyle(document.body).color
              },
              ticks: {
                color: getComputedStyle(document.body).color
              }
            },
            x: {
              title: {
                display: true,
                text: "Tarih",
                color: getComputedStyle(document.body).color
              },
              ticks: {
                color: getComputedStyle(document.body).color
              }
            }
          }
        }
      });
    }).catch(err => {
      alert("Kur verileri alınamadı: " + err.message);
    });
  }

  loadChart(10);

  document.getElementById("dayRange").addEventListener("change", function () {
    loadChart(parseInt(this.value));
  });
});
