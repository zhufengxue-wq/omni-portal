import { GoogleGenAI, Type } from "@google/genai";
import { ProjectRole } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const isAiAvailable = () => !!apiKey;

/**
 * Analyzes a project description and suggests roles with required talents.
 */
export const analyzeProjectNeeds = async (projectDescription: string): Promise<ProjectRole[]> => {
  if (!apiKey) {
    // Graceful fallback for offline/demo mode
    return [
      { id: '1', title: '运营负责人', requiredTalents: ['领导力', '组织能力'], equityShare: 15, isFilled: false },
      { id: '2', title: '市场营销', requiredTalents: ['创意', '沟通'], equityShare: 10, isFilled: false },
      { id: '3', title: '产品主理人', requiredTalents: ['审美', '服务意识'], equityShare: 10, isFilled: false },
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on this project description (which might be in Chinese): "${projectDescription}", suggest 3-5 key team roles required to make it successful. For each role, list the primary talent needed. Translate titles and talents to Chinese.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              requiredTalents: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedEquity: { type: Type.NUMBER, description: "Suggested equity share between 5 and 20" }
            },
            required: ["title", "requiredTalents", "suggestedEquity"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    
    return data.map((item: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      title: item.title,
      requiredTalents: item.requiredTalents,
      equityShare: item.suggestedEquity,
      isFilled: false
    }));

  } catch (error) {
    console.error("AI Service Error:", error);
    // Return empty array to let UI handle the empty state gracefully or fallback
    return [];
  }
};

/**
 * Generates a "Core Strengths" analysis based on user bio
 */
export const getFeelGoodAnalysis = async (bio: string): Promise<string[]> => {
  if (!apiKey) return ['跨界整合者', '高维审美', '技术赋能', '长期主义'];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on this user persona and skills: "${bio}", list 4-6 specific "Core Strengths" or "Superpowers" (keywords). Return them in Chinese. Example: "跨界整合", "敏捷开发", "高维审美".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.warn("AI Analysis unavailable, using defaults.");
    return ['创意驱动', '全栈思维', '执行力', '系统化'];
  }
}

/**
 * General Chat with Omni Mate
 */
export const chatWithOmni = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
    if (!apiKey) {
        return "我是 Omni Mate，您的 AI 共创助理。由于目前处于离线演示模式，我只能提供有限的回复。接入真实 API Key 后，我可以为您提供深度洞察。";
    }

    try {
        // Construct the full prompt context
        const systemInstruction = "You are Omni Mate, a friendly, high-dimensional AI assistant for the 'Omni Portal' platform. The user is a 'Super Individual' (Creator/Digital Nomad). Your tone is supportive, insightful, and slightly futuristic. Keep responses concise (under 100 words) unless asked for details. Language: Chinese.";
        
        // Use generateContent for single turn with history context simulated
        // In a real app with persistent history, we would use chats.create()
        const prompt = `${systemInstruction}\n\nChat History:\n${JSON.stringify(history)}\n\nUser: ${message}\nOmni Mate:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "抱歉，我暂时无法连接到意识网络。";
    } catch (error) {
        console.error("Chat Error", error);
        return "连接中断，请稍后再试。";
    }
}