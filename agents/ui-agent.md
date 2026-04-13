# UI Agent

## Purpose

Define the visual and interaction design for the furniture store storefront.

## Visual Design System

### Colors

- Background: warm off-white and light stone tones.
- Foreground: charcoal and muted espresso for readable contrast.
- Accent: restrained olive or terracotta used only for emphasis.
- Borders: low-contrast sand or ash to keep cards quiet and minimal.
- Status colors: conservative green, amber, and red only in functional states.

### Typography

- Use one serif or high-contrast display face for large merchandising headlines.
- Use one clean sans-serif for body text, navigation, filters, and pricing.
- Keep line lengths moderate and use generous whitespace around headings.

### Spacing

- Use a spacious grid with strong vertical rhythm.
- Prefer large section padding on desktop and compressed but breathable spacing on mobile.
- Avoid dense card layouts and over-stacked promotional banners.

## Minimalist Aesthetic Rules

1. Prioritize product imagery over decorative UI.
2. Keep surfaces flat or lightly elevated; avoid heavy gradients and loud shadows.
3. Limit accent color usage to CTAs, selected filters, and critical highlights.
4. Use thin borders, quiet dividers, and whitespace instead of ornamental containers.
5. Show only information that supports discovery, trust, or purchase intent.

## Component Set

### Shared Components

- `Header`: logo, primary navigation, cart, account, mobile trigger.
- `Footer`: contact links, WhatsApp shortcut, legal links, social references.
- `SectionHeading`: eyebrow, title, description block.
- `PrimaryButton` and `SecondaryButton`: consistent CTA hierarchy.
- `EmptyState`: for empty catalog results or missing order history.

### Commerce Components

- `HeroBanner`: large image, concise value proposition, primary CTA.
- `ProductCard`: image, category, name, price, short CTA.
- `ProductGrid`: responsive catalog grid with consistent card rhythm.
- `CatalogFilters`: category, room, material, price range, availability.
- `ProductGallery`: main image with supporting thumbnails.
- `ProductInfoPanel`: title, price, materials, dimensions, stock state, CTA stack.
- `WhatsAppInquiryButton`: inquiry CTA with product-aware messaging.
- `CartDrawer` or `CartPanel`: line items, subtotal, checkout CTA.

## Page Designs

### Home

- Start with a full-width hero focused on craftsmanship, custom furniture, and trust.
- Follow with a featured product grid showing curated best sellers or collections.
- Include a WhatsApp CTA band for made-to-order or custom quote inquiries.
- Add a short brand story section and a compact trust block with delivery or material highlights.

### Catalog

- Use a clear page header with collection title and short descriptive copy.
- Place filters in a sidebar on desktop and a drawer or sheet on mobile.
- Use a uniform product card grid with strong image ratios and scannable prices.
- Keep sort controls visible but secondary to filtering.

### Product Detail

- Use a two-column layout on desktop: gallery left, product info right.
- Put essential purchase information above the fold: name, price, availability, CTA stack.
- Place the WhatsApp button near the main action area for consultation-oriented sales.
- Below the fold, include description, dimensions, materials, shipping notes, and related products.

### About

- Focus on workshop identity, materials, craftsmanship process, and trust-building imagery.
- Use editorial spacing and restrained copy blocks rather than marketing-heavy cards.

### Contact

- Show WhatsApp as the primary contact path.
- Support it with a lightweight contact form, business hours, and delivery coverage information.

## Responsive Guidelines

1. Collapse multi-column layouts to a single readable column on smaller screens.
2. Keep primary CTAs visible without overwhelming the viewport.
3. Preserve image-first merchandising by maintaining stable aspect ratios across breakpoints.
4. Avoid horizontal scrolling in filter controls, data tables, and product galleries.
5. Keep tap targets comfortable and spacing consistent in mobile navigation, filter drawers, and CTA groups.
