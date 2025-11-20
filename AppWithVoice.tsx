import React, { useState } from 'react';
import VoiceToImagePanel from './components/VoiceToImagePanel';
import MetricsPanel, { MetricsData } from './components/MetricsPanel';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [metricsData, setMetricsData] = useState<MetricsData>({
    inferenceTime: 0,
    accuracy: 0,
    generationTime: 0,
    confidenceScores: [],
    timestamps: [],
  });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const handleMetricsUpdate = (metrics: any) => {
    setMetricsData({
      inferenceTime: metrics.inferenceTime,
      accuracy: metrics.accuracy,
      generationTime: metrics.generationTime,
      confidenceScores: [85.2, 89.7, 92.3, 88.5, 94.1, 91.8],
      timestamps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6'],
    });
    setImageUrl(metrics.imageUrl);
    setPrompt(metrics.enhancedPrompt);
  };

  const handleLogout = () => {
    signOut();
    window.location.hash = '/signin';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with User Menu */}
        <div className="flex justify-between items-start">
          {/* Title */}
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              ECHOSketch — Voice to Visual
            </h1>
            <p className="text-lg text-gray-400">
              Transform your voice into stunning visuals with AI
            </p>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm">{user?.name || user?.email}</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Voice to Image Panel */}
        <VoiceToImagePanel onMetricsUpdate={handleMetricsUpdate} />

        {/* Metrics Panel - Only show if we have data */}
        {metricsData.inferenceTime > 0 && (
          <div className="pt-8 border-t border-gray-700/50">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Performance Analytics
            </h2>
            <MetricsPanel 
              metrics={metricsData} 
              imageUrl={imageUrl} 
              prompt={prompt} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
