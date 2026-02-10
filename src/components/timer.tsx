"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Clock, Zap, Coffee, Timer as TimerIcon, Maximize2, Minimize2, Plus, Minus, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/context/ProfileContext';
import { useTimer } from '@/context/TimerContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// --- Sub-components ---

const TimeDigit = ({ value, label, onChange, max = 59, disabled }: { value: number, label: string, onChange?: (v: number) => void, max?: number, disabled?: boolean }) => {
    const handleScroll = (e: React.WheelEvent) => {
        if (disabled || !onChange) return;
        if (e.deltaY < 0) {
            onChange(Math.min(max, value + 1));
        } else {
            onChange(Math.max(0, value - 1));
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={cn(
                    "relative w-20 h-24 bg-card border border-border/50 rounded-2xl flex items-center justify-center overflow-hidden transition-all",
                    !disabled && "hover:border-primary/50 cursor-ns-resize shadow-lg"
                )}
                onWheel={handleScroll}
            >
                <input
                    type="number"
                    min={0}
                    max={max}
                    value={value.toString().padStart(2, '0')}
                    onChange={(e) => {
                        if (disabled || !onChange) return;
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = 0;
                        if (val > max) val = max;
                        onChange(val);
                    }}
                    disabled={disabled}
                    className="w-full h-full text-center text-5xl font-mono font-bold bg-transparent border-none focus:ring-0 p-0 z-10"
                />
                {/* Decorative gradients for scroll hint */}
                {!disabled && (
                    <>
                        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-background/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                    </>
                )}
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{label}</span>
        </div>
    );
};

const QuickPreset = ({ label, minutes, onClick, icon: Icon }: { label: string, minutes: number, onClick: () => void, icon: any }) => (
    <Button
        variant="secondary"
        className="h-10 px-4 gap-2 rounded-full bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 transition-all"
        onClick={onClick}
    >
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
    </Button>
);

// --- Main Component ---

export function Timer() {
    const { profile } = useProfile();
    const { toast } = useToast();
    const {
        mode, setMode,
        hours, setHours,
        minutes, setMinutes,
        seconds, setSeconds,
        totalSeconds,
        initialTime,
        isActive,
        isPaused,
        intervalSettings, setIntervalSettings,
        currentRound,
        isWorkPhase,
        selectedTaskId, setSelectedTaskId,
        handleStart,
        handlePauseResume,
        handleReset,
        setPreset,
        quickAddTime
    } = useTimer();

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Calculate progress for circular indicator
    const progress = initialTime > 0 ? (totalSeconds / initialTime) * 100 : 0;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const formatTime = (totalSecs: number) => {
        const isNegative = totalSecs < 0;
        const absSecs = Math.abs(totalSecs);
        const h = Math.floor(absSecs / 3600);
        const m = Math.floor((absSecs % 3600) / 60);
        const s = absSecs % 60;
        return { h, m, s, isNegative };
    };

    const displayTime = formatTime(totalSeconds);

    if (isFullScreen) {
        return (
            <div className={cn(
                "fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300",
                isWorkPhase ? "bg-background" : "bg-blue-950/20"
            )}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-12 w-12 rounded-full"
                    onClick={() => setIsFullScreen(false)}
                >
                    <Minimize2 className="h-6 w-6" />
                </Button>

                {/* Status Indicator */}
                {mode === 'interval' && (
                    <div className="absolute top-12 px-6 py-2 rounded-full bg-muted/20 text-xl font-bold uppercase tracking-widest animate-pulse">
                        {isWorkPhase ? '🔥 WORK' : '😌 REST'}
                    </div>
                )}

                {/* Main Time Display */}
                <div className="font-mono text-[20vw] font-bold tabular-nums tracking-tighter leading-none text-foreground select-none">
                    {displayTime.isNegative && <span className="text-red-500">-</span>}
                    {displayTime.h > 0 && <span>{displayTime.h.toString().padStart(2, '0')}:</span>}
                    {displayTime.m.toString().padStart(2, '0')}:{displayTime.s.toString().padStart(2, '0')}
                </div>

                {/* Progress Bar (Linear for fullscreen) */}
                <div className="w-full max-w-2xl h-2 bg-secondary rounded-full mt-12 overflow-hidden">
                    <motion.div
                        className={cn("h-full", isWorkPhase ? "bg-primary" : "bg-blue-500")}
                        initial={{ width: "100%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </div>

                {/* Controls */}
                <div className="mt-16 flex gap-12">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-24 w-24 rounded-full border-2"
                        onClick={handleReset}
                    >
                        <RotateCcw className="h-8 w-8" />
                    </Button>
                    <Button
                        size="icon"
                        className="h-32 w-32 rounded-[3rem] shadow-2xl text-2xl"
                        onClick={handlePauseResume}
                    >
                        {isPaused ? <Play className="h-12 w-12 ml-2 fill-current" /> : <Pause className="h-12 w-12 fill-current" />}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
            <Card className="border-none shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full max-w-xs">
                            <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted/50 p-1">
                                <TabsTrigger value="normal" disabled={isActive} className="rounded-full data-[state=active]:bg-background shadow-none">Timer</TabsTrigger>
                                <TabsTrigger value="interval" disabled={isActive} className="rounded-full data-[state=active]:bg-background shadow-none">Interval</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)} className="text-muted-foreground">
                                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" disabled={!isActive} onClick={() => setIsFullScreen(true)} className="text-muted-foreground">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Main Interface */}
                    <div className="min-h-[300px] flex flex-col items-center justify-center relative">
                        {!isActive ? (
                            /* Setup State */
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="setup"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="w-full flex flex-col items-center gap-8"
                                >
                                    {mode === 'normal' ? (
                                        <>
                                            <div className="flex items-end gap-2">
                                                <TimeDigit value={hours} label="Hours" onChange={setHours} max={23} />
                                                <span className="text-4xl font-bold text-muted-foreground/30 mb-8">:</span>
                                                <TimeDigit value={minutes} label="Minutes" onChange={setMinutes} />
                                                <span className="text-4xl font-bold text-muted-foreground/30 mb-8">:</span>
                                                <TimeDigit value={seconds} label="Seconds" onChange={setSeconds} />
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-2">
                                                <QuickPreset label="Focus" minutes={25} icon={Zap} onClick={() => setPreset(25)} />
                                                <QuickPreset label="Short Break" minutes={5} icon={Coffee} onClick={() => setPreset(5)} />
                                                <QuickPreset label="Long Break" minutes={15} icon={Coffee} onClick={() => setPreset(15)} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full space-y-6 px-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-muted-foreground flex items-center gap-2">
                                                        <Zap className="h-4 w-4 text-primary" /> Work Duration
                                                    </Label>
                                                    <span className="font-mono text-xl font-bold">{intervalSettings.workMinutes}:{intervalSettings.workSeconds.toString().padStart(2, '0')}</span>
                                                </div>
                                                <Slider
                                                    value={[intervalSettings.workMinutes * 60 + intervalSettings.workSeconds]}
                                                    max={300}
                                                    step={15}
                                                    onValueChange={([v]) => setIntervalSettings(prev => ({ ...prev, workMinutes: Math.floor(v / 60), workSeconds: v % 60 }))}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-muted-foreground flex items-center gap-2">
                                                        <Coffee className="h-4 w-4 text-blue-500" /> Rest Duration
                                                    </Label>
                                                    <span className="font-mono text-xl font-bold text-blue-500">{intervalSettings.restMinutes}:{intervalSettings.restSeconds.toString().padStart(2, '0')}</span>
                                                </div>
                                                <Slider
                                                    value={[intervalSettings.restMinutes * 60 + intervalSettings.restSeconds]}
                                                    max={120}
                                                    step={15}
                                                    className="bg-blue-500/20"
                                                    onValueChange={([v]) => setIntervalSettings(prev => ({ ...prev, restMinutes: Math.floor(v / 60), restSeconds: v % 60 }))}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                                <Label>Rounds</Label>
                                                <div className="flex items-center gap-3">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIntervalSettings(p => ({ ...p, rounds: Math.max(1, p.rounds - 1) }))}>
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="font-mono text-lg font-bold w-8 text-center">{intervalSettings.rounds}</span>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIntervalSettings(p => ({ ...p, rounds: Math.min(20, p.rounds + 1) }))}>
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Task Selector */}
                                    <div className="w-full max-w-xs">
                                        <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                                            <SelectTrigger className="w-full border-border/50 bg-background/50">
                                                <SelectValue placeholder="Link to a Task (Optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No Task Linked</SelectItem>
                                                {profile.todos.filter(t => !t.completed).map(t => (
                                                    <SelectItem key={t.id} value={t.id}>{t.text}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button size="lg" className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" onClick={handleStart}>
                                        <Play className="mr-2 h-5 w-5 fill-current" /> Start {mode === 'interval' ? 'Workout' : 'Focus'}
                                    </Button>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            /* Active State */
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="active"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center w-full"
                                >
                                    <div className="relative w-72 h-72 flex items-center justify-center">
                                        {/* Circular Progress SVG */}
                                        <svg className="absolute w-full h-full transform -rotate-90 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]" viewBox="0 0 300 300">
                                            {/* Background Circle */}
                                            <circle
                                                cx="150" cy="150" r={radius}
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-muted/10"
                                            />
                                            {/* Progress Circle */}
                                            <circle
                                                cx="150" cy="150" r={radius}
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="transparent"
                                                strokeLinecap="round"
                                                className={cn(
                                                    "transition-[stroke-dashoffset] duration-1000 ease-linear",
                                                    isWorkPhase ? "text-primary" : "text-blue-500"
                                                )}
                                                style={{
                                                    strokeDasharray: circumference,
                                                    strokeDashoffset: strokeDashoffset,
                                                }}
                                            />
                                        </svg>

                                        {/* Digital Time Center */}
                                        <div className="flex flex-col items-center z-10">
                                            <div className={cn("text-6xl font-mono font-bold tracking-tighter tabular-nums text-foreground", displayTime.isNegative && "text-red-500 animate-pulse")}>
                                                {displayTime.isNegative && "-"}
                                                {displayTime.h > 0 && <span>{displayTime.h}:</span>}
                                                {displayTime.m.toString().padStart(2, '0')}:{displayTime.s.toString().padStart(2, '0')}
                                            </div>
                                            <div className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground animate-pulse">
                                                {isPaused ? 'Paused' : (isWorkPhase ? 'Focusing' : 'Resting')}
                                            </div>
                                            {mode === 'interval' && (
                                                <div className="mt-1 text-xs text-muted-foreground/70">
                                                    Round {currentRound} / {intervalSettings.rounds}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Task Info Pill */}
                                    {selectedTaskId !== 'none' && (
                                        <div className="mt-6 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-sm font-medium text-primary flex items-center gap-2 max-w-xs truncate">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            {profile.todos.find(t => t.id === selectedTaskId)?.text}
                                        </div>
                                    )}

                                    {/* Controls */}
                                    <div className="mt-8 flex items-center gap-6">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-14 w-14 rounded-full border-border/50 hover:bg-secondary hover:border-border transition-all"
                                            onClick={handleReset}
                                        >
                                            <RotateCcw className="h-5 w-5" />
                                        </Button>

                                        <Button
                                            size="icon"
                                            className={cn(
                                                "h-20 w-20 rounded-[2rem] shadow-xl text-white transition-all transform hover:scale-105 active:scale-95",
                                                isPaused ? "bg-primary hover:bg-primary/90" : "bg-amber-500 hover:bg-amber-600"
                                            )}
                                            onClick={handlePauseResume}
                                        >
                                            {isPaused ? <Play className="h-8 w-8 fill-current ml-1" /> : <Pause className="h-8 w-8 fill-current" />}
                                        </Button>

                                        {mode === 'normal' && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-14 w-14 rounded-full border-border/50 hover:bg-secondary hover:border-border transition-all"
                                                onClick={() => quickAddTime(60)}
                                            >
                                                <Plus className="h-5 w-5" />
                                                <span className="sr-only">+1m</span>
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
