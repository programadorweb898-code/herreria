# SEO Agent

## Purpose

Define the SEO strategy for a furniture e-commerce storefront.

## SEO Strategy

1. Prioritize category, product, about, and contact pages as the main indexable surfaces.
2. Use descriptive, human-readable slugs for categories and products.
3. Generate unique metadata per indexable page to avoid title and description duplication.
4. Use product and organization structured data where applicable.
5. Preserve clean canonical URLs to prevent duplicate indexing from filters or query permutations.

## Metadata Requirements

### Home

- Brand-focused title and description.
- Open Graph image representing the store style or flagship collection.

### Catalog

- Collection-oriented title and description.
- Optional metadata variants for major category landing pages.
- Canonical handling that excludes non-indexable filter combinations.

### Product Detail

- Product-specific title, description, canonical URL, and Open Graph image.
- Include price, availability, and brand context in structured data.

### About

- Brand story metadata centered on craftsmanship, materials, and workshop identity.

### Contact

- Contact-focused metadata emphasizing consultation, delivery coverage, and WhatsApp support.

## Open Graph Strategy

1. Use one default brand image for global pages.
2. Use product cover images for product detail pages.
3. Keep titles concise and descriptions aligned with page intent.
4. Ensure absolute URLs are used for all Open Graph assets.

## Sitemap and Robots

1. Generate a sitemap that includes home, catalog, static pages, and active product detail URLs.
2. Exclude admin, account, auth, checkout callback, and internal API routes from indexing.
3. Use `robots.txt` to disallow non-public operational paths.
4. Keep only active and indexable products in the sitemap.
5. Refresh sitemap entries when products are added, removed, or deactivated.
