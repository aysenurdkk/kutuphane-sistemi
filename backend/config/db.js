import mongoose from 'mongoose'

const baglanti = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB bağlandı: ${conn.connection.host}`)
  } catch (hata) {
    console.error(`MongoDB bağlantı hatası: ${hata.message}`)
    throw hata
  }
}

export default baglanti
