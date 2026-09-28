# Resilience Atlas — Devpost submission copy

## Project title
**Resilience Atlas**

## Tagline
**A systemic cloud-resilience simulator for shared-provider shocks in banking.**

## One-line description

Resilience Atlas is an interactive synthetic stress-test that shows how a shared cloud outage can create system-wide recovery demand — and whether coordinated reserve allocation can make the same recovery resources work better.

## Live links

**Prototype:** https://rostys-fintech.github.io/cloudrescue-scfr/  
**GitHub:** https://github.com/rostys-fintech/cloudrescue-scfr  
**Demo video:** [ADD FINAL VIDEO LINK]

## Inspiration

Financial institutions can depend on a limited set of critical ICT and cloud providers. That creates a systemic operational-resilience problem: a backup plan can work for one institution and still fail at the system level if many institutions need the same backup capacity at the same time.

Resilience Atlas started from one question:

> **If the aggregate reserve budget stays fixed, can better coordination improve systemic recovery after a shared-provider outage?**

The prototype does not model any real bank or cloud provider. It uses a transparent synthetic system to make the coordination problem visible and testable.

## What it does

Resilience Atlas models:
- 20 synthetic banks;
- 3 shared cloud providers;
- 3 recovery mechanisms.

It compares:

### Post-shock Market Sourcing
Affected banks seek limited emergency capacity after the outage.

### Individual Reserves
Capacity is reserved before the crisis but remains ring-fenced institution by institution.

### SCFR Pooled Reserve
The same aggregate reserve budget is pooled and allocated across affected institutions using an explicit rule.

The core comparison is:

> **Same shock. Same reserve budget. Different coordination.**

## Guided Simulation

A narrated six-scene simulation shows:
1. shared provider dependency;
2. provider failure;
3. simultaneous backup demand;
4. stranded reserve under ring-fencing;
5. pooled SCFR reallocation;
6. final recovery comparison.

The visuals are model-driven and synchronized to the narration.

## Scenario Lab

Users can change:
- failed provider;
- emergency-market capacity;
- pre-reserved capacity;
- SCFR allocation rule.

The deterministic engine recalculates:
- affected banks;
- recovery demand;
- capacity gap;
- critical workload restored;
- stranded reserve;
- Systemic Resilience Score.

Running a scenario produces a visual playback and a concise conclusion.

## Model & Evidence

The product explicitly separates:

**Documented real-world motivation**
- third-party ICT concentration;
- reliance on critical external providers;
- operational-resilience concerns.

**Synthetic prototype assumptions**
- network structure;
- provider assignments;
- workloads;
- failover readiness;
- systemic weights;
- all numerical results.

The current scenario can be exported as a readable report or JSON.

## How I built it

The current prototype uses:
- HTML5;
- CSS3;
- Vanilla JavaScript / ES modules;
- SVG;
- browser audio;
- JSON / Blob export;
- Node.js regression tests;
- GitHub Actions;
- GitHub Pages.

The simulation engine is separated from the interface.

## Technical design

For each affected synthetic bank:

**capacity ratio = min(allocated capacity / critical load, 1)**

**restored fraction = capacity ratio × failover readiness**

The headline Systemic Resilience Score is a weighted average of restored fractions.

Individual Reserves and SCFR use the same aggregate reserve budget; the intended difference is the allocation mechanism.

## Challenges

The difficult part was making the project both analytically honest and easy to understand.

Important iterations included:
- simplifying the mechanism story;
- redesigning the interface as Resilience Atlas;
- synchronizing narration with visual state;
- making ring-fencing and pooled recovery visible;
- separating observed evidence from synthetic assumptions;
- fixing iOS touch and audio behavior;
- adding automated regression checks after real interaction bugs.

## What I learned

My background is finance and banking rather than software engineering.

This project required moving from:

**systemic-risk question → explicit assumptions → deterministic model → interactive visualization → testing → deployment**

I learned how to:
- translate a policy concept into computational rules;
- separate model and UI logic;
- build dynamic SVG interfaces;
- coordinate narration and animation state;
- debug browser and mobile interaction;
- write model and UI regression checks;
- communicate model limitations clearly.

## What is next

Potential extensions include:
- broader uncertainty analysis;
- correlated multi-provider shocks;
- cost-aware reserve optimization;
- workload portability constraints;
- recovery-time objectives;
- empirical calibration where defensible;
- expert validation with operational-resilience practitioners;
- governance and incentive design for pooled capacity.

## AI assistance disclosure

AI tools materially assisted brainstorming, code drafting, debugging, documentation and interface iteration.

I selected the research framing and assumptions, directed product decisions, reviewed outputs, tested the implementation and am responsible for the final prototype.
