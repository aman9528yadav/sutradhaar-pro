"use client";

import React, { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
    Settings,
    LogOut,
    User,
    Trophy,
    Flame,
    Calendar,
    Star,
    ChevronRight,
    Shield,
    LogIn
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ProfilePageProps {
    onNavigate: (tab: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
    const { user, loading: isAuthLoading, logout } = useAuth();
    const { profile } = useProfile();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="p-4 space-y-6 max-w-md mx-auto pb-24">
                <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>
                <Skeleton className="h-40 rounded-xl" />
            </div>
        );
    }

    const displayName = user?.displayName || profile.name || 'Guest User';
    const email = user?.email || profile.email || 'No email';
    const photoUrl = user?.photoURL || profile.photoUrl;
    const initials = displayName.charAt(0).toUpperCase();
    const isPremium = profile.membership === 'premium' || profile.membership === 'owner';

    return (
        <div className="p-4 space-y-6 max-w-md mx-auto pb-24">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center space-y-4 pt-4"
            >
                <div className="relative">
                    <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                        <AvatarImage src={photoUrl} alt={displayName} />
                        <AvatarFallback className="text-4xl bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    {isPremium && (
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-1.5 rounded-full shadow-lg border-2 border-background">
                            <Trophy className="h-4 w-4" />
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
                    <p className="text-sm text-muted-foreground">{email}</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-6"
                        onClick={() => router.push('/profile/edit')}
                    >
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-3"
            >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-full mb-1">
                            <Star className="h-4 w-4" />
                        </div>
                        <span className="text-2xl font-bold">{profile.stats.allTimeActivities}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total</span>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-full mb-1">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <span className="text-2xl font-bold">{profile.stats.todayActivities}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Today</span>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                        <div className="p-2 bg-orange-500/10 text-orange-500 rounded-full mb-1">
                            <Flame className="h-4 w-4" />
                        </div>
                        <span className="text-2xl font-bold">{profile.stats.streak}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Streak</span>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Menu Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                <h3 className="text-sm font-medium text-muted-foreground ml-1">Preferences</h3>
                <Card className="overflow-hidden border-border/50 shadow-sm">
                    <div className="divide-y divide-border/50">
                        <button
                            onClick={() => router.push('/settings')}
                            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium">Settings</div>
                                    <div className="text-xs text-muted-foreground">App configuration & preferences</div>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        </button>

                        <button
                            onClick={() => onNavigate('membership')}
                            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium">Membership</div>
                                    <div className="text-xs text-muted-foreground">{isPremium ? 'Manage Premium' : 'Upgrade to Premium'}</div>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        </button>
                    </div>
                </Card>

                <div className="pt-2">
                    {user ? (
                        <Button
                            variant="destructive"
                            className="w-full h-12 rounded-xl shadow-sm"
                            onClick={() => setShowLogoutConfirm(true)}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            className="w-full h-12 rounded-xl shadow-sm"
                            onClick={() => router.push('/login')}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sign Out</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to sign out? You will need to sign in again to access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Sign Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
