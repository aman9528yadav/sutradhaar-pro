
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AboutPageSkeleton() {
  return (
    <div className="w-full space-y-8 pb-12">
      <section className="text-center space-y-4">
        <Skeleton className="h-20 w-20 rounded-full mx-auto" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-4 w-full max-w-md mx-auto" />
        <Skeleton className="h-4 w-2/3 max-w-md mx-auto" />
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </CardContent>
        </Card>
      </section>
      
      <section>
        <Card><CardContent className="p-4 h-36"><Skeleton className="h-full w-full"/></CardContent></Card>
      </section>
      
      <section>
        <Card><CardContent className="p-6 h-40"><Skeleton className="h-full w-full"/></CardContent></Card>
      </section>
      
       <section className="space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <div className="relative pl-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="relative mb-8">
              <Skeleton className="absolute left-0 top-1.5 w-4 h-4 rounded-full -translate-x-1/2" />
              <div className="pl-8 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
      
       <section className="space-y-4">
         <Skeleton className="h-8 w-56 mx-auto" />
         <Card><CardContent className="p-4 h-24"><Skeleton className="h-full w-full"/></CardContent></Card>
         <Card><CardContent className="p-4 h-24"><Skeleton className="h-full w-full"/></CardContent></Card>
      </section>

    </div>
  );
}
