import type { BonusDefinition } from '../../types/edition';
import type { BonusInputValue } from '../../types/scoring';
import type { Player } from '../../types/player';
import { Stepper } from '../ui/Stepper';

interface BonusInputProps {
  bonus: BonusDefinition;
  value: BonusInputValue | undefined;
  onChange: (v: BonusInputValue) => void;
  /** For radio_select_player: full player list */
  players?: Player[];
  /** For auto_from_tickets: precomputed winner names to display */
  winnerNames?: string[];
  /** Override max value for stepper (e.g. stationsPerPlayer) */
  stepperMax?: number;
}

// ---------------------------------------------------------------------------
// Sub-renderers
// ---------------------------------------------------------------------------

function PlayerSelectBonus({
  bonus,
  value,
  onChange,
  players,
}: {
  bonus: BonusDefinition;
  value: BonusInputValue | undefined;
  onChange: (v: BonusInputValue) => void;
  players: Player[];
}) {
  const selectedIds: string[] =
    value?.type === 'player_select' ? value.selectedPlayerIds : [];

  function toggle(playerId: string) {
    const next = selectedIds.includes(playerId)
      ? selectedIds.filter((id) => id !== playerId)
      : [...selectedIds, playerId];
    onChange({ type: 'player_select', selectedPlayerIds: next });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-[#9ca3af] mb-1">
        {bonus.descriptionPl}
        {bonus.points > 0 && (
          <span className="ml-1 text-[#d4a574] font-semibold">+{bonus.points} pkt</span>
        )}
      </div>

      {players.length === 0 && (
        <p className="text-[#4b5563] text-sm italic">Brak graczy</p>
      )}

      <div className="flex flex-wrap gap-2">
        {players.map((player) => {
          const isSelected = selectedIds.includes(player.id);
          return (
            <button
              key={player.id}
              onClick={() => toggle(player.id)}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 cursor-pointer',
                isSelected
                  ? 'bg-[#d4a574]/20 border-[#d4a574] text-[#d4a574]'
                  : 'bg-white/5 border-white/10 text-[#9ca3af] hover:border-white/30 hover:text-[#f5f0e8]',
              ].join(' ')}
            >
              {isSelected && <span className="mr-1">✓</span>}
              {player.name}
            </button>
          );
        })}
      </div>

      {selectedIds.length === 0 && (
        <p className="text-xs text-[#4b5563] italic">Nie wybrano zwycięzcy</p>
      )}
      {selectedIds.length > 1 && (
        <p className="text-xs text-amber-400">
          Remis — bonus dzielony między {selectedIds.length} graczy
        </p>
      )}
    </div>
  );
}

function AutoBonus({
  bonus,
  winnerNames,
}: {
  bonus: BonusDefinition;
  winnerNames: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs text-[#9ca3af]">
        {bonus.descriptionPl}
        {bonus.points > 0 && (
          <span className="ml-1 text-[#d4a574] font-semibold">+{bonus.points} pkt</span>
        )}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sm">
        <span className="text-[#6b7280] text-xs uppercase tracking-wide font-medium">
          Auto
        </span>
        {winnerNames.length === 0 ? (
          <span className="text-[#4b5563] italic">brak biletów ukończonych</span>
        ) : (
          <span className="text-emerald-400 font-semibold">
            {winnerNames.join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}

function StepperBonus({
  bonus,
  value,
  onChange,
  stepperMax,
}: {
  bonus: BonusDefinition;
  value: BonusInputValue | undefined;
  onChange: (v: BonusInputValue) => void;
  stepperMax: number;
}) {
  const current = value?.type === 'stepper' ? value.value : 0;

  // Compute preview points
  let preview = 0;
  if (bonus.calculate) {
    preview = bonus.calculate(current);
  } else if (bonus.points > 0) {
    preview = current * bonus.points;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-[#9ca3af]">
        {bonus.descriptionPl}
        {bonus.points > 0 && (
          <span className="ml-1 text-[#9ca3af]">({bonus.points} pkt / szt.)</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Stepper
          value={current}
          min={0}
          max={stepperMax}
          onChange={(v) => onChange({ type: 'stepper', value: v })}
        />
        <span className={[
          'text-sm font-semibold tabular-nums',
          preview > 0 ? 'text-[#d4a574]' : 'text-[#4b5563]',
        ].join(' ')}>
          {preview > 0 ? `+${preview} pkt` : '—'}
        </span>
      </div>
    </div>
  );
}

function NumberBonus({
  bonus,
  value,
  onChange,
}: {
  bonus: BonusDefinition;
  value: BonusInputValue | undefined;
  onChange: (v: BonusInputValue) => void;
}) {
  const current = value?.type === 'number' ? value.value : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-[#9ca3af]">
        {bonus.descriptionPl}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={-999}
          max={999}
          value={current}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            onChange({ type: 'number', value: isNaN(v) ? 0 : v });
          }}
          className="w-24 bg-white/10 border border-white/10 focus:border-[#d4a574]/60 rounded-lg px-3 py-1.5 text-center text-[#f5f0e8] font-bold text-sm outline-none tabular-nums transition-colors"
        />
        <span className={[
          'text-sm font-semibold tabular-nums',
          current > 0 ? 'text-[#d4a574]' : current < 0 ? 'text-red-400' : 'text-[#4b5563]',
        ].join(' ')}>
          {current > 0 ? `+${current} pkt` : current < 0 ? `${current} pkt` : '—'}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function BonusInput({
  bonus,
  value,
  onChange,
  players = [],
  winnerNames = [],
  stepperMax = 10,
}: BonusInputProps) {
  return (
    <div className="px-3 py-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
      <h5 className="text-sm font-semibold text-[#e8c49a] mb-2 flex items-center gap-2">
        <span>🎁</span>
        {bonus.namePl}
      </h5>

      {bonus.inputType === 'radio_select_player' && (
        <PlayerSelectBonus
          bonus={bonus}
          value={value}
          onChange={onChange}
          players={players}
        />
      )}

      {bonus.inputType === 'auto_from_tickets' && (
        <AutoBonus bonus={bonus} winnerNames={winnerNames} />
      )}

      {bonus.inputType === 'stepper' && (
        <StepperBonus
          bonus={bonus}
          value={value}
          onChange={onChange}
          stepperMax={stepperMax}
        />
      )}

      {bonus.inputType === 'number_input' && (
        <NumberBonus bonus={bonus} value={value} onChange={onChange} />
      )}
    </div>
  );
}
