import React from 'react';
import { Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { sound } from '@/components/events-terminal/sound';

export const MASCOT_STATIC_WEBP = '/assets/mascot/mascot_team_indicator.webp';

interface MascotTeamIndicatorProps {
  /**
   * 'badge': Ultra-compact mascot badge perched on navigation or buttons (RetroNav)
   * 'alert': High-priority compact warning card reminding participants they must create their team
   * 'banner': Slim single-line inline warning bar
   * 'button-icon': Tiny inline icon suited to sit inside buttons
   */
  variant?: 'badge' | 'alert' | 'banner' | 'button-icon';
  onCreateTeam?: () => void;
  className?: string;
  text?: string;
  subtext?: string;
}

export const MascotTeamIndicator: React.FC<MascotTeamIndicatorProps> = ({
  variant = 'badge',
  onCreateTeam,
  className = '',
  text,
  subtext
}) => {
  // Ultra-compact badge for RetroNav or small tabs
  if (variant === 'badge') {
    return (
      <div
        className={`absolute -top-2 -right-2 flex items-center pointer-events-none z-30 select-none ${className}`}
        title="Mascot alert: Create your team without fail!"
      >
        <div className="relative flex items-center justify-center">
          <img
            src={MASCOT_STATIC_WEBP}
            alt="Mascot Indicator"
            width={22}
            height={28}
            loading="eager"
            decoding="async"
            className="w-[20px] h-auto object-contain drop-shadow-[0_0_6px_rgba(255,0,127,0.85)] transform -rotate-6 animate-pulse"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007f] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff007f]" />
          </span>
        </div>
      </div>
    );
  }

  // Tiny inline icon to place directly inside buttons or chips
  if (variant === 'button-icon') {
    return (
      <img
        src={MASCOT_STATIC_WEBP}
        alt=""
        aria-hidden="true"
        width={18}
        height={22}
        loading="eager"
        decoding="async"
        className={`w-4 h-auto object-contain inline-block shrink-0 drop-shadow-[0_0_4px_rgba(255,255,255,0.6)] ${className}`}
        style={{ imageRendering: 'pixelated' }}
      />
    );
  }

  // Slim single-line inline warning bar
  if (variant === 'banner') {
    return (
      <div
        className={`flex items-center justify-between gap-2.5 px-3 py-2 bg-[#17051f]/95 border-2 border-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.3)] font-mono text-xs ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={MASCOT_STATIC_WEBP}
            alt="Mascot"
            width={28}
            height={35}
            loading="eager"
            decoding="async"
            className="w-6 h-auto object-contain shrink-0 drop-shadow-[0_0_8px_rgba(255,0,127,0.7)]"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="min-w-0">
            <p className="font-pixel text-[11px] text-[#ffee00] tracking-wider truncate">
              {text ?? 'ACTION REQUIRED // CREATE YOUR TEAM'}
            </p>
            <p className="text-[10px] text-gray-300 truncate">
              {subtext ?? "Paying alone doesn't register your squad. Leader must create team!"}
            </p>
          </div>
        </div>

        {onCreateTeam && (
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onCreateTeam();
            }}
            className="px-2.5 py-1 bg-[#ff007f] hover:bg-[#ff3399] text-white font-pixel text-[9px] tracking-wider shrink-0 transition-colors cursor-pointer flex items-center gap-1 shadow-[0_0_8px_rgba(255,0,127,0.5)]"
          >
            <span>FORM TEAM</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  // Default 'alert': High-impact cyber alert card with static webp mascot
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r from-[#17051f] via-[#0d0315] to-[#12041c] border-2 border-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.35)] p-3 sm:p-3.5 transition-all ${className}`}
      data-purpose="mascot-team-requirement-alert"
    >
      {/* Top indicator tag */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#3b1248]">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007f] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff007f]" />
          </span>
          <span className="font-silkscreen text-[9px] tracking-wider font-bold text-[#ff007f]">
            CRITICAL // TEAM CREATION MANDATORY
          </span>
        </div>
        <span className="text-[9px] font-mono text-amber-300 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>DO NOT SKIP</span>
        </span>
      </div>

      <div className="flex items-start sm:items-center gap-3">
        {/* Static WebP Mascot (Ultra low weight ~6KB, crisp pixel ghost pointing) */}
        <div className="relative shrink-0 pt-0.5 sm:pt-0">
          <img
            src={MASCOT_STATIC_WEBP}
            alt="CyberSentinel Mascot Warning"
            width={40}
            height={50}
            loading="eager"
            decoding="async"
            className="w-9 sm:w-10 h-auto object-contain drop-shadow-[0_0_10px_rgba(255,0,127,0.6)]"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Messaging */}
        <div className="flex-1 min-w-0">
          <h4 className="font-pixel text-xs sm:text-sm text-white tracking-wider flex items-center gap-1.5 flex-wrap">
            <span>{text ?? 'HAVE YOU CREATED YOUR TEAM?'}</span>
            <span className="text-[#ffee00] text-[10px] font-mono">[REQUIRED]</span>
          </h4>
          <p className="font-mono text-[11px] sm:text-xs text-gray-300 mt-1 leading-relaxed">
            {subtext ?? (
              <>
                Completing payment confirms your slot, but <strong className="text-white">you must still create your team</strong> to participate in Duo / Team events. Give your teammates your Registration ID or create the team now!
              </>
            )}
          </p>
        </div>

        {/* CTA Button */}
        {onCreateTeam && (
          <div className="shrink-0 self-center hidden sm:block">
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                onCreateTeam();
              }}
              className="px-3 py-2 bg-[#ff007f] hover:bg-[#ff3399] active:translate-y-0.5 text-white font-pixel text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,0,127,0.5)] border border-[#ff66b2] whitespace-nowrap"
            >
              <Users className="w-3.5 h-3.5" />
              <span>CREATE TEAM</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile CTA */}
      {onCreateTeam && (
        <div className="mt-2.5 pt-2 border-t border-[#290d33] sm:hidden">
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onCreateTeam();
            }}
            className="w-full py-2 bg-[#ff007f] hover:bg-[#ff3399] active:translate-y-0.5 text-white font-pixel text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(255,0,127,0.5)] border border-[#ff66b2]"
          >
            <Users className="w-3.5 h-3.5" />
            <span>CREATE TEAM NOW</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
