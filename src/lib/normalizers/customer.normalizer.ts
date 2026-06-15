import { validatePayload, CustomerSchema } from '@/lib/validators';
import { safeArray } from '@/lib/utils';

export function normalizeCustomer(raw: any) {
  const validated = validatePayload(CustomerSchema, raw, 'CustomerSchema');
  return {
    ...validated,
    customer_name: validated.customer_name || 'Unnamed Corporate Account',
    city: validated.city || 'Unknown Location',
    state: (validated.state || 'HEALTHY').toUpperCase(),
    grade: validated.grade || 'B',
  };
}

export function normalizeCustomerList(rawList: any) {
  return safeArray(rawList).map(normalizeCustomer);
}
