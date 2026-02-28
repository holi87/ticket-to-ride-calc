import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#d4a574] hover:bg-[#e8c49a] text-[#1a1a2e] font-semibold shadow-md ' +
    'disabled:bg-[#6b5a47] disabled:text-[#3d3028] disabled:cursor-not-allowed',
  secondary:
    'bg-[#0f3460] hover:bg-[#16213e] text-[#f5f0e8] border border-[#d4a574]/40 ' +
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent hover:bg-white/5 text-[#d4a574] border border-[#d4a574]/30 ' +
    'disabled:opacity-40 disabled:cursor-not-allowed',
  danger:
    'bg-[#8b0000] hover:bg-[#b91c1c] text-[#f5f0e8] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-7 py-3 text-lg rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
