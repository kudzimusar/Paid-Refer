import { useState, useEffect } from "react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  RotateCw,
} from "lucide-react";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  content: string;
  highlightSelector?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: "Welcome to Refer 2.0",
    description: "The AI-powered referral platform for real estate",
    content:
      "Watch how referrers, customers, and agents connect through our intelligent matching system.",
    highlightSelector: "body",
  },
  {
    id: 2,
    title: "Market Selector",
    description: "Switch between markets seamlessly",
    content:
      "Support for Zimbabwe, South Africa, and Japan with localized currencies, property types, and regulations.",
    highlightSelector: "[data-testid='market-switcher']",
  },
  {
    id: 3,
    title: "Referrer Dashboard",
    description: "Generate smart QR codes with AI intent analysis",
    content:
      "Referrers generate unique codes. AI analyzes their intent and pre-matches agents before the link is even shared.",
    highlightSelector: "[data-testid='referral-section']",
  },
  {
    id: 4,
    title: "Trust Score System",
    description: "AI-calculated agent reputation",
    content:
      "Each agent gets a transparent trust score (0-1000) based on response time, success rate, reviews, verification, and activity.",
    highlightSelector: "[data-testid='trust-score']",
  },
  {
    id: 5,
    title: "Predictive Intelligence",
    description: "AI forecasts deal closure probability",
    content:
      "When a customer request arrives, AI analyzes it and predicts: close probability (%), expected close time, commission range, and matching agents.",
    highlightSelector: "[data-testid='deal-prediction']",
  },
  {
    id: 6,
    title: "Proof of Introduction",
    description: "Agents cannot bypass referrers",
    content:
      "Customer provides referral code at checkout. Deal closure requires customer confirmation in-app. Referrer commission is guaranteed.",
    highlightSelector: "[data-testid='code-input']",
  },
  {
    id: 7,
    title: "Real-time Activity",
    description: "Live market pulse dashboard",
    content:
      "See demand heatmaps by location, active requests, deal closures, and AI insights—all updating in real-time.",
    highlightSelector: "[data-testid='market-pulse']",
  },
  {
    id: 8,
    title: "Gamification",
    description: "Referrers earn XP and climb tiers",
    content:
      "Level up from Bronze → Silver → Gold → Platinum with XP, achievements, weekly leaderboards, and reward points.",
    highlightSelector: "[data-testid='gamification']",
  },
  {
    id: 9,
    title: "Revenue Model",
    description: "Transparent commission for all",
    content:
      "Referrer: $120/deal (ZW), Customer: $20 cashback, Agent: Standard commission, Platform: 5% transaction fee.",
    highlightSelector: "body",
  },
  {
    id: 10,
    title: "Why Refer 2.0?",
    description: "Key competitive advantages",
    content:
      "✅ AI-powered matching for 40% faster closes\n✅ Proof-of-introduction prevents agent bypass\n✅ Transparent trust scores build confidence\n✅ Multi-market expansion ready\n✅ Mobile-first for emerging markets",
    highlightSelector: "body",
  },
];

export function GuidedTourController() {
  const { isGuidedMode, toggleGuidedMode } = useDemoMode();
  const [currentStep, setCurrentStep] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [highlightElement, setHighlightElement] = useState<Element | null>(null);

  // Handle spotlight on element
  useEffect(() => {
    if (isGuidedMode && DEMO_STEPS[currentStep - 1]?.highlightSelector) {
      const element = document.querySelector(
        DEMO_STEPS[currentStep - 1].highlightSelector
      );
      setHighlightElement(element);
    }
  }, [currentStep, isGuidedMode]);

  // Auto-advance
  useEffect(() => {
    if (!autoPlay || !isGuidedMode) return;

    const timer = setTimeout(() => {
      if (currentStep < DEMO_STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setAutoPlay(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [autoPlay, isGuidedMode, currentStep]);

  if (!isGuidedMode) {
    return null;
  }

  const step = DEMO_STEPS[currentStep - 1];
  const progress = (currentStep / DEMO_STEPS.length) * 100;

  return (
    <>
      {/* Spotlight Overlay */}
      {highlightElement && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <mask id="spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {(() => {
                  const rect = highlightElement.getBoundingClientRect();
                  return (
                    <rect
                      x={rect.left}
                      y={rect.top}
                      width={rect.width}
                      height={rect.height}
                      rx="8"
                      fill="black"
                    />
                  );
                })()}
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.6)"
              mask="url(#spotlight-mask)"
            />
          </svg>
        </div>
      )}

      {/* Control Panel */}
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Investor Tour</p>
              <p className="text-xs opacity-90">
                Step {currentStep} of {DEMO_STEPS.length}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
              onClick={() => {
                toggleGuidedMode();
                setAutoPlay(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-2 bg-white/20" />

          {/* Step Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 space-y-2">
            <p className="font-semibold text-sm">{step.title}</p>
            <p className="text-xs opacity-90 leading-relaxed whitespace-pre-wrap">
              {step.description}
            </p>
            <p className="text-xs opacity-75 leading-relaxed">{step.content}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 text-white hover:bg-white/20 text-xs"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="flex-1 text-white hover:bg-white/20 text-xs"
              onClick={() => setAutoPlay(!autoPlay)}
            >
              {autoPlay ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="flex-1 text-white hover:bg-white/20 text-xs"
              onClick={() => {
                if (currentStep < DEMO_STEPS.length) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setCurrentStep(1);
                  setAutoPlay(false);
                }
              }}
            >
              {currentStep === DEMO_STEPS.length ? (
                <>
                  <RotateCw className="h-4 w-4" />
                  Restart
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4" />
                  Next
                </>
              )}
            </Button>
          </div>

          {/* Auto-play Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
            <span>Auto-advance: {autoPlay ? "ON" : "OFF"}</span>
            <Badge
              variant="outline"
              className={
                autoPlay
                  ? "bg-white/30 text-white border-white/50"
                  : "bg-white/10 text-white/50 border-white/20"
              }
            >
              {autoPlay ? "▶️" : "⏸️"}
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
}
