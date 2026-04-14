
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DateCalculatorSkeleton() {
  return (
    <div className="w-full space-y-4">
        <Skeleton className="h-10 w-full" />
      <Card>
        <CardContent className="p-4 space-y-6">
          <Skeleton className="h-7 w-40 mx-auto" />
          
          <div className="space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="flex justify-center">
                 <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          
          <Skeleton className="h-12 w-full" />
          
          <div className="bg-accent/50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            <div className="flex justify-around text-center">
                <div className="flex flex-col items-center space-y-1">
                    <Skeleton className="h-8 w-10" />
                    <Skeleton className="h-4 w-12" />
                </div>
                 <div className="flex flex-col items-center space-y-1">
                    <Skeleton className="h-8 w-10" />
                    <Skeleton className="h-4 w-12" />
                </div>
                 <div className="flex flex-col items-center space-y-1">
                    <Skeleton className="h-8 w-10" />
                    <Skeleton className="h-4 w-12" />
                </div>
                 <div className="flex flex-col items-center space-y-1">
                    <Skeleton className="h-8 w-10" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
             <Skeleton className="h-5 w-28 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
