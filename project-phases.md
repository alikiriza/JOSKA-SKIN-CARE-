# Joska Beauty Products — Build Phases

## Phase 1 — Foundation
**Goal:** Project scaffolded, design system applied, env files created, database connected, Redis cache configured, auth working with Google OAuth, sidebar layout built, protected routes enforced.

### Tasks
- [ ] Initialize Next.js 16 + shadcn/ui in ONE step: `pnpm dlx shadcn@latest init --preset b0 --template next`. **Do NOT use `--src-dir`** — use flat root layout (`app/`, `components/`, `lib/` at project root, no `src/` wrapper). Fallback: `pnpm create next-app --no-src-dir`.
- [ ] Confirm `tsconfig.json` has `"paths": { "@/*": ["./*"] }` (NOT `["./src/*"]`).
- [ ] Install the Form shadcn fallback: `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/form.json`
- [ ] Create `.env.example` (committed) and `.env.local` (gitignored) with ALL required env vars:
  ```
  # Database
  DATABASE_URL=                        # Neon PostgreSQL connection string

  # Redis
  UPSTASH_REDIS_REST_URL=              # Upstash Redis REST URL
  UPSTASH_REDIS_REST_TOKEN=            # Upstash Redis REST token

  # Better Auth
  BETTER_AUTH_SECRET=                  # Random 32+ char string (randomkeygen.com)
  BETTER_AUTH_URL=                     # http://localhost:3000 in dev

  # Google OAuth
  GOOGLE_CLIENT_ID=                    # Google Cloud Console
  GOOGLE_CLIENT_SECRET=                # Google Cloud Console

  # Resend
  RESEND_API_KEY=                      # Resend dashboard
  RESEND_FROM_EMAIL=                   # noreply@joskabproducts.com

  # Stripe
  STRIPE_SECRET_KEY=                   # sk_test_... from Stripe dashboard
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # pk_test_... from Stripe dashboard

  # Cloudflare R2
  CLOUDFLARE_R2_ACCESS_KEY_ID=         # R2 API token
  CLOUDFLARE_R2_SECRET_ACCESS_KEY=     # R2 API secret
  CLOUDFLARE_R2_ENDPOINT=              # https://<account_id>.r2.cloudflarestorage.com
  CLOUDFLARE_R2_BUCKET_NAME=           # joska-products
  CLOUDFLARE_R2_PUBLIC_DEV_URL=        # Public bucket URL

  # App
  NEXT_PUBLIC_API_URL=                 # http://localhost:3000
  ```
- [ ] Add `.env.local` to `.gitignore`
- [ ] Set up Prisma v7 with Neon PostgreSQL — create `prisma/schema.prisma`, configure generator with custom output path, create `lib/db.ts` client
- [ ] Set up Upstash Redis in `lib/cache.ts`:
  ```ts
  import { Redis } from "@upstash/redis";
  const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });

  export async function getCachedOrFetch<T>(key: string, fetcher: () => Promise<T>, ttl = 60): Promise<T> {
    const cached = await redis.get<T>(key);
    if (cached) return cached;
    const data = await fetcher();
    await redis.setex(key, ttl, data);
    return data;
  }

  export async function invalidateTag(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  }
  ```
- [ ] Apply `design-style-guide.md` tokens to `app/globals.css` — Tailwind v4 CSS-first config with `@theme` directive. Define all custom CSS variables: `--color-primary-*`, `--color-sage-*`, `--color-cream-*`, semantic colors, spacing, border-radius.
- [ ] Load Space Grotesk + Inter via `next/font/google` in root layout.
- [ ] Create root layout (`app/layout.tsx`) with: font classes, `QueryClientProvider`, `ThemeProvider` (next-themes), `Toaster` (Sonner).
- [ ] Build collapsible sidebar layout (`components/layout/sidebar.tsx`) for both admin and customer dashboard with nav items, Joska logo, user section with avatar + name + role badge, dark mode toggle, collapse button.
- [ ] Build page header component (`components/layout/page-header.tsx`) — breadcrumb + page title + right-side action slot.
- [ ] Install JB Better Auth UI: `pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json`
- [ ] **Merge auth files into existing routes — do NOT overwrite existing `page.tsx` or `layout.tsx`. Edit and integrate.**
- [ ] Configure Better Auth with Google OAuth — set up `lib/auth.ts` and `lib/auth-client.ts`
- [ ] Create `middleware.ts` for edge-level protected route enforcement:
  - `/dashboard/*` → ADMIN only
  - `/rider/*` → RIDER only
  - `/account/*` → any authenticated user
  - Redirect unauthenticated to `/auth/sign-in`
  - Redirect wrong role to `/` with toast
