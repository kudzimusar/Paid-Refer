import { useMarketContext, type Market } from "@/contexts/MarketContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function MarketSwitcher() {
  const { currentMarket, config, switchMarket } = useMarketContext();

  const markets: Array<{ key: Market; name: string; flag: string }> = [
    { key: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
    { key: "ZA", name: "South Africa", flag: "🇿🇦" },
    { key: "JP", name: "Japan", flag: "🇯🇵" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <span className="text-lg">{config.flag}</span>
          <span className="hidden sm:inline">{config.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {markets.map((market) => (
          <DropdownMenuItem
            key={market.key}
            onClick={() => switchMarket(market.key)}
            className={currentMarket === market.key ? "bg-accent" : ""}
          >
            <span className="mr-2">{market.flag}</span>
            {market.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
