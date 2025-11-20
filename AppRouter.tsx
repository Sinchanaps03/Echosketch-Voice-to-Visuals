import React, { useState, useEffect, useContext } from 'react';
import AppWithVoice from './AppWithVoice';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { AuthContext } from './contexts/AuthContext';

/**
 * Main App Router - Handles routing between Sign In, Sign Up, and Image Generation pages
 * Uses hash-based routing (#/signin, #/signup, /)
 */
const AppRouter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('AppRouter must be used within AuthProvider');
  }
  
  const { user, isLoading } = authContext;
  const isAuth = !!user;

  // Listen to hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash.slice(1) || '/';
      setCurrentPath(newPath);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirect logic
  useEffect(() => {
    if (isLoading) return; // Don't redirect while checking auth status
    
    const authPages = ['/signin', '/signup'];
    const isAuthPage = authPages.includes(currentPath);

    if (!isAuth && !isAuthPage) {
      // Not authenticated and trying to access protected route - redirect to signin
      window.location.hash = '/signin';
    } else if (isAuth && isAuthPage) {
      // Already authenticated and on auth page - redirect to home
      window.location.hash = '/';
    }
  }, [isAuth, currentPath, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Route rendering
  if (currentPath === '/signin') {
    return <SignInPage />;
  }

  if (currentPath === '/signup') {
    return <SignUpPage />;
  }

  // For all other routes (including '/'), render the Image Generation page
  // Only if authenticated
  if (isAuth) {
    return <AppWithVoice />;
  }

  // Fallback - should not reach here due to redirect logic
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-white text-lg">Redirecting...</div>
    </div>
  );
};

export default AppRouter;
