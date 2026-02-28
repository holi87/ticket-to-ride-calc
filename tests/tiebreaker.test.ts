import { describe, it, expect } from 'vitest';
import { applyTiebreakers } from '../src/logic/tiebreaker';
import { USA_EDITION } from '../src/data/editions/usa';
import { EUROPE_EDITION } from '../src/data/editions/europe';
import type { PlayerScore, PlayerScoreInput } from '../src/types/scoring';

function makeScore(playerId: string, total: number, overrides: Partial<PlayerScore> = {}): PlayerScore {
  return {
    playerId,
    playerName: playerId,
    routePoints: total,
    routeBreakdown: [],
    completedTicketsCount: 0,
    completedTicketsPoints: 0,
    failedTicketsCount: 0,
    failedTicketsPoints: 0,
    bonusPoints: [],
    totalScore: total,
    trainCarsUsed: 0,
    trainCarsRemaining: 45,
    ...overrides,
  };
}

function makeInput(playerId: string, overrides: Partial<PlayerScoreInput> = {}): PlayerScoreInput {
  return { playerId, routes: [], tickets: [], bonusInputs: {}, ...overrides };
}

describe('applyTiebreakers — basic ranking', () => {
  it('assigns rank 1 to the highest scorer', () => {
    const scores = [makeScore('p1', 100), makeScore('p2', 80)];
    const inputs = [makeInput('p1'), makeInput('p2')];
    const ranked = applyTiebreakers(scores, inputs, USA_EDITION, []);
    expect(ranked.find((s) => s.playerId === 'p1')?.rank).toBe(1);
    expect(ranked.find((s) => s.playerId === 'p2')?.rank).toBe(2);
  });

  it('assigns sequential ranks to distinct scores', () => {
    const scores = [makeScore('p1', 90), makeScore('p2', 70), makeScore('p3', 50)];
    const inputs = scores.map((s) => makeInput(s.playerId));
    const ranked = applyTiebreakers(scores, inputs, USA_EDITION, []);
    expect(ranked.find((s) => s.playerId === 'p1')?.rank).toBe(1);
    expect(ranked.find((s) => s.playerId === 'p2')?.rank).toBe(2);
    expect(ranked.find((s) => s.playerId === 'p3')?.rank).toBe(3);
  });
});

describe('applyTiebreakers — USA tiebreaker: most_completed_tickets', () => {
  it('breaks tie by completed tickets count', () => {
    const scores = [
      makeScore('p1', 100, { completedTicketsCount: 3 }),
      makeScore('p2', 100, { completedTicketsCount: 5 }),
    ];
    const inputs = scores.map((s) => makeInput(s.playerId));
    const ranked = applyTiebreakers(scores, inputs, USA_EDITION, []);
    expect(ranked.find((s) => s.playerId === 'p2')?.rank).toBe(1); // more tickets wins
    expect(ranked.find((s) => s.playerId === 'p1')?.rank).toBe(2);
  });

  it('breaks second tie by longest_path bonus', () => {
    const scores = [
      makeScore('p1', 100, { completedTicketsCount: 4 }),
      makeScore('p2', 100, { completedTicketsCount: 4 }),
    ];
    const inputs = scores.map((s) => makeInput(s.playerId));
    const ranked = applyTiebreakers(scores, inputs, USA_EDITION, ['p2']);
    expect(ranked.find((s) => s.playerId === 'p2')?.rank).toBe(1);
    expect(ranked.find((s) => s.playerId === 'p1')?.rank).toBe(2);
  });

  it('shares rank when all tiebreakers are equal', () => {
    const scores = [
      makeScore('p1', 100, { completedTicketsCount: 3 }),
      makeScore('p2', 100, { completedTicketsCount: 3 }),
    ];
    const inputs = scores.map((s) => makeInput(s.playerId));
    const ranked = applyTiebreakers(scores, inputs, USA_EDITION, []);
    expect(ranked.find((s) => s.playerId === 'p1')?.rank).toBe(1);
    expect(ranked.find((s) => s.playerId === 'p2')?.rank).toBe(1);
  });
});

describe('applyTiebreakers — Europe tiebreaker: fewest_stations_used', () => {
  it('breaks tie by fewest stations used (fewer = better)', () => {
    // p1 has 1 unused → 2 used; p2 has 3 unused → 0 used
    const scores = [
      makeScore('p1', 100, { completedTicketsCount: 3 }),
      makeScore('p2', 100, { completedTicketsCount: 3 }),
    ];
    const inputs = [
      makeInput('p1', { bonusInputs: { stations: { type: 'stepper', value: 1 } } }),
      makeInput('p2', { bonusInputs: { stations: { type: 'stepper', value: 3 } } }),
    ];
    const ranked = applyTiebreakers(scores, inputs, EUROPE_EDITION, []);
    // p2 used 0 stations → wins
    expect(ranked.find((s) => s.playerId === 'p2')?.rank).toBe(1);
    expect(ranked.find((s) => s.playerId === 'p1')?.rank).toBe(2);
  });
});

describe('applyTiebreakers — edge cases', () => {
  it('handles a single player', () => {
    const scores = [makeScore('p1', 77)];
    const ranked = applyTiebreakers(scores, [makeInput('p1')], USA_EDITION, []);
    expect(ranked[0].rank).toBe(1);
  });

  it('all players tied on everything share rank 1', () => {
    const scores = [
      makeScore('p1', 50, { completedTicketsCount: 2 }),
      makeScore('p2', 50, { completedTicketsCount: 2 }),
      makeScore('p3', 50, { completedTicketsCount: 2 }),
    ];
    const inputs = scores.map((s) => makeInput(s.playerId));
    const ranked = applyTiebreakers(scores, inputs, USA_EDITION, []);
    expect(ranked.every((s) => s.rank === 1)).toBe(true);
  });
});
