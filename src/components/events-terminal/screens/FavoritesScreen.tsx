import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ModuleId } from '@/types/eventsTerminal';
import {
  checkRegistration,
  getLastRegistration,
  saveLastRegistration,
  resolvePaymentAmount,
  submitToPaymentProcess,
  submitPaymentCallback,
  type CheckRegistrationResponse
} from '@/services/registration';
import { sound } from '../sound';
import { formatRupees, withGst } from '../useLiveRegistrationData';
import { RegistrationStatusDialog } from '../RegistrationStatusDialog';
import { OUTCOME_COPY, registrationOutcome } from '../registrationStatus';
import { AlertTriangle, Check, CheckCircle2, Copy, CreditCard, Download, Loader2, Printer, QrCode, RefreshCw, Search, ShieldCheck, Users, XCircle } from 'lucide-react';
import { RegistrationRulesModal } from '@/components/registration/RegistrationRulesModal';

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

const OUTCOME_TONE = {
  success: 'text-[#6ee7b7] border-[#34d399] bg-[#34d399]/10',
  pending: 'text-[#fcd34d] border-[#fbbf24] bg-[#fbbf24]/10',
  failed: 'text-[#fda4af] border-[#fb7185] bg-[#fb7185]/10'
} as const;

/**
 * Official entry QR, drawn from the backend's `qr_url` (only present once
 * payment is VERIFIED and the registration CONFIRMED — the backend decides).
 * Download renders the same entry-pass PNG as register2's checking.js.
 * The QR library is loaded only when a QR is actually shown.
 */
