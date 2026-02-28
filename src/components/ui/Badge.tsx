import type { ReactNode } from 'react';

type BadgeVariant = 'stable' | 'beta' | 'info' | 'gold';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  stable: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50',
  beta:   'bg-amber-900/60  text-amber-300  border border-amber-700/50',
  info:   'bg-blue-900/60   text-blue-300   border border-blue-700/50',
  gold:   'bg-[#d4a574]/15  text-[#d4a574]  border border-[#d4a574]/30',
};

export function Badge({ variant = 'info', children }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
