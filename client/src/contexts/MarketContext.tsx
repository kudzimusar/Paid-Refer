import { createContext, useContext, useState, type ReactNode, useEffect } from "react";

type Market = "ZW" | "ZA" | "JP";

export interface MarketConfig {
  market: Market;
  currency: string;
  currencySymbol: string;
  propertyTypes: string[];
  language: string;
  primaryChannel: string;
  paymentMethod: string;
  locations: string[];
  flag: string;
  name: string;
}

interface MarketContextType {
  currentMarket: Market;
  config: MarketConfig;
  switchMarket: (market: Market) => void;
}

const MARKET_CONFIGS: Record<Market, MarketConfig> = {
  ZW: {
    market: "ZW",
    currency: "USD",
    currencySymbol: "$",
    propertyTypes: ["Stand", "Cluster Home", "Flat", "Townhouse", "Commercial"],
    language: "en-ZW",
    primaryChannel: "WhatsApp",
    paymentMethod: "Paynow/EcoCash",
    locations: ["Borrowdale", "Mount Pleasant", "Avondale", "Highlands", "Marlborough"],
    flag: "🇿🇼",
    name: "Zimbabwe"
  },
  ZA: {
    market: "ZA",
    currency: "ZAR",
    currencySymbol: "R",
    propertyTypes: ["Sectional Title", "Full Title", "Townhouse", "Apartment", "Penthouse"],
    language: "en-ZA",
    primaryChannel: "WhatsApp",
    paymentMethod: "Stripe",
    locations: ["Sandton", "Rosebank", "Waterfront", "Camps Bay", "Umhlanga"],
    flag: "🇿🇦",
    name: "South Africa"
  },
  JP: {
    market: "JP",
    currency: "JPY",
    currencySymbol: "¥",
    propertyTypes: ["1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3LDK", "4LDK"],
    language: "ja-JP",
    primaryChannel: "LINE",
    paymentMethod: "Stripe",
    locations: ["Shibuya", "Shinjuku", "Roppongi", "Ginza", "Akihabara", "Meguro"],
    flag: "🇯🇵",
    name: "Japan"
  }
};

const MarketContext = createContext<MarketContextType | null>(null);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [currentMarket, setCurrentMarket] = useState<Market>(() => {
    const saved = localStorage.getItem("demo_market");
    return (saved as Market) || "ZW";
  });

  const config = MARKET_CONFIGS[currentMarket];

  useEffect(() => {
    localStorage.setItem("demo_market", currentMarket);
  }, [currentMarket]);

  const switchMarket = (market: Market) => {
    setCurrentMarket(market);
  };

  return (
    <MarketContext.Provider value={{ currentMarket, config, switchMarket }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarketContext() {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarketContext must be inside MarketProvider");
  return ctx;
}
