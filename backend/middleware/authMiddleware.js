import jwt from 'jsonwebtoken'
import Kullanici from '../models/Kullanici.js'

export const koruma = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ mesaj: 'Token bulunamadı' })
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        req.kullanici = await Kullanici.findById(id).select('-sifre')
        next()
    } catch {
        res.status(401).json({ mesaj: 'Geçersiz token' })
    }
}

export const adminKoruma = (req, res, next) => {
    const kullanici = req.kullanici

    if (kullanici && kullanici.rol === 'admin') {
        next()

    } else {
        return res.status(403).json({
            mesaj: 'Admin yetkisi gerekli'
        })
    }
}
