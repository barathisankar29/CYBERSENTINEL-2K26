import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EventSpec, RegisteredOperator } from '@/types/eventsTerminal';
import { sound } from './sound';
import { Check, Copy, X } from 'lucide-react';
import { getCharacterForEvent } from '@/utils/characterAssignment';
import { completeMockRegistration } from '@/utils/eventRegistration';

interface RegisterModalProps {
  event: EventSpec;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reg: RegisteredOperator) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess
}) => {
  const navigate = useNavigate();
  const character = getCharacterForEvent(event.id, event.day);
  const [crewName, setCrewName] = useState('');
  const [leadOperator, setLeadOperator] = useState('');
  const [teamCount, setTeamCount] = useState<number>(3);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [registeredData, setRegisteredData] = useState<RegisteredOperator | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewName.trim() || !leadOperator.trim()) {
      sound.playTone(220, 'sawtooth', 0.15);
      return;
    }

    const regId = `OP-${event.id.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const securityHash = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
    ).join(':');

    const newReg: RegisteredOperator = {
      regId,
      eventName: event.title,
      crewName: crewName.trim(),
      leadOperator: leadOperator.trim(),
      callsign: `NODE#${Math.floor(10 + Math.random() * 90)}`,
      teamCount,
      contactEmail: contactEmail.trim() || 'operator@darknet.io',
      contactPhone: contactPhone.trim() || '+91 90000 00000',
      timestamp: new Date().toLocaleDateString('en-GB') + ' // ' + new Date().toLocaleTimeString(),
      securityHash
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('cyberfest_passes') || '[]');
      existing.unshift(newReg);
      localStorage.setItem('cyberfest_passes', JSON.stringify(existing));
    } catch {
      // Fallback
    }

    // Character assignment is a RESULT of this registration, derived from
    // which event was registered for (see utils/characterAssignment.ts) —
    // never chosen directly. Persisted the same way the /profile route
    // reads it (see utils/eventRegistration.ts), so the profile access
    // badge and /profile immediately reflect this registration too.
    const priceMatch = event.fee.match(/\d+/);
    completeMockRegistration(
      character.id,
      { id: event.id, label: event.title, price: priceMatch ? Number(priceMatch[0]) : 0, events: [event.title] },
      leadOperator.trim(),
      contactEmail.trim() || 'operator@darknet.io'
    );

    sound.playSuccess();
    setRegisteredData(newReg);
    onSuccess(newReg);
  };

  const handleCopyId = () => {
    if (registeredData) {
      navigator.clipboard.writeText(registeredData.regId);
      setCopied(true);
      sound.playBlip();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-black border-4 border-[#ff007f] shadow-[0_0_30px_rgba(255,0,127,0.7)] p-4 sm:p-6 relative select-none"
        data-purpose="registration-modal-frame"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playNavClick();
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-[#ff007f] p-1 border border-[#333] hover:border-[#ff007f] cursor-pointer"
          title="Abort Terminal Session [ESC]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b-2 border-[#ff007f] pb-3 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-silkscreen text-[#00ffff]">
            <span className="w-2 h-2 bg-[#ff007f] animate-ping inline-block" />
            <span>ENCRYPTED DISPATCH // REGISTRATION PROTOCOL</span>
          </div>
          <h2 className="font-pixel text-lg sm:text-xl text-white mt-1">
            {event.title} {'//'} PASS REQUEST
          </h2>
          <p className="font-mono text-xs text-[#ffee00] mt-1">
            FEE: {event.fee} | VENUE: {event.venue}
          </p>
        </div>

        {!registeredData ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reg-crew-name" className="block text-[11px] font-silkscreen text-gray-300 mb-1">
                [01] CREW / SQUAD CALLSIGN *
              </label>
              <input
                id="reg-crew-name"
                type="text"
                required
                value={crewName}
                onChange={(e) => setCrewName(e.target.value)}
                placeholder="e.g. CYBER_VOID_X"
                className="w-full bg-[#0a0a0a] border-2 border-[#333] focus:border-[#ff007f] text-white font-mono text-sm px-3 py-2 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-lead-operator" className="block text-[11px] font-silkscreen text-gray-300 mb-1">
                  [02] CHIEF OPERATOR NAME *
                </label>
                <input
                  id="reg-lead-operator"
                  type="text"
                  required
                  value={leadOperator}
                  onChange={(e) => setLeadOperator(e.target.value)}
                  placeholder="Lead Engineer"
                  className="w-full bg-[#0a0a0a] border-2 border-[#333] focus:border-[#ff007f] text-white font-mono text-sm px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label htmlFor="reg-team-count" className="block text-[11px] font-silkscreen text-gray-300 mb-1">
                  [03] OPERATORS COUNT
                </label>
                <select
                  id="reg-team-count"
                  value={teamCount}
                  onChange={(e) => setTeamCount(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border-2 border-[#333] focus:border-[#ff007f] text-white font-mono text-sm px-3 py-2 outline-none cursor-pointer"
                >
                  <option value={1}>1 Operator (Solo Pilot)</option>
                  <option value={2}>2 Operators (Duo Sync)</option>
                  <option value={3}>3 Operators (Strike Cell)</option>
                  <option value={4}>4 Operators (Full Crew)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-contact-email" className="block text-[11px] font-silkscreen text-gray-300 mb-1">
                  [04] RELAY COMM / EMAIL
                </label>
                <input
                  id="reg-contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="operator@techfest.ac.in"
                  className="w-full bg-[#0a0a0a] border-2 border-[#333] focus:border-[#ff007f] text-white font-mono text-sm px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label htmlFor="reg-contact-phone" className="block text-[11px] font-silkscreen text-gray-300 mb-1">
                  [05] SECURE PHONE FREQ
                </label>
                <input
                  id="reg-contact-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98000 12345"
                  className="w-full bg-[#0a0a0a] border-2 border-[#333] focus:border-[#ff007f] text-white font-mono text-sm px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-[#222] p-2 text-[10px] font-mono text-gray-400">
              <span className="text-[#00ff66]">INFO:</span> Registration reserves your workstation in Lab 04 Cyber Dock with logic analyzer hardware & pre-flashed target boards.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playNavClick();
                  onClose();
                }}
                className="w-1/3 py-2.5 font-pixel text-xs border border-[#444] text-gray-400 hover:text-white hover:bg-[#1a1a1a] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="w-2/3 arcade-cta py-2.5 px-4 font-pixel text-white text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>&gt;&gt;</span>
                <span>CONFIRM DISPATCH</span>
                <span>&lt;&lt;</span>
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS OPERATOR PASS BADGE */
          <div className="space-y-4">
            <div className="border-2 border-[#00ff66] bg-[#05150a] p-4 relative">
              <div className="flex justify-between items-center border-b border-[#00ff66]/40 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00ff66] animate-pulse" />
                  <span className="font-silkscreen text-[11px] text-[#00ff66]">
                    OPERATOR PASS AUTHORIZED
                  </span>
                </div>
                <span className="font-pixel text-[9px] text-white bg-[#00ff66]/30 px-2 py-0.5 border border-[#00ff66]">
                  STATUS: SECURED
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">PASS ID:</span>
                  <span className="font-pixel text-sm text-[#ffee00]">{registeredData.regId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CREW CALLSIGN:</span>
                  <span className="text-white font-bold">{registeredData.crewName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">LEAD OPERATOR:</span>
                  <span className="text-[#00ffff]">{registeredData.leadOperator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TEAM COMPOSITION:</span>
                  <span className="text-white">{registeredData.teamCount} Operators</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">VENUE DOCK:</span>
                  <span className="text-white">{event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SECURITY HASH:</span>
                  <span className="text-[#ff007f] text-[10px] font-mono">{registeredData.securityHash}</span>
                </div>
              </div>
            </div>

            {/* Character assignment — a RESULT of this registration, not a
                choice. Shown inline in the same pass/login flow rather than
                as a separate character-first screen. */}
            <div className="border-2 border-[#9333ea] bg-[#0c0410] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#9333ea] animate-pulse" />
                <span className="font-silkscreen text-[10px] text-[#c084fc]">IDENTITY ASSIGNED:</span>
              </div>
              <span className="font-pixel text-xs text-white">{character.name.toUpperCase()}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyId}
                className="flex-1 py-2.5 px-3 border border-[#00ffff] bg-black text-[#00ffff] hover:bg-[#00ffff]/10 font-silkscreen text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-[#00ff66]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY PASS ID'}</span>
              </button>
              <button
                onClick={() => {
                  sound.playNavClick();
                  onClose();
                  navigate('/profile');
                }}
                className="flex-1 arcade-cta py-2.5 px-3 font-pixel text-white text-xs flex items-center justify-center cursor-pointer"
              >
                VIEW CLASSIFIED PROFILE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
