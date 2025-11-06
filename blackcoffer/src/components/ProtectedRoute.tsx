import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: any }) => {
  const { token, user } = useAuth();
  // Authenticated if either token (localStorage) or user (cookie session) is present
  if (!token && !user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
