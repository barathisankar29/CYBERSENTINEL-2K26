# Architecture

CYBERSENTINEL 2K26 is a React + TypeScript + Vite site built around one central idea: **the city is the navigation system**, and everything about it — content, positions, timing, camera behavior — should be swappable without rewriting components. This document explains the structure that supports that.

Stack: React 19, TypeScript, Vite, React Router, Tailwind CSS v4. Nothing else is installed yet — see "Dependencies not yet installed" at the bottom for what's coming and why it's deferred.

## 1. Project structure

```
CYBERSENTINEL/
├── public/
│   ├── fonts/                     # self-hosted font files (@font-face in src/styles/fonts.css)
│   └── assets/                    # final, web-optimized, directly-served visual assets
│       ├── branding/college-logo/
│       ├── branding/symposium-logo/
│       ├── city/backgrounds/
│       ├── city/buildings/        # one subfolder per navigation building
│       ├── city/roads/
│       ├── city/bridges/
│       ├── city/atmosphere/       # fog, haze, gradient overlays
│       ├── metro/train/
│       ├── metro/stations/
│       ├── effects/light-trails/
│       ├── effects/particles/
│       ├── ui/holographic/        # HUD/holographic UI art
│       ├── icons/
│       ├── decorative/
│       └── mobile/                # mobile-only asset overrides (see §8)
├── assets-source/                 # raw/pre-optimization originals — never imported by app code
├── src/
│   ├── pages/                     # route-level components (thin — compose components + data)
│   ├── components/
│   │   ├── intro/                 # loading → logo → college identity → city rise → symposium reveal → camera transition
│   │   ├── city/                  # the navigable city (buildings, roads, bridges, atmosphere)
│   │   │   └── buildings/         # per-building visual components
│   │   ├── metro/                 # the timeline metro/train system (separate visual system)
│   │   │   └── stations/
│   │   ├── ui/                    # holographic UI primitives (labels, tooltips, HUD chrome)
│   │   ├── layout/                # shared structural wrappers
│   │   └── common/                # generic reusable components (loader, error boundary, etc.)
│   ├── animation/                 # scroll/camera/timing system — see §6
│   ├── hooks/                     # generic reusable hooks (responsive, a11y, IO, preloading)
│   ├── store/                     # global state (empty until a state library is added — see bottom)
│   ├── data/                      # content/config, separate from components — see §7
│   ├── types/                     # shared TypeScript types for data/content
│   ├── styles/                    # global CSS, design tokens, breakpoints
│   ├── lib/                       # small framework-agnostic utilities
│   └── assets/                    # small assets that should go through the JS bundler (e.g. inline icon components) — NOT for city/building imagery, see §3
├── scripts/                       # future build/asset-optimization scripts (empty for now)
├── ARCHITECTURE.md
└── README.md
```

Every otherwise-empty folder has a `.gitkeep` so the structure is real in git from the start, not just in this document.

## 2. Purpose of important folders

- **`src/pages/`** — one component per route. These stay thin: they pick data from `src/data/` and compose components from `src/components/`. `SectionPage.tsx` is deliberately generic (resolves `:slug` against `src/data/sections.ts`) rather than one file per section, because the section list isn't final yet.
- **`src/components/intro/`** — the opening sequence only (dark screen → loading → college logo/name/details → city rising → symposium name/info → identity fade-out → camera transition to aerial). This is a self-contained system; nothing outside it should need to know its internal steps.
- **`src/components/city/`** — the persistent navigable city: buildings, roads, bridges, atmosphere/fog. One `Building` concept driven by `src/data/navigation.ts`, plus a `buildings/` subfolder for per-building visual variants once "distinctive architecture" is designed.
- **`src/components/metro/`** — the timeline's metro/train system. Kept fully separate from `city/` per the brief ("treated as a separate major visual system"), with its own `stations/` subfolder and its own asset tree (`public/assets/metro/`).
- **`src/animation/`** — see §6.
- **`src/data/`** + **`src/types/`** — see §7.
- **`src/store/`** — reserved for cross-component state (e.g. current camera state, hovered/active building, intro-sequence phase) once a state library is added. Left empty rather than using React context prematurely, since the right tool depends on how much cross-cutting state the intro/city/metro systems end up sharing.

## 3. Where generated assets go

Two trees, deliberately kept apart:

