
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, QuantumTrends } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchQuantumTrends = async (): Promise<QuantumTrends> => {
  const prompt = `
    Find the top 5 most trending/popular news or articles about Quantum Technology in Chinese and the top 5 in English.
    Focus on recent breakthroughs, industry investments, or major government policies (from late 2024 to 2025).
    For each item, provide:
    1. Title
    2. A concise 2-sentence summary.
    3. The Source name.
    4. The full URL.

    Return the data in a strict JSON format matching this structure:
    {
      "chinese": [{"title": "...", "summary": "...", "source": "...", "url": "..."}],
      "english": [{"title": "...", "summary": "...", "source": "...", "url": "..."}]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chinese: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  source: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["title", "summary", "source", "url"]
              }
            },
            english: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  source: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["title", "summary", "source", "url"]
              }
            }
          },
          required: ["chinese", "english"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as QuantumTrends;
  } catch (error) {
    console.error("Error fetching quantum trends:", error);
    throw error;
  }
};
