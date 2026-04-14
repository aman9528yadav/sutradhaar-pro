
"use client";

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Calculator } from '@/components/calculator';
import { AdMobBanner } from '@/components/admob-banner';
import { CalculatorSkeleton } from '@/components/calculator-skeleton';
import { useProfile } from '@/context/ProfileContext';
import { cn } from '@/lib/utils';

export default function CalculatorPage() {
  const { isLoading } = useProfile();
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="w-full max-w-[412px] h-full flex flex-col justify-center p-4">
           <Calculator isFullScreen={isFullScreen} onToggleFullScreen={() => setIsFullScreen(false)} />
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
      <AdMobBanner className="mb-4 w-full" />
      <h1 className="text-2xl font-bold self-start mb-4">Calculator</h1>
      {isLoading ? (
        <CalculatorSkeleton />
      ) : (
        <Calculator onToggleFullScreen={() => setIsFullScreen(true)} />
      )}
      <AdMobBanner className="mt-4 w-full" />
    </main>
  );
}
