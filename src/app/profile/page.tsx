
"use client";

import React, { useState, useEffect } from 'react';
import { ProfilePage } from '@/components/profile-page';
import { ProfilePageSkeleton } from '@/components/profile-page-skeleton';
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

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
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
  
  if (authLoading) {
    return (
       <main className="flex-1 overflow-y-auto p-4 pt-2 space-y-4">
        <ProfilePageSkeleton />
      </main>
    )
  }
  
  if (!user) {
    return (
       <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to view your profile. Please log in to continue.
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
    <main className="flex-1 overflow-y-auto p-4 pt-2 space-y-4">
      <ProfilePage />
    </main>
  );
}
