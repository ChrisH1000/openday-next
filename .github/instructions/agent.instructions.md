---
applyTo: '**'
---

# AI Agent Engineering Instructions for `openday-next`

These instructions govern how an AI assistant (code-generation, refactor, review, or planning agent) should interact with this repository. Follow them strictly to maintain consistency, safety, performance, and developer ergonomics.

## 1. Project Overview

`openday-next` is a Next.js 15 application (App Router) using:
- React 19 RC
- TypeScript 5
- next-auth v5 beta (authentication)
- TailwindCSS (UI styling) + `@tailwindcss/forms`
- Postgres via `@vercel/postgres`
- Data validation: `zod`
- Utility: `clsx`, `swr`, `react-toastify`
- Password hashing: `bcryptjs`

Primary domain objects:
- Openday (parent) — has many events
- Event — belongs to an openday (FK: `openday_fk`)

Major directories:
- `app/` — App Router pages, API routes, layouts, UI flows
- `app/api/opendays/...` — REST-like API endpoints for CRUD (Openday + Events)
- `app/admin` — administrative UI (list, create, edit entities)
- `app/ui` — reusable components (forms, lists, buttons, skeletons, theming)
- `scripts/` — DB seed and migrations
- `auth.ts` / `auth.config.ts` — Authentication wiring

## 2. Architectural Principles
1. Keep server logic in dedicated lib/action modules; keep route handlers thin.
2. Prefer explicit data validation at the boundary (API handler or server action) with `zod`.
3. Favor incremental static/regeneration only if future performance tasks require it; default to dynamic for authenticated/admin flows.
4. Keep components server-first unless true client interactivity is required (forms with local state, theme toggles, toast triggers, SWR usage). Use `'use client'` only when necessary.
5. Avoid circular imports; use absolute imports via configured TS paths (if added) or `@/app/...` alias.

## 3. Data & Persistence
- Access DB exclusively through `@vercel/postgres` (`sql` tagged template) or centralized helper functions added to a `lib/` module (create one if needed for reuse).
- Always parameterize values with template placeholders to avoid SQL injection (current usage with template literal tag is safe if not string-concatenated).
- When deleting parent (openday), ensure cascade behavior (see `scripts/migration_add_cascade_event.sql`). If adding new foreign keys, replicate cascading semantics when appropriate.

## 4. API Route Conventions (`app/api/*`)
Pattern:
```ts
export async function GET(req: Request, ctx: { params: {...} }) {}
export async function POST(...) {}
// Return `Response` or `NextResponse.json()`
```
Guidelines:
- Always wrap in try/catch and return JSON error `{ error: string }` with appropriate status.
- Use 2xx only for true success; 400 for validation errors; 404 when an entity is not found; 500 for unexpected failures.
- Log sparingly (avoid leaking sensitive info). For new logging add a `LOG_LEVEL` guard if noise grows.
- For update endpoints: return the updated entity to support optimistic UI.

## 5. Authentication & Authorization
- `next-auth` v5 beta: centralize config in `auth.config.ts` and helper in `auth.ts`.
- Guard admin or planner routes via layout-level session checks (middleware or server component). If adding RBAC:
	- Extend session callback to include `role`.
	- Build a lightweight `requireRole('admin')` helper.
- Never expose password hashes in responses. If adding new user fields, scrub sensitive columns in API outputs.

## 6. Forms & Validation
- Use `zod` schemas colocated with the action or in a shared `schemas.ts` (create if absent) for re-use between server & client.
- Server is source of truth: always validate again server-side even if client validated.
- Return structured error: `{ success: false, fieldErrors?: Record<string,string>, error?: string }`.

## 7. UI & Components
- Tailwind: keep utility classes readable; extract repeated multi-utility patterns into component-level wrappers or `clsx` helpers.
- Keep loading states consistent: use existing skeleton/spinner components.
- Use `react-toastify` for transient success/error notifications; avoid duplicating local banners unless persistent.
- For lists with server data + client edits, prefer SWR for revalidation after mutations.

