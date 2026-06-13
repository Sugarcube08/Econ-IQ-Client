export interface StandardResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
  metadata?: {
    pagination?: {
      page: number;
      limit: number;
      total_records: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
    sorting?: {
      sort_by: string;
      sort_order: 'asc' | 'desc';
    };
    filters?: Record<string, unknown>;
    search?: string | null;
    processing_time_ms?: number;
  };
  errors?: Array<{
    field: string | null;
    code: string;
    message: string;
  }> | null;
  request_id?: string;
  timestamp?: string;
}
