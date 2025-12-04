
"use client";

import { DevPanel } from '@/components/dev-panel';
import { useMaintenance } from '@/context/MaintenanceContext';
import { useRouter }from 'next/navigation';
import { useEffect } from 'react';

export default function DevPage() {
    const { isDevMode } = useMaintenance();
    const router = useRouter();

    useEffect(() => {
        if(!isDevMode){
            router.replace('/');
        }
    }, [isDevMode, router]);

    if(!isDevMode){
        return null;
    }

  return <DevPanel />;
}
