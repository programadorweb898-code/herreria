# Agent Orchestrator

## Routing Table

| Task Pattern | Assigned Agent |
| --- | --- |
| Build a page or component | `ui-agent` |
| Create or modify a DB schema | `database-agent` |
| Create an API endpoint | `api-agent` |
| Setup or modify project structure | `scaffold-agent` |
| Anything related to WhatsApp contact | `whatsapp-agent` |
| Anything related to SEO or metadata | `seo-agent` |
| Define shared data contracts between API and DB | `database-agent` then `api-agent` |
| Add a new customer flow spanning UI and API | `ui-agent` and `api-agent` |
| Add a feature affecting UI, API, and persistence | `scaffold-agent` coordinates `ui-agent`, `api-agent`, and `database-agent` |
| Add product discovery or landing page improvements | `ui-agent` and `seo-agent` |
| Add product inquiry actions from catalog or detail pages | `ui-agent` and `whatsapp-agent` |
| Add checkout or payment-related endpoints | `api-agent` with `database-agent` context |

## Agent Isolation Rules

Each agent owns specific files and folders exclusively.
No agent can create, modify, or delete files outside its domain.

## Ownership Map

- `scaffold-agent` -> `/frontend/app/layout.tsx`, `/frontend/next.config.ts`, `/frontend/tailwind.config.ts`, `/frontend/tsconfig.json`, `/frontend/.env*`, `/backend/tsconfig.json`, `/backend/.env*`, `/backend/src/app.ts`, `/backend/src/server.ts`
- `database-agent` -> `/backend/models/**`, `/backend/lib/mongodb.ts`, `/backend/lib/products.ts`, `/backend/seed/**`
- `ui-agent` -> `/frontend/components/**`, `/frontend/app/**/page.tsx`, `/frontend/app/**/layout.tsx` except the root layout
- `api-agent` -> `/backend/routes/**`, `/backend/controllers/**`, `/backend/middleware/**`, `/backend/src/**` except scaffold-owned files
- `whatsapp-agent` -> `/frontend/components/WhatsAppButton.tsx` only; `ui-agent` can use it but never modify it
- `seo-agent` -> `/frontend/app/sitemap.ts`, `/frontend/app/robots.ts`, and metadata inside each `page.tsx` through `generateMetadata` only

## Conflict Rules

1. If a task requires two agents touching the same file, the orchestrator must split the task and define a clear execution order so one agent finishes completely before the next one starts.
2. `ui-agent` can import from `database-agent` files but never modify them.
3. `seo-agent` can add `generateMetadata` to pages but never touch the page JSX structure.
4. No agent creates files in another agent's domain, even if the file seems related to its task.

## Delegation Rules

1. Classify the request by primary responsibility before assigning work.
2. If the task affects one domain only, delegate to exactly one specialist agent.
3. If the task affects multiple domains, assign a lead agent based on the initiating surface:
   - UI-first change: `ui-agent`
   - Data-first change: `database-agent`
   - Endpoint-first change: `api-agent`
   - Cross-cutting structure change: `scaffold-agent`
4. Always delegate WhatsApp behavior to `whatsapp-agent` when message construction, CTA placement, or contact flow is involved.
5. Always delegate metadata, indexing, sitemap, robots, and discoverability concerns to `seo-agent`.
6. Require downstream agents to consume upstream constraints rather than redefining them.
7. Escalate unresolved conflicts to the orchestrator, which selects the authoritative agent for the disputed concern.

## Context Passing

1. Pass the original request unchanged to every delegated agent.
2. Attach a compact context packet with:
   - Objective
   - Scope boundaries
   - Relevant prior agent outputs
   - Required inputs and expected deliverables
   - Known constraints and assumptions
3. When chaining agents, pass only finalized decisions, not intermediate alternatives.
4. Preserve shared identifiers consistently across agents, including route names, model names, DTO names, and environment variable names.
5. Mark each context packet with a source agent and version so later agents know which decisions are current.

## Result Aggregation

1. Collect outputs in dependency order: structure, data, API, UI, channel integrations, then SEO.
2. Validate that each agent output references the same entities, routes, and naming conventions.
3. Merge results into one implementation brief with duplicated decisions removed.
4. If two agents define overlapping responsibilities, keep the decision from the authoritative domain owner and discard the conflicting duplicate.
5. Produce a final combined result containing:
   - Accepted decisions by domain
   - Cross-agent dependencies
   - Open issues requiring follow-up delegation
