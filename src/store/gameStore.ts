import { create } from 'zustand';
import { nanoid } from '../utils/nanoid';
import { getEditionById } from '../data/editions';
import { computeScores } from '../logic/scoring';
import { applyTiebreakers } from '../logic/tiebreaker';
import type { Player } from '../types/player';
import type {
  PlayerScoreInput,
  RouteInput,
  TicketInput,
  BonusInputValue,
  PlayerScore,
  ScoringResult,
} from '../types/scoring';
import type { GameEdition } from '../types/edition';

// ---------------------------------------------------------------------------
// Step type
// ---------------------------------------------------------------------------

export type GameStep = 'edition' | 'players' | 'scoring' | 'results';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface GameState {
  // --- Navigation ---
  step: GameStep;

  // --- Edition ---
  selectedEditionId: string | null;

  // --- Players ---
  players: Player[];

  // --- Score inputs (keyed by playerId) ---
  scoreInputs: Record<string, PlayerScoreInput>;

  // --- Computed results (populated when step === 'results') ---
  scoringResult: ScoringResult | null;
  rankedScores: PlayerScore[] | null;

  // ---------------------------------------------------------------------------
  // Actions — navigation
  // ---------------------------------------------------------------------------
  goToStep: (step: GameStep) => void;
  resetGame: () => void;

  // ---------------------------------------------------------------------------
  // Actions — edition
  // ---------------------------------------------------------------------------
  selectEdition: (editionId: string) => void;

  // ---------------------------------------------------------------------------
  // Actions — players
  // ---------------------------------------------------------------------------
  addPlayer: (name?: string) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerName: (playerId: string, name: string) => void;
  updatePlayerColor: (playerId: string, colorId: string) => void;
  reorderPlayers: (fromIndex: number, toIndex: number) => void;

  // ---------------------------------------------------------------------------
  // Actions — score inputs
  // ---------------------------------------------------------------------------
  setRouteCount: (playerId: string, length: number, count: number) => void;
  addTicket: (playerId: string, completed?: boolean) => void;
  updateTicket: (playerId: string, ticketId: string, patch: Partial<TicketInput>) => void;
  removeTicket: (playerId: string, ticketId: string) => void;
  setBonusInput: (playerId: string, bonusId: string, value: BonusInputValue) => void;

  // ---------------------------------------------------------------------------
  // Actions — compute results
  // ---------------------------------------------------------------------------
  computeResults: () => void;

  // ---------------------------------------------------------------------------
  // Derived helpers (not stored — computed on the fly)
  // ---------------------------------------------------------------------------
  getEdition: () => GameEdition | undefined;
  getPlayerInput: (playerId: string) => PlayerScoreInput;
}

// ---------------------------------------------------------------------------
// Initial score input for a player
// ---------------------------------------------------------------------------

