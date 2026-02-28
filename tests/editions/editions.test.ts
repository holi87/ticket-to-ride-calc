import { describe, it, expect } from 'vitest';
import { ALL_EDITIONS, getEditionById } from '../../src/data/editions';
import { STANDARD_ROUTE_POINTS } from '../../src/data/routePoints';

describe('Edition configurations — structural integrity', () => {
  for (const edition of ALL_EDITIONS) {
    describe(`${edition.nameShort} (${edition.id})`, () => {
      it('has required string fields', () => {
        expect(edition.id).toBeTruthy();
        expect(edition.name).toBeTruthy();
        expect(edition.nameShort).toBeTruthy();
        expect(edition.description).toBeTruthy();
      });

      it('has valid player range', () => {
        expect(edition.minPlayers).toBeGreaterThanOrEqual(2);
        expect(edition.maxPlayers).toBeGreaterThanOrEqual(edition.minPlayers);
        expect(edition.maxPlayers).toBeLessThanOrEqual(6);
      });

      it('has positive train cars per player', () => {
        expect(edition.trainCarsPerPlayer).toBeGreaterThan(0);
      });

      it('has at least one available route length', () => {
        expect(edition.availableRouteLengths.length).toBeGreaterThan(0);
      });

      it('route points table covers all available lengths', () => {
        for (const length of edition.availableRouteLengths) {
          expect(edition.routePointsTable[length]).toBeDefined();
          expect(edition.routePointsTable[length]).toBeGreaterThan(0);
        }
      });

      it('route points match the standard table', () => {
        for (const length of edition.availableRouteLengths) {
          expect(edition.routePointsTable[length]).toBe(STANDARD_ROUTE_POINTS[length]);
        }
      });

      it('has at least one player color', () => {
        expect(edition.playerColors.length).toBeGreaterThan(0);
      });

      it('player colors have valid hex codes', () => {
        for (const color of edition.playerColors) {
          expect(color.hex).toMatch(/^#[0-9a-f]{6}$/i);
          expect(color.id).toBeTruthy();
          expect(color.namePl).toBeTruthy();
        }
      });

      it('player color ids are unique', () => {
        const ids = edition.playerColors.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('player colors count matches maxPlayers', () => {
        expect(edition.playerColors.length).toBe(edition.maxPlayers);
      });

      it('has valid status', () => {
        expect(['stable', 'beta']).toContain(edition.status);
      });

      it('has at least one tiebreaker rule', () => {
        expect(edition.tiebreakerRules.length).toBeGreaterThan(0);
      });

      it('bonus ids are unique', () => {
        const ids = edition.bonuses.map((b) => b.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      if (edition.hasStations) {
        it('has station config when hasStations = true', () => {
          expect(edition.stationsPerPlayer).toBeGreaterThan(0);
          expect(edition.stationPointsEach).toBeGreaterThan(0);
        });
      }
    });
  }
});

describe('getEditionById', () => {
  it('returns edition for known id', () => {
    expect(getEditionById('usa')?.id).toBe('usa');
    expect(getEditionById('europe')?.id).toBe('europe');
  });

  it('returns undefined for unknown id', () => {
    expect(getEditionById('unknown')).toBeUndefined();
  });

  it('covers all editions', () => {
    for (const edition of ALL_EDITIONS) {
      expect(getEditionById(edition.id)).toBe(edition);
    }
  });
});

describe('STANDARD_ROUTE_POINTS', () => {
  it('has correct values per official rulebook', () => {
    expect(STANDARD_ROUTE_POINTS[1]).toBe(1);
    expect(STANDARD_ROUTE_POINTS[2]).toBe(2);
    expect(STANDARD_ROUTE_POINTS[3]).toBe(4);
    expect(STANDARD_ROUTE_POINTS[4]).toBe(7);
    expect(STANDARD_ROUTE_POINTS[5]).toBe(10);
    expect(STANDARD_ROUTE_POINTS[6]).toBe(15);
    expect(STANDARD_ROUTE_POINTS[7]).toBe(18);
    expect(STANDARD_ROUTE_POINTS[8]).toBe(21);
    expect(STANDARD_ROUTE_POINTS[9]).toBe(27);
  });
});
