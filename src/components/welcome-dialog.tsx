"use client";

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (dontShowAgain: boolean) => void;
  title: string;
  description: string;
}

export function WelcomeDialog({ open, onOpenChange, onConfirm, title, description }: WelcomeDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleConfirm = () => {
    onConfirm(dontShowAgain);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
        <div className="relative bg-background/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
          {/* Decorative Background Gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

          <div className="flex flex-col items-center p-6 pt-10 text-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative w-32 h-32 mb-6 rounded-3xl shadow-2xl bg-white p-2 flex items-center justify-center"
            >
              <Image
                src="/img/final logo.png"
                alt="Sutradhaar Logo"
                width={128}
                height={128}
                className="object-contain"
                priority
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
            </motion.div>

            <AlertDialogHeader className="space-y-3">
              <AlertDialogTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground leading-relaxed">
                {description}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="w-full h-px bg-border/50 my-6" />

            <AlertDialogFooter className="flex-col sm:flex-col gap-4 w-full">
              <AlertDialogAction
                onClick={handleConfirm}
                className="w-full h-11 text-base font-medium rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
              >
                Get Started
              </AlertDialogAction>

              <div className="flex items-center justify-center space-x-2 py-2">
                <Checkbox
                  id="dont-show-again"
                  checked={dontShowAgain}
                  onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                  className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label
                  htmlFor="dont-show-again"
                  className="text-sm text-muted-foreground font-normal cursor-pointer select-none"
                >
                  Don't show this again
                </Label>
              </div>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
