import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      window.location.hash = '/signin';
    }
  }, [token, isLoading]);

  if (isLoading) {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
            <div className="text-white text-lg">Authenticating...</div>
        </div>
    );
  }

  if (!token) {
    // Render nothing while redirecting
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
