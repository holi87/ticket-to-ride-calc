import type { GameEdition } from '../../types/edition';
import { USA_EDITION } from './usa';
import { EUROPE_EDITION } from './europe';
import { NORDIC_EDITION } from './nordic';
import { SWITZERLAND_EDITION } from './switzerland';
import { INDIA_EDITION } from './india';
import { GERMANY_EDITION } from './germany';
import { AFRICA_EDITION } from './africa';

/** All available editions in display order. */
export const ALL_EDITIONS: GameEdition[] = [
  USA_EDITION,
  EUROPE_EDITION,
  NORDIC_EDITION,
  SWITZERLAND_EDITION,
  INDIA_EDITION,
  GERMANY_EDITION,
  AFRICA_EDITION,
];

/** Look up an edition by id. Returns undefined if not found. */
export function getEditionById(id: string): GameEdition | undefined {
  return ALL_EDITIONS.find((e) => e.id === id);
}

export {
  USA_EDITION,
  EUROPE_EDITION,
  NORDIC_EDITION,
  SWITZERLAND_EDITION,
  INDIA_EDITION,
  GERMANY_EDITION,
  AFRICA_EDITION,
};
