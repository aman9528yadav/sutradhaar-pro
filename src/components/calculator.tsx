"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Divide, Equal, Minus, Plus, X, Percent, History, Undo2, Trash2,
  Volume2, VolumeX, Delete, Maximize, Minimize, Calculator as CalcIcon,
  TrendingUp, PieChart, DollarSign, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile, CalculatorHistoryItem } from '@/context/ProfileContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProgrammerCalculator } from './programmer-calculator';
import { FinancialCalculator } from './financial-calculator';
import { SaveToBudgetDialog } from './save-to-budget-dialog';

const CalculatorButton = ({
  onClick,
  children,
  className,
  variant = 'secondary',
  size = 'default'
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'secondary' | 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | null | undefined;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}) => {
  const [calculatorSounds, setCalculatorSounds] = useState(false);

  useEffect(() => {
    const soundsEnabled = localStorage.getItem('sutradhaar_calculator_sounds') === 'true';
    setCalculatorSounds(soundsEnabled);

    const handleStorageChange = () => {
      const soundsEnabled = localStorage.getItem('sutradhaar_calculator_sounds') === 'true';
      setCalculatorSounds(soundsEnabled);
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const playSound = () => {
    if (calculatorSounds) {
      const soundFile = localStorage.getItem('sutradhaar_calculator_sound_file') || '/sound/keyboard-click-327728.mp3';
      const audio = new Audio(soundFile);
      audio.play().catch(e => console.error("Failed to play sound", e));
    }
  };

  const handleClick = () => {
    playSound();
    onClick();
  }

  return (
    <motion.div whileTap={{ scale: 0.95 }} className="w-full h-full">
      <Button
        variant={variant}
        size={size}
        className={cn("w-full h-full text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all", className)}
        onClick={handleClick}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export function Calculator({ onToggleFullScreen, isFullScreen }: { onToggleFullScreen: () => void, isFullScreen?: boolean }) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [mode, setMode] = useState<'basic' | 'scientific' | 'programmer' | 'financial'>('basic');
  const { profile, addCalculatorToHistory, deleteHistoryItem } = useProfile();
  const { history } = profile;
  const [calculatorSounds, setCalculatorSounds] = useState(false);
  const [memory, setMemory] = useState(0);
  const [showMemory, setShowMemory] = useState(false);
  const [isSaveToBudgetOpen, setIsSaveToBudgetOpen] = useState(false);

  useEffect(() => {
    const soundsEnabled = localStorage.getItem('sutradhaar_calculator_sounds') === 'true';
    setCalculatorSounds(soundsEnabled);
  }, []);

  const toggleSounds = () => {
    const newSoundsState = !calculatorSounds;
    setCalculatorSounds(newSoundsState);
    localStorage.setItem('sutradhaar_calculator_sounds', String(newSoundsState));
    window.dispatchEvent(new Event('storage'));
  };

  const handleInput = (value: string) => {
    if (display === 'Error') {
      setDisplay(value);
      setExpression(value);
      return;
    }
    if (['+', '-', '×', '÷', '^', '%'].includes(display) || expression.endsWith('(')) {
      setDisplay(value);
    } else if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
    setExpression(expression + value);
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    const lastChar = expression.slice(-1);
    if (['+', '-', '×', '÷', '^', '%'].includes(lastChar)) {
      setExpression(expression.slice(0, -1) + op);
    } else if (expression !== '' && expression.slice(-1) !== '(') {
      setExpression(expression + op);
    }
    setDisplay(op);
  };

  const evaluateExpression = (expr: string): number => {
    let sanitizedExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');
    while (['*', '/', '+', '-', '%'].includes(sanitizedExpr.slice(-1))) {
      sanitizedExpr = sanitizedExpr.slice(0, -1);
    }

    const scientificExpr = sanitizedExpr
      .replace(/(\d+(\.\d+)?)\s*\^\s*(\d+(\.\d+)?)/g, 'Math.pow($1, $3)')
      .replace(/sin\(([^)]+)\)/g, (match, p1) => `Math.sin((${p1}) * Math.PI / 180)`)
      .replace(/cos\(([^)]+)\)/g, (match, p1) => `Math.cos((${p1}) * Math.PI / 180)`)
      .replace(/tan\(([^)]+)\)/g, (match, p1) => `Math.tan((${p1}) * Math.PI / 180)`)
      .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
      .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/(\d+)!/g, (match, num) => {
        const n = parseInt(num);
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result.toString();
      });

    try {
      const openParen = (scientificExpr.match(/\(/g) || []).length;
      const closeParen = (scientificExpr.match(/\)/g) || []).length;
      const finalExpr = scientificExpr + ')'.repeat(openParen - closeParen);

      return new Function('return ' + finalExpr)();
    } catch (e) {
      console.error("Calculation Error:", e);
      throw new Error("Invalid Expression");
    }
  };

  const handleEquals = () => {
    if (display === 'Error' || expression === '') return;
    try {
      const currentExpression = expression;
      const result = evaluateExpression(currentExpression);
      const finalResult = Number(result.toPrecision(15));

      addCalculatorToHistory({
        expression: currentExpression,
        result: finalResult.toString(),
      });

      setDisplay(finalResult.toString());
      setExpression(finalResult.toString());
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleAllClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    if (display === 'Error' || display === '0') return;
    if (['+', '-', '×', '÷', '^', '%'].includes(display) || display.endsWith('(')) {
      return;
    }
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    setExpression(prev => prev.length > 1 ? prev.slice(0, -1) : '');
  };

  const handlePlusMinus = () => {
    if (display === 'Error' || display === '0' || ['+', '-', '×', '÷'].includes(display)) return;
    const operators = /([+\-×÷^])/;
    const parts = expression.split(operators);
    const lastPart = parts.pop() || '';

    if (lastPart && !isNaN(parseFloat(lastPart))) {
      const newLastPart = (parseFloat(lastPart) * -1).toString();
      const newExpression = parts.join('') + newLastPart;
      setExpression(newExpression);
      setDisplay(newLastPart);
    }
  };

  const handlePercent = () => {
    if (display === 'Error') return;
    try {
      const value = parseFloat(display);
      if (!isNaN(value)) {
        const result = value / 100;
        setDisplay(result.toString());
        const operators = /([+\-×÷^])/;
        const parts = expression.split(operators);
        const lastPart = parts[parts.length - 1];
        if (!isNaN(parseFloat(lastPart))) {
          const newExpression = expression.slice(0, expression.length - lastPart.length) + result.toString();
          setExpression(newExpression);
        }
      }
    } catch (e) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleSciFunction = (func: string) => {
    if (display === 'Error') {
      setDisplay(`${func}(`);
      setExpression(`${func}(`);
      return;
    }

    const currentDisplayIsOperator = ['+', '-', '×', '÷', '^'].includes(display);

    if (display === '0' || currentDisplayIsOperator || expression.endsWith('(')) {
      setDisplay(`${func}(`);
      if (display === '0' && expression === '0') {
        setExpression(`${func}(`);
      } else if (currentDisplayIsOperator || expression.endsWith('(')) {
        setExpression(expression + `${func}(`);
      } else {
        setExpression(`${func}(`);
      }
    } else {
      setExpression(expression + `${func}(`);
      setDisplay(`${func}(`);
    }
  };

  // Memory functions
  const handleMemoryAdd = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      setMemory(prev => prev + value);
      setShowMemory(true);
    }
  };

  const handleMemorySubtract = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      setMemory(prev => prev - value);
      setShowMemory(true);
    }
  };

  const handleMemoryRecall = () => {
    setDisplay(memory.toString());
    setExpression(memory.toString());
  };

  const handleMemoryClear = () => {
    setMemory(0);
    setShowMemory(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is on an input or textarea
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key;
      if (/^[0-9.]$/.test(key)) {
        e.preventDefault();
        handleInput(key);
      } else if (['+', '-', '^'].includes(key)) {
        e.preventDefault();
        handleOperator(key);
      } else if (key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleAllClear();
      } else if (key === '%') {
        e.preventDefault();
        handlePercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression]);

  const handleRestoreHistory = (item: CalculatorHistoryItem) => {
    setExpression(item.expression);
    setDisplay(item.result);
  };

  const calculatorHistory = history
    .filter(item => item.type === 'calculator')
    .slice(0, 3) as CalculatorHistoryItem[];

  return (
    <div className="w-full space-y-4">
      <Card className="overflow-hidden border-2">
        <CardContent className="p-6 space-y-6">
          {/* Display */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-6 rounded-2xl text-right relative shadow-2xl">
            <div className='flex justify-between items-center mb-4'>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground"
                  onClick={() => setIsSaveToBudgetOpen(true)}
                  title="Save to Budget"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={onToggleFullScreen}>
                  {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
                {showMemory && (
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-semibold flex items-center gap-2">
                    M: {memory}
                  </div>
                )}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={expression}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-white/60 text-2xl h-10 truncate mb-2"
              >
                {expression || '0'}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={display}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                className="text-white text-6xl font-bold h-[80px] flex items-end justify-end truncate"
              >
                {display}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mode Tabs */}
          <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex space-x-2">
                {[
                  { id: 'basic', label: 'Basic', icon: CalcIcon },
                  { id: 'scientific', label: 'Scientific', icon: Zap },
                  { id: 'programmer', label: 'Programmer', icon: TrendingUp },
                  { id: 'financial', label: 'Financial', icon: DollarSign },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMode(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      mode === tab.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>

            {/* Basic Mode */}
            <TabsContent value="basic" className="mt-6 space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <CalculatorButton onClick={handleAllClear} className="bg-red-500 hover:bg-red-600 text-white">AC</CalculatorButton>
                <CalculatorButton onClick={handleBackspace} className="bg-muted hover:bg-muted/80">
                  <Delete size={20} />
                </CalculatorButton>
                <CalculatorButton onClick={handlePercent} className="bg-muted hover:bg-muted/80">%</CalculatorButton>
                <CalculatorButton onClick={() => handleOperator('÷')} variant="default" className="bg-primary hover:bg-primary/90">
                  <Divide size={24} />
                </CalculatorButton>

                <CalculatorButton onClick={() => handleInput('7')}>7</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('8')}>8</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('9')}>9</CalculatorButton>
                <CalculatorButton onClick={() => handleOperator('×')} variant="default" className="bg-primary hover:bg-primary/90">
                  <X size={24} />
                </CalculatorButton>

                <CalculatorButton onClick={() => handleInput('4')}>4</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('5')}>5</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('6')}>6</CalculatorButton>
                <CalculatorButton onClick={() => handleOperator('-')} variant="default" className="bg-primary hover:bg-primary/90">
                  <Minus size={24} />
                </CalculatorButton>

                <CalculatorButton onClick={() => handleInput('1')}>1</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('2')}>2</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('3')}>3</CalculatorButton>
                <CalculatorButton onClick={() => handleOperator('+')} variant="default" className="bg-primary hover:bg-primary/90">
                  <Plus size={24} />
                </CalculatorButton>

                <CalculatorButton onClick={handlePlusMinus} className="bg-muted hover:bg-muted/80">+/-</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('0')}>0</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('.')}>.</CalculatorButton>
                <CalculatorButton onClick={handleEquals} variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Equal size={24} />
                </CalculatorButton>
              </div>
            </TabsContent>

            {/* Scientific Mode */}
            <TabsContent value="scientific" className="mt-6 space-y-3">
              {/* Memory buttons */}
              <div className="grid grid-cols-5 gap-2">
                <CalculatorButton onClick={handleMemoryClear} size="sm" className="bg-muted/50 text-xs">MC</CalculatorButton>
                <CalculatorButton onClick={handleMemoryRecall} size="sm" className="bg-muted/50 text-xs">MR</CalculatorButton>
                <CalculatorButton onClick={handleMemoryAdd} size="sm" className="bg-muted/50 text-xs">M+</CalculatorButton>
                <CalculatorButton onClick={handleMemorySubtract} size="sm" className="bg-muted/50 text-xs">M-</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('(')} size="sm" className="bg-muted/50 text-xs">(</CalculatorButton>
              </div>

              {/* Scientific functions */}
              <div className="grid grid-cols-5 gap-2">
                <CalculatorButton onClick={() => handleSciFunction('sin')} size="sm" className="text-sm">sin</CalculatorButton>
                <CalculatorButton onClick={() => handleSciFunction('cos')} size="sm" className="text-sm">cos</CalculatorButton>
                <CalculatorButton onClick={() => handleSciFunction('tan')} size="sm" className="text-sm">tan</CalculatorButton>
                <CalculatorButton onClick={() => handleSciFunction('log')} size="sm" className="text-sm">log</CalculatorButton>
                <CalculatorButton onClick={() => handleSciFunction('ln')} size="sm" className="text-sm">ln</CalculatorButton>
              </div>

              <div className="grid grid-cols-5 gap-2">
                <CalculatorButton onClick={() => handleOperator('^')} size="sm" className="text-sm">x^y</CalculatorButton>
                <CalculatorButton onClick={() => handleSciFunction('sqrt')} size="sm" className="text-sm">√</CalculatorButton>
                <CalculatorButton onClick={() => handleInput(Math.PI.toString())} size="sm" className="text-sm">π</CalculatorButton>
                <CalculatorButton onClick={() => handleInput(Math.E.toString())} size="sm" className="text-sm">e</CalculatorButton>
                <CalculatorButton onClick={() => handleInput(')')} size="sm" className="text-sm">)</CalculatorButton>
              </div>

              {/* Standard buttons */}
              <div className="grid grid-cols-4 gap-3">
                <CalculatorButton onClick={handleAllClear} className="bg-red-500 hover:bg-red-600 text-white">AC</CalculatorButton>
                <CalculatorButton onClick={handleBackspace} className="bg-muted hover:bg-muted/80">
                  <Delete size={20} />
                </CalculatorButton>
                <CalculatorButton onClick={handlePercent} className="bg-muted hover:bg-muted/80">%</CalculatorButton>
                <CalculatorButton onClick={() => handleOperator('÷')} variant="default" className="bg-primary hover:bg-primary/90">
                  <Divide size={20} />
                </CalculatorButton>

                <CalculatorButton onClick={() => handleInput('7')}>7</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('8')}>8</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('9')}>9</CalculatorButton>
                <CalculatorButton onClick={() => handleOperator('×')} variant="default" className="bg-primary hover:bg-primary/90">
                  <X size={20} />
                </CalculatorButton>

                <CalculatorButton onClick={() => handleInput('4')}>4</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('5')}>5</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('6')}>6</CalculatorButton>
                <CalculatorButton onClick={() => handleOperator('-')} variant="default" className="bg-primary hover:bg-primary/90">
                  <Minus size={20} />
                </CalculatorButton>

                <CalculatorButton onClick={() => handleInput('1')}>1</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('2')}>2</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('3')}>3</CalculatorButton>
                <CalculatorButton onClick={() => handleOperator('+')} variant="default" className="bg-primary hover:bg-primary/90">
                  <Plus size={20} />
                </CalculatorButton>

                <CalculatorButton onClick={handlePlusMinus} className="bg-muted hover:bg-muted/80">+/-</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('0')}>0</CalculatorButton>
                <CalculatorButton onClick={() => handleInput('.')}>.</CalculatorButton>
                <CalculatorButton onClick={handleEquals} variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Equal size={20} />
                </CalculatorButton>
              </div>
            </TabsContent>

            {/* Programmer Mode */}
            <TabsContent value="programmer" className="mt-6">
              <ProgrammerCalculator />
            </TabsContent>

            {/* Financial Mode */}
            <TabsContent value="financial" className="mt-6">
              <FinancialCalculator currentCalcValue={display} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* History */}
      {!isFullScreen && calculatorHistory.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <History className='h-5 w-5 text-muted-foreground' />
                Recent Calculations
              </h3>
              <Button asChild variant="link" className="text-primary pr-0">
                <Link href="/history">See All</Link>
              </Button>
            </div>
            <ul className="space-y-2">
              {calculatorHistory.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-accent/50 to-accent/30 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div className='flex flex-col text-right w-full items-end'>
                    <span className='text-xs text-muted-foreground font-mono'>{item.expression}</span>
                    <span className="font-bold text-xl">{item.result}</span>
                  </div>
                  <div className="flex items-center pl-3 gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRestoreHistory(item)}>
                      <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteHistoryItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <SaveToBudgetDialog
        open={isSaveToBudgetOpen}
        onOpenChange={setIsSaveToBudgetOpen}
        amount={display}
      />
    </div>
  );
}
