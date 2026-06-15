'use client';

import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)] bg-slate-50/50">
      <div className="max-w-[1440px] mx-auto animate-fade-in space-y-6 md:space-y-8">
        {children}
      </div>
    </main>
  );
}
