// Kitap modeli - kütüphanedeki kitapları temsil eder
const mongoose = require('mongoose');

const kitapSemasi = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    kitapAdi: {
      type: String,
      required: [true, 'Kitap adı zorunludur'],
      trim: true,
      maxlength: [200, 'Kitap adı en fazla 200 karakter olabilir'],
    },
    yazar: {
      type: String,
      required: [true, 'Yazar adı zorunludur'],
      trim: true,
    },
    kategori: {
      type: String,
      required: [true, 'Kategori zorunludur'],
      enum: ['Roman', 'Bilim', 'Tarih', 'Felsefe', 'Çocuk', 'Diğer'],
      default: 'Diğer',
    },
    stok: {
      type: Number,
      required: [true, 'Stok bilgisi zorunludur'],
      min: [0, 'Stok 0 dan az olamaz'],
      default: 1,
    },
    aciklama: {
      type: String,
      maxlength: [500, 'Açıklama en fazla 500 karakter olabilir'],
    },
    kapakResmi: {
      type: String,
      default: null,
    },
    sayfaSayisi: {
      type: Number,
      min: [1, 'Sayfa sayısı 1 den az olamaz'],
      default: null,
    },
  },
  { timestamps: false }
);

// Yeni kitap eklendiğinde _id yi sıralı sayı olarak otomatik ata
kitapSemasi.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const maxKitap = await mongoose.model('Kitap').findOne({}, {}, { sort: { _id: -1 } });
      this._id = maxKitap && typeof maxKitap._id === 'number' ? maxKitap._id + 1 : 1;
      next();
    } catch (hata) {
      next(hata);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Kitap', kitapSemasi);
