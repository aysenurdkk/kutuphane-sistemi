import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KitapIkon } from './Ikonlar';

const Navbar = () => {
  const [menuAcik, setMenuAcik] = useState(false);
  const { kullanici, cikisYap } = useAuth();
  const navigate = useNavigate();

  const menuKapat = () => setMenuAcik(false);

  const handleCikis = () => {
    cikisYap();
    menuKapat();
    navigate('/giris');
  };

  const linkClass = ({ isActive }) => `navbar__link${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand" onClick={menuKapat}>
            <KitapIkon boyut={20} renk="#000000" />
            Kütüphane Sistemi
          </Link>

          <div className={`navbar__nav${menuAcik ? ' acik' : ''}`}>
            <div className="navbar__links">
              <NavLink to="/" className={linkClass} end onClick={menuKapat}>
                Ana Sayfa
              </NavLink>
              {kullanici?.rol === 'admin' && (
                <NavLink to="/admin" className={linkClass} onClick={menuKapat}>
                  Admin Panel
                </NavLink>
              )}
            </div>

            <div className="navbar__auth">
              {kullanici ? (
                <>
                  {kullanici.rol !== 'admin' && (
                    <NavLink to="/profil" className={linkClass} onClick={menuKapat}>
                      {kullanici.ad} {kullanici.soyad}
                    </NavLink>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={handleCikis}>
                    Çıkış
                  </button>
                </>
              ) : (
                <>
                  <Link to="/giris" className="btn btn-ghost btn-sm" onClick={menuKapat}>
                    Giriş Yap
                  </Link>
                  <Link to="/kayit" className="btn btn-primary btn-sm" onClick={menuKapat}>
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            className="navbar__menu-btn"
            onClick={() => setMenuAcik((p) => !p)}
            aria-label="Menü"
          >
            {menuAcik ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
