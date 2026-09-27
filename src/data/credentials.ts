import type React from 'react'

export interface CredentialMember {
  id: string
  name: string
  role: string
  subRole?: string
  image: string
  imagePosition?: string
  imageStyle?: React.CSSProperties
  phone?: string
  instagram?: string
  linkedin?: string
  accentColor?: 'cyan' | 'pink' | 'orange' | 'purple' | 'green' | 'blue'
}

export interface CredentialSectionGroup {
  id: string
  title: string
  subtitle?: string
  neonTheme: 'cyan' | 'magenta' | 'orange' | 'blue' | 'purple'
  members: CredentialMember[]
}

/**
 * Convenors of CyberSentinel 2K26
 */
export const convenorsData: CredentialMember[] = [
  {
    id: 'dr-v-r-ravi',
    name: 'Dr. V.R. Ravi',
    role: 'Dean Academics',
    subRole: 'Vel Tech High Tech',
    image: '/assets/credentials/convenor_dr_vr_ravi.webp',
    imagePosition: 'center 28%',
    linkedin: 'https://linkedin.com',
    accentColor: 'cyan',
  },
  {
    id: 'dr-s-durga-devi',
    name: 'Dr. S. DURGA DEVI',
    role: 'HOD - CSE',
    subRole: 'Department of Computer Science and Engineering',
    image: '/assets/credentials/convenor_dr_s_durga_devi.webp',
    imagePosition: 'center 20%',
    linkedin: 'https://linkedin.com',
    accentColor: 'cyan',
  },
]

/**
 * Co-Convenors (Faculty / Event Coordinators)
 */
export const coConvenorsData: CredentialMember[] = [
  {
    id: 'mrs-sheela-shantha-kumari',
    name: 'Mrs. SHEELA SHANTHA KUMARI',
    role: 'Asst. Professor - CSE',
    subRole: 'Event Coordinator',
    image: '/assets/credentials/coconvenor_sheela_shantha_kumari.webp',
    imageStyle: { transform: 'scale(1.15) translateY(6%)' },
    linkedin: 'https://linkedin.com',
    accentColor: 'cyan',
  },
  {
    id: 'mr-s-nayagan',
    name: 'Mr. S. NAYAGAN',
    role: 'Asst. Professor - CSE',
    subRole: 'Event Coordinator',
    image: '/assets/credentials/coconvenor_s_nayagan.webp',
    imagePosition: 'center 35%',
    linkedin: 'https://linkedin.com',
    accentColor: 'cyan',
  },
  {
    id: 'mrs-vimala-p',
    name: 'Mrs. VIMALA P',
    role: 'Asst. Professor - CSE',
    subRole: 'Event Coordinator',
    image: '/assets/credentials/coconvenor_vimala_p.webp',
    imagePosition: 'center 28%',
    linkedin: 'https://linkedin.com',
    accentColor: 'cyan',
  },
  {
    id: 'mr-santhosh-kumar-j',
    name: 'Mr. SANTHOSH KUMAR J',
    role: 'Asst. Professor - CSE',
    subRole: 'Event Coordinator',
    image: '/assets/credentials/coconvenor_santhosh_kumar_j.webp',
    imageStyle: { transform: 'scale(1.42) translateY(-15%)' },
    linkedin: 'https://linkedin.com',
    accentColor: 'cyan',
  },
  {
    id: 'mr-durai-vasanth',
    name: 'Mr. DURAI VASANTH',
    role: 'Asst. Professor - CSE',
    subRole: 'Event Coordinator',
    image: '/assets/credentials/coconvenor_durai_vasanth.webp',
    imagePosition: 'center 35%',
    linkedin: 'https://linkedin.com',
    accentColor: 'cyan',
  },
]

/**
 * Student Coordinators
 */
