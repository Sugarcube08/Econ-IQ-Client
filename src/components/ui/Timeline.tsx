'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type?: 'neutral' | 'success' | 'warning' | 'danger';
}

interface TimelineProps {
  events: TimelineEvent[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isFetching?: boolean;
}

export default function Timeline({
  events,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isFetching = false,
}: TimelineProps) {
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down' | null>(null);
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (currentPage !== prevPageRef.current) {
      if (currentPage > prevPageRef.current) {
        setAnimationDirection('down');
      } else {
        setAnimationDirection('up');
      }
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  const indicatorColors = {
    neutral: 'bg-outline border-outline-variant/35 bg-outline/25',
    success: 'bg-brand-accent border-brand-accent/30 bg-brand-accent/25',
    warning: 'bg-[#c8a96b] border-[#c8a96b]/30 bg-[#c8a96b]/25',
    danger: 'bg-error border-error/30 bg-error/25'
  };

  const bulletColors = {
    neutral: 'bg-outline',
    success: 'bg-brand-accent',
    warning: 'bg-[#c8a96b]',
    danger: 'bg-error'
  };

  return (
    <div className="bg-surface rounded-xl border border-outline-variant p-6 font-sans relative overflow-hidden">
      <div className="flex gap-6 items-start">
        {/* Timeline Events List */}
        <div
          key={currentPage}
          className={`flex-1 relative border-l-2 border-outline-variant/30 pl-7 ml-3.5 space-y-[26px] ${!isFetching && animationDirection === 'up'
            ? 'animate-slide-down-enter'
            : !isFetching && animationDirection === 'down'
              ? 'animate-slide-up-enter'
              : ''
            }`}
        >
          {isFetching ? (
            <div className="space-y-[26px] py-1">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex gap-4 items-start animate-pulse">
                  <div className="w-6 h-6 rounded-full border-4 border-surface bg-slate-100 flex items-center justify-center -ml-[39px] shrink-0 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-slate-200 rounded w-20"></div>
                    <div className="h-3 bg-slate-300 rounded w-1/2"></div>
                    <div className="h-2.5 bg-slate-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            events.map((event, idx) => {
              const variant = event.type || 'neutral';
              return (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[39px] top-0.5 w-6 h-6 rounded-full border-4 border-surface flex items-center justify-center ${indicatorColors[variant]}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${bulletColors[variant]}`}></div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-outline uppercase block">
                      {event.date}
                    </span>
                    <strong className="text-sm text-primary block leading-tight">
                      {event.title}
                    </strong>
                    <p className="text-xs text-outline leading-normal">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-outline text-xs">
              No timeline events found.
            </div>
          )}
        </div>

        {/* Vertical Pagination Panel */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between self-stretch py-3 px-2.5 bg-slate-50/80 rounded-xl border border-slate-200/50 min-h-[260px] sticky top-2">
            {/* Up Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!isFetching && currentPage > 1) onPageChange?.(currentPage - 1);
              }}
              disabled={currentPage === 1 || isFetching}
              className={`p-1.5 rounded-lg transition-all duration-200 ${currentPage === 1 || isFetching
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:text-teal-600 hover:bg-white hover:shadow-sm'
                }`}
              title="Previous Page"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Page Progress Dots */}
            <div className="flex flex-col items-center gap-1.5 py-2">
              <span className="font-mono text-[9px] font-bold text-slate-400">
                {String(currentPage).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-1.5 my-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const isActive = idx + 1 === currentPage;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isFetching) onPageChange?.(idx + 1);
                      }}
                      disabled={isFetching}
                      className={`w-1 rounded-full transition-all duration-300 ${isActive
                        ? 'h-4 bg-teal-600'
                        : 'h-1 bg-slate-300 hover:bg-slate-400'
                        } ${isFetching ? 'cursor-not-allowed opacity-50' : ''}`}
                      title={`Go to page ${idx + 1}`}
                    />
                  );
                })}
              </div>
              <span className="font-mono text-[9px] font-bold text-slate-400">
                {String(totalPages).padStart(2, '0')}
              </span>
            </div>

            {/* Down Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!isFetching && currentPage < totalPages) onPageChange?.(currentPage + 1);
              }}
              disabled={currentPage === totalPages || isFetching}
              className={`p-1.5 rounded-lg transition-all duration-200 ${currentPage === totalPages || isFetching
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:text-teal-600 hover:bg-white hover:shadow-sm'
                }`}
              title="Next Page"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