- [ ] Build custom `not-found.tsx`, `error.tsx`, and global `loading.tsx` with Joska branding and green palette
- [ ] Verify: sign up, sign in, Google OAuth, email verification, forgot password, protected routes all work end-to-end

### Dependencies
- Neon database created, `DATABASE_URL` set
- Upstash Redis instance created, `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` set
- Google Cloud Console OAuth app created, redirect URI set to `http://localhost:3000/api/auth/callback/google`
- Resend account created, `RESEND_API_KEY` set

---

## Phase 2 — Product Catalogue & Customer Shopping
**Goal:** Customers can browse products, view detail pages, add to cart, and the full public-facing storefront is live with real data.

### Tasks
- [ ] Define full Prisma schema with ALL models: `User`, `Session`, `Account`, `Address`, `Category`, `Product`, `Review`, `Order`, `OrderItem`, `Delivery` — see `project-description.md` for all fields, types, enums, and relations
- [ ] Add enums: `Role` (CUSTOMER | ADMIN | RIDER), `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `DeliveryStatus`
- [ ] Run migration: `pnpm db:push && pnpm db:generate`
- [ ] Create `prisma/seed.ts` with realistic seed data:
  - 5 categories (Serums, Creams, Soaps, Lotions, Toners)
  - 30+ products with realistic names, descriptions, ingredients, prices (USD), images (use placeholder URLs), stock quantities
  - 1 admin user, 2 rider users, 10 customer users
  - 20+ orders in various statuses with order items
  - 10+ reviews
  - Add `"db:seed": "tsx prisma/seed.ts"` to `package.json` scripts
- [ ] Run: `pnpm db:seed`
- [ ] Build API routes for products and categories with Redis caching:
  - `GET /api/products` — paginated, filter by category/price/search, cache key `products:*`, TTL 120s
  - `GET /api/products/[slug]` — single product + reviews, cache key `product:{slug}`, TTL 300s
  - `GET /api/categories` — all categories, cache key `categories:all`, TTL 600s
- [ ] Install Zustand Cart: `pnpm dlx shadcn@latest add https://jb.desishub.com/r/zustand-cart.json`
- [ ] Build landing page (`app/page.tsx`):
  - Hero section: headline "Natural Skincare for Radiant You", subheading, "Browse Products" CTA, product imagery
  - Featured products section (4–6 products from API, isFeatured=true)
  - Category pills/grid section
  - "Why Joska?" 3-column feature grid (natural ingredients, worldwide shipping, 100% authentic)
  - Customer testimonials section (3 static cards)
  - Footer with links, social, brand tagline
- [ ] Build product catalogue page (`app/products/page.tsx`):
  - Category filter sidebar (desktop) / filter drawer (mobile)
  - Price range filter
  - Search input
  - Sort select (Newest, Price: Low–High, Price: High–Low, Most Popular)
  - Responsive product grid with `ProductCard` component (image, name, price, add-to-cart button, stock badge)
  - Suspense + skeleton for loading state
  - Pagination
- [ ] Build product detail page (`app/products/[slug]/page.tsx`):
  - Image gallery with thumbnail strip
  - Product name, price, comparePrice (strikethrough if set), stock status badge
  - Description, Ingredients, Usage tabs
  - Add to cart (quantity selector + add button)
  - Reviews section: average rating stars, list of reviews, "Write a review" form (auth required)
  - ErrorBoundary wrapping the page
- [ ] Build cart page (`app/cart/page.tsx`):
  - Cart item list from Zustand store (image, name, price, quantity controls, remove)
  - Order summary card (subtotal, delivery estimate note, total)
  - "Proceed to Checkout" button → `/checkout`
  - Empty cart state with "Start Shopping" CTA
- [ ] Verify: product browsing, filtering, search, product detail, add to cart, cart persistence all work

### Dependencies
- Phase 1 complete (auth + layout working)

---

