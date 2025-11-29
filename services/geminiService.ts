import { GoogleGenAI, Type } from "@google/genai";
import { AIRsponseItem } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateBOMFromDescription = async (description: string): Promise<AIRsponseItem[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    You are an expert Azure Solutions Architect. 
    Analyze the following project description and generate a Bill of Materials (BOM) with estimated costs.
    
    Project Description: "${description}"
    
    Rules:
    1. Identify key Azure services needed (Compute, Storage, Database, Networking, AI, etc.).
    2. Suggest a reasonable tier/size for a "standard" production workload if not specified.
    3. Estimate a monthly cost (USD) for each item based on public standard pay-as-you-go pricing. Be conservative but realistic.
    4. Provide a short description/reasoning for each item.
    5. Ensure the category matches one of: Compute, Storage, Networking, Database, AI + Machine Learning, Analytics, Identity, Security, Other.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              serviceName: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              estimatedMonthlyCost: { type: Type.NUMBER },
              quantity: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            },
            required: ['serviceName', 'category', 'description', 'estimatedMonthlyCost', 'quantity', 'reasoning']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text) as AIRsponseItem[];
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate BOM from AI. Please try again.");
  }
};
