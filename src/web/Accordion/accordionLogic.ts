export type AccordionType = 'single' | 'multiple';

/**
 * The open ids after toggling `id`. `multiple` flips that one id and leaves
 * the rest. `single` keeps at most one open: opening one closes the others,
 * and clicking the open one closes it only when `collapsible` (otherwise one
 * item always stays open).
 */
export function toggleOpen(
  openIds: readonly string[],
  id: string,
  type: AccordionType,
  collapsible = true,
): string[] {
  const isOpen = openIds.includes(id);
  if (type === 'multiple') return isOpen ? openIds.filter((x) => x !== id) : [...openIds, id];
  if (isOpen) return collapsible ? [] : [id];
  return [id];
}

/** A `single` accordion never has more than one open item; trims a longer initial list to its first. */
export function normalizeOpen(openIds: readonly string[], type: AccordionType): string[] {
  return type === 'single' ? openIds.slice(0, 1) : [...openIds];
}

export type HeaderNavKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

export const HEADER_NAV_KEYS: readonly string[] = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/**
 * Header that arrow keys should focus next. Arrows wrap and skip disabled
 * headers; Home/End go to the first/last enabled header. Returns -1 when no
 * header is enabled.
 */
export function nextHeaderIndex(current: number, key: HeaderNavKey, disabled: readonly boolean[]): number {
  const count = disabled.length;
  const enabled = (i: number) => !disabled[i];
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
  for (let n = 1; n <= count; n++) {
    const i = (((current + dir * n) % count) + count) % count;
    if (enabled(i)) return i;
  }
  return -1;
}
