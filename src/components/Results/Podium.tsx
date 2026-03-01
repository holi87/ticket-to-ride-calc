import type { PlayerScore } from '../../types/scoring';
import type { GameEdition } from '../../types/edition';
import type { Player } from '../../types/player';

interface PodiumProps {
  rankedScores: PlayerScore[];
  edition: GameEdition;
  players: Player[];
}

const RANK_CONFIG = {
  1: { label: '🥇', height: 'h-32', bg: 'bg-yellow-500/20', border: 'border-yellow-400', text: 'text-yellow-400', order: 2 },
  2: { label: '🥈', height: 'h-20', bg: 'bg-slate-400/20', border: 'border-slate-400', text: 'text-slate-300', order: 1 },
  3: { label: '🥉', height: 'h-12', bg: 'bg-amber-700/20', border: 'border-amber-600', text: 'text-amber-500', order: 3 },
} as const;

interface PodiumSlotProps {
  score: PlayerScore;
  rank: 1 | 2 | 3;
  edition: GameEdition;
  players: Player[];
}

function PodiumSlot({ score, rank, edition, players }: PodiumSlotProps) {
  const cfg = RANK_CONFIG[rank];
  const player = players.find((p) => p.id === score.playerId);
  const colorDef = edition.playerColors.find((c) => c.id === player?.colorId);
  const hex = colorDef?.hex ?? '#9ca3af';

  return (
    <div className="flex flex-col items-center gap-2" style={{ order: cfg.order }}>
      {/* Rank emoji + avatar */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-3xl"
          style={{ animation: 'pop-in 0.5s ease-out both', animationDelay: `${rank * 0.15}s` }}
        >
          {cfg.label}
        </span>
        <div
          className="w-14 h-14 rounded-full border-4 flex items-center justify-center font-black text-white text-xl shadow-lg"
          style={{ backgroundColor: hex, borderColor: hex + 'aa' }}
        >
          {(score.playerName[0] ?? '?').toUpperCase()}
        </div>
        <div className="text-center">
          <p className={`font-bold text-sm ${rank === 1 ? 'text-yellow-300' : 'text-[#f5f0e8]'}`}>
            {score.playerName}
          </p>
          <p className={`text-lg font-black tabular-nums ${cfg.text}`}>
            {score.totalScore} pkt
          </p>
        </div>
      </div>

      {/* Pedestal */}
      <div
        className={`w-24 ${cfg.height} ${cfg.bg} border-t-4 ${cfg.border} rounded-t-lg flex items-center justify-center`}
        style={{ animation: 'podium-rise 0.6s ease-out both', animationDelay: `${rank * 0.1}s` }}
      >
        <span className={`text-2xl font-black ${cfg.text}`}>{rank}</span>
      </div>
    </div>
  );
}

export function Podium({ rankedScores, edition, players }: PodiumProps) {
  // Top 3 (may have ties — take first occurrence of each rank)
  const first  = rankedScores.find((s) => s.rank === 1);
  const second = rankedScores.find((s) => s.rank === 2);
  const third  = rankedScores.find((s) => s.rank === 3);

  // Handle shared ranks (ties): list all with rank === N
  const allFirst  = rankedScores.filter((s) => s.rank === 1);
  const allSecond = rankedScores.filter((s) => s.rank === 2);
  const allThird  = rankedScores.filter((s) => s.rank === 3);

  // If there's a tie at 1st, show them side by side in the gold slot
  const hasTieFirst  = allFirst.length  > 1;
  const hasTieSecond = allSecond.length > 1;
  const hasTieThird  = allThird.length  > 1;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Winner announcement */}
      {first && (
        <div className="text-center">
          <h2 className="text-3xl font-black text-yellow-400 mb-1">
            {hasTieFirst
              ? `🎉 Remis! ${allFirst.map((s) => s.playerName).join(' & ')} wygrywają!`
              : `🎉 ${first.playerName} wygrywa!`}
          </h2>
          <p className="text-[#9ca3af] text-sm">{edition.nameShort} · wynik końcowy</p>
        </div>
      )}

      {/* Podium columns: 2nd | 1st | 3rd */}
      <div className="flex items-end gap-4 justify-center flex-wrap">
        {/* 2nd place */}
        {second && !hasTieFirst && (
          <PodiumSlot score={second} rank={2} edition={edition} players={players} />
        )}
        {hasTieFirst && allSecond.length > 0 && (
          <PodiumSlot score={allSecond[0]} rank={2} edition={edition} players={players} />
        )}

        {/* 1st place (all tied winners) */}
        {allFirst.map((score) => (
          <PodiumSlot key={score.playerId} score={score} rank={1} edition={edition} players={players} />
        ))}

        {/* 3rd place */}
        {third && !hasTieFirst && !hasTieSecond && (
          <PodiumSlot score={third} rank={3} edition={edition} players={players} />
        )}
        {(hasTieFirst || hasTieSecond) && allThird.length > 0 && (
          <PodiumSlot score={allThird[0]} rank={3} edition={edition} players={players} />
        )}
      </div>

      {/* Tie notices */}
      {hasTieSecond && (
        <p className="text-[#9ca3af] text-xs">
          Remis na 2. miejscu: {allSecond.map((s) => s.playerName).join(', ')}
        </p>
      )}
      {hasTieThird && (
        <p className="text-[#9ca3af] text-xs">
          Remis na 3. miejscu: {allThird.map((s) => s.playerName).join(', ')}
        </p>
      )}
    </div>
  );
}
