"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rocket, Info, PartyPopper, X, Bell, Clock } from 'lucide-react';
import { useMaintenance, Countdown } from '@/context/MaintenanceContext';
import Link from 'next/link';
import { AppUpdateBanner } from './app-update-banner';
import { motion, AnimatePresence } from 'framer-motion';

const CountdownBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[3rem] border border-white/20 dark:border-white/10 shadow-sm">
    <span className="text-xl font-bold text-gray-900 dark:text-white tabular-nums leading-none">{value}</span>
    <span className="text-[10px] font-medium text-gray-700 dark:text-white/80 uppercase tracking-wider mt-1">{label}</span>
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
  const [isDismissed, setIsDismissed] = useState(false);

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

  if (isDismissed) return <AppUpdateBanner />;

  return (
    <>
      <AppUpdateBanner />
      <AnimatePresence>
        {isVisible && maintenanceConfig.dashboardBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative overflow-hidden rounded-xl shadow-lg mb-6 border-2 border-border bg-card"
          >
            {/* Subtle accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />

            <div className="relative p-6 flex flex-col gap-5">

              {/* Row 1: Title & Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                    {isTimerFinished ? "Update Live!" : "Update Incoming"}
                  </h3>
                  <Badge variant="secondary" className="bg-white/90 hover:bg-white dark:bg-white/25 dark:hover:bg-white/35 text-gray-900 dark:text-white border-none backdrop-blur-md px-2.5 py-0.5 h-6">
                    {category}
                  </Badge>
                </div>
                {/* Close Button */}
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors -mr-2 -mt-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Row 2: Timer */}
              <div className="flex justify-center py-2">
                {!isTimerFinished ? (
                  <div className="flex gap-3">
                    <CountdownBox value={String(timeLeft.days)} label="DAYS" />
                    <CountdownBox value={String(timeLeft.hours).padStart(2, '0')} label="HRS" />
                    <CountdownBox value={String(timeLeft.minutes).padStart(2, '0')} label="MINS" />
                    <CountdownBox value={String(timeLeft.seconds).padStart(2, '0')} label="SECS" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-6 py-3 bg-accent backdrop-blur-md rounded-xl border border-border w-full justify-center">
                    <PartyPopper className="h-5 w-5 text-yellow-300" />
                    <span className="font-semibold">The update is now live!</span>
                  </div>
                )}
              </div>

              {/* Row 3: Icon & Content */}
              <div className="flex items-start gap-4 bg-accent rounded-xl p-4 border border-border">
                <div className="p-2.5 bg-primary/10 backdrop-blur-sm rounded-lg border border-border shadow-inner shrink-0">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    {isTimerFinished
                      ? "We've just pushed some exciting new features and improvements. Check out the details to see what's new."
                      : "We're putting the finishing touches on a major update. Get ready for a smoother, faster experience."}
                  </p>

                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm border-none"
                      asChild
                    >
                      <Link href="/whats-new">
                        <Info className="mr-1.5 h-3.5 w-3.5" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
