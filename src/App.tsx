import { AppShell } from './components/Layout/AppShell';
import { EditionPicker } from './components/GameSetup/EditionPicker';
import { PlayerSetup } from './components/GameSetup/PlayerSetup';
import { ScoreInputView } from './components/ScoreInput/ScoreInputView';
import { useStep } from './store/gameStore';

function ResultsPlaceholder() {
  return (
    <div className="text-center py-20 text-[#9ca3af]">
      <div className="text-5xl mb-4">🏆</div>
      <p className="text-lg font-medium text-[#f5f0e8]">Wyniki i podium</p>
      <p className="text-sm mt-1">Faza 5 — wkrótce</p>
    </div>
  );
}

function StepView() {
  const step = useStep();

  switch (step) {
    case 'edition': return <EditionPicker />;
    case 'players': return <PlayerSetup />;
    case 'scoring': return <ScoreInputView />;
    case 'results': return <ResultsPlaceholder />;
  }
}

export function App() {
  return (
    <AppShell>
      <StepView />
    </AppShell>
  );
}

export default App;
