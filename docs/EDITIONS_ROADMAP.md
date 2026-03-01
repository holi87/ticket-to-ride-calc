# Roadmapa edycji — Ticket to Ride Score Calculator

> **Stan na 2026-03-01** — Wszystkie 7 edycji bazowych zaimplementowane.

## Status edycji bazowych (MVP ✅)

| Edycja | Status | Gracze | Wagony | Bonusy |
|--------|--------|--------|--------|--------|
| USA | ✅ Stable | 2–5 | 45 | Longest Path |
| Europa | ✅ Stable | 2–5 | 45 | Longest Path, Stacje |
| Nordic | ✅ Stable | 2–3 | 40 | Globetrotter |
| Szwajcaria | ✅ Stable | 2–3 | 40 | Longest Path |
| Indie | ✅ Stable | 2–4 | 45 | Longest Path, Mandala |
| Niemcy | 🟡 Beta | 2–5 | 45 | Globetrotter (15 pkt), Pasażerowie |
| Afryka | 🟡 Beta | 2–5 | 45 | Globetrotter, Terrain |

**Niemcy/Afryka beta:** implementacja punktacji działa poprawnie; brakuje pełnego modelowania szczegółów mechaniki pasażerów/kart terenu (gracz podaje sumę ręcznie).

---

Ten dokument opisuje edycje zaplanowane do implementacji po MVP.

Każda edycja zawiera zweryfikowane zasady punktacji gotowe do zakodowania jako nowy obiekt konfiguracji w `src/data/editions/`.

---

## Priorytet 1 — Edycje "klasyczne" (pełnowymiarowe mapy)

### Polska (Poland) — Map Collection 6½

| Parametr | Wartość |
|---|---|
| ID | `poland` |
| Gracze | 2–4 |
| Wagony/gracz | **35** (nie 45!) |
| Dostępne trasy | 1, 2, 3, 4, 5 |
| Stacje | Brak |
| Expansion | Wymaga kart i wagonów z USA lub Europa |
| Status | `stable` |

**Bonusy:**
- ✅ **Karty krajów (Country Cards)** — Gracz zdobywa karty krajów sąsiednich (Niemcy, Czechy, Słowacja, Ukraina, Białoruś, Litwa, Rosja) gdy jego sieć kolejowa łączy co najmniej 2 kraje. Karty mają malejące wartości (pierwszy gracz bierze najwyższą).
  - W kalkulatorze: gracz podaje **sumę punktów z kart krajów** (number input).
- ❌ Brak bonusu za najdłuższą trasę
- ❌ Brak Globetrottera

**Tiebreaker (kolejność):**
1. Gracz z największą liczbą ukończonych biletów
2. Gracz z największą sumą punktów z ukończonych biletów
3. Jeśli nadal remis — dzielą zwycięstwo

**Kolory graczy:** dowolne z base game (niebieski, czerwony, zielony, żółty + opcjonalnie czarny przy 4 graczach — ale max 4 graczy)

**Uwagi implementacyjne:**
- Krótsze trasy (max 5) — formularz nie potrzebuje stepperów dla 6–9
- Mniej wagonów (35) — pamiętaj o zmianie limitu walidacji
- Brak tuneli i promów

---

### Japonia (Japan) — Map Collection Vol. 7

| Parametr | Wartość |
|---|---|
| ID | `japan` |
| Gracze | 2–5 |
| Wagony/gracz | **20** (!) |
| Dostępne trasy | 1, 2, 3, 4, 5, 6 |
| Stacje | Brak |
| Expansion | Wymaga kart i wagonów z base game |
| Status | `beta` |

**Bonusy:**
- ✅ **Bullet Train Track** — Gracz buduje wspólne trasy Shinkansen. Na koniec gry: ranking graczy wg wkładu w bullet train, z bonusami/karami zależnymi od liczby graczy.
  - W kalkulatorze: gracz podaje **punkty z Bullet Train Track** (number input, może być ujemny!)
- ❌ Brak Longest Path
- ❌ Brak Globetrottera

**Tabela Bullet Train scoring (przykład dla 2 graczy):**
- 1. miejsce: +10 pkt
- 2. miejsce: −10 pkt

