import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { ModuleId, EventSpec, SystemSettings } from '@/types/eventsTerminal';
import { ALL_EVENTS } from '@/data/eventsTerminalData';
import { RetroNav } from './RetroNav';
import { sound } from './sound';
import { RegistrationPortalPage, type RegistrationPortalInitialData } from './RegistrationPortalPage';
import { RegisterModal } from './RegisterModal';
import { RegistrationComingSoon } from './RegistrationComingSoon';
import { isRegistrationOpen, registrationOpensAt } from '@/config/registrationLaunch';
import { useMascot } from '@/components/mascot';
import { RegistrationRulesModal } from '@/components/registration/RegistrationRulesModal';
import './eventsTerminal.css';

// Screens reachable from RetroNav. The reference project also ships
// Categories/Highlights/Schedule/Security/Settings/Power/Search screens, but
// nothing in it navigates to them, so they weren't ported.
import { HomeScreen } from './screens/HomeScreen';
import { CompeteScreen } from './screens/CompeteScreen';
import { FirmwareScreen } from './screens/FirmwareScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { TeamCreationScreen } from './screens/TeamCreationScreen';

const FONT_LINK_ID = 'events-terminal-fonts';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Kelly+Slab&family=Oswald:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Press+Start+2P&family=Share+Tech+Mono&family=Silkscreen:wght@400;700&family=VT323&display=swap';

type EventsTab = 'all' | 'day1' | 'day2' | 'special';

/**
 * The team's CyberSentinel 2K26 "retro terminal" events experience, ported
 * from their AI Studio source (final_final_complete_event_page) — same
 * screens, RetroNav, sound engine and pixel/CRT visual language — mounted at
 * our `/events` route.
 *
 * Registration is NOT the reference's local mock: the pack modal hands off
 * to RegistrationPortalPage, which submits to the backend team's Supabase
 * `public-register`; My Registrations reads `check-registration`; Create
 * Team uses `team-management`. All calls go through src/services/registration.
 *
 * Font loading and the pixelated/unselectable-text CSS resets only apply
 * while this is mounted (`.cft-root` scoping in eventsTerminal.css + the
 * dynamic <link> below), so the rest of the site is unaffected.
 */
interface EventsTerminalAppProps {
  /** Screen to start on — /register/status and /register/team deep-link here. */
  initialModule?: ModuleId;
  /**
   * Open the "Choose your player" registration flow immediately (the
   * /register route) — the exact same pack modal -> portal flow as the
   * Events screens' REGISTER buttons.
   */
  startWithRegistration?: boolean;
  /** Called when that route-opened flow is dismissed without continuing. */
  onStartRegistrationClose?: () => void;
}

