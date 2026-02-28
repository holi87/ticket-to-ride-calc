import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const NORDIC_EDITION: GameEdition = {
  id: 'nordic',
  name: 'Ticket to Ride: Kraje Nordyckie',
  nameShort: 'Nordic',
  description: 'Edycja dla 2–3 graczy. Zawiera specjalną trasę 9-wagonową Murmańsk–Lieksa.',
  minPlayers: 2,
  maxPlayers: 3,
  trainCarsPerPlayer: 40,
  // Note: no lengths 7 or 8; includes length 9 (Murmansk–Lieksa, 27 pts)
  availableRouteLengths: [1, 2, 3, 4, 5, 6, 9],
  routePointsTable: {
    1: STANDARD_ROUTE_POINTS[1],
    2: STANDARD_ROUTE_POINTS[2],
    3: STANDARD_ROUTE_POINTS[3],
    4: STANDARD_ROUTE_POINTS[4],
    5: STANDARD_ROUTE_POINTS[5],
    6: STANDARD_ROUTE_POINTS[6],
    9: STANDARD_ROUTE_POINTS[9],
  },
  bonuses: [
    {
      id: 'globetrotter',
      name: 'Globetrotter',
      namePl: 'Globetrotter',
      type: 'globetrotter',
      points: 10,
      inputType: 'auto_from_tickets',
      tiedPlayersShareBonus: true,
      description: '10 points for the player who completed the most destination tickets.',
      descriptionPl:
        '10 punktów dla gracza z największą liczbą ukończonych biletów. W remisie: wszyscy remisujący dostają bonus.',
    },
  ],
  hasStations: false,
  tiebreakerRules: ['most_completed_tickets', 'longest_path'],
  playerColors: [
    { id: 'white',  name: 'White',  namePl: 'Biały',    hex: '#f5f5f5' },
    { id: 'purple', name: 'Purple', namePl: 'Fioletowy', hex: '#7c3aed' },
    { id: 'black',  name: 'Black',  namePl: 'Czarny',   hex: '#171717' },
  ],
  status: 'stable',
};
