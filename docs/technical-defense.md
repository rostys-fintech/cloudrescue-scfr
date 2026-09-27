# CloudRescue technical defense — likely judge questions

This file is not a script to memorize word-for-word. It is a compact explanation of how the project works so the author can confidently explain every major decision.

---

## 1. What is CloudRescue actually simulating?

CloudRescue simulates a **common operational shock**.

A synthetic cloud provider fails. Every synthetic bank assigned to that provider simultaneously needs backup capacity for its critical workload.

The model then compares three ways of obtaining that capacity:

1. post-shock market capacity;
2. bank-specific pre-reserved capacity;
3. pooled pre-reserved SCFR capacity.

The model asks how much critical workload can be restored under each mechanism.

---

## 2. Why are there 20 banks and 3 providers?

They are a **stylized test bed**, not empirical estimates.

Twenty banks are enough to make the shared-dependency structure visible without making the interface unreadable.

Three providers make concentration visible while still allowing different outage scenarios.

The exact numbers are synthetic and should not be defended as real market shares.

---

## 3. What is the main experiment?

The cleanest experiment compares:

**Individual Reserves vs SCFR Pooled Reserve**

while holding the **total reserve budget constant**.

That is important because otherwise a better SCFR result could simply come from giving it more capacity.

The experiment tries to isolate the effect of the **allocation mechanism**.

---

## 4. How does market capacity work?

For the affected banks, the model calculates total critical workload demand.

A user-selected percentage of that demand becomes the amount of emergency capacity that can be sourced after the outage.

Example:

If affected demand is 600 units and emergency-market capacity is 20%, the model has roughly 120 units available from the market.

That capacity is then allocated according to the model logic.

---

## 5. What is an Individual Reserve?

The system pre-reserves capacity before the crisis, but each bank owns its own share.

If a bank is not affected by the provider outage, its reserve cannot automatically be transferred to an affected bank.

That unused capacity is counted as **stranded reserve**.

This is the fragmentation problem CloudRescue makes visible.

---

## 6. What is SCFR?

SCFR stands for **Systemic Cloud Failover Reserve**.

In the prototype it is a conceptual coordination mechanism:

- reserve capacity is arranged before the crisis;
- the total reserve budget is the same as in the Individual Reserve scenario;
- instead of being permanently ring-fenced bank by bank, it can be allocated across affected banks according to an explicit rule.

CloudRescue does not claim that this mechanism is already legally or technically feasible in the real banking system.

---

## 7. What are the SCFR allocation rules?

The user can choose among three simplified rules.

### Systemic priority
Capacity goes first toward banks with higher stylized systemic importance.

### Equal allocation
Capacity is shared more evenly across affected banks.

### Readiness first
Capacity prioritizes banks that can technically convert backup capacity into restored workload more effectively.

These are simplified experimental rules, not policy recommendations.

---

## 8. Why does failover readiness matter?

Capacity alone does not guarantee recovery.

A bank may receive enough backup capacity but still be limited by how prepared it is to fail over workloads.

Each synthetic bank therefore has a readiness value between 0 and 1.

The model calculates:

```text
capacity_ratio = min(allocated_capacity / critical_load, 1)

restored_fraction = capacity_ratio × readiness
```

So even full capacity cannot produce 100% restored workload if readiness is below 1.

---

## 9. What is the Systemic Resilience Score?

The SRS is a weighted average of restored workload across affected banks.

```text
SRS = Σ(wᵢ × restored_fractionᵢ) / Σ(wᵢ) × 100
```

The weight combines:

- critical workload; and
- stylized systemic importance.

A higher SRS means more systemically weighted critical workload is restored.

It is an internal synthetic metric, not an industry-standard regulatory score.

---

## 10. Why not just count how many banks recovered?

A binary recovered / not recovered count loses information.

One bank could restore 79% of its workload and another 5%, but both might be counted as “not recovered” under a threshold.

SRS preserves more of the recovery distribution while still giving a readable headline metric.

The interface also exposes bank-level outcomes and critical-workload restoration so SRS is not the only result.

---

## 11. What makes the simulation deterministic?

For the same inputs, the engine contains no random draw in the recovery calculation.

Therefore:

**same scenario assumptions → same outputs**

The seeded scenario generator is also deterministic.

