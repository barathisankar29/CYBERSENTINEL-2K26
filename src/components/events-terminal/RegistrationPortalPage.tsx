import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import type { CharacterId } from '@/types/characterProfile';
import { characterProfiles } from '@/data/characterProfiles';
import {
  checkRegistration,
  getActiveEvents,
  getLastRegistration,
  resolvePaymentAmount,
  type CheckRegistrationResponse,
  saveLastRegistration,
  submitRegistration,
  submitToPaymentProcess,
  type ActiveEvent,
  type RegistrationDay
} from '@/services/registration';
import { recordBackendRegistration } from '@/utils/eventRegistration';
import { sound } from './sound';
import { isTeamEvent } from './teamEvents';
import {
  dayDisplayPrice,
  formatRupees,
  GST_PERCENT,
  specialDisplayPrice,
  useLiveRegistrationData,
  withGst
} from './useLiveRegistrationData';
import { useMascot } from '@/components/mascot';
import { RegistrationStatusDialog } from './RegistrationStatusDialog';
import { registrationOutcome } from './registrationStatus';

export interface RegistrationPortalInitialData {
  dayType?: RegistrationDay;
  characterKey?: string;
  /** e.g. "DAY 1 ACCESS", "GROUP DANCE" */
  packLabel?: string;
  /** Backend special_events.code values preselected by the pack (SPECIAL only) */
  specialEventCodes?: string[];
  selectedEvents?: { id: string; name: string; day?: string; protocol?: string }[];
}

interface RegistrationPortalPageProps {
  initialData?: RegistrationPortalInitialData;
  /** Primary back control text — "BACK TO EVENT" when opened from an event page. */
  backLabel?: string;
  onClose: () => void;
  onNavigateToRegistrations: () => void;
}

/**
 * Profile character for the day actually submitted — the same mapping as the
 * "Choose your player" packs (NICO = Day 1, RUELLE = Day 2, COSMA = both,
 * DR. DACRE = special events), so direct /register and pack flows agree.
 */
const DAY_CHARACTER: Record<RegistrationDay, CharacterId> = {
  DAY_1: 'nico',
  DAY_2: 'ruelle',
  BOTH: 'cosma',
  SPECIAL: 'dacre'
};

const EVENT_DAYS = ['DAY_1', 'DAY_2'] as const;

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Backend event ids for the events handed over by the pack chooser / event
 * page, matched by name against the live ACTIVE events (exact name first,
 * then ignoring spacing and punctuation), so nothing here hardcodes the
 * backend's event list or ids.
 */
function matchActiveEventIds(
  wanted: RegistrationPortalInitialData['selectedEvents'],
  activeEvents: ActiveEvent[]
): string[] {
  const ids = new Set<string>();
  for (const item of wanted ?? []) {
    const day = item.day?.replace(/\s+/g, '_').toUpperCase();
    const candidates = activeEvents.filter((event) => !day || event.day === day);
    const match =
      candidates.find((event) => event.name.toLowerCase() === item.name.toLowerCase()) ??
      candidates.find((event) => normalizeName(event.name) === normalizeName(item.name));
    if (match) ids.add(match.id);
  }
  return [...ids];
}

/**
 * Full-screen registration portal from the events-terminal design, wired to
 * the backend team's register2 registration client (registration.js) —
 * same endpoints, payload and client checks, re-presented in the terminal's
 * visual language:
 *   - fees: functions/v1/get-registration-fees; special events:
 *     rest/v1/rpc/get_special_events; day events: rest/v1/events (ACTIVE)
 *   - submit: functions/v1/public-register (multipart) with selected_day,
 *     selected_event_ids and special_event_codes
 *   - then the browser is handed to the college payment process with
 *     email, day and the registration_fee public-register returned.
 * The Edge Function does all authoritative validation.
 */
