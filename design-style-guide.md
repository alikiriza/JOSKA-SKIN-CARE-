# Joska Beauty Products — Design Style Guide

> Single source of truth for all visual and interaction decisions in Joska Beauty Products. Reference this file before writing any UI code.
>
> **Dark mode: YES — full dark mode support via next-themes**
> **Aesthetic**: Natural Organic Beauty — fresh, clean, plant-inspired
> **Scope**: Storefront, Customer Dashboard, Admin Dashboard, Rider Panel, Landing Page, Email Templates

---

## Visual Reference

The design reference is a fresh, nature-inspired beauty product landing page featuring a dominant mint-sage green palette on a soft cream-mint background. Key observations:

- **Background:** Very light mint-cream (`#E8F5E4`) — not pure white, has a natural warmth
- **Primary brand color:** Sage green (`#7CC47A`) — used on CTA buttons, nav accents, and interactive elements
- **Typography:** Bold geometric sans-serif for display headlines (heavy 700–800 weight, slightly futuristic/organic feel); clean readable sans for body copy
- **Layout:** Clean grid with generous whitespace; thin hairline borders in soft green tones; no heavy shadows
- **Button style:** Rounded rectangle (not full pill), solid sage green fill, white text, generous padding
- **Card aesthetic:** Clean white/cream card surfaces, subtle hairline borders, minimal shadow, airy internal padding
- **Energy:** Natural · Fresh · Organic · Premium wellness — like a boutique beauty brand, not clinical or corporate
- **Dark mode energy:** Deep forest green and rich charcoal — maintaining the natural botanical palette at night

---

## 1. Design Philosophy

Joska Beauty Products is a premium skincare e-commerce brand. The UI must feel **natural, trustworthy, and beautifully effortless** — the kind of store you feel good shopping in.

**Three core principles:**

1. **Botanical freshness** — Sage greens on cream backgrounds. Every surface breathes. The palette is drawn from nature: leaves, stems, clean skin.
2. **Confident simplicity** — One brand green, one cream canvas. Clean borders, minimal shadows. No decoration without purpose. Every component should feel intentional.
3. **Premium accessibility** — Generous touch targets, legible type, responsive at every breakpoint. A customer on a phone in Kampala or London should have the same beautiful experience.

---

## 2. Typography

### Font Families

