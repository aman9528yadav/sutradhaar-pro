"use client";

import React from 'react';
import { NotesPage } from '@/components/notes-page';
import { AdMobBanner } from '@/components/admob-banner';

export default function Notes() {
    return (
        <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
            <AdMobBanner className="mb-4 w-full" />
            <NotesPage />
            <AdMobBanner className="mt-4 w-full" />
        </main>
    );
}
