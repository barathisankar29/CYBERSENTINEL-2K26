export interface StatItem {
  label: string
  value: string
}

export interface ClubMember {
  name: string
  role: string
  color: 'cyan' | 'pink' | 'green' | 'orange' | 'yellow' | 'purple'
}

export interface PatronItem {
  name: string
  role: string
  designation: string
  image: string
  accentColor?: string
}

export const collegeData = {
  name: 'Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College',
  shortName: 'Vel Tech High Tech',
  established: '2002',
  affiliation: 'An Autonomous Institution | Approved by AICTE | Affiliated to Anna University',
  description:
    'Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College was established in the year 2002 under R.S.Trust, founded by the Philanthropic couple – Col. Prof. Vel. Dr. R. Rangarajan, Founder President & Chairman and Dr. Sagunthala Rangarajan, Foundress Vice-Chairman respectively. Under the governance of AICTE & Anna University, this College has 10 branches of study with 9 UG Programmes and 2 PG Programmes.',
  stats: [
    { label: 'ESTABLISHED', value: '2002' },
    { label: 'BRANCHES', value: '10' },
    { label: 'UG PROGRAMMES', value: '9' },
    { label: 'PG PROGRAMMES', value: '2' },
    { label: 'GRADE', value: 'NAAC A' },
  ] as StatItem[],
  sealSrc: '/assets/about/vel-tech-seal.png',
  bannerSrc: '/assets/branding/vel-tech-high-tech-logo-full.webp',
}

export const cyberSentinelData = {
  title: 'CYBERSENTINEL 2K26',
  edition: '2K26',
  subtitle: 'National Level Techno-Cultural Extravaganza',
  organizedBy: 'Department of Computer Science and Engineering',
  description:
    'CyberSentinel is a techno-cultural extravaganza organized by VEL TECH HIGH TECH to provide a platform for young minds to showcase their latent talents. This event encompasses a plethora of technical and non-technical events, designed to challenge and inspire participants to explore their potential in the current world of technology.',
  stats: [
    { label: 'SYMPOSIUM', value: '2K26' },
    { label: 'EXPERIENCE', value: 'CYBER CITY' },
    { label: 'EVENTS', value: 'TECH & NON-TECH' },
  ] as StatItem[],
  logoSrc: '/assets/branding/cybersentinel-logo.webp',
  shieldSrc: '/assets/about/cybersentinel-shield.png',
}

export const hackathonClubData = {
  title: 'HACKATHON CLUB',
  subtitle: 'Student Innovation & Developer Community',
  description:
    "Hackathon Club is a dynamic community of tech enthusiasts, developers, and innovators who come together to solve real-world problems through coding and collaboration. We organize hackathons, coding challenges, and workshops to enhance technical skills and creativity. Our club fosters teamwork, networking, and mentorship opportunities with industry experts. Whether you're a beginner or an experienced coder, there's a place for you to learn and grow.",
  logoSrc: '/assets/branding/hackathon_club_logo.webp',
  members: [
    { name: 'Hirikaran M', role: 'President', color: 'cyan' },
    { name: 'Bhagya B', role: 'Vice President', color: 'pink' },
    { name: 'Sharath A R', role: 'Secretary', color: 'green' },
    { name: 'Abishek D', role: 'Joint Secretary', color: 'orange' },
    { name: 'Nihitha T', role: 'Treasury', color: 'yellow' },
    { name: 'Prathish M', role: 'Treasury', color: 'purple' },
  ] as ClubMember[],
}

export const chiefPatrons: PatronItem[] = [
  {
    name: 'Dr. R. RANGARAJAN',
    role: 'CHAIRMAN',
    designation: 'Founder President & Chairman',
    image: '/assets/about/staff1.webp',
    accentColor: '#22d3ee',
  },
  {
    name: 'Dr. SAKUNTHALA RANGARAJAN',
    role: 'VICE CHAIRMAN',
    designation: 'Foundress Vice-Chairman',
    image: '/assets/about/staff2.webp',
    accentColor: '#ff3ea5',
  },
  {
    name: 'Dr. MAHALAKSHMI KISHORE',
    role: 'MANAGING TRUSTEE',
    designation: 'Managing Trustee',
    image: '/assets/about/staff3.webp',
    accentColor: '#a78bfa',
  },
]

export const patrons: PatronItem[] = [
  {
    name: 'Dr. E. KAMALANABAN',
    role: 'PRINCIPAL',
    designation: 'Principal & Academic Head',
    image: '/assets/about/staff4.webp',
    accentColor: '#22d3ee',
  },
]
