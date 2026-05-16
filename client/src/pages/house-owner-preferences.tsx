import { useState } from "react";

export default function HouseOwnerPreferencesPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  return (
    <div className="min-h-screen bg-neutral-50 p-6 pb-24">
      <div className="max-w-lg mx-auto premium-card p-6 space-y-4">
        <h1 className="text-xl font-bold">System Preferences</h1>
        <label className="flex items-center justify-between text-sm font-medium">
          Email Alerts
          <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
        </label>
      </div>
    </div>
  );
}
