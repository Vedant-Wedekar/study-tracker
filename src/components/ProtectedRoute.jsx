import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useAuth();

  if (initializing) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
