# Resilience Atlas — Development Log

This log records the main product and technical iterations behind the current prototype.

## Phase 1 — Research question → software problem

Starting point:
- systemic cloud concentration risk in banking;
- the SCFR coordination concept;
- a need to make a system-level recovery problem visible.

The first challenge was translating an abstract finance idea into:
- explicit inputs;
- allocation rules;
- state transitions;
- measurable outputs.

Result:
- synthetic 20-bank network;
- three providers;
- critical workload, readiness and systemic-importance parameters;
- deterministic recovery logic.

## Phase 2 — Controlled simulation engine

Implemented:
- provider-outage selection;
- emergency market capacity;
- Individual Reserves;
- pooled SCFR reserve;
- multiple SCFR allocation rules;
- restored workload;
- Systemic Resilience Score;
- stranded reserve tracking.

Key invariant:

> **Individual Reserves and SCFR receive the same aggregate reserve budget.**

This keeps the core experiment focused on coordination rather than simply adding more capacity.

## Phase 3 — From dashboard to mechanism story

Early versions exposed metrics without making the mechanism obvious.

The product was reorganized around a six-scene story:
1. stable shared dependency;
2. provider failure;
3. simultaneous demand;
4. ring-fenced reserve;
5. pooled reallocation;
6. outcome comparison.

Learning:
- mechanism-first explanation is stronger than metric-first explanation;
- motion should explain state changes.

## Phase 4 — Resilience Atlas redesign

The earlier interface looked too much like a generic hackathon dashboard.

The product was rebuilt around the **Resilience Atlas** identity:
- dark red/black simulation mode;
- light blue/white analysis mode;
- sharper high-tech geometry;
- stronger visual hierarchy;
- a global dependency map;
- a compact judge-friendly simulation HUD.

## Phase 5 — Narration + visual synchronization

The guided experience moved from generic timed animation to word-level cue synchronization.

Implemented:
- neural narration tracks;
- cue timestamps;
- scene-specific visual choreography;
- smooth transitions between cues;
- pause / stop controls;
- reduced-motion behavior.

Several iterations were required to eliminate hard scene resets and abrupt animation jumps.

## Phase 6 — Interactive Scenario Lab

The lab allows users to change:
- failed provider;
- market capacity;
- reserve budget;
- allocation rule.

Running the scenario produces:
- model-driven state changes;
- recovery playback;
- updated metrics;
- a concise scenario conclusion.

## Phase 7 — Evidence boundary and export

Added a dedicated Model & Evidence view that distinguishes:
- documented concentration-risk motivation;
- synthetic network and numerical outputs.

Added:
- readable scenario report export;
- JSON export.

## Phase 8 — Mobile and iOS hardening

The mobile version required real debugging rather than simple responsive CSS.

Issues fixed included:
- hidden layers intercepting touch events;
- iOS audio user-activation requirements;
- touch/click fallback behavior;
- querySelector/querySelectorAll regressions that broke initialization;
- mobile navigation and scenario controls.

## Phase 9 — Automated checks

The project now uses Node.js checks and GitHub Actions.

Regression coverage includes:
- model invariants;
- UI shell checks;
- mobile interaction;
- narration integration;
- guided cue timing;
- scenario playback;
- mobile Safari fixes;
- storyboard choreography.

Learning:

> Small browser prototypes still benefit from automated regression protection.

## Current v0.1 status

The current product includes:
- deterministic synthetic simulation;
- guided narrated six-scene story;
- Scenario Lab;
- three recovery mechanisms;
- same-budget Individual-vs-SCFR comparison;
- Model & Evidence view;
- readable + JSON export;
- mobile-safe interaction;
- automated model and UI checks;
- public GitHub Pages deployment.

## Core lesson

> The biggest step was not adding features. It was turning a finance question into explicit assumptions, then into a deterministic model, then into an understandable and testable product.