export const RegistrationPortalPage: React.FC<RegistrationPortalPageProps> = ({
  initialData,
  backLabel = 'BACK TO EVENTS',
  onClose,
  onNavigateToRegistrations
}) => {
  const { dispatchMascotEvent } = useMascot();
  // Form fields matching the HTML structure exactly
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');

  // Selected Registration Day (radio: DAY_1, DAY_2, BOTH, SPECIAL)
  const [selectedDay, setSelectedDay] = useState<RegistrationDay>(initialData?.dayType || 'DAY_1');

  // Special events (backend codes) if SPECIAL is selected
  const [selectedSpecialCodes, setSelectedSpecialCodes] = useState<string[]>(
    // One special event per registration (there is no combined special package).
    initialData?.dayType === 'SPECIAL' ? (initialData.specialEventCodes ?? []).slice(0, 1) : []
  );

  // Day events (rest/v1/events, ACTIVE only) and the participant's picks.
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const [eventsReady, setEventsReady] = useState(false);
  const [eventsError, setEventsError] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    getActiveEvents()
      .then((events) => {
        if (cancelled) return;
        setActiveEvents(events);
        // Preselect what the visitor picked on the event page / pack.
        const baseSelectedIds = matchActiveEventIds(initialData?.selectedEvents, events);
        // If any defaultly selected event is a team event, select all team events for that day as well!
        const expandedIds = new Set(baseSelectedIds);
        for (const id of baseSelectedIds) {
          const ev = events.find((e) => e.id === id);
          if (ev && isTeamEvent(ev)) {
            const sameDayTeamEvents = events.filter((e) => e.day === ev.day && isTeamEvent(e));
            for (const teamEv of sameDayTeamEvents) {
              expandedIds.add(teamEv.id);
            }
          }
        }
        setSelectedEventIds([...expandedIds]);
        setEventsReady(true);
      })
      .catch(() => {
        if (!cancelled) setEventsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [initialData]);

  const eventsByDay = useMemo(
    () => ({
      DAY_1: activeEvents.filter((event) => event.day === 'DAY_1'),
      DAY_2: activeEvents.filter((event) => event.day === 'DAY_2')
    }),
    [activeEvents]
  );
  const visibleEventDays = EVENT_DAYS.filter((day) => selectedDay === day || selectedDay === 'BOTH');

  const toggleDayEvent = (id: string) => {
    sound.playBlip();
    const clickedEvent = activeEvents.find((e) => e.id === id);
    if (!clickedEvent) {
      setSelectedEventIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
      return;
    }

    if (isTeamEvent(clickedEvent)) {
      // Find all team events for the same day as the clicked event
      const sameDayTeamEvents = activeEvents.filter(
        (e) => e.day === clickedEvent.day && isTeamEvent(e)
      );
      const teamEventIds = sameDayTeamEvents.map((e) => e.id);

      setSelectedEventIds((prev) => {
        const isCurrentlyChecked = prev.includes(id);
        if (!isCurrentlyChecked) {
          // If the user clicks an unselected team event -> ALL team events for that day get clicked/selected!
          const newIds = new Set([...prev, ...teamEventIds]);
          return Array.from(newIds);
        } else {
          // If the user clicks an already selected team event -> uncheck all team events for that day
          return prev.filter((existingId) => !teamEventIds.includes(existingId));
        }
      });
    } else {
      // Solo events (Weblica, XCoders, Spotlight, Cipher Coding) toggle individually
      setSelectedEventIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  // Returning visitor: if this browser already submitted a registration
  // (cs_last_registration, saved before the payment redirect), look it up
  // with the read-only check-registration and say where it stands — so an
  // unpaid registration is finished instead of registered a second time.
  // public-register is never called here.
  const [returning, setReturning] = useState<{ email: string; record: CheckRegistrationResponse } | null>(null);
  const [returningPaying, setReturningPaying] = useState(false);

  useEffect(() => {
    const last = getLastRegistration();
    if (!last?.email || !last.phone) return;
    let cancelled = false;
    checkRegistration(last.email, last.phone)
      .then((record) => {
        if (!cancelled) setReturning({ email: last.email, record });
      })
      .catch(() => {
        // No record (or lookup unavailable): just show the normal form.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const payReturning = async () => {
    if (!returning || returningPaying) return;
    sound.playNavClick();
    setReturningPaying(true);
    try {
      const registrationFee = await resolvePaymentAmount(returning.record);
      setRedirectingInfo({
        regCode: returning.record.registration.registration_code,
        name: returning.record.participant.name,
        email: returning.email
      });
      await new Promise((resolve) => setTimeout(resolve, 2200));
      submitToPaymentProcess({ email: returning.email, day: returning.record.registration.selected_day, registrationFee });
    } catch (error) {
      setRedirectingInfo(null);
      setReturningPaying(false);
      setReturning(null);
      showError(error instanceof Error ? error.message : 'Unable to determine the payment amount.');
    }
  };

  const openRegistrations = () => {
    sound.playNavClick();
    setReturning(null);
    onNavigateToRegistrations();
  };

  // Alert & submission state
  const [alertInfo, setAlertInfo] = useState<{ type: 'error' | 'success'; message: string; regId?: string } | null>(null);
  const [redirectingInfo, setRedirectingInfo] = useState<{
    regCode: string;
    name: string;
    email: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fees, specialEvents, error: pricingError } = useLiveRegistrationData();

  // Lock body scroll to prevent background double scrollbar
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Customer-facing (GST-inclusive) price from the backend's own base fees.
  // Display only: public-register still charges the base and returns it as
  // registration_fee, which is what goes to the payment process.
  const getFeeAmount = (): number | null => {
    if (selectedDay === 'SPECIAL') {
      if (!specialEvents.length) return null;
      return specialDisplayPrice(specialEvents.filter((event) => selectedSpecialCodes.includes(event.code)));
    }
    if (!fees) return null;
    return dayDisplayPrice(fees, selectedDay);
  };
  const feeAmount = getFeeAmount();
  const feeDisplay = feeAmount === null ? '—' : formatRupees(feeAmount);

  const toggleSpecialEvent = (code: string) => {
    setSelectedSpecialCodes([code]);
  };

  const showError = (message: string) => {
    sound.playError();
    setAlertInfo({ type: 'error', message });
    dispatchMascotEvent('MASCOT_REGISTRATION_ERROR', { message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    sound.playNavClick();

    // Required fields validation (the Edge Function re-validates everything)
    if (!fullName.trim()) return showError('Full Name is required.');
    if (!email.trim() || !email.includes('@')) return showError('A valid Email address is required.');
    if (!phone.trim()) return showError('Phone Number is required.');
    if (!college.trim()) return showError('College name is required.');
    if (!department.trim()) return showError('Department is required.');

    // register2 registration.js checks, in its order.
    if (selectedDay !== 'SPECIAL' && !eventsReady) return showError('Events are still loading. Please try again.');
    const submittedEventIds = selectedEventIds.filter((id) => {
      const event = activeEvents.find((item) => item.id === id);
      return Boolean(event) && (selectedDay === 'BOTH' || event?.day === selectedDay);
    });
    const requiredDays: string[] = selectedDay === 'BOTH' ? [...EVENT_DAYS] : selectedDay === 'SPECIAL' ? [] : [selectedDay];
    if (
      requiredDays.some(
        (day) => !submittedEventIds.some((id) => activeEvents.some((event) => event.id === id && event.day === day))
      )
    )
      return showError('Please select at least one event for each selected day.');
    if (selectedDay === 'SPECIAL' && selectedSpecialCodes.length === 0)
      return showError('Please select at least one special event.');

    setIsSubmitting(true);
    setAlertInfo(null);
    dispatchMascotEvent('MASCOT_REGISTRATION_START');
    try {
      const result = await submitRegistration({
        name: fullName,
        email,
        phone,
        college,
        department,
        year,
        selectedDay,
        selectedEventIds: submittedEventIds,
        specialEventCodes: selectedDay === 'SPECIAL' ? selectedSpecialCodes : []
      });

      // Same lookup record the backend team's client keeps (used by My Registrations / Create Team).
      saveLastRegistration({ code: result.registration_code, email: email.trim(), phone: phone.trim() });

      // Profile: character for the submitted day, recorded against the
      // backend's real registration code.
      const characterId = DAY_CHARACTER[selectedDay];
      const character = characterProfiles[characterId];
      if (character) {
        const fromPack = initialData?.dayType === selectedDay;
        const eventNames =
          selectedDay === 'SPECIAL'
            ? specialEvents.filter((ev) => selectedSpecialCodes.includes(ev.code)).map((ev) => ev.name)
            : activeEvents.filter((ev) => submittedEventIds.includes(ev.id)).map((ev) => ev.name);
        recordBackendRegistration(
          characterId,
          {
            id: `${characterId}-${selectedDay.toLowerCase()}`,
            label: (fromPack && initialData?.packLabel) || selectedDay.replace('_', ' '),
            price: feeAmount ?? withGst(result.registration_fee),
            events: eventNames
          },
          result.registration_code,
          fullName.trim(),
          email.trim()
        );
      }

      sound.playSuccess();
      dispatchMascotEvent('MASCOT_REGISTRATION_SUCCESS', {
        message: `Registration ${result.registration_code} created. Taking you to payment.`,
      });
      setAlertInfo({
        type: 'success',
        message: `Registration ID: ${result.registration_code}. Redirecting you to the official payment page...`,
        regId: result.registration_code
      });

      // Show alert-type popup: database verified user details, redirecting to payment
      setRedirectingInfo({
        regCode: result.registration_code,
        name: fullName.trim(),
        email: email.trim()
      });

      // Allow participant to view their verified registration details and redirect notice
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Hand off to the college payment process exactly as register2 does.
      submitToPaymentProcess({ email: email.trim(), day: selectedDay, registrationFee: result.registration_fee });
    } catch (error) {
      setRedirectingInfo(null);
      showError(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayOption = (
    value: RegistrationDay,
    id: string,
    title: string,
    subtitle: string,
    activeClass: string
  ) => (
    <div>
      <input
        id={id}
        type="radio"
        name="day"
        value={value}
        checked={selectedDay === value}
        onChange={() => setSelectedDay(value)}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`block p-3.5 border-2 cursor-pointer transition-all ${
          selectedDay === value ? activeClass : 'border-[#2d123d] bg-[#0d0517] text-gray-400 hover:border-gray-600'
        }`}
      >
        <strong className="block font-pixel text-sm sm:text-base text-white mb-0.5">{title}</strong>
        <small className="block text-[11px] font-mono text-gray-400">{subtitle}</small>
      </label>
    </div>
  );

  const inputClass =
    'w-full bg-[#11061f] border border-[#3b1752] focus:border-[#00ffff] text-white px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 bg-[#05010a] text-gray-200 overflow-y-auto selection:bg-[#ff007f] selection:text-white flex flex-col justify-between"
      data-purpose="fullscreen-registration-portal"
    >
      {returning && (() => {
        const outcome = registrationOutcome(returning.record);
        return (
          <RegistrationStatusDialog
            outcome={outcome}
            registrationCode={returning.record.registration.registration_code}
            title={outcome === 'success' ? 'ALREADY REGISTERED' : outcome === 'failed' ? 'PAYMENT FAILED' : 'REGISTRATION FOUND'}
            message={
              outcome === 'success'
                ? 'Your CyberSentinel 2K26 registration has been completed successfully. View it for your entry QR, or close this to register for another day.'
                : outcome === 'failed'
                  ? 'Your registration was created successfully, but the payment was not completed successfully. Please complete the payment again to confirm your registration.'
                  : 'Registration has been created successfully, but your payment is still pending. Please complete the pending payment to finish your registration.'
            }
            primary={
              outcome === 'success'
                ? { label: 'VIEW REGISTRATION', onClick: openRegistrations }
                : {
                    label: outcome === 'failed' ? 'PAY AGAIN' : 'COMPLETE PAYMENT',
                    onClick: () => void payReturning(),
                    busy: returningPaying,
                    busyLabel: 'PREPARING PAYMENT...'
                  }
            }
            secondary={outcome === 'success' ? undefined : { label: 'CHECK REGISTRATION', onClick: openRegistrations }}
            onClose={() => setReturning(null)}
          />
        );
      })()}

      <header className="w-full bg-[#0a0314] border-b-2 border-[#2d123d] px-3 sm:px-8 py-3.5 flex items-center justify-between gap-2 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="shrink-0 w-8 h-8 bg-[#9333ea] border border-[#c084fc] flex items-center justify-center font-silkscreen text-white font-bold text-sm shadow-[0_0_10px_rgba(147,51,234,0.5)]">
            CS
          </div>
          <span className="hidden sm:inline font-pixel text-xl text-white tracking-wider truncate">CyberSentinel</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-block px-3 py-1 bg-[#1a082b] border border-[#a855f7] text-[#c084fc] font-silkscreen text-[11px] tracking-wider uppercase">
            Participant Registration
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onClose();
            }}
            className="px-3 py-1.5 border-2 border-[#ff007f] bg-[#ff007f]/10 hover:bg-[#ff007f] text-[#ff007f] hover:text-white font-silkscreen text-[11px] sm:text-xs whitespace-nowrap cursor-pointer transition-colors shadow-[0_0_8px_rgba(255,0,127,0.35)]"
            data-purpose="back-to-event"
          >
            ← {backLabel}
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grow flex flex-col justify-start">
        <section className="mb-6">
          <span className="inline-block px-2.5 py-0.5 bg-[#1f0a33] border border-[#9333ea] text-[#f472b6] font-silkscreen text-[10px] tracking-wider uppercase mb-2">
            DAY OR SPECIAL-EVENT REGISTRATION
          </span>
          <h1 className="font-pixel text-2xl sm:text-4xl text-white tracking-wide mb-2">Register for CyberSentinel</h1>
          <p className="text-gray-400 text-xs sm:text-sm font-body leading-relaxed max-w-2xl">
            Select your symposium day, fill in your details and submit. You receive your final QR only after payment verification.
          </p>
        </section>

        {pricingError && !alertInfo && (
          <div className="p-3 mb-6 border-2 bg-[#290a17] border-[#ef4444] text-[#fecaca] text-xs sm:text-sm font-body" role="alert">
            Registration fees are temporarily unavailable. Please try again shortly.
          </div>
        )}

        {alertInfo && (
          <div
            id="alert"
            role={alertInfo.type === 'error' ? 'alert' : 'status'}
            className={`p-4 mb-6 border-2 flex items-start justify-between gap-3 ${
              alertInfo.type === 'success'
                ? 'bg-[#0a2316] border-[#10b981] text-[#a7f3d0]'
                : 'bg-[#290a17] border-[#ef4444] text-[#fecaca]'
            }`}
          >
            <div className="min-w-0">
              <div className="font-silkscreen text-xs font-bold mb-1">
                {alertInfo.type === 'success' ? '✓ REGISTRATION SUBMITTED' : '⚠ REGISTRATION FAILED'}
              </div>
              <p className="text-xs sm:text-sm font-body break-words">{alertInfo.message}</p>
              {alertInfo.type === 'success' && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playNavClick();
                      onNavigateToRegistrations();
                    }}
                    className="px-3 py-1.5 bg-[#10b981] text-black font-pixel text-xs hover:bg-[#34d399] cursor-pointer"
                  >
                    VIEW IN MY REGISTRATIONS →
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setAlertInfo(null)}
              className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer"
              aria-label="Dismiss message"
            >
              [✕]
            </button>
          </div>
        )}

        <form
          id="registrationForm"
          onSubmit={handleSubmit}
          noValidate
          className="bg-[#090312] border-2 border-[#2d123d] shadow-[0_0_30px_rgba(147,51,234,0.15)] p-5 sm:p-8 space-y-8"
        >
          {/* Section 1: Participant Details */}
          <div className="border-b border-[#2d123d] pb-6">
            <h3 className="font-pixel text-lg sm:text-xl text-[#00ffff] tracking-wider mb-4 flex items-center gap-2">
              <span>◆</span>
              <span>Participant Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-silkscreen text-gray-300 mb-1.5">Full Name *</label>
                <input id="name" type="text" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter full name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-silkscreen text-gray-300 mb-1.5">Email *</label>
                <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-silkscreen text-gray-300 mb-1.5">Phone Number *</label>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your mobile number" className={inputClass} />
              </div>
              <div>
                <label htmlFor="college" className="block text-xs font-silkscreen text-gray-300 mb-1.5">College *</label>
                <input id="college" type="text" required value={college} onChange={(e) => setCollege(e.target.value)} placeholder="College / Institution name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="department" className="block text-xs font-silkscreen text-gray-300 mb-1.5">Department *</label>
                <input id="department" type="text" required value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Computer Science and Engineering" className={inputClass} />
              </div>
              <div>
                <label htmlFor="year" className="block text-xs font-silkscreen text-gray-300 mb-1.5">Year</label>
                <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className={`${inputClass} cursor-pointer`}>
                  <option value="">Select</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Select Registration Day */}
          <div className="border-b border-[#2d123d] pb-6">
            <h3 className="font-pixel text-lg sm:text-xl text-[#f472b6] tracking-wider mb-4 flex items-center gap-2">
              <span>◆</span>
              <span>Select Registration Day</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {dayOption('DAY_1', 'day1', 'Day 1', 'Technical Events', 'border-[#00ffff] bg-[#00ffff15] text-white shadow-[0_0_12px_rgba(0,255,255,0.3)]')}
              {dayOption('DAY_2', 'day2', 'Day 2', 'Non-Technical Events', 'border-[#c084fc] bg-[#c084fc15] text-white shadow-[0_0_12px_rgba(192,132,252,0.3)]')}
              {dayOption('BOTH', 'both', 'Both Days', 'Technical + Non-Technical', 'border-[#ff007f] bg-[#ff007f15] text-white shadow-[0_0_12px_rgba(255,0,127,0.3)]')}
              {dayOption('SPECIAL', 'special', 'Special Events', 'Premium events', 'border-[#34d399] bg-[#34d39915] text-white shadow-[0_0_12px_rgba(52,211,153,0.3)]')}
            </div>

            {selectedDay !== 'SPECIAL' && (
              <div id="eventChoices" className="mb-4 space-y-3">
                {eventsError && (
                  <p className="p-3 border border-[#ef4444] bg-[#290a17] text-[#fecaca] text-xs font-body" role="alert">
                    Events are temporarily unavailable. Please try again later.
                  </p>
                )}
                {!eventsError && !eventsReady && (
                  <p className="text-[11px] font-mono text-gray-400">Loading events...</p>
                )}
                {eventsReady &&
                  visibleEventDays.map((day) => (
                    <fieldset key={day} className="p-3 bg-[#11061f] border border-[#3b1752] min-w-0">
                      <legend className="px-1 font-silkscreen text-[11px] text-[#00ffff] uppercase">
                        {day === 'DAY_1' ? 'Day 1 events' : 'Day 2 events'} - pick at least one
                      </legend>
                      {eventsByDay[day].length === 0 ? (
                        <p className="text-[11px] font-mono text-gray-400">No events are currently available for this day.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {eventsByDay[day].map((event) => {
                            const checked = selectedEventIds.includes(event.id);
                            return (
                              <label
                                key={event.id}
                                className={`flex items-center gap-3 p-2.5 border cursor-pointer min-w-0 transition-colors ${
                                  checked ? 'bg-[#00ffff14] border-[#00ffff] text-white' : 'bg-black/40 border-zinc-800 text-gray-400 hover:border-zinc-600'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  name="selected_event"
                                  value={event.id}
                                  data-day={day}
                                  checked={checked}
                                  onChange={() => toggleDayEvent(event.id)}
                                  className="sr-only"
                                />
                                <span className="shrink-0 w-4 h-4 border border-zinc-600 flex items-center justify-center font-bold text-xs bg-black" aria-hidden="true">
                                  {checked ? '✓' : ''}
                                </span>
                                <span className="flex flex-col min-w-0">
                                  <span className="font-pixel text-xs text-white uppercase break-words">
                                    {event.code} · {event.name}
                                  </span>
                                  <span className="text-[10px] font-mono text-gray-400">
                                    {isTeamEvent(event) ? 'Team Event' : 'Solo Event'}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </fieldset>
                  ))}
              </div>
            )}

            {selectedDay === 'SPECIAL' && (
              <div id="specialEvents" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 bg-[#11061f] border border-[#3b1752]">
                {specialEvents.length === 0 && (
                  <p className="text-[11px] font-mono text-gray-400">No special events are available right now.</p>
                )}
                {specialEvents.map((event) => {
                  const checked = selectedSpecialCodes.includes(event.code);
                  return (
                    <label
                      key={event.code}
                      className={`flex items-center gap-3 p-2.5 border cursor-pointer ${
                        checked ? 'bg-[#34d39920] border-[#34d399] text-white' : 'bg-black/40 border-zinc-800 text-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="special_event"
                        value={event.code}
                        checked={checked}
                        onChange={() => toggleSpecialEvent(event.code)}
                        className="sr-only"
                      />
                      <span className="w-4 h-4 border border-zinc-600 flex items-center justify-center font-bold text-xs bg-black" aria-hidden="true">
                        {checked ? '✓' : ''}
                      </span>
                      <span className="flex flex-col">
                        <span className="font-pixel text-xs text-white uppercase flex items-baseline flex-wrap gap-1">
                          <span>{event.name}</span>
                          {(event.code === 'TC' || event.name.toLowerCase().includes('thiruvizha')) && (
                            <span className="text-[10px] text-zinc-400 font-normal font-mono normal-case">
                              (Stalls &amp; Stores)
                            </span>
                          )}
                          {(event.code === 'EP' || event.name.toLowerCase().includes('esport') || event.name.toLowerCase().includes('e-sport')) && (
                            <span className="text-[10px] text-zinc-400 font-normal font-mono normal-case">
                              (Free-Fire)
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {event.description || 'Special event'} • {formatRupees(withGst(Number(event.fee)))}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="bg-[#120621] border border-[#2d123d] p-3.5 sm:p-4">
              <small className="block text-[10px] font-silkscreen text-gray-400 uppercase mb-0.5">Registration Fee</small>
              <div className="font-pixel text-xl sm:text-2xl text-[#38bdf8] font-bold" id="fee">{feeDisplay}</div>
              <small className="block text-[10px] font-mono text-gray-500 mt-0.5">Incl. {GST_PERCENT}% GST</small>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              id="submitBtn"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#9333ea] hover:bg-[#a855f7] border-2 border-[#c084fc] text-white font-pixel text-xs sm:text-sm tracking-wider cursor-pointer shadow-[0_0_15px_rgba(147,51,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-center"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                onNavigateToRegistrations();
              }}
              className="w-full sm:w-auto px-5 py-3.5 bg-black hover:bg-[#1a0a29] border border-zinc-700 hover:border-zinc-400 text-gray-300 hover:text-white font-body text-xs sm:text-sm cursor-pointer transition-colors text-center"
            >
              Already Registered? Check Status
            </button>
          </div>
        </form>
      </main>

      <footer className="w-full bg-[#07020d] border-t border-[#2d123d] py-4 text-center text-gray-500 font-mono text-xs mt-6">
        CyberSentinel CS Symposium • Supabase-backed registration
      </footer>

      {/* Alert type popup showing data verified in database and wait while redirecting to payment */}
      {redirectingInfo && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="redirect-dialog-title"
        >
          <div className="relative w-full max-w-md bg-[#090d16] border-2 border-cyan-500/80 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.35)] p-6 sm:p-7 text-center overflow-hidden">
            {/* Cyber corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-4 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              DATABASE VERIFICATION COMPLETE
            </div>

            {/* Glowing icon */}
            <div className="relative mx-auto my-3 w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
              <ShieldCheck className="w-9 h-9 text-emerald-400 relative z-10" />
            </div>

            <h3 id="redirect-dialog-title" className="font-pixel text-lg sm:text-xl text-white tracking-wide mt-2">
              DATA VERIFIED // CONFIRMED
            </h3>

            <p className="text-cyan-300 font-mono text-xs sm:text-sm mt-2 leading-relaxed">
              Please wait while being redirected to the payment gateway...
            </p>

            {/* Registration Summary Card */}
            <div className="mt-4 bg-[#0e1726] border border-cyan-500/30 rounded-lg p-3 text-left space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center text-gray-400">
                <span>REGISTRATION ID:</span>
                <span className="text-cyan-300 font-bold tracking-wider">{redirectingInfo.regCode}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>PARTICIPANT:</span>
                <span className="text-white font-medium truncate max-w-[200px]">{redirectingInfo.name}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>VERIFIED EMAIL:</span>
                <span className="text-white truncate max-w-[200px]">{redirectingInfo.email}</span>
              </div>
            </div>

            {/* Cyber animated progress bar */}
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
    </div>
  );
};
