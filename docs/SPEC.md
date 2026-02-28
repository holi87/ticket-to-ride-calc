# Ticket to Ride — Score Calculator Web App
## Pełna specyfikacja projektu (v2)

---

## 1. Opis projektu

Web aplikacja (SPA) do obliczania punktacji w grze planszowej **Ticket to Ride** (Wsiąść do Pociągu). Obsługuje wiele edycji gry z ich unikalnymi zasadami, pozwala definiować graczy i prezentuje końcowy ranking na podium.

---

## 2. Oficjalna tabela punktów za trasy

Tabela jest **identyczna we wszystkich edycjach** gry. Nie każda edycja ma trasy każdej długości — konfiguracja edycji definiuje `availableRouteLengths`.

| Długość trasy (wagony) | Punkty |
|---|---|
| 1 | 1 |
| 2 | 2 |
| 3 | 4 |
| 4 | 7 |
| 5 | 10 |
| 6 | 15 |
| 7 | 18 |
| 8 | 21 |
| 9 | 27 |

---

## 3. Definicje edycji gry

### 3a. USA (oryginał)

| Parametr | Wartość |
|---|---|
| ID | `usa` |
| Gracze | 2–5 |
| Wagony/gracz | 45 |
| Dostępne trasy | 1, 2, 3, 4, 5, 6 |
| Stacje | Brak |
| Status | `stable` |

**Bonusy:**
- **Longest Continuous Path** — 10 pkt dla gracza z najdłuższą ciągłą trasą. W przypadku remisu: wszyscy remisujący gracze dostają 10 pkt.

**Tiebreaker (kolejność):**
1. Gracz z większą liczbą ukończonych biletów
2. Gracz z bonusem najdłuższej trasy

**Kolory graczy:** niebieski, czerwony, zielony, żółty, czarny

---

### 3b. Europa

| Parametr | Wartość |
|---|---|
| ID | `europe` |
| Gracze | 2–5 |
| Wagony/gracz | 45 |
| Dostępne trasy | 1, 2, 3, 4, 5, 6, 8 |
| Stacje | 3 na gracza, 4 pkt za nieużytą |
| Status | `stable` |

**Bonusy:**
- **European Express (Longest Path)** — 10 pkt. W przypadku remisu: wszyscy remisujący dostają bonus.
  - WAŻNE: Stacje i trasy przeciwników dostępne przez stacje NIE liczą się do najdłuższej trasy.
- **Stacje nieużyte** — 4 pkt za każdą stację, którą gracz NIE umieścił na planszy (max 3 stacje = max 12 pkt).

**Tiebreaker (kolejność):**
1. Gracz z większą liczbą ukończonych biletów
2. Gracz z mniejszą liczbą użytych stacji
3. Gracz z bonusem najdłuższej trasy

**Kolory graczy:** niebieski, czerwony, zielony, żółty, czarny

---

### 3c. Kraje Nordyckie (Nordic Countries)

| Parametr | Wartość |
|---|---|
| ID | `nordic` |
| Gracze | 2–3 |
| Wagony/gracz | 40 |
| Dostępne trasy | 1, 2, 3, 4, 5, 6, 9 |
| Stacje | Brak |
| Status | `stable` |

**UWAGA:** Brak tras o długości 7 i 8. Istnieje specjalna trasa 9-wagonowa (Murmańsk–Lieksa) warta 27 pkt.

**Bonusy:**
- **Globetrotter** — 10 pkt dla gracza z największą liczbą ukończonych biletów. W przypadku remisu: wszyscy remisujący dostają bonus.
- Brak bonusu za najdłuższą trasę.

**Tiebreaker (kolejność):**
1. Gracz z największą liczbą ukończonych biletów
2. Gracz z najdłuższą ciągłą trasą

**Kolory graczy:** biały, fioletowy, czarny

---

### 3d. Szwajcaria (Switzerland)

