import React, { useEffect, useId, useRef, useState } from 'react';
import { Users, X } from 'lucide-react';
import { sound } from './sound';
import { eventFitsSize, eventSizeRange, type TeamEvent } from './teamEventSize';

interface TeamEventsDialogProps {
  teamName: string;
  teamSize: number;
  events: TeamEvent[];
  onConfirm: (eventIds: string[]) => void;
  onClose: () => void;
}

/**
 * Asked right before the team is created (register2 team.js `teamEvent`
 * checkboxes): which of the package's events this team will take part in.
 * Only the ticked events are sent as `selected_event_ids`; events whose size
 * range does not include the chosen team size can't be ticked.
 */
export const TeamEventsDialog: React.FC<TeamEventsDialogProps> = ({ teamName, teamSize, events, onConfirm, onClose }) => {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(events.filter((ev) => eventFitsSize(ev, teamSize)).map((ev) => ev.id))
  );

  // Focus the main action on open; give focus back to where it was on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();
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
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])');
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

  const toggle = (id: string) => {
    sound.playNavClick();
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Keep the package order when sending.
  const selectedIds = events.filter((ev) => checked.has(ev.id)).map((ev) => ev.id);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-[2px]"
      style={{
        padding:
          'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))'
      }}
      data-purpose="team-events-dialog"
    >
      {/* Tapping outside the panel closes it (keyboard users have Cancel / Escape). */}
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="absolute inset-0 w-full h-full cursor-default" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md max-h-full overflow-y-auto bg-[#0a0612]/95 border border-[#ff007f]/60 shadow-[0_0_28px_rgba(255,0,127,0.18)]"
        style={{ borderTop: '3px solid #ff007f' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 sm:p-6 flex flex-col gap-4 font-oswald font-medium">
          <div className="flex items-start gap-3 pr-6">
            <Users className="w-6 h-6 shrink-0 mt-0.5 text-[#ff007f]" aria-hidden="true" />
            <div className="min-w-0">
              <h2 id={titleId} className="font-pixel text-base sm:text-lg text-white tracking-wider leading-snug">
                WHICH EVENTS WILL THIS TEAM PLAY?
              </h2>
              <p className="mt-1 text-xs sm:text-sm tracking-wider text-[#00ffff] break-words">
                {teamName} · {teamSize} MEMBERS
              </p>
            </div>
          </div>

          <p id={descId} className="text-xs sm:text-sm text-gray-300 font-body leading-relaxed">
            Keep ticked only the events this team agrees to participate in. Unticked events will not be assigned to this
            team. Every member must have registered for each ticked event.
          </p>

          <div className="flex flex-col gap-2">
            {events.map((ev) => {
              const fits = eventFitsSize(ev, teamSize);
              const [min, max] = eventSizeRange(ev);
              const isChecked = checked.has(ev.id);
              return (
                <label
                  key={ev.id}
                  aria-label={fits ? ev.name : `${ev.name} (not for a team of ${teamSize})`}
                  className={`flex items-start gap-3 px-3 py-2.5 border transition-colors ${
                    !fits
                      ? 'border-[#2d123d] bg-black/30 opacity-50 cursor-not-allowed'
                      : isChecked
                        ? 'border-[#00ff66] bg-[#00ff66]/5 cursor-pointer'
                        : 'border-[#3b235a] bg-black/50 hover:border-[#7c3aed] cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={!fits}
                    onChange={() => toggle(ev.id)}
                    className="mt-0.5 w-4 h-4 accent-[#00ff66] cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className="flex flex-col min-w-0">
                    <span className="font-pixel text-xs text-white uppercase break-words">{ev.name}</span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {ev.code} · {min === max ? `${min}` : `${min}-${max}`} MEMBERS
                      {!fits && <span className="text-[#ff007f]"> · NOT FOR A TEAM OF {teamSize}</span>}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          {!selectedIds.length && (
            <p className="text-xs text-red-300 tracking-wide" role="alert">
              Select at least one event for this team.
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-black border border-zinc-700 hover:border-zinc-400 text-gray-200 hover:text-white font-pixel text-[11px] tracking-wider cursor-pointer"
            >
              CANCEL
            </button>
            <button
              ref={confirmRef}
              type="button"
              disabled={!selectedIds.length}
              onClick={() => onConfirm(selectedIds)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#ff007f] border border-[#ff007f] hover:bg-[#ff3399] text-white font-pixel text-[11px] tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CREATE TEAM ({selectedIds.length} EVENT{selectedIds.length === 1 ? '' : 'S'})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
