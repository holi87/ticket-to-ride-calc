export interface Player {
  id: string;
  name: string;
  /** References PlayerColor.id from the edition's playerColors array */
  colorId?: string;
  /** Display order in the player list (0-based) */
  order: number;
}
