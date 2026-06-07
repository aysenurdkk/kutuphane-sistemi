import mongoose from 'mongoose'

const kitapSemasi = new mongoose.Schema({
    kitapAdi: {
      type: String,
      required: [true, 'Kitap adı zorunludur'],
      trim: true,
      maxlength: [200, 'Kitap adı en fazla 200 karakter olabilir'],
    },
    yazar: {
      type: String,
      required: [true, 'Yazar adı zorunludur'],
      trim: true,
    },
    kategori: {
      type: String,
      required: [true, 'Kategori zorunludur'],
      enum: ['Roman', 'Bilim', 'Tarih', 'Felsefe', 'Çocuk', 'Diğer'],
      default: 'Diğer',
    },
    stok: {
      type: Number,
      required: [true, 'Stok bilgisi zorunludur'],
      min: [0, 'Stok 0 dan az olamaz'],
      default: 1,
    },
    aciklama: {
      type: String,
      maxlength: [500, 'Açıklama en fazla 500 karakter olabilir'],
    },
    kapakResmi: { type: String, default: null },
    sayfaSayisi: {
      type: Number,
      min: [1, 'Sayfa sayısı 1 den az olamaz'],
      default: null,
    },
})

export default mongoose.model('Kitap', kitapSemasi)
