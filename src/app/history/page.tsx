
"use client";

import React, { useState, useEffect } from 'react';
import { HistoryPage } from '@/components/history-page';
import { AdMobBanner } from '@/components/admob-banner';
import { HistoryPageSkeleton } from '@/components/history-page-skeleton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
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
import { useProfile } from '@/context/ProfileContext';

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const { isLoading: historyLoading } = useProfile();
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowLoginDialog(true);
    }
  }, [user, authLoading]);

  const handleGoToLogin = () => {
    router.push('/login');
  };
  
  const handleCancel = () => {
    router.push('/');
  }
  
  const isLoading = authLoading || historyLoading;
  
  if (isLoading) {
     return (
        <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
          <AdMobBanner className="mb-4 w-full" />
          <HistoryPageSkeleton />
          <AdMobBanner className="mt-4 w-full" />
        </main>
    );
  }

  if (!user) {
    return (
       <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to view your history. Please log in to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGoToLogin}>Go to Login</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }


  return (
    <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
      <AdMobBanner className="mb-4 w-full" />
      <HistoryPage />
      <AdMobBanner className="mt-4 w-full" />
    </main>
  );
}
