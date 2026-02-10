
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  GitBranch,
  Sparkles,
  Icon as LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMaintenance, RoadmapItem } from '@/context/MaintenanceContext';
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
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const roadmapIconMap: { [key: string]: LucideIcon } = {
  GitBranch,
  Sparkles,
};

const roadmapIconOptions: RoadmapItem['icon'][] = ['GitBranch', 'Sparkles'];

const RoadmapForm = ({
  item,
  onSave,
  onCancel,
}: {
  item: Omit<RoadmapItem, 'id'> | RoadmapItem;
  onSave: (item: Omit<RoadmapItem, 'id'> | RoadmapItem) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (value: RoadmapItem['icon']) => {
    setFormData((prev) => ({ ...prev, icon: value }));
  };

  const handleStatusChange = (value: RoadmapItem['status']) => {
    setFormData((prev) => ({...prev, status: value}));
  }
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, details: e.target.value.split(',').map(s => s.trim()) }));
  }

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{'id' in item ? 'Edit' : 'Add'} Roadmap Item</DialogTitle>
        <DialogDescription>
          Fill in the details for the roadmap item.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="version" className="text-right">Version</Label>
          <Input id="version" name="version" value={formData.version} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">Date</Label>
          <Input id="date" name="date" value={formData.date} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="details" className="text-right">Details</Label>
          <Input id="details" name="details" value={formData.details.join(', ')} onChange={handleDetailsChange} className="col-span-3" placeholder="Detail 1, Detail 2"/>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="icon" className="text-right">Icon</Label>
          <Select value={formData.icon} onValueChange={handleIconChange}>
            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select an icon" /></SelectTrigger>
            <SelectContent>
              {roadmapIconOptions.map((iconName) => {
                const IconComponent = roadmapIconMap[iconName];
                return (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center gap-2"><IconComponent className="h-4 w-4" /><span>{iconName}</span></div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">Status</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a status" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogFooter>
    </>
  );
};


export default function ManageAboutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { maintenanceConfig, setMaintenanceConfig } = useMaintenance();
  const { stats, ownerInfo, appInfo, roadmap } = maintenanceConfig.aboutPageContent;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  const founderImage = PlaceHolderImages.find(p => p.id === ownerInfo.photoId);

  const addRoadmapItem = (item: Omit<RoadmapItem, 'id'>) => {
    setMaintenanceConfig(prev => {
        const newItem = { ...item, id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
        return {
            ...prev,
            aboutPageContent: {...prev.aboutPageContent, roadmap: [newItem, ...prev.aboutPageContent.roadmap]},
        };
    });
  };

  const editRoadmapItem = (itemToEdit: RoadmapItem) => {
    setMaintenanceConfig(prev => ({
        ...prev,
        aboutPageContent: {...prev.aboutPageContent, roadmap: prev.aboutPageContent.roadmap.map(i => (i.id === itemToEdit.id ? itemToEdit : i))},
    }));
  };

  const deleteRoadmapItem = (id: string) => {
    setMaintenanceConfig(prev => ({
      ...prev,
      aboutPageContent: {
        ...prev.aboutPageContent,
        roadmap: prev.aboutPageContent.roadmap.filter(i => i.id !== id)
      }
    }));
    setItemToDelete(null);
  };
  
  const clearAllRoadmapItems = () => {
    setMaintenanceConfig(prev => ({
      ...prev,
      aboutPageContent: {
        ...prev.aboutPageContent,
        roadmap: []
      }
    }));
    setIsClearAllDialogOpen(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
      setMaintenanceConfig(prev => ({
          ...prev,
          aboutPageContent: {
              ...prev.aboutPageContent,
              [section]: {
                  // @ts-ignore
                  ...prev.aboutPageContent[section],
                  [field]: e.target.value
              }
          }
      }));
  }

  const handleSaveAll = () => {
    // The state is already saved on change, this is just for user feedback.
    toast({ title: 'About Page Content Saved!' });
  }

  const handleAddNewRoadmap = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditRoadmap = (item: RoadmapItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveRoadmap = (itemData: Omit<RoadmapItem, 'id'> | RoadmapItem) => {
    if ('id' in itemData) {
      editRoadmapItem(itemData);
    } else {
      addRoadmapItem(itemData);
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
              <h1 className="text-xl font-bold">Edit Page Content</h1>
            </div>
          </div>
          <Button size="sm" onClick={handleSaveAll}>Save All</Button>
        </div>

        <main className="flex-1 space-y-4 pb-12">
            <Card>
                <CardHeader><CardTitle>About Page Statistics</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Happy Users</Label>
                        <Input value={stats.happyUsers} onChange={(e) => handleChange(e, 'stats', 'happyUsers')} />
                    </div>
                     <div>
                        <Label>Calculations Done</Label>
                        <Input value={stats.calculationsDone} onChange={(e) => handleChange(e, 'stats', 'calculationsDone')} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Owner Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Owner Name</Label>
                        <Input value={ownerInfo.name} onChange={(e) => handleChange(e, 'ownerInfo', 'name')} />
                    </div>
                     <div>
                        <Label>Owner Photo</Label>
                         <div className="flex items-center gap-4 mt-2">
                           <Avatar className="h-16 w-16">
                                {founderImage && <AvatarImage src={founderImage.imageUrl} alt={ownerInfo.name} />}
                                <AvatarFallback>{ownerInfo.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <Button variant="outline" size="sm" className="gap-2"><Pencil className="h-3 w-3" />Change Photo</Button>
                         </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>App Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div><Label>Version</Label><Input value={appInfo.version} onChange={(e) => handleChange(e, 'appInfo', 'version')} /></div>
                        <div><Label>Build</Label><Input value={appInfo.build} onChange={(e) => handleChange(e, 'appInfo', 'build')} /></div>
                        <div><Label>Release Channel</Label><Input value={appInfo.channel} onChange={(e) => handleChange(e, 'appInfo', 'channel')} /></div>
                        <div><Label>License</Label><Input value={appInfo.license} onChange={(e) => handleChange(e, 'appInfo', 'license')} /></div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Release Plan</CardTitle>
                    <div className="flex gap-2">
                        <AlertDialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" className="gap-2"><Trash2 className="h-4 w-4" />Clear All</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all roadmap items.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={clearAllRoadmapItems}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button size="sm" className="gap-2" onClick={handleAddNewRoadmap}><Plus className="h-4 w-4" />Add Item</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {roadmap.map((item) => (
                    <Card key={item.id} className="p-3">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-2">
                                <Label>Title</Label>
                                <Input value={item.title} readOnly />
                                <Label>Date</Label>
                                <Input value={item.date} readOnly />
                                <Label>Description</Label>
                                <Textarea value={item.description} readOnly rows={3}/>
                            </div>
                            <div className="flex flex-col ml-2 gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditRoadmap(item)}><Pencil className="h-4 w-4" /></Button>
                                <AlertDialog open={itemToDelete === item.id} onOpenChange={(open) => !open && setItemToDelete(null)}>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setItemToDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the roadmap item "{item.title}".
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteRoadmapItem(item.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </Card>
                    ))}
                </CardContent>
            </Card>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) setEditingItem(null); setIsDialogOpen(open); }}>
        <DialogContent>
          <RoadmapForm
            item={
              editingItem || {
                version: '',
                date: '',
                title: '',
                description: '',
                details: [],
                icon: 'GitBranch',
                status: 'upcoming',
              }
            }
            onSave={handleSaveRoadmap}
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

    

    

    