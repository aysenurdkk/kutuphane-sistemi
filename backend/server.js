import 'dotenv/config'
import baglanti from './config/db.js'
import express from 'express'
import cors from 'cors'
import kullaniciRoutes from './routes/kullaniciRoutes.js'
import kitapRoutes from './routes/kitapRoutes.js'
import oduncRoutes from './routes/oduncRoutes.js'
import { hataYonetici, notFound } from './middleware/hataMiddleware.js'
import logger from './middleware/logMiddleware.js'

await baglanti()

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/api/kullanicilar', kullaniciRoutes)
app.use('/api/kitaplar', kitapRoutes)
app.use('/api/odunc', oduncRoutes)

app.get('/', (req, res) => {
  res.json({ mesaj: 'Kütüphane API çalışıyor' })
})

app.use(notFound)
app.use(hataYonetici)

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`)
  })
}

export default app
