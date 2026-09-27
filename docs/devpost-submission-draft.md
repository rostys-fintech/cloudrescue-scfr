# Devpost submission draft — CloudRescue

## Project title
**CloudRescue**

## Tagline
**A visual stress lab for systemic cloud-outage resilience in banking.**

## One-sentence description
CloudRescue is an interactive, synthetic crisis simulator that shows what happens when multiple banks depend on the same critical cloud provider and need scarce backup capacity at the same time — then compares three recovery mechanisms under the same shock and reserve budget.

## Inspiration
Cloud resilience is often discussed institution by institution: does one bank have a backup plan, a second provider, or disaster-recovery capacity?

But third-party ICT concentration creates a system-level question. If many financial institutions depend on a limited set of critical providers, one disruption can create simultaneous recovery demand across multiple firms.

The real-world motivation is documented by BIS, EBA and the EU DORA framework. CloudRescue does **not** claim that the synthetic 20-bank network represents real institutions. Instead, it uses a transparent synthetic system to make the coordination problem visible and testable.

The central question is:

> If the total reserve budget stays the same, can better coordination improve systemic recovery?

## What it does
CloudRescue models a synthetic banking system with 20 stylized banks and three synthetic cloud providers.

A user can:

1. watch a guided audiovisual crisis story;
2. trigger a provider outage;
3. see simultaneous backup-capacity demand emerge;
4. compare three recovery mechanisms;
5. change emergency-market capacity, reserve size and SCFR allocation rules;
6. replay any Stress Lab configuration as an animated crisis;
7. inspect a before/after comparison under the **same reserve budget**;
8. explore a resilience sensitivity heatmap;
9. generate deterministic seeded scenarios;
10. copy a shareable scenario link that reconstructs the same assumptions;
11. export the scenario and model outputs as JSON;
12. try challenge missions focused on efficiency, scarcity and coordination.

## The three recovery mechanisms

### 1. Market Scramble
Affected banks source emergency capacity only after the outage. When many institutions need capacity at the same time, the immediately available market may be insufficient.

### 2. Individual Reserves
Capacity is reserved before the crisis, but it remains ring-fenced bank by bank. Some capacity can therefore remain stranded outside the institutions that need it.

### 3. SCFR Pooled Reserve
The same aggregate pre-reserved capacity is pooled and allocated across affected banks using an explicit rule.

The key comparison is deliberately constrained:

> **Same shock. Same reserve budget. Different coordination.**

## Why the visual story matters
My first versions of the project relied too heavily on dashboards and numbers. A non-specialist could see the outputs without necessarily understanding the mechanism.

I rebuilt the interface around a guided story:

- a shared provider fails;
- dependent banks are affected in sequence;
- emergency requests visibly flow toward scarce backup capacity;
- ring-fenced reserve tokens visibly hit a barrier and remain stranded;
- the same reserve tokens are then pooled through SCFR and redirected toward affected banks;
- the final scene compares bank-level recovery outcomes side by side.

The guided mode includes captions, optional browser narration, scene-specific pacing, focus mode and restrained incident/recovery sound cues.

## What makes the comparison fairer
Individual Reserves and SCFR receive the **same total reserve budget**.

The prototype therefore does not ask whether “more reserve” improves resilience. It asks whether a different allocation mechanism can use the **same aggregate reserve** more effectively.

The Before / After view makes this constraint visible and shows which part of the result comes from coordination rather than quantity.

## Reproducibility
CloudRescue is designed so the demo is not just a hard-coded animation.

The project includes:

- deterministic simulation logic;
- explicit synthetic bank data;
- deterministic seeded scenario generation;
- Scenario IDs;
- shareable URLs that reconstruct scenario assumptions;
- scenario JSON export;
- model-invariant tests;
- UI smoke checks;
- continuous checks through GitHub Actions.

The same input assumptions always reproduce the same output.

## Sensitivity Explorer
One scenario is not enough to understand a mechanism.

The Stress Lab includes a heatmap that recalculates outcomes across combinations of:

