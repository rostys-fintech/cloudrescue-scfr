# Resilience Atlas — Design System v1.0

Status: APPROVED TARGET STATE  
Date: 2026-09-27  
Product name: **Resilience Atlas**  
Descriptor: **Systemic Cloud Resilience Lab**

This file is the visual and interaction source of truth for the redesign. Existing CloudRescue UI may temporarily differ during migration; new work must follow this document.

---

## 1. Product concept

Resilience Atlas is one systemic-resilience simulator with three modes:

1. **Simulation** — see the crisis and recovery unfold.
2. **Scenario Lab** — change assumptions and test alternatives.
3. **Model & Evidence** — understand the model, assumptions and evidence.

Primary UX idea: **See → Test → Understand**.

The same Earth/network model persists across all three modes. Screens must not become separate, unrelated infographics.

---

## 2. Brand

### Name
**Resilience Atlas**

### Descriptor
**Systemic Cloud Resilience Lab**

### Wordmark
Use a clean sans-serif wordmark:
- `Resilience` — neutral foreground
- `Atlas` — accent
- no aggressive slashes required
- small uppercase descriptor below or alongside

### Tone
Premium analytical network simulator.

Desired associations:
- systemic resilience
- financial infrastructure
- cloud dependency
- research prototype
- global network analysis
- scenario testing

Avoid:
- military dashboard
- missile-control visual language
- gaming HUD
- emergency IT support brand
- excessive cyberpunk ornament

---

## 3. Core visual principle

### One Earth, three modes

The Earth is the central visual object across the product.

It must:
- look recognizably like Earth
- show continents clearly enough to orient the viewer
- retain consistent provider positions and bank network logic across views
- carry dependency links, failure states, reserve flows and recovery states
- explain the mechanism instead of acting as decoration

Mode treatment:
- **Simulation:** cinematic, high-contrast, story-driven
- **Scenario Lab:** interactive, analytical, parameter-driven
- **Model & Evidence:** clean, annotated, explanatory

---

## 4. Color system

### Dark theme — default / Crisis-capable
Base colors:
- Canvas: `#070A0F`
- Surface: `#0D1219`
- Raised surface: `#151C25`
- Border subtle: `rgba(145, 170, 195, 0.15)`
- Text primary: `#F4F7FA`
- Text secondary: `#A8B4C2`
- Text muted: `#738194`

Functional colors:
- Primary data blue: `#35A7FF`
- Teal flow: `#27D3B2`
- Orange provider: `#F6A04D`
- Green provider: `#43D6A0`
- Warning amber: `#F0B45A`
- Critical red: `#FF4D64`

Rules:
- Red is **not** the default UI accent.
- Red appears for shock, outage, critical node, shortage alert, destructive state.
- Normal system state should read primarily blue/cyan/teal.
- Recovery should shift toward cyan/teal/green.

### Light / Analysis theme
Base colors:
- Canvas: `#F5F8FC`
- Surface: `#FFFFFF`
- Raised surface: `#F0F5FA`
- Border: `#D7E1EC`
- Text primary: `#122033`
- Text secondary: `#52647A`
- Text muted: `#7E8FA3`

Functional:
- Primary: `#1677E8`
- Teal: `#13B89A`
- Orange: `#E88735`
- Green: `#28B889`
- Warning: `#E8A335`
- Critical: `#E5485B`

Light mode must not be a simple inverted dark mode. Glow intensity, panel contrast, map layers and line opacity require separate treatment.

---

## 5. Provider identity

Provider colors remain stable across the whole product:

- **Blue Cloud** — blue
- **Orange Cloud** — orange
- **Green Cloud** — green/teal

Provider color indicates ownership/connection, not danger.

A provider failure adds a separate critical state instead of recoloring the whole product red.

---

## 6. Earth visual language

### Base Earth
Dark theme:
- deep navy oceans
- subdued, recognizable continents
- restrained city-light texture
- faint latitude/longitude or geospatial grid
- subtle atmospheric rim

Light theme:
- pale blue oceans
- low-contrast landmass
- analytical map treatment
- minimal glow

### Network layers
Earth may display:
- provider nodes
- bank nodes / clusters
- active dependency links
- disrupted dependency links
- reserve availability
- recovery flows
- affected regions

