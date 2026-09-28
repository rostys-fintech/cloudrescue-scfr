# Resilience Atlas — Systemic Cloud Resilience Lab

**What happens when many banks depend on the same cloud provider and need recovery capacity at the same time?**

Resilience Atlas is an interactive systemic cloud-resilience simulator for banking. It turns the **Systemic Cloud Failover Reserve (SCFR)** research concept into a working visual prototype.

> **Prototype boundary:** the banking network, provider assignments, workload values and numerical resilience outputs are synthetic and illustrative. The project does not assess any real bank or cloud provider and does not forecast real-world recovery.

## Live demo

**Prototype:** https://rostys-fintech.github.io/cloudrescue-scfr/  
**Repository:** https://github.com/rostys-fintech/cloudrescue-scfr

## The core experiment

A shared cloud-provider outage can create a coordination problem: several banks may need backup capacity simultaneously while immediate market capacity is limited.

Resilience Atlas compares three recovery mechanisms under the same shock:

1. **Post-shock Market Sourcing** — affected banks seek limited emergency capacity after the outage.
2. **Individual Reserves** — capacity is pre-arranged but ring-fenced bank by bank, so unused capacity can remain stranded.
3. **SCFR Pooled Reserve** — the same aggregate reserve budget is pooled and allocated across affected banks using a transparent rule.

The key comparison is:

> **Same shock. Same reserve budget. Different coordination.**

The project asks a deliberately narrow question:

> **Can coordination make the same reserve budget work better during a shared-provider outage?**

## What judges can actually use

### Guided Simulation

A six-scene narrated simulation explains:

1. a stable shared-provider dependency network;
2. a shared-provider failure;
3. simultaneous recovery demand;
4. reserve capacity stranded by ring-fencing;
5. pooled SCFR reallocation;
6. recovery outcomes across the three mechanisms.

The story uses the same deterministic model as the interactive lab. Word-level narration cues drive the visual timeline, with mobile-safe controls and a responsive layout.

### Scenario Lab

Users can change:

- which synthetic provider fails;
- immediate market capacity;
- total pre-reserved capacity;
- SCFR allocation rule.

The model recalculates:

- affected banks;
- total recovery demand;
- allocated recovery capacity;
- capacity gap;
- critical workload restored;
- stranded reserve under Individual Reserves;
- weighted Systemic Resilience Score.

The lab includes model-driven scenario playback and a concise scenario conclusion.

### Model & Evidence

The evidence view separates:

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

The current scenario can be exported as:
- a readable report;
- JSON for reproducibility.

## Model logic

Each synthetic bank has:
- a primary cloud provider;
- critical workload demand;
- failover readiness;
- a stylized systemic-importance weight.

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

See `research/methodology.md` for detail.

## Why this matters

Operational resilience is often discussed institution by institution. Shared infrastructure can create **correlated recovery demand** across multiple institutions at once.

Resilience Atlas makes that system-level coordination problem visible and testable without pretending that a synthetic prototype is empirical evidence.

Potential users of the concept include:
- bank operational-resilience and technology-risk teams;
- supervisors and financial-stability researchers;
- researchers studying third-party ICT concentration and coordinated recovery.

## Current product strengths

- deterministic simulation engine separated from presentation;
- three explicit recovery mechanisms;
- SVG dependency network and recovery flows;
- narrated six-scene guided simulation;
- interactive Scenario Lab;
- transparent real-vs-synthetic evidence boundary;
- readable and JSON scenario exports;
- responsive mobile experience;
- automated model and UI regression checks;
- GitHub Actions and public GitHub Pages deployment.

## Build journey

The project started from a finance and systemic-risk question rather than a software template.

During the current build, the work included:
- translating the SCFR concept into explicit allocation rules;
- separating model logic from interface logic;
- designing and rebuilding the product as **Resilience Atlas**;
- creating a synchronized narrated simulation;
- adding scenario controls and model-driven playback;
- building mobile-safe interaction and fixing iOS touch/audio issues;
- adding automated tests after real UI regressions;
- documenting assumptions, limitations and evidence boundaries.

The Git history preserves this iteration.

## Technologies

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

## Evidence base

The real-world motivation is informed by public operational-resilience material from:
- BIS / Financial Stability Institute;
- EU DORA oversight material;
- European Banking Authority risk reports.

See `research/evidence-base.md`.

These sources motivate the problem. They do **not** validate the synthetic numerical results or prove that SCFR would work in practice.

## Limitations

The current prototype does not yet model:
- workload portability constraints;
- provider-specific architectures;
- data synchronization;
- recovery-time objectives;
- network dependencies;
- legal and contractual constraints;
- cross-border governance;
- cost optimization;
- empirical calibration.

Those are research extensions, not hidden assumptions.

## AI assistance disclosure

AI tools materially assisted brainstorming, code drafting, debugging, documentation and interface iteration. The project author selected the research framing and assumptions, reviewed outputs, directed product decisions, tested the implementation and is responsible for the final prototype.

## Judge materials

Start with:
- `docs/START-HERE.md`
- `docs/judge-pitch-card.md`
- `docs/demo-script.md`
- `docs/judging-map.md`
- `docs/technical-defense.md`
- `docs/submission-checklist.md`
- `docs/development-log.md`

## Author

**Rostyslav Honcharenko**  
Finance & banking researcher interested in FinTech, digital finance and systemic resilience.
