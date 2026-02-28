export function Header() {
  return (
    <header className="border-b border-white/10 bg-[#16213e]/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        {/* Train icon */}
        <span className="text-2xl select-none">🚂</span>
        <div className="flex flex-col leading-tight">
          <span className="text-[#d4a574] font-bold text-base tracking-wide">
            Ticket to Ride
          </span>
          <span className="text-[#9ca3af] text-xs tracking-widest uppercase">
            Kalkulator punktów
          </span>
        </div>
      </div>
    </header>
  );
}
