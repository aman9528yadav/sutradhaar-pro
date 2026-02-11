"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useProfile, NoteItem } from '@/context/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Palette,
    Pin,
    Star,
    Trash2,
    Archive,
    Tag,
    X,
    MoreVertical,
    RotateCcw,
    Clock,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    CheckSquare,
    Heading,
    ArrowLeft,
    Save,
    Quote,
    Code,
    Link,
    Image,
    Table,
    Minus,
    Hash,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    IndentIncrease,
    IndentDecrease,
    Undo,
    Redo,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NoteEditorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    note?: NoteItem;
}

const colors = [
    { id: 'bg-card', class: 'bg-card', border: 'border-border' },
    { id: 'red', class: 'bg-red-500/10', border: 'border-red-500/20' },
    { id: 'orange', class: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { id: 'yellow', class: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { id: 'green', class: 'bg-green-500/10', border: 'border-green-500/20' },
    { id: 'teal', class: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { id: 'blue', class: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'indigo', class: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { id: 'purple', class: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { id: 'pink', class: 'bg-pink-500/10', border: 'border-pink-500/20' },
];

export function NoteEditorDialog({ open, onOpenChange, note }: NoteEditorDialogProps) {
    const { addNote, updateNote, deleteNote } = useProfile();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('bg-card');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isArchived, setIsArchived] = useState(false);
    const [isTrashed, setIsTrashed] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [fontSize, setFontSize] = useState(16); // Base font size in pixels
    const [textAlignment, setTextAlignment] = useState('left'); // left, center, right, justify

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Reset form when opening
    useEffect(() => {
        if (open) {
            setTitle(note?.title || '');
            setContent(note?.content || '');
            setColor(note?.color || 'bg-card');
            setIsFavorite(note?.isFavorite || false);
            setIsPinned(note?.isPinned || false);
            setIsArchived(note?.isArchived || false);
            setIsTrashed(note?.isTrashed || false);
            setTags(note?.tags || []);
            setTagInput('');
            setFontSize(16);
            setTextAlignment('left');
        }
    }, [open, note]);

    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            onOpenChange(false);
            return;
        }

        const noteData = {
            title,
            content,
            color,
            isFavorite,
            isPinned,
            isArchived,
            isTrashed,
            tags,
        };

        if (note) {
            updateNote({
                ...note,
                ...noteData,
            });
        } else {
            addNote(noteData);
        }
        onOpenChange(false);
    };

    const handleTrash = () => {
        if (note) {
            if (isTrashed) {
                if (confirm('Delete this note permanently?')) {
                    deleteNote(note.id);
                    onOpenChange(false);
                }
            } else {
                setIsTrashed(true);
                updateNote({ ...note, isTrashed: true });
                onOpenChange(false);
            }
        } else {
            onOpenChange(false);
        }
    };

    const handleRestore = () => {
        setIsTrashed(false);
        if (note) {
            updateNote({ ...note, isTrashed: false });
        }
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const insertText = (before: string, after: string = '', placeholder: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const replacementText = selectedText || placeholder;
        const newText = content.substring(0, start) + before + replacementText + after + content.substring(end);

        setContent(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + replacementText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const formatText = (formatType: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        if (!selectedText) return;

        let before = '';
        let after = '';

        switch (formatType) {
            case 'bold':
                before = '**';
                after = '**';
                break;
            case 'italic':
                before = '*';
                after = '*';
                break;
            case 'underline':
                before = '__';
                after = '__';
                break;
            case 'strikethrough':
                before = '~~';
                after = '~~';
                break;
            case 'code':
                before = '`';
                after = '`';
                break;
            case 'codeBlock':
                before = '\n```\n';
                after = '\n```\n';
                break;
            case 'heading':
                before = '# ';
                break;
            case 'subheading':
                before = '## ';
                break;
            case 'list':
                before = '- ';
                break;
            case 'numberedList':
                before = '1. ';
                break;
            case 'quote':
                before = '> ';
                break;
            case 'link':
                before = '[';
                after = ']()';
                break;
            default:
                return;
        }

        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
        setContent(newText);

        // Set cursor position after the inserted text
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const increaseFontSize = () => {
        setFontSize(prev => Math.min(prev + 2, 24));
    };

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(prev - 2, 12));
    };

    const applyAlignment = (alignment: string) => {
        setTextAlignment(alignment);
    };

    const currentColorObj = colors.find(c => c.class === color) || colors[0];

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) handleSave();
            onOpenChange(val);
        }}>
            <DialogContent className={cn(
                "w-full h-[100dvh] max-w-full p-0 gap-0 border-0 shadow-none flex flex-col", // Full screen mobile layout
                color,
                "sm:h-auto sm:max-w-[800px] sm:rounded-xl sm:border sm:shadow-2xl sm:max-h-[90vh]" // Desktop adjustments
            )}>
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-black/5 bg-black/5 backdrop-blur-sm shrink-0">
                    <Button variant="ghost" size="icon" onClick={handleSave} className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {!isTrashed && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsPinned(!isPinned)}
                                    className={cn("transition-colors", isPinned && "text-primary")}
                                >
                                    <Pin className={cn("h-5 w-5", isPinned && "fill-current")} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={cn("transition-colors", isFavorite && "text-yellow-500")}
                                >
                                    <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsArchived(!isArchived)}
                                    className={cn("transition-colors", isArchived && "text-primary")}
                                >
                                    <Archive className={cn("h-5 w-5", isArchived && "fill-current")} />
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" onClick={handleSave} className="text-primary">
                            <Save className="h-5 w-5 fill-current" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" style={{ fontSize: `${fontSize}px` }}>
                    {/* Tags Display */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-black/10 hover:bg-black/20 text-foreground/80 gap-1 pr-1">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Title Input */}
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="text-3xl font-bold border-none shadow-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-muted-foreground/50 h-auto py-2"
                    />

                    {/* Content Input */}
                    <Textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start typing... Use formatting toolbar for rich text"
                        className="min-h-[50vh] resize-none border-none shadow-none focus-visible:ring-0 px-0 bg-transparent text-lg leading-relaxed"
                        style={{ textAlign: textAlignment }}
                    />
                </div>

                {/* Advanced Formatting Toolbar */}
                <div className="shrink-0 p-2 border-t border-black/5 bg-black/5 backdrop-blur-sm overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-max px-2">
                        {/* Text Formatting */}
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => formatText('bold')} title="Bold">
                                <Bold className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('italic')} title="Italic">
                                <Italic className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('underline')} title="Underline">
                                <Underline className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('strikethrough')} title="Strikethrough">
                                <Strikethrough className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="w-px h-6 bg-black/10 mx-1" />

                        {/* Alignment */}
                        <div className="flex gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => applyAlignment('left')} 
                                title="Align Left"
                                className={textAlignment === 'left' ? "bg-accent" : ""}
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => applyAlignment('center')} 
                                title="Align Center"
                                className={textAlignment === 'center' ? "bg-accent" : ""}
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => applyAlignment('right')} 
                                title="Align Right"
                                className={textAlignment === 'right' ? "bg-accent" : ""}
                            >
                                <AlignRight className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => applyAlignment('justify')} 
                                title="Justify"
                                className={textAlignment === 'justify' ? "bg-accent" : ""}
                            >
                                <AlignJustify className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="w-px h-6 bg-black/10 mx-1" />

                        {/* Font Size */}
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={decreaseFontSize} title="Decrease Font Size">
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-xs w-8 text-center">{fontSize}px</span>
                            <Button variant="ghost" size="icon" onClick={increaseFontSize} title="Increase Font Size">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="w-px h-6 bg-black/10 mx-1" />

                        {/* Structure Formatting */}
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => formatText('heading')} title="Heading">
                                <Heading className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('list')} title="Bullet List">
                                <List className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('numberedList')} title="Numbered List">
                                <Hash className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('quote')} title="Quote">
                                <Quote className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('code')} title="Inline Code">
                                <Code className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('codeBlock')} title="Code Block">
                                <Code className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => formatText('link')} title="Insert Link">
                                <Link className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="w-px h-6 bg-black/10 mx-1" />

                        {/* Color Picker Trigger */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" title="Color">
                                    <Palette className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="p-2 grid grid-cols-5 gap-2 mb-2">
                                {colors.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setColor(c.class)}
                                        className={cn(
                                            "w-8 h-8 rounded-full border border-border transition-transform hover:scale-110",
                                            c.class,
                                            color === c.class && "ring-2 ring-primary ring-offset-2"
                                        )}
                                        title={c.id}
                                    />
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Tag Input Trigger */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" title="Tags">
                                    <Tag className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="p-3 w-64 mb-2">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Type tag & enter..."
                                        className="h-8"
                                        autoFocus
                                    />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex-1" />

                        <Button variant="ghost" size="icon" onClick={handleTrash} className="text-destructive hover:bg-destructive/10" title="Delete">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
