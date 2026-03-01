import { useState } from 'react';
import type { PlayerScore } from '../../types/scoring';
import type { GameEdition } from '../../types/edition';
import type { Player } from '../../types/player';

interface ScoreBreakdownProps {
  rankedScores: PlayerScore[];
  edition: GameEdition;
  players: Player[];
}

interface PlayerBreakdownProps {
  score: PlayerScore;
  edition: GameEdition;
  players: Player[];
  defaultOpen?: boolean;
}

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function PlayerBreakdown({ score, edition, players, defaultOpen = false }: PlayerBreakdownProps) {
  const [open, setOpen] = useState(defaultOpen);
  const player = players.find((p) => p.id === score.playerId);
  const colorDef = edition.playerColors.find((c) => c.id === player?.colorId);
  const hex = colorDef?.hex ?? '#9ca3af';
  const medal = score.rank ? (RANK_MEDAL[score.rank] ?? `#${score.rank}`) : '—';

  const totalBonusPoints = score.bonusPoints.reduce((s, b) => s + b.points, 0);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {/* Header (always visible — click to toggle) */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer text-left"
      >
        {/* Color dot */}
        <div
          className="w-4 h-4 rounded-full flex-none shadow-sm"
          style={{ backgroundColor: hex }}
        />
        {/* Rank */}
        <span className="text-lg font-bold w-8 text-center">{medal}</span>
        {/* Name */}
        <span className="flex-1 font-semibold text-[#f5f0e8] text-sm">{score.playerName}</span>
        {/* Total */}
        <span className="font-black text-[#d4a574] text-lg tabular-nums">
          {score.totalScore} pkt
        </span>
        {/* Chevron */}
        <span className={`text-[#6b7280] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {/* Expanded breakdown */}
      {open && (
        <div className="px-4 pb-4 border-t border-white/10 text-sm">
          {/* Quick stat strip */}
          <div className="flex gap-4 flex-wrap py-3 text-xs text-[#9ca3af]">
            <span>🚂 {score.trainCarsUsed}/{edition.trainCarsPerPlayer} wagonów</span>
            {score.completedTicketsCount > 0 && (
              <span className="text-emerald-400">✓ {score.completedTicketsCount} biletów</span>
            )}
            {score.failedTicketsCount > 0 && (
              <span className="text-red-400">✗ {score.failedTicketsCount} nieukończonych</span>
            )}
          </div>

          {/* Routes */}
          {score.routeBreakdown.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-[#9ca3af] font-semibold mb-1 uppercase text-xs tracking-wide">
                <span>Trasy</span>
                <span className="text-[#d4a574]">+{score.routePoints} pkt</span>
              </div>
              {score.routeBreakdown.map((r) => (
                <div key={r.length} className="flex justify-between text-[#6b7280] pl-4 py-0.5">
                  <span>{r.count}× trasa {r.length}-wag.</span>
                  <span className="text-[#9ca3af] tabular-nums">+{r.points}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tickets */}
          {(score.completedTicketsCount > 0 || score.failedTicketsCount > 0) && (
            <div className="mb-3">
              <div className="flex justify-between text-[#9ca3af] font-semibold mb-1 uppercase text-xs tracking-wide">
                <span>Bilety</span>
                <span className={score.completedTicketsPoints + score.failedTicketsPoints >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {score.completedTicketsPoints + score.failedTicketsPoints >= 0 ? '+' : ''}
                  {score.completedTicketsPoints + score.failedTicketsPoints} pkt
                </span>
              </div>
              {score.completedTicketsCount > 0 && (
                <div className="flex justify-between text-emerald-400 pl-4 py-0.5">
                  <span>Ukończone ({score.completedTicketsCount})</span>
                  <span className="tabular-nums">+{score.completedTicketsPoints}</span>
                </div>
              )}
              {score.failedTicketsCount > 0 && (
                <div className="flex justify-between text-red-400 pl-4 py-0.5">
                  <span>Nieukończone ({score.failedTicketsCount})</span>
                  <span className="tabular-nums">{score.failedTicketsPoints}</span>
                </div>
              )}
            </div>
          )}

          {/* Bonuses */}
          {score.bonusPoints.length > 0 && (
            <div className="mb-2">
              <div className="flex justify-between text-[#9ca3af] font-semibold mb-1 uppercase text-xs tracking-wide">
                <span>Bonusy</span>
                <span className="text-[#d4a574]">+{totalBonusPoints} pkt</span>
              </div>
              {score.bonusPoints.map((b) => (
                <div key={b.bonusId} className="flex justify-between text-[#d4a574]/80 pl-4 py-0.5">
                  <span>{b.bonusNamePl}</span>
                  <span className="tabular-nums">+{b.points}</span>
                </div>
              ))}
            </div>
          )}

          {/* Grand total row */}
          <div className="flex justify-between border-t border-white/10 pt-2 mt-2 font-black">
            <span className="text-[#9ca3af]">SUMA</span>
            <span className="text-[#d4a574] text-base tabular-nums">{score.totalScore} pkt</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ScoreBreakdown({ rankedScores, edition, players }: ScoreBreakdownProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#9ca3af] mb-2">
        Pełne wyniki
      </h3>
      {rankedScores.map((score, i) => (
        <PlayerBreakdown
          key={score.playerId}
          score={score}
          edition={edition}
          players={players}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  );
}
