import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const POLAND_EDITION: GameEdition = {
  id: 'poland',
  name: 'Ticket to Ride: Polska',
  nameShort: 'Polska',
  description:
    'Edycja dla 2–4 graczy. Mniejsza mapa z 35 wagonami. Bonus za karty sąsiednich krajów.',
  minPlayers: 2,
  maxPlayers: 4,
  trainCarsPerPlayer: 35,
  availableRouteLengths: [1, 2, 3, 4, 5],
  routePointsTable: {
    1: STANDARD_ROUTE_POINTS[1],
    2: STANDARD_ROUTE_POINTS[2],
    3: STANDARD_ROUTE_POINTS[3],
    4: STANDARD_ROUTE_POINTS[4],
    5: STANDARD_ROUTE_POINTS[5],
  },
  bonuses: [
    {
      id: 'country_cards',
      name: 'Country Cards',
      namePl: 'Karty krajów',
      type: 'custom',
      points: -1, // variable
      inputType: 'number_input',
      tiedPlayersShareBonus: false,
      description:
        'Points from country cards (neighbouring nations). Player manually enters total points earned.',
      descriptionPl:
        'Punkty z kart sąsiednich krajów (Niemcy, Czechy, Słowacja, Ukraina, Białoruś, Litwa, Rosja). Gracz zbiera karty gdy połączy min. 2 kraje — karty mają malejące wartości. Wpisz sumę punktów z kart.',
    },
  ],
  hasStations: false,
  tiebreakerRules: ['most_completed_tickets'],
  playerColors: [
    { id: 'blue',   name: 'Blue',   namePl: 'Niebieski', hex: '#3b82f6' },
    { id: 'red',    name: 'Red',    namePl: 'Czerwony',  hex: '#ef4444' },
    { id: 'green',  name: 'Green',  namePl: 'Zielony',   hex: '#22c55e' },
    { id: 'yellow', name: 'Yellow', namePl: 'Żółty',     hex: '#eab308' },
  ],
  status: 'stable',
};
