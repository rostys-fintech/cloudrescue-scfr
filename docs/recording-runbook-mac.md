# CloudRescue — Recording & Screenshot Runbook (Mac)

Use this only after the final institutional v2 build is live.

## A. Prepare the browser

1. Open the live prototype:
   https://rostys-fintech.github.io/cloudrescue-scfr/
2. Hard refresh once: **Cmd + Shift + R**.
3. Use a clean Chrome window.
4. Close unrelated tabs.
5. Hide the bookmarks bar if visible: **Cmd + Shift + B**.
6. Set browser zoom to **90%** first.
7. If any key content is cut off, use **80%**. Do not go below 80% unless absolutely necessary.
8. Keep the default light application theme for the recording:
   - hero remains dark;
   - Crisis Replay canvas remains dark;
   - Stress Lab control rail remains dark;
   - Controlled Comparison remains dark.
9. Disable browser notifications / Do Not Disturb on macOS.
10. Close mail, messaging and other apps that could generate pop-ups.

## B. Test audio before the real recording

The final demo should include clear spoken explanation.

Before the real take:

1. Record a **10-second test**.
2. Trigger CloudRescue narration.
3. Play the test file.
4. Confirm:
   - your microphone is audible;
   - CloudRescue browser narration is audible;
   - neither source clips or overwhelms the other.

If your recording method does not capture browser/system audio, do **not** discover this after the full take.

### Practical recording options

**Option 1 — OBS Studio**
Best if you need both:
- your microphone;
- browser/system narration.

Use one browser/window capture and test macOS audio capture first.

**Option 2 — macOS screen recording**
Use **Cmd + Shift + 5**.

This is simplest, but verify with the 10-second test that it captures every audio source you need on your Mac configuration.

## C. Final recording framing

Target:
- **1920×1080** if possible;
- landscape 16:9;
- 3:45–4:10;
- no rapid mouse movement;
- no unnecessary browser resizing during the take.

Keep the cursor near the feature being explained, but do not circle elements repeatedly.

## D. Exact video route

### 0:00 — Hero
Start at the very top.

Visible:
- CloudRescue;
- topology preview;
- core hypothesis;
- Run guided replay;
- Open Stress Lab.

Do not scroll during the opening sentence.

### 0:18 — Crisis Replay
Click **Run guided replay**.

Use Focus View only if it clearly improves the capture.

Show:
1. shared dependency;
2. provider outage;
3. simultaneous demand;
4. reserve fragmentation;
5. pooled SCFR allocation;
6. final mechanism comparison.

### 1:18 — Stress Lab
Open **Stress Lab**.

Change only:
- failed provider;
- emergency-market capacity;
- reserve budget.

Avoid touching every control.

### 1:38 — Reproducibility
Seed:
**FIRSTCOMMIT**

Generate scenario.

Show:
- Scenario ID;
- Copy scenario link;
- Export JSON.

### 1:52 — Replay the changed scenario
Click **Replay scenario**.

Let the viewer see that the guided visualization has changed with the Stress Lab assumptions.

Return to Stress Lab.

### 2:05 — Controlled Comparison
Scroll to the full comparison.

Stop moving the mouse.

Hold the screen for at least **2 seconds** before speaking.

Point out:
- failed provider;
- affected banks;
- emergency market;
- reserve budget;
- Individual Reserves;
- SCFR;
- resilience uplift;
- stranded reserve effect.

### 2:38 — Sensitivity Explorer
Show **SCFR uplift** mode.

Do not spend time reading every cell.

### 2:58 — Methodology
Open **Methodology**.

Show:
- Research Framework;
- architecture;
- real vs synthetic boundary.

### 3:32 — Development Journey
Show **Development Journey · FirstCommit**.

Finish with the learning story.

### 3:52 — Closing frame
Best closing frame:
**Controlled Comparison**

Alternative:
the dark **CloudRescue hero**.

Hold 2 seconds after the final sentence before stopping the recording.

## E. Immediately capture screenshots after the video

Do not change the browser width or zoom.

Capture these in the same session:

1. **Hero**
2. **Crisis Replay — provider outage**
3. **Crisis Replay — reserve fragmentation**
4. **Crisis Replay — SCFR allocation**
5. **Controlled Comparison**
6. **Stress Lab**
7. **Sensitivity Explorer**
8. **Methodology**
9. **Development Journey**

### Mac screenshot shortcut

Use:
**Cmd + Shift + 4**

Then drag the browser content area consistently.

For a full window:
**Cmd + Shift + 4**, then press **Space**, then click the Chrome window.

Use the same method for every screenshot.

## F. Screenshot naming

Rename files immediately:

- 01-cloudrescue-hero.png
- 02-shared-provider-outage.png
- 03-reserve-fragmentation.png
- 04-scfr-allocation.png
- 05-controlled-comparison.png
- 06-stress-lab.png
- 07-sensitivity-explorer.png
- 08-methodology.png
- 09-development-journey.png

## G. Best Devpost order

1. Hero
2. Controlled Comparison
3. Shared-provider outage
4. Reserve fragmentation
5. SCFR allocation
6. Stress Lab
7. Sensitivity Explorer
8. Methodology
9. Development Journey

## H. 60-second final recording QA

Before uploading the video:

- [ ] starts immediately with product/problem;
- [ ] no private notifications;
- [ ] no unrelated tabs visible;
- [ ] your speech is clear;
- [ ] built-in narration is clear;
- [ ] no narration overlap;
- [ ] Controlled Comparison is readable;
- [ ] real vs synthetic distinction is stated;
- [ ] Development Journey is shown;
- [ ] final video is 3–5 minutes;
- [ ] watched once from beginning to end.

If all ten are true, upload it and stop editing.
