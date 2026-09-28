# Resilience Atlas — technical ownership pass

Before judging, be able to explain the current product without relying on notes.

## Part 1 — Explain the project in 45 seconds

Be able to explain:
1. shared-provider concentration creates correlated recovery demand;
2. the three recovery mechanisms;
3. why Individual Reserves and SCFR use the same aggregate reserve budget;
4. who the product is for;
5. why all numerical results are synthetic.

## Part 2 — Explain the engine

Open:
- `model/simulation.js`
- `data/banks.js`

Know where to find:
- affected-provider selection;
- market pool calculation;
- reserve pool calculation;
- Individual Reserve logic;
- SCFR pooled allocation;
- readiness constraint;
- Systemic Resilience Score.

## Part 3 — Explain the controlled comparison

In Scenario Lab, explain:

> The failed provider, bank data, market assumption and total reserve budget are held constant. The allocation mechanism changes.

Know why stranded reserve appears under Individual Reserves.

## Part 4 — Explain the Robustness Sweep

Know:
- it uses the same `compareStrategies()` engine;
- it builds a local grid around market/reserve assumptions;
- each cell is `SCFR resilience − Individual resilience`;
- it is synthetic sensitivity analysis, not validation.

## Part 5 — Run a scenario yourself

Change:
- failed provider;
- market capacity;
- reserve percentage;
- allocation rule.

Run the scenario and explain:
- affected banks;
- capacity gap;
- workload restored;
- resilience score;
- scenario conclusion.

## Part 6 — Explain exports

Know that:
- readable report export creates a text summary;
- JSON export captures machine-readable scenario and output values;
- the engine is deterministic for the same inputs.

## Part 7 — Understand tests

Be able to explain why at least three checks matter:
- budget constraint;
- score bounds;
- provider/affected-bank consistency;
- UI regression protection;
- mobile interaction protection.

## Part 8 — Explain limitations

Name at least five:
- workload portability;
- data synchronization;
- network bottlenecks;
- recovery-time objectives;
- contractual constraints;
- provider compatibility;
- governance;
- cost.

## Part 9 — Explain AI use honestly

Recommended wording:

> AI tools materially assisted brainstorming, code drafting, debugging, documentation and interface iteration. I directed the research framing and product decisions, reviewed assumptions and outputs, tested the application and am responsible for understanding and presenting the final result.

# Final ownership questions

Answer without notes:

1. What problem does Resilience Atlas model?
2. What changes between Individual Reserves and SCFR?
3. What stays constant?
4. How is restored workload calculated?
5. What is SRS?
6. Why can reserve become stranded?
7. What does Robustness Sweep test?
8. What is real-world evidence and what is synthetic?
9. What is the biggest limitation?
10. What did you build during LovHack?
11. What was the hardest technical bug?
12. How was AI used?

Only submit when you can answer all 12 naturally.
