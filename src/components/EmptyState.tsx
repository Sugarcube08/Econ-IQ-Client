'use client';

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionLink,
  onActionClick
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-[#E3E2DF] rounded-xl bg-white/40 max-w-md mx-auto space-y-4 font-sans text-xs">
      <div className="w-12 h-12 rounded-full bg-[#0F766E]/5 text-[#0F766E] flex items-center justify-center">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      
      <div className="space-y-1">
        <h4 className="font-headline text-sm font-bold text-[#243447] uppercase tracking-wide">
          {title}
        </h4>
        <p className="text-[#5E6266] leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {actionText && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              href={actionLink}
              className="px-4 py-2 bg-[#0F766E] text-white font-bold uppercase tracking-wider rounded hover:brightness-110 transition-colors shadow-sm"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="px-4 py-2 bg-[#0F766E] text-white font-bold uppercase tracking-wider rounded hover:brightness-110 transition-colors shadow-sm cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
