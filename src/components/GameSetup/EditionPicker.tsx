import { ALL_EDITIONS } from '../../data/editions';
import { useGameStore, useEditionId } from '../../store/gameStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { GameEdition } from '../../types/edition';

// Icons for bonus types shown on edition cards
const BONUS_ICONS: Record<string, string> = {
  longest_path:  '📏 Najdłuższa trasa',
  globetrotter:  '🌍 Globetrotter',
  stations:      '🏠 Stacje kolejowe',
  mandala:       '🪄 Grand Tour (Mandala)',
  passengers:    '🧑 Pasażerowie',
  terrain:       '🏔️ Karty terenu',
};

function EditionCard({
  edition,
  selected,
  onSelect,
}: {
  edition: GameEdition;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      selected={selected}
      interactive
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onSelect() : undefined}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-[#d4a574] font-bold text-lg leading-tight">
          {edition.nameShort}
        </h3>
        <Badge variant={edition.status === 'stable' ? 'stable' : 'beta'}>
          {edition.status === 'stable' ? 'Stabilna' : 'Beta'}
        </Badge>
      </div>

      <p className="text-[#9ca3af] text-sm mb-3 leading-relaxed">
        {edition.description}
      </p>

      {/* Player count + trains */}
      <div className="flex items-center gap-4 text-xs text-[#9ca3af] mb-3">
        <span className="flex items-center gap-1">
          <span>👥</span>
          {edition.minPlayers}–{edition.maxPlayers} graczy
        </span>
        <span className="flex items-center gap-1">
          <span>🚃</span>
          {edition.trainCarsPerPlayer} wagonów
        </span>
      </div>

      {/* Bonuses */}
      {edition.bonuses.length > 0 && (
        <ul className="flex flex-col gap-1">
          {edition.bonuses.map((bonus) => (
            <li key={bonus.id} className="text-xs text-[#e8c49a] flex items-center gap-1.5">
              <span className="text-[#d4a574]">+</span>
              {BONUS_ICONS[bonus.type] ?? bonus.namePl}
              {bonus.points > 0 && (
                <span className="ml-auto text-[#9ca3af]">{bonus.points} pkt</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function EditionPicker() {
  const selectedId = useEditionId();
  const { selectEdition, goToStep } = useGameStore();

  const canContinue = selectedId !== null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#f5f0e8] mb-1">Wybierz edycję</h2>
        <p className="text-[#9ca3af]">Zasady punktacji zostaną dostosowane automatycznie.</p>
      </div>

      {/* Edition grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {ALL_EDITIONS.map((edition) => (
          <EditionCard
            key={edition.id}
            edition={edition}
            selected={selectedId === edition.id}
            onSelect={() => selectEdition(edition.id)}
          />
        ))}
      </div>

      {/* Footer action */}
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!canContinue}
          onClick={() => goToStep('players')}
        >
          Dalej — dodaj graczy →
        </Button>
      </div>
    </div>
  );
}
