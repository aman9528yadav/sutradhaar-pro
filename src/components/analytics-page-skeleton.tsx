
"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AnalyticsPageSkeleton() {
  return (
    <div className="w-full space-y-6 pb-12">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-3 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Skeleton className="h-10 w-full" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[250px]">
           <Skeleton className="h-48 w-48 rounded-full" />
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
           <Skeleton className="h-16 w-full" />
           <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>

    </div>
  );
}
