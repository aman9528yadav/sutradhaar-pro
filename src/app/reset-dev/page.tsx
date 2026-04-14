"use client";

import React, { useEffect } from 'react';
import { useMaintenance } from '@/context/MaintenanceContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LockOpen } from 'lucide-react';

export default function ResetDevPassword() {
    const { setMaintenanceConfig } = useMaintenance();
    const router = useRouter();

    const handleReset = () => {
        // Force reset the password to 'aman' and enable dev mode
        setMaintenanceConfig(prev => ({
            ...prev,
            devPassword: 'aman',
            isDevMode: true
        }));

        // Redirect to dev panel after a short delay
        setTimeout(() => {
            router.push('/dev');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Emergency Password Reset</CardTitle>
                    <CardDescription>
                        Click below to reset your developer password to: <strong>aman</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleReset} className="w-full gap-2" variant="destructive">
                        <LockOpen className="h-4 w-4" />
                        Reset & Enter Dev Mode
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
