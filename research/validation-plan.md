# Research validation plan — from prototype to academic use

CloudRescue v0.1 is a **mechanism prototype**, not an empirical result. This document defines the path required before the model can support academic or policy claims.

## Stage 1 — Internal validity of the mechanism model

Goal: verify that the simulator behaves consistently with its own explicit rules.

Current checks:
- resilience scores remain within valid bounds;
- reserve use cannot exceed the reserve budget;
- Individual Reserves and SCFR use the same aggregate reserve budget;
- increasing pooled reserve does not reduce the SCFR resilience frontier in the deterministic v0.1 setup;
- every provider shock affects only the banks assigned to that provider.

Planned:
- property-based tests across many parameter combinations;
- allocation-rule edge cases;
- zero-capacity and full-capacity boundary cases;
- alternative recovery thresholds.

## Stage 2 — Sensitivity analysis

Goal: identify which assumptions drive the results.

Parameters to vary:
- provider concentration;
- emergency market capacity;
- total reserve size;
- bank-level failover readiness;
- systemic-importance weighting;
- allocation rule;
- outage severity and duration.

Outputs:
- resilience distributions rather than one headline number;
- threshold analysis for reserve adequacy;
- regions where pooling adds little value;
- regions where fragmentation becomes material.

## Stage 3 — Empirical calibration

Goal: replace synthetic values where defensible public evidence exists.

Potential evidence categories:
- aggregate cloud / ICT third-party concentration;
- public operational-resilience incidents;
- regulatory material on critical ICT dependencies;
- recovery-time and continuity requirements;
- cloud architecture and portability constraints;
- public information on critical third-party providers.

Important constraint:
bank-by-bank cloud dependency data may be commercially sensitive or unavailable. The research may therefore require calibrated archetypes rather than named-bank estimates.

## Stage 4 — Expert validation

Goal: test whether the mechanism is operationally plausible.

Potential interview / review groups:
- bank operational-resilience professionals;
- cloud / infrastructure specialists;
- supervisory or regulatory researchers;
- business-continuity and disaster-recovery practitioners.

Questions:
- Is simultaneous backup-capacity scarcity plausible under severe common shocks?
- Which workloads could realistically move between environments?
- What technical prerequisites would be required before a pooled reserve is usable?
- Which governance and liability constraints are binding?
- Which allocation rules would be unacceptable or impractical?

## Stage 5 — Economic and governance layer

Goal: move from engineering resilience to implementability.

Add:
- reservation cost;
- participant contributions;
- provider compensation;
- activation conditions;
- moral-hazard safeguards;
- minimum readiness requirements;
- priority rules;
- cross-border and legal constraints.

This is essential: a mechanism that improves a synthetic resilience score may still be economically or institutionally infeasible.

## Stage 6 — Research outputs

### Bundesbank / financial-stability version
Focus:
- systemic third-party concentration;
- common operational shocks;
- capacity scarcity;
- scenario analysis and sensitivity;
- implications for financial stability and operational resilience.

### DAAD research proposal
Use CloudRescue as **preliminary work**:
- research concept already formalized;
- first model implemented;
- assumptions made explicit;
- next research stage clearly defined;
- empirical calibration and expert validation can become the work programme.

### St. Gallen solution version
Use the visual simulator to communicate:
- why institution-level backup plans can fail at system level;
- why coordination before a crisis matters;
- what the proposed mechanism would need to implement successfully.

The competition text itself should remain independently written for the competition and should not simply duplicate research prose.

## Rule for interpretation

A result from CloudRescue becomes research evidence only after the assumptions behind that result are supported, calibrated or explicitly stress-tested.

Until then, the correct wording is:

> "In an illustrative synthetic scenario, the model shows…"

not:

> "SCFR would improve real banking-system resilience by…"
