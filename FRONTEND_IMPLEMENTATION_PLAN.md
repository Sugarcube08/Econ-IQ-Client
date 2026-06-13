# ECON-IQ Frontend Implementation Plan

This implementation plan details the strategy, routes, design system tokens, components, and data dependencies for building the ECON-IQ Enterprise Intelligence frontend.

---

## 1. Design System & Aesthetics
We will translate the design specifications from the Stitch export into our Tailwind CSS configuration. The client uses a dual aesthetic:
- **Dark Theme (Auth / Login / Gateway)**: Deep charcoal base (`#101417`), primary teal (`#80d5cb`), and secondary container colors.
- **Light Theme (Executive Dashboard / Main App)**: Minimalist warm/sand base (`#FAF9F6`), primary/secondary highlights, and teal accents (`#0F766E`).

### Color Palette Config:
- **Primary Teal Accent**: `#0F766E`
- **Surface/Background (Light)**: `#FAF9F6`
- **Surface/Background (Dark)**: `#101417`
- **Secondary (Navy/Slate)**: `#243447`
- **Gold Accent (Medium Risk/Rating)**: `#C8A96B`
- **Success (Green)**: `#0F766E`
- **Error/Alert (Red)**: `#BA1A1A`

---

## 2. Page Hierarchy & Routing Strategy
We will use **Next.js App Router** for routing. The pages map directly to the system requirements:

| Route | View Name | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `/` | Landing / Gateway | Beautiful landing screen directing to `/dashboard` or `/login` | Public / Session Redirect |
| `/login` | Command Center Access | Email & OTP verification flow using real backend OTP logic | Public |
| `/dashboard` | Executive Dashboard | Overview KPIs, Commercial Pulse line chart, State & Aging distributions, and prioritized action lists | Protected |
| `/customers` | Customer Intelligence | Server-paginated, sortable, and filterable table of accounts | Protected |
| `/customer/[id]` | Customer Analytics Detail | Comprehensive scorecard details, timelines (4 graphs), predictions, and recommendations | Protected |
| `/reports` | Intelligence Reports | Document center allowing filtered data downloads (CSV export) | Protected |
| `/users` | User Directory | User accounts administration and current analyst profile info | Protected |
| `/api-keys` | API Key Management | Issue and revoke API access credentials | Protected |
| `/settings` | Settings & Config | Manage environment attributes, limits, and system parameters | Protected |

---

## 3. Global State & Data Fetching Architecture
- **Authentication Store (Zustand)**: Persistent client-side session management (stores `access_token` in memory, tracks user identity, profile state, and login session status).
- **Theme & UI Store (Zustand)**: Controls global preferences and layouts.
- **Server State (TanStack Query / React Query)**: Handles all API calls, data caching, background revalidation (e.g. for customer profiles, graphs, and overview cards), and pagination.
- **Form Handling (React Hook Form + Zod)**: For login, API key creation, user addition, and dashboard filtering options.

---

## 4. API Client Isolation
Every query is routed through a single hardened Axios instance (`lib/axios.ts`) that implements:
1. **JWT Header Injection**: Appends the active `access_token` on every request.
2. **Refresh Interceptor**: Intercepts `401 Unauthorized` responses and issues a POST to `/auth/refresh` using the stored refresh token to silently recover the session.
3. **Error Normalization**: Standardizes network exceptions, 500 crashes, and validation errors for presentation.

---

## 5. Development Milestones
1. **Milestone 1**: Project initialization, CSS design token implementation, layout frame construction (Sidebar, TopBar).
2. **Milestone 2**: Authentication & Axios interceptor client setup.
3. **Milestone 3**: Core dashboards (Overview cards, Commercial Pulse graph, Aging/State charts).
4. **Milestone 4**: Server-paginated Customer Datatable & Exports.
5. **Milestone 5**: Customer Profile scorecard details & Predictions/Recommendations panels.
6. **Milestone 6**: Users directory & API Key generator.
7. **Milestone 7**: Production readiness and styling validation.
