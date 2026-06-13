export type UserRole = 'SUPER_ADMIN' | 'ANALYST';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface APIKey {
  id: string;
  key_prefix: string;
  name: string;
  scopes: string[];
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  raw_key?: string; // only returned upon creation
}
