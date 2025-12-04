"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AdMobBanner({ className }: { className?: string }) {
  return (
    <Card className={`overflow-hidden flex flex-col justify-between h-32 bg-neutral-800 text-white p-3 ${className}`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="font-bold text-lg">Your Ad Title Here</p>
                <p className="text-sm">Advertiser Name</p>
            </div>
            <Badge variant="secondary" className="bg-yellow-400 text-black">Ad</Badge>
        </div>
        <div className="flex justify-end">
            <button className="bg-blue-600 text-white text-sm font-bold py-1 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Install Now
            </button>
        </div>
    </Card>
  );
}
