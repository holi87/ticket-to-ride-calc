/**
 * Lightweight unique id generator — uses crypto.randomUUID when available,
 * falls back to a Math.random-based approach for environments without it.
 */
export function nanoid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: 16-char hex string
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}
