# CloudRescue — Development Log

This log documents the main product and technical iterations completed during the FirstCommit build.

## Phase 1 — Research question → software problem

Starting point:

- systemic cloud concentration risk in banking;
- a proposed Systemic Cloud Failover Reserve (SCFR) concept;
- a need to make the coordination mechanism visible rather than only describing it in text.

Main learning:

- a research idea is not yet a software specification;
- the mechanism had to be translated into explicit state, inputs, allocation rules and outputs.

Result:

- synthetic 20-bank network;
- three shared providers;
- critical workload, readiness and systemic-importance parameters;
- deterministic recovery logic.

---

## Phase 2 — Deterministic simulation engine

The first technical goal was to separate model logic from presentation.

Implemented:

- provider outage selection;
- emergency-market capacity;
- individual reserves;
- pooled SCFR reserve;
- allocation rules;
- restored workload;
- Systemic Resilience Score;
- stranded reserve tracking.

Key design constraint:

**Individual Reserves and SCFR must receive the same aggregate reserve budget.**

This prevents the central comparison from becoming a simple 'more reserve produces better results' demonstration.

Learning:

- model invariants matter more than visual polish at the start;
- the interface should never be able to create a state that violates the model budget.

---

## Phase 3 — From dashboard to guided explanation

Early UI versions exposed the model but relied too heavily on numbers.

Problem:

- a non-specialist could see resilience scores without understanding why they changed.

Response:

- introduced a six-stage guided crisis replay;
- visualized provider dependency;
- visualized simultaneous demand;
- visualized reserve fragmentation;
- visualized pooled reallocation;
- added captions and narration.

Learning:

- mechanism-first explanation is more useful than metric-first explanation;
- motion should explain state transitions rather than exist as decoration.

---

## Phase 4 — Narration and timing

Problem:

- fixed autoplay timing could advance a scene before narration completed;
- some speech sounded unnatural or was interrupted.

Response:

- tied scene progression more closely to narration state;
- added narrator selection;
- added narration controls;
- added Focus View;
- reduced unnecessary motion effects.

Learning:

- audiovisual UX requires state synchronization, not only animation.

---

## Phase 5 — Reproducibility

The project needed to prove that the guided demo was not a hard-coded animation.

Added:

- interactive Stress Lab;
- model-driven replay of the current scenario;
- deterministic seeded scenario generator;
- Scenario IDs;
- shareable scenario URLs;
- JSON export.

Learning:

- a research prototype becomes much more credible when another user can reconstruct the same assumptions and result.

---

## Phase 6 — Sensitivity analysis

Problem:

- one baseline scenario could look cherry-picked.

Response:

- added a resilience frontier;
- added a two-dimensional Sensitivity Explorer;
- added SCFR absolute-resilience and uplift views;
- added current-scenario reference markers.

Learning:

- mechanism evaluation should expose where an effect appears and where it weakens.

---

## Phase 7 — Automated checks

Several UI changes created regressions, including multi-element selector mistakes.

Response:

- added model-invariant tests;
- added UI smoke checks;
- connected checks to GitHub Actions;
- treated failing checks as part of the build process rather than as optional cleanup.

Examples of protected properties:

- resilience stays within valid bounds;
- reserve allocation cannot exceed the budget;
- SCFR and Individual Reserves use the same aggregate reserve;
- affected banks correspond to the failed provider;
- important controls and explanatory sections remain present.

Learning:

- even a small browser prototype benefits from automated regression checks.

---

## Phase 8 — Visual redesign v1

Problem:

- the functional interface looked like a generic hackathon dashboard;
- too many rounded cards, pills, micro-labels and decorative effects reduced credibility.

Response:

- reduced shadow and radius;
- raised typography size;
- simplified hierarchy;
- introduced institutional navy / graphite / white palette;
- removed game-like wording and decorative animation.

Learning:

- a serious financial-risk concept needs a visual language consistent with the subject.

---

## Phase 9 — Institutional redesign v2

The first redesign was still too conservative.

Major changes:

- dark systemic-risk hero;
- shared-dependency topology preview;
- custom CloudRescue mark;
- dark live-system monitoring canvas;
- editorial crisis-replay rail;
- dark Stress Lab control rail;
- executive Shock Summary header;
- dark Controlled Comparison screen;
- report-style Methodology;
- report timelines for Development Journey and Research Roadmap;
- research-chart styling;
- compact evidence source rail;
- custom favicon and sharing metadata.

Learning:

- changing component styling is not enough when the overall page composition still communicates 'dashboard';
- visual hierarchy has to be redesigned at the page level.

---

## Phase 10 — Submission hardening

Prepared:

- final Devpost copy;
- Devpost field map;
- 3–5 minute demo script;
- screenshot plan;
- judge pitch card;
- technical-defense guide;
- judging-criteria map;
- final QA checklist;
- AI assistance disclosure;
- source and evidence documentation.

Learning:

- presentation is part of the product;
- judges should not have to discover the strongest evidence by accident.

---

## Current v0.1 status

CloudRescue now includes:

- deterministic synthetic simulation;
- guided narrated crisis replay;
- institutional monitoring UI;
- interactive Stress Lab;
- model-driven scenario replay;
- seeded reproducibility;
- shareable scenarios;
- JSON export;
- Controlled Comparison;
- resilience frontier;
- sensitivity explorer;
- constraint tests;
- automated model and UI checks;
- public GitHub Pages deployment;
- documented real-vs-synthetic boundary.

## Core lesson

> Building CloudRescue required moving from a finance question to explicit assumptions, then to a deterministic model, then to an understandable product, and finally to a reproducible and testable public prototype.

That development journey is the main FirstCommit learning story.