const express = require('express');
const axios = require('./frontend/node_modules/axios/index.d.cts');
const app = express();
require('dotenv').config(); // .env dosyasından RAPID_API_KEY almak için

app.use(express.static('public')); // HTML/CSS/JS klasörü

app.get('/api/matches', async (req, res) => {
  const { league } = req.query;
  const today = new Date().toISOString().split('T')[0];
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${today}&league=${league}&season=2024`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("API Hatası:", error.message);
    res.status(500).json({ error: "Veri alınamadı." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
