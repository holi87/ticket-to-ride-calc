import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../src/store/gameStore';

// ---------------------------------------------------------------------------
// Reset store state between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  useGameStore.setState({
    step: 'edition',
    selectedEditionId: null,
    players: [],
    scoreInputs: {},
    scoringResult: null,
    rankedScores: null,
  });
});

// ---------------------------------------------------------------------------
// Edition selection
// ---------------------------------------------------------------------------

describe('selectEdition', () => {
  it('sets selectedEditionId for a known edition', () => {
    useGameStore.getState().selectEdition('usa');
    expect(useGameStore.getState().selectedEditionId).toBe('usa');
  });

  it('ignores unknown edition ids', () => {
    useGameStore.getState().selectEdition('unknown');
    expect(useGameStore.getState().selectedEditionId).toBeNull();
  });

  it('resets players and scores when edition changes', () => {
    const { selectEdition, addPlayer } = useGameStore.getState();
    selectEdition('usa');
    addPlayer('Ania');
    selectEdition('europe');
    const state = useGameStore.getState();
    expect(state.players).toHaveLength(0);
    expect(Object.keys(state.scoreInputs)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Player management
// ---------------------------------------------------------------------------

describe('addPlayer', () => {
  it('adds a player with auto-generated name', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer();
    expect(useGameStore.getState().players).toHaveLength(1);
    expect(useGameStore.getState().players[0].name).toBe('Gracz 1');
  });

  it('adds a player with a custom name', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    expect(useGameStore.getState().players[0].name).toBe('Ania');
  });

  it('creates a matching scoreInput entry for the new player', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const { players, scoreInputs } = useGameStore.getState();
    const id = players[0].id;
    expect(scoreInputs[id]).toBeDefined();
    expect(scoreInputs[id].playerId).toBe(id);
  });

  it('auto-assigns unique colors', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer();
    useGameStore.getState().addPlayer();
    const { players } = useGameStore.getState();
    expect(players[0].colorId).not.toBe(players[1].colorId);
  });

  it('respects maxPlayers for the edition', () => {
    useGameStore.getState().selectEdition('nordic'); // max 3
    for (let i = 0; i < 5; i++) {
      useGameStore.getState().addPlayer();
    }
    expect(useGameStore.getState().players).toHaveLength(3);
  });

  it('assigns ascending order values', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('P1');
    useGameStore.getState().addPlayer('P2');
    useGameStore.getState().addPlayer('P3');
    const orders = useGameStore.getState().players.map((p) => p.order);
    expect(orders).toEqual([0, 1, 2]);
  });
});

describe('removePlayer', () => {
  it('removes the player and their score input', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().removePlayer(id);
    expect(useGameStore.getState().players).toHaveLength(0);
    expect(useGameStore.getState().scoreInputs[id]).toBeUndefined();
  });

  it('re-indexes order after removal', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('P1');
    useGameStore.getState().addPlayer('P2');
    useGameStore.getState().addPlayer('P3');
    const idToRemove = useGameStore.getState().players[1].id;
    useGameStore.getState().removePlayer(idToRemove);
    const orders = useGameStore.getState().players.map((p) => p.order);
    expect(orders).toEqual([0, 1]);
  });
});

describe('updatePlayerName', () => {
  it('updates the player name', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().updatePlayerName(id, 'Bartek');
    expect(useGameStore.getState().players[0].name).toBe('Bartek');
  });
});

describe('updatePlayerColor', () => {
  it('updates the player color', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().updatePlayerColor(id, 'red');
    expect(useGameStore.getState().players[0].colorId).toBe('red');
  });
});

describe('reorderPlayers', () => {
  it('moves a player from one index to another', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('P1');
    useGameStore.getState().addPlayer('P2');
    useGameStore.getState().addPlayer('P3');
    useGameStore.getState().reorderPlayers(0, 2); // move P1 to end
    const names = useGameStore.getState().players.map((p) => p.name);
    expect(names).toEqual(['P2', 'P3', 'P1']);
  });

  it('re-indexes order values after reorder', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('P1');
    useGameStore.getState().addPlayer('P2');
    useGameStore.getState().reorderPlayers(1, 0);
    const orders = useGameStore.getState().players.map((p) => p.order);
    expect(orders).toEqual([0, 1]);
  });
});

// ---------------------------------------------------------------------------
// Score inputs
// ---------------------------------------------------------------------------

describe('setRouteCount', () => {
  it('adds a route entry', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().setRouteCount(id, 4, 3);
    const input = useGameStore.getState().scoreInputs[id];
    expect(input.routes).toContainEqual({ length: 4, count: 3 });
  });

  it('replaces existing route count for the same length', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().setRouteCount(id, 4, 2);
    useGameStore.getState().setRouteCount(id, 4, 5);
    const routes = useGameStore.getState().scoreInputs[id].routes;
    const route4 = routes.filter((r) => r.length === 4);
    expect(route4).toHaveLength(1);
    expect(route4[0].count).toBe(5);
  });

  it('removes route entry when count is 0', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().setRouteCount(id, 4, 3);
    useGameStore.getState().setRouteCount(id, 4, 0);
    const routes = useGameStore.getState().scoreInputs[id].routes;
    expect(routes.find((r) => r.length === 4)).toBeUndefined();
  });
});

