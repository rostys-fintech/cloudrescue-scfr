# CloudRescue — Devpost final copy

## Project title
**CloudRescue**

## Tagline
**A systemic cloud-resilience stress lab for shared-provider shocks in banking.**

## One-line description
CloudRescue is a synthetic, reproducible stress-test that shows how a shared cloud outage can create system-wide recovery demand — and whether coordinated reserve allocation can improve recovery without increasing the reserve budget.

## Live links
**Live prototype:** https://rostys-fintech.github.io/cloudrescue-scfr/

**GitHub:** https://github.com/rostys-fintech/cloudrescue-scfr

**Demo video:** [ADD FINAL VIDEO LINK]

---

## Inspiration

Financial institutions increasingly depend on a limited set of critical ICT and cloud providers. That creates a systemic operational-resilience problem: a backup plan can work for one institution and still fail at the system level if many institutions need the same backup capacity at the same time.

That problem is reflected in public work from BIS, DORA-related oversight and the EBA.

CloudRescue started from one question:

> **If the total reserve budget stays fixed, can better coordination improve systemic recovery after a shared-provider outage?**

The prototype does not claim to model any real bank or cloud provider. It uses a transparent synthetic system to make the coordination problem visible and testable.

---

## What it does

CloudRescue models a synthetic banking system with:

- **20 stylized banks**
- **3 shared cloud providers**
- **3 recovery mechanisms**

A user can trigger a shared-provider outage and compare:

### Post-shock Market Sourcing
Affected banks seek emergency capacity only after the outage.

### Individual Reserves
Capacity is reserved before the crisis but remains ring-fenced institution by institution.

### SCFR Pooled Reserve
The same aggregate reserve budget is pooled and allocated across affected institutions using an explicit rule.

The central comparison is deliberately controlled:

> **Same shock. Same reserve budget. Different coordination.**

CloudRescue then measures:
- Systemic Resilience Score;
- critical workload restored;
- number of banks recovering at least 80%;
- unmet capacity demand;
- stranded reserve capacity.

---

## Guided Crisis Replay

The project includes a narrated six-stage crisis replay designed for non-specialists.

It shows:

1. shared provider dependency;
2. one provider outage;
3. simultaneous backup-capacity requests;
4. reserve fragmentation under institution-specific reserves;
5. pooled SCFR allocation using the same reserve budget;
6. final recovery comparison.

The live-system view is model-driven rather than prerecorded. Any Stress Lab scenario can be replayed through the same guided story.

---

## Stress Lab

The interactive Stress Lab lets users change:

- failed provider;
- emergency-market capacity;
- pre-reserved capacity;
- SCFR allocation rule.

Results recompute immediately.

The lab also includes:

- deterministic Scenario IDs;
- seeded scenario generation;
- shareable scenario links;
- JSON export;
- replay of the current scenario;
- controlled Controlled Comparison comparison;
- resilience frontier;
- sensitivity explorer;
- explicit constraint tests.

---

## Controlled Comparison

This is the core experiment in CloudRescue.

Individual Reserves and SCFR receive exactly the same aggregate pre-reserved capacity.

The only intended difference is the allocation mechanism.

That allows the prototype to ask a narrower question:

> Does pooled allocation reduce stranded capacity and improve system-level recovery under the same resource budget?

The interface displays the failed provider, affected-bank count, emergency-market assumption and reserve budget directly above the comparison so the experiment is self-explanatory.

---

## Sensitivity and reproducibility

One scenario is not enough to evaluate a mechanism.

CloudRescue therefore recalculates outcomes over combinations of:

- emergency-market capacity;
- pre-reserved capacity.

Users can inspect either:

- absolute SCFR resilience; or
- SCFR uplift versus Individual Reserves.

The prototype is deterministic: the same assumptions reproduce the same result.

Seeded scenarios and shareable URLs make those assumptions portable between users.

---

## How I built it

CloudRescue is a static browser application built with:

