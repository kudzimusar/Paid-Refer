import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AIConfidenceBadge } from "@/components/demo/AIConfidenceBadge";
import { Award, Activity, TrendingUp, Star, Clock } from "lucide-react";

interface ScoreComponent {
  label: string;
  score: number;
  description: string;
  icon: string;
  weight: number; // Percentage contribution
}

interface TrustScoreBadgeProps {
  score: number;
  name?: string;
  scoreComponents?: ScoreComponent[];
  className?: string;
}

const defaultComponents: ScoreComponent[] = [
  {
    label: "Response Time",
    score: 95,
    description: "Avg. 12 min response (Top 10%)",
    icon: "⚡",
    weight: 20,
  },
  {
    label: "Deal Success Rate",
    score: 88,
    description: "22 closed / 25 accepted (88%)",
    icon: "🎯",
    weight: 30,
  },
  {
    label: "Customer Reviews",
    score: 92,
    description: "4.6/5 stars (18 reviews)",
    icon: "⭐",
    weight: 25,
  },
  {
    label: "License Verification",
    score: 100,
    description: "ZREB License verified ✓",
    icon: "🛡️",
    weight: 15,
  },
  {
    label: "Activity Level",
    score: 78,
    description: "Active 18/30 days this month",
    icon: "📊",
    weight: 10,
  },
];

function getTrustLevel(score: number): string {
  if (score >= 900) return "Platinum";
  if (score >= 800) return "Gold";
  if (score >= 700) return "Silver";
  if (score >= 600) return "Bronze";
  return "Standard";
}

export function TrustScoreBadge({
  score,
  name,
  scoreComponents = defaultComponents,
  className = "",
}: TrustScoreBadgeProps) {
  const trustLevel = getTrustLevel(score);
  const trustColor =
    score >= 900
      ? "from-purple-500 to-pink-500"
      : score >= 800
      ? "from-yellow-500 to-orange-500"
      : score >= 700
      ? "from-slate-500 to-slate-600"
      : score >= 600
      ? "from-amber-700 to-amber-800"
      : "from-gray-500 to-gray-600";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
          <div className="flex items-center gap-4">
            {/* Circular Score */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${(score / 1000) * 226} 226`}
                  className={`text-emerald-500 transition-all duration-1000`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-xl font-bold">{score}</span>
                </div>
              </div>
            </div>

            {/* Text Info */}
            <div className="flex-1">
              {name && <p className="font-semibold text-sm">{name}</p>}
              <p className="text-sm font-medium">Trust Score</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`bg-gradient-to-r ${trustColor} text-white border-0`}>
                  {trustLevel}
                </Badge>
                <span className="text-xs text-muted-foreground">Tier</span>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Trust Score Breakdown
          </DialogTitle>
          <DialogDescription>How this score is calculated</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Score Components */}
          {scoreComponents.map((comp, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{comp.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{comp.label}</p>
                    <p className="text-xs text-muted-foreground">{comp.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{comp.score}</p>
                  <p className="text-xs text-muted-foreground">{comp.weight}% weight</p>
                </div>
              </div>
              <Progress value={comp.score} className="h-2" />
            </div>
          ))}

          {/* Overall Score */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Overall Trust Score</span>
              </div>
              <span className="text-2xl font-bold text-emerald-600">{score}/1000</span>
            </div>
            <Progress value={score / 10} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              This agent is in the <strong>{trustLevel}</strong> tier, placing them in the{" "}
              <strong>top {Math.floor(Math.random() * 10) + 5}%</strong> of all agents on our platform.
            </p>
          </div>

          {/* AI Confidence */}
          <div className="pt-3">
            <AIConfidenceBadge
              confidence={92}
              reasoning="Score based on verified activity over 6+ months"
              factors={[
                "Historical transaction data",
                "Customer feedback aggregation",
                "License verification status",
                "Real-time activity monitoring",
              ]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
