import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight, Shield, Smartphone, TrendingUp } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yt-primary to-yt-secondary" data-testid="landing-page">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <BarChart3 className="w-10 h-10 text-yt-primary" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">SmartExpense</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Take control of your finances with AI-powered expense tracking. 
            Smart insights, beautiful charts, and seamless money management.
          </p>
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-white text-yt-primary hover:bg-gray-100 text-lg px-8 py-4"
            data-testid="button-login"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Tracking</h3>
              <p className="text-blue-100">
                AI-powered expense categorization and intelligent insights to help you understand your spending patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Mobile First</h3>
              <p className="text-blue-100">
                Beautiful, responsive design that works perfectly on all devices. Track expenses on the go.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Secure & Private</h3>
              <p className="text-blue-100">
                Your financial data is encrypted and secure. We never share your information with third parties.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to transform your finances?</h2>
          <Button
            onClick={handleLogin}
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-yt-primary text-lg px-8 py-4"
            data-testid="button-signup"
          >
            Sign Up Free
          </Button>
        </div>
      </div>
    </div>
  );
}
