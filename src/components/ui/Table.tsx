'use client';

import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  
  // Pagination
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  
  density?: 'compact' | 'standard' | 'relaxed';
}

export default function Table<T>({
  columns,
  data,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load records.',
  sortBy,
  sortOrder,
  onSort,
  page,
  totalPages,
  onPageChange,
  hasPrevious = false,
  hasNext = false,
  density = 'standard'
}: TableProps<T>) {

  const paddingY = {
    compact: 'py-2 px-4',
    standard: 'py-3.5 px-6',
    relaxed: 'py-5 px-8'
  }[density];

  const handleHeaderClick = (col: TableColumn<T>) => {
    if (col.sortable && onSort) {
      onSort(col.key);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col w-full font-sans text-xs">
      
      {/* Scrollable grid viewport */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-background border-b border-outline-variant text-[10px] font-bold text-outline uppercase tracking-wider">
            <tr>
              {columns.map((col) => {
                const isSorted = sortBy === col.key;
                const alignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                return (
                  <th
                    key={col.key}
                    onClick={() => handleHeaderClick(col)}
                    className={`py-3.5 px-6 font-bold transition-colors ${alignment} ${
                      col.sortable ? 'cursor-pointer hover:text-on-surface select-none' : ''
                    }`}
                  >
                    <div className={`flex items-center gap-1 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="shrink-0">
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-brand-accent" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-brand-accent" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 text-outline/60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40 text-on-surface bg-surface">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center text-outline">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
                    <span>Fetching database records...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-error font-semibold bg-error/5">
                  {errorMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-outline">
                  No records matching target specifications.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-background/50 transition-colors"
                >
                  {columns.map((col) => {
                    const alignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                    return (
                      <td key={col.key} className={`${paddingY} ${alignment}`}>
                        {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Panel (only rendered if page variables exist) */}
      {page !== undefined && totalPages !== undefined && onPageChange && (
        <div className="p-4 border-t border-outline-variant bg-surface flex justify-between items-center text-xs">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious || isLoading}
            className="px-3 py-1.5 border border-outline-variant rounded hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-secondary flex items-center gap-1 cursor-pointer bg-surface"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            Previous
          </button>
          
          <span className="text-outline">
            Page <strong className="text-on-surface">{page}</strong> of <strong className="text-on-surface">{totalPages}</strong>
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext || isLoading}
            className="px-3 py-1.5 border border-outline-variant rounded hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-secondary flex items-center gap-1 cursor-pointer bg-surface"
          >
            Next
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
