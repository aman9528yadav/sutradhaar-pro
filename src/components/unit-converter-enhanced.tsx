"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    ArrowRightLeft,
    Star,
    Copy,
    Info,
    History,
    Power,
    Undo2,
    Lock,
    ChevronDown,
    ChevronUp,
    Download,
    Calculator,
    Settings2,
    Table,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { CATEGORIES, convert, getConversionFormula, Unit } from '@/lib/units';
import { useToast } from '@/hooks/use-toast';
import { cn, formatIndianNumber } from '@/lib/utils';
import { AdMobBanner } from '@/components/admob-banner';
import { useProfile, ConversionHistoryItem } from '@/context/ProfileContext';
import Link from 'next/link';
import { ConversionComparisonDialog } from './conversion-comparison-dialog';

const premiumCategories = ['Pressure', 'Currency'];

export function UnitConverterEnhanced() {
    const { toast } = useToast();
    const { profile, addConversionToHistory, addFavorite, deleteFavorite, deleteHistoryItem } = useProfile();
    const { history, favorites, membership } = profile;

    // Basic state
    const [region, setRegion] = useState('International');
    const [category, setCategory] = useState(CATEGORIES[0].name);
    const [inputValue, setInputValue] = useState('1');
    const [fromUnit, setFromUnit] = useState(CATEGORIES[0].units[0].name);
    const [toUnit, setToUnit] = useState(CATEGORIES[0].units[1].name);
    const [result, setResult] = useState('');
    const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

    // NEW: Enhanced features state
    const [precision, setPrecision] = useState(5);
    const [showFormula, setShowFormula] = useState(false);
    const [showAllConversions, setShowAllConversions] = useState(false);
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkInput, setBulkInput] = useState('');
    const [bulkResults, setBulkResults] = useState<Array<{ input: string; output: string }>>([]);

    const isPremium = membership === 'premium' || membership === 'owner';

    const activeCategory = useMemo(
        () => CATEGORIES.find((c) => c.name === category)!,
        [category]
    );

    const units = useMemo(() => {
        if (region === 'Local') {
            return activeCategory.units.filter(u => !u.region || u.region === 'Indian');
        }
        return activeCategory.units.filter(u => !u.region);
    }, [activeCategory, region]);

    const fromUnitDetails = useMemo(() => units.find(u => u.name === fromUnit), [units, fromUnit]);
    const toUnitDetails = useMemo(() => units.find(u => u.name === toUnit), [units, toUnit]);

    const isFavorited = useMemo(() => {
        return favorites.some(fav => fav.category === category && fav.fromUnit === fromUnit && fav.toUnit === toUnit);
    }, [favorites, category, fromUnit, toUnit]);

    // NEW: Get conversion formula
    const formula = useMemo(() => {
        return getConversionFormula(fromUnit, toUnit, category);
    }, [fromUnit, toUnit, category]);

    // NEW: Calculate all conversions for multiple unit display
    const allConversions = useMemo(() => {
        const value = parseFloat(inputValue);
        if (isNaN(value)) return [];

        return units.map(unit => {
            const convertedValue = convert(value, fromUnit, unit.name, category);
            if (convertedValue !== null) {
                const formatted = Number(convertedValue.toPrecision(precision));
                return {
                    unit: unit.name,
                    symbol: unit.symbol,
                    value: formatted,
                    isStandard: unit.isStandard,
                };
            }
            return null;
        }).filter(Boolean) as Array<{ unit: string; symbol: string; value: number; isStandard?: boolean }>;
    }, [inputValue, fromUnit, category, units, precision]);

    const conversionInfo = useMemo(() => {
        if (!fromUnitDetails || !toUnitDetails) return '';
        const oneUnitConversion = convert(1, fromUnit, toUnit, category);
        if (oneUnitConversion !== null) {
            const formattedResult = Number(oneUnitConversion.toPrecision(precision));
            return `1 ${fromUnitDetails.symbol} = ${formattedResult} ${toUnitDetails.symbol}`;
        }
        return '';
    }, [fromUnit, toUnit, category, fromUnitDetails, toUnitDetails, precision]);

    const handleConversion = useCallback((valueStr?: string) => {
        const valueToConvert = valueStr || inputValue;
        const value = parseFloat(valueToConvert);
        if (isNaN(value)) {
            setResult('');
            return;
        }
        const convertedValue = convert(value, fromUnit, toUnit, category);
        if (convertedValue !== null) {
            const formattedResult = Number(convertedValue.toPrecision(precision));
            setResult(formattedResult.toString());
            return {
                fromValue: valueToConvert,
                fromUnit,
                toValue: formattedResult.toString(),
                toUnit,
                category,
            };
        } else {
            setResult('N/A');
        }
        return null;
    }, [inputValue, fromUnit, toUnit, category, precision]);

    // NEW: Bulk conversion handler
    const handleBulkConversion = useCallback(() => {
        const values = bulkInput.split(',').map(v => v.trim()).filter(v => v);
        const results = values.map(val => {
            const num = parseFloat(val);
            if (isNaN(num)) {
                return { input: val, output: 'Invalid' };
            }
            const converted = convert(num, fromUnit, toUnit, category);
            if (converted !== null) {
                const formatted = Number(converted.toPrecision(precision));
                return { input: val, output: formatted.toString() };
            }
            return { input: val, output: 'N/A' };
        });
        setBulkResults(results);
    }, [bulkInput, fromUnit, toUnit, category, precision]);

    // NEW: Export bulk results to CSV
    const exportBulkToCSV = useCallback(() => {
        if (bulkResults.length === 0) {
            toast({
                title: "No data to export",
                description: "Convert some values first!",
                variant: "destructive",
            });
            return;
        }

        let csv = `Input (${fromUnit}),Output (${toUnit})\n`;
        bulkResults.forEach(result => {
            csv += `${result.input},${result.output}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulk-conversion-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
            title: "Exported! 📊",
            description: "Bulk conversion data saved to CSV",
        });
    }, [bulkResults, fromUnit, toUnit, toast]);

    // NEW: Copy all conversions
    const copyAllConversions = useCallback(() => {
        const text = allConversions.map(c =>
            `${inputValue} ${fromUnitDetails?.symbol} = ${c.value} ${c.symbol}`
        ).join('\n');

        navigator.clipboard.writeText(text);
        toast({
            title: "Copied! 📋",
            description: "All conversions copied to clipboard",
        });
    }, [allConversions, inputValue, fromUnitDetails, toast]);

    useEffect(() => {
        if (!units.find(u => u.name === fromUnit)) {
            setFromUnit(units[0].name);
        }
        if (!units.find(u => u.name === toUnit)) {
            setToUnit(units[1]?.name || units[0].name);
        }
    }, [units, fromUnit, toUnit]);

    useEffect(() => {
        handleConversion();
    }, [inputValue, fromUnit, toUnit, category, precision, handleConversion]);

    useEffect(() => {
        if (bulkMode && bulkInput) {
            handleBulkConversion();
        }
    }, [bulkMode, bulkInput, fromUnit, toUnit, precision, handleBulkConversion]);

    const handleCategoryChange = (newCategory: string) => {
        const isPremiumCategory = premiumCategories.includes(newCategory);
        if (isPremiumCategory && !isPremium) {
            toast({ title: 'Premium Feature', description: 'Upgrade to unlock this category.' });
            return;
        }

        setCategory(newCategory);
        const newCategoryData = CATEGORIES.find((c) => c.name === newCategory);
        if (newCategoryData) {
            const newUnits = region === 'Local'
                ? newCategoryData.units.filter(u => !u.region || u.region === 'Indian')
                : newCategoryData.units.filter(u => !u.region);

            if (newUnits.length >= 2) {
                setFromUnit(newUnits[0].name);
                setToUnit(newUnits[1].name);
            } else if (newUnits.length === 1) {
                setFromUnit(newUnits[0].name);
                setToUnit(newUnits[0].name);
            }
        }
    };

    const handleSwap = () => {
        const currentFromResult = result;
        const currentFromUnit = fromUnit;
        const currentToUnit = toUnit;

        setFromUnit(currentToUnit);
        setToUnit(currentFromUnit);

        if (currentFromResult && currentFromResult !== 'N/A') {
            setInputValue(currentFromResult.replace(/,/g, ''));
        }
    };

    const handleAddToHistory = () => {
        const conversionResult = handleConversion();
        if (conversionResult) {
            addConversionToHistory({
                fromValue: conversionResult.fromValue,
                fromUnit: conversionResult.fromUnit,
                toValue: conversionResult.toValue,
                toUnit: conversionResult.toUnit,
                category: conversionResult.category,
            });
        }
    };

    const handleRestoreHistory = (itemToRestore: ConversionHistoryItem) => {
        setInputValue(itemToRestore.fromValue);
        setCategory(itemToRestore.category);
        setFromUnit(itemToRestore.fromUnit);
        setToUnit(itemToRestore.toUnit);
    };

    const handleFavoriteToggle = () => {
        const favoriteItem = favorites.find(fav => fav.category === category && fav.fromUnit === fromUnit && fav.toUnit === toUnit);

        if (favoriteItem) {
            deleteFavorite(favoriteItem.id);
            toast({ title: 'Removed from favorites.' });
        } else {
            addFavorite({
                fromValue: inputValue,
                fromUnit,
                toValue: result,
                toUnit,
                category
            });
            toast({ title: 'Added to favorites!' });
        }
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            toast({ title: 'Copied!', description: 'Result copied to clipboard.' });
        }
    };

    const UnitSelector = ({ value, onChange, label, availableUnits }: { value: string; onChange: (v: string) => void; label: string; availableUnits: Unit[] }) => {
        const unitDetails = availableUnits.find(u => u.name === value);
        return (
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full bg-black/20 border-white/10 text-white backdrop-blur-sm h-12 rounded-xl focus:ring-white/20">
                    <SelectValue>
                        {unitDetails ? `${unitDetails.name} (${unitDetails.symbol})` : label}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                    {availableUnits.map((unit) => (
                        <SelectItem key={unit.name} value={unit.name} className="focus:bg-white/10 focus:text-white">
                            {`${unit.name} (${unit.symbol})`}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    const conversionHistory = history
        .filter(item => item.type === 'conversion')
        .slice(0, 3) as ConversionHistoryItem[];

    return (
        <div className="space-y-6 w-full max-w-md mx-auto pb-20">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                <CardContent className="p-6 space-y-8">
                    {/* Top Controls */}
                    <div className="flex gap-3">
                        <div className="w-1/3">
                            <Select value={region} onValueChange={setRegion}>
                                <SelectTrigger className="w-full bg-black/20 border-white/10 text-white h-10 rounded-xl focus:ring-white/20">
                                    <SelectValue placeholder="Region" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                    <SelectItem value="International" className="focus:bg-white/10">International</SelectItem>
                                    <SelectItem value="Local" className="focus:bg-white/10">Local (Indian)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Select value={category} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full bg-black/20 border-white/10 text-white h-10 rounded-xl focus:ring-white/20">
                                    <div className="flex items-center gap-2 truncate">
                                        {React.createElement(activeCategory.icon, { className: 'h-4 w-4 shrink-0' })}
                                        <span className="truncate">{category}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10 text-white max-h-[300px]">
                                    {CATEGORIES.map((cat) => {
                                        const isPremiumCategory = premiumCategories.includes(cat.name);
                                        return (
                                            <SelectItem key={cat.name} value={cat.name} disabled={isPremiumCategory && !isPremium} className="focus:bg-white/10">
                                                <div className="flex items-center justify-between w-full gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <cat.icon className="h-4 w-4" />
                                                        <span>{cat.name}</span>
                                                    </div>
                                                    {isPremiumCategory && !isPremium && <Lock className="h-3 w-3 text-white/40" />}
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2">
                        <Button
                            variant={!bulkMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBulkMode(false)}
                            className={cn(
                                "flex-1 rounded-xl",
                                !bulkMode ? "bg-white text-black" : "bg-transparent border-white/20 text-white"
                            )}
                        >
                            <Calculator className="h-4 w-4 mr-2" />
                            Single
                        </Button>
                        <Button
                            variant={bulkMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBulkMode(true)}
                            className={cn(
                                "flex-1 rounded-xl",
                                bulkMode ? "bg-white text-black" : "bg-transparent border-white/20 text-white"
                            )}
                        >
                            <Table className="h-4 w-4 mr-2" />
                            Bulk
                        </Button>
                    </div>

                    {/* NEW: Precision Control */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-white/60 flex items-center gap-2">
                                <Settings2 className="h-3 w-3" />
                                Precision: {precision} decimals
                            </Label>
                        </div>
                        <Slider
                            value={[precision]}
                            onValueChange={(value) => setPrecision(value[0])}
                            min={1}
                            max={10}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {!bulkMode ? (
                        <>
                            {/* Main Converter Area */}
                            <div className="space-y-6 relative">
                                {/* From Section */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-medium text-white/50">From</label>
                                        {fromUnitDetails?.isStandard && (
                                            <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Info className="h-3 w-3" /> Standard
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <Input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className="flex-1 text-3xl font-bold h-14 px-4 border-white/10 bg-black/20 text-white placeholder:text-white/20 focus-visible:ring-white/20 rounded-xl"
                                            placeholder="0"
                                        />
                                        <div className="w-[40%]">
                                            <UnitSelector value={fromUnit} onChange={setFromUnit} label="Unit" availableUnits={units} />
                                        </div>
                                    </div>
                                </div>

                                {/* Swap Button */}
                                <div className="flex justify-center -my-3 relative z-10">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full bg-slate-900 border-white/20 text-white hover:bg-slate-800 hover:text-white h-10 w-10 shadow-lg shadow-black/50 transition-transform hover:scale-110 active:scale-95"
                                        onClick={handleSwap}
                                    >
                                        <ArrowRightLeft className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* To Section */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-medium text-white/50">To</label>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-full" onClick={handleCopy}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-full" onClick={handleFavoriteToggle}>
                                                <Star className={cn("h-4 w-4", isFavorited && "fill-current text-yellow-400 text-yellow-400")} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className="flex-1 h-14 px-4 flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 truncate">
                                                {result ? formatIndianNumber(parseFloat(result)) : '0'}
                                            </span>
                                        </div>
                                        <div className="w-[40%]">
                                            <UnitSelector value={toUnit} onChange={setToUnit} label="Unit" availableUnits={units} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conversion Info */}
                            {conversionInfo && (
                                <div className="text-center">
                                    <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs text-white/60 border border-white/5">
                                        {conversionInfo}
                                    </span>
                                </div>
                            )}

                            {/* NEW: Formula Display */}
                            {showFormula && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm font-semibold text-blue-400">Conversion Formula</span>
                                    </div>
                                    <p className="text-sm text-white/80 font-mono">{formula}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFormula(!showFormula)}
                                    className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-xl"
                                >
                                    <Info className='h-4 w-4 mr-1' />
                                    Formula
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAllConversions(!showAllConversions)}
                                    className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-xl"
                                >
                                    {showAllConversions ? <ChevronUp className='h-4 w-4 mr-1' /> : <ChevronDown className='h-4 w-4 mr-1' />}
                                    All
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleAddToHistory}
                                    className="bg-white text-black hover:bg-white/90 rounded-xl font-semibold shadow-lg shadow-white/10"
                                >
                                    <Power className='h-4 w-4 mr-1' />
                                    Save
                                </Button>
                            </div>

                            {/* NEW: Multiple Unit Display */}
                            {showAllConversions && (
                                <Collapsible open={showAllConversions}>
                                    <CollapsibleContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label className="text-xs text-white/60">All Conversions</Label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={copyAllConversions}
                                                    className="h-7 text-xs text-white/60 hover:text-white"
                                                >
                                                    <Copy className="h-3 w-3 mr-1" />
                                                    Copy All
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                                {allConversions.map((conversion, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={cn(
                                                            "p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors",
                                                            conversion.isStandard && "border-blue-500/30 bg-blue-500/5"
                                                        )}
                                                    >
                                                        <div className="text-xs text-white/50 mb-1">{conversion.unit}</div>
                                                        <div className="text-lg font-bold text-white truncate">
                                                            {formatIndianNumber(conversion.value)}
                                                        </div>
                                                        <div className="text-xs text-white/40">{conversion.symbol}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            )}
                        </>
                    ) : (
                        <>
                            {/* NEW: Bulk Conversion Mode */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm text-white/80">
                                        Enter comma-separated values to convert from {fromUnit} to {toUnit}
                                    </Label>
                                    <Textarea
                                        value={bulkInput}
                                        onChange={(e) => setBulkInput(e.target.value)}
                                        placeholder="Example: 1, 2.5, 10, 25, 100"
                                        className="min-h-[100px] bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20 rounded-xl"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <UnitSelector value={fromUnit} onChange={setFromUnit} label="From Unit" availableUnits={units} />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full bg-slate-900 border-white/20 text-white hover:bg-slate-800"
                                        onClick={handleSwap}
                                    >
                                        <ArrowRightLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex-1">
                                        <UnitSelector value={toUnit} onChange={setToUnit} label="To Unit" availableUnits={units} />
                                    </div>
                                </div>

                                {bulkResults.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm text-white/80">Results ({bulkResults.length})</Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={exportBulkToCSV}
                                                className="h-8 bg-transparent border-white/20 text-white hover:bg-white/10"
                                            >
                                                <Download className="h-3 w-3 mr-1" />
                                                Export CSV
                                            </Button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto space-y-2">
                                            {bulkResults.map((result, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                                                >
                                                    <span className="text-white/80">{result.input} {fromUnitDetails?.symbol}</span>
                                                    <ArrowRightLeft className="h-3 w-3 text-white/40" />
                                                    <span className="font-bold text-white">{result.output} {toUnitDetails?.symbol}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Recent Conversions */}
            {conversionHistory.length > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
                            <History className='h-4 w-4' />
                            Recent
                        </h3>
                        <Button asChild variant="link" className="text-white/60 hover:text-white text-xs h-auto p-0">
                            <Link href="/history">View All</Link>
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {conversionHistory.map((item) => (
                            <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                                <div className='flex items-center text-sm text-white/80'>
                                    <span>{`${item.fromValue} ${item.fromUnit.split(' ')[0]}`}</span>
                                    <ArrowRightLeft className="h-3 w-3 mx-2 text-white/40" />
                                    <span className="font-semibold text-white">{`${item.toValue} ${item.toUnit.split(' ')[0]}`}</span>
                                </div>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-full" onClick={() => handleRestoreHistory(item)}>
                                        <Undo2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <AdMobBanner className="mt-4 w-full" />

            {fromUnitDetails && (
                <ConversionComparisonDialog
                    open={isCompareDialogOpen}
                    onOpenChange={setIsCompareDialogOpen}
                    category={category}
                    fromUnit={fromUnit}
                    fromUnitDetails={fromUnitDetails}
                    inputValue={inputValue}
                />
            )}
        </div>
    );
}
