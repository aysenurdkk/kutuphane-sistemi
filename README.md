# 📚 Kütüphane Yönetim Sistemi

Öğrenci ve admin rollerini destekleyen, kitap ödünç alma/iade işlemlerini yöneten full-stack web uygulaması.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Backend | Node.js, Express.js |
| Veritabanı | MongoDB, Mongoose |
| Kimlik Doğrulama | JWT (JSON Web Token), bcryptjs |
| Frontend | React 18, Vite |
| HTTP İstemci | Axios |
| Yönlendirme | React Router v6 |

---

## Proje Yapısı

```
kutuphane-sistemi/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB bağlantısı
│   ├── controllers/
│   │   ├── kullaniciController.js
│   │   ├── kitapController.js
│   │   └── oduncController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT doğrulama, admin kontrolü
│   │   ├── hataMiddleware.js     # Merkezi hata yönetimi
│   │   └── logMiddleware.js      # İstek loglama
│   ├── models/
│   │   ├── Kullanici.js
│   │   ├── Kitap.js
│   │   └── Odunc.js
│   ├── routes/
│   │   ├── kullaniciRoutes.js
│   │   ├── kitapRoutes.js
│   │   └── oduncRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Kullanıcı durumu, localStorage
│   │   │   └── ToastContext.jsx  # Bildirim sistemi
│   │   ├── services/
│   │   │   └── api.js            # Axios yapılandırması
│   │   ├── components/           # 8 yeniden kullanılabilir bileşen
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── KitapKarti.jsx
│   │   │   ├── KitapForm.jsx
│   │   │   └── OduncSatiri.jsx
│   │   ├── pages/                # 5 sayfa (route)
│   │   │   ├── AnaSayfa.jsx      # /
│   │   │   ├── Giris.jsx         # /giris
│   │   │   ├── Kayit.jsx         # /kayit
│   │   │   ├── Profil.jsx        # /profil (protected)
│   │   │   └── AdminPanel.jsx    # /admin (protected+admin)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   └── uml-diyagramlari.md
├── .gitignore
└── README.md
```

---

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- MongoDB (lokal veya Atlas)

### Backend

```bash
cd backend
npm install
# .env dosyasını düzenleyin (MONGO_URI, JWT_SECRET)
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Uygulama adresleri:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## API Endpointleri

### Kullanıcılar `/api/kullanicilar`

| Yöntem | Endpoint | Erişim | Açıklama |
|--------|----------|--------|----------|
| POST | `/kayit` | Herkese açık | Yeni kullanıcı kaydı |
| POST | `/giris` | Herkese açık | Kullanıcı girişi (JWT döner) |
| GET | `/profil` | Giriş gerekli | Kendi profili |
| GET | `/` | Admin | Tüm kullanıcılar |
| GET | `/:id` | Admin | Tek kullanıcı |
| PUT | `/:id` | Admin | Kullanıcı güncelle |
| DELETE | `/:id` | Admin | Kullanıcı sil |

### Kitaplar `/api/kitaplar`

| Yöntem | Endpoint | Erişim | Açıklama |
|--------|----------|--------|----------|
| GET | `/` | Herkese açık | Kitap listesi (arama: `?arama=`, kategori: `?kategori=`) |
| GET | `/:id` | Herkese açık | Tek kitap |
| POST | `/` | Admin | Kitap ekle |
| PUT | `/:id` | Admin | Kitap güncelle |
| DELETE | `/:id` | Admin | Kitap sil |

### Ödünç `/api/odunc`

| Yöntem | Endpoint | Erişim | Açıklama |
|--------|----------|--------|----------|
| POST | `/` | Giriş gerekli | Kitap ödünç al |
| PUT | `/:id/iade` | Giriş gerekli | Kitap iade et |
| GET | `/benim` | Giriş gerekli | Kendi ödünç kayıtları |
| GET | `/` | Admin | Tüm ödünç kayıtları |
| DELETE | `/:id` | Admin | Kayıt sil |

---

## Özellikler

- **Kimlik Doğrulama**: JWT tabanlı, token localStorage'da saklanır
- **Yetkilendirme**: `ogrenci` ve `admin` rolleri
- **Kitap Yönetimi**: Ekleme, düzenleme, silme, arama ve kategori filtresi
- **Stok Takibi**: Ödünç alındığında stok azalır, iade edilince artар
- **Mükerrer Kontrol**: Aynı kitabı iki kez ödünç alamazsınız
- **Hata Yönetimi**: Mongoose validation, CastError, duplicate key, JWT hataları
- **Responsive Tasarım**: Mobil uyumlu, hamburger menü
- **Toast Bildirimleri**: Başarı/hata/uyarı bildirimleri
- **Modal**: Kitap ekleme/düzenleme formu

---

## Varsayılan Ortam Değişkenleri (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kutuphane
JWT_SECRET=kutuphane_gizli_anahtar_2024
JWT_SURE=7d
NODE_ENV=development
```



