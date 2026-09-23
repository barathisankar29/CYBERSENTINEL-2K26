import React from 'react';
import { sound } from '../sound';
import type { ModuleId } from '@/types/eventsTerminal';

interface HomeScreenProps {
  onSelectModule: (mod: ModuleId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectModule }) => {
  const handleSeeEvents = () => {
    sound.playNavClick();
    onSelectModule('compete');
  };

  return (
    <div className="w-full relative" data-purpose="cybersentinel-home-content">
      {/* Top Tab Protrusion with Pixel House / Mainframe Graphic */}
      <div aria-hidden="true" className="top-protrusion-tab select-none">
        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 16 16">
          <path d="M8 1L1 7H3V14H7V10H9V14H13V7H15L8 1Z" />
        </svg>
      </div>

      {/* Stepped Pixel Corner Cutout Stripe Decoration (bottom-left) */}
      <div aria-hidden="true" className="corner-stripes" />

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative">
        {/* LEFT COLUMN: Event Visual / Event Artwork Area (Consistent outer alignment) */}
        <div className="lg:col-span-5 flex flex-col" data-purpose="event-visual-area">
          <div className="w-full h-full min-h-[380px] lg:min-h-full border-2 border-[#9333ea] bg-[#07040a] p-3.5 flex flex-col justify-between items-center relative shadow-[0_0_20px_rgba(147,51,234,0.3)]">
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

              {/* Central CYBERSENTINEL Pixel Emblem */}
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
                      SENTINAL
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

        {/* RIGHT COLUMN: CYBERSENTINEL 2K26 Information */}
        <div
          className="lg:col-span-7 flex flex-col justify-between space-y-5"
          data-purpose="cybersentinel-event-info"
        >
          {/* Main Event Title & Tagline */}
          <div>
            <h2 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-white tracking-wider mb-2 leading-tight drop-shadow-[0_0_15px_rgba(255,0,127,0.7)]">
              CYBERSENTINEL 2K26
            </h2>

            {/* Tagline */}
            <p className="font-silkscreen text-xs sm:text-sm text-[#f1f5f9] tracking-wide mt-1">
              &quot;ENTER THE GRID. BREAK THE CODE. SHAPE THE FUTURE.&quot;
            </p>
          </div>

          {/* Short Introduction Paragraph */}
          <div className="font-mono text-xs sm:text-sm text-gray-200 leading-relaxed bg-[#0b0512] p-4 border-l-4 border-[#9333ea] shadow-inner">
            CYBERSENTINEL 2K26 is a technical symposium by the Department of Computer Science and Engineering, bringing students together through technology, challenges and creativity.
          </div>

          {/* Simplified Track Cards: Only Track 01 Technical & Track 02 Non-Technical */}
          <div className="space-y-2" data-purpose="two-tracks-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TRACK 01 */}
              <div className="border-2 border-[#ff007f] bg-[#0c0512] p-5 flex flex-col justify-center items-center text-center shadow-[0_0_12px_rgba(255,0,127,0.15)]">
                <span className="font-silkscreen text-xs text-[#c084fc] tracking-widest">
                  TRACK 01
                </span>
                <span className="font-pixel text-sm sm:text-base text-white tracking-wider mt-2">
                  TECHNICAL
                </span>
              </div>

              {/* TRACK 02 */}
              <div className="border-2 border-[#9333ea] bg-[#090514] p-5 flex flex-col justify-center items-center text-center shadow-[0_0_12px_rgba(147,51,234,0.15)]">
                <span className="font-silkscreen text-xs text-[#ff007f] tracking-widest">
                  TRACK 02
                </span>
                <span className="font-pixel text-sm sm:text-base text-white tracking-wider mt-2">
                  NON-TECHNICAL
                </span>
              </div>
            </div>
          </div>

          {/* Primary CTA Button: [ SEE EVENTS ] */}
          <div className="pt-1">
            <button
              id="btn-see-events"
              onClick={handleSeeEvents}
              className="arcade-cta w-full py-4 px-6 font-pixel text-white text-xs sm:text-sm tracking-widest flex items-center justify-center gap-3 transition-transform cursor-pointer"
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
