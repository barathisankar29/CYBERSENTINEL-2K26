import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

interface ProfileHeaderProps {
  /** 0-100. Registered profile shows 100 (unlocked); the selection screen
   * before registration shows a lower value to read as "incomplete". */
  progress: number
  label?: string
}

export function ProfileHeader({ progress, label = 'RECORDS' }: ProfileHeaderProps) {
  return (
    <header className="profile-header">
      <Link to="/" className="profile-back-btn">
        ← BACK
      </Link>
      <div className="profile-header__progress">
        <span className="profile-header__bar">
          <span className="profile-header__bar-fill" style={{ '--progress': `${progress}%` } as CSSProperties} />
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span className="profile-header__records-label">{label}</span>
        <span className="profile-header__percent">{progress}%</span>
      </div>
    </header>
  )
}
