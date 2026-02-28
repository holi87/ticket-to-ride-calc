import { describe, it, expect } from 'vitest';
import {
  validatePlayerInput,
  countTrainCarsUsed,
  wouldExceedCarLimit,
} from '../src/logic/validation';
import { USA_EDITION } from '../src/data/editions/usa';
import { EUROPE_EDITION } from '../src/data/editions/europe';
import type { PlayerScoreInput } from '../src/types/scoring';

function makeInput(overrides: Partial<PlayerScoreInput> = {}): PlayerScoreInput {
  return { playerId: 'p1', routes: [], tickets: [], bonusInputs: {}, ...overrides };
}

describe('validatePlayerInput — train cars', () => {
  it('passes when cars used equals limit exactly', () => {
    // 9 × 5-wag routes = 45 cars (USA limit)
    const input = makeInput({ routes: [{ length: 5, count: 9 }] });
    expect(validatePlayerInput(input, USA_EDITION)).toHaveLength(0);
  });

  it('fails when cars exceed the limit', () => {
    const input = makeInput({ routes: [{ length: 6, count: 8 }] }); // 48 > 45
    const errors = validatePlayerInput(input, USA_EDITION);
    expect(errors.some((e) => e.field === 'routes')).toBe(true);
  });
});

describe('validatePlayerInput — route lengths', () => {
  it('passes for valid route length', () => {
    const input = makeInput({ routes: [{ length: 4, count: 1 }] });
    expect(validatePlayerInput(input, USA_EDITION)).toHaveLength(0);
  });

  it('fails for route length not in edition', () => {
    // USA has no 9-wagon route
    const input = makeInput({ routes: [{ length: 9, count: 1 }] });
    const errors = validatePlayerInput(input, USA_EDITION);
    expect(errors.some((e) => e.field === 'routes.9')).toBe(true);
  });

  it('fails for negative route count', () => {
    const input = makeInput({ routes: [{ length: 3, count: -1 }] });
    const errors = validatePlayerInput(input, USA_EDITION);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validatePlayerInput — tickets', () => {
  it('passes for valid ticket value', () => {
    const input = makeInput({
      tickets: [{ id: 't1', value: 15, completed: true }],
    });
    expect(validatePlayerInput(input, USA_EDITION)).toHaveLength(0);
  });

  it('fails for zero ticket value', () => {
    const input = makeInput({
      tickets: [{ id: 't1', value: 0, completed: true }],
    });
    const errors = validatePlayerInput(input, USA_EDITION);
    expect(errors.some((e) => e.field.startsWith('tickets'))).toBe(true);
  });

  it('fails for negative ticket value', () => {
    const input = makeInput({
      tickets: [{ id: 't1', value: -5, completed: true }],
    });
    const errors = validatePlayerInput(input, USA_EDITION);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validatePlayerInput — stations (Europe)', () => {
  it('passes for valid unused station count', () => {
    const input = makeInput({
      bonusInputs: { stations: { type: 'stepper', value: 2 } },
    });
    expect(validatePlayerInput(input, EUROPE_EDITION)).toHaveLength(0);
  });

  it('fails for unused stations exceeding max', () => {
    const input = makeInput({
      bonusInputs: { stations: { type: 'stepper', value: 4 } }, // max = 3
    });
    const errors = validatePlayerInput(input, EUROPE_EDITION);
    expect(errors.some((e) => e.field === 'bonusInputs.stations')).toBe(true);
  });
});

describe('countTrainCarsUsed', () => {
  it('returns 0 for no routes', () => {
    expect(countTrainCarsUsed(makeInput())).toBe(0);
  });

  it('sums cars correctly', () => {
    const input = makeInput({
      routes: [
        { length: 3, count: 2 }, // 6
        { length: 4, count: 1 }, // 4
      ],
    });
    expect(countTrainCarsUsed(input)).toBe(10);
  });
});

describe('wouldExceedCarLimit', () => {
  it('returns false when adding route fits within limit', () => {
    const input = makeInput({ routes: [{ length: 6, count: 7 }] }); // 42 cars
    expect(wouldExceedCarLimit(input, 3, USA_EDITION)).toBe(false); // 42 + 3 = 45 ✓
  });

  it('returns true when adding route exceeds limit', () => {
    const input = makeInput({ routes: [{ length: 6, count: 7 }] }); // 42 cars
    expect(wouldExceedCarLimit(input, 4, USA_EDITION)).toBe(true); // 42 + 4 = 46 ✗
  });
});
