

"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Shield, Hourglass, Zap, PartyPopper } from 'lucide-react';
import Link from 'next/link';
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
  <div className="bg-card rounded-lg p-3 w-20 flex flex-col items-center shadow-inner">
    <span className="text-3xl font-bold text-primary">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
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
        if(clickCount < 5) setClickCount(0);
    }, 2000)
  };

  const handlePasswordSubmit = () => {
    if (password === (maintenanceConfig.devPassword || 'aman')) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-accent/70 p-4 rounded-full" onClick={handleIconClick}>
              <Wrench className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{isTimerFinished ? "We're Back!" : "We'll Be Back Soon!"}</h1>
            <p className="text-muted-foreground">
             {isTimerFinished ? "The maintenance is complete. The app is now back online." : "The app is currently undergoing scheduled maintenance. We expect to be back online in:"}
            </p>
          </div>

          {isTimerFinished ? (
             <div className="flex justify-center gap-3 p-4 bg-accent rounded-lg text-primary font-semibold">
                <PartyPopper className="h-6 w-6" />
                <span>We're back online! Thanks for your patience.</span>
            </div>
          ) : (
             <div className="space-y-3">
                <div className="flex justify-center gap-3">
                    <CountdownBox value={String(timeLeft.days)} label="DAYS" />
                    <CountdownBox value={String(timeLeft.hours).padStart(2, '0')} label="HOURS" />
                    <CountdownBox value={String(timeLeft.minutes).padStart(2, '0')} label="MINUTES"/>
                    <CountdownBox value={String(timeLeft.seconds).padStart(2, '0')} label="SECONDS" />
                </div>
                <p className="text-sm text-muted-foreground">
                    (Estimated: {format(new Date(maintenanceTargetDate), 'PPP p')})
                </p>
             </div>
          )}

          <Card>
            <CardContent className="p-4 text-left">
                <h3 className="font-semibold mb-2">A message from the team:</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{maintenanceMessage}</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
             {maintenanceCards && maintenanceCards.map((card, index) => (
              <Card key={index} className="bg-accent/50 border-none">
                <CardContent className="p-4 flex items-start gap-4">
                  {index === 0 ? <Hourglass className="h-6 w-6 text-primary mt-1" /> : <Zap className="h-6 w-6 text-primary mt-1" />}
                  <div>
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Need immediate assistance? Contact Aman at:{' '}
              <a
                href="mailto:amanyadavyadav9458@gmail.com"
                className="text-primary hover:underline"
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
