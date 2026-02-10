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
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Repeat, Link, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
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
    const [recurring, setRecurring] = useState<string>(transaction?.recurring?.frequency || 'none');
    const [receiptUrl, setReceiptUrl] = useState(transaction?.receiptUrl || '');

    useEffect(() => {
        if (open) {
            if (transaction) {
                setType(transaction.type);
                setAmount(transaction.amount.toString());
                setDescription(transaction.description);
                setCategoryId(transaction.categoryId);
                setAccountId(transaction.accountId);
                setDate(new Date(transaction.date));
                setRecurring(transaction.recurring?.frequency || 'none');
                setReceiptUrl(transaction.receiptUrl || '');
            } else {
                setType('expense');
                setAmount('');
                setDescription('');
                setCategoryId('');
                setAccountId(budget.accounts[0]?.id || '');
                setDate(new Date());
                setRecurring('none');
                setReceiptUrl('');
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

        const recurringData = recurring !== 'none' ? {
            frequency: recurring as 'daily' | 'weekly' | 'monthly' | 'yearly',
            nextDue: date.toISOString() // Initial next due is the transaction date itself or calculated next
        } : undefined;

        if (transaction) {
            updateTransaction({
                ...transaction,
                type,
                amount: parseFloat(amount),
                description,
                categoryId,
                accountId,
                date: date.toISOString(),
                recurring: recurringData,
                receiptUrl,
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
                recurring: recurringData,
                receiptUrl,
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
                    <div className="max-h-[60vh] overflow-y-auto px-2 space-y-6">
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

                        {/* Date and Recurring */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full h-12 justify-start text-left font-normal border-input bg-background hover:bg-accent hover:text-accent-foreground",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(d) => d && setDate(d)}
                                            initialFocus
                                            captionLayout="dropdown-buttons"
                                            fromYear={2000}
                                            toYear={2100}
                                            className="bg-card text-foreground rounded-md border-border"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <Repeat className="w-4 h-4" /> Recurring
                                </Label>
                                <Select value={recurring} onValueChange={(v: any) => setRecurring(v)}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Receipt URL */}
                        <div className="space-y-2">
                            <Label htmlFor="receipt" className="text-sm font-semibold flex items-center gap-2">
                                <Link className="w-4 h-4" /> Receipt URL (Optional)
                            </Label>
                            <Input
                                id="receipt"
                                placeholder="https://example.com/receipt.jpg"
                                className="h-12"
                                value={receiptUrl}
                                onChange={(e) => setReceiptUrl(e.target.value)}
                            />
                        </div>
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
