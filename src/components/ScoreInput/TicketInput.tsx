import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';
import type { TicketInput as TicketInputType } from '../../types/scoring';

interface TicketRowProps {
  ticket: TicketInputType;
  onUpdate: (patch: Partial<TicketInputType>) => void;
  onRemove: () => void;
}

function TicketRow({ ticket, onUpdate, onRemove }: TicketRowProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
      {/* Completed toggle */}
      <button
        onClick={() => onUpdate({ completed: !ticket.completed })}
        title={ticket.completed ? 'Ukończony — kliknij aby oznaczyć jako nieukończony' : 'Nieukończony — kliknij aby oznaczyć jako ukończony'}
        className={[
          'flex-none w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all duration-150 cursor-pointer',
          ticket.completed
            ? 'bg-emerald-600 border-emerald-500 text-white'
            : 'bg-transparent border-red-500/60 text-red-400 hover:border-red-400',
        ].join(' ')}
      >
        {ticket.completed ? '✓' : '✕'}
      </button>

      {/* Value input */}
      <input
        type="number"
        min={1}
        max={999}
        value={ticket.value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v) && v > 0) onUpdate({ value: v });
        }}
        className="w-20 bg-white/10 border border-white/10 focus:border-[#d4a574]/60 rounded-lg px-2 py-1 text-center text-[#f5f0e8] font-bold text-sm outline-none tabular-nums transition-colors"
      />

      {/* Status label */}
      <span className={[
        'text-xs font-medium min-w-[80px]',
        ticket.completed ? 'text-emerald-400' : 'text-red-400',
      ].join(' ')}>
        {ticket.completed
          ? `+${ticket.value} pkt`
          : `−${ticket.value} pkt`}
      </span>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="ml-auto flex-none w-6 h-6 rounded flex items-center justify-center text-[#6b7280] hover:text-[#f87171] hover:bg-red-900/20 transition-colors text-xs cursor-pointer"
        title="Usuń bilet"
      >
        ✕
      </button>
    </div>
  );
}

interface TicketInputProps {
  playerId: string;
  tickets: TicketInputType[];
}

export function TicketInput({ playerId, tickets }: TicketInputProps) {
  const { addTicket, updateTicket, removeTicket } = useGameStore();

  const completed = tickets.filter((t) => t.completed);
  const failed    = tickets.filter((t) => !t.completed);
  const completedPts = completed.reduce((s, t) => s + t.value, 0);
  const failedPts    = failed.reduce((s, t) => s + t.value, 0);
  const netPts       = completedPts - failedPts;

  return (
    <section>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">
        Bilety
      </h4>

      {/* Ticket list */}
      <div className="flex flex-col gap-1.5 mb-3">
        {tickets.length === 0 && (
          <p className="text-center text-[#4b5563] text-sm py-3 italic">
            Brak biletów
          </p>
        )}
        {tickets.map((t) => (
          <TicketRow
            key={t.id}
            ticket={t}
            onUpdate={(patch) => updateTicket(playerId, t.id, patch)}
            onRemove={() => removeTicket(playerId, t.id)}
          />
        ))}
      </div>

      {/* Add button */}
      <Button
        variant="ghost"
        size="sm"
        fullWidth
        onClick={() => addTicket(playerId)}
        className="mb-4"
      >
        + Dodaj bilet
      </Button>

      {/* Summary */}
      {tickets.length > 0 && (
        <div className="bg-white/5 rounded-xl p-3 text-sm flex flex-col gap-1">
          {completed.length > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Ukończone ({completed.length})</span>
              <span className="font-semibold">+{completedPts} pkt</span>
            </div>
          )}
          {failed.length > 0 && (
            <div className="flex justify-between text-red-400">
              <span>Nieukończone ({failed.length})</span>
              <span className="font-semibold">−{failedPts} pkt</span>
            </div>
          )}
          <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
            <span className="text-[#9ca3af]">Bilety netto</span>
            <span className={[
              'font-bold',
              netPts >= 0 ? 'text-[#d4a574]' : 'text-red-400',
            ].join(' ')}>
              {netPts >= 0 ? `+${netPts}` : netPts} pkt
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
