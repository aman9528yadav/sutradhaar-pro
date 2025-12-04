"use client";

import React, { useState } from 'react';
import { useProfile, NoteItem } from '@/context/ProfileContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Star, Pin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NoteEditorDialog } from './note-editor-dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function NotesPage() {
    const { profile } = useProfile();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState<NoteItem | undefined>(undefined);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const filteredNotes = profile.notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedNotes = filteredNotes.filter(n => n.isPinned);
    const otherNotes = filteredNotes.filter(n => !n.isPinned);

    const handleCreateNote = () => {
        setSelectedNote(undefined);
        setIsEditorOpen(true);
    };

    const handleEditNote = (note: NoteItem) => {
        setSelectedNote(note);
        setIsEditorOpen(true);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-card/50 border-white/5"
                    />
                </div>
                <Button onClick={handleCreateNote} className="shrink-0">
                    <Plus className="mr-2 h-4 w-4" /> New Note
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pb-20 scrollbar-hide">
                {pinnedNotes.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Pin className="h-3 w-3" /> Pinned
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {pinnedNotes.map(note => (
                                <NoteCard key={note.id} note={note} onClick={() => handleEditNote(note)} />
                            ))}
                        </div>
                    </div>
                )}

                {otherNotes.length > 0 && (
                    <div className="space-y-3">
                        {pinnedNotes.length > 0 && (
                            <h3 className="text-sm font-medium text-muted-foreground">Others</h3>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            {otherNotes.map(note => (
                                <NoteCard key={note.id} note={note} onClick={() => handleEditNote(note)} />
                            ))}
                        </div>
                    </div>
                )}

                {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
                        <p>No notes found</p>
                    </div>
                )}
            </div>

            <NoteEditorDialog
                open={isEditorOpen}
                onOpenChange={setIsEditorOpen}
                note={selectedNote}
            />
        </div>
    );
}

function NoteCard({ note, onClick }: { note: NoteItem; onClick: () => void }) {
    return (
        <motion.div
            layoutId={note.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="cursor-pointer"
        >
            <Card className={cn("h-full overflow-hidden border-white/5 transition-colors hover:border-white/20", note.color || 'bg-card/50')}>
                <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-1">{note.title || 'Untitled'}</h3>
                        {note.isFavorite && <Star className="h-3 w-3 text-yellow-500 shrink-0 mt-1" />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                        {note.content || 'No content'}
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 pt-2">
                        {format(new Date(note.updatedAt), 'MMM d')}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
