import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AIInsights() {
  const { user } = useAuth();
  const isPro = (user as any)?.isPro;

  const insights = [
    {
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      title: "Spending Pattern",
      message: "You've reduced food expenses by 15% this month compared to last month.",
      type: "positive"
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      title: "Budget Alert",
      message: "You're approaching 80% of your monthly entertainment budget.",
      type: "warning"
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      title: "Savings Goal",
      message: "At your current rate, you'll reach your $2000 savings goal by March.",
      type: "info"
    }
  ];

  const mockInsights = [
    {
      icon: <Sparkles className="w-5 h-5 text-gray-400" />,
      title: "AI Insights",
      message: "Upgrade to Pro to get personalized spending insights and predictions.",
      type: "upgrade"
    }
  ];

  const displayInsights = isPro ? insights : mockInsights;

  return (
    <Card data-testid="card-ai-insights">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yt-primary" />
          AI Insights {!isPro && "(Pro Feature)"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayInsights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                insight.type === 'positive' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : insight.type === 'warning'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                  : insight.type === 'info'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
              data-testid={`insight-${index}`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">{insight.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1" data-testid={`insight-title-${index}`}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400" data-testid={`insight-message-${index}`}>
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {!isPro && (
            <div className="text-center pt-4">
              <Button
                size="sm"
                className="bg-gradient-to-r from-yt-primary to-yt-secondary hover:from-blue-600 hover:to-blue-500"
                data-testid="button-upgrade-for-insights"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}