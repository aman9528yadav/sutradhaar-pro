"use client";

import { Skeleton } from '@/components/ui/skeleton';

export function SettingsPageSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 pb-24">
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-3">
          <Skeleton className="h-4 w-24 ml-4" />
          <div className="bg-card/30 rounded-2xl overflow-hidden border border-border/50">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    {item === 1 && <Skeleton className="h-3 w-48" />}
                  </div>
                </div>
                <Skeleton className="h-5 w-10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
