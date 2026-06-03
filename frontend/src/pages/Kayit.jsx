import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { GozAcik, GozKapali, KitapIkon } from '../components/Ikonlar';

const Kayit = () => {
  const { kullanici, girisYap } = useAuth();
  const { toastEkle } = useToast();
  const navigate = useNavigate();

  const [form, setForm]           = useState({ ad: '', soyad: '', email: '', sifre: '', sifreTekrar: '' });
  const [hatalar, setHatalar]     = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sifreGorulur, setSifreGorulur] = useState(false);

  if (kullanici) return <Navigate to="/" replace />;

  const degistir = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (hatalar[name]) setHatalar((p) => ({ ...p, [name]: '' }));
  };

  const dogrula = () => {
    const yeni = {};
    if (!form.ad.trim()) yeni.ad = 'Ad zorunludur';
    if (!form.soyad.trim()) yeni.soyad = 'Soyad zorunludur';
    if (!form.email) yeni.email = 'Email zorunludur';
    else if (!/\S+@\S+\.\S+/.test(form.email)) yeni.email = 'Geçerli bir email girin';
    if (!form.sifre) yeni.sifre = 'Şifre zorunludur';
    else if (form.sifre.length < 6) yeni.sifre = 'Şifre en az 6 karakter olmalı';
    if (form.sifre !== form.sifreTekrar) yeni.sifreTekrar = 'Şifreler eşleşmiyor';
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dogrula()) return;
    try {
      setYukleniyor(true);
      const { ad, soyad, email, sifre } = form;
      const { data } = await api.post('/kullanicilar/kayit', { ad, soyad, email, sifre });
      girisYap(data.veri);
      toastEkle('Kayıt başarılı! Hoş geldiniz.', 'success');
      navigate('/');
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'Kayıt başarısız', 'error');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon"><KitapIkon boyut={32} renk="#000000" /></div>
          <h2>Kayıt Ol</h2>
          <p>Yeni hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ad *</label>
              <input
                name="ad"
                className="form-input"
                value={form.ad}
                onChange={degistir}
                placeholder="Adınız"
              />
              {hatalar.ad && <p className="form-error">{hatalar.ad}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Soyad *</label>
              <input
                name="soyad"
                className="form-input"
                value={form.soyad}
                onChange={degistir}
                placeholder="Soyadınız"
              />
              {hatalar.soyad && <p className="form-error">{hatalar.soyad}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              name="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={degistir}
              placeholder="ornek@email.com"
              autoComplete="email"
            />
            {hatalar.email && <p className="form-error">{hatalar.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Şifre *</label>
            <div className="sifre-alani">
              <input
                name="sifre"
                type={sifreGorulur ? 'text' : 'password'}
                className="form-input"
                value={form.sifre}
                onChange={degistir}
                placeholder="En az 6 karakter"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="sifre-goster-btn"
                onClick={() => setSifreGorulur((g) => !g)}
                tabIndex={-1}
              >
                {sifreGorulur ? <GozKapali /> : <GozAcik />}
              </button>
            </div>
            {hatalar.sifre && <p className="form-error">{hatalar.sifre}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Şifre Tekrar *</label>
            <div className="sifre-alani">
              <input
                name="sifreTekrar"
                type={sifreGorulur ? 'text' : 'password'}
                className="form-input"
                value={form.sifreTekrar}
                onChange={degistir}
                placeholder="Şifreyi tekrar girin"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="sifre-goster-btn"
                onClick={() => setSifreGorulur((g) => !g)}
                tabIndex={-1}
              >
                {sifreGorulur ? <GozKapali /> : <GozAcik />}
              </button>
            </div>
            {hatalar.sifreTekrar && <p className="form-error">{hatalar.sifreTekrar}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={yukleniyor}>
            {yukleniyor ? <Spinner kucuk satir /> : 'Kayıt Ol'}
          </button>
        </form>

        <p className="auth-footer">
          Zaten hesabınız var mı? <Link to="/giris">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

export default Kayit;
