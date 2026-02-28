/**
 * Standard route scoring table — identical across all Ticket to Ride editions.
 * Source: official rulebooks for all editions.
 */
export const STANDARD_ROUTE_POINTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 10,
  6: 15,
  7: 18,
  8: 21,
  9: 27,
} as const;
