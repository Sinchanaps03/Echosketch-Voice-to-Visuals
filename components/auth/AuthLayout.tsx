import React from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950/30 to-gray-900 p-12 border-r border-purple-900/30">
        <div className="text-center">
            <SparklesIcon className="w-24 h-24 text-purple-400 mx-auto mb-6 animate-pulse"/>
            <h1 className="text-5xl font-bold tracking-tight text-white bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">ECHOSKETCH</h1>
            <p className="text-xl text-gray-300 mt-4">Where your voice becomes a visual masterpiece.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-gray-900 via-purple-950/20 to-gray-900">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
