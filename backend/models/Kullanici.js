// Kullanıcı modeli - öğrenci ve admin rollerini içerir
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const kullaniciSemasi = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    ad: {
      type: String,
      required: [true, 'Ad zorunludur'],
      minlength: [2, 'Ad en az 2 karakter olmalı'],
      maxlength: [50, 'Ad en fazla 50 karakter olabilir'],
      trim: true,
    },
    soyad: {
      type: String,
      required: [true, 'Soyad zorunludur'],
      minlength: [2, 'Soyad en az 2 karakter olmalı'],
      maxlength: [50, 'Soyad en fazla 50 karakter olabilir'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email zorunludur'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email girin'],
    },
    sifre: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: [6, 'Şifre en az 6 karakter olmalı'],
    },
    rol: {
      type: String,
      enum: ['ogrenci', 'admin'],
      default: 'ogrenci',
    },
  },
  { timestamps: false }
);

// Kayıt öncesi şifreyi hashle ve _id yi sıralı sayı olarak otomatik ata
kullaniciSemasi.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const maxKullanici = await mongoose.model('Kullanici').findOne({}, {}, { sort: { _id: -1 } });
      this._id = maxKullanici && typeof maxKullanici._id === 'number' ? maxKullanici._id + 1 : 1;
    } catch (hata) {
      return next(hata);
    }
  }
  
  if (!this.isModified('sifre')) return next();
  
  try {
    const tuz = await bcrypt.genSalt(10);
    this.sifre = await bcrypt.hash(this.sifre, tuz);
    next();
  } catch (hata) {
    next(hata);
  }
});

// Şifre doğrulama metodu
kullaniciSemasi.methods.sifreKontrol = async function (girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.sifre);
};

module.exports = mongoose.model('Kullanici', kullaniciSemasi);
