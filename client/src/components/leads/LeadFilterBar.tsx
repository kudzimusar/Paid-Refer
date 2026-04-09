import { type LeadFilters } from "../../hooks/useLeads";

interface Props {
  filters: LeadFilters;
  onChange: (f: LeadFilters) => void;
  totalCount: number;
}

export function LeadFilterBar({ filters, onChange, totalCount }: Props) {
  const update = (key: keyof LeadFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Search */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search by name, location, property type..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200
                     text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                     focus:border-indigo-400 bg-white"
        />
      </div>

      {/* Status filter */}
      <select
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        <option value="all">All statuses</option>
        <option value="new">New</option>
        <option value="pending_response">Pending response</option>
        <option value="in_progress">In progress</option>
        <option value="deal_closed">Closed</option>
        <option value="lost">Lost</option>
        <option value="expired">Expired</option>
      </select>

      {/* Urgency filter */}
      <select
        value={filters.urgency}
        onChange={(e) => update("urgency", e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        <option value="all">All urgency</option>
        <option value="premium">Premium 🔥</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={(e) => update("sortBy", e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        <option value="newest">Newest first</option>
        <option value="score">AI score</option>
        <option value="expiring">Expiring soon</option>
        <option value="unread">Unread first</option>
      </select>

      <span className="hidden sm:flex items-center text-sm text-gray-400 whitespace-nowrap px-2">
        {totalCount} leads
      </span>
    </div>
  );
}
