export interface TransitRoute {
  id: string
  title: string
  routeNumber: string
  role?: string
  serviceType: string
  badgeText: string
  accentColor: 'magenta' | 'cyan' | 'violet'
  cardCost?: string
  image: string
  origin: string
  destinationHighlight: string
  instructions: string
  operatingHours: string
  statLeft: {
    label: string
    value: string
  }
  statRight: {
    label: string
    value: string
  }
}

export interface LandmarkTransitHub {
  id: string
  name: string
  accentColor: 'magenta' | 'cyan' | 'violet'
  coordinates: [number, number]
  icon: string
  distance: string
  estTime: string
  transitMode: string
  sectorCode: string
}

export interface TransitStopPoint {
  id: string
  name: string
  hubGroup: 'AVADI' | 'METRO' | 'CENTRAL' | 'SOUTH' | 'NORTH' | string
  accentColor: 'magenta' | 'cyan' | 'violet'
  coordinates: [number, number]
  corridor: string
  distanceFromCampus: string
  zone: string
  landmarkInfo?: string
}

export interface CampusLocation {
  name: string
  shortName: string
  address: string
  latitude: number
  longitude: number
  coordinatesDisplay: string
  googleMapsDirectionsUrl: string
}

export const campusLocationData: CampusLocation = {
  name: 'Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College',
  shortName: 'Vel Tech High Tech',
  address: 'Vel Tech Road, Avadi, Chennai, Tamil Nadu 600062, India',
  latitude: 13.1020,
  longitude: 80.0986,
  coordinatesDisplay: '13.1020° N, 80.0986° E',
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=13.1020,80.0986',
}

export const transitRoutesData: TransitRoute[] = [
  {
    id: 'college-fleet-alpha',
    title: 'VEL TECH FLEET ALPHA',
    routeNumber: 'VT-SHUTTLE // NODE-01',
    role: 'COLLEGE DIRECT',
    serviceType: 'CAMPUS SHUTTLE',
    badgeText: 'ONLINE // ACTIVE',
    accentColor: 'cyan',
    cardCost: '01',
    image: '/assets/transportation/cyber-college-bus.webp',
    origin: 'Avadi Terminal / Railway Station',
    destinationHighlight: 'Vel Tech High Tech Campus Gate',
    instructions:
      'Continuous dedicated college shuttles running from Avadi Bus Depot and Suburban Railway Station directly into Vel Tech High Tech campus terminal.',
    operatingHours: '06:30 AM – 09:30 AM & 03:30 PM – 06:00 PM',
    statLeft: {
      label: 'FREQUENCY',
      value: '10 MIN',
    },
    statRight: {
      label: 'STUDENT FARE',
      value: 'FREE',
    },
  },
  {
    id: 'mtc-express-corridor',
    title: 'MTC METRO EXPRESS 62 & 77',
    routeNumber: 'MTC // LINE-62 & 77A',
    role: 'CITY TRANSIT',
    serviceType: 'GOVERNMENT MTC FLEET',
    badgeText: 'RAPID CORRIDOR',
    accentColor: 'magenta',
    cardCost: '02',
    image: '/assets/transportation/cyber-mtc-bus.webp',
    origin: 'Koyambedu (CMBT) / Poonamallee',
    destinationHighlight: 'Avadi & Vel Tech Junction',
    instructions:
      'Board MTC bus 62 (Poonamallee to Redhills via Avadi) or 77A from Koyambedu CMBT to Avadi. Frequent connecting buses run right by the Vel Tech entrance.',
    operatingHours: '05:00 AM – 10:30 PM (All-Day Transit)',
    statLeft: {
      label: 'INTERVAL',
      value: '15 MIN',
    },
    statRight: {
      label: 'TRANSIT PASS',
      value: 'MTC FARE',
    },
  },
  {
    id: 'suburban-rail-feeder',
    title: 'CENTRAL RAILWAY FEEDER',
    routeNumber: 'EMU-LINK // NODE-03',
    role: 'MULTI-MODAL',
    serviceType: 'SUBURBAN EMU RAILWAY',
    badgeText: 'HIGH SPEED',
    accentColor: 'violet',
    cardCost: '03',
    image: '/assets/transportation/cyber-express-bus.webp',
    origin: 'Chennai Central (Moore Market) / Beach',
    destinationHighlight: 'Avadi Junction ➜ Campus Shuttle',
    instructions:
      'Suburban EMU trains depart Chennai Central (MMC) toward Tiruvallur/Arakkonam every 12 mins. Disembark at Avadi Junction, North Exit for instant shuttle transfer.',
    operatingHours: '04:30 AM – 11:30 PM (Daily)',
    statLeft: {
      label: 'TRAIN CADENCE',
      value: '12 MIN',
    },
    statRight: {
      label: 'SECTOR ZONE',
      value: 'WEST CHENNAI',
    },
  },
]

