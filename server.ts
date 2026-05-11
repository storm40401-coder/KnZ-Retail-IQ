import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in server environment");
    }
    return new GoogleGenAI({ apiKey });
  };

  // AI Routes
  app.post("/api/ai/optimize", async (req, res) => {
    try {
      const { productName, category, currentDescription } = req.body;
      const ai = getGenAI();
      
      const prompt = `Optimize an e-commerce listing for the following product:
        Name: ${productName}
        Category: ${category}
        Initial Description: ${currentDescription}
        
        Please provide:
        1. A catchy, SEO-optimized Title.
        2. A compelling, bulleted product Description.
        3. 5 relevant SEO Keywords.`;

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

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("AI Optimize Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/market-report", async (req, res) => {
    try {
      const { query } = req.body;
      const ai = getGenAI();

      const prompt = `Generate a detailed market intelligence report for the following query: "${query}"
        
        Act as a global market research analyst. Incorporate simulated high-volume Google Search keyword data and global demand signals.
        
        Please provide:
        1. A strategic Summary of the current market state, referencing global search trends.
        2. A list of 3-4 trending categories or products in this space with growth percentages and public sentiment.
        3. Price Velocity: A numerical value between 0 and 100 indicating how fast prices are shifting (0=Stable, 100=Volatile).
        4. 2-3 specific AI-driven Strategic Recommendations based on top-performing SEO keywords.
        5. Mock data for a trend chart: 6 data points of monthly interest/demand volume (indexed value 0-100).`;

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

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("AI Market Report Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/verify-subscription-payment", async (req, res) => {
    try {
      const { plan, method, amount } = req.body;
      
      // Pure simulation for business account verification
      console.log(`Verifying subscription payment: ${plan}, Method: ${method}, Amount: ${amount}`);
      
      await new Promise(resolve => setTimeout(resolve, 2500));

      res.json({ 
        success: true, 
        message: "Payment verified. Pro features activated.",
        transactionId: `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      });
    } catch (error) {
      res.status(500).json({ error: "Payment gateway timeout." });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