The seed is converted into a repeatable pseudo-random sequence that selects:

- outage provider;
- market-capacity percentage;
- reserve percentage;
- allocation rule.

The seed chooses the scenario; the simulation itself remains deterministic.

---

## 12. How do shareable scenarios work?

The current assumptions are serialized into URL query parameters:

- provider;
- market capacity;
- reserve budget;
- allocation rule;
- optional seed.

When another user opens the link, CloudRescue reads those parameters and restores the same Stress Lab configuration.

No database is needed.

---

## 13. Is Replay scenario a separate animation?

No.

Replay takes the **current Stress Lab assumptions** and passes them into the same guided-story renderer.

That changes:

- outage provider;
- number of affected banks;
- capacity demand;
- shortage;
- stranded reserve;
- SCFR outcome;
- narration text;
- visual highlighting.

This is important because it shows the guided story is connected to the model rather than being only a prerecorded baseline animation.

---

## 14. What does the Sensitivity Explorer calculate?

It repeatedly runs the simulation over a grid of:

- emergency-market capacity values; and
- reserve-capacity values.

For every cell it computes either:

- SCFR resilience; or
- SCFR resilience uplift versus Individual Reserves.

It is a compact way to see whether the mechanism depends on one cherry-picked scenario.

---

## 15. What do the automated tests check?

The tests include model invariants and UI smoke checks.

Examples of model invariants:

- resilience scores remain within valid bounds;
- allocated reserve cannot exceed the reserve budget;
- Individual Reserves and SCFR receive the same aggregate reserve budget;
- affected banks correspond to the failed provider;
- increasing pooled reserve should not reduce SCFR resilience in the deterministic baseline structure.

UI checks verify the presence of important controls and guard against regressions that previously broke multi-element DOM interactions.

---

## 16. Why vanilla JavaScript instead of React or another framework?

For this MVP the application does not need a component framework.

Vanilla JavaScript keeps:

- the deployment simple;
- the model easy to inspect;
- dependencies minimal;
- the relationship between simulation state and visualization explicit.

The choice is not a claim that vanilla JavaScript is always better. It is appropriate for the scope of this prototype.

---

## 17. What is real in this project?

The **problem motivation** is real:

- third-party ICT concentration;
- reliance on critical external providers;
- operational-resilience concerns.

These are documented by BIS, EBA and DORA-related oversight.

---

## 18. What is synthetic?

The following are synthetic:

- 20-bank network;
- provider assignments;
- workload values;
- readiness values;
- systemic weights;
- capacity units;
- numerical resilience results.

Therefore the correct wording is:

> In this synthetic scenario, the model shows...

not:

> SCFR would improve real banking-system resilience by X%.

---

## 19. What is the biggest limitation?

The model does not yet represent the full technical feasibility of moving real banking workloads between environments.

Missing real-world layers include:

- workload portability;
- data synchronization;
- network dependencies;
- recovery-time objectives;
- legal and contractual constraints;
- provider-specific architecture;
- cross-border governance;
- economic cost.

Those are future research questions, not hidden assumptions.

---

## 20. What did you personally learn?

A strong answer:

> I started with a finance question rather than a software idea. I learned how to convert an abstract systemic-risk mechanism into explicit computational assumptions, separate model logic from interface logic, visualize state changes, debug timing and DOM-state problems, build deterministic scenario sharing, write model invariants and UI checks, and deploy the final prototype publicly.

---

## 21. How was AI used?

Use a fully transparent answer:

> AI tools materially assisted with brainstorming, code drafting, debugging, documentation and interface iteration. I directed the project, selected the research framing and assumptions, reviewed the model outputs, decided which features and guardrails to keep, tested the behavior, and am responsible for understanding and explaining the final project.

Do not describe the project as if no significant AI assistance occurred.

---

# Five equations / facts to remember

1. **Same total reserve budget** in Individual Reserves and SCFR.
2. `restored_fraction = capacity_ratio × readiness`.
3. `capacity_ratio = min(allocation / critical_load, 1)`.
4. SRS is a weighted average of restored fractions.
5. Seed generation selects assumptions; the recovery model itself is deterministic.

If you can explain these five points and the real-vs-synthetic boundary, you can explain the core of CloudRescue.
