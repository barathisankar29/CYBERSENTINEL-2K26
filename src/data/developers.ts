export interface DeveloperMember {
  id: string
  name: string
  role: string
  codename: string
  badgeShape: 'diamond-magenta' | 'triangle-yellow' | 'triangle-cyan' | 'diamond-purple' | 'hexagon-green' | 'shard-crimson'
  themeColor: 'magenta' | 'yellow' | 'cyan' | 'purple' | 'green' | 'crimson'
  accentHex: string
  secondaryHex: string
  avatar: string
  description: string
  skills: string[]
  metrics: {
    label: string
    value: string
  }[]
  slogan?: string
  sloganLines?: string[]
  github?: string
  linkedin?: string
  instagram?: string
}

export interface FrontendDeveloperMember {
  id: string
  name: string
  nameColor: string
  textColor: string
  image: string
  role: string
  description: string
  linkedinUrl?: string
  githubUrl?: string
}

export const frontendDevelopersData: FrontendDeveloperMember[] = [
  {
    id: 'fed-pranith-l',
    name: 'PRANITH L',
    nameColor: '#FF0088', // Vibrant hot magenta / pink
    textColor: '#00B4FF', // Electric neon cyan / blue
    image: '/assets/developers/frontend_pranith.png',
    role: 'Lead Architect & Tech Director',
    description:
      'I see design as a mix of logic, creativity, and curiosity. I enjoy turning simple ideas into thoughtful interfaces where every detail has a reason and every screen has a little personality.',
    linkedinUrl: 'https://www.linkedin.com/in/pranithl/',
    githubUrl: 'https://github.com/pranithl',
  },
  {
    id: 'fed-jeevadharani',
    name: 'JEEVADHARANI VG',
    nameColor: '#FFAE00', // Amber / golden yellow-orange
    textColor: '#FF007F', // Vibrant neon pink / magenta
    image: '/assets/developers/frontend_jeevadharani.png',
    role: 'Lead UI/UX & Frontend Engineer',
    description:
      'I chase ideas where imagination meets the screen, shaping raw thoughts into visual poetry. With every pixel, I build a little universe—where colors whisper, shapes breathe, and creativity takes form. ',
    linkedinUrl: 'www.linkedin.com/in/jeevadharani-venkatesan-916173332',
    githubUrl: 'https://github.com/Jeevadharani2403',
  },
  {
    id: 'fed-barathi-sankar',
    name: 'BARATHI SANKAR M',
    nameColor: '#FFEE00', // Bright neon yellow
    textColor: '#C800FF', // Vivid neon purple/violet
    image: '/assets/developers/frontend_barathi.png',
    role: 'Frontend & Motion Engineer',
    description:
      'Part designer, part pixel menace. I make interfaces look so good, even the blank canvas gets jealous. Turning caffeine-fueled chaos into designs that hit different.',
    linkedinUrl: 'https://www.linkedin.com/in/barathi-sankar-b2737a32b/',
    githubUrl: 'https://github.com/barathisankar29',
  },
]

export const backendDevelopersData: DeveloperMember[] = [
  {
    id: 'dev-core-engineer',
    name: 'YUVARAJ G',
    role: 'Core Systems & Backend Dev',
    codename: 'DEV_01 // SYSTEM_CORE',
    badgeShape: 'triangle-yellow',
    themeColor: 'yellow',
    accentHex: '#facc15',
    secondaryHex: '#a855f7',
    avatar: '/assets/characters/Dr_Dacre.webp',
    slogan: 'Purpose Meets Aesthetic',
    sloganLines: ['Purpose', 'Meets', 'Aesthetic'],
    description:
      'Engineered backend integration, real-time event verification APIs, registration state machines, and high-security credential validation.',
    skills: ['Node.js', 'Express', 'Cloudflare', 'REST APIs', 'Supabase'],
    metrics: [
      { label: 'LATENCY', value: '<18ms' },
      { label: 'UPTIME', value: '99.9%' },
      { label: 'LEVEL', value: 'L5 CORE' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  },
  {
    id: 'dev-security-engineer',
    name: 'DINESH J',
    role: 'Security & Infrastructure Dev',
    codename: 'DEV_02 // CYBER_DEFENSE',
    badgeShape: 'hexagon-green',
    themeColor: 'green',
    accentHex: '#10b981',
    secondaryHex: '#06b6d4',
    avatar: '/assets/developers/placeholder_dinesh.webp',
    slogan: 'Zero Trust Guard.',
    sloganLines: ['Zero', 'Trust', 'Guard.'],
    description:
      'Guarded system integrity with rate-limiting protocols, hardened data sanitization pipelines, and optimized asset delivery caching.',
    skills: ['Cyber Security', 'DevOps', 'Docker', 'Vercel Edge', 'Audit'],
    metrics: [
      { label: 'FIREWALL', value: 'MAX SEC' },
      { label: 'AUTH', value: 'ZERO TRUST' },
      { label: 'THREAT', value: '0 LEAKS' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  },
  {
    id: 'dev-cloud-engineer',
    name: 'RENGANAATHAN L',
    role: 'Cloud Systems & Database Dev',
    codename: 'DEV_03 // CLOUD_ENGINE',
    badgeShape: 'diamond-purple',
    themeColor: 'purple',
    accentHex: '#c084fc',
    secondaryHex: '#7c3aed',
    avatar: '/assets/characters/Cosma.webp',
    slogan: 'Depth Meets Reality.',
    sloganLines: ['Depth', 'Meets', 'Reality.'],
    description:
      'Masterminded low-latency database queries, cloud telemetry queues, serverless endpoints, and high-availability data infrastructure.',
    skills: ['PostgreSQL', 'Redis', 'Cloud Run', 'Microservices', 'GraphQL'],
    metrics: [
      { label: 'QPS', value: '10K+' },
      { label: 'CACHE HIT', value: '99.4%' },
      { label: 'PRECISION', value: 'ACID' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  },
]

export const developersData: DeveloperMember[] = [
  {
    id: 'dev-pranith-l',
    name: 'PRANITH L',
    role: 'Lead Architect & Tech Director',
    codename: 'DEV_01 // CHIEF_ARCHITECT',
    badgeShape: 'triangle-cyan',
    themeColor: 'cyan',
    accentHex: '#00f0ff',
    secondaryHex: '#3b82f6',
    avatar: '/assets/developers/frontend_pranith.png',
    slogan: 'Built to Be Seen.',
    sloganLines: ['Built to', 'Be Seen.'],
    description:
      'Chief architect orchestrating the reactive state ecosystem, 3D viewport pipelines, and core system telemetry of CyberSentinel 2K26.',
    skills: ['React 19', 'TypeScript', 'Three.js', 'Vite', 'Architecture'],
    metrics: [
      { label: 'PIPELINE', value: '60 FPS' },
      { label: 'COMMITS', value: '1.4K+' },
      { label: 'STATUS', value: 'LEAD' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  },
  ...backendDevelopersData,
]
