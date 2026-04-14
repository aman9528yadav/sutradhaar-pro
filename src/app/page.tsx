"use client";

import React, { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Flame,
  Calculator,
  BookText,
  History,
  Newspaper,
  Languages,
  ArrowRightLeft,
  Star,
  Calendar,
  Timer,
  Hourglass,
  Settings,
  Bug,
  User,
  Share2,
  Bot,
  CheckSquare,
  ChevronDown,
  Info,
  Wallet,
  BarChart2,
  Gem,
  Sparkles,
  Wrench,
  Rocket,
  Wand2,
  ChevronUp,
  DollarSign,
  Percent,
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { useMaintenance } from '@/context/MaintenanceContext';
import { DashboardBanner } from '@/components/dashboard-banner';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { WelcomeDialog } from '@/components/welcome-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/page-transition';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ModernSidebar } from '@/components/modern-sidebar';
import { DashboardRevamped } from '@/components/dashboard-revamped';

// Lazy load heavy components for better performance
const WeeklySummaryChart = dynamic(() => import('@/components/weekly-summary-chart').then(mod => ({ default: mod.WeeklySummaryChart })), {
  loading: () => <div className="h-64 animate-pulse bg-card/50 rounded-xl" />,
  ssr: false
});

const AnalyticsPage = dynamic(() => import('@/components/analytics-page').then(mod => ({ default: mod.AnalyticsPage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const CalculatorComponent = dynamic(() => import('@/components/calculator').then(mod => ({ default: mod.Calculator })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const SettingsPage = dynamic(() => import('@/components/settings-page').then(mod => ({ default: mod.SettingsPage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const UnitConverter = dynamic(() => import('@/components/unit-converter').then(mod => ({ default: mod.UnitConverter })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const DateCalculator = dynamic(() => import('@/components/date-calculator').then(mod => ({ default: mod.DateCalculator })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const TimerComponent = dynamic(() => import('@/components/timer').then(mod => ({ default: mod.Timer })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const StopwatchComponent = dynamic(() => import('@/components/stopwatch-modern').then(mod => ({ default: mod.StopwatchModern })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const BudgetTrackerPage = dynamic(() => import('@/components/budget-tracker-page').then(mod => ({ default: mod.BudgetTrackerPage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const NotesPage = dynamic(() => import('@/components/notes-page').then(mod => ({ default: mod.NotesPage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const HistoryPage = dynamic(() => import('@/components/history-page').then(mod => ({ default: mod.HistoryPage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const AboutPage = dynamic(() => import('@/components/about-page').then(mod => ({ default: mod.AboutPage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const MembershipPage = dynamic(() => import('@/app/membership/page'), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const ToolsPage = dynamic(() => import('@/components/tools-page').then(mod => ({ default: mod.ToolsPage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const ProfilePage = dynamic(() => import('@/components/profile-page').then(mod => ({ default: mod.ProfilePage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const TodoPage = dynamic(() => import('@/components/todo-page').then(mod => ({ default: mod.TodoPage })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});
const LoanCalculator = dynamic(() => import('@/components/loan-calculator-modern').then(mod => ({ default: mod.LoanCalculatorModern })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const DiscountCalculator = dynamic(() => import('@/components/discount-calculator').then(mod => ({ default: mod.DiscountCalculator })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

import { quickAccessItems, moreAccessItems } from '@/lib/navigation-items';

const iconMap: { [key: string]: any } = {
  Wrench,
  Rocket,
  User,
  Languages,
  Bug,
  Sparkles,
  Wand2,
  Share2,
  Bot,
};




export default function DashboardPage() {
  const { isLoading: isMaintenanceLoading } = useMaintenance();
  const { isLoading: isProfileLoading } = useProfile();
  const [isCalculatorFullScreen, setIsCalculatorFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const isPageLoading = isMaintenanceLoading || isProfileLoading;

  const handleNavigate = (tab: string) => {
    if (tab === 'login') {
      router.push('/login');
      return;
    }
    setActiveTab(tab);
  };

  if (isCalculatorFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="w-full max-w-[412px] h-full flex flex-col justify-center p-4">
          <CalculatorComponent isFullScreen={isCalculatorFullScreen} onToggleFullScreen={() => setIsCalculatorFullScreen(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex-1 flex flex-col h-screen overflow-hidden">
      <ModernSidebar activeTab={activeTab} onNavigate={handleNavigate} />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth">
          <TabsContent value="dashboard" className="p-4 pb-24 space-y-6 mt-0 h-full">
            <PageTransition>
              {isPageLoading ? <DashboardSkeleton /> : <DashboardRevamped onNavigate={handleNavigate} />}
            </PageTransition>
          </TabsContent>
          <TabsContent value="tools" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <ToolsPage onToolSelect={handleNavigate} />
            </PageTransition>
          </TabsContent>
          <TabsContent value="profile" className="mt-0 h-full">
            <PageTransition>
              <ProfilePage onNavigate={handleNavigate} />
            </PageTransition>
          </TabsContent>
          <TabsContent value="settings" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <SettingsPage />
            </PageTransition>
          </TabsContent>

          {/* Tool Pages */}
          <TabsContent value="converter" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <UnitConverter />
            </PageTransition>
          </TabsContent>
          <TabsContent value="calculator" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <CalculatorComponent onToggleFullScreen={() => setIsCalculatorFullScreen(true)} />
            </PageTransition>
          </TabsContent>
          <TabsContent value="loan-calculator" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <LoanCalculator />
            </PageTransition>
          </TabsContent>
          <TabsContent value="discount-calculator" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <DiscountCalculator />
            </PageTransition>
          </TabsContent>
          <TabsContent value="date-calculator" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <DateCalculator />
            </PageTransition>
          </TabsContent>
          <TabsContent value="timer" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <TimerComponent />
            </PageTransition>
          </TabsContent>
          <TabsContent value="stopwatch" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <StopwatchComponent />
            </PageTransition>
          </TabsContent>
          <TabsContent value="budget-tracker" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <BudgetTrackerPage />
            </PageTransition>
          </TabsContent>
          <TabsContent value="notes" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <NotesPage />
            </PageTransition>
          </TabsContent>
          <TabsContent value="history" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <HistoryPage />
            </PageTransition>
          </TabsContent>
          <TabsContent value="analytics" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <AnalyticsPage />
            </PageTransition>
          </TabsContent>
          <TabsContent value="membership" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <MembershipPage />
            </PageTransition>
          </TabsContent>
          <TabsContent value="about" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <AboutPage />
            </PageTransition>
          </TabsContent>
          <TabsContent value="todo" className="p-4 pb-24 mt-0 h-full">
            <PageTransition>
              <TodoPage />
            </PageTransition>
          </TabsContent>
        </div>

        <BottomNavigation activeTab={activeTab} onTabChange={handleNavigate} />
      </Tabs>
    </div>
  );
}
