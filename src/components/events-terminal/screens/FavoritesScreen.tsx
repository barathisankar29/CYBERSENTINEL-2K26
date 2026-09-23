import React, { useState, useEffect } from 'react';
import type { EventSpec } from '@/types/eventsTerminal';
import { ALL_EVENTS } from '@/data/eventsTerminalData';
import { sound } from '../sound';
import { Check, Copy, ExternalLink, ShieldCheck, X } from 'lucide-react';

interface RegistrationItem {
  regId: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  crewName: string;
  leadOperator: string;
  callsign: string;
  teamCount: number;
  teamSize: string;
  contactEmail: string;
  contactPhone: string;
  timestamp: string;
  securityHash: string;
  status: string;
  fee: string;
  receiptNumber: string;
  gateStatus: string;
}

const DEFAULT_MOCK_REGISTRATIONS: RegistrationItem[] = [
  {
    regId: 'OP-CYP-8421',
    eventName: 'CYPHER CODING',
    date: 'DAY 01 // 11:30 AM',
    time: '11:30 AM - 02:00 PM',
    venue: 'SYSTEMS LAB 01 / BLOCK B',
    crewName: 'CIPHER_KNIGHTS',
    leadOperator: 'ALEXANDER VEX',
    callsign: 'NODE#42',
    teamCount: 1,
    teamSize: 'SOLO CADET',
    contactEmail: 'alex.vex@sentinal.cse.in',
    contactPhone: '+91 94451 22302',
    timestamp: '22/09/2026 // 09:15:42',
    securityHash: 'E4:9C:1F:4A:88:B2:D0:3E',
    status: 'CONFIRMED // ACTIVE PASS',
    fee: '₹150 [PAID]',
    receiptNumber: 'REC-CYBER-2026-0842',
    gateStatus: 'BARCODE GENERATED // READY AT ARENA DESK'
  },
  {
    regId: 'OP-PPT-3190',
    eventName: 'PAPER PRESENTATION',
    date: 'DAY 01 // 10:00 AM',
    time: '10:00 AM - 01:00 PM',
    venue: 'SEMINAR HALL A / FLOOR 2',
    crewName: 'NEURAL_SENTINELS',
    leadOperator: 'SARAH CONNER',
    callsign: 'NODE#88',
    teamCount: 3,
    teamSize: '3 CADETS (TRIAD)',
    contactEmail: 'sarah.c@sentinal.cse.in',
    contactPhone: '+91 98401 11201',
    timestamp: '21/09/2026 // 14:30:10',
    securityHash: '7A:3D:E2:01:99:FF:4C:12',
    status: 'CONFIRMED // ACTIVE PASS',
    fee: '₹200 [PAID]',
    receiptNumber: 'REC-CYBER-2026-3190',
    gateStatus: 'SLIDE REPORTING SLIP ISSUED // JURY DESK'
  },
  {
    regId: 'OP-BGM-5512',
    eventName: 'BGM',
    date: 'DAY 02 // 09:30 AM',
    time: '09:30 AM - 11:30 AM',
    venue: 'AUDIO AUDITORIUM 01',
    crewName: 'SYNTHWAVE_CREW',
    leadOperator: 'LEO CHEN',
    callsign: 'NODE#19',
    teamCount: 2,
    teamSize: '2 CADETS (DUO)',
    contactEmail: 'leo.chen@sentinal.cse.in',
    contactPhone: '+91 97901 66706',
    timestamp: '22/09/2026 // 08:00:15',
    securityHash: '9B:11:44:E7:30:AA:6C:55',
    status: 'CONFIRMED // ACTIVE PASS',
    fee: '₹100 [PAID]',
    receiptNumber: 'REC-CYBER-2026-5512',
    gateStatus: 'BUZZER CONSOLE PRE-ASSIGNED'
  }
];

