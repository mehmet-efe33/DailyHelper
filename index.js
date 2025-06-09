const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3000;

// CORS izni (geliştirme için)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/weather", async (req, res) => {
  const city = req.query.city || "Istanbul";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=tr`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Weather API error", detail: err.message });
  }
});

app.get("/news", async (req, res) => {
  const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&language=tr&country=tr&category=top`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "News API error", detail: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy API listening on http://localhost:${PORT}`));
