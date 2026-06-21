export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return '₹0.00';
  const val = Math.abs(value);
  if (val >= 1.0e9) {
    return `${value < 0 ? '-' : ''}₹${(val / 1.0e9).toFixed(1)}B`;
  }
  if (val >= 1.0e6) {
    return `${value < 0 ? '-' : ''}₹${(val / 1.0e6).toFixed(1)}M`;
  }
  if (val >= 1.0e3) {
    return `${value < 0 ? '-' : ''}₹${(val / 1.0e3).toFixed(1)}k`;
  }
  return `${value < 0 ? '-' : ''}₹${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null) return '0.0%';
  return `${value.toFixed(1)}%`;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export function safeArray<T>(val: any): T[] {
  return Array.isArray(val) ? val : [];
}

export function safeObject<T extends object>(val: any): T {
  return (val !== null && typeof val === 'object' && !Array.isArray(val)) ? val as T : {} as T;
}

export function safeNumber(val: any, fallback = 0): number {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

export function safeString(val: any, fallback = ''): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

export function safeDate(val: any): Date | null {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

