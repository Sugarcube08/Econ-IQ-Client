---
name: Executive Intelligence System
colors:
  surface: '#FFFFFF'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#44474a'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#75777a'
  outline-variant: '#c4c7ca'
  surface-tint: '#5b5f62'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#181c1f'
  on-primary-container: '#818488'
  inverse-primary: '#c4c7cb'
  secondary: '#506074'
  on-secondary: '#ffffff'
  secondary-container: '#d3e4fd'
  on-secondary-container: '#56667b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00201d'
  on-tertiary-container: '#389189'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e3e7'
  primary-fixed-dim: '#c4c7cb'
  on-primary-fixed: '#181c1f'
  on-primary-fixed-variant: '#43474b'
  secondary-fixed: '#d3e4fd'
  secondary-fixed-dim: '#b7c8e0'
  on-secondary-fixed: '#0b1c2e'
  on-secondary-fixed-variant: '#38485c'
  tertiary-fixed: '#9cf2e8'
  tertiary-fixed-dim: '#80d5cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#00504a'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2df'
  success: '#2E7D32'
  warning: '#B7791F'
  danger: '#B91C1C'
  border-subtle: '#E5E7EB'
  border-strong: '#D1D5DB'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  grid-unit: 8px
  sidebar-width: 280px
  container-max: 1440px
  gutter: 24px
  margin-page: 32px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for high-stakes commercial decision-making. It targets executives and analysts who require a high-density, "low-friction" environment that balances the raw data power of a terminal with the refined aesthetics of a modern SaaS dashboard.

The visual style is **Corporate / Modern** with a strong emphasis on **Minimalism** and **Information Density**. It avoids decorative flourishes in favor of structural clarity, utilizing a "Subdued Premium" aesthetic: high-quality typography, a restrained palette, and a strict 8px grid. The goal is to evoke a sense of calm authority, where the UI recedes to let the data lead.

## Colors

The palette is anchored by **Deep Graphite** and **Slate Navy**, creating a sophisticated, high-contrast environment for data visualization. The primary background uses a slightly off-white "Paper" tone (`#F8F7F4`) to reduce eye strain during long analytical sessions, while interactive surfaces remain pure white (`#FFFFFF`).

The **Muted Teal** accent is reserved for primary actions and highlights, providing a distinct but professional point of focus. Semantic colors (Success, Warning, Danger) follow industry standards but are slightly desaturated to maintain the premium, executive feel.

## Typography

This design system utilizes a dual-font strategy to balance character with utility. **Manrope** provides a refined, geometric structure for headlines, creating a distinct "Executive" feel. **Inter** handles all body copy and UI elements for its superior legibility at small sizes.

A critical requirement is the use of **Tabular Numbers** (`tnum`) for all financial and numerical data to ensure vertical alignment in tables and reports. Data-heavy views should default to the `data-tabular` role, while metadata uses the uppercase `label-md` for clear categorization.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy optimized for 1440px+ desktop displays. A persistent 280px sidebar provides global navigation, while the main content area utilizes an 8px base unit for all spacing increments.

The system prioritizes density; vertical rhythm is tight to allow as much information on screen as possible without sacrificing legibility. Content is organized into clear "Panels" or "Sections" separated by `stack-lg` gaps. On smaller viewports, the sidebar collapses into an icon-only rail or a drawer, and page margins reduce to 16px.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines** rather than aggressive shadows. 

1.  **Level 0 (Background):** `#F8F7F4` — The base canvas.
2.  **Level 1 (Card/Surface):** `#FFFFFF` — Raised elements with a 1px border of `#E5E7EB`.
3.  **Level 2 (Dropdowns/Modals):** `#FFFFFF` — Floating elements using a refined, high-dispersion shadow: `0 4px 12px rgba(22, 26, 29, 0.08)`.

Avoid any glassmorphism or background blurs. Depth should feel physical and architectural, resembling a stack of high-quality documents or a clean architectural floor plan.

## Shapes

The design system employs a **Rounded** shape language to soften the density of the data. 

-   **Standard Elements (Buttons, Inputs, Cards):** 8px (`0.5rem`).
-   **Large Containers (Modals, Large Cards):** 16px (`1rem`).
-   **Small Tags/Badges:** 4px (`0.25rem`).

This specific roundedness is used to differentiate from the "Sharp" brutalism of legacy terminals, signaling a modern, user-centric ERP experience.

## Components

### Spreadsheet-Grade Tables
The core component of the design system. Use a 40px row height for standard density and 32px for high density. Headers are `label-md` with a subtle grey background. Borders are horizontal-only to emphasize data rows.

### Buttons
- **Primary:** Solid `#161A1D` with white text. 
- **Secondary:** White background with `#E5E7EB` border and `#243447` text.
- **Ghost:** No border/background until hover; used for utility actions.

### Minimal Charts
Inspired by Bloomberg terminals: use thin stroke weights (1.5px), no fills (unless area charts), and minimal grid lines. Labels must use `body-sm`.

### Input Fields
Strict 8px roundedness. Use a 1px border of `#E5E7EB` that shifts to `#0F766E` (Muted Teal) on focus. Labels sit above the field in `label-md`.

### Sidebar
The sidebar should use the `#243447` Slate Navy background with a subtle `#FFFFFF` (10% opacity) text color for inactive states and pure white for active states. Use a vertical "pill" indicator in Muted Teal to mark the active page.