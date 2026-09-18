import type { CSSProperties } from 'react'
import { symposium } from '@/data/symposium'
import './PresentedByGroup.css'

interface PresentedByGroupProps {
  departmentStyle: CSSProperties
  associationStyle: CSSProperties
  presentsStyle: CSSProperties
}

/**
 * The "who's presenting this" text hierarchy directly above the
 * CyberSentinel logo: department -> "In Association with ..." ->
 * "Presents". Renders only what data/symposium.ts actually provides —
 * "Presents" itself only appears if there's a department or association
 * line above it to introduce, so this component degrades gracefully if
 * that data is ever cleared. All motion comes from the style props,
 * computed from scroll progress by IdentityLayer; nothing here animates on
 * its own.
 */
export function PresentedByGroup({ departmentStyle, associationStyle, presentsStyle }: PresentedByGroupProps) {
  const hasIntroLine = Boolean(symposium.department || symposium.presentedBy)

  return (
    <div className="presented-by">
      {symposium.department && (
        <p className="presented-by__department" style={departmentStyle}>
          {symposium.department}
        </p>
      )}
      {symposium.presentedBy && (
        <p className="presented-by__association" style={associationStyle}>
          {symposium.presentedBy}
        </p>
      )}
      {hasIntroLine && (
        <p className="presented-by__presents" style={presentsStyle}>
          Presents
        </p>
      )}
    </div>
  )
}