## 8. State & Data Fetching
Decision flow:
1. Server Component + `sql` call (fast path SSR) if data is request-bound and not reactive.
2. Client Component + SWR if user-initiated mutations or polling is required.
3. Server Action (when upgrading) for direct form submissions with progressive enhancement.

## 9. Error Handling & Observability
- Always include a top-level catch in async server logic.
- Normalize thrown errors into `Error` objects before JSON serialization.
- Avoid sending stack traces to clients.
- Introduce a minimal `lib/errors.ts` if patterns duplicate (e.g., `NotFoundError`, `ValidationError`).

## 10. Performance Guidelines
- Batch DB queries where feasible (e.g., counts aggregated server-side as done in opendays list).
- Avoid N+1 patterns: prefer SQL joins or aggregated queries.
- Use React Server Components for heavy/read-only views to reduce bundle size.
- Only mark components `'use client'` when necessary (state, effects, event handlers, SWR, context consumption requiring client).

## 11. Security Practices
- NEVER log credentials or full session objects.
- Use `bcryptjs` with a cost factor consistent across code. If introducing user creation flows, standardize salt rounds (e.g., 10) in a single constant.
- Sanitize/validate all dynamic route params (ensure they are numeric/UUID as applicable before DB usage).
- For future file uploads: restrict MIME types & size early.

## 12. Testing & Verification (If adding tests)
- Add a `tests/` directory (Vitest or Jest) — pick one and create config; prefer lightweight integration tests around API route handlers (invoke exported functions directly with mock `Request`).
- Mock `@vercel/postgres` with a thin in-memory adapter or a test schema.
- Validate: success path + at least one failure (validation or not found).

## 13. Coding Style & TypeScript
- Strict types preferred. If you add `tsconfig` changes, move towards enabling `strict` if not already.
- Avoid `any`; prefer `unknown` + refinement or schema inference via `zod` (`z.infer<typeof Schema>`).
- Group imports: external, absolute, relative. Remove unused imports.
- Keep functions small (< ~40 lines) or extract helpers.

## 14. Dependency Usage Guidelines
- `@vercel/postgres`: Use the provided `sql` tag—do not manually assemble raw query strings with interpolation concatenation.
- `swr`: Key must be stable; revalidate after POST/PUT/DELETE by calling `mutate(key)`.
- `react-toastify`: Centralize container (once) in layout; do not create multiple containers.
- `zod`: Use refinement for cross-field validation; return aggregated field errors.
- `next-auth`: Use `getServerSession` only in server components, actions, or route handlers; never in client components.

## 15. File & Naming Conventions
- Components: PascalCase (`CreateEventForm.tsx`)
- Hooks: `useXyz.ts`
- Route handlers: `route.ts`
- Keep domain logic inside `lib/` (create if absent). Avoid scattering raw `sql` across many UI files.
- Co-locate small schemas with their form/action; hoist to shared module once reused 3+ times.

## 16. Migrations & Seeds
- `scripts/seed.js` seeds baseline data. If modifying schema, create new migration scripts in `scripts/` with descriptive names (timestamp prefix recommended) rather than altering existing migration files.
- Document irreversible destructive changes in the migration header comment.

## 17. Introducing New Features (Checklist)
1. Define schema + validation (zod)
2. Add DB query (lib function)
3. Add API route or server action
4. Add UI component(s) (server first)
5. Add loading & error states
6. Add optimistic update or SWR revalidation (if client-managed)
7. Add minimal tests (if test infra present)
8. Update README/domain docs if model changes

## 18. Commit & PR Guidance
- Keep commits logically scoped (one feature or fix).
- Reference related issue (if GitHub Issues introduced) in PR description.
- Include: what changed, why, screenshots for UI.
- Run `pnpm lint` and ensure type checks pass before submitting.

## 19. Using Context7 MCP Server
When needing library or framework documentation (Next.js, next-auth, Tailwind, etc.):
1. Resolve library ID via `mcp_context7_resolve-library-id`.
2. Fetch focused docs with `mcp_context7_get-library-docs` (specify topic: `routing`, `auth`, `hooks`).
3. Cite only relevant excerpts—avoid dumping entire docs.
4. Prefer current version alignment (Next.js 15, React 19 RC nuances). If a mismatch is detected, note potential API differences.
5. Do not fabricate APIs—verify via docs before recommending new Next.js features (e.g., partial prerendering, server actions semantics).

