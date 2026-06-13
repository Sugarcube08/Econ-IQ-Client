'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import Sidebar from '@/components/sidebar';
import TopBar from '@/components/topbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const isLoginRoute = pathname === '/login';

  useEffect(() => {
    // Route Protection
    if (!isAuthenticated && !isLoginRoute) {
      router.push('/login');
    } else if (isAuthenticated && (isLoginRoute || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoginRoute, pathname, router]);

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

  // Hide main shell until user is authenticated to prevent layout flashes
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
  } else if (pathname.startsWith('/settings')) {
    title = 'Settings & Config';
  }

  return (
    <div className="min-h-screen flex bg-background text-on-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen md:pl-0">
        <TopBar title={title} />
        <main className="flex-1 md:ml-sidebar-width p-md md:p-lg lg:p-xl overflow-x-hidden">
          <div className="max-w-container-max mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
