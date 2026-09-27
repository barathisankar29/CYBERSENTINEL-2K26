import type { EventSpec } from '@/types/eventsTerminal';

export const isPaidSpecialFeeEvent = (eventOrId?: { id?: string; title?: string } | string | null): boolean => {
  if (!eventOrId) return false;
  const id = typeof eventOrId === 'string' ? eventOrId : eventOrId.id || '';
  const title = typeof eventOrId === 'object' && eventOrId.title ? eventOrId.title.toLowerCase() : '';
  const lowerId = id.toLowerCase();
  return (
    lowerId.includes('group_dance') ||
    lowerId.includes('group-dance') ||
    lowerId.includes('dacre-dance') ||
    lowerId.includes('thiruvizha') ||
    title.includes('group dance') ||
    title.includes('thiruvizha')
  );
};

export const ALL_EVENTS: EventSpec[] = [
  // ==========================================
  // DAY 1 (5 EVENTS)
  // ==========================================
  {
    id: 'paper_presentation',
    moduleId: 'firmware',
    terminalId: 'PPT-01',
    day: 1,
    track: 'technical',
    category: 'TECHNICAL SYMPOSIUM // RESEARCH & INNOVATION',
    title: 'PAPER PRESENTATION',
    quote: '"PRESENT INNOVATIVE IDEAS. REDEFINE THE COMPUTING HORIZON."',
    description:
      'Showcase cutting-edge technical insights across AI, cyber defense, IoT, quantum computing, and distributed networks before an esteemed panel of researchers.',
    venue: '',
    date: 'DAY 01',
    time: '10:00 AM - 01:00 PM',
    fee: '',
    teamSize: '2 - 3 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'DR. S. RAGHAVAN',
    contactNumber: '+91 98401 11201',
    relayEmail: 'PAPER.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Dr. S. Raghavan', phone: '+91 98401 11201', role: 'Faculty Coordinator' },
      { name: 'Prof. V. Saravanan', phone: '+91 98402 11202', role: 'Faculty Coordinator' },
      { name: 'R. Aravind', phone: '+91 97908 11203', role: 'Student Coordinator' },
      { name: 'S. Kavyashree', phone: '+91 98841 11204', role: 'Student Coordinator' }
    ],
    chipLabel: 'PAPER',
    chipSub: 'IEEE-STD',
    busFreq: '133.00 MHz',
    tags: ['Research', 'Presentation', 'AI', 'Cloud', 'Cybersecurity'],
    protocols: [
      'PRESENTATION DURATION: 7 MINUTES FOR PRESENTATION + 3 MINUTES Q&A WITH THE JURY.',
      'SLIDES (PPT OR PDF) MUST BE SUBMITTED AT THE REPORTING DESK 30 MINUTES PRIOR.',
      'ORIGINAL RESEARCH AND CASE STUDIES PREFERRED; MAXIMUM OF 3 MEMBERS PER TEAM.',
      'SCORING CRITERIA: NOVELTY, TECHNICAL RIGOR, PRACTICAL IMPACT, AND DEFENSE RIGOR.',
      'PLAGIARISM EXCEEDING 15% WILL RESULT IN IMMEDIATE DISQUALIFICATION.'
    ]
  },
  {
    id: 'cypher_coding',
    moduleId: 'firmware',
    terminalId: 'CYP-02',
    day: 1,
    track: 'technical',
    category: 'TECHNICAL SYMPOSIUM // CRYPTOGRAPHIC & ALGORITHMIC CODING',
    title: 'CYPHER CODING',
    quote: '"DECRYPT THE LOGIC. CRACK THE CIPHER. COMPILE UNDER PRESSURE."',
    description:
      'Decode encrypted problem statements, reverse-engineer algorithmic puzzles, and write high-efficiency code to breach multi-layered logical locks.',
    venue: '',
    date: 'DAY 01',
    time: '10:30 AM - 01:00 PM',
    fee: '',
    teamSize: '1 - 2 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'PROF. M. MEENAKSHI',
    contactNumber: '+91 98405 12201',
    relayEmail: 'CYPHER.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Prof. M. Meenakshi', phone: '+91 98405 12201', role: 'Faculty Coordinator' },
      { name: 'Dr. T. Natarajan', phone: '+91 98406 12202', role: 'Faculty Coordinator' },
      { name: 'M. Siddarth', phone: '+91 97911 12203', role: 'Student Coordinator' },
      { name: 'P. Sneha', phone: '+91 98843 12204', role: 'Student Coordinator' }
    ],
    chipLabel: 'CYPHER',
    chipSub: 'SHA-256',
    busFreq: '200.00 MHz',
    tags: ['Cryptography', 'Algorithms', 'Coding', 'Logic', 'C/C++/Python'],
    protocols: [
      'ROUND 1 COMPRISES ENCRYPTED APTITUDE AND CODE OUTPUT DECODING CHALLENGES.',
      'ROUND 2 REQUIRES SOLVING ALGORITHMIC CIPHERS WITHIN A STRICT TIME WINDOW.',
      'ALLOWED LANGUAGES: C, C++, JAVA, AND PYTHON 3.',
      'EXTERNAL INTERNET ACCESS OR AI ASSISTANTS WILL LEAD TO DISQUALIFICATION.',
      'TIE-BREAKERS ARE RESOLVED BY EXECUTION SPEED AND SUBMISSION TIMESTAMP.'
    ]
  },
  {
    id: 'unsaid',
    moduleId: 'firmware',
    terminalId: 'UNS-03',
    day: 1,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // NON-VERBAL DEDUCTION & SYNERGY',
    title: 'UNSAID',
    quote: '"SILENCE IN THE CHANNEL. EXPRESS WITHOUT WORDS. DECODE THE SIGNAL."',
    description:
      'Test your crew synergy and lateral thinking in a high-energy communication challenge where critical clues must be conveyed without speaking forbidden keywords.',
    venue: '',
    date: 'DAY 01',
    time: '11:00 AM - 01:00 PM',
    fee: '',
    teamSize: '2 - 3 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'DR. K. ANAND',
    contactNumber: '+91 98409 13201',
    relayEmail: 'UNSAID.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Dr. K. Anand', phone: '+91 98409 13201', role: 'Faculty Coordinator' },
      { name: 'Prof. J. Hema', phone: '+91 98410 13202', role: 'Faculty Coordinator' },
      { name: 'V. Vignesh', phone: '+91 97914 13203', role: 'Student Coordinator' },
      { name: 'G. Monisha', phone: '+91 98845 13204', role: 'Student Coordinator' }
    ],
    chipLabel: 'UNSAID',
    chipSub: 'MUTE-SIG',
    busFreq: '66.67 MHz',
    tags: ['Communication', 'Synergy', 'Deduction', 'NonVerbal', 'Strategy'],
    protocols: [
      'VERBALIZING RESTRICTED TABOO WORDS OR LIP-SYNCING LETTERS IS STRICTLY PROHIBITED.',
      'EACH ROUND HAS A 90-SECOND COUNTDOWN TO DECODE MAXIMUM TARGET PROMPTS.',
      'GESTURES, VISUAL CUES, AND PERMITTED CLUE FORMATS VARY BY ROUND.',
      'PENALTY DEDUCTIONS APPLY FOR RULE INFRACTIONS OR SKIPPED CARDS.',
      'TOP SCORING SQUADS ADVANCE TO THE RAPID-FIRE SILENT FINALE.'
    ]
  },
  {
    id: 'weblica',
    moduleId: 'firmware',
    terminalId: 'WEB-04',
    day: 1,
    track: 'technical',
    category: 'TECHNICAL SYMPOSIUM // FRONTEND & UI ARCHITECTURE',
    title: 'WEBLICA',
    quote: '"FORGE SEAMLESS DIGITAL EXPERIENCES WITH MODERN WEB UX."',
    description:
      'Design and build responsive web interfaces, interactive layouts, and futuristic cyberpunk digital experiences under live sprint constraints.',
    venue: '',
    date: 'DAY 01',
    time: '01:30 PM - 03:30 PM',
    fee: '',
    teamSize: '1 - 2 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'PROF. S. REVATHI',
    contactNumber: '+91 98413 14201',
    relayEmail: 'WEBLICA.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Prof. S. Revathi', phone: '+91 98413 14201', role: 'Faculty Coordinator' },
      { name: 'Dr. E. Sudharshan', phone: '+91 98414 14202', role: 'Faculty Coordinator' },
      { name: 'L. Nithya', phone: '+91 97917 14203', role: 'Student Coordinator' },
      { name: 'D. Rahul', phone: '+91 98846 14204', role: 'Student Coordinator' }
    ],
    chipLabel: 'WEBLICA',
    chipSub: 'DOM-GRID',
    busFreq: '166.00 MHz',
    tags: ['WebDesign', 'Frontend', 'UI/UX', 'CSS', 'Responsive'],
    protocols: [
      'THEME AND WIREFRAME BRIEF WILL BE RELEASED AT KICKOFF TIME.',
      'HTML, CSS, JAVASCRIPT, AND MODERN STYLING FRAMEWORKS ARE PERMITTED.',
      'PRE-BUILT FULL TEMPLATES ARE PROHIBITED; CODE MUST BE AUTHORED ON SITE.',
      'EVALUATED ON VISUAL HIERARCHY, RESPONSIVENESS, INTERACTIVITY, AND CLEAN CODE.',
      'FINAL BUILD MUST RENDER FLAWLESSLY ON DESKTOP AND MOBILE VIEWPORTS.'
    ]
  },
  {
    id: 'x_coders',
    moduleId: 'firmware',
    terminalId: 'XCD-05',
    day: 1,
    track: 'technical',
    category: 'TECHNICAL SYMPOSIUM // EXTREME COMPETITIVE PROGRAMMING',
    title: 'X-CODERS',
    quote: '"OPTIMIZE EVERY CYCLE. CONQUER COMPLEXITY. DOMINATE THE LEADERBOARD."',
    description:
      'High-intensity competitive programming arena testing data structures, dynamic programming, debugging reflexes, and algorithmic optimization.',
    venue: '',
    date: 'DAY 01',
    time: '01:30 PM - 03:30 PM',
    fee: '',
    teamSize: '1 - 2 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'DR. P. BALAJI',
    contactNumber: '+91 98417 15201',
    relayEmail: 'XCODERS.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Dr. P. Balaji', phone: '+91 98417 15201', role: 'Faculty Coordinator' },
      { name: 'Prof. K. Deepa', phone: '+91 98418 15202', role: 'Faculty Coordinator' },
      { name: 'A. Naveen', phone: '+91 97920 15203', role: 'Student Coordinator' },
      { name: 'R. Divya', phone: '+91 98848 15204', role: 'Student Coordinator' }
    ],
    chipLabel: 'X-CODE',
    chipSub: 'ALGO-X',
    busFreq: '240.00 MHz',
    tags: ['CompetitiveCoding', 'DSA', 'Debugging', 'Algorithms', 'SpeedCode'],
    protocols: [
      'CONSISTS OF RAPID BUG-HUNTING FOLLOWED BY MULTI-TIER ALGORITHMIC CHALLENGES.',
      'SOLUTIONS ARE GRADED AUTOMATICALLY AGAINST PUBLIC AND HIDDEN TEST CASES.',
      'TIME AND SPACE COMPLEXITY CONSTRAINTS ARE STRICTLY ENFORCED.',
      'PLAGIARISM DETECTION TOOLS ARE ACTIVE ACROSS ALL SUBMISSIONS.',
      'RANKINGS ARE DETERMINED BY TOTAL SCORE AND PENALTY TIME.'
    ]
  },

  // ==========================================
  // DAY 2 (8 EVENTS)
  // ==========================================
  {
    id: 'technical_quiz',
    moduleId: 'firmware',
    terminalId: 'QZ-06',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // COGNITIVE RECALL',
    title: 'TECHNICAL QUIZ',
    quote: '"FAST RECALL. ACCURATE SYNAPSE. TRIVIA DOMINANCE."',
    description:
      'Fast-paced trivia tournament covering computing history, algorithms, operating system kernels, pop-tech lore, and logical deductions.',
    venue: '',
    date: 'DAY 02',
    time: '10:00 AM - 12:30 PM',
    fee: '',
    teamSize: '2 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'PROF. C. SURESH',
    contactNumber: '+91 98402 16201',
    relayEmail: 'QUIZ.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Prof. C. Suresh', phone: '+91 98402 16201', role: 'Faculty Coordinator' },
      { name: 'Dr. N. Gayathri', phone: '+91 98403 16202', role: 'Faculty Coordinator' },
      { name: 'K. Abishek', phone: '+91 97891 16203', role: 'Student Coordinator' },
      { name: 'M. Sandhya', phone: '+91 98842 16204', role: 'Student Coordinator' }
    ],
    chipLabel: 'QUIZ',
    chipSub: 'RAPID-FIRE',
    busFreq: '80.00 MHz',
    tags: ['Trivia', 'History', 'Knowledge', 'BrainSprint', 'CS Lore'],
    protocols: [
      'PRELIMINARY PEN-AND-PAPER ROUND SHRINKS THE FIELD TO TOP 6 CREWS.',
      'FINAL COMPRISES 4 CYCLES: DIRECT RAPID, VISUAL CIPHER, AND BUZZER GRID.',
      'NEGATIVE MARKING ENFORCED IN THE HIGH-VOLTAGE BUZZER CYCLE.',
      'USE OF SMART DEVICES OR WIRELESS TRANSCEIVERS PROVOKES INSTANT DISQUALIFICATION.',
      'QUIZMASTER VERDICT IS ABSOLUTE AND NON-NEGOTIABLE.'
    ]
  },
  {
    id: 'connections',
    moduleId: 'firmware',
    terminalId: 'CON-07',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // VISUAL SYNTHESIS',
    title: 'CONNECTIONS',
    quote: '"DECODE THE CLUES. CONNECT THE UNCONNECTED."',
    description:
      'Decode associative picture puzzles, pop culture cues, and cryptic rebuses to reveal hidden technical terminology.',
    venue: '',
    date: 'DAY 02',
    time: '11:00 AM - 01:00 PM',
    fee: '',
    teamSize: '2 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'DR. R. VASUKI',
    contactNumber: '+91 98407 17201',
    relayEmail: 'CONNECT.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Dr. R. Vasuki', phone: '+91 98407 17201', role: 'Faculty Coordinator' },
      { name: 'Prof. B. Mohan', phone: '+91 98408 17202', role: 'Faculty Coordinator' },
      { name: 'T. Sanjay', phone: '+91 97892 17203', role: 'Student Coordinator' },
      { name: 'V. Keerthana', phone: '+91 98844 17204', role: 'Student Coordinator' }
    ],
    chipLabel: 'REBUS',
    chipSub: 'ASSOCIATE',
    busFreq: '90.00 MHz',
    tags: ['Puzzles', 'Wordplay', 'Visuals', 'Cinema', 'Deduction'],
    protocols: [
      'ROUND 1: 15 VISUAL REBUS PUZZLES IN 15 MINUTES.',
      'ROUND 2: CHAIN CONNECTION WITH ESCALATING CLUE VALUES.',
      'TEAMS STRIKE DIGITAL BUZZERS TO CLAIM GUESS PRIVILEGES; 10-SECOND LIMIT.',
      'CORRECT IDENTIFICATION GRANTS +10 PTS; FALSE BUZZ INCURS A -5 PT DEDUCTION.',
      'PASSING A QUESTION TRANSFERS A 50% BONUS OPPORTUNITY TO THE NEXT CREW.'
    ]
  },
  {
    id: 'ipl_auction',
    moduleId: 'firmware',
    terminalId: 'AUC-08',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // STRATEGIC BIDDING',
    title: 'IPL AUCTION',
    quote: '"CALCULATE THE PURSE. DRAFT THE SQUAD. DOMINATE THE LEAGUE."',
    description:
      'Manage limited salary caps, strategize player acquisitions, and build a championship franchise through tense bidding rounds.',
    venue: '',
    date: 'DAY 02',
    time: '01:30 PM - 04:00 PM',
    fee: '',
    teamSize: '3 - 4 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'PROF. S. PRAVEEN',
    contactNumber: '+91 98411 18201',
    relayEmail: 'AUCTION.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Prof. S. Praveen', phone: '+91 98411 18201', role: 'Faculty Coordinator' },
      { name: 'Dr. G. Lakshmi', phone: '+91 98412 18202', role: 'Faculty Coordinator' },
      { name: 'S. Tharun', phone: '+91 97893 18203', role: 'Student Coordinator' },
      { name: 'K. Deepika', phone: '+91 98849 18204', role: 'Student Coordinator' }
    ],
    chipLabel: 'BID-SYS',
    chipSub: 'PURSE-100',
    busFreq: '110.00 MHz',
    tags: ['Cricket', 'Auction', 'Strategy', 'Purse', 'Analytics'],
    protocols: [
      'ROUND 1: WRITTEN CRICKET TRIVIA QUALIFIER SIFTS TO TOP 8 FRANCHISES.',
      'EACH QUALIFIED CREW RECEIVES 100 VIRTUAL CRORES IN BIDDING POWER.',
      'MINIMUM OF 11 PLAYERS MUST BE DRAFTED WITH PRECISE ROLE QUOTAS.',
      'BREACHING PURSE LIMITS LEADS TO PENALTY POINTS DEDUCTIONS.',
      'TEAM WITH HIGHEST OVERALL SQUAD RATING INDEX IS CROWNED CHAMPION.'
    ]
  },
  {
    id: 'opposites_attract',
    moduleId: 'firmware',
    terminalId: 'OPP-09',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // REVERSE COGNITION',
    title: 'OPPOSITES ATTRACT',
    quote: '"SAY NO WHEN YES. THINK INVERTED. KEEP YOUR COMPOSURE."',
    description:
      'Fast-reflex stage game where participants must respond with exact opposites to rapid prompts without hesitating or slipping up.',
    venue: '',
    date: 'DAY 02',
    time: '02:00 PM - 03:30 PM',
    fee: '',
    teamSize: '1 MEMBER',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'DR. N. KAVITHA',
    contactNumber: '+91 98415 19201',
    relayEmail: 'OPPOSITE.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Dr. N. Kavitha', phone: '+91 98415 19201', role: 'Faculty Coordinator' },
      { name: 'Prof. Y. Ramesh', phone: '+91 98416 19202', role: 'Faculty Coordinator' },
      { name: 'H. Varun', phone: '+91 97895 19203', role: 'Student Coordinator' },
      { name: 'B. Sowmya', phone: '+91 98850 19204', role: 'Student Coordinator' }
    ],
    chipLabel: 'INVERT',
    chipSub: 'NOT-GATE',
    busFreq: '75.00 MHz',
    tags: ['StageFun', 'Reflexes', 'Humor', 'MentalAgility', 'Rapid'],
    protocols: [
      'PARTICIPANTS MUST DELIVER ANTITHESIS RESPONSES WITHIN 1.5 SECONDS.',
      'NODDING HEAD YES WHILE SAYING NO (OR VICE VERSA) CAUSES INSTANT ELIMINATION.',
      'ROUNDS ADVANCE AT PROGRESSIVELY ACCELERATED TEMPOS.',
      'PLAYERS MUST EXECUTE OPPOSITE MOTIONS TO VERBAL COMMANDS PROMPTLY.',
      'FINALISTS SURVIVE A 60-SECOND INTENSE INQUISITION BY THE GAME MASTER.'
    ]
  },
  {
    id: 'solo_dance',
    moduleId: 'firmware',
    terminalId: 'DNC-10',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // FREESTYLE CHOREOGRAPHY',
    title: 'SOLO DANCE',
    quote: '"OWN THE SPOTLIGHT. EXPRESS THROUGH BEAT AND CADENCE."',
    description:
      'Solo performance battle across classical, western, hip-hop, or lyrical genres on the open-air auditorium stage.',
    venue: '',
    date: 'DAY 02',
    time: '03:00 PM - 05:00 PM',
    fee: '',
    teamSize: '1 MEMBER',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'PROF. S. HEMALATHA',
    contactNumber: '+91 98419 20201',
    relayEmail: 'SOLODANCE.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Prof. S. Hemalatha', phone: '+91 98419 20201', role: 'Faculty Coordinator' },
      { name: 'Dr. V. Uma', phone: '+91 98420 20202', role: 'Faculty Coordinator' },
      { name: 'S. Pooja', phone: '+91 97896 20203', role: 'Student Coordinator' },
      { name: 'K. Rithvik', phone: '+91 98851 20204', role: 'Student Coordinator' }
    ],
    chipLabel: 'DANCE',
    chipSub: 'BEAT-SYNC',
    busFreq: '120.00 BPM',
    tags: ['Dance', 'Solo', 'Cultural', 'Stage', 'Performance'],
    protocols: [
      'TIME LIMIT: 3 TO 4 MINUTES STRICT ON-STAGE PERFORMANCE.',
      'AUDIO TRACK (MP3 ON USB PENDRIVE) MUST BE SUBMITTED 1 HOUR IN ADVANCE.',
      'COSTUME PROPRIETY AND AESTHETIC INTEGRITY MANDATORY.',
      'JUDGING CRITERIA: RHYTHM, CHOREOGRAPHY, EXPRESSION, AND STAGE COMMAND.',
      'USE OF PROPS ALLOWED WITH PRIOR SCRUTINY BY CULTURAL JURY.'
    ]
  },
  {
    id: 'e_sports',
    moduleId: 'firmware',
    terminalId: 'ESP-11',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // TACTICAL GAMING ARENA',
    title: 'E-SPORTS',
    quote: '"LOCK IN YOUR LOADOUT. OUTPLAY THE LOBBY. CLAIM VICTORY."',
    description:
      'High-adrenaline competitive gaming tournament where squads and solo contenders battle across premier tactical and battle-royale arenas for ultimate supremacy.',
    venue: '',
    date: 'DAY 02',
    time: '11:00 AM - 03:30 PM',
    fee: '',
    teamSize: '1 - 4 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'PROF. R. KARTHIKEYAN',
    contactNumber: '+91 98421 22201',
    relayEmail: 'ESPORTS.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Prof. R. Karthikeyan', phone: '+91 98421 22201', role: 'Faculty Coordinator' },
      { name: 'Dr. S. Vigneshwaran', phone: '+91 98422 22202', role: 'Faculty Coordinator' },
      { name: 'M. Harish', phone: '+91 97897 22203', role: 'Student Coordinator' },
      { name: 'R. Roshini', phone: '+91 98852 22204', role: 'Student Coordinator' }
    ],
    chipLabel: 'ESPORTS',
    chipSub: 'FPS-144',
    busFreq: '144.00 Hz',
    tags: ['Esports', 'Gaming', 'Tactical', 'BattleRoyale', 'Squads'],
    protocols: [
      'PARTICIPANTS MUST BRING THEIR OWN UPDATED DEVICES, CHARGERS, AND EARPHONES.',
      'EMULATORS, TRIGGERS, THIRD-PARTY MODS, OR HACK SCRIPTS LEAD TO INSTANT BAN.',
      'CUSTOM ROOM CREDENTIALS WILL BE SHARED 10 MINUTES PRIOR TO MATCH START.',
      'TOURNAMENT BRACKETS AND POINT MATRICES FOLLOW OFFICIAL LEAGUE RULES.',
      'REFEREE AND LOBBY ADMIN DECISIONS ON DISCONNECTIONS OR FAIR PLAY ARE FINAL.'
    ]
  },
  {
    id: 'group_dance',
    moduleId: 'firmware',
    terminalId: 'DNC-11',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // SYNCHRONIZED CHOREOGRAPHY',
    title: 'GROUP DANCE',
    quote: '"ELECTRIFY THE GRID. SYNC KINETIC MOTIONS. RULE THE DANCEFLOOR."',
    description:
      'High-energy dance battle where collegiate dance crews unleash synchronized moves, thematic costumes, and explosive rhythms on the mega stage.',
    venue: '',
    date: 'DAY 02',
    time: '04:30 PM - 07:00 PM',
    fee: 'Rs 590',
    teamSize: '6 - 15 MEMBERS',
    eligibility: 'ALL COLLEGE MEMBERS',
    chiefOperator: 'MR. A. JAYAKUMAR',
    contactNumber: '+91 98403 21211',
    relayEmail: 'DANCE.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Mr. A. Jayakumar', phone: '+91 98403 21211', role: 'Faculty Coordinator' },
      { name: 'Ms. R. Subhashini', phone: '+91 98404 21212', role: 'Faculty Coordinator' },
      { name: 'K. Rohit', phone: '+91 97894 21213', role: 'Student Coordinator' },
      { name: 'S. Harshitha', phone: '+91 98847 21214', role: 'Student Coordinator' }
    ],
    chipLabel: 'KINETIC',
    chipSub: 'SYNC-12',
    busFreq: '128.00 BPM',
    isSpecial: true,
    tags: ['Dance', 'Choreography', 'Synchronized', 'Cultural', 'Mega Stage'],
    protocols: [
      'CREW SIZE: 6 TO 15 MEMBERS ON STAGE; TIME LIMIT: 5 TO 8 MINUTES STRICT.',
      'AUDIO TRACK (HIGH-BITRATE MP3) MUST BE SUBMITTED 2 HOURS BEFORE THE ACT.',
      'FIRE, WATER, SHARP WEAPONS, OR STAGE-DAMAGING MATERIALS ARE STRICTLY BANNED.',
      'SCORING BASED ON SYNCHRONIZATION, FORMATIONS, THEME, AND ENERGETIC EXECUTION.',
      'TIME OVERRUNS INCUR A DEDUCTION OF 5 MARKS PER EXTRA MINUTE.'
    ]
  },
  {
    id: 'thiruvizha_corner',
    moduleId: 'firmware',
    terminalId: 'THI-12',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // FESTIVAL CARNIVAL & FOOD KIOSKS',
    title: 'THIRUVIZHA CORNER (STALLS)',
    quote: '"TRADITIONAL CARNIVAL DELIGHTS. VIBRANT CYBER FAIR."',
    description:
      'Festive carnival zone featuring student-run cultural game booths, savory street food, craft merchandise, and interactive celebratory carnival fun.',
    venue: '',
    date: 'DAY 02',
    time: '10:00 AM - 05:00 PM',
    fee: 'Rs 690',
    teamSize: 'OPEN TO ALL',
    eligibility: 'OPEN TO ALL VISITORS',
    chiefOperator: 'MS. M. POORNIMA',
    contactNumber: '+91 98419 32312',
    relayEmail: 'STALLS.CSE@CYBERSENTINEL.IN',
    coordinators: [
      { name: 'Ms. M. Poornima', phone: '+91 98419 32312', role: 'Faculty Coordinator' },
      { name: 'Mr. V. Rajesh', phone: '+91 98420 32313', role: 'Faculty Coordinator' },
      { name: 'T. Manoj', phone: '+91 97906 32314', role: 'Student Coordinator' },
      { name: 'A. Pavithra', phone: '+91 94447 32315', role: 'Student Coordinator' }
    ],
    chipLabel: 'CARNIVAL',
    chipSub: 'FEST-2K26',
    busFreq: 'DYNAMIC',
    isSpecial: true,
    tags: ['Carnival', 'Stalls', 'Food', 'Games', 'Festival'],
    protocols: [
      'STALL OPERATORS MUST COMPLETE BOOTH SETUP BEFORE 09:30 AM ON EVENT DAY.',
      'ALL KIOSKS MUST MAINTAIN HYGIENE, WASTE SEGREGATION, AND STRICT SAFETY NORMS.',
      'DIGITAL PAYMENT QR CODES PREFERRED; CLEAR PRICE LISTS MUST BE VISIBLE.',
      'ELECTRICAL EQUIPMENT LIMITED TO 500W PER BOOTH; OPEN FIRES STRICTLY PROHIBITED.',
      'STUDENT COUNCIL CONDUCTS QUALITY AND CLEANLINESS AUDITS PERIODICALLY.'
    ]
  }
];

