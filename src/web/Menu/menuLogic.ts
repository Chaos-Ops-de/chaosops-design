export interface MenuItemLike {
  id: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}

/**
 * Arranges item groups for display: empty groups are dropped, and every
 * `danger` item moves out of its group into one last group, so the
 * destructive action sits alone at the bottom (and is red) where it can't be
 * hit by accident. Order inside each group is kept.
 */
export function normalizeGroups<T extends MenuItemLike>(groups: readonly (readonly T[])[]): T[][] {
  const safe: T[][] = [];
  const danger: T[] = [];
  for (const group of groups) {
    const kept = group.filter((item) => !item.danger);
    danger.push(...group.filter((item) => item.danger));
    if (kept.length > 0) safe.push(kept);
  }
  return danger.length > 0 ? [...safe, danger] : safe;
}

/** Items in keyboard order (all groups, top to bottom). */
export function flattenGroups<T>(groups: readonly (readonly T[])[]): T[] {
  return groups.flat();
}

export type MenuNavKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

export const MENU_NAV_KEYS: readonly string[] = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/**
 * Index of the item a navigation key should focus. `current` is -1 when no
 * item is focused yet. Arrow keys wrap and skip disabled items; Home/End go to
 * the first/last enabled item. Returns -1 when nothing is enabled.
 */
export function nextEnabledIndex(
  current: number,
  key: MenuNavKey,
  items: readonly { disabled?: boolean }[],
): number {
  const count = items.length;
  const enabled = (i: number) => !items[i]?.disabled;
  if (count === 0) return -1;

  if (key === 'Home') {
    for (let i = 0; i < count; i++) if (enabled(i)) return i;
    return -1;
  }
  if (key === 'End') {
    for (let i = count - 1; i >= 0; i--) if (enabled(i)) return i;
    return -1;
  }

  const dir = key === 'ArrowDown' ? 1 : -1;
  // From "nothing focused": down starts at the top, up at the bottom.
  const start = current < 0 ? (dir === 1 ? -1 : count) : current;
  for (let n = 1; n <= count; n++) {
    const i = (((start + dir * n) % count) + count) % count;
    if (enabled(i)) return i;
  }
  return -1;
}

/** A printable single character with no modifier — the kind that starts a typeahead jump. */
export function isLetterKey(event: { key: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean }): boolean {
  return event.key.length === 1 && /\S/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey;
}

/**
 * Typeahead: the next enabled item, after `current` and wrapping, whose label
 * starts with `char` (case-insensitive). Pressing the same letter again cycles
 * through the items that share it; from nothing focused it lands on the first.
 * Returns -1 when no item matches.
 */
export function matchByLetter(
  items: readonly { label: string; disabled?: boolean }[],
  current: number,
  char: string,
): number {
  const count = items.length;
  const needle = char.toLocaleLowerCase();
  if (count === 0 || !needle) return -1;
  for (let n = 1; n <= count; n++) {
    const i = (((current < 0 ? -1 : current) + n) % count + count) % count;
    const item = items[i];
    if (item && !item.disabled && item.label.toLocaleLowerCase().startsWith(needle)) return i;
  }
  return -1;
}

// ---------------------------------------------------------------------------
// Submenus
// ---------------------------------------------------------------------------

export interface Point {
  x: number;
  y: number;
}

export interface RectLike {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const cross = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

/**
 * "Is the pointer on its way to the submenu?" The triangle runs from the point
 * where the pointer left the parent item to the two corners of the submenu's
 * near edge. While the pointer stays inside it, moving across the other parent
 * items must not close or switch the submenu: that is the hover intent that
 * keeps a diagonal move toward a submenu from falling apart.
 */
export function inSafeTriangle(point: Point, apex: Point, target: RectLike): boolean {
  // The edge of the submenu facing the apex.
  const edgeX = target.left >= apex.x ? target.left : target.right;
  const a = apex;
  const b: Point = { x: edgeX, y: target.top };
  const c: Point = { x: edgeX, y: target.bottom };
  const d1 = cross(a, b, point);
  const d2 = cross(b, c, point);
  const d3 = cross(c, a, point);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

export interface PlaceSubmenuInput {
  /** The parent item, in viewport coordinates. */
  item: RectLike;
  panel: { width: number; height: number };
  viewport: { width: number; height: number };
  /** Right-to-left text opens submenus toward the left first. */
  rtl?: boolean;
  margin?: number;
  /** How far the submenu tucks under the parent's edge so the two read as connected. */
  overlap?: number;
}

export interface SubmenuPosition {
  left: number;
  top: number;
  /** The physical side it opened on. */
  side: 'left' | 'right';
}

const clampTo = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

/**
 * Puts a submenu beside its parent item, top-aligned with it. It opens toward
 * the reading direction (right in LTR, left in RTL) and flips to the other side
 * when that one would be clipped; then it is clamped into the viewport.
 */
export function placeSubmenu({ item, panel, viewport, rtl = false, margin = 8, overlap = 4 }: PlaceSubmenuInput): SubmenuPosition {
  const rightLeft = item.right - overlap;
  const leftLeft = item.left - panel.width + overlap;
  const fitsRight = rightLeft + panel.width <= viewport.width - margin;
  const fitsLeft = leftLeft >= margin;

  let side: 'left' | 'right';
  if (rtl) side = fitsLeft || !fitsRight ? 'left' : 'right';
  else side = fitsRight || !fitsLeft ? 'right' : 'left';

  const left = clampTo(side === 'right' ? rightLeft : leftLeft, margin, Math.max(margin, viewport.width - margin - panel.width));
  // Line the first item up with the parent (the panel has a few px of padding).
  const top = clampTo(item.top - 6, margin, Math.max(margin, viewport.height - margin - panel.height));
  return { left, top, side };
}
