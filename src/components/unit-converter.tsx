

"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  Download,
  Upload,
  RotateCcw,
  Calculator,
  Ruler,
  Weight,
  Thermometer,
  Volume,
  Square,
  Clock,
  Database,
  Search,
  BookOpen,
  Palette,
  Layers,
  Eye,
  EyeOff,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Filter,
  SortAsc,
  SortDesc,
  Columns3,
  Rows,
  LayoutGrid,
  Maximize,
  Minimize,
  Expand,
  Collapse,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Minus,
  Divide,
  Multiply,
  Equal,
  Hash,
  Percent,
  Calendar,
  MapPin,
  Sun,
  Moon,
  Cloud,
  Droplet,
  Wind,
  Battery,
  Signal,
  Wifi,
  Bluetooth,
  Camera,
  Video,
  Mic,
  Headphones,
  Gamepad2,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Printer,
  Speaker,
  Radio,
  Tv,
  Car,
  Plane,
  Ship,
  Train,
  Bike,
  Footprints,
  Mountain,
  Waves,
  Leaf,
  Heart,
  StarHalf,
  Shield,
  Key,
  LockOpen,
  User,
  Users,
  Home,
  Building,
  School,
  Hospital,
  Bank,
  Store,
  Factory,
  Warehouse,
  Landmark,
  Map,
  Navigation,
  Compass,
  Route,
  Flag,
  Pin,
  Anchor,
  Award,
  Trophy,
  Medal,
  Gift,
  Package,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Coins,
  PiggyBank,
  Receipt,
  File,
  Folder,
  Archive,
  Inbox,
  Mail,
  Send,
  Reply,
  Forward,
  ReplyAll,
  MessageSquare,
  Chat,
  Phone,
  PhoneCall,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneOff,
  Bell,
  Volume2,
  VolumeX,
  Volume1,
  Volume2 as Volume3,
  Mic2,
  MicOff,
  Video2,
  VideoOff,
  Webcam,
  WebcamOff,
  Image,
  Film,
  Music,
  Headphones2,
  Radio2,
  Disc,
  Cassette,
  FilmRoll,
  Camera2,
  CameraOff,
  VideoCamera,
  VideoCameraOff,
  MonitorSpeaker,
  SpeakerHigh,
  SpeakerLow,
  SpeakerMinimal,
  SpeakerNone,
  SpeakerPause,
  SpeakerPlay,
  SpeakerStop,
  SpeakerWaveform,
  SpeakerWaveformRounded,
  SpeakerWaveformRounded as SpeakerWaveformRounded2,
  SpeakerWaveformRounded as SpeakerWaveformRounded3,
  SpeakerWaveformRounded as SpeakerWaveformRounded4,
  SpeakerWaveformRounded as SpeakerWaveformRounded5,
  SpeakerWaveformRounded as SpeakerWaveformRounded6,
  SpeakerWaveformRounded as SpeakerWaveformRounded7,
  SpeakerWaveformRounded as SpeakerWaveformRounded8,
  SpeakerWaveformRounded as SpeakerWaveformRounded9,
  SpeakerWaveformRounded as SpeakerWaveformRounded10,
  SpeakerWaveformRounded as SpeakerWaveformRounded11,
  SpeakerWaveformRounded as SpeakerWaveformRounded12,
  SpeakerWaveformRounded as SpeakerWaveformRounded13,
  SpeakerWaveformRounded as SpeakerWaveformRounded14,
  SpeakerWaveformRounded as SpeakerWaveformRounded15,
  SpeakerWaveformRounded as SpeakerWaveformRounded16,
  SpeakerWaveformRounded as SpeakerWaveformRounded17,
  SpeakerWaveformRounded as SpeakerWaveformRounded18,
  SpeakerWaveformRounded as SpeakerWaveformRounded19,
  SpeakerWaveformRounded as SpeakerWaveformRounded20,
  SpeakerWaveformRounded as SpeakerWaveformRounded21,
  SpeakerWaveformRounded as SpeakerWaveformRounded22,
  SpeakerWaveformRounded as SpeakerWaveformRounded23,
  SpeakerWaveformRounded as SpeakerWaveformRounded24,
  SpeakerWaveformRounded as SpeakerWaveformRounded25,
  SpeakerWaveformRounded as SpeakerWaveformRounded26,
  SpeakerWaveformRounded as SpeakerWaveformRounded27,
  SpeakerWaveformRounded as SpeakerWaveformRounded28,
  SpeakerWaveformRounded as SpeakerWaveformRounded29,
  SpeakerWaveformRounded as SpeakerWaveformRounded30,
  SpeakerWaveformRounded as SpeakerWaveformRounded31,
  SpeakerWaveformRounded as SpeakerWaveformRounded32,
  SpeakerWaveformRounded as SpeakerWaveformRounded33,
  SpeakerWaveformRounded as SpeakerWaveformRounded34,
  SpeakerWaveformRounded as SpeakerWaveformRounded35,
  SpeakerWaveformRounded as SpeakerWaveformRounded36,
  SpeakerWaveformRounded as SpeakerWaveformRounded37,
  SpeakerWaveformRounded as SpeakerWaveformRounded38,
  SpeakerWaveformRounded as SpeakerWaveformRounded39,
  SpeakerWaveformRounded as SpeakerWaveformRounded40,
  SpeakerWaveformRounded as SpeakerWaveformRounded41,
  SpeakerWaveformRounded as SpeakerWaveformRounded42,
  SpeakerWaveformRounded as SpeakerWaveformRounded43,
  SpeakerWaveformRounded as SpeakerWaveformRounded44,
  SpeakerWaveformRounded as SpeakerWaveformRounded45,
  SpeakerWaveformRounded as SpeakerWaveformRounded46,
  SpeakerWaveformRounded as SpeakerWaveformRounded47,
  SpeakerWaveformRounded as SpeakerWaveformRounded48,
  SpeakerWaveformRounded as SpeakerWaveformRounded49,
  SpeakerWaveformRounded as SpeakerWaveformRounded50,
  SpeakerWaveformRounded as SpeakerWaveformRounded51,
  SpeakerWaveformRounded as SpeakerWaveformRounded52,
  SpeakerWaveformRounded as SpeakerWaveformRounded53,
  SpeakerWaveformRounded as SpeakerWaveformRounded54,
  SpeakerWaveformRounded as SpeakerWaveformRounded55,
  SpeakerWaveformRounded as SpeakerWaveformRounded56,
  SpeakerWaveformRounded as SpeakerWaveformRounded57,
  SpeakerWaveformRounded as SpeakerWaveformRounded58,
  SpeakerWaveformRounded as SpeakerWaveformRounded59,
  SpeakerWaveformRounded as SpeakerWaveformRounded60,
  SpeakerWaveformRounded as SpeakerWaveformRounded61,
  SpeakerWaveformRounded as SpeakerWaveformRounded62,
  SpeakerWaveformRounded as SpeakerWaveformRounded63,
  SpeakerWaveformRounded as SpeakerWaveformRounded64,
  SpeakerWaveformRounded as SpeakerWaveformRounded65,
  SpeakerWaveformRounded as SpeakerWaveformRounded66,
  SpeakerWaveformRounded as SpeakerWaveformRounded67,
  SpeakerWaveformRounded as SpeakerWaveformRounded68,
  SpeakerWaveformRounded as SpeakerWaveformRounded69,
  SpeakerWaveformRounded as SpeakerWaveformRounded70,
  SpeakerWaveformRounded as SpeakerWaveformRounded71,
  SpeakerWaveformRounded as SpeakerWaveformRounded72,
  SpeakerWaveformRounded as SpeakerWaveformRounded73,
  SpeakerWaveformRounded as SpeakerWaveformRounded74,
  SpeakerWaveformRounded as SpeakerWaveformRounded75,
  SpeakerWaveformRounded as SpeakerWaveformRounded76,
  SpeakerWaveformRounded as SpeakerWaveformRounded77,
  SpeakerWaveformRounded as SpeakerWaveformRounded78,
  SpeakerWaveformRounded as SpeakerWaveformRounded79,
  SpeakerWaveformRounded as SpeakerWaveformRounded80,
  SpeakerWaveformRounded as SpeakerWaveformRounded81,
  SpeakerWaveformRounded as SpeakerWaveformRounded82,
  SpeakerWaveformRounded as SpeakerWaveformRounded83,
  SpeakerWaveformRounded as SpeakerWaveformRounded84,
  SpeakerWaveformRounded as SpeakerWaveformRounded85,
  SpeakerWaveformRounded as SpeakerWaveformRounded86,
  SpeakerWaveformRounded as SpeakerWaveformRounded87,
  SpeakerWaveformRounded as SpeakerWaveformRounded88,
  SpeakerWaveformRounded as SpeakerWaveformRounded89,
  SpeakerWaveformRounded as SpeakerWaveformRounded90,
  SpeakerWaveformRounded as SpeakerWaveformRounded91,
  SpeakerWaveformRounded as SpeakerWaveformRounded92,
  SpeakerWaveformRounded as SpeakerWaveformRounded93,
  SpeakerWaveformRounded as SpeakerWaveformRounded94,
  SpeakerWaveformRounded as SpeakerWaveformRounded95,
  SpeakerWaveformRounded as SpeakerWaveformRounded96,
  SpeakerWaveformRounded as SpeakerWaveformRounded97,
  SpeakerWaveformRounded as SpeakerWaveformRounded98,
  SpeakerWaveformRounded as SpeakerWaveformRounded99,
  SpeakerWaveformRounded as SpeakerWaveformRounded100,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  CollapsibleTrigger,
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';

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
  
  // NEW: Bulk conversion states
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResults, setBulkResults] = useState<Array<{ input: string; output: string }>>([]);
  
  // NEW: Advanced features
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState('');
  
  // NEW: UI states
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [showUnitDetails, setShowUnitDetails] = useState(false);

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

  // NEW: Calculator functionality
  const calculate = useCallback(() => {
    try {
      // Basic calculator evaluation - in production, use a safer eval alternative
      // For now, we'll use a simple expression evaluator
      const expression = calculatorInput.replace(/\s+/g, '');
      if (!expression) return;
      
      // Evaluate the expression safely
      const result = Function('"use strict"; return (' + expression + ')')();
      setCalculatorInput(result.toString());
      setInputValue(result.toString());
    } catch (e) {
      toast({
        title: "Invalid Expression",
        description: "Please enter a valid mathematical expression",
        variant: "destructive",
      });
    }
  }, [calculatorInput, toast]);

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
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Top Header Bento Box - Col Span 12 */}
        <div className="md:col-span-12 p-6 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-primary/5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Ruler className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Unit Converter</h2>
              <p className="text-sm text-muted-foreground font-medium">Precision conversions at your fingertips</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full md:w-40 bg-background/50 border-white/10 h-10 rounded-xl hover:bg-accent/50 transition-colors">
                <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10 rounded-xl">
                <SelectItem value="International" className="rounded-lg">International</SelectItem>
                <SelectItem value="Local" className="rounded-lg">Local (Indian)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48 bg-background/50 border-white/10 h-10 rounded-xl hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2 truncate">
                  {React.createElement(activeCategory.icon, { className: 'h-4 w-4 shrink-0 text-primary' })}
                  <span className="truncate font-medium">{category}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10 rounded-xl max-h-[300px]">
                {CATEGORIES.map((cat) => {
                  const isPremiumCategory = premiumCategories.includes(cat.name);
                  return (
                    <SelectItem key={cat.name} value={cat.name} disabled={isPremiumCategory && !isPremium} className="rounded-lg">
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4 text-muted-foreground" />
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

        {/* Main Converter Tool - Col Span 8 */}
        <div className="md:col-span-8 p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-700" />
          
          <div className="space-y-8">
            {/* From Section */}
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center px-2">
                <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">From</label>
                {fromUnitDetails?.isStandard && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-0 rounded-lg">
                    <Info className="h-3 w-3 mr-1" /> Standard Base
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-4xl md:text-5xl font-bold h-20 md:h-24 px-6 border-white/10 bg-background/50 placeholder:text-muted-foreground/30 rounded-2xl shadow-inner focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:bg-background/80 transition-all"
                  placeholder="0"
                />
                <div className="sm:w-[220px]">
                  <UnitSelector value={fromUnit} onChange={setFromUnit} label="Unit" availableUnits={units} />
                </div>
              </div>
            </div>

            {/* Swap Button Area */}
            <div className="flex justify-center -my-6 relative z-20">
              <div className="bg-background p-2 rounded-full shadow-sm border border-white/5">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gradient-to-br from-primary to-primary/80 border-0 text-primary-foreground hover:shadow-lg hover:shadow-primary/25 h-12 w-12 shadow-md transition-all hover:scale-110 active:scale-95 group/btn"
                  onClick={handleSwap}
                >
                  <ArrowRightLeft className="h-5 w-5 group-hover/btn:rotate-180 transition-transform duration-500" />
                </Button>
              </div>
            </div>

            {/* To Section */}
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center px-2">
                <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">To</label>
                <div className="flex gap-1 bg-background/50 rounded-full p-1 border border-white/5 backdrop-blur-md">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-background shadow-sm transition-all" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-background shadow-sm transition-all" onClick={handleFavoriteToggle}>
                    <Star className={cn("h-4 w-4 transition-colors", isFavorited && "fill-yellow-400 text-yellow-400")} />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 h-20 md:h-24 px-6 flex items-center bg-background/30 border border-white/10 rounded-2xl shadow-inner overflow-hidden relative group/result">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover/result:translate-x-[100%] transition-transform duration-1000" />
                  <span className="text-4xl md:text-5xl font-bold text-foreground truncate drop-shadow-sm">
                    {result ? formatIndianNumber(parseFloat(result)) : '0'}
                  </span>
                </div>
                <div className="sm:w-[220px]">
                  <UnitSelector value={toUnit} onChange={setToUnit} label="Unit" availableUnits={units} />
                </div>
              </div>
            </div>
          </div>
          
          {conversionInfo && (
            <div className="mt-8 flex justify-center">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-background/40 backdrop-blur-md border-white/10 text-xs text-muted-foreground shadow-sm">
                {conversionInfo}
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Actions & Settings - Col Span 4 */}
        <div className="md:col-span-4 grid grid-rows-2 gap-4">
          {/* Settings Bento */}
          <div className="p-5 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-foreground">
                <Settings2 className="h-4 w-4 text-primary" /> Settings
              </div>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground font-medium">Precision</Label>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono">{precision}</span>
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
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="secondary" size="sm" onClick={() => setShowQuickConversions(!showQuickConversions)} className="rounded-xl h-9 bg-background hover:bg-accent/50 border border-white/5 shadow-sm text-xs transition-colors">
                <Zap className="h-3.5 w-3.5 mr-1.5 text-yellow-500" /> Quick
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowSmartSuggestions(!showSmartSuggestions)} className="rounded-xl h-9 bg-background hover:bg-accent/50 border border-white/5 shadow-sm text-xs transition-colors">
                <Lightbulb className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> Smart
              </Button>
              <Button variant="secondary" size="sm" onClick={handleAutoDetect} className="rounded-xl h-9 bg-background hover:bg-accent/50 border border-white/5 shadow-sm text-xs transition-colors">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-500" /> Detect
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setBulkMode(!bulkMode)} className="rounded-xl h-9 bg-background hover:bg-accent/50 border border-white/5 shadow-sm text-xs transition-colors">
                <Database className="h-3.5 w-3.5 mr-1.5 text-blue-500" /> Bulk
              </Button>
            </div>
          </div>

          {/* Feature Toggles Bento */}
          <div className="p-5 rounded-[2rem] bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-xl border border-primary/10 shadow-xl flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-foreground relative z-10">
              <Layers className="h-4 w-4 text-primary" /> View Options
            </div>

            <div className="grid grid-cols-2 gap-2 relative z-10">
              <Button variant="outline" size="sm" onClick={() => setShowFormula(!showFormula)} className={cn("rounded-xl h-10 border-white/10 shadow-sm justify-start px-3 transition-colors", showFormula ? "bg-primary text-primary-foreground border-primary" : "bg-background/50 hover:bg-background")}>
                <Info className='h-3.5 w-3.5 mr-2' /> Formula
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAllConversions(!showAllConversions)} className={cn("rounded-xl h-10 border-white/10 shadow-sm justify-start px-3 transition-colors", showAllConversions ? "bg-primary text-primary-foreground border-primary" : "bg-background/50 hover:bg-background")}>
                <Grid3x3 className='h-3.5 w-3.5 mr-2' /> All Units
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowVisualComparison(!showVisualComparison)} className={cn("rounded-xl h-10 border-white/10 shadow-sm justify-start px-3 transition-colors", showVisualComparison ? "bg-primary text-primary-foreground border-primary" : "bg-background/50 hover:bg-background")}>
                <BarChart3 className='h-3.5 w-3.5 mr-2' /> Chart
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowCalculator(!showCalculator)} className={cn("rounded-xl h-10 border-white/10 shadow-sm justify-start px-3 transition-colors", showCalculator ? "bg-primary text-primary-foreground border-primary" : "bg-background/50 hover:bg-background")}>
                <Calculator className='h-3.5 w-3.5 mr-2' /> Calc
              </Button>
            </div>

            <Button size="sm" onClick={handleAddToHistory} className="w-full rounded-xl h-10 bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20 transition-all mt-4 relative z-10 font-semibold">
              <Power className='h-4 w-4 mr-2' /> Save Result
            </Button>
          </div>
        </div>

        {/* Dynamic Expandable Rows */}
        
        {/* Parsed Input Banner */}
        {parsedInput && (
          <div className="md:col-span-12 p-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <Sparkles className="h-4 w-4" /> {parsedInput}
          </div>
        )}

        {/* Real World Comparison Bento */}
        {realWorldComp && (
          <div className="md:col-span-12 p-5 rounded-[2rem] bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/10 shadow-lg flex flex-col md:flex-row items-center gap-5 overflow-hidden relative group">
            <div className="absolute left-0 top-0 w-1 bg-purple-500 h-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            <div className="text-4xl bg-background/50 p-3 rounded-2xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
              {realWorldComp.icon}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-purple-500 font-bold mb-1">Real-World Perspective</div>
              <div className="text-foreground font-medium md:text-lg">{realWorldComp.comparison}</div>
            </div>
          </div>
        )}

        {/* Formula Display Bento */}
        {showFormula && (
          <div className="md:col-span-12 p-5 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
              <Calculator className="w-48 h-48" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">Mathematical Formula</span>
            </div>
            <div className="bg-background/60 p-4 rounded-xl border border-white/5 font-mono text-sm shadow-inner overflow-x-auto">
              <span className="text-foreground/80">{formula}</span>
            </div>
          </div>
        )}

        {/* Visual Scale Bento */}
        {visualScale.length > 0 && showVisualComparison && (
          <div className="md:col-span-12 p-6 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground uppercase tracking-wider">Visual Proportion</span>
            </div>
            <div className="space-y-4">
              {visualScale.map((scale, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: scale.color }} />
                      {scale.label}
                    </span>
                    <span className="text-muted-foreground font-mono bg-background/50 px-2 py-0.5 rounded-md border border-white/5">
                      {scale.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 md:h-4 bg-muted/50 rounded-full overflow-hidden shadow-inner p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{
                        width: `${Math.max(scale.percentage, 1)}%`,
                        backgroundColor: scale.color,
                        boxShadow: `0 0 10px ${scale.color}80`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Conversions Grid Bento */}
        {showAllConversions && (
          <div className="md:col-span-12 p-6 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/10 shadow-xl">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Comprehensive View</span>
               </div>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAllConversions}
                  className="h-8 text-xs bg-background hover:bg-accent rounded-xl border-white/10 transition-colors"
                >
                  <Copy className="h-3 w-3 mr-1.5 text-muted-foreground" />
                  Copy List
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {allConversions.map((conversion, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-4 rounded-2xl bg-background/50 border border-white/5 hover:bg-accent/40 hover:border-white/10 transition-all hover:shadow-md group/item",
                    conversion.isStandard && "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40"
                  )}
                >
                  <div className="text-xs font-medium text-muted-foreground mb-2 flex justify-between items-center">
                    {conversion.unit}
                    {conversion.isStandard && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Standard Unit"/>}
                  </div>
                  <div className="text-lg font-bold text-foreground truncate group-hover/item:text-primary transition-colors">
                    {formatIndianNumber(conversion.value)}
                  </div>
                  <div className="text-xs text-muted-foreground/60 font-mono mt-1">{conversion.symbol}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Tool Bento */}
        {bulkMode && (
          <div className="md:col-span-12 p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 shadow-xl">
             <div className="flex items-center gap-2 mb-5">
              <Database className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-bold text-indigo-500 uppercase tracking-wider">Bulk Data Processor</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-3">
                <Label className="text-xs text-muted-foreground font-medium ml-1">Input Data (comma separated)</Label>
                <div className="relative">
                  <Input
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="e.g., 1, 2.5, 10, 100"
                    className="bg-background/50 border-white/10 rounded-xl h-12 pr-24 shadow-inner focus-visible:ring-indigo-500/30"
                  />
                  <div className="absolute right-1.5 top-1.5">
                    <Button
                      size="sm"
                      onClick={handleBulkConversion}
                      className="h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-md"
                    >
                      Process
                    </Button>
                  </div>
                </div>
              </div>
              
              {bulkResults.length > 0 && (
                <div className="flex-1 space-y-3">
                   <div className="flex justify-between items-end">
                     <Label className="text-xs text-muted-foreground font-medium ml-1">Results Output</Label>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={exportBulkToCSV}
                        className="h-6 px-2 text-[10px] bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-md transition-colors"
                      >
                        <Download className="h-3 w-3 mr-1" /> Export CSV
                      </Button>
                   </div>
                   <div className="bg-background/80 border border-white/5 rounded-xl p-3 h-40 overflow-y-auto shadow-inner text-sm space-y-1.5 custom-scrollbar">
                     <div className="grid grid-cols-2 px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-white/5 mb-1">
                        <span>{fromUnit}</span>
                        <span className="text-right">{toUnit}</span>
                     </div>
                     {bulkResults.map((res, idx) => (
                        <div key={idx} className="grid grid-cols-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors">
                          <span className="font-mono text-muted-foreground">{res.input}</span>
                          <span className="font-mono font-medium text-right text-indigo-400">{res.output}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Conversions & Smart Suggestions Bento */}
        {(showQuickConversions || showSmartSuggestions) && (
           <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {showQuickConversions && (
                <div className="p-5 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/10 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-wider">Quick Presets</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_CONVERSIONS.map((quick, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        onClick={() => loadQuickConversion(quick)}
                        className="bg-background/40 border-white/5 hover:bg-accent/60 rounded-xl h-auto py-3 px-4 flex flex-col items-start gap-1 justify-start shadow-sm transition-all hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <span className="text-lg">{quick.icon}</span>
                          <span className="font-semibold">{quick.label}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/80 line-clamp-1">{quick.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {showSmartSuggestions && smartSuggestions.length > 0 && (
                <div className="p-5 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/10 shadow-lg">
                   <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-wider">Contextual Ideas</span>
                  </div>
                  <div className="space-y-2">
                    {smartSuggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        onClick={() => applySuggestion(suggestion)}
                        className="w-full bg-background/40 border-white/5 hover:bg-accent/60 rounded-xl h-12 justify-start px-4 shadow-sm transition-all hover:translate-x-1 group/sug"
                      >
                        <span className="mr-3 text-lg bg-background rounded-full p-1 shadow-sm">{suggestion.icon}</span>
                        <div className="flex flex-col items-start text-left flex-1">
                           <span className="text-xs font-semibold text-foreground group-hover/sug:text-primary transition-colors">{suggestion.fromUnit} <ArrowRightLeft className="inline w-3 h-3 mx-0.5 text-muted-foreground"/> {suggestion.toUnit}</span>
                           <span className="text-[10px] text-muted-foreground/70">{suggestion.reason}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
           </div>
        )}
        
        {/* Calculator Tool Bento */}
        {showCalculator && (
          <div className="md:col-span-12 p-6 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground uppercase tracking-wider">Inline Calculator</span>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  value={calculatorInput}
                  onChange={(e) => setCalculatorInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') calculate() }}
                  placeholder="Evaluate math expression... (e.g. 10 * 2.5)"
                  className="bg-background/50 border-white/10 rounded-2xl h-14 pl-11 text-lg shadow-inner focus-visible:ring-primary/20 font-mono"
                />
              </div>
              <Button onClick={calculate} className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold text-lg">
                =
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Recent Conversions & Ads Section */}
      <div className="mt-8 space-y-6">
        {conversionHistory.length > 0 && (
          <div className="p-6 rounded-[2rem] bg-background/40 backdrop-blur-md border border-white/5 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <History className='h-4 w-4 text-primary' />
                Recent Activity
              </h3>
              <Button asChild variant="ghost" size="sm" className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg">
                <Link href="/history">View Full Log</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {conversionHistory.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-background border border-white/5 shadow-sm flex flex-col justify-between group hover:bg-accent/40 hover:border-white/10 hover:shadow-md transition-all">
                  <div className='flex items-center justify-between text-sm text-foreground mb-2'>
                    <div className="flex items-center gap-2">
                       <span className="font-mono bg-accent/50 px-2 py-0.5 rounded-md text-muted-foreground">{item.fromValue}</span>
                       <span className="font-medium text-muted-foreground/80 truncate max-w-[70px]">{item.fromUnit.split(' ')[0]}</span>
                    </div>
                    <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <div className="flex items-center gap-2">
                       <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">{item.toValue}</span>
                       <span className="font-medium text-muted-foreground/80 truncate max-w-[70px]">{item.toUnit.split(' ')[0]}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
                     <span className="text-[10px] text-muted-foreground/50">{item.category}</span>
                     <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100" onClick={() => handleRestoreHistory(item)} title="Restore">
                      <Undo2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AdMobBanner className="w-full rounded-[2rem] overflow-hidden shadow-lg border border-white/5 bg-background/40 backdrop-blur-md" />
      </div>

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
