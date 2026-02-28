import type { ReactNode } from 'react';
import { Header } from './Header';
import { StepNav } from './StepNav';
import { useStep } from '../../store/gameStore';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const step = useStep();

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f5f0e8] flex flex-col">
      <Header />
      <StepNav currentStep={step} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12">
        {children}
      </main>
    </div>
  );
}
