"use client";

import { useEffect, useState } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, push, remove } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Loader2, Database } from 'lucide-react';
import { toast } from '@/hooks/use-toast'; // Assuming this exists, or I'll use a simple alert or just console

interface ListItem {
    id: string;
    text: string;
    createdAt: number;
}

export function RealtimeList() {
    const [items, setItems] = useState<ListItem[]>([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!rtdb) {
            setLoading(false);
            return;
        }
        try {
            const itemsRef = ref(rtdb, 'realtime-list');
            const unsubscribe = onValue(itemsRef, (snapshot) => {
                const data = snapshot.val();
                const loadedItems: ListItem[] = [];
                if (data) {
                    Object.entries(data).forEach(([key, value]: [string, any]) => {
                        loadedItems.push({
                            id: key,
                            text: value.text,
                            createdAt: value.createdAt,
                        });
                    });
                }
                // Sort by newest first
                loadedItems.sort((a, b) => b.createdAt - a.createdAt);
                setItems(loadedItems);
                setLoading(false);
            }, (error) => {
                console.error("Firebase RTDB Error:", error);
                setError(error.message);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err: any) {
            console.error("Error setting up listener:", err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    const handleAddItem = async () => {
        if (!newItem.trim()) return;
        if (!rtdb) {
            alert("Realtime Database is not available. Please check your configuration.");
            return;
        }

        try {
            const itemsRef = ref(rtdb, 'realtime-list');
            await push(itemsRef, {
                text: newItem,
                createdAt: Date.now(),
            });
            setNewItem('');
        } catch (err: any) {
            console.error("Error adding item:", err);
            // You might want to show a toast here
            alert("Failed to add item: " + err.message);
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!rtdb) return;
        try {
            const itemRef = ref(rtdb, `realtime-list/${id}`);
            await remove(itemRef);
        } catch (err: any) {
            console.error("Error deleting item:", err);
            alert("Failed to delete item: " + err.message);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto border-white/10 bg-black/20 backdrop-blur-xl">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    <CardTitle>Firebase Realtime List</CardTitle>
                </div>
                <CardDescription>Items are synced in real-time across all devices.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-6">
                    <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add new item..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                        className="bg-white/5 border-white/10 focus-visible:ring-blue-500"
                    />
                    <Button onClick={handleAddItem} disabled={!newItem.trim()} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 rounded-md border border-red-900/50">
                        Error: {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                    </div>
                ) : (
                    <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map((item) => (
                            <li key={item.id} className="group flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                <span className="text-sm">{item.text}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400 h-8 w-8"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </li>
                        ))}
                        {items.length === 0 && !error && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No items yet.</p>
                                <p className="text-xs mt-1 opacity-50">Add one above to get started!</p>
                            </div>
                        )}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
