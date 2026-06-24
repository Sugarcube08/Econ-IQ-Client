'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import AppShell from '@/components/layout/AppShell';
import PublicNavbar from '@/components/marketing/Navbar';
import PublicFooter from '@/components/marketing/Footer';

import { LogOut } from 'lucide-react';
import LoadingState from '@/components/ui/LoadingState';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isOnboarded } = useOnboardingStore();

  const isLoginRoute = pathname === '/login';
  
  // Public routes list
  const publicRoutes = [
    '/',
    '/platform',
    '/solutions',
    '/industries',
    '/customers',
    '/resources',
    '/pricing',
    '/about',
    '/contact',
    '/login'
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  const isAuthRoute = [
    '/dashboard',
    '/users',
    '/api-keys',
    '/settings',
    '/reports',
    '/organization',
    '/organization/users/invite',
    '/boardroom'
  ].includes(pathname) || 
    pathname.startsWith('/customer/') ||
    pathname.startsWith('/customers/') ||
    pathname.startsWith('/intelligence/') ||
    pathname.startsWith('/operations/') ||
    pathname.startsWith('/analytics/');

  // The customers path is split: if authenticated, it maps to the matrix; if unauthenticated, it maps to marketing
  const isCustomersMatrix = pathname === '/customers' && isAuthenticated;
  const isInternalShell = isAuthRoute || isCustomersMatrix;

  useEffect(() => {
    // Route Protection
    if (!isAuthenticated && !isPublicRoute && pathname !== '/onboarding') {
      router.push('/login');
    } else if (isAuthenticated) {
      if (!isOnboarded && pathname !== '/onboarding') {
        router.push('/onboarding');
      } else if (isOnboarded && (pathname === '/login' || pathname === '/' || pathname === '/onboarding')) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isOnboarded, isPublicRoute, pathname, router]);

  // Adjust document theme classes based on route context - defaults to light-first
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Render minimal layout for login screen
  if (isLoginRoute) {
    return <div className="bg-background text-on-background min-h-screen">{children}</div>;
  }

  // Render simplified setup wizard layout
  if (pathname === '/onboarding') {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
        <header className="h-20 border-b border-outline-variant flex items-center justify-between px-8 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center text-on-primary font-bold font-headline text-md shadow-sm">
              EQ
            </div>
            <span className="font-headline text-lg font-extrabold text-on-surface tracking-tight">Econ-IQ Onboarding</span>
          </div>
          <button
            onClick={() => {
              useAuthStore.getState().clearSession();
              router.push('/login');
            }}
            className="text-xs font-semibold text-danger hover:underline cursor-pointer flex items-center gap-1.5 bg-transparent border-0"
          >
            <LogOut className="w-4 h-4 text-danger" />
            Exit Setup
          </button>
        </header>
        <main className="flex-grow flex items-center justify-center p-md md:p-lg bg-background">
          {children}
        </main>
      </div>
    );
  }

  // Render internal application shell for authenticated views
  if (isInternalShell) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <LoadingState message="Securing connection..." />
        </div>
      );
    }

    // Get view title for header
    let title = 'Executive Dashboard';
    if (pathname.startsWith('/customers')) {
      title = 'Customer Intelligence';
    } else if (pathname.startsWith('/customer/')) {
      title = 'Customer Analytics Detail';
    } else if (pathname.startsWith('/reports')) {
      title = 'Intelligence Reports';
    } else if (pathname.startsWith('/users')) {
      title = 'User Directory';
    } else if (pathname.startsWith('/api-keys')) {
      title = 'API Key Management';
    } else if (pathname.startsWith('/settings') || pathname.startsWith('/organization')) {
      title = 'Organization Settings';
    }

    return (
      <AppShell>
        {children}
      </AppShell>
    );
  }

  // Otherwise, render the public site layout with Navbar and Footer
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
