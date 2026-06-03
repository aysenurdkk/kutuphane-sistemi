const Odunc = require('../models/Odunc');
const Kitap = require('../models/Kitap');

// @desc    Kitap ödünç al
// @route   POST /api/odunc
// @access  Private
const oduncAl = async (req, res, next) => {
  try {
    const { kitapId } = req.body;

    const kitap = await Kitap.findById(kitapId);
    if (!kitap) {
      return res.status(404).json({ basarili: false, mesaj: 'Kitap bulunamadı' });
    }

    if (kitap.stok <= 0) {
      return res.status(400).json({ basarili: false, mesaj: 'Kitap stokta mevcut değil' });
    }

    const aktifOdunc = await Odunc.findOne({
      kullaniciId: req.kullanici._id,
      durum: 'oduncte',
    });

    if (aktifOdunc) {
      return res.status(400).json({ basarili: false, mesaj: 'Aktif ödünç kaydınız var. Lütfen önce mevcut kitabı iade edin.' });
    }

    const almaTarihi = new Date();
    const sonIadeTarihi = new Date(almaTarihi);
    sonIadeTarihi.setDate(sonIadeTarihi.getDate() + 15);

    const odunc = await Odunc.create({
      kullaniciId: req.kullanici._id,
      kitapId,
      almaTarihi,
      sonIadeTarihi,
    });

    kitap.stok -= 1;
    await kitap.save();

    await odunc.populate([
      { path: 'kullaniciId', select: 'ad soyad email' },
      { path: 'kitapId', select: 'kitapAdi yazar kategori' },
    ]);

    res.status(201).json({ basarili: true, veri: odunc });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Kitap iade et
// @route   PUT /api/odunc/:id/iade
// @access  Private
const iadeEt = async (req, res, next) => {
  try {
    const odunc = await Odunc.findById(req.params.id);

    if (!odunc) {
      return res.status(404).json({ basarili: false, mesaj: 'Ödünç kaydı bulunamadı' });
    }

    if (odunc.durum === 'iade_edildi') {
      return res.status(400).json({ basarili: false, mesaj: 'Kitap zaten iade edilmiş' });
    }

    const sahipMi =
      odunc.kullaniciId.toString() === req.kullanici._id.toString() ||
      req.kullanici.rol === 'admin';

    if (!sahipMi) {
      return res.status(403).json({ basarili: false, mesaj: 'Bu işlem için yetkiniz yok' });
    }

    odunc.durum = 'iade_edildi';
    odunc.iadeTarihi = Date.now();
    await odunc.save();

    await Kitap.findByIdAndUpdate(odunc.kitapId, { $inc: { stok: 1 } });

    await odunc.populate([
      { path: 'kullaniciId', select: 'ad soyad email' },
      { path: 'kitapId', select: 'kitapAdi yazar kategori' },
    ]);

    res.json({ basarili: true, veri: odunc });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Tüm ödünç kayıtlarını getir
// @route   GET /api/odunc
// @access  Private/Admin
const tumOduncleriGetir = async (req, res, next) => {
  try {
    const oduncler = await Odunc.find()
      .populate('kullaniciId', 'ad soyad email')
      .populate('kitapId', 'kitapAdi yazar')
      .sort({ almaTarihi: -1 });

    res.json({ basarili: true, sayi: oduncler.length, veri: oduncler });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Giriş yapan kullanıcının ödünç kayıtları
// @route   GET /api/odunc/benim
// @access  Private
const benimOdunclerim = async (req, res, next) => {
  try {
    const oduncler = await Odunc.find({ kullaniciId: req.kullanici._id })
      .populate('kitapId', 'kitapAdi yazar kategori')
      .sort({ almaTarihi: -1 });

    res.json({ basarili: true, sayi: oduncler.length, veri: oduncler });
  } catch (hata) {
    next(hata);
  }
};

// @desc    Ödünç kaydı sil
// @route   DELETE /api/odunc/:id
// @access  Private/Admin
const oduncSil = async (req, res, next) => {
  try {
    const odunc = await Odunc.findByIdAndDelete(req.params.id);
    if (!odunc) {
      return res.status(404).json({ basarili: false, mesaj: 'Ödünç kaydı bulunamadı' });
    }
    res.json({ basarili: true, mesaj: 'Ödünç kaydı silindi' });
  } catch (hata) {
    next(hata);
  }
};

module.exports = { oduncAl, iadeEt, tumOduncleriGetir, benimOdunclerim, oduncSil };
