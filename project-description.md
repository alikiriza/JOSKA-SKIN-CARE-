# Joska Beauty Products (joskabproducts) — Project Description

## What This App Does
Joska Beauty Products is a full-stack skincare e-commerce platform where customers worldwide can browse, purchase, and receive delivered skincare products. It solves the problem of accessing quality, curated skincare products online with transparent order tracking from purchase to doorstep. Admins manage the full product catalogue and order lifecycle, while delivery riders receive and update their assigned deliveries in real time.

## Target Users
- **Primary user (Customer):** Skincare shoppers worldwide who want to discover and order Joska products, pay online or cash on delivery, and track their orders from confirmation to delivery.
- **Secondary user (Admin):** The Joska business owner/manager who manages products, categories, orders, delivery assignments, and views sales analytics.
- **Tertiary user (Delivery Rider):** Riders who log in to see their assigned deliveries, update delivery status (picked up, in transit, delivered), and mark orders complete.

## Core Value Proposition
A beautifully branded, end-to-end skincare shopping experience — from curated product discovery to doorstep delivery — built specifically for the Joska brand with worldwide reach.

## User Roles & Permissions
- **CUSTOMER:** Browse products, add to cart, checkout (Stripe or cash on delivery), view order history, track delivery status, manage saved addresses, leave product reviews.
- **ADMIN:** Full access — manage products (CRUD), manage categories, view and manage all orders, assign orders to riders, view analytics dashboard, manage users and riders.
- **RIDER:** View assigned deliveries only, update delivery status (Assigned → Picked Up → In Transit → Delivered), cannot access admin panels or other orders.

## Features — Complete List

### Customer-Facing
1. **Product catalogue** — Browse all skincare products with filters by category, price range, and search by name. Paginated grid view with product images, price, and quick-add-to-cart.
2. **Product detail page** — Full description, ingredient list, usage instructions, image gallery, stock status, customer reviews with ratings, and add-to-cart.
3. **Shopping cart** — Zustand-powered persistent cart with quantity adjustment, item removal, subtotal calculation, and delivery cost estimate.
4. **Checkout flow** — Shipping address form (name, country, city, street), payment method selection (Stripe card or cash on delivery), order summary, and place order.
5. **Stripe payment** — Embedded Stripe Payment Element with multi-method support and 3D Secure.
6. **Cash on delivery** — Flag order as COD, skip Stripe, go straight to confirmation.
7. **Order confirmation** — Success screen with order number, summary, and email confirmation sent via Resend.
8. **Order history** — Customer dashboard listing all past and current orders with status badges and links to order detail.
9. **Order detail** — Line items, totals, payment status, delivery status, tracking timeline.
10. **Delivery tracking** — Real-time delivery status timeline (Order Placed → Packed → Picked Up → In Transit → Delivered) on the order detail page.
11. **Saved addresses** — Manage multiple shipping addresses; set default address for faster checkout.
12. **Product reviews** — Leave a star rating and comment after a delivered order. One review per product per customer.
13. **Customer account** — Profile page with name, email, password change, and address management.
14. **Auth** — Sign up, sign in, Google OAuth, email verification, forgot/reset password.

### Admin Dashboard
15. **Analytics overview** — KPI cards: total revenue, total orders, new customers, pending deliveries. Revenue chart (monthly), top-selling products list.
16. **Product management** — Data table with search, filter, sort. Create/edit/delete products with image upload (Cloudflare R2), price, stock, category, description, ingredients, usage.
17. **Category management** — Create/edit/delete product categories (Skincare, Serums, Creams, Soaps, Lotions, etc.).
18. **Order management** — Data table of all orders with status filter (Pending, Processing, Packed, Dispatched, Delivered, Cancelled). View order detail, update order status, assign to rider.
19. **Delivery management** — Assign pending orders to available riders. View delivery status per rider.
20. **User management** — List all customers and riders, view profiles, change user roles, deactivate accounts.
21. **Rider management** — Create rider accounts, view active deliveries per rider.
22. **Inventory alerts** — Flag products with stock below a set threshold.

### Rider Panel
23. **Rider dashboard** — List of assigned deliveries with customer name, address, and order summary.
24. **Delivery status update** — Buttons to progress status: Assigned → Picked Up → In Transit → Delivered.
25. **Order detail view** — Full order and customer contact info for the assigned delivery.

### Shared / System
26. **Email notifications** — Order confirmation (on place), dispatch notification (on Dispatched status), delivery confirmation (on Delivered status) via Resend + React Email.
27. **Dark mode** — Full dark mode toggle across all pages using next-themes.
28. **Responsive design** — Fully mobile-responsive across all customer and admin pages.
29. **Protected routes** — Middleware-level auth check; role-based access control for admin and rider panels.
30. **Excel export** — Admin can export orders list to Excel (.xlsx).
31. **PDF order invoice** — Admin/customer can download a styled PDF invoice per order via @react-pdf/renderer.

## Data Model

