
"use client";

import React from 'react';
import { AdMobBanner } from '@/components/admob-banner';
import { Timer } from '@/components/timer';
import { TimerSkeleton } from '@/components/timer-skeleton';
import { useProfile } from '@/context/ProfileContext';

export default function TimerPage() {
  const { isLoading } = useProfile();

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
      <AdMobBanner className="mb-4 w-full" />
      <h1 className="text-2xl font-bold self-start mb-4">Timer</h1>
      {isLoading ? <TimerSkeleton /> : <Timer />}
      <AdMobBanner className="mt-4 w-full" />
    </main>
  );
}