**Tabela dla 3 graczy:**
- 1. miejsce: +15 pkt
- 2. miejsce: +5 pkt
- 3. miejsce: −15 pkt

**Tabela dla 4 graczy:**
- 1. miejsce: +15 pkt
- 2. miejsce: +10 pkt
- 3. miejsce: −5 pkt
- 4. miejsce: −15 pkt

**Tabela dla 5 graczy:**
- 1. miejsce: +15 pkt
- 2. miejsce: +10 pkt
- 3. miejsce: +5 pkt
- 4. miejsce: −5 pkt
- 5. miejsce: −15 pkt

**Uwagi:** Bullet Train scoring jest skomplikowany — warto dodać dedykowany krok w wizardzie gdzie gracze wprowadzają swoje pozycje na Bullet Train Track, a aplikacja sama oblicza bonus/karę. Alternatywnie: gracz podaje gotową wartość.

**Tiebreaker:**
1. Gracz z największą liczbą ukończonych biletów

---

### Włochy (Italy) — Map Collection Vol. 7

| Parametr | Wartość |
|---|---|
| ID | `italy` |
| Gracze | 2–5 |
| Wagony/gracz | 45 |
| Dostępne trasy | 1, 2, 3, 4, 5, 6 |
| Stacje | Brak |
| Expansion | Wymaga kart i wagonów z base game |
| Status | `beta` |

**Bonusy:**
- ✅ **Region Bonus** — Włochy podzielone na 17 regionów. Gracz liczy ile regionów połączył swoją siecią. Punkty wg tabeli:

| Regiony | Punkty |
|---|---|
| 1–4 | 0 |
| 5 | 1 |
| 6 | 3 |
| 7 | 6 |
| 8 | 10 |
| 9 | 15 |
| 10 | 21 |
| 11 | 28 |
| 12 | 36 |
| 13 | 45 |
| 14 | 45 |
| 15–17 | 56 |

- Specjalne regiony: Puglia, Sardegna, Sicilia — jeśli gracz połączył WSZYSTKIE miasta w regionie, region liczy się podwójnie.
- Jeśli gracz ma kilka oddzielnych sieci, każda liczona osobno.
- W kalkulatorze: gracz podaje **łączne punkty z regionów** (number input). Obliczanie regionów jest zbyt skomplikowane do automatyzacji bez mapy.
- ❌ Brak Longest Path
- ❌ Brak Globetrottera

**Tiebreaker:**
1. Gracz z największą liczbą ukończonych biletów

---

## Priorytet 2 — Edycje "mini" (Express/City)

### Londyn (London)

| Parametr | Wartość |
|---|---|
| ID | `london` |
| Gracze | 2–4 |
| Wagony/gracz | **17** (autobusy, nie pociągi) |
| Dostępne trasy | 1, 2, 3, 4 |
| Stacje | Brak |
| Standalone | Tak (samodzielna gra) |
| Status | `stable` |

**Scoring tras (specjalny — mniejsze trasy!):**

| Długość | Punkty |
|---|---|
| 1 | 1 |
| 2 | 2 |
| 3 | 4 |
| 4 | 7 |

**Bonusy:**
- ✅ **Dzielnice (Districts)** — Lokacje pogrupowane w dzielnice (oznaczone kolorami i numerami 1–5). Jeśli gracz połączył wszystkie lokacje danej dzielnicy, dostaje tyle punktów ile wynosi numer dzielnicy.
  - W kalkulatorze: checkboxy per dzielnica (5 dzielnic o wartościach 1–5), gracz zaznacza które ukończył.
- ❌ Brak Longest Path
- ❌ Brak Globetrottera

**Tiebreaker:**
1. Gracz z największą liczbą ukończonych biletów
2. Jeśli remis — dzielą zwycięstwo

**Uwagi:** Bardzo szybka gra (10–15 min). Mniejszy formularz punktacji.

---

## Priorytet 3 — Edycje złożone (wymagają weryfikacji)

### Dookoła Świata (Rails & Sails — World)

