import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
  hover?: boolean;
  delay?: number;
}

export function PremiumCard({ 
  children, 
  className, 
  gradient = false, 
  hover = true,
  delay = 0,
  ...props 
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "relative group rounded-3xl overflow-hidden border bg-white shadow-sm transition-shadow hover:shadow-xl",
        gradient && "bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20",
        className
      )}
      {...props}
    >
      {/* Subtle shine effect on hover */}
      {hover && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(400px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(59,130,246,0.06),transparent)]" />
      )}
      
      <div className="relative p-6">
        {children}
      </div>
    </motion.div>
  );
}

export function PremiumBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50",
      className
    )}>
      {children}
    </span>
  );
}
