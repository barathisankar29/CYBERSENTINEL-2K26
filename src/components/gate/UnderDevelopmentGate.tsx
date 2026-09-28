import { UNDER_DEVELOPMENT_IMAGE } from '@/config/siteGate'
import './UnderDevelopmentGate.css'

/**
 * Temporary full-screen gate shown instead of the site while
 * SITE_UNDER_DEVELOPMENT is on. The supplied artwork carries the headline;
 * the visually hidden copy gives screen readers the full message.
 */
export function UnderDevelopmentGate() {
  return (
    <main className="ud-gate">
      <h1 className="sr-only">CyberSentinel 2K26 — Website Under Development</h1>
      <p className="sr-only">
        CyberSentinel 2K26 is officially online. The full website is under active development
        and will be available soon.
      </p>
      <img
        className="ud-gate__art"
        src={UNDER_DEVELOPMENT_IMAGE}
        alt="CyberSentinel 2K26 — Website Under Development"
        width={2170}
        height={725}
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />
    </main>
  )
}
