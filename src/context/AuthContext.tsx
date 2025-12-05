"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User,
  signInWithCustomToken,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth as useClerkAuth, useUser as useClerkUser, useClerk } from '@clerk/nextjs';

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  // Legacy methods kept for type compatibility, but they will warn or redirect
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, fullName: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const { userId, getToken } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();
  const { signOut } = useClerk();

  // Bridge Clerk -> Firebase
  useEffect(() => {
    const syncAuth = async () => {
      if (userId) {
        try {
          // 1. Call our API which verifies Clerk session via cookies and mints Firebase token

          const response = await fetch('/api/auth/firebase', {
            method: 'POST',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.firebaseToken) {
              await signInWithCustomToken(auth, data.firebaseToken);
            }
          } else {
            console.error('Failed to fetch Firebase token');
          }
        } catch (error) {
          console.error('Error syncing auth:', error);
        }
      } else {
        // If Clerk user is logged out, sign out of Firebase too
        await firebaseSignOut(auth);
      }
    };

    syncAuth();
  }, [userId, getToken]);

  // Listen to Firebase Auth state changes to update our local user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      try {
        await firebaseSignOut(auth); // Firebase sign out first
      } catch (firebaseError) {
        console.error("Firebase sign out error (non-fatal):", firebaseError);
      }
      await signOut({ redirectUrl: '/auth-action?action=logout' }); // Clerk sign out with redirect
    } catch (error: any) {
      console.error("Error signing out", error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Deprecated methods - these should be handled by Clerk components now
  const signInWithGoogle = async () => { console.warn("Use Clerk for Google Sign In"); };
  const signInWithEmail = async () => { console.warn("Use Clerk for Email Sign In"); return null; };
  const signUpWithEmail = async () => { console.warn("Use Clerk for Sign Up"); };
  const resendVerificationEmail = async () => { console.warn("Use Clerk for Verification"); };
  const changePassword = async () => { console.warn("Use Clerk for Password Change"); return false; };
  const sendPasswordReset = async () => { console.warn("Use Clerk for Password Reset"); };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      logout,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resendVerificationEmail,
      changePassword,
      sendPasswordReset
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
