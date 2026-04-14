"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calculator, DollarSign, Percent, Calendar, RefreshCcw, Download, 
  Home, Car, CreditCard, Briefcase, Target, TrendingUp, 
  FileText, Share2, Zap, Shield, Award, Globe,
  IndianRupee, Building2, Users, Lightbulb, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function LoanCalculatorModern() {
    const [amount, setAmount] = useState<number>(500000);
    const [rate, setRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(5);
    const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
    const [loanType, setLoanType] = useState<'home' | 'car' | 'personal' | 'business'>('home');
    const [processingFee, setProcessingFee] = useState<number>(1);
    const [prepaymentAllowed, setPrepaymentAllowed] = useState<boolean>(true);
    const [prepaymentPenalty, setPrepaymentPenalty] = useState<number>(2);

    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [processingFeeAmount, setProcessingFeeAmount] = useState<number>(0);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [yearlySummary, setYearlySummary] = useState<any[]>([]);

    // Loan type configurations
    const loanConfigurations = {
        home: { min: 100000, max: 50000000, defaultRate: 8.5, icon: Home, color: 'from-blue-500/20 to-indigo-500/20' },
        car: { min: 50000, max: 5000000, defaultRate: 9.0, icon: Car, color: 'from-emerald-500/20 to-teal-500/20' },
        personal: { min: 10000, max: 2000000, defaultRate: 12.0, icon: Users, color: 'from-purple-500/20 to-pink-500/20' },
        business: { min: 100000, max: 10000000, defaultRate: 14.0, icon: Briefcase, color: 'from-amber-500/20 to-orange-500/20' }
    };

    const calculateLoan = () => {
        const principal = amount;
        const monthlyRate = rate / 12 / 100;
        const months = tenureType === 'years' ? tenure * 12 : tenure;
        const feeAmount = (amount * processingFee) / 100;

        if (principal > 0 && rate > 0 && months > 0) {
            const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            const totalPay = emiValue * months;
            const totalInt = totalPay - principal;

            setEmi(Math.round(emiValue));
            setTotalPayment(Math.round(totalPay));
            setTotalInterest(Math.round(totalInt));
            setProcessingFeeAmount(Math.round(feeAmount));

            // Generate Detailed Amortization Schedule
            let balance = principal;
            const newSchedule = [];
            const yearlyData = [];

            for (let i = 1; i <= months; i++) {
                const interest = balance * monthlyRate;
                const principalComponent = emiValue - interest;
                const prevBalance = balance;
                balance -= principalComponent;

                newSchedule.push({
                    month: i,
                    emi: Math.round(emiValue),
                    principal: Math.round(principalComponent),
                    interest: Math.round(interest),
                    balance: Math.max(0, Math.round(balance)),
                    totalPaid: Math.round(emiValue * i)
                });

                // Yearly summary
                if (i % 12 === 0 || i === months) {
                    const year = Math.ceil(i / 12);
                    const yearPrincipal = newSchedule
                        .slice((year - 1) * 12, i)
                        .reduce((sum, entry) => sum + entry.principal, 0);
                    const yearInterest = newSchedule
                        .slice((year - 1) * 12, i)
                        .reduce((sum, entry) => sum + entry.interest, 0);

                    yearlyData.push({
                        year: year,
                        principal: Math.round(yearPrincipal),
                        interest: Math.round(yearInterest),
                        balance: Math.max(0, Math.round(balance))
                    });
                }
            }

            setSchedule(newSchedule);
            setYearlySummary(yearlyData);
        }
    };

    useEffect(() => {
        calculateLoan();
    }, [amount, rate, tenure, tenureType, processingFee]);

    useEffect(() => {
        // Update default rate when loan type changes
        setRate(loanConfigurations[loanType].defaultRate);
    }, [loanType]);

    const chartData = [
        { name: 'Principal', value: amount, color: '#10b981' },
        { name: 'Interest', value: totalInterest, color: '#f43f5e' },
        { name: 'Processing Fee', value: processingFeeAmount, color: '#8b5cf6' }
    ];

    const yearlyChartData = yearlySummary.map(item => ({
        name: `Year ${item.year}`,
        Principal: item.principal,
        Interest: item.interest
    }));

    const getLoanTypeInfo = () => {
        const config = loanConfigurations[loanType];
        const Icon = config.icon;
        return { icon: Icon, color: config.color };
    };

    const exportSchedule = () => {
        const csvContent = [
            ['Month', 'EMI', 'Principal', 'Interest', 'Balance', 'Total Paid'],
            ...schedule.map(row => [
                row.month,
                row.emi,
                row.principal,
                row.interest,
                row.balance,
                row.totalPaid
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loan-amortization-${loanType}.csv`;
        a.click();
    };

    const shareResults = async () => {
        const text = `💰 ${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan EMI Calculator Results
        
Loan Amount: ₹${amount.toLocaleString()}
Interest Rate: ${rate}%
Tenure: ${tenure} ${tenureType}
Monthly EMI: ₹${emi.toLocaleString()}
Total Interest: ₹${totalInterest.toLocaleString()}
Total Payment: ₹${totalPayment.toLocaleString()}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Loan EMI Calculator Results',
                    text: text
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            navigator.clipboard.writeText(text);
            alert('Results copied to clipboard!');
        }
    };

    const { icon: LoanIcon, color: gradientColor } = getLoanTypeInfo();

    return (
        <div className="space-y-6 pb-24 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradientColor}`}>
                        <LoanIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">EMI Calculator</h1>
                        <p className="text-sm text-white/60">Calculate your loan payments with detailed analysis</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={shareResults}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportSchedule}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Loan Type Selection */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Loan Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(loanConfigurations).map(([type, config]) => {
                                    const Icon = config.icon;
                                    return (
                                        <Button
                                            key={type}
                                            variant={loanType === type ? "default" : "outline"}
                                            className={cn(
                                                "h-16 flex flex-col gap-1",
                                                loanType === type && "bg-primary hover:bg-primary/90"
                                            )}
                                            onClick={() => setLoanType(type as any)}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-xs capitalize">{type}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loan Details */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Loan Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="text-white">Loan Amount</Label>
                                    <span className="text-primary font-mono font-bold">₹{amount.toLocaleString()}</span>
                                </div>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="pl-9 bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <Slider
                                    value={[amount]}
                                    min={loanConfigurations[loanType].min}
                                    max={loanConfigurations[loanType].max}
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
                                    min={6}
                                    max={25}
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

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="text-white">Processing Fee (%)</Label>
                                    <span className="text-primary font-mono font-bold">{processingFee}%</span>
                                </div>
                                <Slider
                                    value={[processingFee]}
                                    min={0}
                                    max={5}
                                    step={0.1}
                                    onValueChange={([v]) => setProcessingFee(v)}
                                    className="py-2"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advanced Options */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Prepayment Options
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-white text-sm">Prepayment Allowed</Label>
                                <Button
                                    variant={prepaymentAllowed ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPrepaymentAllowed(!prepaymentAllowed)}
                                >
                                    {prepaymentAllowed ? 'Yes' : 'No'}
                                </Button>
                            </div>
                            {prepaymentAllowed && (
                                <div className="space-y-2">
                                    <Label className="text-white text-sm">Prepayment Penalty (%)</Label>
                                    <Slider
                                        value={[prepaymentPenalty]}
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        onValueChange={([v]) => setPrepaymentPenalty(v)}
                                        className="py-2"
                                    />
                                    <div className="text-xs text-white/60 text-center">
                                        {prepaymentPenalty}% penalty on prepayment amount
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30">
                            <CardContent className="p-4 text-center">
                                <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                                <p className="text-xs text-white/60 uppercase tracking-wider">Monthly EMI</p>
                                <p className="text-2xl font-bold text-emerald-500 mt-1">₹{emi.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-rose-500/20 to-red-500/20 border-rose-500/30">
                            <CardContent className="p-4 text-center">
                                <TrendingUp className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                                <p className="text-xs text-white/60 uppercase tracking-wider">Total Interest</p>
                                <p className="text-2xl font-bold text-rose-500 mt-1">₹{totalInterest.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30">
                            <CardContent className="p-4 text-center">
                                <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                <p className="text-xs text-white/60 uppercase tracking-wider">Total Payment</p>
                                <p className="text-2xl font-bold text-blue-500 mt-1">₹{totalPayment.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Breakdown */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Payment Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                        <span className="text-white/80">Principal Amount</span>
                                        <span className="font-bold text-white">₹{amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                        <span className="text-white/80">Total Interest</span>
                                        <span className="font-bold text-rose-400">₹{totalInterest.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                        <span className="text-white/80">Processing Fee</span>
                                        <span className="font-bold text-purple-400">₹{processingFeeAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                                        <span className="text-white font-medium">Total Payment</span>
                                        <span className="font-bold text-primary text-xl">₹{(totalPayment + processingFeeAmount).toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div className="h-64">
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
                                                contentStyle={{ 
                                                    backgroundColor: '#1e293b', 
                                                    borderColor: '#334155', 
                                                    color: '#fff',
                                                    borderRadius: '8px'
                                                }}
                                                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                                            />
                                            <Legend 
                                                verticalAlign="bottom" 
                                                height={36} 
                                                iconType="circle"
                                                formatter={(value) => <span className="text-white text-xs">{value}</span>}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Yearly Analysis */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <BarChart className="h-5 w-5" />
                                Yearly Payment Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={yearlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#94a3b8" 
                                        fontSize={12}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        fontSize={12}
                                        tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`}
                                    />
                                    <Tooltip
                                        contentStyle={{ 
                                            backgroundColor: '#1e293b', 
                                            borderColor: '#334155', 
                                            color: '#fff',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                                    />
                                    <Legend 
                                        formatter={(value) => <span className="text-white text-sm">{value}</span>}
                                    />
                                    <Bar dataKey="Principal" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Interest" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Amortization Schedule */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-white">Amortization Schedule</CardTitle>
                                    <CardDescription className="text-white/40">
                                        Detailed month-by-month breakdown
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={exportSchedule}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-white/5">
                                            <TableHead className="text-white/60 pl-4">Month</TableHead>
                                            <TableHead className="text-white/60">EMI</TableHead>
                                            <TableHead className="text-emerald-400">Principal</TableHead>
                                            <TableHead className="text-rose-400">Interest</TableHead>
                                            <TableHead className="text-white/60 text-right pr-4">Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {schedule.slice(0, 15).map((row) => (
                                            <TableRow key={row.month} className="border-white/10 hover:bg-white/5">
                                                <TableCell className="text-white font-medium pl-4">{row.month}</TableCell>
                                                <TableCell className="text-white">₹{row.emi.toLocaleString()}</TableCell>
                                                <TableCell className="text-emerald-400">₹{row.principal.toLocaleString()}</TableCell>
                                                <TableCell className="text-rose-400">₹{row.interest.toLocaleString()}</TableCell>
                                                <TableCell className="text-white text-right pr-4">₹{row.balance.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                        {schedule.length > 15 && (
                                            <TableRow className="border-white/10">
                                                <TableCell colSpan={5} className="text-center text-white/60 py-4">
                                                    Showing first 15 months. Export to see full schedule.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Insights Section */}
            <Card className="bg-gradient-to-br from-primary/10 to-indigo-500/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                        Financial Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
                            <Award className="h-5 w-5 text-emerald-400 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-white">Interest Savings</h4>
                                <p className="text-sm text-white/70 mt-1">
                                    By increasing your EMI by 10%, you can save ₹{(totalInterest * 0.15).toLocaleString()} in interest
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
                            <Clock className="h-5 w-5 text-blue-400 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-white">Time Reduction</h4>
                                <p className="text-sm text-white/70 mt-1">
                                    Prepaying ₹1,00,000 can reduce your loan tenure by approximately {Math.max(1, Math.floor((100000 / emi) / 12))} years
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
                            <Globe className="h-5 w-5 text-purple-400 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-white">Market Comparison</h4>
                                <p className="text-sm text-white/70 mt-1">
                                    Current {loanType} loan rates range from {Math.max(6, rate - 1.5)}% to {rate + 2}%. Shop around for better rates.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}