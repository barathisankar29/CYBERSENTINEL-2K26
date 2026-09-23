export type ModuleId =
  | 'info'       // 01 Cyan
  | 'firmware'   // 02 Neon Pink (default / active in screenshot)
  | 'compete'    // 03 Neon Green
  | 'categories' // 04 Yellow
  | 'highlights' // 05 Neon Magenta
  | 'schedule'   // 06 Electric Blue
  | 'favorites'  // 07 Neon Purple
  | 'security'   // 08 Cyan Shield
  | 'settings'   // 09 Orange Gear
  | 'power'      // 10 Red Kill Switch
  | 'home'       // 11 Deep Violet
  | 'search';    // 12 Lime Green

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
}

export interface RegisteredOperator {
  regId: string;
  eventName: string;
  crewName: string;
  leadOperator: string;
  callsign: string;
  teamCount: number;
  contactEmail: string;
  contactPhone: string;
  timestamp: string;
  securityHash: string;
}

export type ThemeName = 'pink' | 'cyan' | 'green' | 'amber';

export interface SystemSettings {
  soundEnabled: boolean;
  soundVolume: number;
  scanlines: boolean;
  crtFlicker: boolean;
  theme: ThemeName;
}
