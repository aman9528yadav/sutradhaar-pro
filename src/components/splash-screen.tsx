
"use client";

import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Rocket className="h-24 w-24 text-primary" />
      </motion.div>
      <motion.h1
        className="text-4xl font-bold mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
      >
        Sutradhaar
      </motion.h1>
    </div>
  );
}
