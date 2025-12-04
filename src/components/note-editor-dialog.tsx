"use client";

import React, { useState } from 'react';
import { useProfile, NoteItem } from '@/context/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Palette, Pin, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteEditorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    note?: NoteItem;
}

const colors = [
    'bg-card',
    'bg-red-500/10',
    'bg-orange-500/10',
    'bg-yellow-500/10',
    'bg-green-500/10',
    'bg-blue-500/10',
    'bg-purple-500/10',
    'bg-pink-500/10',
];

export function NoteEditorDialog({ open, onOpenChange, note }: NoteEditorDialogProps) {
    const { addNote, updateNote, deleteNote } = useProfile();
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [color, setColor] = useState(note?.color || 'bg-card');
    const [isFavorite, setIsFavorite] = useState(note?.isFavorite || false);
    const [isPinned, setIsPinned] = useState(note?.isPinned || false);

    // Reset form when opening for a new note or switching notes
    React.useEffect(() => {
        if (open) {
            setTitle(note?.title || '');
            setContent(note?.content || '');
            setColor(note?.color || 'bg-card');
            setIsFavorite(note?.isFavorite || false);
            setIsPinned(note?.isPinned || false);
        }
    }, [open, note]);

    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            onOpenChange(false);
            return;
        }

        if (note) {
            updateNote({
                ...note,
                title,
                content,
                color,
                isFavorite,
                isPinned,
            });
        } else {
            addNote({
                title,
                content,
                color,
                isFavorite,
                isPinned,
            });
        }
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (note && confirm('Are you sure you want to delete this note?')) {
            deleteNote(note.id);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-[600px] border-white/10", color)}>
                <DialogHeader>
                    <DialogTitle>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-muted-foreground/50"
                        />
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Take a note..."
                        className="min-h-[300px] resize-none border-none shadow-none focus-visible:ring-0 px-0 bg-transparent text-base"
                    />
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={cn(
                                        "w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-110",
                                        c,
                                        color === c && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                    )}
                                />
                            ))}
                        </div>

                        <div className="h-6 w-px bg-white/10 mx-2" />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPinned(!isPinned)}
                            className={cn(isPinned && "text-primary")}
                        >
                            <Pin className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={cn(isFavorite && "text-yellow-500")}
                        >
                            <Star className="h-4 w-4" />
                        </Button>
                        {note && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
