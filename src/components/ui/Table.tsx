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
    <div className="bg-white rounded-xl border border-[#E3E2DF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col w-full font-sans text-xs">
      
      {/* Scrollable grid viewport */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-[#F8F7F4] border-b border-[#E3E2DF] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
            <tr>
              {columns.map((col) => {
                const isSorted = sortBy === col.key;
                const alignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                return (
                  <th
                    key={col.key}
                    onClick={() => handleHeaderClick(col)}
                    className={`py-3.5 px-6 font-bold transition-colors ${alignment} ${
                      col.sortable ? 'cursor-pointer hover:text-[#111827] select-none' : ''
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
                              <ChevronUp className="w-3.5 h-3.5 text-[#0F766E]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#0F766E]" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 text-[#6B7280]/60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E2DF]/40 text-[#111827] bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center text-[#6B7280]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0F766E]" />
                    <span>Fetching database records...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-[#B91C1C] font-semibold bg-[#B91C1C]/5">
                  {errorMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-[#6B7280]">
                  No records matching target specifications.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#F8F7F4]/50 transition-colors"
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
        <div className="p-4 border-t border-[#E3E2DF] bg-white flex justify-between items-center text-xs">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious || isLoading}
            className="px-3 py-1.5 border border-[#E3E2DF] rounded hover:bg-[#F8F7F4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[#243447] flex items-center gap-1 cursor-pointer bg-white"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            Previous
          </button>
          
          <span className="text-[#6B7280]">
            Page <strong className="text-[#111827]">{page}</strong> of <strong className="text-[#111827]">{totalPages}</strong>
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext || isLoading}
            className="px-3 py-1.5 border border-[#E3E2DF] rounded hover:bg-[#F8F7F4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[#243447] flex items-center gap-1 cursor-pointer bg-white"
          >
            Next
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