describe('tickets', () => {
  it('adds a ticket with default value=1 completed=true', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().addTicket(id);
    const tickets = useGameStore.getState().scoreInputs[id].tickets;
    expect(tickets).toHaveLength(1);
    expect(tickets[0].value).toBe(1);
    expect(tickets[0].completed).toBe(true);
  });

  it('updates ticket value and completed status', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().addTicket(id);
    const ticketId = useGameStore.getState().scoreInputs[id].tickets[0].id;
    useGameStore.getState().updateTicket(id, ticketId, { value: 21, completed: false });
    const ticket = useGameStore.getState().scoreInputs[id].tickets[0];
    expect(ticket.value).toBe(21);
    expect(ticket.completed).toBe(false);
  });

  it('removes a ticket', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().addTicket(id);
    const ticketId = useGameStore.getState().scoreInputs[id].tickets[0].id;
    useGameStore.getState().removeTicket(id, ticketId);
    expect(useGameStore.getState().scoreInputs[id].tickets).toHaveLength(0);
  });

  it('removes only the specified ticket when multiple exist', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().addTicket(id);
    useGameStore.getState().addTicket(id);
    const tickets = useGameStore.getState().scoreInputs[id].tickets;
    useGameStore.getState().removeTicket(id, tickets[0].id);
    expect(useGameStore.getState().scoreInputs[id].tickets).toHaveLength(1);
  });
});

describe('setBonusInput', () => {
  it('stores bonus input by bonusId', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().setBonusInput(id, 'longest_path', {
      type: 'player_select',
      selectedPlayerIds: [id],
    });
    const val = useGameStore.getState().scoreInputs[id].bonusInputs['longest_path'];
    expect(val).toEqual({ type: 'player_select', selectedPlayerIds: [id] });
  });
});

// ---------------------------------------------------------------------------
// computeResults
// ---------------------------------------------------------------------------

describe('computeResults', () => {
  it('populates rankedScores and sets step to results', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    useGameStore.getState().addPlayer('Bartek');

    const { players } = useGameStore.getState();
    const [p1, p2] = players;

    useGameStore.getState().setRouteCount(p1.id, 4, 2); // 14 pts
    useGameStore.getState().setRouteCount(p2.id, 3, 1); //  4 pts

    useGameStore.getState().computeResults();

    const state = useGameStore.getState();
    expect(state.step).toBe('results');
    expect(state.rankedScores).toHaveLength(2);
    expect(state.rankedScores![0].rank).toBe(1);
    expect(state.rankedScores![0].playerName).toBe('Ania'); // higher score
  });

  it('does nothing if no edition is selected', () => {
    useGameStore.getState().computeResults();
    expect(useGameStore.getState().rankedScores).toBeNull();
    expect(useGameStore.getState().step).toBe('edition');
  });

  it('does nothing if there are no players', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().computeResults();
    expect(useGameStore.getState().rankedScores).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

describe('goToStep', () => {
  it('changes the step', () => {
    useGameStore.getState().goToStep('players');
    expect(useGameStore.getState().step).toBe('players');
  });
});

describe('resetGame', () => {
  it('clears players and scores but keeps edition', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    useGameStore.getState().resetGame();
    const state = useGameStore.getState();
    expect(state.selectedEditionId).toBe('usa');
    expect(state.players).toHaveLength(0);
    expect(state.scoreInputs).toEqual({});
    expect(state.step).toBe('players');
  });
});

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

describe('getEdition', () => {
  it('returns undefined when no edition selected', () => {
    expect(useGameStore.getState().getEdition()).toBeUndefined();
  });

  it('returns the selected edition', () => {
    useGameStore.getState().selectEdition('usa');
    expect(useGameStore.getState().getEdition()?.id).toBe('usa');
  });
});

describe('getPlayerInput', () => {
  it('returns empty input for unknown player id', () => {
    const input = useGameStore.getState().getPlayerInput('nonexistent');
    expect(input.routes).toEqual([]);
    expect(input.tickets).toEqual([]);
  });

  it('returns the stored input for a known player', () => {
    useGameStore.getState().selectEdition('usa');
    useGameStore.getState().addPlayer('Ania');
    const id = useGameStore.getState().players[0].id;
    useGameStore.getState().setRouteCount(id, 3, 2);
    const input = useGameStore.getState().getPlayerInput(id);
    expect(input.routes).toContainEqual({ length: 3, count: 2 });
  });
});
