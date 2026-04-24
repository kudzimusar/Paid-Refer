import { useState, useMemo } from "react";
import { Calculator, DollarSign, Percent, Calendar, ArrowRight, TrendingUp, Landmark, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useMarketContext } from "@/contexts/MarketContext";

export function MortgageCalculator() {
  const { currentMarket: market } = useMarketContext();
  const [propertyPrice, setPropertyPrice] = useState(150000);
  const [downPayment, setDownPayment] = useState(30000);
  const [interestRate, setInterestRate] = useState(market === 'ZW' ? 12 : 7);
  const [loanTerm, setLoanTerm] = useState(25);

  const monthlyPayment = useMemo(() => {
    const principal = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );
  }, [propertyPrice, downPayment, interestRate, loanTerm]);

  const currency = market === 'ZW' ? 'USD' : market === 'ZA' ? 'ZAR' : 'JPY';

  return (
    <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
      <div className="bg-primary p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Landmark className="w-5 h-5 text-blue-200" />
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Embedded Finance Hub</p>
          </div>
          <h3 className="text-2xl font-black mb-1">Mortgage Planner</h3>
          <p className="text-xs text-blue-100/80">AI-matched lender rates for {market === 'ZW' ? 'Zimbabwean' : 'International'} markets</p>
        </div>
      </div>

      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Property Price</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">{currency}</div>
                <Input 
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="pl-14 h-14 bg-neutral-50 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Down Payment</label>
                <span className="text-xs font-bold text-primary">{Math.round((downPayment / propertyPrice) * 100)}%</span>
              </div>
              <Slider 
                value={[downPayment]} 
                max={propertyPrice} 
                step={1000} 
                onValueChange={([val]) => setDownPayment(val)}
                className="py-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Interest Rate</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="h-12 bg-neutral-50 border-none rounded-xl font-bold" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"><Percent className="w-4 h-4" /></div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Loan Term</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={loanTerm} 
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="h-12 bg-neutral-50 border-none rounded-xl font-bold" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"><Calendar className="w-4 h-4" /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-[2rem] p-8 flex flex-col justify-center text-center space-y-6 border border-neutral-100">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Estimated Monthly Payment</p>
              <motion.div 
                key={monthlyPayment}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black text-neutral-900"
              >
                {currency} {Math.round(monthlyPayment).toLocaleString()}
              </motion.div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full justify-center border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                AI LENDER MATCHING ACTIVE
              </div>
              <p className="text-xs text-neutral-500 px-4">Based on your profile, you qualify for a <span className="font-bold text-neutral-900">1.5% rate discount</span> via PrimeBank.</p>
            </div>

            <Button className="w-full bg-neutral-900 hover:bg-black text-white h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl">
              Get Pre-Approved <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between text-neutral-400 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Market Outlook: Stable</span>
          </div>
          <div className="text-[10px] font-bold">Powered by Refer 2.0 Finance</div>
        </div>
      </CardContent>
    </Card>
  );
}
