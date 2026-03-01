import type { GameEdition } from '../../types/edition';
import type { Player } from '../../types/player';
import type { PlayerScoreInput } from '../../types/scoring';
import { useGameStore } from '../../store/gameStore';
import { RouteInput } from './RouteInput';
import { TicketInput } from './TicketInput';
import { BonusInput } from './BonusInput';

interface PlayerScoreFormProps {
  player: Player;
  edition: GameEdition;
  input: PlayerScoreInput;
}

// ---------------------------------------------------------------------------
// Local running total (per-player slice only, excludes global bonuses)
// ---------------------------------------------------------------------------

function computeLocalTotal(
  input: PlayerScoreInput,
  edition: GameEdition,
): number {
  // Route points
  const routePts = input.routes.reduce(
    (sum, r) => sum + (edition.routePointsTable[r.length] ?? 0) * r.count,
    0,
  );

  // Ticket points
  const ticketPts = input.tickets.reduce(
    (sum, t) => sum + (t.completed ? t.value : -t.value),
    0,
  );

  // Per-player bonus points (stepper + number_input only)
  const bonusPts = edition.bonuses
    .filter((b) => b.inputType === 'stepper' || b.inputType === 'number_input')
    .reduce((sum, bonus) => {
      const val = input.bonusInputs[bonus.id];
      if (!val) return sum;

      if (val.type === 'stepper') {
        if (bonus.calculate) return sum + bonus.calculate(val.value);
        const pointsEach =
          bonus.type === 'stations'
            ? (edition.stationPointsEach ?? bonus.points)
            : bonus.points;
        return sum + val.value * pointsEach;
      }
      if (val.type === 'number') {
        return sum + val.value;
      }
      return sum;
    }, 0);

  return routePts + ticketPts + bonusPts;
}

// ---------------------------------------------------------------------------
// Player avatar / color badge
// ---------------------------------------------------------------------------

function PlayerAvatar({ player, edition }: { player: Player; edition: GameEdition }) {
  const colorDef = edition.playerColors.find((c) => c.id === player.colorId);
  const hex = colorDef?.hex ?? '#9ca3af';
  const initial = (player.name?.[0] ?? '?').toUpperCase();

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base flex-none shadow-md"
      style={{ backgroundColor: hex }}
    >
      {initial}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function PlayerScoreForm({ player, edition, input }: PlayerScoreFormProps) {
  const { setBonusInput } = useGameStore();

  // Bonuses shown in this per-player form (stepper + number_input)
  const perPlayerBonuses = edition.bonuses.filter(
    (b) => b.inputType === 'stepper' || b.inputType === 'number_input',
  );

  const localTotal = computeLocalTotal(input, edition);

  return (
    <div className="flex flex-col gap-6">
      {/* Player header */}
      <div className="flex items-center gap-3">
        <PlayerAvatar player={player} edition={edition} />
        <div>
          <h3 className="text-lg font-bold text-[#f5f0e8]">{player.name}</h3>
          <p className="text-xs text-[#6b7280]">Formularz punktacji</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold text-[#d4a574] tabular-nums">
            {localTotal >= 0 ? localTotal : localTotal}
          </div>
          <div className="text-xs text-[#6b7280]">
            pkt
            {edition.bonuses.some(
              (b) => b.inputType === 'radio_select_player' || b.inputType === 'auto_from_tickets',
            ) && (
              <span className="ml-1 text-[#4b5563]">(bez bonusów globalnych)</span>
            )}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-white/10" />

      {/* Routes */}
      <RouteInput playerId={player.id} edition={edition} input={input} />

      <div className="h-px bg-white/10" />

      {/* Tickets */}
      <TicketInput playerId={player.id} tickets={input.tickets} />

      {/* Per-player bonuses (stations, mandala, passengers, terrain) */}
      {perPlayerBonuses.length > 0 && (
        <>
          <div className="h-px bg-white/10" />
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">
              Bonusy gracza
            </h4>
            <div className="flex flex-col gap-2">
              {perPlayerBonuses.map((bonus) => {
                const stepperMax =
                  bonus.type === 'stations'
                    ? (edition.stationsPerPlayer ?? 10)
                    : 20;

                return (
                  <BonusInput
                    key={bonus.id}
                    bonus={bonus}
                    value={input.bonusInputs[bonus.id]}
                    onChange={(v) => setBonusInput(player.id, bonus.id, v)}
                    stepperMax={stepperMax}
                  />
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
