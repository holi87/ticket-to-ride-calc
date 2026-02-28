import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const GERMANY_EDITION: GameEdition = {
  id: 'germany',
  name: 'Ticket to Ride: Niemcy',
  nameShort: 'Niemcy',
  description: 'Edycja z pasażerami i bonusem Globetrotter (15 pkt). Brak bonusu za najdłuższą trasę.',
  minPlayers: 2,
  maxPlayers: 5,
  trainCarsPerPlayer: 45,
  availableRouteLengths: [1, 2, 3, 4, 5, 6, 7],
  routePointsTable: {
    1: STANDARD_ROUTE_POINTS[1],
    2: STANDARD_ROUTE_POINTS[2],
    3: STANDARD_ROUTE_POINTS[3],
    4: STANDARD_ROUTE_POINTS[4],
    5: STANDARD_ROUTE_POINTS[5],
    6: STANDARD_ROUTE_POINTS[6],
    7: STANDARD_ROUTE_POINTS[7],
  },
  bonuses: [
    {
      id: 'globetrotter',
      name: 'Globetrotter',
      namePl: 'Globetrotter',
      type: 'globetrotter',
      points: 15, // Note: 15 pts, not the usual 10
      inputType: 'auto_from_tickets',
      tiedPlayersShareBonus: true,
      description: '15 points for the player who completed the most destination tickets.',
      descriptionPl:
        '15 punktów dla gracza z największą liczbą ukończonych biletów (uwaga: 15, nie 10!). W remisie: wszyscy remisujący dostają bonus.',
    },
    {
      id: 'passengers',
      name: 'Passengers',
      namePl: 'Pasażerowie',
      type: 'passengers',
      points: -1, // entered manually by user
      inputType: 'number_input',
      tiedPlayersShareBonus: false,
      description: 'Points from collected passenger tokens, ranked by color. Resolved outside the app.',
      descriptionPl:
        'Punkty za zebranych pasażerów. Ranking rozstrzygany jest poza aplikacją na podstawie żetonów. Gracz wpisuje sumaryczne punkty.',
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
