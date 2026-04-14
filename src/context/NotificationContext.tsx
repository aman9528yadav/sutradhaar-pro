

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useProfile } from './ProfileContext';

export type Notification = {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile.settings.enableNotifications) {
      setNotifications([]);
      return;
    }
    try {
      const savedNotifications = localStorage.getItem('sutradhaar_notifications');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications) as Notification[];
        setNotifications(parsed);
      }
    } catch (e) {
        console.error("Failed to load notifications from local storage", e);
    }
  }, [profile.settings.enableNotifications]);

  // Check if Do Not Disturb mode is active
  const isDoNotDisturbActive = useCallback(() => {
    if (!profile.settings.doNotDisturbHours?.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = profile.settings.doNotDisturbHours.start?.split(':').map(Number) || [22, 0];
    const [endHour, endMinute] = profile.settings.doNotDisturbHours.end?.split(':').map(Number) || [7, 0];
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    if (startTime <= endTime) {
      // Same day range (e.g. 9 AM to 9 PM)
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight range (e.g. 10 PM to 7 AM)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }, [profile.settings.doNotDisturbHours]);

  useEffect(() => {
    if (!profile.settings.enableNotifications) return;
    try {
        localStorage.setItem('sutradhaar_notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    } catch (e) {
        console.error("Failed to save notifications to local storage", e);
    }
  }, [notifications, profile.settings.enableNotifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read'>) => {
    if (!profile.settings.enableNotifications) return;
    
    // Check if Do Not Disturb is active
    if (isDoNotDisturbActive()) {
      return; // Don't show notification during Do Not Disturb hours
    }
    
    // Check notification category settings
    const notificationType = notification.title.toLowerCase();
    if (notificationType.includes('reminder') && profile.settings.notificationCategories?.reminders === false) {
      return;
    }
    if (notificationType.includes('update') && profile.settings.notificationCategories?.updates === false) {
      return;
    }
    if (notificationType.includes('achievement') && profile.settings.notificationCategories?.achievements === false) {
      return;
    }
    
    setNotifications(prev => {
        const alreadyExists = prev.some(n => n.timestamp === notification.timestamp);
        if (alreadyExists) {
            return prev;
        }
        const newNotification: Notification = {
          ...notification,
          id: `${notification.timestamp}-${Math.random().toString(36).substring(2, 9)}`,
          read: false,
        };
        if (profile.settings.enableSounds) {
            const audio = new Audio('/sound/new-notification-09-352705.mp3');
            audio.play().catch(e => console.error("Failed to play notification sound.", e));
        }
        
        // If email notifications are enabled, send an email notification
        if (profile.settings.enableEmailNotifications) {
          // In a real app, this would trigger an email notification
          // For now, we'll just log it
          console.log('Sending email notification:', newNotification);
        }
        
        return [newNotification, ...prev].slice(0, 20); // Keep last 20
    });
  }, [profile.settings.enableNotifications, profile.settings.enableSounds, profile.settings.notificationCategories, profile.settings.enableEmailNotifications, isDoNotDisturbActive]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      if (prev.some(n => !n.read)) {
        return prev.map(n => ({ ...n, read: true }));
      }
      return prev;
    });
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead, removeNotification, clearAllNotifications }}>
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
