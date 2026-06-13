# Route Inventory

This document maps all visual routes within the Econiq Frontend App Router layout, auditing their respective view contexts, backend API queries, authentication requirements, and runtime status.

---

## 1. Route Directory Map

| Path | Purpose | API Dependencies | Auth Required? | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Root entry point. Redirects dynamically based on session token. | None. | No | **Active** (Redirect) |
| `/login` | Authentication gate. Handles email verification and OTP validation. | `POST /auth/request-otp`<br>`POST /auth/verify-otp` | No | **Active** |
| `/dashboard` | Main portal dashboard. Hosts KPI cards, pulse lines, segment progress, and attention tables. | `GET /dashboard/overview`<br>`GET /dashboard/commercial-flow`<br>`GET /dashboard/aging-distribution`<br>`GET /dashboard/state-distribution`<br>`GET /dashboard/deteriorating-customers`<br>`GET /dashboard/improving-customers`<br>`GET /dashboard/high-risk-customers`<br>`GET /dashboard/top-contributors` | Yes | **Active** |
| `/customers` | Full credit intelligence table. Supports server sorting, filters, and searches. | `GET /customers`<br>`GET /customers/export/csv` | Yes | **Active** |
| `/customer/[id]` | Account details profile. Renders 8 credit scores, 4 SVG charts, forecasts, and actions. | `GET /customer/{id}`<br>`GET /customer/{id}/predictions`<br>`GET /customer/{id}/recommendations`<br>`GET /customer/{id}/*-graph` | Yes | **Active** |
| `/reports` | Export control deck to download customer lists and transaction csv. | `GET /customers/export/csv` | Yes | **Active** |
| `/users` | User directory. Controls analyst access, roles, and status. | `GET /users`<br>`POST /users` (Create)<br>`DELETE /users/{id}` (Deactivate) | Yes (RBAC gated) | **Active** |
| `/api-keys` | Developer key console. Controls key prefixes, names, and revocations. | `GET /api-keys`<br>`POST /api-keys` (Create)<br>`DELETE /api-keys/{id}` (Revoke) | Yes (RBAC gated) | **Active** |
| `/settings` | System and session configurations profile. | `GET /auth/me` | Yes | **Active** |

---

## 2. Status Audits & Checks

- **Unused Routes**: None.
- **Broken Routes**: None. All pages compile cleanly and bind to active data hooks.
- **Experimental Routes**: None. The codebase is locked to production modules.
