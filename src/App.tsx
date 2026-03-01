import { AppShell } from './components/Layout/AppShell';
import { EditionPicker } from './components/GameSetup/EditionPicker';
import { PlayerSetup } from './components/GameSetup/PlayerSetup';
import { ScoreInputView } from './components/ScoreInput/ScoreInputView';
import { ResultsView } from './components/Results/ResultsView';
import { useStep } from './store/gameStore';

function StepView() {
  const step = useStep();

  switch (step) {
    case 'edition': return <EditionPicker />;
    case 'players': return <PlayerSetup />;
    case 'scoring': return <ScoreInputView />;
    case 'results': return <ResultsView />;
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
