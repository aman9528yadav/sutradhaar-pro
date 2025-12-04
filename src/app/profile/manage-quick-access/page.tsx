
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { quickAccessItems, moreAccessItems } from '@/app/page';
import { cn } from '@/lib/utils';

const allAccessItems = [...quickAccessItems, ...moreAccessItems];


export default function ManageQuickAccessPage() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  
  const [managedItems, setManagedItems] = useState(
    (profile.quickAccessOrder && profile.quickAccessOrder.length > 0)
      ? profile.quickAccessOrder
      : allAccessItems.map(item => ({ id: item.id, hidden: false }))
  );

  useEffect(() => {
    // Sync with profile context if it changes
    if (profile.quickAccessOrder && profile.quickAccessOrder.length > 0) {
        // Filter out any items that might have been removed from the main lists
        const validOrder = profile.quickAccessOrder.filter(orderItem => allAccessItems.some(item => item.id === orderItem.id));
        
        // Add any new items that are not in the user's saved order
        const savedIds = new Set(validOrder.map(item => item.id));
        const newItems = allAccessItems
            .filter(item => !savedIds.has(item.id))
            .map(item => ({ id: item.id, hidden: false }));
        
        setManagedItems([...validOrder, ...newItems]);
    } else {
      // If the profile has no order, initialize with default
      setManagedItems(allAccessItems.map(item => ({ id: item.id, hidden: false })));
    }
  }, [profile.quickAccessOrder]);
  

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...managedItems];
    const item = newItems[index];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newItems.length) {
      return;
    }

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
    setProfile(p => ({ ...p, quickAccessOrder: managedItems }));
    router.back();
  };
  
  const itemMap = new Map(allAccessItems.map(item => [item.id, item]));

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
              <h1 className="text-xl font-bold">Manage Quick Access</h1>
            </div>
          </div>
          <Button size="sm" onClick={handleSaveChanges}>Save</Button>
        </div>

        <main className="flex-1 space-y-4 pb-12">
            <p className="text-muted-foreground text-sm">Use the arrows to reorder items. Use the eye icon to show or hide items from your dashboard.</p>
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
