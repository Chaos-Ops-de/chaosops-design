/** Past this many options a Select gets a search field by default. */
export const SEARCH_THRESHOLD = 10;

/** Whether to show the search field: an explicit prop wins, otherwise "more than 10 options". */
export function shouldBeSearchable(searchable: boolean | undefined, optionCount: number): boolean {
  return searchable ?? optionCount > SEARCH_THRESHOLD;
}

/** Case-insensitive label filter. A blank query returns every option. */
export function filterOptions<T extends { label: string }>(options: readonly T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...options];
  return options.filter((o) => o.label.toLowerCase().includes(q));
}

export type DropdownPlacement = 'down' | 'up';

export interface PlaceDropdownInput {
  triggerTop: number;
  triggerBottom: number;
  dropdownHeight: number;
  viewportHeight: number;
  /** Space kept between trigger and dropdown. */
  gap: number;
}

/**
 * Opens downward unless the dropdown wouldn't fit below the trigger and there
 * is more room above — then it flips up instead of being clipped.
 */
export function placeDropdown({
  triggerTop,
  triggerBottom,
  dropdownHeight,
  viewportHeight,
  gap,
}: PlaceDropdownInput): DropdownPlacement {
  const below = viewportHeight - triggerBottom - gap;
  const above = triggerTop - gap;
  if (below >= dropdownHeight) return 'down';
  return above > below ? 'up' : 'down';
}

export type NavKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

export const NAV_KEYS: readonly string[] = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/**
 * Next focus index for a list of `length` items. `current` is -1 when focus
 * isn't on an item yet. Arrow keys wrap around (a listbox has no dead end);
 * Home/End jump to the first/last item. Returns -1 for an empty list.
 */
export function nextIndex(current: number, key: NavKey, length: number): number {
  if (length <= 0) return -1;
  switch (key) {
    case 'Home':
      return 0;
    case 'End':
      return length - 1;
    case 'ArrowDown':
      return current < 0 ? 0 : (current + 1) % length;
    case 'ArrowUp':
      return current < 0 ? length - 1 : (current - 1 + length) % length;
  }
}
