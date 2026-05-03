import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Stripe lazily
  let stripe: Stripe | null = null;
  const getStripe = () => {
    if (!stripe && process.env.STRIPE_SECRET_KEY) {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
  };

  // API Routes
  app.post("/api/verify-local-bank", async (req, res) => {
    try {
      const { bankName, iban, accountTitle } = req.body;
      
      if (!bankName || !iban || !accountTitle) {
        return res.status(400).json({ error: "Missing required banking details" });
      }

      // In a real scenario, this would call a local banking aggregator or manual verification queue
      // For KnZ, we simulate a secure verification process
      console.log(`Verifying Bank: ${bankName}, IBAN: ${iban}, Title: ${accountTitle}`);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      res.json({ 
        success: true, 
        message: "Bank account linked successfully via KnZ Secure Link (Pakistan)",
        verificationId: `PK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
    } catch (error) {
      res.status(500).json({ error: "Verification system busy. Please try again." });
    }
  });

  app.post("/api/verify-subscription-payment", async (req, res) => {
    try {
      const { plan, method, amount } = req.body;
      
      // Simulate verification of the local bank transfer or easy-paisa / jazzcash
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
