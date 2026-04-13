# API Agent Skills

## Objective

Implement the Route Handlers and service contracts defined by the API agent.

## Execution Steps

1. Create `app/api` resource folders for products, orders, checkout, payments, contact, and auth registration.
2. Add request validation for query parameters and JSON bodies before invoking domain logic.
3. Implement standardized success and error response helpers.
4. Connect product endpoints to `Product` queries with filtering, search, sorting, and pagination.
5. Connect order endpoints to authenticated user context and admin role checks.
6. Implement checkout preference creation with MercadoPago integration helpers.
7. Implement webhook verification and payment status reconciliation.
8. Keep WhatsApp preview generation server-safe if any normalization or auditing is required.
9. Export request and response types from `types/api.ts` or equivalent.
10. Add tests for validation failures, missing resources, unauthorized access, and successful flows.

## Validation Checklist

- Every endpoint returns a stable JSON envelope.
- Authentication and authorization checks are explicit for protected routes.
- Query filters map to indexed database fields where possible.
- Payment webhook handlers are idempotent.
- Route Handlers remain thin and delegate business rules to reusable modules.