- **`assets-source/`** — raw or pre-optimization originals (e.g. first-pass AI-generated renders, layered exports, generation prompts/notes). Never imported by application code. This is the working area before an asset is cropped/compressed/converted.
- **`public/assets/`** — the final, web-optimized version of an asset, organized by the same categories listed in §1. Served as static files and referenced by URL (`/assets/city/buildings/...`), which is what allows lazy-loading and responsive `<img srcset>` / `<picture>` without the bundler trying to process large binaries.

Small assets that genuinely benefit from bundler processing (e.g. an SVG icon imported as a React component) go in `src/assets/`, not `public/assets/`. City/building/metro imagery should never live there — it's large, cinematic, and meant to be lazily loaded by URL, not inlined into a JS bundle.

## 4. Where fonts go

Font files go in `public/fonts/`. `@font-face` declarations live in `src/styles/fonts.css` (currently an empty template) and reference them as `/fonts/<file>`. `src/styles/tokens.css` defines `--font-display` / `--font-body` so components never hardcode a font-family string.

## 5. Where city/building assets go

`public/assets/city/buildings/` — one subfolder per building is expected once designs exist. Each `NavigationBuilding` entry in `src/data/navigation.ts` carries an `assetPath` field so the data (which building exists, what section it links to, where it sits in each layout) and the art (what it looks like) are connected by config, not by a component hardcoding a filename.

## 6. Where animation logic lives

`src/animation/` is the single place that owns _how_ motion behaves, so timing/positions can be retuned without touching component markup:

- `timingConfig.ts` — named durations/easings for the intro sequence (placeholder values, meant to be tuned once the sequence is built).
- `cameraTransitions.ts` — camera keyframe _data_ (`CameraState`: `intro` → `cityRising` → `aerial`), with desktop/mobile positions kept side by side per keyframe.
- `scrollController.ts` — the scroll-progress abstraction. It's a stub today (`useScrollProgress` returns a static value) because the backing implementation (Framer Motion's `useScroll`, GSAP `ScrollTrigger`, or a hand-rolled `IntersectionObserver` controller) is a first-screen implementation decision. Components should only ever import from this module, not from whichever library ends up implementing it — that's what lets the library choice change later without a rewrite.
- `useReducedMotion.ts` — OS-level reduced-motion preference, already wired; `src/styles/globals.css` also has a CSS-level fallback (`prefers-reduced-motion`) for anything that isn't JS-driven.

Components in `city/`, `intro/`, and `metro/` should consume this module rather than each rolling their own scroll math or duration constants.

## 7. Where page content lives

Content/config is kept out of components entirely, under `src/data/` (values) and `src/types/` (shapes):

- `data/college.ts` / `data/symposium.ts` — college and symposium identity (name, logo path, tagline). Already populated with the real names given.
- `data/sections.ts` — the canonical section list. **Empty on purpose** — the real sections (About/Events/Registration/etc.) haven't been finalized, and routing + any future menu UI read from this file, so the list can change in one place.
- `data/navigation.ts` — the navigation buildings, each pointing at a `sectionSlug` from `sections.ts`, with independent desktop/mobile positions. Also empty until building designs exist.
- `data/timeline.ts` — metro stations for the timeline system. Also empty pending real event data.

Nothing in `components/` should have section names, copy, or building lists hardcoded — it should all flow from this layer.

## 8. How desktop/mobile behavior is separated

Per the brief, mobile is **not** a scaled-down desktop city — it's a different camera composition over the same world. That's modeled directly in the data, not in CSS breakpoints alone:

- `CityPosition` (in `src/types/navigation.ts`) and `CameraKeyframe` (in `src/animation/cameraTransitions.ts`) both carry a `desktop` and a `mobile` variant side by side.
- `src/hooks/useIsMobile.ts` (built on `useMediaQuery.ts` and the shared breakpoint in `src/styles/breakpoints.ts`) is what components branch on to pick which variant to render/animate toward.
- `public/assets/mobile/` exists for the rare case where a mobile viewport needs a genuinely different asset (not just a different camera position), e.g. a pre-composited compact background.

This keeps "desktop shows 5–6 buildings at a wide angle" vs. "mobile shows a compact, higher-angle view with large labels" as a data/config difference, not two parallel component trees.

## 9. Future 3D/WebGL integration

Nothing here assumes DOM/CSS-only rendering long-term. The structure is meant to absorb a 3D layer (e.g. Three.js / React Three Fiber) without a reorganization:

