import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DreamAnalysisResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: "对梦境的心理学分析，解释梦境背后的含义、潜意识的投射等。",
    },
    stressLevel: {
      type: Type.INTEGER,
      description: "基于梦境内容推测的心理压力等级（1-10）。",
    },
    advice: {
      type: Type.STRING,
      description: "基于梦境分析给出的今日建议或注意事项。",
    },
  },
  required: ["analysis", "stressLevel", "advice"],
};

export const analyzeDream = async (dreamText: string): Promise<DreamAnalysisResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    你是一位专业的心理学家和解梦大师。用户将描述昨天做的一个梦。
    
    你的任务：
    1. 从心理学角度分析这个梦，解释潜在的成因（如焦虑、愿望满足、记忆处理等）。
    2. 根据梦境内容的激烈程度和负面情绪，评估用户的潜意识压力等级（1分最低，10分极度恐慌/压力极大）。
    3. 给出温暖、支持性且可执行的建议，帮助用户今天调整状态。

    梦境内容: "${dreamText}"
    
    请用中文直接回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7, 
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(responseText) as DreamAnalysisResponse;
    return data;
  } catch (error) {
    console.error("Dream analysis failed:", error);
    throw error;
  }
};

export const generateDreamImage = async (dreamText: string): Promise<string | undefined> => {
  if (!apiKey) return undefined;

  const prompt = `Create a surreal, artistic, and dream-like illustration representing this dream: "${dreamText}". High quality, abstract or symbolic style.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9", 
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.warn("Image generation failed:", error);
    return undefined;
  }
};