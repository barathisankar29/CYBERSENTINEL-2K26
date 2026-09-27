import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ModuleId } from '@/types/eventsTerminal';
import {
  checkRegistration,
  getLastRegistration,
  type CheckRegistrationResponse
} from '@/services/registration';
import { sound } from '../sound';
import { Check, Copy, Download, ExternalLink, Search, ShieldCheck, Users } from 'lucide-react';

interface FavoritesScreenProps {
  onSelectModule?: (mod: ModuleId) => void;
  onNavigateToTeamCreation?: (regId: string, eventName: string) => void;
}

const DAY_LABELS: Record<string, string> = {
  DAY_1: 'DAY 1 // TECHNICAL EVENTS',
  DAY_2: 'DAY 2 // NON-TECHNICAL EVENTS',
  BOTH: 'BOTH DAYS // DUAL ALL-ACCESS',
  SPECIAL: 'SPECIAL EVENTS'
};

function statusTone(status?: string) {
  if (status === 'VERIFIED' || status === 'CONFIRMED') return 'text-[#00ff66] border-[#00ff66] bg-[#00ff66]/10';
  if (status === 'REJECTED') return 'text-[#ff4d6d] border-[#ff4d6d] bg-[#ff4d6d]/10';
  return 'text-[#ffee00] border-[#ffee00] bg-[#ffee00]/10';
}

/**
 * "My Registrations" — the participant's real record from the backend's
 * `check-registration` Edge Function (secure email + phone lookup). Nothing
 * here is stored or invented client-side: payment status, team and QR all
 * come from the backend. The last successful submission's email/phone
 * (cs_last_registration) prefills the lookup.
 */
