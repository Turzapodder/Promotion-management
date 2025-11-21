# Promotion Management

Comprehensive monorepo for managing products, promotions, and orders. It contains a TypeScript Express backend with PostgreSQL and a React + Vite frontend.

## Structure

- `backend/` — Express API, PostgreSQL, JWT auth, validation, rate limiting
- `frontend/` — React 19, Vite, Tailwind (v4), shadcn/ui, React Query

## Tech Stack

- Backend: Node.js, Express 5, TypeScript, PostgreSQL, JWT, Helmet, CORS, express-validator
- Frontend: React 19, Vite 7, TypeScript, Tailwind CSS 4, Radix UI, shadcn/ui, TanStack Query, React Router

## Backend

### Scripts

- `npm run dev` — start dev server with hot reload (`ts-node-dev`)
- `npm run build` — compile TypeScript to `dist/`
- `npm run start` — run compiled server

### Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `NODE_ENV` — `development` or `production`
- `CORS_ORIGIN` — comma-separated origins for production CORS (e.g. `https://app.example.com,https://admin.example.com`)
- `JWT_SECRET` — required; secret for access tokens
- `JWT_REFRESH_SECRET` — optional; defaults to `JWT_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN` — default `15m`
- `REFRESH_TOKEN_EXPIRES_IN` — default `7d`

### Run Locally

1. Create `.env` in `backend/`:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/promotion_db
   NODE_ENV=development
   JWT_SECRET=replace-with-strong-secret
   JWT_REFRESH_SECRET=replace-with-strong-secret
   ACCESS_TOKEN_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

2. Install dependencies: `npm install` in `backend/`
3. Start dev server: `npm run dev`
4. Health check: `GET http://localhost:3000/health`

### Database

- Connection via `pg` Pool using `DATABASE_URL`
- Baseline schema in `src/config/database.sql` for `users`, `refresh_tokens`, `products`
- Startup migrations in `src/server.ts` ensure:
  - `products` extra columns: `image_url`, `status`, `weight`, `weight_unit`
  - Promotions tables: `promotions`, `promotion_slabs`
  - Orders tables: `orders`, `order_items`

### API Overview

- Base URL: `http://localhost:3000`
- Auth: `Bearer <access-token>` required for protected routes

#### Auth (`/api/auth`)

- `POST /signup` — register user
- `POST /login` — login, returns `accessToken` and `refreshToken`
- `GET /profile` — get current user (auth required)
- `PUT /profile` — update profile (auth required)
- `POST /change-password` — change password (auth required)
- `POST /refresh` — refresh tokens
- `POST /logout` — revoke refresh token

Rate limiting: sign-up/login guarded by `authRateLimit` (5 requests / 15 min)

#### Products (`/api/products`)

- `GET /` — list all products (auth required)
- `GET /enabled` — list enabled products (auth required)
- `POST /` — create product (auth required; validated)
- `PUT /:id` — update product (auth required; validated)
- `DELETE /:id` — delete product (auth required)

#### Promotions (`/api/promotions`)

- `GET /` — list promotions (auth required)
- `GET /enabled` — list enabled promotions
- `POST /` — create promotion (auth required; validated)
- `PUT /:id` — update promotion (auth required; validated)
- `PATCH /:id/enabled` — toggle enabled
- `DELETE /:id` — delete promotion
- `GET /:id/slabs` — list weighted promotion slabs

#### Orders (`/api/orders`)

- `POST /` — create order (auth required; validated)
- `GET /` — list orders (auth required)
- `GET /:id` — get order by id (auth required)

### Core Concepts

- Authentication: JWT access/refresh tokens, stored server-side for refresh lifecycle
- Rate Limiting: in-memory limiter adds `X-RateLimit-*` headers and 429 when exceeded
- Validation: `express-validator` middleware for auth/product/promotion/order payloads
- Security: Helmet CSP, strict CORS, body size limits, centralized error handler

### Orders & Discounts

- Line subtotal: `unit_price * quantity`
- Discount types:
  - Percentage: `line_subtotal * percentage_rate / 100`
  - Fixed: `fixed_amount * quantity`
  - Weighted: applies slabs by total line weight (grams); `unit_discount * discountUnitsPerItem * quantity`
- Line total: `max(0, line_subtotal - line_discount)`
- Order totals: `grand_total = subtotal - total_discount + shipping_cost`

## Frontend

### Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — type check and build (`tsc -b && vite build`)
- `npm run preview` — preview built app
- `npm run lint` — run ESLint

### Environment Variables

- `VITE_API_URL` — backend base URL (default `http://localhost:3000`)

### Run Locally

1. Create `.env` in `frontend/` if overriding `API_BASE_URL`:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

2. Install dependencies: `npm install` in `frontend/`
3. Start dev server: `npm run dev` (default `http://localhost:5173`)

### Features

- Orders
  - List orders with sorting, tabs, and search suggestions
  - Create order with product picker, promotion application, shipping and notes
  - Payment breakdown shows subtotal, discount, shipping, total, and promotion label
- Products
  - Manage products (create/update/delete) with price/weight and status
  - Enabled products endpoint used for selection
- Promotions
  - Manage promotions (CRUD, enable/disable)
  - Supports percentage, fixed, and weighted discounts with slabs

### Key Files

- API client: `frontend/src/lib/api.ts`
- Query client: `frontend/src/lib/queryClient.ts`
- Orders hooks/components: `frontend/src/features/orders/*`
- Products hooks/components: `frontend/src/features/products/*`
- Promotions hooks/components: `frontend/src/features/promotions/*`
- Pages: `frontend/src/pages/*` (e.g., `OrderCreatePage.tsx`, `PromotionsPage.tsx`)

### UI/State

- Routing: React Router
- Data fetching: TanStack Query
- UI components: shadcn/ui + Radix primitives
- Styling: Tailwind CSS (v4), utility-first with `@tailwindcss/vite`

## Development Workflow

- Start backend (`localhost:3000`) and frontend (`localhost:5173`)
- Login/signup to obtain tokens; frontend stores tokens in `localStorage`
- Protected API calls automatically attach `Authorization: Bearer <token>` and refresh on 401

## Deployment Notes

- Set production `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`
- Enable SSL for PostgreSQL (`ssl.rejectUnauthorized=false` in production)
- Serve frontend static assets via your chosen host; configure `VITE_API_URL` to point to backend

## Troubleshooting

- 401 on API: ensure valid `access_token`/`refresh_token` and backend CORS origin
- PostgreSQL connection errors: check `DATABASE_URL` and network access
- Promotions not applying: verify discount type/values and weighted slabs existence