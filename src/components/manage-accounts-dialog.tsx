"use client";

import React, { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Wallet, Trash2, Edit2, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

interface ManageAccountsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ManageAccountsDialog({ open, onOpenChange }: ManageAccountsDialogProps) {
    const { profile, addAccount, updateAccount, deleteAccount, transferBetweenAccounts } = useProfile();
    const { budget } = profile;
    const { toast } = useToast();

    const [view, setView] = useState<'list' | 'add' | 'edit' | 'transfer'>('list');
    const [accountName, setAccountName] = useState('');
    const [initialBalance, setInitialBalance] = useState('');
    const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

    // Transfer state
    const [fromAccountId, setFromAccountId] = useState('');
    const [toAccountId, setToAccountId] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferDescription, setTransferDescription] = useState('');

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

    const handleAddAccount = () => {
        if (!accountName.trim()) {
            toast({
                title: "Missing Information",
                description: "Please enter an account name.",
                variant: "destructive"
            });
            return;
        }

        addAccount({
            name: accountName,
            balance: parseFloat(initialBalance) || 0,
        });

        toast({
            title: "Account Added",
            description: `${accountName} has been added successfully.`
        });

        setAccountName('');
        setInitialBalance('');
        setView('list');
    };

    const handleEditClick = (accountId: string) => {
        const account = budget.accounts.find(a => a.id === accountId);
        if (account) {
            setEditingAccountId(accountId);
            setAccountName(account.name);
            setInitialBalance(account.balance.toString());
            setView('edit');
        }
    };

    const handleUpdateAccount = () => {
        if (!accountName.trim() || !editingAccountId) {
            toast({
                title: "Missing Information",
                description: "Please enter an account name.",
                variant: "destructive"
            });
            return;
        }

        updateAccount({
            id: editingAccountId,
            name: accountName,
            balance: parseFloat(initialBalance) || 0,
        });

        toast({
            title: "Account Updated",
            description: `${accountName} has been updated successfully.`
        });

        setAccountName('');
        setInitialBalance('');
        setEditingAccountId(null);
        setView('list');
    };

    const handleTransfer = () => {
        if (!fromAccountId || !toAccountId || !transferAmount) {
            toast({
                title: "Missing Information",
                description: "Please fill in all transfer details.",
                variant: "destructive"
            });
            return;
        }

        if (fromAccountId === toAccountId) {
            toast({
                title: "Invalid Transfer",
                description: "Cannot transfer to the same account.",
                variant: "destructive"
            });
            return;
        }

        const amount = parseFloat(transferAmount);
        const fromAccount = budget.accounts.find(a => a.id === fromAccountId);

        if (fromAccount && fromAccount.balance < amount) {
            toast({
                title: "Insufficient Balance",
                description: "Not enough balance in the source account.",
                variant: "destructive"
            });
            return;
        }

        transferBetweenAccounts(fromAccountId, toAccountId, amount, transferDescription || 'Transfer');

        toast({
            title: "Transfer Successful",
            description: `₹${amount.toLocaleString('en-IN')} transferred successfully.`
        });

        setFromAccountId('');
        setToAccountId('');
        setTransferAmount('');
        setTransferDescription('');
        setView('list');
    };

    const handleDeleteClick = (accountId: string) => {
        setAccountToDelete(accountId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (accountToDelete) {
            deleteAccount(accountToDelete);
            toast({
                title: "Account Deleted",
                description: "Account has been removed successfully."
            });
            setDeleteDialogOpen(false);
            setAccountToDelete(null);
        }
    };

    const handleCancel = () => {
        setAccountName('');
        setInitialBalance('');
        setEditingAccountId(null);
        setView('list');
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {view === 'list' && 'Manage Accounts'}
                            {view === 'add' && 'Add Account'}
                            {view === 'edit' && 'Edit Account'}
                            {view === 'transfer' && 'Transfer Money'}
                        </DialogTitle>
                    </DialogHeader>

                    {view === 'list' && (
                        <div className="space-y-4 pt-4">
                            {/* Account List */}
                            <div className="space-y-2">
                                {budget.accounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-white/5 hover:bg-card/80 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-500">
                                                <Wallet className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{account.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Balance: ₹{account.balance.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClick(account.id)}
                                                className="h-8 w-8"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteClick(account.id)}
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <Button
                                    onClick={() => setView('add')}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Account
                                </Button>
                                <Button
                                    onClick={() => setView('transfer')}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
                                </Button>
                            </div>
                        </div>
                    )}

                    {(view === 'add' || view === 'edit') && (
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountName">Account Name *</Label>
                                <Input
                                    id="accountName"
                                    placeholder="e.g., Cash, Bank, Savings"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="initialBalance">
                                    {view === 'edit' ? 'Current Balance' : 'Initial Balance'}
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                    <Input
                                        id="initialBalance"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-8"
                                        value={initialBalance}
                                        onChange={(e) => setInitialBalance(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={view === 'edit' ? handleUpdateAccount : handleAddAccount}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                >
                                    {view === 'edit' ? 'Update Account' : 'Add Account'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {view === 'transfer' && (
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>From Account *</Label>
                                <Select value={fromAccountId} onValueChange={setFromAccountId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {budget.accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                {account.name} (₹{account.balance.toLocaleString('en-IN')})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>To Account *</Label>
                                <Select value={toAccountId} onValueChange={setToAccountId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select destination account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {budget.accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                {account.name} (₹{account.balance.toLocaleString('en-IN')})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transferAmount">Amount *</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                    <Input
                                        id="transferAmount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-8"
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transferDescription">Description (Optional)</Label>
                                <Input
                                    id="transferDescription"
                                    placeholder="Transfer note"
                                    value={transferDescription}
                                    onChange={(e) => setTransferDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleTransfer}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                >
                                    Transfer
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this account? This action cannot be undone.
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
