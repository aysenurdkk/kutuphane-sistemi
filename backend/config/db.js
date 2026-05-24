// MongoDB bağlantısını kurar
const mongoose = require('mongoose');

const baglanti = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB bağlandı: ${conn.connection.host}`);
  } catch (hata) {
    console.error(`MongoDB bağlantı hatası: ${hata.message}`);
    process.exit(1);
  }
};

module.exports = baglanti;
