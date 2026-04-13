# Database Agent Skills

## Objective

Implement the MongoDB and Mongoose design defined by the database agent.

## Execution Steps

1. Create `models/Product.ts`, `models/User.ts`, and `models/Order.ts`.
2. Translate the TypeScript interfaces into Mongoose schemas with timestamps enabled.
3. Add enum validation for product availability, user role, order status, and payment status.
4. Add unique indexes for `slug`, `sku`, `email`, and `orderNumber`.
5. Add compound and text indexes required for catalog search and order retrieval.
6. Create shared database connection logic in `lib/db/connect.ts` using connection caching for development.
7. Export model-safe initialization patterns that avoid recompilation errors in hot reload.
8. Create `types/` contracts matching the persisted document shape used by API and UI layers.
9. Add seed fixtures for products and admin bootstrap data.
10. Create a seed runner that upserts records by stable keys.

## Validation Checklist

- Product slugs and SKUs are unique.
- User emails are normalized before persistence.
- Order line items store product snapshots for historical integrity.
- All indexes map to real query patterns used by catalog, auth, and admin flows.
- Mongoose models can be imported repeatedly without duplicate model errors.
