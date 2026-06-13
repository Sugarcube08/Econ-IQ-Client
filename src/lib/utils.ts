export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return '$0.00';
  const val = Math.abs(value);
  if (val >= 1.0e9) {
    return `${value < 0 ? '-' : ''}$${(val / 1.0e9).toFixed(1)}B`;
  }
  if (val >= 1.0e6) {
    return `${value < 0 ? '-' : ''}$${(val / 1.0e6).toFixed(1)}M`;
  }
  if (val >= 1.0e3) {
    return `${value < 0 ? '-' : ''}$${(val / 1.0e3).toFixed(1)}k`;
  }
  return `${value < 0 ? '-' : ''}$${value.toLocaleString(undefined, {
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
