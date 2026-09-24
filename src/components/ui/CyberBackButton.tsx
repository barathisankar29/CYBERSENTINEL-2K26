import { Link } from 'react-router-dom'
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
    <Link to={to} className={`cyber-back-btn ${className}`} aria-label={label}>
      <span className="cyber-back-btn__arrow" aria-hidden="true">
        ←
      </span>
      <span className="cyber-back-btn__text">{label}</span>
    </Link>
  )
}
