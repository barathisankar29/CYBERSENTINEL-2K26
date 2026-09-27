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

  const coordinators = event.coordinators;

  const eventDay = event.date.split('//')[0].trim();

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
          <div className="font-kelly text-sm sm:text-base text-gray-200 leading-relaxed bg-[#08030d] p-3.5 sm:p-4 border-l-2 border-[#9333ea] tracking-wide">
            {event.description}
          </div>

          {/* Event Specifications: aligned in a single row without TIME box */}
          <div
            className={`grid ${liveFee ? 'grid-cols-3' : 'grid-cols-2'} gap-2 text-xs font-mono`}
            data-purpose="event-spec-matrix"
          >
            {/* Box 1: DATE */}
            <div className="pixel-chip p-2 flex flex-col min-w-0">
              <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen">[DATE]</span>
              <span
                className={`font-bold mt-1 text-[11px] sm:text-xs truncate ${
                  event.isSpecial ? 'text-[#5fa07a]' : 'text-[#c084fc]'
                }`}
                title={eventDay}
              >
                {eventDay}
              </span>
            </div>

            {/* Optional Box 2: FEES for special events */}
            {liveFee && (
              <div className="pixel-chip p-2 flex flex-col min-w-0">
                <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen">[FEES]</span>
                <span
                  className="text-[#5fa07a] font-bold mt-1 text-[11px] sm:text-xs truncate"
                  title={liveFee}
                >
                  {liveFee}
                </span>
              </div>
            )}

            {/* Box: TEAM SIZE */}
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

      {/* Inline Event Protocols (Left Box) & Contact Details (Right Box) below the Register section */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        data-purpose="inline-protocols-and-contacts"
      >
        {/* LEFT BOX: EVENT PROTOCOLS */}
        <div
          className="bg-[#08020e] border-2 border-[#db2777] shadow-[0_0_20px_rgba(219,39,119,0.25)] p-4 sm:p-5 relative flex flex-col"
          data-purpose="inline-protocols-box"
        >
          {/* Retro Pixel Corner Markers */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#ff007f]" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ff007f]" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ff007f]" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#ff007f]" />

          {/* Top Status Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#2d123d] pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007f] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff007f]" />
              </span>
              <span className="text-[10px] font-silkscreen text-[#c084fc] tracking-wider">
                {'// PROTOCOL'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#f472b6]">[ MANDATORY RULES ]</span>
          </div>

          {/* Box Heading */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[#db2777]">►</span>
            <h3 className="font-pixel text-base sm:text-lg text-white tracking-wider">
              EVENT PROTOCOLS
            </h3>
          </div>

          {/* Protocols List */}
          <div className="space-y-2 flex-1">
            {protocolsToDisplay.map((rule, idx) => (
              <div
                key={idx}
                className="border border-[#2d123d] bg-[#0c0414] hover:border-[#db2777] p-2.5 sm:px-3.5 sm:py-2.5 flex items-start gap-3 transition-all hover:bg-[#150624]"
              >
                <span className="w-5 h-5 bg-[#1f0930] text-[#db2777] border border-[#db2777]/50 flex items-center justify-center font-silkscreen text-[9px] shrink-0 font-bold mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p className="text-gray-200 text-xs sm:text-sm font-oswald font-normal tracking-wide leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT BOX: CONTACT DETAILS */}
        <div
          className="bg-[#08020e] border-2 border-[#9333ea] shadow-[0_0_20px_rgba(147,51,234,0.25)] p-4 sm:p-5 relative flex flex-col"
          data-purpose="inline-contacts-box"
        >
          {/* Retro Pixel Corner Markers */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#ff007f]" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ff007f]" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ff007f]" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#ff007f]" />

          {/* Top Status Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#2d123d] pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff66]" />
              </span>
              <span className="text-[10px] font-silkscreen text-[#c084fc] tracking-wider">
                {'// DIRECTORY DISPATCH'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#c084fc]">[ DIRECT RELAY ]</span>
          </div>

          {/* Box Heading */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[#ff007f] text-sm">◆</span>
            <h3 className="font-pixel text-base sm:text-lg text-[#ff007f] tracking-wider">
              CONTACT DETAILS
            </h3>
          </div>

          {/* Coordinators List */}
          <div className="space-y-2 flex-1">
            {coordinators.length === 0 && (
              <p className="border border-dashed border-[#2d123d] bg-[#0c0414] p-3 text-xs sm:text-sm font-mono text-[#c084fc] tracking-wider">
                COORDINATORS WILL BE ANNOUNCED SOON.
              </p>
            )}
            {coordinators.map((coord, idx) => (
              <div
                key={idx}
                className="border border-[#2d123d] bg-[#0c0414] hover:border-[#9333ea] p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all hover:bg-[#150624]"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className="w-5 h-5 bg-[#1f0930] text-[#ff007f] border border-[#9333ea]/50 flex items-center justify-center font-silkscreen text-[9px] shrink-0 font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-white text-xs sm:text-sm font-bold truncate">
                      {coord.name}
                    </div>
                    {coord.role && (
                      <div className="text-[9px] font-mono text-[#c084fc] tracking-wider">
                        {coord.role}
                      </div>
                    )}
                  </div>
                </div>

                {coord.phone && (
                  <a
                    href={`tel:${coord.phone.replace(/[^0-9+]/g, '')}`}
                    onClick={() => sound.playNavClick()}
                    className="px-2.5 py-1.5 bg-[#000000] hover:bg-[#9333ea] text-[#00ffff] hover:text-white font-mono text-xs font-bold border border-[#9333ea] hover:border-white transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-center"
                    title={`Call ${coord.name}`}
                  >
                    <span>📞</span>
                    <span className="tracking-wider">{coord.phone}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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
