# OGroup AI Factory Dashboard

Customer-facing SaaS control plane for the **OGroup AI Factory**.

## Product vision

**Use our workforce. Or bring yours.**

Customers can **Build For Me** with OGroup-managed AI or **Build With My AI** using their own providers/models. Both modes use the same core:

`Project Brain → Orchestrator → Roles → Agents → Models → Providers → Build → Verify → Repair → Deploy → Watchdog`

The Dashboard is the simple human control plane. Factory runtime, orchestration, agents, Watchdog, persistence and provider execution remain in `alnatourm/ogroup-ai-factory`. Closing the Dashboard must never stop Factory execution.

## Current SaaS

- Factory Home / My Software
- Create Product / Build Software
- Project Control Room and Project Brain
- My Factory: roles, agents, models and providers
- Usage & Billing
- Design/production human gates
- Factory Health / Watchdog
- Needs My Attention and Factory Activity

The approved Stitch direction is frozen as the customer UX reference.

## Production security architecture

Production browser traffic no longer talks directly to the Factory API:

`Browser → Dashboard server/BFF → authenticated Factory API → PostgreSQL`

The Dashboard server serves Vite and proxies `/api/factory/*`. It injects the Factory bearer credential and transitional tenant context server-side. Privileged credentials must never be placed in `VITE_*` or returned to the browser.

Server-only Dashboard variables:
- `FACTORY_API_URL`
- `FACTORY_CONTROL_API_KEY`
- `FACTORY_TENANT_ID`

Factory production has `FACTORY_REQUIRE_AUTH=true`. The BFF boundary protects the current bridge. Full customer Google OIDC/session/membership authorization is still required before the transitional tenant context is considered final SaaS identity/isolation.

## Persistence

Production uses PostgreSQL with a persistent Railway volume and `PGDATA=/var/lib/postgresql/data/pgdata`. Durable runtime implementations exist for Project Brain, Factory configuration, usage events and the encrypted BYOK vault.

BYOK is encrypted server-side with AES-256-GCM. Raw provider secrets must never be returned to the browser. Never use a real provider key for persistence testing.

Volume-level PostgreSQL persistence across redeployment is verified. Application-level persistence verification is next.

## Verified production state: 2026-09-30

- Secure Dashboard BFF: PR #51, merged.
- BFF merge SHA: `c6469115f96f5c89d458715564855db0962ede9b`.
- Express 5 production fix SHA: `8b672097fbef4185995b5fab9c61f1bc2864b95c`.
- Dashboard Railway deployment `0b39a9b7-eeae-4e2d-9f06-66b75035cf04`: **SUCCESS**.
- Dashboard runtime: `DASHBOARD_READY`, port 8080.
- Factory authenticated deployment `fd2d414f-4786-462a-a06c-1aeb08146455`: **SUCCESS**.
- Factory production commit: `9e5c8a2217bee67f29965828ccb567dc797c1a24`.
- PostgreSQL volume persistence: **VERIFIED**.
- Watchdog remains enabled continuously.

## Next verification

Do not call the SaaS finished until:
1. unauthenticated direct Factory control access is rejected;
2. Dashboard BFF still reaches protected Factory;
3. Project Brain write/read passes;
4. Factory config write/read passes;
5. usage POST/GET passes;
6. fake non-sensitive BYOK PUT/GET returns metadata only, never raw secret;
7. data survives Factory API redeploy;
8. data survives PostgreSQL restart;
9. real customer Google OIDC/session/membership authorization is verified;
10. full customer E2E passes.

## Commands

```bash
npm install
npm run dev
npm run build
npm test
npm start
```

## Product Owner rule

The Product Owner describes the software, approves important design/release decisions and reviews outputs. Repository management, CI retries, provider plumbing, repairs, deployments and Watchdog operation belong to the platform, not the customer.
