# LovHack judging map — Resilience Atlas

This document maps the current product to the four areas that matter most for the submission.

## 1. Execution & Functionality

### Strong evidence

- Fully deployed working prototype on GitHub Pages.
- Deterministic simulation engine separated from interface code.
- Three recovery mechanisms under one shared shock.
- Interactive Scenario Lab.
- Model-driven scenario playback.
- Narrated six-scene simulation with synchronized visual cues.
- Responsive mobile layout.
- iOS-specific touch and audio fixes.
- Readable report and JSON export.
- Automated model and UI regression checks.
- GitHub Actions.

### What judges should see

1. Run Guided Simulation.
2. Open Scenario Lab.
3. Change the failed provider or capacity assumptions.
4. Run the scenario.
5. Show the resulting capacity gap / recovery conclusion.
6. Export the scenario only if time allows.

### Technical point to emphasize

The core comparison holds the **aggregate reserve budget constant** between Individual Reserves and SCFR.

The product is not a prerecorded animation. The visuals consume the same underlying model state as the interactive controls.

---

## 2. Problem & Impact

### Problem

A bank can have a credible individual failover plan while the system still faces a shortage if many banks depend on the same external provider and request recovery capacity simultaneously.

That is a **correlated recovery-demand problem**.

### Why it matters

The concept is relevant to:
- operational-resilience teams;
- technology-risk teams;
- supervisors;
- financial-stability researchers.

### Impact framing

Do not claim that the prototype proves SCFR should be implemented.

Use:

> Resilience Atlas makes a documented concentration-risk problem visible and provides a transparent sandbox for exploring one possible coordination mechanism.

---

## 3. Innovation

The strongest innovation is not the globe animation.

It is the **controlled mechanism comparison**:

- same outage;
- same aggregate reserve budget;
- different allocation structure.

Individual Reserves can leave capacity stranded at unaffected institutions. SCFR allows the same aggregate reserve to be redirected to affected banks.

This isolates the value of **coordination**, rather than simply giving one strategy more resources.

Best line:

> **Same shock. Same reserve budget. Different coordination.**

---

## 4. Presentation & UX

### Current strengths

- six-scene mechanism-first story;
- synchronized neural narration;
- dark high-tech simulation view;
- light analysis mode;
- mobile-safe navigation and controls;
- concise visual readouts;
- explicit “synthetic, not a forecast” boundary.

### Judge flow

A judge should understand the project in this order:

1. shared dependency;
2. common provider failure;
3. simultaneous recovery demand;
4. ring-fenced reserve;
5. pooled reserve;
6. outcome comparison;
7. change assumptions in Scenario Lab;
8. show evidence boundary.

Do not start with equations or source files.

---

# Biggest submission risks

1. **Overclaiming** — never present synthetic outputs as real-world estimates.
2. **Feature drift** — describe only features that are actually live.
3. **Too much explanation** — the video must show product behavior.
4. **Weak user framing** — explicitly name bank risk teams, supervisors and researchers.
5. **Unclear novelty** — repeat that the comparison isolates coordination under the same reserve budget.
