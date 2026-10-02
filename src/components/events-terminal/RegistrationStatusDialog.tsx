import React, { useEffect, useId, useRef } from 'react';
import { AlertTriangle, CheckCircle2, X, XCircle } from 'lucide-react';
import { OUTCOME_COPY, type RegistrationOutcome } from './registrationStatus';

interface DialogAction {
  label: string;
  onClick: () => void;
  busy?: boolean;
  busyLabel?: string;
}

interface RegistrationStatusDialogProps {
  outcome: RegistrationOutcome;
  registrationCode?: string;
  /** Overrides the default copy for this outcome (e.g. the returning-visitor wording). */
  title?: string;
  message?: string;
  primary: DialogAction;
  secondary?: DialogAction;
  onClose: () => void;
}

const TONE: Record<RegistrationOutcome, { accent: string; text: string; ring: string; Icon: typeof CheckCircle2 }> = {
  success: { accent: '#34d399', text: 'text-[#6ee7b7]', ring: 'border-[#34d399]/60', Icon: CheckCircle2 },
  pending: { accent: '#fbbf24', text: 'text-[#fcd34d]', ring: 'border-[#fbbf24]/60', Icon: AlertTriangle },
  failed: { accent: '#fb7185', text: 'text-[#fda4af]', ring: 'border-[#fb7185]/60', Icon: XCircle }
};

/**
 * Registration / payment outcome popup in the terminal's language — dark
 * glass panel, thin accent border, one restrained colour per outcome. It
 * always states BOTH halves separately (Registration: … / Payment: …) so a
 * created registration is never mistaken for a completed payment.
 */
export const RegistrationStatusDialog: React.FC<RegistrationStatusDialogProps> = ({
  outcome,
  registrationCode,
  title,
  message,
  primary,
  secondary,
  onClose
}) => {
  const copy = OUTCOME_COPY[outcome];
  const tone = TONE[outcome];
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);

  // Focus the main action on open; give focus back to where it was on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    primaryRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  // Escape closes; Tab stays inside the dialog.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panelRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, []);

  const statusRow = (label: string, value: string, ok: boolean) => (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-black/50 border border-[#2d123d]">
      <span className="font-silkscreen text-[10px] text-gray-400 tracking-wider">{label}</span>
      <span className={`flex items-center gap-1.5 font-pixel text-xs tracking-wider ${ok ? 'text-[#6ee7b7]' : tone.text}`}>
        {ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> : <tone.Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
        {value}
      </span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-[2px]"
      style={{
        padding:
          'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))'
      }}
      data-purpose="registration-status-dialog"
    >
      {/* Tapping outside the panel closes it (keyboard users have Close / Escape). */}
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="absolute inset-0 w-full h-full cursor-default" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`relative w-full max-w-md max-h-full overflow-y-auto bg-[#0a0612]/95 border ${tone.ring} shadow-[0_0_28px_rgba(147,51,234,0.18)]`}
        style={{ borderTop: `3px solid ${tone.accent}` }}
        data-outcome={outcome}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3 pr-6">
            <tone.Icon className={`w-6 h-6 shrink-0 mt-0.5 ${tone.text}`} aria-hidden="true" />
            <div className="min-w-0">
              <h2 id={titleId} className="font-pixel text-base sm:text-lg text-white tracking-wider leading-snug">
                {title ?? copy.title}
              </h2>
              {registrationCode && (
                <p className="mt-1 font-mono text-[11px] text-gray-400 break-all">
                  Registration ID: <span className="text-[#ffee00]">{registrationCode}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {statusRow('REGISTRATION', copy.registrationLabel, true)}
            {statusRow('PAYMENT', copy.paymentLabel, outcome === 'success')}
          </div>

          <p id={descId} className="text-xs sm:text-sm text-gray-300 font-body leading-relaxed">
            {message ?? copy.message}
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            {secondary && (
              <button
                type="button"
                onClick={secondary.onClick}
                disabled={secondary.busy}
                className="w-full sm:w-auto px-4 py-2.5 bg-black border border-zinc-700 hover:border-zinc-400 text-gray-200 hover:text-white font-pixel text-[11px] tracking-wider cursor-pointer disabled:opacity-50"
              >
                {secondary.busy ? secondary.busyLabel ?? secondary.label : secondary.label}
              </button>
            )}
            <button
              ref={primaryRef}
              type="button"
              onClick={primary.onClick}
              disabled={primary.busy}
              className="w-full sm:w-auto px-4 py-2.5 border font-pixel text-[11px] tracking-wider cursor-pointer disabled:opacity-50 text-black"
              style={{ background: tone.accent, borderColor: tone.accent }}
            >
              {primary.busy ? primary.busyLabel ?? primary.label : primary.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