| Parametr | Wartość |
|---|---|
| ID | `switzerland` |
| Gracze | 2–3 |
| Wagony/gracz | 40 |
| Dostępne trasy | 1, 2, 3, 4, 5, 6 |
| Stacje | Brak |
| Status | `stable` |

**Bonusy:**
- **Longest Continuous Path** — 10 pkt. W przypadku remisu: wszyscy remisujący dostają bonus.

**Specyfika — bilety do kraju (Country Destination Tickets):**
Niektóre bilety wskazują miasto + kraj (nie drugie miasto). Gracz musi połączyć miasto z jednym z miast granicznych danego kraju. Różne połączenia mają różne wartości punktowe na tym samym bilecie. W kalkulatorze: gracz po prostu podaje wartość punktową ukończonego biletu (sam wybiera właściwą wartość z karty).

**Tiebreaker (kolejność):**
1. Gracz z większą liczbą ukończonych biletów
2. Gracz z bonusem najdłuższej trasy

**Kolory graczy:** niebieski, czerwony, zielony

---

### 3e. Indie (India)

| Parametr | Wartość |
|---|---|
| ID | `india` |
| Gracze | 2–4 |
| Wagony/gracz | 45 |
| Dostępne trasy | 1, 2, 3, 4, 5, 6, 7, 8 |
| Stacje | Brak |
| Status | `stable` |

**Bonusy:**
- **Longest Continuous Path** — 10 pkt. W przypadku remisu: wszyscy remisujący dostają bonus.
- **Grand Tour (Mandala)** — Bonus za połączenie miast z biletu **dwiema oddzielnymi trasami** (dwie niezależne ścieżki):

| Bilety z dwoma trasami | Bonus |
|---|---|
| 1 | 5 pkt |
| 2 | 10 pkt |
| 3 | 15 pkt |
| N | N × 5 pkt |

W kalkulatorze: stepper — gracz podaje ile biletów ukończył dwiema trasami.

**Tiebreaker (kolejność):**
1. Gracz z większą liczbą ukończonych biletów
2. Gracz z bonusem najdłuższej trasy

**Kolory graczy:** niebieski, czerwony, zielony, żółty

---

### 3f. Niemcy (Deutschland / Germany)

| Parametr | Wartość |
|---|---|
| ID | `germany` |
| Gracze | 2–5 |
| Wagony/gracz | 45 |
| Dostępne trasy | 1, 2, 3, 4, 5, 6, 7 |
| Stacje | Brak |
| Status | `beta` |

**Bonusy:**
- **Globetrotter** — 15 pkt (uwaga: 15, nie 10!) dla gracza z największą liczbą ukończonych biletów. W przypadku remisu: wszyscy remisujący dostają bonus.
- **Pasażerowie (Passengers)** — Gracz zbiera żetony pasażerów z miast podczas gry. Na koniec gry przyznawane są punkty na podstawie rankingu zebranych pasażerów danego koloru.
  - W kalkulatorze: gracz podaje **sumaryczne punkty za pasażerów** (number input). Ranking pasażerów rozstrzygany jest poza aplikacją na podstawie żetonów.
- Brak bonusu za najdłuższą trasę.

**Tiebreaker (kolejność):**
1. Gracz z największą liczbą ukończonych biletów

**Kolory graczy:** niebieski, czerwony, zielony, żółty, czarny

---

### 3g. Afryka (Africa)

| Parametr | Wartość |
|---|---|
| ID | `africa` |
| Gracze | 2–5 |
| Wagony/gracz | 45 |
| Dostępne trasy | 1, 2, 3, 4, 5, 6 |
| Stacje | Brak |
| Status | `beta` |

**Bonusy:**
- **Globetrotter** — 10 pkt za największą liczbę ukończonych biletów. Remis: wszyscy remisujący dostają bonus.
- **Terrain Cards** — Gracz zbiera karty terenu podczas gry. Na koniec punkty za zebrany zestaw.
  - W kalkulatorze: gracz podaje **sumaryczne punkty z kart terenu** (number input).
- Brak bonusu za najdłuższą trasę.