- `src/components/city/` and `src/components/metro/` are already the boundary between "navigation/content" and "how it's rendered" — a 2D (CSS/SVG) `Building` component and a future 3D one would live at the same path and consume the same `src/data/navigation.ts` + `src/animation/cameraTransitions.ts`, just rendering differently internally.
- `src/animation/scrollController.ts` and `cameraTransitions.ts` already model camera state as data (`CameraState`, keyframes with positions), which is the same shape a WebGL camera rig needs — a 3D renderer would consume these, not require new data plumbing.
- Heavy 3D assets (models, textures) would get their own `public/assets/` subfolder alongside the existing categories, following the same "raw in `assets-source/`, optimized in `public/assets/`" split.
- No 3D library is installed now, in line with "don't introduce heavy libraries until needed" — see below.

## Dependencies installed

| Package                                                                                                                                    | Reason                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `react`, `react-dom`                                                                                                                       | UI runtime.                                                                                                                                                                                                                          |
| `react-router-dom`                                                                                                                         | Section routing (`/`, `/:slug`) — needed for the "building click → navigate to section" flow and direct-link-able sections.                                                                                                          |
| `vite`, `@vitejs/plugin-react`                                                                                                             | Build tool + fast HMR; scaffolded project default.                                                                                                                                                                                   |
| `typescript`                                                                                                                               | Type safety across data-driven config (`NavigationBuilding`, `SiteSection`, etc.) — matters most here because so much of the app is meant to be config-driven.                                                                       |
| `tailwindcss`, `@tailwindcss/vite`                                                                                                         | Utility CSS with first-class dark-theme support; v4's CSS-based `@theme` config lets the color tokens in `src/styles/tokens.css` (including the gold-scoping rule) drive Tailwind directly, no separate `tailwind.config.js` needed. |
| `eslint`, `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-jsx-a11y` | Linting — flat config (`eslint.config.js`) with TypeScript, React, hooks, Vite Fast Refresh, and accessibility rules.                                                                                                                |
| `prettier`                                                                                                                                 | Consistent formatting (`npm run format`).                                                                                                                                                                                            |

## Dependencies recommended, not yet installed

Deliberately left out until the first screen actually needs them, per "don't introduce heavy libraries until they're needed":

| Package                                              | Why it's a likely future need                                                                                                                                                            | Why it's deferred                                                                                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `framer-motion`                                      | Declarative scroll/viewport-driven animation and page-transition orchestration; would back `src/animation/scrollController.ts`.                                                          | Choice between this and GSAP affects `scrollController.ts`'s implementation — better decided when building the intro sequence, not before. |
| `gsap` (+ `ScrollTrigger`)                           | Alternative for finer-grained, timeline-based scroll choreography (often preferred for cinematic camera-style sequences like the city rise/aerial transition).                           | Same as above — pick one scroll-animation library when the intro sequence is actually built, not speculatively.                            |
| `zustand`                                            | Lightweight global state for things like current camera state, hovered/active building, or intro-sequence phase, once that state needs to be shared across `intro/`, `city/`, and `ui/`. | `src/store/` is empty because it's not yet clear how much state actually needs to be global vs. local — adding this now would be a guess.  |
| `three` + `@react-three/fiber` + `@react-three/drei` | The explicit "future 3D/WebGL integration" path (§9).                                                                                                                                    | Explicitly out of scope until the CSS/SVG-based city proves it needs a 3D upgrade — heaviest dependency on the list.                       |
| `clsx` / `tailwind-merge`                            | Nicer conditional Tailwind class composition than the current hand-rolled `src/lib/cn.ts`.                                                                                               | `cn.ts` covers current needs; upgrade only if class-conflict bugs show up.                                                                 |

## Dependencies not needed for this project

- No CMS/backend client — no backend has been discussed yet; `src/data/` covers content for now.
- No test runner configured — not requested; can be added (Vitest pairs naturally with Vite) once there's behavior worth testing.

## Files ready for first-screen implementation

- `src/pages/HomePage.tsx` — currently an empty `<main>` shell; this is where the intro sequence + city navigation experience gets built.
- `src/components/intro/` — empty, ready for the loading/logo/identity/city-rise/camera-transition components.
- `src/data/college.ts`, `src/data/symposium.ts` — already populated with real content, ready to be rendered.
- `src/styles/tokens.css` — color tokens are defined and the gold-scoping rule is documented inline; ready to extend as real UI is built.
- `src/animation/timingConfig.ts` — placeholder durations ready to be tuned once the sequence has real motion.

Routing (`src/router.tsx`), `SectionPage.tsx`, and `NotFoundPage.tsx` are wired but intentionally minimal until section content exists.