export const landmarkHubsData: LandmarkTransitHub[] = [
  {
    id: 'hub-avadi',
    name: 'Avadi Junction & Bus Terminal',
    accentColor: 'magenta',
    coordinates: [13.0979, 80.0994],
    icon: '🚉',
    distance: '7.2 km',
    estTime: '15 mins',
    transitMode: 'Direct College Shuttle & MTC 62/77',
    sectorCode: 'SECTOR-AVD // 01',
  },
  {
    id: 'hub-cmbt',
    name: 'Koyambedu CMBT Terminal',
    accentColor: 'cyan',
    coordinates: [13.0694, 80.2057],
    icon: '🚌',
    distance: '22 km',
    estTime: '45 mins',
    transitMode: 'MTC Route 77 & Green Line Metro',
    sectorCode: 'SECTOR-CMBT // 02',
  },
  {
    id: 'hub-central',
    name: 'Chennai Central Railway Station',
    accentColor: 'violet',
    coordinates: [13.0827, 80.2707],
    icon: '🏛️',
    distance: '28 km',
    estTime: '50 mins',
    transitMode: 'Direct Suburban EMU train to Avadi',
    sectorCode: 'SECTOR-MAS // 03',
  },
  {
    id: 'hub-poonamallee',
    name: 'Poonamallee Bus Stand',
    accentColor: 'magenta',
    coordinates: [13.0484, 80.0926],
    icon: '🚏',
    distance: '7 km',
    estTime: '18 mins',
    transitMode: 'MTC 62 & Outer Bypass Shuttles',
    sectorCode: 'SECTOR-PML // 04',
  },
  {
    id: 'hub-tambaram',
    name: 'Tambaram Junction Terminal',
    accentColor: 'cyan',
    coordinates: [12.9249, 80.1274],
    icon: '🚆',
    distance: '38 km',
    estTime: '70 mins',
    transitMode: 'Bypass Express Bus / EMU via Central',
    sectorCode: 'SECTOR-TBM // 05',
  },
  {
    id: 'hub-airport',
    name: 'Airport (MAA) Terminal',
    accentColor: 'violet',
    coordinates: [12.9941, 80.1709],
    icon: '✈️',
    distance: '30 km',
    estTime: '55 mins',
    transitMode: 'Blue Line Metro to Central + EMU',
    sectorCode: 'SECTOR-MAA // 06',
  },
]

