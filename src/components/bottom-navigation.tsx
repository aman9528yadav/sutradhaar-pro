"use client";

import React from 'react';
import { Home, Grid, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'tools', icon: Grid, label: 'Tools' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // Helper to determine if a tab is active (handling sub-routes for tools)
  const isTabActive = (itemId: string) => {
    if (itemId === 'tools') {
      // List of tool IDs that should highlight the 'Tools' tab
      const toolIds = ['tools', 'converter', 'calculator', 'loan-calculator', 'discount-calculator', 'date-calculator', 'timer', 'stopwatch', 'budget', 'notes', 'todo', 'history', 'analytics', 'membership', 'about'];
      return toolIds.includes(activeTab);
    }
    return activeTab === itemId;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-[412px] pointer-events-auto">
        <div className="bg-background/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center p-2 pb-4 shadow-2xl">
          {navItems.map((item) => {
            const isActive = isTabActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-16 relative overflow-hidden",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
                )}
                <item.icon className={cn("h-6 w-6 mb-1 z-10 transition-transform duration-300", isActive && "scale-110 fill-current/20")} />
                <span className="text-[10px] font-medium z-10">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
