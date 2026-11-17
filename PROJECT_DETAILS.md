# CYBERSENTINEL 2K26 — Project Details

This document describes the project as it is implemented in this repository. For local setup and commands, start with the [README](./README.md).

## Project at a glance

CYBERSENTINEL 2K26 is a symposium website for Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College. It combines event information and participant registration with a cyberpunk-city presentation:

- A cinematic video introduction leads into a layered city hero.
- Scrolling reveals a second city scene whose buildings are the primary section navigation.
- Individual pages cover symposium information, events, the programme timeline, transportation, contacts, and team credentials.
- A retro, game-inspired terminal presents event discovery, player-themed registration packs, registration lookup, and team creation.
- A character dossier at `/profile` presents a participant-facing dashboard when character/registration data is available.

The site is a client-rendered single-page application. There is no general-purpose site CMS or frontend authentication system.

## Design and visual language

### Main site

The visual theme is a dark, atmospheric cyberpunk city with cinematic layered artwork, neon accents, HUD-style overlays, scanlines, light trails, fog, rain, particles, reflections, and glow effects.

| Design role | Tokens / treatment |
| --- | --- |
| Base | Near-black `#05040a`, deep indigo `#0b0a1a`, and translucent dark surfaces. |
| City accents | Violet, magenta, pink, electric blue, and cyan (`--city-*` tokens). |
| College identity | Gold and black (`--identity-*` tokens), reserved for college identity/intro treatments rather than the city navigation. |
| Display type | Orbitron, with a system sans-serif fallback. |
| Body type | Rajdhani, with a system sans-serif fallback. |
| General UI | Responsive neon cards, glass/HUD details, city labels, floating controls, image-led panels, and dark backgrounds. |

The main font set (Orbitron, Rajdhani, Bangers, and Share Tech Mono) is loaded from Google Fonts in `index.html`. The events terminal loads its pixel/retro font set only while that feature is mounted.

### Events terminal

The `/events` experience intentionally has a different visual system: a retro computer terminal with pixel typography, CRT scanlines, pixel-window frames, dither bars, per-screen neon borders, and optional interface sound. Its CSS is scoped under `.cft-root` so the terminal treatment does not restyle the rest of the site.

### Character identity

The character dossier has four distinct accent palettes: Nico (blue), Ruelle (violet), Dr. Dacre (teal), and Cosma (gold). Each has dedicated portrait/crest artwork and data-driven text and colors.

## Landing page and city navigation

The home route (`/`) is assembled in `src/pages/HomePage.tsx` in this order:

1. **Intro video** — selects desktop or mobile video, begins muted, offers audio and skip controls, supports `Escape` to skip and `M` to toggle audio, and includes a captions track.
2. **Futuristic transition** — a short, staged shutter/laser/decode-style reveal before the landing scene is exposed. It shortens for reduced-motion preferences.
3. **Hero city** — a sticky viewport over a long scroll section. The visitor's scroll progress drives the city layers and identity reveal; atmospheric rain and particles add motion. The reveal completes before the next section takes over.
4. **Gate and navigation city** — the navigation-city scene leads to the site footer. Six independent building landmarks link to their corresponding sections.

The intro sequence is shown on a fresh page load. Within the same browser session, returning from a section skips back to the city; the `/#buildings` link and browser-back handling can return visitors directly to the building scene.

### Building-based navigation

The landmarks are configured in `src/data/navigation.ts`, typed in `src/types/navigation.ts`, and rendered by `src/components/city/buildings/Building.tsx`. Their asset, destination, title, accent, depth, and desktop/mobile coordinates are configured independently; there is no shared building row or grid positioning rule.

The six navigation destinations are:

| Building | Destination | What it opens |
| --- | --- | --- |
| Events | `/events` | Event catalogue and registration terminal. |
| Timeline | `/timeline` | The Sentinel Journey train timeline. |
| About | `/about` | College and symposium information. |
| Transport | `/transportation` | College transit information and campus navigation. |
| Coordinators | `/credentials` | Coordinators, contributors, and development team information. |
| Contact | `/contact` | Contact details and contact terminal. |

