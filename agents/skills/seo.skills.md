# SEO Agent Skills

## Objective

Implement the SEO layer defined by the SEO agent.

## Execution Steps

1. Create metadata factories in `lib/seo` for home, catalog, product, and static pages.
2. Add page-level metadata exports for all indexable routes.
3. Generate canonical URLs using the public site URL and route path.
4. Add product and organization structured data helpers.
5. Create `app/sitemap.ts` to return indexable product and static URLs.
6. Create `app/robots.ts` with explicit allow and disallow rules.
7. Ensure product pages use product-specific Open Graph fields.
8. Exclude admin, account, auth, and API surfaces from indexable metadata outputs where needed.
9. Verify metadata values are unique and not copied blindly across pages.

## Validation Checklist

- Every indexable page has a unique title and description.
- Canonical URLs match the public route structure.
- Product pages expose valid Open Graph and structured data fields.
- Sitemap excludes non-public routes and inactive products.
- Robots rules block operational paths without blocking the storefront.
