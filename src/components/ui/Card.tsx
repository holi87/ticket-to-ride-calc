import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Highlight border — used for selected state */
  selected?: boolean;
  /** Subtle clickable hover effect */
  interactive?: boolean;
}

export function Card({
  children,
  selected = false,
  interactive = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-xl border p-5 transition-all duration-200',
        'bg-[#0f3460]',
        selected
          ? 'border-[#d4a574] ring-2 ring-[#d4a574]/40 shadow-[0_0_16px_rgba(212,165,116,0.15)]'
          : 'border-white/10',
        interactive && !selected
          ? 'hover:border-[#d4a574]/50 hover:shadow-md cursor-pointer'
          : '',
        interactive && selected ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
