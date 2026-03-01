# Ticket to Ride Score Calculator

## Specyfikacja
Pełna specyfikacja projektu: `docs/SPEC.md` — **ZAWSZE przeczytaj ją przed rozpoczęciem implementacji** lub przed pracą nad nowym zadaniem.

## Stack technologiczny
- React 18+ z TypeScript (strict mode)
- Vite jako bundler
- Tailwind CSS do stylowania
- Zustand do state management
- Zod do walidacji
- Vitest do testów

## Zasady pracy

### Architektura
- **Data-driven**: Zasady gry NIGDY nie są hardkodowane w komponentach UI. Wszystko pochodzi z konfiguracji edycji (`src/data/editions/`).
- Dodanie nowej edycji gry = dodanie jednego pliku konfiguracyjnego. Zero zmian w komponentach UI.
- Interfejsy TypeScript w `src/types/` — source of truth dla typów.

### Wersjonowanie — OBOWIĄZKOWE przed każdym commitem

Format: **X.Y.Z** (główna.major.minor), np. `1.2.3`.
- **X** — główna wersja (zmiana architektury, pełny rewrite)
- **Y** — major (nowa funkcja, nowa edycja, istotna zmiana UI)
- **Z** — minor (bugfix, poprawka, drobna zmiana)

**Przed każdym commitem:**
1. Zwiększ wersję w `package.json` używając:
   - `npm version patch --no-git-tag-version` — dla bugfixów i drobnych poprawek (Z)
   - `npm version minor --no-git-tag-version` — dla nowych funkcji i edycji (Y)
   - `npm version major --no-git-tag-version` — tylko gdy prompt zawiera słowo **"major"** lub zmiana łamie kompatybilność (X)
2. Wersja jest automatycznie wstrzykiwana do UI przez Vite (`VITE_APP_VERSION`) i wyświetlana w nagłówku aplikacji.
3. Uwzględnij numer wersji w treści commit message, np.: `feat(export): PDF/CSV/JSON (v1.0.5)`.

### Kod
- TypeScript strict mode — żadnych `any`, `@ts-ignore`, wyłączonych reguł.
- Komentarze i nazwy zmiennych/funkcji po angielsku.
- UI teksty (labels, komunikaty) po polsku.
- Eksportuj typy/interfejsy jawnie, nie używaj `export default` dla typów.
- Komponenty React jako named exports z function declarations.

### Testowanie
- **Testy logiki PRZED budowaniem UI** — scoring, tiebreaker, walidacja.
- Testy w katalogu `tests/` z Vitest.
- Każda edycja powinna mieć test weryfikujący poprawność jej konfiguracji.
- Testy edge case'ów: remisy, max wagony, 0 biletów, same nieukończone bilety.

### UI / Layout
- **Desktop-first** — główne użycie na laptopie 14" FHD (1920×1080).
- Mobile responsive — pełna funkcjonalność, ale layout dostosowany.
- Dark mode jako domyślny.
- Kolorystyka: vintage/retro, ciepłe brązy, złoto, burgundy (klimat Ticket to Ride).

### Kolejność implementacji
Zawsze pracuj wg tej kolejności (chyba że użytkownik poprosi inaczej):

1. Typy TypeScript (`src/types/`)
2. Konfiguracja edycji — USA + Europa (`src/data/editions/`)
3. Logika punktacji + testy (`src/logic/` + `tests/`)
4. Store Zustand (`src/store/`)
5. UI: GameSetup (wybór edycji, gracze)
6. UI: ScoreInput (dynamiczne formularze)
7. UI: Results/Podium (ranking, breakdown, confetti)
8. Responsywność (desktop + mobile)
9. Pozostałe edycje (Nordic, Szwajcaria, Indie, Niemcy, Afryka)
10. Docker + K8s manifesty
11. Nice-to-have (historia, eksport, PWA, i18n)

## Szybkie referencje

### Tabela punktów za trasy (uniwersalna)
| Wagony | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|--------|---|---|---|---|---|---|---|---|---|
| Punkty | 1 | 2 | 4 | 7 | 10| 15| 18| 21| 27|

### Edycje — skrót
| Edycja | Gracze | Wagony | Bonusy |
|--------|--------|--------|--------|
| USA | 2–5 | 45 | Longest Path (10) |
| Europa | 2–5 | 45 | Longest Path (10), Stacje (4/szt) |
| Nordic | 2–3 | 40 | Globetrotter (10) |
| Szwajcaria | 2–3 | 40 | Longest Path (10) |
| Indie | 2–4 | 45 | Longest Path (10), Mandala |
| Niemcy | 2–5 | 45 | Globetrotter (15), Pasażerowie |
| Afryka | 2–5 | 45 | Globetrotter (10), Terrain |
