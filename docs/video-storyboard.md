# CloudRescue — Final Demo Video Storyboard

Target length: **3:45–4:10**

Goal: one clean take with deliberate movement and no rushed scrolling.

## Recording setup

- Desktop browser, 16:9.
- Recommended: 1920×1080 recording.
- Browser zoom: 90–100%.
- Use the institutional v2 UI only.
- Start at the top of the landing page.
- Close bookmarks bar and unrelated tabs if possible.
- Keep cursor movement slow.
- Do not narrate while the built-in narrator is speaking.
- Pause 1 second after each major visual change.

---

## 0:00–0:18 — Product hook

### Screen
Dark CloudRescue hero with topology preview.

### Action
No scrolling.

### Say
> A backup plan can work for one bank and still fail for the system if many banks depend on the same provider and need recovery capacity at the same time.

> CloudRescue is a synthetic stress lab for that coordination problem.

### Visual pause
Hold the hero for ~2 seconds.

---

## 0:18–0:28 — Core experiment

### Screen
Hero remains visible.

### Say
> The experiment is deliberately controlled: same shock, same reserve budget, different coordination.

### Action
Click **Run guided replay**.

---

## 0:28–1:18 — Crisis Replay

### Screen
Use Focus View if it improves framing.

### Action
Let the built-in narrator explain most of the sequence.

Do not talk over narration.

### Scene 1
Shared dependency.

Briefly say after narration:
> The problem is not one bank failing. It is correlated dependency.

### Scene 2
Provider outage.

No extra commentary.

### Scene 3
Simultaneous demand and emergency-market scarcity.

Briefly say:
> Recovery demand arrives at the same time.

### Scene 4
Ring-fenced reserves.

Briefly say:
> Capacity exists, but institution-specific reserves can remain stranded.

### Scene 5
SCFR pooled reserve.

Briefly say:
> SCFR receives no extra reserve. Only the allocation mechanism changes.

### Scene 6
Final comparison.

Say:
> Same shock. Same reserve budget. Different coordination.

Exit Focus View.

---

## 1:18–1:38 — Stress Lab / prove interactivity

### Action
Open **Stress Lab**.

### Screen
Dark scenario-controls rail + dark Shock Summary header + executive readout.

### Say
> The replay is not a prerecorded animation. It is driven by the same deterministic model as the Stress Lab.

Change only 2–3 assumptions:
- failed provider;
- emergency-market capacity;
- reserve budget.

Do not change everything.

---

## 1:38–1:52 — Reproducibility

### Screen
Scenario ID and reproducibility controls.

### Action
Enter seed: **FIRSTCOMMIT**.
Click **Generate**.

### Say
> A seed deterministically reconstructs the same scenario assumptions.

Click **Copy scenario link** once.

> The scenario can also be shared or exported as JSON.

---

## 1:52–2:05 — Model-driven replay proof

### Action
Click **Replay scenario**.

Allow the changed provider / assumptions to appear in the Crisis Replay.

### Say
> The guided story has rebuilt itself around the scenario I just created.

Return to Stress Lab.

---

## 2:05–2:38 — Controlled Comparison — main analytical payoff

### Action
Scroll smoothly to **Controlled Comparison**.

### Screen
Show the full dark comparison if possible.

### Say
> This is the central experiment.

> Both mechanisms receive the same aggregate pre-reserved capacity. Individual Reserves keep that capacity institution-specific; SCFR allows pre-arranged pooled allocation across affected banks.

Point visually to:
- Failed provider;
- Affected banks;
- Emergency market;
- Reserve budget;
- central uplift;
- stranded reserve reduction.

### Say
> This isolates the coordination effect rather than simply giving SCFR more capacity.

Hold the screen for ~2 seconds.

---

## 2:38–2:58 — Sensitivity Explorer

### Action
Open **Advanced analysis**, then show **Sensitivity Explorer**.

Switch:
**SCFR resilience → SCFR uplift**.

### Say
> One scenario is not enough. The model is recalculated across combinations of emergency-market capacity and reserve capacity.

> This shows where coordination matters most and where the effect becomes smaller.

---

## 2:58–3:15 — Research transparency

### Action
Open **Methodology**.

### Screen
Research Framework intro + architecture.

### Say
> The model is intentionally transparent: synthetic network, explicit allocation rules, deterministic recovery engine and a weighted Systemic Resilience Score.

---

## 3:15–3:32 — Real vs synthetic

### Action
Scroll to real-world motivation.

### Say
> The concentration-risk problem is real and documented by regulators. The bank network, capacity values and numerical results in this MVP are synthetic.

> This is a mechanism stress-test, not a forecast.

---

## 3:32–3:52 — Learning & Growth

### Action
Scroll to **Development Journey · FirstCommit**.

### Say
> My starting point was finance and banking rather than software engineering.

> During FirstCommit I learned how to move from a systemic-risk question to computational assumptions, a deterministic simulation engine, interactive visualizations, reproducible scenarios, automated checks and a public deployment.

---

## 3:52–4:05 — Close

### Action
Return to either:
- the dark hero; or
- Controlled Comparison.

### Final line
> CloudRescue makes one idea visible: a plan B for one institution may not be a plan B for the system when everyone needs it at once.

Hold for 2 seconds, then stop recording.

---

# Editing rules

Keep editing minimal.

Allowed / useful:
- trim dead time at start and end;
- normalize volume if needed;
- remove one obvious mistake if it can be cut cleanly;
- add a simple opening title only if necessary.

Avoid:
- fast montage;
- background music competing with narration;
- excessive zoom effects;
- animated stickers;
- large subtitles covering the interface;
- speed-ups that make the product hard to understand.

# Final export checklist

- [ ] 1080p if possible
- [ ] Speech clearly audible
- [ ] Built-in narrator clearly audible
- [ ] No notification popups
- [ ] No private tabs or personal information visible
- [ ] Cursor movement deliberate
- [ ] Controlled Comparison visible long enough to read
- [ ] Real-vs-synthetic statement included
- [ ] Learning journey included
- [ ] Video watched once from start to finish after export