import { useMemo } from 'react';

const COLORS = [
  '#d4a574', '#f59e0b', '#ef4444', '#3b82f6',
  '#10b981', '#8b5cf6', '#f97316', '#ec4899',
  '#eab308', '#06b6d4',
];

interface Piece {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  size: number;
  shape: 'rect' | 'circle';
}

export function Confetti({ count = 80 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
      duration: `${(3 + Math.random() * 3).toFixed(2)}s`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.floor(Math.random() * 8),
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards,
                         confetti-sway ${p.duration} ${p.delay} ease-in-out infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
