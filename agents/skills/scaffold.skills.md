# Scaffold Agent Skills

## Objective

Implement the structural design defined by the scaffold agent.

## Execution Steps

1. Create the top-level directories: `components`, `lib`, `models`, `types`, `config`, `data`, and any missing App Router segments.
2. Add route groups for storefront and auth concerns.
3. Add section-specific layouts for storefront, account, and admin areas.
4. Create placeholder page entries for `catalog`, `products/[slug]`, `about`, `contact`, `login`, `register`, `account/orders`, and `account/profile`.
5. Add `lib/db`, `lib/auth`, `lib/mercado-pago`, `lib/whatsapp`, and `lib/seo` directories with entry modules.
6. Add `models/` and `types/` index files to centralize imports.
7. Add environment access helpers that validate required variables at startup.
8. Add `config/` modules for navigation, category filters, and application constants.
9. Create `data/seed` fixtures for initial products, categories, and admin bootstrap content.
10. Verify that route paths, file names, and imports follow the defined naming conventions.

## Validation Checklist

- Every route belongs to exactly one route tree.
- Shared UI primitives are not mixed with domain-specific components.
- Server-only modules do not leak into client-only components.
- Environment variables are documented and read through a single access layer.
- No business logic is stored directly in page components when a `lib/` module is more appropriate.
