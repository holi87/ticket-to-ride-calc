import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const WORLD_EDITION: GameEdition = {
  id: 'world',
  name: 'Ticket to Ride: Dookoła Świata',
  nameShort: 'Świat',
  description:
    'Rails & Sails — mapa świata. 2–5 graczy. Mix pociągów i statków (łącznie 50 sztuk). Bonus za porty.',
  minPlayers: 2,
  maxPlayers: 5,
  trainCarsPerPlayer: 50, // combined trains + ships
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
      id: 'harbors',
      name: 'Harbors',
      namePl: 'Porty',
      type: 'custom',
      points: -1,
      inputType: 'number_input',
      tiedPlayersShareBonus: false,
      description:
        'Points for harbor tokens placed in port cities. Score depends on number of routes connected to each harbor. Player manually enters total harbor points.',
      descriptionPl:
        'Punkty za porty (harbors) umieszczone w miastach portowych. Wartość portu zależy od liczby tras wchodzących/wychodzących. Wpisz sumę punktów za wszystkie porty.',
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
