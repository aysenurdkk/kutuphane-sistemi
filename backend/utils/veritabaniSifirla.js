const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Kullanici = require('../models/Kullanici');
const Kitap = require('../models/Kitap');

dotenv.config();

const baglanti = require('../config/db');

const veritabaniSifirla = async () => {
  await baglanti();

  console.log('Veritabanı sıfırlanıyor...');

  // Veritabanındaki tüm gerçek koleksiyonları listele ve temizle
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const col of collections) {
    await mongoose.connection.db.collection(col.name).deleteMany({});
    console.log(`Temizlendi: ${col.name}`);
  }

  console.log('Admin kullanıcısı yeniden oluşturuluyor...');
  await Kullanici.create({
    ad: 'Admin',
    soyad: 'Kullanici',
    email: 'admin@kutuphane.com',
    sifre: 'admin123',
    rol: 'admin',
  });

  console.log('Başlangıç kitapları oluşturuluyor...');
  const baslangicKitaplari = [
    // === ROMAN (5 kitap) ===
    {
      kitapAdi: 'Suç ve Ceza',
      yazar: 'Fyodor Dostoyevski',
      kategori: 'Roman',
      stok: 3,
      sayfaSayisi: 687,
      aciklama: "Dostoyevski'nin başyapıtlarından biri olan klasik roman."
    },
    {
      kitapAdi: 'Sefiller',
      yazar: 'Victor Hugo',
      kategori: 'Roman',
      stok: 2,
      sayfaSayisi: 1724,
      aciklama: "Jean Valjean'ın hayat mücadelesi ve adalet arayışı."
    },
    {
      kitapAdi: '1984',
      yazar: 'George Orwell',
      kategori: 'Roman',
      stok: 5,
      sayfaSayisi: 352,
      aciklama: "Düşünce polisinin ve Büyük Birader'in dünyası."
    },
    {
      kitapAdi: 'Don Kişot',
      yazar: 'Miguel de Cervantes',
      kategori: 'Roman',
      stok: 4,
      sayfaSayisi: 864,
      aciklama: 'Dünya edebiyatının en önemli ve ilk modern romanı.'
    },
    {
      kitapAdi: 'Küçük Prens',
      yazar: 'Antoine de Saint-Exupéry',
      kategori: 'Roman',
      stok: 6,
      sayfaSayisi: 112,
      aciklama: 'Çocukların ve büyüklere hayat dersleri veren bir hikaye.'
    },

    // === BİLİM (3 kitap) ===
    {
      kitapAdi: 'Kozmos',
      yazar: 'Carl Sagan',
      kategori: 'Bilim',
      stok: 5,
      sayfaSayisi: 400,
      aciklama: 'Evrenin büyüleyici ve kapsamlı keşfi.'
    },
    {
      kitapAdi: 'Kör Saatçi',
      yazar: 'Richard Dawkins',
      kategori: 'Bilim',
      stok: 3,
      sayfaSayisi: 380,
      aciklama: 'Evrim teorisinin en net ve etkili anlatımlarından biri.'
    },
    {
      kitapAdi: 'Geleceğin Fiziği',
      yazar: 'Michio Kaku',
      kategori: 'Bilim',
      stok: 4,
      sayfaSayisi: 432,
      aciklama: 'Bilimin 2100 yılına kadar hayatımızı nasıl şekillendireceği.'
    },

    // === TARİH (4 kitap) ===
    {
      kitapAdi: 'Sapiens',
      yazar: 'Yuval Noah Harari',
      kategori: 'Tarih',
      stok: 5,
      sayfaSayisi: 412,
      aciklama: 'İnsan türünün kısa bir tarihi.'
    },
    {
      kitapAdi: 'Osmanlı İmparatorluğu Klasik Çağ',
      yazar: 'Halil İnalcık',
      kategori: 'Tarih',
      stok: 3,
      sayfaSayisi: 284,
      aciklama: 'Osmanlı İmparatorluğu\'nun kurumları ve tarihi üzerine bir başyapıt.'
    },
    {
      kitapAdi: 'Savaş Sanatı',
      yazar: 'Sun Tzu',
      kategori: 'Tarih',
      stok: 6,
      sayfaSayisi: 96,
      aciklama: 'Strateji ve liderlik üzerine antik çağlardan gelen klasik rehber.'
    },
    {
      kitapAdi: 'Nutuk',
      yazar: 'Mustafa Kemal Atatürk',
      kategori: 'Tarih',
      stok: 10,
      sayfaSayisi: 600,
      aciklama: 'Türkiye Cumhuriyeti\'nin kuruluş ve kurtuluş mücadelesi belgesi.'
    },

    // === FELSEFE (4 kitap) ===
    {
      kitapAdi: 'Devlet',
      yazar: 'Platon',
      kategori: 'Felsefe',
      stok: 4,
      sayfaSayisi: 372,
      aciklama: 'Adalet, ideal devlet ve mağara alegorisi üzerine diyaloglar.'
    },
    {
      kitapAdi: 'Böyle Buyurdu Zerdüşt',
      yazar: 'Friedrich Nietzsche',
      kategori: 'Felsefe',
      stok: 5,
      sayfaSayisi: 328,
      aciklama: 'Üstinsan ve ebedi dönüş düşüncelerini içeren felsefi başyapıt.'
    },
    {
      kitapAdi: 'Denemeler',
      yazar: 'Michel de Montaigne',
      kategori: 'Felsefe',
      stok: 6,
      sayfaSayisi: 320,
      aciklama: 'İnsan doğası, dostluk ve yaşam üzerine kişisel sorgulamalar.'
    },
    {
      kitapAdi: 'Sokrates\'in Savunması',
      yazar: 'Platon',
      kategori: 'Felsefe',
      stok: 8,
      sayfaSayisi: 80,
      aciklama: 'Sokrates\'in Atina mahkemesindeki tarihi savunması.'
    },

    // === ÇOCUK (5 kitap) ===
    {
      kitapAdi: 'Şeker Portakalı',
      yazar: 'José Mauro de Vasconcelos',
      kategori: 'Çocuk',
      stok: 5,
      sayfaSayisi: 184,
      aciklama: 'Küçük Zeze\'nin hayal gücü, acıları ve sevgiyi keşfetmesi.'
    },
    {
      kitapAdi: 'Alice Harikalar Diyarında',
      yazar: 'Lewis Carroll',
      kategori: 'Çocuk',
      stok: 4,
      sayfaSayisi: 120,
      aciklama: 'Tavşan deliğinden düşen Alice\'in fantastik maceraları.'
    },
    {
      kitapAdi: 'Pinokyo',
      yazar: 'Carlo Collodi',
      kategori: 'Çocuk',
      stok: 5,
      sayfaSayisi: 160,
      aciklama: 'Gerçek bir çocuk olmak isteyen tahta kuklanın öyküsü.'
    },
    {
      kitapAdi: 'Momo',
      yazar: 'Michael Ende',
      kategori: 'Çocuk',
      stok: 4,
      sayfaSayisi: 304,
      aciklama: 'Zamanı çalan duman adamlar ve onlara meydan okuyan küçük Momo.'
    },
    {
      kitapAdi: 'Gulliver\'in Gezileri',
      yazar: 'Jonathan Swift',
      kategori: 'Çocuk',
      stok: 6,
      sayfaSayisi: 140,
      aciklama: 'Cüceler ve devler ülkesine yapılan fantastik seyahatler.'
    },

    // === DİĞER (4 kitap) ===
    {
      kitapAdi: 'Etkili İnsanların 7 Alışkanlığı',
      yazar: 'Stephen R. Covey',
      kategori: 'Diğer',
      stok: 5,
      sayfaSayisi: 400,
      aciklama: 'Kişisel ve profesyonel gelişim için karakter odaklı liderlik.'
    },
    {
      kitapAdi: 'Hızlı ve Yavaş Düşünme',
      yazar: 'Daniel Kahneman',
      kategori: 'Diğer',
      stok: 4,
      sayfaSayisi: 560,
      aciklama: 'Zihnimizin karar alma mekanizması ve iki sistemli düşünme biçimi.'
    },
    {
      kitapAdi: 'İrade Terbiyesi',
      yazar: 'Jules Payot',
      kategori: 'Diğer',
      stok: 5,
      sayfaSayisi: 280,
      aciklama: 'Zihinsel tembellikle savaş ve iradeyi güçlendirme yöntemleri.'
    },
    {
      kitapAdi: 'Atomik Alışkanlıklar',
      yazar: 'James Clear',
      kategori: 'Diğer',
      stok: 7,
      sayfaSayisi: 352,
      aciklama: 'Küçük adımlarla hayatımızda büyük değişimler yaratma yolları.'
    }
  ];

  for (const kitap of baslangicKitaplari) {
    await Kitap.create(kitap);
  }

  console.log('Veritabanı sıfırlandı, Admin ve başlangıç kitapları oluşturuldu.');
  process.exit(0);
};

veritabaniSifirla().catch((err) => {
  console.error('Sıfırlama hatası:', err);
  process.exit(1);
});
