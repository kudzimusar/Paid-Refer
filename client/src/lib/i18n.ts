import { useAuthContext } from "../contexts/AuthContext";

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
  },
};

export function t(key: string, locale: Locale): string {
  return translations[locale]?.[key] || translations["en-ZW"][key] || key;
}

export function useTranslation() {
  const { user } = useAuthContext();
  const locale = (user?.country === "JP"
    ? "ja-JP"
    : user?.country === "ZA"
    ? "en-ZA"
    : "en-ZW") as Locale;

  return { 
    t: (key: string) => t(key, locale), 
    locale 
  };
}
