# Design System & UI/UX Specification (DESIGN.md) — Routine

**Application Name:** Routine  
**Design Ethos:** High-Utility Field Engineering & Project Management  
**Key Aesthetic Attributes:** Simple, Architectural, High Contrast, Tactile Mobile Simulation  
**Palette:** Pure White, Structured Slate/Black, Intentional Precision Blue  

---

## 1. Design Direction & Non-Negotiables

Routine intentionally rejects the generic "AI SaaS" aesthetic. There are no rainbow gradients, no glassmorphism blur effects, no decorative floating blobs, and no giant cards with arbitrary line charts.

Instead, Routine draws inspiration from **high-end architectural specs, Swiss modernist editorial design, and tactical field engineering tools**:
* **High Information Density with Generous Breathing Room:** Clean borders, structural dividing rules, and sharp typographic hierarchy.
* **Intentional Color Allocation:** 80% White, 15% Black/Charcoal, 5% Precision Blue. Color is never decorative; it strictly signals interactive affordance, active state, or critical project status.
* **Mobile-App Tactile Feel on Web:** Controls have comfortable 44px+ touch heights, subtle active press feedback, bottom navigation on handheld viewports, and clean drawer/bottom sheets for forms.

---

## 2. Color Palette & Design Tokens

### 2.1. Color Tokens (CSS Custom Properties)

| Token | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| `--color-bg-canvas` | `#FFFFFF` | Primary viewport and card background |
| `--color-bg-subtle` | `#F8FAFC` | Secondary backgrounds, table headers, inactive segments |
| `--color-bg-active` | `#EFF6FF` | Active item highlight, selected tab tint |
| `--color-border-subtle` | `#E2E8F0` | Dividers, structural hairpins, table borders |
| `--color-border-strong` | `#94A3B8` | Focused inputs, emphasized structural boundaries |
| `--color-text-primary` | `#09090B` | Primary headings, table values, critical data |
| `--color-text-secondary` | `#475569` | Labels, metadata, helper text, timestamps |
| `--color-text-muted` | `#94A3B8` | Placeholders, inactive icons, disabled states |
| `--color-accent-blue` | `#0052CC` | Primary action button, active tab indicator, key metrics |
| `--color-accent-blue-hover` | `#0747A6` | Button hover/active states |
| `--color-accent-blue-subtle` | `#EBF3FE` | Soft blue badge background |
| `--color-status-success` | `#059669` | Completed status, on-track indicators |
| `--color-status-warning` | `#D97706` | Pending review, delayed warnings |
| `--color-status-danger` | `#DC2626` | Blockers, rejected changes, delete actions |

---

## 3. Typography & Scale

Using **Inter** with system font fallbacks (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).

* **Headline 1 (Project Title / Hero):** `1.5rem` (`24px`), font-weight 700, letter-spacing `-0.025em`, line-height `1.2`.
* **Headline 2 (Section Title):** `1.125rem` (`18px`), font-weight 600, letter-spacing `-0.015em`, line-height `1.3`.
* **Subhead / Card Title:** `0.9375rem` (`15px`), font-weight 600, letter-spacing `-0.01em`.
* **Body / Standard UI:** `0.875rem` (`14px`), font-weight 400/500, line-height `1.45`.
* **Data / Monospace / Numbers:** `0.8125rem` (`13px`), font-variant-numeric: `tabular-nums`, font-weight 500.
* **Micro / Labels / Badges:** `0.6875rem` (`11px`), font-weight 600, text-transform `uppercase`, letter-spacing `0.05em`.

---

## 4. Mobile-Simulation Strategy

### 4.1. Mobile-First Interaction Pattern
1. **Header App Bar (Top):**
   * Custom architectural SVG Logo (`Routine` emblem with blueprint isometric geometry).
   * Interactive **User Guide** trigger button with walkthrough tour modal.
   * Active project selector dropdown, role indicator badge, and device simulation viewport switch.
   * "Reset Demo" button for instant restoration of clean sample data.
2. **Sub-Navigation (Context Bar):**
   * Clear display: *"Apex Commercial Tower"* $\rightarrow$ *"BOQ"* or *"Daily Progress"*.
3. **Primary Navigation:**
   * **Mobile Viewport (< 768px):** Bottom Navigation Bar fixed to bottom of screen with icons and concise labels (`Overview`, `BOQ`, `Tasks`, `Progress`, `More`).
   * **Desktop Viewport (≥ 768px):** Segmented pill bar at top of project view, clean horizontal tabs without taking over the full screen with an oversized sidebar.
4. **Mobile Device Simulation Frame (Desktop Bonus):**
   * Reviewers on wide desktop screens can toggle between:
     * **"Simulated Mobile App" (Default or toggleable):** Renders the application inside a sleek, realistic mobile device frame (390px × 844px) with status bar, realistic touch scrolling, and bottom nav.
     * **"Fluid Responsive Mode":** Renders the application as a responsive desktop/tablet web app, keeping the same mobile-first ergonomics without awkward stretching.

---

## 5. Component Patterns

### 5.1. Buttons
* **Primary Button:** `#0052CC` solid background, white text, 6px border-radius, minimum 42px height, 0.875rem semi-bold text. No gradient or glow.
* **Secondary / Outline Button:** `#FFFFFF` background, `#09090B` text, 1px `#E2E8F0` border.
* **Destructive Button:** Subtle red tint (`#FEF2F2`) with `#DC2626` text and border.

### 5.2. Badges & Status Chips
* Compact, rounded-full or 4px radius pill, 11px uppercase bold:
  * `Completed` / `Approved`: `#ECFDF5` bg, `#059669` text.
  * `In Progress`: `#EFF6FF` bg, `#0052CC` text.
  * `Not Started` / `Pending`: `#F1F5F9` bg, `#475569` text.
  * `Delayed` / `Urgent`: `#FEF2F2` bg, `#DC2626` text.

### 5.3. BOQ Tables & Responsive Rows
* **Desktop/Tablet:** High-legibility tabular list with strict alignment: Item # (left), Category (left), Description (left), Qty & Unit (right), Rate (right), Total (right, bold tabular-nums), Actions (right).
* **Mobile (< 640px):** Responsive card rows showing Item # + Category at top, Description in middle, and a bottom summary bar: `Qty × Rate = Total` with quick edit/delete buttons.

### 5.4. Daily Progress Timeline
* Chronological vertical track with blue marker dot for today/latest update.
* Clear visual breakdown:
  * Overall Progress pill (e.g. `68% Complete (+3%)`)
  * Work Completed section with checkmark bullets
  * Work In-Progress section with active dash bullets
  * Blocker callout box (amber or red background) if issues exist.

### 5.5. Empty States
* Simple, dignified empty state:
  * Subtle blueprint/document icon
  * Clear statement: *"No BOQ items have been added to this project."*
  * Concise secondary text: *"Add your first line item to calculate costs."*
  * Primary action button: `[ + Add BOQ Item ]`.

---

## 6. Accessibility & Motion
* Keyboard navigation: All modals trap focus and support `Esc` to close.
* Contrast ratios: Pure black `#09090B` on white `#FFFFFF` exceeds 14:1 (AAA). Accent blue `#0052CC` on white achieves 7:1 (AAA).
* Animations: CSS micro-transitions strictly under 150ms (`ease-out`). No floating or spinning effects.
