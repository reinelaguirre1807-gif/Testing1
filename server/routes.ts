import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { insertAccountSchema, insertTransactionSchema, insertSubscriptionSchema, insertBudgetGoalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // PayPal routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Account routes
  app.get('/api/accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accounts = await storage.getUserAccounts(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  app.post('/api/accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isPro) {
        const existingAccounts = await storage.getUserAccounts(userId);
        if (existingAccounts.length >= 3) {
          return res.status(403).json({ message: "Free users can only have 3 accounts. Upgrade to Pro for unlimited accounts." });
        }
      }

      const accountData = insertAccountSchema.parse({ ...req.body, userId });
      const account = await storage.createAccount(accountData);
      res.json(account);
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.put('/api/accounts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const account = await storage.updateAccount(id, updates);
      res.json(account);
    } catch (error) {
      console.error("Error updating account:", error);
      res.status(500).json({ message: "Failed to update account" });
    }
  });

  app.delete('/api/accounts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAccount(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Transaction routes
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const transactions = await storage.getUserTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionData = insertTransactionSchema.parse({ ...req.body, userId });
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.get('/api/transactions/category/:category', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { category } = req.params;
      const transactions = await storage.getTransactionsByCategory(userId, category);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions by category:", error);
      res.status(500).json({ message: "Failed to fetch transactions by category" });
    }
  });

  // Subscription routes
  app.get('/api/subscriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscriptions = await storage.getUserSubscriptions(userId);
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  app.post('/api/subscriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscriptionData = insertSubscriptionSchema.parse({ ...req.body, userId });
      const subscription = await storage.createSubscription(subscriptionData);
      res.json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.put('/api/subscriptions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const subscription = await storage.updateSubscription(id, updates);
      res.json(subscription);
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  app.delete('/api/subscriptions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSubscription(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting subscription:", error);
      res.status(500).json({ message: "Failed to delete subscription" });
    }
  });

  // Budget goals routes
  app.get('/api/budget-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const budgetGoals = await storage.getUserBudgetGoals(userId);
      res.json(budgetGoals);
    } catch (error) {
      console.error("Error fetching budget goals:", error);
      res.status(500).json({ message: "Failed to fetch budget goals" });
    }
  });

  app.post('/api/budget-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isPro) {
        return res.status(403).json({ message: "Budget goals are a Pro feature. Upgrade to Pro to access this feature." });
      }

      const budgetGoalData = insertBudgetGoalSchema.parse({ ...req.body, userId });
      const budgetGoal = await storage.createBudgetGoal(budgetGoalData);
      res.json(budgetGoal);
    } catch (error) {
      console.error("Error creating budget goal:", error);
      res.status(500).json({ message: "Failed to create budget goal" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/balance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const totalBalance = await storage.getUserTotalBalance(userId);
      res.json({ totalBalance });
    } catch (error) {
      console.error("Error fetching total balance:", error);
      res.status(500).json({ message: "Failed to fetch total balance" });
    }
  });

  app.get('/api/analytics/monthly-expenses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const month = req.query.month as string || new Date().toISOString().slice(0, 7);
      const monthlyExpenses = await storage.getMonthlyExpenses(userId, month);
      res.json({ monthlyExpenses });
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
      res.status(500).json({ message: "Failed to fetch monthly expenses" });
    }
  });

  app.get('/api/analytics/category-spending', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const month = req.query.month as string || new Date().toISOString().slice(0, 7);
      const categorySpending = await storage.getCategorySpending(userId, month);
      res.json(categorySpending);
    } catch (error) {
      console.error("Error fetching category spending:", error);
      res.status(500).json({ message: "Failed to fetch category spending" });
    }
  });

  // Pro upgrade route
  app.post('/api/upgrade-pro', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const proExpiresAt = new Date();
      proExpiresAt.setMonth(proExpiresAt.getMonth() + 1); // 1 month from now
      
      const user = await storage.upsertUser({
        id: userId,
        isPro: true,
        proExpiresAt,
        updatedAt: new Date(),
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
      res.status(500).json({ message: "Failed to upgrade to Pro" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
