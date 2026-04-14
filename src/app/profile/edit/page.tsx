
"use client";

import React from 'react';
import { EditProfilePage } from '@/components/edit-profile-page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ProfilePageSkeleton } from '@/components/profile-page-skeleton';

export default function EditProfileRoute() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <main className="flex-1 overflow-y-auto p-4 pt-4">
                <ProfilePageSkeleton />
            </main>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <main className="flex-1 overflow-y-auto p-4 pt-4">
            <EditProfilePage />
        </main>
    );
}
