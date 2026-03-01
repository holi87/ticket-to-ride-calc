import { useState, useEffect } from 'react';
import {
  useGameStore,
  useEdition,
  usePlayers,
  useRankedScores,
} from '../../store/gameStore';
import { Button } from '../ui/Button';
import { Confetti } from './Confetti';
import { Podium } from './Podium';
import { ScoreBreakdown } from './ScoreBreakdown';

export function ResultsView() {
  const edition = useEdition();
  const players = usePlayers();
  const rankedScores = useRankedScores();
  const { goToStep, resetGame } = useGameStore();

  // Show confetti briefly then remove it (performance)
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(t);
  }, []);

  if (!edition || !rankedScores || rankedScores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-[#6b7280]">Brak wyników. Wróć do punktacji.</p>
        <Button onClick={() => goToStep('scoring')} variant="secondary">
          ← Wróć do punktacji
        </Button>
      </div>
    );
  }

  function handleNewGame() {
    resetGame();
  }

  function handleEditScores() {
    goToStep('scoring');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* Confetti overlay */}
      {showConfetti && <Confetti count={100} />}

      {/* Podium */}
      <Podium rankedScores={rankedScores} edition={edition} players={players} />

      {/* Divider */}
      <div className="h-px bg-white/10 my-6" />

      {/* Full breakdown */}
      <ScoreBreakdown rankedScores={rankedScores} edition={edition} players={players} />

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <Button variant="secondary" onClick={handleEditScores}>
          ✏️ Edytuj wyniki
        </Button>
        <Button variant="primary" size="lg" onClick={handleNewGame}>
          🔄 Nowa gra
        </Button>
      </div>

      {/* Footer info */}
      <p className="text-center text-[#4b5563] text-xs mt-8">
        Ticket to Ride · {edition.nameShort} · {players.length} graczy
      </p>
    </div>
  );
}