function makeInitialInput(playerId: string): PlayerScoreInput {
  return {
    playerId,
    routes: [],
    tickets: [],
    bonusInputs: {},
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const INITIAL_STATE = {
  step: 'edition' as GameStep,
  selectedEditionId: null,
  players: [],
  scoreInputs: {},
  scoringResult: null,
  rankedScores: null,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...INITIAL_STATE,

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  goToStep: (step) => set({ step }),

  resetGame: () =>
    set({
      ...INITIAL_STATE,
      // preserve edition selection so user can quickly replay
      selectedEditionId: get().selectedEditionId,
      step: 'players',
      players: [],
      scoreInputs: {},
      scoringResult: null,
      rankedScores: null,
    }),

  // -------------------------------------------------------------------------
  // Edition
  // -------------------------------------------------------------------------

  selectEdition: (editionId) => {
    const edition = getEditionById(editionId);
    if (!edition) return;
    set({
      selectedEditionId: editionId,
      // Reset players and scores when changing edition
      players: [],
      scoreInputs: {},
      scoringResult: null,
      rankedScores: null,
    });
  },

  // -------------------------------------------------------------------------
  // Players
  // -------------------------------------------------------------------------

  addPlayer: (name) => {
    const { players, selectedEditionId } = get();
    const edition = selectedEditionId ? getEditionById(selectedEditionId) : undefined;
    if (edition && players.length >= edition.maxPlayers) return;

    const id = nanoid();
    const order = players.length;
    const playerName = name ?? `Gracz ${order + 1}`;

    // Auto-assign next available color
    const usedColors = new Set(players.map((p) => p.colorId).filter(Boolean));
    const colorId = edition?.playerColors.find((c) => !usedColors.has(c.id))?.id;

    const newPlayer: Player = { id, name: playerName, colorId, order };

    set((s) => ({
      players: [...s.players, newPlayer],
      scoreInputs: {
        ...s.scoreInputs,
        [id]: makeInitialInput(id),
      },
    }));
  },

  removePlayer: (playerId) => {
    set((s) => {
      const players = s.players
        .filter((p) => p.id !== playerId)
        .map((p, i) => ({ ...p, order: i }));
      const { [playerId]: _removed, ...scoreInputs } = s.scoreInputs;
      return { players, scoreInputs };
    });
  },

  updatePlayerName: (playerId, name) => {
    set((s) => ({
      players: s.players.map((p) => (p.id === playerId ? { ...p, name } : p)),
    }));
  },

  updatePlayerColor: (playerId, colorId) => {
    set((s) => ({
      players: s.players.map((p) => (p.id === playerId ? { ...p, colorId } : p)),
    }));
  },

  reorderPlayers: (fromIndex, toIndex) => {
    set((s) => {
      const players = [...s.players];
      const [moved] = players.splice(fromIndex, 1);
      players.splice(toIndex, 0, moved);
      return { players: players.map((p, i) => ({ ...p, order: i })) };
    });
  },

  // -------------------------------------------------------------------------
  // Score inputs
  // -------------------------------------------------------------------------

  setRouteCount: (playerId, length, count) => {
    set((s) => {
      const prev = s.scoreInputs[playerId] ?? makeInitialInput(playerId);
      const routes: RouteInput[] = prev.routes.filter((r) => r.length !== length);
      if (count > 0) routes.push({ length, count });
      return {
        scoreInputs: {
          ...s.scoreInputs,
          [playerId]: { ...prev, routes },
        },
      };
    });
  },

  addTicket: (playerId, completed = true) => {
    set((s) => {
      const prev = s.scoreInputs[playerId] ?? makeInitialInput(playerId);
      const newTicket: TicketInput = { id: nanoid(), value: 1, completed };
      return {
        scoreInputs: {
          ...s.scoreInputs,
          [playerId]: { ...prev, tickets: [...prev.tickets, newTicket] },
        },
      };
    });
  },

  updateTicket: (playerId, ticketId, patch) => {
    set((s) => {
      const prev = s.scoreInputs[playerId] ?? makeInitialInput(playerId);
      return {
        scoreInputs: {
          ...s.scoreInputs,
          [playerId]: {
            ...prev,
            tickets: prev.tickets.map((t) =>
              t.id === ticketId ? { ...t, ...patch } : t,
            ),
          },
        },
      };
    });
  },

  removeTicket: (playerId, ticketId) => {
    set((s) => {
      const prev = s.scoreInputs[playerId] ?? makeInitialInput(playerId);
      return {
        scoreInputs: {
          ...s.scoreInputs,
          [playerId]: {
            ...prev,
            tickets: prev.tickets.filter((t) => t.id !== ticketId),
          },
        },
      };
    });
  },

  setBonusInput: (playerId, bonusId, value) => {
    set((s) => {
      const prev = s.scoreInputs[playerId] ?? makeInitialInput(playerId);
      return {
        scoreInputs: {
          ...s.scoreInputs,
          [playerId]: {
            ...prev,
            bonusInputs: { ...prev.bonusInputs, [bonusId]: value },
          },
        },
      };
    });
  },

  // -------------------------------------------------------------------------
  // Compute results
  // -------------------------------------------------------------------------

  computeResults: () => {
    const { selectedEditionId, players, scoreInputs } = get();
    const edition = selectedEditionId ? getEditionById(selectedEditionId) : undefined;
    if (!edition || players.length === 0) return;

    const inputs = players.map(
      (p) => scoreInputs[p.id] ?? makeInitialInput(p.id),
    );
    const playerNames = Object.fromEntries(players.map((p) => [p.id, p.name]));

    const scoringResult = computeScores(inputs, edition, playerNames);

    const rankedScores = applyTiebreakers(
      scoringResult.scores,
      inputs,
      edition,
      scoringResult.longestPathWinners,
    );

    set({ scoringResult, rankedScores, step: 'results' });
  },

  // -------------------------------------------------------------------------
  // Derived helpers
  // -------------------------------------------------------------------------

  getEdition: () => {
    const { selectedEditionId } = get();
    return selectedEditionId ? getEditionById(selectedEditionId) : undefined;
  },

  getPlayerInput: (playerId) => {
    const { scoreInputs } = get();
    return scoreInputs[playerId] ?? makeInitialInput(playerId);
  },
}));

// ---------------------------------------------------------------------------
// Selector hooks for common slices (prevents unnecessary re-renders)
// ---------------------------------------------------------------------------

export const useStep = () => useGameStore((s) => s.step);
export const useEditionId = () => useGameStore((s) => s.selectedEditionId);
export const useEdition = () => useGameStore((s) => s.getEdition());
export const usePlayers = () => useGameStore((s) => s.players);
export const useRankedScores = () => useGameStore((s) => s.rankedScores);
export const useScoringResult = () => useGameStore((s) => s.scoringResult);
