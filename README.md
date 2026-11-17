# CYBERSENTINEL 2K26

The official symposium website for Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College. It presents CYBERSENTINEL 2K26 as an explorable cyberpunk city: visitors discover sections through landmark buildings, follow the programme on a train journey, and register through a retro game-terminal interface.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL after startup. The local development server displays the full site.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Run TypeScript project builds and create the production bundle in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint across the project. |
| `npm run format` | Format project files with Prettier. |
| `npm run format:check` | Check formatting without changing files. |

## Project documentation

- [Project details](./PROJECT_DETAILS.md) — implemented features, visual direction, animations, routes, registration, assets, and code map.
- [Architecture](./ARCHITECTURE.md) — concise guide to the current source organization and boundaries.

## Registration setup

The registration portal connects to Supabase Edge Functions and the college payment process. To configure it locally, copy `.env.example` to `.env.local` and set:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Only the public Supabase URL and anon key belong in browser-exposed `VITE_*` variables. Never put a service-role key, payment secret, or other private credential in the frontend. The backend keeps its secrets in Supabase function configuration.

## Technology

React 19, TypeScript, Vite, React Router, Tailwind CSS v4, and feature-specific CSS files colocated with components. Feature libraries include Lenis for desktop smooth scrolling, Leaflet for the campus map, Lucide icons, QRCode, and OpenType.js.

## Deployment

The project includes Vercel SPA rewrites in `vercel.json`, so client-side routes resolve through `index.html`. The same file gives `/assets/` long-lived immutable cache headers. See [Project details](./PROJECT_DETAILS.md#deployment-and-launch-switches) for the site and registration launch switches.
