import { GoogleGenAI, Type } from "@google/genai";

let genAIClient: any = null;

function getGenAI() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in the Secrets panel.");
    }
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

export async function optimizeListing(productName: string, category: string, currentDescription: string) {
  const prompt = `Optimize an e-commerce listing for the following product:
    Name: ${productName}
    Category: ${category}
    Initial Description: ${currentDescription}
    
    Please provide:
    1. A catchy, SEO-optimized Title.
    2. A compelling, bulleted product Description.
    3. 5 relevant SEO Keywords.`;

  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedTitle: { type: Type.STRING },
            optimizedDescription: { type: Type.STRING },
            keywords: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["optimizedTitle", "optimizedDescription", "keywords"]
        }
      }
    });

    // The SDK returns a response object with a text() method or a direct text property depending on the version
    // For @google/genai, it's usually response.text
    return typeof response.text === 'function' ? JSON.parse(response.text()) : JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini optimization error:", error);
    throw error;
  }
}
