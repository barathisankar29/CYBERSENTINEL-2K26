import { Link } from 'react-router-dom'
import { siteSections } from '@/data/sections'
import './SiteFooter.css'

/** Standard site footer, shown after the navigation-city buildings on the
 * home page. Links reuse the same section list the buildings themselves
 * navigate from (src/data/sections.ts), so it never drifts from the real
 * routes. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__title">CYBERSENTINEL 2K26</span>
          <span className="site-footer__tagline">Department of Computer Science and Engineering</span>
        </div>

        <nav className="site-footer__links" aria-label="Footer navigation">
          {siteSections
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <Link key={section.slug} to={`/${section.slug}`}>
                {section.shortLabel.toUpperCase()}
              </Link>
            ))}
        </nav>

        <div className="site-footer__meta">
          <span>© 2026 CYBERSENTINEL // CYBERSENTINEL CITY</span>
          <span>A SAFER CITY. A MORE HONEST TOMORROW.</span>
        </div>
      </div>
    </footer>
  )
}
