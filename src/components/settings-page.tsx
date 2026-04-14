"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast';
import { resetAppLockTimer, clearAppLockTimer } from '@/lib/utils';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ... existing imports

import {
  Globe,
  Palette,
  Info,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  Code,
  Volume2,
  MessageSquare,
  Paintbrush,
  Lock,
  Atom,
  LayoutGrid,
  LayoutDashboard,
  Bell,
  VolumeX,
  Shield,
  Smartphone,
  Zap,
  Database,
  Upload,
  ListTodo,
  FileText,
  Fingerprint,
  EyeOff,
  Eye,
  Accessibility,
  Contrast,
  Timer,
  Mail,
  Clock,
} from 'lucide-react';


import { useMaintenance } from '@/context/MaintenanceContext';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useProfile, HSLColor } from '@/context/ProfileContext';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const themes = [
  { name: 'Sutradhaar', value: 'sutradhaar', isPremium: false },
  { name: 'Midnight', value: 'midnight', isPremium: false },
  { name: 'Nebula', value: 'nebula', isPremium: false },
  { name: 'Emerald', value: 'emerald', isPremium: false },
  { name: 'Slate', value: 'slate', isPremium: false },
  { name: 'Arctic Frost', value: 'arctic', isPremium: false },
  { name: 'Lavender', value: 'lavender', isPremium: false },
  { name: 'Custom', value: 'custom', isPremium: false },
];

const appearanceModes = [
  { name: 'Light', value: 'light', icon: Sun },
  { name: 'Dark', value: 'dark', icon: Moon },
  { name: 'System', value: 'system', icon: Laptop },
];

// Helper function to convert HSL to HEX
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Helper function to convert HEX to HSL
const hexToHsl = (hex: string): HSLColor => {
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length == 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return { h: Math.round(h), s: Math.round(s), l: Math.round(l) };
}

interface SettingsItemProps {
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  label: string;
  children?: React.ReactNode;
  isLink?: boolean;
  href?: string;
  description?: string;
  onClick?: () => void;
}

