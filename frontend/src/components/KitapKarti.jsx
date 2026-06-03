import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const KAT_RENK = {
  Roman:   { border: '#dc2626', bg: '#fee2e2', text: '#991b1b' },
  Bilim:   { border: '#2563eb', bg: '#dbeafe', text: '#1e40af' },
  Tarih:   { border: '#d97706', bg: '#fef3c7', text: '#92400e' },
  Felsefe: { border: '#7c3aed', bg: '#ede9fe', text: '#5b21b6' },
  Çocuk:   { border: '#db2777', bg: '#fce7f3', text: '#9d174d' },
  Diğer:   { border: '#059669', bg: '#d1fae5', text: '#065f46' },
};

/* ---------- Detay Modalı ---------- */
const KitapDetayModal = ({ kitap, renk, gorselSrc, oduncAl, aktifOduncVar, kapat }) => {
  const { kullanici } = useAuth();
  const stokMevcut = kitap.stok > 0;
  const [gorselHata, setGorselHata] = useState(false);

  return (
    <div className="kitap-detay-overlay" onClick={(e) => e.target === e.currentTarget && kapat()}>
      <div className="kitap-detay-modal" style={{ borderTop: `4px solid ${renk.border}` }}>
        <button className="kitap-detay-kapat" onClick={kapat} aria-label="Kapat">✕</button>

        <div className="kitap-detay-ust">
          <div className="kitap-detay-kapak" style={{ background: renk.bg }}>
            {!gorselHata ? (
              <img
                src={gorselSrc}
                alt={kitap.kitapAdi}
                className="kitap-detay-kapak-img"
                onError={() => setGorselHata(true)}
              />
            ) : (
              <div className="kitap-karti__kapak-placeholder" style={{ color: renk.border, height: '100%' }}>
                <span className="kitap-karti__kapak-baslik">{kitap.kitapAdi}</span>
              </div>
            )}
          </div>

          <div className="kitap-detay-bilgi">
            <span className="kitap-karti__kategori" style={{ background: renk.bg, color: renk.text }}>
              {kitap.kategori}
            </span>

            <h2 className="kitap-detay-baslik">{kitap.kitapAdi}</h2>
            <p className="kitap-detay-yazar">{kitap.yazar}</p>

            <div className="kitap-detay-meta">
              {kitap.sayfaSayisi && <span>{kitap.sayfaSayisi} sayfa</span>}
              <span className={stokMevcut ? 'detay-stok-mevcut' : 'detay-stok-yok'}>
                {stokMevcut ? `${kitap.stok} adet mevcut` : 'Stokta yok'}
              </span>
            </div>

            {kitap.aciklama && (
              <p className="kitap-detay-aciklama">{kitap.aciklama}</p>
            )}

            <div className="kitap-detay-aksiyonlar">
              {kullanici && kullanici.rol !== 'admin' && stokMevcut && !aktifOduncVar && (
                <button
                  className="btn-odunc btn-full"
                  style={{ '--kat-renk': renk.border }}
                  onClick={() => { oduncAl(kitap); kapat(); }}
                >
                  Ödünç Al
                </button>
              )}
              {kullanici && kullanici.rol !== 'admin' && stokMevcut && aktifOduncVar && (
                <p className="kitap-karti__giris-mesaj" style={{ color: 'var(--warning)' }}>
                  Önce mevcut kitabı iade edin
                </p>
              )}
              {!kullanici && stokMevcut && (
                <p className="kitap-karti__giris-mesaj">Ödünç almak için giriş yapın</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Kart ---------- */
const KitapKarti = ({ kitap, oduncAl, aktifOduncVar }) => {
  const { kullanici } = useAuth();
  const stokMevcut = kitap.stok > 0;
  const renk       = KAT_RENK[kitap.kategori] || KAT_RENK['Diğer'];
  const [gorselHata, setGorselHata] = useState(false);
  const [detayAcik, setDetayAcik]   = useState(false);

  const openLibraryUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(kitap.kitapAdi)}-M.jpg`;
  const gorselSrc = kitap.kapakResmi || openLibraryUrl;

  return (
    <>
      <div
        className="kitap-karti"
        style={{ borderTop: `3px solid ${renk.border}`, cursor: 'pointer' }}
        onClick={() => setDetayAcik(true)}
      >
        <div className="kitap-karti__kapak" style={{ background: renk.bg }}>
          {!gorselHata ? (
            <img
              src={gorselSrc}
              alt={kitap.kitapAdi}
              className="kitap-karti__kapak-img"
              onError={() => setGorselHata(true)}
            />
          ) : (
            <div className="kitap-karti__kapak-placeholder" style={{ color: renk.border }}>
              <span className="kitap-karti__kapak-baslik">{kitap.kitapAdi}</span>
            </div>
          )}
        </div>

        <div className="kitap-karti__icerik">
          <div className="kitap-karti__ust">
            <span className="kitap-karti__kategori" style={{ background: renk.bg, color: renk.text }}>
              {kitap.kategori}
            </span>
            <span className={`kitap-karti__stok ${stokMevcut ? 'mevcut' : 'yok'}`}>
              {stokMevcut ? `${kitap.stok} adet` : 'Stokta yok'}
            </span>
          </div>

          <h3 className="kitap-karti__baslik">{kitap.kitapAdi}</h3>
          <p className="kitap-karti__yazar">{kitap.yazar}</p>

          <div className="kitap-karti__meta">
            {kitap.sayfaSayisi && <span>{kitap.sayfaSayisi} sayfa</span>}
          </div>

          {kitap.aciklama && (
            <p className="kitap-karti__aciklama">{kitap.aciklama}</p>
          )}

          <div className="kitap-karti__aksiyonlar" onClick={(e) => e.stopPropagation()}>
            {kullanici && kullanici.rol !== 'admin' && stokMevcut && !aktifOduncVar && (
              <button
                className="btn-odunc btn-full"
                style={{ '--kat-renk': renk.border }}
                onClick={() => oduncAl(kitap)}
              >
                Ödünç Al
              </button>
            )}
            {kullanici && kullanici.rol !== 'admin' && stokMevcut && aktifOduncVar && (
              <p className="kitap-karti__giris-mesaj" style={{ color: 'var(--warning)' }}>
                Önce mevcut kitabı iade edin
              </p>
            )}
            {!kullanici && stokMevcut && (
              <p className="kitap-karti__giris-mesaj">Ödünç almak için giriş yapın</p>
            )}
          </div>
        </div>
      </div>

      {detayAcik && (
        <KitapDetayModal
          kitap={kitap}
          renk={renk}
          gorselSrc={gorselSrc}
          oduncAl={oduncAl}
          aktifOduncVar={aktifOduncVar}
          kapat={() => setDetayAcik(false)}
        />
      )}
    </>
  );
};

export default KitapKarti;
