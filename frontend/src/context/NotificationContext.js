import React, { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(() => {
    const stored = localStorage.getItem("unreadNotifications");
    return stored ? Number(stored) : 0;
  });

  const [loading, setLoading] = useState(false);

  // Persist count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("unreadNotifications", String(unreadCount));
  }, [unreadCount]);

  // Increment count (for demo/manual triggers)
  const increment = () => {
    setUnreadCount((prev) => prev + 1);
  };

  // Decrement count (optional)
  const decrement = () => {
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  // Optional: simulate a fetch (no-op here)
  const fetchUnreadCount = () => {
    // No backend call; count is already from localStorage
  };

  return (
    <NotificationContext.Provider
      value={{ unreadCount, loading, fetchUnreadCount, markAllAsRead, increment, decrement }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
