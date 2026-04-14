
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ref, onValue, set } from 'firebase/database';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { rtdb } from '@/lib/firebase';
import type { Icon as LucideIcon } from 'lucide-react';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { useProfile } from './ProfileContext';


export type UpdateItem = {
    id: string;
    icon: 'Wrench' | 'Rocket' | 'User' | 'Languages' | 'Bug';
    title: string;
    date: string;
    description: string;
    tags: string[];
};

export type RoadmapItem = {
    id: string;
    version: string;
    date: string;
    title: string;
    description: string;
    details: string[];
    icon: 'GitBranch' | 'Sparkles';
    status: 'completed' | 'upcoming';
};

export type ComingSoonItem = {
    id: string;
    icon: 'Sparkles' | 'Wand2' | 'Share2' | 'Bot';
    title: string;
    description: string;
};

export type MembershipFeature = {
    id: string;
    feature: string;
    member: boolean;
    premium: boolean;
};

type AboutPageContent = {
    stats: {
        happyUsers: string;
        calculationsDone: string;
    };
    ownerInfo: {
        name: string;
        photoId: string;
    };
    appInfo: {
        version: string;
        build: string;
        channel: string;
        license: string;
    };
    roadmap: RoadmapItem[];
};

type WelcomeDialogContent = {
    title: string;
    description: string;
};


export type Countdown = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

export type MaintenanceCard = {
    title: string;
    description: string;
};

export type AppUpdateConfig = {
    showBanner: boolean;
    version: string;
    url: string;
    releaseNotes: string;
};

export type FeatureFlags = {
    [key: string]: {
        enabled: boolean;
        description: string;
    }
}

export type ToastNotificationConfig = {
    title: string;
    description: string;
}

export type MaintenanceConfig = {
    globalMaintenance: boolean;
    pageMaintenance: { [key: string]: boolean };
    devPassword?: string;
    dashboardBanner: {
        show: boolean;
        targetDate: string;
        category: string;
        upcomingFeatureDetails: string;
    };
    maintenanceTargetDate: string;
    maintenanceMessage: string;
    maintenanceCards: MaintenanceCard[];
    updateItems: UpdateItem[];
    aboutPageContent: AboutPageContent;
    comingSoonItems: ComingSoonItem[];
    welcomeDialog: WelcomeDialogContent;
    membershipFeatures: MembershipFeature[];
    premiumCriteria: {
        activities: number;
        streak: number;
    };
    pricing: {
        monthly: string;
        yearly: string;
        currency: string;
    };
    appUpdate: AppUpdateConfig;
    featureFlags: FeatureFlags;
    noteSavedToast: ToastNotificationConfig;
};


type MaintenanceContextType = {
    isDevMode: boolean;
    setDevMode: (isDev: boolean) => void;
    maintenanceConfig: MaintenanceConfig;
    setMaintenanceConfig: React.Dispatch<React.SetStateAction<MaintenanceConfig>>;
    isLoading: boolean;
};

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

const defaultMaintenanceConfig: MaintenanceConfig = {
    globalMaintenance: false,
    pageMaintenance: {},
    devPassword: 'aman',
    dashboardBanner: {
        show: false,
        targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Bug Fix',
        upcomingFeatureDetails: '1. bug fix\n2. may be some feature not working',
    },
    maintenanceTargetDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    maintenanceMessage: "We're currently performing scheduled maintenance to improve our services. We're working as quickly as possible to restore service.",
    maintenanceCards: [
        { title: "Minimal Downtime", description: "We're working as quickly as possible to restore service." },
        { title: "Better Experience", description: "Coming back with improved features and performance." }
    ],
    updateItems: [
        {
            id: 'update-1-unique',
            icon: 'Wrench',
            title: 'Bug fix and stable',
            date: '10 September, 2025',
            description: 'Here we fix some bugs and make a stable and also give a lag free experience',
            tags: ['Bug Fix', 'Beta 1.3'],
        },
        {
            id: 'update-2-unique',
            icon: 'Rocket',
            title: 'Live sync by email',
            date: '7 September, 2025',
            description: 'Now user can sync data live like history stats etc',
            tags: ['New Feature', 'Beta 1.3'],
        },
    ],
    aboutPageContent: {
        stats: {
            happyUsers: "500",
            calculationsDone: "10k+"
        },
        ownerInfo: {
            name: "Aman Yadav",
            photoId: "founder-avatar"
        },
        appInfo: {
            version: "beta 1.5",
            build: "Sutradhaar1",
            channel: "Website",
            license: "Yes"
        },
        roadmap: [
            {
                id: 'roadmap-1',
                version: 'Beta 1.1',
                date: '12 Aug, 2024',
                title: 'First Beta Release',
                description: "Our journey begins! You may face some bugs🐞, but we're improving every day. Thanks for testing 🙏.",
                details: ['Unit converter added', 'Notes app added'],
                icon: 'GitBranch',
                status: 'completed',
            },
        ]
    },
    comingSoonItems: [
        {
            id: 'coming-soon-1',
            icon: 'Sparkles',
            title: 'Shared Notes',
            description: 'Collaborate with others lets try',
        },
        {
            id: 'coming-soon-2',
            icon: 'Wand2',
            title: 'Smart Recipes',
            description: 'Context-aware steps',
        },
    ],
    welcomeDialog: {
        title: "Welcome to Sutradhaar!",
        description: "This is a smart unit converter and calculator app designed to make your life easier. Explore all the features available to you."
    },
    membershipFeatures: [
        { id: 'feat-1', feature: 'Basic Unit Conversions', member: true, premium: true },
        { id: 'feat-2', feature: 'Scientific Calculator', member: true, premium: true },
        { id: 'feat-3', feature: 'Save History', member: true, premium: true },
        { id: 'feat-4', feature: 'Premium Themes', member: false, premium: true },
        { id: 'feat-5', feature: 'Premium Unit Categories', member: false, premium: true },
        { id: 'feat-6', feature: 'Cloud Sync', member: true, premium: true },
        { id: 'feat-7', feature: 'Ad-Free Experience', member: false, premium: true },
    ],
    premiumCriteria: {
        activities: 3000,
        streak: 15,
    },
    pricing: {
        monthly: "9.99",
        yearly: "99.99",
        currency: "$"
    },
    appUpdate: {
        showBanner: false,
        version: "1.5.1",
        url: "",
        releaseNotes: "New bug fixes and performance improvements.",
    },
    featureFlags: {
        'experimental-ui': {
            enabled: false,
            description: 'Enables the new experimental user interface components.'
        },
        'ai-suggestions': {
            enabled: true,
            description: 'Provides AI-powered suggestions in the unit converter.'
        }
    },
    noteSavedToast: {
        title: "Note Saved!",
        description: "Your changes have been successfully saved."
    }
};

