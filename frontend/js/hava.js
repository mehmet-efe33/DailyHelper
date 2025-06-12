const apiKey = "96f7decfb02973155dba4b3695b85b25";

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=tr&appid=${apiKey}`;
    //const url = `http://localhost:3000/weather?city=${city}`;
    fetchWeather(url);
    getForecast(city);
}

function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("Tarayıcınız konum desteği sağlamıyor.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=tr&appid=${apiKey}`;
            fetchWeather(url);
            // ✅ Ek olarak 5 günlük tahmin için şehir ismini bul:
            const forecastUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

            fetch(forecastUrl)
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        const cityName = data[0].name;
                        getForecast(cityName);
                    }
                });
        },
        error => {
            alert("Konum bilgisi alınamadı.");
        }
    );
}

function fetchWeather(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Şehir bulunamadı veya konum alınamadı.");
            return response.json();
        })
        .then(data => {
            const { name, main, weather } = data;
            document.getElementById("weatherResult").innerHTML = `
  <div class="card border-0 bg-light shadow-sm p-4 mx-auto mt-4" style="max-width: 400px;">
    <div class="card-body text-center">
      <h4 class="card-title mb-3">${name}</h4>
      <p><strong>Sıcaklık:</strong> ${main.temp.toFixed(1)}°C</p>
      <p><strong>Hissedilen:</strong> ${main.feels_like.toFixed(1)}°C</p>
      <p><strong>Hava Durumu:</strong> ${weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Hava durumu simgesi" class="mt-3 img-fluid" />
    </div>
  </div>
`;

        })
        .catch(error => {
            document.getElementById("weatherResult").innerHTML =
                `<div class="alert alert-danger">${error.message}</div>`;
        });
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=tr&appid=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00")); // Gün ortası verileri
            const forecastHTML = forecastList.map(item => {
                const date = new Date(item.dt_txt);
                const options = { weekday: 'long', day: 'numeric', month: 'long' };
                return `
                    <div class="card text-center p-2 m-2 shadow-sm" style="min-width: 120px;">
                        <h6><b>${date.toLocaleDateString('tr-TR', options)} Saat 12</b></h6>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" class="img-fluid"/>
                        <p><b>${item.main.temp.toFixed(1)}°C</b></p>
                        <small><b>${item.weather[0].description}</b></small>
                    </div>
                `;
            }).join("");

            document.getElementById("forecastResult").innerHTML = `
                <div class="d-flex flex-wrap justify-content-center mt-4">
                    ${forecastHTML}
                </div>
            `;
        })
        .catch(err => {
            document.getElementById("forecastResult").innerHTML =
                `<div class="alert alert-danger">5 günlük tahmin getirilemedi.</div>`;
        });
}