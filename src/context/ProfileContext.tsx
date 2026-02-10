

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { db, rtdb } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { isToday, differenceInCalendarDays, startOfDay, isYesterday } from 'date-fns';
import { useMaintenance } from './MaintenanceContext';
import { useToast } from '@/hooks/use-toast';
import { ref, onValue, off, set, update, remove } from 'firebase/database';


export type ActivityType = 'conversion' | 'calculator' | 'date_calculation';

export type ActivityLogItem = {
  timestamp: string;
  type: ActivityType;
};

export type ConversionHistoryItem = {
  id: string;
  type: 'conversion';
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
  category: string;
  timestamp: string; // Use ISO string for serialization
};

export type CalculatorHistoryItem = {
  id: string;
  type: 'calculator';
  expression: string;
  result: string;
  timestamp: string; // Use ISO string for serialization
};

export type DateCalculationHistoryItem = {
  id: string;
  type: 'date_calculation';
  calculationType: string;
  details: any;
  timestamp: string;
};

export type FavoriteItem = {
  id: string;
  type: 'favorite';
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
  category: string;
};

export type HistoryItem = ConversionHistoryItem | CalculatorHistoryItem | DateCalculationHistoryItem;

export type UserStats = {
  allTimeActivities: number;
  todayActivities: number;
  lastActivityDate: string | null;
  lastAppOpenDate: string | null;
  streak: number;
  daysActive: number;
};

export type NoteItem = {
  id: string;
  title: string;
  content: string;
  category?: string;
  color?: string;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isTrashed?: boolean;
  isArchived?: boolean;
};

export type SubTask = {
  id: string;
  text: string;
  completed: boolean;
};

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
  subtasks?: SubTask[];
  createdAt: string;
  completedAt?: string;
  recurring?: 'daily' | 'weekly' | 'monthly';
  timeSpent?: number; // in seconds
};

export type QuickAccessItemOrder = {
  id: string;
  hidden: boolean;
};

export type DashboardWidgetItem = {
  id: 'recentNote' | 'pendingTodos';
  hidden: boolean;
};

export type DashboardLayoutItem = {
  id: 'stats' | 'weeklySummary' | 'quickAccess' | 'widgets' | 'whatsNew' | 'comingSoon' | 'about';
  hidden: boolean;
};


export type HSLColor = {
  h: number;
  s: number;
  l: number;
};

export type CustomTheme = {
  background: HSLColor;
  foreground: HSLColor;
  primary: HSLColor;
  accent: HSLColor;
};

export type UserSettings = {
  saveHistory: boolean;
  customTheme?: CustomTheme;
  enableNotifications: boolean;
  enableSounds: boolean;
  notePassword?: string;
  lastBackupDate?: string;
};

export type Membership = 'guest' | 'member' | 'premium' | 'owner';

export type CustomUnit = {
  id: string;
  name: string;
  symbol: string;
  categoryId: string;
  factor: number;
  standard: string;
};

export type CustomCategory = {
  id: string;
  name: string;
}

export type Account = {
  id: string;
  name: string;
  balance: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  budgetLimit?: number;
};

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  categoryId: string;
  accountId: string;
  date: string; // ISO string
  notes?: string;
  tags?: string[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDue: string;
  };
  receiptUrl?: string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
};

export type BillReminder = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  frequency: 'monthly' | 'yearly' | 'once';
  isPaid: boolean;
};

export type Budget = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  goals: SavingsGoal[];
};


export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
  skills: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    instagram: string;
  };
  membership: Membership;
  settings: UserSettings;
  stats: UserStats;
  notes: NoteItem[];
  todos: TodoItem[];
  activityLog: ActivityLogItem[];
  quickAccessOrder?: QuickAccessItemOrder[];
  dashboardWidgets?: DashboardWidgetItem[];
  dashboardLayout?: DashboardLayoutItem[];
  photoUrl?: string;
  photoId?: string;
  history: HistoryItem[];
  favorites: FavoriteItem[];
  customUnits: CustomUnit[];
  customCategories: CustomCategory[];
  budget: Budget;
  billReminders: BillReminder[];
};

type ProfileContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile | ((prevState: UserProfile) => UserProfile)) => void;
  checkAndUpdateStreak: () => void;
  isLoading: boolean;
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (note: NoteItem) => void;
  deleteNote: (id: string) => void;
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  updateTodo: (todo: TodoItem) => void;
  deleteTodo: (id: string) => void;
  deleteAllUserData: () => Promise<void>;
  updateStats: (type: ActivityType) => void;
  history: HistoryItem[];
  favorites: FavoriteItem[];
  addConversionToHistory: (item: Omit<ConversionHistoryItem, 'id' | 'timestamp' | 'type'>) => void;
  addCalculatorToHistory: (item: Omit<CalculatorHistoryItem, 'id' | 'timestamp' | 'type'>) => void;
  addDateCalculationToHistory: (item: Omit<DateCalculationHistoryItem, 'id' | 'timestamp' | 'type'>) => void;
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'type'>) => void;
  deleteHistoryItem: (id: string) => void;
  deleteFavorite: (id: string) => void;
  clearAllHistory: (type: 'conversion' | 'calculator' | 'date_calculation' | 'all') => void;
  clearAllFavorites: () => void;
  addCustomUnit: (unit: Omit<CustomUnit, 'id'>) => void;
  updateCustomUnit: (unit: CustomUnit) => void;
  deleteCustomUnit: (id: string) => void;
  addCustomCategory: (name: string) => void;
  updateCustomCategory: (category: CustomCategory) => void;
  deleteCustomCategory: (id: string) => void;
  // Budget functions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  transferBetweenAccounts: (fromAccountId: string, toAccountId: string, amount: number) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  contributeToGoal: (goalId: string, amount: number, accountId: string) => void;
  // Bill Reminder functions
  addBillReminder: (reminder: Omit<BillReminder, 'id'>) => void;
  updateBillReminder: (reminder: BillReminder) => void;
  deleteBillReminder: (id: string) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const defaultStats: UserStats = {
  allTimeActivities: 0,
  todayActivities: 0,
  lastActivityDate: null,
  lastAppOpenDate: null,
  streak: 0,
  daysActive: 0,
};

const defaultSettings: UserSettings = {
  saveHistory: true,
  customTheme: {
    background: { h: 0, s: 0, l: 100 },
    foreground: { h: 240, s: 10, l: 3.9 },
    primary: { h: 240, s: 5.9, l: 10 },
    accent: { h: 240, s: 4.8, l: 95.9 },
  },
  enableNotifications: true,
  enableSounds: true,
  notePassword: '',
  lastBackupDate: '',
};

const defaultDashboardWidgets: DashboardWidgetItem[] = [
  { id: 'recentNote', hidden: false },
  { id: 'pendingTodos', hidden: false },
];

const defaultDashboardLayout: DashboardLayoutItem[] = [
  { id: 'stats', hidden: false },
  { id: 'weeklySummary', hidden: false },
  { id: 'quickAccess', hidden: false },
  { id: 'widgets', hidden: false },
  { id: 'whatsNew', hidden: false },
  { id: 'comingSoon', hidden: false },
  { id: 'about', hidden: false },
];

const defaultBudget: Budget = {
  transactions: [],
  accounts: [{ id: 'acc-cash', name: 'Cash', balance: 0 }],
  categories: [
    { id: 'cat-income', name: 'Income', icon: 'Briefcase' },
    { id: 'cat-food', name: 'Food', icon: 'Utensils' },
    { id: 'cat-transport', name: 'Transport', icon: 'Bus' },
    { id: 'cat-shopping', name: 'Shopping', icon: 'ShoppingBag' },
    { id: 'cat-bills', name: 'Bills', icon: 'FileText' },
    { id: 'cat-health', name: 'Health', icon: 'HeartPulse' },
    { id: 'cat-entertainment', name: 'Entertainment', icon: 'Ticket' },
  ],
  goals: [],
};


const getInitialProfile = (): UserProfile => {
  return {
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    skills: [],
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
      instagram: "",
    },
    membership: 'guest',
    settings: defaultSettings,
    stats: defaultStats,
    notes: [],
    todos: [],
    activityLog: [],
    quickAccessOrder: [],
    dashboardWidgets: defaultDashboardWidgets,
    dashboardLayout: defaultDashboardLayout,
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NTkwNzk5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    photoId: 'user-avatar-1',
    history: [],
    favorites: [],
    customUnits: [],
    customCategories: [],
    budget: defaultBudget,
    billReminders: [],
  };
};

