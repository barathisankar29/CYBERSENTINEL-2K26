import React from 'react';
import type { EventSpec, ModuleId } from '@/types/eventsTerminal';
import { sound } from '../sound';

interface InfoScreenProps {
  event?: EventSpec;
  selectedEvent?: EventSpec;
  onSelectModule: (mod: ModuleId) => void;
}

export const InfoScreen: React.FC<InfoScreenProps> = ({
  event,
  selectedEvent,
  onSelectModule
}) => {
  const currentEvent = event || selectedEvent || {
    id: 'general',
    title: 'CYBERSENTINEL 2K26',
    date: 'DAY 01 & 02 // MARCH 2026',
    time: '09:00 AM - 04:00 PM',
    venue: 'DEPARTMENT OF CSE CAMPUS',
    teamSize: 'VARIES BY EVENT TRACK',
    description:
      'Official technical symposium regulations and protocols established by the Department of Computer Science and Engineering. All registered participants must adhere to campus conduct guidelines.',
    protocols: [
      'Official College ID Card and Registration Confirmation Slip are mandatory for entry at security checkpoints.',
      'Participants must report to their respective event venue at least 20 minutes prior to scheduled start time.',
      'Decisions made by the event conveners, faculty coordinators, and jury members are final and binding.',
      'Malpractice, plagiarism, or tampering with terminal hardware will lead to immediate disqualification.',
      'Certificates of Participation and Merit will be awarded during the Valedictory Ceremony.'
    ]
  };

  const protocolsToDisplay: string[] =
    currentEvent.protocols && currentEvent.protocols.length > 0
      ? currentEvent.protocols
      : [
          'Official College ID Card is strictly mandatory for campus entry and arena access.',
          'Participants must report to their respective arena 20 minutes before the scheduled time slot.',
          'Judges and conveners decisions are final across all technical and creative evaluation rounds.',
          'Malpractice or unauthorized hardware tampering results in immediate disqualification.',
          'Certificates will be distributed at the valedictory session to all verified participants.'
        ];

  return (
    <div className="w-full relative" data-purpose="info-screen-content">
      {/* Top Tab Protrusion with Pixel "H" / Protocol Graphic */}
      <div aria-hidden="true" className="top-protrusion-tab select-none">
        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 16 16">
          <path
            d="M7 3H9V5H7V3ZM7 7H9V13H7V7ZM3 1H13V3H15V13H13V15H3V13H1V3H3V1ZM3 3V13H13V3H3Z"
            fillRule="evenodd"
          />
        </svg>
      </div>

      <div aria-hidden="true" className="corner-stripes" />

      {/* Header Dither Bar */}
      <section className="pixel-dither-bar h-12 w-full flex items-center justify-between px-4 mb-6 select-none">
        <h1 className="font-pixel text-black text-xs sm:text-lg tracking-wider font-extrabold flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-black" />
          EVENT PROTOCOLS // {currentEvent.title}
        </h1>
        <span className="font-silkscreen text-[10px] text-black font-bold hidden sm:inline-block z-10">
          CYBERSENTINEL 2K26
        </span>
        <div aria-hidden="true" className="pixel-dither-fade" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Left Column: Venue & Details */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="border-2 border-[#ff007f] bg-[#07050a] p-3 flex flex-col items-center shadow-[0_0_15px_rgba(255,0,127,0.25)]">
            <div className="w-full flex justify-between items-center text-[10px] font-silkscreen text-[#c084fc] border-b border-[#20102b] pb-2 mb-3">
              <span>EVENT VENUE</span>
              <span className="text-[#ff007f]">VENUE INFO</span>
            </div>

            {/* Radar Visualizer */}
            <div className="w-full h-44 bg-black border border-[#2b1038] relative flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #ff007f 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />
              <div className="w-28 h-28 rounded-full border border-[#ff007f]/40 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full border border-[#ff007f]/60 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#ff007f] rounded-none animate-ping" />
                </div>
              </div>
              <div className="absolute bottom-2 text-center text-[10px] font-mono text-gray-400">
                ARENA // {currentEvent.venue}
              </div>
            </div>

            {/* Coordinates Matrix */}
            <div className="w-full mt-3 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between bg-[#0e0414] p-2 border border-[#240d33]">
                <span className="text-gray-400">VENUE:</span>
                <span className="text-white font-bold">{currentEvent.venue}</span>
              </div>
              <div className="flex justify-between bg-[#0e0414] p-2 border border-[#240d33]">
                <span className="text-gray-400">DATE & TIME:</span>
                <span className="text-[#c084fc] font-bold">{currentEvent.date}</span>
              </div>
              <div className="flex justify-between bg-[#0e0414] p-2 border border-[#240d33]">
                <span className="text-gray-400">TEAM SIZE:</span>
                <span className="text-[#ff007f] font-bold">{currentEvent.teamSize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-0 bottom-0 left-[41.66%] w-px bg-[#2d123d]"
        >
          <div className="sticky top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black border border-[#2d123d] flex items-center justify-center text-[8px] text-[#ff007f]">
            ◆
          </div>
        </div>

        {/* Right Column: Code of Conduct & Operational Event Rules */}
        <div className="lg:col-span-7 flex flex-col justify-between pl-0 lg:pl-6 space-y-4">
          <div>
            <div className="font-silkscreen text-[11px] text-[#c084fc] tracking-wide mb-1 flex items-center gap-2">
              <span className="text-[#ff007f]">►</span>
              RULES // {currentEvent.title}
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-white tracking-wider my-2">
              {currentEvent.title} PROTOCOLS
            </h2>
            <p className="font-silkscreen text-xs text-gray-400 tracking-wide">
              MANDATORY GUIDELINES FOR ALL PARTICIPANTS
            </p>
          </div>

          {/* Rules list */}
          <div className="space-y-2 font-mono text-xs">
            {protocolsToDisplay.map((rule, idx) => (
              <div
                key={idx}
                className="bg-[#08030d] p-2.5 border-l-2 border-[#ff007f] text-gray-300 leading-relaxed"
              >
                <span className="text-[#c084fc] font-silkscreen mr-2">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                {rule}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playNavClick();
                onSelectModule('firmware');
              }}
              className="arcade-cta w-full py-3.5 px-6 font-pixel text-white text-xs tracking-wider flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>&gt;&gt;</span>
              <span>VIEW {currentEvent.title} SPEC DETAILS</span>
              <span>&lt;&lt;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
