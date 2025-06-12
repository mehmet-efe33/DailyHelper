const axios = require('axios');
const News = require('./models/News');

const NEWS_API_KEY = 'pub_6039d917187d4ee6aeb0f737df616615';

async function fetchAndStoreNews() {
  try {
    const res = await axios.get(`https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&language=tr&country=tr&category=top`);
    const articles = res.data.results;

    for (const item of articles) {
      await News.updateOne(
        { link: item.link },
        {
          title: item.title,
          description: item.description,
          link: item.link,
          image_url: item.image_url,
          pubDate: new Date(item.pubDate)
        },
        { upsert: true } // varsa güncelle, yoksa ekle
      );
    }

    console.log('Haberler güncellendi.');
  } catch (err) {
    console.error("Haber çekme hatası:", err.message);
  }
}

module.exports = fetchAndStoreNews;
