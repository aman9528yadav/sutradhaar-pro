"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmailPage() {
  const { user, resendVerificationEmail, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Try to get email from URL params first, then from auth context
    const emailFromParams = searchParams.get('email');
    if (emailFromParams) {
      setEmail(emailFromParams);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [user, searchParams]);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Check for verification status
  useEffect(() => {
    if (authLoading) return;

    const interval = setInterval(async () => {
      await user?.reload();
      if (user?.emailVerified) {
        clearInterval(interval);
        toast({
          title: "Email Verified!",
          description: "Redirecting you to the dashboard...",
        });
        router.push('/auth-action?action=signup');
      }
    }, 3000); // Check every 3 seconds

    if (user && user.emailVerified) {
      clearInterval(interval);
      router.push('/auth-action?action=signup');
    }

    return () => clearInterval(interval);
  }, [user, router, toast, authLoading]);

  const handleResend = async () => {
    if (canResend && user) {
      setCanResend(false);
      setResendCooldown(30);
      await resendVerificationEmail();
    }
  };

  const handleLogoutAndRedirect = async (path: string) => {
    await logout();
    router.push(path);
  };


  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-foreground p-4 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-1000" />

      <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <MailCheck className="h-12 w-12 text-blue-300" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Verify Your Email</h1>
            <p className="text-white/60 mt-2 text-base">
              A verification link has been sent to <span className="font-bold text-white">{email || 'your email'}</span>. Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-sm text-white/40 mt-4">
              Once verified, you will be automatically redirected.
            </p>
          </div>

          <Button onClick={handleResend} disabled={!canResend} className="w-full bg-white text-black hover:bg-white/90 rounded-xl h-12 font-medium">
            {canResend ? 'Resend Email' : `Resend in ${resendCooldown}s`}
          </Button>

          <p className="text-sm text-white/60">
            Wrong email? <button onClick={() => handleLogoutAndRedirect('/login')} className="text-white font-medium hover:underline focus:outline-none">Go back</button>
          </p>
        </CardContent>
      </Card>
      <Button variant="ghost" className="mt-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full px-6 relative z-10" onClick={() => handleLogoutAndRedirect('/')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
    </div>
  );
}
