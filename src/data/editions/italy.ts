import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const ITALY_EDITION: GameEdition = {
  id: 'italy',
  name: 'Ticket to Ride: Włochy',
  nameShort: 'Włochy',
  description:
    'Edycja dla 2–5 graczy. Bonus za połączone regiony Włoch — im więcej regionów, tym więcej punktów.',
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
      id: 'region_bonus',
      name: 'Region Bonus',
      namePl: 'Bonus za regiony',
      type: 'custom',
      points: -1, // variable per region table
      inputType: 'number_input',
      tiedPlayersShareBonus: false,
      description:
        'Points for connecting Italian regions. Scoring: 5=1, 6=3, 7=6, 8=10, 9=15, 10=21, 11=28, 12=36, 13+=45 (15-17=56). Player manually enters total region points.',
      descriptionPl:
        'Punkty za połączone regiony Włoch (17 regionów). Tabela punktów: 5=1, 6=3, 7=6, 8=10, 9=15, 10=21, 11=28, 12=36, 13=45, 15–17=56. Specjalne regiony (Puglia, Sardegna, Sicilia) liczą się podwójnie gdy wszystkie miasta połączone. Wpisz łączne punkty za regiony.',
    },
  ],
  hasStations: false,
  tiebreakerRules: ['most_completed_tickets'],
  playerColors: [
    { id: 'blue',   name: 'Blue',   namePl: 'Niebieski', hex: '#3b82f6' },
    { id: 'red',    name: 'Red',    namePl: 'Czerwony',  hex: '#ef4444' },
    { id: 'green',  name: 'Green',  namePl: 'Zielony',   hex: '#22c55e' },
    { id: 'yellow', name: 'Yellow', namePl: 'Żółty',     hex: '#eab308' },
    { id: 'black',  name: 'Black',  namePl: 'Czarny',    hex: '#171717' },
  ],
  status: 'beta',
};
