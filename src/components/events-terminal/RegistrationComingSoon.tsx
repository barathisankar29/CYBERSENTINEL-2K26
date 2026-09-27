import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { sound } from './sound';

interface RegistrationComingSoonProps {
  /** Launch moment; null = no date announced yet (no countdown). */
  opensAt: Date | null;
  /** Called once when the countdown reaches zero. */
  onOpen: () => void;
}

const UNITS = [
  { label: 'DAYS', ms: 86_400_000 },
  { label: 'HOURS', ms: 3_600_000 },
  { label: 'MINS', ms: 60_000 },
  { label: 'SECS', ms: 1_000 },
] as const;

function splitRemaining(ms: number): number[] {
  let rest = Math.max(ms, 0);
  return UNITS.map(({ ms: unit }) => {
    const value = Math.floor(rest / unit);
    rest -= value * unit;
    return value;
  });
}

/**
 * Full-screen "REGISTRATION OPENS SOON" overlay (design:
 * registration_countdown.zip) shown over the events terminal until
 * registration launches — see src/config/registrationLaunch.ts. The terminal
 * stays visible underneath but blurred and inert.
 *
 * With a launch date it shows a live countdown and unlocks itself at zero;
 * without one it's a static "coming soon" panel. The design's "Notify me"
 * button had no backend behind it, so the action here is Back to city.
 */
export function RegistrationComingSoon({ opensAt, onOpen }: RegistrationComingSoonProps) {
  const [now, setNow] = useState(() => Date.now());
  const backRef = useRef<HTMLAnchorElement>(null);

  // Tick once a second, only when there's something to count down to.
  useEffect(() => {
    if (!opensAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [opensAt]);

  const remaining = opensAt ? opensAt.getTime() - now : null;
  useEffect(() => {
    if (remaining !== null && remaining <= 0) onOpen();
  }, [remaining, onOpen]);

  // Modal behaviour: no page scroll behind it, focus starts on its action.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    backRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const parts = remaining !== null ? splitRemaining(remaining) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-soon-title"
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 overflow-y-auto select-none"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        background: 'rgba(0, 0, 0, 0.78)',
      }}
      data-purpose="countdown-modal-overlay"
    >
      <div
        className="relative w-full max-w-xl p-6 sm:p-8 text-center flex flex-col items-center gap-6"
        style={{
          backgroundColor: '#08080c',
          border: '4px solid #ff007f',
          boxShadow: '0 0 25px rgba(255, 0, 127, 0.6), inset 0 0 15px rgba(255, 0, 127, 0.2)',
          outline: '2px solid #00f0ff',
        }}
      >
        <div className="flex items-center gap-2 px-3 py-1 border" style={{ borderColor: '#ffd700', background: 'rgba(255, 215, 0, 0.1)' }}>
          <span className="inline-block w-2 h-2" style={{ backgroundColor: '#ffd700', boxShadow: '0 0 6px #ffd700' }} />
          <span className="font-pixel text-[9px] sm:text-[10px] tracking-wider uppercase" style={{ color: '#ffd700' }}>
            [ SYSTEM STATUS: LOCKED ]
          </span>
          <span className="inline-block w-2 h-2" style={{ backgroundColor: '#ffd700', boxShadow: '0 0 6px #ffd700' }} />
        </div>

        <div className="space-y-2">
          <h2
            id="registration-soon-title"
            className="font-pixel text-lg sm:text-2xl text-white tracking-wide uppercase leading-snug"
            style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.7)' }}
          >
            REGISTRATION OPENS SOON
          </h2>
          <p className="font-vt text-base sm:text-lg tracking-wider" style={{ color: '#00f0ff' }}>
            STANDBY PROTOCOL // ACCESS GATES INITIALIZING
          </p>
        </div>

        {parts && (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md" aria-live="off">
            {UNITS.map(({ label }, i) => (
              <div
                key={label}
                className="bg-black border-2 p-2 sm:p-3 flex flex-col items-center justify-center"
                style={{ borderColor: '#00f0ff', boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)' }}
              >
                <span
                  className="font-pixel text-xl sm:text-3xl font-bold"
                  style={
                    label === 'SECS'
                      ? { color: '#ff007f', textShadow: '0 0 8px rgba(255, 0, 127, 0.6)' }
                      : { color: '#00ff66', textShadow: '0 0 8px rgba(0, 255, 102, 0.6)' }
                  }
                >
                  {String(parts[i]).padStart(2, '0')}
                </span>
                <span className="font-pixel text-[8px] sm:text-[9px] mt-1 text-zinc-400 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3 w-full max-w-sm">
          <p className="font-vt text-sm sm:text-base text-zinc-300 tracking-wide">
            {opensAt
              ? 'ACCESS TERMINALS WILL UNLOCK AUTOMATICALLY UPON LAUNCH.'
              : 'EVENT REGISTRATION WILL BE ANNOUNCED SOON. STAY TUNED.'}
          </p>
          <Link
            ref={backRef}
            to="/#buildings"
            onClick={() => sound.playNavClick()}
            className="block w-full py-3 px-4 bg-black border-2 font-pixel text-xs sm:text-sm tracking-wider uppercase text-[#ff007f] border-[#ff007f] shadow-[0_0_12px_rgba(255,0,127,0.4)] hover:bg-[#ff007f] hover:text-black focus-visible:bg-[#ff007f] focus-visible:text-black focus-visible:outline-none active:translate-y-0.5"
          >
            &gt;&gt; BACK TO CITY &lt;&lt;
          </Link>
          <div className="font-vt text-xs text-zinc-500 tracking-widest">
            TRANSMISSION ENCRYPTED // CYBERSENTINEL 2K26
          </div>
        </div>
      </div>
    </div>
  );
}
