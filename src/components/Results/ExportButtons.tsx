import { useState } from 'react';
import type { PlayerScore } from '../../types/scoring';
import type { GameEdition } from '../../types/edition';
import type { Player } from '../../types/player';
import { exportJSON, exportCSV, exportPDF } from '../../logic/export';

interface ExportButtonsProps {
  edition: GameEdition;
  players: Player[];
  rankedScores: PlayerScore[];
}

interface ExportBtnProps {
  label: string;
  icon: string;
  onClick: () => Promise<void> | void;
}

function ExportBtn({ label, icon, onClick }: ExportBtnProps) {
  const [busy, setBusy] = useState(false);

  async function handle() {
    setBusy(true);
    try {
      await onClick();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={busy}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#d4a574]/50 text-[#f5f0e8] text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-wait"
    >
      <span>{icon}</span>
      {busy ? 'Generuję…' : label}
    </button>
  );
}

export function ExportButtons({ edition, players, rankedScores }: ExportButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
        Eksportuj wyniki
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <ExportBtn
          icon="📋"
          label="JSON"
          onClick={() => exportJSON(edition, players, rankedScores)}
        />
        <ExportBtn
          icon="📊"
          label="CSV"
          onClick={() => exportCSV(edition, players, rankedScores)}
        />
        <ExportBtn
          icon="📄"
          label="PDF"
          onClick={() => exportPDF(edition, players, rankedScores)}
        />
      </div>
    </div>
  );
}
