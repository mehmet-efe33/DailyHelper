const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const News = require('./models/News');
const fetchAndStoreNews = require('./newsFetcher');

const app = express();
const PORT = 3000;

app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/newsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB bağlantısı başarılı.");
  fetchAndStoreNews(); // sunucu başlarken çek
});

// GET /news?page=1
app.get("/news", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 6;
  const skip = (page - 1) * pageSize;

  try {
    const total = await News.countDocuments();
    const totalPages = Math.min(10, Math.ceil(total / pageSize));
    const news = await News.find()
      .sort({ _id: -1 }) // en son eklenen ilk gelir
      .skip(skip)
      .limit(pageSize);

    res.json({ news, currentPage: page, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "MongoDB'den haber çekme hatası", detail: err.message });
  }
});


app.listen(PORT, () => console.log(`Server http://localhost:${PORT} üzerinde çalışıyor.`));
