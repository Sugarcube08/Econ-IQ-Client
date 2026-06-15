'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Settings, Pin } from 'lucide-react';
import Button from './Button';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  pinned?: boolean;
  width?: number; // width in pixels
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
  
  onRowClick?: (row: T) => void;
  density?: 'compact' | 'standard' | 'relaxed';
  renderRowExpansion?: (row: T) => React.ReactNode;
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
  onRowClick,
  density = 'standard',
  renderRowExpansion
}: TableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const [pinnedColumns, setPinnedColumns] = useState<Record<string, boolean>>({});
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
  const [showConfig, setShowConfig] = useState(false);
  const resizeRef = useRef<{ colKey: string; startX: number; startWidth: number } | null>(null);

  // Initialize column defaults
  useEffect(() => {
    const initialWidths: Record<string, number> = {};
    const initialPinned: Record<string, boolean> = {};
    const initialVisible: Record<string, boolean> = {};

    columns.forEach(col => {
      initialWidths[col.key] = col.width || 150;
      initialPinned[col.key] = col.pinned || false;
      initialVisible[col.key] = true;
    });

    setColWidths(initialWidths);
    setPinnedColumns(initialPinned);
    setVisibleColumns(initialVisible);
  }, [columns]);

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

  // Column Resizing logic
  const handleResizeStart = (e: React.MouseEvent, colKey: string) => {
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      colKey,
      startX: e.clientX,
      startWidth: colWidths[colKey] || 150
    };
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeRef.current) return;
    const { colKey, startX, startWidth } = resizeRef.current;
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(startWidth + deltaX, 70); // Min width 70px
    setColWidths(prev => ({ ...prev, [colKey]: newWidth }));
  };

  const handleResizeEnd = () => {
    resizeRef.current = null;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  const togglePin = (colKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedColumns(prev => ({ ...prev, [colKey]: !prev[colKey] }));
  };

  const toggleVisibility = (colKey: string) => {
    setVisibleColumns(prev => ({ ...prev, [colKey]: !prev[colKey] }));
  };

  // Filter columns to only visible ones
  const activeColumns = columns.filter(col => visibleColumns[col.key] !== false);

  // Reorder active columns: Pinned ones go first
  const sortedColumns = [...activeColumns].sort((a, b) => {
    const aPinned = pinnedColumns[a.key] ? 1 : 0;
    const bPinned = pinnedColumns[b.key] ? 1 : 0;
    return bPinned - aPinned;
  });

  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col w-full font-sans text-xs">
      
      {/* Table controls */}
      <div className="p-3 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
        <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
          Enterprise Data Matrix
        </span>
        <div className="relative">
          <Button
            onClick={() => setShowConfig(!showConfig)}
            variant="secondary"
            size="sm"
            icon={Settings}
            className="h-8"
          >
            Grid Settings
          </Button>

          {showConfig && (
            <div className="absolute right-0 mt-2 w-64 bg-surface rounded-lg border border-outline-variant shadow-xl z-30 p-4 space-y-3">
              <strong className="text-xs text-primary uppercase tracking-wide block border-b border-outline-variant/60 pb-1.5">
                Column Configuration
              </strong>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {columns.map(col => (
                  <div key={col.key} className="flex items-center justify-between text-xs text-on-surface">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={visibleColumns[col.key] !== false}
                        onChange={() => toggleVisibility(col.key)}
                        className="rounded border-outline-variant accent-brand-accent"
                      />
                      {col.header}
                    </label>
                    <button
                      onClick={(e) => togglePin(col.key, e)}
                      className={`p-1 rounded hover:bg-surface-container-high transition-colors ${
                        pinnedColumns[col.key] ? 'text-brand-accent' : 'text-outline/40'
                      }`}
                      title={pinnedColumns[col.key] ? 'Unpin column' : 'Pin column'}
                    >
                      <Pin className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable grid viewport */}
      <div className="overflow-x-auto w-full relative">
        <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-surface-container-low border-b border-outline-variant text-[10px] font-bold text-outline uppercase tracking-wider sticky top-0 z-20 shadow-sm">
            <tr>
              {sortedColumns.map((col, index) => {
                const isSorted = sortBy === col.key;
                const alignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                const isPinned = pinnedColumns[col.key];
                
                // Calculate sticky offset for pinned columns
                let leftOffset = 0;
                if (isPinned) {
                  for (let i = 0; i < index; i++) {
                    const prevCol = sortedColumns[i];
                    if (pinnedColumns[prevCol.key]) {
                      leftOffset += colWidths[prevCol.key] || 150;
                    }
                  }
                }

                const width = colWidths[col.key] || 150;

                return (
                  <th
                    key={col.key}
                    className={`py-3.5 px-6 font-bold transition-colors select-none relative ${alignment} ${
                      col.sortable ? 'cursor-pointer hover:text-on-surface' : ''
                    } ${
                      isPinned ? 'sticky z-25 bg-surface-container-low shadow-[1px_0_0_0_rgba(227,226,223,0.8)]' : ''
                    }`}
                    style={{
                      width: `${width}px`,
                      left: isPinned ? `${leftOffset}px` : undefined,
                    }}
                    onClick={() => handleHeaderClick(col)}
                  >
                    <div className={`flex items-center gap-1 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}>
                      <span className="truncate">{col.header}</span>
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
                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, col.key)}
                      className="absolute right-0 top-0 bottom-0 w-1.5 hover:bg-brand-accent cursor-col-resize z-30"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40 text-on-surface bg-surface">
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                  {sortedColumns.map((col, colIndex) => {
                    const isPinned = pinnedColumns[col.key];
                    let leftOffset = 0;
                    if (isPinned) {
                      for (let i = 0; i < colIndex; i++) {
                        const prevCol = sortedColumns[i];
                        if (pinnedColumns[prevCol.key]) {
                          leftOffset += colWidths[prevCol.key] || 150;
                        }
                      }
                    }

                    return (
                      <td
                        key={col.key}
                        className={`py-3.5 px-6 ${
                          isPinned ? 'sticky z-15 bg-surface shadow-[1px_0_0_0_rgba(227,226,223,0.8)]' : ''
                        }`}
                        style={{
                          left: isPinned ? `${leftOffset}px` : undefined,
                        }}
                      >
                        <div className="h-4 bg-outline-variant/30 rounded w-4/5"></div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={sortedColumns.length} className="py-16 text-center text-error font-semibold bg-error/5">
                  {errorMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={sortedColumns.length} className="py-16 text-center text-outline">
                  No records matching target specifications.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const isExpanded = expandedRows[rowIndex] || false;
                return (
                  <React.Fragment key={rowIndex}>
                    <tr
                      className={`transition-colors border-b border-outline-variant/30 ${
                        renderRowExpansion 
                          ? 'cursor-pointer hover:bg-surface-container-low' 
                          : onRowClick 
                          ? 'cursor-pointer hover:bg-background/50' 
                          : 'hover:bg-background/5'
                      } ${isExpanded ? 'bg-surface-container-low' : ''}`}
                      onClick={() => {
                        if (renderRowExpansion) {
                          setExpandedRows(prev => ({ ...prev, [rowIndex]: !prev[rowIndex] }));
                        } else if (onRowClick) {
                          onRowClick(row);
                        }
                      }}
                    >
                      {sortedColumns.map((col, colIndex) => {
                        const alignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                        const isPinned = pinnedColumns[col.key];
                        
                        let leftOffset = 0;
                        if (isPinned) {
                          for (let i = 0; i < colIndex; i++) {
                            const prevCol = sortedColumns[i];
                            if (pinnedColumns[prevCol.key]) {
                              leftOffset += colWidths[prevCol.key] || 150;
                            }
                          }
                        }

                        return (
                          <td
                            key={col.key}
                            className={`${paddingY} ${alignment} ${
                              isPinned ? 'sticky z-15 bg-surface shadow-[1px_0_0_0_rgba(227,226,223,0.8)] font-bold' : ''
                            }`}
                            style={{
                              left: isPinned ? `${leftOffset}px` : undefined,
                            }}
                          >
                            {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                          </td>
                        );
                      })}
                    </tr>
                    {renderRowExpansion && isExpanded && (
                      <tr className="bg-surface-container-lowest animate-fade-in">
                        <td colSpan={sortedColumns.length} className="p-6 border-t border-b border-outline-variant/20">
                          {renderRowExpansion(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Panel */}
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
