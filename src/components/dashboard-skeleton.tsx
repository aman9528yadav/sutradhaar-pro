
"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      {/* Banner Skeleton */}
      <Skeleton className="h-[150px] w-full rounded-xl" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-[90px] w-full rounded-xl" />
        <Skeleton className="h-[90px] w-full rounded-xl" />
        <Skeleton className="h-[90px] w-full rounded-xl" />
      </div>
      
      {/* Weekly Summary Skeleton */}
      <Skeleton className="h-[150px] w-full rounded-xl" />


      {/* Quick Access Skeleton */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                </div>
            ))}
        </div>
      </div>

      {/* Widgets Skeleton */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      {/* What's New Skeleton */}
       <div className="space-y-3">
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}
