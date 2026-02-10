"use client";

import React from 'react';
import { AnalyticsPageEnhanced } from '@/components/analytics-page-enhanced';
import { AnalyticsPageSkeleton } from '@/components/analytics-page-skeleton';
import { useProfile } from '@/context/ProfileContext';

export default function Analytics() {
  const { isLoading } = useProfile();

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-0">
      {isLoading ? <AnalyticsPageSkeleton /> : <AnalyticsPageEnhanced />}
    </main>
  );
}
