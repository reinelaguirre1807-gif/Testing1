import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { type Account } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: Account;
}

export default function AccountModal({ isOpen, onClose, account }: AccountModalProps) {
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'cash',
    currency: account?.currency || 'USD',
    balance: account?.balance || '0.00',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ['/api/accounts'],
  });

  const createAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      if (account) {
        await apiRequest('PUT', `/api/accounts/${account.id}`, data);
      } else {
        await apiRequest('POST', '/api/accounts', data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: account ? "Account updated successfully" : "Account created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check account limit for free users
    if (!account && !(user as any)?.isPro && accounts.length >= 3) {
      toast({
        title: "Account Limit Reached",
        description: "Free users can only have 3 accounts. Upgrade to Pro for unlimited accounts.",
        variant: "destructive",
      });
      return;
    }
    
    createAccountMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'cash',
      currency: 'USD',
      balance: '0.00',
    });
    onClose();
  };

  const accountTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'checking', label: 'Checking Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' },
  ];

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'PHP', label: 'PHP - Philippine Peso' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg" data-testid="modal-account">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{account ? 'Edit Account' : 'Add New Account'}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              data-testid="button-close-account-modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Name */}
          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              placeholder="e.g., BDO Account, Cash Wallet"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-account-name"
            />
          </div>

          {/* Account Type */}
          <div>
            <Label htmlFor="type">Account Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
              <SelectTrigger data-testid="select-account-type">
                <SelectValue placeholder="Select Account Type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value as any })}>
              <SelectTrigger data-testid="select-currency">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Balance */}
          <div>
            <Label htmlFor="balance">
              {account ? 'Current Balance' : 'Initial Balance'}
            </Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              required
              data-testid="input-balance"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-yt-primary hover:bg-blue-600"
            disabled={createAccountMutation.isPending}
            data-testid="button-submit-account"
          >
            {createAccountMutation.isPending 
              ? (account ? 'Updating...' : 'Creating...') 
              : (account ? 'Update Account' : 'Create Account')
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}