# CloudRescue — Technical Ownership Pass

This checklist exists for one reason:

**The author should be able to explain the project without relying on AI during judging.**

FirstCommit explicitly values understanding, learning and the ability to explain technical decisions.

Do not memorize answers mechanically. Work through each item until you can explain it in your own words.

---

## Part 1 — Explain the product in 30 seconds

You should be able to say, without reading:

1. What problem CloudRescue models.
2. Why shared cloud-provider dependency can create correlated operational risk.
3. What the three recovery mechanisms are.
4. Why Individual Reserves and SCFR use the same reserve budget.
5. What the project does **not** claim.

Pass condition:

- you can explain all five points naturally in under 45 seconds.

---

## Part 2 — Explain the simulation engine

Open:

- `model/simulation.js`
- `data/banks.js`

You should be able to identify:

- where synthetic banks are defined;
- where provider assignments are stored;
- where critical workload is stored;
- where failover readiness is stored;
- where systemic importance is stored;
- where market capacity is calculated;
- where reserve capacity is calculated;
- where the three mechanisms differ;
- where restored workload is calculated;
- where Systemic Resilience Score is calculated.

Pass condition:

You can point to the relevant code and explain the calculation in plain English.

---

## Part 3 — Five model facts you must know

### 1. Emergency-market capacity

Affected banks generate total critical demand.

Emergency-market capacity is a user-selected percentage of that demand.

### 2. Individual Reserves

Pre-reserved capacity remains bank-specific.

Reserve belonging to an unaffected bank cannot automatically move to an affected bank in the synthetic model.

### 3. SCFR

SCFR receives the **same aggregate reserve budget**.

The difference is pooled allocation across affected banks.

### 4. Failover readiness

Allocated capacity alone is not enough.

Recovery is limited by each synthetic bank's readiness.

### 5. Systemic Resilience Score

SRS is a weighted average of restored critical workload.

It is a project-specific synthetic metric, not a regulatory standard.

Pass condition:

Explain all five without opening documentation.

---

## Part 4 — Explain the controlled comparison

Open the **Controlled Comparison** screen.

Explain:

- failed provider;
- number of affected banks;
- emergency-market assumption;
- reserve budget;
- why both reserve mechanisms have the same aggregate budget;
- why stranded reserve can occur;
- why SCFR may change the result.

Important wording:

> The comparison isolates the allocation mechanism. It does not give SCFR extra reserve.

Pass condition:

A listener unfamiliar with the project understands why the comparison is fair within the synthetic model.

---

## Part 5 — Explain deterministic reproducibility

Open the Stress Lab.

You should understand:

- what a Scenario ID represents;
- what the seed changes;
- why the same seed reproduces the same assumptions;
- how query parameters reconstruct a scenario;
- what JSON export contains;
- why the underlying recovery calculation is deterministic.

Pass condition:

Generate one seeded scenario, copy its URL, open it again and explain why the values match.

---

## Part 6 — Explain Sensitivity Explorer

You should be able to explain:

- which two assumptions form the grid;
- what each cell represents;
- difference between SCFR resilience and SCFR uplift;
- why sensitivity analysis is stronger than showing one baseline scenario;
- why it still does not prove real-world effectiveness.

Pass condition:

Explain one high-uplift cell and one low-uplift cell in your own words.

---

## Part 7 — Run the tests yourself

In the repository, understand what the automated checks protect.

Know examples such as:

- scores stay inside valid bounds;
- allocation cannot exceed available capacity;
- Individual Reserves and SCFR use the same aggregate reserve budget;
- affected banks match the failed provider;
- required UI elements remain present.

Pass condition:

You can explain **why at least three tests exist**, not only that they pass.

---

## Part 8 — Make one small change yourself

Before final submission, make one small, intentional change that you understand completely.

Good examples:

- improve one sentence in the UI;
- rename one clearly understood label;
- adjust one non-critical spacing value;
- improve one README sentence;
- add one explanation to Methodology.

Then:

1. inspect the diff;
2. commit it with a meaningful commit message;
3. confirm checks pass.

The purpose is not to manufacture commit history.

The purpose is to practice the actual edit → review → test → commit workflow yourself.

---

## Part 9 — Explain the limitations

You should be able to name at least five missing real-world layers:

- workload portability;
- data synchronization;
- network dependencies;
- recovery-time objectives;
- contractual constraints;
- regulatory / governance constraints;
- provider-specific architecture;
- cross-border issues;
- economic cost.

Pass condition:

Explain why CloudRescue v0.1 is a **mechanism stress-test**, not a real-world forecast.

---

## Part 10 — Explain AI assistance honestly

Recommended answer:

> AI tools materially assisted with brainstorming, code drafting, debugging, documentation and interface iteration. I directed the research framing and product decisions, reviewed the assumptions and outputs, tested the application, and worked through the final model and implementation so I can explain the project and its limitations.

Do not claim:

- that no AI was used;
- that every line was written manually if that is not true;
- that you understand code you have not actually reviewed.

---

# Final ownership test

Before submitting, answer these without notes:

1. What exactly is the research question?
2. What changes between Individual Reserves and SCFR?
3. What stays constant?
4. How is restored workload calculated?
5. What is SRS?
6. What does failover readiness do?
7. What makes a scenario reproducible?
8. What does the sensitivity heatmap test?
9. What is real-world evidence and what is synthetic?
10. What is the biggest limitation?
11. What was the hardest technical problem?
12. What did you personally learn?

If you cannot answer one of these, revisit that part of the code or documentation before submission.

---

## Completion state

- [ ] Product explanation passed
- [ ] Simulation engine reviewed
- [ ] Five model facts passed
- [ ] Controlled Comparison passed
- [ ] Reproducibility passed
- [ ] Sensitivity Explorer passed
- [ ] Automated tests understood
- [ ] One small change completed personally
- [ ] Limitations passed
- [ ] AI disclosure can be explained naturally
- [ ] Final 12-question ownership test passed

Only mark these complete after actually doing them.