On desktop, the six buildings share one short pinned scene; one scroll threshold reveals all six together. Their final positions are authored separately in the navigation data. Mobile uses a separate in-flow composition and mobile-specific coordinates/assets rather than simply scaling the desktop scene. The timeline landmark is a wide canvas with a custom tower anchor.

`ScrollManager` handles clean top-of-page navigation, manual scroll restoration, and direct `/#buildings` arrivals. Building links open standalone pages with a back control rather than rendering all section pages below the home city. The intro-to-hero sequence is cinematic; ordinary route changes are not a site-wide animated page-transition system.

## Pages and routes

| Route | Feature |
| --- | --- |
| `/` | Video intro, scroll-driven city hero, building navigation, footer. |
| `/about` | College, symposium, Hackathon Club, leadership, and organizer information. |
| `/events` | Retro terminal with event listing, event details, favourites/registration lookup, and team features. |
| `/timeline` | Train-based two-day programme journey. |
| `/transportation` and `/transport` | Transportation guidance, transit details, campus map/navigation. |
| `/credentials` and `/coordinators` | Coordinator, design, editing, student, and developer credits. |
| `/contact` and `/contacts` | Organizing-team contact terminal. |
| `/register` | Opens the same player-pack registration flow as event registration. |
| `/register/status`, `/checkStatus`, `/checkstatus`, `/check-status`, `/payment-status` | Registration status / “My Registrations” terminal screen. |
| `/register/team` | Team creation screen. |
| `/profile` | Character dossier dashboard. A valid `?char=` value can preview a character. |
| `/:slug` | Generic section fallback resolved against the section data; specialized routes take precedence. |
| Unknown route | Not-found page. |

Non-home pages are lazy-loaded where configured in `src/router.tsx`. The router warms selected page chunks when the browser is idle; low-memory devices avoid prefetching, and mobile skips the map-heavy transportation page.

## Events and game-inspired registration

### Events catalogue

The event definitions live in `src/data/eventsTerminalData.ts`. The terminal organizes 13 listed events into All, Day 1, Day 2, and Special filters:

- **Day 1:** Paper Presentation, Unsaid, Cipher Coding, Weblica, XCoders.
- **Day 2:** Spotlight, Connections, Find the BGM, Mixed Signals, Lost in Lyrics.
- **Special:** Group Dance, E-Sports, Thiruvizha Corner.

Event detail screens show descriptions, schedule fields, team sizes, coordinators, and event-specific rules/protocols. Registration status and some special-event prices can be loaded from the backend. Bookmarks are a browser-local convenience.

### Character packs

The “Choose your player” presentation makes registration feel like selecting a game character/protocol. These are registration packages, not login identities:

| Character | Registration mapping |
| --- | --- |
| Nico | Day 1 pack. |
| Ruelle | Day 2 pack. |
| Dr. Dacre | Special-event selections; Thiruvizha Corner is marked closed in the current pack configuration. |
| Cosma | Combined Day 1 + Day 2 pack. |

The event-specific registration modal recommends a character according to the selected event. The portal then allows participants to choose eligible events and enter participant details; package pricing and active-event data are sourced from the registration backend when configured.

### Registration and team flow

The primary path is:

1. Open a **Register** call-to-action or `/register`.
2. Select a character-themed pack (or reach a recommended pack from an event).
3. Review/select eligible events in the registration portal and submit participant information.
4. The frontend calls Supabase Edge Functions and REST/RPC endpoints through `src/services/registration/`.
5. After successful submission, the browser hands off to the college payment process. The return/status flow checks registration state with the backend.
6. “My Registrations” uses the backend registration-check flow. Team creation uses the `team-management` endpoint, including member verification.

