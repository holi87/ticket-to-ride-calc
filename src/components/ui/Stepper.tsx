interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function Stepper({ value, min = 0, max = 99, onChange, disabled = false }: StepperProps) {
  const canDec = !disabled && value > min;
  const canInc = !disabled && value < max;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => canDec && onChange(value - 1)}
        disabled={!canDec}
        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-[#f5f0e8] font-bold text-lg leading-none transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Zmniejsz"
      >
        −
      </button>
      <span className="w-8 text-center font-bold text-[#f5f0e8] tabular-nums select-none">
        {value}
      </span>
      <button
        onClick={() => canInc && onChange(value + 1)}
        disabled={!canInc}
        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-[#f5f0e8] font-bold text-lg leading-none transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Zwiększ"
      >
        +
      </button>
    </div>
  );
}
