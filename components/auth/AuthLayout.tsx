import React from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950/50 p-12 border-r border-gray-800">
        <div className="text-center">
            <SparklesIcon className="w-24 h-24 text-purple-400 mx-auto mb-6"/>
            <h1 className="text-5xl font-bold tracking-tight text-white">ECHOSKETCH</h1>
            <p className="text-xl text-gray-400 mt-4">Where your voice becomes a visual masterpiece.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
