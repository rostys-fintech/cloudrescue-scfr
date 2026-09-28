# Resilience Atlas — Model Walkthrough

This walkthrough explains the current v0.1 simulation engine in plain language.

The goal is not to memorize source code. The goal is to understand what each part does and why.

---

# 1. Synthetic data

File:

`data/banks.js`

The model contains:

- **20 synthetic banks**
- **3 synthetic shared providers**
- per-bank critical workload
- failover readiness
- stylized systemic importance

No row represents a real bank.

## Provider groups

- Blue Cloud: 8 banks
- Orange Cloud: 7 banks
- Green Cloud: 5 banks

## Total critical system load

**1,538 synthetic capacity units**

Provider loads:

- Blue Cloud: **608**
- Orange Cloud: **549**
- Green Cloud: **381**

These values are synthetic inputs used only to make the mechanism visible.

---

# 2. affectedBanks()

```js
function affectedBanks(outageProviders) {
  const failed = new Set(outageProviders);
  return banks
    .filter(b => failed.has(b.provider))
    .map(b => ({...b, allocation:0}));
}
```

## What it does

Selects banks connected to any provider included in the selected outage set.

Every affected bank starts the recovery calculation with:

`allocation = 0`

## Example

If Blue Cloud fails:

- 8 banks are affected
- their total critical demand is 608 units

Banks connected to Orange and Green do not directly request recovery capacity in that shock.

---

# 3. priorityValue()

```js
function priorityValue(bank, rule) {
  if (rule === 'equal') return 1;
  if (rule === 'readiness') return bank.readiness;
  return bank.criticalLoad * bank.importance;
}
```

This function defines the priority used when pooled capacity is allocated.

## Equal

Every affected bank has the same priority.

## Readiness

Banks with higher failover readiness are served first.

## Systemic

Default SCFR rule:

`criticalLoad × importance`

Larger / more systemically weighted workloads therefore receive higher priority.

Important limitation:

These are stylized experimental allocation rules, not regulatory prescriptions.

---

# 4. allocatePool()

This is the main pooled-capacity allocation function.

Inputs:

- affected banks
- available capacity pool
- allocation rule

## Equal rule

The pool is divided across all banks that still need capacity.

If one bank becomes fully supplied, the remaining capacity is redistributed among the others.

## Readiness / systemic rule

Banks are sorted by priority.

The model then allocates capacity until either:

- the pool is exhausted; or
- all demand is satisfied.

Important:

No bank can receive more than its own critical workload.

---

# 5. finalize()

This function converts capacity allocation into recovery outcomes.

## Step 1 — Capacity ratio

```text
capacity_ratio =
min(allocated_capacity / critical_load, 1)
```

Example:

A bank has:

- 100 units critical workload
- 80 units allocated capacity

Then:

`capacity_ratio = 0.80`

---

## Step 2 — Failover readiness

Recovery is not equal to capacity.

```text
restored_fraction =
capacity_ratio × readiness
```

Example:

- capacity ratio = 0.80
- readiness = 0.90

Then:

`restored_fraction = 0.72`

So the model treats the bank as restoring **72%** of its critical workload.

This is one of the most important model assumptions.

---

## Step 3 — Recovered bank threshold

A bank counts as recovered when:

```text
restored_fraction ≥ 0.80
```

This threshold affects the:

**Banks recovered ≥80%**

metric.

It does not directly determine the Systemic Resilience Score.

---

# 6. Systemic Resilience Score

The model calculates:

```text
SRS =
Σ(criticalLoadᵢ × importanceᵢ × restoredFractionᵢ)
─────────────────────────────────────────────── × 100
Σ(criticalLoadᵢ × importanceᵢ)
```

## Meaning

Banks with:

- larger critical workloads; and
- higher synthetic importance

have more weight in the system-level score.

SRS is therefore not simply the average recovery percentage across banks.

Important:

SRS is a **Resilience Atlas synthetic research metric**.

It is not an official regulatory metric.

---

# 7. runScenario()

This function builds one complete recovery scenario.

Inputs:

- one or more outage providers
- emergency-market capacity %
- pre-reserved capacity %
- recovery strategy
- SCFR allocation rule

---

## Emergency-market capacity

The model first calculates:

```text
marketPool =
affectedDemand × marketPct
```

Example:

Blue Cloud outage:

`affectedDemand = 608`

At:

`marketPct = 20%`

the post-shock market pool is:

`608 × 0.20 = 121.6 units`

