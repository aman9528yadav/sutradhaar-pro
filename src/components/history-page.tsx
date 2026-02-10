"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trash2, Filter, Search, History, Calculator,
  ArrowRightLeft, Star, Calendar, Clock, X,
  MoreVertical, Copy, Check
} from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { useProfile, HistoryItem, FavoriteItem, ConversionHistoryItem, CalculatorHistoryItem, DateCalculationHistoryItem } from '@/context/ProfileContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function HistoryPage() {
  const { profile, clearAllHistory, clearAllFavorites, deleteHistoryItem, deleteFavorite } = useProfile();
  const { history, favorites } = profile;
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter and Search Logic
  const filteredItems = useMemo(() => {
    let items: (HistoryItem | FavoriteItem)[] = [];

    // 1. Select Source
    if (activeTab === 'favorites') {
      items = favorites;
    } else {
      items = history;
      if (activeTab !== 'all') {
        items = items.filter(item => item.type === activeTab);
      }
    }

    // 2. Apply Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => {
        if (item.type === 'conversion') {
          const i = item as ConversionHistoryItem | FavoriteItem;
          return i.fromValue.toLowerCase().includes(query) ||
            i.toValue.toLowerCase().includes(query) ||
            i.fromUnit.toLowerCase().includes(query) ||
            i.toUnit.toLowerCase().includes(query) ||
            i.category.toLowerCase().includes(query);
        } else if (item.type === 'calculator') {
          const i = item as CalculatorHistoryItem;
          return i.expression.toLowerCase().includes(query) ||
            i.result.toLowerCase().includes(query);
        } else if (item.type === 'date_calculation') {
          const i = item as DateCalculationHistoryItem;
          return i.calculationType.toLowerCase().includes(query) ||
            JSON.stringify(i.details).toLowerCase().includes(query);
        }
        return false;
      });
    }

    // 3. Apply Category Filter (only for conversions/favorites)
    if (filterCategory !== 'all' && (activeTab === 'conversion' || activeTab === 'favorites')) {
      items = items.filter(item => (item as any).category === filterCategory);
    }

    // 4. Sort by Date (Newest First)
    // Favorites don't have a timestamp in the type definition shown previously, 
    // but usually they are added with one or we can use ID as proxy if needed.
    // Assuming history items have timestamp.
    return items.sort((a, b) => {
      const timeA = (a as any).timestamp ? new Date((a as any).timestamp).getTime() : 0;
      const timeB = (b as any).timestamp ? new Date((b as any).timestamp).getTime() : 0;
      return timeB - timeA;
    });
  }, [history, favorites, activeTab, searchQuery, filterCategory]);

  // Group by Date
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: typeof filteredItems } = {};

    filteredItems.forEach(item => {
      const date = (item as any).timestamp ? parseISO((item as any).timestamp) : new Date();
      let key = 'Older';

      if (isToday(date)) key = 'Today';
      else if (isYesterday(date)) key = 'Yesterday';
      else if (isThisWeek(date)) key = 'This Week';
      else if (isThisMonth(date)) key = 'This Month';

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    // Order keys
    const orderedKeys = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];
    return orderedKeys.filter(k => groups[k]).map(k => ({ title: k, items: groups[k] }));
  }, [filteredItems]);

  const handleClearAll = () => {
    if (activeTab === 'favorites') clearAllFavorites();
    else if (activeTab === 'all') clearAllHistory('all');
    else clearAllHistory(activeTab as any);

    toast({ title: "History Cleared", description: "All items have been removed." });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard" });
  };

  // Renderers
  const HistoryItemCard = ({ item }: { item: HistoryItem | FavoriteItem }) => {
    const isFav = activeTab === 'favorites';

    let Icon = History;
    let content = null;
    let title = '';
    let subtitle = '';

    if (item.type === 'conversion' || item.type === 'favorite') {
      const i = item as ConversionHistoryItem;
      Icon = ArrowRightLeft;
      title = `${i.fromValue} ${i.fromUnit} = ${i.toValue} ${i.toUnit}`;
      subtitle = i.category;
    } else if (item.type === 'calculator') {
      const i = item as CalculatorHistoryItem;
      Icon = Calculator;
      title = i.result;
      subtitle = i.expression;
    } else if (item.type === 'date_calculation') {
      const i = item as DateCalculationHistoryItem;
      Icon = Calendar;
      title = i.calculationType;
      subtitle = 'Date Calculation'; // Simplify for now
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group"
      >
        <Card className="bg-background/40 backdrop-blur-md border-border/50 hover:bg-background/60 transition-all">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={cn("p-3 rounded-xl bg-gradient-to-br opacity-80",
              item.type === 'conversion' ? "from-blue-500/20 to-cyan-500/20 text-blue-500" :
                item.type === 'calculator' ? "from-orange-500/20 to-red-500/20 text-orange-500" :
                  "from-purple-500/20 to-pink-500/20 text-purple-500"
            )}>
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-accent/50">{subtitle}</Badge>
                {(item as any).timestamp && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(parseISO((item as any).timestamp), 'h:mm a')}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(title)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => isFav ? deleteFavorite(item.id) : deleteHistoryItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            History & Favorites
          </h1>
          <p className="text-muted-foreground">Track your calculations and conversions</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full md:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear {activeTab === 'all' ? 'History' : activeTab}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all items in the current view. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Controls */}
      <Card className="bg-background/60 backdrop-blur-xl border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-4 bg-accent/50">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="conversion">Conv</TabsTrigger>
                <TabsTrigger value="calculator">Calc</TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:text-yellow-500">
                  <Star className="h-4 w-4 mr-1" /> Fav
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-6">
        {groupedItems.length > 0 ? (
          groupedItems.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground pl-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                {group.title}
              </h3>
              <div className="grid gap-3">
                {group.items.map((item) => (
                  <HistoryItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-accent/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium">No History Found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "Your recent calculations will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
