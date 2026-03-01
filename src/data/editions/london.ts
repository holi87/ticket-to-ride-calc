import type { GameEdition } from '../../types/edition';

// London uses buses instead of trains and has a unique (smaller) scoring table.
// Routes 1–4 only; point values are the same as the standard table for those lengths.
const LONDON_ROUTE_POINTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
};

export const LONDON_EDITION: GameEdition = {
  id: 'london',
  name: 'Ticket to Ride: Londyn',
  nameShort: 'Londyn',
  description:
    'Szybka gra (10–15 min) dla 2–4 graczy. Autobusy zamiast pociągów. Bonus za ukończone dzielnice.',
  minPlayers: 2,
  maxPlayers: 4,
  trainCarsPerPlayer: 17, // buses
  availableRouteLengths: [1, 2, 3, 4],
  routePointsTable: LONDON_ROUTE_POINTS,
  bonuses: [
    {
      id: 'districts',
      name: 'Districts',
      namePl: 'Dzielnice',
      type: 'custom',
      points: -1, // variable (sum of district values: 1+2+3+4+5 = 15 max)
      inputType: 'number_input',
      tiedPlayersShareBonus: false,
      description:
        'Points for completed London districts. 5 districts worth 1, 2, 3, 4, 5 points each. Player enters total points from completed districts.',
      descriptionPl:
        'Punkty za ukończone dzielnice Londynu. 5 dzielnic o wartościach 1, 2, 3, 4, 5 pkt. Gracz zdobywa punkty za każdą dzielnicę, w której połączył wszystkie lokacje. Wpisz sumę punktów z ukończonych dzielnic.',
    },
  ],
  hasStations: false,
  tiebreakerRules: ['most_completed_tickets'],
  playerColors: [
    { id: 'red',    name: 'Red',    namePl: 'Czerwony',  hex: '#ef4444' },
    { id: 'yellow', name: 'Yellow', namePl: 'Żółty',     hex: '#eab308' },
    { id: 'green',  name: 'Green',  namePl: 'Zielony',   hex: '#22c55e' },
    { id: 'purple', name: 'Purple', namePl: 'Fioletowy', hex: '#7c3aed' },
  ],
  status: 'stable',
};
