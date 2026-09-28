---
name: Culinary Operations System
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#59413a'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#8d7168'
  outline-variant: '#e2bfb5'
  surface-tint: '#af3101'
  primary: '#ab2f00'
  on-primary: '#ffffff'
  primary-container: '#ce461a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59f'
  secondary: '#75584e'
  on-secondary: '#ffffff'
  secondary-container: '#fed7cb'
  on-secondary-container: '#795c52'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb59f'
  on-primary-fixed: '#3a0a00'
  on-primary-fixed-variant: '#862300'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#e4beb3'
  on-secondary-fixed: '#2b160f'
  on-secondary-fixed-variant: '#5b4138'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-sm: 0.75rem
  gutter-lg: 1.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets high-efficiency culinary spaces, modern restaurateurs, and hospitality teams needing precision under pressure. The brand balance fuses the fast-paced rigor of professional back-of-house operations with the warmth, tactile sophistication, and sensory allure of premium dining.

The visual style is **Contemporary Warm Corporate**—rooted in clean utilitarian layouts, rich culinary earth tones, crisp typography, and deliberate whitespace. It deliberately rejects cold, sterile dashboard paradigms in favor of an inviting, appetite-stimulating environment that reduces cognitive fatigue during high-volume dinner rushes while conveying enterprise-grade stability to managers and owners.

## Colors

The palette establishes an immediate hospitality connection, leveraging warm culinary psychology:

- **Primary (`#E05326` - Terracotta Ember):** The core action color. Drives immediate focal attention for primary calls-to-action, urgent order alerts, and dynamic interaction states.
- **Secondary (`#29150E` - Deep Espresso):** Anchors layout structure, navigation rails, high-emphasis headers, and dominant contrast anchors. Provides structural authority without the starkness of pure black.
- **Tertiary (`#F59E0B` - Golden Amber):** Reserved for active order states, cooking countdowns, pending notifications, and mid-tier inventory warnings.
- **Neutral (`#FAF7F2` - Warm Cream Off-White):** Forms the foundational canvas, paired with `#F5EFEB` for secondary surfaces. Delivers an organic, tactile paper-like backdrop that eliminates harsh screen glare in low-lit restaurant settings.
- **Support & Functional Shades:**
  - Success / Available: `#16A34A` (Fresh Herb)
  - Critical / Sold Out: `#DC2626` (Bright Crimson)
  - High-Contrast Text: `#1C1917` (Charcoal Stone) for primary typography; `#78716C` (Warm Slate) for secondary metadata.

## Typography

Typography relies entirely on **Plus Jakarta Sans**, balancing contemporary geometric structure with humanist warmth. Its wide apertures and crisp counters maintain supreme legibility on high-glare POS tablets, kitchen display systems (KDS), and handheld service devices.

- **Headlines & Figures:** Tightly tracked headings deliver confidence across revenue metrics, order totals, and table statuses.
- **Labels & Status Badges:** Displayed in uppercase or semi-bold weights with slight tracking adjustments to ensure quick operational scanning at arm's length.
- **Numerical Treatment:** Tabular lining figures are strictly utilized across monetary tables, kitchen tickets, and stock counters to avoid layout shifting during real-time updates.

## Layout & Spacing

The layout is built on a 12-column adaptive grid on desktop (`margin: 2.5rem`, `gutter: 1.25rem`) that collapses to an 8-column layout on tablet POS surfaces, and a 4-column fluid stack on mobile terminals (`margin: 1rem`, `gutter: 0.75rem`).

- **Kitchen & Order Kanban Columns:** Fixed-width horizontal scrollers (minimum card width `320px`) with uniform `space-md` gaps allow parallel ticket tracking without visual crowding.
- **Menu Card Grids:** Responsive auto-fill grids maintain minimum card widths of `280px` on desktop and `100%` on mobile.
- **Vertical Rhythm:** A strict 4px/8px modular base rhythm guarantees precise vertical alignment across metrics, tables, and ticket queues.

