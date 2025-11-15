import React, { useState } from 'react';
import MetricsPanel, { MetricsData } from './components/MetricsPanel';

const MetricsPanelDemo: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData>({
    inferenceTime: 2450,
    accuracy: 94.5,
    generationTime: 3200,
    confidenceScores: [85.2, 89.7, 92.3, 88.5, 94.1, 91.8],
    timestamps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6'],
  });

  const [imageUrl, setImageUrl] = useState<string>(
    'https://via.placeholder.com/512x512/1f2937/ffffff?text=Generated+Image'
  );

  const [prompt, setPrompt] = useState<string>(
    'A breathtaking, photorealistic mountain landscape at sunset with vibrant colors'
  );

  const regenerateMetrics = () => {
    setMetrics({
      inferenceTime: Math.random() * 3000 + 1000,
      accuracy: Math.random() * 15 + 85,
      generationTime: Math.random() * 4000 + 2000,
      confidenceScores: Array.from({ length: 6 }, () => Math.random() * 15 + 85),
      timestamps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6'],
    });
  };

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

        {/* Control Panel */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 mb-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Inference Time (ms)</label>
              <input
                type="number"
                value={Math.round(metrics.inferenceTime)}
                onChange={(e) =>
                  setMetrics({ ...metrics, inferenceTime: Number(e.target.value) })
                }
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Accuracy (%)</label>
              <input
                type="number"
                step="0.1"
                value={metrics.accuracy.toFixed(1)}
                onChange={(e) =>
                  setMetrics({ ...metrics, accuracy: Number(e.target.value) })
                }
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Generation Time (ms)</label>
              <input
                type="number"
                value={Math.round(metrics.generationTime)}
                onChange={(e) =>
                  setMetrics({ ...metrics, generationTime: Number(e.target.value) })
                }
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={regenerateMetrics}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Regenerate Random
              </button>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Metrics Panel */}
        <MetricsPanel metrics={metrics} imageUrl={imageUrl} prompt={prompt} />

        {/* Features List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30">
            <div className="text-purple-400 text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time KPIs</h3>
            <p className="text-gray-400 text-sm">
              Monitor inference time, accuracy, and generation performance with icon-based metrics
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30">
            <div className="text-pink-400 text-4xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-white mb-2">Interactive Charts</h3>
            <p className="text-gray-400 text-sm">
              Visualize confidence scores and model behavior with dynamic bar and line charts
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30">
            <div className="text-blue-400 text-4xl mb-3">🖼️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Hero Display</h3>
            <p className="text-gray-400 text-sm">
              Showcase generated images with elegant shadows, gradients, and hover effects
            </p>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-3">🚀 Easy Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-300 font-semibold mb-2">React/TypeScript:</p>
              <code className="block bg-gray-900/50 text-purple-300 p-3 rounded">
                import MetricsPanel from './components/MetricsPanel';
              </code>
            </div>
            <div>
              <p className="text-gray-300 font-semibold mb-2">Standalone HTML:</p>
              <code className="block bg-gray-900/50 text-pink-300 p-3 rounded">
                Open: metrics-panel-standalone.html
              </code>
            </div>
            <div>
              <p className="text-gray-300 font-semibold mb-2">Gradio:</p>
              <code className="block bg-gray-900/50 text-blue-300 p-3 rounded">
                python metrics_panel_gradio.py
              </code>
            </div>
            <div>
              <p className="text-gray-300 font-semibold mb-2">Fully Responsive:</p>
              <code className="block bg-gray-900/50 text-green-300 p-3 rounded">
                Mobile, Tablet, Desktop ✓
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanelDemo;
