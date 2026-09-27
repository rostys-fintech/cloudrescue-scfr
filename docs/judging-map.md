# FirstCommit judging map — CloudRescue

Official event criteria (checked on the FirstCommit Devpost page):

- **Learning & Growth — 30%**
- **Creativity & Impact — 25%**
- **Technical Execution — 25%**
- **Presentation & Communication — 20%**

This document maps CloudRescue features to those criteria so the submission does not rely on judges discovering the strongest evidence by accident.

Official event page:
https://firstcommit.devpost.com/

---

## 1. Learning & Growth — 30%

### Strongest evidence already in the project

- Started from a finance/systemic-risk question rather than a software template.
- Translated an abstract policy mechanism into explicit computational assumptions.
- Built a deterministic simulation engine.
- Learned stateful browser interaction and SVG/DOM visualization.
- Added browser narration and solved timing problems where scenes could advance before narration finished.
- Added regression tests after UI selector bugs broke interaction.
- Added seeded scenarios, share links and reproducible JSON export.
- Added a visible Development Journey section.
- Added an explicit AI-assistance disclosure and ownership statement.

### What the video must show

Show **Development Journey · FirstCommit** near the end.

Say clearly:

> My background is finance and banking. During FirstCommit I learned how to turn a systemic-risk question into a deterministic model, an interactive browser application, reproducible scenarios and automated checks.

### Risk to avoid

Do not let the submission look like a pre-existing research project that merely received a website.

The narrative should emphasize the software-development learning journey that happened during the hackathon.

---

## 2. Creativity & Impact — 25%

### Strongest evidence

- System-level framing of cloud resilience rather than institution-by-institution backup planning.
- SCFR as a pooled, pre-arranged coordination mechanism.
- Visual explanation of stranded reserve capacity.
- Same-shock / same-reserve-budget comparison.
- Guided audiovisual crisis replay.
- Stress Lab that lets a non-specialist manipulate the mechanism.

### What the video must show

The strongest creative sequence is:

**Provider outage → simultaneous demand → stranded reserve → same reserve pooled → improved recovery**

Use the line:

> Same shock. Same reserve budget. Different coordination.

### Impact framing

Do not claim that SCFR has been empirically validated.

The meaningful contribution is:

> CloudRescue makes a real concentration-risk problem visible and provides a transparent sandbox for testing one possible coordination mechanism.

---

## 3. Technical Execution — 25%

### Strongest evidence

- Separate deterministic simulation engine.
- Three explicit allocation mechanisms.
- Dynamic SVG dependency network.
- Animated capacity and reserve movement.
- Web Speech API narration.
- Replay of any Stress Lab scenario.
- Seeded deterministic scenarios.
- Shareable URL serialization.
- JSON export.
- Sensitivity heatmap.
- Automated model invariants.
- Automated UI smoke checks.
- GitHub Actions.
- GitHub Pages deployment.
- No external front-end framework required.

### What the video must show

Do not spend time opening source files line by line.

Instead prove execution through product behavior:

1. change assumptions;
2. replay the changed scenario;
3. generate a seed;
4. show Scenario ID;
5. copy/open a share link;
6. show Sensitivity Explorer;
7. briefly show green GitHub Actions checks.

### Technical explanation to be ready for

Be able to explain:

- how market capacity is calculated;
- how Individual Reserves differ from SCFR;
- how failover readiness limits recovery;
- how the Systemic Resilience Score is calculated;
- why the same reserve budget is used in both reserve mechanisms;
- how deterministic seed generation works;
- what the automated tests verify.

---

## 4. Presentation & Communication — 20%

### Strongest evidence

- Guided audiovisual demo.
- Captions.
- Narration synchronized to speech completion.
- Focus View.
- Six-stage crisis journey.
- Controlled Comparison mechanism comparison.
- Real vs Synthetic transparency block.
- Methodology architecture view.
- Consistent light/dark institutional interface.
- Dedicated demo script and screenshot plan.

### Video priority

A judge should understand the project before seeing the Stress Lab controls.

Order:

1. problem;
2. guided crisis;
3. same-budget comparison;
4. interactive proof;
5. reproducibility;
6. methodology;
7. learning journey.

### Presentation risk

Avoid narrating every metric.

The interface contains details for inspection; the video should communicate the story.

---

# Prize-category positioning

## Champion

CloudRescue needs to show the combined story:

**original problem framing + working product + technical understanding + visible learning.**

## Best Web/App Experience

Key evidence:

- guided demo;
- focus mode;
- dark/light themes;
- interactive Stress Lab;
- replay;
- shareable scenarios;
- clear navigation.

## Best Design

Key evidence:

- institutional fintech visual language;
- one dominant visual concept per guided scene;
- consistent risk / warning / recovery color semantics;
- before/after mechanism visualization;
- typography and spacing polish.

## Best Technical Achievement

Key evidence:

- deterministic engine;
- replayable model-driven story;
- shareable scenarios;
- seeded generation;
- sensitivity recomputation;
- automated checks.

## Biggest Learning Journey

Key evidence:

- finance background;
- Development Journey section;
- documented bugs and redesigns;
- move from static numbers to mechanism-first visualization;
- CI / reproducibility / deployment learning.

## Most Polished Project

Key evidence:

- complete live deployment;
- README and documentation;
- narration;
- themes;
- replay;
- sensitivity explorer;
- challenge mode;
- real/synthetic guardrails;
- final QA checklist.

---

# Remaining gaps before submission

## Must finish

- final live-site visual QA from screenshots;
- confirm no overlap at common desktop widths;
- confirm narration quality on the recording machine;
- capture final screenshots;
- record demo video;
- paste final Devpost text;
- verify all public links in incognito mode.

## Do not add unless a clear bug appears

- account/login system;
- backend/database;
- AI chatbot;
- more model parameters;
- more charts;
- real-bank names;
- real-world performance claims.

At this stage, polish and communication have higher expected value than feature expansion.
