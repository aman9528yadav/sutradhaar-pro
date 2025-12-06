"use client";

import React, { useState, useMemo } from 'react';
import { useProfile, TodoItem } from '@/context/ProfileContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, CheckCircle2, Calendar, Flag, Trash2, Edit2,
    Filter, SortAsc, Star, Clock, TrendingUp, CheckCheck, ListTodo,
    MoreVertical, Tag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AddTodoDialog } from './add-todo-dialog';
import { cn } from '@/lib/utils';
import { format, isPast, isToday, isTomorrow, isThisWeek } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { useSearchParams, useRouter } from 'next/navigation';

export function TodoPage() {
    const { profile, updateTodo, deleteTodo } = useProfile();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'today' | 'week' | 'overdue'>('all');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'created'>('priority');
    const [selectedTodo, setSelectedTodo] = useState<TodoItem | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    // Open todo from URL param
    React.useEffect(() => {
        const todoId = searchParams.get('id');
        if (todoId && profile.todos) {
            const todo = profile.todos.find(t => t.id === todoId);
            if (todo) {
                setSelectedTodo(todo);
                setIsDialogOpen(true);
            }
        }
    }, [searchParams, profile.todos]);

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('id');
            router.replace(`?${params.toString()}`, { scroll: false });
            setSelectedTodo(undefined);
        }
    };

    // Statistics
    const stats = useMemo(() => {
        const total = profile.todos.length;
        const completed = profile.todos.filter(t => t.completed).length;
        const active = total - completed;
        const overdue = profile.todos.filter(t =>
            !t.completed && t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))
        ).length;
        const today = profile.todos.filter(t =>
            !t.completed && t.dueDate && isToday(new Date(t.dueDate))
        ).length;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;

        return { total, completed, active, overdue, today, completionRate };
    }, [profile.todos]);

    const uniqueCategories = useMemo(() => {
        const categories = new Set<string>();
        profile.todos.forEach(todo => {
            if (todo.category) categories.add(todo.category);
        });
        return Array.from(categories);
    }, [profile.todos]);

    const filteredTodos = useMemo(() => {
        return profile.todos
            .filter(todo => {
                const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesFilter = (() => {
                    switch (filter) {
                        case 'all': return true;
                        case 'active': return !todo.completed;
                        case 'completed': return todo.completed;
                        case 'today': return !todo.completed && todo.dueDate && isToday(new Date(todo.dueDate));
                        case 'week': return !todo.completed && todo.dueDate && isThisWeek(new Date(todo.dueDate));
                        case 'overdue': return !todo.completed && todo.dueDate && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate));
                        default: return true;
                    }
                })();

                const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
                const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;

                return matchesSearch && matchesFilter && matchesPriority && matchesCategory;
            })
            .sort((a, b) => {
                // Always put completed items at the bottom
                if (a.completed !== b.completed) return a.completed ? 1 : -1;

                switch (sortBy) {
                    case 'priority':
                        const priorityOrder = { high: 0, medium: 1, low: 2 };
                        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                            return priorityOrder[a.priority] - priorityOrder[b.priority];
                        }
                        break;
                    case 'dueDate':
                        if (a.dueDate && b.dueDate) {
                            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                        }
                        if (a.dueDate) return -1;
                        if (b.dueDate) return 1;
                        break;
                    case 'created':
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
                return 0;
            });
    }, [profile.todos, searchQuery, filter, priorityFilter, categoryFilter, sortBy]);

    const handleCreateTodo = () => {
        setSelectedTodo(undefined);
        setIsDialogOpen(true);
    };

    const handleEditTodo = (todo: TodoItem) => {
        setSelectedTodo(todo);
        setIsDialogOpen(true);
    };

    const handleToggleComplete = (todo: TodoItem) => {
        updateTodo({
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : undefined
        });
    };

    const handleToggleStar = (todo: TodoItem) => {
        updateTodo({
            ...todo,
            starred: !todo.starred
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTodo(id);
        }
    };

    const handleCompleteAll = () => {
        const activeTodos = profile.todos.filter(t => !t.completed);
        activeTodos.forEach(todo => {
            updateTodo({
                ...todo,
                completed: true,
                completedAt: new Date().toISOString()
            });
        });
    };

    const handleDeleteCompleted = () => {
        if (confirm('Are you sure you want to delete all completed tasks?')) {
            const completedTodos = profile.todos.filter(t => t.completed);
            completedTodos.forEach(todo => deleteTodo(todo.id));
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col pb-20">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-white/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Total Tasks</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <ListTodo className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold text-blue-500">{stats.active}</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
                            </div>
                            <CheckCheck className="h-8 w-8 text-emerald-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Overdue</p>
                                <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-red-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Bar */}
            {stats.total > 0 && (
                <Card className="border-white/5">
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Overall Progress</span>
                                <span className="font-semibold">{stats.completionRate.toFixed(0)}%</span>
                            </div>
                            <Progress value={stats.completionRate} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search and Actions */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-card/50 border-white/5"
                        />
                    </div>
                    <Button onClick={handleCreateTodo} className="shrink-0">
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {(['all', 'active', 'completed', 'today', 'week', 'overdue'] as const).map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className="capitalize rounded-full px-4 shrink-0"
                        >
                            {f === 'week' ? 'This Week' : f}
                            {f === 'today' && stats.today > 0 && (
                                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">{stats.today}</Badge>
                            )}
                            {f === 'overdue' && stats.overdue > 0 && (
                                <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">{stats.overdue}</Badge>
                            )}
                        </Button>
                    ))}
                </div>

                {/* Priority Filter and Sort */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 shrink-0">
                                <Filter className="h-4 w-4" />
                                Priority: {priorityFilter === 'all' ? 'All' : priorityFilter}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setPriorityFilter('all')}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPriorityFilter('high')}>High</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>Medium</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPriorityFilter('low')}>Low</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {uniqueCategories.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                                    <Tag className="h-4 w-4" />
                                    Category: {categoryFilter === 'all' ? 'All' : categoryFilter}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setCategoryFilter('all')}>All</DropdownMenuItem>
                                {uniqueCategories.map(cat => (
                                    <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>{cat}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 shrink-0">
                                <SortAsc className="h-4 w-4" />
                                Sort: {sortBy === 'dueDate' ? 'Due Date' : sortBy === 'created' ? 'Created' : 'Priority'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSortBy('priority')}>Priority</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('dueDate')}>Due Date</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('created')}>Created Date</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {stats.active > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleCompleteAll}>
                                    <CheckCheck className="mr-2 h-4 w-4" />
                                    Complete All Active
                                </DropdownMenuItem>
                                {stats.completed > 0 && (
                                    <DropdownMenuItem onClick={handleDeleteCompleted} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Completed
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Todo List */}
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {filteredTodos.map(todo => (
                        <motion.div
                            key={todo.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "group flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-card/50 transition-all hover:bg-card/80 hover:shadow-md",
                                todo.completed && "opacity-60 bg-card/30",
                                todo.starred && "border-yellow-500/30 bg-yellow-500/5"
                            )}
                        >
                            <button
                                onClick={() => handleToggleComplete(todo)}
                                className={cn(
                                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                    todo.completed
                                        ? "bg-primary border-primary text-primary-foreground scale-110"
                                        : "border-muted-foreground hover:border-primary hover:scale-110"
                                )}
                            >
                                {todo.completed && <CheckCircle2 className="w-4 h-4" />}
                            </button>

                            <button
                                onClick={() => handleToggleStar(todo)}
                                className={cn(
                                    "flex-shrink-0 transition-all",
                                    todo.starred ? "text-yellow-500 scale-110" : "text-muted-foreground hover:text-yellow-500 opacity-0 group-hover:opacity-100"
                                )}
                            >
                                <Star className={cn("w-4 h-4", todo.starred && "fill-current")} />
                            </button>

                            <div className="flex-1 min-w-0" onClick={() => handleEditTodo(todo)}>
                                <p className={cn(
                                    "font-medium truncate transition-all cursor-pointer hover:text-primary",
                                    todo.completed && "line-through text-muted-foreground"
                                )}>
                                    {todo.text}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                                    {todo.dueDate && (
                                        <span className={cn(
                                            "flex items-center gap-1 px-2 py-0.5 rounded-full",
                                            !todo.completed && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate)) && "text-red-500 bg-red-500/10",
                                            !todo.completed && isToday(new Date(todo.dueDate)) && "text-yellow-500 bg-yellow-500/10"
                                        )}>
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(todo.dueDate)}
                                        </span>
                                    )}
                                    <span className={cn(
                                        "flex items-center gap-1 capitalize px-2 py-0.5 rounded-full",
                                        todo.priority === 'high' && "text-red-400 bg-red-400/10",
                                        todo.priority === 'medium' && "text-yellow-400 bg-yellow-400/10",
                                        todo.priority === 'low' && "text-green-400 bg-green-400/10"
                                    )}>
                                        <Flag className="w-3 h-3" />
                                        {todo.priority}
                                    </span>
                                    {todo.category && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-blue-400 bg-blue-400/10">
                                            <Tag className="w-3 h-3" />
                                            {todo.category}
                                        </span>
                                    )}
                                    {todo.subtasks && todo.subtasks.length > 0 && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-purple-400 bg-purple-400/10">
                                            <ListTodo className="w-3 h-3" />
                                            {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}
                                        </span>
                                    )}
                                    {todo.timeSpent && todo.timeSpent > 0 && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-orange-400 bg-orange-400/10">
                                            <Clock className="w-3 h-3" />
                                            {formatTimeSpent(todo.timeSpent)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="sr-only">Open menu</span>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditTodo(todo)}>
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleStar(todo)}>
                                        <Star className="mr-2 h-4 w-4" />
                                        {todo.starred ? 'Unstar' : 'Star'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(todo.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTodos.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[40vh] text-muted-foreground">
                        <ListTodo className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg font-semibold">No tasks found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or create a new task</p>
                    </div>
                )}
            </div>

            <AddTodoDialog
                open={isDialogOpen}
                onOpenChange={handleDialogOpenChange}
                todo={selectedTodo}
            />
        </div>
    );
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
}

function formatTimeSpent(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}
