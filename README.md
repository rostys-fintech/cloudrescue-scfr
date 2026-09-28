# Resilience Atlas — Systemic Cloud Resilience Lab

**An interactive research prototype for studying systemic cloud concentration and coordinated recovery in banking.**

Resilience Atlas turns the **Systemic Cloud Failover Reserve (SCFR)** concept into a working simulation. It asks what happens when several banks depend on the same cloud provider and need recovery capacity at the same time.

> **Research boundary:** the banking network, provider assignments, workload values and numerical resilience outputs are synthetic and illustrative. The prototype does not assess any real bank or cloud provider and does not forecast real-world recovery outcomes.

## Live prototype

**Demo:** https://rostys-fintech.github.io/cloudrescue-scfr/  
**Repository:** https://github.com/rostys-fintech/cloudrescue-scfr

## Research question

A shared cloud-provider outage can create correlated recovery demand across multiple institutions while immediately available market capacity is limited.

The prototype asks:

> **Can coordination make the same reserve budget work better during a shared-provider outage?**

It compares three recovery mechanisms under the same shock and the same aggregate reserve budget:

1. **Post-shock Market Sourcing** — affected banks seek limited emergency capacity after the outage.
2. **Individual Reserves** — capacity is pre-arranged but ring-fenced bank by bank.
3. **SCFR Pooled Reserve** — the same aggregate reserve budget is pooled and allocated across affected banks using a transparent rule.

The central comparison is:

> **Same shock. Same reserve budget. Different coordination.**

## What the prototype does

### Guided Simulation

A six-scene narrated simulation shows:

1. a stable shared-provider dependency network;
2. a shared-provider failure;
3. simultaneous recovery demand;
4. reserve capacity stranded by ring-fencing;
5. pooled SCFR reallocation;
6. recovery outcomes across the three mechanisms.

### Scenario Lab

Users can vary:

- which synthetic provider fails;
- immediate market capacity;
- total pre-reserved capacity;
- the SCFR allocation rule.

The model recalculates:

- affected banks;
- total recovery demand;
- allocated recovery capacity;
- capacity gap;
- critical workload restored;
- stranded reserve under Individual Reserves;
- a weighted Systemic Resilience Score.

### Model & Evidence

The evidence view clearly separates:

**Observed motivation**
- third-party ICT concentration risk;
- dependence on critical external technology providers;
- operational-resilience concerns documented in BIS, EBA and DORA-related material.

**Synthetic prototype assumptions**
- the 20-bank network;
- provider assignments;
- workloads;
- readiness values;
- systemic weights;
- all numerical outputs.

A **Robustness Sweep** reruns a local 3×3 grid around the selected market/reserve assumptions and reports the SCFR-vs-Individual resilience difference.

The current scenario can also be exported as a readable report or JSON.

## Model logic

Each synthetic bank has:

- a primary cloud provider;
- critical workload demand;
- failover readiness;
- a stylised systemic-importance weight.

For an affected bank *i*:

```text
capacity_ratio_i = min(allocated_capacity_i / critical_load_i, 1)
restored_fraction_i = capacity_ratio_i × readiness_i
```

The headline metric is:

```text
SRS = Σ(w_i × restored_fraction_i) / Σ(w_i) × 100
where w_i = critical_load_i × systemic_importance_i
```

The same aggregate pre-reserved capacity is used for **Individual Reserves** and **SCFR**. The intended difference is the allocation mechanism.

See [`research/methodology.md`](research/methodology.md) for the full methodological description.

## Why this matters

Operational resilience is often discussed institution by institution. Shared infrastructure can create a system-level coordination problem because several institutions may need scarce recovery capacity simultaneously.

Resilience Atlas makes that problem visible and testable without presenting a synthetic prototype as empirical evidence.

Potential users of the concept include:

- bank operational-resilience and technology-risk teams;
- supervisors and financial-stability researchers;
- researchers studying third-party ICT concentration and coordinated recovery.

## Evidence base

The real-world motivation is informed by public operational-resilience material from:

- BIS / Financial Stability Institute;
- EU DORA oversight material;
- European Banking Authority risk reports.

See [`research/evidence-base.md`](research/evidence-base.md).

These sources motivate the problem. They do **not** validate the synthetic numerical results or prove that SCFR would work in practice.

## Reproducibility

The simulation engine is deterministic and separated from presentation logic.

To run locally:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

To run the regression suite:

```bash
npm test
```

## Technology

- HTML5
- CSS3
- Vanilla JavaScript / ES modules
- SVG
- browser Audio API
- JSON / Blob export
- Node.js tests
- GitHub Actions
- GitHub Pages

No front-end framework or backend is required for the current prototype.

## Current limitations

The prototype does not yet model:

- workload portability constraints;
- provider-specific architectures;
- data synchronisation;
- recovery-time objectives;
- network dependencies;
- legal and contractual constraints;
- cross-border governance;
- cost optimisation;
- empirical calibration.

These are research extensions rather than hidden assumptions.

## Build history and competition disclosure

The research question and SCFR concept predated the current software build.

The present **Resilience Atlas** product — including the redesign, guided simulation, Scenario Lab, model/evidence experience, robustness sweep, mobile hardening, exports and regression coverage — was built and substantially developed during the LovHack Season 3 build window. The Git history preserves that iteration.

AI tools materially assisted brainstorming, code drafting, debugging, documentation and interface iteration. The project author selected the research framing and assumptions, reviewed outputs, directed product decisions, tested the implementation and is responsible for the final prototype.

For competition-specific material, see:

- [`docs/START-HERE.md`](docs/START-HERE.md)
- [`docs/judge-pitch-card.md`](docs/judge-pitch-card.md)
- [`docs/demo-script.md`](docs/demo-script.md)
- [`docs/judging-map.md`](docs/judging-map.md)
- [`docs/technical-defense.md`](docs/technical-defense.md)
- [`docs/submission-checklist.md`](docs/submission-checklist.md)
- [`docs/development-log.md`](docs/development-log.md)

## Author

**Rostyslav Honcharenko**  
Finance & banking researcher focused on financial stability, digital finance, FinTech and systemic resilience.

**LinkedIn:** https://www.linkedin.com/in/rostyslav-honcharenko/
