export interface Score {
  teamA: string;
  teamB: string;
  runs: number | string;
  wickets: number | string;
  overs: string;
}

export interface Tournament {
  id?: string;
  name: string;
  location: string;
  date: string; // Display date (e.g. "May 12")
  startDate: string; // ISO Date YYYY-MM-DD
  timestamp: string; // ISO string for sorting
  startTime: string; // e.g. "10:00 AM"
  spots: number;
  totalSpots: number;
  matchType: 'T20' | 'ODI' | 'T10' | 'Gully' | string;
  status: 'open' | 'urgent' | 'full' | string;
}

export enum PortalView {
  USER = 'user',
  ORGANIZER = 'organizer',
  ADMIN = 'admin'
}

export enum UserSubView {
  HOME = 'home',
  LIVE = 'live',
  LEAGUES = 'leagues',
  STATS = 'stats',
  HELP = 'help',
  VISION = 'vision',
  PROFILE = 'profile',
  DEVELOPER_MODE = 'dev'
}
