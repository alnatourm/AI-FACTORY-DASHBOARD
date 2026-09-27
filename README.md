# AI Factory Dashboard

Production Product Owner control plane for the **OGroup AI Factory**.

The visual application lives here. The autonomous runtime, Orchestrator, Watchdog, agents/adapters and Factory credentials remain in `alnatourm/ogroup-ai-factory`.

## Live wiring

The Dashboard is wired to the Factory through a server-side control bridge. Factory credentials are never embedded in the React bundle.

```text
Browser
  ↓ same-origin /api/factory/*
Dashboard Node server
  ↓ FACTORY_CONTROL_URL + FACTORY_CONTROL_TOKEN
Private Factory Control API
  ↓
factory-work records / Watchdog / GitHub Actions / executors
```

### What is live

- **Create Product → Start AI Factory** creates a real `factory-work` record in the Factory supervisor repository.
- The target repository is recorded using the Factory's canonical `Target-Repository` field.
- Existing Watchdog discovery sees the run and owns continuation/recovery.
- **Factory Home** polls real Factory runs and renders their current durable status.
- Control requests stay server-side. No GitHub token or Factory control token is shipped to browser JavaScript.
- The Dashboard can be closed without stopping Factory execution.

### Runtime configuration

The Dashboard server requires:

- `FACTORY_CONTROL_URL`: private URL of the Factory Control API.
- `FACTORY_CONTROL_TOKEN`: shared server-side control credential.

The Factory Control API requires:

- `GITHUB_TOKEN`: existing Factory GitHub execution credential.
- `FACTORY_CONTROL_TOKEN`: same control credential used by the Dashboard server.
- `FACTORY_REPOSITORY`: defaults to `alnatourm/ogroup-ai-factory`.

Never expose these values in Vite `VITE_*` variables.

## Product surfaces

1. Factory Home
2. Create Product
3. Project Control Room
4. Design Approval
5. Product Review
6. Agent Registry
7. Factory Health / Watchdog
8. Needs My Attention
9. Factory Activity

## Product principle

The Dashboard answers three questions immediately:

1. What is being built?
2. Is the Factory actually working?
3. Does anything require the Product Owner?

The Product Owner supplies intent and human-gate decisions. Routine branches, CI, retries, provider recovery and verification remain Factory responsibilities.

## Local development

```bash
npm install
npm run dev
```

For a production-like local run:

```bash
npm run build
FACTORY_CONTROL_URL=http://localhost:3001 FACTORY_CONTROL_TOKEN=... npm start
```

The Node server serves `dist/` and proxies same-origin Factory API calls.
