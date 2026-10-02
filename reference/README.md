# reference/

`register2/` is the backend team's registration package exactly as supplied
(`register222.zip`, Oct 2026 — adds leader-chosen team size). It is the source of truth for the
registration contract and is **not** built, served or linted with the site.

- Do not edit it. To take a newer version, replace the folder wholesale.
- The site's React integration lives in `src/services/registration/`
  (API adapter) and `src/components/events-terminal/` (UI). It mirrors
  `register2/js/registration.js`, `checking.js` and `team.js` (create only).
- Fallback: the standalone pages under `register2/registration/`,
  `register2/checking/` and `register2/team/create.html` still work on their
  own when served statically (they read `register2/js/config.js`).
- Left out of this copy: `supabase/.temp` (machine-local Supabase CLI link
  state, including the database pooler host).
