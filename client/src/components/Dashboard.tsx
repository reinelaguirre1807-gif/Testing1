import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, ArrowDown, Target, Crown, TrendingUp, ArrowUp, Car, Coffee } from "lucide-react";
import AccountCard from "./AccountCard";
import AccountModal from "./AccountModal";
import TransactionModal from "./TransactionModal";
import SubscriptionModal from "./SubscriptionModal";
import AIInsights from "./AIInsights";
import { SpendingChart, CategoryChart } from "./Charts";
import { type Account, type Transaction, type Subscription } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const { user } = useAuth();

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ['/api/accounts'],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  const { data: subscriptions = [] } = useQuery<Subscription[]>({
    queryKey: ['/api/subscriptions'],
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['/api/analytics/balance'],
  });

  const { data: monthlyExpensesData } = useQuery({
    queryKey: ['/api/analytics/monthly-expenses'],
  });

  const totalBalance = (analyticsData as any)?.totalBalance || 0;
  const monthlyExpenses = (monthlyExpensesData as any)?.monthlyExpenses || 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6" data-testid="dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" data-testid="text-welcome-message">
          Welcome back, {(user as any)?.firstName || 'User'}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Here's your financial overview for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover" data-testid="card-total-balance">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Balance</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-total-balance">
              ${totalBalance.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className="text-green-500">+5.2%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-monthly-expenses">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                <ArrowDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">This Month</span>
            </div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400" data-testid="text-monthly-expenses">
              ${monthlyExpenses.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className="text-red-500">+12.3%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-budget-goal">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Budget Goal</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-budget-remaining">
              $650.00
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className="text-green-500">74%</span> remaining
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Your Accounts</h3>
          <Button
            onClick={() => setShowAccountModal(true)}
            className="bg-yt-primary hover:bg-blue-600"
            data-testid="button-add-account"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
          
          {accounts.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600" data-testid="empty-accounts">
              <CardContent className="p-6 text-center">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No accounts yet</p>
                <p className="text-sm text-gray-400">Add your first account to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Charts and AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <SpendingChart />
        <CategoryChart />
        <AIInsights />
      </div>

      {/* Recent Transactions */}
      <Card className="mb-8" data-testid="card-recent-transactions">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button variant="ghost" className="text-yt-primary hover:text-blue-600" data-testid="button-view-all-transactions">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                data-testid={`transaction-${transaction.id}`}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mr-4">
                    {transaction.category === 'food' && <Coffee className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
                    {transaction.category === 'transport' && <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                    {transaction.type === 'income' && <ArrowUp className="w-6 h-6 text-green-600 dark:text-green-400" />}
                  </div>
                  <div>
                    <h4 className="font-medium" data-testid={`text-transaction-description-${transaction.id}`}>
                      {transaction.description}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span data-testid={`text-transaction-date-${transaction.id}`}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`}
                    data-testid={`text-transaction-amount-${transaction.id}`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 capitalize" data-testid={`text-transaction-category-${transaction.id}`}>
                    {transaction.category}
                  </div>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8" data-testid="empty-transactions">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                <p className="text-sm text-gray-400">Add your first transaction to see it here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tracking */}
      <Card className="mb-8" data-testid="card-subscriptions">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Active Subscriptions</h3>
            <Button variant="ghost" className="text-yt-primary hover:text-blue-600" data-testid="button-manage-subscriptions">
              Manage
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                data-testid={`subscription-${subscription.id}`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium" data-testid={`text-subscription-name-${subscription.id}`}>
                      {subscription.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-subscription-next-billing-${subscription.id}`}>
                      Next: {new Date(subscription.nextBilling).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold" data-testid={`text-subscription-amount-${subscription.id}`}>
                    ${Number(subscription.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{subscription.frequency}</div>
                </div>
              </div>
            ))}

            {subscriptions.length === 0 && (
              <div className="col-span-full text-center py-8" data-testid="empty-subscriptions">
                <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No subscriptions tracked</p>
                <p className="text-sm text-gray-400">Add subscriptions to track recurring expenses</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pro Features Preview */}
      {!(user as any)?.isPro && (
        <Card className="gradient-border mb-8" data-testid="card-pro-preview">
          <div className="gradient-border-inner bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yt-primary to-yt-secondary rounded-xl flex items-center justify-center mr-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upgrade to SmartExpense Pro</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Unlock AI-powered features and unlimited accounts
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-gradient-to-r from-yt-primary to-yt-secondary hover:from-blue-600 hover:to-blue-500"
                data-testid="button-upgrade-now"
              >
                Upgrade Now
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <Crown className="w-4 h-4 text-yt-primary mr-3" />
                <span>AI-powered transaction parsing</span>
              </div>
              <div className="flex items-center text-sm">
                <Crown className="w-4 h-4 text-yt-primary mr-3" />
                <span>Unlimited accounts</span>
              </div>
              <div className="flex items-center text-sm">
                <Crown className="w-4 h-4 text-yt-primary mr-3" />
                <span>Advanced insights & predictions</span>
              </div>
              <div className="flex items-center text-sm">
                <Crown className="w-4 h-4 text-yt-primary mr-3" />
                <span>Multi-device sync</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />

      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </div>
  );
}
