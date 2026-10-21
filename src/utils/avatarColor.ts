import type { Palette } from '../tokens/colors';

/** Palette keys avatars are colored from, in hash order. */
export const AVATAR_COLOR_KEYS = ['blue', 'pink', 'orange', 'teal', 'violet'] as const satisfies ReadonlyArray<keyof Palette>;

/** CSS-var references for each avatar color (web). */
export const AVATAR_COLORS: string[] = AVATAR_COLOR_KEYS.map((k) => `var(--chaos-${k})`);

/** Neutral fallback when there is no id. */
const FALLBACK_VAR = 'var(--chaos-ink-muted)';

/**
 * Deterministic per-user avatar color: hashes the id into the fixed set of
 * accent hues so a person keeps the same color everywhere without storing it.
 *
 * Without `palette` returns a themed CSS var (`var(--chaos-blue)`, web).
 * With a `palette` returns the concrete color for that theme (native / canvas).
 * Missing id → muted ink.
 */
export function colorForUserId(userId: string | null | undefined, palette?: Palette): string {
  if (!userId) return palette ? palette.inkMuted : FALLBACK_VAR;
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  const key = AVATAR_COLOR_KEYS[hash % AVATAR_COLOR_KEYS.length]!;
  return palette ? palette[key] : `var(--chaos-${key})`;
}

/** First letter (upper-cased) of a name, "?" when empty. */
export function initialFor(name: string | null | undefined): string {
  return (name || '?').trim().charAt(0).toUpperCase() || '?';
}
