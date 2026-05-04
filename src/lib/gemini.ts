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
      model: "gemini-3-flash-preview",
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini optimization error:", error);
    throw error;
  }
}

export async function generateMarketReport(query: string) {
  const prompt = `Generate a detailed market intelligence report for the following query: "${query}"
    
    Please provide:
    1. A strategic Summary of the current market state.
    2. A list of 3-4 trending categories or products in this space with growth percentages and sentiment.
    3. Price Velocity: A numerical value between 0 and 100 indicating how fast prices are shifting (0=Stable, 100=Volatile).
    4. 2-3 specific AI-driven Strategic Recommendations.
    5. Mock data for a trend chart: 6 data points of monthly interest/demand.`;

  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            trending: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  growth: { type: Type.STRING },
                  sentiment: { type: Type.STRING }
                },
                required: ["name", "growth", "sentiment"]
              }
            },
            priceVelocity: { type: Type.NUMBER },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ["month", "value"]
              }
            }
          },
          required: ["summary", "trending", "priceVelocity", "recommendations", "chartData"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Market Report Error:", error);
    throw error;
  }
}
