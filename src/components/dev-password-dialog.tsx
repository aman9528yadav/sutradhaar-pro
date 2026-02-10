
"use client";

import React, { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input";
import { useMaintenance } from '@/context/MaintenanceContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DevPasswordDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DevPasswordDialog({ isOpen, onOpenChange, onSuccess }: DevPasswordDialogProps) {
    const { maintenanceConfig, setDevMode } = useMaintenance();
    const { toast } = useToast();
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handlePasswordSubmit = () => {
        const correctPassword = maintenanceConfig.devPassword || 'aman';
        if (password === correctPassword) {
            setDevMode(true);
            toast({ title: 'Developer Mode Enabled' });
            onOpenChange(false);
            setPassword('');
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/dev');
            }
        } else {
            toast({ title: 'Incorrect Password', variant: 'destructive' });
            setPassword('');
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-[350px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Developer Access</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enter the developer password to continue.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                        autoFocus
                    />
                </div>
                <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                    <AlertDialogCancel onClick={() => setPassword('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePasswordSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
