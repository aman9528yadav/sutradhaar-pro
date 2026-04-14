
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function AdPlaceholder({ className }: { className?: string }) {
  const [ad, setAd] = useState<{
    image: (typeof PlaceHolderImages)[0];
    title: string;
    cta: string;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const ads = [
        {
          image: PlaceHolderImages.find((img) => img.id === 'ad-car'),
          title: 'Upgrade Your Ride Today!',
          cta: 'Explore Cars',
        },
        {
          image: PlaceHolderImages.find((img) => img.id === 'ad-vacation'),
          title: 'Your Dream Vacation Awaits.',
          cta: 'Book Now',
        },
        {
          image: PlaceHolderImages.find((img) => img.id === 'ad-calculator'),
          title: 'Master Your Finances.',
          cta: 'Try Premium Calculator',
        },
      ];
      // Pick a random ad, but ensure we found the images
      const validAds = ads.filter((a) => a.image);
      if (validAds.length > 0) {
        setAd(validAds[Math.floor(Math.random() * validAds.length)] as any);
      }
    }
  }, [isClient]);

  if (!isClient || !ad) {
    return (
      <Card
        className={`flex items-center justify-center h-32 bg-muted/50 ${className}`}
      >
        <p className="text-muted-foreground">Ad Placeholder</p>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <div className="relative h-32 w-full">
          <Image
            src={ad.image.imageUrl}
            alt={ad.image.description}
            data-ai-hint={ad.image.imageHint}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-lg font-bold text-white">{ad.title}</h3>
            <p className="text-sm text-white/80">{ad.cta}</p>
          </div>
        </div>
      </a>
    </Card>
  );
}
