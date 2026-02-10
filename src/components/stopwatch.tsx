"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, RotateCcw, Flag, Download, Copy, Maximize, Minimize2, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Utility for formatting time
const formatTime = (time: number) => {
  const milliseconds = Math.floor((time % 1000) / 10);
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

  return {
    h: hours.toString().padStart(2, '0'),
    m: minutes.toString().padStart(2, '0'),
    s: seconds.toString().padStart(2, '0'),
    ms: milliseconds.toString().padStart(2, '0')
  };
};

export function Stopwatch() {
  const { toast } = useToast();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLapTimeRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          toggleTimer();
          break;
        case 'r':
          // Only reset if stopped or if specific intent (prevent accidental reset)
          if (!isRunning) resetTimer();
          break;
        case 'l':
          if (isRunning) recordLap();
          break;
        case 'escape':
          setIsFullScreen(false);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, time]);

  // Timer Interval Logic
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        setTime(accumulatedTimeRef.current + elapsed);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      accumulatedTimeRef.current = time;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
    lastLapTimeRef.current = 0;
  };

  const recordLap = () => {
    const lapTime = time - lastLapTimeRef.current;
    setLaps(prev => [lapTime, ...prev]);
    lastLapTimeRef.current = time;
  };

  const copyLaps = () => {
    const text = laps.map((lap, i) => {
      const { m, s, ms } = formatTime(lap);
      return `Lap ${laps.length - i}: ${m}:${s}.${ms}`;
    }).join('\n');
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Laps copied to clipboard" });
  };

  const { h, m, s, ms } = formatTime(time);

  // Full Screen View
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-12 w-12 rounded-full"
          onClick={() => setIsFullScreen(false)}
        >
          <Minimize2 className="h-6 w-6" />
        </Button>

        <div className="font-mono text-[15vw] font-bold tabular-nums tracking-tighter leading-none flex items-baseline">
          {parseInt(h) > 0 && <span>{h}:</span>}
          <span>{m}:{s}</span>
          <span className="text-[0.4em] text-muted-foreground ml-4">.{ms}</span>
        </div>

        <div className="mt-12 flex gap-8">
          <Button
            variant="outline"
            size="lg"
            className="h-24 w-24 rounded-full border-2 text-xl"
            onClick={isRunning ? recordLap : resetTimer}
          >
            {isRunning ? 'Lap' : 'Reset'}
          </Button>
          <Button
            size="lg"
            className={cn(
              "h-24 w-24 rounded-full text-xl shadow-lg transition-all",
              isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            )}
            onClick={toggleTimer}
          >
            {isRunning ? 'Stop' : 'Start'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card className="border-none shadow-2xl bg-gradient-to-br from-card to-card/50 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Stopwatch</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsFullScreen(true)}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Display */}
          <div className="flex flex-col items-center justify-center mb-12 relative">
            {/* Decorative Ring */}
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full transform scale-150" />

            <motion.div
              layout
              className="font-mono text-7xl font-bold tracking-tighter tabular-nums text-foreground drop-shadow-sm flex items-baseline z-10"
            >
              {parseInt(h) > 0 && <span className="mr-2">{h}:</span>}
              <span>{m}:{s}</span>
              <span className="text-3xl text-muted-foreground ml-2 font-normal">.{ms}</span>
            </motion.div>

            {/* Current Lap Display (small) */}
            {isRunning && laps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-base font-mono text-muted-foreground/80 tabular-nums"
              >
                Lap: {formatTime(time - lastLapTimeRef.current).m}:{formatTime(time - lastLapTimeRef.current).s}
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full border border-border/50 hover:bg-secondary hover:border-border transition-all"
              onClick={resetTimer}
              disabled={isRunning && time > 0}
            >
              <RotateCcw className={cn("h-6 w-6", time === 0 && "opacity-50")} />
            </Button>

            <Button
              size="lg"
              className={cn(
                "h-24 w-24 rounded-[2rem] shadow-xl text-white transition-all transform hover:scale-105 active:scale-95",
                isRunning ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
              )}
              onClick={toggleTimer}
            >
              {isRunning ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full border border-border/50 hover:bg-secondary hover:border-border transition-all"
              onClick={recordLap}
              disabled={!isRunning}
            >
              <Flag className={cn("h-6 w-6", !isRunning && "opacity-50")} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Laps List */}
      <AnimatePresence>
        {laps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Laps ({laps.length})
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={copyLaps} className="h-8">
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[250px]">
                  <div className="divide-y divide-border/30">
                    {laps.map((lap, i) => {
                      const { m, s, ms } = formatTime(lap);
                      const index = laps.length - i;
                      const isFastest = Math.min(...laps) === lap;
                      const isSlowest = Math.max(...laps) === lap && laps.length > 1;

                      return (
                        <div key={index} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                          <span className="text-sm text-muted-foreground font-mono w-12">#{index}</span>
                          <span className={cn(
                            "font-mono text-base font-medium tabular-nums",
                            isFastest && "text-emerald-500",
                            isSlowest && "text-rose-500"
                          )}>
                            {m}:{s}.{ms}
                          </span>
                          <span className="text-xs text-muted-foreground/50 w-12 text-right">
                            {isFastest && "Best"}
                            {isSlowest && "Worst"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
