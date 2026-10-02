/**
 * Site-wide "under development" gate.
 *
 * While `true`, every route shows only the full-screen WEBSITE UNDER
 * DEVELOPMENT screen (UnderDevelopmentGate). The main site is not rendered,
 * its JavaScript is left out of the build, and no API requests are made.
 * index.html also skips the city-background preload and Google Fonts
 * (see vite.config.ts).
 *
 * Builds only: the local dev server (`npm run dev`) always shows the full
 * site so it can be worked on.
 *
 * To launch the full site: set this to `false` and redeploy. Everything
 * then loads exactly as it did before the gate existed.
 */
export const SITE_UNDER_DEVELOPMENT: boolean = false

/** The supplied artwork, served as-is from /public. */
export const UNDER_DEVELOPMENT_IMAGE = '/assets/website_under_development.png'
