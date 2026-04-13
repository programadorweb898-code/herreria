# Scaffold Agent

## Purpose

Define the project structure and architectural boundaries for a furniture store split into a Next.js 14 frontend and an Express.js backend, both written in TypeScript.

## Architecture Decisions

### Folder Structure

```text
/frontend
  app/
    (store)/
      page.tsx
      catalog/page.tsx
      products/[slug]/page.tsx
      about/page.tsx
      contact/page.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
    account/
      orders/page.tsx
      profile/page.tsx
    admin/
      products/page.tsx
      orders/page.tsx
  components/
    layout/
    shared/
    product/
    cart/
    forms/
  lib/
    api/
    auth/
    whatsapp/
    seo/
    utils/
  types/
  config/
  public/
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  .env.local

/backend
  src/
    app.ts
    server.ts
    types/
  routes/
  controllers/
  middleware/
  lib/
  models/
  seed/
  tsconfig.json
  .env
```

### Folder Responsibilities

- `/frontend/app/`: App Router route segments, layouts, loading states, and error boundaries.
- `/frontend/components/layout/`: header, footer, navigation, mobile menu, and shell primitives.
- `/frontend/components/shared/`: reusable UI primitives such as buttons, badges, section wrappers, and empty states.
- `/frontend/components/product/`: product cards, galleries, filters, product info blocks, and inquiry CTAs.
- `/frontend/components/cart/`: cart summary, line items, checkout buttons, and totals.
- `/frontend/components/forms/`: login, profile, contact, and admin forms.
- `/frontend/lib/api/`: fetch clients and frontend-side helpers for calling the backend API.
- `/frontend/lib/auth/`: frontend authentication helpers and session utilities.
- `/frontend/lib/whatsapp/`: phone normalization and message URL builders.
- `/frontend/lib/seo/`: metadata factories, canonical URL helpers, and structured data builders.
- `/frontend/types/`: frontend TypeScript contracts used by pages and components.
- `/frontend/config/`: central config maps for navigation, filters, categories, and public environment access.
- `/backend/src/app.ts`: Express app setup, middleware registration, and route mounting.
- `/backend/src/server.ts`: Express server bootstrap and listener startup.
- `/backend/routes/`: Express Router modules per resource.
- `/backend/controllers/`: request handlers that validate input, call models or services, and shape responses.
- `/backend/middleware/`: CORS, error handling, and other shared Express middleware.
- `/backend/lib/`: server-only helpers such as MongoDB bootstrap and utility functions.
- `/backend/models/`: Mongoose schemas and model exports.
- `/backend/seed/`: seed scripts and fixtures for database bootstrapping.

## Environment Variables

### `/frontend`

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the Express backend consumed by the Next.js frontend |

### `/backend`

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string used by the Express backend |
| `PORT` | Port where the Express server listens |
| `CORS_ORIGIN` | Allowed frontend origin for browser requests |

## App Router Organization

1. Use route groups to separate storefront and auth chrome without changing URLs.
2. Keep the root `frontend/app/layout.tsx` limited to global providers, fonts, and shell wiring.
3. Place storefront-specific header and footer inside `frontend/app/(store)/layout.tsx`.
4. Keep account and admin areas in dedicated route trees with their own access-controlled layouts.
5. Co-locate `loading.tsx`, `error.tsx`, and `not-found.tsx` with each route segment when behavior differs by section.
6. Keep backend HTTP endpoints out of Next.js Route Handlers; the frontend should call the Express API through `NEXT_PUBLIC_API_URL`.

## Naming Conventions

1. Use kebab-case for route segment folders and Markdown files.
2. Use PascalCase for React components, Express controller names, and Mongoose model names.
3. Use camelCase for variables, functions, and utility modules.
4. Suffix DTOs with `Dto`, request types with `Request`, and response types with `Response`.
5. Name server-only helpers by domain, such as `getProductsController`, `connectMongo`, and `buildWhatsAppMessage`.
6. Keep product-facing slugs lowercase and hyphenated.
7. Use singular model names and plural collection names.
