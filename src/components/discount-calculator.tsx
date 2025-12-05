"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tag, Percent, DollarSign, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DiscountCalculator() {
    const [originalPrice, setOriginalPrice] = useState<number>(1000);
    const [discount1, setDiscount1] = useState<number>(10);
    const [discount2, setDiscount2] = useState<number>(0); // Additional discount
    const [taxRate, setTaxRate] = useState<number>(0);

    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [taxAmount, setTaxAmount] = useState<number>(0);

    useEffect(() => {
        let price = originalPrice;

        // Apply first discount
        const save1 = price * (discount1 / 100);
        price -= save1;

        // Apply second discount (compound)
        const save2 = price * (discount2 / 100);
        price -= save2;

        const savings = originalPrice - price;

        // Apply Tax
        const tax = price * (taxRate / 100);
        const final = price + tax;

        setFinalPrice(Math.round(final));
        setTotalSavings(Math.round(savings));
        setTaxAmount(Math.round(tax));

    }, [originalPrice, discount1, discount2, taxRate]);

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Discount Calculator</h1>
                    <p className="text-sm text-white/60">Calculate final price with multiple discounts and tax</p>
                </div>
            </div>

            <div className="flex flex-col gap-6 max-w-md mx-auto">
                {/* Input Card */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-fit">
                    <CardHeader>
                        <CardTitle className="text-white">Price Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Original Price */}
                        <div className="space-y-3">
                            <Label className="text-white">Original Price</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                <Input
                                    type="number"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                                    className="pl-9 bg-white/5 border-white/10 text-white text-lg font-bold"
                                />
                            </div>
                        </div>

                        {/* Discount 1 */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-white">Discount (%)</Label>
                                <span className="text-primary font-bold">{discount1}%</span>
                            </div>
                            <Slider
                                value={[discount1]}
                                max={100}
                                step={1}
                                onValueChange={([v]) => setDiscount1(v)}
                                className="py-2"
                            />
                        </div>

                        {/* Discount 2 (Optional) */}
                        <div className="space-y-3 pt-2 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <Label className="text-white">Extra Discount (%)</Label>
                                <span className="text-orange-400 font-bold">{discount2}%</span>
                            </div>
                            <Slider
                                value={[discount2]}
                                max={100}
                                step={1}
                                onValueChange={([v]) => setDiscount2(v)}
                                className="py-2"
                            />
                        </div>

                        {/* Tax */}
                        <div className="space-y-3 pt-2 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <Label className="text-white">Tax / VAT (%)</Label>
                                <span className="text-rose-400 font-bold">{taxRate}%</span>
                            </div>
                            <Slider
                                value={[taxRate]}
                                max={50}
                                step={0.5}
                                onValueChange={([v]) => setTaxRate(v)}
                                className="py-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Result Card */}
                <div className="space-y-4">
                    <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 backdrop-blur-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Tag className="h-32 w-32 text-white" />
                        </div>
                        <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
                            <p className="text-white/60 mb-2 font-medium uppercase tracking-wider text-sm">Final Price</p>
                            <h2 className="text-6xl font-bold text-white mb-4 tracking-tight">
                                {finalPrice.toLocaleString()}
                            </h2>
                            {taxAmount > 0 && (
                                <p className="text-white/40 text-sm flex items-center gap-1">
                                    (Includes {taxAmount.toLocaleString()} tax)
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                            <CardContent className="p-4">
                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">You Save</p>
                                <p className="text-2xl font-bold text-emerald-400">{totalSavings.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                            <CardContent className="p-4">
                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Effective Rate</p>
                                <p className="text-2xl font-bold text-orange-400">
                                    {Math.round((totalSavings / originalPrice) * 100)}%
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
