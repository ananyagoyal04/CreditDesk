---
name: CreditDesk Utilitarian
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3e4947'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#bb0112'
  on-secondary: '#ffffff'
  secondary-container: '#e02928'
  on-secondary-container: '#fffbff'
  tertiary: '#7f4025'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c573a'
  on-tertiary-container: '#ffe5db'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000b'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb598'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#72361b'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
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
  mono-data-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 20px
  mono-data-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  mono-data-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
  label-text:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies an unyielding commitment to utilitarian efficiency, technical precision, and research-grade clarity. Inspired by developer consoles, terminal outputs, and platforms like GitHub and Vercel, the interface rejects decorative indulgence in favor of absolute information density, structural hierarchy, and functional predictability.

The system communicates authority and neutrality. Visual affordances are strictly functional: actionable items use systematic high-contrast affordances, layout grids favor clean delineation over expressive spacing, and visual chrome is reduced to 1px hairline dividers. Every element serves an operational purpose.

## Colors

The palette operates under a high-contrast, documentarian color model:
- **Canvas Base:** `#FFFFFF` (Primary backdrop for core data layers and standard table surfaces).
- **Secondary Surface:** `#F6F8FA` (Subtle off-white/gray used for structural containers, panels, table headers, and inactive states).
- **Primary / Action:** Deep Teal `#0F766E`, shifting to `#115E59` on hover and `#134E4A` on active/pressed.
- **Status / Alert (Denied):** Text/Indicator `#DC2626`, surface container `#FEF2F2`, border `#FECACA`.
- **Text Primary:** Deep Slate `#1F2937` providing optimal contrast against white and secondary surfaces.
- **Text Secondary / Muted:** Neutral `#6B7280` reserved for labels, structural metadata, and timestamps.
- **Borders & Rules:** Hairline `#E5E7EB` applied across dividers, table row separations, and card boundaries.

No gradients, tinted backdrops, or color transitions beyond immediate interaction feedback are permitted.

## Typography

The typographical hierarchy is dual-axis:
1. **System Interface Sans (`Inter`):** Governs structural headers, body prose, standard form labels, table column headers, and UI state indicators.
2. **Tabular Monospace (`JetBrains Mono` / Monospace stack):** Strictly enforced for all application identifiers (e.g., `APP-84920`), percentages, quantitative metrics, financial sums, and timestamps.

Letter spacing is tightened subtly across large sans headers (`-0.015em`) for compact legibility, while monospace variables retain standard letter spacing to maximize tabular scanning speed.

## Layout & Spacing

Designed for fixed desktop display targeted at 1280px screen width:
- **Maximum Viewport Container:** 1280px fixed-width horizontal alignment, centered within wider monitors, with 24px (`margin`) outer gutter safety zones.
- **Header:** Sticky or static 48px height top bar spanning full width, bounded underneath by a 1px border (`#E5E7EB`). Left-aligned unadorned bold brand text "CreditDesk", right-aligned meta metrics or breadcrumbs.
- **Grid Structure:** 12-column layout with 16px (`gutter`) between vertical blocks.
- **Rhythm:** Dense, standardized increments:
  - 4px (`space-xs`) for micro-separations (badges, icon offsets).
  - 8px (`space-sm`) for compact internal field padding and table cell vertical bounds.
  - 12px (`space-md`) for container separation and button horizontal padding.
  - 16px (`space-lg`) for standard card interior spacing.
  - 24px (`space-xl`) for macroscopic block division.

## Elevation & Depth

Visual depth in this design system is almost entirely flat and governed by low-contrast outlines:
- **Hairline Boundaries:** Surface depth is established via `1px solid #E5E7EB` border rules rather than heavy drop shadows.
- **Subtle Ambient Elevation:** A solitary micro-shadow (`0 1px 2px 0 rgba(0, 0, 0, 0.05)`) is permissible on standalone cards and modal layers to separate them from the base canvas.
- **Container Tiers:** Structural zoning relies on alternation between pure `#FFFFFF` layers and `#F6F8FA` surfaces (e.g., table headers, contextual sidebars, code-block panels).
- **Z-Index Layering:** Flyouts and dropdowns adhere to a rigid 1px border envelope with the same minimal 1-2px vertical dispersion shadow. No ambient glow or glassmorphic blur filters are allowed.

## Shapes

The design system employs a restrained `Soft` (4px to 6px) radius schema across all operational primitives:
- **Buttons, Inputs, Selects:** Uniform 4px (`0.25rem`) corner radius.
- **Cards, Enclosures, Modals:** 6px corner radius max, ensuring sharp, computational geometry.
- **Badges and Status Tags:** 4px radius. Fully circular pills or rounded avatars are explicitly omitted.

## Components

### Header & Footer
- **Top Bar:** Single-tier 48px height. Background `#FFFFFF`, bottom border `1px solid #E5E7EB`. Contains "CreditDesk" text (`Inter`, 14px, weight 600, color `#1F2937`). No logos, graphic marks, or user profile pictures.
- **Footer:** Minimal container at document end, height 40px, top border `1px solid #E5E7EB`. Contains centered or left-aligned muted text (`12px`, `#6B7280`): *"Simulated system for academic research. No real data is used."*

### Buttons
- **Primary:** Background `#0F766E`, text `#FFFFFF`, border none, radius 4px. Height 32px, padding 0 12px. Font `13px` weight 500. Hover: `#115E59`. Active: `#134E4A`.
- **Secondary / Outline:** Background `#FFFFFF`, text `#1F2937`, border `1px solid #E5E7EB`, radius 4px. Height 32px, padding 0 12px. Hover: background `#F6F8FA`.
- **Destructive:** Background `#FEF2F2`, text `#DC2626`, border `1px solid #FECACA`. Hover: background `#FEE2E2`.

### Data Tables
- **Container:** Wrapped in `1px solid #E5E7EB`, 6px corner radius, overflow hidden.
- **Header:** Background `#F6F8FA`, border bottom `1px solid #E5E7EB`, typography `12px` weight 600, color `#6B7280`, uppercase with slight letter spacing.
- **Rows:** Height 36px to 40px, border bottom `1px solid #E5E7EB`. Background `#FFFFFF`. Hover: `#F9FAFB`. Numeric and identification cells right-aligned and rendered in `JetBrains Mono`.

### Badges / Status Chips
- **Denied / Critical:** Background `#FEF2F2`, border `1px solid #FECACA`, text `#DC2626`, font `JetBrains Mono` or `Inter`, 11px, weight 500, radius 4px, padding 2px 6px.
- **Neutral / Idle:** Background `#F6F8FA`, border `1px solid #E5E7EB`, text `#6B7280`, padding 2px 6px, radius 4px.

### Inputs & Controls
- **Text Inputs:** Background `#FFFFFF`, border `1px solid #E5E7EB`, color `#1F2937`, radius 4px, height 32px, padding 0 8px. Focus: border `1px solid #0F766E`, ring `1px solid #0F766E`.
- **Checkboxes & Radios:** Native-dimensioned 14px boxes, border `1px solid #D1D5DB`, active checked fill `#0F766E`. Radius 2px for checkboxes, circular for radios.

### Cards & Panels
- **Standard Card:** Background `#F6F8FA` or `#FFFFFF`, border `1px solid #E5E7EB`, radius 6px, padding 16px. Box-shadow `0 1px 2px 0 rgba(0, 0, 0, 0.05)`. Header dividers within cards use 1px solid `#E5E7EB`.