"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, RotateCcw, Flag, Download, Copy, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const formatTime = (time: number) => {
  const milliseconds = `0${time % 1000}`.slice(-3, -1);
  const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
  const minutes = `0${Math.floor((time / (1000 * 60)) % 60)}`.slice(-2);
  const hours = `0${Math.floor((time / (1000 * 60 * 60)) % 24)}`.slice(-2);

  return { hours, minutes, seconds, milliseconds };
};

const formatTimeString = (time: number) => {
  const { hours, minutes, seconds, milliseconds } = formatTime(time);
  if (parseInt(hours) > 0) {
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
  return `${minutes}:${seconds}.${milliseconds}`;
};

export function Stopwatch() {
  const { toast } = useToast();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLapTimeRef = useRef(0);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          handleStartPause();
          break;
        case 'r':
          e.preventDefault();
          if (!isRunning && time > 0) handleReset();
          break;
        case 'l':
          e.preventDefault();
          if (isRunning) handleLap();
          break;
        case 'escape':
          e.preventDefault();
          if (isRunning) setIsRunning(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, time]);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const handleLap = () => {
    if (isRunning) {
      const lapTime = time - lastLapTimeRef.current;
      setLaps(prevLaps => [lapTime, ...prevLaps]);
      lastLapTimeRef.current = time;
    }
  };

  // Calculate lap statistics
  const getLapStats = () => {
    if (laps.length === 0) return null;

    const fastest = Math.min(...laps);
    const slowest = Math.max(...laps);
    const average = laps.reduce((a, b) => a + b, 0) / laps.length;

    return { fastest, slowest, average };
  };

  const lapStats = getLapStats();

  // Export to CSV
  const exportToCSV = () => {
    if (laps.length === 0) {
      toast({
        title: "No data to export",
        description: "Record some laps first!",
        variant: "destructive",
      });
      return;
    }

    let csv = "Lap,Lap Time,Total Time\n";
    let totalTime = 0;

    // Reverse to show in chronological order
    [...laps].reverse().forEach((lap, index) => {
      totalTime += lap;
      csv += `${index + 1},${formatTimeString(lap)},${formatTimeString(totalTime)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stopwatch-laps-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exported! 📊",
      description: "Lap data saved to CSV file",
    });
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (laps.length === 0) {
      toast({
        title: "No data to copy",
        description: "Record some laps first!",
        variant: "destructive",
      });
      return;
    }

    let text = "Stopwatch Laps\n\n";
    let totalTime = 0;

    [...laps].reverse().forEach((lap, index) => {
      totalTime += lap;
      text += `Lap ${index + 1}: ${formatTimeString(lap)} (Total: ${formatTimeString(totalTime)})\n`;
    });

    if (lapStats) {
      text += `\nStatistics:\n`;
      text += `Fastest: ${formatTimeString(lapStats.fastest)}\n`;
      text += `Slowest: ${formatTimeString(lapStats.slowest)}\n`;
      text += `Average: ${formatTimeString(lapStats.average)}\n`;
    }

    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! 📋",
      description: "Lap data copied to clipboard",
    });
  };

  const { hours, minutes, seconds, milliseconds } = formatTime(time);
  const currentLapTime = time - lastLapTimeRef.current;
  const { minutes: lMin, seconds: lSec, milliseconds: lMs } = formatTime(currentLapTime);

  return (
    <Card className="bg-background/40 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden">
      <CardContent className="p-6 space-y-8">
        {/* Display */}
        <div className="relative flex flex-col items-center justify-center py-8">
          {/* Ring Animation */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <motion.div
              animate={{ rotate: isRunning ? 360 : 0 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="w-64 h-64 rounded-full border-4 border-dashed border-primary"
            />
          </div>

          <div className="text-center z-10">
            <div className="flex items-baseline justify-center font-mono tabular-nums leading-none text-foreground">
              {parseInt(hours) > 0 && (
                <>
                  <span className="text-5xl sm:text-7xl font-bold">{hours}</span>
                  <span className="text-2xl sm:text-4xl text-muted-foreground mx-1">:</span>
                </>
              )}
              <span className="text-5xl sm:text-7xl font-bold">{minutes}</span>
              <span className="text-2xl sm:text-4xl text-muted-foreground mx-1">:</span>
              <span className="text-5xl sm:text-7xl font-bold">{seconds}</span>
              <span className="text-2xl sm:text-4xl text-muted-foreground mx-1">.</span>
              <span className="text-3xl sm:text-5xl font-medium text-primary">{milliseconds}</span>
            </div>
            <div className="h-6 mt-2">
              {laps.length > 0 && (
                <p className="text-sm font-mono text-muted-foreground">
                  Lap: {lMin}:{lSec}.{lMs}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Shortcuts: <kbd className="px-1.5 py-0.5 bg-muted rounded">Space</kbd> Start/Pause • <kbd className="px-1.5 py-0.5 bg-muted rounded">L</kbd> Lap • <kbd className="px-1.5 py-0.5 bg-muted rounded">R</kbd> Reset</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-6">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 hover:bg-accent hover:border-accent"
            onClick={handleReset}
            disabled={!isRunning && time === 0}
          >
            <RotateCcw className="h-6 w-6" />
          </Button>

          <Button
            size="icon"
            className={cn(
              "h-20 w-20 rounded-full shadow-lg transition-all active:scale-95",
              isRunning
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
                : "bg-green-500 hover:bg-green-600 shadow-green-500/25"
            )}
            onClick={handleStartPause}
          >
            {isRunning ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current ml-1" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 hover:bg-accent hover:border-accent"
            onClick={handleLap}
            disabled={!isRunning}
          >
            <Flag className="h-6 w-6" />
          </Button>
        </div>

        {/* Lap Statistics */}
        {lapStats && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
              <TrendingUp className="h-4 w-4 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Fastest</p>
              <p className="text-sm font-mono font-semibold text-green-500">{formatTimeString(lapStats.fastest)}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
              <BarChart3 className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-sm font-mono font-semibold text-blue-500">{formatTimeString(lapStats.average)}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
              <TrendingDown className="h-4 w-4 text-red-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Slowest</p>
              <p className="text-sm font-mono font-semibold text-red-500">{formatTimeString(lapStats.slowest)}</p>
            </div>
          </motion.div>
        )}

        {/* Export Buttons */}
        {laps.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        )}

        {/* Laps */}
        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="rounded-xl border border-border/50 bg-background/50 overflow-hidden">
                <div className="grid grid-cols-3 px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                  <span>Lap</span>
                  <span className="text-center">Lap Time</span>
                  <span className="text-right">Total</span>
                </div>
                <ScrollArea className="h-48 w-full">
                  <div className="divide-y divide-border/50">
                    {laps.map((lap, index) => {
                      const lapNum = laps.length - index;
                      const { minutes, seconds, milliseconds } = formatTime(lap);

                      // Calculate total time at this lap (sum from end to current index)
                      const totalAtLap = laps.slice(index).reduce((sum, l) => sum + l, 0);
                      const { hours: tH, minutes: tM, seconds: tS, milliseconds: tMs } = formatTime(totalAtLap);

                      // Determine if this is fastest or slowest
                      const isFastest = lapStats && lap === lapStats.fastest;
                      const isSlowest = lapStats && lap === lapStats.slowest;

                      return (
                        <div
                          key={index}
                          className={cn(
                            "grid grid-cols-3 px-4 py-3 text-sm font-mono hover:bg-accent/30 transition-colors",
                            isFastest && "bg-green-500/5",
                            isSlowest && "bg-red-500/5"
                          )}
                        >
                          <span className="text-muted-foreground flex items-center gap-2">
                            #{lapNum}
                            {isFastest && <TrendingUp className="h-3 w-3 text-green-500" />}
                            {isSlowest && <TrendingDown className="h-3 w-3 text-red-500" />}
                          </span>
                          <span className={cn(
                            "text-center font-medium",
                            isFastest && "text-green-500",
                            isSlowest && "text-red-500",
                            !isFastest && !isSlowest && "text-foreground"
                          )}>
                            {minutes}:{seconds}.{milliseconds}
                          </span>
                          <span className="text-right text-muted-foreground">
                            {parseInt(tH) > 0 && `${tH}:`}{tM}:{tS}.{tMs}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
