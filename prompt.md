# Claude Code — Joska Beauty Products Build Prompt

Read the following files **in this exact order** before doing anything else:

1. `master_prompt.md` — Your tech stack rules, Prisma v7 patterns, and coding standards. Follow EXACTLY.
2. `design-style-guide.md` — The visual design system for Joska Beauty Products. Apply to every component you build. Sage green palette, cream backgrounds, Space Grotesk + Inter fonts.
3. `jb-components.md` — The JB component registry. Use these components before writing from scratch.
4. `project-description.md` — What we are building. Every decision must align with this document.
5. `project-phases.md` — The build plan. Work through phases in order, one at a time.

---

## Rules — Follow Without Exception

### Process
- Work through **ONE phase at a time**. Complete every task in a phase before moving to the next.
- After completing each phase, **stop and confirm with me** before proceeding to the next.
- Check off tasks as you complete them in `project-phases.md`.

### Design
- Follow `design-style-guide.md` tokens exactly: sage green `#4A9E44` as the only primary action color, cream-200 `#E8F5E4` as the page background (NOT pure white), Space Grotesk for all headings and prices, Inter for body.
- Dark mode is required on every component — use `next-themes` and the dark mode variables from §3 of the design guide.
- Product images always use `aspect-ratio: 4/3` with `object-fit: cover`.
- Stroke width on Lucide icons: always `1.5`.
- Never use pure white `#FFFFFF` as the page background in light mode.

### Data & API
- **Use React Query for all client-side data fetching.** Never use `useEffect` to fetch data.
- **Use Redis caching on every GET API route** via `getCachedOrFetch()` from `lib/cache.ts`.
- **Invalidate relevant Redis cache keys** on every mutation (POST, PUT, DELETE).
- Use Prisma v7 patterns (NOT v6). See `master_prompt.md` for exact setup.
- Use API Routes (Route Handlers) for all server-side logic — no server actions.
- Cache key naming conventions:
  - `products:all` — full product list
  - `products:category:{slug}` — products by category
  - `product:{slug}` — single product + reviews
  - `categories:all` — all categories
  - `orders:all` — admin all orders
  - `orders:user:{userId}` — customer order history
  - `analytics:overview` — admin KPI data

### Forms & Validation
- Use React Hook Form + Zod for ALL forms (product create/edit, checkout, address, review, login, register).
- Every form wrapped in `<Suspense>` + `<ErrorBoundary>`.
- Disable submit button during `isSubmitting`, show spinner inside button.

### Performance
- `next/dynamic` for heavy imports: PDF renderer, charts (Recharts), image gallery.
- `<Suspense>` boundaries on every data-fetching section.
- `<ErrorBoundary>` on every major page block.
- Skeleton components for: product grid, product detail, admin tables, dashboard KPIs.
- Animate only `transform` and `opacity` — never layout properties.

### JB Components — Install First, Never Reinvent
- **Before building auth** → install JB Better Auth UI
- **Before building the cart** → install Zustand Cart
- **Before building checkout** → install Stripe UI Component (requires Better Auth + Zustand Cart)
- **Before building product image uploads** → install File Storage UI (R2)
- **Before building any admin data table** → install Data Table
- **Before any country/rider/category select with 10+ options** → install Searchable Select

---

## Project Context Summary

**App:** Joska Beauty Products — skincare e-commerce with customer storefront, admin dashboard, and rider delivery panel.

**Three user roles:**
- `CUSTOMER` — browse, buy, track, review
- `ADMIN` — manage everything (products, orders, deliveries, users, analytics)
- `RIDER` — view and update their assigned deliveries only

**Payment:** Stripe (online card) + Cash on Delivery flag. Both flows must be built.

**Delivery:** Worldwide shipping. Admin assigns orders to riders. Riders update status. Customers track in real time.

**Key integrations:** Better Auth + Google OAuth, Resend (3 email triggers), Stripe, Cloudflare R2 (product images), Upstash Redis.

---

## Start Command

Begin with **Phase 1 — Foundation** from `project-phases.md`.

Read all Phase 1 tasks carefully and execute them in order. The first task is initializing Next.js 16 with shadcn/ui using the flat root layout (no `--src-dir`).

When Phase 1 is complete, list every task you completed and ask for my confirmation before moving to Phase 2.
