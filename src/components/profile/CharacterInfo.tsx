import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import type { CharacterConfig, RegistrationRecord } from '@/types/characterProfile'
import { Download, X, Copy, Check, Lock, ShieldAlert, ExternalLink } from 'lucide-react'
import './CharacterInfoQr.css'

interface CharacterInfoProps {
  character: CharacterConfig
  registration: RegistrationRecord
}

/**
 * Card 1: Personnel Dossier Identification (ID Card)
 * Exact match to user reference image (media_1790936983065.png):
 * - Left: Avatar headshot in cyan double border frame
 * - Right Container divided into 2 blocks:
 *     - Block 1 (Left): Data Table (ID, NAME, AGE, BIRTHDAY, BLOOD TYPE, GENDER)
 *     - Block 2 (Right): Interactive Official Entry QR Code (appears only when payment is confirmed/verified)
 *     - Far Right: Vertical Chromatic Ramp Bar
 * - Touch/click QR code opens full-screen big popup modal with high-res QR, registration code, and download.
 */
export function CharacterInfo({ character, registration }: CharacterInfoProps) {
  const displayName = character?.displayName || character?.name || 'Dacre'
  const recordId = character?.recordId || 'DACRE-001'
  const age = character?.age || '?? (Early 30s)'
  const birthday = character?.birthday || 'Mar 18'
  const bloodType = character?.bloodType || '???'
  const gender = character?.gender || 'MALE'
  const shortImage = character?.shortImage || '/assets/characters/short_dacre.webp'

  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Official entry QR only exists and appears when payment is finished and verified by admin
  const isVerified = Boolean(registration.isVerified && registration.qrUrl)
  const effectiveQrValue = isVerified ? (registration.qrUrl as string) : ''

  useEffect(() => {
    if (!isVerified || !effectiveQrValue) {
      setQrDataUrl('')
      return
    }

    let cancelled = false
    import('qrcode')
      .then(({ default: QRCode }) => {
        return QRCode.toDataURL(effectiveQrValue, {
          width: 320,
          margin: 1,
          color: {
            dark: '#030712',
            light: '#ffffff',
          },
        })
      })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl)
      })
      .catch((err) => {
        console.warn('Failed to generate entry QR code:', err)
      })
    return () => {
      cancelled = true
    }
  }, [isVerified, effectiveQrValue])

  useEffect(() => {
    return () => clearTimeout(copyTimer.current)
  }, [])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore
    }
  }

  const handleDownloadQr = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `${registration.registrationId}-ENTRY-PASS.png`
    link.click()
  }

  return (
    <section className="profile-panel profile-panel--id-card" aria-label="Personnel Identification">
      {/* Sci-Fi Stitched Cyber Frame (Matches Reference Image) */}
      <div className="profile-panel__cyber-frame" aria-hidden="true" />

      <div className="profile-id-layout">
        {/* Section 1: Inset Headshot Avatar */}
        <div className="profile-id-portrait-box">
          <div className="profile-id-portrait-inner">
            <img
              src={shortImage}
              alt={`${displayName} avatar`}
              className="profile-id-portrait-img"
              draggable={false}
            />
            <div className="profile-id-portrait-scanline" aria-hidden="true" />
          </div>
        </div>

        {/* Section 2: Data Matrix Container Divided Into 2 Blocks */}
        <div className="profile-id-table-container">
          {/* Block 1 (Left): Data Table */}
          <div className="profile-id-table">
            <div className="profile-id-row">
              <span className="profile-id-label">ID</span>
              <span className="profile-id-value">{recordId}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">NAME</span>
              <span className="profile-id-value">{displayName}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">AGE</span>
              <span className="profile-id-value">{age}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">BIRTHDAY</span>
              <span className="profile-id-value">{birthday}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">BLOOD TYPE</span>
              <span className="profile-id-value">{bloodType}</span>
            </div>
            <div className="profile-id-row">
              <span className="profile-id-label">GENDER</span>
              <span className="profile-id-value">{gender}</span>
            </div>
          </div>

          {/* Block 2 (Right): Interactive Entry QR Code Box or Verification Pending */}
          <button
            type="button"
            className={`profile-id-qr-box ${!isVerified ? 'profile-id-qr-box--pending' : ''}`}
            onClick={() => setIsModalOpen(true)}
            aria-label={isVerified ? 'Enlarge Entry Pass QR Code' : 'View Verification Status'}
            title={isVerified ? 'Touch or click to view full size QR entry pass' : 'Payment verification pending — click for details'}
          >
            <div className="profile-id-qr-info-col">
              <div className="profile-id-qr-box__header">
                <span className="profile-id-qr-box__tag">{isVerified ? 'ENTRY PASS' : 'PASS STATUS'}</span>
                <span className={`profile-id-qr-box__led ${isVerified ? 'is-verified' : 'is-pending'}`} />
              </div>

              <div className="profile-id-qr-box__meta-mobile">
                <span className={`profile-id-qr-status-badge ${isVerified ? 'is-verified' : 'is-pending'}`}>
                  {isVerified ? 'VERIFIED // ADMIT' : 'PAYMENT REVIEW'}
                </span>
                <span className="profile-id-qr-code-text">{registration.registrationId}</span>
              </div>

              <div className="profile-id-qr-box__footer profile-id-qr-box__footer--mobile">
                <span className="profile-id-qr-zoom-text">{isVerified ? '⛶ TAP TO ZOOM' : 'ℹ DETAILS'}</span>
              </div>
            </div>

            {isVerified && qrDataUrl ? (
              <div className="profile-id-qr-preview-frame">
                {/* Corner brackets */}
                <span className="qr-corner qr-corner--tl" />
                <span className="qr-corner qr-corner--tr" />
                <span className="qr-corner qr-corner--bl" />
                <span className="qr-corner qr-corner--br" />

                <img
                  src={qrDataUrl}
                  alt={`Entry QR for ${registration.registrationId}`}
                  className="profile-id-qr-img"
                  draggable={false}
                />
              </div>
            ) : (
              <div className="profile-id-qr-preview-frame profile-id-qr-preview-frame--pending">
                {/* Corner brackets */}
                <span className="qr-corner qr-corner--tl" />
                <span className="qr-corner qr-corner--tr" />
                <span className="qr-corner qr-corner--bl" />
                <span className="qr-corner qr-corner--br" />

                <div className="profile-id-qr-locked-box">
                  <Lock size={18} className="text-amber-400 mb-0.5" />
                  <span className="profile-id-qr-locked-text">QR LOCKED</span>
                  <span className="profile-id-qr-locked-sub">PAYMENT REVIEW</span>
                </div>
              </div>
            )}

            <div className="profile-id-qr-box__footer profile-id-qr-box__footer--desktop">
              <span className="profile-id-qr-zoom-text">{isVerified ? '⛶ TAP TO ZOOM' : 'ℹ STATUS INFO'}</span>
            </div>
          </button>

          {/* Far Right: Vertical Chromatic Ramp Bar */}
          <div className="profile-id-color-ramp" aria-hidden="true" title="Spectral Frequency">
            <span className="ramp-step ramp-step-1" />
            <span className="ramp-step ramp-step-2" />
            <span className="ramp-step ramp-step-3" />
            <span className="ramp-step ramp-step-4" />
            <span className="ramp-step ramp-step-5" />
          </div>
        </div>
      </div>

      {/* ── BIG POPUP MODAL ON TOUCH / CLICK ── */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          // Clicking the dimmed backdrop (not the card) closes the popup.
          <div
            className="profile-qr-modal-backdrop"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false)
            }}
          >
            <div className="profile-qr-modal-card" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title">
              {/* Modal Top Header */}
              <div className="profile-qr-modal-header">
                <div className="profile-qr-modal-title-group">
                  <span className="profile-qr-modal-sub">
                    {isVerified ? 'SYS://SECURITY.PASS_SCANNER' : 'SYS://SECURITY.PAYMENT_VERIFICATION'}
                  </span>
                  <h3 id="qr-modal-title" className="profile-qr-modal-title">
                    {isVerified ? 'OFFICIAL ENTRY QR PASS' : 'REGISTRATION UNDER REVIEW'}
                  </h3>
                </div>
                <button
                  type="button"
                  className="profile-qr-modal-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close Modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="profile-qr-modal-body">
                {isVerified && qrDataUrl ? (
                  <>
                    <div className="profile-qr-modal-display-frame">
                      <span className="qr-corner qr-corner--tl" />
                      <span className="qr-corner qr-corner--tr" />
                      <span className="qr-corner qr-corner--bl" />
                      <span className="qr-corner qr-corner--br" />

                      <img
                        src={qrDataUrl}
                        alt={`Full size Entry QR for ${registration.registrationId}`}
                        className="profile-qr-modal-img"
                      />
                    </div>

                    {/* Status pill */}
                    <div className="profile-qr-modal-status-badge">
                      <span className="status-dot is-verified" />
                      <span>VERIFIED & CONFIRMED // ADMIT PASS</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="profile-qr-modal-locked-box">
                      <ShieldAlert size={44} className="text-amber-400 mb-2 animate-pulse" />
                      <span className="profile-qr-modal-locked-title">PAYMENT VERIFICATION PENDING</span>
                      <p className="profile-qr-modal-locked-desc">
                        Registration record is logged. The official Entry QR Pass is issued <strong>only after college administrators confirm your payment</strong>.
                      </p>
                    </div>

                    {/* Status pill */}
                    <div className="profile-qr-modal-status-badge profile-qr-modal-status-badge--pending">
                      <span className="status-dot is-pending" />
                      <span>UNDER REVIEW // AWAITING ADMIN CONFIRMATION</span>
                    </div>
                  </>
                )}

                {/* Details table */}
                <div className="profile-qr-modal-meta">
                  <div className="meta-row">
                    <span className="meta-label">REG CODE:</span>
                    <div className="meta-code-copy">
                      <span className="meta-val meta-val--code">{registration.registrationId}</span>
                      <button
                        type="button"
                        className="meta-copy-btn"
                        onClick={() => handleCopy(registration.registrationId)}
                        aria-label="Copy Registration Code"
                        title="Copy registration code"
                      >
                        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  <div className="meta-row">
                    <span className="meta-label">OPERATIVE:</span>
                    <span className="meta-val">{registration.username}</span>
                  </div>

                  <div className="meta-row">
                    <span className="meta-label">CHARACTER:</span>
                    <span className="meta-val">{displayName} ({recordId})</span>
                  </div>

                  {registration.selectedDay && (
                    <div className="meta-row">
                      <span className="meta-label">ACCESS DAY:</span>
                      <span className="meta-val">{registration.selectedDay}</span>
                    </div>
                  )}

                  <div className="meta-row">
                    <span className="meta-label">QR PASS STATUS:</span>
                    <span className={`meta-val ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isVerified ? 'ACTIVE // SCAN READY' : 'LOCKED UNTIL PAYMENT VERIFIED'}
                    </span>
                  </div>
                </div>

                <p className="profile-qr-modal-instruction">
                  {isVerified
                    ? 'Show this QR code to the entrance desk or event coordinator at the venue for instant gate access.'
                    : 'Once payment verification completes, your QR code will unlock here automatically and in the My Registrations portal.'}
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="profile-qr-modal-footer">
                {isVerified ? (
                  <button
                    type="button"
                    className="profile-qr-modal-btn profile-qr-modal-btn--download"
                    onClick={handleDownloadQr}
                  >
                    <Download size={15} />
                    <span>DOWNLOAD QR PASS</span>
                  </button>
                ) : (
                  <Link
                    to="/register/status"
                    className="profile-qr-modal-btn profile-qr-modal-btn--download"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span>CHECK STATUS IN VAULT</span>
                    <ExternalLink size={14} />
                  </Link>
                )}
                <button
                  type="button"
                  className="profile-qr-modal-btn profile-qr-modal-btn--close"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}
