# Resilience Atlas — final capture runbook

This file defines the exact screenshot states for the LovHack submission.

## Global capture settings

Use:
- desktop browser;
- 16:9 viewport;
- 1920×1080 if available;
- browser zoom 90–100%;
- dark theme for Simulation and Scenario Lab;
- current Resilience Atlas build only;
- no bookmarks bar, notifications or unrelated tabs.

Use the baseline scenario unless another state is specified:

- failed provider: **Blue Cloud**
- emergency market: **20%**
- prepared reserve: **25%**
- SCFR rule: **Systemic priority**

Do not crop so tightly that the judge cannot tell which product section is being shown.

---

## Capture 01 — Product identity

### State
Simulation · Scene 01 · before pressing Run.

### Must show
- Resilience Atlas brand;
- Guided Simulation rail;
- global system map;
- 20 banks / 3 providers;
- Run Guided Simulation button.

### Caption
**Resilience Atlas turns shared-provider concentration risk into an interactive systemic recovery simulation.**

### Purpose
First impression / product identity.

---

## Capture 02 — Shared-provider failure

### State
Simulation · Scene 02 / Provider failure.

### Must show
- failed provider;
- affected banks;
- dark crisis state;
- scene/cue label.

### Caption
**A shared-provider outage creates correlated exposure across multiple synthetic banks.**

### Purpose
Problem / impact.

---

## Capture 03 — Stranded reserve

### State
Simulation · Scene 04 / Stranded reserve.

### Must show
- affected banks still under stress;
- individual reserve state;
- ring-fencing / stranded-capacity visual;
- current scene label.

### Caption
**Reserve capacity can exist in the system and still be unusable when it is ring-fenced institution by institution.**

### Purpose
Explain the coordination problem visually.

---

## Capture 04 — Pooled SCFR recovery

### State
Simulation · Scene 05 / Pooled recovery.

### Must show
- pooled SCFR state;
- reserve moving toward affected banks;
- recovery visual.

### Caption
**SCFR changes the allocation mechanism, not the aggregate reserve budget.**

### Purpose
Explain the proposed mechanism.

---

## Capture 05 — Controlled comparison

### State
Scenario Lab · baseline scenario.

Scroll so the following are visible together if possible:
- COMPARE RECOVERY MODELS;
- **Same shock. Same reserve budget. Different coordination.**
- CONTROLLED TEST callout;
- Market / Individual / SCFR cards.

### Caption
**The central experiment holds the shock and aggregate reserve budget constant and changes only how reserve capacity is coordinated.**

### Purpose
Strongest analytical competition screenshot.

---

## Capture 06 — Interactive Scenario Lab

### State
Scenario Lab with the controls visible.

Recommended changed scenario for this screenshot:
- Orange Cloud;
- market 15%;
- reserve 30%;
- Systemic priority.

Do not use this changed scenario for the controlled-comparison screenshot unless the layout looks materially better.

### Must show
- provider selector;
- market and reserve controls;
- allocation rule;
- Run Scenario;
- system map / outcome metrics if they fit.

### Caption
**Judges can change the shock and recovery assumptions and rerun the same deterministic model.**

### Purpose
Execution & Functionality.

---

## Capture 07 — Robustness Sweep

### State
Model & Evidence · baseline scenario.

Scroll to:
**ROBUSTNESS SWEEP — Does coordination only help in one chosen scenario?**

### Must show
- Positive Uplift;
- Max Uplift;
- Current Shock;
- entire 3×3 matrix;
- CURRENT cell marker;
- synthetic diagnostic boundary.

### Caption
**A local 3×3 sweep reruns the model across nearby assumptions instead of relying on one hand-picked baseline.**

### Purpose
Technical depth / robustness.

---

## Capture 08 — Evidence + users

### State
Model & Evidence · top of page.

### Must show
- REAL-WORLD MOTIVATION;
- SYNTHETIC MODEL;
- BUILT FOR DISCUSSION BY;
- Bank resilience teams;
- Supervisors;
- Researchers.

### Caption
**The product separates documented concentration-risk motivation from synthetic model outputs and makes its intended users explicit.**

### Purpose
Impact + research integrity.

---

## Optional Capture 09 — Mobile

Use a real phone or responsive browser.

### State
Simulation or Scenario Lab.

### Must show
- bottom mobile navigation;
- no clipped controls;
- current map / main action.

### Caption
**The prototype remains usable on mobile, including navigation and guided playback.**

### Purpose
Polish / execution proof.

---

# Devpost image order

Upload in this order:

1. Controlled comparison
2. Product identity
3. Shared-provider failure
4. Stranded reserve
5. Pooled SCFR recovery
6. Scenario Lab
7. Robustness Sweep
8. Evidence + users
9. Mobile (optional)

Why this order:

The first screenshot should communicate the project's **analytical novelty**, not only its visual identity.

---

# Reject a screenshot if

Do not use it if:
- text is clipped;
- the mobile nav covers content;
- a tooltip or browser popup is visible;
- narration HUD covers the main analytical result;
- the current scenario and caption contradict one another;
- synthetic outputs could be mistaken for real-bank estimates;
- the screenshot comes from an older CloudRescue interface;
- the image is so tightly cropped that product context is lost.

---

# Final rule

The screenshot set should tell the story without reading the full Devpost description:

**shared dependency → common shock → stranded capacity → pooled coordination → controlled comparison → interactive proof → robustness → evidence boundary.**
