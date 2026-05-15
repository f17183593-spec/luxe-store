# LUXE — Global Luxury E-Commerce Platform

**Last Updated:** 2026-05-15  
**Status:** MVP Complete — Cart & Checkout Live

---

## TECH_STACK

| Category | Technology | Version | Rationale |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.2.6 | Full RSC, Streaming, ISR, Edge-ready |
| **Language** | TypeScript | 6.0.3 | Strict types, `noUncheckedIndexedAccess` |
| **Styling** | Tailwind CSS | 4.3.0 | CSS-first config, `@utility`, `@variant` |
| **Animations** | motion/react (framer-motion) | 12.38.0 | WAAPI-powered, layout animations, gesture support |
| **ORM** | Prisma | 7.8.0 | WASM query compiler (`compilerBuild: "fast"`), edge-compatible |
| **Database** | PostgreSQL (Neon) | — | Serverless Postgres, branching, edge caching |
| **CMS** | Sanity | 5.25.1 | GROQ, real-time collaboration, CDN-delivered content |
| **i18n** | next-intl | 4.12.0 | File-based messages, prefix routing, RSC-native |
| **Currency** | IP geo + exchangerate.host | — | Vercel Edge `request.geo`, `cookies()` cache |
| **Payments** | Stripe (Checkout Sessions) | ^17.0.0 | Redirect-based checkout, SCA-ready, webhook fulfillment |
| **State Management** | Zustand | ^4.5/^5.0 | Lightweight persist middleware, localStorage cart |
| **Hosting** | Vercel (Pro) | — | Edge Network, ISR, Serverless Functions |
| **Runtime** | Node.js (LTS) | 24.15.0 (Krypton) | Active LTS, stable for production |
| **Testing** | Vitest + @testing-library/react | ^3.0.0 / ^16.0.0 | Component + unit tests |

---

## SYSTEM_FLOW

```
                         ┌─────────────────────┐
                         │     End User         │
                         │    (Browser)         │
                         └──────┬──────────────┘
                                │ HTTP(S)
                                ▼
                     ┌──────────────────────────┐
                     │   Vercel Edge Network     │
                     │   - middleware.ts          │
                     │   ├─ locale detection      │
                     │   ├─ rewrite /[locale]     │
                     │   └─ IP geo → currency     │
                     │      cookie (30d)          │
                     └──────┬───────────────────┘
                            │
              ┌─────────────┼──────────────────────┐
              │             │                      │
              ▼             ▼                      ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
     │  Static      │ │  ISR         │ │  Dynamic              │
     │  (public/)   │ │  (pages/)    │ │  (Client + API)       │
     │  - locales   │ │  - /         │ │  - /cart    (Zustand) │
     │  - fonts     │ │  - /products │ │  - /checkout (Stripe) │
     │              │ │  - /products │ │  - /checkout/success  │
     │              │ │    /[slug]   │ │  - /api/create-       │
     │              │ │              │ │    checkout-session   │
     │              │ │              │ │  - /api/stripe-webhook│
     └──────────────┘ └──────┬──────┘ └──────┬───────────────┘
                             │               │
                             ▼               ▼
                    ┌──────────────┐ ┌──────────────────┐
                    │  Sanity CDN  │ │  Prisma + Neon   │
                    │  (GROQ)      │ │  (PostgreSQL)    │
                    │  → products  │ │  → orders        │
                    │  → hero      │ │  → customers     │
                    │  → content   │ │  → inventory     │
                    └──────────────┘ └────────┬─────────┘
                                              │
                                              ▼
                                   ┌──────────────────────┐
                                   │   Stripe Checkout     │
                                   │  → Session API route  │
                                   │  → Redirect flow      │
                                   │  → Webhook handler    │
                                   │  → Success page       │
                                   └──────────────────────┘
```

### Rendering Strategy

| Route | Strategy | Revalidation | Key Feature |
|---|---|---|---|
| `/` (home) | ISR | 60s | Hero + Featured Bento Grid |
| `/products` | ISR | 300s | Catalog grid with skeleton |
| `/products/[slug]` | ISR | 60s / on-demand | Gallery + glass detail panel |
| `/cart` | Dynamic (CSR) | — | Zustand cart with qty, summary, empty state |
| `/checkout` | Dynamic (CSR) | — | Form → Stripe Checkout redirect |
| `/checkout/success` | Dynamic (CSR) | — | Order confirmation from session_id |
| `/api/create-checkout-session` | Edge/Fn | — | Stripe Checkout Session creation |
| `/api/stripe-webhook` | Edge/Fn | — | Stripe event processing |
| `/api/*` | Edge/Serverless | varies | Thin JSON endpoints |
| `/studio` | Client (SPA) | — | Sanity CMS mount |

