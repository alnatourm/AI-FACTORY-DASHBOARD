# AI Factory Dashboard

Dedicated repository for the **OGroup AI Factory Dashboard** only.

This repository contains the Product Owner control plane and its dashboard-specific design/specification assets. The core AI Factory runtime, orchestrator, agents, adapters, and product build machinery remain in `alnatourm/ogroup-ai-factory`.

## Scope

- Factory Home
- Create Product
- Project Control Room
- Design Approval
- Product Review
- Agent Registry
- Factory Health / Watchdog
- Needs My Attention
- Activity

## Product principle

The dashboard answers:

1. What is being built?
2. Is the Factory actually working?
3. Does anything need the Product Owner?

The dashboard is a control plane, not the Factory runtime. It may go offline without stopping Factory execution.


## Live Factory wiring

The Dashboard now contains a real HTTP client for the governed Factory control API. It does not execute agents or hold provider credentials.

Configure the deployed Dashboard with:

- `VITE_FACTORY_API_URL` — public base URL of the deployed OGroup Factory API.
- `VITE_FACTORY_TENANT_ID` — tenant identifier sent through the Factory's existing tenant boundary.

The browser uses the existing Factory session cookie (`credentials: include`) and the tenant header. The Factory API remains responsible for authentication, `admin:access`, orchestration, Watchdog state, evidence, approvals and release governance.

### Connection truth

The header deliberately reports one of three states:

- **FACTORY CONNECTED** — a configured Factory endpoint returned a live snapshot.
- **FACTORY UNREACHABLE** — configuration exists but the live snapshot request failed.
- **FACTORY NOT CONFIGURED** — deployment has no Factory API URL/tenant configuration.

The Dashboard must not label itself connected from mock/demo data. Current static screen content remains presentation fallback until each view is mapped to the corresponding live snapshot fields.

### Commands

`Start AI Factory` now calls `POST /api/v1/factory/runs` when the bridge is configured. The shared client also implements governed design/production approval and change-request calls for the human-gate screens.

Provider credentials such as Antigravity or Stitch secrets remain exclusively in the Factory runtime.
