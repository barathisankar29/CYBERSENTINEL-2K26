import React, { useState } from 'react';
import type { CharacterId } from '@/types/characterProfile';
import { characterProfiles } from '@/data/characterProfiles';
import { saveLastRegistration, submitRegistration, type RegistrationDay } from '@/services/registration';
import { recordBackendRegistration } from '@/utils/eventRegistration';
import { sound } from './sound';
import { formatRupees, useLiveRegistrationData } from './useLiveRegistrationData';

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

/** Matches the public-register Edge Function's limit. */
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

/**
 * Full-screen registration portal from the events-terminal design, submitting
 * to the backend team's `public-register` Supabase Edge Function. Fields,
 * client checks and payload are exactly those of their reference client
 * (register2/registration/index.html); the Edge Function does all
 * authoritative validation (duplicates, UTR reuse, fee calculation).
 */
export const RegistrationPortalPage: React.FC<RegistrationPortalPageProps> = ({
  initialData,
  onClose,
  onNavigateToRegistrations
}) => {
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
    initialData?.dayType === 'SPECIAL' ? initialData.specialEventCodes ?? [] : []
  );

  // Payment fields
  const [utr, setUtr] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Alert & submission state
  const [alertInfo, setAlertInfo] = useState<{ type: 'error' | 'success'; message: string; regId?: string } | null>(null);
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

  // Fee from the backend's own fee tables — the same numbers public-register charges.
  const getFeeAmount = (): number | null => {
    if (selectedDay === 'SPECIAL') {
      if (!specialEvents.length) return null;
      return specialEvents
        .filter((event) => selectedSpecialCodes.includes(event.code))
        .reduce((sum, event) => sum + Number(event.fee || 0), 0);
    }
    if (!fees) return null;
    if (selectedDay === 'BOTH') return fees.DAY_1 + fees.DAY_2;
    return fees[selectedDay];
  };
  const feeAmount = getFeeAmount();
  const feeDisplay = feeAmount === null ? '—' : formatRupees(feeAmount);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScreenshotFile(e.target.files?.[0] ?? null);
  };

  const toggleSpecialEvent = (code: string) => {
    setSelectedSpecialCodes((prev) => (prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]));
  };

  const showError = (message: string) => {
    sound.playError();
    setAlertInfo({ type: 'error', message });
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
    if (selectedDay === 'SPECIAL' && selectedSpecialCodes.length === 0)
      return showError('Please select at least one Special Event to register.');
    if (!utr.trim()) return showError('UTR / Transaction ID is required for payment verification.');
    if (!screenshotFile) return showError('Please upload your UPI Payment Screenshot.');
    if (screenshotFile.size > MAX_SCREENSHOT_BYTES) return showError('Payment screenshot must be 5 MB or smaller.');

    setIsSubmitting(true);
    setAlertInfo(null);
    try {
      const result = await submitRegistration({
        name: fullName,
        email,
        phone,
        college,
        department,
        year,
        utr,
        selectedDay,
        specialEventCodes: selectedDay === 'SPECIAL' ? selectedSpecialCodes : [],
        paymentScreenshot: screenshotFile
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
            : fromPack && initialData?.selectedEvents?.length
              ? initialData.selectedEvents.map((ev) => ev.name)
              : character.packs[0]?.events ?? [];
        recordBackendRegistration(
          characterId,
          {
            id: `${characterId}-${selectedDay.toLowerCase()}`,
            label: (fromPack && initialData?.packLabel) || selectedDay.replace('_', ' '),
            price: feeAmount ?? 0,
            events: eventNames
          },
          result.registration_code,
          fullName.trim(),
          email.trim()
        );
      }

      sound.playSuccess();
      setAlertInfo({
        type: 'success',
        message: `Registration submitted successfully. Registration ID: ${result.registration_code}. Payment status: ${result.status}. You will receive your final QR after payment verification.`,
        regId: result.registration_code
      });

      // Reset like the reference client does after a successful submit.
      setFullName('');
      setEmail('');
      setPhone('');
      setCollege('');
      setDepartment('');
      setYear('');
      setUtr('');
      setScreenshotFile(null);
      setFileInputKey((key) => key + 1);
    } catch (error) {
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
      <header className="w-full bg-[#0a0314] border-b-2 border-[#2d123d] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#9333ea] border border-[#c084fc] flex items-center justify-center font-silkscreen text-white font-bold text-sm shadow-[0_0_10px_rgba(147,51,234,0.5)]">
            CS
          </div>
          <span className="font-pixel text-lg sm:text-xl text-white tracking-wider">CyberSentinel</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block px-3 py-1 bg-[#1a082b] border border-[#a855f7] text-[#c084fc] font-silkscreen text-[11px] tracking-wider uppercase">
            Participant Registration
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onClose();
            }}
            className="px-3 py-1 bg-black border border-zinc-700 hover:border-[#ff007f] text-gray-300 hover:text-white font-mono text-xs cursor-pointer transition-colors"
            title="Return to Event Matrix"
          >
            [✕ CLOSE]
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
            Select your symposium day, make the official UPI payment, enter the UTR and upload your payment screenshot. You receive your final QR only after payment verification.
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
                        type="checkbox"
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
                        <span className="font-pixel text-xs text-white uppercase">{event.name}</span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {event.description || 'Special event'} • {formatRupees(Number(event.fee))}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="bg-[#120621] border border-[#2d123d] p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border-b sm:border-b-0 sm:border-r border-[#2d123d] pb-2 sm:pb-0 sm:pr-3">
                <small className="block text-[10px] font-silkscreen text-gray-400 uppercase mb-0.5">Registration Fee</small>
                <div className="font-pixel text-xl sm:text-2xl text-[#38bdf8] font-bold" id="fee">{feeDisplay}</div>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r border-[#2d123d] pb-2 sm:pb-0 sm:pr-3">
                <small className="block text-[10px] font-silkscreen text-gray-400 uppercase mb-0.5">Payment</small>
                <strong className="block text-sm sm:text-base font-body text-white">Official UPI QR</strong>
              </div>
              <div>
                <small className="block text-[10px] font-silkscreen text-gray-400 uppercase mb-0.5">QR</small>
                <strong className="block text-sm sm:text-base font-body text-[#34d399]">After verification</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Payment */}
          <div className="border-b border-[#2d123d] pb-6">
            <h3 className="font-pixel text-lg sm:text-xl text-[#38bdf8] tracking-wider mb-4 flex items-center gap-2">
              <span>◆</span>
              <span>Payment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <span className="block text-xs font-silkscreen text-gray-300 mb-1.5">Official College Payment QR</span>
                {/* TODO: official UPI QR image — the backend package ships only a placeholder here too. */}
                <div className="bg-[#11061f] border border-[#3b1752] p-4 flex flex-col items-center justify-center text-center">
                  <div
                    className="w-32 h-32 bg-black border-2 border-[#9333ea] flex items-center justify-center text-[#c084fc] font-mono select-none shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    style={{ fontSize: '70px', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    ▦
                  </div>
                  <p className="text-gray-400 text-[11px] font-body mt-3">Official UPI payment QR will be shown here.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="utr" className="block text-xs font-silkscreen text-gray-300 mb-1.5">UTR / Transaction ID *</label>
                  <input id="utr" type="text" required value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="e.g. 324109842101" className={`${inputClass} font-mono`} />
                  <p className="text-gray-400 text-[10px] font-body mt-1">Enter the exact UTR shown in your UPI/bank app.</p>
                </div>

                <div>
                  <label htmlFor="paymentScreenshot" className="block text-xs font-silkscreen text-gray-300 mb-1.5">Payment Screenshot *</label>
                  <input
                    key={fileInputKey}
                    id="paymentScreenshot"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleScreenshotChange}
                    className="w-full bg-[#11061f] border border-[#3b1752] focus:border-[#00ffff] text-white px-3 py-2 text-xs outline-none file:mr-3 file:py-1 file:px-3 file:border file:border-[#ff007f] file:bg-[#ff007f20] file:text-[#ff007f] file:font-pixel file:text-xs cursor-pointer"
                  />
                  <p className="text-gray-400 text-[10px] font-body mt-1">
                    Maximum size: 5 MB. The screenshot is stored privately for payment verification.
                  </p>
                  {screenshotFile && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#34d399]">✓ File attached:</span>
                      <span className="text-[10px] font-mono text-gray-300 truncate max-w-xs">{screenshotFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
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
    </div>
  );
};
