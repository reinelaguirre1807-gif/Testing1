import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Building2, MoreVertical } from "lucide-react";
import { type Account } from "@shared/schema";

interface AccountCardProps {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (accountId: string) => void;
}

export default function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'cash':
        return <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'cash':
        return 'bg-green-100 dark:bg-green-900';
      case 'credit':
        return 'bg-purple-100 dark:bg-purple-900';
      default:
        return 'bg-blue-100 dark:bg-blue-900';
    }
  };

  const formatBalance = (balance: string, type: string) => {
    const amount = Number(balance);
    const isNegative = amount < 0 || type === 'credit';
    return (
      <span className={isNegative ? 'text-red-500' : 'text-gray-900 dark:text-white'}>
        {isNegative && type === 'credit' ? '-' : ''}${Math.abs(amount).toFixed(2)}
      </span>
    );
  };

  return (
    <Card className="card-hover" data-testid={`card-account-${account.id}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${getIconBgColor(account.type)} rounded-xl flex items-center justify-center mr-3`}>
              {getAccountIcon(account.type)}
            </div>
            <div>
              <h4 className="font-semibold" data-testid={`text-account-name-${account.id}`}>
                {account.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize" data-testid={`text-account-type-${account.id}`}>
                {account.type}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            data-testid={`button-account-menu-${account.id}`}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        
        <div className="text-2xl font-bold mb-2" data-testid={`text-account-balance-${account.id}`}>
          {formatBalance(account.balance, account.type)}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-account-currency-${account.id}`}>
          {account.currency}
        </div>
      </CardContent>
    </Card>
  );
}
