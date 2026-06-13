import { apiClient } from '@/lib/axios';

export const ReportService = {
  async downloadCustomersCsv(params?: {
    search?: string;
    current_state?: string;
    [key: string]: unknown;
  }): Promise<Blob> {
    const res = await apiClient.get('/customers/export/csv', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  triggerDownload(blob: Blob, filename = 'customer_intelligence_export.csv') {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
