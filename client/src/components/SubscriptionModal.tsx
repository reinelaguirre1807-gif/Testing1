import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Crown, X } from "lucide-react";
import PayPalButton from "./PayPalButton";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [showPayPal, setShowPayPal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const upgradeToProMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/upgrade-pro');
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully upgraded to Pro!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const freePlanFeatures = [
    "Up to 3 accounts",
    "Manual transaction entry",
    "Basic charts & reports",
    "Transaction history",
  ];

  const proPlanFeatures = [
    "Unlimited accounts",
    "AI-powered transaction parsing",
    "Advanced insights & predictions",
    "Multi-device sync",
    "No ads",
    "Data export (CSV, Excel, PDF)",
    "Priority support",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl" data-testid="modal-subscription-plans">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Choose Your Plan</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-subscription-modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold mb-2">Free</h4>
                <div className="text-3xl font-bold mb-4">
                  $0<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Perfect for getting started</p>
              </div>

              <ul className="space-y-3 mb-6">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="flex items-center text-gray-400">
                  <X className="w-4 h-4 mr-3" />
                  <span>Contains ads</span>
                </li>
              </ul>

              <Button
                variant="outline"
                className="w-full"
                disabled
                data-testid="button-current-plan"
              >
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-yt-primary bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yt-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold mb-2">Pro</h4>
                <div className="text-3xl font-bold mb-4">
                  $10<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">For power users who want it all</p>
              </div>

              <ul className="space-y-3 mb-6">
                {proPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {!showPayPal ? (
                <Button
                  onClick={() => setShowPayPal(true)}
                  className="w-full bg-yt-primary hover:bg-blue-600"
                  data-testid="button-upgrade-pro"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">PayPal Integration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Secure payment processing with PayPal
                    </p>
                    <PayPalButton
                      amount="10.00"
                      currency="USD"
                      intent="CAPTURE"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => upgradeToProMutation.mutate()}
                    className="w-full"
                    disabled={upgradeToProMutation.isPending}
                    data-testid="button-demo-upgrade"
                  >
                    {upgradeToProMutation.isPending ? 'Upgrading...' : 'Demo Upgrade (No Payment)'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