### Data flows
Use smooth Bézier curves.

Normal flow:
- 1–1.5 px
- low opacity
- small moving particles / short luminous packets
- slow, continuous movement

Do not use:
- sharp arrowheads that resemble missile trajectories
- fast ballistic arcs
- repeated red dashed paths
- explosive impact graphics

### Failure
When a provider fails:
- provider briefly pulses critical
- provider then dims/offlines
- dependent routes fade/break
- affected banks gain local red/amber states
- optional soft regional halo
- unaffected regions remain calm

### Recovery
Recovery flows:
- cyan/teal/green
- smooth rerouting
- visibly connect reserve source → pooled allocation → affected banks
- affected nodes transition red → amber → teal/green

---

## 7. Typography

Preferred stack:
`Inter, Geist, IBM Plex Sans, system-ui, sans-serif`

No decorative sci-fi font for body text.

### Scale
- Display XL: 64–88 px desktop
- Display L: 44–60 px
- H1: 36–48 px
- H2: 26–34 px
- H3: 18–22 px
- Body: 14–16 px
- Compact body: 12–13 px
- Label: 10–11 px uppercase with restrained letter-spacing

### Rules
- headings are bold but not ultra-condensed
- technical labels may use uppercase
- body copy uses sentence case
- avoid tiny 7–8 px text on desktop except nonessential micro-labels

---

## 8. Layout architecture

### Desktop
Target content width: 1440–1640 px.

Header:
- compact
- brand left
- three mode tabs centered/right
- theme toggle and utility controls right

Main layout:
- favor one large canvas + one supporting panel
- avoid nesting many framed cards

### Simulation
Default split:
- narrative / status rail: 22–28%
- Earth/system canvas: 72–78%

### Scenario Lab
Default split:
- control console: 26–30%
- Earth/system canvas: 70–74%

### Model & Evidence
- intro + model tabs
- central annotated Earth
- causal-flow strip beneath
- detailed evidence modules below

---

## 9. Responsive system

Breakpoints:
- Large desktop: `>= 1440px`
- Desktop: `1200–1439px`
- Tablet: `768–1199px`
- Mobile: `< 768px`
- Compact mobile: `< 430px`

### Mobile principle
Do not shrink desktop.

Mobile must:
- make Earth the primary visual canvas
- use single-column flow
- use bottom sheets / drawers for controls
- keep primary action full-width
- keep touch targets at least 44px
- avoid horizontal overflow
- keep timeline touch-friendly
- stack metrics vertically or 2-column when readable

Recommended mobile order:
1. compact header
2. Earth canvas
3. current scene / status
4. key metrics
5. primary action
6. progressive controls/details

---

## 10. Simulation mode

### Purpose
Experience one coherent crisis/recovery story.

### Six states
1. **Stable network**
2. **Provider failure**
3. **Capacity shortage**
4. **Stranded individual reserve**
5. **Pooled recovery / SCFR**
6. **Stabilized comparison**

### Rule
The visualization does not switch to a different infographic per scene.

The same Earth/network scene changes state.

### Narrative rail
Contains only:
- scene number
- scene title
- 1–2 sentence explanation
- max 2–3 metrics

### Timeline
Six clear stages.
Active stage is highlighted.
Completed stages remain visible but subdued.

### Voice-guided mode
When Auto-Simulation begins:
- Earth becomes more visually dominant
- nonessential controls recede
- narrative rail becomes compact
- timeline remains visible
- voice waveform may appear
- on-screen text summarizes rather than duplicates narration word-for-word

---

## 11. Scenario Lab

### Purpose
Test how assumptions change resilience outcomes.

### Control groups
**Shock**
- provider
- severity
- affected region / scope

**Prepared resilience**
- immediate backup capacity
- reserve size
- provider concentration

**Coordination**
- individual
- equal pool
- systemic priority / SCFR

### Output
Map updates in real time.

Key metrics:
- Affected banks
- Unmet capacity
- Critical workload restored
- System resilience score

### Compare mode
Compare:
- Post-shock market
- Individual reserves
- SCFR pooled reserve

Comparison should not replace the Earth.
Use a compact strip/table and optionally switch the map between mechanisms.

---

## 12. Model & Evidence

