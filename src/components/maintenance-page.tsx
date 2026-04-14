

"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Wrench, Shield, Hourglass, Zap, PartyPopper, Bell, ArrowRight, Lock } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const CountdownBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-card border border-border/50 rounded-xl p-4 min-w-[5rem] shadow-sm">
    <span className="text-4xl font-bold text-primary tabular-nums tracking-tight">{value}</span>
    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
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

export function MaintenancePage() {
  const router = useRouter();
  const { maintenanceConfig, setDevMode } = useMaintenance();
  const { maintenanceTargetDate, maintenanceMessage, maintenanceCards } = maintenanceConfig;
  const { toast } = useToast();

  const [clickCount, setClickCount] = useState(0);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState<Countdown>(calculateTimeLeft(maintenanceTargetDate));
  const [email, setEmail] = useState('');
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    if (maintenanceTargetDate) {
      setTimeLeft(calculateTimeLeft(maintenanceTargetDate));
    }
  }, [maintenanceTargetDate]);


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(maintenanceTargetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [maintenanceTargetDate]);


  const handleIconClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount >= 5) {
      setIsPasswordDialogOpen(true);
      setClickCount(0); // Reset after activation
    }

    setTimeout(() => {
      if (clickCount < 5) setClickCount(0);
    }, 2000)
  };

  const handlePasswordSubmit = () => {
    if (password === (maintenanceConfig.devPassword || 'aman')) {
      setDevMode(true);
      toast({ title: 'Developer Mode Enabled', description: 'Welcome back, Commander.' });
      router.push('/dev');
    } else {
      toast({ title: 'Access Denied', description: 'Incorrect password.', variant: 'destructive' });
    }
    setPassword('');
    setIsPasswordDialogOpen(false);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call
    setTimeout(() => {
      setIsNotified(true);
      toast({ title: "You're on the list!", description: "We'll notify you when we're back online." });
    }, 500);
  };

  const isTimerFinished = timeLeft.days <= 0 && timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="w-full max-w-2xl mx-auto relative z-10 space-y-12 text-center">

        {/* Header Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div
              className="relative group cursor-pointer"
              onClick={handleIconClick}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-background border border-border p-6 rounded-full shadow-2xl">
                <Wrench className="h-12 w-12 text-primary animate-pulse" />
              </div>
              {/* Secret Hint */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground whitespace-nowrap">
                <Lock className="h-3 w-3 inline mr-1" />
                Dev Access
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              {isTimerFinished ? "We are Back!" : "Under Maintenance"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {isTimerFinished
                ? "Systems are fully operational. Thank you for your patience."
                : "We're currently upgrading our systems to provide you with a better experience. We'll be back shortly."}
            </p>
          </div>
        </div>

        {/* Timer Section */}
        {!isTimerFinished ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center max-w-xl mx-auto">
            <CountdownBox value={String(timeLeft.days)} label="Days" />
            <CountdownBox value={String(timeLeft.hours).padStart(2, '0')} label="Hours" />
            <CountdownBox value={String(timeLeft.minutes).padStart(2, '0')} label="Minutes" />
            <CountdownBox value={String(timeLeft.seconds).padStart(2, '0')} label="Seconds" />
          </div>
        ) : (
          <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl inline-flex items-center gap-4">
            <PartyPopper className="h-8 w-8 text-green-500" />
            <div className="text-left">
              <h3 className="font-bold text-green-500">Maintenance Complete</h3>
              <p className="text-sm text-green-600/80">You can now access the application.</p>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
          {maintenanceCards && maintenanceCards.map((card, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  {index === 0 ? <Hourglass className="h-5 w-5 text-primary" /> : <Zap className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notify Me Section */}
        {!isTimerFinished && (
          <div className="max-w-md mx-auto space-y-4">
            {!isNotified ? (
              <form onSubmit={handleNotifySubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email for updates..."
                  className="bg-background/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit">
                  Notify Me <Bell className="ml-2 h-4 w-4" />
                </Button>
              </form>
            ) : (
              <div className="text-sm text-green-500 font-medium flex items-center justify-center gap-2 bg-green-500/10 py-2 px-4 rounded-full">
                <Bell className="h-4 w-4" /> You'll be notified when we're back!
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Estimated return: <span className="font-medium text-foreground">{format(new Date(maintenanceTargetDate), 'PPP p')}</span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-sm text-muted-foreground pt-8 border-t border-border/40">
          <p>
            Need urgent help? <a href="mailto:amanyadavyadav9458@gmail.com" className="text-primary hover:underline font-medium">Contact Support</a>
          </p>
        </div>

      </div>

      {/* Developer Access Dialog */}
      <AlertDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Developer Access</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the secure password to bypass maintenance mode.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            className="mt-2"
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordSubmit}>Access Panel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
