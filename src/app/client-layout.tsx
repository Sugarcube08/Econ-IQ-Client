'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import AppShell from '@/components/layout/AppShell';
import PublicNavbar from '@/components/marketing/Navbar';
import PublicFooter from '@/components/marketing/Footer';

import { LogOut } from 'lucide-react';
import LoadingState from '@/components/ui/LoadingState';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

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
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    } else if (isAuthenticated) {
      if (pathname === '/login' || pathname === '/') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isPublicRoute, pathname, router]);

  // Adjust document theme classes based on route context - defaults to light-first
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Render minimal layout for login screen
  if (isLoginRoute) {
    return <div className="bg-background text-on-background min-h-screen">{children}</div>;
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
