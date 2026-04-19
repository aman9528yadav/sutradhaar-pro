"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Clock, Zap, Coffee, Timer as TimerIcon, Maximize2, Minimize2, Plus, Minus, Volume2, VolumeX, Settings, Bell, Target, Trophy, Flame, Star, Heart, Music, Sun, Moon, BookOpen, Dumbbell, ChevronUp, ChevronDown } from 'lucide-react';
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
            onChange(value >= max ? 0 : value + 1);
        } else {
            onChange(value <= 0 ? max : value - 1);
        }
    };

    return (
        <div className="flex flex-col items-center gap-1 group">
            {!disabled && onChange ? (
                <button 
                    onClick={() => onChange(value >= max ? 0 : value + 1)}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded-full hover:bg-secondary md:opacity-0 md:group-hover:opacity-100"
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            ) : <div className="h-8" />}
            
            <div
                className={cn(
                    "relative w-20 h-24 md:w-24 md:h-28 bg-card border border-border/50 rounded-3xl flex items-center justify-center overflow-hidden transition-all",
                    !disabled && "hover:border-primary/50 cursor-ns-resize shadow-sm hover:shadow-md"
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
                    className="w-full h-full text-center text-5xl md:text-6xl font-black font-mono bg-transparent border-none focus:ring-0 p-0 z-10 text-foreground"
                />
                {!disabled && (
                    <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />
                )}
            </div>

            {!disabled && onChange ? (
                <button 
                    onClick={() => onChange(value <= 0 ? max : value - 1)}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded-full hover:bg-secondary md:opacity-0 md:group-hover:opacity-100"
                >
                    <ChevronDown className="w-5 h-5" />
                </button>
            ) : <div className="h-8" />}
            
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1">{label}</span>
        </div>
    );
};

const QuickPreset = ({ label, minutes, onClick, icon: Icon, isActive }: { label: string, minutes: number, onClick: () => void, icon: any, isActive?: boolean }) => (
    <Button
        variant={isActive ? "default" : "secondary"}
        className={cn(
            "h-12 px-4 gap-2 rounded-2xl transition-all duration-300 font-semibold shadow-sm",
            isActive ? "shadow-primary/25 scale-105" : "hover:bg-secondary hover:border-primary/20 bg-card border border-border/50"
        )}
        onClick={onClick}
    >
        <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-primary")} />
        <span className={isActive ? "text-primary-foreground" : "text-foreground"}>{label}</span>
        <span className={cn("text-[10px] ml-1 opacity-70 font-mono", isActive ? "text-primary-foreground" : "text-muted-foreground")}>{minutes}m</span>
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
    const radius = 130;
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
                isWorkPhase ? "bg-background" : "bg-blue-950/10"
            )}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-6 right-6 h-14 w-14 rounded-full bg-card/50 backdrop-blur-md border border-border/50 hover:bg-accent"
                    onClick={() => setIsFullScreen(false)}
                >
                    <Minimize2 className="h-6 w-6 text-foreground" />
                </Button>

                {/* Status Indicator */}
                {mode === 'interval' && (
                    <div className="absolute top-16 px-8 py-3 rounded-full bg-card shadow-sm border border-border/50 text-xl font-black uppercase tracking-widest text-primary animate-pulse">
                        {isWorkPhase ? '🔥 Deep Work' : '😌 Relax'}
                    </div>
                )}

                {/* Main Time Display */}
                <div className="font-mono text-[22vw] font-black tabular-nums tracking-tighter leading-none text-foreground select-none drop-shadow-2xl">
                    {displayTime.isNegative && <span className="text-destructive">-</span>}
                    {displayTime.h > 0 && <span>{displayTime.h.toString().padStart(2, '0')}:</span>}
                    {displayTime.m.toString().padStart(2, '0')}:{displayTime.s.toString().padStart(2, '0')}
                </div>

                {/* Progress Bar (Linear for fullscreen) */}
                <div className="w-full max-w-4xl h-3 bg-secondary rounded-full mt-16 overflow-hidden shadow-inner">
                    <motion.div
                        className={cn("h-full", isWorkPhase ? "bg-primary" : "bg-blue-500")}
                        initial={{ width: "100%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </div>

                {/* Controls */}
                <div className="mt-20 flex items-center gap-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-20 w-20 rounded-full border-border/50 bg-card hover:bg-accent hover:border-primary/50 transition-all shadow-sm"
                        onClick={handleReset}
                    >
                        <RotateCcw className="h-8 w-8 text-muted-foreground" />
                    </Button>
                    <Button
                        size="icon"
                        className="h-32 w-32 rounded-[3rem] shadow-2xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
                        onClick={handlePauseResume}
                    >
                        {isPaused ? <Play className="h-12 w-12 ml-2 fill-current" /> : <Pause className="h-12 w-12 fill-current" />}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Stats Banner */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-card border-border/50 shadow-sm hover:border-blue-500/30 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Streak</p>
                            <p className="text-2xl font-black text-foreground">{focusStreak}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border/50 shadow-sm hover:border-green-500/30 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Sessions</p>
                            <p className="text-2xl font-black text-foreground">{sessionCount}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border/50 shadow-sm hover:border-purple-500/30 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Today</p>
                            <p className="text-2xl font-black text-foreground">{profile.todos.filter(t => t.completed && new Date(t.completedAt!).toDateString() === new Date().toDateString()).length}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 shadow-xl bg-card relative overflow-hidden rounded-[2rem]">
                <CardContent className="p-6 md:p-10 relative z-10">
                    {/* Header with Enhanced Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full sm:w-[300px]">
                            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-secondary/50 p-1 border border-border/50 h-12">
                                <TabsTrigger value="normal" disabled={isActive} className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all font-semibold">Standard</TabsTrigger>
                                <TabsTrigger value="interval" disabled={isActive} className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all font-semibold">Pomodoro</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        
                        <div className="flex gap-2 bg-secondary/30 p-1.5 rounded-2xl border border-border/50">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setShowSettings(!showSettings)}
                                className={cn("rounded-xl transition-all", showSettings ? "bg-background shadow-sm" : "hover:bg-background/50")}
                            >
                                <Settings className="h-5 w-5 text-foreground" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={cn("rounded-xl transition-all", soundEnabled ? "text-primary hover:text-primary/80 hover:bg-primary/10" : "text-muted-foreground hover:bg-background/50")}
                            >
                                {soundEnabled ? <Bell className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={!isActive} 
                                onClick={() => setIsFullScreen(true)}
                                className="rounded-xl hover:bg-background/50 transition-all text-foreground"
                            >
                                <Maximize2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <AnimatePresence>
                        {showSettings && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-5 bg-secondary/20 rounded-2xl border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border/50 shadow-sm">
                                        <Label className="flex items-center gap-2 font-semibold">
                                            <Heart className="h-4 w-4 text-rose-500" /> Motivational Mode
                                        </Label>
                                        <Button 
                                            variant={motivationalMode ? "default" : "secondary"}
                                            size="sm"
                                            onClick={() => setMotivationalMode(!motivationalMode)}
                                            className="rounded-lg h-8"
                                        >
                                            {motivationalMode ? 'Active' : 'Muted'}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border/50 shadow-sm">
                                        <Label className="flex items-center gap-2 font-semibold">
                                            <Music className="h-4 w-4 text-blue-500" /> Alarm Sound
                                        </Label>
                                        <Select defaultValue="chime">
                                            <SelectTrigger className="w-28 h-8 text-xs rounded-lg bg-secondary/50 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="chime">Chime</SelectItem>
                                                <SelectItem value="bell">Digital Bell</SelectItem>
                                                <SelectItem value="lofi">Lo-Fi Beat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Interface */}
                    <div className="min-h-[400px] flex flex-col items-center justify-center relative">
                        {!isActive ? (
                            /* Setup State */
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="setup"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="w-full flex flex-col items-center"
                                >
                                    {mode === 'normal' ? (
                                        <div className="w-full flex flex-col items-center gap-10">
                                            {/* Enhanced Time Input */}
                                            <div className="flex items-center gap-2 md:gap-4 bg-secondary/10 p-6 md:p-8 rounded-[2.5rem] border border-border/50 shadow-inner">
                                                <TimeDigit value={hours} label="Hours" onChange={setHours} max={23} />
                                                <span className="text-4xl md:text-5xl font-black text-muted-foreground/30 -mt-8">:</span>
                                                <TimeDigit value={minutes} label="Minutes" onChange={setMinutes} />
                                                <span className="text-4xl md:text-5xl font-black text-muted-foreground/30 -mt-8">:</span>
                                                <TimeDigit value={seconds} label="Seconds" onChange={setSeconds} />
                                            </div>

                                            {/* Enhanced Quick Presets */}
                                            <div className="w-full max-w-lg">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="h-px bg-border flex-1" />
                                                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Select</h3>
                                                    <div className="h-px bg-border flex-1" />
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    <QuickPreset label="Pomodoro" minutes={25} icon={Target} onClick={() => { setHours(0); setMinutes(25); setSeconds(0); }} isActive={hours === 0 && minutes === 25 && seconds === 0} />
                                                    <QuickPreset label="Break" minutes={5} icon={Coffee} onClick={() => { setHours(0); setMinutes(5); setSeconds(0); }} isActive={hours === 0 && minutes === 5 && seconds === 0} />
                                                    <QuickPreset label="Deep Work" minutes={90} icon={Zap} onClick={() => { setHours(1); setMinutes(30); setSeconds(0); }} isActive={hours === 1 && minutes === 30 && seconds === 0} />
                                                    <QuickPreset label="Nap" minutes={20} icon={Moon} onClick={() => { setHours(0); setMinutes(20); setSeconds(0); }} isActive={hours === 0 && minutes === 20 && seconds === 0} />
                                                    <QuickPreset label="Reading" minutes={30} icon={BookOpen} onClick={() => { setHours(0); setMinutes(30); setSeconds(0); }} isActive={hours === 0 && minutes === 30 && seconds === 0} />
                                                    <QuickPreset label="Exercise" minutes={15} icon={Dumbbell} onClick={() => { setHours(0); setMinutes(15); setSeconds(0); }} isActive={hours === 0 && minutes === 15 && seconds === 0} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full max-w-lg space-y-4">
                                            <Card className="bg-card border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                                                <CardContent className="p-6">
                                                    <div className="space-y-6">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-foreground flex items-center gap-3 text-lg font-bold">
                                                                <div className="p-2 bg-primary/10 rounded-xl"><Target className="h-5 w-5 text-primary" /></div>
                                                                Focus Time
                                                            </Label>
                                                            <span className="font-mono text-3xl font-black text-primary">{intervalSettings.workMinutes}:{intervalSettings.workSeconds.toString().padStart(2, '0')}</span>
                                                        </div>
                                                        <Slider
                                                            value={[intervalSettings.workMinutes * 60 + intervalSettings.workSeconds]}
                                                            max={300}
                                                            step={15}
                                                            className="py-2"
                                                            onValueChange={([v]) => setIntervalSettings(prev => ({ ...prev, workMinutes: Math.floor(v / 60), workSeconds: v % 60 }))}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-card border-border/50 shadow-sm hover:border-blue-500/30 transition-colors">
                                                <CardContent className="p-6">
                                                    <div className="space-y-6">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-foreground flex items-center gap-3 text-lg font-bold">
                                                                <div className="p-2 bg-blue-500/10 rounded-xl"><Coffee className="h-5 w-5 text-blue-500" /></div>
                                                                Break Time
                                                            </Label>
                                                            <span className="font-mono text-3xl font-black text-blue-500">{intervalSettings.restMinutes}:{intervalSettings.restSeconds.toString().padStart(2, '0')}</span>
                                                        </div>
                                                        <Slider
                                                            value={[intervalSettings.restMinutes * 60 + intervalSettings.restSeconds]}
                                                            max={120}
                                                            step={15}
                                                            className="py-2"
                                                            onValueChange={([v]) => setIntervalSettings(prev => ({ ...prev, restMinutes: Math.floor(v / 60), restSeconds: v % 60 }))}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-card border-border/50 shadow-sm hover:border-purple-500/30 transition-colors">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-foreground flex items-center gap-3 text-lg font-bold">
                                                            <div className="p-2 bg-purple-500/10 rounded-xl"><Trophy className="h-5 w-5 text-purple-500" /></div>
                                                            Total Rounds
                                                        </Label>
                                                        <div className="flex items-center gap-4 bg-secondary/50 p-1.5 rounded-2xl border border-border/50">
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background shadow-sm hover:bg-accent" onClick={() => setIntervalSettings(p => ({ ...p, rounds: Math.max(1, p.rounds - 1) }))}>
                                                                <Minus className="h-5 w-5" />
                                                            </Button>
                                                            <span className="font-mono text-2xl font-black w-8 text-center">{intervalSettings.rounds}</span>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background shadow-sm hover:bg-accent" onClick={() => setIntervalSettings(p => ({ ...p, rounds: Math.min(20, p.rounds + 1) }))}>
                                                                <Plus className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}

                                    {/* Enhanced Task Selector */}
                                    <div className="w-full max-w-lg mt-8 space-y-3">
                                        <Label className="text-sm font-bold text-foreground">Link to a Task (Optional)</Label>
                                        <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                                            <SelectTrigger className="w-full bg-card border-border/50 h-14 rounded-2xl shadow-sm focus:ring-primary/50 text-base">
                                                <SelectValue placeholder="What are you focusing on?" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-border/50">
                                                <SelectItem value="none" className="flex items-center gap-2 py-3">
                                                    <div className="flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" /> No Task Linked</div>
                                                </SelectItem>
                                                {profile.todos.filter(t => !t.completed).map(t => (
                                                    <SelectItem key={t.id} value={t.id} className="py-3">
                                                        <div className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> <span className="truncate">{t.text}</span></div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button 
                                        size="lg" 
                                        className="w-full max-w-lg mt-8 h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground"
                                        onClick={() => {
                                            handleStart();
                                            if (mode === 'normal') {
                                                setSessionCount(prev => prev + 1);
                                            }
                                        }}
                                    >
                                        <Play className="mr-3 h-6 w-6 fill-current" /> START SESSION
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
                                    className="flex flex-col items-center justify-center w-full py-8"
                                >
                                    <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                                        {/* Circular Progress SVG */}
                                        <svg className="absolute w-full h-full transform -rotate-90 text-primary" viewBox="0 0 300 300">
                                            {/* Background Circle */}
                                            <circle
                                                cx="150" cy="150" r={radius}
                                                stroke="currentColor"
                                                strokeWidth="10"
                                                fill="transparent"
                                                className="text-secondary"
                                            />
                                            {/* Progress Circle */}
                                            <circle
                                                cx="150" cy="150" r={radius}
                                                stroke="currentColor"
                                                strokeWidth="14"
                                                fill="transparent"
                                                strokeLinecap="round"
                                                className={cn(
                                                    "transition-[stroke-dashoffset] duration-1000 ease-linear drop-shadow-xl",
                                                    isWorkPhase ? "text-primary" : "text-blue-500"
                                                )}
                                                style={{
                                                    strokeDasharray: circumference,
                                                    strokeDashoffset: strokeDashoffset,
                                                }}
                                            />
                                        </svg>

                                        {/* Digital Time Center */}
                                        <div className="flex flex-col items-center z-10 w-full px-8">
                                            <div className={cn("text-6xl md:text-7xl font-mono font-black tracking-tighter tabular-nums text-foreground drop-shadow-sm", displayTime.isNegative && "text-destructive animate-pulse")}>
                                                {displayTime.isNegative && "-"}
                                                {displayTime.h > 0 && <span>{displayTime.h}:</span>}
                                                {displayTime.m.toString().padStart(2, '0')}:{displayTime.s.toString().padStart(2, '0')}
                                            </div>
                                            <div className="mt-3 px-4 py-1.5 rounded-full bg-secondary text-sm font-bold uppercase tracking-widest text-foreground shadow-sm">
                                                {isPaused ? 'Paused' : (isWorkPhase ? 'Focusing' : 'Resting')}
                                            </div>
                                            {mode === 'interval' && (
                                                <div className="mt-2 text-sm font-semibold text-muted-foreground">
                                                    Round {currentRound} / {intervalSettings.rounds}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Task Info Pill */}
                                    {selectedTaskId !== 'none' && (
                                        <div className="mt-10 px-6 py-3 bg-card border border-border/50 shadow-sm rounded-2xl text-base font-semibold text-foreground flex items-center gap-3 max-w-sm w-full">
                                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                            <span className="truncate flex-1">{profile.todos.find(t => t.id === selectedTaskId)?.text}</span>
                                        </div>
                                    )}

                                    {/* Controls */}
                                    <div className="mt-10 flex items-center gap-8 bg-secondary/30 p-4 rounded-full border border-border/50">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-16 w-16 rounded-full bg-card shadow-sm hover:bg-accent border border-border/50 transition-all"
                                            onClick={handleReset}
                                        >
                                            <RotateCcw className="h-6 w-6 text-foreground" />
                                        </Button>

                                        <Button
                                            size="icon"
                                            className={cn(
                                                "h-24 w-24 rounded-full shadow-2xl text-white transition-transform hover:scale-105 active:scale-95",
                                                isPaused ? "bg-primary hover:bg-primary/90" : "bg-amber-500 hover:bg-amber-600"
                                            )}
                                            onClick={handlePauseResume}
                                        >
                                            {isPaused ? <Play className="h-10 w-10 fill-current ml-2" /> : <Pause className="h-10 w-10 fill-current" />}
                                        </Button>

                                        {mode === 'normal' ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-16 w-16 rounded-full bg-card shadow-sm hover:bg-accent border border-border/50 transition-all"
                                                onClick={() => quickAddTime(60)}
                                            >
                                                <Plus className="h-6 w-6 text-foreground" />
                                                <span className="sr-only">+1m</span>
                                            </Button>
                                        ) : (
                                            <div className="h-16 w-16" /> // Placeholder for spacing in interval mode
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
