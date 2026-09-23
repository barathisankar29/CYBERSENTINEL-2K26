import React, { useState } from 'react';
import { ALL_EVENTS } from '@/data/eventsTerminalData';
import type { EventSpec } from '@/types/eventsTerminal';
import { sound } from '../sound';
import { RegisterModal } from '../RegisterModal';

interface CompeteScreenProps {
  onSelectEvent: (event: EventSpec) => void;
  selectedEventId?: string;
}

export const CompeteScreen: React.FC<CompeteScreenProps> = ({
  onSelectEvent,
  selectedEventId
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'day1' | 'day2'>('all');
  const [modalEvent, setModalEvent] = useState<EventSpec | null>(null);

  const filteredEvents = ALL_EVENTS.filter((ev) => {
    if (activeTab === 'day1') return ev.day === 1;
    if (activeTab === 'day2') return ev.day === 2;
    return true;
  });

  return (
    <div className="w-full relative" data-purpose="compete-screen-content">
      {/* Top Tab Protrusion with Pixel Plus Graphic */}
      <div aria-hidden="true" className="top-protrusion-tab select-none">
        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 16 16">
          <path d="M6 2H10V6H14V10H10V14H6V10H2V6H6V2Z" />
        </svg>
      </div>

      {/* Pixel Corner Stripe Decoration */}
      <div aria-hidden="true" className="corner-stripes" />

      {/* Header Dither Bar */}
      <section className="pixel-dither-bar h-12 w-full flex items-center justify-between px-4 mb-6 select-none">
        <h1 className="font-pixel text-black text-xs sm:text-lg tracking-wider font-extrabold flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-black" />
          EVENTS // CYBERSENTINEL 2K26
        </h1>
        <span className="font-silkscreen text-[10px] text-black font-bold hidden sm:inline-block z-10">
          12 EVENTS // 2 TRACKS
        </span>
        <div aria-hidden="true" className="pixel-dither-fade" />
      </section>

      {/* Filter Tabs matching exact retro pixel design */}
      <div className="flex gap-2 mb-5 font-silkscreen text-xs overflow-x-auto pb-1 select-none">
        {[
          { id: 'all', label: '[ALL (12)]' },
          { id: 'day1', label: '[DAY 1 (5 EVENTS)]' },
          { id: 'day2', label: '[DAY 2 (7 EVENTS)]' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playNavClick();
              setActiveTab(tab.id as typeof activeTab);
            }}
            className={`px-3 py-1.5 border cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#ff007f] text-white border-[#ff007f] font-bold shadow-[0_0_10px_rgba(255,0,127,0.5)]'
                : 'bg-black text-gray-300 border-[#333] hover:border-[#ff007f]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Event Cards Grid - Preserving exact visual density and card proportions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((ev) => {
          const isSelected = selectedEventId === ev.id;
          return (
            <div
              key={ev.id}
              className={`border-2 bg-[#07050a] p-3.5 flex flex-col justify-between transition-all shadow-sm ${
                isSelected
                  ? 'border-[#ff007f] shadow-[0_0_12px_rgba(255,0,127,0.3)] ring-1 ring-[#ff007f]'
                  : 'border-[#2d123d] hover:border-[#ff007f]'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-[10px] font-silkscreen text-[#c084fc] pb-2 border-b border-[#20102b]">
                  <span>{ev.track === 'technical' ? 'TRACK 01 // TECH' : 'TRACK 02 // NON-TECH'}</span>
                  <span className="text-[#ff007f] font-bold">{ev.fee}</span>
                </div>

                <h3 className="font-pixel text-sm sm:text-base text-white mt-2.5 tracking-wider">
                  {ev.title}
                </h3>
                <p className="font-silkscreen text-[9px] text-[#e0aaff] mt-1 mb-2 line-clamp-1">
                  {ev.quote}
                </p>
                <p className="font-mono text-xs text-gray-300 line-clamp-3 leading-relaxed">
                  {ev.description}
                </p>

                <div className="mt-3 pt-2 border-t border-[#1a0f24] text-[11px] font-mono text-gray-300 space-y-1">
                  <div>
                    <span className="text-gray-500 font-silkscreen text-[9px]">VENUE:</span>{' '}
                    <span className="text-gray-200">{ev.venue}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-silkscreen text-[9px]">DATE:</span>{' '}
                    <span className="text-[#c084fc] font-bold">{ev.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-silkscreen text-[9px]">CREW:</span>{' '}
                    <span className="text-gray-200">{ev.teamSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-2.5 border-t border-[#20102b]">
                <button
                  onClick={() => {
                    sound.playNavClick();
                    onSelectEvent(ev);
                  }}
                  className="flex-1 py-1.5 font-silkscreen text-[11px] border border-[#ff007f] text-[#ff007f] hover:bg-[#ff007f]/15 cursor-pointer transition-colors text-center"
                  title={`View detailed specs for ${ev.title}`}
                >
                  VIEW SPEC
                </button>
                <button
                  onClick={() => {
                    sound.playNavClick();
                    setModalEvent(ev);
                  }}
                  className="flex-1 py-1.5 font-pixel text-[10px] bg-[#ff007f] text-white hover:bg-[#ff3399] cursor-pointer shadow-[0_0_8px_rgba(255,0,127,0.4)] transition-all text-center"
                >
                  REGISTER
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalEvent && (
        <RegisterModal
          event={modalEvent}
          isOpen={!!modalEvent}
          onClose={() => setModalEvent(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};
