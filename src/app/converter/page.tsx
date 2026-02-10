
"use client";

import React from 'react';
import { UnitConverter } from '@/components/unit-converter';
import { AdMobBanner } from '@/components/admob-banner';
import { UnitConverterSkeleton } from '@/components/unit-converter-skeleton';
import { useProfile } from '@/context/ProfileContext';

export default function ConverterPage() {
  const { isLoading } = useProfile();

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
      <AdMobBanner className="mb-4 w-full" />
      <h1 className="text-2xl font-bold self-start mb-4">Unit Converter</h1>
      {isLoading ? <UnitConverterSkeleton /> : <UnitConverter />}
      <AdMobBanner className="mt-4 w-full" />
    </main>
  );
}
