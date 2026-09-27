# Devpost submission draft — CloudRescue

## Project title
**CloudRescue**

## Tagline
**Stress-testing how banks recover from a shared cloud outage.**

## One-sentence description
CloudRescue is an interactive crisis simulator that lets users watch a synthetic banking cloud outage unfold, then compare an uncoordinated market scramble, ring-fenced individual reserves, and a pooled Systemic Cloud Failover Reserve (SCFR).

## Inspiration
Cloud resilience is often treated as an institution-by-institution problem. But if many banks depend on the same provider, a severe outage can create a second-order problem: several institutions may need scarce backup capacity at the same time.

I wanted to make that coordination problem visible, interactive and testable.

## What it does
CloudRescue models a synthetic system of 20 banks connected to three synthetic cloud providers.

When one provider fails, the app:
1. identifies affected banks;
2. calculates their simultaneous critical-workload demand;
3. allocates scarce emergency capacity under three mechanisms;
4. compares systemic outcomes;
5. lets the user change reserve size, spot-market capacity and allocation rules.

The three recovery mechanisms are:

- **Market Scramble** — banks source limited emergency capacity only after the outage.
- **Individual Reserves** — capacity is pre-reserved, but ring-fenced bank by bank.
- **SCFR Pooled Reserve** — the same total pre-reserved capacity is pooled and reallocated across affected banks.

The interface combines an animated crisis story with an interactive Stress Lab and a resilience-frontier visualization.

## What makes the comparison fairer
The Individual Reserves and SCFR scenarios use the **same total reserve budget**.

The difference is allocation, not quantity.

That means the prototype asks a more interesting question than “does more backup capacity help?”:

> Can coordination and pooling improve systemic recovery using the same aggregate reserve?

## How I built it
The project is a static browser application with:
- deterministic synthetic bank data;
- a separate simulation engine;
- explicit allocation rules;
- automated model invariants;
- continuous tests through GitHub Actions;
- dynamic SVG visualization;
- downloadable scenario results for reproducibility.

No external framework is required for the MVP.

## Challenges I ran into
The hardest part was avoiding a demo that was visually persuasive but analytically weak.

I therefore added several guardrails:
- all institutions are synthetic;
- outputs are explicitly labelled illustrative;
- reserve budgets are held equal in the core comparison;
- assumptions are documented;
- the simulation has automated invariant tests;
- the UI exposes the mechanism rather than hiding it.

## Accomplishments I am proud of
- translating a finance/systemic-risk idea into explicit software logic;
- building a visual story that explains the crisis before asking the user to change assumptions;
- separating the research engine from the interface;
- making scenarios exportable rather than leaving results trapped inside the dashboard;
- creating a prototype that can continue beyond the hackathon as a research companion.

## What I learned
My background is finance and banking rather than software engineering. Building CloudRescue taught me how to:
- turn a policy concept into explicit computational assumptions;
- structure deterministic simulation logic;
- test model invariants;
- design an interactive data story;
- build a reproducible public research prototype.

## What is next
The FirstCommit version is **v0.1**.

Planned research extensions include:
- richer outage types;
- multi-cloud and geographic dependencies;
- sensitivity and uncertainty analysis;
- cost-aware reserve optimization;
- empirical calibration using public operational-resilience evidence;
- a reproducible research companion for the broader SCFR project.

## Important limitation
CloudRescue v0.1 is a **synthetic illustrative stress-test**. It does not evaluate any real bank or provider and does not claim that SCFR would produce a specific real-world improvement.

## AI assistance disclosure
AI tools assisted with brainstorming, code drafting, debugging, documentation and interface iteration. I reviewed the assumptions, research logic, outputs and final project decisions and disclose this assistance as part of the submission.
