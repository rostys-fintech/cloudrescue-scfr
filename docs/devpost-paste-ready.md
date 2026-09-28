# Resilience Atlas — Devpost paste-ready package

## Project Name

Resilience Atlas

## Tagline

A systemic cloud-resilience simulator for shared-provider shocks in banking.

## Short Description

Resilience Atlas is an interactive synthetic stress-test that shows how a shared cloud outage can create system-wide recovery demand — and whether coordinated reserve allocation can make the same recovery resources work better.

## Research origin

Resilience Atlas grew out of my broader research on **what affects bank resilience and the role of digitalisation in it**.

I narrowed that broader topic to one operational-resilience question:

> **When several banks depend on shared cloud infrastructure, can better coordination of failover capacity improve system-level recovery without increasing the aggregate reserve budget?**

That question led to the SCFR concept and then to Resilience Atlas as a working synthetic stress-test.

The research framing and SCFR concept existed before LovHack; the current software product and its interactive implementation were built during the LovHack build period.

## What problem does it solve?

Financial institutions can depend on a limited set of critical ICT and cloud providers. That creates a system-level operational-resilience problem: a backup plan can work for one institution and still fail for the system if many institutions need the same recovery capacity at the same time.

Resilience Atlas makes that correlated recovery-demand problem visible and testable.

## Who is it for?

The prototype is designed for discussion by:

- bank operational-resilience teams;
- technology-risk teams;
- supervisors;
- financial-stability researchers.

## How does it work?

Resilience Atlas models 20 synthetic banks connected to three shared cloud providers.

It compares three recovery mechanisms:

**Post-shock Market Sourcing** — affected banks seek limited emergency capacity after the outage.

**Individual Reserves** — capacity is reserved before the crisis but remains ring-fenced institution by institution, so some reserve can remain stranded.

**SCFR Pooled Reserve** — the same aggregate reserve budget is pooled and allocated across affected institutions according to an explicit rule.

The central experiment is deliberately controlled:

**Same shock. Same reserve budget. Different coordination.**

The Guided Simulation explains the mechanism through six narrated scenes. Scenario Lab lets users change the failed provider, emergency-market capacity, prepared reserve and SCFR allocation rule. A model-driven scenario playback then recomputes the recovery result.

## What makes it different?

The main innovation is not simply visualizing a cloud outage. The prototype isolates a coordination problem.

Individual Reserves and SCFR receive the same aggregate reserve budget. The intended difference is whether unused prepared capacity remains institution-specific or can be redirected across affected banks.

A Robustness Sweep reruns the deterministic model across a local 3×3 grid around the current market and reserve assumptions. Each cell reports SCFR resilience minus Individual Reserve resilience under the same reserve budget, making it visible where coordination matters and where the effect weakens.

## What I built during LovHack Season 3

The research question and SCFR concept existed before LovHack.

During the September 26–October 4, 2026 build period, I turned that research direction into the current working Resilience Atlas product, including:

- the Resilience Atlas redesign and interface system;
- a six-scene narrated Guided Simulation;
- word-level narration / visual synchronization;
- smooth cue-transition logic;
- the interactive Scenario Lab;
- model-driven scenario playback and conclusion;
- the Model & Evidence experience;
- the controlled same-budget comparison;
- the Robustness Sweep;
- readable report and JSON exports;
- responsive mobile behavior;
- iOS touch and audio fixes;
- automated model and UI regression tests;
- GitHub Actions hardening;
- judge-facing documentation and submission media.

The Git history preserves that build sequence.

## What is real and what is synthetic?

The real-world motivation is documented third-party ICT concentration and operational-resilience risk.

The following are synthetic in Resilience Atlas v0.1:

- bank network;
- provider assignments;
- workloads;
- failover readiness;
- systemic weights;
- capacity units;
- all numerical resilience outputs.

This is a mechanism stress-test, not a forecast, not an assessment of real banks, and not empirical validation of SCFR.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript / ES modules
- SVG
- browser Audio API
- HeyGen-generated Viktor narration assets
- JSON / Blob export
- Node.js regression tests
- GitHub Actions
- GitHub Pages
- AI-assisted development tools

## Working Demo

https://rostys-fintech.github.io/cloudrescue-scfr/

## Source Code

https://github.com/rostys-fintech/cloudrescue-scfr

## Demo Video

https://youtu.be/k7S-aZvqKXQ

## AI Assistance Disclosure

AI tools materially assisted brainstorming, code drafting, debugging, documentation and interface iteration. I selected the research framing and assumptions, directed product decisions, reviewed outputs, tested the implementation and am responsible for understanding and presenting the final prototype.