export const chennaiTransitStopsData: TransitStopPoint[] = [
  // AVADI & LOCAL COLLEGE CORRIDOR (Visible in 'AVADI' and 'ALL')
  {
    id: 'stop-campus-direct',
    name: 'Vel Tech Campus Gate Stop',
    hubGroup: 'AVADI',
    accentColor: 'cyan',
    coordinates: [13.1020, 80.0986],  // Real campus GPS: Vel Tech Rd, Avadi
    corridor: 'CAMPUS DIRECT',
    distanceFromCampus: '0.1 km',
    zone: 'Avadi Vel Nagar',
    landmarkInfo: 'College Entrance Gate & Security Port',
  },
  {
    id: 'stop-avadi-station',
    name: 'Avadi Railway Station',
    hubGroup: 'AVADI',
    accentColor: 'magenta',
    coordinates: [13.0979, 80.0994],  // Real Avadi suburban railway station
    corridor: 'AVADI FEEDER',
    distanceFromCampus: '1.2 km',
    zone: 'Avadi Central',
    landmarkInfo: 'North Exit College Shuttle Pick-Up Point',
  },
  {
    id: 'stop-veltech-road-junction',
    name: 'Vel Tech Road Junction Bus Stop',
    hubGroup: 'AVADI',
    accentColor: 'cyan',
    coordinates: [13.1004, 80.1012],  // Junction of Vel Tech Rd & CTH Road, Avadi
    corridor: 'AVADI-CTH LINK',
    distanceFromCampus: '0.8 km',
    zone: 'Avadi North',
    landmarkInfo: 'Main feeder stop on Vel Tech Road',
  },
  {
    id: 'stop-pattabiram',
    name: 'Pattabiram Railway Station',
    hubGroup: 'AVADI',
    accentColor: 'violet',
    coordinates: [13.1200, 80.0530],  // Real Pattabiram suburban railway station
    corridor: 'SUBURBAN LINK',
    distanceFromCampus: '5.8 km',
    zone: 'Pattabiram',
    landmarkInfo: 'Direct link to Suburban Mainline to Chennai Central',
  },
  {
    id: 'stop-ambattur',
    name: 'Ambattur OT Bus Terminus',
    hubGroup: 'AVADI',
    accentColor: 'magenta',
    coordinates: [13.1145, 80.1549],  // Real Ambattur Industrial Estate OT
    corridor: 'CTH ROAD EXPRESS',
    distanceFromCampus: '11.8 km',
    zone: 'Industrial Corridor',
    landmarkInfo: 'Major MTC Transfer Station – CTH Road',
  },
  {
    id: 'stop-thirumullaivoyal',
    name: 'Thirumullaivoyal Station',
    hubGroup: 'AVADI',
    accentColor: 'cyan',
    coordinates: [13.1184, 80.1290],  // Real Thirumullaivoyal suburban railway station
    corridor: 'SUBURBAN RAIL',
    distanceFromCampus: '7.5 km',
    zone: 'West Industrial Belt',
    landmarkInfo: 'EMU local stop with direct bus feeder to campus',
  },

  // GREATER CHENNAI METROPOLITAN REGION STOPS
  {
    id: 'stop-koyambedu',
    name: 'Koyambedu CMBT Terminal',
    hubGroup: 'METRO',
    accentColor: 'magenta',
    coordinates: [13.0694, 80.2057],  // Real Koyambedu CMBT coords
    corridor: 'MTC CORRIDOR 77',
    distanceFromCampus: '22 km',
    zone: 'Central Metro',
    landmarkInfo: 'Inter-state bus terminal and Green Line Metro',
  },
  {
    id: 'stop-chennai-central',
    name: 'Chennai Central Station',
    hubGroup: 'CENTRAL',
    accentColor: 'cyan',
    coordinates: [13.0827, 80.2707],  // Real Chennai Central Station
    corridor: 'EMU MAINLINE',
    distanceFromCampus: '28 km',
    zone: 'Harbour / Central',
    landmarkInfo: 'Moore Market Complex Suburban Terminal',
  },
  {
    id: 'stop-poonamallee',
    name: 'Poonamallee Bus Stand',
    hubGroup: 'METRO',
    accentColor: 'magenta',
    coordinates: [13.0484, 80.0926],  // Real Poonamallee High Road bus stand
    corridor: 'TRUNK ROAD 62',
    distanceFromCampus: '7 km',
    zone: 'West Outer Ring',
    landmarkInfo: 'Direct MTC 62 transit route origin',
  },
  {
    id: 'stop-tambaram',
    name: 'Tambaram Junction Terminal',
    hubGroup: 'SOUTH',
    accentColor: 'violet',
    coordinates: [12.9249, 80.1274],  // Real Tambaram Junction
    corridor: 'BYPASS EXPRESS',
    distanceFromCampus: '38 km',
    zone: 'South Gateway',
    landmarkInfo: 'South Chennai transit exchange',
  },
  {
    id: 'stop-airport',
    name: 'Chennai Airport (MAA) Terminal',
    hubGroup: 'SOUTH',
    accentColor: 'cyan',
    coordinates: [12.9941, 80.1709],  // Real Chennai International Airport
    corridor: 'BLUE LINE METRO',
    distanceFromCampus: '30 km',
    zone: 'South Metro',
    landmarkInfo: 'International & Domestic Terminals',
  },
  {
    id: 'stop-guindy',
    name: 'Guindy Metro Interchange',
    hubGroup: 'METRO',
    accentColor: 'violet',
    coordinates: [13.0067, 80.2206],  // Real Guindy Metro Station
    corridor: 'METRO & RAIL INTERLINK',
    distanceFromCampus: '25 km',
    zone: 'South Central',
    landmarkInfo: 'Rapid transfer hub for southern suburbs',
  },
  {
    id: 'stop-villivakkam',
    name: 'Villivakkam Railway Station',
    hubGroup: 'NORTH',
    accentColor: 'cyan',
    coordinates: [13.1077, 80.2062],  // Real Villivakkam suburban railway station
    corridor: 'SUBURBAN FEEDER',
    distanceFromCampus: '17 km',
    zone: 'North Central',
    landmarkInfo: 'Suburban train corridor to Avadi via Ambattur',
  },
]

