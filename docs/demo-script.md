# 3–5 minute demo script — CloudRescue

## 0:00–0:25 — Hook
**On screen:** CloudRescue landing view.

> Many banks can depend on the same small set of cloud providers.  
> The resilience problem is usually discussed bank by bank.  
> CloudRescue asks a different question: what happens when several banks need backup capacity at the same time?

## 0:25–1:20 — Watch the crisis
Click **Auto-play**.

Narrate only the key transitions:

1. **Normal system** — 20 synthetic banks, three synthetic cloud providers.
2. **Provider outage** — one provider fails and multiple banks become affected simultaneously.
3. **Capacity scramble** — emergency demand exceeds immediately available spot capacity.
4. **Individual reserves** — some reserve remains stranded because it is ring-fenced to unaffected banks.
5. **SCFR pooled reserve** — the same total reserve budget is pooled across affected banks.

Key sentence:

> The comparison holds the aggregate reserve constant. SCFR changes coordination, not the amount of reserve.

## 1:20–2:35 — Stress Lab
Open **Stress Lab**.

Start with the baseline preset.

Point to:
- affected banks;
- Systemic Resilience Score;
- critical workload restored;
- unmet capacity;
- unused or stranded reserve.

Then click **Severe scarcity**.

> Now I can make the post-shock market much tighter without changing the model code.

Move **Total pre-reserved capacity**.

> This lets me test how outcomes change as the reserve becomes larger or smaller.

Change **SCFR allocation rule** once.

> The allocation rule is explicit and user-selectable. In this MVP it can prioritize systemic importance, equal sharing, or technical readiness.

## 2:35–3:10 — Resilience Frontier
Scroll to the chart.

> Instead of showing only one result, CloudRescue traces the resilience frontier across reserve levels. This starts turning the demo into a research tool: the question becomes not just whether reserve capacity helps, but how much is enough and whether pooling changes the efficiency of the same reserve budget.

## 3:10–3:35 — Reproducibility
Click **Export scenario JSON**.

> Every scenario can be exported. The repository also contains the synthetic data, model logic, assumptions register and automated invariant tests.

Briefly show GitHub if recording allows.

## 3:35–4:05 — Learning journey
> My background is finance and banking, not software engineering. The main learning challenge was translating a systemic-risk idea into explicit computational assumptions, separating the model from the interface, and making sure a visually strong demo did not pretend to be empirical evidence.

## 4:05–4:30 — Close
Open **Methodology**.

> CloudRescue v0.1 is intentionally synthetic. The next stage is sensitivity analysis and empirical calibration. My goal is for the hackathon project to become a reusable research companion for the broader SCFR concept.

Final line:

> CloudRescue makes a simple systemic-risk problem visible: a plan B for one bank may not be a plan B for the system if everyone needs it at once.
