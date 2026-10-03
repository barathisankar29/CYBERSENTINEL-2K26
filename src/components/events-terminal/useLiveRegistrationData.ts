import { useEffect, useState } from 'react';
import { TEST_REGISTRATION_FEE } from '@/config/registrationTestFee';
import {
  getRegistrationFees,
  getSpecialEvents,
  type RegistrationFees,
  type SpecialEvent,
} from '@/services/registration';

/**
 * Live pricing from the Supabase backend (get-registration-fees +
 * rpc/get_special_events), shared by every terminal screen so the pack
 * cards, the portal and the event cards can never disagree with what
 * public-register will actually charge. The terminal's own catalog prices
 * are display copy only and are never used for money.
 */
export interface LiveRegistrationData {
  fees: RegistrationFees | null;
  specialEvents: SpecialEvent[];
  loading: boolean;
  error: string | null;
}

let cache: Promise<{ fees: RegistrationFees; specialEvents: SpecialEvent[] }> | null = null;

function load() {
  if (!cache) {
    cache = Promise.all([getRegistrationFees(), getSpecialEvents()]).then(([fees, specialEvents]) => ({
      fees,
      specialEvents,
    }));
    // Allow a retry on the next mount if this attempt fails.
    cache.catch(() => {
      cache = null;
    });
  }
  return cache;
}

export function useLiveRegistrationData(): LiveRegistrationData {
  const [state, setState] = useState<LiveRegistrationData>({
    fees: null,
    specialEvents: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    load()
      .then(({ fees, specialEvents }) => {
        if (!cancelled) setState({ fees, specialEvents, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setState({
            fees: null,
            specialEvents: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Registration fees are temporarily unavailable.',
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Terminal catalog / pack ids -> backend special_events.code. The backend
 * is the source of truth for which special events exist and what they
 * cost; this only links the terminal's cards to those rows.
 */
const SPECIAL_EVENT_CODES: Record<string, string> = {
  group_dance: 'GD',
  'dacre-dance': 'GD',
  thiruvizha_corner: 'TC',
  'dacre-thiruvizha': 'TC',
  e_sports: 'EP',
  'dacre-esports': 'EP',
};

export function specialEventCodeFor(id: string): string | undefined {
  return SPECIAL_EVENT_CODES[id];
}

export function findSpecialEvent(specialEvents: SpecialEvent[], id: string): SpecialEvent | undefined {
  const code = specialEventCodeFor(id);
  return code ? specialEvents.find((event) => event.code === code) : undefined;
}

/**
 * Customer-facing prices. The backend stores and charges BASE fees
 * (registration_fees, special_events.fee) and the college payment process
 * adds 18% GST and rounds UP to the rupee (observed: base 590 -> 696.20 ->
 * charged 697). The site mirrors that exactly, on the same total the
 * payment process receives as registration_fee:
 *   one day 170 -> 201, both days 340 -> 402,
 *   special 500 -> 590, special 589.83 -> 696.
 * Display only — every payload keeps sending the backend's base amount.
 */
export const GST_PERCENT = 18;

/** A base amount as the payment process charges it: +18% GST (to the paisa), rounded up to the rupee. */
export function withGst(base: number): number {
  // TEMPORARY: while a test price is set, it is what the payment process receives.
  const charged = TEST_REGISTRATION_FEE ?? Number(base);
  const gstPaise = Math.round((Math.round(charged * 100) * (100 + GST_PERCENT)) / 100);
  return Math.ceil(gstPaise / 100);
}

/** Display price for a day registration — GST on the same base total public-register charges. */
export function dayDisplayPrice(fees: RegistrationFees, day: 'DAY_1' | 'DAY_2' | 'BOTH'): number {
  return withGst(day === 'BOTH' ? fees.DAY_1 + fees.DAY_2 : fees[day]);
}

/** Display price for a set of special events — GST on their summed base fees, as charged. */
export function specialDisplayPrice(events: { fee: number }[]): number {
  return withGst(events.reduce((sum, event) => sum + Number(event.fee || 0), 0));
}

export function formatRupees(amount: number): string {
  return `₹${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

/** Live fee label for a special-event catalog card, or null until loaded / unmapped. */
export function liveSpecialFeeLabel(specialEvents: SpecialEvent[], eventId: string): string | null {
  const special = findSpecialEvent(specialEvents, eventId);
  if (!special) return null;
  const label = formatRupees(withGst(Number(special.fee)));
  // E-Sports is registered (and charged) per team.
  return specialEventCodeFor(eventId) === 'EP' ? `${label} / TEAM` : label;
}
