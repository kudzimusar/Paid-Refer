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
    title: "1. Referrer Entry",
    description: "Start the journey as a verified referrer",
    content: "Referrers sign up and immediately get access to their personalized intelligence hub.",
    highlightSelector: "[data-testid='referral-section']",
  },
  {
    id: 2,
    title: "2. AI Intent QR Codes",
    description: "Generating dynamic tracking links",
    content: "Our AI generates smart QR codes that track not just the click, but the context of the user's property needs.",
    highlightSelector: "[data-testid='qr-code']",
  },
  {
    id: 3,
    title: "3. Frictionless Sharing",
    description: "WhatsApp & Social Integration",
    content: "One-tap sharing to WhatsApp, LINE, or Messenger to reach customers where they already are.",
    highlightSelector: "[data-testid='share-buttons']",
  },
  {
    id: 4,
    title: "4. The Scan Experience",
    description: "Customer enters the ecosystem",
    content: "When a customer scans, they are greeted by a localized AI agent matched to their market.",
    highlightSelector: "body",
  },
  {
    id: 5,
    title: "5. Intelligent Intake",
    description: "Capturing requirements with AI",
    content: "Customers submit their needs via web or voice. AI instantly formats these into actionable lead data.",
    highlightSelector: "[data-testid='customer-form']",
  },
  {
    id: 6,
    title: "6. Multi-Agent Competition",
    description: "The Reverse Auction begins",
    content: "Qualified agents in the area receive a 'Competition Alert'. The fastest, most relevant agents win the lead.",
    highlightSelector: "[data-testid='competition-radar']",
  },
  {
    id: 7,
    title: "7. Agent Lead Intelligence",
    description: "AI-Powered decision support",
    content: "Agents see 'Lead Intelligence' cards showing closing probability and intent depth before accepting.",
    highlightSelector: "[data-testid='lead-card']",
  },
  {
    id: 8,
    title: "8. The Unlocked Chat",
    description: "Direct secure communication",
    content: "Once accepted, a secure bridge opens. Proof-of-Introduction (POI) is now active and locked in the ledger.",
    highlightSelector: "[data-testid='chat-button']",
  },
  {
    id: 9,
    title: "9. AI Voice Assistant",
    description: "Effortless communication",
    content: "Both parties can use the AI Voice Assistant for instant transcription and intent mapping.",
    highlightSelector: "[data-testid='voice-assistant']",
  },
  {
    id: 10,
    title: "10. Automated Settlement",
    description: "The payout loop closes",
    content: "Upon deal confirmation, the ledger triggers a multi-party payout: Referrer, Platform, and Customer Cashback.",
    highlightSelector: "[data-testid='payout-card']",
  },
  {
    id: 11,
    title: "11. Network Growth",
    description: "Real-time earnings tracking",
    content: "The Referrer's dashboard updates instantly with new XP and earnings, encouraging further network growth.",
    highlightSelector: "[data-testid='earnings-stats']",
  },
  {
    id: 12,
    title: "12. Continuous Optimization",
    description: "AI Academy & Scaling",
    content: "Our AI Academy provides tips based on performance data to help users maximize their referral revenue.",
    highlightSelector: "[data-testid='academy-link']",
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
      const target = DEMO_STEPS[currentStep - 1].highlightSelector;
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        setHighlightElement(element);
      }
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
