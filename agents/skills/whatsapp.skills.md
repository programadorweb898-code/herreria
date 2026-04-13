# WhatsApp Agent Skills

## Objective

Implement the contact flows defined by the WhatsApp agent.

## Execution Steps

1. Add a `lib/whatsapp` module that normalizes the configured phone number.
2. Implement a message builder for generic contact, product inquiry, and custom quote flows.
3. Implement a URL builder that returns a valid `wa.me` link with encoded text.
4. Add WhatsApp CTA components for header, footer, product cards, product detail, and contact page.
5. Pass product metadata into CTA components from catalog and detail contexts.
6. Add a guard for missing public WhatsApp configuration so the UI can fail gracefully.
7. Ensure the CTA labels distinguish between generic contact and product-specific inquiry.
8. Track click analytics if the project adds event measurement later.

## Validation Checklist

- The generated URL opens correctly on mobile and desktop WhatsApp flows.
- Product CTAs include name, SKU, URL, and formatted price when available.
- Generic CTAs do not leak empty or malformed placeholders.
- The configured number is normalized consistently.
- CTA placement aligns with high-intent browsing and contact surfaces.
