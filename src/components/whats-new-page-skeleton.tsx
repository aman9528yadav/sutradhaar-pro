
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function WhatsNewPageSkeleton() {
  return (
    <div className="w-full space-y-6">
      <Card className="p-4 space-y-4">
        <Skeleton className="h-6 w-32 mb-2" />
        <div className="flex justify-center gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3 w-20 flex flex-col items-center">
              <Skeleton className="h-8 w-10" />
              <Skeleton className="h-4 w-12 mt-1" />
            </div>
          ))}
        </div>
        <Skeleton className="h-8 w-24 mx-auto" />
      </Card>
      
      <Card className="p-4 space-y-2">
         <Skeleton className="h-5 w-24" />
         <Skeleton className="h-4 w-full" />
         <Skeleton className="h-4 w-3/4" />
      </Card>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

    