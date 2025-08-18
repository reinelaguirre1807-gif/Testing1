import {
  users,
  accounts,
  transactions,
  subscriptions,
  budgetGoals,
  type User,
  type UpsertUser,
  type Account,
  type InsertAccount,
  type Transaction,
  type InsertTransaction,
  type Subscription,
  type InsertSubscription,
  type BudgetGoal,
  type InsertBudgetGoal,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sum, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Account operations
  getUserAccounts(userId: string): Promise<Account[]>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(accountId: string, updates: Partial<InsertAccount>): Promise<Account>;
  deleteAccount(accountId: string): Promise<void>;
  getAccount(accountId: string): Promise<Account | undefined>;
  
  // Transaction operations
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByAccount(accountId: string): Promise<Transaction[]>;
  getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]>;
  getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
  
  // Subscription operations
  getUserSubscriptions(userId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(subscriptionId: string, updates: Partial<InsertSubscription>): Promise<Subscription>;
  deleteSubscription(subscriptionId: string): Promise<void>;
  
  // Budget operations
  getUserBudgetGoals(userId: string): Promise<BudgetGoal[]>;
  createBudgetGoal(budgetGoal: InsertBudgetGoal): Promise<BudgetGoal>;
  updateBudgetGoal(budgetGoalId: string, updates: Partial<InsertBudgetGoal>): Promise<BudgetGoal>;
  deleteBudgetGoal(budgetGoalId: string): Promise<void>;
  
  // Analytics
  getUserTotalBalance(userId: string): Promise<number>;
  getMonthlyExpenses(userId: string, month: string): Promise<number>;
  getCategorySpending(userId: string, month: string): Promise<{ category: string; amount: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Account operations
  async getUserAccounts(userId: string): Promise<Account[]> {
    return await db.select().from(accounts).where(and(eq(accounts.userId, userId), eq(accounts.isActive, true)));
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const [newAccount] = await db.insert(accounts).values(account).returning();
    return newAccount;
  }

  async updateAccount(accountId: string, updates: Partial<InsertAccount>): Promise<Account> {
    const [updatedAccount] = await db
      .update(accounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(accounts.id, accountId))
      .returning();
    return updatedAccount;
  }

  async deleteAccount(accountId: string): Promise<void> {
    await db.update(accounts).set({ isActive: false }).where(eq(accounts.id, accountId));
  }

  async getAccount(accountId: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId));
    return account;
  }

  // Transaction operations
  async getUserTransactions(userId: string, limit = 50): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    
    // Update account balance
    const account = await this.getAccount(transaction.accountId);
    if (account) {
      const balanceChange = transaction.type === 'income' 
        ? Number(transaction.amount) 
        : -Number(transaction.amount);
      
      await this.updateAccount(transaction.accountId, {
        balance: (Number(account.balance) + balanceChange).toFixed(2)
      });
    }
    
    return newTransaction;
  }

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId))
      .orderBy(desc(transactions.date));
  }

  async getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.category, category as any)))
      .orderBy(desc(transactions.date));
  }

  async getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date));
  }

  // Subscription operations
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true)));
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateSubscription(subscriptionId: string, updates: Partial<InsertSubscription>): Promise<Subscription> {
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set(updates)
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
    return updatedSubscription;
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    await db.update(subscriptions).set({ isActive: false }).where(eq(subscriptions.id, subscriptionId));
  }

  // Budget operations
  async getUserBudgetGoals(userId: string): Promise<BudgetGoal[]> {
    return await db
      .select()
      .from(budgetGoals)
      .where(and(eq(budgetGoals.userId, userId), eq(budgetGoals.isActive, true)));
  }

  async createBudgetGoal(budgetGoal: InsertBudgetGoal): Promise<BudgetGoal> {
    const [newBudgetGoal] = await db.insert(budgetGoals).values(budgetGoal).returning();
    return newBudgetGoal;
  }

  async updateBudgetGoal(budgetGoalId: string, updates: Partial<InsertBudgetGoal>): Promise<BudgetGoal> {
    const [updatedBudgetGoal] = await db
      .update(budgetGoals)
      .set(updates)
      .where(eq(budgetGoals.id, budgetGoalId))
      .returning();
    return updatedBudgetGoal;
  }

  async deleteBudgetGoal(budgetGoalId: string): Promise<void> {
    await db.update(budgetGoals).set({ isActive: false }).where(eq(budgetGoals.id, budgetGoalId));
  }

  // Analytics
  async getUserTotalBalance(userId: string): Promise<number> {
    const userAccounts = await this.getUserAccounts(userId);
    return userAccounts.reduce((total, account) => total + Number(account.balance), 0);
  }

  async getMonthlyExpenses(userId: string, month: string): Promise<number> {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const expenses = await this.getTransactionsByDateRange(userId, startDate, endDate);
    return expenses
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + Number(t.amount), 0);
  }

  async getCategorySpending(userId: string, month: string): Promise<{ category: string; amount: number }[]> {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const expenses = await this.getTransactionsByDateRange(userId, startDate, endDate);
    const categoryMap = new Map<string, number>();
    
    expenses
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + Number(t.amount));
      });
    
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({ category, amount }));
  }
}

export const storage = new DatabaseStorage();
