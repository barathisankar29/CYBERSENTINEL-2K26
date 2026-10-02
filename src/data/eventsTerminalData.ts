import type { Coordinator, EventSpec } from '@/types/eventsTerminal';

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

/** Student coordinator: name, year of study, and 10-digit mobile number. */
const coordinator = (name: string, year: string, mobile?: string): Coordinator => ({
  name,
  role: `${year} YEAR // STUDENT COORDINATOR`,
  phone: mobile ? `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}` : undefined
});

/**
 * Event details from the organizers' official sheet
 * (CYBERSENTINEL2K26_SYMPOSIUM_EVENT_DETAILS.pdf): descriptions, timings,
 * rules and coordinators. `quote`, `chipLabel` and `chipSub`
 * are the terminal design's decorative flavour text only.
 */
export const ALL_EVENTS: EventSpec[] = [
  // ==========================================
  // DAY 1 — TECHNICAL EVENTS (5)
  // ==========================================
  {
    id: 'paper_presentation',
    moduleId: 'firmware',
    day: 1,
    track: 'technical',
    title: 'PAPER PRESENTATION',
    quote: '"PRESENT INNOVATIVE IDEAS. REDEFINE THE COMPUTING HORIZON."',
    description:
      'A paper presentation event is a place where participants showcase their research, ideas, or innovations through structured presentations. It allows knowledge sharing, critical discussions, and evaluation by experts.',
    date: 'DAY 01',
    time: '10:30 AM - 02:00 PM',
    teamSize: 'UP TO 4 MEMBERS',
    coordinators: [
      coordinator('Dhanalakshmi', '4TH', '9345758749'),
      coordinator('Mohammed Sameer', '4TH', '6379532756'),
      coordinator('Balaji M', '3RD', '6380399891'),
      coordinator('Rishikesh R', '3RD', '8778286011'),
      coordinator('Nithish Kumar', '2ND', '9962861163'),
      coordinator('Hema N', '2ND', '8220930218')
    ],
    chipLabel: 'PAPER',
    chipSub: 'IEEE-STD',
    protocols: [
      'Adhere to formatting requirements, including font size, margins, referencing style, and page limits.',
      'Present within the strict 5-7 minute time limit. Practice to ensure concise delivery.',
      'The number of slides in the PPT should be between 8 to 15, keeping a professional structure and flow.',
      'Use clear, well-organized slides or visuals to support your content.',
      'Maintain professional behavior: dress appropriately, use formal language, and avoid jargon.',
      'Be polite and professional when answering questions during the Q&A session.',
      'Each team can have a maximum of 4 members.',
      'The PPTs should be uploaded in the given drive link on or before 17th September.'
    ]
  },
  {
    id: 'unsaid',
    moduleId: 'firmware',
    day: 1,
    track: 'technical',
    title: 'UNSAID',
    quote: '"SILENCE IN THE CHANNEL. EXPRESS WITHOUT WORDS. DECODE THE SIGNAL."',
    description:
      '"Unsaid" is a fun team-based guessing game where one participant gives indirect and creative hints while the other decodes the answer. Featuring gadgets, electronics, and CSE-related terms, it tests communication, creativity, understanding, and presence of mind.',
    date: 'DAY 01',
    time: '10:30 AM - 11:30 AM',
    teamSize: '2 MEMBERS',
    coordinators: [
      coordinator('Rysha', '4TH', '9976753919'),
      coordinator('Jaya Swetha', '4TH', '8098037604'),
      coordinator('Carlin Stephen', '3RD', '7305953834'),
      coordinator('Kaaviya Shri', '3RD', '8124678783'),
      coordinator('Jayashree P', '2ND', '8870172622'),
      coordinator('Ranjeev', '2ND', '9789008691')
    ],
    chipLabel: 'UNSAID',
    chipSub: 'MUTE-SIG',
    protocols: [
      'The Describer should not use the actual word or any part of the word.',
      'The words to be guessed may belong to categories such as Computer Science terms (e.g., Algorithm, Cache, Python) and common electronic items.',
      'Try to guess as many items as possible within the time!'
    ]
  },
  {
    id: 'cypher_coding',
    moduleId: 'firmware',
    day: 1,
    track: 'technical',
    title: 'CIPHER CODING',
    quote: '"DECRYPT THE LOGIC. CRACK THE CIPHER. COMPILE UNDER PRESSURE."',
    description:
      '"Cipher Coding" is a competitive technical event combining cryptography, logical reasoning, and programming. Participants solve encrypted clues, coding challenges, and puzzles to unlock a secret PIN, with speed and accuracy determining the winner.',
    date: 'DAY 01',
    time: '11:30 AM - 12:30 PM',
    teamSize: '2 MEMBERS',
    coordinators: [
      coordinator('Yogesh D', '4TH', '8667221703'),
      coordinator('Santhiya', '4TH', '8778719518'),
      coordinator('Sivagnanam C M', '3RD'),
      coordinator('Kalaiyarasan', '3RD', '6383458069'),
      coordinator('Naveen R J', '2ND', '8838654116'),
      coordinator('Chandrika', '2ND', '8838402582')
    ],
    chipLabel: 'CIPHER',
    chipSub: 'SHA-256',
    protocols: [
      'Participants can compete in teams of 2, as specified by the organizers.',
      'Challenges must be solved in the given order; skipping levels is not allowed.',
      'Each solved challenge reveals a digit or part of the PIN required for the next level.',
      'Participants must complete all challenges within the time limit announced by the organizers.',
      'Use of external AI tools, online forums, or pre-written code/resources is strictly prohibited.',
      'Sharing answers, PIN digits, code, or solutions with other participants will lead to immediate disqualification.',
      'If multiple teams finish successfully, the team completing the final stage in the shortest total time will be considered the winner.'
    ]
  },
  {
    id: 'weblica',
    moduleId: 'firmware',
    day: 1,
    track: 'technical',
    title: 'WEBLICA',
    quote: '"FORGE SEAMLESS DIGITAL EXPERIENCES WITH MODERN WEB UX."',
    description:
      '"Weblica" is a creative web development event where participants recreate a given user interface with accuracy and creativity. They will be evaluated on design, layout, responsiveness, visual elements, and overall implementation within the given time.',
    date: 'DAY 01',
    time: '01:15 PM - 02:15 PM',
    teamSize: 'SOLO OR TEAM',
    coordinators: [
      coordinator('Sai Guru', '4TH', '7550177315'),
      coordinator('Aswathy', '4TH', '9566052452'),
      coordinator('Barathi Sankar M', '3RD', '6374834081'),
      coordinator('Jeevadharani V G', '3RD', '9444466435'),
      coordinator('Chaithra', '2ND', '6383391983'),
      coordinator('Thirunavukarasu', '2ND', '9363492223')
    ],
    chipLabel: 'WEBLICA',
    chipSub: 'DOM-GRID',
    protocols: [
      'Participants can compete individually or in teams as specified by the organizers.',
      'Participants must recreate the given user interface as accurately as possible.',
      'The complete task must be finished within the time limit announced by the organizers.',
      'The layout, spacing, typography, images, colors, and other visual elements should closely match the given reference.',
      "Participants must create the interface themselves; copying another participant's work is not allowed.",
      "Use of unauthorized external resources, AI tools, templates, or pre-written code is subject to the organizers' rules.",
      "The interface will be judged based on accuracy, functionality, responsiveness, and overall presentation, and the judges' decision will be final."
    ]
  },
  {
    id: 'x_coders',
    moduleId: 'firmware',
    day: 1,
    track: 'technical',
    title: 'XCODERS',
    quote: '"DECIPHER THE SYNTAX. DECODE THE PROBLEM. COMPILE THE SOLUTION."',
    description:
      '"Xcoders" is a fun technical coding challenge where participants decipher problem statements written in quirky programming languages like Rajini++ or Chef. Using the given syntax, they must understand the problem and decode a solution in C, C++, Python, or Java.',
    date: 'DAY 01',
    time: '02:15 PM - 03:15 PM',
    teamSize: '1 MEMBER',
    coordinators: [
      coordinator('Tarun', '4TH', '7200997939'),
      coordinator('Mahesh', '4TH', '7558132727'),
      coordinator('Sabarish', '3RD', '9080155602'),
      coordinator('Mukesh Sivaji', '3RD', '9025798985'),
      coordinator('Jayasurya', '2ND', '9080634638'),
      coordinator('Shreenidhi S', '2ND', '7358979516')
    ],
    chipLabel: 'X-CODE',
    chipSub: 'RAJINI++',
    protocols: [
      'Each team should have 1 member.',
      'Each team will receive 3 problem statements written in a fancy programming language such as Rajini++ or Chef.',
      'Participants must decipher the given syntax and understand the problem statement.',
      'Each member will take turns solving 1 question within 10 minutes.',
      'Solutions can be written in C, C++, Python, or Java.',
      'Participants must submit a working program that produces the required output.',
      'Total time given: 30 minutes.'
    ]
  },

  // ==========================================
  // DAY 2 — NON-TECHNICAL EVENTS (5 + 2 SPECIAL)
  // ==========================================
  {
    id: 'group_dance',
    moduleId: 'firmware',
    day: 2,
    track: 'non_technical',
    title: 'GROUP DANCE',
    quote: '"ELECTRIFY THE GRID. SYNC KINETIC MOTIONS. RULE THE DANCEFLOOR."',
    description:
      '"Group Dance" is a vibrant event where rhythm, energy, and teamwork come together. Participants will showcase their creativity, synchronization, expressions, and unique choreography through an energetic team performance.',
    date: 'DAY 02',
    time: '10:30 AM - 03:30 PM',
    teamSize: '4 - 8 MEMBERS',
    coordinators: [
      coordinator('Amretha A K', '4TH', '9176447166'),
      coordinator('Dravidraju', '4TH', '9487957125'),
      coordinator('Aditya P S', '3RD', '9363972364'),
      coordinator('Manoj P', '3RD', '9345632035'),
      coordinator('Jayashree M', '2ND', '8270068022'),
      coordinator('Sriram M', '2ND', '8608041222')
    ],
    chipLabel: 'KINETIC',
    chipSub: 'SYNC-08',
    isSpecial: true,
    protocols: [
      'Team Size: Minimum 4, Maximum 8 participants.',
      'Time Limit: 4 to 7 minutes. Exceeding time leads to negative marking.',
      'The song should be strictly submitted 1 week before the day of the event. Bring a backup on a USB drive.',
      'Dress Code: Costumes should be decent and stage-appropriate. Vulgarity is not tolerated.',
      'No offensive lyrics or gestures permitted.',
      'Scoring Parameters: Choreography & Creativity, Theme Interpretation, Synchronization & Energy, Costume, Expressions, Stage Usage.'
    ]
  },
  {
    id: 'talent_show',
    moduleId: 'firmware',
    day: 2,
    track: 'non_technical',
    title: 'SPOTLIGHT',
    quote: '"OWN THE STAGE. ONE PERFORMER. ALL EYES ON YOU."',
    description:
      '"Spotlight" is an exciting solo talent show where participants showcase their unique talents and abilities. From singing and dancing to acting, mimicry, or storytelling, it celebrates creativity, confidence, and individuality.',
    date: 'DAY 02',
    time: '10:30 AM - 03:30 PM',
    teamSize: '1 MEMBER',
    coordinators: [
      coordinator('Monika Prasad', '4TH', '7305628273'),
      coordinator('Ribaya', '4TH', '6383496073'),
      coordinator('Sasidharan', '3RD', '7708151802'),
      coordinator('Princy', '3RD', '6374830226'),
      coordinator('Vijay Anand', '2ND', '8148498259'),
      coordinator('Kousalya', '2ND', '9360212289')
    ],
    chipLabel: 'SPOTLIGHT',
    chipSub: 'SOLO-01',
    protocols: [
      'Participation is individual.',
      'Each participant will get a fixed time limit for their performance.',
      'Participants can showcase any suitable talent such as singing, dancing, acting, mimicry, storytelling, beatboxing, or other creative talents.',
      'The performance must be appropriate for the institution and audience.',
      'Vulgar, offensive, or inappropriate content is strictly prohibited.',
      'Participants must arrange and submit any background music or required audio before the event, if needed.',
      'Participants should be ready at the venue before their allotted performance time.',
      'Performances will be judged based on talent, creativity, confidence, stage presence, and overall performance.',
      'The decision of the judges will be final and binding.'
    ]
  },
  {
    id: 'connections',
    moduleId: 'firmware',
    day: 2,
    track: 'non_technical',
    title: 'CONNECTIONS',
    quote: '"DECODE THE CLUES. CONNECT THE UNCONNECTED."',
    description:
      '"Connections" is a visual guessing game where teams identify the hidden link between a set of images related to a movie or song. It tests observation, memory, quick thinking, entertainment knowledge, and teamwork.',
    date: 'DAY 02',
    time: '10:30 AM - 11:30 AM',
    teamSize: '2 - 3 MEMBERS',
    coordinators: [
      coordinator('Arun R', '4TH', '8015064450'),
      coordinator('Lakshanika', '4TH', '7305872675'),
      coordinator('Asmitha P', '3RD', '9360172652'),
      coordinator('Akshaya J', '3RD', '9362516589'),
      coordinator('Swathi Priya', '2ND', '9791087746'),
      coordinator('Gokul Hari', '2ND', '8072706708')
    ],
    chipLabel: 'REBUS',
    chipSub: 'ASSOCIATE',
    protocols: [
      'Team size: 2-3 members.',
      'The event will consist of two or more rounds.',
      'Participants should answer within the given time limit for each round.',
      'Use of external help or internet sources is prohibited.',
      'The team with the highest cumulative score across all rounds will be declared the winner.'
    ]
  },
  {
    id: 'bgm',
    moduleId: 'firmware',
    day: 2,
    track: 'non_technical',
    title: 'FIND THE BGM',
    quote: '"HEAR THE BEAT. NAME THE SCENE. BEAT THE CLOCK."',
    description:
      '"Find the BGM" is a music-based event where teams identify a movie or song from a background music clip. It tests musical memory, attentiveness, movie and music knowledge, and quick thinking.',
    date: 'DAY 02',
    time: '11:30 AM - 12:30 PM',
    teamSize: '2 - 3 MEMBERS',
    coordinators: [
      coordinator('Dipika G', '4TH', '9080505979'),
      coordinator('Vilfin', '4TH', '6369534894'),
      coordinator('Sudharshan', '3RD', '7010329140'),
      coordinator('Thoufiq Ahmed', '3RD', '8712334495'),
      coordinator('Aswathy R', '2ND', '7012546245'),
      coordinator('Srisabari', '2ND', '7338950441')
    ],
    chipLabel: 'BGM',
    chipSub: 'AUDIO-FX',
    protocols: [
      'Each team should consist of 2-3 members.',
      'The event will consist of multiple rounds with increasing difficulty levels.',
      'Participants will listen to short instrumental clips and should identify the movie or show.',
      'Answers should be given within the given time after the clip is played.',
      'Use of mobile phones or any external help is strictly prohibited.',
      'The participant or team with the highest number of correct answers wins.'
    ]
  },
  {
    id: 'mixed_signals',
    moduleId: 'firmware',
    day: 2,
    track: 'non_technical',
    title: 'MIXED SIGNALS',
    quote: '"CANNOT SEE. CANNOT SPEAK. CANNOT HEAR. STILL IN SYNC."',
    description:
      '"Mixed Signals" is a team-based challenge where participants overcome different communication barriers to solve a given task. It tests teamwork, creativity, coordination, communication, and presence of mind within a limited time.',
    date: 'DAY 02',
    time: '01:15 PM - 02:15 PM',
    teamSize: '3 MEMBERS',
    coordinators: [
      coordinator('Ahamed Bassam', '4TH', '9043058272'),
      coordinator('Prathish', '4TH', '7708832955'),
      coordinator('Madumitha P', '3RD', '9360171606'),
      coordinator('Kannan', '3RD', '8072509218'),
      coordinator('Delli Babu D', '2ND', '7418893241'),
      coordinator('Hemadheekshana', '2ND', '9345442352')
    ],
    chipLabel: 'SIGNAL',
    chipSub: 'NOISE-3X',
    protocols: [
      'Each team must consist of 3 participants.',
      'Each participant will be assigned one role: cannot see, cannot speak, or cannot hear.',
      'Participants must remain in their assigned roles throughout the round.',
      'The team must communicate and coordinate using the methods available to them.',
      'The team must identify the given answer within the allotted time.',
      'Participants are not allowed to use mobile phones or external help.',
      'No participant is allowed to reveal the answer directly to another teammate.',
      'The team with the highest number of correct answers will be declared the winner.',
      'The decision of the organizers/judges will be final and binding.'
    ]
  },
  {
    id: 'lyrics',
    moduleId: 'firmware',
    day: 2,
    track: 'non_technical',
    title: 'LOST IN LYRICS',
    quote: '"LOST IN TRANSLATION. FOUND IN THE MELODY."',
    description:
      '"Lost in Lyrics" is a music-based team event where participants identify the original song from translated lyrics. It tests their knowledge of songs, lyrical understanding, memory, and quick thinking.',
    date: 'DAY 02',
    time: '02:15 PM - 03:15 PM',
    teamSize: '2 - 3 MEMBERS',
    coordinators: [
      coordinator('Vishnuram', '4TH', '8122647340'),
      coordinator('Karthik D', '4TH', '8015134123'),
      coordinator('Lathika M', '3RD', '9498349379'),
      coordinator('Sezhiyan', '3RD', '9363342906'),
      coordinator('Maheshwaran', '2ND', '6382892862'),
      coordinator('Rohith V', '2ND', '8825401330')
    ],
    chipLabel: 'LYRICS',
    chipSub: 'TRANSLATE',
    protocols: [
      'Each team must consist of 2-3 participants.',
      'A translated version of a song lyric will be displayed to the participants.',
      'Teams must identify the original song based on the translated lyrics.',
      'Each team must give their answer within the given time limit.',
      'Participants are not allowed to use mobile phones or external help.',
      'Each correct answer will be awarded points.',
      'The team with the highest score will be declared the winner.',
      'The decision of the organizers/judges will be final and binding.'
    ]
  },
  {
    // Mystery event: included in the Day 2 pass; game, format, timing and
    // coordinators not decided yet (backend row: code ES, 1-player placeholder).
    id: 'e_sports',
    moduleId: 'firmware',
    day: 2,
    track: 'non_technical',
    title: 'E-SPORTS',
    quote: '"THE ARENA IS SET. THE GAME IS A SECRET."',
    description:
      'E-Sports is the mystery event of Day 2. The game, format and team size will be revealed soon. It is included with every Day 2 and combo pass.',
    date: 'DAY 02',
    time: 'TO BE ANNOUNCED',
    teamSize: 'TO BE ANNOUNCED',
    coordinators: [],
    chipLabel: 'MYSTERY',
    chipSub: '???',
    protocols: [
      'The game, format and team size will be announced soon.',
      'Included with every Day 2 and combo pass; no separate fee.'
    ]
  },
  {
    id: 'thiruvizha_corner',
    moduleId: 'firmware',
    day: 2,
    track: 'non_technical',
    title: 'THIRUVIZHA CORNER',
    quote: '"TRADITIONAL CARNIVAL DELIGHTS. VIBRANT CYBER FAIR."',
    description:
      '"Thiruvizha Corner" is a vibrant space where culture, creativity, and entrepreneurship come together. Participants can set up stalls to showcase or sell food, traditional items, arts, crafts, accessories, Henna art, and more.',
    date: 'DAY 02',
    time: '10:30 AM - 03:30 PM',
    teamSize: 'UP TO 3 PER STALL',
    coordinators: [
      coordinator('Nihitha T', '4TH', '9962328881'),
      coordinator('Devdharshan', '4TH', '8122126781'),
      coordinator('Ayaanar', '4TH', '8428679698'),
      coordinator('Suban', '3RD', '7358302865'),
      coordinator('Jayasurya J J', '3RD', '7825987988'),
      coordinator('Sruthi Priya', '2ND', '9791087746'),
      coordinator('Karthikeyan', '2ND', '8015844556')
    ],
    chipLabel: 'CARNIVAL',
    chipSub: 'FEST-2K26',
    isSpecial: true,
    protocols: [
      'Max 3 members per stall.',
      'All materials must be brought by participants.',
      'Decorate stalls in a traditional/festive style.',
      'No inappropriate or restricted items allowed.',
      'Maintain cleanliness and eco-friendly practices.',
      'Stalls must be ready 30 minutes before the event starts.'
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
    'EVENTS ARE DIVIDED INTO TRACK 01 (TECHNICAL), TRACK 02 (NON-TECHNICAL), AND TRACK 03 (SPECIAL EVENTS).',
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
    },
    {
      id: 'track-03',
      number: 'TRACK 03',
      title: 'SPECIAL EVENTS',
      description:
        'Celebrate culture, stage performance, and traditional carnival vibes with our marquee special events.',
      accent: '#5fa07a',
      tag: 'SPECIAL_GRID'
    }
  ]
};
