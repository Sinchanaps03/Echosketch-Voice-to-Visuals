import React from 'react';
import { StopwatchIcon, CheckCircleIcon, ZapIcon } from './Icons';

export interface MetricsData {
  inferenceTime: number; // in milliseconds
  accuracy: number; // 0-100
  generationTime: number; // in milliseconds
  confidenceScores?: number[]; // Array of confidence values
  timestamps?: string[]; // Labels for the chart
}

interface MetricsPanelProps {
  metrics: MetricsData;
  imageUrl?: string;
  prompt?: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, imageUrl, prompt }) => {
  return (
    <div className="w-full space-y-6">
      {/* KPI Bar */}
      <KPIBar metrics={metrics} />
      
      {/* Confidence Chart */}
      {metrics.confidenceScores && metrics.confidenceScores.length > 0 && (
        <ConfidenceChart 
          scores={metrics.confidenceScores} 
          labels={metrics.timestamps} 
        />
      )}
      
      {/* Hero Image Card */}
      {imageUrl && (
        <HeroImageCard 
          imageUrl={imageUrl} 
          prompt={prompt} 
        />
      )}
    </div>
  );
};

// KPI Bar Component
const KPIBar: React.FC<{ metrics: MetricsData }> = ({ metrics }) => {
  const kpis = [
    {
      icon: <StopwatchIcon className="w-6 h-6" />,
      label: 'Inference Time',
      value: `${(metrics.inferenceTime / 1000).toFixed(2)}s`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: <CheckCircleIcon className="w-6 h-6" />,
      label: 'Accuracy',
      value: `${metrics.accuracy.toFixed(1)}%`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: <ZapIcon className="w-6 h-6" />,
      label: 'Generation Time',
      value: `${(metrics.generationTime / 1000).toFixed(2)}s`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};

// Individual KPI Card
interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ icon, label, value, color, bgColor }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className={`${bgColor} ${color} p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400 font-medium">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

// Confidence Chart Component
interface ConfidenceChartProps {
  scores: number[];
  labels?: string[];
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ scores, labels }) => {
  const maxScore = Math.max(...scores);
  const normalizedScores = scores.map(score => (score / maxScore) * 100);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">
        Confidence Score Analysis
      </h3>
      
      {/* Bar Chart */}
      <div className="space-y-3">
        {normalizedScores.map((score, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">
                {labels?.[index] || `Step ${index + 1}`}
              </span>
              <span className="text-gray-300 font-semibold">
                {scores[index].toFixed(2)}%
              </span>
            </div>
            <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Line Chart Visualization */}
      <div className="mt-6 h-32 relative">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="400"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Line path */}
          <polyline
            points={normalizedScores
              .map((score, i) => {
                const x = (i / (normalizedScores.length - 1)) * 400;
                const y = 100 - score;
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Area fill */}
          <polygon
            points={`0,100 ${normalizedScores
              .map((score, i) => {
                const x = (i / (normalizedScores.length - 1)) * 400;
                const y = 100 - score;
                return `${x},${y}`;
              })
              .join(' ')} 400,100`}
            fill="url(#areaGradient)"
            opacity="0.3"
          />
          
          {/* Data points */}
          {normalizedScores.map((score, i) => {
            const x = (i / (normalizedScores.length - 1)) * 400;
            const y = 100 - score;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#a855f7"
                className="hover:r-5 transition-all"
              />
            );
          })}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

// Hero Image Card Component
interface HeroImageCardProps {
  imageUrl: string;
  prompt?: string;
}

const HeroImageCard: React.FC<HeroImageCardProps> = ({ imageUrl, prompt }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-200 mb-4">
        Generated Output
      </h3>
      
      {/* Image Container with Hero Styling */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
        
        <div className="relative bg-gray-900/50 rounded-xl overflow-hidden shadow-xl">
          <img
            src={imageUrl}
            alt={prompt || 'Generated output'}
            className="w-full h-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent rounded-xl pointer-events-none" />
      </div>
      
      {/* Prompt Display */}
      {prompt && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <p className="text-sm text-gray-400 mb-1 font-medium">Prompt:</p>
          <p className="text-gray-200 text-sm leading-relaxed">{prompt}</p>
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;
