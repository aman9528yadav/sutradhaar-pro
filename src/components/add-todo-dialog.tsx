"use client";

import React, { useState } from 'react';
import { useProfile, TodoItem } from '@/context/ProfileContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { MuiDatePicker } from './mui-date-picker';

interface AddTodoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    todo?: TodoItem;
}

export function AddTodoDialog({ open, onOpenChange, todo }: AddTodoDialogProps) {
    const { addTodo, updateTodo } = useProfile();
    const [text, setText] = useState(todo?.text || '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(todo?.priority || 'medium');
    const [dueDate, setDueDate] = useState<Date | undefined>(todo?.dueDate ? new Date(todo.dueDate) : undefined);

    React.useEffect(() => {
        if (open) {
            setText(todo?.text || '');
            setPriority(todo?.priority || 'medium');
            setDueDate(todo?.dueDate ? new Date(todo.dueDate) : undefined);
        }
    }, [open, todo]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (todo) {
            updateTodo({
                ...todo,
                text,
                priority,
                dueDate: dueDate?.toISOString(),
            });
        } else {
            addTodo({
                text,
                priority,
                completed: false,
                dueDate: dueDate?.toISOString(),
            });
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{todo ? 'Edit Task' : 'New Task'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="task">Task</Label>
                        <Input
                            id="task"
                            placeholder="What needs to be done?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <MuiDatePicker
                                label="Due Date"
                                value={dueDate}
                                onChange={setDueDate}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full">Save Task</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
