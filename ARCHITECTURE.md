# Architecture

CYBERSENTINEL 2K26 is a React + TypeScript single-page application built with Vite. Its component tree is organized by user-facing feature: the landing/city experience, events and registration terminal, train timeline, character profile, and individual informational pages.

## Application flow

`src/main.tsx` initializes device-performance classes and renders the app (or the optional production-only development gate). `src/App.tsx` provides the browser router, shared mascot context, scroll manager, and background-music HUD. `src/router.tsx` maps URLs to route-level page components and lazy-loads most non-home pages.

The home page composes the cinematic intro, scroll-driven hero city, gate/transition content, navigation city, and footer. Navigation buildings are data-driven from `src/data/navigation.ts`; each building routes to a standalone page. Feature pages own their presentation and consume shared content and types from `src/data/` and `src/types/`.

The events terminal is a self-contained feature with its own retro visual language. It calls registration services through `src/services/registration/`, which isolates browser API requests from the UI. The timeline is another independent visual system: timeline schedule data, journey/world calculations, train animation, and audio are kept under the timeline components and data modules.

## Source map

```text
src/
├── animation/       # scroll progress, smooth scrolling, motion preferences
├── components/      # feature components (city, intro, events-terminal, timeline, etc.)
├── config/          # launch switches and symposium configuration
├── data/            # navigation, event, profile, timeline, and page content
├── hooks/           # responsive and viewport hooks
├── lib/             # small shared utilities
├── pages/           # route-level components
├── services/        # backend-facing clients (registration)
├── styles/          # global CSS, design tokens, breakpoints
├── types/           # shared TypeScript contracts
└── utils/           # device, navigation, registration, and session helpers
```

Final browser-served artwork lives under `public/assets/`; source artwork is kept separately under `assets-source/`. The `frontend-team-credentials/` folder is a standalone supporting app with its own package manifest.

For implemented routes, visual details, interaction flows, assets, launch switches, and local setup, see [Project details](./PROJECT_DETAILS.md) and the [README](./README.md).
