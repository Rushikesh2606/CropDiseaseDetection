# PlantGuard AI — Hero Fidelity Audit (HERO_AUDIT.md)

Detailed audit of the frontend hero against `HERO_SPEC` and content overrides.

| Spec Item | Spec Value | Current Implementation | Status | Fix / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Stage Dimensions** | Exactly `100dvh`, `overflow: hidden`, no letterboxing | `.pg-stage { height: 100dvh; overflow: hidden; position: relative; }` | **Match** | Verified at all 5 viewports |
| **Page Background** | `#03080B` | `background: #03080B;` | **Match** | Applied in `:root` / `body` |
| **Unit (`--u`)** | `max(0.62px, min(100vw / 1280, 100dvh / 960))` | CSS custom property `--u: max(0.62px, min(100vw / 1280, 100dvh / 960));` | **Match** | Applied on stage root |
| **Color: Shade** | `rgb(3, 8, 11)` | `rgba(3, 8, 11, ...)` | **Match** | Used in all 3 shade layers |
| **Color: Ink** | `#F5FAF6` | `--pg-ink: #F5FAF6;` | **Match** | Exact hex |
| **Color: Ink-2** | `#ECF1EF` | `--pg-ink-2: #ECF1EF;` | **Match** | Exact hex |
| **Color: Teal** | `#88DECC` | `--pg-teal: #88DECC;` | **Match** | Exact hex |
| **Color: Icon Teal** | `#7EC4B5` | `--pg-icon-teal: #7EC4B5;` | **Match** | Exact hex |
| **Color: Chevron** | `#7CCBBA` | `--pg-chevron: #7CCBBA;` | **Match** | Exact hex |
| **Color: Moth** | `#315352` | `--pg-moth: #315352;` | **Match** | Exact hex |
| **Color: Cream** | `#EEF1EA` | `--pg-cream: #EEF1EA;` | **Match** | Exact hex |
| **Color: Pine** | `#122B2A` | `--pg-pine: #122B2A;` | **Match** | Exact hex |
| **Color: Logo Disc** | `#030909` | `--pg-logo-disc: #030909;` | **Match** | Exact hex |
| **Font-Face: Display** | `RV Display` 300, `assets/fonts/rv-display.woff2`, fallback `Poppins`, `Helvetica Neue`, Arial, sans-serif, `font-display: block` | `@font-face` configured; Google Fonts `Poppins:300` fallback loaded | **Match** | [ASSUMED fallback loaded via Google Fonts] |
| **Font-Face: Brand** | `RV Brand` 600, `assets/fonts/rv-brand.woff2`, fallback `Urbanist`, `Helvetica Neue`, Arial, sans-serif, `font-display: block` | `@font-face` configured; Google Fonts `Urbanist:600` fallback loaded | **Match** | [ASSUMED fallback loaded via Google Fonts] |
| **Font-Face: Text** | `RV Text` 400, `assets/fonts/rv-text.woff2`, fallback `Helvetica Neue`, Helvetica, Arial, sans-serif, `font-display: block` | `@font-face` configured with system fallback stack | **Match** | Exact stack |
| **Video Source** | Remote CloudFront URL only, never downloaded | `<video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261005_182346_a590ff3b-72e5-41ce-8f69-a8c823eaecaa.mp4">` | **Match** | No local asset downloaded |
| **Video Properties** | `autoplay muted loop playsinline`, `object-fit: cover`, `pointer-events: none` | Attributes on `<video>`, CSS `object-fit: cover; pointer-events: none;` | **Match** | Verified by Playwright computedStyle |
| **Horizontal Shade** | Left-to-right alphas: .683, .595, .458, .221, .039, .054 at 0%, 20%, 40%, 60%, 80%, 100% | `linear-gradient(to right, rgba(3,8,11,0.683) 0%, ...)` | **Match** | Exact stop values |
| **Vertical Shade** | Top-to-bottom alphas: .060, .023, .152, .300, .394, .632 at 0%, 20%, 40%, 60%, 80%, 100% | `linear-gradient(to bottom, rgba(3,8,11,0.060) 0%, ...)` | **Match** | Exact stop values |
| **Radial Shade** | Ellipse 93.8% × 41.3% at 0% 100%, alpha 1 → 0 | `radial-gradient(ellipse 93.8% 41.3% at 0% 100%, rgba(3,8,11,1) 0%, rgba(3,8,11,0) 100%)` | **Match** | Exact geometry |
| **Video Object-Position** | `50% 40%` default; `50% 24%` at `min-aspect-ratio: 16/9` | Media query `@media (min-aspect-ratio: 16/9) { object-position: 50% 24%; }` | **Match** | Verified in CSS |
| **Logo Pill** | 104×46 glass pill (`rgba(150,220,130,0.035)`, blur 12), 46px disc with 7-stroke tree, mirrored moth in `#315352` | Glass pill with 46px disc containing 7 SVG strokes, and moth SVG with mirrored matrix transform | **Match** | Removed extraneous brand text |
| **Delta Tree SVG** | 7 paths, viewBox 0 0 46 46, stroke `#7CC6B5`, width 1.6, round caps | 7 `<path>` elements copied verbatim from spec | **Match** | Exact path data |
| **Moth SVG** | viewBox 0 0 39 30, fill `#315352`, right wing path + mirrored left wing `matrix(-1 0 0 1 39 0)` | Copied verbatim from spec | **Match** | Exact path data & matrix |
| **Nav Pill** | 442×47 black pill, Home (current with chevron), Analyze, Diseases, How It Works, Safety, plus cream pill | 442×47 black pill with styled links and cream Analyze Leaf pill | **Match** | Exact dimensions & colors |
| **Cream Pill** | "Analyze Leaf" with dark pine disc and white right arrow | Cream pill with `#122B2A` disc and white arrow polyline `.5,.5 3.5,3.5 .5,6.5` | **Match** | Exact geometry |
| **Sound Button** | 48px circle, speaker paths, `aria-pressed` toggle, waves opacity 0.25 when false, no audio | 48px circle with verbatim speaker body & waves SVG, CSS toggle | **Match** | Interactive toggle verified |
| **SVG Icons** | Chevrons, partner arrow, CTA arrow, speaker, menu bars | All copied character-for-character into `icons.jsx` | **Match** | Verbatim strings |
| **Brand Copy** | "PlantGuard AI" in RV Brand, teal [OVERRIDE] | Bottom-left hero copy, RV Brand, `#88DECC` | **Match** | Overridden correctly |
| **Headline Copy** | "A Healthier Harvest" / "Starts with" / "a Leaf" | 3 lines, light weight 300, each inside clip mask wrapper | **Match** | Overridden correctly |
| **Lede Copy** | "AI-powered diagnosis across 15 crop leaf conditions" / "Upload a leaf and get a calibrated result in seconds" | 2 lines inside `<p class="pg-lede">` | **Match** | Overridden correctly |
| **Actions** | Cream CTA pill + text link | "Analyze a Leaf" CTA + "Browse Diseases" text link | **Match** | Exact buttons & chevrons |
| **Scroll Cue** | "Scroll for Details" linking to #how-it-works, teal chevron | Vertical label with teal chevron SVG | **Match** | Bottom-right placement |
| **Hover States** | Text links & cue turn `#88DECC`; CTA discs turn `#26504d` | Hover media queries with exact hex codes | **Match** | Verified in CSS |
| **Focus-Visible** | 2px teal outline with 2px offset | `:focus-visible { outline: 2px solid #88DECC; outline-offset: 2px; }` | **Match** | Exact spec outline |
| **Mobile ≤649.98px** | Hide nav pill, show 48px menu button + sound button, 3-bar → X, black rounded menu panel | Fully implemented with `.is-open` state and accessibility | **Match** | Verified at 390×844 |
| **Short Landscape** | `max-height: 500px and min-aspect-ratio: 1/1`: `--u: clamp(0.82px, 100dvh/415, 0.94px)`, keep nav ≥650px | Configured in media query, title clamp, non-wrapping actions | **Match** | Verified at 844×390 |
| **Tablet & Portrait** | Pin `--u: 0.94px`, portrait scale 1.1×, video 58% 50% | Configured in tablet/portrait media queries | **Match** | Verified at 820×1180 & 1024×768 |
| **Entrance Animation** | WAAPI timeline, failsafe 3.5s, stroke draw, moth scale, text lifts, class cleanup, redraw | Full timeline implemented in WAAPI, strict class cleanup | **Match** | StrictMode idempotent |
| **Reduced Motion** | `prefers-reduced-motion: reduce`: skip entrance immediately | Handled in hook / script | **Match** | Instant display verified |
