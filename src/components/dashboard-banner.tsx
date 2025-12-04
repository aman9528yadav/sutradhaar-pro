

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rocket, Info, PartyPopper } from 'lucide-react';
import { useMaintenance, Countdown } from '@/context/MaintenanceContext';
import Link from 'next/link';
import { AppUpdateBanner } from './app-update-banner';

const CountdownBox = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-accent/70 rounded-md p-1.5 w-12 flex flex-col items-center">
    <span className="text-xl font-bold text-primary">{value}</span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
  </div>
);

const calculateTimeLeft = (targetDate: string): Countdown => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    return timeLeft;
};

export function DashboardBanner() {
  const { maintenanceConfig } = useMaintenance();
  const { show, targetDate, category } = maintenanceConfig.dashboardBanner || {};
  
  const [timeLeft, setTimeLeft] = useState<Countdown>(calculateTimeLeft(targetDate));
  const [isVisible, setIsVisible] = useState(show || false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (maintenanceConfig.dashboardBanner) {
        setIsVisible(maintenanceConfig.dashboardBanner.show);
    }
  }, [maintenanceConfig.dashboardBanner]);

  useEffect(() => {
    if (!isVisible || !isClient || !targetDate) return;

    const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isVisible, isClient, targetDate]);

  const isTimerFinished = timeLeft.days <= 0 && timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0;
  
  return (
    <>
      <AppUpdateBanner />
      {isVisible && maintenanceConfig.dashboardBanner && (
        <Card className="bg-gradient-to-br from-primary/10 to-accent/20 border-primary/20">
          <CardContent className="p-4 relative">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full mt-1">
                    <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div className='flex-1 space-y-2'>
                    <div>
                        <h3 className="font-bold">Next Update Incoming!</h3>
                         <p className="text-xs text-muted-foreground">
                            {isTimerFinished ? "The latest update is live!" : "We're launching new features soon. Check out what's new!"}
                        </p>
                    </div>
                    
                    {isTimerFinished ? (
                        <div className="flex items-center justify-center gap-2 p-4 bg-accent/70 rounded-md text-primary font-semibold">
                           <PartyPopper className="h-5 w-5" />
                           <span>The new update is live!</span>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <CountdownBox value={String(timeLeft.days).padStart(2, '0')} label="DAYS" />
                            <CountdownBox value={String(timeLeft.hours).padStart(2, '0')} label="HOURS" />
                            <CountdownBox value={String(timeLeft.minutes).padStart(2, '0')} label="MINS" />
                            <CountdownBox value={String(timeLeft.seconds).padStart(2, '0')} label="SECS" />
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-primary bg-primary/10 border-primary/50 text-xs shrink-0">
                            {category}
                        </Badge>
                         <Button asChild size="sm" variant="link" className="text-primary pr-0">
                             <Link href="/whats-new">
                                <Info className="mr-2 h-4 w-4" />
                                Learn More
                             </Link>
                        </Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
