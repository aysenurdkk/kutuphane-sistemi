// Ödünç modeli - kitap ödünç alma işlemlerini tutar
const mongoose = require('mongoose');

const oduncSemasi = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    kullaniciId: {
      type: Number,
      ref: 'Kullanici', // Kullanici modeline referans
      required: [true, 'Kullanıcı zorunludur'],
    },
    kitapId: {
      type: Number,
      ref: 'Kitap', // Kitap modeline referans
      required: [true, 'Kitap zorunludur'],
    },
    almaTarihi: {
      type: Date,
      default: Date.now,
    },
    sonIadeTarihi: {
      type: Date,
      required: true,
    },
    iadeTarihi: {
      type: Date,
      default: null,
    },
    durum: {
      type: String,
      enum: ['oduncte', 'iade_edildi'],
      default: 'oduncte',
    },
  },
  { timestamps: false }
);

// Yeni ödünç kaydı eklendiğinde _id yi sıralı sayı olarak otomatik ata
oduncSemasi.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const maxOdunc = await mongoose.model('Odunc').findOne({}, {}, { sort: { _id: -1 } });
      this._id = maxOdunc && typeof maxOdunc._id === 'number' ? maxOdunc._id + 1 : 1;
      next();
    } catch (hata) {
      next(hata);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Odunc', oduncSemasi);
