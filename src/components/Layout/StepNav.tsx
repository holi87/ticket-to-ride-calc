import type { GameStep } from '../../store/gameStore';

interface StepDef {
  id: GameStep;
  label: string;
  icon: string;
}

const STEPS: StepDef[] = [
  { id: 'edition', label: 'Edycja',    icon: '🗺️' },
  { id: 'players', label: 'Gracze',    icon: '👥' },
  { id: 'scoring', label: 'Punktacja', icon: '✏️' },
  { id: 'results', label: 'Wyniki',    icon: '🏆' },
];

interface StepNavProps {
  currentStep: GameStep;
}

export function StepNav({ currentStep }: StepNavProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, index) => {
          const isDone    = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast    = index === STEPS.length - 1;

          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step bubble */}
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <div
                  className={[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    isDone
                      ? 'bg-emerald-600 text-white shadow-md'
                      : isCurrent
                      ? 'bg-[#d4a574] text-[#1a1a2e] shadow-[0_0_12px_rgba(212,165,116,0.4)]'
                      : 'bg-white/10 text-[#9ca3af]',
                  ].join(' ')}
                >
                  {isDone ? '✓' : <span>{step.icon}</span>}
                </div>
                <span
                  className={[
                    'text-xs font-medium hidden sm:block',
                    isCurrent ? 'text-[#d4a574]' : isDone ? 'text-emerald-400' : 'text-[#9ca3af]',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={[
                    'flex-1 h-0.5 mx-2 rounded transition-all duration-300',
                    index < currentIndex ? 'bg-emerald-600' : 'bg-white/10',
                  ].join(' ')}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
