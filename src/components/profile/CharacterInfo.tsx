import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { CharacterConfig, RegistrationRecord } from '@/types/characterProfile'
import { QrCode, Download, X, Copy, Check } from 'lucide-react'
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
 *     - Block 2 (Right): Interactive Official Entry QR Code
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

  // Use official backend QR if available, else standard verification pass link
  const effectiveQrValue =
    registration.qrUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/register/status?code=${registration.registrationId}`
      : `https://cybersentinel.city/checkStatus?code=${registration.registrationId}`)

  useEffect(() => {
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
  }, [effectiveQrValue])

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

          {/* Block 2 (Right): Interactive Entry QR Code Box */}
          <button
            type="button"
            className="profile-id-qr-box"
            onClick={() => setIsModalOpen(true)}
            aria-label="Enlarge Entry Pass QR Code"
            title="Touch or click to view full size QR entry pass"
          >
            <div className="profile-id-qr-info-col">
              <div className="profile-id-qr-box__header">
                <span className="profile-id-qr-box__tag">ENTRY PASS</span>
                <span className={`profile-id-qr-box__led ${registration.isVerified ? 'is-verified' : ''}`} />
              </div>

              <div className="profile-id-qr-box__meta-mobile">
                <span className={`profile-id-qr-status-badge ${registration.isVerified ? 'is-verified' : ''}`}>
                  {registration.isVerified ? 'VERIFIED // ADMIT' : 'ACTIVE PASS'}
                </span>
                <span className="profile-id-qr-code-text">{registration.registrationId}</span>
              </div>

              <div className="profile-id-qr-box__footer profile-id-qr-box__footer--mobile">
                <span className="profile-id-qr-zoom-text">⛶ TAP TO ZOOM</span>
              </div>
            </div>

            <div className="profile-id-qr-preview-frame">
              {/* Corner brackets */}
              <span className="qr-corner qr-corner--tl" />
              <span className="qr-corner qr-corner--tr" />
              <span className="qr-corner qr-corner--bl" />
              <span className="qr-corner qr-corner--br" />

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Entry QR for ${registration.registrationId}`}
                  className="profile-id-qr-img"
                  draggable={false}
                />
              ) : (
                <div className="profile-id-qr-placeholder">
                  <QrCode size={36} className="text-cyan-400 animate-pulse" />
                </div>
              )}
            </div>

            <div className="profile-id-qr-box__footer profile-id-qr-box__footer--desktop">
              <span className="profile-id-qr-zoom-text">⛶ TAP TO ZOOM</span>
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
          <div
            className="profile-qr-modal-backdrop"
            onClick={() => setIsModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
          >
            <div className="profile-qr-modal-card" onClick={(e) => e.stopPropagation()}>
              {/* Modal Top Header */}
              <div className="profile-qr-modal-header">
                <div className="profile-qr-modal-title-group">
                  <span className="profile-qr-modal-sub">SYS://SECURITY.PASS_SCANNER</span>
                  <h3 id="qr-modal-title" className="profile-qr-modal-title">
                    OFFICIAL ENTRY QR PASS
                  </h3>
                </div>
                <button
                  type="button"
                  className="profile-qr-modal-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close QR Modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="profile-qr-modal-body">
                <div className="profile-qr-modal-display-frame">
                  <span className="qr-corner qr-corner--tl" />
                  <span className="qr-corner qr-corner--tr" />
                  <span className="qr-corner qr-corner--bl" />
                  <span className="qr-corner qr-corner--br" />

                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt={`Full size Entry QR for ${registration.registrationId}`}
                      className="profile-qr-modal-img"
                    />
                  )}
                </div>

                {/* Status pill */}
                <div className="profile-qr-modal-status-badge">
                  <span className="status-dot" />
                  <span>
                    {registration.isVerified
                      ? 'VERIFIED & CONFIRMED // ADMIT PASS'
                      : 'OFFICIAL ENTRY PASS // ACTIVE'}
                  </span>
                </div>

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
                </div>

                <p className="profile-qr-modal-instruction">
                  Show this QR code to the entrance desk or event coordinator at the venue for instant gate access.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="profile-qr-modal-footer">
                <button
                  type="button"
                  className="profile-qr-modal-btn profile-qr-modal-btn--download"
                  onClick={handleDownloadQr}
                >
                  <Download size={15} />
                  <span>DOWNLOAD QR PASS</span>
                </button>
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
