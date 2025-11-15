import React, { useState } from 'react';
import VoiceToImagePanel from './components/VoiceToImagePanel';
import MetricsPanel, { MetricsData } from './components/MetricsPanel';

const App: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            ECHOSketch — Voice to Visual
          </h1>
          <p className="text-lg text-gray-400">
            Transform your voice into stunning visuals with AI
          </p>
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
