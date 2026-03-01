import { Stepper } from '../ui/Stepper';
import { useGameStore } from '../../store/gameStore';
import { countTrainCarsUsed, wouldExceedCarLimit } from '../../logic/validation';
import type { GameEdition } from '../../types/edition';
import type { PlayerScoreInput } from '../../types/scoring';

interface RouteInputProps {
  playerId: string;
  edition: GameEdition;
  input: PlayerScoreInput;
}

export function RouteInput({ playerId, edition, input }: RouteInputProps) {
  const { setRouteCount } = useGameStore();
  const carsUsed = countTrainCarsUsed(input);
  const carsMax = edition.trainCarsPerPlayer;
  const carsLeft = carsMax - carsUsed;
  const usagePct = Math.min(100, (carsUsed / carsMax) * 100);

  // Wagon bar colour: green → amber → red
  const barColor =
    usagePct >= 90 ? 'bg-red-500' :
    usagePct >= 70 ? 'bg-amber-400' :
    'bg-emerald-500';

  function getCount(length: number): number {
    return input.routes.find((r) => r.length === length)?.count ?? 0;
  }

  function routePts(length: number): number {
    return edition.routePointsTable[length] ?? 0;
  }

  const totalRoutePoints = input.routes.reduce(
    (sum, r) => sum + routePts(r.length) * r.count,
    0,
  );

  return (
    <section>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">
        Trasy
      </h4>

      {/* Route stepper rows */}
      <div className="flex flex-col gap-1 mb-4">
        {edition.availableRouteLengths.map((length) => {
          const count = getCount(length);
          const pts = routePts(length);
          const lineTotal = pts * count;
          const wouldExceed = count === 0
            ? wouldExceedCarLimit(input, length, edition)
            : false;

          return (
            <div
              key={length}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {/* Label */}
              <span className="w-32 text-sm text-[#9ca3af] flex-none">
                {length}-wagon.
                <span className="text-[#6b7280] ml-1">({pts} pkt)</span>
              </span>

              {/* Stepper */}
              <Stepper
                value={count}
                min={0}
                max={Math.floor(carsMax / length)}
                onChange={(v) => setRouteCount(playerId, length, v)}
                disabled={wouldExceed && count === 0}
              />

              {/* Line total */}
              <span className={[
                'ml-auto text-sm font-semibold tabular-nums w-16 text-right',
                lineTotal > 0 ? 'text-[#d4a574]' : 'text-[#4b5563]',
              ].join(' ')}>
                {lineTotal > 0 ? `+${lineTotal}` : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Wagon usage bar */}
      <div className="bg-white/5 rounded-xl p-3">
        <div className="flex justify-between items-center mb-2 text-xs">
          <span className="text-[#9ca3af]">Zużyte wagony</span>
          <span className={carsLeft <= 5 ? 'text-red-400 font-semibold' : 'text-[#f5f0e8]'}>
            {carsUsed} / {carsMax}
            {carsLeft <= 5 && carsLeft > 0 && (
              <span className="text-amber-400 ml-1">(zostało {carsLeft}!)</span>
            )}
            {carsLeft === 0 && <span className="text-red-400 ml-1">brak!</span>}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
      </div>

      {/* Section total */}
      <div className="flex justify-end mt-2 text-sm text-[#9ca3af]">
        Suma tras:&nbsp;
        <span className="text-[#d4a574] font-bold">{totalRoutePoints} pkt</span>
      </div>
    </section>
  );
}
