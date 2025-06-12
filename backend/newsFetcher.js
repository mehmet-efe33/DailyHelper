// newsFetcher.js

const axios = require('axios');
const mongoose = require('mongoose');
const News = require('./models/News');

const API_KEY = 'pub_6039d917187d4ee6aeb0f737df616615'; // Buraya kendi key'ini koy

async function fetchAndStoreNews() {
    try {
        const response = await axios.get(`https://newsdata.io/api/1/news?apikey=${API_KEY}&language=tr&country=tr&category=top`);
        const articles = response.data.results;

        for (const item of articles) {
            const existing = await News.findOne({ title: item.title });
            if (!existing) {
                const newsItem = new News({
                    title: item.title,
                    description: item.description,
                    image: item.image_url || '',
                    link: item.link
                });
                await newsItem.save();
            }
        }


        console.log("Haberler başarıyla güncellendi.");
    } catch (error) {
        console.error("Haberleri alırken hata:", error.message);
    }
}

module.exports = fetchAndStoreNews;
