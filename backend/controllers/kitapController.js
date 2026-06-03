const Kitap = require('../models/Kitap');

// @desc    Tüm kitapları listele (arama ve filtreleme ile)
// @route   GET /api/kitaplar
// @access  Public
const tumKitaplariGetir = async (req, res, next) => {
  try {
    const { arama, kategori } = req.query;
    const filtre = {};

    if (arama) {
      filtre.$or = [
        { kitapAdi: { $regex: arama, $options: 'i' } },
        { yazar: { $regex: arama, $options: 'i' } },
      ];
    }

    if (kategori) {
      filtre.kategori = kategori;
    }

    const kitaplar = await Kitap.find(filtre).sort({ _id: 1 });
    res.json({ basarili: true, sayi: kitaplar.length, veri: kitaplar });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Tek kitap getir
// @route   GET /api/kitaplar/:id
// @access  Public
const kitapGetir = async (req, res, next) => {
  try {
    const kitap = await Kitap.findById(req.params.id);
    if (!kitap) {
      return res.status(404).json({ basarili: false, mesaj: 'Kitap bulunamadı' });
    }
    res.json({ basarili: true, veri: kitap });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Yeni kitap ekle
// @route   POST /api/kitaplar
// @access  Private/Admin
const kitapEkle = async (req, res, next) => {
  try {
    const kitap = await Kitap.create(req.body);
    res.status(201).json({ basarili: true, veri: kitap });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Kitap güncelle
// @route   PUT /api/kitaplar/:id
// @access  Private/Admin
const kitapGuncelle = async (req, res, next) => {
  try {
    const kitap = await Kitap.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!kitap) {
      return res.status(404).json({ basarili: false, mesaj: 'Kitap bulunamadı' });
    }

    res.json({ basarili: true, veri: kitap });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Kitap sil
// @route   DELETE /api/kitaplar/:id
// @access  Private/Admin
const kitapSil = async (req, res, next) => {
  try {
    const kitap = await Kitap.findByIdAndDelete(req.params.id);
    if (!kitap) {
      return res.status(404).json({ basarili: false, mesaj: 'Kitap bulunamadı' });
    }
    res.json({ basarili: true, mesaj: 'Kitap silindi' });
  } catch (hata) {
    next(hata);
  }
};

module.exports = { tumKitaplariGetir, kitapGetir, kitapEkle, kitapGuncelle, kitapSil };
