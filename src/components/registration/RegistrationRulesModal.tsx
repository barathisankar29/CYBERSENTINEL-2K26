import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  Users,
  User,
  Ticket,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Info,
  ArrowRight
} from 'lucide-react';
import './RegistrationRulesModal.css';

export interface RegistrationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed?: () => void;
}

type TabKey = 'daypass' | 'single' | 'team' | 'payment' | 'checklist';

export function RegistrationRulesModal({
  isOpen,
  onClose,
  onProceed
}: RegistrationRulesModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('daypass');
  const [acknowledged, setAcknowledged] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body & document scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleProceed = () => {
    onClose();
    if (onProceed) {
      onProceed();
    } else {
      navigate('/register');
    }
  };

  const handleStatusCheck = () => {
    onClose();
    navigate('/register/status');
  };

  return createPortal(
    <div
      className="reg-rules-backdrop"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      data-lenis-prevent="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-rules-title"
    >
      <div
        className="reg-rules-card"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {/* Neon Cyber Frame */}
        <span className="reg-rules-corner reg-rules-corner--tl" aria-hidden="true" />
        <span className="reg-rules-corner reg-rules-corner--tr" aria-hidden="true" />
        <span className="reg-rules-corner reg-rules-corner--bl" aria-hidden="true" />
        <span className="reg-rules-corner reg-rules-corner--br" aria-hidden="true" />

        {/* ── HEADER ── */}
        <header className="reg-rules-header">
          <div className="reg-rules-header__meta">
            <span className="reg-rules-header__tag">CYBERSENTINEL 2K26 // OPERATIONAL DIRECTIVE</span>
            <div className="reg-rules-header__pulse">
              <span className="reg-rules-led" />
              <span className="reg-rules-led-text">RULEBOOK &amp; PROTOCOLS</span>
            </div>
          </div>

          <div className="reg-rules-header__title-row">
            <h2 id="reg-rules-title" className="reg-rules-title">
              REGISTRATION &amp; TEAM CREATION GUIDELINES
            </h2>
            <button
              type="button"
              className="reg-rules-close-btn"
              onClick={onClose}
              aria-label="Close Registration Rules"
            >
              <X size={20} />
            </button>
          </div>
          <p className="reg-rules-header__sub">
            Please read these official instructions thoroughly before proceeding. Follow the day pass, event selection/deselection, and team linking procedures below.
          </p>
        </header>

        {/* ── NAV TABS ── */}
        <nav className="reg-rules-tabs" aria-label="Registration rule topics">
          <button
            type="button"
            className={`reg-rules-tab ${activeTab === 'daypass' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('daypass')}
          >
            <Ticket size={14} />
            <span className="reg-rules-tab-text--desktop">DAY PASS &amp; DESELECTION</span>
            <span className="reg-rules-tab-text--mobile">PASS &amp; EVENTS</span>
          </button>

          <button
            type="button"
            className={`reg-rules-tab ${activeTab === 'single' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            <User size={14} />
            <span className="reg-rules-tab-text--desktop">SOLO EVENTS</span>
            <span className="reg-rules-tab-text--mobile">SOLO</span>
          </button>

          <button
            type="button"
            className={`reg-rules-tab ${activeTab === 'team' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users size={14} />
            <span className="reg-rules-tab-text--desktop">DUO &amp; TEAM EVENTS</span>
            <span className="reg-rules-tab-text--mobile">DUO / TEAM</span>
          </button>

          <button
            type="button"
            className={`reg-rules-tab ${activeTab === 'payment' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <QrCode size={14} />
            <span className="reg-rules-tab-text--desktop">PAYMENT &amp; ENTRY QR</span>
            <span className="reg-rules-tab-text--mobile">PAY &amp; QR</span>
          </button>

          <button
            type="button"
            className={`reg-rules-tab ${activeTab === 'checklist' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <CheckCircle2 size={14} />
            <span className="reg-rules-tab-text--desktop">QUICK CHECKLIST</span>
            <span className="reg-rules-tab-text--mobile">CHECKLIST</span>
          </button>
        </nav>

        {/* ── CONTENT BODY ── */}
        <div
          className="reg-rules-body"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* TAB 1: DAY PASS & EVENT DESELECTION */}
          {activeTab === 'daypass' && (
            <div className="reg-rules-pane">
              <div className="reg-rules-callout reg-rules-callout--cyan">
                <AlertTriangle size={22} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="reg-rules-callout__title">HOW DAY-WISE EVENT AUTO-SELECTION WORKS</h4>
                  <p className="reg-rules-callout__desc">
                    When you select a character/pass, <strong>all events for that selected day are auto-selected by default</strong>. If you only wish to compete in <strong>two or three events</strong>, you must <strong>manually uncheck/deselect</strong> the remaining events in the event checklist before continuing! (If you choose any group's events, automatically other group's events also get selected, and don't worry—if you want to deselect, just uncheck the events while creating the team after registration... Further queries? Contact us!)
                  </p>
                </div>
              </div>

              <div className="reg-rules-grid">
                <div className="reg-rules-card-box">
                  <div className="reg-rules-card-box__badge text-cyan-400 border-cyan-400/40">DAY 1 PASS</div>
                  <h3 className="reg-rules-card-box__title">NICO [DAY 1]</h3>
                  <p className="reg-rules-card-box__desc">
                    Grants full access to all active <strong>Day 1</strong> technical and non-technical events for a single flat registration fee.
                  </p>
                  <ul className="reg-rules-list">
                    <li>Includes events like <em>Paper Presentation, Cipher Coding, Unsaid, Weblica, XCoders</em>.</li>
                    <li>All Day 1 events are pre-selected. Keep only the events you want to compete in.</li>
                  </ul>
                </div>

                <div className="reg-rules-card-box">
                  <div className="reg-rules-card-box__badge text-purple-400 border-purple-400/40">DAY 2 PASS</div>
                  <h3 className="reg-rules-card-box__title">RUELLE [DAY 2]</h3>
                  <p className="reg-rules-card-box__desc">
                    Grants full access to all active <strong>Day 2</strong> events for a single flat registration fee.
                  </p>
                  <ul className="reg-rules-list">
                    <li>Includes events like <em>Spotlight, Connections, Find the BGM, Mixed Signals, Lost in Lyrics</em>.</li>
                    <li>Pre-selects all Day 2 events by default. Deselect any events you do not plan to enter.</li>
                  </ul>
                </div>

                <div className="reg-rules-card-box">
                  <div className="reg-rules-card-box__badge text-amber-400 border-amber-400/40">ULTIMATE PASS</div>
                  <h3 className="reg-rules-card-box__title">COSMA [BOTH DAYS]</h3>
                  <p className="reg-rules-card-box__desc">
                    Combines <strong>Day 1 + Day 2</strong>. Gives you access to events on both symposium dates at a combo fee.
                  </p>
                  <ul className="reg-rules-list">
                    <li>Pre-selects all Day 1 and Day 2 events.</li>
                    <li>Must leave at least one event selected for each day.</li>
                  </ul>
                </div>

                <div className="reg-rules-card-box">
                  <div className="reg-rules-card-box__badge text-emerald-400 border-emerald-400/40">SPECIAL EVENTS</div>
                  <h3 className="reg-rules-card-box__title">DR. DACRE [SPECIAL]</h3>
                  <p className="reg-rules-card-box__desc">
                    Standalone premier events priced independently per event: <em>Group Dance, Thiruvizha Corner, and E-Sports (Free-Fire)</em>.
                  </p>
                  <ul className="reg-rules-list">
                    <li>Select only the specific special protocol(s) you wish to enter.</li>
                    <li>The registration fee equals the sum of chosen special events.</li>
                  </ul>
                </div>
              </div>

              <div className="reg-rules-info-banner">
                <Info size={18} className="text-cyan-400 shrink-0" />
                <span>
                  <strong>Flat Day Fee Note:</strong> Choosing 1 event or all events on Day 1 (or Day 2) costs the same registration fee. Deselecting only limits which event coordinators see you on their attendance roster.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: SOLO / SINGLE EVENTS */}
          {activeTab === 'single' && (
            <div className="reg-rules-pane">
              <div className="reg-rules-step-card">
                <div className="reg-rules-step-num">01</div>
                <div className="reg-rules-step-content">
                  <h4>SELECT YOUR EVENT &amp; DAY</h4>
                  <p>
                    Browse events in the Events Terminal or click Register Now. Select the Day Pass corresponding to your solo event (Day 1 for NICO, Day 2 for RUELLE, or Both Days for COSMA).
                  </p>
                </div>
              </div>

              <div className="reg-rules-step-card">
                <div className="reg-rules-step-num">02</div>
                <div className="reg-rules-step-content">
                  <h4>DESELECT UNWANTED EVENTS</h4>
                  <p>
                    In the event checklist, ensure your chosen solo event is checked. You may deselect any other events you do not plan to participate in.
                  </p>
                </div>
              </div>

              <div className="reg-rules-step-card">
                <div className="reg-rules-step-num">03</div>
                <div className="reg-rules-step-content">
                  <h4>FILL PARTICIPANT DETAILS &amp; PAY</h4>
                  <p>
                    Enter your Name, Email, Phone, College, Department, and Year. Proceed to the college payment process to pay the registration fee.
                  </p>
                </div>
              </div>

              <div className="reg-rules-step-card">
                <div className="reg-rules-step-num">04</div>
                <div className="reg-rules-step-content">
                  <h4>ENTRY DIRECTLY CONFIRMED UPON VERIFICATION</h4>
                  <p>
                    For Solo events, no team creation is needed! Once the admin desk verifies your payment, your registration status becomes <strong>CONFIRMED</strong> and your official Entry QR unlocks automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DUO & TEAM EVENTS */}
          {activeTab === 'team' && (
            <div className="reg-rules-pane">
              <div className="reg-rules-callout reg-rules-callout--purple">
                <AlertTriangle size={22} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="reg-rules-callout__title">CRITICAL: DUO &amp; TEAM REGISTRATION PROTOCOL</h4>
                  <p className="reg-rules-callout__desc">
                    There is <strong>no bulk team registration</strong> where one person pays for the whole team upfront. <strong>EVERY member (including the leader) must register individually and pay first!</strong>
                  </p>
                </div>
              </div>

              <div className="reg-rules-numbered-workflow">
                <div className="workflow-item">
                  <div className="workflow-badge">STEP 1</div>
                  <div className="workflow-text">
                    <h5>INDIVIDUAL REGISTRATION FOR ALL MEMBERS</h5>
                    <p>
                      Every teammate (Leader + Members) must individually register for the same day (e.g. Day 1 or Day 2) and complete their individual payment.
                    </p>
                  </div>
                </div>

                <div className="workflow-item">
                  <div className="workflow-badge">STEP 2</div>
                  <div className="workflow-text">
                    <h5>SELECT THE EXACT TEAM EVENT IN CHECKLIST (MANDATORY)</h5>
                    <p>
                      <strong>Every member MUST ensure the team event is checked in their registration!</strong> If any member deselects the event, the backend system will reject them when the leader tries to add them to the team.
                    </p>
                  </div>
                </div>

                <div className="workflow-item">
                  <div className="workflow-badge">STEP 3</div>
                  <div className="workflow-text">
                    <h5>AWAIT PAYMENT VERIFICATION</h5>
                    <p>
                      All members must have their payment verified and status set to <strong>CONFIRMED</strong> by the admin. The backend blocks unverified participants from joining teams.
                    </p>
                  </div>
                </div>

                <div className="workflow-item">
                  <div className="workflow-badge">STEP 4</div>
                  <div className="workflow-text">
                    <h5>TEAM LEADER CREATES THE TEAM (/register/team)</h5>
                    <p>
                      The Team Leader visits <strong>Create Team</strong>, verifies with their registered Email or Registration ID, chooses the Day and Package, selects the Team Size (e.g. <strong>2 members for Duo</strong>, or <strong>2–3 members for Team</strong>), and enters the <strong>Email / Registration ID</strong> for all teammates.
                    </p>
                  </div>
                </div>

                <div className="workflow-item">
                  <div className="workflow-badge">STEP 5</div>
                  <div className="workflow-text">
                    <h5>UNIQUE TEAM CODE GENERATED</h5>
                    <p>
                      Upon submitting, the system generates a unique Team Code (e.g. <code>DAY_1-ABCD1234</code>). All members are atomically linked to the team and official event roster.
                    </p>
                  </div>
                </div>
              </div>

              <div className="reg-rules-warning-box">
                <span className="text-amber-400 font-bold font-mono text-xs">⚠️ IMPORTANT TEAM RULES:</span>
                <ul className="text-xs text-gray-300 space-y-1 mt-1 font-mono">
                  <li>• A member cannot join two different teams for the same event.</li>
                  <li>• All teammates must be registered for the same symposium day (or Both Days).</li>
                  <li>• Duo events require exactly 2 verified members; Team packages accommodate 2 to 3 verified members.</li>
                  <li>• If a teammate or friend has already added you to their team, you do not need to create or submit another team registration.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT & ENTRY QR CODE */}
          {activeTab === 'payment' && (
            <div className="reg-rules-pane">
              <div className="reg-rules-callout reg-rules-callout--amber">
                <ShieldCheck size={22} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="reg-rules-callout__title">OFFICIAL ENTRY QR CODE ISSUANCE LOGIC</h4>
                  <p className="reg-rules-callout__desc">
                    The Official Entry QR Pass is <strong>NOT shown immediately</strong> after filling the form. It unlocks <strong>only after college administrators verify and approve your payment</strong>.
                  </p>
                </div>
              </div>

              <div className="reg-rules-timeline">
                <div className="timeline-node">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-tag">STAGE 1</span>
                    <h4>REGISTRATION SUBMITTED</h4>
                    <p>You receive your unique Registration ID (e.g. <code>CS26-XXXX</code>) and your profile status displays <strong>UNDER REVIEW / PAYMENT PENDING</strong>.</p>
                  </div>
                </div>

                <div className="timeline-node">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-tag">STAGE 2</span>
                    <h4>PAYMENT VIA OFFICIAL GATEWAY</h4>
                    <p>You are forwarded to the official Vel Tech payment portal to complete payment. Save your payment transaction screenshot or UTR number.</p>
                  </div>
                </div>

                <div className="timeline-node">
                  <div className="timeline-dot timeline-dot--green" />
                  <div className="timeline-content">
                    <span className="timeline-tag text-emerald-400">STAGE 3</span>
                    <h4>AFTER PAYMENT COMPLETED</h4>
                    <p>
                      College desk verifies your payment. Status upgrades to <strong>CONFIRMED // VERIFIED</strong>. Your high-resolution Entry QR Pass appears automatically in:
                    </p>
                    <ul className="reg-rules-list mt-1.5">
                      <li><strong>Character Profile:</strong> Navigate to <code>/profile</code> to view your unlocked dossier &amp; entry pass.</li>
                      <li><strong>My Registrations Vault:</strong> Visit <code>/register/status</code> with your registered Email + Phone to download or print your pass.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="reg-rules-info-banner">
                <QrCode size={20} className="text-cyan-400 shrink-0" />
                <span>
                  Present your verified QR Code at the registration desk on the symposium day. Coordinators will scan it for venue and event admission.
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: QUICK CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="reg-rules-pane">
              <div className="reg-rules-checklist">
                <div className="checklist-item">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong>1. Decide Day &amp; Events:</strong> Check schedule for Day 1, Day 2, or Both Days.
                  </div>
                </div>

                <div className="checklist-item">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong>2. Deselect unwanted events:</strong> In the event checklist, uncheck events you do not wish to attend. Leave at least 1 checked.
                  </div>
                </div>

                <div className="checklist-item">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong>3. Submit form &amp; Pay Fee:</strong> Enter genuine details (Email, Phone, College) and pay via the official gateway.
                  </div>
                </div>

                <div className="checklist-item">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong>4. For Duo/Team events:</strong> Ensure your partner/teammates register individually first with the team event selected.
                  </div>
                </div>

                <div className="checklist-item">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong>5. Leader forms team:</strong> Once all members are verified by admin, Team Leader forms the team at <code>/register/team</code>.
                  </div>
                </div>

                <div className="checklist-item">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong>6. Access Entry QR:</strong> After admin verification, download your entry pass at <code>/profile</code> or <code>/register/status</code>.
                  </div>
                </div>
              </div>

              <div className="reg-rules-callout reg-rules-callout--cyan mt-4">
                <Sparkles size={20} className="text-cyan-400 shrink-0" />
                <p className="text-xs text-cyan-200 font-mono m-0">
                  Ready to compete? Proceed to choose your character pack and complete your registration!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <footer className="reg-rules-footer">
          <label className="reg-rules-ack-label">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="reg-rules-ack-checkbox"
            />
            <span>I have read and understood the registration, event deselection &amp; team rules.</span>
          </label>

          <div className="reg-rules-actions">
            <button
              type="button"
              className="reg-rules-btn reg-rules-btn--secondary"
              onClick={handleStatusCheck}
            >
              <span className="reg-rules-btn-text--desktop">ALREADY REGISTERED? CHECK STATUS</span>
              <span className="reg-rules-btn-text--mobile">CHECK STATUS</span>
              <ExternalLink size={14} />
            </button>

            <button
              type="button"
              className={`reg-rules-btn reg-rules-btn--primary ${!acknowledged ? 'is-disabled' : ''}`}
              onClick={handleProceed}
              disabled={!acknowledged}
            >
              <span className="reg-rules-btn-text--desktop">PROCEED TO REGISTRATION</span>
              <span className="reg-rules-btn-text--mobile">PROCEED TO REGISTER</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}
