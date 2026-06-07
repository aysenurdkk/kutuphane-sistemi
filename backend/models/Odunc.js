import mongoose from 'mongoose'

const oduncSemasi = new mongoose.Schema({
  kullaniciId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kullanici',
    required: [true, 'Kullanıcı zorunludur'],
  },
  kitapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kitap',
    required: [true, 'Kitap zorunludur'],
  },
  almaTarihi: { type: Date, default: Date.now },
  sonIadeTarihi: { type: Date, required: [true, 'Son iade tarihi zorunludur'] },
  iadeTarihi: { type: Date, default: null },
  durum: {
    type: String,
    enum: ['oduncte', 'iade_edildi'],
    default: 'oduncte',
  },
})

export default mongoose.model('Odunc', oduncSemasi)
