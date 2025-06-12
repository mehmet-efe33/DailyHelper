const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  image: String, // <<== image_url yerine sadece image yap
  pubDate: Date
});

module.exports = mongoose.model('News', NewsSchema);
