import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const kayitli = localStorage.getItem('kullanici');
    if (kayitli) {
      try {
        setKullanici(JSON.parse(kayitli));
      } catch {
        localStorage.removeItem('kullanici');
      }
    }
    setYukleniyor(false);
  }, []);

  const girisYap = (kullaniciVerisi) => {
    setKullanici(kullaniciVerisi);
    localStorage.setItem('kullanici', JSON.stringify(kullaniciVerisi));
  };

  const cikisYap = () => {
    setKullanici(null);
    localStorage.removeItem('kullanici');
  };

  return (
    <AuthContext.Provider value={{ kullanici, yukleniyor, girisYap, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth, AuthProvider içinde kullanılmalı');
  return ctx;
};
