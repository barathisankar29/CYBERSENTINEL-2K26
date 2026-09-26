import React, { useState } from 'react';
import type { EventSpec, ModuleId } from '@/types/eventsTerminal';
import { isPaidSpecialFeeEvent } from '@/data/eventsTerminalData';
import { liveSpecialFeeLabel, useLiveRegistrationData } from '../useLiveRegistrationData';
import { sound } from '../sound';
import { RegisterModal } from '../RegisterModal';
import type { RegistrationPortalInitialData } from '../RegistrationPortalPage';

interface FirmwareScreenProps {
  event: EventSpec;
  isBookmarked?: boolean;
  onBookmarkToggle?: (eventId: string) => void;
  onSelectModule?: (mod: ModuleId) => void;
  onProceedToPortal: (data: RegistrationPortalInitialData) => void;
}

export const FirmwareScreen: React.FC<FirmwareScreenProps> = ({
  event,
  isBookmarked = false,
  onBookmarkToggle,
  onProceedToPortal
}) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { specialEvents } = useLiveRegistrationData();
  const liveFee = isPaidSpecialFeeEvent(event) ? liveSpecialFeeLabel(specialEvents, event.id) : null;
  const protocolsToDisplay: string[] =
    event.protocols && event.protocols.length > 0
      ? event.protocols
      : [
          'Official College ID Card is strictly mandatory for campus entry and arena access.',
          'Participants must report to their respective arena 20 minutes before the scheduled time slot.',
          'Judges and conveners decisions are final across all technical and creative evaluation rounds.',
          'Malpractice or unauthorized hardware tampering results in immediate disqualification.',
          'Certificates will be distributed at the valedictory session to all verified participants.'
        ];

  // Coordinators from the event data; falls back to the event's own chief
  // operator + contact number. No invented names or numbers.
  const coordinators =
    event.coordinators && event.coordinators.length > 0
      ? event.coordinators
      : event.chiefOperator && event.contactNumber
        ? [{ name: event.chiefOperator, phone: event.contactNumber, role: 'Event Coordinator' }]
        : [];

  return (
    <div className="w-full relative" data-purpose="firmware-screen-content">
      {/* Neon Pink Horizontal Header Banner with Authentic Pixel Dither Fade */}
      <section
        className="pixel-dither-bar min-h-12 h-auto py-2 w-full flex items-center justify-between px-3 sm:px-4 mb-6 select-none"
        data-purpose="banner-header"
      >
        <h1 className="font-pixel text-black text-xs sm:text-base md:text-lg tracking-wider font-extrabold flex items-center gap-2 sm:gap-3 z-10 break-words pr-2 leading-tight">
          <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black shrink-0" />
          <span>EVENT // {event.title}</span>
        </h1>

        <div className="flex items-center gap-2 z-10 shrink-0">
          {onBookmarkToggle && (
            <button
              onClick={() => {
                sound.playNavClick();
                onBookmarkToggle(event.id);
              }}
              className="px-2 py-1 bg-black text-[10px] font-silkscreen text-white border border-white hover:border-[#ff007f] cursor-pointer"
              title="Save Event"
            >
              {isBookmarked ? '★ SAVED' : '☆ SAVE'}
            </button>
          )}
        </div>

        {/* Dot-matrix pixel fade dither overlay */}
        <div aria-hidden="true" className="pixel-dither-fade" />
      </section>

      {/* Two-Column Interior Event Layout on Desktop & Tablets (>= 768px), Stacked Single Column on Mobile Phones (< 768px) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
        {/* LEFT COLUMN: Event Visual / Poster Display (shown on every screen size) */}
        <div className="flex md:col-span-5 flex-col space-y-4" data-purpose="poster-and-status">
          {/* Retro Pixel Poster Frame */}
          <div className="border-2 border-[#9333ea] bg-[#07050a] p-3 flex flex-col items-center relative group shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            {/* Top badge inside poster */}
            <div className="w-full flex justify-between items-center text-[10px] font-silkscreen text-[#c084fc] border-b border-[#20102b] pb-2 mb-3">
              <span>{event.track === 'technical' ? 'DAY 01 // TECHNICAL TRACK' : 'DAY 02 // NON-TECHNICAL TRACK'}</span>
              {liveFee && (
                <span className="text-[#ff007f] font-bold">
                  {liveFee}
                </span>
              )}
            </div>

            {/* Pixel Artwork Canvas / Graphic Area */}
            <div className="w-full h-52 sm:h-64 bg-black border border-[#2b1038] relative flex flex-col items-center justify-center p-3 overflow-hidden select-none">
              {/* Background Grid lines with subtle purple/magenta */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255, 0, 127, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.2) 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Central Hardware Microchip Pixel Illustration */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-28 h-28 border-2 border-[#9333ea] bg-[#0c0410] flex items-center justify-center relative shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                  {/* Chip Pins Top & Bottom */}
                  <div className="absolute -top-2 flex gap-2">
                    <span className="w-1.5 h-2 bg-[#ff007f]" />
                    <span className="w-1.5 h-2 bg-[#9333ea]" />
                    <span className="w-1.5 h-2 bg-[#ff007f]" />
                    <span className="w-1.5 h-2 bg-[#9333ea]" />
                  </div>
                  <div className="absolute -bottom-2 flex gap-2">
                    <span className="w-1.5 h-2 bg-[#9333ea]" />
                    <span className="w-1.5 h-2 bg-[#ff007f]" />
                    <span className="w-1.5 h-2 bg-[#9333ea]" />
                    <span className="w-1.5 h-2 bg-[#ff007f]" />
                  </div>

                  {/* Chip Core */}
                  <div className="w-16 h-16 border border-[#9333ea] bg-[#050208] flex flex-col items-center justify-center text-center p-1">
                    <span className="font-silkscreen text-[9px] text-[#c084fc] leading-none">
                      {event.chipLabel || 'EVENT'}
                    </span>
                    <span className="font-pixel text-[8px] text-white mt-1">
                      {event.chipSub || 'CSE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scanline CRT overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-6 w-full animate-pulse" />
            </div>
          </div>

          {/* Registration Status Box */}
          <div className="border border-[#2d123d] bg-[#08030d] p-3 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#00ff66] border border-black shadow-[0_0_6px_#00ff66]" />
              <span className="text-gray-300">REGISTRATION:</span>
            </div>
            <span className="text-[#00ff66] font-bold tracking-wider">OPEN</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Event Content & Specification Specs (Full width on mobile phone, 7 cols on desktop/tablets) */}
        <div
          className="col-span-1 md:col-span-7 flex flex-col justify-between space-y-4"
          data-purpose="event-details-content"
        >
          {/* Header & Classification */}
          <div>
            <h2 className="font-pixel text-2xl sm:text-4xl text-white tracking-wider mb-2">
              {event.title}
            </h2>
            <p className="font-silkscreen text-xs sm:text-sm text-[#a855f7] tracking-wide">
              {event.quote}
            </p>
          </div>

          {/* Description Block */}
          <div className="font-body text-sm sm:text-base text-gray-200 leading-relaxed bg-[#08030d] p-3.5 sm:p-4 border-l-2 border-[#9333ea] tracking-normal font-normal">
            {event.description}
          </div>

          {/* Event Specifications: 3 boxes aligned in a single row */}
          <div
            className="grid grid-cols-3 gap-2 text-xs font-mono"
            data-purpose="event-spec-matrix"
          >
            {/* Box 1: DATE */}
            <div className="pixel-chip p-2 flex flex-col min-w-0">
              <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen">[DATE]</span>
              <span
                className={`font-bold mt-1 text-[11px] sm:text-xs truncate ${
                  event.isSpecial ? 'text-[#5fa07a]' : 'text-[#c084fc]'
                }`}
                title={event.date}
              >
                {event.date}
              </span>
            </div>

            {/* Box 2: TIME for standard events, FEES for special events */}
            <div className="pixel-chip p-2 flex flex-col min-w-0">
              {liveFee ? (
                <>
                  <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen">[FEES]</span>
                  <span
                    className="text-[#5fa07a] font-bold mt-1 text-[11px] sm:text-xs truncate"
                    title={liveFee}
                  >
                    {liveFee}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen">[TIME]</span>
                  <span
                    className="text-white font-bold mt-1 text-[11px] sm:text-xs truncate"
                    title={event.time}
                  >
                    {event.time}
                  </span>
                </>
              )}
            </div>

            {/* Box 3: TEAM SIZE */}
            <div className="pixel-chip p-2 flex flex-col min-w-0">
              <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen">[TEAM SIZE]</span>
              <span
                className="text-white font-bold mt-1 text-[11px] sm:text-xs truncate"
                title={event.teamSize}
              >
                {event.teamSize}
              </span>
            </div>
          </div>

          {/* REGISTER NOW Action Button Container */}
          <div className="pt-1">
            <button
              id="btn-register-operator"
              onClick={() => {
                sound.playNavClick();
                setIsRegisterOpen(true);
              }}
              className="arcade-cta w-full py-3.5 px-6 font-pixel text-white text-xs sm:text-sm tracking-wider flex items-center justify-center gap-3 transition-transform cursor-pointer"
              data-purpose="registration-cta-button"
            >
              <span>&gt;&gt;</span>
              <span>REGISTER FOR EVENT</span>
              <span>&lt;&lt;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Event Protocols (inline) */}
      <section className="mt-6 border-2 border-[#db2777]/70 bg-[#08020e] p-4 sm:p-5" data-purpose="event-protocols">
        <h3 className="font-pixel text-base sm:text-xl text-white tracking-wider flex items-center gap-2 mb-3">
          <span className="text-[#db2777]">►</span>
          <span>EVENT PROTOCOLS</span>
        </h3>
        <ol className="space-y-2">
          {protocolsToDisplay.map((rule, idx) => (
            <li
              key={idx}
              className="border border-[#2d123d] bg-[#0c0414] p-2.5 sm:px-4 sm:py-3 flex items-start gap-3"
            >
              <span className="w-5 h-5 bg-[#1f0930] text-[#db2777] border border-[#db2777]/50 flex items-center justify-center font-silkscreen text-[9px] shrink-0 font-bold mt-0.5">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <p className="text-gray-200 text-xs sm:text-sm font-body leading-relaxed">{rule}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Contacts (inline) */}
      {coordinators.length > 0 && (
        <section className="mt-4 border-2 border-[#9333ea]/70 bg-[#08020e] p-4 sm:p-5" data-purpose="event-contacts">
          <h3 className="font-pixel text-base sm:text-xl text-[#ff007f] tracking-wider flex items-center gap-2 mb-3">
            <span>◆</span>
            <span>CONTACTS</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {coordinators.map((coord, idx) => (
              <div
                key={`${coord.name}-${idx}`}
                className="border border-[#2d123d] bg-[#0c0414] p-2.5 sm:p-3 flex flex-col gap-2"
              >
                <div className="min-w-0">
                  <div className="font-mono text-white text-xs sm:text-sm font-bold truncate">{coord.name}</div>
                  {coord.role && (
                    <div className="text-[9px] font-mono text-[#c084fc] tracking-wider">{coord.role}</div>
                  )}
                </div>
                <a
                  href={`tel:${coord.phone.replace(/[^0-9+]/g, '')}`}
                  onClick={() => sound.playNavClick()}
                  className="px-2.5 py-2 bg-black hover:bg-[#9333ea] text-[#00ffff] hover:text-white font-mono text-xs font-bold border border-[#9333ea] hover:border-white transition-colors flex items-center justify-center gap-2 min-h-[40px]"
                  title={`Call ${coord.name}`}
                >
                  <span aria-hidden="true">📞</span>
                  <span className="tracking-wider">{coord.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Registration Modal */}
      <RegisterModal
        event={event}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onProceedToPortal={onProceedToPortal}
      />

    </div>
  );
};
