

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Rocket,
  User,
  Languages,
  Bug,
  Icon,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useMaintenance, UpdateItem } from '@/context/MaintenanceContext';
import { AppUpdateBanner } from './app-update-banner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const CountdownBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-xl p-3 min-w-[4rem] border border-white/10 shadow-lg">
    <span className="text-3xl font-bold text-white tabular-nums leading-none">{value}</span>
    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider mt-1">{label}</span>
  </div>
);

const iconMap: { [key: string]: Icon } = {
  Wrench,
  Rocket,
  User,
  Languages,
  Bug,
};

export function WhatsNewPage() {
  const { maintenanceConfig } = useMaintenance();
  const { show: showBanner, targetDate, category, upcomingFeatureDetails } = maintenanceConfig.dashboardBanner || {};
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !targetDate) return;

    const target = new Date(targetDate);

    const updateCountdown = () => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);

  }, [isClient, targetDate]);

  const updateItems = maintenanceConfig.updateItems || [];

  return (
    <div className="w-full space-y-8 pb-12">
      <AppUpdateBanner />

      {/* Hero Section */}
      {showBanner && timeLeft && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative p-8 md:p-12 text-center text-white space-y-8">
            <div className="space-y-4">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-3 py-1 text-sm">
                <Sparkles className="w-3 h-3 mr-2" />
                Next Major Update
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Coming Soon
              </h1>
              <p className="text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                We're working hard on the next release. Get ready for new features, performance improvements, and a smoother experience.
              </p>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <CountdownBox value={String(timeLeft.days)} label="DAYS" />
              <CountdownBox value={String(timeLeft.hours).padStart(2, '0')} label="HOURS" />
              <CountdownBox value={String(timeLeft.minutes).padStart(2, '0')} label="MINS" />
              <CountdownBox value={String(timeLeft.seconds).padStart(2, '0')} label="SECS" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-indigo-200 font-semibold text-sm uppercase tracking-wider">
                  <Zap className="w-4 h-4" /> Focus Area
                </div>
                <div className="text-xl font-bold">{category}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-indigo-200 font-semibold text-sm uppercase tracking-wider">
                  <Rocket className="w-4 h-4" /> Sneak Peek
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line opacity-90">
                  {upcomingFeatureDetails}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Update History</h2>
          <Badge variant="outline" className="text-muted-foreground">
            {updateItems.length} Releases
          </Badge>
        </div>

        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {updateItems.map((item, index) => {
            const ItemIcon = iconMap[item.icon] || Bug;
            const tags = item.tags || [];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon Marker */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <ItemIcon className="w-5 h-5 text-primary" />
                </div>

                {/* Content Card */}
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-0 hover:shadow-lg transition-shadow duration-300 border-border/50">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-1 mb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-primary">{item.title}</h3>
                        <time className="text-xs font-medium text-muted-foreground flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.date}
                        </time>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={`
                                                px-2 py-0.5 text-xs font-medium border
                                                ${tag.includes('Beta') ? 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900' : ''}
                                                ${tag.includes('Fix') ? 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900' : ''}
                                                ${tag.includes('New') ? 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900' : ''}
                                            `}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
