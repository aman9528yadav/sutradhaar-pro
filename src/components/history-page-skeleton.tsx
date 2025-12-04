
"use client";

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function HistoryPageSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="space-y-4 pt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-28" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-7 w-3/4 mb-3" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7 w-7" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