Backend API calls are centralized in `src/services/registration/api.ts`; browser-safe connection settings are read from `src/services/registration/config.ts`. The service-role key and other server secrets belong in Supabase Edge Function secrets, never in the frontend.

Registration launch state is controlled by `src/config/registrationLaunch.ts`. Current source configuration sets registration to open. When closed, the terminal is blurred/inert and displays a coming-soon screen; an optional ISO-8601 launch time can drive its countdown.

### Character dashboard

`/profile` renders a themed dossier using `src/data/characterProfiles.ts` and components in `src/components/profile/`. It includes character portrait and identity information, registration metadata, intent text, registered-event panels, and QR/verification presentation when the backend returns verified registration data.

The route can preview a character through `?char=nico`, `?char=ruelle`, `?char=dacre`, or `?char=cosma`. Profile state is not a user account: the page uses browser-stored registration references and can query the backend for verification; it does not provide sign-in or authentication. A separate local-only mock registration helper remains in the source and must not be interpreted as proof of payment.

## The Sentinel Journey: train timeline

The `/timeline` page is a distinct, cinematic horizontal journey rather than a conventional list. Three wide illustrated frames form one continuous world; a train moves across the stitched scene while the camera pans and a floating card identifies the current programme stop.

- **Day 1:** Registration → Inauguration → Welcome & Introduction → Technical & Non-Technical Programme → Day 01 Closing.
- **Day 2:** Day 02 Opening → Techno-Cultural Activities → Special / Cultural Programme → Valedictory → Prize Distribution → DJ Play.

There are no specific start times in this stage timeline; it presents high-level programme stages. Its data is in `src/data/timelineSchedule.ts` (the separate `src/data/timeline.ts` file currently contains an empty legacy station list). `useJourneyProgress.ts` and `timelineWorld.ts` coordinate travel progress, stop activation, frame/world dimensions, and camera position. Visitors start the journey and can advance it using scroll/swipe/keyboard interaction. Train ambience can be muted, and that preference is remembered locally. The train audio starts only after the visitor's start gesture.

## Motion, responsive behavior, and performance

- **Scroll-driven motion:** the home hero and building scene each own their scroll-progress logic; the building reveal uses a single threshold instead of staggered per-building scroll animations.
- **Smooth scrolling:** Lenis is enabled for desktop wheel/trackpad scrolling, but not for touch-first devices or reduced-motion preferences.
- **Reduced motion:** JavaScript motion checks the system preference; global CSS also shortens animations and transitions.
- **Responsive scenes:** mobile has its own navigation-city composition and breakpoint-aware artwork/positions.
- **Device performance:** `src/utils/devicePerf.ts` and global classes adapt effects for mobile, low-RAM, and very-low-RAM devices. Expensive blurs, particles, glows, and animation work are reduced or removed where appropriate.
- **Loading:** larger pages are lazy route chunks. Navigation-building images are warmed before the visitor reaches that scene. Timeline frames load in sequence to avoid competing large image downloads.
- **Accessibility:** native links/buttons, accessible labels, keyboard skip/mute controls, intro captions, and reduced-motion support are present in the relevant experiences.

## Graphics, audio, and asset locations

The final site artwork is served from `public/assets/` and referenced by URL, keeping large images and video out of JavaScript imports. Important groups include:

| Asset folder | Examples / purpose |
| --- | --- |
| `public/assets/branding/` | College and symposium identities, accreditation marks, club identity. |
| `public/assets/intro/` | Desktop/mobile cinematic intro videos and captions. |
| `public/assets/city/` | Hero layers, navigation backgrounds, rain/city environments, guest posters, notice board graphics. |
| `public/assets/buildings/` | The six section-navigation landmark images. |
| `public/assets/characters/` | Full portraits, compact portraits, crests, themed city/terminal scenes, and dossier art. |
| `public/assets/events/` and `public/assets/events-terminal/` | Event illustrations, posters, and terminal avatars. |
| `public/assets/timeline/` | Three scene frames, train art, and character action poses. |
| `public/assets/transportation/` | Transit vehicles and transport background artwork. |
| `public/assets/about/`, `credentials/`, `developers/`, `contact/` | Feature-specific backgrounds, staff/team photos, cards, and decorative images. |
| `public/assets/mascot/` | Mascot character poses and animation artwork. |
| `public/audio/` | Background music and timeline train ambience. |
| `public/fonts/` | Reserved font directory; the root site's main fonts currently load through Google Fonts. |

