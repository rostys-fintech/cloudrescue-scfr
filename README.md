# CloudRescue — SCFR Stress Lab

**Can a banking system survive a shared cloud outage?**

CloudRescue is an interactive, browser-based systemic cloud resilience simulator for banking. It turns the **Systemic Cloud Failover Reserve (SCFR)** research concept into a working, visual prototype.

> **Status:** v0.1 hackathon MVP. All banks, cloud providers, workloads and resilience outputs are synthetic and illustrative. The prototype does not assess any real institution or predict real-world recovery outcomes.

## Dual visual modes

CloudRescue now supports two purpose-built interface modes:

- **CRISIS** — black/crimson cyber system console for outage replay and high-impact system states;
- **ANALYSIS** — white/electric-blue research console for analytical review and methodology.

The mode switch changes visual language only; the deterministic model and scenario results remain identical.

## Live demo

**GitHub Pages:** https://rostys-fintech.github.io/cloudrescue-scfr/

**Repository:** https://github.com/rostys-fintech/cloudrescue-scfr

## Submission kit

Judge-facing materials are kept in `docs/`:

- [START HERE — judge & submission guide](docs/START-HERE.md)

- [Final Devpost copy](docs/devpost-final-copy.md)
- [Devpost form map](docs/devpost-form-map.md)
- [3–5 minute demo script](docs/demo-script.md)
- [Screenshot plan](docs/screenshot-plan.md)
- [Judge pitch card](docs/judge-pitch-card.md)
- [Technical ownership pass](docs/technical-ownership-pass.md)
- [Model walkthrough](docs/model-walkthrough.md)
- [Technical defense / likely questions](docs/technical-defense.md)
- [Judging criteria map](docs/judging-map.md)
- [Final submission checklist](docs/submission-checklist.md)
- [Development log](docs/development-log.md)

## Why this project exists

Many banks can depend on the same small set of external cloud providers. A severe provider outage can therefore create a coordination problem: several banks may need backup infrastructure at the same time, while emergency capacity is scarce.

CloudRescue asks a narrow question:

> **Can pooling and pre-arranged allocation of backup cloud capacity improve systemic recovery without increasing the total reserve?**

The prototype compares three mechanisms under the same shock:

1. **Post-shock Market Sourcing** — affected banks source limited emergency capacity after the outage.
2. **Individual Reserves** — the system pre-reserves capacity, but it is ring-fenced bank by bank. Capacity reserved by unaffected banks can remain stranded.
3. **SCFR Pooled Reserve** — the same total pre-reserved capacity is pooled and allocated across affected banks using a transparent rule.

## What the user can do

### Watch the Crisis
A six-scene **guided audiovisual explainer** shows:

- a synthetic banking-cloud network in normal operation;
- a shared cloud provider outage;
- simultaneous demand for backup capacity;
- fragmentation under individual reserves;
- pooled allocation under SCFR;
- a transition from story mode into an interactive experiment.

The guided mode includes:
- plain-language subtitles;
- optional browser voice narration;
- restrained incident / recovery sound cues;
- animated shortage and reserve-fragmentation visuals;
- a presentation-focused view for judging or screen recording;
- keyboard scene navigation.

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

The Stress Lab also includes:

- **Replay scenario** — any live Stress Lab configuration can be handed back to the guided audiovisual story;
- a **Controlled Comparison** comparison that holds the reserve budget constant and changes only the allocation mechanism;
- a **Sensitivity Explorer** for SCFR resilience and uplift across reserve and emergency-market assumptions;
- a **seeded scenario generator** that deterministically creates a provider shock, market-capacity level, reserve budget and allocation rule;
- **shareable scenario links** that reconstruct the same assumptions for another user;
- three interactive **Constraint Tests** missions focused on efficiency, severe scarcity and coordination advantage;
- a reproducible JSON export of the full scenario and model outputs.

## What is real — and what is synthetic

**Observed real-world motivation**
- third-party ICT concentration risk;
- reliance on critical external technology and cloud providers;
- operational-resilience concerns documented by BIS, EBA and DORA.

