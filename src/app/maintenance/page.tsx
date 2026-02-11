
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Shield, Hourglass, Zap, PartyPopper } from 'lucide-react';
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

const CountdownBox = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 w-20 flex flex-col items-center shadow-lg border border-primary/20">
    <span className="text-3xl font-bold text-primary">{value}</span>
    <span className="text-xs text-muted-foreground mt-1">{label}</span>
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
  
  // Ensure we have a valid target date
  const validTargetDate = maintenanceTargetDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  
  // Set default values if config is not loaded
  const defaultMessage = maintenanceMessage || "We're currently performing scheduled maintenance to improve our services. We're working as quickly as possible to restore service.";
  const defaultCards = maintenanceCards || [
    { title: "Minimal Downtime", description: "We're working as quickly as possible to restore service." },
    { title: "Better Experience", description: "Coming back with improved features and performance." }
  ];
  
  const [timeLeft, setTimeLeft] = useState<Countdown>(calculateTimeLeft(validTargetDate));
  
  useEffect(() => {
    // Update initial time left
    if (validTargetDate) {
      setTimeLeft(calculateTimeLeft(validTargetDate));
    }
    
    // Set up interval to update timer every second
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
      setClickCount(0); // Reset after activation
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

  // Ensure we have a valid target date
  const validTargetDate = maintenanceTargetDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center space-y-8">
          {/* Main icon */}
          <div className="flex justify-center">
            <div 
              className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-full shadow-xl cursor-pointer"
              onClick={handleIconClick}
            >
              {isTimerFinished ? (
                <PartyPopper className="h-16 w-16 text-primary" />
              ) : (
                <Wrench className="h-16 w-16 text-primary" />
              )}
            </div>
          </div>

          {/* Title and message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {isTimerFinished ? "We're Back Online!" : "Undergoing Maintenance"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {isTimerFinished 
                ? "The maintenance is complete. The app is now back online with exciting new features!" 
                : defaultMessage}
            </p>
          </div>

          {/* Countdown timer */}
          {!isTimerFinished ? (
            <div className="space-y-6">
              <div className="flex justify-center gap-4 flex-wrap">
                <CountdownBox value={String(timeLeft.days)} label="DAYS" />
                <CountdownBox value={String(timeLeft.hours).padStart(2, '0')} label="HOURS" />
                <CountdownBox value={String(timeLeft.minutes).padStart(2, '0')} label="MINUTES" />
                <CountdownBox value={String(timeLeft.seconds).padStart(2, '0')} label="SECONDS" />
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated completion: {format(new Date(validTargetDate), 'PPP p')}
              </p>
            </div>
          ) : (
            <div className="flex justify-center gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl text-primary font-semibold border border-green-500/20">
              <PartyPopper className="h-6 w-6" />
              <span>We're back online! Thanks for your patience.</span>
            </div>
          )}

          {/* Maintenance message card */}
          <div>
            <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">What's Happening</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{defaultMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance cards */}
          {defaultCards && defaultCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {defaultCards.map((card, index) => (
                <Card key={index} className="bg-card/70 backdrop-blur-sm border-0 shadow-lg h-full">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg mt-1">
                      {index === 0 ? <Hourglass className="h-5 w-5 text-primary" /> : <Zap className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{card.title}</h3>
                      <p className="text-muted-foreground">{card.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Action button */}
          <div>
            <Button 
              onClick={() => router.push('/')}
              className="mt-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              {isTimerFinished ? "Go to App" : "Refresh Status"}
            </Button>
          </div>

          {/* Contact info */}
          <div className="text-sm text-muted-foreground mt-8">
            <p>
              Need immediate assistance? Contact Aman at:{' '}
              <a
                href="mailto:amanyadavyadav9458@gmail.com"
                className="text-primary hover:underline font-medium"
              >
                amanyadavyadav9458@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <AlertDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Enter Developer Password</AlertDialogTitle>
            <AlertDialogDescription>
                This action requires a password to enable developer mode and access the dev panel.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <Input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordSubmit}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
