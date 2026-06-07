import express from 'express'
import Kitap from '../models/Kitap.js'
import { koruma, adminKoruma } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { arama, kategori } = req.query
    const filtre = {}

    if (arama) {
      filtre.$or = [
        { kitapAdi: { $regex: arama, $options: 'i' } },
        { yazar: { $regex: arama, $options: 'i' } },
      ]
    }
    if (kategori) {
      filtre.kategori = kategori
    }

    const kitaplar = await Kitap.find(filtre).sort({ _id: 1 })
    res.json({ veri: kitaplar })
  } catch (hata) {
    next(hata)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const kitap = await Kitap.findById(req.params.id)
    if (!kitap) {
      return res.status(404).json({ mesaj: 'Kitap bulunamadı' })
    }
    res.json(kitap)
  } catch (hata) {
    next(hata)
  }
})

router.post('/', koruma, adminKoruma, async (req, res, next) => {
  try {
    const kitap = await Kitap.create(req.body)
    res.status(201).json(kitap)
  } catch (hata) {
    next(hata)
  }
})

router.put('/:id', koruma, adminKoruma, async (req, res, next) => {
  try {
    const kitap = await Kitap.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!kitap) {
      return res.status(404).json({ mesaj: 'Kitap bulunamadı' })
    }
    res.json(kitap)
  } catch (hata) {
    next(hata)
  }
})

router.delete('/:id', koruma, adminKoruma, async (req, res, next) => {
  try {
    const kitap = await Kitap.findByIdAndDelete(req.params.id)
    if (!kitap) {
      return res.status(404).json({ mesaj: 'Kitap bulunamadı' })
    }
    res.json({ mesaj: 'Kitap silindi' })
  } catch (hata) {
    next(hata)
  }
})

export default router
