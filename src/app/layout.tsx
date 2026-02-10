
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ProfileProvider } from '@/context/ProfileContext';
import { MaintenanceProvider, MaintenanceWrapper } from '@/context/MaintenanceContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { BroadcastListener } from '@/components/broadcast-listener';
import { NotificationProvider } from '@/context/NotificationContext';
import { CustomThemeHandler } from '@/components/custom-theme-handler';
import { ConditionalHeader } from '@/components/conditional-header';
import { ModernSidebar } from '@/components/modern-sidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import { TimerProvider } from '@/context/TimerContext';
import { DevShortcutHandler } from '@/components/dev-shortcut-handler';

export const metadata: Metadata = {
  title: 'Sutradhaar',
  description: 'Smart Unit Converter & Calculator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
        <meta name="theme-color" content="#f1f5f9" />

      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          themes={['light', 'dark', 'theme-sutradhaar', 'theme-midnight', 'theme-nebula', 'theme-emerald', 'theme-slate', 'custom']}
        >
          <AuthProvider>
            <MaintenanceProvider>
              <ProfileProvider>
                <TimerProvider>
                  <SidebarProvider>
                    <NotificationProvider>
                      <CustomThemeHandler />
                      <div className="flex flex-col items-center w-full min-h-screen bg-background text-foreground">
                        <div className="w-full max-w-[412px] flex flex-col flex-1">
                          <MaintenanceWrapper>
                            <ConditionalHeader />
                            {children}
                          </MaintenanceWrapper>
                        </div>
                      </div>
                      <Toaster />
                      <BroadcastListener />
                      <DevShortcutHandler />
                    </NotificationProvider>
                  </SidebarProvider>
                </TimerProvider>
              </ProfileProvider>
            </MaintenanceProvider>
          </AuthProvider>
        </ThemeProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
