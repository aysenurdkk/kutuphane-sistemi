import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import KitapKarti from '../components/KitapKarti';
import KitapForm from '../components/KitapForm';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { KitapIkon } from '../components/Ikonlar';

const KATEGORILER = ['Tümü', 'Roman', 'Bilim', 'Tarih', 'Felsefe', 'Çocuk', 'Diğer'];

const tarihFormat = (tarih) =>
  new Date(tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const AnaSayfa = () => {
  const { kullanici } = useAuth();
  const { toastEkle } = useToast();

  const [kitaplar, setKitaplar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState('');
  const [aramaGecici, setAramaGecici] = useState('');
  const [kategori, setKategori] = useState('Tümü');
  const [formModal, setFormModal] = useState(false);
  const [onayKitap, setOnayKitap] = useState(false);
  const [aktifOduncVar, setAktifOduncVar] = useState(false);

  const kitaplariGetir = useCallback(async () => {
    try {
      setYukleniyor(true);
      const params = {};
      if (arama) params.arama = arama;
      if (kategori !== 'Tümü') params.kategori = kategori;
      const { data } = await api.get('/kitaplar', { params });
      setKitaplar(data.veri);
    } catch {
      toastEkle('Kitaplar yüklenemedi', 'error');
    } finally {
      setYukleniyor(false);
    }
  }, [arama, kategori, toastEkle]);

  useEffect(() => { kitaplariGetir(); }, [kitaplariGetir]);

  useEffect(() => {
    if (!kullanici) { setAktifOduncVar(false); return; }
    api.get('/odunc/benim')
      .then(({ data }) => setAktifOduncVar(data.veri.some((o) => o.durum === 'oduncte')))
      .catch(() => { });
  }, [kullanici]);

  const handleAramaGonder = (e) => {
    e.preventDefault();
    setArama(aramaGecici);
  };

  const oduncOnayAc = (kitap) => {
    if (!kullanici) { toastEkle('Ödünç almak için giriş yapın', 'warning'); return; }
    setOnayKitap(kitap);
  };

  const oduncAl = async () => {
    if (!onayKitap) return;
    try {
      await api.post('/odunc', { kitapId: onayKitap._id });
      toastEkle('Kitap başarıyla ödünç alındı', 'success');
      setOnayKitap(null);
      setAktifOduncVar(true);
      kitaplariGetir();
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'Ödünç alma başarısız', 'error');
      setOnayKitap(null);
    }
  };

  const modalKapat = () => setFormModal(false);

  return (
    <>
      {/* KATEGORİ + İÇERİK */}
      <div className="container">
        <div className="page-header">
          <div className="page-header__info">
            <h1>
              {kullanici
                ? `Merhaba, ${kullanici.ad}`
                : 'Kütüphane'}
            </h1>
            <p>
              {kullanici?.rol === 'admin'
                ? 'Koleksiyonu yönetin, kitap ekleyin veya düzenleyin.'
                : 'Binlerce kitap arasından ödünç almak istediğinizi bulun.'}
            </p>
          </div>
          {kullanici?.rol === 'admin' && (
            <button className="btn btn-primary" onClick={() => setFormModal(true)}>
              + Yeni Kitap Ekle
            </button>
          )}
        </div>

        <form className="arama-bar" onSubmit={handleAramaGonder}>
          <input
            className="form-input"
            type="search"
            placeholder="Kitap adı veya yazar ara..."
            value={aramaGecici}
            onChange={(e) => setAramaGecici(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">Ara</button>
        </form>

        <div className="kategori-chips">
          {KATEGORILER.map((k) => (
            <button
              key={k}
              className={`chip${kategori === k ? ' aktif' : ''}`}
              onClick={() => { setKategori(k); setArama(''); setAramaGecici(''); }}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="bolum-baslik">
          <h2>
            {kategori === 'Tümü' ? 'Tüm Kitaplar' : kategori}
            {arama && ` — "${arama}" araması`}
          </h2>
          <span>{kitaplar.length} kitap</span>
        </div>

        {yukleniyor ? (
          <Spinner />
        ) : kitaplar.length === 0 ? (
          <div className="bos-durum">
            <div className="bos-durum__ikon"><KitapIkon boyut={56} /></div>
            <p>Arama kriterinize uygun kitap bulunamadı.</p>
          </div>
        ) : (
          <div className="kitap-grid">
            {kitaplar.map((kitap) => (
              <KitapKarti
                key={kitap._id}
                kitap={kitap}
                oduncAl={oduncOnayAc}
                aktifOduncVar={aktifOduncVar}
              />
            ))}
          </div>
        )}
      </div>

      <Modal acik={formModal} kapat={modalKapat} baslik="Yeni Kitap Ekle">
        <KitapForm kapat={modalKapat} onBasarili={kitaplariGetir} />
      </Modal>

      {onayKitap && (
        <Modal acik kapat={() => setOnayKitap(null)} baslik="Ödünç Onayı">
          <p style={{ marginBottom: '1rem' }}>
            <strong>{onayKitap.kitapAdi}</strong> kitabını ödünç almak istiyorsunuz.
          </p>
          <div className="odunc-onay-bilgi">
            <div className="odunc-onay-bilgi__satir">
              <span>Alım Tarihi</span>
              <strong>{tarihFormat(new Date())}</strong>
            </div>
            <div className="odunc-onay-bilgi__satir">
              <span>Son İade Tarihi</span>
              <strong>{tarihFormat(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000))}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary btn-full" onClick={oduncAl}>Onayla</button>
            <button className="btn btn-secondary btn-full" onClick={() => setOnayKitap(null)}>İptal</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AnaSayfa;
