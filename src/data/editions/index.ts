import type { GameEdition } from '../../types/edition';
import { USA_EDITION } from './usa';
import { EUROPE_EDITION } from './europe';
import { NORDIC_EDITION } from './nordic';
import { SWITZERLAND_EDITION } from './switzerland';
import { INDIA_EDITION } from './india';
import { GERMANY_EDITION } from './germany';
import { AFRICA_EDITION } from './africa';
import { POLAND_EDITION } from './poland';
import { LONDON_EDITION } from './london';
import { ITALY_EDITION } from './italy';
import { JAPAN_EDITION } from './japan';
import { WORLD_EDITION } from './world';
import { GREAT_LAKES_EDITION } from './great_lakes';

/** All available editions in display order. */
export const ALL_EDITIONS: GameEdition[] = [
  // Core editions (stable)
  USA_EDITION,
  EUROPE_EDITION,
  NORDIC_EDITION,
  SWITZERLAND_EDITION,
  INDIA_EDITION,
  GERMANY_EDITION,
  AFRICA_EDITION,
  // Extended editions
  POLAND_EDITION,
  LONDON_EDITION,
  ITALY_EDITION,
  JAPAN_EDITION,
  WORLD_EDITION,
  GREAT_LAKES_EDITION,
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
  POLAND_EDITION,
  LONDON_EDITION,
  ITALY_EDITION,
  JAPAN_EDITION,
  WORLD_EDITION,
  GREAT_LAKES_EDITION,
};
