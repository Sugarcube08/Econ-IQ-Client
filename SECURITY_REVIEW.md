# Security Review

This report audits the security model of the Econiq Frontend application. It evaluates JWT credential handling, role-based authorization structures, API key generation policies, token storage locations, and refresh safety.

---

## 1. Authentication Lifecycle & Session Hardening

### 1.1. OTP Challenge Flow
- **OTP Generation**: Triggered via `POST /auth/request-otp` using a validated email format. 
- **Token Exchange**: Verification is completed at `POST /auth/verify-otp` with a 6-digit challenge code. On verification, the server returns an EdDSA signature JWT access token and a UUID-based session refresh token.
- **Vulnerability Checks**: The OTP form locks input elements during submission. Rate limiting and OTP brute-force protection are enforced on the API Gateway level.

### 1.2. Token Caching & Storage
- **Access Tokens**: Cached in-memory via Zustand state selectors for immediate API request injections.
- **Refresh Tokens**: Saved in browser local storage via Zustand's state persist middleware to restore user contexts on page reloads.
- **XSS & Mitigation**: App state is protected against script injections. Raw tokens are never rendered in the DOM, and API calls utilize standard Axios clients which sanitize inputs before serializing JSON payloads.

---

## 2. Silent Token Refresh & Loop Prevention

The Axios client in `src/lib/axios.ts` implements interceptor logic to handle token refreshes:

- **Expired JWT Handling**: When an API endpoint rejects a request with a `401 Unauthorized` status, the response interceptor catches the event. It pauses the request queue, triggers a refresh call to `POST /auth/refresh` with the cached refresh token, updates the Zustand store with the new credentials, and retries the original request.
- **Refresh Token Verification**: If the refresh request itself fails with a 401 (indicating an expired or revoked session), the interceptor calls `clearSession()`, wipes local storage, halts the queue, and redirects the user to the login screen.
- **Loop Prevention**: Checks if the failing URL is the refresh endpoint itself before retrying, preventing recursive infinite loops.

---

## 3. Role-Based Access Control (RBAC)

The application handles three distinct roles: **Super Admin**, **Admin**, and **Analyst** (mapped as `SUPER_ADMIN` and `ANALYST` in types).

| Action / Interface Route | Analyst Permissions | Super Admin / Admin | Gate Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **Dashboard Overview** | Read-Only Access | Full Access | Active session token validation. |
| **Customer Matrix** | Read-Only Access | Full Access | Parameterized query validation. |
| **Analytical Details** | Read-Only Access | Full Access | Route ID parameters validation. |
| **User Provisioning** | **Blocked** | **Full Access** | UI panel checks role properties (`user.role === 'SUPER_ADMIN'`). |
| **API Key Generation** | **Blocked** | **Full Access** | Scopes check and key submission inputs visibility gate. |

### 3.1. Route Blocking
- Active routes check Zustand session states. If no token is detected, users are redirected to `/login`.
- If an analyst attempts to manually load `/users` and access provisioning controls, role checks hide the creation buttons, and the FastAPI backend validates user privileges before committing database changes, ensuring double-barrier protection.

---

## 4. API Key Policies

API Keys generated via `/api-keys` are cryptographic secrets.
- **Visibility**: The raw secret key is returned exactly once during creation (`res.data.raw_key`). The frontend displays it in a copyable terminal card and alerts the user that it will not be shown again.
- **Revocation**: Super Admins can revoke developer keys immediately. The backend deletes the key signature from database caches, invalidating all subsequent external integrations immediately.
