import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Moon, Sun, User, Home, List, BarChart3, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  onShowTransactionModal?: () => void;
}

export default function Layout({ children, onShowTransactionModal }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-white">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yt-primary rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">SmartExpense</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-toggle-theme"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-notifications"
                className="hover:bg-gray-100 dark:hover:bg-gray-800 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-profile"
                className="w-8 h-8 bg-yt-primary rounded-full flex items-center justify-center"
              >
                <User className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-8">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden z-30">
        <div className="flex justify-around items-center h-16">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center flex-1 py-2 text-yt-primary"
            data-testid="tab-dashboard"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Dashboard</span>
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500"
            data-testid="tab-transactions"
          >
            <List className="w-5 h-5 mb-1" />
            <span className="text-xs">Transactions</span>
          </Button>
          
          <Button
            className="w-12 h-12 bg-yt-primary rounded-full flex items-center justify-center mx-2"
            onClick={onShowTransactionModal}
            data-testid="button-add-transaction"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500"
            data-testid="tab-insights"
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Insights</span>
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500"
            data-testid="tab-settings"
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
