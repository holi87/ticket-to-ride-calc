// Types for score input data and computed results.

export interface RouteInput {
  /** Route length in train cars (1–9) */
  length: number;
  /** How many routes of this length the player claimed */
  count: number;
}

export interface TicketInput {
  id: string;
  /** Point value printed on the ticket */
  value: number;
  /** Whether the player completed this destination ticket */
  completed: boolean;
}

/**
 * Union type for bonus input values keyed by bonus id.
 * Each variant corresponds to a BonusInputType.
 */
export type BonusInputValue =
  | { type: 'player_select'; selectedPlayerIds: string[] }  // longest_path
  | { type: 'auto' }                                         // globetrotter (computed from tickets)
  | { type: 'stepper'; value: number }                       // stations, mandala
  | { type: 'number'; value: number };                       // passengers, terrain

export interface PlayerScoreInput {
  playerId: string;
  routes: RouteInput[];
  tickets: TicketInput[];
  /** Keys are BonusDefinition.id values */
  bonusInputs: Record<string, BonusInputValue>;
}

export interface RouteBreakdownItem {
  length: number;
  count: number;
  points: number;
}

export interface BonusBreakdownItem {
  bonusId: string;
  bonusName: string;
  bonusNamePl: string;
  points: number;
}

export interface PlayerScore {
  playerId: string;
  playerName: string;
  routePoints: number;
  routeBreakdown: RouteBreakdownItem[];
  completedTicketsCount: number;
  completedTicketsPoints: number;
  failedTicketsCount: number;
  /** Negative value — points deducted for incomplete tickets */
  failedTicketsPoints: number;
  bonusPoints: BonusBreakdownItem[];
  totalScore: number;
  trainCarsUsed: number;
  trainCarsRemaining: number;
  /** Final rank after tiebreaker resolution (1 = winner; shared ranks possible) */
  rank?: number;
}

export interface ScoringResult {
  scores: PlayerScore[];
  /** Player ids that received the longest path bonus */
  longestPathWinners: string[];
  /** Player ids that received the globetrotter bonus */
  globetrotterWinners: string[];
}
