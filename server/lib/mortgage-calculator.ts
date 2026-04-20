export interface MortgageScenario {
  propertyPrice: number;
  depositPercent: number;
  depositAmount: number;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyRepayment: number;
  totalRepayable: number;
  totalInterest: number;
  affordabilityRating: "affordable" | "stretch" | "not_recommended";
}

export function calculateMortgage(
  propertyPrice: number,
  depositPercent: number,
  interestRatePercent: number,
  termYears: number,
  monthlyIncome: number
): MortgageScenario {
  const depositAmount = propertyPrice * (depositPercent / 100);
  const loanAmount = propertyPrice - depositAmount;
  const monthlyRate = interestRatePercent / 100 / 12;
  const numPayments = termYears * 12;

  const monthlyRepayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const debtToIncomeRatio = monthlyRepayment / monthlyIncome;

  return {
    propertyPrice,
    depositPercent,
    depositAmount,
    loanAmount,
    interestRate: interestRatePercent,
    termYears,
    monthlyRepayment: Math.round(monthlyRepayment),
    totalRepayable: Math.round(monthlyRepayment * numPayments),
    totalInterest: Math.round(monthlyRepayment * numPayments - loanAmount),
    affordabilityRating:
      debtToIncomeRatio <= 0.28 ? "affordable" :
      debtToIncomeRatio <= 0.36 ? "stretch" :
      "not_recommended",
  };
}

// Country-specific lender referrals
export const LENDER_PARTNERS = {
  ZA: [
    { name: "Absa Home Loans", rate: 11.75, referralUrl: "https://absa.co.za/homeloan", commissionPercent: 0.5 },
    { name: "Standard Bank", rate: 11.75, referralUrl: "https://standardbank.co.za", commissionPercent: 0.5 },
    { name: "Nedbank", rate: 11.5, referralUrl: "https://nedbank.co.za", commissionPercent: 0.4 },
  ],
  ZW: [
    { name: "CBZ Bank", rate: 18, referralUrl: "https://cbzbank.co.zw", commissionPercent: 0.3 },
    { name: "Steward Bank", rate: 20, referralUrl: "https://stewardbank.co.zw", commissionPercent: 0.3 },
  ],
  JP: [
    { name: "SMBC Housing Loan", rate: 0.475, referralUrl: "https://smbc.co.jp", commissionPercent: 0.2 },
    { name: "Flat 35 (JHFA)", rate: 1.8, referralUrl: "https://jhf.go.jp", commissionPercent: 0.1 },
  ],
};
