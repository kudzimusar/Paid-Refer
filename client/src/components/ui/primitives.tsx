import { cn } from "@/lib/utils";

interface ChipSelectorProps {
  options: { label: string; value: string; icon?: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  color?: "blue" | "green" | "purple";
  maxSelect?: number;
  className?: string;
}

export function ChipSelector({
  options,
  selected,
  onChange,
  color = "blue",
  maxSelect,
  className,
}: ChipSelectorProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      if (maxSelect && selected.length >= maxSelect) return;
      onChange([...selected, value]);
    }
  };

  const selectedClass = {
    blue:   "chip-selected",
    green:  "chip-selected-green",
    purple: "chip-selected-purple",
  }[color];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              "chip transition-all",
              isSelected ? selectedClass : "chip-default"
            )}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// Counter input (− / N / +)
interface CounterProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  label?: string;
}

export function Counter({ value, min = 0, max = 99, onChange, label }: CounterProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm font-medium text-neutral-700 flex-1">{label}</span>}
      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 flex items-center justify-center text-lg text-gray-500 hover:bg-gray-50 transition-colors font-bold"
        >
          −
        </button>
        <span className="w-10 text-center font-semibold text-sm">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 flex items-center justify-center text-lg text-primary hover:bg-blue-50 transition-colors font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}

// Step progress bar
interface StepProgressProps {
  current: number;
  total: number;
  labels?: string[];
}

export function StepProgress({ current, total, labels }: StepProgressProps) {
  const pct = ((current - 1) / (total - 1)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-500 font-medium">
          Step {current} of {total}
        </span>
        {labels && (
          <span className="text-xs font-semibold text-primary">
            {labels[current - 1]}
          </span>
        )}
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: "var(--gradient-primary)",
          }}
        />
      </div>
    </div>
  );
}

// Section title with optional action
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  count?: number;
}

export function SectionTitle({ title, subtitle, action, count }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-neutral-900">{title}</h2>
          {count !== undefined && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Formatted currency amount
interface CurrencyProps {
  amount: number | string;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", ZAR: "R", JPY: "¥", GBP: "£", EUR: "€"
};

export function CurrencyAmount({ amount, currency = "USD", size = "md", className }: CurrencyProps) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const formatted = currency === "JPY"
    ? num.toLocaleString("ja-JP")
    : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const sizeMap = { sm: "text-sm", md: "text-base", lg: "text-xl font-bold", xl: "text-3xl font-extrabold" };

  return (
    <span className={cn(sizeMap[size], className)}>
      {symbol}{formatted}
    </span>
  );
}
