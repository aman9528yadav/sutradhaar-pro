"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, fullName: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!firebaseAuth) {
      const error = new Error("Firebase is not properly configured. Please check your environment variables.");
      toast({
        title: "Configuration Missing",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    const provider = new GoogleAuthProvider();
    // Add prompt to select account
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      // Google accounts are automatically verified
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google.",
      });
      router.push('/');
    } catch (error: any) {
      console.error("Google Sign In Error", error);
      let errorMessage = error.message;

      // Provide more specific error messages
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in popup was closed. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please allow popups for this site.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for Google sign-in. Please contact support.";
      }

      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuth) {
      const error = new Error("Firebase is not properly configured. Please check your environment variables.");
      toast({
        title: "Configuration Missing",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, pass);

      // Check if email is verified
      if (!result.user.emailVerified) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before logging in. Check your inbox for the verification link.",
          variant: "destructive"
        });
        // Redirect to verification page
        router.push(`/verify-email?email=${result.user.email}`);
        return null;
      }

      toast({
        title: "Welcome Back!",
        description: "Successfully logged in.",
      });
      router.push('/');
      return result.user;
    } catch (error: any) {
      console.error("Email Sign In Error", error);
      let errorMessage = error.message;

      // Provide more specific error messages
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please sign up first.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled. Please contact support.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, fullName: string) => {
    if (!firebaseAuth) {
      const error = new Error("Firebase is not properly configured. Please check your environment variables.");
      toast({
        title: "Configuration Missing",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      if (result.user) {
        await updateProfile(result.user, {
          displayName: fullName
        });
        await sendEmailVerification(result.user);
        toast({
          title: "Account Created",
          description: "A verification email has been sent to your inbox. Please verify before logging in.",
        });
        router.push(`/verify-email?email=${result.user.email}`);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      console.error("Sign Up Error", error);
      let errorMessage = error.message;

      // Provide more specific error messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists. Please login instead.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password accounts are not enabled. Please contact support.";
      }

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (firebaseAuth) {
        await firebaseSignOut(firebaseAuth);
      }
      router.push('/login');
    } catch (error: any) {
      console.error("Error signing out", error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resendVerificationEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        toast({ title: "Email Sent", description: "Verification email resent." });
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!firebaseAuth) return;
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      toast({ title: "Reset Email Sent", description: "Check your inbox for password reset instructions." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user || !user.email) return false;
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPass);
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      return true;
    } catch (error: any) {
      console.error("Change Password Error", error);
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };
  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName, photoURL });
      // Refresh user state by creating a shallow copy to trigger re-render
      const updatedUser = { ...user } as User;
      setUser(updatedUser);
      toast({
        title: "Profile Updated",
        description: "Your authentication profile has been updated.",
      });
    } catch (error: any) {
      console.error("Update Profile Error", error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

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
      sendPasswordReset,
      updateUserProfile
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
