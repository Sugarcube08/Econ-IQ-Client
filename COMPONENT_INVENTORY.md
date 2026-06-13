# Component Inventory

This document details the registry of React components inside the Econiq Frontend application. Components are classified based on their lifecycle status: **Active** (in use), **Deprecated** (legacy but kept temporarily), or **Unused** (candidates for deletion).

---

## 1. Global Layout Components

| Component | File Path | Purpose | Status |
| :--- | :--- | :--- | :--- |
| **Sidebar** | [src/components/sidebar/index.tsx](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/src/components/sidebar/index.tsx) | Left-docked navigation sidebar hosting workspace links and user session exit controls. | **Active** |
| **TopBar** | [src/components/topbar/index.tsx](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/src/components/topbar/index.tsx) | Top navigation header rendering section title headers, search bars, notifications, and logged-in user profile banners. | **Active** |

---

## 2. Page-Specific Modular Sections (Inline Visual Blocks)

The application utilizes page-specific render layouts mapped as sub-sections in the main routes to optimize render speed and compile sizes:

| Section Helper | Route Context | Purpose | Status |
| :--- | :--- | :--- | :--- |
| **OverviewCards** | `/dashboard` | Render KPI indicators for cash, collections, and active exposure. | **Active** |
| **CommercialPulseChart** | `/dashboard` | Generates SVG-based longitudinal sales and collection progress lines. | **Active** |
| **StateDistributionChart** | `/dashboard` | Maps customer accounts ratios into color-coded state ranges. | **Active** |
| **DeterioratingCustomers** | `/dashboard` | Bento box warning list showing deteriorating accounts. | **Active** |
| **ImprovingCustomers** | `/dashboard` | Bento box growth list showing improving accounts. | **Active** |
| **HighRiskCustomers** | `/dashboard` | Bento box risk list showing high-risk accounts (with error recovery). | **Active** |
| **CustomerTable** | `/customers` | Full-screen interactive, paginated, filterable database grid. | **Active** |
| **CustomerScorecard** | `/customer/[id]` | Main analytical ribbon rendering the 8 credit scores and deltas. | **Active** |
| **CustomerTimelineCharts** | `/customer/[id]` | Renders the 4 SVG transaction graphs. | **Active** |
| **PredictionsPanel** | `/customer/[id]` | Displays machine learning predictions for churn and growth. | **Active** |
| **RecommendationsPanel** | `/customer/[id]` | Lists system-generated next-best-action policy advice. | **Active** |

---

## 3. Deprecated & Unused Components

No deprecated, unused, or skeleton layouts remain in the source tree, maintaining a clean codebase.
