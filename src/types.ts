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
  date: string;
  spots: string;
  status: 'open' | 'urgent' | 'full' | string;
}

export enum PortalView {
  USER = 'user',
  ORGANIZER = 'organizer',
  ADMIN = 'admin'
}