- **User:** id, name, email, emailVerified, image, role (CUSTOMER | ADMIN | RIDER), createdAt, updatedAt
- **Session:** id, userId, token, expiresAt (Better Auth managed)
- **Account:** id, userId, provider, providerAccountId (OAuth accounts)
- **Address:** id, userId, fullName, country, city, street, postalCode, phone, isDefault, createdAt
- **Category:** id, name, slug, description, image, createdAt
- **Product:** id, name, slug, description, ingredients, usage, price (Decimal), comparePrice (Decimal, nullable), images (String[]), categoryId, stock (Int), isFeatured (Boolean), isActive (Boolean), createdAt, updatedAt
- **Review:** id, userId, productId, rating (Int 1–5), comment, createdAt
- **Order:** id, userId, orderNumber (unique, auto-generated), status (PENDING | PROCESSING | PACKED | DISPATCHED | DELIVERED | CANCELLED), paymentMethod (STRIPE | CASH_ON_DELIVERY), paymentStatus (PENDING | PAID | FAILED), subtotal (Decimal), deliveryFee (Decimal), total (Decimal), shippingAddressId, notes, createdAt, updatedAt
- **OrderItem:** id, orderId, productId, productName (snapshot), productImage (snapshot), qty (Int), price (Decimal)
- **Delivery:** id, orderId (unique), riderId, status (ASSIGNED | PICKED_UP | IN_TRANSIT | DELIVERED), assignedAt, pickedUpAt, inTransitAt, deliveredAt

**Relationships:**
- A User has many Orders, Addresses, Reviews. Role determines access.
- A Category has many Products.
- A Product belongs to one Category. A Product has many Reviews, OrderItems.
- An Order belongs to one User, one Address. An Order has many OrderItems. An Order has one Delivery.
- A Delivery belongs to one Order, one User (rider).
- An OrderItem belongs to one Order, one Product (with snapshot fields for historical accuracy).

## Pages / Screens

### Public / Customer
1. `/` — Landing page: hero with brand statement, featured products grid, category pills, testimonials, CTA.
2. `/products` — Full product catalogue with search bar, category filter sidebar, price range filter, sort (newest, price asc/desc, popular), paginated product grid.
3. `/products/[slug]` — Product detail: image gallery, name, price, stock, description, ingredients, usage, add-to-cart, reviews section.
4. `/cart` — Cart page: item list, quantity controls, subtotal, delivery estimate, proceed to checkout button.
5. `/checkout` — Multi-step: (1) Shipping address, (2) Payment method, (3) Review & place order.
6. `/order-confirmation` — Success screen with order number, summary table, and "continue shopping" CTA.
7. `/auth/sign-in` — Sign in with email/password or Google OAuth.
8. `/auth/sign-up` — Register with name, email, password. Triggers verification email.
9. `/auth/verify-email` — OTP email verification page.
10. `/auth/forgot-password` — Request password reset email.
11. `/auth/reset-password` — Set new password via reset token.

### Customer Dashboard (authenticated)
12. `/account` — Profile: name, email, avatar, change password link.
13. `/account/orders` — Order history data table with status badges, date, total.
14. `/account/orders/[id]` — Order detail: line items, payment info, delivery status timeline.
15. `/account/addresses` — Saved addresses list, add/edit/delete, set default.

### Admin Dashboard (ADMIN role only)
16. `/dashboard` — Analytics overview: KPI cards, revenue chart, recent orders table, top products.
17. `/dashboard/products` — Products data table with search, filter, Excel export.
18. `/dashboard/products/new` — Create product form with R2 image upload.
19. `/dashboard/products/[id]/edit` — Edit product form.
20. `/dashboard/categories` — Categories data table.
21. `/dashboard/categories/new` — Create category form.
22. `/dashboard/orders` — All orders data table with status filter, assign rider action.
23. `/dashboard/orders/[id]` — Order detail with status update controls and rider assignment.
24. `/dashboard/deliveries` — All deliveries with rider filter and status filter.
25. `/dashboard/users` — Users data table with role filter and role-change action.
26. `/dashboard/riders` — Riders list with active delivery count.

### Rider Panel (RIDER role only)
27. `/rider` — Rider home: list of assigned deliveries.
28. `/rider/deliveries/[id]` — Delivery detail with status update buttons and customer contact info.

### System
29. `/api/auth/[...all]` — Better Auth handler.
30. `/api/products` — Products CRUD with Redis cache.
31. `/api/categories` — Categories CRUD with Redis cache.
32. `/api/orders` — Orders CRUD.
33. `/api/deliveries` — Delivery status updates.
34. `/api/stripe/create-payment-intent` — Stripe payment intent creation.
35. `/api/stripe/verify-payment` — Stripe payment verification.
36. `/api/r2/upload` — Cloudflare R2 presigned upload.
37. `/api/r2/delete` — Cloudflare R2 file delete.
38. `not-found.tsx` — Branded 404 page.
39. `error.tsx` — Branded error page.
40. `loading.tsx` — Skeleton loading page.

## Integrations
- **Auth:** Better Auth + Google OAuth + Email/password
- **Email:** Resend + React Email (order confirmation, dispatch alert, delivery confirmation)
- **Payments:** Stripe (card, 3D Secure) + Cash on Delivery flag
- **File uploads:** Cloudflare R2 (product images, multi-image per product)
- **AI features:** None
- **Dark mode:** Yes — next-themes with ThemeProvider

## JB Components to Install
- **JB Better Auth UI:** `pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json`
- **Zustand Cart:** `pnpm dlx shadcn@latest add https://jb.desishub.com/r/zustand-cart.json`
- **Stripe UI Component:** `pnpm dlx shadcn@latest add https://stripe-ui-component.desishub.com/r/stripe-ui-component.json`
- **File Storage UI (R2):** `pnpm dlx shadcn@latest add https://file-storage-registry.vercel.app/r/file-storage.json`
- **Data Table:** `pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json`
- **Searchable Select:** `pnpm dlx shadcn@latest add https://jb.desishub.com/r/searchable-select.json`

## Out of Scope (v1)
- Loyalty / rewards points program
- Product bundles or subscription boxes
- Live chat / support widget
- Multi-vendor / marketplace (other sellers listing products)
- Wishlist / saved products
- Promotional coupon / discount codes
- Product comparison feature
- Mobile app (iOS / Android)
- Automated inventory restocking notifications to suppliers
