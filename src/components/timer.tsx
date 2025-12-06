"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Bell, Coffee, Zap, Moon, Timer as TimerIcon, Plus, Minus, Save, Trash2, Activity, Maximize, Minimize, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/context/ProfileContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const TimeInput = ({ label, value, onChange, disabled, max = 59 }: { label: string; value: number; onChange: (value: number) => void; disabled: boolean; max?: number }) => (
    <div className="flex flex-col items-center space-y-2">
        <Input
            type="number"
            min="0"
            max={max}
            value={value.toString().padStart(2, '0')}
            onChange={(e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = 0;
                if (val > max) val = max;
                onChange(val);
            }}
            className="w-20 h-20 text-4xl text-center font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-2xl transition-all"
            disabled={disabled}
        />
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</Label>
    </div>
);

const PresetButton = ({ icon: Icon, label, minutes, onClick }: { icon: any, label: string, minutes: number, onClick: () => void }) => (
    <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-auto py-3 px-4 gap-2 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
        onClick={onClick}
    >
        <Icon className="h-5 w-5" />
        <span className="text-xs font-medium">{label}</span>
    </Button>
);

interface SavedTimer {
    id: string;
    name: string;
    hours: number;
    minutes: number;
    seconds: number;
}

interface IntervalSettings {
    workMinutes: number;
    workSeconds: number;
    restMinutes: number;
    restSeconds: number;
    rounds: number;
}

import { useTimer } from '@/context/TimerContext';

