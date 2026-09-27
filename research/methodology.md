# SCFR Stress Lab — Methodology (v0.1)

## 1. Purpose

The v0.1 model is a transparent **illustrative stress-testing prototype**. Its purpose is to make a systemic cloud-capacity coordination problem computable and visual, not to estimate the resilience of real banks.

The core comparison is deliberately controlled:

> Individual Reserves and SCFR receive the **same total pre-reserved capacity**. Only the allocation mechanism changes.

This prevents the SCFR scenario from looking better merely because it has more resources.

## 2. Synthetic banking system

The model contains 20 stylized banks connected to three synthetic cloud providers. Each bank has four core parameters:

| Parameter | Meaning |
|---|---|
| `criticalLoad` | Backup capacity required to host the critical workload set |
| `readiness` | Technical failover-readiness ceiling between 0 and 1 |
| `importance` | Stylized systemic-importance weight (1–3) |
| `provider` | Primary synthetic cloud provider |

No row is mapped to a real bank.

## 3. Shock

A scenario begins with the complete outage of one synthetic cloud provider. Every bank assigned to that provider becomes affected and simultaneously requests backup capacity.

This is intentionally a severe but simple stress scenario for the MVP.

## 4. Recovery mechanics

For each affected bank:

`capacity_ratio = min(allocated_capacity / criticalLoad, 1)`

`restored_fraction = capacity_ratio × readiness`

Readiness therefore acts as a ceiling: having enough infrastructure capacity is necessary but not sufficient for complete recovery.

A bank is labelled `recovered` in the UI when `restored_fraction >= 0.80`.

## 5. Strategy A — Market Scramble

Only emergency spot-market capacity is available after the shock. v0.1 allocates this limited capacity readiness-first, representing a stylized first-mover / execution-capability advantage.

This is not a claim that real cloud markets allocate capacity this way; it is an explicit simplifying assumption.

## 6. Strategy B — Individual Reserves

A fixed reserve budget is distributed across all 20 banks proportionally to their critical workloads before the shock.

During a provider outage, each affected bank may use only its own ring-fenced reserve. Reserve belonging to unaffected banks cannot be transferred and is counted as **stranded reserve**.

## 7. Strategy C — SCFR Pooled Reserve

SCFR receives exactly the same total reserve budget as Strategy B, but reserve capacity is pooled.

After the emergency market layer is allocated, the pool is distributed across affected banks according to one of three selectable rules:

- **Systemic priority:** higher `criticalLoad × importance` first.
- **Equal allocation:** iterative equal sharing subject to each bank's remaining need.
- **Readiness first:** higher failover readiness first.

These are prototype rules, not policy recommendations.

## 8. Headline metric

The Systemic Resilience Score (SRS) is:

`SRS = Σ(w_i × r_i) / Σ(w_i) × 100`

where:

- `r_i` = restored fraction of bank *i*;
- `w_i = criticalLoad_i × importance_i`.

The metric gives more weight to disruption at banks with larger critical workloads and higher stylized systemic importance.

## 9. Secondary outputs

The interface also reports:

- banks recovered at or above the 80% threshold;
- percentage of critical workload restored;
- unmet capacity demand;
- unused / stranded reserve capacity;
- resilience frontier as reserve capacity varies from 0% to 60% of system critical load.

## 10. What v0.1 intentionally does not model

Future versions should consider:

- multi-cloud architectures and partial outages;
- geographic region failures;
- workload-specific RTO/RPO constraints;
- data replication and portability constraints;
- correlated failures at backup providers;
- contractual reservation costs;
- network and identity dependencies;
- regulatory constraints on cross-provider recovery;
- empirical calibration of concentration and readiness;
- uncertainty and Monte Carlo simulation.

## 11. Interpretation rule

All v0.1 outputs must be described as **illustrative scenario results**. They must not be presented as forecasts, empirical estimates or evidence that SCFR would achieve a specific real-world improvement.
