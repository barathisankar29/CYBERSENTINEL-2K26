/** Modules mounted by EventsTerminalApp (the ones RetroNav can reach). */
export type ModuleId =
  | 'home'       // Deep Violet
  | 'compete'    // Neon Pink
  | 'firmware'   // Purple
  | 'favorites'  // My Registrations (radiance)
  | 'team';      // Team Creation (radiance)

export interface Coordinator {
  name: string;
  /** Some coordinators have no published number. */
  phone?: string;
  role?: string;
}

export interface EventSpec {
  id: string;
  moduleId?: ModuleId;
  title: string;
  day: 1 | 2;
  track: 'technical' | 'non_technical';
  quote: string;
  description: string;
  date: string;
  time: string;
  teamSize: string;
  /** Cash prizes, 1st / 2nd / 3rd place. */
  prizes?: [string, string, string];
  chipLabel: string;
  chipSub: string;
  protocols: string[];
  coordinators: Coordinator[];
  isSpecial?: boolean;
}

export type ThemeName = 'pink' | 'cyan' | 'green' | 'amber';

export interface SystemSettings {
  soundEnabled: boolean;
  soundVolume: number;
  scanlines: boolean;
  crtFlicker: boolean;
  theme: ThemeName;
}
