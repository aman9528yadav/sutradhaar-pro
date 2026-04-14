
"use client";

import React from 'react';
import { AdMobBanner } from '@/components/admob-banner';
import { DateCalculator } from '@/components/date-calculator';
import { DateCalculatorSkeleton } from '@/components/date-calculator-skeleton';
import { useProfile } from '@/context/ProfileContext';

export default function DateCalculatorPage() {
  const { isLoading } = useProfile();

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
      <AdMobBanner className="mb-4 w-full" />
      <h1 className="text-2xl font-bold self-start mb-4">Date Tools</h1>
      {isLoading ? <DateCalculatorSkeleton /> : <DateCalculator />}
      <AdMobBanner className="mt-4 w-full" />
    </main>
  );
}
