"use client";

import React, { useState, useEffect } from 'react';
import { useProfile, Transaction } from '@/context/ProfileContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MuiDatePicker } from './mui-date-picker';
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction?: Transaction;
}

export function AddTransactionDialog({ open, onOpenChange, transaction }: AddTransactionDialogProps) {
    const { profile, addTransaction, updateTransaction } = useProfile();
    const { budget } = profile;
    const { toast } = useToast();

    const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
    const [amount, setAmount] = useState(transaction?.amount.toString() || '');
    const [description, setDescription] = useState(transaction?.description || '');
    const [categoryId, setCategoryId] = useState(transaction?.categoryId || '');
    const [accountId, setAccountId] = useState(transaction?.accountId || budget.accounts[0]?.id || '');
    const [date, setDate] = useState<Date>(transaction?.date ? new Date(transaction.date) : new Date());

    useEffect(() => {
        if (open) {
            if (transaction) {
                setType(transaction.type);
                setAmount(transaction.amount.toString());
                setDescription(transaction.description);
                setCategoryId(transaction.categoryId);
                setAccountId(transaction.accountId);
                setDate(new Date(transaction.date));
            } else {
                setType('expense');
                setAmount('');
                setDescription('');
                setCategoryId('');
                setAccountId(budget.accounts[0]?.id || '');
                setDate(new Date());
            }
        }
    }, [open, transaction, budget.accounts]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !categoryId || !accountId) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        if (transaction) {
            updateTransaction({
                ...transaction,
                type,
                amount: parseFloat(amount),
                description,
                categoryId,
                accountId,
                date: date.toISOString(),
            });
            toast({
                title: "Transaction Updated",
                description: "Your transaction has been updated successfully."
            });
        } else {
            addTransaction({
                type,
                amount: parseFloat(amount),
                description,
                categoryId,
                accountId,
                date: date.toISOString(),
            });
            toast({
                title: "Transaction Added",
                description: "Your transaction has been added successfully."
            });
        }

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {transaction ? 'Edit Transaction' : 'Add Transaction'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                type === 'expense'
                                    ? "border-red-500 bg-red-500/10 text-red-500"
                                    : "border-border hover:border-red-500/50"
                            )}
                        >
                            <ArrowDownCircle className="h-8 w-8" />
                            <span className="font-semibold">Expense</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                type === 'income'
                                    ? "border-green-500 bg-green-500/10 text-green-500"
                                    : "border-border hover:border-green-500/50"
                            )}
                        >
                            <ArrowUpCircle className="h-8 w-8" />
                            <span className="font-semibold">Income</span>
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm font-semibold">Amount *</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-lg text-muted-foreground">₹</span>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-10 h-12 text-lg"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold">Description *</Label>
                        <Input
                            id="description"
                            placeholder="What is this for?"
                            className="h-12"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Category and Account */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Category *</Label>
                            <Select value={categoryId} onValueChange={setCategoryId} required>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {budget.categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Account *</Label>
                            <Select value={accountId} onValueChange={setAccountId} required>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {budget.accounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Date *</Label>
                        <MuiDatePicker
                            label="Transaction Date"
                            value={date}
                            onChange={(d) => d && setDate(d)}
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={cn(
                                "flex-1 sm:flex-none",
                                type === 'expense' ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                            )}
                        >
                            {transaction ? 'Update' : 'Add'} Transaction
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
