
import { GoogleGenAI, Modality } from "@google/genai";
import { LoadingState } from '../types';

// IMPORTANT: Do NOT expose your API key in client-side code.
// This is for demonstration purposes only. In a production environment,
// this key should be managed on a secure backend server.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. App will run in placeholder mode.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const enhancePrompt = async (transcript: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve(`A creative interpretation of: "${transcript}"`);
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert prompt engineer for an AI image generator. Your task is to expand a user's voice transcript into a detailed, visually rich prompt. Extract key objects, describe the scene, style, colors, and actions. Output only the final, concise paragraph for the image model. User said: "${transcript}"`,
    });
    // Fix: Access the text directly from the response object.
    return response.text.trim();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw new Error("Failed to enhance prompt with Gemini.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
     // Fallback to a simple SVG placeholder if no API key is available.
    return Promise.resolve(generatePlaceholderSVG(prompt));
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image data found in Gemini response.");

  } catch (error) {
    console.error("Error generating image:", error);
    // You can implement other fallbacks here, e.g., calling a Stable Diffusion API.
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
