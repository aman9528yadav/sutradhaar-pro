"use client";

import React, { useState, useRef } from 'react';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
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
import {
    Phone,
    MapPin,
    Cake,
    Star,
    Eye,
    EyeOff,
    Trash2,
    Lock,
    User,
    Shield,
    Key,
    Camera,
    Save,
    ArrowLeft
} from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const InputField = ({ icon: Icon, label, id, value, placeholder, onChange, type = 'text', readOnly = false }: { icon?: React.ElementType, label: string, id: string, value: string, placeholder?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, readOnly?: boolean }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
        </Label>
        <div className="relative">
            <Input
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
                className={cn(
                    "bg-background/50 border-border/50 focus:bg-background transition-all pl-3",
                    readOnly && "opacity-70 cursor-not-allowed"
                )}
            />
        </div>
    </div>
);

const PasswordField = ({ label, id, value, onChange, placeholder }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    type={visible ? 'text' : 'password'}
                    placeholder={placeholder}
                    className="bg-background/50 border-border/50 focus:bg-background transition-all pr-10"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
};

export function EditProfilePage() {
    const { profile, setProfile, deleteAllUserData } = useProfile();
    const { changePassword, logout, updateUserProfile } = useAuth();
    const [formData, setFormData] = useState(profile);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                notePassword: value
            }
        }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSaveChanges = async () => {
        try {
            // Update Firebase Auth profile
            await updateUserProfile(formData.name, formData.photoUrl);

            // Update Firestore/Context profile
            setProfile(formData);

            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
            router.push('/profile');
        } catch (error) {
            console.error("Failed to save profile changes:", error);
        }
    };

    const handleChangePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwordData;
        if (newPassword !== confirmPassword) {
            toast({ title: "Passwords do not match", variant: "destructive" });
            return;
        }
        if (newPassword.length < 6) {
            toast({ title: "Password is too short", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }

        const success = await changePassword(currentPassword, newPassword);
        if (success) {
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
    };

    const handleDeleteData = async () => {
        await deleteAllUserData();
        logout();
        toast({
            title: "All Data Deleted",
            description: "Your profile and history have been permanently removed.",
        });
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                    <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
                </div>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-border/50 p-1 rounded-xl mb-6">
                    <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                        <User className="h-4 w-4 mr-2" /> Account
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                        <Shield className="h-4 w-4 mr-2" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="note-pass" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                        <Lock className="h-4 w-4 mr-2" /> Note Pass
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        {/* Avatar Section */}
                        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6 flex flex-col items-center gap-4">
                                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                    <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                                        <AvatarImage src={formData.photoUrl} alt="User Avatar" className="object-cover" />
                                        <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-purple-500 text-white">
                                            {profile.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <div className="text-center">
                                    <h3 className="font-semibold text-lg">{formData.name || 'User'}</h3>
                                    <p className="text-sm text-muted-foreground">Click to update profile picture</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Info */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Full Name" id="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
                                    <InputField label="Email" id="email" value={formData.email} readOnly icon={User} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField icon={Phone} label="Phone Number" id="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                                    <InputField icon={Cake} label="Date of Birth" id="birthday" value={formData.birthday} onChange={handleChange} placeholder="DD/MM/YYYY" />
                                </div>
                                <InputField icon={MapPin} label="Address" id="address" value={formData.address} onChange={handleChange} placeholder="Your address" />

                                <div className="space-y-2">
                                    <Label htmlFor="skills" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Star className="h-4 w-4" />
                                        Skills & Interests
                                    </Label>
                                    <Textarea
                                        id="skills"
                                        name="skills"
                                        value={formData.skills.join(', ')}
                                        onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
                                        className="bg-background/50 border-border/50 focus:bg-background min-h-[80px]"
                                        placeholder="Coding, Design, Reading..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Button size="lg" className="w-full gap-2 shadow-lg shadow-primary/20" onClick={handleSaveChanges}>
                            <Save className="h-4 w-4" /> Save Changes
                        </Button>
                    </motion.div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Key className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Change Password</h3>
                                        <p className="text-sm text-muted-foreground">Update your account password</p>
                                    </div>
                                </div>
                                <form className="space-y-4" onSubmit={handleChangePasswordSubmit}>
                                    <PasswordField label="Current Password" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" />
                                    <PasswordField label="New Password" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" />
                                    <PasswordField label="Confirm New Password" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm new password" />
                                    <Button type="submit" className="w-full">Update Password</Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                                        <Trash2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-destructive">Danger Zone</h3>
                                        <p className="text-sm text-muted-foreground">Irreversible actions</p>
                                    </div>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full gap-2">
                                            Delete All Data
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action is irreversible. All your profile information, history, notes, and settings will be permanently deleted from our servers and your device.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteData} className="bg-destructive hover:bg-destructive/90">Yes, delete everything</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="note-pass" className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Note Password</h3>
                                        <p className="text-sm text-muted-foreground">Secure your private notes with a password</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm text-yellow-600 dark:text-yellow-400">
                                        <p>Setting a password here will allow you to lock specific notes. Make sure to remember this password as it cannot be easily recovered.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notePassword">Note Access Password</Label>
                                        <Input
                                            id="notePassword"
                                            type="text"
                                            value={formData.settings?.notePassword || ''}
                                            onChange={handleNotePasswordChange}
                                            placeholder="Set a password for your notes"
                                            className="bg-background/50"
                                        />
                                        <p className="text-xs text-muted-foreground">Leave empty to disable note locking.</p>
                                    </div>

                                    <Button onClick={handleSaveChanges} className="w-full">
                                        Save Note Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>

            <div className="text-center text-xs text-muted-foreground pt-4 pb-8">
                © 2025 Sutradhar | Owned by Aman Yadav.
            </div>
        </div>
    );
}
