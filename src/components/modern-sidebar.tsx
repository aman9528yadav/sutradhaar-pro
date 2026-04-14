"use client";

import React, { useState } from 'react';
import {
    Home,
    Calculator,
    ArrowRightLeft,
    Calendar,
    Timer,
    Hourglass,
    Wallet,
    BookText,
    CheckSquare,
    History,
    BarChart2,
    Settings,
    User,
    Gem,
    Info,
    X,
    ChevronRight,
    DollarSign,
    Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarContext } from '@/context/SidebarContext';

const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', tab: 'dashboard', color: 'text-blue-500' },
    {
        id: 'tools',
        icon: Calculator,
        label: 'Tools',
        color: 'text-purple-500',
        children: [
            { id: 'converter', icon: ArrowRightLeft, label: 'Unit Converter', tab: 'converter' },
            { id: 'calculator', icon: Calculator, label: 'Calculator', tab: 'calculator' },
            { id: 'loan-calculator', icon: DollarSign, label: 'Loan / EMI', tab: 'loan-calculator' },
            { id: 'discount-calculator', icon: Percent, label: 'Discount Calculator', tab: 'discount-calculator' },
            { id: 'date-calculator', icon: Calendar, label: 'Date Calculator', tab: 'date-calculator' },
            { id: 'timer', icon: Timer, label: 'Timer', tab: 'timer' },
            { id: 'stopwatch', icon: Hourglass, label: 'Stopwatch', tab: 'stopwatch' },
        ]
    },
    {
        id: 'productivity',
        icon: CheckSquare,
        label: 'Productivity',
        color: 'text-green-500',
        children: [
            { id: 'budget', icon: Wallet, label: 'Budget Tracker', tab: 'budget-tracker' },
            { id: 'notes', icon: BookText, label: 'Notes', tab: 'notes' },
            { id: 'todo', icon: CheckSquare, label: 'To-Do List', tab: 'todo' },
        ]
    },
    { id: 'history', icon: History, label: 'History', tab: 'history', color: 'text-orange-500' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', tab: 'analytics', color: 'text-cyan-500' },
    { id: 'profile', icon: User, label: 'Profile', tab: 'profile', color: 'text-pink-500' },
    { id: 'settings', icon: Settings, label: 'Settings', tab: 'settings', color: 'text-slate-500' },
    { id: 'membership', icon: Gem, label: 'Premium', tab: 'membership', color: 'text-amber-500' },
    { id: 'about', icon: Info, label: 'About', tab: 'about', color: 'text-indigo-500' },
];

interface ModernSidebarProps {
    activeTab?: string;
    onNavigate?: (tab: string) => void;
}

export function ModernSidebar({ activeTab = 'dashboard', onNavigate }: ModernSidebarProps) {
    const { isOpen, setIsOpen } = useSidebarContext();
    const [expandedSections, setExpandedSections] = useState<string[]>(['tools']);

    const toggleSection = (id: string) => {
        setExpandedSections(prev =>
            prev.includes(id) ? [] : [id]
        );
    };

    const handleNavigation = (tab: string) => {
        if (onNavigate) {
            onNavigate(tab);
        }
        setIsOpen(false);
    };

    const isActive = (tab?: string) => {
        if (!tab) return false;
        return activeTab === tab;
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/10 z-50 transition-transform duration-300 ease-in-out",
                    "w-72 md:w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                            <span className="text-xl font-bold text-white">S</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-white">Sutradhaar</h2>
                            <p className="text-xs text-white/50">All-in-One Tools</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-5 w-5 text-white" />
                    </Button>
                </div>

                {/* Navigation */}
                <ScrollArea className="h-[calc(100vh-80px)]">
                    <nav className="p-3 space-y-1">
                        {menuItems.map((item) => {
                            const hasChildren = 'children' in item && item.children;
                            const isExpanded = expandedSections.includes(item.id);
                            const itemActive = isActive(item.tab);

                            return (
                                <div key={item.id}>
                                    {hasChildren ? (
                                        <button
                                            onClick={() => toggleSection(item.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                                "hover:bg-white/5 group"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn("h-5 w-5", item.color)} />
                                                <span className="text-sm font-medium text-white/80 group-hover:text-white">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ChevronRight
                                                className={cn(
                                                    "h-4 w-4 text-white/40 transition-transform duration-200",
                                                    isExpanded && "rotate-90"
                                                )}
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleNavigation(item.tab!)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                                "hover:bg-white/5 group",
                                                itemActive && "bg-primary/10 border border-primary/20"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "h-5 w-5",
                                                    itemActive ? "text-primary" : item.color
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    "text-sm font-medium",
                                                    itemActive ? "text-primary" : "text-white/80 group-hover:text-white"
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                        </button>
                                    )}

                                    {/* Children */}
                                    {hasChildren && isExpanded && (
                                        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                                            {item.children.map((child) => {
                                                const childActive = isActive(child.tab);
                                                return (
                                                    <button
                                                        key={child.id}
                                                        onClick={() => handleNavigation(child.tab)}
                                                        className={cn(
                                                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                                                            "hover:bg-white/5 group",
                                                            childActive && "bg-primary/10 border border-primary/20"
                                                        )}
                                                    >
                                                        <child.icon
                                                            className={cn(
                                                                "h-4 w-4",
                                                                childActive ? "text-primary" : "text-white/40 group-hover:text-white/60"
                                                            )}
                                                        />
                                                        <span
                                                            className={cn(
                                                                "text-xs font-medium",
                                                                childActive ? "text-primary" : "text-white/60 group-hover:text-white/80"
                                                            )}
                                                        >
                                                            {child.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </ScrollArea>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-slate-950/50 backdrop-blur-sm">
                    <div className="text-xs text-white/40 text-center">
                        Version 1.0.0
                    </div>
                </div>
            </aside>
        </>
    );
}