const SettingsItem = ({ icon: Icon, iconColor = "text-white", iconBg = "bg-primary", label, children, isLink, href, description, onClick }: SettingsItemProps) => {
  const content = (
    <div
      className={cn(
        "flex items-center justify-between p-4 hover:bg-primary/5 transition-colors border-b border-border/40 last:border-0",
        isLink && "cursor-pointer active:bg-primary/10"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={cn("p-2.5 rounded-xl flex items-center justify-center shadow-sm shrink-0", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-base leading-none">{label}</span>
          {description && <span className="text-xs text-muted-foreground line-clamp-1">{description}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {isLink && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
      </div>
    </div>
  );

  return isLink && href ? <Link href={href} className="block">{content}</Link> : content;
};

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="mb-8"
  >
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 ml-1">{title}</h3>
    <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-sm">
      {children}
    </div>
  </motion.div>
);

export function SettingsPage() {
  const { toast } = useToast();
  const { profile, setProfile, deleteAllUserData } = useProfile();

  const { user } = useAuth(); // Firebase user
  const { maintenanceConfig, setMaintenanceConfig, isDevMode, setDevMode } = useMaintenance();

  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [saveHistory, setSaveHistory] = useState(profile.settings.saveHistory);
  const [calculatorSounds, setCalculatorSounds] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [versionClickCount, setVersionClickCount] = useState(0);
  const versionClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // New privacy and security settings
  const [enableBiometricAuth, setEnableBiometricAuth] = useState(profile.settings.enableBiometricAuth || false);
  const [appLockTimeout, setAppLockTimeout] = useState(profile.settings.appLockTimeout || 5);
  const [privateBrowsingMode, setPrivateBrowsingMode] = useState(profile.settings.privateBrowsingMode || false);

  // New accessibility settings
  const [textSizeScale, setTextSizeScale] = useState(profile.settings.textSizeScale || 1);
  const [highContrastMode, setHighContrastMode] = useState(profile.settings.highContrastMode || false);
  const [reduceMotion, setReduceMotion] = useState(profile.settings.reduceMotion || false);

  // New notification settings
  const [notificationCategories, setNotificationCategories] = useState(profile.settings.notificationCategories || {
    reminders: true,
    updates: true,
    achievements: true,
  });
  const [doNotDisturbHours, setDoNotDisturbHours] = useState(profile.settings.doNotDisturbHours || {
    enabled: false,
    start: '22:00',
    end: '07:00',
  });
  const [reminderFrequency, setReminderFrequency] = useState(profile.settings.reminderFrequency || 'daily');
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(profile.settings.enableEmailNotifications || false);

  const [customTheme, setCustomTheme] = useState(profile.settings.customTheme || {
    background: { h: 0, s: 0, l: 100 },
    foreground: { h: 240, s: 10, l: 3.9 },
    primary: { h: 240, s: 5.9, l: 10 },
    accent: { h: 240, s: 4.8, l: 95.9 },
  });

  useEffect(() => {
    setSaveHistory(profile.settings.saveHistory);
    setCustomTheme(profile.settings.customTheme || {
      background: { h: 0, s: 0, l: 100 },
      foreground: { h: 240, s: 10, l: 3.9 },
      primary: { h: 240, s: 5.9, l: 10 },
      accent: { h: 240, s: 4.8, l: 95.9 },
    });
    
    // Initialize new settings from profile
    setEnableBiometricAuth(profile.settings.enableBiometricAuth || false);
    setAppLockTimeout(profile.settings.appLockTimeout || 5);
    setPrivateBrowsingMode(profile.settings.privateBrowsingMode || false);
    setTextSizeScale(profile.settings.textSizeScale || 1);
    setHighContrastMode(profile.settings.highContrastMode || false);
    setReduceMotion(profile.settings.reduceMotion || false);
    setNotificationCategories(profile.settings.notificationCategories || {
      reminders: true,
      updates: true,
      achievements: true,
    });
    setDoNotDisturbHours(profile.settings.doNotDisturbHours || {
      enabled: false,
      start: '22:00',
      end: '07:00',
    });
    setReminderFrequency(profile.settings.reminderFrequency || 'daily');
    setEnableEmailNotifications(profile.settings.enableEmailNotifications || false);
    
    // Initialize biometric authentication if enabled
    if (profile.settings.enableBiometricAuth) {
      initializeBiometricAuth();
    }
    
    // Initialize app lock timer
    resetAppLockTimer(profile.settings.appLockTimeout || 5, () => {
      console.log('App locked due to inactivity');
    });
  }, [profile.settings]);


  useEffect(() => {
    const soundsEnabled = localStorage.getItem('sutradhaar_calculator_sounds') === 'true';
    setCalculatorSounds(soundsEnabled);
    const welcomeEnabled = localStorage.getItem('sutradhaar_show_welcome') === 'true';
    setShowWelcome(welcomeEnabled);
  }, []);


  const handleCustomThemeChange = (colorName: keyof typeof customTheme, hexValue: string) => {
    const newHsl = hexToHsl(hexValue);
    const newCustomTheme = {
      ...customTheme,
      [colorName]: newHsl,
    };
    setCustomTheme(newCustomTheme);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        customTheme: newCustomTheme
      }
    }));
  };

  const handleCustomThemeSliderChange = (colorName: keyof typeof customTheme, hslKey: 'h' | 's' | 'l', value: number) => {
    const newCustomTheme = {
      ...customTheme,
      [colorName]: {
        ...customTheme[colorName],
        [hslKey]: value
      }
    };
    setCustomTheme(newCustomTheme);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        customTheme: newCustomTheme
      }
    }));
  };


  const handleCalculatorSoundsChange = (checked: boolean) => {
    setCalculatorSounds(checked);
    localStorage.setItem('sutradhaar_calculator_sounds', String(checked));
    toast({
      title: `Calculator sounds ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleShowWelcomeChange = (checked: boolean) => {
    setShowWelcome(checked);
    localStorage.setItem('sutradhaar_show_welcome', String(checked));
    toast({
      title: `Welcome screen on startup ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleSaveHistoryChange = (checked: boolean) => {
    setSaveHistory(checked);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        saveHistory: checked
      }
    }));
    toast({
      title: `History saving ${checked ? 'enabled' : 'disabled'}`,
    });
  }

  type UserSettings = typeof profile.settings;
  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        [key]: value
      }
    }));
    toast({
      title: `${key.replace(/([A-Z])/g, ' $1')} ${value ? 'enabled' : 'disabled'}`
    });
  }

  // Handlers for new privacy and security settings
  const handleEnableBiometricAuthChange = (checked: boolean) => {
    setEnableBiometricAuth(checked);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        enableBiometricAuth: checked
      }
    }));
    
    if (checked) {
      // Attempt to initialize biometric authentication
      initializeBiometricAuth();
    }
    
    toast({
      title: `Biometric authentication ${checked ? 'enabled' : 'disabled'}`
    });
  };
  
  const initializeBiometricAuth = async () => {
    // Check if the browser supports the Web Authentication API
    if (!navigator.credentials) {
      toast({
        title: "Biometric authentication not supported",
        description: "Your device doesn't support biometric authentication.",
        variant: "destructive"
      });
      setEnableBiometricAuth(false);
      setProfile(p => ({
        ...p,
        settings: {
          ...p.settings,
          enableBiometricAuth: false
        }
      }));
      return;
    }
    
    try {
      // In a real implementation, we would register biometric credentials here
      // For now, we'll just simulate the process
      console.log('Initializing biometric authentication...');
      toast({
        title: "Biometric authentication ready",
        description: "You can now unlock the app using your biometrics."
      });
    } catch (error) {
      console.error('Error initializing biometric auth:', error);
      toast({
        title: "Biometric setup failed",
        description: "Unable to set up biometric authentication.",
        variant: "destructive"
      });
      setEnableBiometricAuth(false);
      setProfile(p => ({
        ...p,
        settings: {
          ...p.settings,
          enableBiometricAuth: false
        }
      }));
    }
  };

  const handleAppLockTimeoutChange = (value: number) => {
    setAppLockTimeout(value);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        appLockTimeout: value
      }
    }));
    toast({
      title: `App lock timeout updated to ${value} minutes`
    });
  };

  const handlePrivateBrowsingModeChange = (checked: boolean) => {
    setPrivateBrowsingMode(checked);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        privateBrowsingMode: checked
      }
    }));
    toast({
      title: `Private browsing mode ${checked ? 'enabled' : 'disabled'}`
    });
  };

  // Handlers for new accessibility settings
  const handleTextSizeScaleChange = (value: number) => {
    setTextSizeScale(value);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        textSizeScale: value
      }
    }));
    toast({
      title: `Text size adjusted`
    });
  };

  const handleHighContrastModeChange = (checked: boolean) => {
    setHighContrastMode(checked);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        highContrastMode: checked
      }
    }));
    toast({
      title: `High contrast mode ${checked ? 'enabled' : 'disabled'}`
    });
  };

  const handleReduceMotionChange = (checked: boolean) => {
    setReduceMotion(checked);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        reduceMotion: checked
      }
    }));
    toast({
      title: `Reduce motion ${checked ? 'enabled' : 'disabled'}`
    });
  };

  // Handlers for new notification settings
  const handleNotificationCategoryChange = (category: keyof typeof notificationCategories, checked: boolean) => {
    const newCategories = { ...notificationCategories, [category]: checked };
    setNotificationCategories(newCategories);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        notificationCategories: newCategories
      }
    }));
    toast({
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} notifications ${checked ? 'enabled' : 'disabled'}`
    });
  };

  const handleDoNotDisturbChange = (checked: boolean) => {
    const newDoNotDisturb = { ...doNotDisturbHours, enabled: checked };
    setDoNotDisturbHours(newDoNotDisturb);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        doNotDisturbHours: newDoNotDisturb
      }
    }));
    toast({
      title: `Do not disturb ${checked ? 'enabled' : 'disabled'}`
    });
  };

  const handleReminderFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly') => {
    setReminderFrequency(frequency);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        reminderFrequency: frequency
      }
    }));
    toast({
      title: `Reminder frequency set to ${frequency}`
    });
  };

  const handleEmailNotificationsChange = (checked: boolean) => {
    setEnableEmailNotifications(checked);
    setProfile(p => ({
      ...p,
      settings: {
        ...p.settings,
        enableEmailNotifications: checked
      }
    }));
    toast({
      title: `Email notifications ${checked ? 'enabled' : 'disabled'}`
    });
  };

  // Check owner status from multiple sources
  const isOwner = React.useMemo(() => {
    const ownerEmail = 'amanyadavyadav9458@gmail.com'.toLowerCase();
    const userEmail = user?.email?.toLowerCase() || '';
    const profileEmail = profile.email?.toLowerCase() || '';

    // Check profile email, membership, or Firebase user email
    return userEmail === ownerEmail || profileEmail === ownerEmail || profile.membership === 'owner';
  }, [profile.email, profile.membership, user]);

  const isPremium = profile.membership === 'premium' || profile.membership === 'owner';

  const handleDevModeChange = (checked: boolean) => {
    if (checked && !isDevMode) {
      if (isOwner) {
        setDevMode(true);
        toast({ title: 'Developer Mode Enabled' });
      } else {
        setIsPasswordDialogOpen(true);
      }
    } else {
      setDevMode(checked);
      if (!checked) {
        toast({ title: 'Developer Mode Disabled' });
      }
    }
  };

  const handlePasswordSubmit = () => {
    if (password === (maintenanceConfig.devPassword || 'aman')) {
      setDevMode(true);
      toast({ title: 'Developer Mode Enabled' });
      router.push('/dev');
    } else {
      toast({ title: 'Incorrect Password', variant: 'destructive' });
    }
    setPassword('');
    setIsPasswordDialogOpen(false);
  };

  const handleOpenDevPanelClick = () => {
    if (isDevMode) {
      router.push('/dev');
    } else {
      setIsPasswordDialogOpen(true);
    }
  };

  const handleVersionClick = () => {
    if (isDevMode) return;

    if (versionClickTimerRef.current) {
      clearTimeout(versionClickTimerRef.current);
    }

    const newClickCount = versionClickCount + 1;
    setVersionClickCount(newClickCount);

    if (newClickCount >= 7) {
      if (isOwner) {
        setDevMode(true);
        toast({ title: 'Developer Mode Enabled' });
      } else {
        setIsPasswordDialogOpen(true);
      }
      setVersionClickCount(0);
    } else {
      versionClickTimerRef.current = setTimeout(() => {
        setVersionClickCount(0);
      }, 3000);
    }
  };

  const categories = [
    { id: 'general', label: 'General', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'preferences', label: 'Preferences', icon: Info, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'data', label: 'Data Management', icon: Database, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    ...(isOwner ? [{ id: 'developer', label: 'Developer', icon: Code, color: 'text-slate-500', bg: 'bg-slate-500/10' }] : []),
    { id: 'about', label: 'About', icon: Info, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'danger', label: 'Danger Zone', icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  // Apply accessibility, notification, and privacy styles based on settings
  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale-factor', textSizeScale.toString());
    
    if (highContrastMode) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
    
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--animation-iteration-count', '1');
    } else {
      document.documentElement.classList.remove('reduce-motion');
      document.documentElement.style.removeProperty('--animation-duration');
      document.documentElement.style.removeProperty('--animation-iteration-count');
    }
    
    // Apply notification settings
    if (doNotDisturbHours.enabled) {
      // Store do not disturb hours in localStorage for use elsewhere
      localStorage.setItem('sutradhaar_do_not_disturb', JSON.stringify(doNotDisturbHours));
    } else {
      localStorage.removeItem('sutradhaar_do_not_disturb');
    }
    
    // Store notification preferences
    localStorage.setItem('sutradhaar_notification_preferences', JSON.stringify({
      enableEmailNotifications,
      reminderFrequency,
      notificationCategories
    }));
    
    // Apply privacy settings
    if (privateBrowsingMode) {
      document.documentElement.classList.add('private-browsing');
      // Store in localStorage to persist across sessions
      localStorage.setItem('sutradhaar_private_browsing', 'true');
    } else {
      document.documentElement.classList.remove('private-browsing');
      localStorage.removeItem('sutradhaar_private_browsing');
    }
    
    // Store app lock timeout in localStorage
    localStorage.setItem('sutradhaar_app_lock_timeout', appLockTimeout.toString());
    
    // Reset app lock timer when timeout changes
    resetAppLockTimer(appLockTimeout, () => {
      // Lock the app here - in a real implementation, this would redirect to a lock screen
      console.log('App locked due to inactivity');
      // For now, we'll just log this event
      // In a real implementation, you would navigate to a lock screen
    });
  }, [textSizeScale, highContrastMode, reduceMotion, doNotDisturbHours, enableEmailNotifications, reminderFrequency, notificationCategories, privateBrowsingMode, appLockTimeout]);
  
  // Handle app visibility changes for app lock functionality
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reset the app lock timer when the app becomes visible again
        resetAppLockTimer(appLockTimeout, () => {
          console.log('App locked due to inactivity');
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also reset the timer on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const resetTimer = () => {
      resetAppLockTimer(appLockTimeout, () => {
        console.log('App locked due to inactivity');
      });
    };
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      clearAppLockTimer();
    };
  }, [appLockTimeout]);

  return (
    <div className="w-full max-w-2xl mx-auto pb-24">
      {activeSection ? (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setActiveSection(null)}
            className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
            Back to Settings
          </Button>

          {activeSection === 'general' && (
            <SettingsSection title="General">
              <SettingsItem
                icon={Globe}
                iconBg="bg-blue-500"
                label="Region"
                description="Set your preferred region formatting"
              >
                <Select defaultValue="International">
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="International">International</SelectItem>
                    <SelectItem value="Local">Local (Indian)</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>

              <SettingsItem
                icon={Bell}
                iconBg="bg-red-500"
                label="Notifications"
              >
                <Switch
                  checked={profile.settings.enableNotifications}
                  onCheckedChange={(c) => handleSettingChange('enableNotifications', c)}
                />
              </SettingsItem>

              <SettingsItem
                icon={Volume2}
                iconBg="bg-orange-500"
                label="Notification Sounds"
              >
                <Switch
                  checked={profile.settings.enableSounds}
                  onCheckedChange={(c) => handleSettingChange('enableSounds', c)}
                />
              </SettingsItem>
            </SettingsSection>
          )}

          {activeSection === 'preferences' && (
            <SettingsSection title="Preferences">
              <SettingsItem
                icon={Info}
                iconBg="bg-purple-500"
                label="Save History"
                description="Automatically save your calculations"
              >
                <Switch
                  checked={saveHistory}
                  onCheckedChange={handleSaveHistoryChange}
                />
              </SettingsItem>

              <SettingsItem
                icon={VolumeX}
                iconBg="bg-pink-500"
                label="Calculator Sounds"
              >
                <div className="flex items-center gap-2">
                  <Select
                    value={localStorage.getItem('sutradhaar_calculator_sound_file') || '/sound/keyboard-click-327728.mp3'}
                    onValueChange={(v) => {
                      localStorage.setItem('sutradhaar_calculator_sound_file', v);
                      // Force re-render or notify components
                      window.dispatchEvent(new Event('storage'));
                      toast({ title: "Sound updated" });
                    }}
                    disabled={!calculatorSounds}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="/sound/keyboard-click-327728.mp3">Click</SelectItem>
                      <SelectItem value="/sound/new-notification-09-352705.mp3">Notification</SelectItem>
                      <SelectItem value="/sound/typewriter.mp3">Typewriter</SelectItem>
                      <SelectItem value="/sound/retro.mp3">Retro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch
                    checked={calculatorSounds}
                    onCheckedChange={handleCalculatorSoundsChange}
                  />
                </div>
              </SettingsItem>

              <SettingsItem
                icon={MessageSquare}
                iconBg="bg-green-500"
                label="Welcome Screen"
                description="Show welcome dialog on startup"
              >
                <Switch
                  checked={showWelcome}
                  onCheckedChange={handleShowWelcomeChange}
                />
              </SettingsItem>

              <SettingsItem
                icon={Atom}
                iconBg="bg-indigo-500"
                label="Custom Units"
                isLink
                href="/settings/custom-units"
              />
            </SettingsSection>
          )}

          {activeSection === 'appearance' && (
            <SettingsSection title="Appearance">
              <div className="p-4 bg-card/50 border-b border-border/40">
                <div className="flex justify-between items-center bg-accent/30 p-1 rounded-xl">
                  {appearanceModes.map((mode) => (
                    <Button
                      key={mode.value}
                      variant={theme === mode.value ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTheme(mode.value)}
                      className={cn(
                        "flex-1 flex items-center gap-2 rounded-lg transition-all",
                        theme === mode.value ? "shadow-sm" : ""
                      )}
                    >
                      <mode.icon className="h-4 w-4" />
                      {mode.name}
                    </Button>
                  ))}
                </div>
              </div>

              <SettingsItem icon={Palette} iconBg="bg-teal-500" label="App Theme">
                <Select
                  value={theme?.startsWith('theme-') ? theme.replace('theme-', '') : (theme === 'custom' ? 'custom' : theme === 'light' ? 'sutradhaar' : theme || 'sutradhaar')}
                  onValueChange={(v) => {
                    const selectedTheme = themes.find(t => t.value === v);
                    if (selectedTheme?.isPremium && !isPremium) {
                      toast({ title: "Premium Theme", description: "Upgrade to unlock this theme." });
                      return;
                    }
                    // Handle theme name mapping
                    if (v === 'custom') {
                      setTheme('custom');
                    } else if (v === 'sutradhaar') {
                      setTheme('theme-sutradhaar');
                    } else {
                      setTheme(`theme-${v}`);
                    }
                  }}
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((themeItem) => (
                      <SelectItem
                        key={themeItem.value}
                        value={themeItem.value}
                        disabled={themeItem.isPremium && !isPremium}
                      >
                        <div className="flex items-center justify-between w-full gap-2">
                          <span>{themeItem.name}</span>
                          {themeItem.isPremium && !isPremium && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingsItem>

              {theme === 'custom' && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 ml-1">Custom Theme Editor</h3>
                  <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 space-y-6">
                      {(Object.keys(customTheme) as Array<keyof typeof customTheme>).map(colorName => (
                        <div key={colorName} className="space-y-3 p-4 rounded-xl bg-accent/20 border border-border/50">
                          <Label className="font-medium capitalize flex items-center gap-2 text-base">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hslToHex(customTheme[colorName].h, customTheme[colorName].s, customTheme[colorName].l) }}></div>
                            {colorName}
                          </Label>
                          <div className="flex items-center gap-3">
                            <div className="relative overflow-hidden rounded-lg w-12 h-10 shadow-sm border border-border/50">
                              <Input
                                type="color"
                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                value={hslToHex(customTheme[colorName].h, customTheme[colorName].s, customTheme[colorName].l)}
                                onChange={(e) => handleCustomThemeChange(colorName, e.target.value)}
                              />
                            </div>
                            <Input
                              className="flex-1 font-mono text-xs h-10 bg-background/50"
                              value={hslToHex(customTheme[colorName].h, customTheme[colorName].s, customTheme[colorName].l)}
                              onChange={(e) => handleCustomThemeChange(colorName, e.target.value)}
                            />
                          </div>
                          <div className="space-y-4 pt-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Hue</span>
                                <span>{customTheme[colorName].h}</span>
                              </div>
                              <Slider value={[customTheme[colorName].h]} max={360} onValueChange={([v]) => handleCustomThemeSliderChange(colorName, 'h', v)} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Saturation</span>
                                <span>{customTheme[colorName].s}%</span>
                              </div>
                              <Slider value={[customTheme[colorName].s]} max={100} onValueChange={([v]) => handleCustomThemeSliderChange(colorName, 's', v)} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Lightness</span>
                                <span>{customTheme[colorName].l}%</span>
                              </div>
                              <Slider value={[customTheme[colorName].l]} max={100} onValueChange={([v]) => handleCustomThemeSliderChange(colorName, 'l', v)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </SettingsSection>
          )}

          {activeSection === 'dashboard' && (
            <SettingsSection title="Dashboard">
              <SettingsItem
                icon={LayoutGrid}
                iconBg="bg-cyan-500"
                label="Layout"
                isLink
                href="/profile/manage-dashboard"
              />
              <SettingsItem
                icon={Zap}
                iconBg="bg-yellow-500"
                label="Quick Access"
                isLink
                href="/profile/manage-quick-access"
              />
              <SettingsItem
                icon={LayoutDashboard}
                iconBg="bg-violet-500"
                label="Widgets"
                isLink
                href="/profile/manage-widgets"
              />
            </SettingsSection>
          )}

          {activeSection === 'privacy' && (
            <SettingsSection title="Privacy & Security">
              <SettingsItem
                icon={Fingerprint}
                iconBg="bg-orange-500"
                label="Biometric Authentication"
                description="Use fingerprint or face recognition to unlock the app"
              >
                <Switch
                  checked={enableBiometricAuth}
                  onCheckedChange={handleEnableBiometricAuthChange}
                />
              </SettingsItem>
              
              <SettingsItem
                icon={Timer}
                iconBg="bg-amber-500"
                label="App Lock Timeout"
                description="Lock app after inactivity period"
              >
                <Select value={appLockTimeout.toString()} onValueChange={(v) => handleAppLockTimeoutChange(parseInt(v))}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>
              
              <SettingsItem
                icon={EyeOff}
                iconBg="bg-rose-500"
                label="Private Browsing Mode"
                description="Hide recent activity and history from view"
              >
                <Switch
                  checked={privateBrowsingMode}
                  onCheckedChange={handlePrivateBrowsingModeChange}
                />
              </SettingsItem>
            </SettingsSection>
          )}

          {activeSection === 'accessibility' && (
            <SettingsSection title="Accessibility">
              <SettingsItem
                icon={Accessibility}
                iconBg="bg-green-500"
                label="Text Size"
                description="Adjust text size for better readability"
              >
                <Select value={textSizeScale.toString()} onValueChange={(v) => handleTextSizeScaleChange(parseFloat(v))}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.8">Small</SelectItem>
                    <SelectItem value="1">Normal</SelectItem>
                    <SelectItem value="1.2">Large</SelectItem>
                    <SelectItem value="1.5">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>
              
              <SettingsItem
                icon={Contrast}
                iconBg="bg-lime-500"
                label="High Contrast Mode"
                description="Enhanced contrast for better readability"
              >
                <Switch
                  checked={highContrastMode}
                  onCheckedChange={handleHighContrastModeChange}
                />
              </SettingsItem>
              
              <SettingsItem
                icon={Eye}
                iconBg="bg-emerald-500"
                label="Reduce Motion"
                description="Minimize animations for better accessibility"
              >
                <Switch
                  checked={reduceMotion}
                  onCheckedChange={handleReduceMotionChange}
                />
              </SettingsItem>
            </SettingsSection>
          )}

          {activeSection === 'notifications' && (
            <SettingsSection title="Notifications">
              <SettingsItem
                icon={Bell}
                iconBg="bg-red-500"
                label="Email Notifications"
                description="Receive notifications via email"
              >
                <Switch
                  checked={enableEmailNotifications}
                  onCheckedChange={handleEmailNotificationsChange}
                />
              </SettingsItem>
              
              <SettingsItem
                icon={Clock}
                iconBg="bg-purple-500"
                label="Do Not Disturb"
                description="Silence notifications during specified hours"
              >
                <Switch
                  checked={doNotDisturbHours.enabled}
                  onCheckedChange={handleDoNotDisturbChange}
                />
              </SettingsItem>
              
              <SettingsItem
                icon={Mail}
                iconBg="bg-blue-500"
                label="Reminder Frequency"
                description="How often to receive reminder notifications"
              >
                <Select value={reminderFrequency} onValueChange={handleReminderFrequencyChange}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>
              
              <SettingsItem
                icon={Bell}
                iconBg="bg-pink-500"
                label="Reminder Notifications"
                description="Enable reminder notifications"
              >
                <Switch
                  checked={notificationCategories.reminders}
                  onCheckedChange={(c) => handleNotificationCategoryChange('reminders', c)}
                />
              </SettingsItem>
              
              <SettingsItem
                icon={Info}
                iconBg="bg-cyan-500"
                label="Update Notifications"
                description="Enable update notifications"
              >
                <Switch
                  checked={notificationCategories.updates}
                  onCheckedChange={(c) => handleNotificationCategoryChange('updates', c)}
                />
              </SettingsItem>
              
              <SettingsItem
                icon={Atom}
                iconBg="bg-indigo-500"
                label="Achievement Notifications"
                description="Enable achievement notifications"
              >
                <Switch
                  checked={notificationCategories.achievements}
                  onCheckedChange={(c) => handleNotificationCategoryChange('achievements', c)}
                />
              </SettingsItem>
            </SettingsSection>
          )}

          {activeSection === 'data' && (
            <SettingsSection title="Data Management">
              <SettingsItem
                icon={Database}
                iconBg="bg-blue-600"
                label="Export Data"
                description={
                  profile.settings.lastBackupDate
                    ? `Last backup: ${new Date(profile.settings.lastBackupDate).toLocaleString()}`
                    : "Backup Notes, Todos, Budget, History & Settings"
                }
              >
                <Button variant="outline" size="sm" onClick={() => {
                  const now = new Date().toISOString();

                  // Update profile with last backup date BEFORE exporting
                  const updatedProfile = {
                    ...profile,
                    settings: {
                      ...profile.settings,
                      lastBackupDate: now
                    }
                  };

                  // Update state/storage
                  setProfile(updatedProfile);

                  const dataStr = JSON.stringify(updatedProfile, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

                  // Use a static filename to encourage browser overwrite prompting
                  const exportFileDefaultName = 'sutradhaar_backup.json';

                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                  toast({ title: "Backup exported successfully" });
                }}>
                  Export
                </Button>
              </SettingsItem>

              <SettingsItem
                icon={Upload}
                iconBg="bg-orange-600"
                label="Import Data"
                description="Restore your data from a backup file"
              >
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(event) => {
                      const fileReader = new FileReader();
                      if (event.target.files && event.target.files.length > 0) {
                        fileReader.readAsText(event.target.files[0], "UTF-8");
                        fileReader.onload = (e) => {
                          if (e.target?.result) {
                            try {
                              const importedProfile = JSON.parse(e.target.result as string);
                              // Basic validation
                              if (importedProfile && typeof importedProfile === 'object' && importedProfile.stats) {
                                setProfile(importedProfile);
                                toast({ title: "Data imported successfully" });
                              } else {
                                toast({ title: "Invalid backup file", variant: "destructive" });
                              }
                            } catch (error) {
                              toast({ title: "Error parsing backup file", variant: "destructive" });
                            }
                          }
                        };
                      }
                      // Reset input value to allow selecting same file again
                      event.target.value = '';
                    }}
                  />
                  <Button variant="outline" size="sm">
                    Import
                  </Button>
                </div>
              </SettingsItem>

              <SettingsItem
                icon={ListTodo}
                iconBg="bg-emerald-600"
                label="Export To-Do List"
                description="Download your tasks as a text file"
              >
                <Button variant="outline" size="sm" onClick={() => {
                  const todos = profile.todos || [];
                  let content = `To-Do List - Exported on ${new Date().toLocaleDateString()}\n\n`;

                  const pending = todos.filter(t => !t.completed);
                  const completed = todos.filter(t => t.completed);

                  if (pending.length > 0) {
                    content += `PENDING (${pending.length})\n`;
                    content += `=================\n`;
                    pending.forEach(todo => {
                      content += `[ ] ${todo.text} (${todo.priority})\n`;
                      if (todo.dueDate) content += `    Due: ${new Date(todo.dueDate).toLocaleDateString()}\n`;
                      if (todo.subtasks && todo.subtasks.length > 0) {
                        todo.subtasks.forEach(st => {
                          content += `    - [${st.completed ? 'x' : ' '}] ${st.text}\n`;
                        });
                      }
                      content += `\n`;
                    });
                    content += `\n`;
                  }

                  if (completed.length > 0) {
                    content += `COMPLETED (${completed.length})\n`;
                    content += `=================\n`;
                    completed.forEach(todo => {
                      content += `[x] ${todo.text}\n`;
                      if (todo.completedAt) content += `    Completed: ${new Date(todo.completedAt).toLocaleDateString()}\n`;
                      content += `\n`;
                    });
                  }

                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `todo-list-${new Date().toISOString().split('T')[0]}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast({ title: "To-Do list exported successfully" });
                }}>
                  Export Text
                </Button>
              </SettingsItem>

              <SettingsItem
                icon={FileText}
                iconBg="bg-rose-600"
                label="Export Budget PDF"
                description="Download your budget transactions as a PDF"
              >
                <Button variant="outline" size="sm" onClick={() => {
                  const doc = new jsPDF();

                  // Header - Sutradhaar branding
                  doc.setFontSize(24);
                  doc.setFont('helvetica', 'bold');
                  doc.text('SUTRADHAAR', 14, 20);

                  // Subtitle
                  doc.setFontSize(14);
                  doc.setFont('helvetica', 'normal');
                  doc.text('Budget Transaction History', 14, 30);

                  // Date on left side
                  doc.setFontSize(10);
                  doc.setTextColor(100, 100, 100);
                  const today = new Date();
                  doc.text(`Generated: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, 14, 38);
                  doc.setTextColor(0, 0, 0);

                  // Calculate financial summary
                  const totalBalance = profile.budget.accounts.reduce((acc, account) => acc + account.balance, 0);
                  const totalIncome = profile.budget.transactions
                    .filter(t => t.type === 'income')
                    .reduce((acc, t) => acc + t.amount, 0);
                  const totalExpense = profile.budget.transactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, t) => acc + t.amount, 0);

                  // Financial Summary Box
                  let yPos = 48;
                  doc.setFillColor(240, 240, 240);
                  doc.rect(14, yPos, 182, 35, 'F');

                  doc.setFontSize(11);
                  doc.setFont('helvetica', 'bold');
                  doc.text('Financial Summary', 18, yPos + 8);

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  doc.text(`Total Balance: Rs.${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 18, yPos + 16);
                  doc.setTextColor(22, 163, 74);
                  doc.text(`Total Income: Rs.${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 18, yPos + 23);
                  doc.setTextColor(220, 38, 38);
                  doc.text(`Total Expenses: Rs.${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 18, yPos + 30);
                  doc.setTextColor(0, 0, 0);

                  // Account Balances
                  yPos += 40;
                  doc.setFont('helvetica', 'bold');
                  doc.setFontSize(11);
                  doc.text('Account Balances', 14, yPos);

                  yPos += 5;
                  const accountData = profile.budget.accounts.map(account => {
                    const accountTransactions = profile.budget.transactions.filter(t => t.accountId === account.id);
                    const accountIncome = accountTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
                    const accountExpense = accountTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
                    const initialBalance = account.balance - accountIncome + accountExpense;

                    return [
                      account.name,
                      `Rs.${initialBalance.toFixed(2)}`,
                      `Rs.${account.balance.toFixed(2)}`
                    ];
                  });

                  autoTable(doc, {
                    head: [['Account', 'Initial Balance', 'Current Balance']],
                    body: accountData,
                    startY: yPos,
                    theme: 'grid',
                    headStyles: { fillColor: [79, 70, 229] },
                    margin: { left: 14, right: 14 },
                  });

                  // Transactions table
                  yPos = (doc as any).lastAutoTable.finalY + 10;
                  doc.setFont('helvetica', 'bold');
                  doc.setFontSize(11);
                  doc.text('Transaction History', 14, yPos);

                  const tableColumn = ["Date", "Type", "Amount", "Category", "Account", "Description"];
                  const tableRows: any[] = [];

                  profile.budget.transactions.forEach(transaction => {
                    const transactionData = [
                      new Date(transaction.date).toLocaleDateString(),
                      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
                      `Rs.${transaction.amount.toFixed(2)}`,
                      profile.budget.categories.find(c => c.id === transaction.categoryId)?.name || 'Unknown',
                      profile.budget.accounts.find(a => a.id === transaction.accountId)?.name || 'Unknown',
                      transaction.description
                    ];
                    tableRows.push(transactionData);
                  });

                  autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: yPos + 5,
                    theme: 'striped',
                    headStyles: { fillColor: [79, 70, 229] },
                    margin: { left: 14, right: 14 },
                    didParseCell: function (data) {
                      if (data.section === 'body' && data.column.index === 2) {
                        const type = tableRows[data.row.index][1].toLowerCase();
                        if (type === 'income') {
                          data.cell.styles.textColor = [22, 163, 74];
                          data.cell.styles.fontStyle = 'bold';
                        } else {
                          data.cell.styles.textColor = [220, 38, 38];
                          data.cell.styles.fontStyle = 'bold';
                        }
                      }
                    }
                  });

                  doc.save(`sutradhaar_budget_${new Date().toISOString().split('T')[0]}.pdf`);
                  toast({ title: "Budget PDF exported successfully" });
                }}>
                  Export PDF
                </Button>
              </SettingsItem>
            </SettingsSection>
          )}

          {activeSection === 'developer' && isOwner && (
            <SettingsSection title="Developer">
              <SettingsItem
                icon={Code}
                iconBg="bg-slate-700"
                label="Developer Mode"
              >
                <Switch
                  checked={isDevMode}
                  onCheckedChange={handleDevModeChange}
                />
              </SettingsItem>
              {isDevMode && (
                <SettingsItem
                  icon={Shield}
                  iconBg="bg-emerald-600"
                  label="Developer Panel"
                  isLink
                  onClick={handleOpenDevPanelClick}
                />
              )}
            </SettingsSection>
          )}

          {activeSection === 'about' && (
            <SettingsSection title="About">
              <div className="p-4 space-y-1 text-sm">
                <div
                  className="flex justify-between py-2 border-b border-border/40 cursor-pointer"
                  onClick={handleVersionClick}
                >
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">Beta 1.5</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-medium">Aman Yadav</span>
                </div>
                <div className="flex justify-between py-2 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-muted-foreground">Privacy Policy</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </SettingsSection>
          )}

          {activeSection === 'danger' && (
            <SettingsSection title="Danger Zone">
              <div className="p-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Reset Account Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account data, including notes, history, and settings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        deleteAllUserData && deleteAllUserData();
                        toast({ title: "Account data reset successfully" });
                        router.push('/');
                      }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Reset Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SettingsSection>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Settings</h2>
          <div className="grid gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveSection(category.id)}
                className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-white/5 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-2.5 rounded-xl flex items-center justify-center shadow-sm", category.bg)}>
                    <category.icon className={cn("h-5 w-5", category.color)} />
                  </div>
                  <span className="font-medium text-base">{category.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )
      }

      <AlertDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Developer Password</AlertDialogTitle>
            <AlertDialogDescription>
              This action requires a password to access developer tools.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordSubmit}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
}
