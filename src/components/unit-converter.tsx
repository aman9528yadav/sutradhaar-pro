

"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowRightLeft,
  Globe,
  Star,
  Copy,
  Share2,
  Info,
  Grid3x3,
  History,
  Power,
  Undo2,
  Trash2,
  Lock,
  ChevronDown,
  ChevronUp,
  Settings2,
  Sparkles,
  Zap,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, convert, getConversionFormula, Unit } from '@/lib/units';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  parseUnitInput,
  QUICK_CONVERSIONS,
  getRealWorldComparison,
  getSmartSuggestions,
  getVisualScale
} from '@/lib/conversion-helpers';
import { useToast } from '@/hooks/use-toast';
import { cn, formatIndianNumber } from '@/lib/utils';
import { AdMobBanner } from '@/components/admob-banner';
import { useProfile, ConversionHistoryItem, FavoriteItem } from '@/context/ProfileContext';
import Link from 'next/link';
import { ConversionComparisonDialog } from './conversion-comparison-dialog';
import { useSearchParams } from 'next/navigation';

const premiumCategories = ['Pressure', 'Currency'];

export function UnitConverter() {
  const { toast } = useToast();
  const { profile, addConversionToHistory, addFavorite, deleteFavorite, deleteHistoryItem } = useProfile();
  const { history, favorites, membership } = profile;
  const searchParams = useSearchParams();

  const [region, setRegion] = useState('International');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  useEffect(() => {
    const valParam = searchParams.get('value');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const catParam = searchParams.get('category');

    if (valParam) {
      setInputValue(valParam);
    }

    let targetCategory = catParam;
    let targetFromUnit = fromParam;
    let targetToUnit = toParam;

    // Helper to find unit across all categories
    const findUnit = (query: string, specificCategory?: string) => {
      const catsToCheck = specificCategory
        ? CATEGORIES.filter(c => c.name === specificCategory)
        : CATEGORIES;

      for (const cat of catsToCheck) {
        const unit = cat.units.find(u =>
          u.name.toLowerCase() === query.toLowerCase() ||
          u.symbol.toLowerCase() === query.toLowerCase()
        );
        if (unit) return { unit, category: cat.name };
      }
      return null;
    };

    if (fromParam) {
      const found = findUnit(fromParam, targetCategory || undefined);
      if (found) {
        if (!targetCategory) targetCategory = found.category;
        targetFromUnit = found.unit.name;
      }
    }

    if (toParam) {
      // If we already have a category, restrict search to it
      const found = findUnit(toParam, targetCategory || undefined);
      if (found) {
        if (!targetCategory) targetCategory = found.category;
        targetToUnit = found.unit.name;
      }
    }

    if (targetCategory && targetCategory !== category) {
      setCategory(targetCategory);
    }

    // We need to wait for category state to update before setting units if category changed?
    // Actually, we can just set them. The `units` memo depends on `activeCategory` which depends on `category`.
    // But `fromUnit` and `toUnit` are state.

    if (targetFromUnit) setFromUnit(targetFromUnit);
    if (targetToUnit) setToUnit(targetToUnit);

  }, [searchParams]); // Run when searchParams change

  // ... (rest of the code)
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(CATEGORIES[0].units[0].name);
  const [toUnit, setToUnit] = useState(CATEGORIES[0].units[1].name);
  const [result, setResult] = useState('');
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

  // NEW: Feature states
  const [precision, setPrecision] = useState(5);
  const [showFormula, setShowFormula] = useState(false);
  const [showAllConversions, setShowAllConversions] = useState(false);
  const [showQuickConversions, setShowQuickConversions] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [showVisualComparison, setShowVisualComparison] = useState(false);
  const [parsedInput, setParsedInput] = useState<string>('');

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

  const conversionInfo = useMemo(() => {
    if (!fromUnitDetails || !toUnitDetails) return '';
    const oneUnitConversion = convert(1, fromUnit, toUnit, category);
    if (oneUnitConversion !== null) {
      const formattedResult = Number(oneUnitConversion.toPrecision(precision));
      return `1 ${fromUnitDetails.symbol} = ${formattedResult} ${toUnitDetails.symbol}`;
    }
    return '';
  }, [fromUnit, toUnit, category, fromUnitDetails, toUnitDetails, precision]);

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

  // NEW: Real-world comparison
  const realWorldComp = useMemo(() => {
    const value = parseFloat(result);
    if (isNaN(value) || !toUnit) return null;
    return getRealWorldComparison(value, toUnit);
  }, [result, toUnit]);

  // NEW: Smart suggestions
  const smartSuggestions = useMemo(() => {
    return getSmartSuggestions(category);
  }, [category]);

  // NEW: Visual scale for comparison
  const visualScale = useMemo(() => {
    const inputVal = parseFloat(inputValue);
    const resultVal = parseFloat(result);
    if (isNaN(inputVal) || isNaN(resultVal)) return [];
    return getVisualScale(inputVal, fromUnit, toUnit, resultVal);
  }, [inputValue, result, fromUnit, toUnit]);

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

  // NEW: Handle auto-detect input
  const handleAutoDetect = useCallback(() => {
    const parsed = parseUnitInput(inputValue);
    if (parsed.length > 0) {
      const first = parsed[0];
      setCategory(first.category);
      setFromUnit(first.unit);
      setInputValue(first.value.toString());
      setParsedInput(`Detected: ${first.value} ${first.unit}`);
      toast({
        title: "Auto-detected! ✨",
        description: `Found ${first.value} ${first.unit}`,
      });
    } else {
      toast({
        title: "No units detected",
        description: "Try formats like '5 feet 10 inches' or '2kg 500g'",
        variant: "destructive",
      });
    }
  }, [inputValue, toast]);

  // NEW: Load quick conversion
  const loadQuickConversion = useCallback((quick: typeof QUICK_CONVERSIONS[0]) => {
    setCategory(quick.category);
    setFromUnit(quick.fromUnit);
    setToUnit(quick.toUnit);
    setInputValue(quick.value);
    setShowQuickConversions(false);
    toast({
      title: `Loaded: ${quick.label}`,
      description: quick.description,
    });
  }, [toast]);

  // NEW: Apply smart suggestion
  const applySuggestion = useCallback((suggestion: ReturnType<typeof getSmartSuggestions>[0]) => {
    setFromUnit(suggestion.fromUnit);
    setToUnit(suggestion.toUnit);
    toast({
      title: "Applied suggestion",
      description: suggestion.reason,
    });
  }, [toast]);

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
  }, [inputValue, fromUnit, toUnit, category, handleConversion]);


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

  const handleDeleteHistory = (idToDelete: string) => {
    deleteHistoryItem(idToDelete);
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
        <SelectTrigger className="w-full bg-muted border-border backdrop-blur-sm h-12 rounded-xl">
          <SelectValue>
            {unitDetails ? `${unitDetails.name} (${unitDetails.symbol})` : label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-background border-border max-h-[300px]">
          {availableUnits.map((unit) => (
            <SelectItem key={unit.name} value={unit.name} className="focus:bg-accent">
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
      <Card className="overflow-hidden border-2">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <CardContent className="p-6 space-y-8">
          {/* Top Controls: Region & Category */}
          <div className="flex gap-3">
            <div className="w-1/3">
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-full bg-muted border-border h-10 rounded-xl">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="International" className="focus:bg-accent">International</SelectItem>
                  <SelectItem value="Local" className="focus:bg-accent">Local (Indian)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full bg-muted border-border h-10 rounded-xl">
                  <div className="flex items-center gap-2 truncate">
                    {React.createElement(activeCategory.icon, { className: 'h-4 w-4 shrink-0' })}
                    <span className="truncate">{category}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background border-border max-h-[300px]">
                  {CATEGORIES.map((cat) => {
                    const isPremiumCategory = premiumCategories.includes(cat.name);
                    return (
                      <SelectItem key={cat.name} value={cat.name} disabled={isPremiumCategory && !isPremium} className="focus:bg-accent">
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex items-center gap-2">
                            <cat.icon className="h-4 w-4" />
                            <span>{cat.name}</span>
                          </div>
                          {isPremiumCategory && !isPremium && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* NEW: Precision Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground flex items-center gap-2">
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

          {/* NEW: Quick Actions Row */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickConversions(!showQuickConversions)}
              className="flex-1 bg-transparent border-border hover:bg-accent rounded-xl"
            >
              <Zap className="h-3 w-3 mr-1" />
              Quick
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSmartSuggestions(!showSmartSuggestions)}
              className="flex-1 bg-transparent border-border hover:bg-accent rounded-xl"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Suggest
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoDetect}
              className="flex-1 bg-transparent border-border hover:bg-accent rounded-xl"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Detect
            </Button>
          </div>

          {/* NEW: Quick Conversions Panel */}
          {showQuickConversions && (
            <div className="grid grid-cols-2 gap-2">
              {QUICK_CONVERSIONS.map((quick, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => loadQuickConversion(quick)}
                  className="bg-accent border-border hover:bg-accent/80 rounded-lg h-auto py-2 flex flex-col items-start"
                >
                  <div className="flex items-center gap-1 text-xs">
                    <span>{quick.icon}</span>
                    <span className="font-semibold">{quick.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{quick.description}</span>
                </Button>
              ))}
            </div>
          )}

          {/* NEW: Smart Suggestions Panel */}
          {showSmartSuggestions && smartSuggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Suggested for {category}</Label>
              <div className="space-y-1">
                {smartSuggestions.map((suggestion, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full bg-accent border-border hover:bg-accent/80 rounded-lg justify-start"
                  >
                    <span className="mr-2">{suggestion.icon}</span>
                    <span className="text-xs">{suggestion.fromUnit} → {suggestion.toUnit}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">{suggestion.reason}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {parsedInput && (
            <div className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              ✨ {parsedInput}
            </div>
          )}

          {/* Main Converter Area */}
          <div className="space-y-6 relative">
            {/* From Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-medium text-muted-foreground">From</label>
                {fromUnitDetails?.isStandard && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Info className="h-3 w-3" /> Standard
                  </span>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-3xl font-bold h-14 px-4 border-border bg-muted placeholder:text-muted-foreground rounded-xl"
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
                className="rounded-full bg-card border-border hover:bg-accent h-10 w-10 shadow-lg transition-transform hover:scale-110 active:scale-95"
                onClick={handleSwap}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* To Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full" onClick={handleFavoriteToggle}>
                    <Star className={cn("h-4 w-4", isFavorited && "fill-current text-yellow-400 text-yellow-400")} />
                  </Button>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex-1 h-14 px-4 flex items-center bg-muted border border-border rounded-xl overflow-hidden">
                  <span className="text-3xl font-bold text-foreground truncate">
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
              <span className="inline-block px-3 py-1 rounded-full bg-accent text-xs text-muted-foreground border border-border">
                {conversionInfo}
              </span>
            </div>
          )}

          {/* NEW: Real-World Comparison */}
          {realWorldComp && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{realWorldComp.icon}</span>
                <div className="flex-1">
                  <div className="text-xs text-purple-400 font-semibold">Real-World Comparison</div>
                  <div className="text-sm text-foreground">{realWorldComp.comparison}</div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Visual Comparison */}
          {visualScale.length > 0 && showVisualComparison && (
            <div className="bg-accent/50 border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-xs text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-3 w-3" />
                  Visual Comparison
                </Label>
              </div>
              <div className="space-y-3">
                {visualScale.map((scale, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground">{scale.label}</span>
                      <span className="text-muted-foreground">{scale.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${scale.percentage}%`,
                          backgroundColor: scale.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
          <div className="grid grid-cols-4 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFormula(!showFormula)}
              className="bg-transparent border-border text-foreground hover:bg-accent rounded-xl"
            >
              <Info className='h-4 w-4 mr-1' />
              Formula
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllConversions(!showAllConversions)}
              className="bg-transparent border-border text-foreground hover:bg-accent rounded-xl"
            >
              {showAllConversions ? <ChevronUp className='h-4 w-4 mr-1' /> : <ChevronDown className='h-4 w-4 mr-1' />}
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVisualComparison(!showVisualComparison)}
              className="bg-transparent border-border text-foreground hover:bg-accent rounded-xl"
            >
              <BarChart3 className='h-4 w-4 mr-1' />
              Chart
            </Button>
            <Button
              size="sm"
              onClick={handleAddToHistory}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold shadow-lg"
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
                    <Label className="text-xs text-muted-foreground">All Conversions</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyAllConversions}
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
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
                          "p-3 rounded-lg bg-accent border border-border hover:bg-accent/80 transition-colors",
                          conversion.isStandard && "border-blue-500/30 bg-blue-500/5"
                        )}
                      >
                        <div className="text-xs text-muted-foreground mb-1">{conversion.unit}</div>
                        <div className="text-lg font-bold text-foreground truncate">
                          {formatIndianNumber(conversion.value)}
                        </div>
                        <div className="text-xs text-muted-foreground/70">{conversion.symbol}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

        </CardContent>
      </Card>

      {/* Recent Conversions */}
      {conversionHistory.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <History className='h-4 w-4' />
              Recent
            </h3>
            <Button asChild variant="link" className="text-muted-foreground hover:text-foreground text-xs h-auto p-0">
              <Link href="/history">View All</Link>
            </Button>
          </div>
          <div className="space-y-2">
            {conversionHistory.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-accent border border-border flex justify-between items-center group hover:bg-accent/80 transition-colors">
                <div className='flex items-center text-sm text-foreground'>
                  <span>{`${item.fromValue} ${item.fromUnit.split(' ')[0]}`}</span>
                  <ArrowRightLeft className="h-3 w-3 mx-2 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{`${item.toValue} ${item.toUnit.split(' ')[0]}`}</span>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full" onClick={() => handleRestoreHistory(item)}>
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
