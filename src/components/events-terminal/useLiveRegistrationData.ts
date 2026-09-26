import { useEffect, useState } from 'react';
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
};

export function specialEventCodeFor(id: string): string | undefined {
  return SPECIAL_EVENT_CODES[id];
}

export function findSpecialEvent(specialEvents: SpecialEvent[], id: string): SpecialEvent | undefined {
  const code = specialEventCodeFor(id);
  return code ? specialEvents.find((event) => event.code === code) : undefined;
}

export function formatRupees(amount: number): string {
  return `₹${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

/** Live fee label for a special-event catalog card, or null until loaded / unmapped. */
export function liveSpecialFeeLabel(specialEvents: SpecialEvent[], eventId: string): string | null {
  const special = findSpecialEvent(specialEvents, eventId);
  return special ? formatRupees(Number(special.fee)) : null;
}
