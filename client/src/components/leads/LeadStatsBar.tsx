interface Stats {
  total: number;
  new: number;
  inProgress: number;
  closedThisMonth: number;
  expiringIn24h: number;
  totalUnread: number;
}

export function LeadStatsBar({ stats }: { stats: Stats }) {
  const items = [
    {
      label: "New leads",
      value: stats.new,
      icon: "🔥",
      color: "bg-orange-50 border-orange-200 text-orange-700",
      urgent: stats.new > 0,
    },
    {
      label: "In progress",
      value: stats.inProgress,
      icon: "💬",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      urgent: false,
    },
    {
      label: "Unread messages",
      value: stats.totalUnread,
      icon: "📩",
      color: "bg-violet-50 border-violet-200 text-violet-700",
      urgent: stats.totalUnread > 0,
    },
    {
      label: "Expiring soon",
      value: stats.expiringIn24h,
      icon: "⏰",
      color: "bg-red-50 border-red-200 text-red-700",
      urgent: stats.expiringIn24h > 0,
    },
    {
      label: "Closed this month",
      value: stats.closedThisMonth,
      icon: "✅",
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
      urgent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-xl border px-4 py-3 flex items-center gap-3
                      ${item.color}
                      ${item.urgent ? "ring-2 ring-offset-1 ring-current/20" : ""}`}
        >
          <span className="text-2xl">{item.icon}</span>
          <div>
            <p className="text-2xl font-bold leading-none">{item.value}</p>
            <p className="text-xs mt-0.5 opacity-75">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
