import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Kullanici from '../models/Kullanici.js'
import { koruma, adminKoruma } from '../middleware/authMiddleware.js'

const router = express.Router()

const tokenOlustur = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SURE || '7d' })
}

router.post('/kayit', async (req, res, next) => {
  try {
    const { ad, soyad, email, sifre, rol } = req.body

    const mevcutKullanici = await Kullanici.findOne({ email })
    if (mevcutKullanici) {
      return res.status(400).json({ mesaj: 'Bu email zaten kayıtlı' })
    }

    const kullanici = await Kullanici.create({ ad, soyad, email, sifre, rol })

    res.status(201).json({
      veri: {
        _id: kullanici._id,
        ad: kullanici.ad,
        soyad: kullanici.soyad,
        email: kullanici.email,
        rol: kullanici.rol,
        token: tokenOlustur(kullanici._id),
      }
    })
  } catch (hata) {
    next(hata)
  }
})

router.post('/giris', async (req, res, next) => {
  try {
    const { email, sifre } = req.body

    if (!email || !sifre) {
      return res.status(400).json({ mesaj: 'Email ve şifre zorunludur' })
    }

    const kullanici = await Kullanici.findOne({ email })
    if (!kullanici || !(await kullanici.sifreKontrol(sifre))) {
      return res.status(401).json({ mesaj: 'Email veya şifre hatalı' })
    }

    res.json({
      veri: {
        _id: kullanici._id,
        ad: kullanici.ad,
        soyad: kullanici.soyad,
        email: kullanici.email,
        rol: kullanici.rol,
        token: tokenOlustur(kullanici._id),
      }
    })
  } catch (hata) {
    next(hata)
  }
})

router.get('/profil', koruma, async (req, res, next) => {
  try {
    const kullanici = await Kullanici.findById(req.kullanici._id).select('-sifre')
    res.json({ veri: kullanici })
  } catch (hata) {
    next(hata)
  }
})

router.get('/', koruma, adminKoruma, async (req, res, next) => {
  try {
    const kullanicilar = await Kullanici.find().select('-sifre')
    res.json({ veri: kullanicilar })
  } catch (hata) {
    next(hata)
  }
})

router.get('/:id', koruma, adminKoruma, async (req, res, next) => {
  try {
    const kullanici = await Kullanici.findById(req.params.id).select('-sifre')
    if (!kullanici) {
      return res.status(404).json({ mesaj: 'Kullanıcı bulunamadı' })
    }
    res.json(kullanici)
  } catch (hata) {
    next(hata)
  }
})

router.put('/:id', koruma, adminKoruma, async (req, res, next) => {
  try {
    const guncellenecek = { ...req.body }

    if (guncellenecek.sifre) {
      const tuz = await bcrypt.genSalt(10)
      guncellenecek.sifre = await bcrypt.hash(guncellenecek.sifre, tuz)
    }

    const kullanici = await Kullanici.findByIdAndUpdate(req.params.id, guncellenecek, { new: true }).select('-sifre')
    if (!kullanici) {
      return res.status(404).json({ mesaj: 'Kullanıcı bulunamadı' })
    }
    res.json(kullanici)
  } catch (hata) {
    next(hata)
  }
})

router.delete('/:id', koruma, adminKoruma, async (req, res, next) => {
  try {
    const kullanici = await Kullanici.findByIdAndDelete(req.params.id)
    if (!kullanici) {
      return res.status(404).json({ mesaj: 'Kullanıcı bulunamadı' })
    }
    res.json({ mesaj: 'Kullanıcı silindi' })
  } catch (hata) {
    next(hata)
  }
})

// =================================================================
// 📝 SINAV SORU HAVUZU KODLARI (Kullanıcı İşlemleri)
// =================================================================

// TODO: Soru 9 - Middleware Validasyon Tanımı
const kullaniciValidasyon = (req, res, next) => {
  // Sınavda burayı yazacaksınız
}

// TODO: Soru 1 - Endpoint ile veri ekleme (POST)
router.post('/sinav-ekle', kullaniciValidasyon, async (req, res, next) => {
  // Sınavda burayı yazacaksınız
})

// TODO: Soru 7 - Endpoint ile veri listeleme (GET)
router.get('/sinav-liste', async (req, res, next) => {
  // Sınavda burayı yazacaksınız
})

// TODO: Soru 5 - Endpoint ile veri güncelleme (PUT)
router.put('/sinav-guncelle/:id', async (req, res, next) => {
  // Sınavda burayı yazacaksınız
})

// TODO: Soru 3 - Endpoint ile veri silme (DELETE)
router.delete('/sinav-sil/:id', async (req, res, next) => {
  // Sınavda burayı yazacaksınız
})

export default router
