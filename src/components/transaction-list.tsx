"use client";

import React, { useState, useMemo } from 'react';
import { useProfile, Transaction } from '@/context/ProfileContext';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Trash2, Edit2, MoreVertical, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTransactionDialog } from './add-transaction-dialog';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function TransactionList() {
    const { profile, deleteTransaction } = useProfile();
    const { budget } = profile;
    const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

    // Filter states
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterAccount, setFilterAccount] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const filteredTransactions = useMemo(() => {
        let filtered = [...budget.transactions];

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        // Filter by category
        if (filterCategory !== 'all') {
            filtered = filtered.filter(t => t.categoryId === filterCategory);
        }

        // Filter by account
        if (filterAccount !== 'all') {
            filtered = filtered.filter(t => t.accountId === filterAccount);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(t =>
                t.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [budget.transactions, filterType, filterCategory, filterAccount, searchQuery]);

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setTransactionToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (transactionToDelete) {
            deleteTransaction(transactionToDelete);
            setDeleteDialogOpen(false);
            setTransactionToDelete(null);
        }
    };

    const clearFilters = () => {
        setFilterType('all');
        setFilterCategory('all');
        setFilterAccount('all');
        setSearchQuery('');
    };

    const activeFiltersCount = [
        filterType !== 'all',
        filterCategory !== 'all',
        filterAccount !== 'all',
        searchQuery.trim() !== ''
    ].filter(Boolean).length;

    if (budget.transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                    <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No transactions yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2">
                    Add your first income or expense to start tracking your budget.
                </p>
            </div>
        );
    }

    // Group transactions by date
    const groupedTransactions: { [key: string]: typeof filteredTransactions } = {};
    filteredTransactions.forEach(t => {
        const dateKey = format(new Date(t.date), 'yyyy-MM-dd');
        if (!groupedTransactions[dateKey]) {
            groupedTransactions[dateKey] = [];
        }
        groupedTransactions[dateKey].push(t);
    });

    return (
        <>
            <div className="space-y-4">
                {/* Filter Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant={showFilters ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>

                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    )}

                    <div className="ml-auto text-sm text-muted-foreground">
                        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-card/50 rounded-xl border">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Search</label>
                            <Input
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Type</label>
                            <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Category</label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {budget.categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Account</label>
                            <Select value={filterAccount} onValueChange={setFilterAccount}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Accounts</SelectItem>
                                    {budget.accounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Transactions List */}
                {filteredTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 rounded-full bg-muted mb-4">
                            <Filter className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No transactions found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-2">
                            Try adjusting your filters to see more results.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedTransactions).map(([date, transactions]) => (
                            <div key={date} className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                                    {format(new Date(date), 'MMMM d, yyyy')}
                                </h4>
                                <div className="space-y-2">
                                    {transactions.map(transaction => {
                                        const category = budget.categories.find(c => c.id === transaction.categoryId);
                                        const account = budget.accounts.find(a => a.id === transaction.accountId);
                                        return (
                                            <div
                                                key={transaction.id}
                                                className="group flex items-center justify-between p-4 rounded-xl bg-card/50 border border-white/5 hover:bg-card/80 transition-all hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className={`p-2.5 rounded-full ${transaction.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                        {transaction.type === 'income' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{transaction.description}</p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>{category?.name || 'Uncategorized'}</span>
                                                            <span>•</span>
                                                            <span>{account?.name || 'Unknown'}</span>
                                                            <span>•</span>
                                                            <span>{format(new Date(transaction.date), 'h:mm a')}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold text-base ${transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                                                    </span>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                                                                <Edit2 className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => handleDeleteClick(transaction.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddTransactionDialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setEditingTransaction(undefined);
                }}
                transaction={editingTransaction}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this transaction? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
