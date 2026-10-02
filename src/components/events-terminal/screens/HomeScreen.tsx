import React from 'react';
import { sound } from '../sound';
import type { ModuleId } from '@/types/eventsTerminal';

interface HomeScreenProps {
  onSelectModule: (mod: ModuleId) => void;
  onNavigateToEvents?: (tab?: 'all' | 'day1' | 'day2' | 'special') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectModule, onNavigateToEvents }) => {
  const handleSeeEvents = () => {
    sound.playNavClick();
    if (onNavigateToEvents) {
      onNavigateToEvents('all');
    } else {
      onSelectModule('compete');
    }
  };

  const handleTrackClick = (tab: 'day1' | 'day2' | 'special') => {
    sound.playNavClick();
    if (onNavigateToEvents) {
      onNavigateToEvents(tab);
    } else {
      onSelectModule('compete');
    }
  };

  return (
    <div className="w-full relative" data-purpose="cybersentinel-home-content">
      {/* Neon Pink Horizontal Header Banner with Authentic Pixel Dither Fade */}
      <section
        className="pixel-dither-bar h-12 w-full flex items-center justify-between px-4 mb-6 select-none"
        data-purpose="banner-header"
      >
        <h1 className="font-pixel text-black text-xs sm:text-base md:text-lg tracking-wider font-extrabold flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-black" />
          CYBERSENTINEL 2K26 // CSE SYMPOSIUM
        </h1>
        <div aria-hidden="true" className="pixel-dither-fade" />
      </section>

      {/* Two-Column Cyberpunk Terminal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative">
        {/* LEFT COLUMN: Event Visual Artwork (HIDDEN ONLY on mobile phones < md, VISIBLE on desktop/tablet) */}
        <div className="hidden md:flex md:col-span-5 flex-col" data-purpose="event-visual-area">
          <div className="w-full h-full min-h-[380px] border-2 border-[#9333ea] bg-[#07040a] p-3.5 flex flex-col justify-between items-center relative shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            {/* Top header inside poster frame */}
            <div className="w-full flex justify-between items-center text-[10px] font-silkscreen text-[#c084fc] border-b border-[#251033] pb-2 mb-3">
              <span>[00]</span>
              <span className="font-pixel text-[9px] text-[#ff007f] tracking-widest">
                CYBERSENTINEL
              </span>
              <span>[FF]</span>
            </div>

            {/* Central Pixel Art Canvas */}
            <div className="w-full flex-1 bg-black border border-[#2b1038] relative flex flex-col items-center justify-center p-6 overflow-hidden select-none min-h-[240px]">
              {/* Subtle background grid with purple / dark blue accent */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(147, 51, 234, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.18) 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Central Cybersentinel Pixel Emblem */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-[#9333ea] bg-[#0e0413] flex flex-col items-center justify-center relative shadow-[0_0_25px_rgba(147,51,234,0.5)]">
                  {/* Decorative corner brackets on the shield */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />

                  {/* Emblem Typography */}
                  <div className="text-center p-2">
                    <div className="font-pixel text-[11px] text-[#c084fc] leading-tight tracking-wider">
                      CYBER
                    </div>
                    <div className="font-pixel text-sm sm:text-base text-white font-bold mt-1 tracking-wider drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]">
                      SENTINEL
                    </div>
                    <div className="font-pixel text-[10px] text-[#ff007f] mt-1 tracking-widest">
                      2K26
                    </div>
                  </div>
                </div>

                <div className="mt-4 font-silkscreen text-[10px] text-[#e0aaff] tracking-widest px-3 py-1 border border-[#9333ea] bg-[#12051c]">
                  CSE SYMPOSIUM
                </div>
              </div>

              {/* Minimal corner indicators */}
              <div className="absolute bottom-2 left-2 text-[#9333ea] font-mono text-[10px]">&gt;&gt;</div>
              <div className="absolute bottom-2 right-2 text-[#9333ea] font-mono text-[10px]">&lt;&lt;</div>
            </div>

            {/* Bottom bar of left frame */}
            <div className="w-full flex justify-between items-center text-[10px] font-silkscreen text-gray-400 border-t border-[#251033] pt-2 mt-3">
              <span className="text-[#c084fc]">DEPT OF CSE</span>
              <span className="text-gray-500 font-mono">&gt;&gt; 2K26</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Cybersentinel 2K26 Information (Full width on mobile phone, 7 cols on desktop) */}
        <div
          className="col-span-1 md:col-span-7 flex flex-col justify-between space-y-5"
          data-purpose="cybersentinel-event-info"
        >
          {/* Main Event Title & Tagline */}
          <div>
            <h2 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-white tracking-wider mb-2 leading-tight drop-shadow-[0_0_15px_rgba(255,0,127,0.7)]">
              CYBERSENTINEL 2K26
            </h2>

            {/* Tagline */}
            <p className="font-silkscreen text-xs sm:text-sm text-[#f1f5f9] tracking-wide">
              &quot;ENTER THE GRID. BREAK THE CODE. SHAPE THE FUTURE.&quot;
            </p>
          </div>

          {/* Short Introduction Paragraph */}
          <div className="font-kelly text-sm sm:text-base text-gray-100 leading-relaxed bg-[#0b0512] p-4 sm:p-5 border-l-4 border-[#9333ea] shadow-inner tracking-wide">
            Cybersentinel 2K26 is a state level intercollegiate technical symposium by the Department of Computer Science and Engineering, bringing students together through technology, challenges, innovation, and creativity.
          </div>

          {/* Track Buttons: Track 01 (Day 1), Track 02 (Day 2) & Track 03 (Special Events in Day 2) */}
          <div className="space-y-2" data-purpose="tracks-container">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* TRACK 01 BUTTON */}
              <button
                type="button"
                id="btn-track-01"
                onClick={() => handleTrackClick('day1')}
                className="group border-2 border-[#ff007f] bg-[#0c0512] hover:bg-[#1a0820] p-3 sm:p-3.5 flex flex-col justify-center items-center text-center shadow-[0_0_12px_rgba(255,0,127,0.2)] hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] transition-all cursor-pointer active:translate-y-0.5"
                data-purpose="track-01-button"
                title="View Day 1 Technical Events"
              >
                <span className="font-silkscreen text-[10px] sm:text-[11px] text-[#c084fc] tracking-widest">
                  TRACK 01 // DAY 1
                </span>
                <span className="font-pixel text-xs sm:text-sm text-white group-hover:text-[#ff007f] tracking-wider mt-1 transition-colors font-bold">
                  TECHNICAL
                </span>
                <span className="mt-2 font-silkscreen text-[8px] sm:text-[9px] text-pink-400 group-hover:text-white flex items-center gap-1 border-t border-[#ff007f]/30 pt-1.5 w-full justify-center">
                  [ VIEW DAY 1 → ]
                </span>
              </button>

              {/* TRACK 02 BUTTON */}
              <button
                type="button"
                id="btn-track-02"
                onClick={() => handleTrackClick('day2')}
                className="group border-2 border-[#9333ea] bg-[#090514] hover:bg-[#180826] p-3 sm:p-3.5 flex flex-col justify-center items-center text-center shadow-[0_0_12px_rgba(147,51,234,0.2)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all cursor-pointer active:translate-y-0.5"
                data-purpose="track-02-button"
                title="View Day 2 Non-Technical Events"
              >
                <span className="font-silkscreen text-[10px] sm:text-[11px] text-[#ff007f] tracking-widest">
                  TRACK 02 // DAY 2
                </span>
                <span className="font-pixel text-xs sm:text-sm text-white group-hover:text-[#c084fc] tracking-wider mt-1 transition-colors font-bold">
                  NON-TECHNICAL
                </span>
                <span className="mt-2 font-silkscreen text-[8px] sm:text-[9px] text-purple-300 group-hover:text-white flex items-center gap-1 border-t border-[#9333ea]/30 pt-1.5 w-full justify-center">
                  [ VIEW DAY 2 → ]
                </span>
              </button>

              {/* TRACK 03 BUTTON - SPECIAL EVENTS IN DAY 2 */}
              <button
                type="button"
                id="btn-track-03"
                onClick={() => handleTrackClick('special')}
                className="group border-2 border-[#5fa07a] bg-[#06120b] hover:bg-[#0d2417] p-3 sm:p-3.5 flex flex-col justify-center items-center text-center shadow-[0_0_12px_rgba(95,160,122,0.2)] hover:shadow-[0_0_20px_rgba(95,160,122,0.5)] transition-all cursor-pointer active:translate-y-0.5"
                data-purpose="track-03-button"
                title="View Day 2 Special Events"
              >
                <span className="font-silkscreen text-[10px] sm:text-[11px] text-[#86efac] tracking-widest">
                  TRACK 03 // DAY 2
                </span>
                <span className="font-pixel text-xs sm:text-sm text-white group-hover:text-[#5fa07a] tracking-wider mt-1 transition-colors font-bold">
                  SPECIAL EVENTS
                </span>
                <span className="mt-2 font-silkscreen text-[8px] sm:text-[9px] text-[#5fa07a] group-hover:text-white flex items-center gap-1 border-t border-[#5fa07a]/30 pt-1.5 w-full justify-center">
                  [ VIEW SPECIAL → ]
                </span>
              </button>
            </div>
          </div>

          {/* Primary CTA Button: [ SEE EVENTS ] */}
          <div className="pt-1">
            <button
              id="btn-see-events"
              onClick={handleSeeEvents}
              className="arcade-cta w-full py-3.5 px-6 font-pixel text-white text-xs sm:text-sm tracking-widest flex items-center justify-center gap-3 transition-transform cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.35)]"
              data-purpose="see-events-cta-button"
            >
              <span>&gt;&gt;</span>
              <span>SEE EVENTS</span>
              <span>&lt;&lt;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
