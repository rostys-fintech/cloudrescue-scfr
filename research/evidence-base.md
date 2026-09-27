# Evidence base — why the problem is plausible

CloudRescue v0.1 is synthetic. This file separates the **real-world motivation** from the **illustrative model outputs**.

The sources below support the existence of third-party ICT concentration and operational-resilience concerns in finance. They do **not** validate the SCFR mechanism or the numerical outputs of CloudRescue.

## 1. BIS / Financial Stability Institute — cloud risk and systemic implications

**Source:** Koh, T. Y. & Prenio, J. (2023), *Managing cloud risk – some considerations for the oversight of critical cloud service providers in the financial sector*, FSI Insights 53.  
https://www.bis.org/publications/fsi-insight-53-managing-cloud-risk-some-considerations-oversight-critical-cloud-service-providers-financial-sector

**Relevant point:** the paper notes that growing migration of critical financial services to cloud infrastructure can create systemic implications if a major cloud provider suffers an operational disruption, especially because the global market is dominated by a small number of providers.

**Why it matters for CloudRescue:** this supports the prototype's starting motivation: a provider-level shock may affect multiple financial firms simultaneously.

## 2. European Banking Authority — 2026 banking risk assessment

**Source:** EBA (2026), *Risk Assessment Report — June 2026*.  
https://www.eba.europa.eu/publications-and-media/publications/risk-assessment-report-june-2026

**Relevant point:** the EBA states that high dependency on third-party ICT providers, including cloud providers, amplifies operational-resilience risks as digital dependencies become more interconnected.

**Why it matters:** the project treats cloud dependency as an operational-resilience problem rather than only an individual IT problem.

## 3. DORA oversight — concentration risk is explicitly systemic

**Source:** European Supervisory Authorities / ESMA, *DORA Oversight*.  
https://www.esma.europa.eu/dora-oversight

**Relevant point:** the EU DORA oversight framework for critical ICT third-party providers explicitly addresses potential systemic and concentration risks arising from financial-sector reliance on a limited number of ICT providers.

**Why it matters:** CloudRescue's system-level framing is consistent with the regulatory direction of travel in the EU.

## 4. Basel / FSI — third-party concentration can become sector-level risk

**Source:** BIS Financial Stability Institute (2026), *Sound management of third-party risk — Executive Summary*.  
https://www.bis.org/publications/fsi-summary-sound-management-third-party-risk-executive-summary

**Relevant point:** concentration risk can arise from dependency on a single or limited set of third-party providers, and dependency can exist not just at an individual bank but at banking-sector level, creating systemic risk.

**Why it matters:** this supports analysing common dependencies across banks rather than treating every bank as isolated.

## 5. EBA — real operational incidents motivate scenario testing

**Source:** EBA, *Operational risks and resilience*.  
https://www.eba.europa.eu/publications-and-media/publications/operational-risks-and-resilience-0

**Relevant point:** the EBA discusses the July 2024 CrowdStrike disruption as an example of a broad third-party ICT incident affecting banks and financial services, and highlights scenario testing, concentration risk, recovery frameworks and redundancy.

**Why it matters:** CloudRescue is explicitly a scenario-testing prototype. It is not intended to reproduce the CrowdStrike event, but the incident illustrates why correlated operational disruption is a practical resilience question.

## 6. CPMI–IOSCO — third-party reliance remains an active 2026 policy issue

**Source:** CPMI–IOSCO (2026), *FMIs' reliance on third-party service providers: challenges and risks — discussion paper*.  
https://www.bis.org/publications/cpmi-iosco-fmis-reliance-third-party-service-providers-challenges-and-risks

**Relevant point:** the September 2026 discussion paper examines the increasing reliance of financial market infrastructures on third-party providers for critical services and how such reliance may amplify risks.

**Why it matters:** it shows that third-party operational dependency is still an active research and policy topic, including beyond commercial banks.

---

## Research boundary

These sources justify studying the problem. They do not establish that:

- emergency cloud capacity would be scarce by a specific amount;
- banks would require the synthetic capacity values used in v0.1;
- pooling would produce the numerical resilience improvements shown by the prototype;
- SCFR is legally, technically or economically feasible in its current conceptual form.

Those questions belong to the next stages: calibration, sensitivity analysis, feasibility research and expert validation.
