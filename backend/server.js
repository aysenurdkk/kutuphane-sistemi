// Ana sunucu dosyası - Express uygulamasını başlatır
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const baglanti = require('./config/db');
const { hataYonetici, bulunamadiHatasi } = require('./middleware/hataMiddleware');
const logMiddleware = require('./middleware/logMiddleware');

dotenv.config();

// MongoDB bağlantısını kur
baglanti();

const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(logMiddleware);

// Route'lar
app.use('/api/kullanicilar', require('./routes/kullaniciRoutes'));
app.use('/api/kitaplar', require('./routes/kitapRoutes'));
app.use('/api/odunc', require('./routes/oduncRoutes'));

// Ana sayfa testi
app.get('/', (req, res) => {
  res.json({ mesaj: 'Kütüphane API çalışıyor' });
});

// Tanımsız route'lar için 404
app.use(bulunamadiHatasi);

// Merkezi hata yönetimi (en son eklenmeli)
app.use(hataYonetici);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
  });
}

module.exports = app;
