"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Flame,
    Calendar,
    Star,
    ArrowRight,
    TrendingUp,
    Target,
    Zap,
    Clock,
    MoreHorizontal,
    Plus,
    CheckCircle2,
    Rocket,
} from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { useMaintenance } from '@/context/MaintenanceContext';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { quickAccessItems, moreAccessItems } from '@/lib/navigation-items';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DashboardBanner } from './dashboard-banner';

// Lazy load chart
const WeeklySummaryChart = dynamic(() => import('@/components/weekly-summary-chart').then(mod => ({ default: mod.WeeklySummaryChart })), {
    loading: () => <div className="h-[200px] animate-pulse bg-white/5 rounded-xl" />,
    ssr: false
});

const quotes = [
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Your time is limited, so don't waste it living someone else's life.",
    "The future belongs to those who believe in the beauty of their dreams.",
];

export function DashboardRevamped({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const { profile } = useProfile();
    const { maintenanceConfig } = useMaintenance();
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');
    const [dateString, setDateString] = useState('');
    const [quote, setQuote] = useState('');
    const [focusGoal, setFocusGoal] = useState('Complete project documentation'); // Example state
    const [isFocusCompleted, setIsFocusCompleted] = useState(false);

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) setGreeting('Good Morning');
            else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
            else if (hour >= 17 && hour < 22) setGreeting('Good Evening');
            else setGreeting('Good Night');
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000); // Check every minute

        const date = new Date();
        setDateString(date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));

        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

        return () => clearInterval(interval);
    }, []);

    const { allTimeActivities = 0, todayActivities = 0, streak = 0 } = profile.stats || {};

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

    const userName = user?.displayName || profile.name || 'User';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <DashboardBanner />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{dateString}</h2>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        {greeting}, {userName}
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-lg italic">"{quote}"</p>
                </div>

            </div>

            {/* Stats Row - 3 in one row */}
            <div className="grid grid-cols-3 gap-4">
                <motion.div whileHover={{ scale: 1.01 }} className="group">
                    <Card className="bg-card border-border">
                        <CardContent className="p-4 flex flex-col gap-3">
                            <span className="text-sm font-medium text-muted-foreground">Total Activities</span>
                            <div className="p-2 w-fit bg-primary/20 rounded-xl text-primary">
                                <Star className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{allTimeActivities}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} className="group">
                    <Card className="bg-card border-border">
                        <CardContent className="p-4 flex flex-col gap-3">
                            <span className="text-sm font-medium text-muted-foreground">Today's Activity</span>
                            <div className="p-2 w-fit bg-emerald-500/20 rounded-xl text-emerald-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{todayActivities}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} className="group">
                    <Card className="bg-card border-border">
                        <CardContent className="p-4 flex flex-col gap-3">
                            <span className="text-sm font-medium text-muted-foreground">Current Streak</span>
                            <div className="p-2 w-fit bg-orange-500/20 rounded-xl text-orange-400">
                                <Flame className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{streak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Financial & Task Summary */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.01 }} onClick={() => onNavigate('budget-tracker')} className="cursor-pointer">
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Balance</p>
                                    <h3 className="text-2xl font-bold text-emerald-400">
                                        ₹{profile.budget.accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-IN')}
                                    </h3>
                                </div>
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Monthly Spending</span>
                                    <span className="text-foreground">
                                        ₹{profile.budget.transactions
                                            .filter(t => {
                                                const d = new Date(t.date);
                                                const now = new Date();
                                                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense';
                                            })
                                            .reduce((sum, t) => sum + t.amount, 0)
                                            .toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} onClick={() => onNavigate('todo')} className="cursor-pointer">
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Tasks</p>
                                    <h3 className="text-2xl font-bold text-indigo-400">
                                        {profile.todos.filter(t => !t.completed).length}
                                    </h3>
                                </div>
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">High Priority</span>
                                    <span className="text-red-400">
                                        {profile.todos.filter(t => !t.completed && t.priority === 'high').length} tasks
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Content Stack */}
            <div className="space-y-6">

                {/* Quick Access - Spans full width on mobile, maybe 2 cols on large if needed, but here 3 cols for grid */}
                <div className="md:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Quick Access</h3>
                        <Button variant="link" size="sm" className="text-primary" asChild>
                            <Link href="/profile/manage-quick-access">Customize</Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {userQuickAccessItems.slice(0, 4).map((item: any) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onNavigate(item.id)}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm group-hover:shadow-md",
                                    item.bg || 'bg-accent/50',
                                    "border border-white/5"
                                )}>
                                    <item.icon className={cn("w-6 h-6", item.color || 'text-foreground')} />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center line-clamp-1">
                                    {item.label}
                                </span>
                            </motion.button>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('tools')}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-accent/30 border border-white/5 border-dashed hover:border-white/20 transition-all">
                                <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                More
                            </span>
                        </motion.button>
                    </div>
                </div>

                {/* Weekly Chart - Full Width */}
                <Card className="w-full bg-card/50 backdrop-blur-sm border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle>Weekly Overview</CardTitle>
                            <CardDescription>Your activity performance this week</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => onNavigate('analytics')} className="text-primary hover:text-primary/80">
                            Details <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <WeeklySummaryChart />
                        </div>
                    </CardContent>
                </Card>

                {/* Focus / Daily Goal Widget - Full Width */}
                <Card className="w-full bg-card border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-violet-400" />
                            Daily Focus
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-accent border border-border flex items-start gap-3">
                            <button
                                onClick={() => setIsFocusCompleted(!isFocusCompleted)}
                                className={cn(
                                    "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    isFocusCompleted ? "bg-violet-500 border-violet-500" : "border-white/30 hover:border-violet-400"
                                )}
                            >
                                {isFocusCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </button>
                            <div className="flex-1">
                                <p className={cn("text-sm transition-all", isFocusCompleted ? "text-white/40 line-through" : "text-white")}>
                                    {focusGoal}
                                </p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="text-xs text-muted-foreground mb-2">Suggested:</p>
                            <div className="flex flex-wrap gap-2">
                                <BadgeButton onClick={() => setFocusGoal("Read 10 pages")} label="Read 10 pages" />
                                <BadgeButton onClick={() => setFocusGoal("Workout for 30m")} label="Workout" />
                                <BadgeButton onClick={() => setFocusGoal("Meditate")} label="Meditate" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* What's New & Coming Soon - Stacked Vertically */}
                <div className="space-y-6">
                    {/* What's New */}
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                What's New
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(maintenanceConfig.updateItems || []).slice(0, 3).map((item, i) => (
                                <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="mt-1 p-1.5 bg-primary/10 rounded-md">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-primary" asChild>
                                <Link href="/whats-new">View All Updates</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Coming Soon */}
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-purple-500" />
                                Coming Soon
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(maintenanceConfig.comingSoonItems || []).slice(0, 3).map((item, i) => (
                                <div key={i} className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/5 opacity-80">
                                    <div className="p-1.5 bg-purple-500/10 rounded-md">
                                        <Clock className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* About Section */}
                <Card className="bg-card border-border">
                    <CardContent className="p-6 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                                <span className="text-xl font-bold text-primary-foreground">S</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Sutradhaar</h3>
                                <p className="text-sm text-muted-foreground">Version {maintenanceConfig.aboutPageContent?.appInfo?.version || '1.0.0'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-4">
                            <span className="text-sm text-muted-foreground">Built with ❤️ by {maintenanceConfig.aboutPageContent?.ownerInfo?.name || 'Aman Yadav'}</span>
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 w-full sm:w-auto" asChild>
                                <Link href="/about">Learn More</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}

// Helper component for quick goal setting
function BadgeButton({ label, onClick }: { label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors"
        >
            {label}
        </button>
    )
}