`assets-source/` is reserved for source/original artwork. Supporting image collections also exist in top-level `Event_images/`, `Notice_Board/`, `staff/`, and `students/`; production UI references generally use the optimized copies under `public/assets/`.

The separate `frontend-team-credentials/` directory has its own package manifest and frontend app for team-credential graphics. It is not part of the root Vite app's `src/` tree.

## Source map

| Path | Responsibility |
| --- | --- |
| `src/main.tsx` | React entry point, device-performance initialization, optional production gate. |
| `src/App.tsx`, `src/router.tsx` | Router, shared providers, page routes, lazy loading, and route prefetching. |
| `src/pages/` | Route-level pages. |
| `src/components/intro/` | Video intro, identity elements, and futuristic transition. |
| `src/components/city/` | Hero city, navigation city, environment effects, and landmark buildings. |
| `src/components/events-terminal/` | Retro events UI, event detail, registration portal, status, and team creation flows. |
| `src/components/timeline/` | Train journey, station points, character animation, and audio ambience. |
| `src/components/profile/` | Character selection, dossier panels, registration/event cards, and theme provider. |
| `src/components/about/`, `credentials/`, `contact/`, `transportation/`, `developers/` | Feature page sections and their presentation components. |
| `src/components/mascot/`, `audio/`, `ui/`, `registration/` | Shared mascot interactions, audio controls, reusable UI, and rules modal. |
| `src/data/` | Event, section, identity, navigation, profile, timeline, transport, contact, and contributor content. |
| `src/types/` | Shared TypeScript data and feature contracts. |
| `src/services/registration/` | Supabase registration API client, configuration, local lookup reference, and API types. |
| `src/config/` | Registration/site gates and symposium schedule. |
| `src/animation/`, `src/hooks/`, `src/utils/` | Scroll/motion helpers, responsive hooks, and reusable application utilities. |
| `src/styles/` | Global CSS, theme tokens, breakpoints, and font stylesheet. |
| `docs/backend/` | Backend coordination SQL; not a frontend migration runner. |

For a shorter explanation of module boundaries, see [Architecture](./ARCHITECTURE.md).

## Deployment and launch switches

- **Site-wide under-development gate:** `src/config/siteGate.ts`. It currently exports `false`. When enabled, production builds show the gate instead of the full app; local `npm run dev` still displays the full site.
- **Registration gate:** `src/config/registrationLaunch.ts`. This independently controls whether the terminal registration flow is open and can optionally specify an opening time.
- **Symposium date/countdown:** `src/config/symposiumSchedule.ts`. The configured event dates are October 14–15, 2026; this value controls the hero countdown presentation.
- **Vercel:** `vercel.json` rewrites routes to `index.html` and sets immutable cache headers for `/assets/`.
- **Environment:** `.env.example` documents the public `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables. Do not commit `.env.local`.

## Technology stack

| Technology | Usage |
| --- | --- |
| React 19 + React DOM | UI and component rendering. |
| TypeScript | Application code, feature types, and build-time checking. |
| Vite | Dev server and production bundler. |
| React Router | Client-side navigation and direct routes. |
| Tailwind CSS v4 | Utility styling via the Vite plugin; feature-specific CSS supplements it. |
| Lenis | Desktop smooth scrolling. |
| Leaflet | Interactive transportation/campus map. |
| Lucide React | Interface icons. |
| QRCode, OpenType.js | QR and typography-related utilities used by feature code. |
| ESLint, Prettier | Linting and formatting. |
