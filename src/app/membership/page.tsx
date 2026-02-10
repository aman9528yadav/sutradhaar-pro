
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowLeft, Gem, Crown, Shield, Zap, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMaintenance, MembershipFeature } from '@/context/MaintenanceContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile } from '@/context/ProfileContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function MembershipPageSkeleton() {
    return (
        <div className="w-full space-y-6 p-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
    )
}

export default function MembershipPage() {
    const router = useRouter();
    const { maintenanceConfig, isLoading: isMaintenanceLoading } = useMaintenance();
    const { profile, isLoading: isProfileLoading } = useProfile();
    const [activeTab, setActiveTab] = useState<'member' | 'premium'>('premium');

    const isLoading = isMaintenanceLoading || isProfileLoading;
    const features = maintenanceConfig.membershipFeatures || [];
    const isPremium = profile.membership === 'premium' || profile.membership === 'owner';

    if (isLoading) return <MembershipPageSkeleton />;

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Sticky Header */}
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2 hover:bg-accent/50 rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-bold tracking-tight">Membership Plans</h1>
            </header>

            <main className="p-4 space-y-6 max-w-md mx-auto">
                {/* Plan Toggle */}
                <div className="grid grid-cols-2 bg-muted/50 p-1.5 rounded-2xl border border-border/50">
                    <button
                        onClick={() => setActiveTab('member')}
                        className={cn(
                            "py-3 text-sm font-semibold rounded-xl transition-all duration-300",
                            activeTab === 'member'
                                ? "bg-background shadow-sm text-foreground ring-1 ring-black/5 dark:ring-white/10"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Member
                    </button>
                    <button
                        onClick={() => setActiveTab('premium')}
                        className={cn(
                            "py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                            activeTab === 'premium'
                                ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Gem className="h-3.5 w-3.5" /> Premium
                    </button>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: activeTab === 'premium' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: activeTab === 'premium' ? 20 : -20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {activeTab === 'member' ? (
                            <div className="space-y-6">
                                <Card className="border-border/50 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4">
                                            <UserIcon className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <CardTitle className="text-2xl">Member Plan</CardTitle>
                                        <CardDescription className="text-base">
                                            Essential features to get you started.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="text-2xl font-bold">Free <span className="text-sm font-normal text-muted-foreground">/ forever</span></div>
                                        <div className="space-y-3 pt-4 border-t border-border/50">
                                            {features.filter(f => f.member).map((item) => (
                                                <div key={item.id} className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-0.5 bg-green-500/10 rounded-full shrink-0">
                                                        <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{item.feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <Card className="border-indigo-500/20 shadow-lg shadow-indigo-500/5 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    <CardHeader className="pb-4 relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                                            <Crown className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-2xl">Premium Plan</CardTitle>
                                        <CardDescription className="text-base">
                                            Unlock the full potential of the platform.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 relative">
                                        <div className="text-2xl font-bold">
                                            {maintenanceConfig.pricing?.currency || '$'}{maintenanceConfig.pricing?.monthly || '9.99'}
                                            <span className="text-sm font-normal text-muted-foreground">/ month</span>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-border/50">
                                            <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Everything in Member, plus:</div>
                                            {features.map((item) => {
                                                const isExclusive = item.premium && !item.member;
                                                if (!item.premium) return null;

                                                return (
                                                    <div key={item.id} className={cn(
                                                        "flex items-start gap-3 p-3 rounded-xl transition-colors",
                                                        isExclusive ? "bg-indigo-500/5 border border-indigo-500/10" : ""
                                                    )}>
                                                        <div className={cn(
                                                            "mt-0.5 p-0.5 rounded-full shrink-0",
                                                            isExclusive ? "bg-indigo-500 text-white shadow-sm" : "bg-green-500/10"
                                                        )}>
                                                            {isExclusive ? <Star className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className={cn("text-sm font-medium", isExclusive ? "text-foreground" : "text-muted-foreground")}>
                                                                {item.feature}
                                                            </span>
                                                            {isExclusive && (
                                                                <p className="text-[10px] text-indigo-500/80 font-medium mt-0.5">Premium Exclusive</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Floating CTA */}
            {!isPremium && activeTab === 'premium' && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-20 left-0 right-0 p-4 z-50 pointer-events-none"
                >
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <div className="bg-background/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl">
                            <Button size="lg" className="w-full h-12 text-base font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/20 rounded-xl">
                                Upgrade to Premium
                                <Zap className="ml-2 h-4 w-4 fill-current" />
                            </Button>
                            <p className="text-center text-xs text-muted-foreground mt-3">
                                Cancel anytime. Secure payment.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
