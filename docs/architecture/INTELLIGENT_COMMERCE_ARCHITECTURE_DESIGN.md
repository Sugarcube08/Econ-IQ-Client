---
name: Intelligent Commerce Architecture
colors:
  surface: '#101417'
  surface-dim: '#101417'
  surface-bright: '#363a3d'
  surface-container-lowest: '#0b0f12'
  surface-container-low: '#181c1f'
  surface-container: '#1c2023'
  surface-container-high: '#262a2e'
  surface-container-highest: '#313538'
  on-surface: '#e0e3e7'
  on-surface-variant: '#bdc9c6'
  inverse-surface: '#e0e3e7'
  inverse-on-surface: '#2d3134'
  outline: '#889391'
  outline-variant: '#3e4947'
  surface-tint: '#80d5cb'
  primary: '#80d5cb'
  on-primary: '#003733'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#006a63'
  secondary: '#e3c282'
  on-secondary: '#402d00'
  secondary-container: '#5c4611'
  on-secondary-container: '#d4b475'
  tertiary: '#b7c8e0'
  on-tertiary: '#213144'
  tertiary-container: '#5b6b80'
  on-tertiary-container: '#e0ecff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#ffdea0'
  secondary-fixed-dim: '#e3c282'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5a430f'
  tertiary-fixed: '#d3e4fd'
  tertiary-fixed-dim: '#b7c8e0'
  on-tertiary-fixed: '#0b1c2e'
  on-tertiary-fixed-variant: '#38485c'
  background: '#101417'
  on-background: '#e0e3e7'
  surface-variant: '#313538'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  app-density-sm: 8px
  marketing-padding-lg: 120px
---

## Brand & Style

This design system is built on the principle of **Architectural Intelligence**. It bridges the gap between high-level executive strategy and granular operational execution. The brand personality is authoritative yet illuminating—designed to make complex economic data feel navigable and actionable.

The visual style is a hybrid of **Corporate Modern** and **Minimalist**. It utilizes deep, sophisticated backgrounds to establish a "command center" feel, while employing precise, geometric layouts that prioritize information hierarchy. The marketing experience focuses on storytelling through large-scale "Hero" imagery and expansive white (or dark) space, while the application transitions into a high-density, tool-oriented interface that maintains the same premium aesthetic through consistent color and typography.

Target Audience:
- **C-Suite Executives:** Seeking clarity and "big picture" trends.
- **Operations Analysts:** Requiring high-density data, precise filtering, and speed.
- **Enterprise Partners:** Looking for reliability and technical sophistication.

## Colors

The palette is rooted in the "Midnight and Teal" theme. We use high-contrast tones to ensure legibility and a sense of premium quality.

- **Primary Teal (#0F766E):** Used for primary actions, key data highlights, and brand accents. It represents growth and precision.
- **Secondary Gold (#C8A96B):** Reserved for prestige moments, featured insights, and secondary navigational cues. It adds warmth to the technical interface.
- **Midnight Navy (#243447) & Charcoal (#161A1D):** The foundation of the dark mode. Use Charcoal for background surfaces and Midnight Navy for raised containers or sidebars.
- **Off-White (#F8F7F4):** Used for typography in dark mode and as the primary background for high-contrast marketing sections or print-ready reports.

## Typography

Manrope is the sole typeface for this design system, chosen for its geometric purity and excellent legibility at small sizes.

- **Marketing:** Use `display-lg` and `headline-lg` with tight letter-spacing to create a "bold" editorial look. High contrast between weights (ExtraBold vs Regular) is encouraged.
- **Application:** Use `body-md` for general interface text and `data-tabular` for all spreadsheet and grid views. Tabular numbers are critical to ensure vertical alignment in financial columns.
- **Hierarchy:** Use the Gold accent color for `label-sm` to draw attention to categories without overwhelming the content.

## Layout & Spacing

This design system utilizes a dual-layout philosophy to accommodate both marketing and application needs.

**Marketing Site:** 
- A **12-column fixed grid** (max-width: 1440px). 
- Heavy vertical padding (`marketing-padding-lg`) to separate sections and create an educational, digestible flow.
- "Bento box" style layouts for feature highlights.

**Enterprise Application:**
- A **fluid grid** utilizing a persistent left-hand sidebar (280px).
- High-density spacing (`app-density-sm`) for data tables and controls.
- Content follows a "Dashboard" logic where cards expand to fill available width, maintaining consistent 24px gutters.

**Breakpoints:**
- Mobile: < 768px (4 columns, 16px margins)
- Tablet: 768px - 1024px (8 columns, 24px margins)
- Desktop: > 1024px (12 columns, 64px margins)

## Elevation & Depth

To maintain a "Premium Enterprise" feel, depth is created through **Tonal Layering** rather than heavy drop shadows.

- **Level 0 (Base):** Charcoal (#161A1D). The foundation.
- **Level 1 (Cards/Containers):** Midnight Navy (#243447). Used for the primary app surface areas.
- **Level 2 (Modals/Popovers):** Lightened Navy with a subtle 1px border (#35495E).
- **Accents:** Use the Teal accent as a "glow" or soft ambient shadow (10% opacity) behind primary buttons or featured stats to imply energy and focus.
- **Borders:** In the application, use low-contrast 1px borders (#2D3B4D) to define table rows and input fields instead of shadows.

## Shapes

The shape language reflects the logo's geometry: structured, interlocking, and precise.

- **Standard Radius:** 4px (Soft) for buttons, inputs, and small cards. This maintains a professional, "engineered" look.
- **Large Containers:** 8px for main dashboard widgets and marketing section cards.
- **Buttons:** Strictly rectangular with a 4px corner radius; avoid pill shapes to keep the aesthetic aligned with enterprise-grade software.
- **Icons:** Use 2px stroke weights with squared-off ends to mirror the "Econ-IQ" wordmark.

## Components

### Buttons
- **Primary:** Solid Teal (#0F766E) with Off-White text.
- **Secondary:** Transparent with a 1px Gold (#C8A96B) border and Gold text.
- **Tertiary/Ghost:** Ghost buttons with Teal text, used for low-priority actions in dense tables.

### Input Fields
- Dark backgrounds (#161A1D) with 1px Navy borders.
- Focus state: Border changes to Teal with a subtle 2px outer glow.
- Labels: Always `label-sm` positioned above the input field.

### Data Tables (Application)
- **Header:** Midnight Navy background, bold uppercase labels.
- **Rows:** Alternating subtle zebra striping or 1px bottom borders.
- **Cells:** Use `data-tabular` for all numeric values. Positive values in Teal, negative in a muted coral (if needed).

### Cards
- **Marketing:** Large, image-heavy with Gold accents and broad padding.
- **Application:** Compact, text-heavy, utilizing the "Midnight Navy" surface level to pop against the Charcoal base.

### Chips/Badges
- Small, 2px radius. Use Teal backgrounds for "Active/Success" and Navy backgrounds for "Neutral" tags. Use the Gold text for "Featured" or "Premium" insights.