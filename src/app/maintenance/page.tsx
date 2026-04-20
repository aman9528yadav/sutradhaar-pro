"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Shield, Hourglass, Zap, PartyPopper, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMaintenance, Countdown } from '@/context/MaintenanceContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const CountdownBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-background/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner">
    <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 tracking-tight">
      {value}
    </span>
    <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 font-semibold">
      {label}
    </span>
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

export default function MaintenancePage() {
  const router = useRouter();
  const { maintenanceConfig, setDevMode } = useMaintenance();
  const { maintenanceTargetDate, maintenanceMessage, maintenanceCards } = maintenanceConfig || {};
  const { toast } = useToast();
  
  const [clickCount, setClickCount] = useState(0);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  
  const validTargetDate = maintenanceTargetDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  
  const defaultMessage = maintenanceMessage || "We're currently performing scheduled maintenance to improve our services. We're working as quickly as possible to restore service.";
  const defaultCards = maintenanceCards || [
    { title: "Minimal Downtime", description: "We're working as quickly as possible to restore service." },
    { title: "Better Experience", description: "Coming back with improved features and performance." }
  ];
  
  const [timeLeft, setTimeLeft] = useState<Countdown>(calculateTimeLeft(validTargetDate));
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (validTargetDate) {
      setTimeLeft(calculateTimeLeft(validTargetDate));
    }
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(validTargetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [validTargetDate]);

  const handleIconClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount >= 5) {
      setIsPasswordDialogOpen(true);
      setClickCount(0);
    }

    setTimeout(() => {
        if(clickCount < 5) setClickCount(0);
    }, 2000)
  };

  const handlePasswordSubmit = () => {
    const devPassword = maintenanceConfig?.devPassword || 'aman';
    if (password === devPassword) {
      setDevMode(true);
      toast({ title: 'Developer Mode Enabled' });
      router.push('/dev');
    } else {
      toast({ title: 'Incorrect Password', variant: 'destructive' });
    }
    setPassword('');
    setIsPasswordDialogOpen(false);
  };

  const isTimerFinished = timeLeft.days <= 0 && timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background p-4 md:p-8">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center space-y-12"
        >
          {/* Header Section */}
          <div className="space-y-6 flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer group"
              onClick={handleIconClick}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="h-24 w-24 rounded-3xl bg-background/80 backdrop-blur-xl border border-white/10 flex items-center justify-center relative shadow-2xl">
                {isTimerFinished ? (
                  <PartyPopper className="h-10 w-10 text-primary" />
                ) : (
                  <Wrench className="h-10 w-10 text-primary" />
                )}
                {clickCount > 0 && clickCount < 5 && (
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground animate-bounce">
                    {5 - clickCount}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                {isTimerFinished ? (
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">We're Back Online!</span>
                ) : (
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">System Maintenance</span>
                )}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {isTimerFinished 
                  ? "The maintenance is complete. All systems are fully operational." 
                  : defaultMessage}
              </p>
            </div>
          </div>

          {/* Countdown & Info Bento Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Countdown Hero Cell */}
            <div className="col-span-1 md:col-span-12 lg:col-span-8 p-1 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
              <div className="relative p-6 md:p-8 h-full flex flex-col justify-center space-y-8">
                {!isTimerFinished ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Hourglass className="h-5 w-5 text-primary" />
                        Estimated Time Remaining
                      </h2>
                      <div className="text-sm font-medium text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit">
                        {format(new Date(validTargetDate), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 md:gap-4" suppressHydrationWarning>
                      <CountdownBox value={mounted ? String(timeLeft.days) : "0"} label="Days" />
                      <CountdownBox value={mounted ? String(timeLeft.hours).padStart(2, '0') : "00"} label="Hours" />
                      <CountdownBox value={mounted ? String(timeLeft.minutes).padStart(2, '0') : "00"} label="Mins" />
                      <CountdownBox value={mounted ? String(timeLeft.seconds).padStart(2, '0') : "00"} label="Secs" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-6 py-8">
                    <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                      <PartyPopper className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Maintenance Complete</h2>
                    <Button 
                      onClick={() => router.push('/')}
                      className="rounded-full px-8 h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    >
                      Enter Application
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Side Cards Cell */}
            <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col gap-4">
              {defaultCards.slice(0, 2).map((card, index) => (
                <div key={index} className="flex-1 p-6 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-center group hover:bg-background/80 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                    {index === 0 ? <Shield className="h-6 w-6 text-primary" /> : <Zap className="h-6 w-6 text-primary" />}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground/90">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
            
          </div>

          {/* Footer Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            {!isTimerFinished && (
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="rounded-full px-8 h-12 border-white/10 hover:bg-white/5 backdrop-blur-md"
              >
                Refresh Status
              </Button>
            )}
            <Button 
              variant="ghost"
              className="rounded-full px-6 h-12 text-muted-foreground hover:text-foreground"
              onClick={() => window.location.href = 'mailto:amanyadavyadav9458@gmail.com'}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>

      <AlertDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] bg-background/90 backdrop-blur-2xl border-white/10 p-6 sm:p-8">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-2xl">
                <Lock className="h-6 w-6 text-primary" />
                Developer Access
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground mt-2">
                  Authentication is required to bypass maintenance mode and access the developer panel.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-6">
              <Input 
                  type="password"
                  placeholder="Enter developer password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="h-14 rounded-xl text-lg bg-background/50 border-white/10 focus-visible:ring-primary/50 text-center tracking-widest"
                  autoFocus
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-12 rounded-xl px-6">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePasswordSubmit} className="h-12 rounded-xl px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                Authenticate
              </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