- emergency-market capacity; and
- pre-reserved capacity.

Users can switch between:

- **SCFR resilience**, and
- **SCFR uplift versus Individual Reserves**.

This makes it easier to see where coordination matters and where it adds little value.

## Challenge Mode
To make experimentation more engaging, CloudRescue includes three missions:

- **Efficiency** — reach high resilience while limiting the reserve budget;
- **Scarcity** — maintain recovery when emergency-market capacity is very low;
- **Coordination** — create a meaningful uplift over ring-fenced individual reserves.

Each mission exposes its criteria directly, so the user can see which constraint is binding.

## How I built it
CloudRescue is a static browser application built without a front-end framework.

The MVP uses:

- vanilla JavaScript;
- a separate deterministic simulation engine;
- synthetic bank/provider data;
- dynamic SVG network connections;
- animated DOM/SVG capacity flows;
- browser-native speech synthesis;
- scenario serialization through URL parameters and JSON;
- GitHub Pages;
- automated model and interface checks through GitHub Actions.

## Challenges I ran into
The hardest challenge was not implementing another feature. It was keeping the prototype **analytically honest while making it visually persuasive**.

Several problems forced redesigns:

- early versions were too text-heavy;
- some visual effects made the site look more like a gaming dashboard than a financial-risk tool;
- fixed autoplay timers could cut narration off mid-sentence;
- numerical outputs were understandable to me but not necessarily to a non-specialist;
- UI changes occasionally created regressions in story initialization.

I responded by:

- rebuilding the visual language around an institutional banking/fintech style;
- making narration completion drive scene changes;
- turning reserve fragmentation into visible movement and barriers;
- adding regression checks for the DOM interactions that had failed;
- separating observed real-world motivation from synthetic model assumptions;
- keeping the reserve budget constant in the core comparison.

## Accomplishments I am proud of
- translating a systemic-risk idea into explicit computational logic;
- separating the model engine from the interface;
- making an abstract allocation mechanism visible through motion rather than only numbers;
- replaying any interactive Stress Lab scenario as a narrated crisis;
- creating deterministic seeded scenarios and shareable scenario links;
- adding sensitivity analysis rather than relying on one headline result;
- building automated invariants and interface checks;
- making the synthetic/empirical boundary explicit in the product itself.

## What I learned
My background is finance and banking rather than software engineering.

During FirstCommit I learned how to move from:

**financial-stability question → explicit assumptions → deterministic model → interactive visualization → reproducibility → testing → deployment**

More specifically, I learned how to:

- turn a policy concept into computational rules;
- structure deterministic allocation logic;
- reason about invariants and edge cases;
- design dynamic SVG/DOM visualizations;
- debug state and timing problems in an interactive browser application;
- synchronize narration with visual state;
- build reproducible scenario links;
- use GitHub Actions to catch regressions;
- communicate a technical research concept to non-specialists.

## What is real — and what is synthetic

### Observed real-world motivation
- third-party ICT concentration risk;
- dependence on critical external technology and cloud providers;
- operational-resilience concerns documented by regulators.

### Synthetic in CloudRescue v0.1
- the 20-bank network;
- provider assignments;
- workload and readiness values;
- capacity units;
- resilience scores;
- numerical improvements shown by the simulation.

CloudRescue v0.1 is therefore an **illustrative mechanism stress-test**, not a forecast and not an assessment of any real bank or cloud provider.

## What is next
The next research stages would be:

1. broader sensitivity and uncertainty analysis;
2. additional outage and multi-provider dependency structures;
3. cost-aware reserve optimization;
4. empirical calibration where public evidence is defensible;
5. expert validation with operational-resilience and cloud-infrastructure practitioners;
6. governance, liability and incentive design for a pooled mechanism.

The long-term goal is for CloudRescue to become a reproducible research companion for the broader SCFR concept.

## AI assistance disclosure
AI tools assisted with brainstorming, code drafting, debugging, documentation and interface iteration.

I remained responsible for the research framing, assumptions, interpretation, model guardrails, testing decisions, feature selection and final submission.
