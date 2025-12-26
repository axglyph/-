
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, QuantumTrends } from "../types";

// 安全获取 API Key 的辅助函数
const getApiKey = () => {
  try {
    // 检查 process 是否定义，防止浏览器端报错
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Could not access process.env.API_KEY:", e);
  }
  return '';
};

export const fetchQuantumTrends = async (): Promise<QuantumTrends> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("检测到 API Key 缺失。请确保在部署环境中配置了 process.env.API_KEY 变量。");
  }

  const ai = new GoogleGenAI({ apiKey });

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
    if (!text) throw new Error("AI 未返回有效内容，请稍后重试。");
    
    return JSON.parse(text) as QuantumTrends;
  } catch (error) {
    console.error("Error fetching quantum trends:", error);
    throw error;
  }
};
