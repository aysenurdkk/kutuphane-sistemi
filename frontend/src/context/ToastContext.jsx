import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toastlar, setToastlar] = useState([]);

  const toastEkle = useCallback((mesaj, tip = 'info', sure = 3500) => {
    const id = Date.now() + Math.random();
    setToastlar((prev) => [...prev, { id, mesaj, tip }]);
    setTimeout(() => {
      setToastlar((prev) => prev.filter((t) => t.id !== id));
    }, sure);
  }, []);

  const toastKaldir = useCallback((id) => {
    setToastlar((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toastEkle }}>
      {children}
      <div className="toast-container">
        {toastlar.map((t) => (
          <Toast key={t.id} mesaj={t.mesaj} tip={t.tip} kapat={() => toastKaldir(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast, ToastProvider içinde kullanılmalı');
  return ctx;
};
