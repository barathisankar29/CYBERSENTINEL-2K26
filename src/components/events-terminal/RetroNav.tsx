import React from 'react';
import type { ModuleId } from '@/types/eventsTerminal';
import { sound } from './sound';

interface RetroNavProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
}

interface NavItem {
  id: ModuleId;
  label: string;
  color: string;
  title: string;
  renderIcon: () => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: '01 // HOME',
    color: '#9333ea',
    title: '01 // HOME (CYBERSENTINEL 2K26)',
    renderIcon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 1L1 7H3V14H7V10H9V14H13V7H15L8 1Z" />
      </svg>
    )
  },
  {
    id: 'compete',
    label: '02 // EVENT LIST',
    color: '#ff007f',
    title: '02 // EVENT LIST (ARENA TRACKS)',
    renderIcon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6 2H10V6H14V10H10V14H6V10H2V6H6V2Z" />
      </svg>
    )
  },
  {
    id: 'firmware',
    label: '03 // EVENT DETAILS',
    color: '#9333ea',
    title: '03 // EVENT DETAILS (FIRMWARE)',
    renderIcon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M3 13L13 3M4 14L14 4M2 12L12 2" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 'info',
    label: '04 // PROTOCOLS',
    color: '#ff007f',
    title: '04 // EVENT PROTOCOLS & RULES',
    renderIcon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M7 3H9V5H7V3ZM7 7H9V13H7V7ZM3 1H13V3H15V13H13V15H3V13H1V3H3V1ZM3 3V13H13V3H3Z" fillRule="evenodd" />
      </svg>
    )
  },
  {
    id: 'favorites',
    label: '05 // REGISTRATIONS',
    color: '#c084fc',
    title: '05 // MY REGISTRATIONS (ACTIVE PASSES)',
    renderIcon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M3 3H6V5H7V6H9V5H10V3H13V7H12V9H10V11H9V13H7V11H6V9H4V7H3V3Z" />
      </svg>
    )
  }
];

export const RetroNav: React.FC<RetroNavProps> = ({ activeModule, onSelectModule }) => {
  return (
    <header className="w-full max-w-6xl flex flex-col items-center mb-4 z-20" data-purpose="top-navigation-header">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap py-2 px-3 bg-black border-2 border-[#222222] shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        {/* 5 Exact Navigation Buttons in Required Order: [ HOME ] [ + ] [ PINK ] [ H ] [ HEART ] */}
        {NAV_ITEMS.map((item) => {
          const isActive = activeModule === item.id;
          const isRadiance = item.id === 'favorites';
          return (
            <button
              key={item.id}
              id={`nav-module-${item.id}`}
              className={`pixel-nav-btn cursor-pointer transition-all duration-75 relative`}
              style={{
                borderColor: item.color,
                color: isActive ? '#ffffff' : item.color,
                backgroundColor: isActive ? `${item.color}33` : '#000000',
                boxShadow: isActive
                  ? isRadiance
                    ? '0 0 16px #c084fc, 0 0 10px #ff007f, 0 0 8px #00ffff'
                    : `0 0 14px ${item.color}`
                  : isRadiance
                  ? '0 0 8px rgba(192, 132, 252, 0.45)'
                  : 'none'
              }}
              title={item.title}
              onClick={() => {
                sound.playNavClick();
                onSelectModule(item.id);
              }}
              onMouseEnter={() => sound.playNavHover()}
            >
              {isActive && (
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 animate-ping pointer-events-none"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {item.renderIcon()}
            </button>
          );
        })}
      </div>
    </header>
  );
};
