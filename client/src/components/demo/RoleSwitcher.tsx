import { useDemoMode } from "@/contexts/DemoModeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Play, Pause } from "lucide-react";

export function RoleSwitcher() {
  const { demoRole, switchDemoRole, isGuidedMode, toggleGuidedMode, isDemoMode } =
    useDemoMode();

  if (!isDemoMode) return null;

  const roleEmojis: Record<string, string> = {
    referrer: "🔗",
    customer: "🏠",
    agent: "👔",
    admin: "🛡️",
  };

  const roleNames: Record<string, string> = {
    referrer: "Referrer",
    customer: "Customer",
    agent: "Agent",
    admin: "Admin",
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge
            variant="outline"
            className="cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white gap-2 px-3 py-1.5 animate-pulse"
          >
            <span>{roleEmojis[demoRole]}</span>
            <span className="text-xs font-medium">Demo: {roleNames[demoRole]}</span>
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {Object.entries(roleEmojis).map(([role, emoji]) => (
            <DropdownMenuItem
              key={role}
              onClick={() => switchDemoRole(role as any)}
              className={demoRole === role ? "bg-accent" : ""}
            >
              <span className="mr-2">{emoji}</span>
              {roleNames[role]}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleGuidedMode} className="gap-2">
            {isGuidedMode ? (
              <>
                <Pause className="h-4 w-4" />
                Exit Guided Tour
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Guided Tour
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
