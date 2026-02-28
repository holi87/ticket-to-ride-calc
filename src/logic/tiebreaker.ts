import type { GameEdition } from '../types/edition';
import type { PlayerScore, PlayerScoreInput } from '../types/scoring';

/**
 * Applies tiebreaker rules defined in the edition config to assign final ranks.
 * Players with the same score and identical tiebreaker values share a rank.
 *
 * Returns a new array of PlayerScore with `rank` filled in (1 = winner).
 */
export function applyTiebreakers(
  scores: PlayerScore[],
  inputs: PlayerScoreInput[],
  edition: GameEdition,
  longestPathWinners: string[],
): PlayerScore[] {
  // Build a lookup of extra tiebreaker data per player
  const inputByPlayer = new Map(inputs.map((i) => [i.playerId, i]));

  /** Higher = better for all keys used in comparisons */
  function getTiebreakerValue(
    score: PlayerScore,
    rule: (typeof edition.tiebreakerRules)[number],
  ): number {
    const input = inputByPlayer.get(score.playerId);
    switch (rule) {
      case 'most_completed_tickets':
        return score.completedTicketsCount;
      case 'longest_path':
        return longestPathWinners.includes(score.playerId) ? 1 : 0;
      case 'fewest_stations_used': {
        // Fewer stations used = better → invert so higher = better
        const maxStations = 3;
        const stationsInput = input?.bonusInputs['stations'];
        const unused =
          stationsInput?.type === 'stepper' ? stationsInput.value : 0;
        const used = maxStations - unused;
        return -used; // fewer used → less negative → higher
      }
      default:
        return 0;
    }
  }

  // Sort descending by: totalScore, then each tiebreaker rule in order
  const sorted = [...scores].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    for (const rule of edition.tiebreakerRules) {
      const diff = getTiebreakerValue(b, rule) - getTiebreakerValue(a, rule);
      if (diff !== 0) return diff;
    }
    return 0;
  });

  // Assign ranks — players who are truly tied share the same rank.
  // We track the previous *ranked* result explicitly because Array.map()
  // receives the original (unranked) array, so prev.rank would be undefined.
  const ranked: PlayerScore[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      ranked.push({ ...sorted[i], rank: 1 });
      continue;
    }
    const cur = sorted[i];
    const prev = ranked[i - 1]; // already-ranked entry
    const sameScore = prev.totalScore === cur.totalScore;
    const sameTiebreakers = edition.tiebreakerRules.every(
      (rule) => getTiebreakerValue(prev, rule) === getTiebreakerValue(cur, rule),
    );
    const rank = sameScore && sameTiebreakers ? (prev.rank ?? 1) : i + 1;
    ranked.push({ ...cur, rank });
  }

  return ranked;
}
