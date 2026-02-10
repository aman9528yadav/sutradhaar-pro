
"use client";

import React from 'react';
import { HistoryPage } from '@/components/history-page';
import { AdMobBanner } from '@/components/admob-banner';
import { HistoryPageSkeleton } from '@/components/history-page-skeleton';
import { useProfile } from '@/context/ProfileContext';

export default function History() {
  const { isLoading: historyLoading } = useProfile();

  if (historyLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
        <AdMobBanner className="mb-4 w-full" />
        <HistoryPageSkeleton />
        <AdMobBanner className="mt-4 w-full" />
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
      <AdMobBanner className="mb-4 w-full" />
      <HistoryPage />
      <AdMobBanner className="mt-4 w-full" />
    </main>
  );
}
