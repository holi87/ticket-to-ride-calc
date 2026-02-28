import { describe, it, expect } from 'vitest';
import { computeScores } from '../src/logic/scoring';
import { USA_EDITION } from '../src/data/editions/usa';
import { EUROPE_EDITION } from '../src/data/editions/europe';
import { NORDIC_EDITION } from '../src/data/editions/nordic';
import type { PlayerScoreInput } from '../src/types/scoring';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeInput(
  playerId: string,
  overrides: Partial<PlayerScoreInput> = {},
): PlayerScoreInput {
  return {
    playerId,
    routes: [],
    tickets: [],
    bonusInputs: {},
    ...overrides,
  };
}

const NAMES: Record<string, string> = {
  p1: 'Ania',
  p2: 'Bartek',
  p3: 'Celina',
};

// ---------------------------------------------------------------------------
// Route point calculation
// ---------------------------------------------------------------------------

describe('computeScores — route points', () => {
  it('awards correct points per route length', () => {
    const input = makeInput('p1', {
      routes: [
        { length: 1, count: 1 }, // 1 pt
        { length: 2, count: 1 }, // 2 pt
        { length: 3, count: 1 }, // 4 pt
        { length: 4, count: 1 }, // 7 pt
        { length: 5, count: 1 }, // 10 pt
        { length: 6, count: 1 }, // 15 pt
      ],
    });
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    expect(scores[0].routePoints).toBe(1 + 2 + 4 + 7 + 10 + 15);
  });

  it('multiplies route points by count', () => {
    const input = makeInput('p1', {
      routes: [{ length: 4, count: 3 }], // 3 × 7 = 21
    });
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    expect(scores[0].routePoints).toBe(21);
  });

  it('counts train cars used correctly', () => {
    const input = makeInput('p1', {
      routes: [
        { length: 3, count: 2 }, // 6 cars
        { length: 5, count: 1 }, // 5 cars
      ],
    });
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    expect(scores[0].trainCarsUsed).toBe(11);
    expect(scores[0].trainCarsRemaining).toBe(45 - 11);
  });

  it('ignores routes with count = 0', () => {
    const input = makeInput('p1', {
      routes: [{ length: 6, count: 0 }],
    });
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    expect(scores[0].routePoints).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Ticket scoring
// ---------------------------------------------------------------------------

describe('computeScores — tickets', () => {
  it('adds completed ticket values', () => {
    const input = makeInput('p1', {
      tickets: [
        { id: 't1', value: 21, completed: true },
        { id: 't2', value: 10, completed: true },
      ],
    });
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    expect(scores[0].completedTicketsPoints).toBe(31);
    expect(scores[0].completedTicketsCount).toBe(2);
  });

  it('deducts incomplete ticket values', () => {
    const input = makeInput('p1', {
      tickets: [
        { id: 't1', value: 13, completed: false },
      ],
    });
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    expect(scores[0].failedTicketsPoints).toBe(-13);
    expect(scores[0].failedTicketsCount).toBe(1);
  });

  it('computes net ticket score correctly', () => {
    const input = makeInput('p1', {
      tickets: [
        { id: 't1', value: 20, completed: true },
        { id: 't2', value: 5,  completed: false },
      ],
    });
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    // total = 0 routes + 20 completed − 5 failed = 15
    expect(scores[0].totalScore).toBe(15);
  });

  it('handles zero tickets gracefully', () => {
    const input = makeInput('p1');
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    expect(scores[0].completedTicketsPoints).toBe(0);
    expect(scores[0].failedTicketsPoints).toBe(0);
  });

  it('handles all tickets incomplete', () => {
    const input = makeInput('p1', {
      tickets: [
        { id: 't1', value: 10, completed: false },
        { id: 't2', value: 8,  completed: false },
      ],
    });
    const { scores } = computeScores([input], USA_EDITION, NAMES);
    expect(scores[0].totalScore).toBe(-18);
  });
});

// ---------------------------------------------------------------------------
// Longest path bonus (USA)
// ---------------------------------------------------------------------------

describe('computeScores — longest path bonus', () => {
  it('awards bonus to selected player', () => {
    const p1 = makeInput('p1', {
      bonusInputs: {
        longest_path: { type: 'player_select', selectedPlayerIds: ['p1'] },
      },
    });
    const p2 = makeInput('p2');
    const { scores, longestPathWinners } = computeScores(
      [p1, p2],
      USA_EDITION,
      NAMES,
    );
    expect(longestPathWinners).toEqual(['p1']);
    expect(scores.find((s) => s.playerId === 'p1')?.bonusPoints[0]?.points).toBe(10);
    expect(scores.find((s) => s.playerId === 'p2')?.bonusPoints).toHaveLength(0);
  });

  it('awards bonus to all tied players', () => {
    const p1 = makeInput('p1', {
      bonusInputs: {
        longest_path: { type: 'player_select', selectedPlayerIds: ['p1', 'p2'] },
      },
    });
    const p2 = makeInput('p2');
    const { scores } = computeScores([p1, p2], USA_EDITION, NAMES);
    expect(scores.find((s) => s.playerId === 'p1')?.bonusPoints[0]?.points).toBe(10);
    expect(scores.find((s) => s.playerId === 'p2')?.bonusPoints[0]?.points).toBe(10);
  });

  it('awards no bonus when nobody is selected', () => {
    const p1 = makeInput('p1', {
      bonusInputs: {
        longest_path: { type: 'player_select', selectedPlayerIds: [] },
      },
    });
    const { scores } = computeScores([p1], USA_EDITION, NAMES);
    expect(scores[0].bonusPoints).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Europe — stations bonus
// ---------------------------------------------------------------------------

describe('computeScores — Europe stations', () => {
  it('awards 4 pts per unused station', () => {
    const p1 = makeInput('p1', {
      bonusInputs: {
        longest_path: { type: 'player_select', selectedPlayerIds: [] },
        stations: { type: 'stepper', value: 2 }, // 2 unused → 8 pts
      },
    });
    const { scores } = computeScores([p1], EUROPE_EDITION, { p1: 'Ania' });
    const stationBonus = scores[0].bonusPoints.find((b) => b.bonusId === 'stations');
    expect(stationBonus?.points).toBe(8);
  });

  it('awards 0 pts for 0 unused stations', () => {
    const p1 = makeInput('p1', {
      bonusInputs: {
        stations: { type: 'stepper', value: 0 },
      },
    });
    const { scores } = computeScores([p1], EUROPE_EDITION, { p1: 'Ania' });
    expect(scores[0].bonusPoints).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Globetrotter (auto from tickets)
// ---------------------------------------------------------------------------

describe('computeScores — globetrotter', () => {
  it('awards bonus to player with most completed tickets', () => {
    const p1 = makeInput('p1', {
      tickets: [
        { id: 't1', value: 10, completed: true },
        { id: 't2', value: 5, completed: true },
      ],
    });
    const p2 = makeInput('p2', {
      tickets: [
        { id: 't3', value: 8, completed: true },
      ],
    });
    const { scores, globetrotterWinners } = computeScores(
      [p1, p2],
      NORDIC_EDITION,
      NAMES,
    );
    expect(globetrotterWinners).toEqual(['p1']);
    expect(scores.find((s) => s.playerId === 'p1')?.bonusPoints[0]?.points).toBe(10);
    expect(scores.find((s) => s.playerId === 'p2')?.bonusPoints).toHaveLength(0);
  });

  it('awards bonus to all tied globetrotter players', () => {
    const p1 = makeInput('p1', {
      tickets: [{ id: 't1', value: 5, completed: true }],
    });
    const p2 = makeInput('p2', {
      tickets: [{ id: 't2', value: 8, completed: true }],
    });
    const { globetrotterWinners } = computeScores([p1, p2], NORDIC_EDITION, NAMES);
    expect(globetrotterWinners).toContain('p1');
    expect(globetrotterWinners).toContain('p2');
  });
});

// ---------------------------------------------------------------------------
// Total score
// ---------------------------------------------------------------------------

describe('computeScores — total score', () => {
  it('combines all components correctly', () => {
    // routes: 1×4-wag = 7pts, tickets: +21 completed −8 failed, longest path: +10
    const p1 = makeInput('p1', {
      routes: [{ length: 4, count: 1 }],
      tickets: [
        { id: 't1', value: 21, completed: true },
        { id: 't2', value: 8,  completed: false },
      ],
      bonusInputs: {
        longest_path: { type: 'player_select', selectedPlayerIds: ['p1'] },
      },
    });
    const { scores } = computeScores([p1], USA_EDITION, NAMES);
    expect(scores[0].totalScore).toBe(7 + 21 - 8 + 10); // 30
  });
});
