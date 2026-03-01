import { useGameStore } from '../../store/gameStore';
import type { TicketInput as TicketInputType } from '../../types/scoring';

interface TicketRowProps {
  ticket: TicketInputType;
  onUpdate: (patch: Partial<TicketInputType>) => void;
  onRemove: () => void;
}

function TicketRow({ ticket, onUpdate, onRemove }: TicketRowProps) {
  return (
    <div className={[
      'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
      ticket.completed
        ? 'bg-emerald-900/20 border-emerald-700/30'
        : 'bg-red-900/20 border-red-700/30',
    ].join(' ')}>

      {/* Status toggle — clearly labeled */}
      <button
        onClick={() => onUpdate({ completed: !ticket.completed })}
        title="Kliknij aby zmienić status"
        className={[
          'flex-none flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border',
          ticket.completed
            ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
            : 'bg-red-700/60 border-red-500/60 text-red-200 hover:bg-red-600/70',
        ].join(' ')}
      >
        {ticket.completed ? '✓ Ukończony' : '✕ Nieukończony'}
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
        className="w-16 bg-white/10 border border-white/10 focus:border-[#d4a574]/60 rounded-lg px-2 py-1 text-center text-[#f5f0e8] font-bold text-sm outline-none tabular-nums transition-colors"
      />
      <span className="text-[#6b7280] text-xs">pkt</span>

      {/* Points preview */}
      <span className={[
        'text-sm font-bold tabular-nums ml-auto',
        ticket.completed ? 'text-emerald-400' : 'text-red-400',
      ].join(' ')}>
        {ticket.completed ? `+${ticket.value}` : `−${ticket.value}`}
      </span>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="flex-none w-6 h-6 rounded flex items-center justify-center text-[#6b7280] hover:text-[#f87171] hover:bg-red-900/30 transition-colors text-xs cursor-pointer"
        title="Usuń bilet"
      >
        🗑
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

  const completed    = tickets.filter((t) => t.completed);
  const failed       = tickets.filter((t) => !t.completed);
  const completedPts = completed.reduce((s, t) => s + t.value, 0);
  const failedPts    = failed.reduce((s, t) => s + t.value, 0);
  const netPts       = completedPts - failedPts;

  function addCompleted() {
    addTicket(playerId, true);
  }

  function addFailed() {
    addTicket(playerId, false);
  }

  return (
    <section>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">
        Bilety
      </h4>

      {/* Ticket list */}
      <div className="flex flex-col gap-1.5 mb-3">
        {tickets.length === 0 && (
          <p className="text-center text-[#4b5563] text-sm py-3 italic">
            Brak biletów — dodaj poniżej
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

      {/* Two add buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={addCompleted}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-700/40 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 text-xs font-semibold transition-colors cursor-pointer"
        >
          ✓ Dodaj ukończony
        </button>
        <button
          onClick={addFailed}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-700/40 bg-red-900/20 text-red-400 hover:bg-red-900/40 text-xs font-semibold transition-colors cursor-pointer"
        >
          ✕ Dodaj nieukończony
        </button>
      </div>

      {/* Summary */}
      {tickets.length > 0 && (
        <div className="bg-white/5 rounded-xl p-3 text-sm flex flex-col gap-1">
          {completed.length > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Ukończone ({completed.length})</span>
              <span className="font-semibold tabular-nums">+{completedPts} pkt</span>
            </div>
          )}
          {failed.length > 0 && (
            <div className="flex justify-between text-red-400">
              <span>Nieukończone ({failed.length})</span>
              <span className="font-semibold tabular-nums">−{failedPts} pkt</span>
            </div>
          )}
          <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
            <span className="text-[#9ca3af]">Bilety netto</span>
            <span className={[
              'font-bold tabular-nums',
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
