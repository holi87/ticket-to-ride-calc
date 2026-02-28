import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const SWITZERLAND_EDITION: GameEdition = {
  id: 'switzerland',
  name: 'Ticket to Ride: Szwajcaria',
  nameShort: 'Szwajcaria',
  description:
    'Edycja dla 2–3 graczy. Zawiera bilety do krajów — gracz podaje wartość ukończonego biletu.',
  minPlayers: 2,
  maxPlayers: 3,
  trainCarsPerPlayer: 40,
  availableRouteLengths: [1, 2, 3, 4, 5, 6],
  routePointsTable: {
    1: STANDARD_ROUTE_POINTS[1],
    2: STANDARD_ROUTE_POINTS[2],
    3: STANDARD_ROUTE_POINTS[3],
    4: STANDARD_ROUTE_POINTS[4],
    5: STANDARD_ROUTE_POINTS[5],
    6: STANDARD_ROUTE_POINTS[6],
  },
  bonuses: [
    {
      id: 'longest_path',
      name: 'Longest Continuous Path',
      namePl: 'Najdłuższa ciągła trasa',
      type: 'longest_path',
      points: 10,
      inputType: 'radio_select_player',
      tiedPlayersShareBonus: true,
      description: '10 points for the player with the longest continuous path.',
      descriptionPl:
        '10 punktów dla gracza z najdłuższą ciągłą trasą. W remisie: wszyscy remisujący dostają bonus.',
    },
  ],
  hasStations: false,
  tiebreakerRules: ['most_completed_tickets', 'longest_path'],
  playerColors: [
    { id: 'blue',  name: 'Blue',  namePl: 'Niebieski', hex: '#1e40af' },
    { id: 'red',   name: 'Red',   namePl: 'Czerwony',  hex: '#dc2626' },
    { id: 'green', name: 'Green', namePl: 'Zielony',   hex: '#16a34a' },
  ],
  status: 'stable',
};
