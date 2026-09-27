# CloudRescue — SCFR Stress Lab

**Can a banking system survive a shared cloud outage?**

CloudRescue is an interactive, browser-based systemic cloud resilience simulator for banking. It turns the **Systemic Cloud Failover Reserve (SCFR)** research concept into a working, visual prototype.

> **Status:** v0.1 hackathon MVP. All banks, cloud providers, workloads and resilience outputs are synthetic and illustrative. The prototype does not assess any real institution or predict real-world recovery outcomes.

## Why this project exists

Many banks can depend on the same small set of external cloud providers. A severe provider outage can therefore create a coordination problem: several banks may need backup infrastructure at the same time, while emergency capacity is scarce.

CloudRescue asks a narrow question:

> **Can pooling and pre-arranged allocation of backup cloud capacity improve systemic recovery without increasing the total reserve?**

The prototype compares three mechanisms under the same shock:

1. **Market Scramble** — affected banks source limited emergency capacity after the outage.
2. **Individual Reserves** — the system pre-reserves capacity, but it is ring-fenced bank by bank. Capacity reserved by unaffected banks can remain stranded.
3. **SCFR Pooled Reserve** — the same total pre-reserved capacity is pooled and allocated across affected banks using a transparent rule.

## What the user can do

### Watch the Crisis
A six-scene animated explainer shows:

- a synthetic banking-cloud network in normal operation;
- a shared cloud provider outage;
- simultaneous demand for backup capacity;
- fragmentation under individual reserves;
- pooled allocation under SCFR;
- a transition from story mode into an interactive experiment.

### Stress Lab
The user can change:

- which synthetic provider fails;
- emergency spot-market capacity;
- total pre-reserved capacity;
- SCFR allocation rule.

The app recalculates:

- systemic resilience score;
- banks recovered;
- critical workloads restored;
- unmet capacity demand;
- unused/stranded reserve capacity;
- a resilience frontier showing how outcomes change as reserve capacity increases.

## Model logic

There are 20 synthetic banks. Each bank has:

- a primary cloud provider;
- critical workload demand (capacity units);
- failover readiness (0–1);
- systemic-importance weight.

For an affected bank *i*:

```text
capacity_ratio_i = min(allocated_capacity_i / critical_load_i, 1)
restored_fraction_i = capacity_ratio_i × readiness_i
```

The headline metric is a weighted systemic resilience score:

```text
SRS = Σ(w_i × restored_fraction_i) / Σ(w_i) × 100
where w_i = critical_load_i × systemic_importance_i
```

The same total reserve budget is used in the **Individual Reserves** and **SCFR** scenarios. The difference is whether reserve capacity is ring-fenced or pooled.

See [`research/methodology.md`](research/methodology.md) for detail.

## Evidence base

The real-world motivation is grounded in current BIS, EBA and EU DORA material on third-party ICT concentration and operational resilience. See [`research/evidence-base.md`](research/evidence-base.md).

The evidence base supports studying the problem; it does **not** validate the synthetic v0.1 numerical outputs.

## Research roadmap

- **v0.1 — FirstCommit MVP:** synthetic scenario engine + animated visual story.
- **v0.2 — Sensitivity analysis:** more shock types, allocation rules and robustness checks.
- **v0.3 — Empirical calibration:** public evidence on cloud concentration and operational resilience.
- **v1.0 — Research companion:** reproducible scenario analysis to accompany the SCFR research project.

## Run locally

No build step or external library is required.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Repository structure

```text
cloudrescue/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── banks.js
├── model/
│   └── simulation.js
├── research/
│   ├── methodology.md
│   └── assumptions.md
└── README.md
```

## Limitations

This is a conceptual simulation, not an empirical estimate. In particular:

- the banking network is synthetic;
- capacity units have no direct real-world unit in v0.1;
- failover readiness is stylized;
- market and reserve allocation rules are simplified;
- cloud migration feasibility, data portability, network dependencies, legal constraints and workload-specific recovery objectives are not yet modelled.

These are intentional boundaries for the MVP and become research extensions rather than hidden assumptions.

## AI assistance disclosure

AI tools were used as a development aid for brainstorming, code drafting, debugging, documentation and interface iteration. The project owner is responsible for the research concept, assumptions, interpretation, testing and final submission. AI-generated suggestions are reviewed before inclusion.

## Author

**Rostyslav Honcharenko**  
Finance & banking researcher interested in FinTech, digital finance and systemic resilience.
