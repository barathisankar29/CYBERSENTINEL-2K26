import React, { useState } from 'react';
import { ALL_EVENTS, isPaidSpecialFeeEvent } from '@/data/eventsTerminalData';
import { liveSpecialFeeLabel, useLiveRegistrationData } from '../useLiveRegistrationData';
import type { EventSpec } from '@/types/eventsTerminal';
import { sound } from '../sound';
import { RegisterModal } from '../RegisterModal';
import type { RegistrationPortalInitialData } from '../RegistrationPortalPage';

interface CompeteScreenProps {
  /** Select an event and open its detail screen (KNOW MORE). */
  onSelectEvent: (event: EventSpec) => void;
  /** Select an event without leaving the grid (card click / REGISTER). */
  onHighlightEvent: (event: EventSpec) => void;
  selectedEventId?: string;
  initialTab?: 'all' | 'day1' | 'day2' | 'special';
  onTabChange?: (tab: 'all' | 'day1' | 'day2' | 'special') => void;
  onProceedToPortal: (data: RegistrationPortalInitialData) => void;
}

export const CompeteScreen: React.FC<CompeteScreenProps> = ({
  onSelectEvent,
  onHighlightEvent,
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
  // Day 2: 6 events (talent_show, connections, bgm, mixed_signals, lyrics, e_sports)
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
            {
              id: 'all',
              label: `[ALL (${ALL_EVENTS.length})]`,
              activeBorder: '#0891b2',
              activeBg: '#0891b2',
              activeGlow: '0 0 10px rgba(8, 145, 178, 0.35)',
              inactiveClass: 'bg-[#090710] text-gray-300 border-[#261f33] hover:border-[#0891b2]'
            },
            {
              id: 'day1',
              label: `[DAY 1 (${day1Events.length} EVENTS)]`,
              activeBorder: '#db2777',
              activeBg: '#db2777',
              activeGlow: '0 0 10px rgba(219, 39, 119, 0.4)',
              inactiveClass: 'bg-[#0e0512] text-[#f472b6] border-[#db2777]/50 hover:border-[#db2777] hover:bg-[#db2777]/10'
            },
            {
              id: 'day2',
              label: `[DAY 2 (${day2Events.length} EVENTS)]`,
              activeBorder: '#9333ea',
              activeBg: '#9333ea',
              activeGlow: '0 0 10px rgba(147, 51, 234, 0.4)',
              inactiveClass: 'bg-[#0b0516] text-[#c084fc] border-[#9333ea]/50 hover:border-[#9333ea] hover:bg-[#9333ea]/10'
            },
            {
              id: 'special',
              label: `[SPECIAL EVENTS (${specialEvents.length}) ★]`,
              activeBorder: '#5fa07a',
              activeBg: '#5fa07a',
              activeGlow: '0 0 10px rgba(95, 160, 122, 0.4)',
              inactiveClass: 'bg-[#090b14] text-[#5fa07a] border-[#5fa07a]/50 hover:border-[#5fa07a] hover:bg-[#5fa07a]/10'
            }
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
                        boxShadow: tab.activeGlow
                      }
                    : undefined
                }
                className={`px-3 py-1.5 border cursor-pointer whitespace-nowrap transition-all font-bold ${
                  isActive ? '' : tab.inactiveClass
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
          const isDay1 = ev.day === 1 && !isSpecial;

          let cardBorderClass = '';
          let focusOutlineClass = '';
          let headerBorderClass = '';
          let headerTextClass = '';
          let footerBorderClass = '';
          let knowMoreClass = '';
          let registerClass = '';

          if (isSpecial) {
            // GREEN BOX (Special Events)
            cardBorderClass = isSelected
              ? 'border-[#5fa07a] shadow-[0_0_14px_rgba(95,160,122,0.4)] ring-1 ring-[#5fa07a]'
              : 'border-[#5fa07a]/70 shadow-[0_0_8px_rgba(95,160,122,0.2)] hover:border-[#5fa07a] hover:shadow-[0_0_12px_rgba(95,160,122,0.3)]';
            focusOutlineClass = 'focus-visible:outline-[#5fa07a]';
            headerBorderClass = 'border-[#5fa07a]/30';
            headerTextClass = 'text-[#5fa07a]';
            footerBorderClass = 'border-[#5fa07a]/25';
            knowMoreClass = 'border-[#5fa07a] text-[#5fa07a] hover:bg-[#5fa07a]/15';
            registerClass = 'bg-[#5fa07a] text-white hover:bg-[#4d8664] shadow-[0_0_6px_rgba(95,160,122,0.3)]';
          } else if (isDay1) {
            // PINK BOX (Day 1 Events)
            cardBorderClass = isSelected
              ? 'border-[#db2777] shadow-[0_0_14px_rgba(219,39,119,0.4)] ring-1 ring-[#db2777]'
              : 'border-[#db2777]/70 shadow-[0_0_8px_rgba(219,39,119,0.2)] hover:border-[#db2777] hover:shadow-[0_0_12px_rgba(219,39,119,0.35)]';
            focusOutlineClass = 'focus-visible:outline-[#db2777]';
            headerBorderClass = 'border-[#db2777]/30';
            headerTextClass = 'text-[#f472b6]';
            footerBorderClass = 'border-[#db2777]/25';
            knowMoreClass = 'border-[#db2777] text-[#db2777] hover:bg-[#db2777]/15';
            registerClass = 'bg-[#db2777] text-white hover:bg-[#be185d] shadow-[0_0_6px_rgba(219,39,119,0.3)]';
          } else {
            // PURPLE BOX (Day 2 Events)
            cardBorderClass = isSelected
              ? 'border-[#9333ea] shadow-[0_0_14px_rgba(147,51,234,0.4)] ring-1 ring-[#9333ea]'
              : 'border-[#9333ea]/70 shadow-[0_0_8px_rgba(147,51,234,0.2)] hover:border-[#9333ea] hover:shadow-[0_0_12px_rgba(147,51,234,0.35)]';
            focusOutlineClass = 'focus-visible:outline-[#9333ea]';
            headerBorderClass = 'border-[#9333ea]/30';
            headerTextClass = 'text-[#c084fc]';
            footerBorderClass = 'border-[#9333ea]/25';
            knowMoreClass = 'border-[#9333ea] text-[#c084fc] hover:bg-[#9333ea]/15';
            registerClass = 'bg-[#9333ea] text-white hover:bg-[#7e22ce] shadow-[0_0_6px_rgba(147,51,234,0.3)]';
          }

          return (
            <div
              key={ev.id}
              className={`relative border-2 bg-[#090710] p-3.5 flex flex-col justify-between transition-all shadow-sm ${cardBorderClass}`}
            >
              {/* Clicking anywhere on the card selects it. A transparent
                  button stretched over the card (below the KNOW MORE /
                  REGISTER row) keeps it keyboard-accessible without nesting
                  buttons inside a clickable card. */}
              <button
                type="button"
                onClick={() => {
                  sound.playNavClick();
                  onHighlightEvent(ev);
                }}
                aria-pressed={isSelected}
                aria-label={`Select ${ev.title}`}
                className={`absolute inset-0 z-10 cursor-pointer bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 ${focusOutlineClass}`}
              />

              <div>
                <div
                  className={`flex justify-between items-center text-[10px] font-silkscreen pb-2 border-b ${headerBorderClass} ${headerTextClass}`}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    {isSpecial ? (
                      <>
                        <span className="text-[#5fa07a]">★</span>
                        <span>SPECIAL EVENT</span>
                      </>
                    ) : isDay1 ? (
                      'TRACK 01 // TECH (DAY 1)'
                    ) : (
                      'TRACK 02 // NON-TECH (DAY 2)'
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

                <div className="hidden md:block">
                  <p className="font-kelly text-xs sm:text-sm text-slate-200 line-clamp-3 leading-relaxed tracking-wide">
                    {ev.description}
                  </p>
                </div>
              </div>

              <div
                className={`relative z-20 flex gap-2 mt-4 pt-2.5 border-t ${footerBorderClass}`}
              >
                <button
                  onClick={() => {
                    sound.playNavClick();
                    onSelectEvent(ev);
                  }}
                  className={`flex-1 py-1.5 font-silkscreen text-[11px] border cursor-pointer transition-colors text-center ${knowMoreClass}`}
                  title={`Know more about ${ev.title}`}
                >
                  KNOW MORE
                </button>
                <button
                  onClick={() => {
                    sound.playNavClick();
                    onHighlightEvent(ev);
                    setModalEvent(ev);
                  }}
                  className={`flex-1 py-1.5 font-pixel text-xs cursor-pointer transition-all text-center font-bold ${registerClass}`}
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
