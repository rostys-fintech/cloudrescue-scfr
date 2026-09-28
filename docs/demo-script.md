# Resilience Atlas — 2–3 minute judge demo

## Target length
**2:20–2:50**

The video should prove four things:
1. the problem is understandable;
2. the product works;
3. the mechanism comparison is novel;
4. the project is transparent about its limits.

## 0:00–0:15 — Hook

**On screen:** Simulation view before pressing Run.

Say:

> A backup plan can work for one bank and still fail for the system if many banks depend on the same cloud provider and need recovery capacity at the same time. Resilience Atlas is a synthetic simulator for that coordination problem.

Then:

> The real-world risk motivation is documented. The numerical model is deliberately synthetic.

Press **Run Guided Simulation**.

## 0:15–1:05 — Guided mechanism story

Let the built-in narrator and visuals carry most of this section.

The judge should see:
1. shared dependencies;
2. provider failure;
3. simultaneous recovery demand;
4. ring-fenced reserve;
5. pooled SCFR reallocation;
6. outcome comparison.

Add only two short lines over natural gaps:

> Capacity can exist in the system and still be stranded in the wrong place.

Then:

> SCFR does not receive a bigger reserve budget. The difference is coordination.

At the comparison:

> Same shock. Same reserve budget. Different coordination.

## 1:05–1:50 — Scenario Lab

Switch to **Scenario Lab**.

Say:

> The guided story is backed by a deterministic simulation engine. Here I can change the shock and recovery assumptions.

Change one or two inputs:
- failed provider;
- market capacity;
- reserve percentage.

Press **Run Scenario**.

Let the playback reach the conclusion.

Say:

> The model recalculates the affected banks, recovery demand, capacity gap, stranded reserve and system-level recovery.

Do not read every metric.

## 1:50–2:08 — Robustness Sweep

Switch to **Model & Evidence** and show **Robustness Sweep**.

Say:

> To avoid relying on one hand-picked scenario, the simulator reruns a local grid around the current market and reserve assumptions.

> Each cell shows SCFR resilience minus Individual Reserve resilience under the same aggregate reserve budget.

## 2:08–2:28 — Model & Evidence

Switch to **Model & Evidence**.

Say:

> I separate what is observed from what is synthetic. Third-party ICT concentration and operational-resilience concerns are real and documented. The bank network and every numerical result in this prototype are synthetic.

Briefly show the export controls.

> The current scenario can also be exported as a readable report or JSON.

## Final close

Return to **Controlled Comparison**.

Say:

> Same shock. Same reserve budget. Different coordination. A plan B for one bank may not be a plan B for the system. Thank you for watching. My goal is to keep developing this research toward practical systemic cloud resilience in banking.

Keep the product visible until the final frame.

## Recording rules

- Show the actual product for almost the entire video.
- Use desktop for the main recording; include one short mobile shot only if it looks polished.
- Record at 1080p.
- Do not open source files unless the submission explicitly requires it.
- Do not narrate every metric.
- Never claim the synthetic result is an empirical forecast.
- Keep cursor movement slow.
- Pause after each major visual change.
