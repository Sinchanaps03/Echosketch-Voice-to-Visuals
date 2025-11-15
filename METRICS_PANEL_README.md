# 📊 Metrics Insights Panel

A comprehensive, modular metrics visualization component for AI generation applications with support for React/TypeScript, standalone HTML, and Gradio integration.

## ✨ Features

### 🎯 KPI Dashboard
- **Inference Time** - Stopwatch icon with millisecond precision
- **Accuracy Score** - Check-circle icon with percentage display
- **Generation Time** - Lightning bolt icon for speed metrics
- Modern card-based layout with hover effects and color-coded indicators

### 📈 Interactive Charts
- **Bar Chart** - Horizontal confidence score visualization with gradient fills
- **Line Chart** - SVG-based trend analysis with smooth animations
- **Data Points** - Interactive markers showing detailed metrics
- Real-time updates with smooth transitions

### 🖼️ Hero Image Display
- **Elegant Card Design** - Soft shadows and rounded corners
- **Gradient Overlays** - Dynamic purple-to-pink gradients
- **Hover Effects** - Scale and blur animations
- **Prompt Display** - Context-aware text showing generation details

### 🎨 Modern UI Patterns
- Fully responsive (mobile, tablet, desktop)
- Dark theme with glassmorphism effects
- Smooth animations and transitions
- Accessible color contrast
- Clean, maintainable code structure

## 🚀 Quick Start

### React/TypeScript Integration

```tsx
import MetricsPanel, { MetricsData } from './components/MetricsPanel';

const metrics: MetricsData = {
  inferenceTime: 2450,      // milliseconds
  accuracy: 94.5,           // percentage
  generationTime: 3200,     // milliseconds
  confidenceScores: [85.2, 89.7, 92.3, 88.5, 94.1, 91.8],
  timestamps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6']
};

function App() {
  return (
    <MetricsPanel 
      metrics={metrics}
      imageUrl="https://example.com/image.png"
      prompt="A mountain landscape at sunset"
    />
  );
}
```

### Standalone HTML

Open `metrics-panel-standalone.html` in a browser:

```javascript
// Update metrics dynamically
window.updateMetrics({
  inferenceTime: 2450,
  accuracy: 94.5,
  generationTime: 3200,
  confidenceScores: [85.2, 89.7, 92.3, 88.5, 94.1, 91.8],
  timestamps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6'],
  imageUrl: 'https://example.com/image.png',
  prompt: 'Your prompt here'
});
```

### Gradio Integration

```bash
pip install gradio
python metrics_panel_gradio.py
```

Or integrate into your existing Gradio app:

```python
from metrics_panel_gradio import create_metrics_panel

# In your Gradio function
def generate_with_metrics(prompt):
    # Your generation logic
    result = your_model.generate(prompt)
    
    # Create metrics panel
    metrics_html = create_metrics_panel(
        inference_time=result.inference_time,
        accuracy=result.accuracy,
        generation_time=result.generation_time,
        confidence_scores=result.confidence_scores,
        image_url=result.image_url,
        prompt=prompt
    )
    
    return metrics_html
```

## 📁 File Structure

```
├── components/
│   ├── MetricsPanel.tsx          # Main React component
│   └── icons/
│       ├── StopwatchIcon.tsx     # Inference time icon
│       ├── CheckCircleIcon.tsx   # Accuracy icon
│       └── ZapIcon.tsx           # Generation time icon
├── metrics-panel-standalone.html  # Standalone HTML version
├── metrics_panel_gradio.py       # Gradio integration
├── MetricsPanelDemo.tsx          # Interactive demo
└── METRICS_PANEL_README.md       # This file
```

## 🎨 Customization

### Colors

The panel uses Tailwind CSS with customizable color schemes:

```tsx
// KPI card colors
const kpis = [
  { color: 'text-blue-400', bgColor: 'bg-blue-500/10' },   // Inference
  { color: 'text-green-400', bgColor: 'bg-green-500/10' }, // Accuracy
  { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' } // Generation
];
```

### Chart Gradients

```tsx
// Update gradient colors in the SVG
<linearGradient id="gradient">
  <stop offset="0%" stopColor="#a855f7" />  // Purple
  <stop offset="100%" stopColor="#ec4899" /> // Pink
</linearGradient>
```

## 🔧 API Reference

### MetricsData Interface

```typescript
interface MetricsData {
  inferenceTime: number;      // Required: Inference time in ms
  accuracy: number;           // Required: Accuracy 0-100
  generationTime: number;     // Required: Generation time in ms
  confidenceScores?: number[]; // Optional: Array of confidence values
  timestamps?: string[];      // Optional: Labels for chart
}
```

### MetricsPanel Props

```typescript
interface MetricsPanelProps {
  metrics: MetricsData;       // Required: Metrics data
  imageUrl?: string;          // Optional: Generated image URL
  prompt?: string;            // Optional: Generation prompt
}
```

## 💡 Usage Examples

### Real-time Updates

```tsx
const [metrics, setMetrics] = useState<MetricsData>({
  inferenceTime: 0,
  accuracy: 0,
  generationTime: 0,
  confidenceScores: []
});

// Update during generation
const handleGeneration = async () => {
  const startTime = Date.now();
  
  // Update inference metrics
  const result = await model.infer(prompt);
  setMetrics(prev => ({
    ...prev,
    inferenceTime: Date.now() - startTime
  }));
  
  // Update generation metrics
  const image = await model.generate(result);
  setMetrics(prev => ({
    ...prev,
    generationTime: Date.now() - startTime,
    accuracy: result.confidence * 100,
    confidenceScores: result.stepConfidences
  }));
};
```

### Custom Confidence Scores

```tsx
// Token-level probabilities
const tokenScores = model.getTokenProbabilities();
const confidenceScores = tokenScores.map(t => t.probability * 100);

// Embedding distances
const embeddings = model.getEmbeddings();
const distances = embeddings.map(e => 100 - e.distance * 10);

<MetricsPanel 
  metrics={{
    ...baseMetrics,
    confidenceScores: distances,
    timestamps: embeddings.map((_, i) => `Layer ${i+1}`)
  }}
/>
```

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Fully responsive

## 📝 License

MIT License - Free to use in your projects

## 🤝 Contributing

This component is designed to be easily extended by GitHub Copilot. The code is:
- Well-documented with TypeScript types
- Modular with clear component boundaries
- Uses modern React patterns (hooks, functional components)
- Follows accessibility best practices

## 🎯 Future Enhancements

Potential features Copilot can add:
- [ ] Export metrics as CSV/JSON
- [ ] Historical metrics comparison
- [ ] Animated transitions between states
- [ ] WebSocket support for real-time updates
- [ ] Custom themes
- [ ] More chart types (radar, scatter, heatmap)
- [ ] Metrics filtering and search
- [ ] Performance benchmarking

## 📞 Support

For issues or questions, refer to the main project README or create an issue in the repository.

---

**Built with ❤️ for the AI community**