---

## ARCHITECTURE_OVERVIEW

### Directory Structure

```
luxe-store/
├── __tests__/                        ← Vitest test suite
│   ├── utils.test.ts
│   ├── currency.test.ts
│   ├── GlassPanel.test.tsx
│   └── Button.test.tsx
├── public/
│   └── locales/                      ← next-intl JSON messages
│       ├── en.json, fr.json, de.json, it.json
│       ├── es.json, ja.json, zh.json, ar.json
├── src/
│   ├── app/
│   │   ├── [locale]/                 ← next-intl routing
│   │   │   ├── layout.tsx           ← Root layout (meta, fonts, Header/Footer)
│   │   │   ├── page.tsx             ← Home (Hero + BentoGrid with Suspense)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx         ← Catalog (grid + skeleton fallback)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     ← Product detail + static params
│   │   │   ├── cart/page.tsx        ← Full cart (items, qty, summary, empty)
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx         ← Checkout (form → Stripe redirect)
│   │   │   │   └── success/
│   │   │   │       └── page.tsx     ← Order confirmation from Stripe
│   │   │   └── api/                 ← (app-level, not locale-scoped)
│   │   ├── api/
│   │   │   ├── create-checkout-session/route.ts  ← Stripe Checkout Session creator
│   │   │   └── stripe-webhook/route.ts           ← Webhook event handler
│   │   └── studio/page.tsx          ← Sanity Studio mount (CSR)
│   ├── components/
│   │   ├── ui/                      ← Design system primitives
│   │   │   ├── GlassPanel.tsx       ← 3 variants (light/dark/gold), opt-out animate
│   │   │   ├── Button.tsx           ← 4 variants (primary/outline/ghost/gold), loading
│   │   │   ├── Card.tsx             ← lift/glow hover effects
│   │   │   └── Skeleton.tsx         ← Loading placeholder
│   │   ├── cart/                    ← Cart domain (all client)
│   │   │   ├── CartDrawer.tsx       ← Slide-out drawer, glass, micro-interactions
│   │   │   ├── AddToCartButton.tsx  ← Add with "Added!" + "View" feedback
│   │   │   ├── CartBadge.tsx        ← Header icon with animated count badge
│   │   │   ├── CheckoutForm.tsx     ← Email/address form + validation + API call
│   │   │   └── CheckoutSummary.tsx  ← Live order summary from Zustand store
│   │   ├── layout/
│   │   │   ├── Header.tsx           ← Fixed glass header, locale toggle, CartBadge
│   │   │   └── Footer.tsx           ← Multi-column footer
│   │   └── product/
│   │       ├── HeroSection.tsx      ← Fullscreen hero, orbs, stagger anims, scroll hint
│   │       ├── BentoGrid.tsx        ← 7-item bento, varying spans, hover zoom
│   │       └── ProductGrid.tsx      ← Responsive product card grid
│   ├── lib/
│   │   ├── prisma.ts                ← Prisma singleton
│   │   ├── sanity.ts                ← Sanity client (null-safe), urlFor, sanityFetch
│   │   ├── sanity.queries.ts        ← All GROQ queries
│   │   ├── sanity.config.ts         ← Sanity Studio config
│   │   ├── cart-store.ts            ← Zustand store + persist (localStorage)
│   │   ├── currency.ts              ← IP geo, rate fetch, convertPrice, fallback rates
│   │   ├── env.ts                   ← Zod-validated env (incl. STRIPE_WEBHOOK_SECRET)
│   │   ├── i18n.ts                  ← next-intl request config
│   │   ├── routing.ts               ← Locale routing + nav links
│   │   ├── stripe.ts                ← Server-only Stripe instance + helpers
│   │   ├── stripe-client.ts         ← Client-side Stripe.js loader
│   │   └── utils.ts                 ← cn, formatPrice, slugify, truncate
│   ├── styles/
│   │   └── globals.css              ← Tailwind v4, @theme, @utility, base
│   ├── types/
│   │   ├── product.ts               ← Product, ProductCardData, ProductFilter
│   │   ├── cart.ts                  ← CartItem, Cart
│   │   └── common.ts                ← PageProps, LocaleParams, enums
│   ├── middleware.ts                 ← Locale + currency geo-setup
│   └── navigation.ts               ← Typed next-intl navigation
├── prisma/
│   └── schema.prisma               ← Customer, Order, OrderItem, Product
├── sanity/schemas/
│   ├── product.ts                   ← Product document schema
│   ├── category.ts                  ← Category document schema
│   └── hero.ts                      ← Hero document schema
├── vitest.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

### Component Architecture (Server-first)

```
Server Components (default — zero client JS)
├── Layout (Header, Footer, CartDrawer, metadata)
├── CheckoutPage (skeleton + suspense)
├── CheckoutSuccessPage (static confirmation)
├── HomePage (suspense boundaries)
└── Product pages (suspense + skeletons)

