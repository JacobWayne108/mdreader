import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize API
const getAiClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const enhanceText = async (text: string, type: 'summarize' | 'grammar' | 'continue'): Promise<string> => {
  const ai = getAiClient();
  if (!ai) throw new Error("API Key missing");

  let prompt = "";
  if (type === 'summarize') prompt = `Summarize the following markdown content concisely:\n\n${text}`;
  if (type === 'grammar') prompt = `Fix the grammar and spelling in the following markdown text, but keep the format:\n\n${text}`;
  if (type === 'continue') prompt = `Continue writing this markdown text creatively:\n\n${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};