# Resilience Atlas — judge pitch card

## 30-second pitch

Resilience Atlas is a systemic cloud-resilience simulator for banking.

The problem is simple: a backup plan can work for one bank and still fail for the system if many banks depend on the same provider and need recovery capacity at the same time.

The prototype compares post-shock market sourcing, individual reserves and a pooled SCFR reserve under the **same shock and the same aggregate reserve budget**.

The real-world concentration-risk problem is documented; the numerical experiment is explicitly synthetic.

---

## 60-second pitch

Financial institutions can depend on a small number of critical ICT and cloud providers. If one shared provider fails, several institutions may request backup capacity simultaneously.

Resilience Atlas turns that systemic-risk question into an interactive synthetic model.

It simulates 20 stylized banks connected to three shared providers and compares:
- post-shock market sourcing;
- institution-specific reserves;
- a pooled Systemic Cloud Failover Reserve, or SCFR.

The central experiment is controlled:

> **Same shock. Same reserve budget. Different coordination.**

Users can watch a narrated six-scene simulation, change the shock and capacity assumptions in Scenario Lab, compare recovery outcomes, and export the current scenario.

The model is deterministic, the assumptions are visible, and the interface separates documented real-world motivation from synthetic numerical results.

---

# Three strongest lines

> **A plan B for one bank may not be a plan B for the system.**

> **Same shock. Same reserve budget. Different coordination.**

> **The problem is real; the numerical experiment is synthetic.**

---

## What is actually new here?

> The project isolates an allocation problem. Individual Reserves and SCFR receive the same aggregate reserve budget, so the comparison asks whether coordination can reduce stranded capacity and improve system-level recovery without simply adding more resources.

## Why does this matter?

> Operational resilience is often managed institution by institution, but shared third-party dependencies can create correlated recovery demand. Resilience Atlas makes that system-level coordination problem visible and testable.

## Is SCFR proven?

> No. Resilience Atlas is a synthetic mechanism stress-test. It explores one coordination concept under explicit assumptions and does not claim empirical validation.

## Why trust the demo?

> The simulation is deterministic, the assumptions are visible, the reserve-budget comparison is controlled, the current scenario can be exported, and automated checks protect model invariants and important UI behavior.

## Who would use this?

> Bank operational-resilience and technology-risk teams, supervisors, and financial-stability researchers could use a tool like this to discuss shared-provider concentration and recovery coordination more concretely.

## What did you build or learn?

> I started from a finance and systemic-risk question and learned how to translate it into computational assumptions, separate simulation logic from presentation, build dynamic SVG visualizations, synchronize narration with model state, debug mobile interaction, add regression tests and deploy the product publicly.

## How was AI used?

> AI tools materially assisted brainstorming, code drafting, debugging, documentation and interface iteration. I directed the research framing and product decisions, reviewed the model logic and assumptions, tested the implementation and am responsible for understanding and explaining the final project.

## One-line technical explanation

> Resilience Atlas allocates limited recovery capacity to synthetic banks affected by a shared-provider outage, constrains restoration by failover readiness and computes a weighted Systemic Resilience Score.

## Closing line

> Resilience Atlas is not a forecast. It is a transparent sandbox for asking whether coordination can make the same recovery resources work better when a common shock hits many institutions at once.
