/**
 * CYBERSENTINEL 2K26 - MASCOT COMPANION DIALOGUE CONFIGURATION
 * 
 * Centralized dialogue data store for the mascot companion system.
 * All dialogue lines, mascot states, priorities, durations, and cooldowns
 * are configured here so text and reactions can be customized in one place.
 * 
 * Priorities:
 * - 'critical': Registration events, active form processing (cannot be interrupted)
 * - 'high': Page/event navigation, building click, city transitions
 * - 'medium': Building hover, pet click, auto-relocation
 * - 'low': Idle commentary, random pet reactions
 */

import type { MascotState, MascotDialoguePriority } from '@/types/mascot'

export interface MascotDialogueItem {
  /** Mascot visual state/pose to display */
  state: MascotState
  /** Primary dialogue text to show in the speech bubble */
  text: string
  /** Optional secondary follow-up sentence displayed sequentially */
  followUpText?: string
  /** Message priority tier to prevent interruption by lower-priority events */
  priority: MascotDialoguePriority
  /** Cooldown in milliseconds before this specific message/event can fire again */
  cooldown?: number
  /** How long in milliseconds the primary speech bubble stays visible */
  duration?: number
}

export const MASCOT_DIALOGUE = {
  // ==========================================
  // INTRO & ONBOARDING DIALOGUES
  // ==========================================
  intro: {
    /** First visit initial greeting at lower-left */
    welcomeInitial: {
      state: 'idle' as MascotState,
      text: 'Welcome to CyberSentinel 2K26, player.',
      followUpText: 'Ready to explore the city?',
      priority: 'high' as MascotDialoguePriority,
      duration: 4000,
    },
    /** Scroll hint when user begins exploring the landing page */
    scrollDown: {
      state: 'guide' as MascotState,
      text: 'Scroll down to enter our CyberSentinel world.',
      priority: 'high' as MascotDialoguePriority,
      duration: 4200,
    },
    /** City transition completion greeting */
    cityWelcome: {
      state: 'guide' as MascotState,
      text: 'Welcome to the CyberSentinel city.',
      followUpText: 'Explore the city by navigating through the buildings.',
      priority: 'high' as MascotDialoguePriority,
      duration: 4000,
    },
  },

  // ==========================================
  // NAVIGATION BUILDING DIALOGUES
  // Keyed by building ID (events, about, credentials, contact, timeline, transport, website)
  // ==========================================
  buildings: {
    events: {
      hover: {
        state: 'point' as MascotState,
        text: "Looking for something exciting? Explore the events we're hosting.",
        priority: 'medium' as MascotDialoguePriority,
        cooldown: 4000,
        duration: 3500,
      },
      click: {
        state: 'guide' as MascotState,
        text: "Let's see what's happening!",
        priority: 'high' as MascotDialoguePriority,
        duration: 2500,
      },
    },
    about: {
      hover: {
        state: 'point' as MascotState,
        text: 'Curious about who we are? Step inside to know more about us.',
        priority: 'medium' as MascotDialoguePriority,
        cooldown: 4000,
        duration: 3500,
      },
      click: {
        state: 'guide' as MascotState,
        text: "Let's meet the people behind the mission.",
        priority: 'high' as MascotDialoguePriority,
        duration: 2500,
      },
    },
    credentials: {
      hover: {
        state: 'point' as MascotState,
        text: 'Meet the crew behind the mission.',
        priority: 'medium' as MascotDialoguePriority,
        cooldown: 4000,
        duration: 3500,
      },
      click: {
        state: 'guide' as MascotState,
        text: 'Meet the crew.',
        priority: 'high' as MascotDialoguePriority,
        duration: 2500,
      },
    },
    contact: {
      hover: {
        state: 'point' as MascotState,
        text: 'Have a question? Reach out to us.',
        priority: 'medium' as MascotDialoguePriority,
        cooldown: 4000,
        duration: 3500,
      },
      click: {
        state: 'guide' as MascotState,
        text: "Let's get you the details.",
        priority: 'high' as MascotDialoguePriority,
        duration: 2500,
      },
    },
    timeline: {
      hover: {
        state: 'point' as MascotState,
        text: 'Keep track of the action with our event timeline.',
        priority: 'medium' as MascotDialoguePriority,
        cooldown: 4000,
        duration: 3500,
      },
      click: {
        state: 'guide' as MascotState,
        text: "Let's see what's coming up.",
        priority: 'high' as MascotDialoguePriority,
        duration: 2500,
      },
    },
    transport: {
      hover: {
        state: 'point' as MascotState,
        text: 'Planning your trip? Find your way to our campus here.',
        priority: 'medium' as MascotDialoguePriority,
        cooldown: 4000,
        duration: 3500,
      },
      click: {
        state: 'guide' as MascotState,
        text: "Let's find your route.",
        priority: 'high' as MascotDialoguePriority,
        duration: 2500,
      },
    },
    website: {
      hover: {
        state: 'guide' as MascotState,
        text: 'Return to the CyberSentinel home base.',
        priority: 'medium' as MascotDialoguePriority,
        cooldown: 4000,
        duration: 3500,
      },
      click: {
        state: 'guide' as MascotState,
        text: 'Back to the main city!',
        priority: 'high' as MascotDialoguePriority,
        duration: 2500,
      },
    },
  },

  // ==========================================
  // EVENT TERMINAL DIALOGUES
  // ==========================================
  events: {
    terminal: {
      state: 'guide' as MascotState,
      text: 'Welcome to the mission terminal.',
      followUpText: 'Choose your track and explore the events.',
      priority: 'high' as MascotDialoguePriority,
      duration: 3800,
    },
    day1: {
      state: 'point' as MascotState,
      text: 'Track 1: Technical missions.',
      followUpText: 'Pick an event and see what challenges await.',
      priority: 'high' as MascotDialoguePriority,
      duration: 3500,
    },
    day2: {
      state: 'happy' as MascotState,
      text: 'Track 2: Non-technical missions.',
      followUpText: 'Time to discover something different.',
      priority: 'high' as MascotDialoguePriority,
      duration: 3500,
    },
    all: {
      state: 'guide' as MascotState,
      text: 'All missions are on the grid.',
      followUpText: 'Choose an event to explore its details.',
      priority: 'high' as MascotDialoguePriority,
      duration: 3500,
    },
    eventOpen: {
      state: 'guide' as MascotState,
      text: 'Mission selected.',
      followUpText: 'Take a look at the details before you register.',
      priority: 'high' as MascotDialoguePriority,
      duration: 3800,
    },
  },

  // ==========================================
  // REGISTRATION WORKFLOW DIALOGUES
  // ==========================================
  registration: {
    start: {
      state: 'working' as MascotState,
      text: 'Processing your registration...',
      priority: 'critical' as MascotDialoguePriority,
      duration: 0, // untimed while processing submission
    },
    success: {
      state: 'celebrate' as MascotState,
      text: "Mission complete! You're officially in. Welcome to CyberSentinel 2K26!",
      priority: 'critical' as MascotDialoguePriority,
      duration: 6500,
    },
    error: {
      state: 'error' as MascotState,
      text: "Something went wrong. Let's try that again.",
      priority: 'critical' as MascotDialoguePriority,
      duration: 5000,
    },
  },

  // ==========================================
  // PET & INTERACTIVE COMPANION DIALOGUES
  // ==========================================
  pet: {
    click: {
      state: 'happy' as MascotState,
      text: 'Hey, player!',
      followUpText: 'Need a little help?',
      priority: 'medium' as MascotDialoguePriority,
      cooldown: 2500,
      duration: 3000,
    },
    autoMoved: {
      state: 'peek' as MascotState,
      text: "I'll move aside so you can see.",
      priority: 'medium' as MascotDialoguePriority,
      duration: 3200,
    },
    longIdle: {
      state: 'thinking' as MascotState,
      text: 'Still here if you need guidance, player.',
      priority: 'low' as MascotDialoguePriority,
      cooldown: 30000,
      duration: 3000,
    },
  },
} as const
