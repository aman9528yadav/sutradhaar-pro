
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, BookText, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfile, DashboardWidgetItem } from '@/context/ProfileContext';
import { cn } from '@/lib/utils';

const allWidgetItems = [
    { id: 'recentNote', icon: BookText, label: 'Recent Note' },
    { id: 'pendingTodos', icon: CheckSquare, label: 'Pending Todos' },
    // { id: 'miniBudget', icon: 'Wallet', label: 'Budget Overview' },
];


export default function ManageWidgetsPage() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  
  const [managedItems, setManagedItems] = useState<DashboardWidgetItem[]>(
    (profile.dashboardWidgets && profile.dashboardWidgets.length > 0)
      ? profile.dashboardWidgets
      : allWidgetItems.map(item => ({ id: item.id as DashboardWidgetItem['id'], hidden: false }))
  );

  useEffect(() => {
    // Sync with profile context if it changes, adding any new default widgets
    if (profile.dashboardWidgets) {
        const validOrder = profile.dashboardWidgets.filter(orderItem => allWidgetItems.some(item => item.id === orderItem.id));
        const savedIds = new Set(validOrder.map(item => item.id));
        const newItems = allWidgetItems
            .filter(item => !savedIds.has(item.id))
            .map(item => ({ id: item.id as DashboardWidgetItem['id'], hidden: false }));
        
        setManagedItems([...validOrder, ...newItems]);
    }
  }, [profile.dashboardWidgets]);
  

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...managedItems];
    const item = newItems[index];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newItems.length) return;

    newItems.splice(index, 1);
    newItems.splice(newIndex, 0, item);
    setManagedItems(newItems);
  };

  const toggleVisibility = (id: string) => {
    setManagedItems(
      managedItems.map(item =>
        item.id === id ? { ...item, hidden: !item.hidden } : item
      )
    );
  };

  const handleSaveChanges = () => {
    setProfile(p => ({ ...p, dashboardWidgets: managedItems }));
    router.back();
  };
  
  const itemMap = new Map(allWidgetItems.map(item => [item.id, item]));

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-[412px] flex flex-col flex-1">
        <div className="flex items-center justify-between gap-4 mb-6 pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Manage Widgets</h1>
            </div>
          </div>
          <Button size="sm" onClick={handleSaveChanges}>Save</Button>
        </div>

        <main className="flex-1 space-y-4 pb-12">
            <p className="text-muted-foreground text-sm">Use the arrows to reorder widgets. Use the eye icon to show or hide widgets from your dashboard.</p>
            <div className="space-y-2">
                {managedItems.map((orderItem, index) => {
                const itemDetails = itemMap.get(orderItem.id);
                if (!itemDetails) return null;
                const { icon: Icon, label } = itemDetails;

                return (
                    <Card
                    key={orderItem.id}
                    className={cn("p-2", orderItem.hidden && "opacity-50")}
                    >
                    <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="p-2 bg-accent rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium flex-1">{label}</span>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleVisibility(orderItem.id)}
                        >
                        {orderItem.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <div className="flex flex-col">
                           <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={() => handleMove(index, 'up')}><ArrowUp className="h-4 w-4" /></Button>
                           <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === managedItems.length - 1} onClick={() => handleMove(index, 'down')}><ArrowDown className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    </Card>
                );
                })}
            </div>
        </main>
      </div>
    </div>
  );
}
