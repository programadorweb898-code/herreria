# API Agent

## Purpose

Define the Express.js API architecture for the backend project that serves the Next.js frontend.

## Express Architecture

1. All API code lives in `/backend`.
2. Mount resource routers from `/backend/routes` using the Express Router pattern.
3. Keep request handlers in `/backend/controllers`.
4. Keep route files thin: define paths, attach middleware, and delegate to controllers.
5. Parse JSON at the app level and return JSON responses consistently.
6. Configure CORS to accept requests from the frontend origin defined by `CORS_ORIGIN`.

## Folder Responsibilities

- `/backend/src/app.ts`: create the Express app, register middleware, mount routers, and attach error handling.
- `/backend/routes/products.ts`: declare product endpoints with `Router()`.
- `/backend/controllers/products-controller.ts`: implement product request handlers.
- `/backend/middleware/error-handler.ts`: centralized error handling middleware.
- `/backend/types/`: shared backend request, response, and error contract types.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/products` | Return all products |
| `GET` | `/api/products/:slug` | Return one product by slug |

## Express Router Example

```ts
import { Router } from "express";
import {
  getProductBySlug,
  getProducts,
} from "../controllers/products-controller";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:slug", getProductBySlug);

export default productsRouter;
```

## TypeScript Contracts

```ts
import type { Request, Response, NextFunction } from "express";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ProductsRequest = Request;

export type ProductBySlugRequest = Request<{ slug: string }>;

export type ProductsResponse<T> = Response<ApiSuccessResponse<T> | ApiErrorResponse>;

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;
```

## Controller Guidelines

1. Type controller parameters with Express `Request` and `Response` types.
2. Read URL params from `req.params` and query values from `req.query`.
3. Query Mongoose models through backend-only imports.
4. Return `404` when a product slug does not exist.
5. Pass unexpected failures to `next(error)` so the error middleware handles them.

## CORS Policy

1. Register `cors({ origin: process.env.CORS_ORIGIN })` before the routes.
2. Allow the frontend Next.js app under `/frontend` to call the backend from the browser.
3. Keep CORS configuration in backend middleware or app bootstrap, never in frontend code.

## Error Handling Middleware

1. Add a final Express error handler after all routes.
2. Normalize known HTTP errors into `{ success: false, error: { code, message } }`.
3. Return `500` for unhandled failures with a sanitized message.
4. Log full internal errors server-side for debugging.

## Ownership Boundary

1. The frontend must consume these endpoints through `NEXT_PUBLIC_API_URL`.
2. The API layer may import backend models and database utilities, but never frontend code.
3. Do not implement API endpoints as Next.js Route Handlers.