**Display font: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)** (Google Fonts)
**Body font: [Inter](https://fonts.google.com/specimen/Inter)** (Google Fonts)

Load via `next/font/google` in root layout:

```tsx
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
```

Apply both variables on root layout. Use `--font-display` for headings and `--font-body` for everything else.

### Type Scale

| Style | Size | Weight | Line Height | Tracking | Font | Usage |
|-------|------|--------|-------------|----------|------|-------|
| `display` | 56px | 700 | 1.05 | -0.03em | Space Grotesk | Landing hero headline |
| `display-sm` | 40px | 700 | 1.1 | -0.02em | Space Grotesk | Section heroes |
| `h1` | 32px | 600 | 1.2 | -0.02em | Space Grotesk | Page titles |
| `h2` | 26px | 600 | 1.25 | -0.015em | Space Grotesk | Section headings |
| `h3` | 20px | 600 | 1.3 | -0.01em | Space Grotesk | Card titles, modal titles |
| `h4` | 16px | 600 | 1.4 | 0 | Space Grotesk | List titles, labels |
| `body-lg` | 16px | 400 | 1.6 | 0 | Inter | Marketing body copy |
| `body` | 14px | 400 | 1.55 | 0 | Inter | Default body text |
| `body-sm` | 13px | 400 | 1.5 | 0 | Inter | Secondary info, meta |
| `caption` | 12px | 500 | 1.4 | 0.01em | Inter | Timestamps, badges, labels |
| `micro` | 11px | 600 | 1.3 | 0.05em | Inter | Uppercase eyebrows (uppercase) |
| `price` | 20px | 700 | 1.2 | -0.01em | Space Grotesk | Product prices |
| `price-lg` | 28px | 700 | 1.1 | -0.02em | Space Grotesk | Cart total, checkout total |
| `tabular` | 14px | 500 | 1.5 | 0 | Inter | Order amounts — `font-variant-numeric: tabular-nums` |

**Rules:**
- Display/h1/h2/h3/h4 always use Space Grotesk.
- Body, captions, UI chrome, labels always use Inter.
- Always use `tabular-nums` for prices, quantities, and order numbers.
- Never exceed weight 700 in UI chrome — 700 reserved for prices and hero display.

---

## 3. Color Palette

### Primary — Sage Green

| Token | Hex | Usage |
|-------|-----|-------|
| `sage-50` | `#F0F9EE` | Very subtle hover backgrounds, selected rows, focus rings |
| `sage-100` | `#D9F0D4` | Light chip backgrounds, soft highlights, avatar bg |
| `sage-200` | `#B8E0B1` | Hover surfaces, secondary borders |
| `sage-300` | `#90CB88` | Decorative accents, disabled primary |
| `sage-500` | `#5CAF55` | Secondary action accents, links in body copy |
| `sage-600` | `#4A9E44` | **Primary brand** — buttons, active nav, primary CTA |
| `sage-700` | `#3A8235` | Button hover / pressed states |
| `sage-900` | `#1A4018` | Deep green text (rarely — dark headings on light green bg) |

### Cream / Background Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `cream-50` | `#FAFDF9` | Lightest background (dark mode card surface) |
| `cream-100` | `#F2F9EF` | Page background (light mode) |
| `cream-200` | `#E8F5E4` | Card rails, muted surface, table header bg |
| `cream-300` | `#D5EBD0` | Dividers, input outlines (light mode) |

### Neutrals (Warm Slate)

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#F8F9F8` | Subtle surface (light mode cards) |
| `neutral-100` | `#EFF1EF` | Card bg alternative |
| `neutral-200` | `#DEE2DE` | Borders, dividers, input outlines |
| `neutral-300` | `#C4CAC4` | Placeholder borders, disabled borders |
| `neutral-400` | `#9AA39A` | Placeholder text, secondary icons |
| `neutral-500` | `#6B776B` | Secondary body text, captions |
| `neutral-600` | `#4E5C4E` | Primary body text (on white) |
| `neutral-700` | `#384038` | Strong body text |
| `neutral-900` | `#1A221A` | Headings, primary text |
| `white` | `#FFFFFF` | Cards, modals, sidebar (light mode) |

### Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `success-50` | `#ECFDF5` | Paid / Delivered badge bg |
| `success-600` | `#059669` | Success text, paid status, checkmarks |
| `warning-50` | `#FFFBEB` | Pending badge bg |
| `warning-600` | `#D97706` | Pending/processing status |
| `error-50` | `#FEF2F2` | Error toast bg, destructive confirm |
| `error-600` | `#DC2626` | Errors, destructive actions |
| `info-50` | `#EFF6FF` | Info banner bg |
| `info-600` | `#2563EB` | Info text, neutral badges |

### Order / Delivery Status Colors

| Status | Background | Text | Dot |
|--------|-----------|------|-----|
| PENDING | `warning-50` | `warning-600` | `warning-600` |
| PROCESSING | `info-50` | `info-600` | `info-600` |
| PACKED | `sage-50` | `sage-700` | `sage-600` |
| DISPATCHED | `sage-100` | `sage-700` | `sage-600` |
| DELIVERED | `success-50` | `success-600` | `success-600` |
| CANCELLED | `neutral-100` | `neutral-500` | `neutral-400` |
| PAID | `success-50` | `success-600` | `success-600` |
| UNPAID / PENDING | `warning-50` | `warning-600` | `warning-600` |
| FAILED | `error-50` | `error-600` | `error-600` |

### Dark Mode Palette

| Surface | Light | Dark |
|---------|-------|------|
| Page background | `cream-200` (`#E8F5E4`) | `#0D1A0D` |
| Card background | `#FFFFFF` | `#131F13` |
| Sidebar background | `#FFFFFF` | `#0F180F` |
| Border | `cream-300` (`#D5EBD0`) | `#1E2E1E` |
| Border strong | `neutral-200` | `#2A3D2A` |
| Text primary | `neutral-900` (`#1A221A`) | `#E8F5E4` |
| Text secondary | `neutral-600` (`#4E5C4E`) | `#90AB90` |
| Text muted | `neutral-400` (`#9AA39A`) | `#5A7A5A` |
| Input background | `#FFFFFF` | `#0F180F` |
| Hover surface | `sage-50` | `#1A2E1A` |

---

## 4. Spacing

**8px base grid.** All spacing = multiple of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps (badge padding) |
| `space-2` | 8px | Between related inline elements |
| `space-3` | 12px | Input internal padding, card tight gaps |
| `space-4` | 16px | Standard gap between components |
| `space-5` | 20px | Card internal padding (small) |
| `space-6` | 24px | Card internal padding (default) |
| `space-8` | 32px | Between sections within a page |
| `space-10` | 40px | Section separators |
| `space-12` | 48px | Large section breaks |
| `space-16` | 64px | Marketing section padding |
| `space-24` | 96px | Landing hero vertical padding |

**Page-level spacing:**
- Store content max-width: `1280px` with `px-8` desktop, `px-4` mobile
- Admin content max-width: `1440px` with `px-8` desktop
- Sidebar width: `260px` (expanded), `72px` (collapsed)
- Product grid: 4 columns desktop, 2 tablet, 1 mobile
- Section-to-section gap: `40px`
- Card internal padding: `24px` (default), `32px` (hero/feature cards)

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Inputs, small chips, tags |
| `radius` | 10px | **Default** — buttons, badges, small cards |
| `radius-md` | 12px | Medium cards, product cards |
| `radius-lg` | 16px | Main dashboard cards, modals content, cart |
| `radius-xl` | 20px | Hero feature cards, pricing cards |
| `radius-2xl` | 28px | Large landing sections, image frames |
| `radius-full` | 9999px | Avatars, status dots, pill badges |

**Rule:** Product image containers use `radius-md` (12px). Buttons use `radius` (10px). Never mix radius within the same card container.

---

## 6. Shadows & Elevation

```
shadow-xs:    0 1px 2px 0 rgba(26, 34, 26, 0.04)
shadow-sm:    0 1px 3px 0 rgba(26, 34, 26, 0.06), 0 1px 2px -1px rgba(26, 34, 26, 0.04)
shadow-md:    0 4px 6px -1px rgba(26, 34, 26, 0.07), 0 2px 4px -2px rgba(26, 34, 26, 0.04)
shadow-lg:    0 10px 15px -3px rgba(26, 34, 26, 0.08), 0 4px 6px -4px rgba(26, 34, 26, 0.04)
shadow-xl:    0 20px 25px -5px rgba(26, 34, 26, 0.10), 0 8px 10px -6px rgba(26, 34, 26, 0.04)

shadow-focus: 0 0 0 3px rgba(74, 158, 68, 0.20)   // Sage green focus rings
shadow-product: 0 8px 24px rgba(26, 34, 26, 0.08) // Product card hover
```

**Usage:**
- Cards on page: `shadow-xs` + `border border-cream-300`
- Product card hover: `shadow-product`
- Dropdowns/popovers: `shadow-md` + border
- Modals: `shadow-xl`
- Focus rings on inputs/buttons: `shadow-focus`
- Inputs: **no shadow** — border only

---

## 7. Component Specifications

### 7.1 Buttons

**Primary Button (CTA)**
- Background: `sage-600` (`#4A9E44`)
- Text: White, 14px Inter weight 500
- Height: `44px` (default), `36px` (sm), `52px` (lg)
- Horizontal padding: `20px`
- Border radius: `radius` (10px)
- Hover: `sage-700` (`#3A8235`)
- Active: `sage-700` + scale(0.98)
- Focus: `shadow-focus` ring
- Disabled: `neutral-200` bg, `neutral-400` text
- Loading: spinner left, text stays

**Secondary Button (Outline)**
- Background: White (light) / `#131F13` (dark)
- Border: `1.5px solid cream-300` (light) / `1.5px solid #2A3D2A` (dark)
- Text: `neutral-900`, 14px weight 500
- Hover: `sage-50` bg, `sage-200` border

**Ghost Button**
- Background: Transparent
- Text: `neutral-700`, 14px weight 500
- Hover: `sage-50` bg

**Destructive Button**
- Background: `error-600`
- Text: White
- Hover: `#B91C1C`

**Add to Cart Button** (special)
- Background: `sage-600`
- Text: White, 14px weight 600
- Height: `48px`
- Border radius: `radius` (10px)
- Icon: shopping-bag left 16px
- Hover: `sage-700`
- Full width on mobile

**Text Link**
- Color: `sage-600`
- Hover: `sage-700`, underline
- Underline-offset: `4px`

---

### 7.2 Inputs

- Height: `44px`
- Background: White (light) / `#0F180F` (dark)
- Border: `1.5px solid cream-300` (light) / `1.5px solid #1E2E1E` (dark)
- Radius: `radius-sm` (6px)
- Padding: `14px` horizontal
- Text: `14px`, `neutral-900` (light) / `cream-200` (dark)
- Placeholder: `neutral-400`
- Focus: `sage-600` border + `shadow-focus` ring, no outline
- Disabled: `neutral-50` bg, `neutral-400` text
- Invalid: `error-600` border, error text below (`13px`, `error-600`)
- Label above: `13px` Inter weight 500, `neutral-700`, `8px` gap
- Helper text: `12px` `neutral-500`

**Search Input (product search)**
- Background: `cream-200` (light) / `#0F180F` (dark)
- Border: `1.5px solid cream-300`
- Search icon left: `neutral-400`, `16px`
- Height: `44px`, `radius-md`
- On focus: border `sage-600`, bg white

---

### 7.3 Product Cards

**Product Card (storefront)**
- Background: White
- Border: `1px solid cream-300`
- Radius: `radius-md` (12px)
- Shadow: `shadow-xs`
- Image: aspect-ratio `4/3`, `object-fit: cover`, `radius-md` top only
- Hover: `shadow-product` + `border-sage-200` + image scale(1.03) transition
- Padding (info section): `16px`
- Product name: `14px` Space Grotesk weight 600 `neutral-900`
- Category pill: `caption` `sage-600` bg `sage-50` `radius-full`
- Price: `price` (20px Space Grotesk 700) `neutral-900`
- Compare price: `13px` `neutral-400` line-through
- Add to cart: full-width `sage-600` button below, `44px`
- Out of stock: desaturate image + "Out of Stock" overlay badge

**Featured Product Card** (landing)
- Larger: `radius-xl` (20px), `shadow-sm`, `32px` padding info
- Optional "Bestseller" or "New" ribbon badge: `sage-600` bg, white text, top-left corner

---

### 7.4 Tables (Admin Data Tables)

- Container: `radius-lg` (16px), `border cream-300`, `shadow-xs`
- Header row: `cream-200` bg, `12px` Inter weight 600 `neutral-500` uppercase tracking-wider, `48px` tall
- Body row: `56px` tall, `14px` Inter `neutral-700`
- Row border: `1px solid cream-200` bottom only
- Hover row: `sage-50` bg
- Selected row: `sage-100` bg
- First column padding: `24px` left
- Sticky header when scrolling
- Sort active: `sage-600` chevron
- Zebra striping: off

---

### 7.5 Status Badges

- Height: `24px`
- Padding: `4px 10px`
- Radius: `radius-full`
- Font: `12px` Inter weight 600
- Dot: `6px` circle, `6px` right margin
- See §3 for all status color mappings

**Example — Delivered:**
```
bg-success-50 text-success-600
● Delivered
```

---

### 7.6 Sidebar (Dashboard Navigation)

**Admin / Customer sidebar:**
- Width: `260px` expanded, `72px` collapsed
- Background: White (light) / `#0F180F` (dark)
- Border right: `1px solid cream-300` (light) / `1px solid #1E2E1E` (dark)
- Padding: `16px`
- Logo block: Joska wordmark in `sage-700` + leaf icon, `72px` tall
- Nav section label: `micro` uppercase `neutral-400`
- Nav item:
  - Height: `44px`
  - Padding: `10px 14px`
  - Radius: `radius` (10px)
  - Icon: `18px` `neutral-400`
  - Text: `14px` Inter weight 500 `neutral-700`
  - Gap icon ↔ text: `12px`
  - Hover: `sage-50` bg (light) / `#1A2E1A` (dark)
  - Active: `sage-100` bg, `sage-700` text, `sage-600` icon, `3px` left accent bar `sage-600`
- Dark mode toggle: bottom of sidebar, toggle switch with sun/moon icon
- User block: avatar `40×40` circle + name `14px` + role badge `caption`

---

### 7.7 Top Navigation (Storefront)

- Height: `72px`
- Background: `cream-200` (light) / `#0D1A0D` (dark) with `backdrop-blur-sm` + semi-transparent when scrolled
- Border bottom: `1px solid cream-300`
- Left: Joska logo (wordmark + leaf icon)
- Center: nav links (Home, Products, Categories, About, Contact)
- Right: search icon + dark mode toggle + cart icon with item count badge + account avatar or "Sign In" button
- Sticky on scroll
- Mobile: hamburger menu → full-screen drawer

---

### 7.8 Modals & Dialogs

- Overlay: `rgba(10, 20, 10, 0.6)` + `backdrop-blur-sm`
- Modal: max-width `540px` (default), `680px` (lg — product image gallery)
- Background: White (light) / `#131F13` (dark)
- Radius: `radius-xl` (20px)
- Shadow: `shadow-xl`
- Header padding: `28px 28px 16px`
- Body padding: `16px 28px`
- Footer padding: `16px 28px 28px`
- Title: Space Grotesk `h3`
- Close button: top-right, icon `18px`
- Open animation: scale(0.95) + opacity(0) → scale(1) + opacity(1), `200ms ease-out`

---

### 7.9 Toasts (Sonner)

- Position: bottom-right
- Background: White (light) / `#131F13` (dark)
- Shadow: `shadow-lg`
- Border: `1px solid cream-300` (light) / `1px solid #2A3D2A` (dark)
- Radius: `radius` (10px)
- Padding: `14px 16px`
- Title: `14px` Inter weight 500
- Description: `13px` `neutral-500`
- Auto-dismiss: `4s`
- Success icon: `sage-600`
- Error icon: `error-600`
- Warning icon: `warning-600`

---

### 7.10 Empty States

- Centered in container
- Icon: `48px`, `neutral-300` inside `80×80` `sage-50` rounded circle
- Title: `h3` Space Grotesk `neutral-900`
- Description: `body` Inter `neutral-500`, max-width `380px`, centered
- Primary CTA button: `32px` top margin

---

### 7.11 Cart & Checkout Components

**Cart Item Row:**
- Image: `64×64px` `radius-md`, `object-fit: cover`
- Product name: `14px` Space Grotesk weight 600
- Variant/size: `13px` `neutral-500`
- Qty controls: `−` / `+` icon buttons `32×32px`, qty number `14px` weight 600 centered, `radius-sm`
- Price: `price` Space Grotesk weight 700 right-aligned
- Remove: trash icon button top-right, `neutral-400` → `error-600` hover

**Order Summary Card:**
- Background: `cream-200` (light) / `#131F13` (dark)
- Radius: `radius-lg`
- Padding: `24px`
- Line: subtotal, delivery, total
- Total row: `price-lg` Space Grotesk weight 700
- CTA: full-width sage-600 primary button

**Delivery Status Timeline:**
- Vertical stepper with 5 nodes
- Completed step: `sage-600` filled circle + `sage-600` line
- Current step: `sage-600` pulsing ring
- Pending step: `neutral-300` empty circle + `neutral-200` dashed line
- Timestamp: `12px` `neutral-500` below each step label

---

### 7.12 Forms

- Field vertical gap: `20px`
- Field label: `13px` Inter weight 500 `neutral-700`
- Section divider: `border-t cream-300`, `32px` top margin
- Section header: `h4` Space Grotesk + `body-sm` Inter `neutral-500` description
- Form footer: right-aligned Cancel (ghost) + Save (primary), `12px` gap

**Validation:**
- Inline errors: `12px` Inter weight 500 `error-600` below field
- Invalid border: `error-600`
- Disable submit during `isSubmitting`, show spinner inside button

---

## 8. Iconography

Use **[Lucide Icons](https://lucide.dev)** (`lucide-react`) as the primary icon library.

**Sizing:**
- Nav icons: `18px`
- Inline with body: `14px`
- Icon buttons: `18px`
- Product card actions: `16px`
- Empty state icons: `48px`
- Feature section icons: `28px`

**Color rules:**
- Default: `neutral-500` (light) / `neutral-400` (dark)
- Active/selected: `sage-600`
- Inside primary CTA: `white`
- Feature highlight: `sage-600` on `sage-50` square bg

**Stroke width:** `1.5` (slightly lighter than default for premium feel)

**Key icons to use consistently:**
- Cart: `shopping-bag`
- Order: `package`
- Delivery: `truck`
- Product: `sparkles`
- Category: `grid-3x3`
- User: `user-circle`
- Admin: `shield-check`
- Rider: `bike`
- Review: `star`
- Address: `map-pin`

---

## 9. Motion & Animation

**Principles:** elegant, natural, never bouncy. Inspired by how plant leaves move — smooth and organic.

| Transition | Duration | Easing |
|-----------|----------|--------|
| Button press | `100ms` | `ease-out` |
| Hover state | `150ms` | `ease-out` |
| Product card hover | `200ms` | `ease-out` |
| Dropdown/popover | `150ms` | `ease-out` |
| Modal enter | `250ms` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal exit | `150ms` | `ease-in` |
| Page transition | `300ms` | `ease-out` |
| Toast slide | `300ms` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Image gallery | `350ms` | `ease-in-out` |

**Do:**
- `transition-colors` on all interactive elements
- `transition-transform transition-shadow` on product cards (hover scale + shadow)
- Fade + scale for modals
- Skeleton shimmer for loading product grids
- Framer Motion for page entry animations (fade-up, stagger product grid items)

**Don't:**
- Spring animations in admin/account panels
- Rotation/flip effects
- Anything > 400ms in the store UI
- Blinking (except loading spinners)

---

## 10. Imagery

- **Product images:** Real product photos, `aspect-ratio: 4/3`, `object-fit: cover`, `radius-md` container. Multiple images per product support image gallery on detail page.
- **Avatars:** Circular, `sage-100` placeholder bg with initials in `sage-700`
- **Empty states:** Simple Lucide icon on `sage-50` circle, no illustrations
- **Landing hero:** Full-width product photography (hero image of skincare products on cream surface), slight green tint overlay
- **Category images:** Square `1:1` with product flat-lay photography, `radius-lg` container
- **Brand logo:** Joska wordmark in `sage-700` + small leaf/plant icon. `h-10` in nav, `h-8` in mobile nav.

---

## 11. Landing Page Specifics

- **Hero:** `cream-200` (#E8F5E4) background, full-width section, `96px` vertical padding
- Hero headline: `display` (56px) Space Grotesk 700 `neutral-900`, max 2 lines
- Hero subhead: `body-lg` Inter 400 `neutral-600`, max `560px` width
- Hero CTA cluster: primary sage button "Browse Products" + ghost "Learn More", `20px` gap
- Hero image: right-aligned product photography, `radius-2xl`, slight shadow
- Section alternation: `cream-200` → white → `cream-200`, `80px` vertical padding each
- Max content width: `1280px`
- **Category grid:** 5 category pills, `radius-full`, `sage-50` bg, `sage-700` text, `sage-600` border, hover `sage-100`
- **Product grid:** 4 columns desktop, 2 tablet, 1 mobile, `24px` gap
- **Why Joska section:** 3-column feature grid on white bg. Each card: `sage-50` icon circle + Space Grotesk h3 + Inter body
- **Testimonials:** Cream bg, 3 cards `radius-xl`, quote, customer name, star rating in `sage-500`
- **Footer:** `neutral-900` background, white text, Joska logo white, nav links, social icons, copyright

---

## 12. PDF Invoice Template

PDFs use `@react-pdf/renderer` with its own `StyleSheet`.

**PDF palette:**
- Text primary: `#1A221A`
- Text secondary: `#4E5C4E`
- Muted: `#9AA39A`
- Borders: `#D5EBD0`
- Brand accent: `#4A9E44` (sage-600)
- Background accent: `#F0F9EE` (sage-50)

**PDF layout:**
- Header: Joska logo left + sage-600 top bar `8px` + order number right
- Customer/shipping info: two-column grid
- Line items table: product name, qty, unit price, total. Header row `sage-50` bg.
- Totals section: right-aligned subtotal, delivery, bold total row with sage-600 border-top
- Footer: `neutral-400` website URL + "Thank you for your purchase"

**PDF typography:**
- Header: 18px Space Grotesk weight 700 sage-600
- Section labels: 10px Inter weight 700 uppercase neutral-500
- Body: 10px Inter weight 400
- Totals: 12px Inter weight 600; grand total 14px weight 700

**PDF spacing:** Page padding `40px`, section gap `20px`.

---

## 13. Email Templates (React Email)

- Max width: `600px`
- Background: `#E8F5E4` (cream-200)
- Card: white, `border: 1px solid #D5EBD0`, `border-radius: 16px`
- Header: sage-600 bar `8px` tall at top, Joska logo centered below
- Body padding: `28px`
- Headline: Space Grotesk 22px weight 600 `#1A221A`
- Body: Inter 14px weight 400 `#4E5C4E` line-height 1.6
- CTA Button: sage-600 bg, white text, `12px 24px` padding, `border-radius: 10px`, `font-size: 14px`, weight 500
- Order items table: `cream-200` header row, `1px solid #D5EBD0` row borders
- Footer: Inter 12px `#9AA39A` centered, unsubscribe link

**Email subjects:**
- Order confirmation: "Your Joska order #{{orderNumber}} is confirmed ✅"
- Dispatched: "Your Joska order is on its way! 🚚"
- Delivered: "Your Joska order has arrived! Leave a review ⭐"
- Welcome: "Welcome to Joska — your skincare journey starts here 🌿"

---

## 14. Tailwind v4 CSS-First Configuration

In `app/globals.css` using Tailwind v4's `@theme` directive (no `tailwind.config.ts`):

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-sans: var(--font-body);

  /* Sage Green — Primary Brand */
  --color-sage-50: #F0F9EE;
  --color-sage-100: #D9F0D4;
  --color-sage-200: #B8E0B1;
  --color-sage-300: #90CB88;
  --color-sage-500: #5CAF55;
  --color-sage-600: #4A9E44;
  --color-sage-700: #3A8235;
  --color-sage-900: #1A4018;

  /* Cream — Background Neutrals */
  --color-cream-50: #FAFDF9;
  --color-cream-100: #F2F9EF;
  --color-cream-200: #E8F5E4;
  --color-cream-300: #D5EBD0;

  /* Warm Slate Neutrals */
  --color-neutral-50: #F8F9F8;
  --color-neutral-100: #EFF1EF;
  --color-neutral-200: #DEE2DE;
  --color-neutral-300: #C4CAC4;
  --color-neutral-400: #9AA39A;
  --color-neutral-500: #6B776B;
  --color-neutral-600: #4E5C4E;
  --color-neutral-700: #384038;
  --color-neutral-900: #1A221A;

  /* Semantic */
  --color-success-50: #ECFDF5;
  --color-success-600: #059669;
  --color-warning-50: #FFFBEB;
  --color-warning-600: #D97706;
  --color-error-50: #FEF2F2;
  --color-error-600: #DC2626;
  --color-info-50: #EFF6FF;
  --color-info-600: #2563EB;

  /* Radius */
  --radius-sm: 6px;
  --radius: 10px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 28px;

  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(26, 34, 26, 0.04);
  --shadow-focus: 0 0 0 3px rgba(74, 158, 68, 0.20);
  --shadow-product: 0 8px 24px rgba(26, 34, 26, 0.08);
}

/* Dark mode variables */
.dark {
  --color-page-bg: #0D1A0D;
  --color-card-bg: #131F13;
  --color-sidebar-bg: #0F180F;
  --color-border: #1E2E1E;
  --color-border-strong: #2A3D2A;
  --color-text-primary: #E8F5E4;
  --color-text-secondary: #90AB90;
  --color-text-muted: #5A7A5A;
}

body {
  background-color: var(--color-cream-200, #E8F5E4);
  color: var(--color-neutral-900, #1A221A);
  font-family: var(--font-body);
}

.dark body {
  background-color: #0D1A0D;
  color: #E8F5E4;
}
```

---

## 15. Accessibility

- Minimum touch target: `44×44px` desktop and mobile (especially "Add to Cart" and quantity buttons)
- Color contrast: `4.5:1` body text, `3:1` large text and UI components
- All interactive states: visible focus ring via `shadow-focus`
- Icons used alone: `aria-label` or `sr-only` text always
- Product images: meaningful `alt` text (product name + key feature)
- Form fields: `<label>` always linked via `htmlFor`
- Status badges: text + dot (never color alone)
- Cart count badge: `aria-label="Cart: N items"`
- Semantic HTML: `<main>`, `<nav>`, `<article>` (product cards), `<button>` for actions, `<a>` for navigation

---

## 16. Do's & Don'ts

**Do:**
- Use `tabular-nums` for all prices, totals, and order numbers
- Use Space Grotesk for all headings and product prices
- Use sage green as the one brand action color — it carries the identity
- Keep the cream-200 background — it's the signature surface of Joska
- Use `aspect-ratio: 4/3` on all product images — no layout shift
- Animate product card image on hover with scale(1.03)
- Keep generous whitespace — the "breathing room" is part of the brand
- Use Lucide icons at `stroke-width: 1.5` for the premium feel

**Don't:**
- Use pure white `#FFFFFF` as page background in light mode — use `cream-200`
- Use font weight above 700 anywhere in the UI
- Use more than one shade of green per component (pick one from the sage scale)
- Add gradients to product cards or admin panels — flat surfaces only
- Use emoji in UI chrome (landing testimonials: ok; navigation, buttons: never)
- Hardcode currency — use `Intl.NumberFormat` with the product's currency
- Use shadows heavier than `shadow-md` in the admin panel
- Mix border radius values within the same card container
- Use `neutral-900` text on `sage-600` backgrounds — use white
