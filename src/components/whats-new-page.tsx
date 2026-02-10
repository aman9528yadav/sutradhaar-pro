

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
  <div className="flex flex-col items-center justify-center bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-xl p-2 md:p-3 min-w-[3.5rem] md:min-w-[4rem] border border-white/20 dark:border-white/10 shadow-lg">
    <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tabular-nums leading-none">{value}</span>
    <span className="text-[9px] md:text-[10px] font-semibold text-gray-700 dark:text-white/70 uppercase tracking-wider mt-1">{label}</span>
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 dark:from-violet-600 dark:via-indigo-600 dark:to-purple-700" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 dark:bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative p-6 md:p-12 text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-white/90 hover:bg-white dark:bg-white/20 dark:hover:bg-white/30 text-gray-900 dark:text-white border-none backdrop-blur-md px-3 py-1 text-sm">
                <Sparkles className="w-3 h-3 mr-2" />
                Next Major Update
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Coming Soon
              </h1>
              <p className="text-base md:text-lg text-gray-900 dark:text-indigo-100 max-w-2xl mx-auto leading-relaxed font-medium">
                We're working hard on the next release. Get ready for new features, performance improvements, and a smoother experience.
              </p>
            </div>

            <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
              <CountdownBox value={String(timeLeft.days)} label="DAYS" />
              <CountdownBox value={String(timeLeft.hours).padStart(2, '0')} label="HOURS" />
              <CountdownBox value={String(timeLeft.minutes).padStart(2, '0')} label="MINS" />
              <CountdownBox value={String(timeLeft.seconds).padStart(2, '0')} label="SECS" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mt-8">
              <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/25 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-indigo-200 font-semibold text-sm uppercase tracking-wider">
                  <Zap className="w-4 h-4" /> Focus Area
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{category}</div>
              </div>
              <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/25 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-indigo-200 font-semibold text-sm uppercase tracking-wider">
                  <Rocket className="w-4 h-4" /> Sneak Peek
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line text-gray-900 dark:text-white/90 font-medium">
                  {upcomingFeatureDetails}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
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
                className="relative flex items-start md:items-center gap-4 md:gap-0 md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon Marker */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                  <ItemIcon className="w-5 h-5 text-primary" />
                </div>

                {/* Content Card */}
                <div className="flex-1 md:w-[50%] md:flex-none md:group-odd:pr-8 md:group-even:pl-8">
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-1 mb-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="font-bold text-lg text-primary">{item.title}</h3>
                          <time className="text-xs font-medium text-muted-foreground flex items-center shrink-0">
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
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
