import React, { useState } from 'react';
import { ALL_EVENTS, isPaidSpecialFeeEvent } from '@/data/eventsTerminalData';
import { liveSpecialFeeLabel, useLiveRegistrationData } from '../useLiveRegistrationData';
import type { EventSpec } from '@/types/eventsTerminal';
import { sound } from '../sound';
import { RegisterModal } from '../RegisterModal';
import type { RegistrationPortalInitialData } from '../RegistrationPortalPage';

interface CompeteScreenProps {
  onSelectEvent: (event: EventSpec) => void;
  selectedEventId?: string;
  initialTab?: 'all' | 'day1' | 'day2' | 'special';
  onTabChange?: (tab: 'all' | 'day1' | 'day2' | 'special') => void;
  onProceedToPortal: (data: RegistrationPortalInitialData) => void;
}

export const CompeteScreen: React.FC<CompeteScreenProps> = ({
  onSelectEvent,
  selectedEventId,
  initialTab = 'all',
  onTabChange,
  onProceedToPortal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'day1' | 'day2' | 'special'>(initialTab);
  const [modalEvent, setModalEvent] = useState<EventSpec | null>(null);
  const [isPackSelectionOpen, setIsPackSelectionOpen] = useState(false);
  const { specialEvents: liveSpecialEvents } = useLiveRegistrationData();

  // Sync state if initialTab changes from outside navigation
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tab: 'all' | 'day1' | 'day2' | 'special') => {
    sound.playNavClick();
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Group events based on requested classification:
  // Day 1: 5 events (all day 1 events)
  // Day 2: 5 events (technical_quiz, connections, ipl_auction, opposites_attract, solo_dance)
  // Special Events: 2 events (thiruvizha_corner and group_dance)
  const isSpecialEvent = (ev: EventSpec) =>
    ev.id === 'group_dance' || ev.id === 'thiruvizha_corner';

  const day1Events = ALL_EVENTS.filter((ev) => ev.day === 1 && !isSpecialEvent(ev));
  const day2Events = ALL_EVENTS.filter((ev) => ev.day === 2 && !isSpecialEvent(ev));
  const specialEvents = ALL_EVENTS.filter(isSpecialEvent);

  const filteredEvents = ALL_EVENTS.filter((ev) => {
    if (activeTab === 'day1') return ev.day === 1 && !isSpecialEvent(ev);
    if (activeTab === 'day2') return ev.day === 2 && !isSpecialEvent(ev);
    if (activeTab === 'special') return isSpecialEvent(ev);
    return true;
  });

  return (
    <div className="w-full relative" data-purpose="compete-screen-content">
      {/* Header Dither Bar */}
      <section className="pixel-dither-bar h-12 w-full flex items-center justify-between px-4 mb-6 select-none">
        <h1 className="font-pixel text-black text-xs sm:text-lg tracking-wider font-extrabold flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-black" />
          EVENTS // CYBERSENTINEL 2K26
        </h1>
        <div aria-hidden="true" className="pixel-dither-fade" />
      </section>

      {/* Filter Tabs matching exact retro pixel design with separate Special Events tab and Player Packs CTA */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 font-silkscreen text-xs select-none">
        <div className="flex flex-wrap gap-2 items-center">
          {[
            { id: 'all', label: `[ALL (${ALL_EVENTS.length})]`, activeBorder: '#db2777', activeBg: '#db2777' },
            { id: 'day1', label: `[DAY 1 (${day1Events.length} EVENTS)]`, activeBorder: '#db2777', activeBg: '#db2777' },
            { id: 'day2', label: `[DAY 2 (${day2Events.length} EVENTS)]`, activeBorder: '#db2777', activeBg: '#db2777' },
            { id: 'special', label: `[SPECIAL EVENTS (${specialEvents.length}) ★]`, activeBorder: '#5fa07a', activeBg: '#5fa07a', isSpecialTab: true }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as typeof activeTab)}
                style={
                  isActive
                    ? {
                        borderColor: tab.activeBorder,
                        backgroundColor: tab.activeBg,
                        color: '#ffffff',
                        boxShadow: tab.isSpecialTab
                          ? '0 0 10px rgba(95, 160, 122, 0.4)'
                          : '0 0 10px rgba(219, 39, 119, 0.35)'
                      }
                    : undefined
                }
                className={`px-3 py-1.5 border cursor-pointer whitespace-nowrap transition-all font-bold ${
                  isActive
                    ? ''
                    : tab.isSpecialTab
                    ? 'bg-[#090b14] text-[#5fa07a] border-[#5fa07a]/50 hover:border-[#5fa07a] hover:bg-[#5fa07a]/10'
                    : 'bg-[#090710] text-gray-300 border-[#261f33] hover:border-[#db2777]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            sound.playNavClick();
            setIsPackSelectionOpen(true);
          }}
          className="px-3 py-1.5 border border-[#d97706] bg-[#120c04] text-[#fbbf24] hover:bg-[#d97706] hover:text-black transition-all font-bold whitespace-nowrap shadow-[0_0_8px_rgba(217,119,6,0.2)] cursor-pointer flex items-center gap-1.5 text-[11px] sm:text-xs"
          title="Choose your Player Pack (Day 1, Day 2, Specific Protocols, or All Access Dual Pass)"
        >
          <span>⚡</span>
          <span>CHOOSE PLAYER PACKS</span>
        </button>
      </div>

      {/* Event Cards Grid - Preserving exact visual density with unique special event border */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((ev) => {
          const isSelected = selectedEventId === ev.id;
          const isSpecial = isSpecialEvent(ev);

          return (
            <div
              key={ev.id}
              className={`border-2 bg-[#090710] p-3.5 flex flex-col justify-between transition-all shadow-sm ${
                isSpecial
                  ? isSelected
                    ? 'border-[#5fa07a] shadow-[0_0_14px_rgba(95,160,122,0.4)] ring-1 ring-[#5fa07a]'
                    : 'border-[#5fa07a]/70 shadow-[0_0_8px_rgba(95,160,122,0.2)] hover:border-[#5fa07a] hover:shadow-[0_0_12px_rgba(95,160,122,0.3)]'
                  : isSelected
                  ? 'border-[#db2777] shadow-[0_0_10px_rgba(219,39,119,0.25)] ring-1 ring-[#db2777]'
                  : 'border-[#261f33] hover:border-[#db2777]/80'
              }`}
            >
              <div>
                <div
                  className={`flex justify-between items-center text-[10px] font-silkscreen pb-2 border-b ${
                    isSpecial ? 'border-[#5fa07a]/30 text-[#5fa07a]' : 'border-[#22162e] text-[#c084fc]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isSpecial ? (
                      <>
                        <span className="text-[#5fa07a]">★</span>
                        <span className="text-[#5fa07a] font-bold">SPECIAL EVENT</span>
                      </>
                    ) : (
                      ev.track === 'technical' ? 'TRACK 01 // TECH' : 'TRACK 02 // NON-TECH'
                    )}
                  </span>
                  {isPaidSpecialFeeEvent(ev) && liveSpecialFeeLabel(liveSpecialEvents, ev.id) && (
                    <span className="text-[#5fa07a] font-bold">
                      {liveSpecialFeeLabel(liveSpecialEvents, ev.id)}
                    </span>
                  )}
                </div>

                <h3 className="font-pixel text-base sm:text-lg text-white mt-2.5 mb-2 tracking-wider font-bold">
                  {ev.title}
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-200 line-clamp-3 leading-relaxed tracking-normal font-normal">
                  {ev.description}
                </p>

                <div
                  className={`mt-3 pt-2 border-t text-[11px] font-mono text-slate-300 ${
                    isSpecial ? 'border-[#5fa07a]/20' : 'border-[#1e1428]'
                  }`}
                >
                  <div>
                    <span className="text-gray-400 font-silkscreen text-[9px]">CREW:</span>{' '}
                    <span className="text-slate-200">{ev.teamSize}</span>
                  </div>
                </div>
              </div>

              <div
                className={`flex gap-2 mt-4 pt-2.5 border-t ${
                  isSpecial ? 'border-[#5fa07a]/25' : 'border-[#22162e]'
                }`}
              >
                <button
                  onClick={() => {
                    sound.playNavClick();
                    onSelectEvent(ev);
                  }}
                  className={`flex-1 py-1.5 font-silkscreen text-[11px] border cursor-pointer transition-colors text-center ${
                    isSpecial
                      ? 'border-[#5fa07a] text-[#5fa07a] hover:bg-[#5fa07a]/15'
                      : 'border-[#db2777] text-[#db2777] hover:bg-[#db2777]/15'
                  }`}
                  title={`View detailed specs for ${ev.title}`}
                >
                  VIEW SPEC
                </button>
                <button
                  onClick={() => {
                    sound.playNavClick();
                    setModalEvent(ev);
                  }}
                  className={`flex-1 py-1.5 font-pixel text-xs cursor-pointer transition-all text-center font-bold ${
                    isSpecial
                      ? 'bg-[#5fa07a] text-white hover:bg-[#4d8664] shadow-[0_0_6px_rgba(95,160,122,0.3)]'
                      : 'bg-[#db2777] text-white hover:bg-[#be185d] shadow-[0_0_6px_rgba(219,39,119,0.3)]'
                  }`}
                >
                  REGISTER
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {(modalEvent || isPackSelectionOpen) && (
        <RegisterModal
          event={modalEvent}
          isOpen={!!modalEvent || isPackSelectionOpen}
          onClose={() => {
            setModalEvent(null);
            setIsPackSelectionOpen(false);
          }}
          onProceedToPortal={onProceedToPortal}
        />
      )}
    </div>
  );
};
