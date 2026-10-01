import React, { useState, useEffect } from 'react';
import type { EventSpec } from '@/types/eventsTerminal';
import { sound } from './sound';
import type { RegistrationPortalInitialData } from './RegistrationPortalPage';
import {
  findSpecialEvent,
  formatRupees,
  specialEventCodeFor,
  useLiveRegistrationData,
  type LiveRegistrationData
} from './useLiveRegistrationData';

interface EventItem {
  id: string;
  name: string;
  day?: string;
  protocol?: string;
  originalEventId?: string;
}

interface CharacterConfig {
  name: string;
  displayName: React.ReactNode;
  tag: string;
  avatar: string;
  accentColor: string;
  borderColor: string;
  accessLevel: string;
  events: EventItem[];
  /** registrations.selected_day this pack submits as */
  dayType: 'DAY_1' | 'DAY_2' | 'BOTH' | 'SPECIAL';
  isPerEventPricing?: boolean;
}

const PACK_CONFIGS: Record<string, CharacterConfig> = {
  NICO: {
    name: 'NICO',
    displayName: 'NICO',
    tag: '[DAY 1]',
    avatar: '/assets/events-terminal/avatar-nico.webp',
    accentColor: '#38bdf8',
    borderColor: '#0284c7',
    accessLevel: 'REGISTER FOR DAY 1',
    dayType: 'DAY_1',
    events: [
      { id: 'nico-1', name: 'Paper Presentation', day: 'DAY 1', originalEventId: 'paper_presentation' },
      { id: 'nico-2', name: 'Cipher Coding', day: 'DAY 1', originalEventId: 'cypher_coding' },
      { id: 'nico-3', name: 'Unsaid', day: 'DAY 1', originalEventId: 'unsaid' },
      { id: 'nico-4', name: 'Weblica', day: 'DAY 1', originalEventId: 'weblica' },
      { id: 'nico-5', name: 'XCoders', day: 'DAY 1', originalEventId: 'x_coders' }
    ]
  },
  RUELLE: {
    name: 'RUELLE',
    displayName: 'RUELLE',
    tag: '[DAY2]',
    avatar: '/assets/events-terminal/avatar-ruelle.webp',
    accentColor: '#c084fc',
    borderColor: '#7c3aed',
    accessLevel: 'REGISTER FOR DAY 2',
    dayType: 'DAY_2',
    events: [
      { id: 'ruelle-1', name: 'Connections', day: 'DAY 2', originalEventId: 'connections' },
      { id: 'ruelle-2', name: 'Find the BGM', day: 'DAY 2', originalEventId: 'bgm' },
      { id: 'ruelle-3', name: 'Lost in Lyrics', day: 'DAY 2', originalEventId: 'lyrics' },
      { id: 'ruelle-4', name: 'Mixed Signals', day: 'DAY 2', originalEventId: 'mixed_signals' },
      { id: 'ruelle-5', name: 'Spotlight', day: 'DAY 2', originalEventId: 'talent_show' },
      { id: 'ruelle-6', name: 'E-Sports', day: 'DAY 2', originalEventId: 'e_sports' }
    ]
  },
  'DR. DACRE': {
    name: 'DR. DACRE',
    displayName: (
      <span className="flex items-baseline whitespace-nowrap">
        <span>DR.</span>
        <span className="ml-1 sm:ml-1.5">DACRE</span>
      </span>
    ),
    tag: '[SPECIAL PROTOCOLS]',
    avatar: '/assets/events-terminal/avatar-dacre.webp',
    accentColor: '#34d399',
    borderColor: '#059669',
    accessLevel: 'SPECIFIC EVENTS REGISTRATION',
    dayType: 'SPECIAL',
    isPerEventPricing: true,
    events: [
      { id: 'dacre-dance', name: 'Group Dance', protocol: 'PROTOCOL_A', originalEventId: 'group_dance' },
      { id: 'dacre-thiruvizha', name: 'Thiruvizha Corner', protocol: 'PROTOCOL_B', originalEventId: 'thiruvizha_corner' }
    ]
  },
  COSMA: {
    name: 'COSMA',
    displayName: 'COSMA',
    tag: '[ULTIMATE COMBO PASS]',
    avatar: '/assets/events-terminal/avatar-cosma.webp',
    accentColor: '#fbbf24',
    borderColor: '#d97706',
    accessLevel: 'DAY 1 + DAY 2 (ALL ACCESS)',
    dayType: 'BOTH',
    events: [
      { id: 'cosma-1', name: 'Paper Presentation', day: 'DAY 1', originalEventId: 'paper_presentation' },
      { id: 'cosma-2', name: 'Cipher Coding', day: 'DAY 1', originalEventId: 'cypher_coding' },
      { id: 'cosma-3', name: 'Unsaid', day: 'DAY 1', originalEventId: 'unsaid' },
      { id: 'cosma-4', name: 'Weblica', day: 'DAY 1', originalEventId: 'weblica' },
      { id: 'cosma-5', name: 'XCoders', day: 'DAY 1', originalEventId: 'x_coders' },
      { id: 'cosma-6', name: 'Connections', day: 'DAY 2', originalEventId: 'connections' },
      { id: 'cosma-7', name: 'Find the BGM', day: 'DAY 2', originalEventId: 'bgm' },
      { id: 'cosma-8', name: 'Lost in Lyrics', day: 'DAY 2', originalEventId: 'lyrics' },
      { id: 'cosma-9', name: 'Mixed Signals', day: 'DAY 2', originalEventId: 'mixed_signals' },
      { id: 'cosma-10', name: 'Spotlight', day: 'DAY 2', originalEventId: 'talent_show' },
      { id: 'cosma-11', name: 'E-Sports', day: 'DAY 2', originalEventId: 'e_sports' }
    ]
  }
};

