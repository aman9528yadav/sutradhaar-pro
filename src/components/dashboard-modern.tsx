"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Flame,
    Calendar,
    Star,
    TrendingUp,
    TrendingDown,
    Target,
    Zap,
    Clock,
    CheckCircle2,
    Rocket,
    Wallet,
    ArrowRight,
    Sparkles,
    Sun,
    Cloud,
    Bell,
    Plus,
    ChevronRight,
    Activity,
    Award,
    Bookmark,
    BarChart3,
    PieChart,
    Timer,
    BookOpen,
    Calculator,
    ArrowUpRight,
    ArrowDownLeft,
    ReceiptText,
    User,
    Settings,
    Wrench,
    Gem,
} from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Lazy load chart
const WeeklySummaryChart = dynamic(() => import('@/components/weekly-summary-chart').then(mod => ({ default: mod.WeeklySummaryChart })), {
    loading: () => <div className="h-[200px] animate-pulse bg-white/5 rounded-2xl" />,
    ssr: false
});

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
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

        return () => clearInterval(interval);
    }, []);

    const { allTimeActivities = 0, todayActivities = 0, streak = 0 } = profile.stats || {};
    const userName = user?.displayName || profile.name || 'User';
    
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
            transition: { staggerChildren: 0.08 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div 
            className="space-y-6 pb-24 animate-in fade-in duration-500"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Hero Section */}
            <motion.div variants={item}>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 md:p-8 text-white">
                    {/* Animated Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-white/20 backdrop-blur-sm border-0">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </Badge>
                                    {streak > 0 && (
                                        <Badge className="bg-orange-500/80 backdrop-blur-sm border-0">
                                            <Flame className="h-3 w-3 mr-1" />
                                            {streak} day streak
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                    {greeting}, {userName.split(' ')[0]}! 👋
                                </h1>
                                <p className="text-white/80 text-sm">{dateString}</p>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                                onClick={() => onNavigate('settings')}
                            >
                                <Bell className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="h-4 w-4 text-yellow-300" />
                                    <span className="text-xs text-white/70">Activities</span>
                                </div>
                                <p className="text-2xl font-bold">{allTimeActivities}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-emerald-300" />
                                    <span className="text-xs text-white/70">Today</span>
                                </div>
                                <p className="text-2xl font-bold">{todayActivities}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-blue-300" />
                                    <span className="text-xs text-white/70">Income</span>
                                </div>
                                <p className="text-lg font-bold">₹{monthlyIncome.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown className="h-4 w-4 text-rose-300" />
                                    <span className="text-xs text-white/70">Expense</span>
                                </div>
                                <p className="text-lg font-bold">₹{monthlyExpense.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item}>
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { icon: Plus, label: 'Add', color: 'from-emerald-500 to-green-600', action: () => onNavigate('budget-tracker') },
                        { icon: CheckCircle2, label: 'Tasks', color: 'from-blue-500 to-indigo-600', action: () => onNavigate('todo') },
                        { icon: Timer, label: 'Timer', color: 'from-purple-500 to-violet-600', action: () => onNavigate('timer') },
                        { icon: Calculator, label: 'Calc', color: 'from-orange-500 to-red-600', action: () => onNavigate('calculator') },
                    ].map((action, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={action.action}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-2xl bg-gradient-to-br",
                                action.color,
                                "flex items-center justify-center shadow-lg"
                            )}>
                                <action.icon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Bento Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Financial Overview - Large Card */}
                <Card className="md:col-span-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                                <h3 className="text-3xl font-bold text-emerald-500">
                                    ₹{totalBalance.toLocaleString('en-IN')}
                                </h3>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-500/30"
                                onClick={() => onNavigate('budget-tracker')}
                            >
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-emerald-500/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs text-muted-foreground">Income</span>
                                </div>
                                <p className="text-xl font-bold text-emerald-500">₹{monthlyIncome.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-rose-500/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowDownLeft className="h-4 w-4 text-rose-500" />
                                    <span className="text-xs text-muted-foreground">Expense</span>
                                </div>
                                <p className="text-xl font-bold text-rose-500">₹{monthlyExpense.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground mb-2">Recent Transactions</p>
                            {recentTransactions.map((transaction, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-full",
                                            transaction.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                                        )}>
                                            {transaction.type === 'income' ? (
                                                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                            ) : (
                                                <ArrowDownLeft className="h-3 w-3 text-rose-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{transaction.description}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={cn(
                                        "font-bold text-sm",
                                        transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                                    )}>
                                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks Card */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Active Tasks</p>
                                <h3 className="text-3xl font-bold text-blue-500">{activeTodos.length}</h3>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500/30"
                                onClick={() => onNavigate('todo')}
                            >
                                View <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>

                        {highPriorityTodos.length > 0 && (
                            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame className="h-4 w-4 text-rose-500" />
                                    <span className="text-xs font-medium text-rose-500">High Priority</span>
                                </div>
                                <p className="text-2xl font-bold text-rose-500">{highPriorityTodos.length}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            {activeTodos.slice(0, 4).map((todo) => (
                                <div key={todo.id} className="flex items-start gap-2 p-3 bg-card/50 rounded-lg">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                        todo.priority === 'high' ? 'bg-rose-500' :
                                        todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                    )} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{todo.text}</p>
                                        {todo.dueDate && (
                                            <p className="text-xs text-muted-foreground">
                                                Due: {new Date(todo.dueDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tools Grid */}
            <motion.div variants={item}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Quick Tools</h3>
                    <Button variant="ghost" size="sm" onClick={() => onNavigate('tools')}>
                        See All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                    {[
                        { icon: Wallet, label: 'Budget', color: 'text-emerald-500', bg: 'bg-emerald-500/10', id: 'budget-tracker' },
                        { icon: BookOpen, label: 'Notes', color: 'text-yellow-500', bg: 'bg-yellow-500/10', id: 'notes' },
                        { icon: BarChart3, label: 'Analytics', color: 'text-purple-500', bg: 'bg-purple-500/10', id: 'analytics' },
                        { icon: Gem, label: 'Premium', color: 'text-amber-500', bg: 'bg-amber-500/10', id: 'membership' },
                        { icon: Wrench, label: 'Tools', color: 'text-blue-500', bg: 'bg-blue-500/10', id: 'tools' },
                    ].map((tool, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate(tool.id)}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center",
                                tool.bg,
                                "border border-white/5 transition-all"
                            )}>
                                <tool.icon className={cn("w-6 h-6", tool.color)} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{tool.label}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div variants={item}>
                <Card className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border-purple-500/20">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-purple-500 mb-2">Daily Inspiration</p>
                                <p className="text-sm text-muted-foreground italic">"{quote}"</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
