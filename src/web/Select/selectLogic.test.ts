import { describe, expect, it } from 'vitest';
import { filterOptions, nextIndex, placeDropdown, shouldBeSearchable } from './selectLogic';

const options = [
  { value: 'a', label: 'Apfel' },
  { value: 'b', label: 'Banane' },
  { value: 'c', label: 'Ananas' },
];

describe('shouldBeSearchable', () => {
  it('turns on automatically past 10 options', () => {
    expect(shouldBeSearchable(undefined, 10)).toBe(false);
    expect(shouldBeSearchable(undefined, 11)).toBe(true);
  });

  it('lets an explicit prop win either way', () => {
    expect(shouldBeSearchable(true, 3)).toBe(true);
    expect(shouldBeSearchable(false, 50)).toBe(false);
  });
});

describe('filterOptions', () => {
  it('returns everything for a blank query', () => {
    expect(filterOptions(options, '')).toHaveLength(3);
    expect(filterOptions(options, '   ')).toHaveLength(3);
  });

  it('matches case-insensitively anywhere in the label', () => {
    expect(filterOptions(options, 'AN').map((o) => o.value)).toEqual(['b', 'c']);
    expect(filterOptions(options, 'pf')).toEqual([options[0]]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterOptions(options, 'zzz')).toEqual([]);
  });

  it('does not mutate the input', () => {
    const copy = [...options];
    filterOptions(options, 'a');
    expect(options).toEqual(copy);
  });
});

describe('placeDropdown', () => {
  const base = { dropdownHeight: 250, viewportHeight: 800, gap: 8 };

  it('opens down when there is room below', () => {
    expect(placeDropdown({ ...base, triggerTop: 100, triggerBottom: 144 })).toBe('down');
  });

  it('flips up near the bottom edge when there is more room above', () => {
    expect(placeDropdown({ ...base, triggerTop: 700, triggerBottom: 744 })).toBe('up');
  });

  it('stays down when neither side fits but below has more room', () => {
    expect(placeDropdown({ ...base, dropdownHeight: 900, triggerTop: 100, triggerBottom: 144 })).toBe('down');
  });

  it('flips up when neither side fits but above has more room', () => {
    expect(placeDropdown({ ...base, dropdownHeight: 900, triggerTop: 500, triggerBottom: 544 })).toBe('up');
  });

  it('counts the gap as unusable space', () => {
    // 800 - 500 - 8 = 292 below: fits 250. With a 60px gap only 240 would.
    expect(placeDropdown({ ...base, triggerTop: 456, triggerBottom: 500 })).toBe('down');
    expect(placeDropdown({ ...base, triggerTop: 456, triggerBottom: 500, gap: 60 })).toBe('up');
  });
});

describe('nextIndex', () => {
  it('moves down and wraps to the first item', () => {
    expect(nextIndex(0, 'ArrowDown', 3)).toBe(1);
    expect(nextIndex(2, 'ArrowDown', 3)).toBe(0);
  });

  it('moves up and wraps to the last item', () => {
    expect(nextIndex(1, 'ArrowUp', 3)).toBe(0);
    expect(nextIndex(0, 'ArrowUp', 3)).toBe(2);
  });

  it('starts at the first item going down and the last going up from no focus', () => {
    expect(nextIndex(-1, 'ArrowDown', 3)).toBe(0);
    expect(nextIndex(-1, 'ArrowUp', 3)).toBe(2);
  });

  it('jumps with Home and End', () => {
    expect(nextIndex(1, 'Home', 5)).toBe(0);
    expect(nextIndex(1, 'End', 5)).toBe(4);
  });

  it('returns -1 for an empty list', () => {
    expect(nextIndex(-1, 'ArrowDown', 0)).toBe(-1);
    expect(nextIndex(0, 'End', 0)).toBe(-1);
  });
});
