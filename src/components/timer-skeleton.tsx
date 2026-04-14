
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TimerSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-6">
        <div className="flex justify-center items-center gap-4">
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-16 w-20" />
          </div>
          <Skeleton className="h-8 w-4" />
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-16 w-20" />
          </div>
          <Skeleton className="h-8 w-4" />
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-16 w-20" />
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 pt-4">
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
