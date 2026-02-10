
"use client";

import React, { useEffect, useState } from 'react';
import { useMaintenance } from '@/context/MaintenanceContext';
import { DevPasswordDialog } from './dev-password-dialog';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/hooks/use-toast';

export function DevShortcutHandler() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { isDevMode, setDevMode } = useMaintenance();
    const { user } = useAuth();
    const { profile } = useProfile();
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();

    const isOwner = user?.email === 'amanyadavyadav9458@gmail.com' || profile.email === 'amanyadavyadav9458@gmail.com';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + Shift + D to toggle/access dev mode
            if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
                e.preventDefault();

                if (isDevMode) {
                    // If already in dev mode and not on dev page, go to dev page
                    if (!pathname.startsWith('/dev')) {
                        router.push('/dev');
                    } else {
                        // Toggling off
                        setDevMode(false);
                        toast({ title: 'Developer Mode Disabled' });
                    }
                } else {
                    if (isOwner) {
                        setDevMode(true);
                        toast({ title: 'Developer Mode Enabled' });
                    } else {
                        setIsDialogOpen(true);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDevMode, pathname, router, setDevMode, isOwner, toast]);

    return (
        <DevPasswordDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    );
}
