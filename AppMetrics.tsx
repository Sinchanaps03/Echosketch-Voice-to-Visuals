import React, { useState } from 'react';
import MetricsPanel, { MetricsData } from './components/MetricsPanel';

const App: React.FC = () => {
  const [metrics] = useState<MetricsData>({
    inferenceTime: 2450,
    accuracy: 94.5,
    generationTime: 3200,
    confidenceScores: [85.2, 89.7, 92.3, 88.5, 94.1, 91.8],
    timestamps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6'],
  });

  const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop';
  const prompt = 'A breathtaking, photorealistic mountain landscape at sunset with vibrant colors, snow-capped peaks, and a crystal-clear river reflecting the golden hour light';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Metrics Insights Panel
          </h1>
          <p className="text-xl text-gray-400">
            AI Generation Performance Analytics & Visualization
          </p>
        </div>

        {/* Metrics Panel */}
        <MetricsPanel metrics={metrics} imageUrl={imageUrl} prompt={prompt} />
      </div>
    </div>
  );
};

export default App;