const EntryQr: React.FC<{ url: string; code: string; day: string }> = ({ url, code, day }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import('qrcode')
      .then(({ default: QRCode }) => {
        if (!cancelled && canvasRef.current) return QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2 });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const downloadPass = () => {
    const qr = canvasRef.current;
    if (!qr) return;
    sound.playNavClick();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 1000;
    canvas.height = 1220;
    ctx.fillStyle = '#081522';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#5ee7ff';
    ctx.fillRect(0, 0, canvas.width, 14);
    ctx.fillStyle = '#f3f8ff';
    ctx.font = '800 42px Arial';
    ctx.fillText('CYBER SENTINEL', 70, 100);
    ctx.fillStyle = '#91a6bd';
    ctx.font = '24px Arial';
    ctx.fillText('OFFICIAL ENTRY PASS', 70, 142);
    ctx.fillStyle = '#fff';
    ctx.fillRect(70, 190, 860, 790);
    const size = 640;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qr, (canvas.width - size) / 2, 265, size, size);
    // checking.js draws the code in the background colour, so it never shows; light text here.
    ctx.fillStyle = '#f3f8ff';
    ctx.font = '800 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(code, 500, 1050);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#5ee7ff';
    ctx.fillText(day, 500, 1100);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#91a6bd';
    ctx.fillText('Present this QR at the assigned attendance desk', 500, 1160);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${code}-${day}-QR.png`;
    link.click();
  };

  return (
    <div className="border-2 border-[#00ff66] bg-[#03140a] p-4 flex flex-col sm:flex-row items-center gap-4" data-purpose="entry-qr">
      <div className="bg-white p-2 shrink-0">
        <canvas ref={canvasRef} width={200} height={200} aria-label={`Entry QR for ${code}`} className="block w-[200px] h-[200px]" />
      </div>
      <div className="flex flex-col gap-2 text-center sm:text-left min-w-0">
        <h4 className="font-pixel text-sm text-[#00ff66] tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
          <QrCode className="w-4 h-4" /> OFFICIAL ENTRY QR
        </h4>
        <p className="text-[11px] font-mono text-gray-300">
          This QR contains only a secure verification link. Show it to the Admin desk or the relevant event coordinator.
        </p>
        {failed ? (
          <p className="text-[11px] font-mono text-[#ff8fa3]">Unable to draw the QR. Please reload and try again.</p>
        ) : (
          <button
            type="button"
            onClick={downloadPass}
            className="inline-flex items-center justify-center gap-1.5 w-full sm:w-fit px-3 py-2 bg-[#00ff66] text-black hover:bg-[#5dff9b] font-pixel text-[10px] tracking-wider cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> DOWNLOAD QR
          </button>
        )}
      </div>
    </div>
  );
};

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
  const [isPolling, setIsPolling] = useState(false);
  const [pollingAttempt, setPollingAttempt] = useState(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<CheckRegistrationResponse | null>(null);
  // The email the shown record was looked up with — what checking.js sends to the payment process.
  const [recordEmail, setRecordEmail] = useState('');
  const [paying, setPaying] = useState(false);
  // Outcome popup — opened after successful lookup / verification
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const recordRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const lookup = useCallback(
    async (lookupEmail: string, lookupPhone: string, shouldPollIfPending = false, attempt = 1) => {
      setError(null);
      if (attempt === 1) {
        setLoading(true);
      }
      try {
        const res = await checkRegistration(lookupEmail, lookupPhone);
        setRecord(res);
        setRecordEmail(lookupEmail);

        const outcome = registrationOutcome(res);
        if (outcome === 'success') {
          setIsPolling(false);
          setDialogOpen(true);
        } else if (shouldPollIfPending && attempt < 5) {
          // Gateway webhook may take a few seconds to reach Supabase
          setIsPolling(true);
          setPollingAttempt(attempt);
          clearTimeout(pollTimerRef.current);
          pollTimerRef.current = setTimeout(() => {
            void lookup(lookupEmail, lookupPhone, true, attempt + 1);
          }, 2500);
        } else {
          setIsPolling(false);
          setDialogOpen(true);
        }
      } catch (err) {
        setIsPolling(false);
        setRecord(null);
        setError(err instanceof Error ? err.message : 'Unable to check registration.');
      } finally {
        if (attempt === 1) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Parse URL query params from gateway redirect and auto-verify
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qEmail = params.get('email') || params.get('Email') || '';
    const qPhone = params.get('contact') || params.get('Contact') || params.get('phone') || params.get('Phone') || '';
    const qTxn = params.get('transaction_id') || params.get('transactionId') || params.get('TransactionID') || params.get('txnid') || '';
    const qStatus = params.get('payment_status') || params.get('paymentStatus') || params.get('PaymentStatus') || params.get('status') || '';
    const qDay = params.get('day') || params.get('Day') || '';
    const qAmount = Number(params.get('paid_amount') || params.get('PaidAmount') || params.get('amount') || 0);
    const qRef = params.get('transaction_ref_no') || params.get('TransactionRefNo') || '';

    // If payment gateway redirected back with transaction parameters, immediately forward to payment-response Edge Function
    if (qEmail && (qTxn || qStatus)) {
      void submitPaymentCallback({
        email: qEmail,
        contact: qPhone,
        day: qDay,
        transactionId: qTxn,
        paymentStatus: qStatus || 'TXN_SUCCESS',
        paidAmount: qAmount,
        transactionRefNo: qRef
      });
    }

    const effectiveEmail = qEmail || saved.current?.email || '';
    const effectivePhone = qPhone || saved.current?.phone || '';

    if (qEmail) setEmail(qEmail);
    if (qPhone) setPhone(qPhone);

    if (effectiveEmail && effectivePhone) {
      saveLastRegistration({ email: effectiveEmail, phone: effectivePhone, code: saved.current?.code || '' });
      // Poll if returning from gateway with transaction info or on status page
      const isGatewayReturn = Boolean(qTxn || qStatus || window.location.pathname.toLowerCase().includes('status'));
      void lookup(effectiveEmail, effectivePhone, isGatewayReturn);
    }
  }, [lookup]);

  useEffect(() => {
    return () => {
      clearTimeout(copyTimer.current);
      clearTimeout(pollTimerRef.current);
    };
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playNavClick();
    if (!email.trim() || !phone.trim()) {
      sound.playError();
      setError('Enter both email and phone.');
      return;
    }
    void lookup(email.trim(), phone.trim(), false);
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
  // GST-inclusive amount, on the same recorded base that Pay Payment sends
  // (display only — the payload is unchanged, exactly as checking.js).
  const displayAmount = record?.payment ? withGst(record.payment.amount) : null;
  const amountLabel = displayAmount === null ? '—' : `${formatRupees(displayAmount)} incl. GST`;
  const outcome = record ? registrationOutcome(record) : null;
  const outcomeCopy = outcome ? OUTCOME_COPY[outcome] : null;
  const isVerified = outcome === 'success';
  const canCreateTeam = isVerified && record?.registration.selected_day !== 'SPECIAL' && !record?.team;

  // register2 checking.js "Pay Payment": shown until payment is VERIFIED.
  const handlePay = async () => {
    if (!record || paying) return;
    sound.playNavClick();
    setPaying(true);
    try {
      const registrationFee = await resolvePaymentAmount(record);
      await new Promise((resolve) => setTimeout(resolve, 2200));
      submitToPaymentProcess({ email: recordEmail, day: record.registration.selected_day, registrationFee });
    } catch (err) {
      sound.playError();
      setError(err instanceof Error ? err.message : 'Unable to determine the payment amount.');
      setPaying(false);
    }
  };

  const viewRecord = () => {
    sound.playNavClick();
    setDialogOpen(false);
    requestAnimationFrame(() => recordRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

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
      `PAYMENT          : ${paymentStatus}${displayAmount !== null ? ` (${amountLabel})` : ''}`,
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
      {record && outcome && dialogOpen && (
        <RegistrationStatusDialog
          outcome={outcome}
          registrationCode={record.registration.registration_code}
          primary={
            outcome === 'success'
              ? { label: 'VIEW REGISTRATION', onClick: viewRecord }
              : {
                  label: outcome === 'failed' ? 'PAY AGAIN' : 'COMPLETE PAYMENT',
                  onClick: () => void handlePay(),
                  busy: paying,
                  busyLabel: 'PREPARING PAYMENT...'
                }
          }
          secondary={
            outcome === 'success' ? undefined : { label: outcome === 'failed' ? 'VIEW REGISTRATION' : 'CHECK REGISTRATION', onClick: viewRecord }
          }
          onClose={() => setDialogOpen(false)}
        />
      )}
      {/* Header Dither Bar */}
      <section className="pixel-dither-bar h-12 w-full flex items-center justify-between px-3 sm:px-4 mb-6 select-none">
        <h1 className="font-pixel text-black text-xs sm:text-lg tracking-wider font-extrabold flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="inline-block w-3 h-3 bg-black shrink-0" />
          <span className="truncate">MY REGISTRATIONS // CYBERSENTINEL 2K26</span>
        </h1>
        <div className="flex items-center gap-2 relative z-10 shrink-0 ml-2">
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              setShowRulesModal(true);
            }}
            className="text-black hover:text-white px-2 sm:px-2.5 py-1 border-2 border-black bg-white/20 hover:bg-black font-arcade text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 transition-all shadow-xs whitespace-nowrap cursor-pointer"
            title="View Registration & Event Rulebook"
          >
            <span>[📜]</span>
            <span className="hidden sm:inline">RULES BOOK</span>
            <span className="inline sm:hidden">RULES</span>
          </button>
        </div>
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

      {isPolling && (
        <div className="p-3 mb-6 bg-cyan-950/80 border border-cyan-400 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Confirming payment with gateway... (Checking attempt {pollingAttempt} of 5)</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-pixel">PLEASE WAIT</span>
        </div>
      )}

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
                    outcome === 'success' ? 'text-[#6ee7b7]' : outcome === 'failed' ? 'text-[#fda4af]' : 'text-[#fcd34d]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" /> {outcomeCopy?.paymentLabel}
                </span>
              </div>
              <span className="text-gray-500 text-[10px] font-silkscreen text-right">
                REGISTRATION
                <br />
                {outcomeCopy?.registrationLabel}
              </span>
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
            <div ref={recordRef} className="scroll-mt-4 border-2 border-[#2d123d] hover:border-[#9933ff] bg-[#07050a] p-4 transition-all shadow-sm flex flex-col space-y-3">
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
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-silkscreen font-bold ${
                    outcome ? OUTCOME_TONE[outcome] : ''
                  }`}
                >
                  {isVerified ? 'CONFIRMED // ACTIVE PASS' : `PAYMENT ${outcomeCopy?.paymentLabel}`}
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

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs font-mono">
                <div>
                  <span className="text-gray-500 text-[9px] block">NAME</span>
                  <span className="text-white break-words">{record.participant.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">COLLEGE</span>
                  <span className="text-gray-300 break-words">{record.participant.college}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">DEPARTMENT</span>
                  <span className="text-gray-300 break-words">{record.participant.department}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">AMOUNT</span>
                  <span className="text-[#00ffff]">{amountLabel}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[9px] block">UTR</span>
                  <span className="text-[#c084fc]">{record.payment?.utr_masked || 'Hidden'}</span>
                </div>
              </div>

              {outcome && outcomeCopy && (
                <div className={`border p-3 flex flex-col gap-2 ${OUTCOME_TONE[outcome]}`} data-purpose="status-panel" data-outcome={outcome}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-black/40 border border-[#2d123d] px-3 py-2">
                      <span className="block text-[9px] font-silkscreen text-gray-400 tracking-wider">REGISTRATION STATUS</span>
                      <span className="flex items-center gap-1.5 font-pixel text-xs text-[#6ee7b7] tracking-wider mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        REGISTRATION {outcomeCopy.registrationLabel}
                      </span>
                    </div>
                    <div className="bg-black/40 border border-[#2d123d] px-3 py-2">
                      <span className="block text-[9px] font-silkscreen text-gray-400 tracking-wider">PAYMENT STATUS</span>
                      <span className="flex items-center gap-1.5 font-pixel text-xs tracking-wider mt-0.5">
                        {outcome === 'success' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        ) : outcome === 'failed' ? (
                          <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        )}
                        PAYMENT {outcomeCopy.paymentLabel}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-gray-300 leading-relaxed">
                    {outcomeCopy.message}
                    {outcome === 'success' ? ' Your entry QR is below.' : ' Your entry QR appears once payment is verified.'}
                  </p>
                </div>
              )}

              {paymentStatus !== 'VERIFIED' && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handlePay()}
                    disabled={paying || isPolling}
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-fit px-4 py-2 bg-[#ff007f] hover:bg-[#ff3399] text-white font-pixel text-[10px] tracking-wider cursor-pointer disabled:opacity-50 shadow-[0_0_10px_rgba(255,0,127,0.4)]"
                    data-purpose="pay-payment-btn"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{paying ? 'PREPARING PAYMENT...' : outcome === 'failed' ? 'PAY AGAIN' : 'COMPLETE PAYMENT'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playNavClick();
                      void lookup(email.trim(), phone.trim(), true);
                    }}
                    disabled={loading || isPolling}
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-fit px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/60 text-yellow-300 font-pixel text-[10px] tracking-wider cursor-pointer disabled:opacity-50"
                    data-purpose="recheck-payment-btn"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin' : ''}`} />
                    <span>{isPolling ? `CHECKING (${pollingAttempt}/5)...` : 'RE-CHECK PAYMENT'}</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  sound.playNavClick();
                  window.print();
                }}
                className="inline-flex items-center justify-center gap-1.5 w-full sm:w-fit px-4 py-2 bg-black border border-zinc-600 hover:border-[#c084fc] text-gray-300 hover:text-white font-pixel text-[10px] tracking-wider cursor-pointer"
                data-purpose="print-confirmation-btn"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT CONFIRMATION</span>
              </button>

              {record.qr_url && (
                <EntryQr
                  url={record.qr_url}
                  code={record.registration.registration_code}
                  day={record.registration.selected_day}
                />
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
      {paying && record && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-[#090d16] border-2 border-cyan-500/80 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.35)] p-6 sm:p-7 text-center overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-4 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              REGISTRATION RECORD CONFIRMED
            </div>
            <div className="relative mx-auto my-3 w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
              <ShieldCheck className="w-9 h-9 text-emerald-400 relative z-10" />
            </div>
            <h3 className="font-pixel text-lg sm:text-xl text-white tracking-wide mt-2">
              FORWARDING TO PAYMENT
            </h3>
            <p className="text-cyan-300 font-mono text-xs sm:text-sm mt-2 leading-relaxed">
              Please wait while being redirected to the payment gateway...
            </p>
            <div className="mt-4 bg-[#0e1726] border border-cyan-500/30 rounded-lg p-3 text-left space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center text-gray-400">
                <span>REGISTRATION ID:</span>
                <span className="text-cyan-300 font-bold tracking-wider">{record.registration.registration_code}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>PARTICIPANT:</span>
                <span className="text-white font-medium truncate max-w-[200px]">{record.participant.name}</span>
              </div>
            </div>
            <div className="mt-5 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-cyan-500/30">
              <div className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 h-full w-full animate-pulse" />
            </div>
            <p className="mt-3 text-[11px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
              Do not refresh or close this window...
            </p>
          </div>
        </div>
      )}

      {showRulesModal && (
        <RegistrationRulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
      )}
    </div>
  );
};
