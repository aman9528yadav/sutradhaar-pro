
"use client";

import React from 'react';
import { ForgotPasswordPage } from '@/components/forgot-password-page';

export default function ForgotPassword() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-foreground p-4 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-1000" />

      <ForgotPasswordPage />
    </div>
  );
}
