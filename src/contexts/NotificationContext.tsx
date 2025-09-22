
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'mate_request' | 'message' | 'post_interaction' | 'research_update' | 'event_reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  userAvatar?: string;
  userName?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const demoNotifications: Notification[] = [
  {
    id: '1',
    type: 'mate_request',
    title: 'New Mate Request',
    message: 'Dr. Sarah Wilson wants to connect with you',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: '/mates',
    userName: 'Dr. Sarah Wilson'
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Dr. Michael Chen sent you a message about the research paper',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    actionUrl: '/messages',
    userName: 'Dr. Michael Chen'
  },
  {
    id: '3',
    type: 'post_interaction',
    title: 'Post Interaction',
    message: 'Dr. Emily Davis liked your post about cardiac surgery techniques',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: true,
    actionUrl: '/feed',
    userName: 'Dr. Emily Davis'
  },
  {
    id: '4',
    type: 'research_update',
    title: 'Research Update',
    message: 'New papers in Cardiology matching your interests',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: false,
    actionUrl: '/research'
  },
  {
    id: '5',
    type: 'event_reminder',
    title: 'Event Reminder',
    message: 'Medical Conference 2024 starts tomorrow',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionUrl: '/events'
  }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
