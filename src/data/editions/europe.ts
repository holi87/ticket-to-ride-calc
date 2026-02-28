import type { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const EUROPE_EDITION: GameEdition = {
  id: 'europe',
  name: 'Ticket to Ride: Europa',
  nameShort: 'Europa',
  description: 'Podróżuj po Europie. Dodaje stacje kolejowe i tunele.',
  minPlayers: 2,
  maxPlayers: 5,
  trainCarsPerPlayer: 45,
  availableRouteLengths: [1, 2, 3, 4, 5, 6, 8],
  routePointsTable: {
    1: STANDARD_ROUTE_POINTS[1],
    2: STANDARD_ROUTE_POINTS[2],
    3: STANDARD_ROUTE_POINTS[3],
    4: STANDARD_ROUTE_POINTS[4],
    5: STANDARD_ROUTE_POINTS[5],
    6: STANDARD_ROUTE_POINTS[6],
    8: STANDARD_ROUTE_POINTS[8],
  },
  bonuses: [
    {
      id: 'longest_path',
      name: 'European Express',
      namePl: 'Najdłuższa ciągła trasa',
      type: 'longest_path',
      points: 10,
      inputType: 'radio_select_player',
      tiedPlayersShareBonus: true,
      description:
        '10 points for the player with the longest continuous path. Stations and opponents\' routes used via stations do NOT count.',
      descriptionPl:
        '10 punktów za najdłuższą ciągłą trasę. Stacje i trasy przeciwników dostępne przez stacje NIE liczą się.',
    },
    {
      id: 'stations',
      name: 'Unused Stations',
      namePl: 'Nieużyte stacje',
      type: 'stations',
      points: 4,
      inputType: 'stepper',
      tiedPlayersShareBonus: false,
      description: '4 points per unused station. Each player starts with 3 stations.',
      descriptionPl: '4 punkty za każdą stację, której gracz NIE umieścił na planszy (max 3 stacje = max 12 pkt).',
    },
  ],
  hasStations: true,
  stationsPerPlayer: 3,
  stationPointsEach: 4,
  tiebreakerRules: ['most_completed_tickets', 'fewest_stations_used', 'longest_path'],
  playerColors: [
    { id: 'blue',   name: 'Blue',   namePl: 'Niebieski', hex: '#1e40af' },
    { id: 'red',    name: 'Red',    namePl: 'Czerwony',  hex: '#dc2626' },
    { id: 'green',  name: 'Green',  namePl: 'Zielony',   hex: '#16a34a' },
    { id: 'yellow', name: 'Yellow', namePl: 'Żółty',     hex: '#eab308' },
    { id: 'black',  name: 'Black',  namePl: 'Czarny',    hex: '#171717' },
  ],
  status: 'stable',
};
