import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import KitapForm from '../components/KitapForm';
import OduncSatiri from '../components/OduncSatiri';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

const KAT_RENK = {
  Roman:     { bg: '#fee2e2', text: '#991b1b' },
  Bilim:     { bg: '#dbeafe', text: '#1e40af' },
  Tarih:     { bg: '#fef3c7', text: '#92400e' },
  Teknoloji: { bg: '#e0f2fe', text: '#075985' },
  Felsefe:   { bg: '#ede9fe', text: '#5b21b6' },
  Çocuk:     { bg: '#fce7f3', text: '#9d174d' },
  Diğer:     { bg: '#d1fae5', text: '#065f46' },
};

const AdminPanel = () => {
  const [aktifTab, setAktifTab] = useState('kitaplar');

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header__info">
          <h1>Admin Paneli</h1>
          <p>Sistem yönetimi</p>
        </div>
      </div>

      <div className="tab-listesi">
        {['kitaplar', 'kullanicilar', 'oduncler'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn${aktifTab === tab ? ' aktif' : ''}`}
            onClick={() => setAktifTab(tab)}
          >
            {tab === 'kitaplar' && 'Kitaplar'}
            {tab === 'kullanicilar' && 'Kullanıcılar'}
            {tab === 'oduncler' && 'Ödünç Kayıtları'}
          </button>
        ))}
      </div>

      {aktifTab === 'kitaplar' && <KitaplarTab />}
      {aktifTab === 'kullanicilar' && <KullanicilarTab />}
      {aktifTab === 'oduncler' && <OdunclerTab />}
    </div>
  );
};

/* ---- KITAPLAR TAB ---- */
const KitaplarTab = () => {
  const { toastEkle } = useToast();
  const [kitaplar, setKitaplar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [formModal, setFormModal] = useState(false);
  const [seciliKitap, setSeciliKitap] = useState(null);

  const getir = useCallback(async () => {
    try {
      setYukleniyor(true);
      const { data } = await api.get('/kitaplar');
      setKitaplar(data.veri);
    } catch {
      toastEkle('Kitaplar yüklenemedi', 'error');
    } finally {
      setYukleniyor(false);
    }
  }, [toastEkle]);

  useEffect(() => { getir(); }, [getir]);

  const sil = async (id) => {
    if (!window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/kitaplar/${id}`);
      toastEkle('Kitap silindi', 'success');
      getir();
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'Silme başarısız', 'error');
    }
  };

  const modalKapat = () => { setFormModal(false); setSeciliKitap(null); };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn btn-primary" onClick={() => setFormModal(true)}>
          + Yeni Kitap
        </button>
      </div>

      <div className="tablo-kapsayici">
        <table className="tablo">
          <thead>
            <tr>
              <th>Kitap Adı</th>
              <th>Yazar</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {yukleniyor ? (
              <tr><td colSpan={5}><Spinner /></td></tr>
            ) : kitaplar.length === 0 ? (
              <tr><td colSpan={5}><div className="bos-durum"><p>Kayıt bulunamadı</p></div></td></tr>
            ) : (
              kitaplar.map((k) => (
                <tr key={k._id}>
                  <td><strong>{k.kitapAdi}</strong></td>
                  <td>{k.yazar}</td>
                  <td>
                    <span className="badge" style={{ background: KAT_RENK[k.kategori]?.bg, color: KAT_RENK[k.kategori]?.text }}>
                      {k.kategori}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${k.stok > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {k.stok}
                    </span>
                  </td>
                  <td>
                    <div className="tablo__aksiyonlar">
                      <button className="btn btn-secondary btn-sm" onClick={() => { setSeciliKitap(k); setFormModal(true); }}>
                        Düzenle
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => sil(k._id)}>
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal acik={formModal} kapat={modalKapat} baslik={seciliKitap ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}>
        <KitapForm kitap={seciliKitap} kapat={modalKapat} onBasarili={getir} />
      </Modal>
    </>
  );
};

/* ---- KULLANICILAR TAB ---- */
const KullanicilarTab = () => {
  const { toastEkle } = useToast();
  const [kullanicilar, setKullanicilar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const getir = useCallback(async () => {
    try {
      setYukleniyor(true);
      const { data } = await api.get('/kullanicilar');
      setKullanicilar(data.veri);
    } catch {
      toastEkle('Kullanıcılar yüklenemedi', 'error');
    } finally {
      setYukleniyor(false);
    }
  }, [toastEkle]);

  useEffect(() => { getir(); }, [getir]);

  const sil = async (id) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/kullanicilar/${id}`);
      toastEkle('Kullanıcı silindi', 'success');
      getir();
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'Silme başarısız', 'error');
    }
  };

  return (
    <div className="tablo-kapsayici">
      <table className="tablo">
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Email</th>
            <th>Rol</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {yukleniyor ? (
            <tr><td colSpan={4}><Spinner /></td></tr>
          ) : kullanicilar.length === 0 ? (
            <tr><td colSpan={4}><div className="bos-durum"><p>Kullanıcı bulunamadı</p></div></td></tr>
          ) : (
            kullanicilar.map((k) => (
              <tr key={k._id}>
                <td><strong>{k.ad} {k.soyad}</strong></td>
                <td>{k.email}</td>
                <td>
                  <span className={`badge ${k.rol === 'admin' ? 'badge-info' : 'badge-secondary'}`}>
                    {k.rol}
                  </span>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => sil(k._id)}>
                    Sil
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/* ---- ODUNCLER TAB ---- */
const OdunclerTab = () => {
  const { toastEkle } = useToast();
  const [oduncler, setOduncler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const getir = useCallback(async () => {
    try {
      setYukleniyor(true);
      const { data } = await api.get('/odunc');
      setOduncler(data.veri);
    } catch {
      toastEkle('Ödünç kayıtları yüklenemedi', 'error');
    } finally {
      setYukleniyor(false);
    }
  }, [toastEkle]);

  useEffect(() => { getir(); }, [getir]);

  const oduncIade = async (id) => {
    try {
      await api.put(`/odunc/${id}/iade`);
      toastEkle('Kitap iade edildi', 'success');
      getir();
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'İade başarısız', 'error');
    }
  };

  const sil = async (id) => {
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/odunc/${id}`);
      toastEkle('Kayıt silindi', 'success');
      getir();
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'Silme başarısız', 'error');
    }
  };

  return (
    <div className="tablo-kapsayici">
      <table className="tablo">
        <thead>
          <tr>
            <th>Kitap</th>
            <th>Kullanıcı</th>
            <th>Alım Tarihi</th>
            <th>Son İade Tarihi</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {yukleniyor ? (
            <tr><td colSpan={6}><Spinner /></td></tr>
          ) : oduncler.length === 0 ? (
            <tr><td colSpan={6}><div className="bos-durum"><p>Kayıt bulunamadı</p></div></td></tr>
          ) : (
            oduncler.map((o) => (
              <OduncSatiri
                key={o._id}
                odunc={o}
                oduncIade={oduncIade}
                adminGorunu
                onSil={() => sil(o._id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
