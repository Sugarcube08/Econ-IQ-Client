'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import Sidebar from '@/components/sidebar';
import TopBar from '@/components/topbar';
import PublicNavbar from '@/components/marketing/Navbar';
import PublicFooter from '@/components/marketing/Footer';

import { LogOut } from 'lucide-react';

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

  // Authenticated internal routes
  const isAuthRoute = [
    '/dashboard',
    '/users',
    '/api-keys',
    '/settings',
    '/reports',
    '/organization',
    '/organization/users/invite'
  ].includes(pathname) || pathname.startsWith('/customer/');

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

  // Adjust document theme classes based on route context
  useEffect(() => {
    if (isLoginRoute) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isLoginRoute]);

  // Render minimal layout for login screen
  if (isLoginRoute) {
    return <div className="dark bg-surface text-on-surface min-h-screen">{children}</div>;
  }

  // Render simplified setup wizard layout
  if (pathname === '/onboarding') {
    return (
      <div className="bg-[#FAF9F6] text-[#243447] min-h-screen flex flex-col font-sans">
        <header className="h-20 border-b border-[#E3E2DF] flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0F766E] rounded flex items-center justify-center text-white font-bold font-headline text-md shadow-sm">
              EQ
            </div>
            <span className="font-headline text-lg font-extrabold text-[#243447] tracking-tight">Econ-IQ Onboarding</span>
          </div>
          <button
            onClick={() => {
              useAuthStore.getState().clearSession();
              router.push('/login');
            }}
            className="text-xs font-semibold text-[#B91C1C] hover:underline cursor-pointer flex items-center gap-1.5 bg-transparent border-0"
          >
            <LogOut className="w-4 h-4 text-[#B91C1C]" />
            Exit Setup
          </button>
        </header>
        <main className="flex-grow flex items-center justify-center p-md md:p-lg bg-[#FAF9F6]">
          {children}
        </main>
      </div>
    );
  }

  // Render internal application shell for authenticated views
  if (isInternalShell) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#0f766e] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-sans text-sm text-[#75777a] tracking-wide">Securing connection...</p>
          </div>
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
      <div className="min-h-screen flex bg-background text-on-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen md:pl-0">
          <TopBar title={title} />
          <main className="flex-grow md:ml-sidebar-width p-md md:p-lg lg:p-xl overflow-x-hidden">
            <div className="max-w-container-max mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Otherwise, render the public site layout with Navbar and Footer
  return (
    <div className="bg-[#FAF9F6] text-[#243447] min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
