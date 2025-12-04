
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ArrowLeft, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMaintenance, MembershipFeature } from '@/context/MaintenanceContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile } from '@/context/ProfileContext';

function MembershipPageSkeleton() {
    return (
        <div className="w-full space-y-6 pb-12">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />

            <Card className="mt-8">
                <CardHeader>
                    <div className="grid grid-cols-3 items-center">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-8 w-20 justify-self-center" />
                        <Skeleton className="h-8 w-24 justify-self-center" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="grid grid-cols-3 items-center p-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-6 w-6 justify-self-center rounded-full" />
                            <Skeleton className="h-6 w-6 justify-self-center rounded-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Skeleton className="h-12 w-full mt-4" />
        </div>
    )
}


export default function MembershipPage() {
    const router = useRouter();
    const { maintenanceConfig, isLoading: isMaintenanceLoading } = useMaintenance();
    const { profile, isLoading: isProfileLoading } = useProfile();

    const isLoading = isMaintenanceLoading || isProfileLoading;
    const features = maintenanceConfig.membershipFeatures || [];

    const isPremium = profile.membership === 'premium' || profile.membership === 'owner';

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-background text-foreground p-4">
            <div className="w-full max-w-[412px] flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-6 pt-4">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Membership Tiers</h1>
                    </div>
                </div>

                <main className="flex-1 space-y-6 pb-12">
                    {isLoading ? (
                        <MembershipPageSkeleton />
                    ) : (
                        <>
                            <p className="text-muted-foreground text-center">Unlock powerful features by upgrading to Premium. Compare the plans below to see what you get.</p>

                            <Card className="mt-4 bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
                                <CardHeader className="bg-secondary/30 border-b border-white/5 pb-4">
                                    <div className="grid grid-cols-3 items-center font-semibold">
                                        <span className="text-lg">Feature</span>
                                        <span className="text-center text-muted-foreground">Member</span>
                                        <span className="text-center text-primary flex items-center justify-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-primary/10">
                                                <Gem className="h-4 w-4" />
                                            </div>
                                            Premium
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="divide-y divide-white/5 p-0">
                                    {features.map(item => (
                                        <div key={item.id} className="grid grid-cols-3 items-center p-4 hover:bg-white/5 transition-colors">
                                            <span className="font-medium text-sm">{item.feature}</span>
                                            <div className="justify-self-center">
                                                {item.member ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-muted-foreground/30" />}
                                            </div>
                                            <div className="justify-self-center">
                                                {item.premium ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-muted-foreground/30" />}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {!isPremium && (
                                <Button size="lg" className="w-full gap-2 mt-6 h-12 text-base shadow-lg shadow-primary/20">
                                    <Gem className="h-5 w-5" />
                                    Upgrade to Premium
                                </Button>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