| Parametr | Wartość |
|---|---|
| ID | `world` |
| Gracze | 2–5 |
| Wagony/gracz | **25 pociągów + 50 statków** (gracz wybiera mix, łącznie 50 sztuk) |
| Dostępne trasy | 1, 2, 3, 4, 5, 6 (+ trasy morskie) |
| Stacje | Brak, ale są **porty (Harbors)** — 3 na gracza |
| Standalone | Tak |
| Status | `beta` |

**Bonusy:**
- ✅ **Porty (Harbors)** — Gracz buduje porty w miastach portowych. Za każdy port: bonus zależy od liczby tras wchodzących/wychodzących z tego portu (szczegóły wymagają weryfikacji).
- ❌ Brak Longest Path
- ❌ Brak Globetrottera

**Tiebreaker:**
1. Gracz z największą liczbą ukończonych biletów
2. Jeśli remis — dzielą zwycięstwo

**Uwagi:** Skomplikowana edycja — dwa typy "wagonów" (pociągi + statki), dwa typy kart. W kalkulatorze upraszczamy: nie rozróżniamy pociągów od statków przy trasach, liczymy po prostu trasy wg długości. Gracz podaje punkty za porty ręcznie.

---

### Wielkie Jeziora (Rails & Sails — Great Lakes)

| Parametr | Wartość |
|---|---|
| ID | `great_lakes` |
| Gracze | 2–4 |
| Wagony/gracz | **łącznie 50** (mix pociągów i statków, gracz wybiera) |
| Dostępne trasy | 1, 2, 3, 4, 5, 6 |
| Stacje | Brak, ale są **porty** — 3 na gracza |
| Standalone | Część zestawu Rails & Sails |
| Status | `beta` |

**Bonusy:**
- ✅ **Porty** — jak w World
- ❌ Brak Longest Path
- ❌ Brak Globetrottera

**Tiebreaker:**
1. Gracz z największą liczbą ukończonych biletów

**Uwagi:** Praktycznie te same zasady co World, ale mniejsza mapa i mniej graczy. Można współdzielić konfigurację z World zmieniając tylko max graczy i dane mapy.

---

## Podsumowanie — plan implementacji

| Faza | Edycje | Złożoność | Status |
|---|---|---|---|
| MVP ✅ | USA, Europa, Nordic, Szwajcaria, Indie, Niemcy, Afryka | Standardowa | Zrobione |
| Faza 12 | **Polska** | Niska (proste zasady, mniej wagonów, country cards) | Planned |
| Faza 13 | **Londyn** | Niska (mini gra, dzielnice) | Planned |
| Faza 14 | **Włochy** | Średnia (region bonus z tabelą) | Planned |
| Faza 15 | **Japonia** | Wysoka (Bullet Train scoring z bonusem/karą per ranking) | Planned |
| Faza 16 | **World + Great Lakes** | Wysoka (dwa typy wagonów, porty) | Planned |

**Zasada:** Każda nowa edycja = 1 nowy plik w `src/data/editions/` + ewentualnie nowy typ bonusu w `BonusType` jeśli istniejące nie wystarczają. UI nie powinien wymagać zmian.

---

## Nowe typy bonusów potrzebne dla przyszłych edycji

```typescript
// Rozszerzenie BonusType o nowe warianty:
export type BonusType =
  // Istniejące (MVP):
  | 'longest_path'
  | 'globetrotter'
  | 'stations'
  | 'mandala'
  | 'passengers'
  | 'terrain'
  // Nowe:
  | 'country_cards'      // Polska — suma pkt z kart krajów
  | 'districts'          // Londyn — checkboxy per dzielnica
  | 'region_bonus'       // Włochy — punkty za połączone regiony
  | 'bullet_train'       // Japonia — ranking Shinkansen (może być ujemny!)
  | 'harbors'            // Rails & Sails — punkty za porty
  | 'custom';            // catch-all dla nieznanych edycji

// Nowy inputType dla dzielnic:
export type BonusInputType =
  | 'radio_select_player'
  | 'auto_from_tickets'
  | 'stepper'
  | 'number_input'
  | 'checkbox_list';       // Londyn: lista dzielnic do odhaczenia
```
