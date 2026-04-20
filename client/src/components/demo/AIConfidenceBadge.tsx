import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Brain, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIConfidenceBadgeProps {
  confidence: number;
  reasoning?: string;
  factors?: string[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AIConfidenceBadge({
  confidence,
  reasoning,
  factors = [],
  size = "md",
  className,
}: AIConfidenceBadgeProps) {
  const getColor = () => {
    if (confidence >= 80) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (confidence >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
    if (confidence >= 40) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const content = (
    <div className="flex items-center gap-1.5">
      <Brain className="h-3 w-3" />
      <span className="font-medium">{confidence}%</span>
      <span className="text-xs opacity-75">AI Confidence</span>
    </div>
  );

  if (!reasoning && factors.length === 0) {
    return (
      <Badge
        variant="outline"
        className={cn(getColor(), sizeClasses[size], className)}
      >
        {content}
      </Badge>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            getColor(),
            sizeClasses[size],
            "cursor-help hover:opacity-80 transition-opacity",
            className
          )}
        >
          {content}
          <Info className="h-3 w-3 ml-1" />
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-sm flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Decision Details
            </p>
          </div>

          {reasoning && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Reasoning:
              </p>
              <p className="text-sm leading-relaxed">{reasoning}</p>
            </div>
          )}

          {factors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Factors Considered:
              </p>
              <ul className="space-y-1">
                {factors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-3 border-t">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium">Confidence Score</span>
              <span className="font-bold">{confidence}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  confidence >= 80 && "bg-emerald-500",
                  confidence >= 60 && confidence < 80 && "bg-blue-500",
                  confidence >= 40 && confidence < 60 && "bg-amber-500",
                  confidence < 40 && "bg-red-500"
                )}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
