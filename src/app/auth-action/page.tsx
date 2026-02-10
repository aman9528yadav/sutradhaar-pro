
"use client";

import React, { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, LogOut, UserPlus, CheckCircle } from 'lucide-react';

const actionDetails = {
  login: {
    icon: LogIn,
    title: "Welcome Back!",
    message: "You are now logged in. Redirecting...",
    redirect: "/"
  },
  signup: {
    icon: UserPlus,
    title: "Account Created!",
    message: "Your account has been successfully created. Redirecting...",
    redirect: "/profile/edit"
  },
  logout: {
    icon: LogOut,
    title: "Logging Out",
    message: "You have been successfully logged out. Redirecting...",
    redirect: "/login"
  },
  default: {
    icon: CheckCircle,
    title: "Success!",
    message: "Redirecting...",
    redirect: "/"
  }
};

export default function AuthActionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get('action') as keyof typeof actionDetails | null;

  const details = useMemo(() => {
    return (action && actionDetails[action]) ? actionDetails[action] : actionDetails.default;
  }, [action]);

  const { icon: Icon, title, message, redirect } = details;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirect);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, redirect]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-foreground p-4 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-1000" />

      <div className="w-full max-w-[412px] flex flex-col flex-1 relative z-10">
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl"
          >
            <Icon className="h-24 w-24 text-white drop-shadow-lg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-white/60 text-lg">
              {message}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute bottom-8 text-sm text-white/40 font-medium"
          >
            Made by Aman, Made in India
          </motion.div>
        </main>
      </div>
    </div>
  );
}
