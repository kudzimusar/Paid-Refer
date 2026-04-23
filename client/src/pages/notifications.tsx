import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2, MessageSquare, Zap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "match" | "message" | "system" | "status";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "match": return <Zap className="w-5 h-5 text-amber-500" />;
      case "message": return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "status": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-neutral-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/search">
            <button className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">Alerts</h1>
        </div>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "border-none shadow-sm transition-all hover:shadow-md cursor-pointer",
                !notification.isRead && "bg-blue-50/30 ring-1 ring-blue-100"
              )}
            >
              <CardContent className="p-4 flex items-start space-x-4">
                <div className={cn(
                  "p-2 rounded-xl",
                  notification.type === 'match' && "bg-amber-100/50",
                  notification.type === 'message' && "bg-blue-100/50",
                  notification.type === 'status' && "bg-green-100/50",
                  notification.type === 'system' && "bg-neutral-100/50",
                )}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-neutral-900 text-sm">{notification.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-neutral-300" />
            </div>
            <h3 className="font-bold text-neutral-900">All caught up!</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Check back later for updates on your property search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