**Tiebreaker (kolejność):**
1. Gracz z największą liczbą ukończonych biletów

**Kolory graczy:** niebieski, czerwony, zielony, żółty, czarny

---

## 4. System wprowadzania punktacji

### 4a. Punkty za trasy

**UI:** Dla każdej dostępnej długości trasy w wybranej edycji wyświetl wiersz ze stepperem (+/−):

```
Trasy 1-wagonowe:  [−] 2 [+]    =  2 pkt
Trasy 2-wagonowe:  [−] 1 [+]    =  2 pkt
Trasy 3-wagonowe:  [−] 0 [+]    =  0 pkt
Trasy 4-wagonowe:  [−] 3 [+]    = 21 pkt
Trasy 5-wagonowe:  [−] 1 [+]    = 10 pkt
Trasy 6-wagonowe:  [−] 0 [+]    =  0 pkt
                          Suma tras: 35 pkt
                    Zużyte wagony: 19/45
```

**Walidacja:**
- Suma wagonów = `Σ (długość × ilość)` nie może przekroczyć limitu edycji (45 lub 40).
- Wyświetlaj na bieżąco: "Zużyte wagony: X / Y" z ostrzeżeniem gdy zostaje mało.
- Zablokuj dodawanie nowych tras gdy brak wolnych wagonów.

### 4b. Bilety (Destination Tickets)

**UI:** Dynamiczna lista z przyciskiem "Dodaj bilet":

```
Bilet 1:  [wartość: 21]  [✅ Ukończony]  [🗑️]
Bilet 2:  [wartość: 10]  [✅ Ukończony]  [🗑️]
Bilet 3:  [wartość: 13]  [❌ Nieukończony]  [🗑️]

Ukończone: 2 biletów (+31 pkt)
Nieukończone: 1 bilet (−13 pkt)
Bilety netto: +18 pkt
```

**Walidacja:**
- Wartość biletu: liczba całkowita > 0
- Każdy bilet musi mieć status (ukończony/nieukończony)
- Min 0 biletów (gracz mógł wziąć bilety, ale nie dodał ich do kalkulatora)

### 4c. Bonusy specjalne

UI generowany dynamicznie na podstawie konfiguracji edycji:

| Typ bonusu | UI Element | Zachowanie |
|---|---|---|
| `longest_path` | Radio button per gracz + opcja "Remis" z checkboxami | Dokładnie 1 gracz LUB wielu przy remisie. Opcja "Nikt" jeśli nie przyznany. |
| `globetrotter` | Automatyczny — obliczany z biletów | Wyświetl informację kto dostaje bonus. Jeśli remis → zaznacz wszystkich. |
| `stations` | Stepper 0–3 per gracz | Wyświetl: "Nieużyte stacje: X → +Y pkt" |
| `mandala` | Stepper per gracz (0–max biletów) | Wyświetl: "Bilety z dwoma trasami: X → +Y pkt" |
| `passengers` | Number input per gracz | Label: "Punkty za pasażerów" |
| `terrain` | Number input per gracz | Label: "Punkty za karty terenu" |

---

## 5. Obliczanie wyniku

### Formuła per gracz:

```
WYNIK = punkty_za_trasy
      + suma_ukończonych_biletów
      − suma_nieukończonych_biletów
      + bonus_najdłuższa_trasa (jeśli dotyczy)
      + bonus_globetrotter (jeśli dotyczy)
      + bonus_stacje (jeśli dotyczy)
      + bonus_mandala (jeśli dotyczy)
      + bonus_pasażerowie (jeśli dotyczy)
      + bonus_terrain (jeśli dotyczy)
```

### Breakdown per gracz (wyświetlany w wynikach):

```
Gracz: Ania                    Suma: 127 pkt
├── Trasy:                      +85 pkt
│   ├── 2× trasa 1-wag.          +2
│   ├── 3× trasa 3-wag.         +12
│   ├── 2× trasa 4-wag.         +14
│   ├── 1× trasa 5-wag.         +10
│   └── 3× trasa 6-wag.         +45
├── Bilety ukończone (4):       +42 pkt
├── Bilety nieukończone (1):    −12 pkt
├── Najdłuższa trasa:           +10 pkt
└── Stacje nieużyte (1):         +4 pkt  (tylko Europa)
```

