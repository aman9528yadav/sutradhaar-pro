
"use client";

import React, { useState, useEffect } from 'react';
import { SettingsPage as SettingsPageComponent } from '@/components/settings-page';
import { SettingsPageSkeleton } from '@/components/settings-page-skeleton';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { useMaintenance } from '@/context/MaintenanceContext';

export default function SettingsPage() {
  const { isLoading: isProfileLoading } = useProfile();
  const { loading: isAuthLoading } = useAuth();
  const { isLoading: isMaintenanceLoading } = useMaintenance();

  const isLoading = isProfileLoading || isAuthLoading || isMaintenanceLoading;

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
        <h1 className="text-2xl font-bold self-start mb-4">Settings</h1>
        {isLoading ? <SettingsPageSkeleton /> : <SettingsPageComponent />}
    </main>
  );
}
