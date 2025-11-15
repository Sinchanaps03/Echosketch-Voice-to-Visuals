"""
Metrics Insights Panel for Gradio Integration
A modular component that displays AI generation metrics with interactive visualizations
"""

import gradio as gr
import json
from typing import List, Dict, Optional

def create_metrics_panel(
    inference_time: float,
    accuracy: float,
    generation_time: float,
    confidence_scores: Optional[List[float]] = None,
    image_url: Optional[str] = None,
    prompt: Optional[str] = None
) -> str:
    """
    Creates an HTML metrics panel with KPIs, charts, and hero image display.
    
    Args:
        inference_time: Inference time in milliseconds
        accuracy: Accuracy percentage (0-100)
        generation_time: Generation time in milliseconds
        confidence_scores: Optional list of confidence values
        image_url: Optional URL of generated image
        prompt: Optional prompt text
    
    Returns:
        HTML string containing the complete metrics panel
    """
    
    # Prepare data
    confidence_scores = confidence_scores or [85.2, 89.7, 92.3, 88.5, 94.1, 91.8]
    timestamps = [f'Step {i+1}' for i in range(len(confidence_scores))]
    
    # Generate KPI cards HTML
    kpis = [
        {
            'icon': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            'label': 'Inference Time',
            'value': f'{inference_time/1000:.2f}s',
            'color': 'text-blue-400',
            'bg_color': 'bg-blue-500/10'
        },
        {
            'icon': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            'label': 'Accuracy',
            'value': f'{accuracy:.1f}%',
            'color': 'text-green-400',
            'bg_color': 'bg-green-500/10'
        },
        {
            'icon': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
            'label': 'Generation Time',
            'value': f'{generation_time/1000:.2f}s',
            'color': 'text-yellow-400',
            'bg_color': 'bg-yellow-500/10'
        }
    ]
    
    kpi_html = ''.join([f'''
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            <div class="flex items-center gap-3">
                <div class="{kpi['bg_color']} {kpi['color']} p-3 rounded-lg">
                    {kpi['icon']}
                </div>
                <div class="flex-1">
                    <p class="text-sm text-gray-400 font-medium">{kpi['label']}</p>
                    <p class="text-2xl font-bold {kpi['color']}">{kpi['value']}</p>
                </div>
            </div>
        </div>
    ''' for kpi in kpis])
    
    # Generate chart bars HTML
    max_score = max(confidence_scores)
    chart_bars_html = ''.join([f'''
        <div class="space-y-1">
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">{timestamps[i]}</span>
                <span class="text-gray-300 font-semibold">{score:.2f}%</span>
            </div>
            <div class="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style="width: {(score/max_score)*100}%"></div>
            </div>
        </div>
    ''' for i, score in enumerate(confidence_scores)])
    
    # Generate line chart SVG
    normalized_scores = [(s/max_score)*100 for s in confidence_scores]
    points = ' '.join([f'{(i/(len(normalized_scores)-1))*400},{100-score}' for i, score in enumerate(normalized_scores)])
    area_points = f'0,100 {points} 400,100'
    circles = ''.join([f'<circle cx="{(i/(len(normalized_scores)-1))*400}" cy="{100-score}" r="3" fill="#a855f7"/>' for i, score in enumerate(normalized_scores)])
    
    # Hero image section
    hero_image_html = ''
    if image_url:
        hero_image_html = f'''
            <div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl mt-6">
                <h3 class="text-xl font-semibold text-gray-200 mb-4">Generated Output</h3>
                <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div class="relative bg-gray-900/50 rounded-xl overflow-hidden shadow-xl">
                        <img src="{image_url}" alt="Generated output" class="w-full h-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-105">
                    </div>
                </div>
                {f'<div class="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"><p class="text-sm text-gray-400 mb-1 font-medium">Prompt:</p><p class="text-gray-200 text-sm leading-relaxed">{prompt}</p></div>' if prompt else ''}
            </div>
        '''
    
    # Complete HTML
    html = f'''
    <div class="w-full space-y-6 p-4" style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border-radius: 1rem;">
        <style>
            @keyframes fadeIn {{
                from {{ opacity: 0; transform: translateY(10px); }}
                to {{ opacity: 1; transform: translateY(0); }}
            }}
            .fade-in {{ animation: fadeIn 0.5s ease-out; }}
        </style>
        
        <!-- KPI Bar -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kpi_html}
        </div>
        
        <!-- Confidence Chart -->
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-200 mb-4">Confidence Score Analysis</h3>
            <div class="space-y-3">
                {chart_bars_html}
            </div>
            <div class="mt-6 h-32 relative">
                <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#a855f7" />
                            <stop offset="100%" style="stop-color:#ec4899" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#a855f7" />
                            <stop offset="100%" style="stop-color:#1f2937" />
                        </linearGradient>
                    </defs>
                    <line x1="0" y1="0" x2="400" y2="0" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                    <line x1="0" y1="25" x2="400" y2="25" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                    <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                    <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                    <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                    <polygon points="{area_points}" fill="url(#areaGradient)" opacity="0.3"/>
                    <polyline points="{points}" fill="none" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    {circles}
                </svg>
            </div>
        </div>
        
        <!-- Hero Image -->
        {hero_image_html}
    </div>
    '''
    
    return html


def create_gradio_interface():
    """
    Creates a Gradio interface with the metrics panel.
    """
    
    def generate_metrics_demo(inference_time, accuracy, generation_time, prompt):
        """Demo function that generates sample metrics"""
        confidence_scores = [85.2, 89.7, 92.3, 88.5, 94.1, 91.8]
        image_url = "https://via.placeholder.com/512x512/1f2937/ffffff?text=Generated+Image"
        
        return create_metrics_panel(
            inference_time=inference_time,
            accuracy=accuracy,
            generation_time=generation_time,
            confidence_scores=confidence_scores,
            image_url=image_url,
            prompt=prompt
        )
    
    # Create interface
    with gr.Blocks(theme=gr.themes.Soft()) as demo:
        gr.Markdown("# 🎯 AI Metrics Insights Panel")
        gr.Markdown("Interactive visualization of AI generation metrics and performance")
        
        with gr.Row():
            with gr.Column(scale=1):
                inference_time = gr.Slider(
                    minimum=500, maximum=5000, value=2450, step=50,
                    label="Inference Time (ms)"
                )
                accuracy = gr.Slider(
                    minimum=0, maximum=100, value=94.5, step=0.1,
                    label="Accuracy (%)"
                )
                generation_time = gr.Slider(
                    minimum=1000, maximum=10000, value=3200, step=100,
                    label="Generation Time (ms)"
                )
                prompt = gr.Textbox(
                    value="A breathtaking mountain landscape at sunset",
                    label="Prompt",
                    lines=3
                )
                generate_btn = gr.Button("Update Metrics", variant="primary")
        
        with gr.Row():
            output = gr.HTML()
        
        generate_btn.click(
            fn=generate_metrics_demo,
            inputs=[inference_time, accuracy, generation_time, prompt],
            outputs=output
        )
        
        # Load initial demo
        demo.load(
            fn=generate_metrics_demo,
            inputs=[inference_time, accuracy, generation_time, prompt],
            outputs=output
        )
    
    return demo


if __name__ == "__main__":
    # Launch Gradio interface
    demo = create_gradio_interface()
    demo.launch()
