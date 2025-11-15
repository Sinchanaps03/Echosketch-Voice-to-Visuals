
import { GoogleGenAI, Modality } from "@google/genai";
import { LoadingState } from '../types';

// IMPORTANT: Do NOT expose your API key in client-side code.
// This is for demonstration purposes only. In a production environment,
// this key should be managed on a secure backend server.
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. App will run in placeholder mode.");
} else {
  console.log("API Key loaded successfully!");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const enhancePrompt = async (transcript: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve(`A creative interpretation of: "${transcript}"`);
  }
  try {
    // System-level instruction for strict semantic alignment
    const systemInstruction = `You are an expert prompt engineer for AI image generation. 
Your task is to enhance the user's prompt while maintaining STRICT SEMANTIC ALIGNMENT.

CRITICAL RULES:
1. If the user says "tree", generate ONLY a tree - no mountains, no landscapes, no extra objects
2. Keep the primary subject EXACTLY as the user specified
3. Add only complementary details that support the main subject
4. Do not add unrelated objects or change the subject
5. Focus on photorealistic quality, lighting, and artistic style

User's original prompt (MUST be the primary focus): "${transcript}"

Generate an enhanced prompt that strictly describes this subject with professional photography details.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Latest Gemini 2.0 Flash model
      contents: systemInstruction,
    });
    
    const enhancedPrompt = response.text.trim();
    console.log("🎨 Enhanced Prompt:", enhancedPrompt);
    return enhancedPrompt;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    // Fallback: Use the original transcript with minimal enhancement
    return `A detailed, high-quality image of ${transcript}, photorealistic, professional photography, cinematic lighting`;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve(generatePlaceholderSVG(prompt));
  }
  try {
    // Use Pollinations AI for image generation
    const cleanPrompt = prompt.replace(/[^a-zA-Z0-9 ,-]/g, '').trim();
    const encodedPrompt = encodeURIComponent(cleanPrompt);
    const seed = Math.floor(Math.random() * 100000);
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&nologo=true`;
    
    // Fetch the image and convert to data URL to avoid CORS issues
    try {
      const response = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          'Accept': 'image/*',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        return dataUrl;
      } else {
        console.warn("Image fetch failed, using direct URL");
        return imageUrl;
      }
    } catch (fetchError) {
      console.warn("Failed to convert to data URL, using direct URL:", fetchError);
      return imageUrl;
    }

  } catch (error) {
    console.error("Error generating image:", error);
    return generatePlaceholderSVG(prompt);
  }
};


const generatePlaceholderSVG = (prompt: string): string => {
  const bgColor = "#1F2937"; // bg-gray-800
  const textColor = "#F3F4F6"; // text-gray-100
  const accentColor = "#3B82F6"; // bg-blue-500

  const words = prompt.split(' ').slice(0, 10).join(' ');

  const svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="${bgColor}" />
      <rect x="20" y="20" width="472" height="472" fill="none" stroke="${accentColor}" stroke-width="4" rx="15" />
      <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="${textColor}" font-weight="bold">
        ECHOSKETCH
      </text>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="${textColor}">
        <tspan x="50%" dy="1.2em">(Placeholder Image)</tspan>
        <tspan x="50%" dy="1.5em">${words}...</tspan>
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
