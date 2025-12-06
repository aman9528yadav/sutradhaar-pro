"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Calculator, History, DollarSign, StickyNote, CheckSquare, TrendingUp, X, ArrowRight, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { parseUnitInput } from '@/lib/conversion-helpers';
import { useProfile } from '@/context/ProfileContext';
import { CATEGORIES } from '@/lib/units';

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
    const { profile } = useProfile();

    // Parse conversion queries like "5 km to m" or "100 usd to inr"
    const parseConversionQuery = useCallback((q: string): SearchResult[] => {
        const results: SearchResult[] = [];

        // 1. Smart conversion with context: "number unit to [target]"
        // Matches: "12 km to", "12 km to m", "12 km to meters"
        const contextPattern = /^(\d+\.?\d*)\s*([a-zA-Z]+)\s+(?:to|in)\s*([a-zA-Z]*)$/i;
        const contextMatch = q.match(contextPattern);

        if (contextMatch) {
            const [, value, fromUnitStr, toUnitStr] = contextMatch;
            const lowerFrom = fromUnitStr.toLowerCase();
            const lowerTo = toUnitStr ? toUnitStr.toLowerCase() : '';

            // Find the source unit and its category
            let sourceCategory = null;
            let sourceUnit = null;

            for (const cat of CATEGORIES) {
                const unit = cat.units.find(u =>
                    u.name.toLowerCase() === lowerFrom ||
                    u.symbol.toLowerCase() === lowerFrom ||
                    u.name.toLowerCase().startsWith(lowerFrom)
                );
                if (unit) {
                    sourceCategory = cat;
                    sourceUnit = unit;
                    break;
                }
            }

            // If we found a valid source unit/category
            if (sourceCategory && sourceUnit) {
                let matchesFound = 0;
                const maxMatches = 5;

                for (const targetUnit of sourceCategory.units) {
                    if (matchesFound >= maxMatches) break;

                    // Check if target matches the partial input (or show all if empty)
                    if (!lowerTo ||
                        targetUnit.name.toLowerCase().startsWith(lowerTo) ||
                        targetUnit.symbol.toLowerCase().startsWith(lowerTo)) {

                        results.push({
                            type: 'quick-convert',
                            title: `Convert ${value} ${sourceUnit.symbol} to ${targetUnit.name}`,
                            description: `in ${sourceCategory.name}`,
                            icon: <Calculator className="h-4 w-4 text-blue-400" />,
                            action: () => {
                                const params = new URLSearchParams({
                                    value,
                                    from: sourceUnit!.name,
                                    to: targetUnit.name,
                                    category: sourceCategory!.name
                                });
                                router.push(`/converter?${params.toString()}`);
                                setIsOpen(false);
                                setQuery('');
                            }
                        });
                        matchesFound++;
                    }
                }
                return results; // Return early if we matched this pattern
            }
        }

        // 2. Auto-detect mixed units: "5 feet 10 inches"
        const parsed = parseUnitInput(q);
        if (parsed.length > 0) {
            const first = parsed[0];
            results.push({
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
            });
            return results;
        }

        // 3. Partial unit match: "77 k" -> Suggest "77 Kilometers", "77 Kilograms", etc.
        const partialPattern = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/;
        const partialMatch = q.match(partialPattern);

        if (partialMatch) {
            const [, value, partialUnit] = partialMatch;
            const lowerPartial = partialUnit.toLowerCase();

            let matchesFound = 0;
            const maxMatches = 5;

            for (const category of CATEGORIES) {
                for (const unit of category.units) {
                    if (matchesFound >= maxMatches) break;

                    if (unit.name.toLowerCase().startsWith(lowerPartial) ||
                        unit.symbol.toLowerCase().startsWith(lowerPartial)) {

                        results.push({
                            type: 'quick-convert',
                            title: `Convert ${value} ${unit.name}`,
                            description: `in ${category.name}`,
                            icon: <Calculator className="h-4 w-4 text-indigo-400" />,
                            action: () => {
                                const params = new URLSearchParams({
                                    value,
                                    from: unit.name,
                                    category: category.name
                                });
                                router.push(`/converter?${params.toString()}`);
                                setIsOpen(false);
                                setQuery('');
                            }
                        });
                        matchesFound++;
                    }
                }
                if (matchesFound >= maxMatches) break;
            }
        }

        return results;
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
        const conversionResults = parseConversionQuery(q);
        if (conversionResults.length > 0) {
            searchResults.push(...conversionResults);
        }

        // 2. Search History
        if (profile.history) {
            const historyMatches = profile.history.filter(item => {
                if (item.type === 'conversion') {
                    return item.fromValue.toLowerCase().includes(lowerQuery) ||
                        item.toValue.toLowerCase().includes(lowerQuery) ||
                        item.fromUnit.toLowerCase().includes(lowerQuery) ||
                        item.toUnit.toLowerCase().includes(lowerQuery);
                } else if (item.type === 'calculator') {
                    return item.expression.includes(lowerQuery) || item.result.includes(lowerQuery);
                }
                return false;
            }).slice(0, 3); // Limit to 3 history items

            historyMatches.forEach(item => {
                searchResults.push({
                    type: 'history',
                    title: item.type === 'conversion'
                        ? `${item.fromValue} ${item.fromUnit} → ${item.toValue} ${item.toUnit}`
                        : item.type === 'calculator'
                            ? `${item.expression} = ${item.result}`
                            : 'Date Calculation',
                    description: 'History',
                    icon: <History className="h-4 w-4 text-green-400" />,
                    action: () => {
                        router.push('/history');
                        setTimeout(() => {
                            setIsOpen(false);
                            setQuery('');
                        }, 100);
                    }
                });
            });
        }

        // 3. Search Notes
        if (profile.notes) {
            const noteMatches = profile.notes.filter(note =>
                note.title.toLowerCase().includes(lowerQuery) ||
                note.content.toLowerCase().includes(lowerQuery)
            ).slice(0, 3);

            noteMatches.forEach(note => {
                searchResults.push({
                    type: 'note',
                    title: note.title,
                    description: note.content.substring(0, 50) + '...',
                    icon: <StickyNote className="h-4 w-4 text-orange-400" />,
                    action: () => {
                        router.push(`/notes?id=${note.id}`);
                        setTimeout(() => {
                            setIsOpen(false);
                            setQuery('');
                        }, 100);
                    }
                });
            });
        }

        // 4. Search Todos
        if (profile.todos) {
            const todoMatches = profile.todos.filter(todo =>
                todo.text.toLowerCase().includes(lowerQuery)
            ).slice(0, 3);

            todoMatches.forEach(todo => {
                searchResults.push({
                    type: 'todo',
                    title: todo.text,
                    description: todo.completed ? 'Completed' : 'Pending',
                    icon: <CheckSquare className="h-4 w-4 text-pink-400" />,
                    action: () => {
                        router.push('/todo');
                        setTimeout(() => {
                            setIsOpen(false);
                            setQuery('');
                        }, 100);
                    }
                });
            });
        }

        // 5. Search Budget
        if (profile.budget?.transactions) {
            const budgetMatches = profile.budget.transactions.filter(t =>
                t.description.toLowerCase().includes(lowerQuery) ||
                t.amount.toString().includes(lowerQuery)
            ).slice(0, 3);

            budgetMatches.forEach(t => {
                searchResults.push({
                    type: 'budget',
                    title: t.description,
                    description: `${t.type === 'income' ? '+' : '-'}${t.amount}`,
                    icon: <DollarSign className="h-4 w-4 text-yellow-400" />,
                    action: () => {
                        router.push('/analytics?tab=transactions');
                        setTimeout(() => {
                            setIsOpen(false);
                            setQuery('');
                        }, 100);
                    }
                });
            });
        }

        // 6. Generic Page Navigation (Fallback)
        if (lowerQuery.includes('history')) {
            searchResults.push({
                type: 'history',
                title: 'Go to History',
                description: 'View all past activities',
                icon: <History className="h-4 w-4 text-green-400" />,
                action: () => {
                    router.push('/history');
                    setTimeout(() => {
                        setIsOpen(false);
                        setQuery('');
                    }, 100);
                }
            });
        }
        if (lowerQuery.includes('note')) {
            searchResults.push({
                type: 'note',
                title: 'Go to Notes',
                description: 'View all notes',
                icon: <StickyNote className="h-4 w-4 text-orange-400" />,
                action: () => {
                    router.push('/notes');
                    setTimeout(() => {
                        setIsOpen(false);
                        setQuery('');
                    }, 100);
                }
            });
        }
        if (lowerQuery.includes('todo')) {
            searchResults.push({
                type: 'todo',
                title: 'Go to Todos',
                description: 'View all tasks',
                icon: <CheckSquare className="h-4 w-4 text-pink-400" />,
                action: () => {
                    router.push('/todo');
                    setTimeout(() => {
                        setIsOpen(false);
                        setQuery('');
                    }, 100);
                }
            });
        }
        if (lowerQuery.includes('budget') || lowerQuery.includes('money')) {
            searchResults.push({
                type: 'budget',
                title: 'Go to Budget Tracker',
                description: 'Manage finances',
                icon: <DollarSign className="h-4 w-4 text-yellow-400" />,
                action: () => {
                    router.push('/analytics?tab=overview');
                    setTimeout(() => {
                        setIsOpen(false);
                        setQuery('');
                    }, 100);
                }
            });
        }
        if (lowerQuery.includes('analytics') || lowerQuery.includes('stats')) {
            searchResults.push({
                type: 'budget',
                title: 'Go to Analytics',
                description: 'View detailed statistics',
                icon: <TrendingUp className="h-4 w-4 text-blue-400" />,
                action: () => {
                    router.push('/analytics?tab=analytics');
                    setTimeout(() => {
                        setIsOpen(false);
                        setQuery('');
                    }, 100);
                }
            });
        }


        setResults(searchResults);
        setSelectedIndex(0);
    }, [parseConversionQuery, router, profile]);

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
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
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
                    <div className="relative w-full max-w-2xl bg-background border-border rounded-2xl shadow-2xl border overflow-hidden">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 p-4 border-b border-border">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <Input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search everything..."
                                className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={() => {
                                        setQuery('');
                                        setResults([]);
                                    }}
                                    className="p-1 hover:bg-accent rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
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
                                            "w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors border-b border-border text-left",
                                            selectedIndex === idx && "bg-accent"
                                        )}
                                    >
                                        <div className="flex-shrink-0">
                                            {result.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-foreground truncate">
                                                {result.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {result.description}
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No results found</p>
                                <p className="text-xs mt-1">Try searching for conversions, history, budget, notes, or todos</p>
                            </div>
                        ) : (
                            <div className="p-8">
                                <div className="text-xs text-muted-foreground mb-4">Quick Actions</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            router.push('/converter');
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-left"
                                    >
                                        <Calculator className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm text-foreground">Converter</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/history');
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-left"
                                    >
                                        <History className="h-4 w-4 text-green-400" />
                                        <span className="text-sm text-foreground">History</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/budget');
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-left"
                                    >
                                        <DollarSign className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm text-foreground">Budget</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/notes');
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-left"
                                    >
                                        <StickyNote className="h-4 w-4 text-orange-400" />
                                        <span className="text-sm text-foreground">Notes</span>
                                    </button>
                                </div>
                                <div className="mt-6 text-xs text-muted-foreground/70 space-y-1">
                                    <p>💡 Try: "5 km to m" for quick conversion</p>
                                    <p>💡 Try: "100 usd to inr" for currency</p>
                                    <p>💡 Try: "5 feet 10 inches" for auto-detect</p>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-2 bg-accent/50 border-t border-border text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-accent rounded">↑↓</kbd> Navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-accent rounded">↵</kbd> Select
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-accent rounded">esc</kbd> Close
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