// ...

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

    // Saved timers
    const [savedTimers, setSavedTimers] = useState<SavedTimer[]>([]);
    const [timerName, setTimerName] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Load saved timers from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('savedTimers');
        if (saved) {
            setSavedTimers(JSON.parse(saved));
        }
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    if (isActive) {
                        handlePauseResume();
                    } else if (mode === 'normal' && (hours > 0 || minutes > 0 || seconds > 0)) {
                        handleStart();
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    if (isActive) handleReset();
                    break;
                case 'escape':
                    e.preventDefault();
                    if (isActive) handleReset();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isActive, isPaused, hours, minutes, seconds, mode, handleStart, handlePauseResume, handleReset]);

    const saveTimer = () => {
        if (!timerName.trim()) {
            toast({
                title: "Name required",
                description: "Please enter a name for this timer",
                variant: "destructive",
            });
            return;
        }

        const newTimer: SavedTimer = {
            id: Date.now().toString(),
            name: timerName,
            hours,
            minutes,
            seconds,
        };

        const updated = [...savedTimers, newTimer];
        setSavedTimers(updated);
        localStorage.setItem('savedTimers', JSON.stringify(updated));
        setTimerName('');

        toast({
            title: "Timer Saved! 💾",
            description: `"${timerName}" has been saved`,
        });
    };

    const loadTimer = (timer: SavedTimer) => {
        setHours(timer.hours);
        setMinutes(timer.minutes);
        setSeconds(timer.seconds);
        toast({
            title: "Timer Loaded! ⏲️",
            description: `"${timer.name}" is ready`,
        });
    };

    const deleteTimer = (id: string) => {
        const updated = savedTimers.filter(t => t.id !== id);
        setSavedTimers(updated);
        localStorage.setItem('savedTimers', JSON.stringify(updated));
        toast({
            title: "Timer Deleted",
            description: "Timer removed from saved list",
        });
    };

    const displayHours = Math.floor(totalSeconds / 3600);
    const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
    const displaySeconds = totalSeconds % 60;

    const progress = initialTime > 0 ? (totalSeconds / initialTime) * 100 : 0;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <>
            <AnimatePresence>
                {isFullScreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
                    >
                        <style jsx global>{`
                            @import url('https://fonts.cdnfonts.com/css/seven-segment');
                            .font-digital {
                                font-family: 'Seven Segment', sans-serif;
                            }
                            .landscape-force {
                                width: 100vw;
                                height: 100vh;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                            }
                            @media (orientation: portrait) {
                                .landscape-force {
                                    transform: rotate(90deg);
                                    width: 100vh;
                                    height: 100vw;
                                }
                            }
                        `}</style>

                        <div className="landscape-force relative">
                            {/* Main Timer Display */}
                            <div className="flex-1 flex items-center justify-center">
                                <div className="flex items-end gap-4 font-digital text-white leading-none select-none">
                                    {/* Hours : Minutes */}
                                    <div className="flex items-center text-[25vw] tracking-widest">
                                        {displayHours > 0 && (
                                            <>
                                                <span>{String(displayHours).padStart(2, '0')}</span>
                                                <span className="animate-pulse mx-2">:</span>
                                            </>
                                        )}
                                        <span>{String(displayMinutes).padStart(2, '0')}</span>
                                        <span className="animate-pulse mx-2">:</span>
                                    </div>

                                    {/* Seconds (Smaller) */}
                                    <div className="text-[12vw] mb-[3vw] text-white/90">
                                        {String(displaySeconds).padStart(2, '0')}
                                    </div>
                                </div>
                            </div>

                            {/* Task Info */}
                            {isActive && selectedTaskId !== 'none' && (
                                <div className="absolute top-8 text-xl font-sans text-white/30 whitespace-nowrap">
                                    {profile.todos.find(t => t.id === selectedTaskId)?.text}
                                </div>
                            )}

                            {/* Bottom Controls */}
                            <div className="absolute bottom-8 w-full px-12 flex items-center justify-between">
                                {/* Play/Pause */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-16 w-24 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white hover:border-white/20 transition-all"
                                    onClick={handlePauseResume}
                                >
                                    {isPaused || !isActive ? <Play className="h-8 w-8 fill-current" /> : <Pause className="h-8 w-8 fill-current" />}
                                </Button>

                                {/* Reset */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-16 w-24 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white hover:border-white/20 transition-all"
                                    onClick={handleReset}
                                >
                                    <RotateCcw className="h-8 w-8" />
                                </Button>

                                {/* Exit Full Screen */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-16 w-24 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white hover:border-white/20 transition-all"
                                    onClick={() => setIsFullScreen(false)}
                                >
                                    <Minimize2 className="h-8 w-8" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Card className="bg-background/40 backdrop-blur-xl border-border/50 shadow-xl relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-primary z-10"
                    onClick={() => setIsFullScreen(true)}
                >
                    <Maximize className="h-5 w-5" />
                </Button>
                <CardContent className="p-6 space-y-8">
                    {/* Task Selection */}
                    {!isActive && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Link to Task (Optional)</Label>
                            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                                <SelectTrigger className="w-full bg-background/50 border-white/10">
                                    <SelectValue placeholder="Select a task to track..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {profile.todos.filter(t => !t.completed).map(todo => (
                                        <SelectItem key={todo.id} value={todo.id}>
                                            {todo.text}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {isActive && selectedTaskId !== 'none' && (
                        <div className="text-center">
                            <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                                Tracking: {profile.todos.find(t => t.id === selectedTaskId)?.text}
                            </Badge>
                        </div>
                    )}

                    <Tabs value={mode} onValueChange={(v) => setMode(v as 'normal' | 'interval')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="normal" disabled={isActive}>
                                <TimerIcon className="h-4 w-4 mr-2" />
                                Timer
                            </TabsTrigger>
                            <TabsTrigger value="interval" disabled={isActive}>
                                <Activity className="h-4 w-4 mr-2" />
                                Interval (HIIT)
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="normal" className="space-y-6 mt-6">
                            {!isActive ? (
                                <div className="space-y-8">
                                    <div className="flex justify-center items-center gap-4">
                                        <TimeInput label="Hours" value={hours} onChange={setHours} disabled={false} max={99} />
                                        <span className="text-4xl font-bold text-muted-foreground pb-6">:</span>
                                        <TimeInput label="Minutes" value={minutes} onChange={setMinutes} disabled={false} />
                                        <span className="text-4xl font-bold text-muted-foreground pb-6">:</span>
                                        <TimeInput label="Seconds" value={seconds} onChange={setSeconds} disabled={false} />
                                    </div>

                                    <div className="grid grid-cols-4 gap-3">
                                        <PresetButton icon={Zap} label="1 min" minutes={1} onClick={() => setPreset(1)} />
                                        <PresetButton icon={Coffee} label="5 min" minutes={5} onClick={() => setPreset(5)} />
                                        <PresetButton icon={TimerIcon} label="15 min" minutes={15} onClick={() => setPreset(15)} />
                                        <PresetButton icon={Moon} label="25 min" minutes={25} onClick={() => setPreset(25)} />
                                    </div>

                                    {/* Save Timer */}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Timer name..."
                                            value={timerName}
                                            onChange={(e) => setTimerName(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button onClick={saveTimer} variant="outline">
                                            <Save className="h-4 w-4 mr-2" />
                                            Save
                                        </Button>
                                    </div>

                                    {/* Saved Timers */}
                                    {savedTimers.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Saved Timers</Label>
                                            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                                                {savedTimers.map(timer => (
                                                    <div key={timer.id} className="flex items-center justify-between bg-muted/30 rounded-lg p-2">
                                                        <button
                                                            onClick={() => loadTimer(timer)}
                                                            className="flex-1 text-left text-sm hover:text-primary transition-colors"
                                                        >
                                                            <span className="font-medium">{timer.name}</span>
                                                            <span className="text-muted-foreground ml-2">
                                                                ({timer.hours > 0 && `${timer.hours}h `}{timer.minutes}m {timer.seconds}s)
                                                            </span>
                                                        </button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => deleteTimer(timer.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative h-80 w-80 mx-auto flex items-center justify-center">
                                    <svg className="absolute top-0 left-0 h-full w-full transform -rotate-90" viewBox="0 0 300 300">
                                        <circle
                                            cx="150" cy="150" r={radius}
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-muted/20"
                                        />
                                        <circle
                                            cx="150"
                                            cy="150"
                                            r={radius}
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeLinecap="round"
                                            className="text-primary transition-all duration-1000 ease-linear"
                                            style={{
                                                strokeDasharray: circumference,
                                                strokeDashoffset: strokeDashoffset,
                                            }}
                                        />
                                    </svg>

                                    <div className="text-center z-10">
                                        <div className="text-6xl font-bold font-mono tabular-nums tracking-tighter">
                                            {displayHours > 0 && <span>{String(displayHours).padStart(2, '0')}:</span>}
                                            {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                                        </div>
                                        <p className="text-muted-foreground mt-2 font-medium uppercase tracking-widest text-sm">Remaining</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="interval" className="space-y-6 mt-6">
                            {!isActive ? (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                            <Label className="text-sm font-semibold text-green-500 mb-3 block">💪 Work Time</Label>
                                            <div className="flex justify-center items-center gap-3">
                                                <TimeInput
                                                    label="Min"
                                                    value={intervalSettings.workMinutes}
                                                    onChange={(v) => setIntervalSettings(prev => ({ ...prev, workMinutes: v }))}
                                                    disabled={false}
                                                />
                                                <span className="text-2xl font-bold text-muted-foreground pb-6">:</span>
                                                <TimeInput
                                                    label="Sec"
                                                    value={intervalSettings.workSeconds}
                                                    onChange={(v) => setIntervalSettings(prev => ({ ...prev, workSeconds: v }))}
                                                    disabled={false}
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                            <Label className="text-sm font-semibold text-blue-500 mb-3 block">😌 Rest Time</Label>
                                            <div className="flex justify-center items-center gap-3">
                                                <TimeInput
                                                    label="Min"
                                                    value={intervalSettings.restMinutes}
                                                    onChange={(v) => setIntervalSettings(prev => ({ ...prev, restMinutes: v }))}
                                                    disabled={false}
                                                />
                                                <span className="text-2xl font-bold text-muted-foreground pb-6">:</span>
                                                <TimeInput
                                                    label="Sec"
                                                    value={intervalSettings.restSeconds}
                                                    onChange={(v) => setIntervalSettings(prev => ({ ...prev, restSeconds: v }))}
                                                    disabled={false}
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                                            <Label className="text-sm font-semibold text-purple-500 mb-3 block">🔄 Rounds</Label>
                                            <div className="flex justify-center">
                                                <TimeInput
                                                    label="Rounds"
                                                    value={intervalSettings.rounds}
                                                    onChange={(v) => setIntervalSettings(prev => ({ ...prev, rounds: v }))}
                                                    disabled={false}
                                                    max={99}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative h-80 w-80 mx-auto flex items-center justify-center">
                                        <svg className="absolute top-0 left-0 h-full w-full transform -rotate-90" viewBox="0 0 300 300">
                                            <circle
                                                cx="150" cy="150" r={radius}
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-muted/20"
                                            />
                                            <circle
                                                cx="150"
                                                cy="150"
                                                r={radius}
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeLinecap="round"
                                                className={cn(
                                                    "transition-all duration-1000 ease-linear",
                                                    isWorkPhase ? "text-green-500" : "text-blue-500"
                                                )}
                                                style={{
                                                    strokeDasharray: circumference,
                                                    strokeDashoffset: strokeDashoffset,
                                                }}
                                            />
                                        </svg>

                                        <div className="text-center z-10">
                                            <div className={cn(
                                                "text-6xl font-bold font-mono tabular-nums tracking-tighter",
                                                isWorkPhase ? "text-green-500" : "text-blue-500"
                                            )}>
                                                {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                                            </div>
                                            <p className="text-muted-foreground mt-2 font-medium uppercase tracking-widest text-sm">
                                                {isWorkPhase ? '💪 WORK' : '😌 REST'}
                                            </p>
                                            <p className="text-muted-foreground mt-1 text-xs">
                                                Round {currentRound}/{intervalSettings.rounds}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    {/* Keyboard Shortcuts Hint */}
                    {!isActive && (
                        <div className="text-center text-xs text-muted-foreground">
                            <p>Shortcuts: <kbd className="px-1.5 py-0.5 bg-muted rounded">Space</kbd> Start • <kbd className="px-1.5 py-0.5 bg-muted rounded">R</kbd> Reset</p>
                        </div>
                    )}

                    {/* Quick Add Time Buttons (only during active timer) */}
                    {isActive && mode === 'normal' && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => quickAddTime(-60)}
                                className="gap-1"
                            >
                                <Minus className="h-3 w-3" />
                                1 min
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => quickAddTime(60)}
                                className="gap-1"
                            >
                                <Plus className="h-3 w-3" />
                                1 min
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => quickAddTime(300)}
                                className="gap-1"
                            >
                                <Plus className="h-3 w-3" />
                                5 min
                            </Button>
                        </div>
                    )}

                    <div className="flex justify-center items-center gap-6">
                        {!isActive ? (
                            <Button
                                size="lg"
                                className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                onClick={handleStart}
                            >
                                <Play className="mr-2 h-6 w-6 fill-current" /> Start Timer
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-14 w-14 rounded-full border-2"
                                    onClick={handleReset}
                                >
                                    <RotateCcw className="h-6 w-6" />
                                </Button>

                                <Button
                                    size="icon"
                                    className={cn(
                                        "h-20 w-20 rounded-full shadow-lg transition-all active:scale-95",
                                        isPaused
                                            ? "bg-green-500 hover:bg-green-600 shadow-green-500/25"
                                            : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
                                    )}
                                    onClick={handlePauseResume}
                                >
                                    {isPaused ? <Play className="h-8 w-8 fill-current ml-1" /> : <Pause className="h-8 w-8 fill-current" />}
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
