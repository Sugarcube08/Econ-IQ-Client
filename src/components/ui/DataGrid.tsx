'use client';

import React from 'react';
import Table, { TableColumn } from './Table';

export interface DataGridProps<T> {
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

export default function DataGrid<T>(props: DataGridProps<T>) {
  return <Table {...props} />;
}
