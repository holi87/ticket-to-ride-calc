import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const JAPAN_EDITION: GameEdition = {
  id: 'japan',
  name: 'Ticket to Ride: Japonia',
  nameShort: 'Japonia',
  description:
    'Edycja dla 2–5 graczy. Tylko 20 wagonów per gracz. Bonus/kara za Bullet Train (Shinkansen).',
  minPlayers: 2,
  maxPlayers: 5,
  trainCarsPerPlayer: 20,
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
      id: 'bullet_train',
      name: 'Bullet Train',
      namePl: 'Bullet Train (Shinkansen)',
      type: 'custom',
      points: -1, // variable; can be negative!
      inputType: 'number_input',
      tiedPlayersShareBonus: false,
      description:
        'Bonus/penalty from Bullet Train Track ranking. May be negative. Enter the calculated value (positive or negative). ' +
        'Reference: 2p: 1st=+10/-10; 3p: +15/+5/-15; 4p: +15/+10/-5/-15; 5p: +15/+10/+5/-5/-15.',
      descriptionPl:
        'Bonus lub kara za ranking na torach Bullet Train (Shinkansen). Może być ujemny! Wpisz obliczoną wartość. ' +
        'Tabela (2 graczy): 1.=+10, 2.=−10. ' +
        '(3 graczy): 1.=+15, 2.=+5, 3.=−15. ' +
        '(4 graczy): 1.=+15, 2.=+10, 3.=−5, 4.=−15. ' +
        '(5 graczy): 1.=+15, 2.=+10, 3.=+5, 4.=−5, 5.=−15.',
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