const sanitizePathForKey = (path: string) => {
    // Replace '/' with '_' but handle the root path case
    if (path === '/') return 'root';
    return path.replace(/\//g, '_');
};

export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDevMode, setIsDevModeLocal] = useState(false);
    const [maintenanceConfig, setMaintenanceConfigState] = useState<MaintenanceConfig>(defaultMaintenanceConfig);
    const configRef = React.useMemo(() => rtdb ? ref(rtdb, 'config/main') : null, []);

    // Load isDevMode from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('sutradhaar_dev_mode');
        if (saved === 'true') setIsDevModeLocal(true);
    }, []);

    const updateConfigInDb = async (config: MaintenanceConfig) => {
        if (!configRef) return;
        try {
            await set(configRef, config);
        } catch (error) {
            console.error("Error updating maintenance config in Firebase RTDB:", error);
        }
    };

    const setMaintenanceConfig = React.useCallback((value: React.SetStateAction<MaintenanceConfig>) => {
        setMaintenanceConfigState(prevConfig => {
            const newConfig = typeof value === 'function' ? value(prevConfig) : value;
            return newConfig;
        });
    }, []);

    // Side effect to sync with DB when config changes LOCALLY
    // We use a ref to track the last synced config to avoid loops with onValue
    const lastConfigSyncedRef = useRef<string>('');

    useEffect(() => {
        const configStr = JSON.stringify(maintenanceConfig);
        if (configStr !== lastConfigSyncedRef.current) {
            updateConfigInDb(maintenanceConfig);
            lastConfigSyncedRef.current = configStr;
        }
    }, [maintenanceConfig]);

    useEffect(() => {
        if (!configRef) {
            // Fallback to local storage if RTDB is unavailable
            try {
                const localConfig = localStorage.getItem('sutradhaar_maintenance_config');
                if (localConfig) {
                    setMaintenanceConfigState(JSON.parse(localConfig));
                }
            } catch (e) {
                // Ignore
            }
            setIsLoading(false);
            return;
        }

        const unsubscribe = onValue(configRef, (snapshot) => {
            if (snapshot.exists()) {
                const dbConfig = snapshot.val() as Partial<MaintenanceConfig>;
                const mergedConfig = {
                    ...defaultMaintenanceConfig,
                    ...dbConfig,
                    pageMaintenance: dbConfig.pageMaintenance || defaultMaintenanceConfig.pageMaintenance,
                    dashboardBanner: { ...defaultMaintenanceConfig.dashboardBanner, ...(dbConfig.dashboardBanner || {}) },
                    maintenanceCards: dbConfig.maintenanceCards || defaultMaintenanceConfig.maintenanceCards,
                    aboutPageContent: {
                        ...defaultMaintenanceConfig.aboutPageContent,
                        ...(dbConfig.aboutPageContent || {}),
                        roadmap: dbConfig.aboutPageContent?.roadmap || defaultMaintenanceConfig.aboutPageContent.roadmap,
                    },
                    comingSoonItems: dbConfig.comingSoonItems || defaultMaintenanceConfig.comingSoonItems,
                    welcomeDialog: { ...defaultMaintenanceConfig.welcomeDialog, ...(dbConfig.welcomeDialog || {}) },
                    membershipFeatures: dbConfig.membershipFeatures || defaultMaintenanceConfig.membershipFeatures,
                    premiumCriteria: { ...defaultMaintenanceConfig.premiumCriteria, ...(dbConfig.premiumCriteria || {}) },
                    pricing: { ...defaultMaintenanceConfig.pricing, ...(dbConfig.pricing || {}) },
                    appUpdate: { ...defaultMaintenanceConfig.appUpdate, ...(dbConfig.appUpdate || {}) },
                    featureFlags: { ...defaultMaintenanceConfig.featureFlags, ...(dbConfig.featureFlags || {}) },
                    noteSavedToast: { ...defaultMaintenanceConfig.noteSavedToast, ...(dbConfig.noteSavedToast || {}) },
                };
                const mergedConfigStr = JSON.stringify(mergedConfig);
                // ONLY update state if the remote config is actually different from what we have
                // This prevents local edits from being overwritten by the "echo" from Firebase
                if (mergedConfigStr !== lastConfigSyncedRef.current) {
                    lastConfigSyncedRef.current = mergedConfigStr;
                    setMaintenanceConfigState(mergedConfig);
                }
            } else {
                // If no config exists, create it with default values
                updateConfigInDb(defaultMaintenanceConfig);
                setMaintenanceConfigState(defaultMaintenanceConfig);
            }
            setIsLoading(false);
        }, (error) => {
            if (error.message.includes('permission_denied')) {
                console.warn("⚠️ Firebase RTDB Permission Denied: Please check your Security Rules to allow reading from '/config/main'. Using local/default fallback.");
            } else {
                console.error("Error fetching maintenance config:", error);
            }

            // Fallback to local storage
            try {
                const localConfig = localStorage.getItem('sutradhaar_maintenance_config');
                if (localConfig) {
                    setMaintenanceConfigState(JSON.parse(localConfig));
                }
            } catch (e) {
                // Ignore
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [configRef]);

    // Save to localStorage whenever config changes
    useEffect(() => {
        try {
            localStorage.setItem('sutradhaar_maintenance_config', JSON.stringify(maintenanceConfig));
        } catch (e) {
            console.error("Could not save maintenance config to local storage", e);
        }
    }, [maintenanceConfig]);


    const setDevMode = React.useCallback((isDev: boolean) => {
        setIsDevModeLocal(isDev);
        localStorage.setItem('sutradhaar_dev_mode', isDev ? 'true' : 'false');
    }, []);

    const contextValue = React.useMemo(() => ({
        isDevMode,
        setDevMode,
        maintenanceConfig,
        setMaintenanceConfig,
        isLoading
    }), [maintenanceConfig, isDevMode, setDevMode, isLoading]);

    return (
        <MaintenanceContext.Provider value={contextValue}>
            {children}
        </MaintenanceContext.Provider>
    );
};

export const useMaintenance = () => {
    const context = useContext(MaintenanceContext);
    if (context === undefined) {
        throw new Error('useMaintenance must be used within a MaintenanceProvider');
    }
    return context;
};

export const MaintenanceWrapper = ({ children }: { children: ReactNode }) => {
    const { maintenanceConfig, isDevMode, isLoading } = useMaintenance();
    const { user } = useAuth();
    const { profile } = useProfile();
    const router = useRouter();
    const pathname = usePathname();

    const isOwner = React.useMemo(() => {
        const ownerEmail = 'amanyadavyadav9458@gmail.com'.toLowerCase();
        const userEmail = user?.email?.toLowerCase() || '';
        const profileEmail = profile.email?.toLowerCase() || '';
        return userEmail === ownerEmail || profileEmail === ownerEmail || profile.membership === 'owner';
    }, [user, profile.email, profile.membership]);

    useEffect(() => {
        if (isLoading) return;

        const isMaintenancePage = pathname === '/maintenance';
        const isUnderGlobalMaintenance = maintenanceConfig.globalMaintenance;
        const sanitizedPath = sanitizePathForKey(pathname);
        const isUnderPageMaintenance = maintenanceConfig.pageMaintenance?.[sanitizedPath];

        // The owner/developer bypasses maintenance on all pages
        if (isDevMode || isOwner) {
            if (isMaintenancePage && !pathname.startsWith('/dev')) {
                router.replace('/');
            }
            return;
        }

        if (isUnderGlobalMaintenance || isUnderPageMaintenance) {
            if (!isMaintenancePage) {
                router.replace('/maintenance');
            }
        } else {
            if (isMaintenancePage) {
                router.replace('/');
            }
        }
    }, [maintenanceConfig, isDevMode, isOwner, pathname, router, isLoading]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    const isUnderMaintenance = maintenanceConfig.globalMaintenance || maintenanceConfig.pageMaintenance?.[sanitizePathForKey(pathname)];
    if (isUnderMaintenance && pathname !== '/maintenance' && !((isDevMode || isOwner) && pathname.startsWith('/dev'))) {
        return null;
    }

    return <>{children}</>;
};
