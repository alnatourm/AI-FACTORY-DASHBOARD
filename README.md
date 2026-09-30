# OGroup AI Factory Dashboard

Customer-facing SaaS and Product Owner control plane for **OGroup AI Factory**.

Production: https://ai-factory-dashboard-production.up.railway.app

The core Factory runtime, orchestrator, Watchdog, agents, persistence, BYOK vault and governed execution remain in `alnatourm/ogroup-ai-factory`.

## Product vision

AI Factory is a software-production SaaS with two customer modes:

1. **Build For Me** — use OGroup-managed AI agents/models.
2. **Build With My AI** — connect customer-selected agents/models/providers/BYOK.

Both modes use the same Factory:

`Project Brain → Orchestrator → Roles → Agents → Models → Providers → Build → Verify → Repair → Deploy → Watchdog`

The customer experience should stay simple: describe the software, approve important decisions, and review the result. Factory internals stay behind the control plane.

## Current Dashboard capabilities

- Factory Home and real project/run data
- Create Product
- Project Control Room
- Human approval/review screens
- Factory Activity and attention views
- Factory Health / Watchdog
- My Factory configuration
- Managed vs Custom Factory mode
- Role → Agent → Model → Provider mapping
- Project Brain read/write bridge
- Usage & Billing view
- Server-side secure Factory BFF

## Security architecture

The browser no longer talks directly to the privileged Factory control API.

`Browser → Dashboard BFF → authenticated Factory API → PostgreSQL`

Production credentials are server-side only:

- `FACTORY_API_URL`
- `FACTORY_TENANT_ID`
- `FACTORY_CONTROL_API_KEY`

The Factory runtime has `FACTORY_REQUIRE_AUTH=true`.

**Never place privileged credentials in `VITE_*` variables or browser code.**

The current BFF protects the Factory control credential and server-owned tenant context. Full customer Google OIDC/session/membership isolation is still required before public multi-tenant release.

## Verified production status

As of 2026-09-30:

- Dashboard secure-BFF fix commit: `8b672097fbef4185995b5fab9c61f1bc2864b95c`
- Dashboard Railway deployment: `0b39a9b7-eeae-4e2d-9f06-66b75035cf04` — **SUCCESS**
- Dashboard runtime emitted `DASHBOARD_READY` on port 8080.
- Factory API authentication is enabled in production.
- Factory API deployment is **SUCCESS**.
- PostgreSQL has a persistent Railway volume mounted at `/var/lib/postgresql/data`.
- PostgreSQL uses `PGDATA=/var/lib/postgresql/data/pgdata`.
- PostgreSQL cluster persistence across redeployment has already been verified.
- Project Brain, Factory configuration, usage metering and encrypted BYOK persistence code are deployed.

## Test status

Deployment is green, but the full application-level persistence/E2E test is **not complete**.

Still to verify:

1. Direct unauthenticated Factory control request is rejected with `401`.
2. Dashboard → BFF → authenticated Factory API works end-to-end.
3. Write/read Project Brain test data.
4. Write/read Factory configuration test data.
5. POST/read usage test data.
6. Store a **fake/non-sensitive** BYOK credential and confirm the API returns metadata only, never plaintext.
7. Redeploy the Factory API and confirm all test data survives.
8. Restart PostgreSQL and confirm all test data survives.
9. Remove test records where practical.

Do not use real customer/provider secrets for these tests.

## Remaining P0 before public SaaS

- Real Google OIDC/customer session authentication
- User → organization/tenant membership enforcement
- Per-user authorization/RBAC at the Dashboard BFF/API boundary
- Complete tenant-isolation E2E tests
- Verify production database migrations
- BYOK UI and provider execution wiring
- Full production E2E test

## Working rules

- Product Owner should not babysit GitHub, CI or Railway.
- Build success is not deployment success.
- Never call a change fixed until the exact commit, CI, Railway deployment and live behavior are verified where applicable.
- Never expose secrets in chat, logs or browser bundles.
- Keep Watchdog running continuously.
- Do not use the unfinished AI Factory to build itself. Develop the repositories directly.
- Engineering checks run automatically and should not become Product Owner chores.
- Customer repositories should default private.
- Missing capabilities must be explicit, never represented as fake PASS/green states.

## Repository boundaries

### Dashboard repository

`alnatourm/AI-FACTORY-DASHBOARD`

Owns customer/Product Owner UI and its server-side BFF.

### Factory repository

`alnatourm/ogroup-ai-factory`

Owns orchestration, Watchdog, agents, Factory control API, persistence, security enforcement, BYOK vault, usage metering and execution evidence.

## Next action

Run the pending production security + application persistence test suite. Fix any failure directly, redeploy, and verify again before moving to the remaining SaaS UI and customer authentication work.
