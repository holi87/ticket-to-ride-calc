import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const AFRICA_EDITION: GameEdition = {
  id: 'africa',
  name: 'Ticket to Ride: Afryka',
  nameShort: 'Afryka',
  description: 'Edycja z kartami terenu i bonusem Globetrotter. Brak bonusu za najdłuższą trasę.',
  minPlayers: 2,
  maxPlayers: 5,
  trainCarsPerPlayer: 45,
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
    {
      id: 'terrain',
      name: 'Terrain Cards',
      namePl: 'Karty terenu',
      type: 'terrain',
      points: -1, // entered manually
      inputType: 'number_input',
      tiedPlayersShareBonus: false,
      description: 'Points from collected terrain card sets. Resolved outside the app.',
      descriptionPl:
        'Punkty za zebrany zestaw kart terenu. Gracz wpisuje sumaryczne punkty.',
    },
  ],
  hasStations: false,
  tiebreakerRules: ['most_completed_tickets'],
  playerColors: [
    { id: 'blue',   name: 'Blue',   namePl: 'Niebieski', hex: '#1e40af' },
    { id: 'red',    name: 'Red',    namePl: 'Czerwony',  hex: '#dc2626' },
    { id: 'green',  name: 'Green',  namePl: 'Zielony',   hex: '#16a34a' },
    { id: 'yellow', name: 'Yellow', namePl: 'Żółty',     hex: '#eab308' },
    { id: 'black',  name: 'Black',  namePl: 'Czarny',    hex: '#171717' },
  ],
  status: 'beta',
};
