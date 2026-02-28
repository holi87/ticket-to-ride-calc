import type { GameEdition } from '../types/edition';
import type { PlayerScoreInput } from '../types/scoring';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates a player's score input against the edition rules.
 * Returns an array of errors (empty if valid).
 */
export function validatePlayerInput(
  input: PlayerScoreInput,
  edition: GameEdition,
): ValidationError[] {
  const errors: ValidationError[] = [];

  // --- Train car limit ---
  const carsUsed = input.routes.reduce(
    (sum, r) => sum + r.length * r.count,
    0,
  );
  if (carsUsed > edition.trainCarsPerPlayer) {
    errors.push({
      field: 'routes',
      message: `Przekroczono limit wagonów: użyto ${carsUsed}, dostępne ${edition.trainCarsPerPlayer}.`,
    });
  }

  // --- Route lengths must be valid for this edition ---
  for (const route of input.routes) {
    if (!edition.availableRouteLengths.includes(route.length)) {
      errors.push({
        field: `routes.${route.length}`,
        message: `Trasa ${route.length}-wagonowa nie istnieje w tej edycji.`,
      });
    }
    if (route.count < 0) {
      errors.push({
        field: `routes.${route.length}`,
        message: `Liczba tras nie może być ujemna.`,
      });
    }
  }

  // --- Ticket values must be positive integers ---
  for (const ticket of input.tickets) {
    if (!Number.isInteger(ticket.value) || ticket.value <= 0) {
      errors.push({
        field: `tickets.${ticket.id}`,
        message: `Wartość biletu musi być dodatnią liczbą całkowitą.`,
      });
    }
  }

  // --- Station stepper: 0 to stationsPerPlayer ---
  if (edition.hasStations) {
    const stationsBonus = input.bonusInputs['stations'];
    const max = edition.stationsPerPlayer ?? 3;
    if (stationsBonus?.type === 'stepper') {
      if (stationsBonus.value < 0 || stationsBonus.value > max) {
        errors.push({
          field: 'bonusInputs.stations',
          message: `Liczba nieużytych stacji musi być między 0 a ${max}.`,
        });
      }
    }
  }

  // --- Non-negative number inputs (passengers, terrain) ---
  for (const bonus of edition.bonuses) {
    if (bonus.inputType === 'number_input') {
      const val = input.bonusInputs[bonus.id];
      if (val?.type === 'number' && val.value < 0) {
        errors.push({
          field: `bonusInputs.${bonus.id}`,
          message: `${bonus.namePl}: wartość nie może być ujemna.`,
        });
      }
    }
  }

  return errors;
}

/**
 * Returns the number of train cars used by the given routes.
 */
export function countTrainCarsUsed(input: PlayerScoreInput): number {
  return input.routes.reduce((sum, r) => sum + r.length * r.count, 0);
}

/**
 * Returns true if adding one more route of the given length would
 * exceed the edition's train car limit.
 */
export function wouldExceedCarLimit(
  input: PlayerScoreInput,
  routeLength: number,
  edition: GameEdition,
): boolean {
  return countTrainCarsUsed(input) + routeLength > edition.trainCarsPerPlayer;
}
