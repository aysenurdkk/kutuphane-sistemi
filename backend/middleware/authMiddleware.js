const jwt = require('jsonwebtoken');
const Kullanici = require('../models/Kullanici');

const koruma = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const cozulmus = jwt.verify(token, process.env.JWT_SECRET);
      req.kullanici = await Kullanici.findById(cozulmus.id).select('-sifre');
      if (!req.kullanici) {
        return res.status(401).json({ basarili: false, mesaj: 'Kullanıcı bulunamadı' });
      }
      next();
    } catch (hata) {
      return res.status(401).json({ basarili: false, mesaj: 'Geçersiz token' });
    }
  } else {
    return res.status(401).json({ basarili: false, mesaj: 'Token bulunamadı, yetkilendirme gerekli' });
  }
};

const adminKoruma = (req, res, next) => {
  if (req.kullanici && req.kullanici.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ basarili: false, mesaj: 'Bu işlem için admin yetkisi gerekli' });
  }
};

module.exports = { koruma, adminKoruma };
