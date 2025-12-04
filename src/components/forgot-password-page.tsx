
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { sendPasswordReset } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPasswordReset(email);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto relative z-10">
      <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-md border border-white/10">
              <Mail className="h-6 w-6 text-blue-300" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Forgot Password?</h2>
            <p className="text-sm text-white/60 mt-2">
              No problem. Enter your email below and we'll send you a link to reset it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-offset-0 focus-visible:ring-white/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2 bg-white text-black hover:bg-white/90 rounded-xl px-6 h-11 font-medium">
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
      <Button asChild variant="ghost" className="mt-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full px-6">
        <Link href="/login">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>
      </Button>
    </div>
  );
}
