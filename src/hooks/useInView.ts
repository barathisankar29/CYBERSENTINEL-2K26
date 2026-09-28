import { useEffect, useState, type RefObject } from 'react'

/**
 * True while `ref`'s element is on (or within `rootMargin` of) the screen.
 * Lets auto-playing effects pause while scrolled away, so they cost nothing
 * off screen and the visitor never sees a difference.
 */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = '100px'): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
