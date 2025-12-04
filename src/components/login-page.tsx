"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, ArrowRight, ArrowLeft, UserPlus, Sparkles, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.25,44,30.413,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

export function LoginPage() {
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const router = useRouter();
  const { toast } = useToast();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup State
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Verification State
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignInLoaded) return;

    if (!loginEmail || !loginPassword) {
      toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }

    setIsLoggingIn(true);
    try {
      const result = await signIn.create({
        identifier: loginEmail,
        password: loginPassword,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        router.push('/auth-action?action=login');
      } else {
        console.log(result);
        toast({ title: "Login Incomplete", description: "Further steps required.", variant: "default" });
      }
    } catch (err: any) {
      console.error("Login error", err);
      toast({
        title: "Login Failed",
        description: err.errors?.[0]?.message || err.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  }

  // Handle Signup
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignUpLoaded) return;

    if (!signupEmail || !signupPassword || !signupConfirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill out all fields.", variant: "destructive" });
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      toast({ title: "Passwords Do Not Match", description: "Please ensure your passwords match.", variant: "destructive" });
      return;
    }

    setIsSigningUp(true);

    try {
      await signUp.create({
        emailAddress: signupEmail,
        password: signupPassword,
        firstName: signupFullName.split(' ')[0],
        lastName: signupFullName.split(' ').slice(1).join(' '),
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      toast({ title: "Verification Code Sent", description: "Check your email for the code." });
    } catch (err: any) {
      console.error("Signup error", err);
      toast({
        title: "Sign Up Failed",
        description: err.errors?.[0]?.message || err.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsSigningUp(false);
    }
  }

  // Handle Verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignUpLoaded) return;

    setIsVerifying(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
        toast({ title: "Verification Incomplete", description: "Please try again.", variant: "destructive" });
      }

      if (completeSignUp.status === "complete") {
        await setSignUpActive({ session: completeSignUp.createdSessionId });
        router.push('/auth-action?action=signup');
      }
    } catch (err: any) {
      console.error("Verification error", err);
      toast({
        title: "Verification Failed",
        description: err.errors?.[0]?.message || err.message || "Invalid code",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isSignInLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/auth-action?action=login"
      });
    } catch (err: any) {
      toast({ title: "Google Sign In Failed", description: err.message, variant: "destructive" });
    }
  }

  if (pendingVerification) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center w-full max-w-md mx-auto"
      >
        <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-md border border-white/10">
                <Mail className="h-6 w-6 text-blue-300" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Verify Email</h2>
              <p className="text-sm text-white/60 mt-2">
                Enter the code sent to {signupEmail}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-white/80 ml-1">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-offset-0 focus-visible:ring-white/30 text-center text-lg tracking-widest"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isVerifying} className="w-full bg-white text-black hover:bg-white/90 rounded-xl h-12 font-medium">
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Verify Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full max-w-md mx-auto"
    >
      <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/20 rounded-2xl p-1 mb-8">
              <TabsTrigger
                value="login"
                className="rounded-xl data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-md text-white/60 transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-xl data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-md text-white/60 transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent key="login" value="login" className="space-y-6 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-md border border-white/10">
                      <Sparkles className="h-6 w-6 text-yellow-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-sm text-white/60 mt-2">
                      Sign in to access your personalized workspace
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/80 ml-1">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-offset-0 focus-visible:ring-white/30"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white/80 ml-1">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="********"
                          className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-offset-0 focus-visible:ring-white/30 pr-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Link href="/forgot-password" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">
                        Forgot Password?
                      </Link>
                      <Button type="submit" disabled={isLoggingIn} className="gap-2 bg-white text-black hover:bg-white/90 rounded-xl px-6 h-11 font-medium">
                        {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        {isLoggingIn ? "Logging In..." : "Login"}
                      </Button>
                    </div>
                  </form>

                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="text-xs text-white/40 font-medium">OR CONTINUE WITH</span>
                    <div className="flex-1 border-t border-white/10"></div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-3 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-12 rounded-xl font-normal"
                    onClick={handleGoogleSignIn}
                  >
                    <GoogleIcon className="h-5 w-5" />
                    Sign in with Google
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent key="signup" value="signup" className="space-y-6 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-md border border-white/10">
                      <UserPlus className="h-6 w-6 text-blue-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                    <p className="text-sm text-white/60 mt-2">
                      Join us and start your journey today
                    </p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-white/80 ml-1">Full Name</Label>
                      <Input
                        id="full-name"
                        type="text"
                        placeholder="John Doe"
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-offset-0 focus-visible:ring-white/30"
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white/80 ml-1">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@domain.com"
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-offset-0 focus-visible:ring-white/30"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white/80 ml-1">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-offset-0 focus-visible:ring-white/30 pr-10"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg" onClick={() => setPasswordVisible(!passwordVisible)}>
                          {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white/80 ml-1">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={confirmPasswordVisible ? 'text' : 'password'}
                          placeholder="Re-enter your password"
                          className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-offset-0 focus-visible:ring-white/30 pr-10"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          required
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                          {confirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <Button variant="link" className="text-white/60 hover:text-white px-0">Skip for now</Button>
                      <Button type="submit" disabled={isSigningUp} className="gap-2 bg-white text-black hover:bg-white/90 rounded-xl px-6 h-11 font-medium">
                        {isSigningUp ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Sign Up
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  <p className="text-center text-xs text-white/40 px-4 mt-6">
                    By creating an account, you agree to our{' '}
                    <Link href="#" className="text-white/80 hover:text-white hover:underline">
                      Privacy Policy
                    </Link> and <Link href="#" className="text-white/80 hover:text-white hover:underline">
                      Terms of Service.
                    </Link>
                  </p>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
      <Button asChild variant="ghost" className="mt-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full px-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Skip to App
        </Link>
      </Button>
      <div id="clerk-captcha" />
    </motion.div>
  );
}
