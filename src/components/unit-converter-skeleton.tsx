
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UnitConverterSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-5 w-16 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className='space-y-2'>
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="relative flex items-center">
            <Skeleton className="h-[52px] flex-1 rounded-md" />
            <div className="px-2">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-[52px] flex-1 rounded-md" />
          </div>

          <div className="bg-accent p-4 rounded-lg flex items-center justify-between">
            <Skeleton className="h-9 w-1/2" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-16" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>
        </CardContent>
      </Card>
      
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
