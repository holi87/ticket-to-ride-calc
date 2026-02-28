import { useRef } from 'react';
import { useGameStore, useEdition, usePlayers } from '../../store/gameStore';
import { Button } from '../ui/Button';
import type { Player } from '../../types/player';
import type { PlayerColor } from '../../types/edition';

// ---------------------------------------------------------------------------
// Color swatch picker
// ---------------------------------------------------------------------------

function ColorPicker({
  colors,
  selectedId,
  usedIds,
  onChange,
}: {
  colors: PlayerColor[];
  selectedId: string | undefined;
  usedIds: Set<string>;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {colors.map((c) => {
        const isSelected = c.id === selectedId;
        const isTaken    = usedIds.has(c.id) && !isSelected;
        return (
          <button
            key={c.id}
            title={c.namePl}
            disabled={isTaken}
            onClick={() => onChange(c.id)}
            className={[
              'w-6 h-6 rounded-full border-2 transition-all duration-150 cursor-pointer',
              isSelected
                ? 'border-[#d4a574] scale-125 shadow-[0_0_6px_rgba(212,165,116,0.6)]'
                : 'border-transparent hover:border-white/40',
              isTaken ? 'opacity-25 cursor-not-allowed' : '',
            ].join(' ')}
            style={{ backgroundColor: c.hex }}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single player row
// ---------------------------------------------------------------------------

function PlayerRow({
  player,
  colors,
  usedColorIds,
  onNameChange,
  onColorChange,
  onRemove,
  canRemove,
}: {
  player: Player;
  colors: PlayerColor[];
  usedColorIds: Set<string>;
  onNameChange: (name: string) => void;
  onColorChange: (colorId: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const color = colors.find((c) => c.id === player.colorId);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0f3460]/60 border border-white/10 hover:border-white/20 transition-colors">
      {/* Color dot + order */}
      <div className="flex-none flex flex-col items-center gap-0.5">
        <div
          className="w-9 h-9 rounded-full border-2 border-white/20 flex items-center justify-center text-sm font-bold text-white/80 shadow"
          style={{ backgroundColor: color?.hex ?? '#374151' }}
        >
          {player.order + 1}
        </div>
      </div>

      {/* Name input */}
      <div className="flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={player.name}
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={30}
          placeholder="Imię gracza"
          className="w-full bg-transparent text-[#f5f0e8] placeholder-[#6b7280] font-medium text-base outline-none border-b border-transparent focus:border-[#d4a574]/60 transition-colors py-0.5"
        />
      </div>

      {/* Color picker */}
      <ColorPicker
        colors={colors}
        selectedId={player.colorId}
        usedIds={usedColorIds}
        onChange={onColorChange}
      />

      {/* Remove button */}
      <button
        onClick={onRemove}
        disabled={!canRemove}
        title="Usuń gracza"
        className="flex-none w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-[#f87171] hover:bg-red-900/20 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
      >
        ✕
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main PlayerSetup component
// ---------------------------------------------------------------------------

export function PlayerSetup() {
  const edition = useEdition();
  const players = usePlayers();
  const {
    addPlayer,
    removePlayer,
    updatePlayerName,
    updatePlayerColor,
    goToStep,
    computeResults,
  } = useGameStore();

  if (!edition) return null;

  const usedColorIds = new Set(players.map((p) => p.colorId).filter(Boolean) as string[]);
  const canAdd    = players.length < edition.maxPlayers;
  const canStart  = players.length >= edition.minPlayers;
  const canRemove = players.length > edition.minPlayers;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#f5f0e8] mb-1">Dodaj graczy</h2>
        <p className="text-[#9ca3af]">
          Edycja <span className="text-[#d4a574] font-medium">{edition.nameShort}</span>
          {' '}· {edition.minPlayers}–{edition.maxPlayers} graczy
        </p>
      </div>

      {/* Player count badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-[#9ca3af]">
          Gracze:{' '}
          <span className={players.length >= edition.minPlayers ? 'text-emerald-400' : 'text-amber-400'}>
            {players.length}
          </span>
          <span className="text-[#6b7280]"> / {edition.maxPlayers}</span>
        </span>
        {players.length < edition.minPlayers && (
          <span className="text-xs text-amber-400">
            (minimum {edition.minPlayers})
          </span>
        )}
      </div>

      {/* Player list */}
      <div className="flex flex-col gap-2 mb-6">
        {players.length === 0 && (
          <p className="text-center text-[#6b7280] py-8 italic">
            Brak graczy — dodaj co najmniej {edition.minPlayers}
          </p>
        )}
        {players.map((player) => (
          <PlayerRow
            key={player.id}
            player={player}
            colors={edition.playerColors}
            usedColorIds={usedColorIds}
            onNameChange={(name) => updatePlayerName(player.id, name)}
            onColorChange={(colorId) => updatePlayerColor(player.id, colorId)}
            onRemove={() => removePlayer(player.id)}
            canRemove={canRemove}
          />
        ))}
      </div>

      {/* Add player button */}
      <Button
        variant="ghost"
        fullWidth
        disabled={!canAdd}
        onClick={() => addPlayer()}
        className="mb-8"
      >
        + Dodaj gracza
        {!canAdd && (
          <span className="text-xs text-[#6b7280] ml-1">(maks. {edition.maxPlayers})</span>
        )}
      </Button>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={() => goToStep('edition')}>
          ← Zmień edycję
        </Button>
        <Button
          size="lg"
          disabled={!canStart}
          onClick={() => {
            goToStep('scoring');
            // Pre-initialise bonus inputs for longest_path / stations
            // (done lazily in ScoreInput, nothing to do here)
          }}
        >
          Zacznij punktację →
        </Button>
      </div>

      {/* Quick-jump to results (dev helper — hidden in prod via disabled state) */}
      {import.meta.env.DEV && canStart && (
        <div className="mt-4 text-center">
          <button
            onClick={computeResults}
            className="text-xs text-[#6b7280] hover:text-[#9ca3af] underline"
          >
            [DEV] Oblicz wyniki z pustymi danymi
          </button>
        </div>
      )}
    </div>
  );
}
