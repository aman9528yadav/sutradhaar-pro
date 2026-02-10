
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CalculatorSkeleton() {
  return (
    <div className="w-full space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="bg-muted p-4 rounded-lg text-right space-y-2">
            <Skeleton className="h-8 w-1/2 ml-auto" />
            <Skeleton className="h-[60px] w-3/4 ml-auto" />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[...Array(20)].map((_, i) => (
              <Skeleton key={i} className={`h-16 rounded-xl ${i === 16 ? 'col-span-2' : ''}`} />
            ))}
          </div>

          <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-1">
             <Skeleton className="h-16 w-full rounded-lg" />
             <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
