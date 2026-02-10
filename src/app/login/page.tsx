
"use client";

import React, { useState, useEffect } from 'react';
import { LoginPage } from '@/components/login-page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, loading, router]);


  if (loading || user) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-foreground p-4 overflow-hidden relative">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-1000" />

        <div className="w-full max-w-md mx-auto animate-pulse relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl h-[600px] border border-white/10"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-foreground p-4 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-1000" />

      {isLoading ? (
        <div className="w-full max-w-md mx-auto animate-pulse relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl h-[600px] border border-white/10"></div>
        </div>
      ) : (
        <div className="relative z-10 w-full flex justify-center">
          <LoginPage />
        </div>
      )}
    </div>
  );
}
