import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { GozAcik, GozKapali, KitapIkon } from '../components/Ikonlar';

const Giris = () => {
  const { kullanici, girisYap } = useAuth();
  const navigate = useNavigate();
  const { toastEkle } = useToast();

  const [form, setForm]           = useState({ email: '', sifre: '' });
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
    if (!form.email) yeni.email = 'Email zorunludur';
    else if (!/\S+@\S+\.\S+/.test(form.email)) yeni.email = 'Geçerli bir email girin';
    if (!form.sifre) yeni.sifre = 'Şifre zorunludur';
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dogrula()) return;
    try {
      setYukleniyor(true);
      const { data } = await api.post('/kullanicilar/giris', form);
      girisYap(data.veri);
      navigate('/');
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'Giriş başarısız', 'error');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon"><KitapIkon boyut={32} renk="#000000" /></div>
          <h2>Giriş Yap</h2>
          <p>Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
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
            <label className="form-label">Şifre</label>
            <div className="sifre-alani">
              <input
                name="sifre"
                type={sifreGorulur ? 'text' : 'password'}
                className="form-input"
                value={form.sifre}
                onChange={degistir}
                placeholder="••••••"
                autoComplete="current-password"
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

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={yukleniyor}>
            {yukleniyor ? <Spinner kucuk satir /> : 'Giriş Yap'}
          </button>
        </form>

        <p className="auth-footer">
          Hesabınız yok mu? <Link to="/kayit">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Giris;