## Elevation & Depth

Visual hierarchy uses a hybrid of **tonal layering** and **warm ambient shadows**, evoking soft overhead restaurant lighting rather than generic digital grey drops:

- **Level 0 (Canvas):** `#FAF7F2` background, flat.
- **Level 1 (Surface Cards & Ticket Containers):** Pure `#FFFFFF` surface accompanied by an ultra-diffused warm drop shadow (`0 2px 8px -2px rgba(41, 21, 14, 0.05)`), framed by a whisper outline (`1px solid rgba(41, 21, 14, 0.06)`).
- **Level 2 (Hover States, Metric Summaries, Dragged Cards):** `0 10px 24px -4px rgba(41, 21, 14, 0.08)`, creating clear separation for active elements.
- **Level 3 (Modals, "Call Staff" Alerts, Drawers):** `0 20px 35px -8px rgba(41, 21, 14, 0.16)`, accompanied by an ambient backdrop blur (`backdrop-filter: blur(8px)`) over a semi-translucent `#29150E` overlay at 35% opacity.

## Shapes

The interface embraces organic, accessible rounded geometry:

- Standard controls, inputs, and small badges utilize `0.5rem` (`rounded`).
- Interactive dish cards, modals, and alert panels use `rounded-xl` (`1.5rem`) to create friendly, approachable touch targets that fit hospitality hospitality interactions.
- Status chips, quantity toggles, and notification pips utilize fully rounded pill styles (`rounded-full`) for instant glanceability.

## Components

### Buttons
- **Primary:** Filled in `#E05326` with pure white typography, `rounded-xl`, `space-sm` vertical padding and `space-lg` horizontal padding. Interactive scale feedback (`active:scale-[0.98]`).
- **Secondary:** Surface `#FFFFFF` with `#29150E` text and a subtle warm border (`1px solid rgba(41, 21, 14, 0.12)`).
- **Tertiary / Destructive:** Soft red wash (`rgba(220, 38, 38, 0.08)`) with crimson typography for order cancellations or 86'd items.

### Dish Cards
- Structured with high-resolution photography spanning a top 16:9 container (`rounded-t-xl`), an inset absolute stock badge on the upper right corner, and content padding of `space-md`.
- Typography includes item title in `title-md`, concise description in `body-sm` muted warm gray, and bold price callout in `#29150E` with a quick-add `+` button in primary terracotta.

### Badges & Stock Indicators
- **In Stock:** `#16A34A` text on `#DCFCE7` background, accompanied by a 6px solid green dot indicator.
- **Low Stock:** `#D97706` text on `#FEF3C7` background.
- **Out of Stock (86'd):** `#DC2626` text on `#FEE2E2` background, rendering the entire parent card at 60% opacity with a disabled overlay.

### Real-Time Kanban Order Tickets
- Header holds table number, elapsed time badge (color-coded by age: green `< 10m`, amber `10-20m`, red `> 20m`), and server name.
- Body lists item line items with distinct modifier tags (e.g., *No onions*, *Extra sauce* highlighted in warm amber blocks).
- Bottom interaction strip contains quick-action CTA buttons spanning the full card width (e.g., "Ready for Pickup").

### Financial Metric Cards
- Clean flat white surfaces with `space-lg` internal padding.
- Emphasizes large tabular numbers (`headline-lg`), delta badges (`+14.2% vs last week`), and a faint terracotta trend sparkline.

### "Call Staff" Floating Modal
- Elevated sheet or centered modal pinned with Level 3 depth.
- Highlighted by a glowing warm amber/terracotta accent bar at the top edge.
- Features prominent table number identification, reason chips (Bill, Water, Order Assistance), and a direct acknowledgment action button.

### Form Inputs & Selectors
- Background `#FFFFFF`, border `1.5px solid rgba(41, 21, 14, 0.14)`, `rounded-xl`, focused with an energetic terracotta glow (`box-shadow: 0 0 0 3px rgba(224, 83, 38, 0.2)`).