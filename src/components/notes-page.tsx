"use client";

import React, { useState, useMemo } from 'react';
import { useProfile, NoteItem } from '@/context/ProfileContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Star,
    Pin,
    Archive,
    Trash2,
    Menu,
    Grid,
    List,
    Tag,
    StickyNote,
    X,
    MoreVertical,
    RotateCcw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NoteEditorDialog } from './note-editor-dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSearchParams, useRouter } from 'next/navigation';

type ViewType = 'notes' | 'favorites' | 'archive' | 'trash' | string; // string for tag views

export function NotesPage() {
    const { profile, updateNote, deleteNote } = useProfile();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState<NoteItem | undefined>(undefined);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewType>('notes');
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');

    const searchParams = useSearchParams();
    const router = useRouter();

    // Open note from URL param
    React.useEffect(() => {
        const noteId = searchParams.get('id');
        if (noteId && profile.notes) {
            const note = profile.notes.find(n => n.id === noteId);
            if (note) {
                setSelectedNote(note);
                setIsEditorOpen(true);
            }
        }
    }, [searchParams, profile.notes]);

    const handleEditorOpenChange = (open: boolean) => {
        setIsEditorOpen(open);
        if (!open) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('id');
            router.replace(`?${params.toString()}`, { scroll: false });
            setSelectedNote(undefined);
        }
    };

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        profile.notes.forEach(note => {
            if (!note.isTrashed) {
                note.tags?.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    }, [profile.notes]);

    // Filter notes based on view and search
    const filteredNotes = useMemo(() => {
        let notes = profile.notes;

        // 1. Filter by View
        if (currentView === 'notes') {
            notes = notes.filter(n => !n.isTrashed && !n.isArchived);
        } else if (currentView === 'favorites') {
            notes = notes.filter(n => !n.isTrashed && n.isFavorite);
        } else if (currentView === 'archive') {
            notes = notes.filter(n => !n.isTrashed && n.isArchived);
        } else if (currentView === 'trash') {
            notes = notes.filter(n => n.isTrashed);
        } else {
            // Tag view
            notes = notes.filter(n => !n.isTrashed && n.tags?.includes(currentView));
        }

        // 2. Filter by Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            notes = notes.filter(n =>
                n.title.toLowerCase().includes(query) ||
                n.content.toLowerCase().includes(query) ||
                n.tags?.some(t => t.toLowerCase().includes(query))
            );
        }

        // 3. Sort: Pinned first, then updated date
        return notes.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [profile.notes, currentView, searchQuery]);

    const handleCreateNote = () => {
        setSelectedNote(undefined);
        setIsEditorOpen(true);
    };

    const handleEditNote = (note: NoteItem) => {
        setSelectedNote(note);
        setIsEditorOpen(true);
    };

    const handleRestore = (note: NoteItem, e: React.MouseEvent) => {
        e.stopPropagation();
        updateNote({ ...note, isTrashed: false });
    };

    const handleDeleteForever = (note: NoteItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this note permanently?')) {
            deleteNote(note.id);
        }
    };

    const tabs = [
        { id: 'notes', label: 'Notes', icon: StickyNote },
        { id: 'favorites', label: 'Favorites', icon: Star },
        { id: 'archive', label: 'Archive', icon: Archive },
        { id: 'trash', label: 'Trash', icon: Trash2 },
        ...allTags.map(tag => ({ id: tag, label: tag, icon: Tag }))
    ];

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm overflow-hidden rounded-xl border border-white/5 relative">
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 gap-4 bg-card/30 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search in ${currentView === 'notes' ? 'notes' : currentView}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-black/10 border-transparent focus:bg-black/20 transition-all"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleCreateNote} className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus className="h-5 w-5 sm:mr-2" />
                        <span className="hidden sm:inline">New Note</span>
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/5 bg-card/20 backdrop-blur-sm shrink-0">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-2 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentView(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                    currentView === tab.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                                {tab.id === 'notes' && (
                                    <span className="ml-1 text-xs opacity-60">
                                        {profile.notes.filter(n => !n.isTrashed && !n.isArchived).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
            </div>

            {/* Notes Grid/List */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                {filteredNotes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                        <div className="p-4 rounded-full bg-accent/50">
                            {currentView === 'trash' ? <Trash2 className="h-8 w-8 opacity-50" /> :
                                currentView === 'archive' ? <Archive className="h-8 w-8 opacity-50" /> :
                                    currentView === 'favorites' ? <Star className="h-8 w-8 opacity-50" /> :
                                        <StickyNote className="h-8 w-8 opacity-50" />}
                        </div>
                        <p>No notes found in {currentView}</p>
                    </div>
                ) : (
                    <div className="w-full px-4 pb-24 space-y-4">
                        <AnimatePresence>
                            {filteredNotes.map(note => (
                                <motion.div
                                    key={note.id}
                                    layoutId={note.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <NoteCard
                                        note={note}
                                        onClick={() => handleEditNote(note)}
                                        isTrashed={currentView === 'trash'}
                                        onRestore={(e) => handleRestore(note, e)}
                                        onDeleteForever={(e) => handleDeleteForever(note, e)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <NoteEditorDialog
                open={isEditorOpen}
                onOpenChange={handleEditorOpenChange}
                note={selectedNote}
            />
        </div>
    );
}

function NoteCard({
    note,
    onClick,
    isTrashed,
    onRestore,
    onDeleteForever
}: {
    note: NoteItem;
    onClick: () => void;
    isTrashed?: boolean;
    onRestore?: (e: React.MouseEvent) => void;
    onDeleteForever?: (e: React.MouseEvent) => void;
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-xl border border-transparent transition-all duration-200 hover:shadow-lg cursor-pointer",
                note.color || 'bg-card',
                // Add border if it's default card color to separate from background
                (!note.color || note.color === 'bg-card') && "border-white/10 bg-card/50"
            )}
        >
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <h3 className={cn("font-semibold text-base leading-tight", !note.title && "text-muted-foreground italic")}>
                        {note.title || 'Untitled'}
                    </h3>
                    <div className="flex shrink-0 gap-1">
                        {note.isPinned && <Pin className="h-3.5 w-3.5 fill-current opacity-70" />}
                        {note.isFavorite && <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />}
                    </div>
                </div>

                {note.content && (
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-[8] leading-relaxed">
                        {note.content}
                    </p>
                )}

                {(note.tags && note.tags.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {note.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded-md bg-black/10 text-[10px] font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Hover Actions / Footer */}
            <div className="px-4 pb-3 pt-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-muted-foreground/60">
                    {format(new Date(note.updatedAt), 'MMM d')}
                </span>

                {isTrashed && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-black/20"
                            onClick={onRestore}
                            title="Restore"
                        >
                            <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-black/20 text-destructive"
                            onClick={onDeleteForever}
                            title="Delete Forever"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