const guestProfileDefault: UserProfile = {
  name: "Guest User",
  email: "",
  phone: "91-XXXXXXXXXX",
  address: "New Delhi, India",
  birthday: "January 1, 2000",
  skills: ["Learning", "Exploring"],
  socialLinks: {
    linkedin: "",
    twitter: "",
    github: "",
    instagram: "",
  },
  membership: 'guest',
  settings: defaultSettings,
  stats: defaultStats,
  notes: [],
  todos: [],
  activityLog: [],
  quickAccessOrder: [],
  dashboardWidgets: defaultDashboardWidgets,
  dashboardLayout: defaultDashboardLayout,
  photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NTkwNzk5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  photoId: 'user-avatar-1',
  history: [],
  favorites: [],
  customUnits: [],
  customCategories: [],
  budget: defaultBudget,
  billReminders: [],
}

const removeUndefined = (obj: any): any => {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }

  return Object.keys(obj).reduce((acc: any, key) => {
    const val = removeUndefined(obj[key]);
    if (val !== undefined) {
      acc[key] = val;
    }
    return acc;
  }, {});
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<UserProfile>(getInitialProfile());
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { maintenanceConfig } = useMaintenance();
  const { toast } = useToast();
  const prevMembershipRef = useRef<Membership>();

  useEffect(() => {
    if (authLoading) return;

    const mergeWithDefaults = (parsedProfile: Partial<UserProfile>): UserProfile => {
      const stats = { ...defaultStats, ...(parsedProfile.stats || {}) };

      const settings: UserSettings = {
        ...defaultSettings,
        ...(parsedProfile.settings || {}),
        customTheme: {
          ...defaultSettings.customTheme!,
          ...(parsedProfile.settings?.customTheme || {})
        } as CustomTheme
      };

      const history = (parsedProfile.history ? (Array.isArray(parsedProfile.history) ? parsedProfile.history : Object.values(parsedProfile.history)) : []) as HistoryItem[];
      const favorites = (parsedProfile.favorites ? (Array.isArray(parsedProfile.favorites) ? parsedProfile.favorites : Object.values(parsedProfile.favorites)) : []) as FavoriteItem[];
      const customUnits = (parsedProfile.customUnits ? (Array.isArray(parsedProfile.customUnits) ? parsedProfile.customUnits : Object.values(parsedProfile.customUnits)) : []) as CustomUnit[];
      const customCategories = (parsedProfile.customCategories ? (Array.isArray(parsedProfile.customCategories) ? parsedProfile.customCategories : Object.values(parsedProfile.customCategories)) : []) as CustomCategory[];

      return {
        ...guestProfileDefault,
        ...parsedProfile,
        settings,
        stats,
        history,
        favorites,
        customUnits,
        customCategories,
        notes: parsedProfile.notes || [],
        todos: parsedProfile.todos || [],
        activityLog: parsedProfile.activityLog || [],
        dashboardWidgets: parsedProfile.dashboardWidgets || defaultDashboardWidgets,
        dashboardLayout: parsedProfile.dashboardLayout || defaultDashboardLayout,
        budget: { ...defaultBudget, ...(parsedProfile.budget || {}) },
        billReminders: parsedProfile.billReminders || [],
      } as UserProfile;
    };

    let unsubscribeFirestore: (() => void) | undefined;
    let unsubscribeRtdb: (() => void) | undefined;

    if (user) {
      const cachedProfileRaw = localStorage.getItem(`sutradhaar_profile_${user.uid}`);
      if (cachedProfileRaw) {
        setProfileState(mergeWithDefaults(JSON.parse(cachedProfileRaw)));
      }
      setIsLoading(false);

      const userDocRef = doc(db, 'users', user.uid);
      unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
        let finalProfile;
        if (docSnap.exists()) {
          const fetchedData = docSnap.data() as Partial<UserProfile>;
          const mergedProfile = mergeWithDefaults(fetchedData);

          let membership = user.email?.toLowerCase() === 'amanyadavyadav9458@gmail.com'.toLowerCase() ? 'owner' : (mergedProfile.membership || 'member');
          const { activities, streak } = maintenanceConfig.premiumCriteria;
          if (membership === 'member' && mergedProfile.stats.allTimeActivities >= activities && mergedProfile.stats.streak >= streak) {
            membership = 'premium';
          }

          finalProfile = {
            ...mergedProfile,
            name: mergedProfile.name || user.displayName || "New User",
            email: user.email || mergedProfile.email || "",
            membership,
          };
        } else {
          const membership = user.email?.toLowerCase() === 'amanyadavyadav9458@gmail.com'.toLowerCase() ? 'owner' : 'member';
          finalProfile = mergeWithDefaults({
            email: user.email || '',
            name: user.displayName || 'New User',
            membership,
            photoUrl: user.photoURL || guestProfileDefault.photoUrl,
          });
          setDoc(userDocRef, removeUndefined(finalProfile));
        }
        setProfileState(prev => ({ ...finalProfile, budget: { ...finalProfile.budget, transactions: prev.budget.transactions } }));
        localStorage.setItem(`sutradhaar_profile_${user.uid}`, JSON.stringify(finalProfile));
      }, (error) => {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
      });

    } else {
      const savedProfileRaw = localStorage.getItem('sutradhaar_profile');
      if (savedProfileRaw) {
        setProfileState(mergeWithDefaults(JSON.parse(savedProfileRaw)));
      } else {
        setProfileState(guestProfileDefault);
      }
      setIsLoading(false);
    }

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [user, authLoading, maintenanceConfig.premiumCriteria.activities, maintenanceConfig.premiumCriteria.streak]);

  useEffect(() => {
    if (!isLoading && profile.membership !== prevMembershipRef.current) {
      if (profile.membership === 'premium' && prevMembershipRef.current === 'member') {
        toast({
          title: "Congratulations! 💎",
          description: "You've been upgraded to a Premium Member.",
        });
      }
      prevMembershipRef.current = profile.membership;
    }
  }, [profile.membership, isLoading, toast]);

  useEffect(() => {
    if (!isLoading) {
      checkAndUpdateStreak();
    }
  }, [isLoading]);

  const setProfile = (newProfileData: UserProfile | ((prevState: UserProfile) => UserProfile)) => {
    setProfileState(currentProfile => {
      let updatedProfile = typeof newProfileData === 'function' ? newProfileData(currentProfile) : newProfileData;

      const { activities, streak } = maintenanceConfig.premiumCriteria;
      if (updatedProfile.membership === 'member' && updatedProfile.stats.allTimeActivities >= activities && updatedProfile.stats.streak >= streak) {
        updatedProfile = { ...updatedProfile, membership: 'premium' };
      }

      if (user) {
        const { transactions, ...budgetToSave } = updatedProfile.budget;
        const profileToSave = removeUndefined({ ...updatedProfile, budget: budgetToSave });
        const userDocRef = doc(db, `users`, user.uid);
        setDoc(userDocRef, profileToSave, { merge: true }).catch(error => console.error("Failed to save profile to Firestore", error));
        localStorage.setItem(`sutradhaar_profile_${user.uid}`, JSON.stringify(updatedProfile));
      } else {
        localStorage.setItem('sutradhaar_profile', JSON.stringify(updatedProfile));
      }
      return updatedProfile;
    });
  };

  const updateStats = (type: ActivityType) => {
    setProfile(prevProfile => {
      const todayISO = new Date().toISOString();
      const newStats = { ...prevProfile.stats };
      const newActivityLog = [...prevProfile.activityLog, { timestamp: todayISO, type }];

      newStats.allTimeActivities = (newStats.allTimeActivities || 0) + 1;

      const lastActivityDate = newStats.lastActivityDate;
      if (lastActivityDate && isToday(new Date(lastActivityDate))) {
        newStats.todayActivities = (newStats.todayActivities || 0) + 1;
      } else {
        newStats.todayActivities = 1;
      }

      newStats.lastActivityDate = todayISO;

      return {
        ...prevProfile,
        stats: newStats,
        activityLog: newActivityLog,
      };
    });
  };




  const checkAndUpdateStreak = () => {
    setProfile(prevProfile => {
      const today = startOfDay(new Date());
      const stats = prevProfile.stats || defaultStats;
      const lastOpen = stats.lastAppOpenDate ? startOfDay(new Date(stats.lastAppOpenDate)) : null;

      if (lastOpen && isToday(lastOpen)) {
        return prevProfile;
      }

      const newStats = { ...stats };

      if (lastOpen && isYesterday(lastOpen)) {
        newStats.streak = (newStats.streak || 0) + 1;
      } else if (!lastOpen || !isToday(lastOpen)) {
        newStats.streak = 1;
      }

      if (!lastOpen || !isToday(lastOpen)) {
        newStats.daysActive = (newStats.daysActive || 0) + 1;
      }

      newStats.lastAppOpenDate = today.toISOString();

      return { ...prevProfile, stats: newStats };
    });
  };

  const deleteAllUserData = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await deleteDoc(userDocRef);
      if (rtdb) {
        const rtdbRef = ref(rtdb, `users/${user.uid}`);
        await remove(rtdbRef);
      }
    }
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sutradhaar_')) {
        localStorage.removeItem(key);
      }
    });
    setProfileState(getInitialProfile());
  };

  const addConversionToHistory = (item: Omit<ConversionHistoryItem, 'id' | 'timestamp' | 'type'>) => {
    if (!profile.settings.saveHistory) return;
    const newItem: ConversionHistoryItem = { ...item, id: new Date().getTime().toString(), timestamp: new Date().toISOString(), type: 'conversion' };
    setProfile(p => ({ ...p, history: [newItem, ...p.history] }));
    updateStats('conversion');
  };

  const addCalculatorToHistory = (item: Omit<CalculatorHistoryItem, 'id' | 'timestamp' | 'type'>) => {
    if (!profile.settings.saveHistory) return;
    const newItem: CalculatorHistoryItem = { ...item, id: new Date().getTime().toString(), timestamp: new Date().toISOString(), type: 'calculator' };
    setProfile(p => ({ ...p, history: [newItem, ...p.history] }));
    updateStats('calculator');
  };

  const addDateCalculationToHistory = (item: Omit<DateCalculationHistoryItem, 'id' | 'timestamp' | 'type'>) => {
    if (!profile.settings.saveHistory) return;
    const newItem: DateCalculationHistoryItem = { ...item, id: new Date().getTime().toString(), timestamp: new Date().toISOString(), type: 'date_calculation' };
    setProfile(p => ({ ...p, history: [newItem, ...p.history] }));
    updateStats('date_calculation');
  };

  const addFavorite = (item: Omit<FavoriteItem, 'id' | 'type'>) => {
    const newItem: FavoriteItem = { ...item, id: new Date().getTime().toString(), type: 'favorite' };
    setProfile(p => ({ ...p, favorites: [newItem, ...p.favorites] }));
  };

  const deleteHistoryItem = (id: string) => {
    setProfile(p => ({ ...p, history: p.history.filter(item => item.id !== id) }));
  };

  const deleteFavorite = (id: string) => {
    setProfile(p => ({ ...p, favorites: p.favorites.filter(item => item.id !== id) }));
  };

  const clearAllHistory = (type: 'conversion' | 'calculator' | 'date_calculation' | 'all') => {
    if (type === 'all') {
      setProfile(p => ({ ...p, history: [] }));
      return;
    }
    setProfile(p => ({ ...p, history: p.history.filter(item => item.type !== type) }));
  };

  const clearAllFavorites = () => {
    setProfile(p => ({ ...p, favorites: [] }));
  };

  const addCustomUnit = (unit: Omit<CustomUnit, 'id'>) => {
    const newUnit: CustomUnit = { ...unit, id: new Date().getTime().toString() };
    setProfile(p => ({ ...p, customUnits: [...(p.customUnits || []), newUnit] }));
  }

  const updateCustomUnit = (unitToUpdate: CustomUnit) => {
    setProfile(p => ({ ...p, customUnits: (p.customUnits || []).map(u => u.id === unitToUpdate.id ? unitToUpdate : u) }));
  }

  const deleteCustomUnit = (id: string) => {
    setProfile(p => ({ ...p, customUnits: (p.customUnits || []).filter(u => u.id !== id) }));
  }

  const addCustomCategory = (name: string) => {
    const newCategory: CustomCategory = { name, id: new Date().getTime().toString() };
    setProfile(p => ({ ...p, customCategories: [...(p.customCategories || []), newCategory] }));
  }

  const updateCustomCategory = (categoryToUpdate: CustomCategory) => {
    setProfile(p => ({ ...p, customCategories: (p.customCategories || []).map(c => c.id === categoryToUpdate.id ? categoryToUpdate : c) }));
  }

  const deleteCustomCategory = (id: string) => {
    setProfile(p => ({ ...p, customCategories: (p.customCategories || []).filter(c => c.id !== id) }));
  }

  // Budget Functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newId = `${new Date().getTime()}-${Math.random().toString(36).slice(2, 9)}`;
    const newTransaction: Transaction = { ...transaction, id: newId };

    setProfile(p => {
      const newAccounts = p.budget.accounts.map(acc => {
        if (acc.id === newTransaction.accountId) {
          const newBalance = newTransaction.type === 'income' ? acc.balance + newTransaction.amount : acc.balance - newTransaction.amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      });
      return {
        ...p,
        budget: {
          ...p.budget,
          accounts: newAccounts,
          transactions: [...p.budget.transactions, newTransaction]
        }
      };
    });
  };

  const updateTransaction = (transactionToUpdate: Transaction) => {
    const oldTransaction = profile.budget.transactions.find(t => t.id === transactionToUpdate.id);
    if (!oldTransaction) return;

    setProfile(p => {
      const newAccounts = p.budget.accounts.map(acc => {
        let balance = acc.balance;
        // Revert old transaction effect
        if (acc.id === oldTransaction.accountId) {
          const oldAmount = oldTransaction.type === 'income' ? -oldTransaction.amount : oldTransaction.amount;
          balance += oldAmount;
        }
        // Apply new transaction effect
        if (acc.id === transactionToUpdate.accountId) {
          const newAmount = transactionToUpdate.type === 'income' ? transactionToUpdate.amount : -transactionToUpdate.amount;
          balance += newAmount;
        }
        return { ...acc, balance };
      });
      return {
        ...p,
        budget: {
          ...p.budget,
          accounts: newAccounts,
          transactions: p.budget.transactions.map(t => t.id === transactionToUpdate.id ? transactionToUpdate : t)
        }
      };
    });
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = profile.budget.transactions.find(t => t.id === id);
    if (!transactionToDelete) return;

    setProfile(p => {
      const newAccounts = p.budget.accounts.map(acc => {
        if (acc.id === transactionToDelete.accountId) {
          const amountChange = transactionToDelete.type === 'income' ? -transactionToDelete.amount : transactionToDelete.amount;
          return { ...acc, balance: acc.balance + amountChange };
        }
        return acc;
      });
      return {
        ...p,
        budget: {
          ...p.budget,
          accounts: newAccounts,
          transactions: p.budget.transactions.filter(t => t.id !== id)
        }
      };
    });
  };

  const transferBetweenAccounts = (fromAccountId: string, toAccountId: string, amount: number) => {
    const timestamp = new Date().getTime();
    const fromTransactionData = {
      type: 'expense' as 'expense',
      amount: amount,
      description: `Transfer to account`,
      categoryId: 'cat-bills', // Placeholder, consider a 'Transfer' category
      accountId: fromAccountId,
      date: new Date(timestamp).toISOString()
    };
    const toTransactionData = {
      type: 'income' as 'income',
      amount: amount,
      description: `Transfer from account`,
      categoryId: 'cat-income',
      accountId: toAccountId,
      date: new Date(timestamp).toISOString()
    };

    addTransaction(fromTransactionData);
    addTransaction(toTransactionData);
  };

  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount: Account = { ...account, id: new Date().getTime().toString() };
    setProfile(p => ({ ...p, budget: { ...p.budget, accounts: [...p.budget.accounts, newAccount] } }));
  };

  const updateAccount = (accountToUpdate: Account) => {
    setProfile(p => ({ ...p, budget: { ...p.budget, accounts: p.budget.accounts.map(a => a.id === accountToUpdate.id ? accountToUpdate : a) } }));
  };

  const deleteAccount = (id: string) => {
    setProfile(p => ({ ...p, budget: { ...p.budget, accounts: p.budget.accounts.filter(a => a.id !== id) } }));
  }

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...category, id: new Date().getTime().toString() };
    setProfile(p => ({ ...p, budget: { ...p.budget, categories: [...p.budget.categories, newCategory] } }));
  };

  const updateCategory = (categoryToUpdate: Category) => {
    setProfile(p => ({ ...p, budget: { ...p.budget, categories: p.budget.categories.map(c => c.id === categoryToUpdate.id ? categoryToUpdate : c) } }));
  };

  const deleteCategory = (id: string) => {
    setProfile(p => ({ ...p, budget: { ...p.budget, categories: p.budget.categories.filter(c => c.id !== id) } }));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal: SavingsGoal = { ...goal, id: new Date().getTime().toString(), currentAmount: 0 };
    setProfile(p => ({ ...p, budget: { ...p.budget, goals: [...p.budget.goals, newGoal] } }));
  };

  const updateSavingsGoal = (goalToUpdate: SavingsGoal) => {
    setProfile(p => ({ ...p, budget: { ...p.budget, goals: p.budget.goals.map(g => g.id === goalToUpdate.id ? goalToUpdate : g) } }));
  };

  const deleteSavingsGoal = (id: string) => {
    setProfile(p => ({ ...p, budget: { ...p.budget, goals: p.budget.goals.filter(g => g.id !== id) } }));
  };

  const contributeToGoal = (goalId: string, amount: number, accountId: string) => {
    addTransaction({
      type: 'expense',
      amount,
      description: `Contribution to goal`,
      categoryId: 'cat-bills', // Or a dedicated 'Savings' category
      accountId,
      date: new Date().toISOString(),
    });

    setProfile(p => {
      const newGoals = p.budget.goals.map(g => {
        if (g.id === goalId) {
          return { ...g, currentAmount: g.currentAmount + amount };
        }
        return g;
      });
      return { ...p, budget: { ...p.budget, goals: newGoals } };
    });
  };

  const addBillReminder = (reminder: Omit<BillReminder, 'id'>) => {
    const newReminder: BillReminder = { ...reminder, id: new Date().getTime().toString() };
    setProfile(p => ({ ...p, billReminders: [...p.billReminders, newReminder] }));
  };

  const updateBillReminder = (reminder: BillReminder) => {
    setProfile(p => ({ ...p, billReminders: p.billReminders.map(r => r.id === reminder.id ? reminder : r) }));
  };

  const deleteBillReminder = (id: string) => {
    setProfile(p => ({ ...p, billReminders: p.billReminders.filter(r => r.id !== id) }));
  };


  const addNote = (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: NoteItem = {
      ...note,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfile(p => ({ ...p, notes: [newNote, ...p.notes] }));
  };

  const updateNote = (noteToUpdate: NoteItem) => {
    const updatedNote = { ...noteToUpdate, updatedAt: new Date().toISOString() };
    setProfile(p => ({ ...p, notes: p.notes.map(n => n.id === updatedNote.id ? updatedNote : n) }));
  };

  const deleteNote = (id: string) => {
    setProfile(p => ({ ...p, notes: p.notes.filter(n => n.id !== id) }));
  };

  const addTodo = (todo: Omit<TodoItem, 'id' | 'createdAt'>) => {
    const newTodo: TodoItem = {
      ...todo,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
    };
    setProfile(p => ({ ...p, todos: [newTodo, ...p.todos] }));
  };

  const updateTodo = (todoToUpdate: TodoItem) => {
    setProfile(p => ({ ...p, todos: p.todos.map(t => t.id === todoToUpdate.id ? todoToUpdate : t) }));
  };

  const deleteTodo = (id: string) => {
    setProfile(p => ({ ...p, todos: p.todos.filter(t => t.id !== id) }));
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      setProfile,
      checkAndUpdateStreak,
      isLoading,
      addNote,
      updateNote,
      deleteNote,
      addTodo,
      updateTodo,
      deleteTodo,
      deleteAllUserData,
      updateStats,
      history: profile.history,
      favorites: profile.favorites,
      addConversionToHistory,
      addCalculatorToHistory,
      addDateCalculationToHistory,
      addFavorite,
      deleteHistoryItem,
      deleteFavorite,
      clearAllHistory,
      clearAllFavorites,
      addCustomUnit,
      updateCustomUnit,
      deleteCustomUnit,
      addCustomCategory,
      updateCustomCategory,
      deleteCustomCategory,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      transferBetweenAccounts,
      addAccount,
      updateAccount,
      deleteAccount,
      addCategory,
      updateCategory,
      deleteCategory,
      addSavingsGoal,
      updateSavingsGoal,
      deleteSavingsGoal,
      contributeToGoal,
      addBillReminder,
      updateBillReminder,
      deleteBillReminder,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};





