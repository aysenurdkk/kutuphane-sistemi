import express from 'express'
import Odunc from '../models/Odunc.js'
import Kitap from '../models/Kitap.js'
import { koruma, adminKoruma } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', koruma, adminKoruma, async (req, res, next) => {
  try {
    const oduncler = await Odunc.find()
      .populate('kullaniciId', 'ad soyad email')
      .populate('kitapId', 'kitapAdi yazar')
      .sort({ almaTarihi: -1 })
    res.json({ veri: oduncler })
  } catch (hata) {
    next(hata)
  }
})

router.get('/benim', koruma, async (req, res, next) => {
  try {
    const oduncler = await Odunc.find({ kullaniciId: req.kullanici._id })
      .populate('kitapId', 'kitapAdi yazar kategori')
      .sort({ almaTarihi: -1 })
    res.json({ veri: oduncler })
  } catch (hata) {
    next(hata)
  }
})

router.post('/', koruma, async (req, res, next) => {
  try {
    const { kitapId } = req.body

    const kitap = await Kitap.findById(kitapId)
    if (!kitap) {
      return res.status(404).json({ mesaj: 'Kitap bulunamadı' })
    }
    if (kitap.stok <= 0) {
      return res.status(400).json({ mesaj: 'Kitap stokta mevcut değil' })
    }

    const aktifOdunc = await Odunc.findOne({ kullaniciId: req.kullanici._id, durum: 'oduncte' })
    if (aktifOdunc) {
      return res.status(400).json({ mesaj: 'Aktif ödünç kaydınız var. Lütfen önce mevcut kitabı iade edin.' })
    }

    const almaTarihi = new Date()
    const sonIadeTarihi = new Date(almaTarihi)
    sonIadeTarihi.setDate(sonIadeTarihi.getDate() + 15)

    const odunc = await Odunc.create({ kullaniciId: req.kullanici._id, kitapId, almaTarihi, sonIadeTarihi })

    kitap.stok -= 1
    await kitap.save()

    res.status(201).json(odunc)
  } catch (hata) {
    next(hata)
  }
})

router.put('/:id/iade', koruma, async (req, res, next) => {
  try {
    const odunc = await Odunc.findById(req.params.id)
    if (!odunc) {
      return res.status(404).json({ mesaj: 'Ödünç kaydı bulunamadı' })
    }
    if (odunc.durum === 'iade_edildi') {
      return res.status(400).json({ mesaj: 'Kitap zaten iade edilmiş' })
    }

    const sahipMi = odunc.kullaniciId.toString() === req.kullanici._id.toString() || req.kullanici.rol === 'admin'
    if (!sahipMi) {
      return res.status(403).json({ mesaj: 'Bu işlem için yetkiniz yok' })
    }

    odunc.durum = 'iade_edildi'
    odunc.iadeTarihi = Date.now()
    await odunc.save()

    await Kitap.findByIdAndUpdate(odunc.kitapId, { $inc: { stok: 1 } })

    res.json(odunc)
  } catch (hata) {
    next(hata)
  }
})

router.delete('/:id', koruma, adminKoruma, async (req, res, next) => {
  try {
    const odunc = await Odunc.findByIdAndDelete(req.params.id)
    if (!odunc) {
      return res.status(404).json({ mesaj: 'Ödünç kaydı bulunamadı' })
    }
    res.json({ mesaj: 'Ödünç kaydı silindi' })
  } catch (hata) {
    next(hata)
  }
})

export default router
