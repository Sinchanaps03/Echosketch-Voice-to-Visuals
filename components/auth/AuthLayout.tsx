import React from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 text-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-900/80 via-pink-900/60 to-purple-900/80 p-12 border-r border-pink-500/20">
        <div className="text-center">
            <SparklesIcon className="w-24 h-24 text-pink-300 mx-auto mb-6 animate-pulse"/>
            <h1 className="text-5xl font-bold tracking-tight text-white bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">ECHOSKETCH</h1>
            <p className="text-xl text-pink-200 mt-4">Where your voice becomes a visual masterpiece.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-purple-800/50 via-pink-700/50 to-purple-800/50">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
