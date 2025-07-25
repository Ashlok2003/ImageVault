import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '@/contexts/AuthContext';
import { RiseLoader } from 'react-spinners';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <RiseLoader />
    </div>;
  }

  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