The model allocates this emergency-market pool using the **readiness** rule.

This is a simplifying assumption.

It does not simulate real market pricing or bidding.

---

# 8. Post-shock Market Sourcing

If:

`strategy = market`

the calculation stops after allocating emergency-market capacity.

There is:

- no pre-reserved capacity
- no pooled reserve
- no institution-specific reserve

This creates the baseline post-shock sourcing scenario.

---

# 9. Individual Reserves

The total system reserve budget is:

```text
reservePool =
totalSystemLoad × reservePct
```

At a 25% reserve setting:

```text
1,538 × 25% = 384.5 units
```

The Individual Reserve mechanism assigns each bank reserve proportional to its own critical workload.

Because:

```text
reserveSharePerUnit =
reservePool / totalSystemLoad
```

this becomes exactly the selected reserve percentage of each bank's workload.

## Key consequence

Reserve belonging to unaffected banks cannot move to affected banks.

Therefore some of the system-wide reserve budget can remain unused during a provider-specific shock.

The model records this as:

**stranded reserve**

This is the fragmentation mechanism.

---

# 10. SCFR Pooled Reserve

SCFR receives the same total reserve pool:

```text
reservePool =
totalSystemLoad × reservePct
```

It does **not** receive more aggregate reserve than Individual Reserves.

The difference is:

the full reserve pool can be allocated across affected banks using the selected SCFR allocation rule.

## Central experiment

The interface's Robustness Sweep also reruns this same comparison over nearby market/reserve assumptions.

Individual Reserves:

**same budget → institution-specific allocation**

SCFR:

**same budget → pooled allocation**

This is why the project can ask whether coordination changes recovery under a fixed resource budget.

---

# 11. compareStrategies()

This function runs the same scenario three times:

- Post-shock Market Sourcing
- Individual Reserves
- SCFR

The same outage provider and user assumptions are passed into each strategy.

That is what powers the mechanism comparison in the interface.

---

# 12. resilienceFrontier()

The model reruns the scenario with reserve capacity from:

**0% to 60%**

in 5-percentage-point increments.

For each reserve level it records:

- market resilience
- individual-reserve resilience
- SCFR resilience

This creates the Resilience Frontier chart.

---

# 13. systemStats()

This function calculates:

- total system load
- provider-specific loads
- a provider-concentration HHI

The HHI is based on each provider's share of synthetic critical load.

This is a descriptive statistic for the synthetic system only.

It is not an estimate of real cloud-market concentration.

---

# 14. What stays constant in the key experiment

When comparing Individual Reserves with SCFR:

### Constant

- failed provider
- affected banks
- synthetic bank characteristics
- emergency-market assumption
- total aggregate reserve budget

### Changes

- reserve allocation mechanism

That distinction is the central methodological point in Resilience Atlas.

---

# 15. Important simplifications

The engine does **not** currently simulate:

- market prices
- bidding competition
- provider-specific technical compatibility
- workload migration time
- network bottlenecks
- data synchronization
- contractual constraints
- cross-border rules
- reserve cost
- recovery-time objectives
- empirical provider-specific failure probabilities

These are not bugs.

They define the boundary of v0.1.

---

# 16. Six functions to know for judging

You should recognize and explain:

1. `affectedBanks()`
2. `priorityValue()`
3. `allocatePool()`
4. `finalize()`
5. `runScenario()`
6. `compareStrategies()`

If you understand these six functions, you understand the core engine.

---

# 17. Five numbers worth understanding

Baseline synthetic system:

- total banks: **20**
- total critical load: **1,538**
- Blue Cloud affected banks: **8**
- Blue Cloud affected demand: **608**
- 25% system reserve budget: **384.5 units**

With 20% emergency-market capacity under a Blue outage:

- market capacity: **121.6 units**

These are synthetic model inputs / derived values, not real-world estimates.

---

# 18. Judge-safe explanation

A strong simple explanation is:

> First, the model selects all banks connected to the failed provider. It calculates emergency capacity available after the shock. Then it applies one of three recovery mechanisms. Individual Reserves keep pre-arranged capacity bank-specific, while SCFR can allocate the same aggregate reserve pool across affected banks. Recovery is then limited by both the capacity each bank receives and its synthetic failover readiness. Finally, the model aggregates restored critical workload into a weighted Systemic Resilience Score.

---

# 19. The most important caveat

Resilience Atlas shows:

**how a mechanism behaves under explicit synthetic assumptions.**

It does not show:

**how real banks would definitely recover during a real cloud outage.**
