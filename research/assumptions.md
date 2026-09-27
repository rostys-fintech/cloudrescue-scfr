# Assumptions register — v0.1

This register exists so that every visually persuasive output in CloudRescue has an explicit assumption behind it.

| ID | Assumption | Why it exists in v0.1 | Research upgrade |
|---|---|---|---|
| A1 | One provider can be treated as fully unavailable during the stress window. | Creates a clear systemic shock for the MVP. | Partial outages, regional failures, duration distributions. |
| A2 | Critical workload demand is represented by abstract capacity units. | Avoids false precision about compute/storage/network quantities. | Calibrate workload classes and provider capacity metrics. |
| A3 | Failover readiness is a 0–1 ceiling. | Captures that capacity alone is insufficient for recovery. | Empirical/elicited readiness indicators. |
| A4 | Emergency market capacity is limited and immediately allocable. | Represents post-shock scarcity in a simple way. | Contract structure, timing, price and provider constraints. |
| A5 | Individual reserves are non-transferable during the crisis. | Makes fragmentation directly observable. | Contractual portability and bilateral sharing variants. |
| A6 | SCFR can reallocate pooled capacity across affected banks. | Represents the proposed coordination mechanism. | Eligibility, governance and technical compatibility rules. |
| A7 | Individual and SCFR scenarios use the same total reserve budget. | Creates a fairer mechanism comparison. | Add cost-equivalent and welfare-equivalent comparisons. |
| A8 | Systemic priority is approximated by workload × importance. | Creates a transparent allocation rule. | Regulatory criticality metrics / network centrality. |
| A9 | A bank is 'recovered' at 80% restored fraction. | Gives the UI a clear threshold. | Workload-specific service thresholds. |
| A10 | Synthetic banks are not mapped to real institutions. | Avoids unsupported institution-specific claims. | Calibrated archetypes using public aggregate evidence. |
