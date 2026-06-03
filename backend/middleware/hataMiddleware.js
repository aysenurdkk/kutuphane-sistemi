const hataYonetici = (hata, req, res, next) => {
  let statusKod = hata.statusKod || 500;
  let mesaj = hata.message || 'Sunucu hatası';

  // Mongoose geçersiz ObjectId
  if (hata.name === 'CastError') {
    statusKod = 400;
    mesaj = 'Geçersiz ID formatı';
  }

  // Mongoose doğrulama hatası
  if (hata.name === 'ValidationError') {
    statusKod = 400;
    mesaj = Object.values(hata.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose tekil alan (unique) ihlali
  if (hata.code === 11000) {
    statusKod = 400;
    const alan = Object.keys(hata.keyValue)[0];
    mesaj = `${alan} zaten kayıtlı`;
  }

  // JWT hataları
  if (hata.name === 'JsonWebTokenError') {
    statusKod = 401;
    mesaj = 'Geçersiz token';
  }

  if (hata.name === 'TokenExpiredError') {
    statusKod = 401;
    mesaj = 'Token süresi doldu, lütfen tekrar giriş yapın';
  }

  res.status(statusKod).json({
    basarili: false,
    mesaj,
    yigin: process.env.NODE_ENV === 'development' ? hata.stack : undefined,
  });
};

const bulunamadiHatasi = (req, res, next) => {
  const hata = new Error(`Bulunamadı - ${req.originalUrl}`);
  hata.statusKod = 404;
  next(hata);
};

module.exports = { hataYonetici, bulunamadiHatasi };
