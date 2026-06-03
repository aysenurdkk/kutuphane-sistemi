import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, adminGerekli = false }) => {
  const { kullanici, yukleniyor } = useAuth();

  if (yukleniyor) return <Spinner />;
  if (!kullanici) return <Navigate to="/giris" replace />;
  if (adminGerekli && kullanici.rol !== 'admin') return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
