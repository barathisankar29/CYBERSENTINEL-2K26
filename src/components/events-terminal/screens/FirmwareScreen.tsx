import React, { useState } from 'react';
import type { EventSpec } from '@/types/eventsTerminal';
import { sound } from '../sound';
import { RegisterModal } from '../RegisterModal';

interface FirmwareScreenProps {
  event: EventSpec;
  isBookmarked?: boolean;
  onBookmarkToggle?: (eventId: string) => void;
}

export const FirmwareScreen: React.FC<FirmwareScreenProps> = ({
  event,
  isBookmarked = false,
  onBookmarkToggle
}) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="w-full relative" data-purpose="firmware-screen-content">
      {/* Top Tab Protrusion with Pixel Microchip Graphic */}
      <div aria-hidden="true" className="top-protrusion-tab select-none">
        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 16 16">
          <path d="M5 1H7V3H9V1H11V3H13V5H15V7H13V9H15V11H13V13H11V15H9V13H7V15H5V13H3V11H1V9H3V7H1V5H3V3H5V1ZM5 5V11H11V5H5Z" />
        </svg>
      </div>

      {/* Stepped Pixel Corner Cutout Stripe Decoration (bottom-left) */}
      <div aria-hidden="true" className="corner-stripes" />

      {/* Neon Pink Horizontal Header Banner with Authentic Pixel Dither Fade */}
      <section
        className="pixel-dither-bar h-12 w-full flex items-center justify-between px-4 mb-6 select-none"
        data-purpose="banner-header"
      >
        <h1 className="font-pixel text-black text-xs sm:text-lg md:text-xl tracking-wider font-extrabold flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-black" />
          EVENT SPECIFICATION // {event.title}
        </h1>

        <div className="flex items-center gap-2 z-10">
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

      {/* Two-Column Interior Event Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* LEFT COLUMN: Event Visual / Poster Display */}
        <div className="lg:col-span-5 flex flex-col space-y-4" data-purpose="poster-and-status">
          {/* Retro Pixel Poster Frame */}
          <div className="border-2 border-[#9333ea] bg-[#07050a] p-3 flex flex-col items-center relative group shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            {/* Top badge inside poster */}
            <div className="w-full flex justify-between items-center text-[10px] font-silkscreen text-[#c084fc] border-b border-[#20102b] pb-2 mb-3">
              <span>{event.track === 'technical' ? 'DAY 01 // TECHNICAL TRACK' : 'DAY 02 // NON-TECHNICAL TRACK'}</span>
              <span className="text-[#ff007f] font-bold">
                {event.fee}
              </span>
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

            {/* Poster Details and Spec Tag Cloud */}
            <div className="w-full mt-3 flex flex-wrap gap-1.5 justify-center">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#12051c] border border-[#2d123d] text-[10px] font-silkscreen text-[#c084fc]"
                >
                  #{tag}
                </span>
              ))}
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

        {/* VERTICAL PIXEL DIVIDER (Desktop) */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-0 bottom-0 left-[41.66%] w-px bg-[#2d123d]"
        >
          <div className="sticky top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black border border-[#2d123d] flex items-center justify-center text-[8px] text-[#ff007f]">
            ◆
          </div>
        </div>

        {/* RIGHT COLUMN: Event Content & Specification Specs (58%) */}
        <div
          className="lg:col-span-7 flex flex-col justify-between pl-0 lg:pl-6 space-y-4"
          data-purpose="event-details-content"
        >
          {/* Header & Classification */}
          <div>
            <div className="font-silkscreen text-[11px] text-[#c084fc] tracking-wide mb-1 flex items-center gap-2">
              <span className="text-[#ff007f]">►</span>
              CATEGORY // {event.category}
            </div>
            <h2 className="font-pixel text-2xl sm:text-4xl text-white tracking-wider my-2">
              {event.title}
            </h2>
            <p className="font-silkscreen text-xs sm:text-sm text-[#a855f7] tracking-wide">
              {event.quote}
            </p>
          </div>

          {/* Description Monospace Block */}
          <div className="font-mono text-sm text-gray-300 leading-relaxed bg-[#08030d] p-3 border-l-2 border-[#9333ea]">
            {event.description}
          </div>

          {/* Event Specifications Grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono"
            data-purpose="event-spec-matrix"
          >
            <div className="pixel-chip p-2 flex flex-col">
              <span className="text-[#888888] text-[10px] font-silkscreen">[VENUE]</span>
              <span className="text-white font-bold mt-1 text-[11px]">{event.venue}</span>
            </div>
            <div className="pixel-chip p-2 flex flex-col">
              <span className="text-[#888888] text-[10px] font-silkscreen">[DATE]</span>
              <span className="text-[#c084fc] font-bold mt-1 text-[11px]">{event.date}</span>
            </div>
            <div className="pixel-chip p-2 flex flex-col">
              <span className="text-[#888888] text-[10px] font-silkscreen">[TIME]</span>
              <span className="text-white font-bold mt-1 text-[11px]">{event.time}</span>
            </div>
            <div className="pixel-chip p-2 flex flex-col">
              <span className="text-[#888888] text-[10px] font-silkscreen">[FEE]</span>
              <span className="text-[#ff007f] font-bold mt-1 text-[11px]">{event.fee}</span>
            </div>
            <div className="pixel-chip p-2 flex flex-col">
              <span className="text-[#888888] text-[10px] font-silkscreen">[TEAM SIZE]</span>
              <span className="text-white font-bold mt-1 text-[11px]">{event.teamSize}</span>
            </div>
            <div className="pixel-chip p-2 flex flex-col">
              <span className="text-[#888888] text-[10px] font-silkscreen">[ELIGIBILITY]</span>
              <span className="text-[#e0aaff] font-bold mt-1 text-[11px]">{event.eligibility}</span>
            </div>
          </div>

          {/* Event Coordinators Contact */}
          <div className="border border-[#2d123d] bg-[#08030d] p-2.5 text-xs font-mono space-y-1">
            <div className="text-[#c084fc] font-silkscreen text-[10px] flex items-center gap-1">
              <span>[i]</span> EVENT COORDINATORS:
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-gray-300 text-[11px] gap-1">
              <span>
                COORDINATOR:{' '}
                <strong className="text-white">
                  {event.chiefOperator} ({event.contactNumber})
                </strong>
              </span>
              <span>
                EMAIL: <span className="text-[#ff007f]">{event.relayEmail}</span>
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

      {/* Registration Modal */}
      <RegisterModal
        event={event}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};
