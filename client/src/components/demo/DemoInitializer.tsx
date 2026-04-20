import { useDemoMode } from "@/contexts/DemoModeContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Sparkles } from "lucide-react";

export function DemoInitializer() {
  const { isDemoMode, setDemoMode, toggleGuidedMode } = useDemoMode();

  if (!isDemoMode) {
    return null;
  }

  return (
    <Dialog open={isDemoMode} onOpenChange={setDemoMode}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Welcome to Refer 2.0 Demo
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Experience the AI-powered referral platform with a guided tour
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Features List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm mb-3">What You'll See:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-lg">🔗</span>
                <span>Smart referral links with AI intent analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🛡️</span>
                <span>Trust scores that prevent agent bypass</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🎯</span>
                <span>AI-powered deal predictions (close probability, commission)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">⚡</span>
                <span>Real-time market intelligence and heatmaps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🎮</span>
                <span>Gamification system (XP, levels, leaderboards)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🌍</span>
                <span>Multi-market support (Zimbabwe, South Africa, Japan)</span>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-4">
            <div className="text-center p-2 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-emerald-600">50+</p>
              <p className="text-xs text-muted-foreground">Mock Properties</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-blue-600">30+</p>
              <p className="text-xs text-muted-foreground">Users & Agents</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-purple-600">10</p>
              <p className="text-xs text-muted-foreground">Tour Steps</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>💡 Tip:</strong> Use the role switcher (bottom-left) to view the platform from different perspectives. The tour will guide you through key features showing how referrers, customers, and agents interact.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setDemoMode(false)}
          >
            Explore Manually
          </Button>
          <Button
            className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-blue-600"
            onClick={() => {
              toggleGuidedMode();
              setDemoMode(false);
            }}
          >
            <Play className="h-4 w-4" />
            Start Guided Tour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
