"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Calculator, History, DollarSign, StickyNote, CheckSquare, TrendingUp, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { parseUnitInput } from '@/lib/conversion-helpers';

interface SearchResult {
    type: 'conversion' | 'history' | 'budget' | 'note' | 'todo' | 'quick-convert';
    title: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
    category?: string;
}

export function GlobalSearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Parse conversion queries like "5 km to m" or "100 usd to inr"
    const parseConversionQuery = useCallback((q: string): SearchResult | null => {
        // Pattern: "number unit to unit" or "number from unit to unit"
        const conversionPattern = /(\d+\.?\d*)\s*([a-z]+)\s+(?:to|in)\s+([a-z]+)/i;
        const match = q.match(conversionPattern);

        if (match) {
            const [, value, fromUnit, toUnit] = match;
            return {
                type: 'quick-convert',
                title: `Convert ${value} ${fromUnit} to ${toUnit}`,
                description: 'Quick conversion',
                icon: <Calculator className="h-4 w-4 text-blue-400" />,
                action: () => {
                    // Navigate to converter with pre-filled values
                    const params = new URLSearchParams({
                        value,
                        from: fromUnit,
                        to: toUnit
                    });
                    router.push(`/converter?${params.toString()}`);
                    setIsOpen(false);
                    setQuery('');
                }
            };
        }

        // Try auto-detect for mixed units like "5 feet 10 inches"
        const parsed = parseUnitInput(q);
        if (parsed.length > 0) {
            const first = parsed[0];
            return {
                type: 'quick-convert',
                title: `Convert ${first.value} ${first.unit}`,
                description: 'Auto-detected unit',
                icon: <Calculator className="h-4 w-4 text-purple-400" />,
                action: () => {
                    const params = new URLSearchParams({
                        value: first.value.toString(),
                        from: first.unit,
                        category: first.category
                    });
                    router.push(`/converter?${params.toString()}`);
                    setIsOpen(false);
                    setQuery('');
                }
            };
        }

        return null;
    }, [router]);

    // Search across all data
    const performSearch = useCallback((q: string) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }

        const searchResults: SearchResult[] = [];
        const lowerQuery = q.toLowerCase();

        // 1. Check for conversion query first
        const conversionResult = parseConversionQuery(q);
        if (conversionResult) {
            searchResults.push(conversionResult);
        }

        // 2. Search history (mock data - replace with actual history)
        if (lowerQuery.includes('history') || lowerQuery.includes('convert')) {
            searchResults.push({
                type: 'history',
                title: 'Conversion History',
                description: 'View all your past conversions',
                icon: <History className="h-4 w-4 text-green-400" />,
                action: () => {
                    router.push('/history');
                    setIsOpen(false);
                    setQuery('');
                }
            });
        }

        // 3. Search budget
        if (lowerQuery.includes('budget') || lowerQuery.includes('expense') || lowerQuery.includes('money')) {
            searchResults.push({
                type: 'budget',
                title: 'Budget Tracker',
                description: 'Manage your expenses and budgets',
                icon: <DollarSign className="h-4 w-4 text-yellow-400" />,
                action: () => {
                    router.push('/budget');
                    setIsOpen(false);
                    setQuery('');
                }
            });
        }

        // 4. Search notes
        if (lowerQuery.includes('note') || lowerQuery.includes('memo')) {
            searchResults.push({
                type: 'note',
                title: 'Notes',
                description: 'View and create notes',
                icon: <StickyNote className="h-4 w-4 text-orange-400" />,
                action: () => {
                    router.push('/notes');
                    setIsOpen(false);
                    setQuery('');
                }
            });
        }

        // 5. Search todos
        if (lowerQuery.includes('todo') || lowerQuery.includes('task') || lowerQuery.includes('checklist')) {
            searchResults.push({
                type: 'todo',
                title: 'To-Do List',
                description: 'Manage your tasks',
                icon: <CheckSquare className="h-4 w-4 text-pink-400" />,
                action: () => {
                    router.push('/todos');
                    setIsOpen(false);
                    setQuery('');
                }
            });
        }

        // 6. Quick conversions suggestions
        if (lowerQuery.match(/\d+/) && !conversionResult) {
            searchResults.push({
                type: 'conversion',
                title: 'Unit Converter',
                description: 'Convert units, currencies, and more',
                icon: <Calculator className="h-4 w-4 text-blue-400" />,
                action: () => {
                    router.push('/converter');
                    setIsOpen(false);
                    setQuery('');
                }
            });
        }

        setResults(searchResults);
        setSelectedIndex(0);
    }, [parseConversionQuery, router]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K or Ctrl+K to open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }

            // Escape to close
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
                setResults([]);
            }

            // Arrow keys to navigate results
            if (isOpen && results.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % results.length);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    results[selectedIndex]?.action();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    // Update search results when query changes
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(query);
        }, 150); // Debounce

        return () => clearTimeout(timer);
    }, [query, performSearch]);

    return (
        <>
            {/* Search Button in Header - Icon Only */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                aria-label="Search (Cmd+K)"
            >
                <Search className="h-5 w-5" />
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            setIsOpen(false);
                            setQuery('');
                            setResults([]);
                        }}
                    />

                    {/* Search Panel */}
                    <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 p-4 border-b border-white/10">
                            <Search className="h-5 w-5 text-white/40" />
                            <Input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search conversions, history, budget, notes, todos... (try '5 km to m')"
                                className="flex-1 bg-transparent border-none text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={() => {
                                        setQuery('');
                                        setResults([]);
                                    }}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4 text-white/40" />
                                </button>
                            )}
                        </div>

                        {/* Search Results */}
                        {results.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto">
                                {results.map((result, idx) => (
                                    <button
                                        key={idx}
                                        onClick={result.action}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors border-b border-white/5 text-left",
                                            selectedIndex === idx && "bg-white/10"
                                        )}
                                    >
                                        <div className="flex-shrink-0">
                                            {result.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-white truncate">
                                                {result.title}
                                            </div>
                                            <div className="text-xs text-white/50 truncate">
                                                {result.description}
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-white/30 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="p-8 text-center text-white/40">
                                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No results found</p>
                                <p className="text-xs mt-1">Try searching for conversions, history, budget, notes, or todos</p>
                            </div>
                        ) : (
                            <div className="p-8">
                                <div className="text-xs text-white/40 mb-4">Quick Actions</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            router.push('/converter');
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                                    >
                                        <Calculator className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm text-white">Converter</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/history');
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                                    >
                                        <History className="h-4 w-4 text-green-400" />
                                        <span className="text-sm text-white">History</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/budget');
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                                    >
                                        <DollarSign className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm text-white">Budget</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/notes');
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                                    >
                                        <StickyNote className="h-4 w-4 text-orange-400" />
                                        <span className="text-sm text-white">Notes</span>
                                    </button>
                                </div>
                                <div className="mt-6 text-xs text-white/30 space-y-1">
                                    <p>💡 Try: "5 km to m" for quick conversion</p>
                                    <p>💡 Try: "100 usd to inr" for currency</p>
                                    <p>💡 Try: "5 feet 10 inches" for auto-detect</p>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-t border-white/10 text-xs text-white/40">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd> Navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> Select
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd> Close
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
