"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Plus,
    Target,
    CreditCard,
    Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { AddTransactionDialog } from './add-transaction-dialog';
import { TransactionList } from './transaction-list';
import { BudgetOverview } from './budget-overview';
import { ManageAccountsDialog } from './manage-accounts-dialog';
import { ManageCategoriesDialog } from './manage-categories-dialog';
import { BudgetAnalytics } from './budget-analytics';
import { BudgetGoals } from './budget-goals';
import { BillReminders } from './bill-reminders';

import { useRouter, useSearchParams } from 'next/navigation';

interface BudgetTrackerPageProps {
    initialTab?: string;
}

export function BudgetTrackerPage({ initialTab }: BudgetTrackerPageProps) {
    const { profile } = useProfile();
    const { budget } = profile;
    const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
    const [isManageAccountsOpen, setIsManageAccountsOpen] = useState(false);
    const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const currentTab = searchParams.get('tab') || initialTab || 'overview';

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const totalBalance = budget.accounts.reduce((acc, account) => acc + account.balance, 0);

    // Calculate total income and expenses for the current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = budget.transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const savings = totalIncome - totalExpense;

    return (
        <div className="space-y-6 pb-24">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    Budget Tracker
                </h1>
                <p className="text-muted-foreground">Manage your finances with ease.</p>
            </div>

            {/* Main Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-2xl"
            >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100">Total Balance</p>
                            <h2 className="text-4xl font-bold tracking-tight mt-1">
                                ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h2>
                        </div>
                        <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-emerald-100 mb-1">
                                <div className="rounded-full bg-emerald-500/20 p-1">
                                    <TrendingUp className="h-3 w-3 text-emerald-300" />
                                </div>
                                <span className="text-xs font-medium">Income</span>
                            </div>
                            <p className="text-base font-semibold">
                                +₹{totalIncome.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-rose-100 mb-1">
                                <div className="rounded-full bg-rose-500/20 p-1">
                                    <TrendingDown className="h-3 w-3 text-rose-300" />
                                </div>
                                <span className="text-xs font-medium">Expense</span>
                            </div>
                            <p className="text-base font-semibold">
                                -₹{totalExpense.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-cyan-100 mb-1">
                                <div className="rounded-full bg-cyan-500/20 p-1">
                                    <Target className="h-3 w-3 text-cyan-300" />
                                </div>
                                <span className="text-xs font-medium">Savings</span>
                            </div>
                            <p className="text-base font-semibold">
                                ₹{savings.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                    size="lg"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    onClick={() => setIsAddTransactionOpen(true)}
                >
                    <Plus className="mr-2 h-5 w-5" /> Add Transaction
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-emerald-500/20 hover:bg-emerald-500/10"
                    onClick={() => setIsManageAccountsOpen(true)}
                >
                    <CreditCard className="mr-2 h-5 w-5" /> Manage Accounts
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-emerald-500/20 hover:bg-emerald-500/10"
                    onClick={() => setIsManageCategoriesOpen(true)}
                >
                    <Target className="mr-2 h-5 w-5" /> Manage Categories
                </Button>
            </div>

            {/* Tabs for different views */}
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <ScrollArea className="w-full whitespace-nowrap pb-2">
                        <div className="flex space-x-2">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'transactions', label: 'History' },
                                { id: 'goals', label: 'Goals' },
                                { id: 'bills', label: 'Bills' },
                                { id: 'analytics', label: 'Analytics' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                        currentTab === tab.id
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="invisible" />
                    </ScrollArea>
                </div>

                <TabsContent value="overview" className="space-y-4 mt-0">
                    <BudgetOverview />
                </TabsContent>

                <TabsContent value="transactions" className="mt-0">
                    <TransactionList />
                </TabsContent>

                <TabsContent value="goals" className="mt-0">
                    <BudgetGoals />
                </TabsContent>

                <TabsContent value="bills" className="mt-0">
                    <BillReminders />
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                    <BudgetAnalytics />
                </TabsContent>
            </Tabs>

            <AddTransactionDialog
                open={isAddTransactionOpen}
                onOpenChange={setIsAddTransactionOpen}
            />

            <ManageAccountsDialog
                open={isManageAccountsOpen}
                onOpenChange={setIsManageAccountsOpen}
            />

            <ManageCategoriesDialog
                open={isManageCategoriesOpen}
                onOpenChange={setIsManageCategoriesOpen}
            />
        </div>
    );
}
