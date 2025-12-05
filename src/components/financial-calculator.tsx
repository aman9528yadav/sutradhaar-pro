"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Percent, ClipboardPaste } from 'lucide-react';

export function FinancialCalculator({ currentCalcValue }: { currentCalcValue?: string }) {
    const [mode, setMode] = useState('simple');

    // Simple Interest State
    const [siPrincipal, setSiPrincipal] = useState('');
    const [siRate, setSiRate] = useState('');
    const [siTime, setSiTime] = useState('');
    const [siResult, setSiResult] = useState<{ interest: number, total: number } | null>(null);

    // Compound Interest State
    const [ciPrincipal, setCiPrincipal] = useState('');
    const [ciRate, setCiRate] = useState('');
    const [ciTime, setCiTime] = useState('');
    const [ciFrequency, setCiFrequency] = useState('12'); // Monthly default
    const [ciResult, setCiResult] = useState<{ interest: number, total: number } | null>(null);

    const calculateSI = () => {
        const p = parseFloat(siPrincipal);
        const r = parseFloat(siRate);
        const t = parseFloat(siTime);
        if (isNaN(p) || isNaN(r) || isNaN(t)) return;

        const interest = (p * r * t) / 100;
        const total = p + interest;
        setSiResult({ interest, total });
    };

    const calculateCI = () => {
        const p = parseFloat(ciPrincipal);
        const r = parseFloat(ciRate);
        const t = parseFloat(ciTime);
        const n = parseFloat(ciFrequency);
        if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) return;

        const amount = p * Math.pow((1 + (r / 100) / n), n * t);
        const interest = amount - p;
        setCiResult({ interest, total: amount });
    };

    const InputWithPaste = ({ label, value, onChange, placeholder }: any) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                {currentCalcValue && !isNaN(parseFloat(currentCalcValue)) && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onChange(currentCalcValue)}
                        title="Paste from Calculator"
                    >
                        <ClipboardPaste className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <Tabs value={mode} onValueChange={setMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="simple">Simple Interest</TabsTrigger>
                    <TabsTrigger value="compound">Compound Interest</TabsTrigger>
                </TabsList>

                <TabsContent value="simple" className="space-y-4 mt-4">
                    <div className="grid gap-4">
                        <InputWithPaste
                            label="Principal Amount (₹)"
                            value={siPrincipal}
                            onChange={setSiPrincipal}
                            placeholder="e.g. 10000"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputWithPaste
                                label="Rate (% per year)"
                                value={siRate}
                                onChange={setSiRate}
                                placeholder="e.g. 8.5"
                            />
                            <InputWithPaste
                                label="Time (Years)"
                                value={siTime}
                                onChange={setSiTime}
                                placeholder="e.g. 5"
                            />
                        </div>
                        <Button onClick={calculateSI} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                            Calculate
                        </Button>

                        {siResult && (
                            <Card className="bg-emerald-500/10 border-emerald-500/20">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Interest Earned:</span>
                                        <span className="font-bold text-emerald-400">₹{siResult.interest.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-emerald-500/20 pt-2">
                                        <span className="font-semibold">Total Amount:</span>
                                        <span className="font-bold text-xl text-emerald-500">₹{siResult.total.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="compound" className="space-y-4 mt-4">
                    <div className="grid gap-4">
                        <InputWithPaste
                            label="Principal Amount (₹)"
                            value={ciPrincipal}
                            onChange={setCiPrincipal}
                            placeholder="e.g. 10000"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputWithPaste
                                label="Rate (% per year)"
                                value={ciRate}
                                onChange={setCiRate}
                                placeholder="e.g. 12"
                            />
                            <InputWithPaste
                                label="Time (Years)"
                                value={ciTime}
                                onChange={setCiTime}
                                placeholder="e.g. 10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Compounding Frequency</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={ciFrequency}
                                onChange={(e) => setCiFrequency(e.target.value)}
                            >
                                <option value="1">Annually</option>
                                <option value="2">Semi-Annually</option>
                                <option value="4">Quarterly</option>
                                <option value="12">Monthly</option>
                                <option value="365">Daily</option>
                            </select>
                        </div>
                        <Button onClick={calculateCI} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                            Calculate
                        </Button>

                        {ciResult && (
                            <Card className="bg-blue-500/10 border-blue-500/20">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Interest Earned:</span>
                                        <span className="font-bold text-blue-400">₹{ciResult.interest.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-blue-500/20 pt-2">
                                        <span className="font-semibold">Total Amount:</span>
                                        <span className="font-bold text-xl text-blue-500">₹{ciResult.total.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