export const FEST_INFO = {
  name: 'CYBERSENTINEL 2K26',
  theme: 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING',
  tagline: 'ENTER THE GRID. BREAK THE CODE. SHAPE THE FUTURE.',
  introduction:
    'Cybersentinel 2K26 is a technical symposium by the Department of Computer Science and Engineering, bringing students together through technology, challenges and creativity.',
  dates: 'DAY 01 & DAY 02 // 2K26',
  venue: '',
  prizePool: 'EXCITING BOUNTIES & AWARDS',
  coordinates: '12°58\'23"N // 80°14\'11"E',
  activeNodes: 2048,
  rules: [
    'OPERATORS MUST CARRY PHYSICAL OR DIGITAL MAINFRAME PASS AT CHECK-IN.',
    'EVENTS ARE DIVIDED INTO TRACK 01 (TECHNICAL) AND TRACK 02 (NON-TECHNICAL).',
    'COLLEGE ID CARD IS MANDATORY FOR ALL PARTICIPATING MEMBERS.',
    'FAIR PLAY, ETHICAL CONDUCT, AND CREATIVE SPIRIT ARE PARAMOUNT.',
    'DECISIONS OF THE JUDGES AND CHIEF OPERATORS ARE FINAL AND BINDING.'
  ],
  tracks: [
    {
      id: 'track-01',
      number: 'TRACK 01',
      title: 'TECHNICAL',
      description:
        'Challenge your technical skills through coding, problem-solving and technology-driven competitions.',
      accent: '#ff007f',
      tag: 'SYS_CORE'
    },
    {
      id: 'track-02',
      number: 'TRACK 02',
      title: 'NON-TECHNICAL',
      description:
        'Test your creativity, strategy, communication and thinking beyond the code.',
      accent: '#9333ea',
      tag: 'CREATIVE_STRAT'
    }
  ]
};
