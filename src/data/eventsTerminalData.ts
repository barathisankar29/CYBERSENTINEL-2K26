import type { EventSpec } from '@/types/eventsTerminal';

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
    venue: 'SEMINAR HALL A / FLOOR 2',
    date: 'DAY 01 // 10:00 AM',
    time: '10:00 AM - 01:00 PM',
    fee: '₹200 / TEAM',
    teamSize: '2 - 3 MEMBERS',
    eligibility: 'ALL COLLEGE CADETS',
    chiefOperator: 'DR. S. RAGHAVAN',
    contactNumber: '+91 98401 11201',
    relayEmail: 'PAPER.CSE@CYBERSENTINEL.IN',
    chipLabel: 'PAPER',
    chipSub: 'IEEE-STD',
    busFreq: '133.00 MHz',
    tags: ['Research', 'Presentation', 'AI', 'Cloud', 'Cybersecurity'],
    protocols: [
      'PRESENTATION DURATION: 7 MINUTES FOR PRESENTATION + 3 MINUTES Q&A WITH THE JURY.',
      'SLIDES (PPT OR PDF) MUST BE SUBMITTED AT THE REPORTING DESK 30 MINUTES PRIOR.',
      'ORIGINAL RESEARCH AND CASE STUDIES PREFERRED; MAXIMUM OF 3 CADETS PER TEAM.',
      'EVALUATION CRITERIA: NOVELTY, TECHNICAL DEPTH, REAL-WORLD UTILITY, AND ORATION.',
      'PLAGIARISM EXCEEDING 15% WILL RESULT IN IMMEDIATE DISQUALIFICATION.'
    ]
  },
  {
    id: 'cypher_coding',
    moduleId: 'compete',
    terminalId: 'CYP-02',
    day: 1,
    track: 'technical',
    category: 'TECHNICAL COMPETITION // CRYPTO-ALGORITHMIC DECRYPT',
    title: 'CYPHER CODING',
    quote: '"DECRYPT THE ENIGMA. REFACTOR THE CODE. CRACK THE MATRIX."',
    description:
      'Decipher obfuscated logic puzzles, encrypted algorithms, and reverse-engineer compiled snippets under high-pressure clock decay penalties.',
    venue: 'SYSTEMS LAB 01 / BLOCK B',
    date: 'DAY 01 // 11:30 AM',
    time: '11:30 AM - 02:00 PM',
    fee: '₹150 / SOLO',
    teamSize: 'SOLO CADET',
    eligibility: 'UG / PG PROGRAMMERS',
    chiefOperator: 'PROF. N. MEENAKSHI',
    contactNumber: '+91 94451 22302',
    relayEmail: 'CYPHER.CSE@CYBERSENTINEL.IN',
    chipLabel: 'CIPHER',
    chipSub: 'SHA-256',
    busFreq: '256.00 MHz',
    tags: ['Algorithms', 'Cryptography', 'Reverse-Coding', 'Python', 'C++'],
    protocols: [
      'SOLO CADET COMPETITION; TOTAL ROUND DURATION IS STRICTLY 90 MINUTES.',
      'SUPPORTED RUNTIMES: C, C++, JAVA 17, AND PYTHON 3.11 ON TERMINALS.',
      'INTERNET ACCESS RESTRICTED TO SYSTEM COMPILER PORTAL ONLY.',
      'TIE-BREAKERS RESOLVED BY SUBMISSION TIMESTAMP AND MEMORY FOOTPRINT.',
      'UNAUTHORIZED CODE OR EXTERNAL AIDS TRIGGER IMMEDIATE AUTOMATED EXPULSION.'
    ]
  },
  {
    id: 'unsaid',
    moduleId: 'compete',
    terminalId: 'UNS-03',
    day: 1,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // NON-VERBAL EXPRESSION',
    title: 'UNSAID',
    quote: '"TRANSMIT SILENT FREQUENCIES. CONVEY WITHOUT THE CODE."',
    description:
      'Express thoughts, narratives, and unspoken perspectives through expressive acting, silent charades, and emotional articulation without vocal speech.',
    venue: 'OPEN AIR AUDITORIUM',
    date: 'DAY 01 // 01:30 PM',
    time: '01:30 PM - 03:30 PM',
    fee: '₹100 / DUO',
    teamSize: '2 OPERATORS',
    eligibility: 'OPEN TO ALL CADETS',
    chiefOperator: 'MS. K. SHALINI',
    contactNumber: '+91 97890 33403',
    relayEmail: 'UNSAID.CSE@CYBERSENTINEL.IN',
    chipLabel: 'SIGNAL',
    chipSub: 'SILENT',
    busFreq: '60.00 Hz',
    tags: ['Charades', 'Acting', 'Creativity', 'Non-Verbal', 'Expression'],
    protocols: [
      'ROUND 1: SILENT CHARADES (3 MINS); ROUND 2: VISUAL NARRATIVE (4 MINS).',
      'NO SPOKEN WORDS, WHISPERING, MOUTH FORMATIONS, OR LIP-SYNCS ALLOWED.',
      'THEMES DRAWN AT RANDOM FROM THE MAINFRAME VAULT BY THE TEAM LEAD.',
      'COMMUNICATION VIA BODY GESTURES, MIME, AND PICTORIAL ARTICULATION ONLY.',
      'DECISIONS OF THE CULTURAL JURY ARE UNCONTESTABLE.'
    ]
  },
  {
    id: 'weblica_ui_event',
    moduleId: 'compete',
    terminalId: 'WEB-04',
    day: 1,
    track: 'technical',
    category: 'TECHNICAL COMPETITION // UI/UX DESIGN & FRONTEND',
    title: 'WEBLICA (UI EVENT)',
    quote: '"PIXEL PRECISION. INTUITIVE INTERFACES. CYBERPUNK UX."',
    description:
      'Transform raw wireframe briefs into responsive, visually arresting UI/UX prototypes and retro-futuristic web designs within the time limit.',
    venue: 'WEB LAB 03 / FLOOR 1',
    date: 'DAY 01 // 02:30 PM',
    time: '02:30 PM - 05:00 PM',
    fee: '₹150 / CADET',
    teamSize: '1 - 2 DESIGNERS',
    eligibility: 'ALL DESIGN & DEV CADETS',
    chiefOperator: 'MR. R. KARTHIK',
    contactNumber: '+91 98840 44504',
    relayEmail: 'WEBLICA.CSE@CYBERSENTINEL.IN',
    chipLabel: 'LAYOUT',
    chipSub: 'UI-UX',
    busFreq: '144.00 Hz',
    tags: ['UI/UX', 'Figma', 'Frontend', 'Design', 'Web Development'],
    protocols: [
      'DESIGN TIMEFRAME IS 120 MINUTES; CHALLENGE BRIEF DISCLOSED AT KICKOFF.',
      'ALLOWED PLATFORMS: FIGMA, ADOBE XD, OR RAW HTML/CSS/TAILWIND REPOSITORIES.',
      'PRE-BUILT TEMPLATES STRICTLY PROHIBITED; FREE PUBLIC ASSETS ARE ALLOWED.',
      'EVALUATION CRITERIA: AESTHETICS, HIERARCHY, USER EXPERIENCE, AND PROTOTYPING.',
      'FINAL WORK MUST BE SUBMITTED AS A LIVE LINK OR PROJECT ARCHIVE.'
    ]
  },
  {
    id: 'x_coders',
    moduleId: 'compete',
    terminalId: 'XCD-05',
    day: 1,
    track: 'technical',
    category: 'TECHNICAL COMPETITION // DUAL-CADET SPEED CODING',
    title: 'X-CODERS',
    quote: '"OVERCLOCK YOUR LOGIC. CONQUER MULTI-STAGE DEBUGGING."',
    description:
      'A hardcore competitive coding tournament featuring bug hunting, blind coding phases, and collaborative speed algorithm challenges.',
    venue: 'MAIN CAD DOCK / LAB 02',
    date: 'DAY 01 // 03:30 PM',
    time: '03:30 PM - 06:00 PM',
    fee: '₹200 / PAIR',
    teamSize: '2 OPERATORS',
    eligibility: 'COMPETITIVE PROGRAMMERS',
    chiefOperator: 'DR. P. ANAND',
    contactNumber: '+91 98412 55605',
    relayEmail: 'XCODERS.CSE@CYBERSENTINEL.IN',
    chipLabel: 'CORE',
    chipSub: 'DUAL-OP',
    busFreq: '400.00 MHz',
    tags: ['Speed Coding', 'Debugging', 'Algorithms', 'Blind Coding', 'C++'],
    protocols: [
      'ROUND 1: BUG HUNT (30 MINS); ROUND 2: BLIND CODING (20 MINS); ROUND 3: SPEED ALGO.',
      'TEAMMATES ALTERNATE CONTROL OF THE KEYBOARD EVERY 15 MINUTES IN ROUND 3.',
      'LEADERBOARD UPDATES DYNAMICALLY UNTIL THE FINAL 10-MINUTE BLACKOUT.',
      'NO EXTERNAL CODE LIBRARIES OR UNAUTHORIZED BROWSER TABS PERMITTED.',
      'TOP SCORING SQUAD CLAIMS THE SUPREME CYBERSENTINEL TITAN TROPHY.'
    ]
  },

  // ==========================================
  // DAY 2 (7 EVENTS)
  // ==========================================
  {
    id: 'bgm',
    moduleId: 'compete',
    terminalId: 'BGM-06',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // AUDIO & SOUNDTRACK IDENTIFICATION',
    title: 'BGM',
    quote: '"IDENTIFY THE TUNE. BEAT THE CLOCK. SYNCHRONIZE YOUR EARS."',
    description:
      'Test your cinema and video game audio acuity by recognizing theme scores, background tracks, and iconic instrumental stems in seconds.',
    venue: 'AUDIO AUDITORIUM 01',
    date: 'DAY 02 // 09:30 AM',
    time: '09:30 AM - 11:30 AM',
    fee: '₹100 / CREW',
    teamSize: '2 - 3 PLAYERS',
    eligibility: 'OPEN TO ALL CADETS',
    chiefOperator: 'MS. D. PRIYA',
    contactNumber: '+91 97901 66706',
    relayEmail: 'BGM.CSE@CYBERSENTINEL.IN',
    chipLabel: 'AUDIO',
    chipSub: 'WAV-DSP',
    busFreq: '48.00 kHz',
    tags: ['Music', 'BGM', 'Trivia', 'Cinema', 'Soundtrack'],
    protocols: [
      'AUDIO STEMS PLAY FOR 5 TO 10 SECONDS ONLY THROUGH ARENA SPEAKERS.',
      'TEAMS STRIKE DIGITAL BUZZERS TO CLAIM GUESS PRIVILEGES; 10-SECOND LIMIT.',
      'CORRECT IDENTIFICATION GRANTS +10 PTS; FALSE BUZZ INCURS A -5 PT DEDUCTION.',
      'ROUNDS SPAN BLOCKBUSTER SCORES, RETRO 8-BIT THEMES, AND ANIME OST.',
      'AUDIO IDENTIFICATION APPS OR SMARTPHONES CAUSE INSTANT DISQUALIFICATION.'
    ]
  },
  {
    id: 'lyrics',
    moduleId: 'compete',
    terminalId: 'LYR-07',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // VOCAL CADENCE & LYRICS GUESS',
    title: 'LYRICS',
    quote: '"FILL THE MISSING VERSES. DECODE THE CADENCE. RULE THE MELODY."',
    description:
      'Unleash your music IQ by finishing missing song lyrics, deciphering reversed vocal recordings, and humming iconic musical hooks to victory.',
    venue: 'SEMINAR HALL B / BLOCK C',
    date: 'DAY 02 // 11:00 AM',
    time: '11:00 AM - 01:00 PM',
    fee: '₹100 / CREW',
    teamSize: '2 - 4 CADETS',
    eligibility: 'OPEN TO ALL CADETS',
    chiefOperator: 'MR. G. DINESH',
    contactNumber: '+91 98845 77807',
    relayEmail: 'LYRICS.CSE@CYBERSENTINEL.IN',
    chipLabel: 'VOCAL',
    chipSub: 'CADENCE',
    busFreq: '44.10 kHz',
    tags: ['Lyrics', 'Music', 'Vocal', 'Melody', 'Entertainment'],
    protocols: [
      'THREE ROUNDS: HOOK LINE COMPLETION, MISSING VERSE, AND REVERSE CADENCE.',
      'EACH TEAM RECEIVES 15 SECONDS TO DELIVER THE COMPLETE VERSE ACCURATELY.',
      'ACCURACY OF WORDS AND CADENCE ARE EVALUATED BY THE SCORING JUDGES.',
      'PASSING A QUESTION TRANSFERS A 50% BONUS OPPORTUNITY TO THE NEXT CREW.',
      'NO PRINTED LYRICS OR ELECTRONIC DEVICES ALLOWED IN ARENA SEATS.'
    ]
  },
  {
    id: 'connections',
    moduleId: 'compete',
    terminalId: 'CNN-08',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // PICTORIAL LOGIC & PATTERN MAPPING',
    title: 'CONNECTIONS',
    quote: '"LINK DISPARATE IMAGES. MAP HIDDEN PATTERNS. SOLVE THE MATRIX."',
    description:
      'Deduce computer science terminology, pop culture lore, and cinema titles by discovering cryptic logical connections between random pictures.',
    venue: 'ROOM 302 / MAIN BLOCK',
    date: 'DAY 02 // 12:00 PM',
    time: '12:00 PM - 02:00 PM',
    fee: '₹100 / CREW',
    teamSize: '2 - 3 OPERATORS',
    eligibility: 'OPEN TO ALL CADETS',
    chiefOperator: 'DR. M. VIJAY',
    contactNumber: '+91 94441 88908',
    relayEmail: 'CONNECTIONS.CSE@CYBERSENTINEL.IN',
    chipLabel: 'LOGIC',
    chipSub: 'LINK-MAP',
    busFreq: '100.00 MHz',
    tags: ['Trivia', 'Logic', 'Connections', 'Visual Puzzle', 'Brain Teaser'],
    protocols: [
      'PICTURE COLLAGE DISPLAYED ON ARENA PROJECTOR FOR 30 SECONDS PER QUESTION.',
      'FIRST TEAM TO ENGAGE THE BUZZER EARNS THE RIGHT TO EXPLAIN THE CONNECTION.',
      'ONE GUESS PER TEAM; WRONG ATTEMPTS OPEN THE QUESTION TO COMPETING CREWS.',
      'TOPICS COVER CSE CONCEPTS, MOVIE CULTURE, TECH LOGOS, AND HISTORIC LORE.',
      'THE DECISION OF THE MAINFRAME QUIZMASTER IS FINAL AND CONCLUSIVE.'
    ]
  },
  {
    id: 'mixed_signals',
    moduleId: 'compete',
    terminalId: 'MIX-09',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // COGNITIVE AGILITY & REFLEX DRILL',
    title: 'MIXED SIGNALS',
    quote: '"DECODE CONTRADICTORY COMMANDS. BYPASS COGNITIVE STATIC."',
    description:
      'A fast-paced reflex tournament featuring opposite action commands, Stroop effects, reverse cues, and high-intensity cognitive challenges.',
    venue: 'CENTRAL PLAZA STAGE',
    date: 'DAY 02 // 01:30 PM',
    time: '01:30 PM - 03:00 PM',
    fee: '₹50 / PLAYER',
    teamSize: 'SOLO CADET',
    eligibility: 'ALL AGES & CADETS',
    chiefOperator: 'MS. T. REVATHI',
    contactNumber: '+91 97891 99009',
    relayEmail: 'SIGNALS.CSE@CYBERSENTINEL.IN',
    chipLabel: 'SYNAPSE',
    chipSub: 'STROOP-8',
    busFreq: '120.00 Hz',
    tags: ['Reflex', 'Stroop', 'Cognitive', 'Agility', 'Mind Games'],
    protocols: [
      'PLAYERS MUST EXECUTE OPPOSITE MOTIONS TO VERBAL COMMANDS PROMPTLY.',
      'KNOCKOUT ELIMINATION FORMAT: A SINGLE ERROR LEADS TO DIRECT EXIT.',
      'COMMAND PACING ACCELERATES EVERY 60 SECONDS TO HEIGHTEN PRESSURE.',
      'FINAL ROUND INVOLVES FLASHING STROBE LIGHTS AND AUDITORY DISTRACTIONS.',
      'ON-STAGE REFEREE VERDICTS ARE DECLARED INSTANTANEOUSLY.'
    ]
  },
  {
    id: 'talentshow',
    moduleId: 'compete',
    terminalId: 'TLT-10',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // CULTURAL VARIETY & TALENT ARENA',
    title: 'TALENTSHOW',
    quote: '"OWN THE SPOTLIGHT. EXHIBIT YOUR CRAFT. ILLUMINATE THE STAGE."',
    description:
      'Showcase your distinct artistic mastery—standup comedy, beatboxing, instrumental music, mimicry, or theatrical performances before an enthusiastic audience.',
    venue: 'MAIN AUDITORIUM / STAGE 1',
    date: 'DAY 02 // 02:30 PM',
    time: '02:30 PM - 05:00 PM',
    fee: '₹150 / ENTRY',
    teamSize: 'SOLO OR GROUP (1 - 4)',
    eligibility: 'ALL ENROLLED CADETS',
    chiefOperator: 'PROF. S. HEMALATHA',
    contactNumber: '+91 98842 10110',
    relayEmail: 'TALENT.CSE@CYBERSENTINEL.IN',
    chipLabel: 'TALENT',
    chipSub: 'CREATIVE',
    busFreq: '1080p-60',
    tags: ['Talent', 'Comedy', 'Music', 'Beatbox', 'Stage Performance'],
    protocols: [
      'MAXIMUM PERFORMANCE DURATION: 4 MINUTES + 1 MINUTE STAGE SETUP.',
      'NO OBSCENE, CONTROVERSIAL, OR DEFAMATORY SCRIPTS PERMITTED ON STAGE.',
      'BACKGROUND TRACKS MUST BE SUBMITTED VIA USB TO SOUND CREW 1 HOUR PRIOR.',
      'PROPS ARE ALLOWED BUT MUST BE VACATED IMMEDIATELY POST-PERFORMANCE.',
      'JUDGING CRITERIA: STAGE CONFIDENCE, ORIGINALITY, AUDIENCE RESPONSE, AND SKILL.'
    ]
  },
  {
    id: 'group_dance',
    moduleId: 'compete',
    terminalId: 'DNC-11',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // SYNCHRONIZED CHOREOGRAPHY',
    title: 'GROUP DANCE',
    quote: '"ELECTRIFY THE GRID. SYNC KINETIC MOTIONS. RULE THE DANCEFLOOR."',
    description:
      'High-energy dance battle where collegiate dance crews unleash synchronized moves, thematic costumes, and explosive rhythms on the mega stage.',
    venue: 'OPEN AIR MEGA STAGE',
    date: 'DAY 02 // 04:30 PM',
    time: '04:30 PM - 07:00 PM',
    fee: '₹500 / CREW',
    teamSize: '6 - 15 CADETS',
    eligibility: 'COLLEGE DANCE SQUADS',
    chiefOperator: 'MR. A. JAYAKUMAR',
    contactNumber: '+91 98403 21211',
    relayEmail: 'DANCE.CSE@CYBERSENTINEL.IN',
    chipLabel: 'KINETIC',
    chipSub: 'SYNC-12',
    busFreq: '128.00 BPM',
    tags: ['Dance', 'Choreography', 'Synchronized', 'Cultural', 'Mega Stage'],
    protocols: [
      'CREW SIZE: 6 TO 15 CADETS ON STAGE; TIME LIMIT: 5 TO 8 MINUTES STRICT.',
      'AUDIO TRACK (HIGH-BITRATE MP3) MUST BE SUBMITTED 2 HOURS BEFORE THE ACT.',
      'FIRE, WATER, SHARP WEAPONS, OR STAGE-DAMAGING MATERIALS ARE STRICTLY BANNED.',
      'SCORING BASED ON SYNCHRONIZATION, FORMATIONS, THEME, AND ENERGETIC EXECUTION.',
      'TIME OVERRUNS INCUR A DEDUCTION OF 5 MARKS PER EXTRA MINUTE.'
    ]
  },
  {
    id: 'thiruvizha_corner',
    moduleId: 'compete',
    terminalId: 'THI-12',
    day: 2,
    track: 'non_technical',
    category: 'NON-TECHNICAL TRACK // FESTIVAL CARNIVAL & FOOD KIOSKS',
    title: 'THIRUVIZHA CORNER (STALLS)',
    quote: '"TRADITIONAL CARNIVAL DELIGHTS. VIBRANT CYBER FAIR."',
    description:
      'Festive carnival zone featuring student-run cultural game booths, savory street food, craft merchandise, and interactive celebratory carnival fun.',
    venue: 'FESTIVAL QUADRANGLE / GROUND',
    date: 'DAY 02 // ALL DAY',
    time: '10:00 AM - 05:00 PM',
    fee: 'FREE ENTRY / STALL CHARGES',
    teamSize: 'OPEN TO ALL',
    eligibility: 'OPEN TO ALL VISITORS',
    chiefOperator: 'MS. M. POORNIMA',
    contactNumber: '+91 98419 32312',
    relayEmail: 'STALLS.CSE@CYBERSENTINEL.IN',
    chipLabel: 'CARNIVAL',
    chipSub: 'FAIR-FEST',
    busFreq: 'FEST-DAY',
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
    'CYBERSENTINEL 2K26 is a technical symposium by the Department of Computer Science and Engineering, bringing students together through technology, challenges and creativity.',
  dates: 'DAY 01 & DAY 02 // 2K26',
  venue: 'DEPT. OF COMPUTER SCIENCE & ENGINEERING',
  prizePool: 'EXCITING BOUNTIES & AWARDS',
  coordinates: '12°58\'23"N // 80°14\'11"E',
  activeNodes: 2048,
  rules: [
    'OPERATORS MUST CARRY PHYSICAL OR DIGITAL MAINFRAME PASS AT CHECK-IN.',
    'EVENTS ARE DIVIDED INTO TRACK 01 (TECHNICAL) AND TRACK 02 (NON-TECHNICAL).',
    'COLLEGE ID CARD IS MANDATORY FOR ALL PARTICIPATING CADETS.',
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
