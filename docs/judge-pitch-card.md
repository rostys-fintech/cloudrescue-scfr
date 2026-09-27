# CloudRescue — judge pitch card

## 30-second pitch

CloudRescue is a synthetic stress lab for systemic cloud-outage resilience in banking.

The problem is simple: a backup plan can work for one bank and still fail for the system if many banks depend on the same provider and need backup capacity at the same time.

CloudRescue compares post-shock market sourcing, individual reserves and a pooled SCFR reserve under the **same shock and same reserve budget**.

The prototype is deterministic, replayable and shareable, so judges can change assumptions and reproduce the same scenario themselves.

---

## 60-second pitch

Financial institutions increasingly depend on a small number of critical ICT and cloud providers. That creates a coordination problem: when one provider fails, many institutions may need recovery capacity simultaneously.

CloudRescue turns that systemic-risk question into an interactive synthetic model.

It simulates 20 stylized banks connected to three shared providers and compares three recovery mechanisms:

- post-shock market sourcing;
- institution-specific reserves;
- a pooled Systemic Cloud Failover Reserve, or SCFR.

The core comparison is controlled: **same shock, same reserve budget, different allocation mechanism**.

Users can watch a guided crisis replay, change assumptions in the Stress Lab, replay their scenario, generate deterministic seeds, share scenario links, export JSON and explore sensitivity across reserve and market-capacity assumptions.

The real-world risk motivation is documented; the network and numerical results are explicitly synthetic.

---

# Three strongest lines

> **A plan B for one bank may not be a plan B for the system.**

> **Same shock. Same reserve budget. Different coordination.**

> **The problem is real; the numerical experiment is synthetic.**

---

# If a judge asks: “What is actually new here?”

A concise answer:

> The prototype does not simply visualize a cloud outage. It isolates an allocation problem. Individual Reserves and SCFR receive the same aggregate reserve budget, so the experiment asks whether coordination can reduce stranded capacity and improve system-level recovery without adding more reserve.

---

# If a judge asks: “Why does this matter?”

> Operational resilience is usually discussed institution by institution, but shared third-party dependencies can create correlated demand. CloudRescue makes that system-level coordination problem visible and testable.

---

# If a judge asks: “Is SCFR proven to work?”

> No. CloudRescue v0.1 is a synthetic mechanism stress-test. It shows how one coordination concept behaves under explicit assumptions. It does not claim empirical validation or real-world performance.

---

# If a judge asks: “Why should I trust the demo?”

> The model is deterministic, assumptions are visible, Individual Reserves and SCFR use the same reserve budget, scenarios can be exported as JSON, seeded scenarios are reproducible, and automated checks test model invariants and important UI interactions.

---

# If a judge asks: “What did you personally build or learn?”

> I started from a finance and systemic-risk question. During FirstCommit I learned to translate it into computational assumptions, separate the simulation engine from the interface, build dynamic visualizations, synchronize narration with application state, serialize reproducible scenarios, write automated checks and deploy the full product publicly.

---

# If a judge asks about AI

> AI tools materially assisted with brainstorming, code drafting, debugging, documentation and interface iteration. I directed the research framing and product decisions, reviewed the model logic and assumptions, tested the implementation, and I am responsible for understanding and explaining the final project.

---

# One-line technical explanation

> CloudRescue allocates limited recovery capacity to banks affected by a shared-provider outage, constrains restoration by each bank's synthetic failover readiness, and calculates a weighted Systemic Resilience Score.

---

# Closing line

> CloudRescue is not a forecast. It is a transparent sandbox for asking a narrower question: when a common shock hits many institutions at once, can coordination make the same reserve budget work better?
