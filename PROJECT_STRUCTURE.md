# PROJECT STRUCTURE

This document outlines the file structure of the Next.js frontend application located in the `frontend/` directory.

---

## 📁 Directory Architecture

```
frontend/
├── public/
│   └── favicon.ico
│
└── src/
    ├── app/                    # Next.js App Router Routes
    │   ├── layout.tsx          # Main layout with side nav / header
    │   ├── page.tsx            # Landing Page / redirector
    │   ├── providers.tsx       # React Query & Auth providers
    │   ├── login/
    │   │   └── page.tsx        # Command Center Login Screen
    │   ├── dashboard/
    │   │   └── page.tsx        # Executive Dashboard Screen
    │   ├── customers/
    │   │   └── page.tsx        # Customers Datatable Screen
    │   ├── customer/
    │   │   └── [id]/
    │   │       └── page.tsx    # Customer Detailed Analysis Screen
    │   ├── reports/
    │   │   └── page.tsx        # CSV Download & Report Center Screen
    │   ├── users/
    │   │   └── page.tsx        # Active Analysts Screen
    │   ├── api-keys/
    │   │   └── page.tsx        # API Key Manager Screen
    │   └── settings/
    │       └── page.tsx        # Preferences Screen
    │
    ├── components/             # Reusable UI Components
    │   ├── ui/                 # Core Primitive Elements (Buttons, Inputs, etc.)
    │   ├── sidebar/            # Sidebar navigation panel
    │   └── topbar/             # Top navigation bar
    │
    ├── features/               # High-level feature-specific components
    │   ├── auth/               # Login & Verification components
    │   ├── dashboard/          # Cards, Bento Grid, Pulse Charts
    │   └── customer/           # Timelines, Predictions, Recommendations
    │
    ├── services/               # API Integration Services (Axios mapping)
    │   ├── auth.service.ts
    │   ├── customer.service.ts
    │   ├── dashboard.service.ts
    │   ├── user.service.ts
    │   ├── report.service.ts
    │   └── apikey.service.ts
    │
    ├── hooks/                  # TanStack Query custom hooks
    │   ├── useAuth.ts
    │   ├── useCustomer.ts
    │   └── useDashboard.ts
    │
    ├── stores/                 # Zustand global client-only stores
    │   └── useAuthStore.ts     # Client JWT & user state
    │
    ├── types/                  # Strict TypeScript DTO Declarations
    │   ├── auth.d.ts
    │   ├── customer.d.ts
    │   ├── dashboard.d.ts
    │   └── response.d.ts
    │
    ├── lib/                    # Configuration libs (Axios instances, etc.)
    │   ├── axios.ts            # Base Axios client with JWT refresh interceptor
    │   └── utils.ts            # Class merges, formatters
    │
    ├── providers/              # Context providers
    │   └── query-provider.tsx  # React Query query client provider
    │
    ├── constants/              # Static labels and mappings
    └── utils/                  # Utility functions
```
