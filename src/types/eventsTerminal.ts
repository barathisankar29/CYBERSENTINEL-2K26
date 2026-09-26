/** Modules mounted by EventsTerminalApp (the ones RetroNav can reach). */
export type ModuleId =
  | 'home'       // Deep Violet
  | 'compete'    // Neon Pink
  | 'firmware'   // Purple
  | 'favorites'  // My Registrations (radiance)
  | 'team';      // Team Creation (radiance)

export interface Coordinator {
  name: string;
  phone: string;
  role?: string;
}

export interface EventSpec {
  id: string;
  moduleId?: ModuleId;
  terminalId: string;
  category: string;
  title: string;
  day: 1 | 2;
  track: 'technical' | 'non_technical';
  quote: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  fee: string;
  teamSize: string;
  eligibility: string;
  chiefOperator: string;
  contactNumber: string;
  relayEmail: string;
  chipLabel: string;
  chipSub: string;
  busFreq: string;
  tags: string[];
  protocols: string[];
  coordinators?: Coordinator[];
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
