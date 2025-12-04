"use client";

import { usePathname } from 'next/navigation';
import { BottomNavigation } from './bottom-navigation';
import { useMemo } from 'react';

export function ConditionalBottomNavigation() {
    const pathname = usePathname();

    const hideOnRoutes = ['/login', '/forgot-password', '/verify-email', '/auth-action', '/maintenance'];

    const shouldHide = hideOnRoutes.some(route => {
        return pathname === route || pathname.startsWith(route + '/');
    });

    // Determine active tab from pathname
    const activeTab = useMemo(() => {
        if (pathname === '/') return 'dashboard';
        if (pathname === '/profile') return 'profile';
        if (pathname === '/settings') return 'settings';

        // Tool pages
        const toolPages = ['converter', 'calculator', 'date-calculator', 'timer', 'stopwatch', 'budget', 'notes', 'todo', 'history', 'analytics', 'membership', 'about', 'tools'];
        const currentPage = pathname.split('/')[1];
        if (toolPages.includes(currentPage)) return currentPage;

        return 'dashboard';
    }, [pathname]);

    if (shouldHide) {
        return null;
    }

    return <BottomNavigation activeTab={activeTab} onTabChange={() => { }} />;
}
