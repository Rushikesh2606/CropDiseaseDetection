# Frontend Diagnosis & Root Cause Analysis

Diagnostic report for PlantGuard AI frontend restructuring as required by Section 1.

---

## P1. Text is jumbled and text boxes are misaligned

### Observed Behavior
1. In the initial layout, the top-left logo glass pill (specified as 104×46) contained the full text string `"PlantGuard AI"`, forcing the 46px tree disc, mirrored moth, and brand text to squeeze into a 104px container. The brand text overflowed and was visually clipped as `"PlantG"`.
2. The longest headline line `"A Healthier Harvest"` (19 characters) overflowed the viewport boundary on portrait tablet viewports (820×1180 with 1.1× transform) when font-size was set to `--u * 96` (90px), causing horizontal clipping.
3. In short landscape (844×390), the hero content had `--u * 120` bottom offset and 28px element gaps, causing the 3-line headline to collide with the header navigation bar.
4. On narrow mobile viewports (390×844), horizontal actions wrapping caused `"Browse Diseases"` to collide with the vertically oriented `"SCROLL FOR DETAILS"` cue.

### Candidate Causes Investigated
- **Tailwind Preflight leaking into hero elements**: Confirmed. Tailwind Preflight resets `box-sizing`, `line-height`, `border-color` (to `currentColor` in v4), and button backgrounds. Fixed by keeping `hero.css` unlayered and namespacing every selector with `.pg-*`, with import order in `main.jsx` placing `hero.css` after `index.css`.
- **hero.css layered or imported before Tailwind**: Confirmed in initial codebase. Fixed by importing `hero.css` after `index.css` and keeping it plain unlayered CSS so custom properties and typography prevail.
- **Missing woff2 font files causing different widths**: Confirmed. Local woff2 files were not present in `public/assets/fonts/`. The `@font-face` rules with Google Fonts fallbacks (`Poppins 300` for Display, `Urbanist 600` for Brand) have slightly different character widths than RV Display. For `Poppins 300`, 19 characters at 90px spanned ~800px.
- **Headline missing nowrap or clip mask**: Ruled out. The headline lines had `white-space: nowrap` and `overflow: hidden` on `.pg-title__line`.
- **`--u` unit calculation**: Confirmed. Setting `--u` properly and using `calc(var(--u) * ...)` ensured proportional scaling.
- **Headline divisor on mobile**: Tested at 390px. With gutters `clamp(18px, 5.6vw, 32px)` = 21.84px each, available width is 346.3px. With divisor 8.7: `346.3 / 8.7 = 39.8px`. At 39.8px, `"A Healthier Harvest"` in Poppins 300 spans 341px, fitting inside gutters with 0 overflow.

### Root Cause
1. `"PlantGuard AI"` brand text was mistakenly placed inside the 104×46 logo mark pill instead of solely in the bottom-left hero copy above the 3-line headline.
2. `--title-size` was tuned to the 18-character narrow string `"Regeneration Fuels"`, requiring adjustment to `clamp(2.2rem, calc(var(--u) * 68), 4.5rem)` so `"A Healthier Harvest"` spans ~42% of 1280px reference.
3. Mobile hero content bottom offset was placed too low (`--u * 90`), colliding with the 140px tall scroll cue.

### Confirmed Fix
- Removed the brand text from inside `.pg-logo-pill`; the pill now contains only the 46px tree disc and the `#315352` mirrored moth.
- Updated `--title-size` to `clamp(2.2rem, calc(var(--u) * 68), 4.5rem)` [ASSUMED].
- In short landscape (`max-height: 500px`), clamped title to `clamp(22px, 8.5dvh, 32px)` and tightened hero content bottom to `calc(var(--u) * 24)`.
- On mobile (`max-width: 649.98px`), positioned hero content at `bottom: calc(var(--u) * 200)` so it sits cleanly above the bottom-right scroll cue.

---

## P2. No animations

### Observed Behavior
In the previous React implementation, animations were either not triggering or failing to complete, leaving elements hidden or failing on StrictMode re-renders.

### Candidate Causes Investigated
- **`video.readyState >= 2` vs `loadeddata`**: Confirmed. If the remote video loaded fast or cached, `loadeddata` already fired before `addEventListener('loadeddata')` attached, deadlocking the start trigger.
- **React StrictMode double-invocation**: Confirmed. In React 19 `StrictMode`, effects run, unmount, and re-run. Without an active cleanup and idempotency guard, animations collided or were canceled.
- **Hidden-state class timing**: Confirmed. When Web Animations API finished, elements using `fill: 'backwards'` reverted to CSS rules; without removing `.pg-entrance-hidden`, elements remained at opacity 0 or transform offset.
- **Windows OS `prefers-reduced-motion`**: Tested. When "Show animations in Windows" is turned off, `prefers-reduced-motion: reduce` evaluates to true, correctly skipping the entrance. Failsafe handles blocked video loading.
- **3.5s failsafe**: Confirmed. The failsafe was firing but was not removing all inline styles and classes consistently.

### Root Cause
Missing `video.readyState >= 2` check prior to event listener attachment, combined with lack of cleanup and removal of `.pg-entrance-hidden` upon WAAPI animation completion.

### Confirmed Fix
- Implemented `if (video.readyState >= 2) start()` before adding the `loadeddata` listener.
- Set a 3500ms failsafe timer that automatically invokes `showFinished()`.
- Implemented `prefers-reduced-motion: reduce` guard to immediately display finished page without running animations.
- When all animations finish, remove `.pg-entrance-hidden` from all elements, ensuring zero inline styles remain.

---

## P3. No segregation of the website parts (Everything mixed together)

### Observed Behavior
The homepage previously rendered analyzer drops, disease lists, and marketing copy within arbitrary nested containers with no clear section hierarchy or landmark semantic wrappers.

### Candidate Causes Investigated
Single monolithic container with no clear boundaries, conflicting viewport heights, and missing anchor IDs.

### Root Cause
Lack of component-level segregation between the 100dvh hero stage and the explanatory content sections below it.

### Confirmed Fix
Implemented Stage C architecture:
1. `#hero` - Exactly `100dvh`, `overflow: hidden`, containing ONLY the video, shade layers, header, and hero copy/actions.
2. `#how-it-works` - 4-step workflow overview inside structured `Section` wrapper.
3. `#classification` - Complete 7-block educational guide on confidence and thresholds.
4. `#detects` - 15-disease classification grid fetched dynamically from `GET /api/classes`.
5. `#model-facts` - Verified metadata fetched dynamically from `GET /api/health`.
6. `#safety` - Responsible AI disclaimer and agricultural guidance.
7. `Footer` - Unified footer with status pill and navigation.

---

## P4. Missing user-friendly content explaining how a disease is classified

### Observed Behavior
The original site showed a raw prediction card without explaining threshold checks, confidence estimation, ResNet-50 preprocessing, or why uncertainty warnings occur.

### Root Cause
Missing Stage D informational architecture and lack of non-technical explanatory copy.

### Confirmed Fix
Added the 7-block guide in `#classification`:
- Block 1: Anatomy of a result (annotated placeholder layout).
- Block 2: Confident vs. uncertain prediction cards.
- Block 3: Temperature scaling & probability calibration status.
- Block 4: Common causes of prediction uncertainty.
- Block 5: Photography tips for accurate analysis.
- Block 6: Plain-language glossary.
- Block 7: Frequently Asked Questions (FAQ) accordion.
