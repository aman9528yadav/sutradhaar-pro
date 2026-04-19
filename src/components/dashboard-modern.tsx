"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Flame, Calendar, Star, TrendingUp, TrendingDown, Target, Zap, Clock,
    CheckCircle2, Rocket, Wallet, ArrowRight, Sparkles, Bell, Plus,
    ChevronRight, Activity, Award, BarChart3, Timer, BookOpen, Calculator,
    ArrowUpRight, ArrowDownLeft, Settings, Wrench, Gem, CreditCard, LayoutGrid, Quote, WifiOff
} from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const quotes = [
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Your time is limited, so don't waste it living someone else's life.",
];

export function DashboardModern({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const { profile } = useProfile();
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    const [greeting, setGreeting] = useState('');
    const [dateString, setDateString] = useState('');
    const [quote, setQuote] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now);
            
            const hour = now.getHours();
            if (hour >= 5 && hour < 12) setGreeting('Good Morning');
            else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
            else if (hour >= 17 && hour < 22) setGreeting('Good Evening');
            else setGreeting('Good Night');

            setDateString(now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric'
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

        return () => clearInterval(interval);
    }, []);

    const { allTimeActivities = 0, todayActivities = 0, streak = 0 } = profile.stats || {};
    const userName = user?.displayName || profile.name || 'User';
    const firstName = userName.split(' ')[0];
    
    // Calculate financial stats
    const totalBalance = profile.budget.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const now = new Date();
    const monthlyExpense = profile.budget.transactions
        .filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === now.getMonth() && 
                   d.getFullYear() === now.getFullYear() && 
                   t.type === 'expense';
        })
        .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyIncome = profile.budget.transactions
        .filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === now.getMonth() && 
                   d.getFullYear() === now.getFullYear() && 
                   t.type === 'income';
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const activeTodos = profile.todos.filter(t => !t.completed);
    const highPriorityTodos = activeTodos.filter(t => t.priority === 'high');
    const recentTransactions = profile.budget.transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    return (
        <motion.div 
            className="space-y-8 pb-32 max-w-7xl mx-auto w-full px-2 sm:px-4"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Header Section */}
            <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors rounded-full px-3 py-1 font-semibold">
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            {dateString}
                        </Badge>
                        <Badge className="bg-muted text-muted-foreground border-transparent rounded-full px-3 py-1">
                            <Clock className="w-3.5 h-3.5 mr-2" />
                            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </Badge>
                        <Badge 
                            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer transition-colors rounded-full px-3 py-1 font-semibold"
                            onClick={() => window.open('/offline-app/index.html', '_blank')}
                        >
                            <WifiOff className="w-3.5 h-3.5 mr-2" />
                            Offline
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{firstName}</span>.
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        You have <span className="text-foreground font-bold">{activeTodos.length}</span> tasks and <span className="text-foreground font-bold">₹{totalBalance.toLocaleString('en-IN')}</span> in balance.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-12 w-12 rounded-2xl border-border/50 bg-card hover:bg-accent shadow-sm"
                        onClick={() => onNavigate('settings')}
                    >
                        <Bell className="h-5 w-5 text-foreground" />
                    </Button>
                    <Button
                        size="icon"
                        variant="default"
                        className="h-12 w-12 rounded-2xl shadow-lg shadow-primary/25"
                        onClick={() => onNavigate('todo')}
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </motion.div>

            {/* Quick Stat Pills */}
            <motion.div variants={item} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
                <div className="flex-shrink-0 flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm min-w-[160px]">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-semibold">Streak</p>
                        <p className="text-2xl font-black text-foreground">{streak}</p>
                    </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm min-w-[160px]">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Star className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-semibold">Activity</p>
                        <p className="text-2xl font-black text-foreground">{todayActivities}</p>
                    </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm min-w-[160px]">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-semibold">Income</p>
                        <p className="text-2xl font-black text-foreground">₹{(monthlyIncome/1000).toFixed(1)}k</p>
                    </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm min-w-[160px]">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-semibold">Expense</p>
                        <p className="text-2xl font-black text-foreground">₹{(monthlyExpense/1000).toFixed(1)}k</p>
                    </div>
                </div>
            </motion.div>

            {/* Core Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Apps Grid (Span 4) */}
                <motion.div variants={item} className="md:col-span-5 lg:col-span-4 bg-secondary/30 rounded-3xl p-6 border border-border/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-primary" /> App Library
                        </h3>
                        <Button variant="link" className="text-xs text-muted-foreground" onClick={() => onNavigate('tools')}>View All</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { icon: Wallet, label: 'Budget', color: 'text-emerald-500', bg: 'bg-emerald-500/10', shadow: 'shadow-emerald-500/20', id: 'budget-tracker' },
                            { icon: CheckCircle2, label: 'Tasks', color: 'text-blue-500', bg: 'bg-blue-500/10', shadow: 'shadow-blue-500/20', id: 'todo' },
                            { icon: Timer, label: 'Timer', color: 'text-purple-500', bg: 'bg-purple-500/10', shadow: 'shadow-purple-500/20', id: 'timer' },
                            { icon: Calculator, label: 'Calc', color: 'text-orange-500', bg: 'bg-orange-500/10', shadow: 'shadow-orange-500/20', id: 'calculator' },
                            { icon: BookOpen, label: 'Notes', color: 'text-yellow-500', bg: 'bg-yellow-500/10', shadow: 'shadow-yellow-500/20', id: 'notes' },
                            { icon: BarChart3, label: 'Stats', color: 'text-rose-500', bg: 'bg-rose-500/10', shadow: 'shadow-rose-500/20', id: 'analytics' },
                        ].map((tool, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onNavigate(tool.id)}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                                    tool.bg, "group-hover:shadow-lg", tool.shadow
                                )}>
                                    <tool.icon className={cn("w-7 h-7", tool.color)} />
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{tool.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Finance Bento (Span 8) */}
                <motion.div variants={item} className="md:col-span-7 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Finance Card */}
                    <Card className="bg-card border-border/50 shadow-sm rounded-3xl overflow-hidden hover:border-primary/30 transition-colors">
                        <CardContent className="p-6 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-primary" />
                                    </div>
                                    <Badge variant="outline" className="font-semibold px-3 py-1">Net Worth</Badge>
                                </div>
                                <h3 className="text-4xl font-black text-foreground tracking-tight mb-2">
                                    ₹{totalBalance.toLocaleString('en-IN')}
                                </h3>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    <span className="text-emerald-500">+{(Math.random() * 5 + 1).toFixed(1)}%</span> this month
                                </p>
                            </div>
                            
                            <div className="mt-8 space-y-3">
                                {recentTransactions.slice(0, 2).map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500')} />
                                            <span className="text-sm font-semibold truncate max-w-[100px]">{t.description}</span>
                                        </div>
                                        <span className={cn("text-sm font-bold", t.type === 'income' ? 'text-emerald-500' : 'text-rose-500')}>
                                            {t.type === 'income' ? '+' : '-'}₹{t.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tasks & Quote Column */}
                    <div className="flex flex-col gap-6">
                        <Card className="bg-card border-border/50 shadow-sm rounded-3xl hover:border-blue-500/30 transition-colors flex-1">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                            <Target className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <h3 className="font-bold text-lg">Focus</h3>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-blue-500 hover:bg-blue-500/10" onClick={() => onNavigate('todo')}>View All</Button>
                                </div>
                                <div className="space-y-3">
                                    {activeTodos.length === 0 ? (
                                        <div className="text-center py-6 text-muted-foreground text-sm font-medium">All caught up! 🎉</div>
                                    ) : activeTodos.slice(0, 3).map((todo, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl">
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0",
                                                todo.priority === 'high' ? 'border-rose-500 bg-rose-500/20' :
                                                todo.priority === 'medium' ? 'border-yellow-500 bg-yellow-500/20' : 'border-blue-500 bg-blue-500/20'
                                            )} />
                                            <span className="text-sm font-semibold text-foreground line-clamp-2">{todo.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-primary to-purple-600 border-none shadow-lg rounded-3xl text-white">
                            <CardContent className="p-6">
                                <Quote className="w-8 h-8 text-white/30 mb-3" />
                                <p className="text-sm font-semibold leading-relaxed">
                                    "{quote}"
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
