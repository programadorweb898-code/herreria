# Database Agent

## Purpose

Define the MongoDB and Mongoose design for products, users, and orders in the backend Express.js project only.

## Backend Ownership

1. All database logic lives in `/backend` only.
2. Place Mongoose schemas in `/backend/models`.
3. Place the MongoDB connection bootstrap in `/backend/lib/mongodb.ts`.
4. Place seed scripts in `/backend/seed`.
5. The frontend must never connect directly to MongoDB; it reads and writes data only through the backend API.

## Collection Design

### `products`

Stores the catalog shown in the storefront. Each document represents one sellable furniture item.

Core fields:

- identity: `_id`, `slug`, `sku`
- merchandising: `name`, `shortDescription`, `description`, `price`, `compareAtPrice`, `currency`
- classification: `category`, `tags`, `materials`, `dimensions`, `rooms`
- media: `coverImage`, `gallery`
- inventory: `stock`, `availabilityStatus`, `isFeatured`, `isActive`
- SEO support: `metaTitle`, `metaDescription`
- timestamps: `createdAt`, `updatedAt`

### `users`

Stores authenticated customers and administrators.

Core fields:

- identity: `_id`, `name`, `email`, `image`
- auth: `provider`, `providerAccountId`, `hashedPassword`
- access: `role`, `isActive`
- contact: `phone`
- address book: `addresses[]`
- timestamps: `createdAt`, `updatedAt`, `lastLoginAt`

### `orders`

Stores checkout attempts and completed purchases.

Core fields:

- identity: `_id`, `orderNumber`
- relations: `userId`, `items[].productId`
- pricing: `subtotal`, `shippingAmount`, `discountAmount`, `total`, `currency`
- workflow: `status`, `paymentStatus`, `paymentProvider`
- payment traceability: `mercadoPagoPreferenceId`, `mercadoPagoPaymentId`
- fulfillment: `shippingAddress`, `customerNotes`
- snapshot data: `items[].name`, `items[].slug`, `items[].unitPrice`, `items[].quantity`
- timestamps: `createdAt`, `updatedAt`, `paidAt`

## TypeScript Interfaces

These contracts describe backend domain models. Frontend-facing types may mirror them, but the backend remains the source of truth for persistence shapes.

```ts
export interface Product {
  _id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  tags: string[];
  materials: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: "cm" | "m";
  };
  rooms: string[];
  coverImage: string;
  gallery: string[];
  stock: number;
  availabilityStatus: "in_stock" | "made_to_order" | "out_of_stock";
  isFeatured: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  provider?: string;
  providerAccountId?: string;
  hashedPassword?: string;
  role: "customer" | "admin";
  isActive: boolean;
  phone?: string;
  addresses: Array<{
    label: string;
    recipient: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    unitPrice: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "approved" | "rejected" | "refunded";
  paymentProvider: "mercadopago";
  mercadoPagoPreferenceId?: string;
  mercadoPagoPaymentId?: string;
  shippingAddress: {
    recipient: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  customerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}
```

## Relationships

1. A `User` can have many `Order` documents through `orders.userId`.
2. An `Order` contains many line items, and each line item references one `Product` through `items.productId`.
3. Product data needed for historical reporting is duplicated into order item snapshots so later product edits do not rewrite past orders.
4. Authentication provider account details stay embedded in `users` unless provider complexity requires a dedicated accounts collection later.

## Indexing Strategy

1. `products.slug`: unique index for detail page lookup.
2. `products.sku`: unique index for admin and inventory operations.
3. `products.category`, `products.isFeatured`, `products.isActive`: query indexes for catalog filters.
4. Text index across `products.name`, `products.shortDescription`, and `products.tags` for search.
5. `users.email`: unique index for login and account resolution.
6. `orders.orderNumber`: unique index for support and back-office lookup.
7. `orders.userId, orders.createdAt`: compound index for customer order history.
8. `orders.paymentStatus, orders.status`: compound index for operational dashboards.
9. `orders.mercadoPagoPaymentId`: sparse unique index for payment reconciliation.

## Seed Data Approach

1. Seed categories and featured products from deterministic files under `/backend/seed`.
2. Use stable slugs and SKUs so seed reruns are idempotent.
3. Insert an initial admin user through a protected bootstrap script, not a public endpoint.
4. Keep seed images as public asset references, not binary database payloads.
5. Support upsert-based seeds to keep local and staging environments consistent.

## Integration Boundary

1. Backend controllers and services may import from `/backend/models` and `/backend/lib/mongodb.ts`.
2. Frontend code under `/frontend` must not import Mongoose models or database utilities.
3. Any data needed by the frontend should be exposed through backend API responses rather than direct database access.
