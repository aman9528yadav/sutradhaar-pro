"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Clock, Zap, Coffee, Timer as TimerIcon, Maximize2, Minimize2, Plus, Minus, Volume2, VolumeX, Settings, Bell, Target, Trophy, Flame, Star, Heart, Music, Sun, Moon, BookOpen, Dumbbell } from 'lucide-react';
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
    const [showSettings, setShowSettings] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
    const [motivationalMode, setMotivationalMode] = useState(true);
    const [focusStreak, setFocusStreak] = useState(0);
    const [sessionCount, setSessionCount] = useState(0);

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

    // Motivational messages
    const motivationalMessages = [
        "You've got this!",
        "Stay focused!",
        "Almost there!",
        "Keep going!",
        "Great job!",
        "You're amazing!",
        "Crushing it!",
        "Mind blown!",
        "Legendary!",
        "Unstoppable!"
    ];
    
    const getRandomMotivation = () => {
        return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Stats Banner */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
                    <CardContent className="p-3 text-center">
                        <Flame className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Streak</p>
                        <p className="text-lg font-bold text-blue-500">{focusStreak}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="p-3 text-center">
                        <Trophy className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Sessions</p>
                        <p className="text-lg font-bold text-green-500">{sessionCount}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <CardContent className="p-3 text-center">
                        <Target className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Today</p>
                        <p className="text-lg font-bold text-purple-500">{profile.todos.filter(t => t.completed && new Date(t.completedAt!).toDateString() === new Date().toDateString()).length}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-2xl bg-gradient-to-br from-card to-card/50 backdrop-blur-xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <CardContent className="p-8 relative">
                    {/* Header with Enhanced Controls */}
                    <div className="flex justify-between items-center mb-8">
                        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full max-w-xs">
                            <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted/50 p-1 border border-border/50">
                                <TabsTrigger value="normal" disabled={isActive} className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">Timer</TabsTrigger>
                                <TabsTrigger value="interval" disabled={isActive} className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">Pomodoro</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setShowSettings(!showSettings)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={`transition-colors ${soundEnabled ? 'text-green-500 hover:text-green-600' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {soundEnabled ? <Bell className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={!isActive} 
                                onClick={() => setIsFullScreen(true)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <AnimatePresence>
                        {showSettings && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-muted/30 rounded-xl border border-border/50"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-2">
                                            <Heart className="h-4 w-4" /> Motivational Mode
                                        </Label>
                                        <Button 
                                            variant={motivationalMode ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setMotivationalMode(!motivationalMode)}
                                        >
                                            {motivationalMode ? 'On' : 'Off'}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-2">
                                            <Music className="h-4 w-4" /> Theme
                                        </Label>
                                        <Select value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'auto')}>
                                            <SelectTrigger className="w-24 h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="auto">Auto</SelectItem>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Interface */}
                    <div className="min-h-[350px] flex flex-col items-center justify-center relative">
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
                                            {/* Enhanced Time Input */}
                                            <div className="flex items-end gap-3 bg-muted/20 rounded-2xl p-6 border border-border/30">
                                                <div className="flex flex-col items-center gap-2">
                                                    <TimeDigit value={hours} label="Hours" onChange={setHours} max={23} />
                                                    <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                                                </div>
                                                <span className="text-5xl font-bold text-muted-foreground/30 mb-6">:</span>
                                                <div className="flex flex-col items-center gap-2">
                                                    <TimeDigit value={minutes} label="Minutes" onChange={setMinutes} />
                                                    <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                                                </div>
                                                <span className="text-5xl font-bold text-muted-foreground/30 mb-6">:</span>
                                                <div className="flex flex-col items-center gap-2">
                                                    <TimeDigit value={seconds} label="Seconds" onChange={setSeconds} />
                                                    <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                                                </div>
                                            </div>

                                            {/* Enhanced Quick Presets */}
                                            <div className="w-full max-w-md">
                                                <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">Quick Presets</h3>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <QuickPreset label="Focus" minutes={25} icon={Target} onClick={() => setPreset(25)} />
                                                    <QuickPreset label="Break" minutes={5} icon={Coffee} onClick={() => setPreset(5)} />
                                                    <QuickPreset label="Deep Work" minutes={90} icon={Zap} onClick={() => setPreset(90)} />
                                                    <QuickPreset label="Nap" minutes={20} icon={Moon} onClick={() => setPreset(20)} />
                                                    <QuickPreset label="Reading" minutes={30} icon={BookOpen} onClick={() => setPreset(30)} />
                                                    <QuickPreset label="Exercise" minutes={15} icon={Dumbbell} onClick={() => setPreset(15)} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full space-y-6 px-4">
                                            <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
                                                <CardContent className="p-5">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-muted-foreground flex items-center gap-2 text-base">
                                                                <Target className="h-5 w-5 text-primary" /> Work Duration
                                                            </Label>
                                                            <span className="font-mono text-2xl font-bold">{intervalSettings.workMinutes}:{intervalSettings.workSeconds.toString().padStart(2, '0')}</span>
                                                        </div>
                                                        <Slider
                                                            value={[intervalSettings.workMinutes * 60 + intervalSettings.workSeconds]}
                                                            max={300}
                                                            step={15}
                                                            className="py-4"
                                                            onValueChange={([v]) => setIntervalSettings(prev => ({ ...prev, workMinutes: Math.floor(v / 60), workSeconds: v % 60 }))}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-blue-500/20">
                                                <CardContent className="p-5">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-muted-foreground flex items-center gap-2 text-base">
                                                                <Coffee className="h-5 w-5 text-blue-500" /> Rest Duration
                                                            </Label>
                                                            <span className="font-mono text-2xl font-bold text-blue-500">{intervalSettings.restMinutes}:{intervalSettings.restSeconds.toString().padStart(2, '0')}</span>
                                                        </div>
                                                        <Slider
                                                            value={[intervalSettings.restMinutes * 60 + intervalSettings.restSeconds]}
                                                            max={120}
                                                            step={15}
                                                            className="py-4 bg-blue-500/20"
                                                            onValueChange={([v]) => setIntervalSettings(prev => ({ ...prev, restMinutes: Math.floor(v / 60), restSeconds: v % 60 }))}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
                                                <CardContent className="p-5">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-muted-foreground flex items-center gap-2 text-base">
                                                            <Trophy className="h-5 w-5 text-purple-500" /> Rounds
                                                        </Label>
                                                        <div className="flex items-center gap-3">
                                                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => setIntervalSettings(p => ({ ...p, rounds: Math.max(1, p.rounds - 1) }))}>
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="font-mono text-2xl font-bold w-10 text-center">{intervalSettings.rounds}</span>
                                                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => setIntervalSettings(p => ({ ...p, rounds: Math.min(20, p.rounds + 1) }))}>
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}

                                    {/* Enhanced Task Selector */}
                                    <div className="w-full max-w-md space-y-3">
                                        <Label className="text-center block text-muted-foreground">Link to Task (Optional)</Label>
                                        <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                                            <SelectTrigger className="w-full border-border/50 bg-background/50 h-12 rounded-xl">
                                                <SelectValue placeholder="Select a task to focus on..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none" className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-muted-foreground" /> No Task Linked
                                                </SelectItem>
                                                {profile.todos.filter(t => !t.completed).map(t => (
                                                    <SelectItem key={t.id} value={t.id} className="flex items-center gap-2">
                                                        <Target className="h-4 w-4 text-primary" /> {t.text}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button 
                                        size="lg" 
                                        className="w-full h-16 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-indigo-600 text-white"
                                        onClick={() => {
                                            handleStart();
                                            if (mode === 'normal') {
                                                setSessionCount(prev => prev + 1);
                                            }
                                        }}
                                    >
                                        <Play className="mr-3 h-6 w-6 fill-current" /> Start {mode === 'interval' ? 'Pomodoro Session' : 'Focused Work'}
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
