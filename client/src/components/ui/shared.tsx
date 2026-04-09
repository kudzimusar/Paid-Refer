import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  iconColor?: string;
  iconBg?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconColor = "text-gray-400",
  iconBg = "bg-gray-100",
}: EmptyStateProps) {
  return (
    <div className={cn("empty-state", className)}>
      <div className={cn("empty-state-icon", iconBg)}>
        <Icon className={cn("w-7 h-7", iconColor)} />
      </div>
      <div className="space-y-1.5 mt-1">
        <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// Skeleton loading components
export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 rounded-md", className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("premium-card p-4 space-y-3", className)}>
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-3/4" />
          <SkeletonLine className="w-1/2 h-3" />
        </div>
      </div>
      <SkeletonLine />
      <SkeletonLine className="w-4/5" />
    </div>
  );
}

export function SkeletonStatsTile() {
  return (
    <div className="stats-tile">
      <div className="skeleton h-8 w-12 mx-auto mb-2 rounded" />
      <div className="skeleton h-3 w-16 mx-auto rounded" />
    </div>
  );
}

// Status Badge component
interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active:      { label: "Active",      bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending:     { label: "Pending",     bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  processing:  { label: "Processing",  bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  completed:   { label: "Paid",        bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  failed:      { label: "Failed",      bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500" },
  expired:     { label: "Expired",     bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400" },
  verified:    { label: "Verified",    bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  unverified:  { label: "Unverified",  bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  suspended:   { label: "Suspended",   bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500" },
  grace_period:{ label: "Grace Period",bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  new:         { label: "New",         bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-500" },
  contacted:   { label: "In Progress", bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  in_progress: { label: "In Progress", bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  deal_closed: { label: "Closed",      bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  lost:        { label: "Lost",        bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400" },
  draft:       { label: "Draft",       bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400" },
  rented:      { label: "Rented",      bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  sold:        { label: "Sold",        bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}

// Avatar with initials fallback
interface AvatarInitialsProps {
  name?: string | null;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  isVerified?: boolean;
  className?: string;
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-indigo-500", "bg-teal-500",
];

function hashColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

export function AvatarInitials({ name, imageUrl, size = "md", isVerified, className }: AvatarInitialsProps) {
  const sizeMap = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  const initials = name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";
  const color = name ? hashColor(name) : "bg-gray-400";

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name ?? ""}
          className={cn("rounded-full object-cover", sizeMap[size])}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center text-white font-bold",
            sizeMap[size],
            color
          )}
        >
          {initials}
        </div>
      )}
      {isVerified && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
          <CheckIcon className="w-2 h-2 text-white" />
        </div>
      )}
    </div>
  );
}
