import './RouteFallback.css'

/** Lightweight full-screen placeholder shown only while a route's code
 * chunk is still downloading (normally already prefetched — see
 * router.tsx). Pure CSS, no images, so it can never itself be slow. */
export function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__bar" aria-hidden="true" />
      <span className="route-fallback__text">LOADING</span>
    </div>
  )
}