---

## 6. Tiebreaker — rozstrzyganie remisów

Gdy dwóch lub więcej graczy ma identyczny wynik, zastosuj reguły tiebreaker **w kolejności** zdefiniowanej w konfiguracji edycji:

| Reguła | Opis |
|---|---|
| `most_completed_tickets` | Wygrywa gracz z większą liczbą UKOŃCZONYCH biletów |
| `longest_path` | Wygrywa gracz z bonusem najdłuższej trasy |
| `fewest_stations_used` | Wygrywa gracz, który UŻYŁ mniej stacji (Europa) |

Jeśli po wszystkich regułach nadal remis — gracze dzielą miejsce.

---

## 7. UX / UI — szczegóły

### Wizard (nawigacja krokowa)

**Krok 1: Wybór edycji**
- Karty z nazwą i krótkim opisem każdej edycji
- Oznaczenie statusu: `stable` / `beta`
- Po wyborze: wyświetl kluczowe info (zakres graczy, bonusy)

**Krok 2: Dodawanie graczy**
- Input na imię + opcjonalny selektor koloru (z palety danej edycji)
- Walidacja min/max graczy per edycja
- Przycisk "Dodaj gracza" + lista dodanych
- Domyślne imiona: "Gracz 1", "Gracz 2", ...

**Krok 3: Wprowadzanie punktacji**
- **Desktop (14" FHD):** Tabs per gracz LUB widok tabelaryczny (wszyscy gracze obok siebie, jeśli ≤3 graczy)
- **Mobile:** Tabs per gracz, stacked layout
- Każdy gracz ma sekcje: Trasy → Bilety → Bonusy
- Na bieżąco: subtotal per sekcja + running total
- Przycisk "Następny gracz" / "Podsumowanie"

**Krok 4: Podsumowanie / Podium**
- Podium wizualne (1., 2., 3. miejsce)
- Animacja confetti dla zwycięzcy
- Pełny breakdown per gracz (zwijany/rozwijany)
- Przycisk "Nowa gra" (reset)
- Przycisk "Edytuj wyniki" (cofnij do kroku 3)

### Responsywność

| Breakpoint | Layout |
|---|---|
| ≥1024px (desktop) | Side-by-side, tabele, multi-column |
| 768–1023px (tablet) | Zredukowane kolumny, tabs |
| <768px (mobile) | Single column, stacked, accordion |

### Dark mode
- Domyślny
- Paleta: tło ciemne (#1a1a2e / #16213e), akcenty ciepłe (złoto #d4a574, burgundy #8b0000)
- Czytelny kontrast (WCAG AA minimum)

---

## 8. Typy TypeScript

```typescript
// src/types/edition.ts

export interface GameEdition {
  id: string;
  name: string;
  nameShort: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  trainCarsPerPlayer: number;
  availableRouteLengths: number[];
  routePointsTable: Record<number, number>;
  bonuses: BonusDefinition[];
  hasStations: boolean;
  stationsPerPlayer?: number;
  stationPointsEach?: number;
  tiebreakerRules: TiebreakerRule[];
  playerColors: PlayerColor[];
  status: 'stable' | 'beta';
}

export interface BonusDefinition {
  id: string;
  name: string;
  namePl: string;  // polska nazwa do UI
  type: BonusType;
  points: number;  // stała wartość, lub -1 jeśli zmienna (np. mandala)
  inputType: BonusInputType;
  tiedPlayersShareBonus: boolean;
  description: string;
  descriptionPl: string;
  calculate?: (input: number) => number;  // opcjonalna funkcja dla zmiennych bonusów
}

export type BonusType =
  | 'longest_path'
  | 'globetrotter'
  | 'stations'
  | 'mandala'
  | 'passengers'
  | 'terrain'
  | 'custom';

export type BonusInputType =
  | 'radio_select_player'   // najdłuższa trasa — wybierz gracza
  | 'auto_from_tickets'     // globetrotter — auto z biletów
  | 'stepper'               // stacje, mandala
  | 'number_input';         // pasażerowie, terrain

export type TiebreakerRule =
  | 'most_completed_tickets'
  | 'longest_path'
  | 'fewest_stations_used';

export interface PlayerColor {
  id: string;
  name: string;
  namePl: string;
  hex: string;
}


// src/types/player.ts

export interface Player {
  id: string;
  name: string;
  colorId?: string;
  order: number;  // kolejność na liście
}


// src/types/scoring.ts

export interface PlayerScoreInput {
  playerId: string;
  routes: RouteInput[];
  tickets: TicketInput[];
  bonusInputs: Record<string, BonusInputValue>;
}

export interface RouteInput {
  length: number;   // długość trasy (1-9)
  count: number;    // ile tras tej długości
}

export interface TicketInput {
  id: string;
  value: number;       // wartość punktowa
  completed: boolean;  // ukończony?
}

export type BonusInputValue =
  | { type: 'player_select'; selectedPlayerIds: string[] }  // longest_path
  | { type: 'auto' }                                         // globetrotter
  | { type: 'stepper'; value: number }                        // stacje, mandala
  | { type: 'number'; value: number };                        // pasażerowie, terrain

export interface PlayerScore {
  playerId: string;
  playerName: string;
  routePoints: number;
  routeBreakdown: { length: number; count: number; points: number }[];
  completedTicketsCount: number;
  completedTicketsPoints: number;
  failedTicketsCount: number;
  failedTicketsPoints: number;  // wartość ujemna
  bonusPoints: { bonusId: string; bonusName: string; points: number }[];
  totalScore: number;
  trainCarsUsed: number;
  trainCarsRemaining: number;
  rank?: number;
}
```

---

## 9. Przykład konfiguracji edycji — USA

```typescript
// src/data/editions/usa.ts

import { GameEdition } from '../../types/edition';
import { STANDARD_ROUTE_POINTS } from '../routePoints';

export const USA_EDITION: GameEdition = {
  id: 'usa',
  name: 'Ticket to Ride: USA',
  nameShort: 'USA',
  description: 'Oryginalna wersja gry. Podróżuj pociągiem po Stanach Zjednoczonych.',
  minPlayers: 2,
  maxPlayers: 5,
  trainCarsPerPlayer: 45,
  availableRouteLengths: [1, 2, 3, 4, 5, 6],
  routePointsTable: {
    1: STANDARD_ROUTE_POINTS[1],
    2: STANDARD_ROUTE_POINTS[2],
    3: STANDARD_ROUTE_POINTS[3],
    4: STANDARD_ROUTE_POINTS[4],
    5: STANDARD_ROUTE_POINTS[5],
    6: STANDARD_ROUTE_POINTS[6],
  },
  bonuses: [
    {
      id: 'longest_path',
      name: 'Longest Continuous Path',
      namePl: 'Najdłuższa ciągła trasa',
      type: 'longest_path',
      points: 10,
      inputType: 'radio_select_player',
      tiedPlayersShareBonus: true,
      description: '10 points for the player with the longest continuous path of routes.',
      descriptionPl: '10 punktów dla gracza z najdłuższą ciągłą trasą. W remisie: wszyscy remisujący dostają bonus.',
    },
  ],
  hasStations: false,
  tiebreakerRules: ['most_completed_tickets', 'longest_path'],
  playerColors: [
    { id: 'blue', name: 'Blue', namePl: 'Niebieski', hex: '#1e40af' },
    { id: 'red', name: 'Red', namePl: 'Czerwony', hex: '#dc2626' },
    { id: 'green', name: 'Green', namePl: 'Zielony', hex: '#16a34a' },
    { id: 'yellow', name: 'Yellow', namePl: 'Żółty', hex: '#eab308' },
    { id: 'black', name: 'Black', namePl: 'Czarny', hex: '#171717' },
  ],
  status: 'stable',
};
```

---

## 10. Deployment

### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost/ || exit 1
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  ttr-calculator:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    container_name: ttr-calculator
```

### Kubernetes / K3s

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ttr-calculator
  labels:
    app: ttr-calculator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ttr-calculator
  template:
    metadata:
      labels:
        app: ttr-calculator
    spec:
      containers:
      - name: ttr-calculator
        image: ttr-calculator:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"
            cpu: "100m"
          requests:
            memory: "64Mi"
            cpu: "50m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 3
          periodSeconds: 10
```

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: ttr-calculator
spec:
  selector:
    app: ttr-calculator
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ttr-calculator
  annotations:
    kubernetes.io/ingress.class: traefik
spec:
  rules:
  - host: ttr.homelab.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ttr-calculator
            port:
              number: 80
```

---

## 11. Struktura projektu

```
ticket-to-ride-calculator/
├── CLAUDE.md                    # Instrukcje dla Claude Code
├── docs/
│   └── SPEC.md                  # Ten plik — pełna specyfikacja
├── src/
│   ├── components/
│   │   ├── GameSetup/
│   │   │   ├── EditionPicker.tsx
│   │   │   └── PlayerSetup.tsx
│   │   ├── ScoreInput/
│   │   │   ├── RouteInput.tsx
│   │   │   ├── TicketInput.tsx
│   │   │   ├── BonusInput.tsx
│   │   │   └── PlayerScoreForm.tsx
│   │   ├── Results/
│   │   │   ├── Podium.tsx
│   │   │   ├── ScoreBreakdown.tsx
│   │   │   └── Confetti.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Stepper.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Toggle.tsx
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       ├── StepNav.tsx
│   │       └── AppShell.tsx
│   ├── data/
│   │   ├── routePoints.ts       # STANDARD_ROUTE_POINTS
│   │   └── editions/
│   │       ├── index.ts
│   │       ├── usa.ts
│   │       ├── europe.ts
│   │       ├── nordic.ts
│   │       ├── switzerland.ts
│   │       ├── india.ts
│   │       ├── germany.ts
│   │       └── africa.ts
│   ├── logic/
│   │   ├── scoring.ts
│   │   ├── tiebreaker.ts
│   │   └── validation.ts
│   ├── store/
│   │   └── gameStore.ts
│   ├── hooks/
│   │   ├── useGameSession.ts
│   │   └── useScoring.ts
│   ├── types/
│   │   ├── edition.ts
│   │   ├── player.ts
│   │   └── scoring.ts
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── scoring.test.ts
│   ├── tiebreaker.test.ts
│   ├── validation.test.ts
│   └── editions/
│       ├── usa.test.ts
│       ├── europe.test.ts
│       └── nordic.test.ts
├── public/
│   └── favicon.svg
├── Dockerfile
├── docker-compose.yml
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── nginx.conf
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## 12. Kolejność implementacji

| Faza | Zadanie | Opis |
|---|---|---|
| 1 | Typy TypeScript | Interfejsy w `src/types/` |
| 2 | Konfiguracja edycji | USA + Europa w `src/data/editions/` |
| 3 | Logika + testy | `src/logic/scoring.ts`, `tiebreaker.ts` + pełne testy Vitest |
| 4 | Store Zustand | Stan gry, graczy, punktacji |
| 5 | UI: GameSetup | Wybór edycji, dodawanie graczy |
| 6 | UI: ScoreInput | Dynamiczne formularze per edycja |
| 7 | UI: Results | Podium, ranking, breakdown, confetti |
| 8 | Responsywność | Desktop 14" FHD + mobile |
| 9 | Edycje 3–7 | Nordic, Szwajcaria, Indie, Niemcy, Afryka |
| 10 | Deployment | Docker + K3s manifesty |
| 11 | Nice-to-have | Historia, eksport, PWA, i18n |