## Phase 3 — Checkout & Payments
**Goal:** Customers can complete purchases via Stripe or cash on delivery. Orders saved to database. Confirmation emails sent.

### Tasks
- [ ] Install Stripe UI Component: `pnpm dlx shadcn@latest add https://stripe-ui-component.desishub.com/r/stripe-ui-component.json`
- [ ] Install File Storage UI (R2): `pnpm dlx shadcn@latest add https://file-storage-registry.vercel.app/r/file-storage.json`
- [ ] Configure Stripe env vars: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Build checkout page (`app/checkout/page.tsx`) — multi-step flow:
  - Step 1: Shipping address form (pre-fill from saved default address if logged in). React Hook Form + Zod validation. Fields: fullName, country, city, street, postalCode, phone.
  - Step 2: Payment method selection — "Pay with Card (Stripe)" or "Cash on Delivery"
  - Step 3: Order review — line items, shipping address, payment method, total, "Place Order" button
- [ ] Build Stripe payment step — embed Stripe Payment Element from installed Stripe UI
- [ ] Build cash on delivery flow — skip Stripe, create order directly with `paymentStatus: PENDING`
- [ ] Build `POST /api/orders` route — create order + order items, save shipping address snapshot, trigger confirmation email, invalidate Redis cache `orders:*`
- [ ] Build `GET /api/stripe/create-payment-intent` route (from Stripe UI — wire to order total)
- [ ] Build `GET /api/stripe/verify-payment` route — update order `paymentStatus: PAID` on success
- [ ] Build order confirmation page (`app/order-confirmation/page.tsx`) — order number, summary table, estimated delivery, "Track Order" + "Continue Shopping" buttons
- [ ] Build `POST /api/orders/[id]/status` — update order status (admin only), invalidate cache
- [ ] Verify: Stripe test payment end-to-end, COD order creation, confirmation page, Redis invalidation on new order

### Dependencies
- Phase 2 complete (products, cart, Zustand Cart installed)
- Better Auth installed (Stripe UI prerequisite)
- Stripe test API keys in `.env.local`

---

## Phase 4 — Customer Account & Order Tracking
**Goal:** Logged-in customers can view order history, track deliveries in real time, manage addresses, and leave reviews.

### Tasks
- [ ] Build account layout (`app/account/layout.tsx`) — sidebar nav: Profile, Orders, Addresses
- [ ] Build profile page (`app/account/page.tsx`) — name, email display, avatar, "Change Password" link
- [ ] Build order history page (`app/account/orders/page.tsx`):
  - Data table: order number, date, total, status badge, actions (view)
  - Filter by status
  - React Query for data fetching from `GET /api/account/orders`
- [ ] Build order detail page (`app/account/orders/[id]/page.tsx`):
  - Line items table with product image snapshots
  - Payment info (method, status)
  - Delivery timeline component: 5-step vertical stepper (Placed → Processing → Packed → In Transit → Delivered) with timestamps
  - "Download Invoice" button (PDF via @react-pdf/renderer)
- [ ] Build PDF invoice template using `@react-pdf/renderer` — Joska branded header, order items table, totals, green accent colors
- [ ] Build `GET /api/account/orders` route — auth-protected, return current user's orders only, Redis cache `orders:user:{userId}`, TTL 60s
- [ ] Build `GET /api/account/orders/[id]` route — verify order belongs to current user
- [ ] Build addresses page (`app/account/addresses/page.tsx`) — list of saved addresses, add/edit/delete, set default
- [ ] Build `GET|POST|PUT|DELETE /api/account/addresses` routes
- [ ] Build review creation — `POST /api/reviews` — only allow if user has a delivered order containing the product. Invalidate `product:{slug}` cache.
- [ ] Verify: order history, order detail with timeline, PDF download, addresses CRUD, review submission all work

### Dependencies
- Phase 3 complete (orders exist in database)

---

## Phase 5 — Admin Dashboard
**Goal:** Admin has full control over products, categories, orders, deliveries, and users. Analytics overview live.

