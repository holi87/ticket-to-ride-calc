// Types describing a game edition configuration.
// All game rules are derived from these types — never hardcoded in UI components.

export type BonusType =
  | 'longest_path'
  | 'globetrotter'
  | 'stations'
  | 'mandala'
  | 'passengers'
  | 'terrain'
  | 'custom';

export type BonusInputType =
  | 'radio_select_player'   // longest_path — select a player (or tied players)
  | 'auto_from_tickets'     // globetrotter — computed automatically from tickets
  | 'stepper'               // stations, mandala
  | 'number_input';         // passengers, terrain

export type TiebreakerRule =
  | 'most_completed_tickets'
  | 'longest_path'
  | 'fewest_stations_used';

export interface PlayerColor {
  id: string;
  name: string;
  namePl: string;
  hex: string;
}

export interface BonusDefinition {
  id: string;
  /** English name */
  name: string;
  /** Polish name for UI labels */
  namePl: string;
  type: BonusType;
  /** Fixed point value for the bonus, or -1 if variable (e.g. mandala) */
  points: number;
  inputType: BonusInputType;
  /** Whether tied players all receive the bonus */
  tiedPlayersShareBonus: boolean;
  description: string;
  descriptionPl: string;
  /** Optional custom calculation function for variable bonuses (e.g. mandala: count × 5) */
  calculate?: (input: number) => number;
}

export interface GameEdition {
  id: string;
  name: string;
  nameShort: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  trainCarsPerPlayer: number;
  availableRouteLengths: number[];
  /** Mapping from route length to point value */
  routePointsTable: Record<number, number>;
  bonuses: BonusDefinition[];
  hasStations: boolean;
  stationsPerPlayer?: number;
  stationPointsEach?: number;
  tiebreakerRules: TiebreakerRule[];
  playerColors: PlayerColor[];
  status: 'stable' | 'beta';
}