Client Components (motion/react + Zustand — cart adds 5 client components)
├── GlassPanel.tsx       ← 3 variants, scroll-triggered entrance
├── Button.tsx           ← 4 variants, loading spinner, hover/tap
├── Card.tsx             ← hover lift/glow
├── HeroSection.tsx      ← stagger entrance, floating orbs, scroll icon
├── BentoGrid.tsx        ← stagger cards, hover zoom
├── ProductGrid.tsx      ← stagger cards
├── AddToCartButton.tsx  ← add to cart + "Added!" feedback + "View" button
├── CartBadge.tsx        ← animated count badge (spring scale)
├── CartDrawer.tsx       ← glass slide-out, AnimatePresence items, qty controls
├── CheckoutForm.tsx     ← form validation, loading, Stripe redirect
└── CheckoutSummary.tsx  ← live item list from Zustand
```

### Data Layer

| Source | Data | Access Pattern | Caching |
|---|---|---|---|
| **Sanity** | Products, hero, content | GROQ from RSC | CDN + ISR (60-300s) |
| **Prisma/Neon** | Orders, customers, inventory | Server Actions/API | Connection pooler |
| **Stripe** | Payments, intents | Stripe SDK + Webhooks | Idempotency keys |
| **Currency API** | Exchange rates | Server fetch() | In-memory (1h) + stale fallback |

### Performance Strategy

| Metric | Target | Implementation |
|---|---|---|
| Lighthouse Performance | 100 | RSC by default, minimal client JS |
| LCP | < 1.0s | Hero eager-loaded, AVIF/WebP, optimized fonts |
| TBT | < 50ms | No blocking JS, code-split motion |
| CLS | 0 | Fixed-header offset, aspect-ratio containers |
| First Load JS | < 100KB | Tailwind v4 CSS-first, optimizePackageImports |
| Edge Response | < 50ms cold start | Neon pooler, light middleware |

### i18n + Currency Strategy

- **Locales**: en, fr, de, it, es, ja, zh, ar
- **Locale detection**: `Accept-Language` + Vercel geo → `next-intl` middleware
- **Currency**: Vercel `request.geo.country` → `COUNTRY_CURRENCY` map → cookie (30d) → server-side rate fetch
- **Fallback rates**: Hardcoded fallback map if API unavailable

---

## COMPLETED FEATURES

### Core Infrastructure
- [x] Next.js 16 App Router with TypeScript 6 strict mode
- [x] Tailwind CSS v4 with `@theme`, `@utility` system
- [x] Custom Luxe design tokens (gold, charcoal, cream, etc.)
- [x] Font system: Inter (sans) + Playfair Display (display)
- [x] Environment validation with Zod (`env.ts`)
- [x] Utility functions: `cn`, `formatPrice`, `slugify`, `truncate`

### i18n
- [x] next-intl v4 with route prefix routing
- [x] 8 locale message files (en, fr, de, it, es, ja, zh, ar)
- [x] RTL support for Arabic
- [x] Middleware locale + currency detection
- [x] Hreflang alternates in metadata
- [x] Locale toggle in header (server-side link switching)

### Currency
- [x] IP geo → currency code via middleware
- [x] `getCurrencyFromCountry()` / `getCurrencySymbol()`
- [x] `getSessionCurrency()` with `cookies()`
- [x] `convertPrice()` with rate API + hardcoded fallback
- [x] `formatPriceWithCurrency()` convenience wrapper

### UI Component Library
- [x] `GlassPanel` — 3 variants (light/dark/gold), optional animation
- [x] `Button` — 4 variants, 3 sizes, loading spinner, hover/tap anims
- [x] `Card` — hover lift/glow effects
- [x] `Skeleton` — loading placeholder with `animate-pulse`

### Home Page
- [x] `HeroSection` — fullscreen background, decorative orbs, stagger entrance anims, scroll hint, dual CTA
- [x] `BentoGrid` — 7-item grid with hero tile, varying spans, staggered entrance, hover zoom
- [x] Suspense boundaries with skeleton fallbacks
- [x] Sanity data fetching with null-safe wrapper
- [x] Graceful fallback if Sanity unconfigured

### Product Pages
- [x] `ProductGrid` — responsive 1-4 column grid, stagger entrance, hover zoom
- [x] Product detail with gallery, glass panel, tags, add-to-cart/wishlist
- [x] `generateStaticParams` for ISR product pages
- [x] Loading skeletons during data fetch
- [x] Not-found handling for invalid slugs
- [x] Image missing placeholder

### Cart & Checkout
- [x] Zustand cart store with localStorage persistence (`cart-store.ts`)
- [x] `addItem` with duplicate detection (increment quantity)
- [x] `removeItem` with AnimatePresence exit animation
- [x] `updateQuantity` with auto-remove when < 1
- [x] `clearCart`, drawer open/close, `lastAddedItem` tracking
- [x] `CartDrawer` — glass slide-out panel, spring animation, item rows, subtotal
- [x] `CartBadge` — header icon with animated count badge (spring scale)
- [x] `AddToCartButton` — add with micro-interaction "Added!" tooltip + "View" button
- [x] Cart page: full item list + quantity controls + order summary sidebar
- [x] Empty cart state with icon and CTA
- [x] `CheckoutForm` — email/address form with Zod-style validation
- [x] `CheckoutSummary` — live item list + totals from Zustand
- [x] Stripe Checkout Session API — `/api/create-checkout-session`
- [x] Stripe webhook handler — `/api/stripe-webhook`
- [x] Checkout success page with session_id display
- [x] Loading/error states: spinner, validation errors, API error messages
- [x] Empty cart guard on checkout page
- [x] Edge cases: 99+ badge, quantity zero removal, body scroll lock for drawer

### Data Layer
- [x] Prisma schema (Customer, Order, OrderItem, Product)
- [x] Sanity schemas (Product, Category, Hero)
- [x] Sanity fetch wrapper with error handling and null-safety
- [x] Centralized GROQ queries in `sanity.queries.ts`

### Testing
- [x] 20+ unit tests (utils, currency, cart-store)
- [x] Component tests (GlassPanel, Button, AddToCartButton, CartBadge, CheckoutSummary)
- [x] Cart store tests: add, remove, update, clear, duplicate detection, drawer state, persistence
- [x] Vitest + jsdom + @testing-library/react configured

---

## ORPHANS & PENDING

### In Progress / Partial
| Item | Status | Notes |
|---|---|---|
| Search / Algolia | Not started | |
| Product filters (price, category) | Not started | ProductFilter type exists |
| User auth / accounts | Not started | Customer model exists |
| Order history / DB fulfillment from webhook | Not started | Webhook handler logs only |
| `next.config.ts` Sanity webhook revalidation | Not wired | Env vars ready |
| Edge Config for currency rates | Not started | Using in-memory cache |
| Accessibility audit | Not started | Semantic HTML used |
| E2E tests | Not started | Unit tests only |
| Dark mode | Not started | `@variant dark` defined |
| Blog / editorial content | Not started | |
| Newsletter signup | Not started | |
| Wishlist | Button exists only | No state backend |
| Product variant support | Not started | |
| Multi-currency display on Bento/Product cards | Static USD only | `convertPrice` exists but unused in grid |

### Known Issues
| Issue | Impact | Resolution |
|---|---|---|
| `cookies()` may throw in static generation | Currency falls back to USD | Try/catch in `getSessionCurrency` |
| Sanity unconfigured → all data null | Hero defaults, Bento shows empty state | Graceful fallbacks everywhere |
| No rate limiting on API routes | Edge case | Add in next iteration |

---

## QUICK START

```bash
# Install dependencies
pnpm install

# Copy environment
cp .env.example .env.local
# Fill in SANITY_PROJECT_ID, DATABASE_URL, STRIPE keys

# Run tests
pnpm test

# Start development
pnpm dev

# Type check
pnpm typecheck
```

---

*"Simplicity is the ultimate sophistication." — This architecture favors minimal JS, server-first rendering, and clean separation of concerns. Every component has a fallback, every API call has error handling, and every route serves a clear user journey.*