export function EventsTerminalApp({
  initialModule = 'home',
  startWithRegistration = false,
  onStartRegistrationClose
}: EventsTerminalAppProps = {}) {
  const { dispatchMascotEvent } = useMascot();
  const [activeModule, setActiveModule] = useState<ModuleId>(initialModule);
  // The event the user picked on the EVENTS grid (card, KNOW MORE or
  // REGISTER). Starts empty so no card is highlighted until one is chosen;
  // the detail screen falls back to the first event if it's opened straight
  // from the nav.
  const [selectedEvent, setSelectedEvent] = useState<EventSpec | null>(null);
  const detailEvent = selectedEvent ?? ALL_EVENTS[0];
  const [eventsTab, setEventsTab] = useState<EventsTab>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cyberfest_bookmarks');
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [portalData, setPortalData] = useState<RegistrationPortalInitialData | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  // Until registration launches (src/config/registrationLaunch.ts) the whole
  // terminal sits blurred and inert under the "opens soon" overlay.
  const [registrationLocked, setRegistrationLocked] = useState(() => !isRegistrationOpen());
  const [packChooserOpen, setPackChooserOpen] = useState(() => startWithRegistration && isRegistrationOpen());
  // True while the registration flow was opened by the /register route
  // itself; dismissing it then leaves /register for the event terminal.
  const [flowFromRoute, setFlowFromRoute] = useState(startWithRegistration);
  const [teamCreationTarget, setTeamCreationTarget] = useState<{ regId: string | null; eventName: string | null }>({
    regId: null,
    eventName: null
  });
  const [settings] = useState<SystemSettings>({
    soundEnabled: true,
    soundVolume: 0.05,
    scanlines: true,
    crtFlicker: false,
    theme: 'pink'
  });

  // Load the reference's pixel fonts only while this route is mounted.
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
    return () => {
      document.getElementById(FONT_LINK_ID)?.remove();
    };
  }, []);

  // Every screen change (e.g. KNOW MORE -> event page) starts at the top of
  // the terminal, not wherever the previous screen was scrolled to. Keyed on
  // the screen only: selecting a card on the EVENTS grid must not jump the page.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeModule]);

  const handleBookmarkToggle = (eventId: string) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      try {
        localStorage.setItem('cyberfest_bookmarks', JSON.stringify(updated));
      } catch {
        // Bookmarks are a convenience only.
      }
      return updated;
    });
  };

  const handleSelectEvent = (event: EventSpec) => {
    setSelectedEvent(event);
    setActiveModule('firmware');
    dispatchMascotEvent('MASCOT_EVENT_OPEN', { message: `Here's everything you need to know about ${event.title}.` });
  };

  const handleNavigateToEvents = (tab: EventsTab = 'all') => {
    setEventsTab(tab);
    setActiveModule('compete');
    dispatchMascotEvent('MASCOT_DAY_SELECTED', { day: tab });
  };

  const handlePortalNavigateToRegistrations = () => {
    setPortalData(null);
    setFlowFromRoute(false);
    setActiveModule('favorites');
  };

  const leaveRouteFlow = () => {
    if (flowFromRoute) {
      setFlowFromRoute(false);
      onStartRegistrationClose?.();
    }
  };

  const handlePortalClose = () => {
    setPortalData(null);
    leaveRouteFlow();
  };

  // RegisterModal calls onProceedToPortal and then onClose synchronously;
  // only a close that did NOT open the portal counts as dismissing the flow.
  const proceededToPortal = useRef(false);

  const openPortal = (data: RegistrationPortalInitialData) => {
    proceededToPortal.current = true;
    setPortalData(data);
  };

  const handlePackChooserClose = () => {
    setPackChooserOpen(false);
    if (!proceededToPortal.current) leaveRouteFlow();
    proceededToPortal.current = false;
  };

  const handleNavigateToTeamCreation = (regId: string, eventName: string) => {
    setTeamCreationTarget({ regId, eventName });
    setActiveModule('team');
  };

  // Where the primary back control leads (none on the home and events-list screens).
  const backTarget: { module: ModuleId; label: string } | null =
    activeModule === 'firmware'
      ? { module: 'compete', label: 'BACK TO EVENTS' }
      : activeModule === 'favorites' || activeModule === 'team'
        ? selectedEvent
          ? { module: 'firmware', label: 'BACK TO EVENT' }
          : { module: 'compete', label: 'BACK TO EVENTS' }
        : null;

  // Frame color treatments:
  // home → PURPLE, compete → PINK, firmware → PURPLE,
  // favorites → RADIANCE, team → RADIANCE (matching favorites)
  const radiance = {
    border: '#c084fc',
    glow: '0 0 35px rgba(168, 85, 247, 0.7), 0 0 20px rgba(255, 0, 127, 0.45), 0 0 12px rgba(0, 255, 255, 0.4)',
    ditherBg: 'linear-gradient(90deg, #9333ea 0%, #ff007f 50%, #00ffff 100%)'
  };
  const purple = {
    border: '#9333ea',
    glow: '0 0 28px rgba(147, 51, 234, 0.65), 0 0 12px rgba(168, 85, 247, 0.4)',
    ditherBg: '#9333ea'
  };
  const frameThemes: Record<ModuleId, { border: string; glow: string; ditherBg: string }> = {
    home: purple,
    compete: {
      border: '#ff007f',
      glow: '0 0 28px rgba(255, 0, 127, 0.65), 0 0 12px rgba(255, 0, 127, 0.35)',
      ditherBg: '#ff007f'
    },
    firmware: purple,
    favorites: radiance,
    team: radiance
  };
  const activeFrameTheme = frameThemes[activeModule];

  return (
    <>
      <div
        inert={registrationLocked}
        aria-hidden={registrationLocked || undefined}
        className={`cft-root min-h-screen bg-black flex flex-col justify-between items-center p-3 sm:p-6 transition-colors duration-150 ${
          settings.scanlines ? 'scanlines' : ''
        } ${settings.crtFlicker ? 'crt-flicker' : ''}`}
        style={
          {
            '--theme-border': activeFrameTheme.border,
            '--theme-glow': activeFrameTheme.glow,
            '--theme-cta': '#ff007f'
          } as React.CSSProperties
        }
      >
        <div className="self-start mb-2 flex flex-wrap items-center gap-2">
          {/* Way back to the main CyberSentinel site (the reference is a closed
              single-page app), styled in the terminal's own pixel language. */}
          <Link
            to="/#buildings"
            onClick={() => sound.playNavClick()}
            className="px-2.5 py-1 font-silkscreen text-[10px] text-gray-400 border border-[#333] hover:text-white hover:border-[#ff007f] transition-colors"
            title="Exit terminal, return to CyberSentinel city"
            data-purpose="back-to-city"
          >
            ‹ EXIT TO CITY
          </Link>

          {/* Back up the events flow — event page -> events list;
              checking / team -> the event the visitor came from. */}
          {backTarget && (
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveModule(backTarget.module);
              }}
              className="px-3 py-1.5 font-silkscreen text-[11px] sm:text-xs text-[#ff007f] border-2 border-[#ff007f] bg-[#ff007f]/10 hover:bg-[#ff007f] hover:text-white shadow-[0_0_8px_rgba(255,0,127,0.35)] transition-colors cursor-pointer"
              data-purpose="back-to-event"
            >
              ← {backTarget.label}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              setShowRulesModal(true);
            }}
            className="px-2.5 py-1 font-silkscreen text-[10px] text-[#00f0ff] border border-[#00f0ff]/50 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 hover:text-white hover:border-[#00f0ff] transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.25)]"
            title="View Registration & Event Rulebook"
          >
            <span>[📜]</span>
            <span>RULES BOOK</span>
          </button>
        </div>

        <RetroNav activeModule={activeModule} onSelectModule={setActiveModule} />

        <main
          className="w-full max-w-6xl pixel-window-frame bg-black relative p-4 sm:p-7 my-auto transition-all"
          style={
            {
              '--theme-border': activeFrameTheme.border,
              '--theme-glow': activeFrameTheme.glow,
              '--dither-bg': activeFrameTheme.ditherBg
            } as React.CSSProperties
          }
          data-purpose="main-screen-container"
        >
          {activeModule === 'firmware' && (
            <FirmwareScreen
              event={detailEvent}
              onBookmarkToggle={handleBookmarkToggle}
              isBookmarked={bookmarkedIds.includes(detailEvent.id)}
              onSelectModule={setActiveModule}
              onProceedToPortal={openPortal}
            />
          )}

          {activeModule === 'home' && (
            <HomeScreen onSelectModule={setActiveModule} onNavigateToEvents={handleNavigateToEvents} />
          )}

          {activeModule === 'compete' && (
            <CompeteScreen
              onSelectEvent={handleSelectEvent}
              onHighlightEvent={setSelectedEvent}
              selectedEventId={selectedEvent?.id}
              initialTab={eventsTab}
              onTabChange={(tab) => {
              setEventsTab(tab)
              dispatchMascotEvent('MASCOT_DAY_SELECTED', { day: tab })
            }}
              onProceedToPortal={openPortal}
            />
          )}

          {activeModule === 'favorites' && (
            <FavoritesScreen onSelectModule={setActiveModule} onNavigateToTeamCreation={handleNavigateToTeamCreation} />
          )}

          {activeModule === 'team' && (
            <TeamCreationScreen
              key={teamCreationTarget.regId ?? 'manual'}
              selectedRegId={teamCreationTarget.regId}
              selectedEventName={teamCreationTarget.eventName}
              onSelectModule={setActiveModule}
            />
          )}
        </main>

        {/* Route-opened "Choose your player" (the /register page) */}
        {packChooserOpen && (
          <RegisterModal event={null} isOpen onClose={handlePackChooserClose} onProceedToPortal={openPortal} />
        )}

        {/* Full-screen registration portal (submits to the Supabase backend) */}
        {portalData && (
          <RegistrationPortalPage
            initialData={portalData}
            backLabel={!flowFromRoute && activeModule === 'firmware' ? 'BACK TO EVENT' : 'BACK TO EVENTS'}
            onClose={handlePortalClose}
            onNavigateToRegistrations={handlePortalNavigateToRegistrations}
          />
        )}
      </div>

      {registrationLocked && (
        <RegistrationComingSoon opensAt={registrationOpensAt()} onOpen={() => setRegistrationLocked(false)} />
      )}

      {showRulesModal && (
        <RegistrationRulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
      )}
    </>
  );
}
