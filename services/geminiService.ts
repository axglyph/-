
import { GoogleGenAI, Type } from "@google/genai";
import { QuantumTrends } from "../types";

export const fetchQuantumTrends = async (): Promise<QuantumTrends> => {
  // Use API key directly from process.env.API_KEY as per guidelines
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_MISSING");
  }

  // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  // Create instance right before use to ensure latest key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      // Simplified contents structure as per SDK guidelines
      contents: prompt,
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
    if (!text) throw new Error("EMPTY_RESPONSE");
    
    // MUST ALWAYS extract the URLs from groundingChunks and list them on the web app.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls = groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter((uri: any) => !!uri) || [];

    const data = JSON.parse(text) as QuantumTrends;
    // Store unique grounding URLs for UI display
    data.groundingUrls = Array.from(new Set(groundingUrls));
    
    return data;
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("ENTITY_NOT_FOUND");
    }
    throw error;
  }
};
