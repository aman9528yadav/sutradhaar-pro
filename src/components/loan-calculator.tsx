"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Percent, Calendar, RefreshCcw, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoanCalculator() {
    const [amount, setAmount] = useState<number>(100000);
    const [rate, setRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(5); // Years
    const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [schedule, setSchedule] = useState<any[]>([]);

    const calculateLoan = () => {
        const principal = amount;
        const monthlyRate = rate / 12 / 100;
        const months = tenureType === 'years' ? tenure * 12 : tenure;

        if (principal > 0 && rate > 0 && months > 0) {
            const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            const totalPay = emiValue * months;
            const totalInt = totalPay - principal;

            setEmi(Math.round(emiValue));
            setTotalPayment(Math.round(totalPay));
            setTotalInterest(Math.round(totalInt));

            // Generate Amortization Schedule
            let balance = principal;
            const newSchedule = [];
            for (let i = 1; i <= months; i++) {
                const interest = balance * monthlyRate;
                const principalComponent = emiValue - interest;
                balance -= principalComponent;

                if (i <= 12 || i % 12 === 0 || i === months) { // Optimize: Show first year, then yearly, and last
                    newSchedule.push({
                        month: i,
                        principal: Math.round(principalComponent),
                        interest: Math.round(interest),
                        balance: Math.max(0, Math.round(balance))
                    });
                }
            }
            setSchedule(newSchedule);
        }
    };

    useEffect(() => {
        calculateLoan();
    }, [amount, rate, tenure, tenureType]);

    const chartData = [
        { name: 'Principal', value: amount, color: '#10b981' }, // Emerald-500
        { name: 'Interest', value: totalInterest, color: '#f43f5e' }, // Rose-500
    ];

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Loan Calculator</h1>
                    <p className="text-sm text-white/60">Plan your loan payments effectively</p>
                </div>
            </div>

            <div className="flex flex-col gap-6 max-w-md mx-auto">
                {/* Input Section */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Loan Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-white">Loan Amount</Label>
                                <span className="text-primary font-mono font-bold">{amount.toLocaleString()}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="relative flex-1">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="pl-9 bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[amount]}
                                min={10000}
                                max={10000000}
                                step={10000}
                                onValueChange={([v]) => setAmount(v)}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-white">Interest Rate (%)</Label>
                                <span className="text-primary font-mono font-bold">{rate}%</span>
                            </div>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                <Input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="pl-9 bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <Slider
                                value={[rate]}
                                min={1}
                                max={30}
                                step={0.1}
                                onValueChange={([v]) => setRate(v)}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-white">Loan Tenure</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={tenureType === 'years' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setTenureType('years')}
                                        className="h-6 text-xs"
                                    >
                                        Years
                                    </Button>
                                    <Button
                                        variant={tenureType === 'months' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setTenureType('months')}
                                        className="h-6 text-xs"
                                    >
                                        Months
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                <Input
                                    type="number"
                                    value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="pl-9 bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <Slider
                                value={[tenure]}
                                min={1}
                                max={tenureType === 'years' ? 30 : 360}
                                step={1}
                                onValueChange={([v]) => setTenure(v)}
                                className="py-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* EMI Card */}
                    <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 backdrop-blur-xl">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <p className="text-white/60 mb-2 font-medium uppercase tracking-wider text-sm">Monthly EMI</p>
                            <h2 className="text-5xl font-bold text-white mb-2 tracking-tight">
                                {emi.toLocaleString()}
                            </h2>
                            <p className="text-white/40 text-xs">Total Payment: {totalPayment.toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    {/* Breakdown Chart */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white text-sm">Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Amortization Schedule */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-white">Amortization Schedule (Preview)</CardTitle>
                    <CardDescription className="text-white/40">Breakdown of principal and interest over time</CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[400px]">
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-white/5">
                                    <TableHead className="text-white/60 pl-4">Month</TableHead>
                                    <TableHead className="text-white/60">Principal</TableHead>
                                    <TableHead className="text-white/60">Interest</TableHead>
                                    <TableHead className="text-white/60 text-right pr-4">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedule.slice(0, 10).map((row) => (
                                    <TableRow key={row.month} className="border-white/10 hover:bg-white/5">
                                        <TableCell className="text-white font-medium pl-4">{row.month}</TableCell>
                                        <TableCell className="text-emerald-400">{row.principal.toLocaleString()}</TableCell>
                                        <TableCell className="text-rose-400">{row.interest.toLocaleString()}</TableCell>
                                        <TableCell className="text-white text-right pr-4">{row.balance.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
