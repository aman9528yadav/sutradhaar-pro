"use client";

import React from 'react';
import {
    Calculator,
    History,
    Newspaper,
    Languages,
    ArrowRightLeft,
    Calendar,
    Timer,
    Hourglass,
    Wallet,
    BarChart2,
    Gem,
    Info,
    BookText,
    CheckSquare,
    DollarSign,
    Percent,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ToolsPageProps {
    onToolSelect: (toolId: string) => void;
}

export function ToolsPage({ onToolSelect }: ToolsPageProps) {
    const tools = [
        { id: 'notes', icon: BookText, label: 'Notes', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { id: 'loan-calculator', icon: DollarSign, label: 'Loan / EMI', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'discount-calculator', icon: Percent, label: 'Discount', color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { id: 'converter', icon: ArrowRightLeft, label: 'Converter', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'calculator', icon: Calculator, label: 'Calculator', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { id: 'todo', icon: CheckSquare, label: 'To-Do', color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 'history', icon: History, label: 'History', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 'date-calculator', icon: Calendar, label: 'Date Calc', color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { id: 'timer', icon: Timer, label: 'Timer', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { id: 'stopwatch', icon: Hourglass, label: 'Stopwatch', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'budget-tracker', icon: Wallet, label: 'Budget', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'analytics', icon: BarChart2, label: 'Analytics', color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { id: 'membership', icon: Gem, label: 'Membership', color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { id: 'about', icon: Info, label: 'About', color: 'text-slate-500', bg: 'bg-slate-500/10' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-4 space-y-4 pb-24">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                    All Tools
                </h1>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
                {tools.map((tool) => (
                    <motion.div key={tool.id} variants={item}>
                        <Card
                            className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border-white/5 bg-card/50 backdrop-blur-sm"
                            onClick={() => onToolSelect(tool.id)}
                        >
                            <CardContent className="p-4 flex flex-col items-center justify-center gap-3 text-center h-32">
                                <div className={cn("p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110", tool.bg)}>
                                    <tool.icon className={cn("h-8 w-8", tool.color)} />
                                </div>
                                <span className="font-medium text-sm group-hover:text-primary transition-colors">{tool.label}</span>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
