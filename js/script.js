const NEWS_API_KEY = 'pub_6039d917187d4ee6aeb0f737df616615'; // Buraya kendi key'ini koy
const newsContainer = document.getElementById('news-section');

async function fetchNews() {
    try {
        const response = await fetch(`https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&language=tr&country=tr&category=top`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            newsContainer.innerHTML = '<p>Haber bulunamadı.</p>';
            return;
        }

        // Sadece ilk 3 haberi al
        const topNews = data.results.slice(0, 6);

        newsContainer.innerHTML = ''; // Önceki içeriği temizle

        topNews.forEach(news => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <a href="${news.link}" target="_blank">
                        <img src="${news.image_url || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="Haber Görseli">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${news.title}</h5>
                        <p class="card-text">${news.description || 'Detay için haberi okuyun.'}</p>
                    </div>
                </div>
            `;
            newsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Haber çekme hatası:", error);
        newsContainer.innerHTML = '<p>Haberler yüklenemedi.</p>';
    }
}

fetchNews();
