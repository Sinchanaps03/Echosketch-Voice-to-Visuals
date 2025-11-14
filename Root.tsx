import React, { useState, useEffect } from 'react';
import App from './App';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

const routes: { [key: string]: React.FC } = {
  '/': () => <ProtectedRoute><App /></ProtectedRoute>,
  '/signin': SignInPage,
  '/signup': SignUpPage,
};

const Root: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const { token, isLoading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  useEffect(() => {
    // Redirect logic after login/logout
    if (!isLoading) {
      const isAuthPage = currentPath === '/signin' || currentPath === '/signup';
      if (token && isAuthPage) {
        window.location.hash = '/';
      }
      if (!token && !isAuthPage) {
        window.location.hash = '/signin';
      }
    }
  }, [token, currentPath, isLoading]);
  
  if (isLoading) {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
            <div className="text-white text-lg">Loading...</div>
        </div>
    );
  }

  const CurrentPage = routes[currentPath] || routes['/signin'];

  return <CurrentPage />;
};

export default Root;