### Tasks
- [ ] Install Data Table: `pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json`
- [ ] Install Searchable Select: `pnpm dlx shadcn@latest add https://jb.desishub.com/r/searchable-select.json`
- [ ] Build admin layout (`app/dashboard/layout.tsx`) — sidebar with admin-only nav items
- [ ] Build analytics dashboard (`app/dashboard/page.tsx`):
  - KPI cards: Total Revenue, Total Orders, New Customers (this month), Pending Deliveries
  - Revenue chart (monthly bar chart, last 6 months) using Recharts
  - Recent orders table (last 10)
  - Top 5 selling products list
  - All data from `GET /api/admin/analytics` with Redis cache `analytics:overview`, TTL 300s
- [ ] Build `GET /api/admin/analytics` route — aggregate queries for KPIs and chart data
- [ ] Build products admin pages:
  - `app/dashboard/products/page.tsx` — Data Table with columns: Image, Name, Category, Price, Stock, Status, Actions. Search, category filter, Excel export (xlsx). Skeleton loading.
  - `app/dashboard/products/new/page.tsx` — Create form: name, slug (auto-generated), description, ingredients, usage, price, comparePrice, stock, category (Searchable Select), isFeatured toggle, image upload (R2 via File Storage UI — support multiple images), isActive toggle. React Hook Form + Zod. On submit: `POST /api/admin/products`, invalidate `products:*` cache.
  - `app/dashboard/products/[id]/edit/page.tsx` — Edit form, pre-filled. `PUT /api/admin/products/[id]`, invalidate cache.
  - `DELETE /api/admin/products/[id]` — soft delete (isActive=false), invalidate cache.
- [ ] Build `GET|POST /api/admin/products` and `PUT|DELETE /api/admin/products/[id]` routes with Redis cache invalidation
- [ ] Build categories admin pages:
  - `app/dashboard/categories/page.tsx` — Data Table: name, slug, product count, actions
  - `app/dashboard/categories/new/page.tsx` — Create form (name, slug, description, image upload)
  - Build `GET|POST|PUT|DELETE /api/admin/categories` routes, invalidate `categories:*` cache
- [ ] Build orders admin pages:
  - `app/dashboard/orders/page.tsx` — Data Table: order number, customer, date, total, payment status, order status, actions. Filter by status. Excel export.
  - `app/dashboard/orders/[id]/page.tsx` — Order detail: line items, customer info, shipping address, payment info, status update dropdown (OrderStatus enum), assign rider (Searchable Select of riders), save button. On save: `PUT /api/admin/orders/[id]`, create/update Delivery record, invalidate order cache.
- [ ] Build `GET /api/admin/orders`, `GET|PUT /api/admin/orders/[id]` routes
- [ ] Build deliveries admin page:
  - `app/dashboard/deliveries/page.tsx` — Data Table: order number, customer, rider name, delivery status, assigned date, delivered date. Filter by rider, filter by status.
  - `GET /api/admin/deliveries` route
- [ ] Build users admin page:
  - `app/dashboard/users/page.tsx` — Data Table: name, email, role badge, order count, joined date, actions (change role, deactivate)
  - `GET /api/admin/users`, `PUT /api/admin/users/[id]` routes
- [ ] Build riders admin page:
  - `app/dashboard/riders/page.tsx` — List of RIDER users with active delivery count badge. "Create Rider" button → form (name, email, password, phone).
  - `POST /api/admin/riders` route
- [ ] Add low-stock alert badge on products table (stock < 10 → warning badge)
- [ ] Verify: all admin CRUD operations, analytics loading, Excel export, Redis caching, role-based access

### Dependencies
- Phase 4 complete (orders, deliveries data exists)

---

## Phase 6 — Rider Panel
**Goal:** Riders have their own panel to view and action their assigned deliveries.

### Tasks
- [ ] Build rider layout (`app/rider/layout.tsx`) — minimal sidebar: My Deliveries, Profile
- [ ] Build rider home (`app/rider/page.tsx`):
  - Cards/list of assigned deliveries filtered to current rider
  - Each card: order number, customer name, delivery address summary, current status badge, "View Details" link
  - Empty state: "No deliveries assigned yet"
  - Data from `GET /api/rider/deliveries` with React Query
- [ ] Build delivery detail page (`app/rider/deliveries/[id]/page.tsx`):
  - Order summary: items list, total
  - Customer info: name, phone, full delivery address
  - Status update buttons (only show next valid transition):
    - ASSIGNED → "Mark Picked Up"
    - PICKED_UP → "Mark In Transit"
    - IN_TRANSIT → "Mark Delivered"
  - `PUT /api/rider/deliveries/[id]/status` route — validates rider owns this delivery, updates status + timestamp, on DELIVERED updates Order status to DELIVERED, sends delivery confirmation email, invalidates order cache