- HTML5;
- CSS3;
- Vanilla JavaScript;
- ES modules;
- SVG;
- Web Speech API;
- Web Animations API;
- URLSearchParams;
- JSON / Blob export;
- Node.js checks;
- GitHub Actions;
- GitHub Pages.

The simulation engine is separated from the interface.

The project does not require a front-end framework or backend for the MVP.

---

## Technical design

The model follows this sequence:

**Synthetic bank network → Provider outage → Capacity allocation → Recovery engine → Systemic Resilience Score**

Recovery is limited by both allocated capacity and synthetic failover readiness.

The headline metric is:

**SRS = Σ(wᵢ × rᵢ) / Σ(wᵢ) × 100**

where:
- **wᵢ** combines synthetic critical workload and stylized systemic importance;
- **rᵢ** is the restored fraction after capacity allocation and readiness constraints.

SRS is an internal synthetic research metric, not a regulatory standard.

---

## What is real — and what is synthetic

### Real-world motivation
- third-party ICT concentration;
- reliance on critical external providers;
- operational-resilience risk.

### Synthetic in CloudRescue v0.1
- the 20-bank network;
- provider assignments;
- critical workloads;
- readiness values;
- systemic weights;
- capacity units;
- all numerical resilience outputs.

The product makes this distinction visible directly in the Methodology section.

CloudRescue v0.1 is a mechanism stress-test, not a forecast and not an assessment of any real institution.

---

## Challenges I ran into

The hardest part was not adding features. It was making the model both analytically honest and understandable to someone who does not already know the topic.

Early versions had several problems:

- too many numbers without a clear mechanism;
- an interface that looked more like a hackathon dashboard than an institutional risk tool;
- narration that could be interrupted by fixed scene timing;
- reserve fragmentation that was described but not visually obvious;
- UI changes that occasionally broke multi-element DOM interactions.

I addressed those problems by:

- rebuilding the visual language around an institutional fintech / risk-intelligence style;
- turning the guided mode into a dark live-system monitoring canvas;
- making reserve movement and ring-fencing visible;
- synchronizing scene changes to narration completion;
- separating observed evidence from synthetic assumptions;
- adding model invariants and UI smoke checks;
- keeping the reserve budget fixed in the central comparison.

---

## Accomplishments I am proud of

- translating a systemic-risk question into deterministic simulation logic;
- separating the model engine from the interface;
- making reserve fragmentation visible rather than only describing it;
- replaying any Stress Lab scenario through the guided story;
- building seeded and shareable reproducible scenarios;
- adding sensitivity analysis instead of relying on one headline result;
- implementing automated model and interface checks;
- deploying a complete public research prototype;
- creating an interface that now communicates like a risk-intelligence product rather than a generic dashboard.

---

## What I learned

My background is finance and banking rather than software engineering.

During FirstCommit I learned how to move from:

**financial-stability question → explicit assumptions → deterministic model → interactive visualization → reproducibility → testing → deployment**

More specifically, I learned how to:

- translate a policy concept into computational rules;
- reason about model invariants and edge cases;
- separate simulation logic from presentation logic;
- build dynamic SVG and DOM visualizations;
- manage state and timing in an interactive browser application;
- synchronize narration with visual state;
- serialize reproducible scenarios into URLs;
- use GitHub Actions to catch regressions;
- design a technical concept for non-specialist users.

---

## What is next

Possible research extensions include:

1. broader uncertainty analysis;
2. multi-provider and correlated outage structures;
3. cost-aware reserve optimization;
4. workload portability constraints;
5. recovery-time objectives;
6. empirical calibration where defensible public evidence exists;
7. expert validation with operational-resilience practitioners;
8. governance and incentive design for pooled capacity.

The long-term goal is for CloudRescue to evolve from a hackathon MVP into a reproducible research companion for systemic cloud-resilience analysis.

---

## AI assistance disclosure

AI tools materially assisted with brainstorming, code drafting, debugging, documentation and interface iteration.

I remained responsible for the research framing, assumptions, interpretation, model guardrails, feature selection, testing decisions and final submission.

I can explain the simulation logic, assumptions, limitations and technical design used in the final project.
