import type { GameEdition } from '../types/edition';
import type {
  PlayerScoreInput,
  PlayerScore,
  ScoringResult,
  RouteBreakdownItem,
  BonusBreakdownItem,
} from '../types/scoring';

/**
 * Computes route points and breakdown for a single player.
 */
function computeRoutePoints(
  input: PlayerScoreInput,
  edition: GameEdition,
): { points: number; breakdown: RouteBreakdownItem[]; carsUsed: number } {
  let points = 0;
  let carsUsed = 0;
  const breakdown: RouteBreakdownItem[] = [];

  for (const route of input.routes) {
    if (route.count <= 0) continue;
    const pointsPerRoute = edition.routePointsTable[route.length] ?? 0;
    const total = pointsPerRoute * route.count;
    points += total;
    carsUsed += route.length * route.count;
    breakdown.push({ length: route.length, count: route.count, points: total });
  }

  return { points, breakdown, carsUsed };
}

/**
 * Computes ticket points (positive for completed, negative for failed).
 */
function computeTicketPoints(input: PlayerScoreInput): {
  completedCount: number;
  completedPoints: number;
  failedCount: number;
  failedPoints: number;
} {
  let completedCount = 0;
  let completedPoints = 0;
  let failedCount = 0;
  let failedPoints = 0;

  for (const ticket of input.tickets) {
    if (ticket.completed) {
      completedCount++;
      completedPoints += ticket.value;
    } else {
      failedCount++;
      failedPoints -= ticket.value; // stored as negative
    }
  }

  return { completedCount, completedPoints, failedCount, failedPoints };
}

/**
 * Determines which player ids receive the globetrotter bonus.
 * The player(s) with the most completed tickets win it.
 */
function resolveGlobetrotterWinners(inputs: PlayerScoreInput[]): string[] {
  let maxCompleted = -1;
  for (const input of inputs) {
    const count = input.tickets.filter((t) => t.completed).length;
    if (count > maxCompleted) maxCompleted = count;
  }
  if (maxCompleted <= 0) return [];
  return inputs
    .filter((i) => i.tickets.filter((t) => t.completed).length === maxCompleted)
    .map((i) => i.playerId);
}

/**
 * Determines which player ids receive the longest path bonus,
 * based on explicit player_select bonus input.
 */
function resolveLongestPathWinners(inputs: PlayerScoreInput[]): string[] {
  for (const input of inputs) {
    const bonusVal = input.bonusInputs['longest_path'];
    if (bonusVal?.type === 'player_select') {
      return bonusVal.selectedPlayerIds;
    }
  }
  return [];
}

/**
 * Computes bonus points for a single player given the resolved winners.
 */
function computeBonusPoints(
  input: PlayerScoreInput,
  edition: GameEdition,
  longestPathWinners: string[],
  globetrotterWinners: string[],
): BonusBreakdownItem[] {
  const items: BonusBreakdownItem[] = [];

  for (const bonus of edition.bonuses) {
    const bonusInput = input.bonusInputs[bonus.id];
    let points = 0;

    switch (bonus.type) {
      case 'longest_path': {
        if (longestPathWinners.includes(input.playerId)) {
          points = bonus.points;
        }
        break;
      }
      case 'globetrotter': {
        if (globetrotterWinners.includes(input.playerId)) {
          points = bonus.points;
        }
        break;
      }
      case 'stations': {
        // Points for each unused station
        if (bonusInput?.type === 'stepper') {
          const stationPointsEach = edition.stationPointsEach ?? bonus.points;
          points = bonusInput.value * stationPointsEach;
        }
        break;
      }
      case 'mandala': {
        if (bonusInput?.type === 'stepper') {
          points = bonus.calculate
            ? bonus.calculate(bonusInput.value)
            : bonusInput.value * bonus.points;
        }
        break;
      }
      case 'passengers':
      case 'terrain': {
        if (bonusInput?.type === 'number') {
          points = bonusInput.value;
        }
        break;
      }
    }

    if (points !== 0) {
      items.push({
        bonusId: bonus.id,
        bonusName: bonus.name,
        bonusNamePl: bonus.namePl,
        points,
      });
    }
  }

  return items;
}

/**
 * Main scoring function. Computes all player scores for a given edition.
 */
export function computeScores(
  inputs: PlayerScoreInput[],
  edition: GameEdition,
  playerNames: Record<string, string>,
): ScoringResult {
  const longestPathWinners = resolveLongestPathWinners(inputs);
  const globetrotterWinners = resolveGlobetrotterWinners(inputs);

  const scores: PlayerScore[] = inputs.map((input) => {
    const { points: routePoints, breakdown: routeBreakdown, carsUsed } =
      computeRoutePoints(input, edition);

    const { completedCount, completedPoints, failedCount, failedPoints } =
      computeTicketPoints(input);

    const bonusItems = computeBonusPoints(
      input,
      edition,
      longestPathWinners,
      globetrotterWinners,
    );

    const bonusTotal = bonusItems.reduce((sum, b) => sum + b.points, 0);
    const totalScore =
      routePoints + completedPoints + failedPoints + bonusTotal;

    return {
      playerId: input.playerId,
      playerName: playerNames[input.playerId] ?? input.playerId,
      routePoints,
      routeBreakdown,
      completedTicketsCount: completedCount,
      completedTicketsPoints: completedPoints,
      failedTicketsCount: failedCount,
      failedTicketsPoints: failedPoints,
      bonusPoints: bonusItems,
      totalScore,
      trainCarsUsed: carsUsed,
      trainCarsRemaining: edition.trainCarsPerPlayer - carsUsed,
    };
  });

  return { scores, longestPathWinners, globetrotterWinners };
}
