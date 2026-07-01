import { validatePayload, UserSchema } from '@/lib/validators';
import { safeArray } from '@/lib/utils';

export function normalizeUser(raw: any) {
  const validated = validatePayload(UserSchema, raw, 'UserSchema');
  return {
    ...validated,
    full_name: validated.full_name || 'Pending Activation',
    role: (validated.role || 'ANALYST') as 'SUPER_ADMIN' | 'ANALYST',
  };
}

export function normalizeUsers(rawList: any) {
  return safeArray(rawList).map(normalizeUser);
}
