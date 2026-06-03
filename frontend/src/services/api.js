import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Her istekte token'ı Authorization header'ına ekle
api.interceptors.request.use((config) => {
  const kayitli = localStorage.getItem('kullanici');
  if (kayitli) {
    const { token } = JSON.parse(kayitli);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 gelirse localStorage temizle ve login'e yönlendir
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kullanici');
      window.location.href = '/giris';
    }
    return Promise.reject(error);
  }
);

export default api;
