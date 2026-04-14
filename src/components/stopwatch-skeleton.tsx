
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StopwatchSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="h-20 w-64" />
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="flex justify-center items-center gap-4 pt-4">
           <Skeleton className="h-12 w-28" />
           <Skeleton className="h-12 w-32" />
           <Skeleton className="h-12 w-28" />
        </div>
        
        <div className="h-48 w-full rounded-md border p-2 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
