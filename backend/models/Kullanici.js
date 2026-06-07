import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const kullaniciSemasi = new mongoose.Schema({
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
})

kullaniciSemasi.pre('save', async function (next) {
  if (!this.isModified('sifre')) return next()

  try {
    const tuz = await bcrypt.genSalt(10)
    this.sifre = await bcrypt.hash(this.sifre, tuz)
    next()
  } catch (hata) {
    next(hata)
  }
})

kullaniciSemasi.methods.sifreKontrol = async function (girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.sifre)
}

export default mongoose.model('Kullanici', kullaniciSemasi)
