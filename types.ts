
export interface Player {
  id: string;
  number: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  wins: number;
  draws: number;
  losses: number;
}

export type MatchStatus = 'upcoming' | 'playing' | 'paused' | 'finished' | 'penalty' | 'cointoss';

export interface MatchResult {
  teamA: string; // Team ID
  teamB: string; // Team ID
  scoreA: number;
  scoreB: number;
  winner: string | 'draw';
  timestamp: number;
}
