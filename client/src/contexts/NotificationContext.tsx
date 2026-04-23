import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuthContext } from "./AuthContext";
import { isDemoMode } from "@/lib/demoMode";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: "system" | "match" | "conversion" | "payment" | "status";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  sendNotification: (notif: Omit<Notification, "id" | "timestamp" | "isRead">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load from localStorage in demo mode
  useEffect(() => {
    if (isDemoMode() && user) {
      const saved = localStorage.getItem(`notifications_${user.id}`);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        // Initial welcome notification
        const welcome: Notification = {
          id: "welcome_" + Date.now(),
          type: "system",
          title: "Welcome to Refer 2.0! 🚀",
          message: "You're all set to start earning. Check out the Academy to master the system.",
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        setNotifications([welcome]);
      }
    }
  }, [user]);

  // Sync to localStorage
  useEffect(() => {
    if (isDemoMode() && user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const sendNotification = useCallback((notif: Omit<Notification, "id" | "timestamp" | "isRead">) => {
    const newNotif: Notification = {
      ...notif,
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setNotifications(prev => [newNotif, ...prev]);
    
    // Show toast for high priority notifications
    toast({
      title: newNotif.title,
      description: newNotif.message,
    });
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      sendNotification,
      markAsRead,
      markAllAsRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
