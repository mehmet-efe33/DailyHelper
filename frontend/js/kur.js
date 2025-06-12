const endpoint = "https://open.er-api.com/v6/latest/TRY";

document.addEventListener("DOMContentLoaded", () => {
    fetch(endpoint)
        .then(res => {
            if (!res.ok) throw new Error("Ağ hatası veya sunucu yanıtı alınamadı");
            return res.json();
        })
        .then(data => {
            if (data.result !== "success") throw new Error("API'den geçersiz cevap");
            const rates = data.rates;
            const kurContainer = document.getElementById("kurContainer");

            const birimler = [
                { isim: "Amerikan Doları", kod: "USD", oran: rates.USD },
                { isim: "Euro", kod: "EUR", oran: rates.EUR },
                { isim: "İngiliz Sterlini", kod: "GBP", oran: rates.GBP }
            ];

            birimler.forEach(kur => {
                const card = document.createElement("div");
                card.className = "col-md-5 col-lg-4 mb-4";

                const tlDegeri = kur.oran !== 0 ? (1 / kur.oran).toFixed(2) : "Yok";

                card.innerHTML = `
                    <div class="card p-3 shadow-sm h-100">
                        <h5>${kur.isim} (${kur.kod})</h5>
                        <p>1 ${kur.kod} ≈ ${tlDegeri} TL</p>
                        <input type="number" placeholder="TL girin" class="form-control mb-2 tlInput">
                        <div class="result text-muted">= 0 ${kur.kod}</div>
                    </div>
                `;

                kurContainer.appendChild(card);

                const input = card.querySelector(".tlInput");
                const result = card.querySelector(".result");

                input.addEventListener("input", () => {
                    const tlDeger = parseFloat(input.value);
                    const hesap = isNaN(tlDeger) || tlDeger <= 0
                        ? 0
                        : (tlDeger / (1 / kur.oran)).toFixed(2);
                    result.textContent = `= ${hesap} ${kur.kod}`;

                    // Grafik güncelle
                    updateAllChartValues();
                });
            });

        })
        .catch(err => {
            document.getElementById("kurContainer").innerHTML =
                `<div class="alert alert-danger">Kur verileri alınamadı: ${err.message}</div>`;
        });
});

let kurChart = null;

function updateAllChartValues() {
    const inputs = document.querySelectorAll('.tlInput');
    const labels = [];
    const values = [];

    inputs.forEach((input, i) => {
        const val = parseFloat(input.value);
        if (isNaN(val) || val <= 0) {
            labels.push(`Birim ${i + 1}`);
            values.push(0);
        } else {
            const oran = parseFloat(document.querySelectorAll(".result")[i].textContent.split("=")[1]);
            labels.push(document.querySelectorAll("h5")[i].textContent.split(" ")[0]);
            values.push(oran);
        }
    });

    updateChart(labels, values);
}

function updateChart(labels, values) {
    const ctx = document.getElementById('kurChart').getContext('2d');
    if (!ctx) return;

    if (kurChart) kurChart.destroy();

    kurChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Kur Karşılığı',
                data: values,
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return parseFloat(value).toLocaleString("tr-TR") + ' Birim';
                        }
                    }
                }
            }
        }
    });
}
