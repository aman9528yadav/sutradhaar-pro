"use client";

import React from 'react';
import { TodoPage } from '@/components/todo-page';
import { AdMobBanner } from '@/components/admob-banner';

export default function Todo() {
    return (
        <main className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
            <AdMobBanner className="mb-4 w-full" />
            <TodoPage />
            <AdMobBanner className="mt-4 w-full" />
        </main>
    );
}