**Synthetic in the v0.1 prototype**
- the 20-bank network;
- provider assignments;
- workload and readiness values;
- capacity units;
- all resilience scores and scenario outputs.

The distinction is shown directly in the interface so the prototype does not present synthetic results as empirical evidence.

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

## What I learned building it

CloudRescue started as a finance and systemic-risk question rather than a software idea. Building the FirstCommit MVP required me to learn how to translate that question into:

- a deterministic allocation model;
- explicit model assumptions and guardrails;
- interactive browser visualizations;
- audiovisual explanation for non-specialists;
- reproducible seeded scenarios and shareable links;
- automated model and interface checks;
- a deployable GitHub Pages research prototype.

AI tools were used as a development aid for brainstorming, code drafting, debugging and documentation. The project owner remains responsible for the research framing, assumptions, interpretation, testing decisions and final submission.

## Research roadmap

- **v0.1 — FirstCommit MVP:** synthetic scenario engine + guided audiovisual story + scenario replay + sensitivity explorer + reproducible seeded scenarios + constraint tests.
- **v0.2 — Sensitivity analysis:** more shock types, allocation rules and robustness checks.
- **v0.3 — Empirical calibration:** public evidence on cloud concentration and operational resilience.
- **v1.0 — Research companion:** reproducible scenario analysis to accompany the SCFR research project.

## Technologies used

- **HTML5** — semantic application structure.
- **CSS3** — responsive institutional UI, light/dark themes and motion design.
- **Vanilla JavaScript (ES modules)** — application state, scenario controls and guided story.
- **SVG** — provider-to-bank dependency connections and resilience-frontier visualization.
- **Web Speech API** — optional browser-native English narration.
- **Web Animations API** — moving request, reserve and recovery tokens.
- **URLSearchParams** — shareable deterministic scenario links.
- **Blob / JSON export** — reproducible scenario snapshots.
- **Node.js** — automated model and interface checks.
- **GitHub Actions** — continuous syntax, model-invariant and UI smoke checks.
- **GitHub Pages** — public deployment.

No external front-end framework, charting library or runtime API is required for the MVP.

## Credits and external resources

CloudRescue uses no third-party visual asset pack, commercial template or copied interface.

The real-world motivation is informed by public operational-resilience material from:

- **BIS / Financial Stability Institute** — cloud concentration and systemic implications:  
  https://www.bis.org/publications/fsi-insight-53-managing-cloud-risk-some-considerations-oversight-critical-cloud-service-providers-financial-sector
- **EU DORA Oversight / ESMA** — critical ICT third-party provider and concentration-risk oversight:  
  https://www.esma.europa.eu/dora-oversight
- **European Banking Authority, Risk Assessment Report 2026** — third-party ICT dependency and operational-resilience risk:  
  https://www.eba.europa.eu/publications-and-media/publications/risk-assessment-report-june-2026

These sources motivate the problem only. They do **not** validate CloudRescue's synthetic numerical outputs or the SCFR mechanism.

All interface icons used in the application are simple project-authored inline SVG shapes or text-based UI elements.

## Run locally

No build step or external library is required.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Repository structure

```text
cloudrescue-scfr/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── banks.js
├── model/
│   └── simulation.js
├── research/
│   ├── methodology.md
│   ├── assumptions.md
│   ├── evidence-base.md
│   └── validation-plan.md
├── tests/
│   ├── simulation.test.mjs
│   └── ui-smoke.test.mjs
├── docs/
│   ├── START-HERE.md
│   ├── devpost-submission-draft.md
│   ├── devpost-final-copy.md
│   ├── devpost-form-map.md
│   ├── demo-script.md
│   ├── screenshot-plan.md
│   ├── judge-pitch-card.md
│   ├── technical-ownership-pass.md
│   ├── model-walkthrough.md
│   ├── technical-defense.md
│   ├── judging-map.md
│   ├── development-log.md
│   └── submission-checklist.md
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
