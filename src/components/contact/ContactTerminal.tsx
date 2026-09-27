import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Phone } from 'lucide-react'
import { CyberBackButton } from '@/components/ui/CyberBackButton'
import { contactGroups, toTelHref, type ContactEntry } from '@/data/contacts'
import './ContactTerminal.css'

const FONT_LINK_ID = 'contact-terminal-fonts'
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Share+Tech+Mono&family=VT323&display=swap'

const COPY_FEEDBACK_MS = 2200

/**
 * Contacts "payphone terminal" — ported from the team's AI Studio design
 * (PAOK Cyberpunk Contacts & Payphone Terminal). Desktop keeps the original
 * side-by-side booth + card composition; below 1024px it becomes a compact
 * booth header over a single-column list where every number is a
 * tap-to-call link with an always-visible copy button (the original's
 * hover-only copy icon is unreachable on touch).
 */
export function ContactTerminal() {
  const [copied, setCopied] = useState<{ id: string; phone: string } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Terminal-only fonts, loaded while mounted (same pattern as the events terminal).
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return
    const link = document.createElement('link')
    link.id = FONT_LINK_ID
    link.rel = 'stylesheet'
    link.href = FONT_HREF
    document.head.appendChild(link)
    return () => {
      document.getElementById(FONT_LINK_ID)?.remove()
    }
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async (contact: ContactEntry) => {
    try {
      await navigator.clipboard.writeText(contact.phone)
    } catch {
      return // Clipboard unavailable (insecure context / denied) — never claim a copy happened.
    }
    clearTimeout(timer.current)
    setCopied({ id: contact.id, phone: contact.phone })
    timer.current = setTimeout(() => setCopied(null), COPY_FEEDBACK_MS)
  }

  return (
    <main data-page="contact" className="contact-page">
      <div className="contact-page__bg" aria-hidden="true" />
      <CyberBackButton />

      <div className="contact-toast" role="status" aria-live="polite">
        {copied && (
          <span className="contact-toast__inner">
            <Check size={14} aria-hidden="true" /> COPIED: <span className="contact-toast__num">{copied.phone}</span>
          </span>
        )}
      </div>

      <div className="contact-scene">
        <div className="contact-booth">
          <img
            src="/assets/contact/payphone-booth.webp"
            alt="Neon payphone booth labelled Contacts"
            width={341}
            height={512}
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <section className="contact-card" aria-labelledby="contact-heading">
          <div className="contact-card__plate">
            <div className="contact-card__scanlines" aria-hidden="true" />
            <div className="contact-card__badge" aria-hidden="true">
              <span className="contact-card__badge-dot" />
              <span className="contact-card__badge-dot contact-card__badge-dot--sm" />
              SYS://NET.CONTACTS_v2.6
            </div>
            <h1 id="contact-heading" className="contact-sr-only">
              Contact the organizing team
            </h1>

            <div className="contact-card__body">
              {contactGroups.map((group) => (
                <div key={group.id} className="contact-group">
                  <ul className={`contact-list contact-list--${group.tone}`}>
                    {group.contacts.map((contact) => (
                      <li key={contact.id} className="contact-row">
                        <div className="contact-row__who">
                          <span className="contact-row__name">{contact.name}</span>
                          <span className="contact-row__title">{contact.title}</span>
                        </div>
                        <div className="contact-row__actions">
                          <a
                            className="contact-row__phone"
                            href={toTelHref(contact.phone)}
                            aria-label={`Call ${contact.name} at ${contact.phone}`}
                          >
                            <Phone size={13} aria-hidden="true" className="contact-row__phone-icon" />
                            {contact.phone}
                          </a>
                          <button
                            type="button"
                            className="contact-row__copy"
                            onClick={() => handleCopy(contact)}
                            aria-label={`Copy ${contact.name}'s phone number`}
                          >
                            {copied?.id === contact.id ? (
                              <Check size={14} aria-hidden="true" />
                            ) : (
                              <Copy size={14} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="contact-card__footer" aria-hidden="true">
              LOC_ID: 1926_GRE <span className="contact-card__footer-diamond" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
