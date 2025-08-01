import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export function StatsCard({ title, value, subtitle, color = 'primary', className = "" }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary/5 text-primary',
    secondary: 'bg-secondary/5 text-secondary',
    accent: 'bg-accent/5 text-accent'
  };

  return (
    <Card className={`p-4 text-center ${colorClasses[color]} ${className}`}>
      <div className={`text-2xl font-bold ${color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-accent'}`}>
        {value}
      </div>
      <div className="text-xs text-neutral-600">{title}</div>
      {subtitle && <div className="text-xs text-neutral-500 mt-1">{subtitle}</div>}
    </Card>
  );
}
