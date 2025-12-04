
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMaintenance, MembershipFeature } from '@/context/MaintenanceContext';
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
import { Switch } from '@/components/ui/switch';

const MembershipFeatureForm = ({
  item,
  onSave,
  onCancel,
}: {
  item: Omit<MembershipFeature, 'id'> | MembershipFeature;
  onSave: (item: Omit<MembershipFeature, 'id'> | MembershipFeature) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: 'member' | 'premium', checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{'id' in item ? 'Edit' : 'Add'} Membership Feature</DialogTitle>
        <DialogDescription>
          Fill in the details for the membership feature.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="feature" className="text-right">
            Feature
          </Label>
          <Input id="feature" name="feature" value={formData.feature} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="member" className="text-right">
            Member Access
          </Label>
          <Switch id="member" checked={formData.member} onCheckedChange={(c) => handleSwitchChange('member', c)} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="premium" className="text-right">
            Premium Access
          </Label>
          <Switch id="premium" checked={formData.premium} onCheckedChange={(c) => handleSwitchChange('premium', c)} />
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

export default function ManageMembershipPage() {
  const router = useRouter();
  const { maintenanceConfig, setMaintenanceConfig } = useMaintenance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MembershipFeature | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
  
  const features = maintenanceConfig.membershipFeatures || [];

  const addFeature = (item: Omit<MembershipFeature, 'id'>) => {
    setMaintenanceConfig(prev => {
        const newItem = { ...item, id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
        return {...prev, membershipFeatures: [newItem, ...(prev.membershipFeatures || [])]};
    });
  };

  const editFeature = (itemToEdit: MembershipFeature) => {
    setMaintenanceConfig(prev => ({...prev, membershipFeatures: (prev.membershipFeatures || []).map(item => (item.id === itemToEdit.id ? itemToEdit : item))}));
  };

  const deleteFeature = (id: string) => {
    setMaintenanceConfig(prev => ({...prev, membershipFeatures: (prev.membershipFeatures || []).filter(i => i.id !== id)}));
    setItemToDelete(null);
  };
  
  const clearAllFeatures = () => {
    setMaintenanceConfig(prev => ({...prev, membershipFeatures: []}));
    setIsClearAllDialogOpen(false);
  }

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MembershipFeature) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = (itemData: Omit<MembershipFeature, 'id'> | MembershipFeature) => {
    if ('id' in itemData) {
      editFeature(itemData);
    } else {
      addFeature(itemData);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-[412px] flex flex-col flex-1">
        <div className="flex items-center justify-between gap-4 mb-6 pt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Manage Membership</h1>
            </div>
          </div>
          <div className="flex gap-2">
             <AlertDialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="gap-2"><Trash2 className="h-4 w-4" /> Clear All</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>This action will delete all membership features. This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllFeatures}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button size="sm" className="gap-2" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />Add New
            </Button>
          </div>
        </div>

        <main className="flex-1 space-y-4 pb-12">
          {features.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
              <p>No membership features yet.</p>
              <p>Click "Add New" to create one.</p>
            </div>
          )}
          {features.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.feature}</p>
                      <div className="flex gap-4 text-xs mt-1">
                         <div className="flex items-center gap-1">{item.member ? <Check className="h-4 w-4 text-green-500"/> : <X className="h-4 w-4 text-red-500" />} Member</div>
                         <div className="flex items-center gap-1">{item.premium ? <Check className="h-4 w-4 text-green-500"/> : <X className="h-4 w-4 text-red-500" />} Premium</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <AlertDialog open={itemToDelete === item.id} onOpenChange={(open) => !open && setItemToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setItemToDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete the feature "{item.feature}".</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteFeature(item.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) setEditingItem(null); setIsDialogOpen(open); }}>
        <DialogContent>
          <MembershipFeatureForm
            item={ editingItem || { feature: '', member: false, premium: true } }
            onSave={handleSave}
            onCancel={() => { setIsDialogOpen(false); setEditingItem(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
