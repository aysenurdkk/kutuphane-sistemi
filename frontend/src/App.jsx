import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AnaSayfa from './pages/AnaSayfa';
import Giris from './pages/Giris';
import Kayit from './pages/Kayit';
import Profil from './pages/Profil';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AnaSayfa />
                  </ProtectedRoute>
                }
              />
              <Route path="/giris" element={<Giris />} />
              <Route path="/kayit" element={<Kayit />} />
              <Route
                path="/profil"
                element={
                  <ProtectedRoute>
                    <Profil />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminGerekli>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
