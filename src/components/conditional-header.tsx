
"use client";

import { usePathname } from 'next/navigation';
import { Header } from './header';

export function ConditionalHeader() {
  const pathname = usePathname();

  const hideOnRoutes = ['/login', '/forgot-password', '/verify-email', '/auth-action', '/maintenance'];

  const shouldHide = hideOnRoutes.some(route => {
    if (route.endsWith('/')) {
      return pathname.startsWith(route) && pathname.split('/').length > 2;
    }
    return pathname === route;
  });

  if (shouldHide) {
    return null;
  }

  return <div className="p-4 pt-0">
    <Header />
  </div>;
}
