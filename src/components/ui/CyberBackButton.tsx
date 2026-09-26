import { Link } from 'react-router-dom'
import { CITY_RETURN_STATE } from '@/utils/homeReturn'
import './CyberBackButton.css'

interface CyberBackButtonProps {
  to?: string
  label?: string
  className?: string
}

export function CyberBackButton({
  to = '/',
  label = 'BACK',
  className = '',
}: CyberBackButtonProps) {
  return (
    // Back to home always means back to the buildings, not the hero.
    <Link to={to} state={to === '/' ? CITY_RETURN_STATE : undefined} className={`cyber-back-btn ${className}`} aria-label={label}>
      <span className="cyber-back-btn__arrow" aria-hidden="true">
        ←
      </span>
      <span className="cyber-back-btn__text">{label}</span>
    </Link>
  )
}
