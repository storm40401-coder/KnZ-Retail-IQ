import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
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
