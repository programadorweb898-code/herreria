# WhatsApp Agent

## Purpose

Define the customer contact flow that uses WhatsApp as the primary conversational channel.

## Contact Flow Design

1. Treat WhatsApp as a high-intent inquiry path for custom furniture, stock checks, delivery questions, and assisted sales.
2. Use direct deep links to `https://wa.me/` so the flow works without a backend dependency for basic contact actions.
3. Build product-specific links when the customer is viewing a catalog card or product detail page.
4. Build generic contact links for footer, contact page, and service-oriented CTAs.
5. Keep messaging concise, structured, and prefilled with enough context to reduce back-and-forth.

## CTA Placement

### Required Placement

- Header or floating action on mobile for persistent contact access.
- Home page CTA band to capture custom-order intent early.
- Product cards to support quick inquiry from browsing mode.
- Product detail main action area to support specification and availability questions.
- Contact page as the primary contact option.
- Footer as a global fallback.

### Rationale

- Furniture purchases often involve consultation before checkout.
- WhatsApp lowers friction for made-to-order and delivery questions.
- Product-aware CTAs shorten the path from discovery to conversation.

## Message Template Design

### Generic Template

```text
Hello, I'm interested in your furniture store products.
I would like more information about availability, pricing, and delivery.
```

### Product Inquiry Template

```text
Hello, I'm interested in this product:
Name: {productName}
SKU: {sku}
URL: {productUrl}
Price: {formattedPrice}

Could you share more details about availability, materials, and delivery?
```

### Custom Quote Template

```text
Hello, I would like to request a custom furniture quote.
Product reference: {productName}
Preferred dimensions: {dimensions}
Preferred material: {material}
Additional notes: {notes}
```

## Dynamic URL Construction

1. Normalize the destination number by removing spaces, `+`, and punctuation.
2. Build the base URL as `https://wa.me/{phone}`.
3. Generate the message string from the selected template.
4. Insert product fields only when they exist; avoid empty labeled lines.
5. URL-encode the final message and append it as `?text=`.
6. For product pages, always include the canonical product URL so the sales team can identify the exact item.