### Purpose
Explain what is simulated and why results change.

### Top
Title + concise methodology explanation.

### Central annotated Earth
Callouts:
- Cloud provider
- Dependency link
- Bank node
- Affected region
- Emergency capacity
- Reserve
- Recovery flow
- SCFR pooled reserve

### Causal chain
`Shock → Simultaneous demand → Available capacity → Reserve allocation → Recovery → Outcome`

### Detailed sections
- Network structure
- Reserve logic
- Data & assumptions
- Results & validation
- Limitations
- Reproducibility
- JSON export
- GitHub/code
- source/evidence notes

---

## 13. Components

### Buttons
Primary:
- solid primary/accent
- clear label
- no excessive glow
- one dominant CTA per view

Secondary:
- subtle border/surface
- lower emphasis

Danger:
- reserved for destructive/critical actions or shock state only

### Panels
Use restrained surfaces and subtle borders.
Only major system frames may use chamfered geometry.

Avoid a red border around every component.

### Metrics
Use:
- clear label
- large value
- optional unit
- semantic color only when meaningful

### Status chips
Examples:
- Stable
- Affected
- Offline
- Recovering
- Recovered
- Ring-fenced
- Pooled

---

## 14. Motion system

Motion must communicate system state.

### Normal
- slow particle routing
- subtle Earth drift
- small node breathing

### Shock
- one short pulse
- dependency flows fade/break
- affected nodes change state

### Shortage
- request queue builds
- available supply remains limited
- amber rather than all-red

### Ring-fenced reserve
- attempted transfer stalls
- lock state shown locally

### Pooled recovery
- cyan/teal flows reroute visibly
- reserve packets move toward affected banks

### Stabilized
- nodes transition to recovered state
- motion calms
- metrics settle

Avoid:
- violent zoom
- repeated flashing
- aggressive camera shake
- rapid blinking
- decorative animation with no semantic meaning

Respect `prefers-reduced-motion`.

---

## 15. Border and depth rules

Default:
- thin neutral border
- subtle surface difference
- low shadow

Major frame:
- optional chamfered corners
- limited accent line

Critical frame:
- temporary red accent only during warning/failure

Do not:
- put every card inside a bright red outline
- layer multiple borders on top of each other
- use more than one dominant glow within the same local region

---

## 16. Accessibility

Required:
- WCAG-friendly contrast
- keyboard-accessible controls
- focus-visible states
- no critical information conveyed by color alone
- labels on chart/metric states
- reduced motion support
- voice narration must have concise visible summary
- mobile touch targets >= 44px

---

## 17. Content principles

Each screen should answer one question.

Simulation:
**What happens?**

Scenario Lab:
**What changes if assumptions change?**

Model & Evidence:
**Why does the model produce this result?**

Avoid duplicate text and decorative labels that do not add information.

---

## 18. Migration rules

During the redesign:
- preserve model/calculation logic
- preserve bank/provider data
- preserve scenario reproducibility
- preserve narration content unless rewritten intentionally
- replace old UI incrementally but do not mix old and new visual systems in the same finished view

CloudRescue naming remains only in legacy code/content until the migration step. New UI code and documentation should use Resilience Atlas.

---

## 19. Definition of done for the redesign

The redesign is complete only when:

- one consistent Earth/network engine is used across all three modes
- dark and light themes are independently polished
- all six simulation states use one coherent visualization
- Scenario Lab controls update the shared visualization
- Model & Evidence reuses the same network language
- mobile has a dedicated responsive UX
- no overlapping legacy layers remain
- no unrelated white infographic blocks appear inside dark Simulation mode
- no missile-like flow language remains
- voice-guided mode matches the same design system
- all tests pass

---

## 20. Locked decisions

The following decisions are approved unless explicitly changed later:

- Product name: **Resilience Atlas**
- Descriptor: **Systemic Cloud Resilience Lab**
- Three modes: **Simulation / Scenario Lab / Model & Evidence**
- UX narrative: **See → Test → Understand**
- Earth is the persistent core visualization
- Dark mode is the primary cinematic mode
- Light mode is a true analysis theme
- Red is a critical-state color, not the default accent
- Flow language is data-routing, not missile/attack
- Mobile is designed separately, not merely scaled down
