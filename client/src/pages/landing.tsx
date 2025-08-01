import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "@/components/ui/gradient-background";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <GradientBackground className="min-h-screen pt-safe-top pb-safe-bottom">
      <div className="px-6 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900">Refer</h1>
        </div>
      </div>

      <div className="px-6 py-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          We connect renters with trusted agents — instantly.
        </h2>
        <p className="text-neutral-600 text-sm mb-8">
          Find your perfect home through our verified network of real estate professionals
        </p>
        
        <Button 
          onClick={handleLogin}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold shadow-lg mb-8"
        >
          Get Started
        </Button>
      </div>

      <div className="px-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">How Refer Works</h3>
        <div className="space-y-4">
          <Card className="bg-white/70">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Submit Your Request</h4>
                  <p className="text-sm text-neutral-600">Tell us what you're looking for</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Get Matched</h4>
                  <p className="text-sm text-neutral-600">AI connects you with the best agents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Find Your Home</h4>
                  <p className="text-sm text-neutral-600">Chat with agents and move in</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GradientBackground>
  );
}
