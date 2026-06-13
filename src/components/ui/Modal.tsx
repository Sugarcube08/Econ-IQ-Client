'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-surface border border-outline-variant rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] w-full max-w-md overflow-hidden flex flex-col font-sans text-xs sm:text-sm text-outline animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-background">
          <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:bg-outline-variant/50 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto leading-relaxed max-h-[70vh]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t border-outline-variant bg-background flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
