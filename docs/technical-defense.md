# Resilience Atlas — technical defense

This is a compact judge-preparation guide for the current prototype.

## 1. What is Resilience Atlas simulating?

A synthetic shared-provider operational shock.

One or more synthetic cloud providers fail. Banks assigned to those providers simultaneously need recovery capacity for critical workloads.

The model compares:
1. post-shock market sourcing;
2. Individual Reserves;
3. SCFR pooled reserve.

## 2. Why 20 banks and 3 providers?

They form a stylized test bed that is large enough to show shared dependency while remaining visually understandable.

They are not real market shares or real institutions.

## 3. What is the central experiment?

**Individual Reserves vs SCFR**, with the **same aggregate reserve budget**.

This matters because otherwise a better SCFR outcome could simply result from giving it more capacity.

The intended difference is the allocation mechanism.

## 4. How is emergency market capacity calculated?

For affected banks:

```text
market pool = affected critical demand × market %
```

This is a synthetic assumption. The model does not simulate real pricing or bidding.

## 5. What are Individual Reserves?

Each bank has its own pre-arranged share of the aggregate reserve budget.

If a bank is unaffected, its reserve cannot automatically move to another bank in this mechanism.

Unused reserve can therefore remain **stranded**.

## 6. What is SCFR?

SCFR means **Systemic Cloud Failover Reserve**.

In the prototype:
- capacity is arranged before the shock;
- the aggregate reserve budget is the same as under Individual Reserves;
- pooled capacity can be redirected across affected banks according to a selected allocation rule.

It is a conceptual mechanism, not a claim that this governance structure already exists or is legally feasible.

## 7. What allocation rules are available?

### Systemic priority
Higher synthetic critical-load × importance values are prioritized.

### Equal allocation
Capacity is shared across banks that still need it.

### Readiness first
Banks with higher synthetic failover readiness receive priority.

These are experimental rules, not policy recommendations.

## 8. Why does readiness matter?

Capacity does not automatically equal restored workload.

```text
capacity_ratio = min(allocated_capacity / critical_load, 1)
restored_fraction = capacity_ratio × readiness
```

So even a fully supplied synthetic bank can restore less than 100% if its readiness is below 1.

## 9. What is the Systemic Resilience Score?

```text
SRS = Σ(wᵢ × restored_fractionᵢ) / Σ(wᵢ) × 100
```

where the synthetic weight combines critical workload and stylized systemic importance.

SRS is a project-specific metric, not a regulatory standard.

## 10. What makes the model deterministic?

The recovery engine contains no random draw.

For the same:
- provider shock;
- market capacity;
- reserve percentage;
- allocation rule;

the same outputs are produced.

## 11. Is the Guided Simulation prerecorded?

No.

The Guided Simulation uses the same model state and scenario calculations as the interactive product, but the six-scene baseline narration is a fixed explanatory sequence.

The Scenario Lab separately allows judges to change assumptions and run a model-driven scenario playback.

## 12. What does the Robustness Sweep do?

It constructs a local grid around the current:
- market-capacity assumption;
- reserve-capacity assumption.

For each tested pair it runs `compareStrategies()` and calculates:

```text
coordination uplift =
SCFR resilience − Individual Reserve resilience
```

It shows whether the coordination effect persists, weakens or disappears across nearby synthetic assumptions.

It is a diagnostic, not empirical validation.

## 13. What do the automated tests protect?

Examples:
- resilience scores stay within valid bounds;
- allocations do not exceed available pools;
- Individual Reserves and SCFR receive the same aggregate reserve budget;
- affected banks match the selected failed providers;
- required UI controls remain present;
- narration and storyboard cues remain wired;
- mobile interaction regressions are caught.

## 14. Why vanilla JavaScript?

For this prototype, it keeps:
- deployment simple;
- dependencies minimal;
- model logic inspectable;
- the connection between state and visualization explicit.

It is a scope decision, not a claim that frameworks are unnecessary in general.

## 15. What is real?

The motivation:
- third-party ICT concentration;
- critical external-provider dependence;
- operational-resilience concerns.

These are documented in BIS, EBA and DORA-related material.

## 16. What is synthetic?

- bank network;
- provider assignments;
- workloads;
- readiness values;
- systemic weights;
- capacity units;
- resilience scores;
- all numerical improvements.

Correct wording:

> In this synthetic scenario, the model shows...

Incorrect wording:

> SCFR would improve the real banking system by X%.

## 17. Biggest limitations

Not yet modeled:
- workload portability;
- data synchronization;
- provider-specific architecture;
- network dependencies;
- recovery-time objectives;
- legal / contractual constraints;
- governance;
- cross-border rules;
- reserve cost;
- empirical calibration.

## 18. How was AI used?

Use:

> AI tools materially assisted brainstorming, code drafting, debugging, documentation and interface iteration. I selected the research framing and assumptions, directed product decisions, reviewed outputs, tested the implementation and am responsible for understanding and presenting the final prototype.

# Five facts to remember

1. **Same aggregate reserve budget** in Individual Reserves and SCFR.
2. `restored_fraction = capacity_ratio × readiness`.
3. `capacity_ratio = min(allocation / critical_load, 1)`.
4. SRS is a weighted restored-workload metric.
5. Robustness Sweep compares SCFR vs Individual across nearby assumptions; it does not validate real-world effectiveness.
