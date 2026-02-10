
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Sigma,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfile, CustomCategory, CustomUnit } from '@/context/ProfileContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES as defaultCategories } from '@/lib/units';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Category Form ---
const CategoryForm = ({
  category,
  onSave,
  onCancel,
}: {
  category?: CustomCategory;
  onSave: (name: string, id?: string) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(category?.name || '');

  const handleSubmit = () => {
    onSave(name, category?.id);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{category ? 'Edit' : 'Add'} Category</DialogTitle>
        <DialogDescription>
          Create a new category for your custom units (e.g., Energy, Data).
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Category</Button>
      </DialogFooter>
    </>
  );
};

// --- Unit Form ---
const UnitForm = ({
  unit,
  categoryId,
  allCategories,
  onSave,
  onCancel,
}: {
  unit?: CustomUnit;
  categoryId?: string;
  allCategories: {name: string, units: {name: string, isStandard?: boolean}[]}[];
  onSave: (unitData: Omit<CustomUnit, 'id'>, existingUnitId?: string) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Omit<CustomUnit, 'id'>>({
    name: unit?.name || '',
    symbol: unit?.symbol || '',
    categoryId: unit?.categoryId || categoryId || '',
    factor: unit?.factor || 1,
    standard: unit?.standard || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'factor' ? parseFloat(value) || 0 : value }));
  };
  
  const handleSelectChange = (name: 'categoryId' | 'standard', value: string) => {
     setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = () => {
    onSave(formData, unit?.id);
  };
  
  const selectedCategory = allCategories.find(c => c.name === formData.categoryId);

  return (
     <>
      <DialogHeader>
        <DialogTitle>{unit ? 'Edit' : 'Add'} Unit</DialogTitle>
        <DialogDescription>
          Define your custom unit and its conversion factor relative to a standard unit in the same category.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="symbol" className="text-right">Symbol</Label>
            <Input id="symbol" name="symbol" value={formData.symbol} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryId" className="text-right">Category</Label>
            <Select value={formData.categoryId} onValueChange={(v) => handleSelectChange('categoryId', v)}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                    {allCategories.map(cat => <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        {selectedCategory && (
             <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="standard" className="text-right">Base Unit</Label>
                     <Select value={formData.standard} onValueChange={(v) => handleSelectChange('standard', v)}>
                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a base unit" /></SelectTrigger>
                        <SelectContent>
                           {(selectedCategory.units || []).map(u => (
                            <SelectItem key={u.name} value={u.name}>{u.name}</SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="factor" className="text-right">Factor</Label>
                    <Input id="factor" name="factor" type="number" value={formData.factor} onChange={handleChange} className="col-span-3" />
                </div>
                <p className="col-span-4 text-xs text-muted-foreground text-center">
                    1 {formData.name || 'custom unit'} = {formData.factor} {formData.standard}
                </p>
            </>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Unit</Button>
      </DialogFooter>
   </>
  )
};


export default function CustomUnitsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, addCustomCategory, updateCustomCategory, deleteCustomCategory, addCustomUnit, updateCustomUnit, deleteCustomUnit } = useProfile();
  
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | undefined>();
  const [editingUnit, setEditingUnit] = useState<CustomUnit | undefined>();
  const [selectedCategoryIdForNewUnit, setSelectedCategoryIdForNewUnit] = useState<string | undefined>();

  const customCategories = profile.customCategories || [];
  
  const allCategories = [...defaultCategories.map(c => ({...c, id: c.name, isCustom: false})), ...customCategories.map(c => ({...c, isCustom: true}))];

  const handleSaveCategory = (name: string, id?: string) => {
    if (id) {
        updateCustomCategory({ id, name });
        toast({ title: 'Category Updated!' });
    } else {
        addCustomCategory(name);
        toast({ title: 'Category Added!' });
    }
    setIsCategoryDialogOpen(false);
    setEditingCategory(undefined);
  };
  
  const handleSaveUnit = (unitData: Omit<CustomUnit, 'id'>, existingUnitId?: string) => {
    if (existingUnitId) {
      updateCustomUnit({ ...unitData, id: existingUnitId });
      toast({ title: 'Unit Updated!' });
    } else {
      addCustomUnit(unitData);
      toast({ title: 'Unit Added!' });
    }
    setIsUnitDialogOpen(false);
    setEditingUnit(undefined);
    setSelectedCategoryIdForNewUnit(undefined);
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-[412px] flex flex-col flex-1">
        <div className="flex items-center justify-between gap-4 mb-6 pt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Custom Units</h1>
            </div>
          </div>
          <Button size="sm" className="gap-2" onClick={() => { setEditingCategory(undefined); setIsCategoryDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>

        <main className="flex-1 space-y-4 pb-12">
            <p className="text-sm text-muted-foreground">Manage your custom units and categories. You can add units to default categories or create your own.</p>
            <Accordion type="multiple" className="w-full space-y-3">
              {allCategories.map(category => {
                const unitsForCategory = (category.isCustom ? (profile.customUnits || []) : defaultCategories.find(c => c.name === category.name)?.units.filter(u => u.region !== 'Indian') || [])
                    .filter((u: any) => u.categoryId ? u.categoryId === category.name : true);

                return (
                <Card key={category.id}>
                    <AccordionItem value={category.id} className="border-b-0">
                         <CardHeader className="p-0">
                            <div className="flex justify-between items-center w-full p-3">
                                <AccordionTrigger className="w-full p-0 hover:no-underline flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-accent rounded-lg">
                                            {category.isCustom ? <Sigma className="h-5 w-5 text-primary" /> : React.createElement(category.icon, { className: 'h-5 w-5 text-primary' })}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-left">{category.name}</p>
                                            <p className="text-xs text-muted-foreground text-left">{unitsForCategory.length} units</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                {category.isCustom && (
                                    <div className="flex items-center ml-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingCategory(category); setIsCategoryDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCustomCategory(category.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <AccordionContent className="px-3 pb-3">
                            <div className="space-y-2 pt-2 border-t">
                                {unitsForCategory.map((unit: any) => (
                                <div key={unit.name} className="flex items-center justify-between p-2 rounded-md bg-accent/50">
                                    <div>
                                        <p className="font-medium text-sm">{unit.name} <span className="text-muted-foreground">({unit.symbol})</span></p>
                                        {unit.isCustom && <p className="text-xs text-muted-foreground">1 {unit.symbol} = {unit.factor} {unit.standard}</p>}
                                    </div>
                                    {unit.isCustom && (
                                        <div className="flex">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingUnit(unit); setIsUnitDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteCustomUnit(unit.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    )}
                                </div>
                                ))}
                                <Button className="w-full gap-2 mt-2" variant="outline" onClick={() => {
                                    setEditingUnit(undefined);
                                    setSelectedCategoryIdForNewUnit(category.name);
                                    setIsUnitDialogOpen(true);
                                }}>
                                    <Plus className="h-4 w-4" /> Add Unit to {category.name}
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>
              )})}
            </Accordion>
        </main>
      </div>
      
      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent>
            <CategoryForm 
                category={editingCategory} 
                onSave={handleSaveCategory} 
                onCancel={() => setIsCategoryDialogOpen(false)} 
            />
          </DialogContent>
      </Dialog>
      
      {/* Unit Dialog */}
       <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
          <DialogContent>
            <UnitForm
                unit={editingUnit}
                categoryId={selectedCategoryIdForNewUnit}
                allCategories={allCategories}
                onSave={handleSaveUnit}
                onCancel={() => setIsUnitDialogOpen(false)}
            />
          </DialogContent>
      </Dialog>
    </div>
  );
}
