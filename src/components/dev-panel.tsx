"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  Clock,
  Shield,
  Trash,
  Megaphone,
  Pencil,
  ChevronRight,
  Send,
  KeyRound,
  MessageSquare,
  Gem,
  Download,
  Flag,
  Bell,
  LayoutDashboard,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMaintenance } from '@/context/MaintenanceContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import Link from 'next/link';
import { ref, set, remove, onValue, off } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
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
} from "@/components/ui/alert-dialog"
import { useProfile } from '@/context/ProfileContext';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const appPages = [
  { name: 'Dashboard', path: '/' },
  { name: 'Converter', path: '/converter' },
  { name: 'Calculator', path: '/calculator' },
  { name: 'Date Calculator', path: '/date-calculator' },
  { name: 'Timer', path: '/timer' },
  { name: 'Stopwatch', path: '/stopwatch' },
  { name: 'History', path: '/history' },
  { name: 'Notes', path: '/notes' },
  { name: 'Todo', path: '/todo' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Profile', path: '/profile' },
  { name: 'Settings', path: '/settings' },
  { name: 'About', path: '/about' },
  { name: 'What\'s New', path: '/whats-new' },
  { name: 'Membership', path: '/membership' },
];

const sanitizePathForKey = (path: string) => {
  return path.replace(/\//g, '_');
};

type TabId = 'maintenance' | 'banner' | 'updates' | 'content' | 'ui' | 'welcome' | 'premium' | 'pricing' | 'broadcast' | 'flags' | 'security';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const tabs: TabConfig[] = [
  { id: 'maintenance', label: 'Maintenance', icon: Clock, description: 'Control app-wide maintenance state.', color: 'text-orange-500' },
  { id: 'banner', label: 'Dashboard Banner', icon: Megaphone, description: 'Control the promotional banner content.', color: 'text-blue-500' },
  { id: 'updates', label: 'App Update', icon: Download, description: 'Manage APK download banner.', color: 'text-green-500' },
  { id: 'content', label: 'Content', icon: Pencil, description: 'Edit content for various app pages.', color: 'text-purple-500' },
  { id: 'ui', label: 'UI & Messaging', icon: Bell, description: 'Test and edit UI components and messages.', color: 'text-pink-500' },
  { id: 'welcome', label: 'Welcome Dialog', icon: MessageSquare, description: 'Edit the welcome dialog content.', color: 'text-indigo-500' },
  { id: 'premium', label: 'Premium Criteria', icon: Gem, description: 'Set goals for premium membership upgrade.', color: 'text-yellow-500' },
  { id: 'pricing', label: 'Pricing', icon: Gem, description: 'Manage membership pricing.', color: 'text-emerald-500' },
  { id: 'broadcast', label: 'Broadcast', icon: Send, description: 'Send a real-time message to all users.', color: 'text-cyan-500' },
  { id: 'flags', label: 'Feature Flags', icon: Flag, description: 'Toggle experimental features on and off.', color: 'text-red-500' },
  { id: 'security', label: 'Security & Data', icon: Shield, description: 'Manage developer access and clear local data.', color: 'text-slate-500' },
];

export function DevPanel() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    maintenanceConfig,
    setMaintenanceConfig,
    isLoading,
  } = useMaintenance();
  const { globalMaintenance, pageMaintenance, dashboardBanner, maintenanceMessage, devPassword, welcomeDialog, maintenanceTargetDate, premiumCriteria, maintenanceCards, appUpdate, featureFlags, noteSavedToast } = maintenanceConfig;
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const { clearAllHistory } = useProfile();
  const [passwordState, setPasswordState] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [toastData, setToastData] = useState({ title: 'Test Toast', description: 'This is a test message.' });

  const [activeTab, setActiveTab] = useState<TabId | null>(null);

  useEffect(() => {
    if (!rtdb) return;
    const messageRef = ref(rtdb, 'broadcast/message');
    const listener = onValue(messageRef, (snapshot) => {
      if (snapshot.exists()) {
        setBroadcastMessage(snapshot.val().text || '');
      } else {
        setBroadcastMessage('');
      }
    });

    return () => {
      off(messageRef, 'value', listener);
    }
  }, []);


  const handleGlobalMaintenanceChange = (checked: boolean) => {
    setMaintenanceConfig(prev => ({ ...prev, globalMaintenance: checked }));
    toast({
      title: `Global Maintenance ${checked ? 'Enabled' : 'Disabled'}`,
    });
  };

  const handlePageMaintenanceChange = (path: string, checked: boolean) => {
    const key = sanitizePathForKey(path);
    setMaintenanceConfig(prev => ({
      ...prev,
      pageMaintenance: {
        ...prev.pageMaintenance,
        [key]: checked
      }
    }));
    toast({
      title: `Maintenance for ${path} ${checked ? 'Enabled' : 'Disabled'}`,
    });
  };

  const handleFeatureFlagChange = (flag: string, checked: boolean) => {
    setMaintenanceConfig(prev => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        [flag]: {
          ...prev.featureFlags[flag],
          enabled: checked,
        }
      }
    }));
    toast({
      title: `Feature flag '${flag}' ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleClearLocalStorage = () => {
    try {
      localStorage.clear();
      clearAllHistory('all');
      toast({
        title: "Local Storage Cleared",
        description: "All application data stored in your browser has been cleared.",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not clear local storage.",
        variant: "destructive",
      });
    }
  }

  const handleBannerChange = (field: string, value: any) => {
    setMaintenanceConfig(prev => ({
      ...prev,
      dashboardBanner: {
        ...prev.dashboardBanner,
        [field]: value
      }
    }));
  }

  const handleMaintenanceTargetDateChange = (value: string) => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setMaintenanceConfig(prev => ({
          ...prev,
          maintenanceTargetDate: date.toISOString()
        }));
      }
    }
  };

  const handleMaintenanceMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMaintenanceConfig(prev => ({ ...prev, maintenanceMessage: e.target.value }));
  }

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) {
      toast({ title: 'Cannot send empty message', variant: 'destructive' });
      return;
    }
    if (!rtdb) {
      toast({ title: 'RTDB not available', variant: 'destructive' });
      return;
    }
    const messageRef = ref(rtdb, 'broadcast/message');
    set(messageRef, {
      text: broadcastMessage,
      timestamp: new Date().toISOString(),
    })
      .then(() => {
        toast({ title: 'Broadcast Sent!' });
      })
      .catch((error) => {
        toast({ title: 'Broadcast Failed', description: error.message, variant: 'destructive' });
      });
  };

  const handleClearBroadcast = () => {
    if (!rtdb) {
      toast({ title: 'RTDB not available', variant: 'destructive' });
      return;
    }
    const messageRef = ref(rtdb, 'broadcast/message');
    remove(messageRef)
      .then(() => {
        toast({ title: 'Broadcast message cleared from database.' });
        setBroadcastMessage('');
      })
      .catch((error) => {
        toast({
          title: 'Error Clearing Broadcast',
          description: error.message,
          variant: 'destructive',
        });
      });
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordState(prev => ({ ...prev, [name]: value }));
  }

  const handleChangeDevPassword = () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordState;
    if (currentPassword !== (devPassword || 'aman')) {
      toast({ title: "Incorrect Current Password", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 4) {
      toast({ title: "Password is too short", variant: "destructive" });
      return;
    }

    setMaintenanceConfig(prev => ({ ...prev, devPassword: newPassword }));
    toast({ title: "Developer password updated successfully!" });
    setPasswordState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleWelcomeDialogChange = (field: 'title' | 'description', value: string) => {
    setMaintenanceConfig(prev => ({
      ...prev,
      welcomeDialog: {
        ...prev.welcomeDialog,
        [field]: value
      }
    }));
  }

  const handlePremiumCriteriaChange = (field: 'activities' | 'streak', value: string) => {
    setMaintenanceConfig(prev => ({
      ...prev,
      premiumCriteria: {
        ...prev.premiumCriteria,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleMaintenanceCardChange = (index: number, field: 'title' | 'description', value: string) => {
    setMaintenanceConfig(prev => {
      const newCards = [...prev.maintenanceCards];
      newCards[index] = { ...newCards[index], [field]: value };
      return { ...prev, maintenanceCards: newCards };
    });
  };

  const handleAppUpdateChange = (field: keyof typeof appUpdate, value: any) => {
    setMaintenanceConfig(prev => ({
      ...prev,
      appUpdate: {
        ...prev.appUpdate,
        [field]: value
      }
    }));
  };

  const handleToastInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setToastData(prev => ({ ...prev, [name]: value }));
  };

  const handleNoteSavedToastChange = (field: 'title' | 'description', value: string) => {
    setMaintenanceConfig(prev => ({
      ...prev,
      noteSavedToast: {
        ...prev.noteSavedToast,
        [field]: value
      }
    }));
  };

  const handleShowToast = () => {
    toast({
      title: toastData.title,
      description: toastData.description,
    });
  };


  const formatDateTimeForInput = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch (e) {
      return '';
    }
  };

  const handlePricingChange = (field: 'monthly' | 'yearly' | 'currency', value: string) => {
    setMaintenanceConfig(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'maintenance':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Maintenance</CardTitle>
                  <CardDescription>Redirects all users to the maintenance site.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Label htmlFor="global-maintenance" className="font-medium">Enable Global Maintenance</Label>
                  {isLoading ? (
                    <div className="animate-pulse bg-muted h-6 w-11 rounded-full"></div>
                  ) : (
                    <Switch
                      id="global-maintenance"
                      checked={globalMaintenance}
                      onCheckedChange={handleGlobalMaintenanceChange}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Page-Specific Maintenance</CardTitle>
                  <CardDescription>Enable maintenance for specific routes.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {appPages.map(page => (
                    <div key={page.path} className="flex items-center justify-between border p-3 rounded-lg">
                      <Label htmlFor={`page-maintenance-${page.path}`} className="text-sm font-normal">{page.name}</Label>
                      <Switch
                        id={`page-maintenance-${page.path}`}
                        checked={!!pageMaintenance[sanitizePathForKey(page.path)]}
                        onCheckedChange={(checked) => handlePageMaintenanceChange(page.path, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Page Settings</CardTitle>
                  <CardDescription>Configure the countdown and message shown during maintenance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={formatDateTimeForInput(maintenanceTargetDate)}
                      onChange={(e) => handleMaintenanceTargetDateChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-message">Message</Label>
                    <Textarea id="maintenance-message" value={maintenanceMessage} onChange={handleMaintenanceMessageChange} rows={4} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Info Cards</CardTitle>
                  <CardDescription>Information displayed on the maintenance page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {maintenanceCards.map((card, index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-2">
                      <Label htmlFor={`card-title-${index}`} className="font-semibold">Card {index + 1}</Label>
                      <Input
                        id={`card-title-${index}`}
                        placeholder="Title"
                        value={card.title}
                        onChange={(e) => handleMaintenanceCardChange(index, 'title', e.target.value)}
                        className="mb-2"
                      />
                      <Textarea
                        id={`card-desc-${index}`}
                        placeholder="Description"
                        value={card.description}
                        onChange={(e) => handleMaintenanceCardChange(index, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'banner':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Banner Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <Label htmlFor="show-banner">Show Banner</Label>
                  <Switch id="show-banner" checked={dashboardBanner.show} onCheckedChange={(c) => handleBannerChange('show', c)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner-target-date">Countdown Target</Label>
                  <Input
                    id="banner-target-date"
                    type="datetime-local"
                    value={formatDateTimeForInput(dashboardBanner.targetDate)}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (dateValue) {
                        const date = new Date(dateValue);
                        if (!isNaN(date.getTime())) {
                          handleBannerChange('targetDate', date.toISOString());
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner-category">Category Tag</Label>
                  <Input id="banner-category" value={dashboardBanner.category} onChange={e => handleBannerChange('category', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner-details">Feature Details</Label>
                  <Textarea id="banner-details" value={dashboardBanner.upcomingFeatureDetails} onChange={e => handleBannerChange('upcomingFeatureDetails', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'updates':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <Label htmlFor="show-app-update">Show Download Banner</Label>
                  <Switch id="show-app-update" checked={appUpdate.showBanner} onCheckedChange={(c) => handleAppUpdateChange('showBanner', c)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-version">App Version</Label>
                  <Input id="app-version" value={appUpdate.version} onChange={e => handleAppUpdateChange('version', e.target.value)} placeholder="e.g., 1.5.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-url">Download URL</Label>
                  <Input id="app-url" value={appUpdate.url} onChange={e => handleAppUpdateChange('url', e.target.value)} placeholder="https://example.com/app.apk" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-release-notes">Release Notes</Label>
                  <Textarea id="app-release-notes" value={appUpdate.releaseNotes} onChange={e => handleAppUpdateChange('releaseNotes', e.target.value)} rows={4} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'content':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: 'Manage "What\'s New"', href: '/dev/manage-updates' },
                { label: 'Manage "About" Page', href: '/dev/manage-about' },
                { label: 'Manage "Coming Soon"', href: '/dev/manage-coming-soon' },
                { label: 'Manage Membership', href: '/dev/manage-membership' },
              ].map((link) => (
                <Button key={link.href} asChild variant="outline" className="h-auto py-4 justify-between">
                  <Link href={link.href}>
                    {link.label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        );
      case 'ui':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Note Saved Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="note-toast-title">Title</Label>
                  <Input id="note-toast-title" value={noteSavedToast.title} onChange={(e) => handleNoteSavedToastChange('title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note-toast-desc">Description</Label>
                  <Textarea id="note-toast-desc" value={noteSavedToast.description} onChange={(e) => handleNoteSavedToastChange('description', e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Test Toast</CardTitle>
                <CardDescription>Trigger a test toast to verify styling.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input name="title" placeholder="Toast Title" value={toastData.title} onChange={handleToastInputChange} />
                <Textarea name="description" placeholder="Toast Description" value={toastData.description} onChange={handleToastInputChange} />
                <Button onClick={handleShowToast}>Show Toast</Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'welcome':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="welcome-title">Title</Label>
                  <Input id="welcome-title" value={welcomeDialog.title} onChange={e => handleWelcomeDialogChange('title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-description">Description</Label>
                  <Textarea id="welcome-description" value={welcomeDialog.description} onChange={e => handleWelcomeDialogChange('description', e.target.value)} rows={4} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'premium':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="premium-activities">All-Time Activities Goal</Label>
                  <Input id="premium-activities" type="number" value={premiumCriteria.activities} onChange={e => handlePremiumCriteriaChange('activities', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premium-streak">Streak Goal (days)</Label>
                  <Input id="premium-streak" type="number" value={premiumCriteria.streak} onChange={e => handlePremiumCriteriaChange('streak', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'pricing':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Configuration</CardTitle>
                <CardDescription>Manage membership pricing details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price-monthly">Monthly Price</Label>
                    <Input
                      id="price-monthly"
                      value={maintenanceConfig.pricing?.monthly || ''}
                      onChange={e => handlePricingChange('monthly', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-yearly">Yearly Price</Label>
                    <Input
                      id="price-yearly"
                      value={maintenanceConfig.pricing?.yearly || ''}
                      onChange={e => handlePricingChange('yearly', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-currency">Currency Symbol</Label>
                  <Input
                    id="price-currency"
                    value={maintenanceConfig.pricing?.currency || ''}
                    onChange={e => handlePricingChange('currency', e.target.value)}
                    className="w-24"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'broadcast':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <Textarea
                  placeholder="Type your broadcast message here..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClearBroadcast} className="flex-1">
                    <Trash className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                  <Button onClick={handleSendBroadcast} className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    Send Broadcast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'flags':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4">
              {Object.entries(featureFlags).map(([key, flag]) => (
                <Card key={key}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <Label htmlFor={`flag-${key}`} className="font-medium text-base">{key}</Label>
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                    </div>
                    <Switch
                      id={`flag-${key}`}
                      checked={flag.enabled}
                      onCheckedChange={(checked) => handleFeatureFlagChange(key, checked)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Change Developer Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input name="currentPassword" type="password" placeholder="Current Password" value={passwordState.currentPassword} onChange={handlePasswordInputChange} />
                <Input name="newPassword" type="password" placeholder="New Password" value={passwordState.newPassword} onChange={handlePasswordInputChange} />
                <Input name="confirmNewPassword" type="password" placeholder="Confirm New Password" value={passwordState.confirmNewPassword} onChange={handlePasswordInputChange} />
                <Button className="w-full" onClick={handleChangeDevPassword}>Change Password</Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full gap-2">
                      <Trash className="h-4 w-4" />
                      Clear All Local Storage
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will clear all local storage, including history, profile, and settings for guest users. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearLocalStorage}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeTab && (
              <Button variant="ghost" size="icon" onClick={() => setActiveTab(null)} className="rounded-full">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {activeTab ? tabs.find(t => t.id === activeTab)?.label : 'Developer Panel'}
              </h1>
              <p className="text-muted-foreground">
                {activeTab ? tabs.find(t => t.id === activeTab)?.description : 'Manage your application settings and tools.'}
              </p>
            </div>
          </div>
          {!activeTab && (
            <Button variant="outline" onClick={() => router.push('/')}>
              Exit Panel
            </Button>
          )}
        </div>

        <Separator />

        {/* Main Grid Navigation */}
        {!activeTab ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {tabs.map((tab) => (
              <Card
                key={tab.id}
                className="group hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg relative overflow-hidden border-muted-foreground/20"
                onClick={() => setActiveTab(tab.id)}
              >
                <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", tab.color)}>
                  <tab.icon className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
                </div>
                <CardHeader className="flex flex-col items-start gap-4 space-y-0 pb-6 relative z-10">
                  <div className={cn("p-3 rounded-xl bg-secondary/50 group-hover:bg-secondary transition-colors shrink-0", tab.color)}>
                    <tab.icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-2 w-full">
                    <CardTitle className="text-xl font-semibold leading-tight tracking-tight break-words">
                      {tab.label}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                      {tab.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          /* Detail View */
          <div className="max-w-3xl mx-auto">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
}
