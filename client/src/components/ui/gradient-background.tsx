interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className = "" }: GradientBackgroundProps) {
  return (
    <div className={`bg-gradient-to-br from-primary/[0.04] to-secondary/[0.04] ${className}`}>
      {children}
    </div>
  );
}
