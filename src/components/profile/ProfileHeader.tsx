import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

interface ProfileHeaderProps {
  progress: number
  label?: string
}

export function ProfileHeader({ progress, label = 'RECORDS' }: ProfileHeaderProps) {
  return (
    <header className="profile-header">
      <Link to="/" className="profile-back-btn" aria-label="Back to home">
        ← BACK
      </Link>

      <span className="profile-header__unlocked">UNLOCKED</span>

      <div className="profile-header__progress">
        <span className="profile-header__bar">
          <span
            className="profile-header__bar-fill"
            style={{ '--progress': `${progress}%` } as CSSProperties}
          />
        </span>
      </div>

      <div className="profile-header__right">
        <span className="profile-header__records-label">{label}</span>
        <span className="profile-header__percent">{progress}%</span>
      </div>
    </header>
  )
}