- [ ] Build `GET /api/rider/deliveries` route — filter Delivery by riderId = current user, include Order + OrderItems + Address
- [ ] Verify: rider sees only their deliveries, status transitions work, delivered order triggers email

### Dependencies
- Phase 5 complete (admin can assign riders to orders)

---

## Phase 7 — Email Notifications
**Goal:** Customers receive branded emails at key order lifecycle events.

### Tasks
- [ ] Install and configure Resend + React Email: `pnpm add resend @react-email/components`
- [ ] Create `lib/email.ts` — Resend client wrapper with `sendEmail()` helper
- [ ] Build email templates in `emails/` directory using React Email:
  - `order-confirmation.tsx` — Joska logo header (green), order number, items table, total, delivery address, "Track Your Order" CTA button
  - `order-dispatched.tsx` — Rider assigned notification, estimated delivery, order summary
  - `order-delivered.tsx` — Delivery confirmation, "Leave a Review" CTA linking to product pages
  - `welcome.tsx` — Welcome email on first sign-up (Better Auth hooks)
- [ ] Wire emails to events:
  - On `POST /api/orders` success → send `order-confirmation` email
  - On order status → DISPATCHED → send `order-dispatched` email
  - On delivery status → DELIVERED → send `order-delivered` email
  - On Better Auth sign-up → send `welcome` email
- [ ] Test all email templates render correctly with React Email preview server
- [ ] Verify emails arrive in inbox (not spam) using Resend test mode

### Dependencies
- Phase 6 complete (delivery status changes trigger emails)
- Resend sending domain verified for `joskabproducts.com`

---

## Phase 8 — Polish & Deploy
**Goal:** App is production-ready, tested, and live on Vercel with custom domain.

### Tasks
- [ ] Verify responsive design on mobile for: landing page, product catalogue, product detail, cart, checkout, account orders, rider panel
- [ ] Add `aspect-ratio` to all product images to prevent layout shift
- [ ] Run bundle analysis: `ANALYZE=true pnpm build` — check for heavy imports, apply `next/dynamic` to heavy client components (charts, PDF renderer, image gallery)
- [ ] Add Suspense boundaries to all data-fetching sections and ErrorBoundary to major page blocks
- [ ] Add skeleton components for: product grid, product detail, orders table, admin dashboard KPIs
- [ ] Test all CRUD operations end-to-end (products, categories, orders, deliveries, addresses, reviews)
- [ ] Test auth flows on mobile and desktop (sign in, sign up, Google OAuth, password reset)
- [ ] Test Stripe payment flow in test mode (successful payment, failed card, 3D Secure)
- [ ] Test COD order flow end-to-end
- [ ] Test rider status update flow end-to-end
- [ ] Test all email templates deliver correctly
- [ ] **Run pre-deploy code review:** paste the prompt from `pre-deploy-review.md` (VibeKit repo root) into Claude Code. Address every Critical finding. Save report to `pre-deploy-review-report.md`.
- [ ] Set all environment variables in Vercel project settings (production values)
- [ ] Run database migration on production Neon branch: `pnpm db:push`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Configure Cloudflare DNS + custom domain (`joskabproducts.com`)
- [ ] Set Stripe webhook in Stripe dashboard → `https://joskabproducts.com/api/stripe/webhook` (if webhook needed)
- [ ] Verify Resend sending domain for production
- [ ] Configure Cloudflare R2 public bucket URL for production CDN

### Production Checklist
- [ ] All env vars set in Vercel (DATABASE_URL, Redis, Better Auth, Google OAuth, Resend, Stripe, R2)
- [ ] Database migrations applied to production Neon
- [ ] Auth flows work on production URL (Google OAuth redirect URI updated)
- [ ] Custom domain live with SSL (Cloudflare)
- [ ] Emails land in inbox (not spam)
- [ ] Product image uploads work via R2 in production
- [ ] Stripe live keys swapped in (when ready for real payments)
- [ ] 404 and error pages styled and branded
- [ ] No console errors on production build
