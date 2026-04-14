
"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfilePageSkeleton() {
  return (
    <div className="w-full space-y-6">
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-28" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-3 space-y-1">
            <Skeleton className="h-4 w-16 mx-auto" />
            <Skeleton className="h-6 w-8 mx-auto" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 space-y-1">
            <Skeleton className="h-4 w-12 mx-auto" />
            <Skeleton className="h-6 w-6 mx-auto" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 space-y-1">
            <Skeleton className="h-4 w-12 mx-auto" />
            <Skeleton className="h-6 w-6 mx-auto" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
