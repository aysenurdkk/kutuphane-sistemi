const jwt = require('jsonwebtoken');
const Kullanici = require('../models/Kullanici');

const tokenOlustur = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SURE });
};

// @desc    Yeni kullanıcı kaydı
// @route   POST /api/kullanicilar/kayit
// @access  Public
const kayitOl = async (req, res, next) => {
  try {
    const { ad, soyad, email, sifre, rol } = req.body;

    const mevcutKullanici = await Kullanici.findOne({ email });
    if (mevcutKullanici) {
      return res.status(400).json({ basarili: false, mesaj: 'Bu email zaten kayıtlı' });
    }

    const kullanici = await Kullanici.create({ ad, soyad, email, sifre, rol });

    res.status(201).json({
      basarili: true,
      veri: {
        _id: kullanici._id,
        ad: kullanici.ad,
        soyad: kullanici.soyad,
        email: kullanici.email,
        rol: kullanici.rol,
        token: tokenOlustur(kullanici._id),
      },
    });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/kullanicilar/giris
// @access  Public
const girisYap = async (req, res, next) => {
  try {
    const { email, sifre } = req.body;

    if (!email || !sifre) {
      return res.status(400).json({ basarili: false, mesaj: 'Email ve şifre zorunludur' });
    }

    const kullanici = await Kullanici.findOne({ email });
    if (!kullanici || !(await kullanici.sifreKontrol(sifre))) {
      return res.status(401).json({ basarili: false, mesaj: 'Email veya şifre hatalı' });
    }

    res.json({
      basarili: true,
      veri: {
        _id: kullanici._id,
        ad: kullanici.ad,
        soyad: kullanici.soyad,
        email: kullanici.email,
        rol: kullanici.rol,
        token: tokenOlustur(kullanici._id),
      },
    });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Giriş yapan kullanıcının profili
// @route   GET /api/kullanicilar/profil
// @access  Private
const profilGetir = async (req, res, next) => {
  try {
    const kullanici = await Kullanici.findById(req.kullanici._id).select('-sifre');
    res.json({ basarili: true, veri: kullanici });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Tüm kullanıcıları listele
// @route   GET /api/kullanicilar
// @access  Private/Admin
const tumKullanicilariGetir = async (req, res, next) => {
  try {
    const kullanicilar = await Kullanici.find().select('-sifre');
    res.json({ basarili: true, sayi: kullanicilar.length, veri: kullanicilar });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Tek kullanıcı getir
// @route   GET /api/kullanicilar/:id
// @access  Private/Admin
const kullaniciGetir = async (req, res, next) => {
  try {
    const kullanici = await Kullanici.findById(req.params.id).select('-sifre');
    if (!kullanici) {
      return res.status(404).json({ basarili: false, mesaj: 'Kullanıcı bulunamadı' });
    }
    res.json({ basarili: true, veri: kullanici });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Kullanıcı güncelle
// @route   PUT /api/kullanicilar/:id
// @access  Private/Admin
const kullaniciGuncelle = async (req, res, next) => {
  try {
    const guncellenecek = { ...req.body };

    if (guncellenecek.sifre) {
      const bcrypt = require('bcryptjs');
      const tuz = await bcrypt.genSalt(10);
      guncellenecek.sifre = await bcrypt.hash(guncellenecek.sifre, tuz);
    }

    const kullanici = await Kullanici.findByIdAndUpdate(req.params.id, guncellenecek, {
      new: true,
      runValidators: true,
    }).select('-sifre');

    if (!kullanici) {
      return res.status(404).json({ basarili: false, mesaj: 'Kullanıcı bulunamadı' });
    }

    res.json({ basarili: true, veri: kullanici });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Kullanıcı sil
// @route   DELETE /api/kullanicilar/:id
// @access  Private/Admin
const kullaniciSil = async (req, res, next) => {
  try {
    const kullanici = await Kullanici.findByIdAndDelete(req.params.id);
    if (!kullanici) {
      return res.status(404).json({ basarili: false, mesaj: 'Kullanıcı bulunamadı' });
    }
    res.json({ basarili: true, mesaj: 'Kullanıcı silindi' });
  } catch (hata) {
    next(hata);
  }
};

module.exports = {
  kayitOl,
  girisYap,
  profilGetir,
  tumKullanicilariGetir,
  kullaniciGetir,
  kullaniciGuncelle,
  kullaniciSil,
};