interface FavoritesScreenProps {
  bookmarkedEventIds?: string[];
  onSelectEvent: (event: EventSpec) => void;
  onRemoveBookmark?: (id: string) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ onSelectEvent }) => {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>(DEFAULT_MOCK_REGISTRATIONS);
  const [activeReceipt, setActiveReceipt] = useState<RegistrationItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cyberfest_passes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userRegistrations: RegistrationItem[] = parsed.map((item) => {
            const matchedEvent = ALL_EVENTS.find(
              (e) => e.title.toLowerCase() === item.eventName.toLowerCase()
            );
            return {
              regId: item.regId || `OP-REG-${Math.floor(1000 + Math.random() * 9000)}`,
              eventName: item.eventName,
              date: matchedEvent?.date || 'DAY 01 // TBA',
              time: matchedEvent?.time || 'AS SCHEDULED',
              venue: matchedEvent?.venue || 'MAIN MAINFRAME DOCK',
              crewName: item.crewName || 'OPERATOR SQUAD',
              leadOperator: item.leadOperator || 'ANONYMOUS CADET',
              callsign: item.callsign || 'NODE#99',
              teamCount: item.teamCount || 1,
              teamSize: matchedEvent?.teamSize || `${item.teamCount || 1} CADETS`,
              contactEmail: item.contactEmail || 'cadet@sentinal.cse.in',
              contactPhone: item.contactPhone || '+91 90000 00000',
              timestamp: item.timestamp || new Date().toLocaleString(),
              securityHash: item.securityHash || 'FF:4A:88:B2:D0:3E:01:99',
              status: 'CONFIRMED // ACTIVE PASS',
              fee: matchedEvent?.fee || 'CONFIRMED',
              receiptNumber: `REC-${item.regId?.replace(/[^a-zA-Z0-9]/g, '') || Math.floor(100000 + Math.random() * 900000)}`,
              gateStatus: 'DIGITAL PASS CONFIRMED'
            };
          });

          // Prepend user-created registrations ahead of the mock data
          setRegistrations([...userRegistrations, ...DEFAULT_MOCK_REGISTRATIONS]);
        }
      }
    } catch {
      // Fallback to default mock registrations
    }
  }, []);

  const handleCopy = (text: string, id: string) => {
    sound.playNavClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="w-full relative" data-purpose="registrations-vault-content">
      {/* Top Protrusion Tab with Pixel Heart Icon */}
      <div aria-hidden="true" className="top-protrusion-tab select-none">
        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 16 16">
          <path d="M3 3H6V5H7V6H9V5H10V3H13V7H12V9H10V11H9V13H7V11H6V9H4V7H3V3Z" />
        </svg>
      </div>

      {/* Stepped Pixel Corner Cutout Stripe Decoration */}
      <div aria-hidden="true" className="corner-stripes" />

      {/* Header Dither Bar */}
      <section className="pixel-dither-bar h-12 w-full flex items-center justify-between px-4 mb-6 select-none">
        <h1 className="font-pixel text-black text-xs sm:text-lg tracking-wider font-extrabold flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-black" />
          MY REGISTRATIONS // CYBERSENTINEL 2K26
        </h1>
        <span className="font-silkscreen text-[10px] text-black font-bold hidden sm:inline-block z-10">
          {registrations.length} REGISTERED EVENTS
        </span>
        <div aria-hidden="true" className="pixel-dither-fade" />
      </section>

      {/* Overview Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
        <div className="bg-[#07050d] border-2 border-[#9933ff] p-3 flex items-center justify-between shadow-[0_0_10px_rgba(153,51,255,0.2)]">
          <div>
            <span className="text-gray-400 text-[10px] font-silkscreen block">REGISTERED EVENTS</span>
            <span className="text-white font-pixel text-lg">{registrations.length} EVENTS</span>
          </div>
          <span className="w-3 h-3 bg-[#9933ff] animate-pulse inline-block" />
        </div>

        <div className="bg-[#07050d] border border-[#2d123d] p-3 flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-[10px] font-silkscreen block">REGISTRATION STATUS</span>
            <span className="text-[#00ff66] font-bold text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00ff66]" /> ALL CONFIRMED
            </span>
          </div>
          <span className="text-gray-500 text-[10px] font-silkscreen">ACTIVE</span>
        </div>

        <div className="bg-[#07050d] border border-[#2d123d] p-3 flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-[10px] font-silkscreen block">PARTICIPANT ROLE</span>
            <span className="text-[#c084fc] font-bold text-sm">REGISTERED STUDENT</span>
          </div>
          <span className="text-[#ff007f] text-[10px] font-silkscreen">CONFIRMED</span>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {registrations.map((item) => {
          const matchedEvent = ALL_EVENTS.find(
            (e) => e.title.toLowerCase() === item.eventName.toLowerCase()
          );

          return (
            <div
              key={item.regId}
              className="border-2 border-[#2d123d] hover:border-[#9933ff] bg-[#07050a] p-4 transition-all shadow-sm flex flex-col justify-between space-y-3"
            >
              {/* Header row with Registration ID and Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#1e0f2b]">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-xs sm:text-sm text-[#ffee00] tracking-wider">
                    {item.regId}
                  </span>
                  <button
                    onClick={() => handleCopy(item.regId, item.regId)}
                    className="text-gray-400 hover:text-white p-1 cursor-pointer transition-colors"
                    title="Copy Registration ID"
                  >
                    {copiedId === item.regId ? (
                      <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-gray-500 font-mono text-[10px]">
                    RECEIPT: {item.receiptNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] text-[10px] font-silkscreen font-bold">
                    <span className="w-1.5 h-1.5 bg-[#00ff66] animate-ping inline-block" />
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Event Title and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-6 space-y-1">
                  <h3 className="font-pixel text-base sm:text-lg text-white tracking-wider">
                    {item.eventName}
                  </h3>
                  <p className="font-silkscreen text-xs text-[#c084fc]">
                    CREW: <strong className="text-white">{item.crewName}</strong> {'//'} LEAD: {item.leadOperator} ({item.callsign})
                  </p>
                  <div className="text-xs font-mono text-gray-300 pt-1">
                    TEAM SPEC: <span className="text-white">{item.teamSize}</span> | RELAY: <span className="text-[#c084fc]">{item.contactEmail}</span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-[#0e0817] p-2 border border-[#221636]">
                    <span className="text-gray-500 font-silkscreen text-[9px] block">DATE & TIME</span>
                    <span className="text-[#c084fc] font-bold text-[11px] block mt-0.5">{item.date}</span>
                    <span className="text-gray-400 text-[10px] block">{item.time}</span>
                  </div>

                  <div className="bg-[#0e0817] p-2 border border-[#221636]">
                    <span className="text-gray-500 font-silkscreen text-[9px] block">VENUE</span>
                    <span className="text-white font-bold text-[11px] block mt-0.5">{item.venue}</span>
                  </div>

                  <div className="bg-[#0e0817] p-2 border border-[#221636] col-span-2 sm:col-span-1">
                    <span className="text-gray-500 font-silkscreen text-[9px] block">FEE / BOUNTY</span>
                    <span className="text-[#ff007f] font-bold text-[11px] block mt-0.5">{item.fee}</span>
                  </div>
                </div>
              </div>

              {/* Receipt details bar */}
              <div className="pt-2 border-t border-[#1a0f24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-gray-400">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>TIMESTAMP: <span className="text-[#c084fc]">{item.timestamp}</span></span>
                  <span className="text-[#00ff66]">{item.gateStatus}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      sound.playNavClick();
                      setActiveReceipt(item);
                    }}
                    className="flex-1 sm:flex-initial px-3 py-1.5 font-pixel text-[10px] bg-[#9933ff] text-white hover:bg-[#b366ff] cursor-pointer shadow-[0_0_8px_rgba(153,51,255,0.4)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>VIEW RECEIPT</span>
                  </button>

                  {matchedEvent && (
                    <button
                      onClick={() => {
                        sound.playNavClick();
                        onSelectEvent(matchedEvent);
                      }}
                      className="flex-1 sm:flex-initial px-3 py-1.5 font-silkscreen text-[10px] border border-[#ff007f] text-[#ff007f] hover:bg-[#ff007f]/15 cursor-pointer transition-colors flex items-center justify-center gap-1"
                      title="Open Event Spec in Firmware"
                    >
                      <span>EVENT SPEC</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Receipt / Confirmation Modal */}
      {activeReceipt && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveReceipt(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setActiveReceipt(null)
          }}
          role="button"
          tabIndex={0}
          aria-label="Close receipt"
        >
          <div
            className="w-full max-w-lg bg-[#07050d] border-2 border-[#9933ff] shadow-[0_0_25px_rgba(153,51,255,0.5)] p-5 relative font-mono text-xs"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                sound.playNavClick();
                setActiveReceipt(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white border border-[#333] hover:border-[#9933ff] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Receipt Header */}
            <div className="border-b-2 border-dashed border-[#9933ff] pb-3 mb-4 text-center">
              <div className="font-silkscreen text-[10px] text-[#c084fc] tracking-widest">
                DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
              </div>
              <h2 className="font-pixel text-xl text-white tracking-widest my-1">
                CYBERSENTINEL 2K26
              </h2>
              <div className="font-silkscreen text-[11px] text-[#00ff66] font-bold">
                OFFICIAL ENTRY RECEIPT &amp; EVENT PASS
              </div>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3 bg-black p-3 border border-[#221636]">
              <div className="flex justify-between border-b border-[#1f162e] pb-1.5">
                <span className="text-gray-400">REGISTRATION ID:</span>
                <span className="font-pixel text-[#ffee00] text-sm">{activeReceipt.regId}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f162e] pb-1.5">
                <span className="text-gray-400">EVENT NAME:</span>
                <span className="text-white font-bold">{activeReceipt.eventName}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f162e] pb-1.5">
                <span className="text-gray-400">TEAM / SQUAD:</span>
                <span className="text-[#c084fc]">{activeReceipt.crewName}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f162e] pb-1.5">
                <span className="text-gray-400">LEAD PARTICIPANT:</span>
                <span className="text-white">{activeReceipt.leadOperator} ({activeReceipt.callsign})</span>
              </div>
              <div className="flex justify-between border-b border-[#1f162e] pb-1.5">
                <span className="text-gray-400">SCHEDULE:</span>
                <span className="text-[#00ffff]">{activeReceipt.date} ({activeReceipt.time})</span>
              </div>
              <div className="flex justify-between border-b border-[#1f162e] pb-1.5">
                <span className="text-gray-400">VENUE:</span>
                <span className="text-white">{activeReceipt.venue}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f162e] pb-1.5">
                <span className="text-gray-400">REGISTRATION FEE:</span>
                <span className="text-[#00ff66] font-bold">{activeReceipt.fee} {'//'} CONFIRMED</span>
              </div>
              <div className="flex justify-between border-b border-[#1f162e] pb-1.5">
                <span className="text-gray-400">RECEIPT NO:</span>
                <span className="text-gray-300 font-mono">{activeReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">REGISTERED ON:</span>
                <span className="text-[11px] text-[#c084fc] font-mono">{activeReceipt.timestamp}</span>
              </div>
            </div>

            {/* Pixel Barcode Graphic */}
            <div className="mt-4 p-2 bg-black border border-[#221636] flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 h-8 w-full justify-center opacity-85">
                {[4, 2, 6, 1, 5, 3, 2, 7, 4, 1, 3, 6, 2, 5, 1, 4, 7, 3, 2, 5, 3, 1, 6, 4, 2].map((w, idx) => (
                  <span
                    key={idx}
                    className="bg-[#c084fc] h-full inline-block"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-silkscreen text-gray-500 mt-1">
                {activeReceipt.regId} {'//'} AUTH_VERIFIED
              </span>
            </div>

            {/* Instructions & CTA */}
            <p className="font-silkscreen text-[9px] text-gray-400 text-center mt-3">
              PRESENT THIS DIGITAL PASS OR REGISTRATION ID AT ARENA DESK 15 MINUTES PRIOR TO KICKOFF.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleCopy(activeReceipt.regId, 'modal')}
                className="flex-1 py-2 font-silkscreen text-[11px] border border-[#9933ff] text-[#9933ff] hover:bg-[#9933ff]/15 cursor-pointer text-center"
              >
                {copiedId === 'modal' ? 'COPIED TO CLIPBOARD' : 'COPY REGISTRATION ID'}
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="flex-1 py-2 font-pixel text-[10px] bg-[#9933ff] text-white hover:bg-[#b366ff] cursor-pointer text-center"
              >
                CLOSE RECEIPT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
