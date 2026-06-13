---
name: Executive Intelligence System
colors:
  surface: '#faf9f6'
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
  tertiary-container: '#211a14'
  on-tertiary-container: '#8d8279'
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
  tertiary-fixed: '#efe0d6'
  tertiary-fixed-dim: '#d2c4ba'
  on-tertiary-fixed: '#211a14'
  on-tertiary-fixed-variant: '#4e453e'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2df'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1440px
  gutter: 20px
  sidebar-width: 260px
  sidebar-collapsed: 72px
---

## Brand & Style

The design system is engineered for **Econ-IQ**, a platform where high-stakes commercial intelligence meets executive-level clarity. The brand personality is rooted in **Analytical Intelligence**—it does not just display data; it structures it for decisive action. 

The visual style is **Corporate / Modern**, specifically a "High-Density Premium" aesthetic. It balances the information density required by CFOs and Credit Managers with the sophisticated breathing room found in top-tier financial SaaS products. We utilize a "Bloomberg-meets-Stripe" approach: the utility and speed of a terminal combined with the refined typography and layout of modern web standards. 

The UI should evoke a sense of **unshakable reliability**. Every pixel is intentional, emphasizing precision, depth of insight, and a structured hierarchy that makes complex distribution and wholesale data instantly digestible.

## Colors

This design system uses a sophisticated, high-contrast palette designed for long-term focus and professional authority.

- **Primary & Secondary:** These deep tones (Rich Black and Midnight Navy) are reserved for structural elements like the sidebar and primary navigation, providing a grounded frame for data.
- **Accent:** The Teal (#0F766E) serves as the "Action" color, used for primary calls-to-action and key data highlights.
- **Gold Accent:** Drawn from the brand identity, this is used sparingly for "Premium" indicators or specific high-level insights.
- **Backgrounds:** We move away from pure white for the main workspace, utilizing a warm paper-like neutral (#F8F7F4) to reduce eye strain during extended analytical sessions, while keeping cards and surfaces pure white (#FFFFFF) for maximum contrast.
- **Semantic Colors:** Standardized Success, Warning, and Danger colors are calibrated for legibility against both white and off-white backgrounds.

## Typography

The typography strategy focuses on **tabular precision** and **hierarchical clarity**. 

**Hanken Grotesk** is the voice of the brand—used for headlines to provide a modern, geometric, and executive feel. **Inter** is the workhorse for all functional UI and data display. 

For commercial intelligence, we emphasize **tabular figures** (`tnum`). All numeric data in tables and dashboards must use Inter with tabular sizing to ensure columns of numbers align perfectly, aiding in rapid visual scanning and comparison.

- **Headlines:** Bold and tight for impact.
- **Body:** Scaled for high information density without sacrificing legibility.
- **Labels:** Small, uppercase labels are used for metadata and table headers to create a distinct visual layer from the data itself.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for the main content area, with a fixed-width collapsible sidebar.

- **Rhythm:** An 8px base unit (8, 16, 24, 32...) governs all margins and padding. 
- **Density:** To achieve "ERP-grade" density, internal component padding (like table cells and list items) may scale down to 4px (xs) or 8px (sm).
- **Structure:** Content is housed in a "Main Stage" area. In complex views, a secondary right-hand "Inspector" panel can be used for contextual details without losing sight of the primary data grid.
- **Responsiveness:**
  - **Desktop (1280px+):** Full sidebar, 12 columns.
  - **Tablet (768px - 1279px):** Collapsed sidebar (icons only), 8 columns, margins reduce to 16px.
  - **Mobile (<767px):** Sidebar moves to a bottom-nav or hamburger menu, single-column vertical flow, 12px horizontal margins.

## Elevation & Depth

The design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**. Depth is used to indicate interactivity and focus, not decoration.

- **Flat Foundation:** Background (#F8F7F4) is the lowest level.
- **Surfaces:** Cards and Containers (#FFFFFF) sit on top with a subtle 1px border (#E2E8F0).
- **Interactive Depth:** Only the most critical floating elements (Modals, Dropdowns) use a shadow. Use a "Soft Executive Shadow": `0px 4px 20px rgba(22, 26, 29, 0.08)`.
- **Navigation:** The Sidebar uses a solid, dark fill to create a vertical anchor, appearing "behind" the main stage.

## Shapes

The shape language is **Soft and Professional**. We avoid the "bubbly" appearance of consumer apps to maintain an executive tone.

- **Standard Radius:** 4px (0.25rem) for buttons, input fields, and small components. This provides a modern touch while maintaining a rigid, structured feel.
- **Container Radius:** 8px (0.5rem) for cards and main dashboard widgets.
- **Interactive Elements:** Checkboxes and Radio buttons follow the 4px rule.

## Components

### Sidebar
- **Background:** Primary (#161A1D).
- **Active State:** Left-edge accent border (3px, #0F766E) with a subtle secondary tint background.
- **Icons:** Minimalist line icons; 20px size.

### Data Tables
- **Header:** Sticky, Background (#F8F7F4), Label-MD typography, bottom border 2px (#E2E8F0).
- **Rows:** 40px height for dense view, 52px for comfortable view. Hover state: #F1F5F9.
- **Cells:** Inter Data-Mono for numeric values. Use semantic colors for "Trend" indicators (Up/Down arrows).

### Cards
- **Header:** Simple 1px bottom border. No background fill for card titles.
- **Border:** 1px solid #E2E8F0.
- **Padding:** 24px for dashboard widgets; 16px for data-heavy utility cards.

### Buttons
- **Primary:** Accent (#0F766E) background, White text.
- **Secondary:** White background, 1px border (#243447), Secondary text.
- **Ghost:** No background/border, used for "Cancel" or less-frequent actions.

### Input Fields
- **Border:** 1px #D1D5DB. On focus: 1px #0F766E with a 2px soft teal outer glow.
- **Label:** Positioned above the field using Label-MD typography.

### Charts
- **Palette:** Use the Secondary (#243447), Accent (#0F766E), and Gold (#C8A96B). 
- **Grid:** Light grey (#E2E8F0) dashed lines. No outer borders on chart areas.