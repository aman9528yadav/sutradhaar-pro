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
    FileText,
    Image,
    Music,
    Video,
    QrCode,
    Hash,
    Palette,
    FileCode,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ToolsPageProps {
    onToolSelect: (toolId: string) => void;
}

export function ToolsPage({ onToolSelect }: ToolsPageProps) {
    const tools = [
        // Active tools - Priority order
        { id: 'converter', icon: ArrowRightLeft, label: 'Converter', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'calculator', icon: Calculator, label: 'Calculator', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { id: 'notes', icon: BookText, label: 'Notes', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { id: 'budget-tracker', icon: Wallet, label: 'Budget', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'todo', icon: CheckSquare, label: 'To-Do', color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 'news', icon: Newspaper, label: 'News', color: 'text-sky-500', bg: 'bg-sky-500/10', externalLink: 'https://aman9528.wixstudio.com/my-site-3' },

        // Secondary tools
        { id: 'loan-calculator', icon: DollarSign, label: 'Loan / EMI', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'discount-calculator', icon: Percent, label: 'Discount', color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { id: 'timer', icon: Timer, label: 'Timer', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { id: 'stopwatch', icon: Hourglass, label: 'Stopwatch', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'history', icon: History, label: 'History', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 'analytics', icon: BarChart2, label: 'Analytics', color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { id: 'date-calculator', icon: Calendar, label: 'Date Calc', color: 'text-pink-500', bg: 'bg-pink-500/10' },

        // Membership
        { id: 'membership', icon: Gem, label: 'Membership', color: 'text-amber-500', bg: 'bg-amber-500/10' },

        // Coming Soon tools
        { id: 'pdf', icon: FileText, label: 'PDF Tools', color: 'text-red-500', bg: 'bg-red-500/10', comingSoon: true },
        { id: 'image-tools', icon: Image, label: 'Image Tools', color: 'text-violet-500', bg: 'bg-violet-500/10', comingSoon: true },
        { id: 'qr-code', icon: QrCode, label: 'QR Code', color: 'text-blue-600', bg: 'bg-blue-600/10', comingSoon: true },
        { id: 'color-picker', icon: Palette, label: 'Color Picker', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', comingSoon: true },
        { id: 'hash-generator', icon: Hash, label: 'Hash Gen', color: 'text-slate-600', bg: 'bg-slate-600/10', comingSoon: true },
        { id: 'code-formatter', icon: FileCode, label: 'Code Format', color: 'text-teal-500', bg: 'bg-teal-500/10', comingSoon: true },
        { id: 'video-tools', icon: Video, label: 'Video Tools', color: 'text-purple-600', bg: 'bg-purple-600/10', comingSoon: true },
        { id: 'audio-tools', icon: Music, label: 'Audio Tools', color: 'text-pink-600', bg: 'bg-pink-600/10', comingSoon: true },

        // About
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
                            className={cn(
                                "cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border-white/5 bg-card/50 backdrop-blur-sm relative",
                                tool.comingSoon && "opacity-75 cursor-not-allowed"
                            )}
                            onClick={() => {
                                if (tool.comingSoon) return;
                                if (tool.externalLink) {
                                    window.open(tool.externalLink, '_blank', 'noopener,noreferrer');
                                } else {
                                    onToolSelect(tool.id);
                                }
                            }}
                        >
                            {tool.comingSoon && (
                                <div className="absolute -top-2 -right-2 z-10">
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                        Coming Soon
                                    </span>
                                </div>
                            )}
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
