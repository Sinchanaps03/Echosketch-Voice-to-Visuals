import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm z-10 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">ECHOSKETCH</h1>
          <p className="text-sm text-gray-400">Transform your voice into visuals with AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;