export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ onSelectModule, onNavigateToTeamCreation }) => {
  const saved = useRef(getLastRegistration());
  const [email, setEmail] = useState(saved.current?.email ?? '');
  const [phone, setPhone] = useState(saved.current?.phone ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<CheckRegistrationResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const lookup = useCallback(async (lookupEmail: string, lookupPhone: string) => {
    setError(null);
    setLoading(true);
    try {
      setRecord(await checkRegistration(lookupEmail, lookupPhone));
    } catch (err) {
      setRecord(null);
      setError(err instanceof Error ? err.message : 'Unable to check registration.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load the registration submitted from this browser, if any.
  useEffect(() => {
    const last = saved.current;
    if (last?.email && last.phone) void lookup(last.email, last.phone);
  }, [lookup]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playNavClick();
    if (!email.trim() || !phone.trim()) {
      sound.playError();
      setError('Enter both email and phone.');
      return;
    }
    void lookup(email.trim(), phone.trim());
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    sound.playNavClick();
    clearTimeout(copyTimer.current);
    setCopied(true);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  const paymentStatus = record?.payment?.status ?? 'PENDING';
  const isVerified = record?.payment?.status === 'VERIFIED' && record.registration.status === 'CONFIRMED';
  const canCreateTeam = isVerified && record?.registration.selected_day !== 'SPECIAL' && !record?.team;

  const triggerReceiptDownload = () => {
    if (!record) return;
    const lines = [
      '============================================================',
      '           CYBERSENTINEL 2K26 // REGISTRATION RECORD        ',
      '============================================================',
      `GENERATED ON     : ${new Date().toLocaleString()}`,
      `REGISTRATION ID  : ${record.registration.registration_code}`,
      `NAME             : ${record.participant.name}`,
      `COLLEGE          : ${record.participant.college}`,
      `DEPARTMENT       : ${record.participant.department}`,
      `REGISTERED FOR   : ${DAY_LABELS[record.registration.selected_day] ?? record.registration.selected_day}`,
      `REGISTRATION     : ${record.registration.status}`,
      `PAYMENT          : ${paymentStatus}${record.payment ? ` (₹${record.payment.amount})` : ''}`,
      `UTR              : ${record.payment?.utr_masked || 'Hidden'}`,
      ...(record.special_events.length
        ? [`SPECIAL EVENTS   : ${record.special_events.map((ev) => ev.name).join(', ')}`]
        : []),
      ...(record.team
        ? [`TEAM             : ${record.team.team_name} (${record.team.team_code}) — ${record.team.event_name}`]
        : []),
      `ENTRY QR         : ${record.qr_url ?? 'Issued after payment verification'}`,
      '============================================================'
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.registration.registration_code}-registration.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full relative" data-purpose="registrations-vault-content">
      {/* Header Dither Bar */}
      <section className="pixel-dither-bar h-12 w-full flex items-center justify-between px-4 mb-6 select-none">
        <h1 className="font-pixel text-black text-xs sm:text-lg tracking-wider font-extrabold flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-black" />
          MY REGISTRATIONS // CYBERSENTINEL 2K26
        </h1>
        <div aria-hidden="true" className="pixel-dither-fade" />
      </section>

      {/* Secure lookup */}
      <form
        onSubmit={handleLookup}
        className="bg-[#07050d] border border-[#2d123d] p-3 mb-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2.5 items-end"
      >
        <div>
          <label htmlFor="mr-email" className="text-gray-400 text-[10px] font-silkscreen block mb-1">
            REGISTERED EMAIL
          </label>
          <input
            id="mr-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-[#2d1b46] focus:border-[#00ffff] text-white px-2.5 py-2 text-xs font-mono focus:outline-hidden select-text"
          />
        </div>
        <div>
          <label htmlFor="mr-phone" className="text-gray-400 text-[10px] font-silkscreen block mb-1">
            REGISTERED PHONE
          </label>
          <input
            id="mr-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-black border border-[#2d1b46] focus:border-[#00ffff] text-white px-2.5 py-2 text-xs font-mono focus:outline-hidden select-text"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#9933ff] hover:bg-[#b366ff] border border-[#c084fc] text-white font-pixel text-[10px] tracking-wider cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 min-h-[36px]"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{loading ? 'CHECKING...' : 'CHECK STATUS'}</span>
        </button>
      </form>

      {error && (
        <div className="p-2.5 mb-6 bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono" role="alert">
          <span className="font-bold text-red-400">► </span>
          {error}
        </div>
      )}

      {!record && !error && !loading && (
        <div className="border-2 border-dashed border-[#2d123d] p-6 text-center font-mono text-xs text-gray-400">
          Enter the email and phone number you registered with to load your pass.{' '}
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onSelectModule?.('compete');
            }}
            className="text-[#ff007f] hover:text-white underline cursor-pointer"
          >
            Not registered yet? Browse events →
          </button>
        </div>
      )}

      {record && (
        <>
          {/* Overview Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
            <div className="bg-[#07050d] border-2 border-[#9933ff] p-3 flex items-center justify-between shadow-[0_0_10px_rgba(153,51,255,0.2)]">
              <div className="min-w-0">
                <span className="text-gray-400 text-[10px] font-silkscreen block">REGISTERED FOR</span>
                <span className="text-white font-pixel text-sm sm:text-base">
                  {record.registration.selected_day.replace('_', ' ')}
                </span>
              </div>
              <span className="w-3 h-3 bg-[#9933ff] animate-pulse inline-block shrink-0" />
            </div>

            <div className="bg-[#07050d] border border-[#2d123d] p-3 flex items-center justify-between">
              <div>
                <span className="text-gray-400 text-[10px] font-silkscreen block">PAYMENT STATUS</span>
                <span
                  className={`font-bold text-sm flex items-center gap-1.5 ${
                    isVerified ? 'text-[#00ff66]' : paymentStatus === 'REJECTED' ? 'text-[#ff4d6d]' : 'text-[#ffee00]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" /> {paymentStatus.replace('_', ' ')}
                </span>
              </div>
              <span className="text-gray-500 text-[10px] font-silkscreen">{record.registration.status}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                triggerReceiptDownload();
              }}
              className="bg-[#9933ff] hover:bg-[#b366ff] border-2 border-[#c084fc] p-3 flex items-center justify-between shadow-[0_0_15px_rgba(153,51,255,0.4)] hover:shadow-[0_0_22px_rgba(192,132,252,0.7)] transition-all cursor-pointer text-left group"
              data-purpose="download-receipt-top-btn"
            >
              <div>
                <span className="text-black/80 text-[10px] font-silkscreen font-bold block">REGISTRATION RECORD</span>
                <span className="text-white font-pixel text-xs sm:text-sm tracking-wider block mt-0.5">DOWNLOAD RECEIPT</span>
              </div>
              <Download className="w-5 h-5 text-white group-hover:translate-y-0.5 transition-transform shrink-0" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Pass card */}
            <div className="border-2 border-[#2d123d] hover:border-[#9933ff] bg-[#07050a] p-4 transition-all shadow-sm flex flex-col space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#1e0f2b]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-pixel text-xs sm:text-sm text-[#ffee00] tracking-wider break-all">
                    {record.registration.registration_code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(record.registration.registration_code)}
                    className="text-gray-400 hover:text-white p-1 cursor-pointer transition-colors"
                    aria-label="Copy Registration ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#00ff66]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-silkscreen font-bold ${statusTone(paymentStatus)}`}
                >
                  {isVerified ? 'CONFIRMED // ACTIVE PASS' : `PAYMENT ${paymentStatus.replace('_', ' ')}`}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                <h3 className="font-pixel text-base sm:text-lg text-white tracking-wider">
                  {DAY_LABELS[record.registration.selected_day] ?? record.registration.selected_day}
                </h3>
                {canCreateTeam && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playNavClick();
                      const firstTeamEvent = record.team_events[0]?.name ?? '';
                      if (onNavigateToTeamCreation) onNavigateToTeamCreation(record.registration.registration_code, firstTeamEvent);
                      else onSelectModule?.('team');
                    }}
                    className="px-3.5 py-1.5 font-pixel text-[10px] tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 bg-[#ff007f] text-white hover:bg-[#ff3399] shadow-[0_0_10px_rgba(255,0,127,0.4)]"
                    data-purpose="create-team-action-btn"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>CREATE TEAM</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div>
                  <span className="text-gray-500 text-[9px] block">NAME</span>
                  <span className="text-white break-words">{record.participant.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">COLLEGE</span>
                  <span className="text-gray-300 break-words">{record.participant.college}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">AMOUNT</span>
                  <span className="text-[#00ffff]">{record.payment ? `₹${record.payment.amount}` : '—'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">UTR</span>
                  <span className="text-[#c084fc]">{record.payment?.utr_masked || 'Hidden'}</span>
                </div>
              </div>

              {!isVerified && paymentStatus !== 'REJECTED' && (
                <p className="text-[11px] font-mono text-gray-400">
                  Your payment is being verified by the organizers. Your entry QR and team creation unlock once it is verified.
                </p>
              )}
              {paymentStatus === 'REJECTED' && (
                <p className="text-[11px] font-mono text-[#ff8fa3]">
                  Your payment could not be verified. Please contact the organizing team.
                </p>
              )}

              {record.qr_url && (
                <a
                  href={record.qr_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 w-fit px-3 py-1.5 border border-[#00ff66] text-[#00ff66] hover:bg-[#00ff66] hover:text-black font-pixel text-[10px] tracking-wider"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OPEN ENTRY QR PASS</span>
                </a>
              )}
            </div>

            {/* Special events */}
            {record.special_events.map((ev) => (
              <div key={ev.id} className="border-2 border-[#2d123d] bg-[#07050a] p-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-pixel text-sm sm:text-base text-white tracking-wider">{ev.name}</h3>
                <span className="text-[10px] font-silkscreen text-[#5fa07a]">SPECIAL EVENT // {ev.code}</span>
              </div>
            ))}

            {/* Team */}
            {record.team ? (
              <div className="border-2 border-[#00ffff]/60 bg-[#07050a] p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1e0f2b]">
                  <h3 className="font-pixel text-sm sm:text-base text-white tracking-wider">{record.team.team_name}</h3>
                  <span className="text-[10px] font-silkscreen text-[#00ffff]">
                    {`${record.team.team_code} // ${record.team.status}`}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-gray-400">{record.team.event_name}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {record.team.members.map((member, index) => (
                    <li key={`${member.name}-${index}`} className="flex items-center justify-between gap-2 bg-[#0a0614] border border-[#2d1b46] px-2.5 py-1.5 text-xs font-mono">
                      <span className="text-white">{member.name}</span>
                      <span className={`text-[9px] font-silkscreen ${member.member_role === 'LEADER' ? 'text-[#ff007f]' : 'text-[#c084fc]'}`}>
                        {member.member_role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              record.team_events.length > 0 && (
                <div className="border-2 border-[#2d123d] bg-[#07050a] p-4">
                  <span className="text-gray-400 text-[10px] font-silkscreen block mb-2">TEAM EVENTS ON YOUR PASS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {record.team_events.map((ev) => (
                      <span key={ev.id} className="px-2 py-0.5 border border-[#7c3aed] text-[#c084fc] text-[10px] font-mono">
                        {ev.name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};
