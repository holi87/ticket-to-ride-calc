import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const INDIA_EDITION: GameEdition = {
  id: 'india',
  name: 'Ticket to Ride: Indie',
  nameShort: 'Indie',
  description: 'Edycja z bonusem Grand Tour (Mandala) za połączenie miast dwiema oddzielnymi trasami.',
  minPlayers: 2,
  maxPlayers: 4,
  trainCarsPerPlayer: 45,
  availableRouteLengths: [1, 2, 3, 4, 5, 6, 7, 8],
  routePointsTable: {
    1: STANDARD_ROUTE_POINTS[1],
    2: STANDARD_ROUTE_POINTS[2],
    3: STANDARD_ROUTE_POINTS[3],
    4: STANDARD_ROUTE_POINTS[4],
    5: STANDARD_ROUTE_POINTS[5],
    6: STANDARD_ROUTE_POINTS[6],
    7: STANDARD_ROUTE_POINTS[7],
    8: STANDARD_ROUTE_POINTS[8],
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
    {
      id: 'mandala',
      name: 'Grand Tour (Mandala)',
      namePl: 'Grand Tour (Mandala)',
      type: 'mandala',
      points: -1, // variable: count × 5
      inputType: 'stepper',
      tiedPlayersShareBonus: false,
      description:
        'Bonus for connecting ticket cities with two separate routes. 1 ticket = 5 pts, 2 = 10 pts, N = N×5 pts.',
      descriptionPl:
        'Bonus za połączenie miast z biletu dwiema oddzielnymi trasami. 1 bilet = 5 pkt, 2 = 10 pkt, N = N×5 pkt.',
      calculate: (count: number) => count * 5,
    },
  ],
  hasStations: false,
  tiebreakerRules: ['most_completed_tickets', 'longest_path'],
  playerColors: [
    { id: 'blue',   name: 'Blue',   namePl: 'Niebieski', hex: '#1e40af' },
    { id: 'red',    name: 'Red',    namePl: 'Czerwony',  hex: '#dc2626' },
    { id: 'green',  name: 'Green',  namePl: 'Zielony',   hex: '#16a34a' },
    { id: 'yellow', name: 'Yellow', namePl: 'Żółty',     hex: '#eab308' },
  ],
  status: 'stable',
};