/**
 * Live price for a pack, from the backend. Day packs are the per-day
 * registration fee (the same fee whichever of that day's events are
 * chosen); Dr. Dacre is the sum of the
 * selected special events. Null until the backend has answered.
 */
function livePackPrice(config: CharacterConfig, live: LiveRegistrationData, selectedIds?: string[]): number | null {
  if (config.isPerEventPricing) {
    const chosen = config.events.filter((e) => !selectedIds || selectedIds.includes(e.id));
    const prices = chosen.map((e) => findSpecialEvent(live.specialEvents, e.id)?.fee);
    if (!live.specialEvents.length || prices.some((p) => p === undefined)) return null;
    return prices.reduce<number>((sum, p) => sum + Number(p), 0);
  }
  if (!live.fees) return null;
  if (config.dayType === 'BOTH') return live.fees.DAY_1 + live.fees.DAY_2;
  return config.dayType === 'DAY_1' ? live.fees.DAY_1 : live.fees.DAY_2;
}

function priceLabel(amount: number | null): string {
  return amount === null ? '—' : formatRupees(amount);
}

interface ActiveModalState {
  characterKey: string;
  plan: string;
  protocol?: string;
  selectedEventIds: string[];
}

interface RegisterModalProps {
  event?: EventSpec | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToPortal: (data: RegistrationPortalInitialData) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  event,
  isOpen,
  onClose,
  onProceedToPortal
}) => {
  const [modalState, setModalState] = useState<ActiveModalState | null>(null);
  const live = useLiveRegistrationData();
  const cardPrice = (key: string, selectedIds?: string[]) =>
    priceLabel(livePackPrice(PACK_CONFIGS[key], live, selectedIds));

  // Determine recommended pack based on selected event
  const recommendedPack = React.useMemo(() => {
    if (!event) return null;
    if (event.id === 'group_dance' || event.id === 'thiruvizha_corner') return 'DR. DACRE';
    if (event.day === 1) return 'NICO';
    if (event.day === 2) return 'RUELLE';
    return 'COSMA';
  }, [event]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modalState) {
          setModalState(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, modalState, onClose]);

  // Keep the site mascot out of the way while a pack popup is open. An
  // attribute on <html> (not a body:has() rule, which re-checks the whole
  // page on every style change).
  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.setAttribute('data-mascot-hidden', '');
    return () => document.documentElement.removeAttribute('data-mascot-hidden');
  }, [isOpen]);

  // Lock body scroll to prevent duplicate background scrollbars
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenRegister = (
    characterKey: string,
    plan: string,
    protocol?: string,
    initialEventId?: string
  ) => {
    sound.playNavClick();
    const config = PACK_CONFIGS[characterKey];
    if (!config) return;

    // The event the visitor came from (event page REGISTER), if this pack has it.
    const fromEvent = event
      ? config.events.find(
          (e) => e.originalEventId === event.id || e.name.toLowerCase() === event.title.toLowerCase()
        )
      : undefined;

    let initialSelected: string[] = [];
    if (!config.isPerEventPricing) {
      // Day passes charge the day fee; the ticked events become the
      // registration's selected events (public-register selected_event_ids).
      // Coming from an event page, start with just that event.
      initialSelected = fromEvent ? [fromEvent.id] : config.events.map((e) => e.id);
    } else if (initialEventId) {
      initialSelected = [initialEventId];
    } else {
      // If user came with a specific event, try to find matching event in this pack
      if (event) {
        const matched = config.events.find(
          (e) =>
            e.originalEventId === event.id ||
            e.name.toLowerCase() === event.title.toLowerCase()
        );
        if (matched && characterKey === 'DR. DACRE') {
          initialSelected = [matched.id];
        } else {
          initialSelected = config.events.map((e) => e.id);
        }
      } else {
        initialSelected = config.events.map((e) => e.id);
      }
    }

    setModalState({
      characterKey,
      plan,
      protocol,
      selectedEventIds: initialSelected
    });
  };

  const closeSubModal = () => {
    sound.playNavClick();
    setModalState(null);
  };

  // Every pack's checklist is selectable. Day passes keep their fixed day fee;
  // the ticked events are carried into the registration form, where they are
  // matched to the backend's active events and submitted as the selection.
  const toggleEvent = (eventId: string) => {
    if (!modalState) return;
    sound.playBlip();
    setModalState((prev) => {
      if (!prev) return null;
      const isSelected = prev.selectedEventIds.includes(eventId);
      const nextSelected = isSelected
        ? prev.selectedEventIds.filter((id) => id !== eventId)
        : [...prev.selectedEventIds, eventId];
      return {
        ...prev,
        selectedEventIds: nextSelected
      };
    });
  };

  const selectAll = () => {
    sound.playBlip();
    if (!modalState) return;
    const config = PACK_CONFIGS[modalState.characterKey];
    if (!config) return;
    setModalState((prev) => (prev ? { ...prev, selectedEventIds: config.events.map((e) => e.id) } : null));
  };

  const clearAll = () => {
    sound.playBlip();
    if (!modalState) return;
    setModalState((prev) => (prev ? { ...prev, selectedEventIds: [] } : null));
  };

  const getComputedPrice = (state: ActiveModalState) => {
    const config = PACK_CONFIGS[state.characterKey];
    return config ? priceLabel(livePackPrice(config, live, state.selectedEventIds)) : '—';
  };

  const handleProceedRegistration = () => {
    if (!modalState) return;
    const config = PACK_CONFIGS[modalState.characterKey];
    if (!config || modalState.selectedEventIds.length === 0) return;

    const chosenEvents = config.events.filter((e) => modalState.selectedEventIds.includes(e.id));
    sound.playNavClick();
    onProceedToPortal({
      dayType: config.dayType,
      characterKey: modalState.characterKey,
      packLabel: modalState.plan,
      specialEventCodes:
        config.dayType === 'SPECIAL'
          ? chosenEvents.map((e) => specialEventCodeFor(e.id)).filter((code): code is string => Boolean(code))
          : [],
      selectedEvents: chosenEvents.map((e) => ({ id: e.id, name: e.name, day: e.day, protocol: e.protocol }))
    });
    setModalState(null);
    onClose();
  };

  const activeConfig = modalState ? PACK_CONFIGS[modalState.characterKey] : null;

  return (
    <>
      {/* ================= CHOOSE YOUR PLAYER OVERLAY ================= */}
      {!modalState && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs p-3 sm:p-5 md:p-6 overflow-y-auto select-none flex justify-center items-start sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          data-purpose="registration-terminal-modal-overlay"
        >
          {/* Outer Chassis Container - single unified page flow */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose your player"
            className="relative bg-black border-2 border-zinc-800 p-3 sm:p-5 retro-grid-bg w-full max-w-7xl mx-auto my-auto shadow-2xl flex flex-col gap-4"
            data-purpose="registration-terminal-chassis"
          >
            {/* Top Terminal Bar with Close in left upper corner */}
            <div className="flex items-center justify-start border-b border-zinc-800 pb-2 text-[10px] font-silkscreen text-zinc-400">
              <button
                onClick={() => {
                  sound.playNavClick();
                  onClose();
                }}
                className="text-zinc-400 hover:text-[#db2777] px-2.5 py-1 border border-zinc-800 hover:border-[#db2777] bg-black cursor-pointer font-arcade text-xs flex items-center gap-1.5 transition-colors"
                title="Close [ESC]"
              >
                <span>[✕]</span>
                <span>CLOSE</span>
              </button>
            </div>

            {/* Header Title Strip in toned-down rose border box */}
            <section
              className="border-2 border-[#db2777]/80 bg-[#0c0612] p-3 sm:p-4 flex items-center justify-center shadow-[0_0_12px_rgba(219,39,119,0.2)]"
              data-purpose="window-header-strip"
            >
              <h1 className="font-arcade text-base sm:text-xl md:text-2xl text-[#f472b6] text-center tracking-wider uppercase font-extrabold">
                CHOOSE YOUR PLAYER
              </h1>
            </section>

            {/* 4-Column Pack Cards Grid */}
            <section
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
              data-purpose="registration-packs-grid"
            >
          {/* ================= CARD 1: NICO (DAY 1 PASS) ================= */}
          <article
            className={`flex flex-col justify-between bg-[#0a0a0e] border-2 p-3 sm:p-4 relative transition-all shadow-[0_0_10px_rgba(0,212,255,0.25)] ${
              recommendedPack === 'NICO'
                ? 'ring-2 ring-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.6)]'
                : ''
            }`}
            data-purpose="pack-card-nico"
            style={{ borderColor: '#00d4ff' }}
          >
            {recommendedPack === 'NICO' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00d4ff] text-black font-arcade text-[8px] px-2 py-0.5 font-bold uppercase shadow-sm">
                ★ RECOMMENDED ★
              </div>
            )}
            {/* Card Header Ribbon */}
            <div className="border-b-2 border-[#00d4ff]/40 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 border-2 border-[#00d4ff] bg-black p-0.5 shrink-0 shadow-[0_0_8px_rgba(0,212,255,0.4)] overflow-hidden">
                  <img
                    alt="Pixel art portrait of Nico, hacker operator"
                    className="w-full h-full object-cover pixel-art block"
                    src="/assets/events-terminal/avatar-nico.webp"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-arcade text-base sm:text-lg text-[#00d4ff] tracking-tight">NICO</span>
                  <span className="inline-block bg-[#00d4ff]/20 text-[#00d4ff] text-[9px] font-arcade px-1.5 py-0.5 border border-[#00d4ff]/40 mt-1 uppercase w-fit">
                    [DAY 1]
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-arcade text-zinc-400">ACCESS LEVEL:</div>
                <div className="text-xs font-arcade text-[#00d4ff] font-bold mt-0.5">REGISTER FOR DAY 1</div>
              </div>
            </div>

            {/* Included Events List */}
            <div className="grow space-y-2 py-1">
              <div className="text-[9px] font-arcade text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
                <span>PROTOCOL INCLUSIONS</span>
                <span>(5 EVENTS)</span>
              </div>
              <ul className="space-y-1.5 font-vt text-base tracking-wide text-zinc-200">
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#00d4ff]">
                  <span className="text-[#00d4ff] font-arcade text-[9px]">01</span>
                  <span>Paper Presentation</span>
                </li>
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#00d4ff]">
                  <span className="text-[#00d4ff] font-arcade text-[9px]">02</span>
                  <span>Cypher Coding</span>
                </li>
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#00d4ff]">
                  <span className="text-[#00d4ff] font-arcade text-[9px]">03</span>
                  <span>Unsaid</span>
                </li>
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#00d4ff]">
                  <span className="text-[#00d4ff] font-arcade text-[9px]">04</span>
                  <span>Weblica</span>
                </li>
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#00d4ff]">
                  <span className="text-[#00d4ff] font-arcade text-[9px]">05</span>
                  <span>X-Coders</span>
                </li>
              </ul>
            </div>

            {/* Pricing & CTA */}
            <div className="mt-4 pt-3 border-t-2 border-zinc-800">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-vt text-sm text-zinc-400 uppercase">PACK BUNDLE ACCESS</span>
                <span className="font-arcade text-lg sm:text-xl text-[#00d4ff]">{cardPrice('NICO')}</span>
              </div>
              <button
                onClick={() => handleOpenRegister('NICO', 'DAY 1 ACCESS')}
                className="w-full py-2.5 px-2 bg-black border-2 border-[#00d4ff] text-[#00d4ff] font-arcade text-[10px] sm:text-[11px] tracking-tighter hover:bg-[#00d4ff] hover:text-black transition-none active:translate-y-0.5 shadow-[0_0_8px_rgba(0,212,255,0.3)] flex items-center justify-center gap-1 cursor-pointer"
                type="button"
              >
                <span>&gt;&gt;</span>
                <span>REGISTER DAY 1</span>
                <span>&lt;&lt;</span>
              </button>
            </div>
          </article>

          {/* ================= CARD 2: RUELLE (DAY 2 PASS) ================= */}
          <article
            className={`flex flex-col justify-between bg-[#0a0a0e] border-2 border-[#b026ff] p-3 sm:p-4 relative transition-all shadow-[0_0_10px_rgba(176,38,255,0.3)] ${
              recommendedPack === 'RUELLE'
                ? 'ring-2 ring-[#b026ff] shadow-[0_0_20px_rgba(176,38,255,0.6)]'
                : ''
            }`}
            data-purpose="pack-card-ruelle"
          >
            {recommendedPack === 'RUELLE' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b026ff] text-black font-arcade text-[8px] px-2 py-0.5 font-bold uppercase shadow-sm">
                ★ RECOMMENDED ★
              </div>
            )}
            {/* Card Header Ribbon */}
            <div className="border-b-2 border-[#b026ff]/40 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 border-2 border-[#b026ff] bg-black p-0.5 shrink-0 shadow-[0_0_8px_rgba(176,38,255,0.4)] overflow-hidden">
                  <img
                    alt="Pixel art portrait of Ruelle, cyber specialist"
                    className="w-full h-full object-cover pixel-art block"
                    src="/assets/events-terminal/avatar-ruelle.webp"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-arcade text-base sm:text-lg text-[#b026ff] tracking-tight">RUELLE</span>
                  <span className="inline-block bg-[#b026ff]/20 text-[#b026ff] text-[9px] font-arcade px-1.5 py-0.5 border border-[#b026ff]/40 mt-1 uppercase w-fit">
                    [DAY2]
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-arcade text-zinc-400">ACCESS LEVEL:</div>
                <div className="text-xs font-arcade text-[#b026ff] font-bold mt-0.5">REGISTER FOR DAY 2</div>
              </div>
            </div>

            {/* Included Events List */}
            <div className="grow space-y-2 py-1">
              <div className="text-[9px] font-arcade text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
                <span>PROTOCOL INCLUSIONS</span>
                <span>(5 EVENTS)</span>
              </div>
              <ul className="space-y-1.5 font-vt text-base tracking-wide text-zinc-200">
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#b026ff]">
                  <span className="text-[#b026ff] font-arcade text-[9px]">01</span>
                  <span>Connections</span>
                </li>
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#b026ff]">
                  <span className="text-[#b026ff] font-arcade text-[9px]">02</span>
                  <span>BGM</span>
                </li>
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#b026ff]">
                  <span className="text-[#b026ff] font-arcade text-[9px]">03</span>
                  <span>Lyrics</span>
                </li>
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#b026ff]">
                  <span className="text-[#b026ff] font-arcade text-[9px]">04</span>
                  <span>Mixed Signal</span>
                </li>
                <li className="flex items-center gap-1.5 bg-black/60 p-1 border-l-2 border-[#b026ff]">
                  <span className="text-[#b026ff] font-arcade text-[9px]">05</span>
                  <span>Talent Show</span>
                </li>
              </ul>
            </div>

            {/* Pricing & CTA */}
            <div className="mt-4 pt-3 border-t-2 border-zinc-800">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-vt text-sm text-zinc-400 uppercase">PACK BUNDLE ACCESS</span>
                <span className="font-arcade text-lg sm:text-xl text-[#b026ff]">{cardPrice('RUELLE')}</span>
              </div>
              <button
                onClick={() => handleOpenRegister('RUELLE', 'DAY 2 ACCESS')}
                className="w-full py-2.5 px-2 bg-black border-2 border-[#b026ff] text-[#b026ff] font-arcade text-[10px] sm:text-[11px] tracking-tighter hover:bg-[#b026ff] hover:text-black transition-none active:translate-y-0.5 shadow-[0_0_8px_rgba(176,38,255,0.3)] flex items-center justify-center gap-1 cursor-pointer"
                type="button"
              >
                <span>&gt;&gt;</span>
                <span>REGISTER DAY 2</span>
                <span>&lt;&lt;</span>
              </button>
            </div>
          </article>

          {/* ================= CARD 3: DR. DACRE (SPECIFIC EVENTS) ================= */}
          <article
            className={`flex flex-col justify-between bg-[#0a0a0e] border-2 p-3 sm:p-4 relative transition-all ${
              recommendedPack === 'DR. DACRE'
                ? 'ring-2 ring-[#00ffcc] shadow-[0_0_20px_rgba(0,255,204,0.6)]'
                : ''
            }`}
            data-purpose="pack-card-dr-dacre"
            style={{ borderColor: 'rgb(0, 255, 204)', boxShadow: 'rgba(0, 255, 204, 0.35) 0px 0px 12px' }}
          >
            {recommendedPack === 'DR. DACRE' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ffcc] text-black font-arcade text-[8px] px-2 py-0.5 font-bold uppercase shadow-sm">
                ★ RECOMMENDED ★
              </div>
            )}
            {/* Card Header Ribbon */}
            <div className="border-b-2 pb-3 mb-2" style={{ borderColor: 'rgba(0, 255, 204, 0.4)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 border-2 bg-black p-0.5 shrink-0 overflow-hidden"
                  style={{ borderColor: '#00ffcc', boxShadow: '0 0 8px rgba(0, 255, 204, 0.5)' }}
                >
                  <img
                    alt="Pixel art portrait of Dr. Dacre"
                    className="w-full h-full object-cover pixel-art block"
                    src="/assets/events-terminal/avatar-dacre.webp"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span
                    className="font-arcade text-base sm:text-lg tracking-tight flex items-baseline whitespace-nowrap"
                    style={{ color: '#00ffcc' }}
                  >
                    <span>DR.</span>
                    <span className="ml-1 sm:ml-1.5">DACRE</span>
                  </span>
                  <span
                    className="inline-block text-[8px] sm:text-[9px] font-arcade px-1 py-0.5 border mt-1 uppercase w-fit"
                    style={{
                      backgroundColor: 'rgba(0, 255, 204, 0.15)',
                      color: '#00ffcc',
                      borderColor: 'rgba(0, 255, 204, 0.5)'
                    }}
                  >
                    [SPECIAL PROTOCOLS]
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-arcade text-zinc-400">ACCESS LEVEL:</div>
                <div className="text-xs font-arcade font-bold mt-0.5" style={{ color: '#00ffcc' }}>
                  SPECIFIC EVENTS REGISTRATION
                </div>
              </div>
            </div>

            {/* Two Sub-Event Registration Panels */}
            <div className="grow flex flex-col justify-around gap-2.5 py-1">
              {/* Sub-Card A: Group Dance */}
              <div
                className="bg-black border p-2 relative flex flex-col justify-between"
                data-purpose="sub-event-group-dance"
                style={{ borderColor: 'rgba(0, 255, 204, 0.5)' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-arcade block" style={{ color: 'rgba(0, 255, 204, 0.7)' }}>
                      PROTOCOL_A
                    </span>
                    <span className="font-pixel text-xs sm:text-sm text-white font-bold">Group Dance</span>
                  </div>
                  <div className="text-right">
                    <span className="font-arcade text-xs" style={{ color: '#00ffcc' }}>
                      {cardPrice('DR. DACRE', ['dacre-dance'])}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenRegister('DR. DACRE', 'GROUP DANCE', 'PROTOCOL_A', 'dacre-dance')}
                  className="mt-2 w-full py-1.5 px-1 bg-zinc-950 border border-[#00ffcc] text-[#00ffcc] font-arcade text-[8px] sm:text-[9px] transition-none active:translate-y-0.5 cursor-pointer hover:bg-[#00ffcc] hover:text-black"
                  type="button"
                >
                  &gt;&gt; REGISTER GROUP DANCE &lt;&lt;
                </button>
              </div>

              {/* Sub-Card B: Thiruvizha Corner */}
              <div
                className="bg-black border p-2 relative flex flex-col justify-between"
                data-purpose="sub-event-thiruvizha"
                style={{ borderColor: 'rgba(0, 255, 204, 0.5)' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-arcade block" style={{ color: 'rgba(0, 255, 204, 0.7)' }}>
                      PROTOCOL_B
                    </span>
                    <span className="font-pixel text-xs sm:text-sm text-white font-bold">Thiruvizha Corner</span>
                  </div>
                  <div className="text-right">
                    <span className="font-arcade text-xs" style={{ color: '#00ffcc' }}>
                      {cardPrice('DR. DACRE', ['dacre-thiruvizha'])}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenRegister('DR. DACRE', 'THIRUVIZHA CORNER', 'PROTOCOL_B', 'dacre-thiruvizha')}
                  className="mt-2 w-full py-1.5 px-1 bg-zinc-950 border border-[#00ffcc] text-[#00ffcc] font-arcade text-[8px] sm:text-[9px] transition-none active:translate-y-0.5 cursor-pointer hover:bg-[#00ffcc] hover:text-black"
                  type="button"
                >
                  &gt;&gt; REGISTER THIRUVIZHA &lt;&lt;
                </button>
              </div>
            </div>

            {/* Bottom Status Note */}
            <div className="mt-2 pt-2 border-t border-zinc-800 text-center">
              <span className="font-vt text-xs text-zinc-400">STANDALONE SELECTION AVAILABLE</span>
            </div>
          </article>

          {/* ================= CARD 4: COSMA (ALL-ACCESS COMBO: DAY 1 + DAY 2) ================= */}
          <article
            className={`flex flex-col justify-between bg-[#0a0a0e] border-2 p-3 sm:p-4 relative transition-all ${
              recommendedPack === 'COSMA'
                ? 'ring-2 ring-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.6)]'
                : ''
            }`}
            data-purpose="pack-card-cosma"
            style={{ borderColor: 'rgb(255, 215, 0)', boxShadow: 'rgba(255, 215, 0, 0.35) 0px 0px 12px' }}
          >
            {recommendedPack === 'COSMA' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffd700] text-black font-arcade text-[8px] px-2 py-0.5 font-bold uppercase shadow-sm">
                ★ ALL ACCESS PASS ★
              </div>
            )}
            {/* Card Header Ribbon */}
            <div className="border-b-2 pb-3 mb-2" style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 border-2 bg-black p-0.5 shrink-0 overflow-hidden"
                  style={{ borderColor: '#ffd700', boxShadow: '0 0 8px rgba(255, 215, 0, 0.45)' }}
                >
                  <img
                    alt="Pixel art portrait of Cosma"
                    className="w-full h-full object-cover pixel-art block"
                    src="/assets/events-terminal/avatar-cosma.webp"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-arcade text-base sm:text-lg tracking-tight" style={{ color: '#ffd700' }}>
                    COSMA
                  </span>
                  <span
                    className="inline-block text-[8px] sm:text-[9px] font-arcade px-1.5 py-0.5 border mt-1 uppercase w-fit"
                    style={{
                      backgroundColor: 'rgba(255, 215, 0, 0.15)',
                      color: '#ffd700',
                      borderColor: 'rgba(255, 215, 0, 0.45)'
                    }}
                  >
                    [ULTIMATE COMBO PASS]
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-arcade text-zinc-400">ACCESS LEVEL:</div>
                <div className="text-xs font-arcade font-bold mt-0.5" style={{ color: '#ffd700' }}>
                  DAY 1 + DAY 2 (ALL ACCESS)
                </div>
              </div>
            </div>

            {/* All 10 Events List in Compact Grid Badges */}
            <div className="grow space-y-1.5 py-1">
              <div className="text-[9px] font-arcade text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
                <span>ALL 10 EVENTS INCLUDED</span>
                <span style={{ color: '#ffd700' }}>DUAL PASS</span>
              </div>
              <div className="grid grid-cols-2 gap-1 font-vt text-[13px] text-zinc-200">
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="Paper Presentation">
                  • Paper Pres.
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="Cypher Coding">
                  • Cypher Code
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="Unsaid">
                  • Unsaid
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="Weblica">
                  • Weblica
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="X-Coders">
                  • X-Coders
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="Connections">
                  • Connections
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="BGM">
                  • BGM
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="Lyrics">
                  • Lyrics
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="Mixed Signal">
                  • Mixed Signal
                </span>
                <span className="bg-black border px-1 py-0.5 truncate" style={{ borderColor: 'rgba(255, 215, 0, 0.35)' }} title="Talent Show">
                  • Talent Show
                </span>
              </div>
            </div>

            {/* Pricing & CTA */}
            <div className="mt-4 pt-3 border-t-2 border-zinc-800">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-vt text-sm text-zinc-400 uppercase">COMPLETE DUAL-DAY PACK</span>
                <span className="font-arcade text-lg sm:text-xl" style={{ color: '#ffd700' }}>
                  {cardPrice('COSMA')}
                </span>
              </div>
              <button
                onClick={() => handleOpenRegister('COSMA', 'ALL ACCESS (DAY 1 + DAY 2)')}
                className="w-full py-2.5 px-2 bg-black border-2 border-[#ffd700] text-[#ffd700] font-arcade text-[10px] sm:text-[11px] tracking-tighter transition-none active:translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer hover:bg-[#ffd700] hover:text-black shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                type="button"
              >
                <span>&gt;&gt;</span>
                <span>REGISTER ALL ACCESS</span>
                <span>&lt;&lt;</span>
              </button>
            </div>
          </article>
        </section>
        {/* END: 4-Column Pack Cards Grid */}

        {/* Selected Event Context Banner (Moved after all registration details to the last) */}
        {event && (
          <div className="bg-[#0e0716] border border-[#7c3aed]/50 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-[0_0_10px_rgba(124,58,237,0.15)] mt-1">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#38bdf8] font-silkscreen text-[10px]">[TARGET EVENT]</span>
              <span className="text-white font-bold">{event.title}</span>
              <span className="text-gray-400 text-[11px]">({event.date})</span>
            </div>
            <span className="text-[#34d399] font-silkscreen text-[10px]">
              RECOMMENDED PASS: {recommendedPack}
            </span>
          </div>
        )}
          </div>
        </div>
      )}

      {/* ================= INTERACTIVE POPUP REGISTRATION CARD ================= */}
      {modalState && activeConfig && (
        <div
          role="presentation"
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto flex items-start sm:items-center justify-center select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSubModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeConfig.name} registration`}
            className="bg-black border-2 p-4 sm:p-6 max-w-xl w-full relative my-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150"
            style={{
              borderColor: activeConfig.borderColor,
              boxShadow: `0 0 25px ${activeConfig.accentColor}40`
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b-2 pb-3 mb-3 shrink-0"
              style={{ borderColor: `${activeConfig.accentColor}50` }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 border bg-black shrink-0 overflow-hidden"
                  style={{ borderColor: activeConfig.borderColor }}
                >
                  <img
                    src={activeConfig.avatar}
                    alt={activeConfig.name}
                    className="w-full h-full object-cover pixel-art block"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-arcade text-xs sm:text-sm font-bold"
                      style={{ color: activeConfig.accentColor }}
                    >
                      {activeConfig.name}
                    </span>
                    <span
                      className="font-arcade text-[8px] px-1 py-0.5 border"
                      style={{
                        color: activeConfig.accentColor,
                        borderColor: `${activeConfig.accentColor}60`,
                        backgroundColor: `${activeConfig.accentColor}15`
                      }}
                    >
                      {activeConfig.tag}
                    </span>
                  </div>
                  <span className="font-pixel text-[10px] text-zinc-400 block mt-0.5">
                    {modalState.plan}
                  </span>
                </div>
              </div>
              <button
                onClick={closeSubModal}
                className="font-arcade text-xs text-zinc-400 hover:text-white px-2 py-1 border border-zinc-800 hover:border-zinc-500 cursor-pointer bg-black active:translate-y-0.5"
                title="Return to Pack Selection"
              >
                [X]
              </button>
            </div>

            {/* Modal Body */}
              <div className="flex flex-col grow">
                {/* Checkbox Section Header & Controls */}
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-900 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-arcade text-[9px] sm:text-[10px] text-zinc-300">
                      SELECT EVENTS TO REGISTER:
                    </span>
                    <span
                      className="font-arcade text-[9px] px-1 py-0.2"
                      style={{
                        color: activeConfig.accentColor,
                        backgroundColor: `${activeConfig.accentColor}20`
                      }}
                    >
                      {modalState.selectedEventIds.length}/{activeConfig.events.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="font-arcade text-[8px] sm:text-[9px] text-zinc-400 hover:text-white underline cursor-pointer"
                    >
                      [SELECT ALL]
                    </button>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="font-arcade text-[8px] sm:text-[9px] text-zinc-400 hover:text-white underline cursor-pointer"
                    >
                      [CLEAR]
                    </button>
                  </div>
                </div>
                {!activeConfig.isPerEventPricing && (
                  <p className="font-pixel text-[10px] text-zinc-400 pt-1.5">
                    The pass price covers every event on its day — tick the ones you&apos;ll play.
                  </p>
                )}

                {/* Event Checkboxes List */}
                <div className="my-3 space-y-1.5">
                  {activeConfig.events.map((ev, idx) => {
                    const isChecked = modalState.selectedEventIds.includes(ev.id);
                    return (
                      <button
                        type="button"
                        key={ev.id}
                        onClick={() => toggleEvent(ev.id)}
                        role="checkbox"
                        aria-checked={isChecked}
                        className={`w-full text-left flex items-center justify-between p-2 border select-none transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-zinc-950 text-white'
                            : 'bg-black/60 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                        }`}
                        style={{
                          borderColor: isChecked ? activeConfig.borderColor : undefined,
                          boxShadow: isChecked ? `0 0 8px ${activeConfig.accentColor}30` : undefined
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Retro Pixel Checkbox */}
                          <div
                            className={`w-5 h-5 border flex items-center justify-center font-arcade text-[10px] shrink-0 ${
                              isChecked ? 'text-black font-bold' : 'border-zinc-700 bg-black'
                            }`}
                            style={{
                              backgroundColor: isChecked ? activeConfig.accentColor : 'transparent',
                              borderColor: isChecked ? activeConfig.accentColor : '#3f3f46'
                            }}
                          >
                            {isChecked ? 'X' : ''}
                          </div>
                          <span
                            className="font-arcade text-[9px]"
                            style={{ color: isChecked ? activeConfig.accentColor : '#71717a' }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="font-pixel text-xs sm:text-sm font-semibold tracking-wide">
                            {ev.name}
                          </span>
                        </div>

                        {/* Extra tags / price */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {ev.protocol && (
                            <span
                              className="font-arcade text-[8px] px-1 py-0.5 border"
                              style={{
                                color: activeConfig.accentColor,
                                borderColor: `${activeConfig.accentColor}50`
                              }}
                            >
                              {ev.protocol}
                            </span>
                          )}
                          {ev.day && (
                            <span className="font-arcade text-[8px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-1 py-0.5">
                              {ev.day}
                            </span>
                          )}
                          {activeConfig.isPerEventPricing && (
                            <span className="font-arcade text-[10px]" style={{ color: activeConfig.accentColor }}>
                              {cardPrice(modalState.characterKey, [ev.id])}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Validation hint if none selected */}
                {modalState.selectedEventIds.length === 0 && (
                  <div className="text-amber-400 font-arcade text-[9px] bg-amber-950/40 border border-amber-800/60 p-2 mb-2 text-center">
                    ! PLEASE CHECK AT LEAST 1 EVENT TO PROCEED !
                  </div>
                )}

                {/* Price & Summary Ribbon */}
                <div className="border-t-2 border-zinc-900 pt-2 pb-1 flex items-baseline justify-between shrink-0 font-arcade">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase">
                      {activeConfig.isPerEventPricing ? 'CALCULATED PROTOCOL TOTAL' : 'BUNDLE TOTAL'}
                    </span>
                    <span className="text-[8px] text-zinc-400 font-pixel mt-0.5">
                      {modalState.selectedEventIds.length} OF {activeConfig.events.length} EVENTS SELECTED
                    </span>
                  </div>
                  <span className="text-base sm:text-lg" style={{ color: activeConfig.accentColor }}>
                    {getComputedPrice(modalState)}
                  </span>
                </div>

                {/* Modal Actions */}
                <div className="mt-2.5 flex flex-col gap-2 shrink-0">
                  <button
                    disabled={modalState.selectedEventIds.length === 0}
                    onClick={handleProceedRegistration}
                    className="w-full py-2.5 px-3 font-arcade text-xs font-bold transition-none cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                    style={{
                      backgroundColor: modalState.selectedEventIds.length > 0 ? activeConfig.accentColor : '#3f3f46',
                      color: '#000000'
                    }}
                    type="button"
                  >
                    <span>&gt;&gt;</span>
                    <span>PROCEED WITH REGISTRATION</span>
                    <span>&lt;&lt;</span>
                  </button>
                  <button
                    onClick={closeSubModal}
                    className="w-full py-2 px-3 bg-transparent border border-zinc-800 text-zinc-400 font-arcade text-[10px] hover:text-white hover:border-zinc-500 transition-none cursor-pointer"
                    type="button"
                  >
                    CANCEL &amp; CHANGE PLAYER
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
};
