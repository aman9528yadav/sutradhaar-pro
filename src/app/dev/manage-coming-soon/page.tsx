

"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Icon as LucideIcon,
  Sparkles,
  Wand2,
  Share2,
  Bot,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMaintenance, ComingSoonItem } from '@/context/MaintenanceContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const iconMap: { [key: string]: LucideIcon } = {
  Sparkles,
  Wand2,
  Share2,
  Bot,
};

const iconOptions: ComingSoonItem['icon'][] = ['Sparkles', 'Wand2', 'Share2', 'Bot'];

const ComingSoonForm = ({
  item,
  onSave,
  onCancel,
}: {
  item: Omit<ComingSoonItem, 'id'> | ComingSoonItem;
  onSave: (item: Omit<ComingSoonItem, 'id'> | ComingSoonItem) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (value: ComingSoonItem['icon']) => {
    setFormData((prev) => ({ ...prev, icon: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{'id' in item ? 'Edit' : 'Add'} Coming Soon Item</DialogTitle>
        <DialogDescription>
          Fill in the details for the "Coming Soon" item.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="icon" className="text-right">
            Icon
          </Label>
          <Select value={formData.icon} onValueChange={handleIconChange}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((iconName) => {
                const IconComponent = iconMap[iconName];
                return (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{iconName}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogFooter>
    </>
  );
};

export default function ManageComingSoonPage() {
  const router = useRouter();
  const { maintenanceConfig, setMaintenanceConfig } = useMaintenance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ComingSoonItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  const addComingSoonItem = (item: Omit<ComingSoonItem, 'id'>) => {
    setMaintenanceConfig(prev => {
        const newItem = { ...item, id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
        return {...prev, comingSoonItems: [newItem, ...(prev.comingSoonItems || [])]};
    });
  };

  const editComingSoonItem = (itemToEdit: ComingSoonItem) => {
    setMaintenanceConfig(prev => ({...prev, comingSoonItems: (prev.comingSoonItems || []).map(item => (item.id === itemToEdit.id ? itemToEdit : item))}));
  };

  const deleteComingSoonItem = (id: string) => {
    setMaintenanceConfig(prev => ({...prev, comingSoonItems: (prev.comingSoonItems || []).filter(i => i.id !== id)}));
    setItemToDelete(null);
  };
  
  const clearAllComingSoonItems = () => {
    setMaintenanceConfig(prev => ({...prev, comingSoonItems: []}));
    setIsClearAllDialogOpen(false);
  }

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ComingSoonItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = (itemData: Omit<ComingSoonItem, 'id'> | ComingSoonItem) => {
    if ('id' in itemData) {
      editComingSoonItem(itemData);
    } else {
      addComingSoonItem(itemData);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

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
              <h1 className="text-xl font-bold">Manage "Coming Soon"</h1>
            </div>
          </div>
          <div className="flex gap-2">
             <AlertDialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" /> Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all "Coming Soon" items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllComingSoonItems}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              size="sm"
              className="gap-2"
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>

        <main className="flex-1 space-y-4 pb-12">
          {(maintenanceConfig.comingSoonItems || []).length === 0 && (
            <div className="text-center text-muted-foreground py-16">
              <p>No "Coming Soon" items yet.</p>
              <p>Click "Add New" to create one.</p>
            </div>
          )}
          {(maintenanceConfig.comingSoonItems || []).map((item) => {
            const ItemIcon = iconMap[item.icon] || Sparkles;
            return (
              <Card key={item.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-1">
                        <ItemIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                              {item.description}
                          </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog open={itemToDelete === item.id} onOpenChange={(open) => !open && setItemToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setItemToDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the item.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteComingSoonItem(item.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) setEditingItem(null); setIsDialogOpen(open); }}>
        <DialogContent>
          <ComingSoonForm
            item={
              editingItem || {
                title: '',
                description: '',
                icon: 'Sparkles',
              }
            }
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
    

    

    

    
