import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AIConfidenceBadge } from "@/components/demo/AIConfidenceBadge";
import { AlertCircle, TrendingUp, Zap, CheckCircle2 } from "lucide-react";

interface DealPredictionCardProps {
  closingProbability: number;
  insights?: string[];
  recommendations?: string[];
  expectedCommission?: { min: number; max: number };
  currency?: string;
}

export function DealPredictionCard({
  closingProbability,
  insights = [],
  recommendations = [],
  expectedCommission,
  currency = "$",
}: DealPredictionCardProps) {
  const defaultInsights = insights.length
    ? insights
    : [
        "Budget ($800-900) matches typical Borrowdale rates",
        "Customer specified 'urgent' - likely to close within 2 weeks",
        "Pre-approved financing mentioned - serious buyer",
        "Similar customer profiles have 85% close rate",
      ];

  const defaultRecommendations = recommendations.length
    ? recommendations
    : ["Respond within 2 hours", "Highlight pet-friendly units", "Offer virtual tour first"];

  const defaultCommission = expectedCommission || { min: 850, max: 950 };

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <span>🔮</span> AI Deal Prediction
            </CardTitle>
            <CardDescription>Advanced lead intelligence powered by machine learning</CardDescription>
          </div>
          <AIConfidenceBadge confidence={88} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Closing Probability */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Closing Probability</span>
            <span className="text-2xl font-bold text-emerald-600">{closingProbability}%</span>
          </div>
          <Progress value={closingProbability} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {closingProbability >= 80
              ? "High likelihood • Strong signals"
              : closingProbability >= 60
              ? "Moderate likelihood • Mixed signals"
              : "Low likelihood • Needs nurturing"}
          </p>
        </div>

        {/* Key Insights */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Key Insights:
          </p>
          <ul className="space-y-1.5">
            {defaultInsights.slice(0, 3).map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Actions */}
        <div>
          <p className="text-sm font-medium mb-2">Recommended Actions:</p>
          <div className="flex flex-wrap gap-2">
            {defaultRecommendations.map((rec, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {rec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expected Commission */}
        <div className="bg-muted p-3 rounded-lg border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Expected Commission:</span>
            <span className="text-lg font-bold text-emerald-600">
              {currency}
              {defaultCommission.min}-{defaultCommission.max}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on property type and market averages
          </p>
        </div>

        {/* Risk Assessment */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-700">
            <p className="font-medium mb-1">⚠️ Note:</p>
            <p>Pet-friendly requirement limits options by ~30%. Recommend showing all 3 matching units.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
