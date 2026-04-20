import { useAuthContext } from "../contexts/AuthContext";
import { useMemo } from "react";

type Locale = "en-ZW" | "en-ZA" | "ja-JP";

const translations: Record<Locale, Record<string, string>> = {
  "en-ZW": {
    "find_agent": "Find an Agent",
    "budget": "Budget (USD)",
    "property_type": "Property Type",
    "bedrooms": "Bedrooms",
    "move_in": "Move-in Date",
    "submit_request": "Find My Agent",
    "currency_symbol": "$",
    "payment_method": "EcoCash / USD Bank",
    "stand": "Stand / Plot",
    "cluster_home": "Cluster Home",
    "rent": "Rent",
    "buy": "Buy",
    "notifications": "Notifications",
    "settings": "Settings",
    "profile": "Profile",
    "earnings": "Earnings",
    "refer_earn": "Refer & Earn",
  },
  "en-ZA": {
    "find_agent": "Find an Agent",
    "budget": "Budget (ZAR)",
    "property_type": "Property Type",
    "bedrooms": "Bedrooms",
    "move_in": "Move-in Date",
    "submit_request": "Find My Agent",
    "currency_symbol": "R",
    "payment_method": "South African Bank Account",
    "sectional_title": "Sectional Title",
    "full_title": "Full Title",
    "rent": "Rent",
    "buy": "Buy",
    "notifications": "Notifications",
    "settings": "Settings",
    "profile": "Profile",
    "earnings": "Earnings",
    "refer_earn": "Refer & Earn",
  },
  "ja-JP": {
    "find_agent": "エージェントを探す",
    "budget": "予算（円）",
    "property_type": "物件タイプ",
    "bedrooms": "寝室数",
    "move_in": "入居希望日",
    "submit_request": "エージェントを探す",
    "currency_symbol": "¥",
    "payment_method": "日本の銀行口座",
    "key_money": "礼金",
    "security_deposit": "敷金",
    "management_fee": "管理費",
    "rent": "賃貸",
    "buy": "購入",
    "notifications": "お知らせ",
    "settings": "設定",
    "profile": "プロフィール",
    "earnings": "報酬",
    "refer_earn": "紹介して稼ぐ",
  },
};

export function useI18n() {
  const { user } = useAuthContext();
  
  const locale = useMemo(() => {
    if (user?.country === "JP") return "ja-JP";
    if (user?.country === "ZA") return "en-ZA";
    return "en-ZW";
  }, [user?.country]) as Locale;

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations["en-ZW"][key] || key;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "ja-JP" ? "ja-JP" : "en-US", {
      style: "currency",
      currency: user?.country === "JP" ? "JPY" : user?.country === "ZA" ? "ZAR" : "USD",
    }).format(amount);
  };

  return { t, locale, formatCurrency };
}