export const studentCoordinatorsData: CredentialMember[] = [
  {
    id: 'neha-m',
    name: 'NEHA M',
    role: 'Joint Secretary // Student Coordinator',
    phone: '+91 7358901292',
    image: '/assets/credentials/student_neha_m.webp',
    instagram: 'https://www.instagram.com/nehamohandass/',
    linkedin: 'https://www.linkedin.com/in/neha-mohandass-81944a32a/',
    accentColor: 'pink',
  },
  {
    id: 'akshaya-m',
    name: 'AKSHAYA M',
    role: 'Treasury // Student Coordinator',
    phone: '+91 9940888882',
    image: '/assets/credentials/student_akshaya_m.webp',
    instagram: 'https://www.instagram.com/akshaya_mhaa/',
    linkedin: 'https://www.linkedin.com/in/akshaya-mhaa/',
    accentColor: 'pink',
  },
  {
    id: 'devanand-v',
    name: 'DEVANAND V',
    role: 'President // Student Coordinator',
    phone: '+91 7358103610',
    image: '/assets/credentials/student_devanand_v.webp',
    instagram: 'https://www.instagram.com/yeah.deva.here/',
    linkedin: 'https://www.linkedin.com/in/devanand100606-v/',
    accentColor: 'pink',
  },
  {
    id: 'hari-ganesh-t',
    name: 'HARI GANESH T',
    role: 'Joint Secretary // Student Coordinator',
    phone: '+91 8015348845',
    image: '/assets/credentials/student_hari_ganesh_t.webp',
    instagram: 'https://www.instagram.com/its_hxri07_offl_/',
    linkedin: 'https://www.linkedin.com/in/hari-ganesh-t/',
    accentColor: 'orange',
  },
  {
    id: 'nihitha',
    name: 'NIHITHA',
    role: 'Vice President // Student Coordinator',
    phone: '+91 9962328881',
    image: '/assets/credentials/student_nihitha.webp',
    instagram: 'https://www.instagram.com/itz_me_.nikki/',
    linkedin: 'https://www.linkedin.com/in/nihitha-thulasimuthu-1917a432a/',
    accentColor: 'green',
  },
  {
    id: 'rishikesh',
    name: 'RISHIKESH',
    role: 'Treasury // Student Coordinator',
    phone: '+91 8778286011',
    image: '/assets/credentials/student_rishikesh.webp',
    instagram: 'https://www.instagram.com/_.rishikx._/',
    linkedin: 'https://www.linkedin.com/in/rishikesh-r02/',
    accentColor: 'pink',
  },
  {
    id: 'prathish-m',
    name: 'PRATHISH M',
    role: 'Secretary // Student Coordinator',
    phone: '+91 7806816023',
    image: '/assets/credentials/student_prathish_m.webp',
    instagram: 'https://www.instagram.com/mr_prathish_005/',
    linkedin: 'https://www.linkedin.com/in/prathish-m-87094b354/',
    accentColor: 'green',
  },
]

/**
 * Editing Experts / Editors Team
 */
export const editorsData: CredentialMember[] = [
  {
    id: 'jose-nishanth',
    name: 'Jose Nishanth',
    role: 'Lead Video Editor',
    image: '/assets/credentials/editor_jose_nishanth.png',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    accentColor: 'orange',
  },
  {
    id: 'jathin-p',
    name: 'Jathin P',
    role: 'Motion Graphics & VFX',
    image: '/assets/credentials/editor_jathin_p.png',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    accentColor: 'orange',
  },
  {
    id: 'naresh-k',
    name: 'Naresh K',
    role: 'Visual Editor & Colorist',
    image: '/assets/credentials/editor_naresh_k.png',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    accentColor: 'orange',
  },
]

/**
 * Meet Our Designers / Design Team
 */
export const designersData: CredentialMember[] = [
  {
    id: 'naveen-n',
    name: 'Naveen N',
    role: 'UI/UX & Creative Director',
    image: '/assets/credentials/designer_naveen_n.png',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    accentColor: 'orange',
  },
  {
    id: 'renganaathan-l',
    name: 'Renganaathan L',
    role: 'Graphic & Brand Designer',
    image: '/assets/credentials/designer_renganaathan_l.png',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    accentColor: 'orange',
  },
  {
    id: 'yuvaraj-g',
    name: 'Yuvaraj G',
    role: 'Web & Poster Designer',
    image: '/assets/credentials/designer_yuvaraj_g.png',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    accentColor: 'orange',
  },
  {
    id: 'dinesh-j',
    name: 'Dinesh J',
    role: 'Visual Identity & 3D Assets',
    image: '/assets/credentials/designer_dinesh_j.png',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    accentColor: 'orange',
  },
  {
    id: 'sharath-a-r-design',
    name: 'Sharath A R',
    role: 'UI Design & Digital Art',
    image: '/assets/credentials/designer_sharath_a_r.png',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    accentColor: 'orange',
  },
]
