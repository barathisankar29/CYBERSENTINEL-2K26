import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ModuleId, EventSpec, SystemSettings } from '@/types/eventsTerminal';
import { ALL_EVENTS } from '@/data/eventsTerminalData';
import { RetroNav } from './RetroNav';
import { sound } from './sound';
import './eventsTerminal.css';

// Screens (only the 5 wired into RetroNav — the reference project also
// ships Categories/Highlights/Schedule/Security/Settings/Power/Search
// screens, but its own App.tsx never mounts them; they're unreachable
// dead code there too, so they weren't ported).
import { HomeScreen } from './screens/HomeScreen';
import { InfoScreen } from './screens/InfoScreen';
import { CompeteScreen } from './screens/CompeteScreen';
import { FirmwareScreen } from './screens/FirmwareScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';

const FONT_LINK_ID = 'events-terminal-fonts';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&family=Silkscreen:wght@400;700&family=VT323&display=swap';

/**
 * The team's CyberSentinel 2K26 "retro terminal" events experience,
 * ported 1:1 from their AI Studio source (cyberfest-2025-terminal.ai.studio)
 * rather than reinterpreted — same 5 screens (Home/Compete/Firmware/Info/
 * Favorites), same RetroNav, same client-side registration-with-localStorage
 * flow, same sound engine, same pixel/CRT visual language. Mounted at our
 * existing `/events` route (see pages/EventsPage.tsx) instead of replacing
 * this site's routing.
 *
 * Font loading and the pixelated/unselectable-text CSS resets are scoped to
 * only apply while this is mounted (see eventsTerminal.css's `.cft-root`
 * scoping, and the dynamic <link> injection below) so the rest of the site
 * is unaffected when this route isn't active.
 */
export function EventsTerminalApp() {
  const [activeModule, setActiveModule] = useState<ModuleId>('home');
  const [selectedEvent, setSelectedEvent] = useState<EventSpec>(ALL_EVENTS[0]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['firmware']);
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

  // Load bookmarks on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cyberfest_bookmarks');
      if (stored) {
        setBookmarkedIds(JSON.parse(stored));
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleBookmarkToggle = (eventId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(eventId);
      const updated = exists ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      try {
        localStorage.setItem('cyberfest_bookmarks', JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });
  };

  const handleSelectEvent = (event: EventSpec) => {
    setSelectedEvent(event);
    setActiveModule('firmware');
  };

  // Frame color treatments in exact required order:
  // FRAME 1 (home) → PURPLE
  // FRAME 2 (compete) → PINK
  // FRAME 3 (firmware) → PURPLE
  // FRAME 4 (info) → PINK
  // FRAME 5 (favorites) → RADIANCE EFFECT
  const frameThemes: Record<string, { border: string; glow: string; ditherBg: string }> = {
    home: {
      border: '#9333ea',
      glow: '0 0 28px rgba(147, 51, 234, 0.65), 0 0 12px rgba(168, 85, 247, 0.4)',
      ditherBg: '#9333ea'
    },
    compete: {
      border: '#ff007f',
      glow: '0 0 28px rgba(255, 0, 127, 0.65), 0 0 12px rgba(255, 0, 127, 0.35)',
      ditherBg: '#ff007f'
    },
    firmware: {
      border: '#9333ea',
      glow: '0 0 28px rgba(147, 51, 234, 0.65), 0 0 12px rgba(168, 85, 247, 0.4)',
      ditherBg: '#9333ea'
    },
    info: {
      border: '#ff007f',
      glow: '0 0 28px rgba(255, 0, 127, 0.65), 0 0 12px rgba(255, 0, 127, 0.35)',
      ditherBg: '#ff007f'
    },
    favorites: {
      border: '#c084fc',
      glow: '0 0 35px rgba(168, 85, 247, 0.7), 0 0 20px rgba(255, 0, 127, 0.45), 0 0 12px rgba(0, 255, 255, 0.4)',
      ditherBg: 'linear-gradient(90deg, #9333ea 0%, #ff007f 50%, #00ffff 100%)'
    }
  };

  const activeFrameTheme = frameThemes[activeModule] || frameThemes.home;

  return (
    <div
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
      {/* Minimal exit link back to the main CyberSentinel site — the
          reference is a closed single-page app with no such link, but this
          route lives alongside our other pages, so it needs one way back
          that isn't just the browser's back button. Styled with the
          reference's own pixel-button language rather than our neon-glass
          header, to not break the terminal's visual world. */}
      <Link
        to="/#buildings"
        onClick={() => sound.playNavClick()}
        className="self-start mb-2 px-2.5 py-1 font-silkscreen text-[10px] text-gray-400 border border-[#333] hover:text-white hover:border-[#ff007f] transition-colors"
        title="Exit terminal, return to CyberSentinel city"
      >
        ‹ EXIT TO CITY
      </Link>

      {/* Top Arcade Module Navigation Bar */}
      <RetroNav
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
        }}
      />

      {/* Main Pixel Frame Container */}
      <main
        className="w-full max-w-6xl pixel-window-frame bg-black relative p-4 sm:p-7 my-auto transition-all"
        style={
          {
            '--theme-border': activeFrameTheme.border,
            '--theme-glow': activeFrameTheme.glow,
            '--dither-bg': activeFrameTheme.ditherBg
          } as React.CSSProperties
        }
        data-purpose="event-details-frame"
      >
        {activeModule === 'firmware' && (
          <FirmwareScreen
            event={selectedEvent}
            onBookmarkToggle={handleBookmarkToggle}
            isBookmarked={bookmarkedIds.includes(selectedEvent.id)}
          />
        )}

        {activeModule === 'home' && (
          <HomeScreen onSelectModule={setActiveModule} />
        )}

        {activeModule === 'info' && (
          <InfoScreen
            event={selectedEvent}
            onSelectModule={setActiveModule}
          />
        )}

        {activeModule === 'compete' && (
          <CompeteScreen
            onSelectEvent={handleSelectEvent}
            selectedEventId={selectedEvent.id}
          />
        )}

        {activeModule === 'favorites' && (
          <FavoritesScreen
            bookmarkedEventIds={bookmarkedIds}
            onSelectEvent={handleSelectEvent}
            onRemoveBookmark={handleBookmarkToggle}
          />
        )}
      </main>
    </div>
  );
}
