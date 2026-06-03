import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import OduncSatiri from '../components/OduncSatiri';
import Spinner from '../components/Spinner';
import { KitapIkon } from '../components/Ikonlar';

const Profil = () => {
  const { kullanici } = useAuth();
  const { toastEkle }  = useToast();
  const [oduncler, setOduncler]   = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const oduncleriGetir = useCallback(async () => {
    try {
      setYukleniyor(true);
      const { data } = await api.get('/odunc/benim');
      setOduncler(data.veri);
    } catch {
      toastEkle('Ödünç kayıtları yüklenemedi', 'error');
    } finally {
      setYukleniyor(false);
    }
  }, [toastEkle]);

  useEffect(() => { oduncleriGetir(); }, [oduncleriGetir]);

  const oduncIade = async (id) => {
    try {
      await api.put(`/odunc/${id}/iade`);
      toastEkle('Kitap başarıyla iade edildi', 'success');
      oduncleriGetir();
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'İade başarısız', 'error');
    }
  };

  const aktifSayi   = oduncler.filter((o) => o.durum === 'oduncte').length;
  const iadeSayi    = oduncler.filter((o) => o.durum === 'iade_edildi').length;

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header__info">
          <h1>Profilim</h1>
          <p>Hesap bilgileriniz ve ödünç geçmişiniz</p>
        </div>
      </div>

      <div className="profil-grid">
        {/* SOL — Kullanıcı Kartı */}
        <aside>
          <div className="profil-kart">
            <div className="profil-kart__ust">
              <div className="profil-kart__avatar">
                {kullanici.ad.charAt(0).toUpperCase()}
              </div>
              <p className="profil-kart__isim">{kullanici.ad} {kullanici.soyad}</p>
              <p className="profil-kart__email">{kullanici.email}</p>
              <span className={`badge ${kullanici.rol === 'admin' ? 'badge-info' : 'badge-secondary'}`}
                    style={{ fontSize: '0.75rem' }}>
                {kullanici.rol === 'admin' ? 'Admin' : 'Öğrenci'}
              </span>
            </div>

            <div className="profil-kart__alt">
              <dl>
                <div className="profil-bilgi__satir">
                  <dt>Aktif Ödünç</dt>
                  <dd>
                    <span className="badge badge-warning">{aktifSayi} kitap</span>
                  </dd>
                </div>
                <div className="profil-bilgi__satir">
                  <dt>İade Edildi</dt>
                  <dd>
                    <span className="badge badge-success">{iadeSayi} kitap</span>
                  </dd>
                </div>
                <div className="profil-bilgi__satir">
                  <dt>Toplam İşlem</dt>
                  <dd><strong>{oduncler.length}</strong></dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>

        {/* SAĞ — Ödünç Tablosu */}
        <section>
          <div className="tablo-kapsayici">
            <table className="tablo">
              <thead>
                <tr>
                  <th>Kitap</th>
                  <th>Alım Tarihi</th>
                  <th>Son İade Tarihi</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {yukleniyor ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem' }}>
                      <Spinner kucuk />
                    </td>
                  </tr>
                ) : oduncler.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="bos-durum">
                        <div className="bos-durum__ikon"><KitapIkon boyut={56} /></div>
                        <p>Henüz ödünç alma kaydınız yok.<br />Ana sayfadan kitap ödünç alabilirsiniz.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  oduncler.map((o) => (
                    <OduncSatiri key={o._id} odunc={o} oduncIade={oduncIade} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profil;
