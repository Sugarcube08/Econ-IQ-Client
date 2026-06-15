'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PageContainer from './PageContainer';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-on-background font-sans overflow-x-hidden">
      {/* Universal Sidebar */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      
      {/* Right Column (Header & Content) */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen md:pl-60">
        {/* Universal Header */}
        <Header onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        
        {/* Page Content Container */}
        <PageContainer>
          {children}
        </PageContainer>
      </div>
    </div>
  );
}
