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
