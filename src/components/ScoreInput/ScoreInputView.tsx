import { useState } from 'react';
import {
  useGameStore,
  useEdition,
  usePlayers,
} from '../../store/gameStore';
import { Button } from '../ui/Button';
import { PlayerScoreForm } from './PlayerScoreForm';
import { BonusInput } from './BonusInput';

// ---------------------------------------------------------------------------
// Globetrotter winner resolver (mirrors scoring.ts logic, for preview display)
// ---------------------------------------------------------------------------

function resolveGlobetrotterWinnerNames(
  playerIds: string[],
  playerNames: Record<string, string>,
  inputs: Record<string, { tickets: Array<{ completed: boolean }> }>,
): string[] {
  let maxCompleted = -1;
  for (const id of playerIds) {
    const count = inputs[id]?.tickets.filter((t) => t.completed).length ?? 0;
    if (count > maxCompleted) maxCompleted = count;
  }
  if (maxCompleted <= 0) return [];
  return playerIds
    .filter((id) => (inputs[id]?.tickets.filter((t) => t.completed).length ?? 0) === maxCompleted)
    .map((id) => playerNames[id] ?? id);
}

// ---------------------------------------------------------------------------
// Global bonuses panel (longest_path + globetrotter)
// ---------------------------------------------------------------------------

function GlobalBonusesPanel() {
  const edition = useEdition();
  const players = usePlayers();
  const { scoreInputs, setBonusInput, getPlayerInput } = useGameStore();

  if (!edition) return null;

  const globalBonuses = edition.bonuses.filter(
    (b) => b.inputType === 'radio_select_player' || b.inputType === 'auto_from_tickets',
  );

  if (globalBonuses.length === 0) return null;

  const firstPlayerId = players[0]?.id;
  const firstInput = firstPlayerId ? getPlayerInput(firstPlayerId) : null;

  const playerNames: Record<string, string> = {};
  for (const p of players) playerNames[p.id] = p.name;

  const globetrotterWinnerNames = resolveGlobetrotterWinnerNames(
    players.map((p) => p.id),
    playerNames,
    scoreInputs,
  );

  return (
    <div className="rounded-xl border border-[#d4a574]/30 bg-[#d4a574]/5 p-4 mb-6">
      <h3 className="text-sm font-bold text-[#d4a574] uppercase tracking-widest mb-3 flex items-center gap-2">
        <span>🏆</span> Bonusy globalne
      </h3>
      <div className="flex flex-col gap-3">
        {globalBonuses.map((bonus) => {
          if (bonus.inputType === 'radio_select_player') {
            const value = firstInput?.bonusInputs[bonus.id];
            return (
              <BonusInput
                key={bonus.id}
                bonus={bonus}
                value={value}
                onChange={(v) => {
                  if (!firstPlayerId) return;
                  setBonusInput(firstPlayerId, bonus.id, v);
                }}
                players={players}
              />
            );
          }
          return (
            <BonusInput
              key={bonus.id}
              bonus={bonus}
              value={{ type: 'auto' }}
              onChange={() => {}}
              winnerNames={globetrotterWinnerNames}
            />
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab bar (used on mobile always, and desktop for 4+ players)
// ---------------------------------------------------------------------------

interface TabBarProps {
  players: Array<{ id: string; name: string; colorId?: string }>;
  activeId: string;
  onSelect: (id: string) => void;
  edition: { playerColors: Array<{ id: string; hex: string }> };
}

function TabBar({ players, activeId, onSelect, edition }: TabBarProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-4 scrollbar-hide">
      {players.map((player) => {
        const colorDef = edition.playerColors.find((c) => c.id === player.colorId);
        const hex = colorDef?.hex ?? '#9ca3af';
        const isActive = player.id === activeId;
        return (
          <button
            key={player.id}
            onClick={() => onSelect(player.id)}
            className={[
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
              'transition-all duration-150 whitespace-nowrap cursor-pointer border flex-none',
              isActive
                ? 'border-[#d4a574] bg-[#d4a574]/15 text-[#f5f0e8]'
                : 'border-white/10 bg-white/5 text-[#9ca3af] hover:text-[#f5f0e8] hover:border-white/20',
            ].join(' ')}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ backgroundColor: hex }} />
            {player.name}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

export function ScoreInputView() {
  const edition = useEdition();
  const players = usePlayers();
  const { getPlayerInput, computeResults, goToStep } = useGameStore();

  const [activePlayerId, setActivePlayerId] = useState<string>(players[0]?.id ?? '');
  const validActiveId = players.find((p) => p.id === activePlayerId)?.id ?? players[0]?.id ?? '';

  if (!edition || players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-[#6b7280]">Brak danych gry. Zacznij od nowa.</p>
        <Button onClick={() => goToStep('edition')} variant="secondary">← Wróć do wyboru edycji</Button>
      </div>
    );
  }

  const useSideBySide = players.length <= 3; // on lg screens only

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f5f0e8]">Wprowadź wyniki</h2>
        <p className="text-[#6b7280] text-sm mt-1">{edition.nameShort} · {players.length} graczy</p>
      </div>

      {/* Global bonuses */}
      <GlobalBonusesPanel />

      {/* ── Desktop side-by-side (lg+, ≤3 players) ── */}
      {useSideBySide && (
        <div className={[
          'hidden lg:grid gap-4',
          players.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
        ].join(' ')}>
          {players.map((player) => (
            <div key={player.id} className="rounded-xl border border-white/10 bg-white/3 p-5">
              <PlayerScoreForm player={player} edition={edition} input={getPlayerInput(player.id)} />
            </div>
          ))}
        </div>
      )}

      {/* ── Tab layout: always on mobile, always for 4+ players ── */}
      <div className={useSideBySide ? 'lg:hidden' : ''}>
        <TabBar
          players={players}
          activeId={validActiveId}
          onSelect={setActivePlayerId}
          edition={edition}
        />

        {/* Active player form */}
        {players
          .filter((p) => p.id === validActiveId)
          .map((player) => (
            <div key={player.id} className="rounded-xl border border-white/10 bg-white/3 p-4 sm:p-5">
              <PlayerScoreForm player={player} edition={edition} input={getPlayerInput(player.id)} />
            </div>
          ))}

        {/* Prev / Next navigation */}
        {(() => {
          const idx = players.findIndex((p) => p.id === validActiveId);
          const prev = players[idx - 1];
          const next = players[idx + 1];
          return (
            <div className="flex justify-between mt-4">
              <Button variant="ghost" size="sm" disabled={!prev} onClick={() => prev && setActivePlayerId(prev.id)}>
                ← {prev?.name ?? ''}
              </Button>
              <Button variant="ghost" size="sm" disabled={!next} onClick={() => next && setActivePlayerId(next.id)}>
                {next?.name ?? ''} →
              </Button>
            </div>
          );
        })()}
      </div>

      {/* Bottom actions */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <Button variant="secondary" onClick={() => goToStep('players')}>
          ← Wróć do graczy
        </Button>
        <Button variant="primary" size="lg" onClick={() => computeResults()}>
          Oblicz wyniki 🎉
        </Button>
      </div>
    </div>
  );
}
