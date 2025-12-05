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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ModernSidebar } from '@/components/modern-sidebar';

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

const StopwatchComponent = dynamic(() => import('@/components/stopwatch').then(mod => ({ default: mod.Stopwatch })), {
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
const LoanCalculator = dynamic(() => import('@/components/loan-calculator').then(mod => ({ default: mod.LoanCalculator })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const DiscountCalculator = dynamic(() => import('@/components/discount-calculator').then(mod => ({ default: mod.DiscountCalculator })), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

export const quickAccessItems = [
  { id: 'notes', icon: BookText, label: 'Notes', href: '/notes', requiresAuth: false, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'loan-calculator', icon: DollarSign, label: 'Loan / EMI', href: '/loan-calculator', requiresAuth: false, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'discount-calculator', icon: Percent, label: 'Discount', href: '/discount-calculator', requiresAuth: false, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'converter', icon: ArrowRightLeft, label: 'Converter', href: '/converter', requiresAuth: false, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'calculator', icon: Calculator, label: 'Calculator', href: '/calculator', requiresAuth: false, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'date-calculator', icon: Calendar, label: 'Date Calc', href: '/date-calculator', requiresAuth: false, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'todo', icon: CheckSquare, label: 'Todo', href: '/todo', requiresAuth: false, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'budget-tracker', icon: Wallet, label: 'Budget', href: '/budget', requiresAuth: false, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'timer', icon: Timer, label: 'Timer', href: '/timer', requiresAuth: false, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'stopwatch', icon: Hourglass, label: 'Stopwatch', href: '/stopwatch', requiresAuth: false, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'history', icon: History, label: 'History', href: '/history', requiresAuth: false, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics', href: '/analytics', requiresAuth: false, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'membership', icon: Gem, label: 'Premium', href: '/membership', requiresAuth: false, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'about', icon: Info, label: 'About', href: '/about', requiresAuth: false, color: 'text-slate-500', bg: 'bg-slate-500/10' },
];

export const moreAccessItems = [
  { id: 'settings', icon: Settings, label: 'Settings', href: '/settings', requiresAuth: false },
  { id: 'profile', icon: User, label: 'Profile', href: '/profile', requiresAuth: false },
];

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

const widgetComponents: Record<string, React.ComponentType<any>> = {
  // recentNote: RecentNoteWidget,
  // pendingTodos: PendingTodosWidget,
  // miniBudget: MiniBudgetWidget,
};

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

function Dashboard({ onNavigate }: DashboardProps) {
  const { maintenanceConfig } = useMaintenance();
  const { profile, checkAndUpdateStreak } = useProfile();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const welcomeSetting = localStorage.getItem('sutradhaar_show_welcome');
    if (welcomeSetting === null || welcomeSetting === 'true') {
      setShowWelcomeDialog(true);
    }
  }, []);


  const handleWelcomeConfirm = (dontShowAgain: boolean) => {
    setShowWelcomeDialog(false);
    if (dontShowAgain) {
      localStorage.setItem('sutradhaar_show_welcome', 'false');
    } else {
      localStorage.setItem('sutradhaar_show_welcome', 'true');
    }
  };

  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  const handleQuickAccessClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    if (item.requiresAuth && !user) {
      setShowLoginDialog(true);
      return;
    }
    // If it's an external link
    if (item.href.startsWith('http')) {
      window.open(item.href, '_blank');
      return;
    }

    // Navigate using the tab system
    const tabId = item.id; // Ensure item.id matches the tab values
    onNavigate(tabId);
  };

  const userQuickAccessItems = useMemo(() => {
    if (!profile.quickAccessOrder || profile.quickAccessOrder.length === 0) {
      return quickAccessItems;
    }

    const allItems = [...quickAccessItems, ...moreAccessItems];
    const defaultItemsMap = new Map(allItems.map(item => [item.id, item]));

    const orderedUserItems = profile.quickAccessOrder
      .map(orderItem => {
        const itemDetails = defaultItemsMap.get(orderItem.id);
        if (itemDetails && !orderItem.hidden) {
          return itemDetails;
        }
        return null;
      })
      .filter(item => item !== null) as (typeof allItems);

    const orderedUserItemIds = new Set(orderedUserItems.map(item => item.id));
    const remainingDefaultItems = allItems.filter(item => !orderedUserItemIds.has(item.id));
    return [...orderedUserItems, ...remainingDefaultItems];

  }, [profile.quickAccessOrder]);

  const orderedWidgets = useMemo(() => {
    if (!profile.dashboardWidgets) return [];
    return profile.dashboardWidgets.filter(w => !w.hidden);
  }, [profile.dashboardWidgets]);

  const orderedLayout = useMemo(() => {
    if (!profile.dashboardLayout) return [];
    return profile.dashboardLayout.filter(l => !l.hidden);
  }, [profile.dashboardLayout]);

  const { updateItems, comingSoonItems, welcomeDialog, aboutPageContent } = maintenanceConfig;
  const { appInfo, ownerInfo } = aboutPageContent;
  const { allTimeActivities = 0, todayActivities = 0, streak = 0 } = profile.stats || {};
  const whatsNewItems = (updateItems || []).slice(0, 3);
  const displayedComingSoonItems = (comingSoonItems || []);

  const dashboardSections: { [key: string]: React.ReactNode } = {
    stats: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3 text-center">
        <Card className="bg-card/50 backdrop-blur-sm border-white/5">
          <CardContent className="p-3 space-y-1 flex flex-col items-center justify-center">
            <div className="p-2 rounded-full bg-yellow-500/10">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-xl font-bold">{allTimeActivities}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-white/5">
          <CardContent className="p-3 space-y-1 flex flex-col items-center justify-center">
            <div className="p-2 rounded-full bg-green-500/10">
              <Calendar className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-xl font-bold">{todayActivities}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Today</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-white/5">
          <CardContent className="p-3 space-y-1 flex flex-col items-center justify-center">
            <div className="p-2 rounded-full bg-red-500/10">
              <Flame className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-xl font-bold">{streak}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    weeklySummary: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-br from-card/50 to-primary/5 border-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Weekly Summary
            </CardTitle>
            <Button asChild variant="link" size="sm" className="text-primary pr-0" onClick={() => onNavigate('analytics')}>
              <span>View Analytics</span>
            </Button>
          </CardHeader>
          <CardContent>
            <WeeklySummaryChart />
          </CardContent>
        </Card>
      </motion.div>
    ),
    quickAccess: (
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Quick Access</h2>
          <Button asChild variant="link" size="sm" className="text-primary pr-0">
            <Link href="/profile/manage-quick-access">Manage</Link>
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          {userQuickAccessItems.slice(0, 12).map((item: any) => (
            <div
              key={item.label}
              onClick={(e) => handleQuickAccessClick(e, item)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className={cn("p-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg", item.bg || 'bg-accent')}>
                <item.icon className={cn("h-6 w-6", item.color || 'text-primary')} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.section>
    ),
    widgets: (
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">My Widgets</h2>
          <Button asChild variant="link" size="sm" className="text-primary pr-0">
            <Link href="/profile/manage-widgets">Manage</Link>
          </Button>
        </div>
        <div className="space-y-4">
          {orderedWidgets.map(widget => {
            const WidgetComponent = widgetComponents[widget.id as keyof typeof widgetComponents];
            return WidgetComponent ? <WidgetComponent key={widget.id} /> : null;
          })}
        </div>
      </motion.section>
    ),
    whatsNew: (
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">What&apos;s New</h2>
          <Button asChild variant="link" size="sm" className="text-primary pr-0">
            <Link href="/whats-new">See all</Link>
          </Button>
        </div>
        <div className="space-y-3">
          {whatsNewItems.map((item) => {
            const ItemIcon = iconMap[item.icon] || Bug;
            return (
              <motion.div key={item.id} whileHover={{ y: -2, scale: 1.02 }}>
                <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className="p-2.5 bg-accent rounded-lg">
                      <ItemIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.section>
    ),
    comingSoon: (
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h2 className="font-semibold mb-2">Coming Soon</h2>
        <ScrollArea className="w-full">
          <div className="flex space-x-3 pb-4">
            {displayedComingSoonItems.map((item) => {
              const ItemIcon = iconMap[item.icon] || Sparkles;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="w-48 shrink-0"
                >
                  <Card className="h-full bg-primary/5 border-primary/20 backdrop-blur-sm">
                    <CardContent className="p-3 flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ItemIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {item.title}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.section>
    ),
    about: (
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <h2 className="font-semibold mb-2">About Sutradhaar</h2>
        <motion.div whileHover={{ y: -2, scale: 1.02 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-white/5">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-lg">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Version {appInfo.version}</h3>
                  <p className="text-sm text-muted-foreground">
                    Built by {ownerInfo.name}
                  </p>
                </div>
              </div>
              <Button asChild variant="link" size="sm" className="text-primary" onClick={() => onNavigate('about')}>
                <span>Learn More</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
    ),
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DashboardBanner />
      </motion.div>

      <div className="space-y-6">
        {orderedLayout.map(item => (
          <div key={item.id}>
            {dashboardSections[item.id]}
          </div>
        ))}
      </div>

      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to access this feature. Please log in to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/login')}>Go to Login</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <WelcomeDialog
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
        onConfirm={handleWelcomeConfirm}
        title={welcomeDialog.title}
        description={welcomeDialog.description}
      />
    </>
  )
}


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
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <TabsContent value="dashboard" className="p-4 pb-24 space-y-6 mt-0 h-full">
            {isPageLoading ? <DashboardSkeleton /> : <Dashboard onNavigate={handleNavigate} />}
          </TabsContent>
          <TabsContent value="tools" className="p-4 pb-24 mt-0 h-full">
            <ToolsPage onToolSelect={handleNavigate} />
          </TabsContent>
          <TabsContent value="profile" className="mt-0 h-full">
            <ProfilePage onNavigate={handleNavigate} />
          </TabsContent>
          <TabsContent value="settings" className="p-4 pb-24 mt-0 h-full">
            <SettingsPage />
          </TabsContent>

          {/* Tool Pages */}
          <TabsContent value="converter" className="p-4 pb-24 mt-0 h-full">
            <UnitConverter />
          </TabsContent>
          <TabsContent value="calculator" className="p-4 pb-24 mt-0 h-full">
            <CalculatorComponent onToggleFullScreen={() => setIsCalculatorFullScreen(true)} />
          </TabsContent>
          <TabsContent value="loan-calculator" className="p-4 pb-24 mt-0 h-full">
            <LoanCalculator />
          </TabsContent>
          <TabsContent value="discount-calculator" className="p-4 pb-24 mt-0 h-full">
            <DiscountCalculator />
          </TabsContent>
          <TabsContent value="date-calculator" className="p-4 pb-24 mt-0 h-full">
            <DateCalculator />
          </TabsContent>
          <TabsContent value="timer" className="p-4 pb-24 mt-0 h-full">
            <TimerComponent />
          </TabsContent>
          <TabsContent value="stopwatch" className="p-4 pb-24 mt-0 h-full">
            <StopwatchComponent />
          </TabsContent>
          <TabsContent value="budget-tracker" className="p-4 pb-24 mt-0 h-full">
            <BudgetTrackerPage />
          </TabsContent>
          <TabsContent value="notes" className="p-4 pb-24 mt-0 h-full">
            <NotesPage />
          </TabsContent>
          <TabsContent value="history" className="p-4 pb-24 mt-0 h-full">
            <HistoryPage />
          </TabsContent>
          <TabsContent value="analytics" className="p-4 pb-24 mt-0 h-full">
            <AnalyticsPage />
          </TabsContent>
          <TabsContent value="membership" className="p-4 pb-24 mt-0 h-full">
            <MembershipPage />
          </TabsContent>
          <TabsContent value="about" className="p-4 pb-24 mt-0 h-full">
            <AboutPage />
          </TabsContent>
          <TabsContent value="todo" className="p-4 pb-24 mt-0 h-full">
            <TodoPage />
          </TabsContent>
        </div>

        <BottomNavigation activeTab={activeTab} onTabChange={handleNavigate} />
      </Tabs>
    </div>
  );
}