## 20. Sequential Thinking MCP Server Usage
For complex refactors or multi-step feature additions:
1. Start a structured reasoning session (sequential thinking) outlining goals, constraints, and risks.
2. Enumerate steps: data model impact, API surface, UI changes, validation, error cases, testing, observability.
3. Re-evaluate assumptions after each major step; revise earlier thoughts if contradictions emerge.
4. Produce a concise implementation plan before writing code.
5. Keep the reasoning log focused (avoid repetition, highlight deltas and decision pivots).

Recommended triggers for sequential thinking:
- Schema changes or cascade updates
- Cross-cutting refactors (authentication model, theming system)
- Performance tuning requiring query strategy changes
- Introducing caching layers

## 21. Error Classes & Standardization (Optional Future)
If error patterns grow, introduce:
```ts
export class NotFoundError extends Error { status = 404 }
export class ValidationError extends Error { status = 400; details?: Record<string,string>; }
```
Route handler pattern:
```ts
try { /* ... */ } catch (e) {
	const status = (e as any).status ?? 500;
	return NextResponse.json({ error: e.message, ...(e.details && { details: e.details }) }, { status });
}
```

## 22. Accessibility & UX
- Ensure form inputs have associated labels.
- Use semantic HTML in server components for headings, lists, nav.
- Maintain focus management after modals/dialog-like interactions (if added later).

## 23. Theming & Global UI
- Use existing `ThemeContext` and `ThemeToggle` components; centralize palette changes in Tailwind config.
- Avoid inline hex values when a semantic class (e.g., `text-muted`) would suffice; update Tailwind config to add semantic tokens if needed.

## 24. Loading & Skeleton Strategy
- Reuse existing skeleton components; if adding new skeleton types, keep naming consistent: `XyzSkeleton`.
- Use Suspense boundaries for data-heavy server components when splitting future features.

## 25. Edge Cases to Always Consider
- Empty results (no opendays or events) — return [] not null.
- Invalid ID types — return 400 early.
- Concurrent deletion (update after delete) — handle 404 gracefully.
- Large lists — consider pagination if count grows (> 100 items) before performance issues arise.
- Race conditions in create/edit — wrap related multi-step writes in a transaction (future: if moving from serverless to long-lived environment with pooled client).

## 26. Performance Guardrails (Forward-Looking)
- If event or openday counts become large, add composite indexes supporting filter/sort queries.
- Consider denormalized counters only after measuring actual DB bottlenecks.
- Use SWR's revalidation throttling for rapid successive edits.

## 27. Prohibited / Avoid
- Adding heavy client bundles for simple server-renderable lists.
- Storing secrets in the repo; rely on environment variables.
- Using `any` or silent `try { } catch {}` blocks with no logging.
- Duplicating SQL across many handlers (abstract instead).

## 28. Adding New Dependencies
- Justify with: (a) solves a demonstrated problem, (b) small footprint, (c) maintained.
- Prefer native / framework features first (e.g., built-in Next Image, server actions, streaming).
- Update this doc if the dependency adds new conventions (e.g., state management library).

## 29. Documentation Updates
- When data model changes: update README + this file's impacted sections.
- Keep changelog bullets in PR description until a `CHANGELOG.md` is introduced.

## 30. AI Change Review Checklist
Before finalizing an automated change, ensure:
- TypeScript passes (no new errors).
- No accidental broad file reformatting.
- Imports sorted & unused removed.
- API contract changes documented.
- Error handling consistent.
- New components: accessibility & server/client boundary justified.
- If using context7 docs, cited APIs truly exist.

## 31. Extension / Future Ideas (Non-blocking)
- Introduce test harness + CI.
- Add pagination & search to admin event/openday pages.
- Add role-based authorization.
- Add optimistic UI updates with SWR mutate patterns.
- Consider server actions migration for form submissions (Next 15 stable guidance) once React 19 final lands.

---
End of instructions.