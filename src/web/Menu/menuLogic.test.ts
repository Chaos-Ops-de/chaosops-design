import { describe, expect, it } from 'vitest';
import { flattenGroups, isLetterKey, matchByLetter, nextEnabledIndex, normalizeGroups } from './menuLogic';

const item = (id: string, extra: { danger?: boolean; disabled?: boolean } = {}) => ({ id, label: id, ...extra });

describe('web/Menu normalizeGroups', () => {
  it('keeps groups and order when nothing is dangerous', () => {
    const groups = normalizeGroups([[item('a'), item('b')], [item('c')]]);
    expect(groups.map((g) => g.map((i) => i.id))).toEqual([['a', 'b'], ['c']]);
  });

  it('moves every danger item into one last group, alone at the bottom', () => {
    const groups = normalizeGroups([
      [item('rename'), item('delete', { danger: true }), item('copy')],
      [item('share'), item('archive', { danger: true })],
    ]);
    expect(groups.map((g) => g.map((i) => i.id))).toEqual([['rename', 'copy'], ['share'], ['delete', 'archive']]);
  });

  it('drops groups that end up empty and handles an all-danger menu', () => {
    expect(normalizeGroups([[item('x', { danger: true })], []]).map((g) => g.length)).toEqual([1]);
    expect(normalizeGroups([])).toEqual([]);
  });
});

describe('web/Menu flattenGroups', () => {
  it('lists items in display order', () => {
    expect(flattenGroups([[1, 2], [3]])).toEqual([1, 2, 3]);
    expect(flattenGroups([])).toEqual([]);
  });
});

describe('web/Menu nextEnabledIndex', () => {
  const items = [{ disabled: false }, { disabled: true }, { disabled: false }, { disabled: false }];

  it('moves down and wraps, skipping disabled items', () => {
    expect(nextEnabledIndex(0, 'ArrowDown', items)).toBe(2);
    expect(nextEnabledIndex(2, 'ArrowDown', items)).toBe(3);
    expect(nextEnabledIndex(3, 'ArrowDown', items)).toBe(0);
  });

  it('moves up and wraps, skipping disabled items', () => {
    expect(nextEnabledIndex(2, 'ArrowUp', items)).toBe(0);
    expect(nextEnabledIndex(0, 'ArrowUp', items)).toBe(3);
  });

  it('starts at the top going down and at the bottom going up from nothing focused', () => {
    expect(nextEnabledIndex(-1, 'ArrowDown', items)).toBe(0);
    expect(nextEnabledIndex(-1, 'ArrowUp', items)).toBe(3);
  });

  it('Home and End jump to the first and last enabled item', () => {
    const edge = [{ disabled: true }, { disabled: false }, { disabled: false }, { disabled: true }];
    expect(nextEnabledIndex(2, 'Home', edge)).toBe(1);
    expect(nextEnabledIndex(1, 'End', edge)).toBe(2);
  });

  it('returns -1 for an empty menu or when every item is disabled', () => {
    expect(nextEnabledIndex(-1, 'ArrowDown', [])).toBe(-1);
    expect(nextEnabledIndex(0, 'ArrowDown', [{ disabled: true }])).toBe(-1);
    expect(nextEnabledIndex(0, 'Home', [{ disabled: true }])).toBe(-1);
  });

  it('stays on the only enabled item', () => {
    expect(nextEnabledIndex(1, 'ArrowDown', [{ disabled: true }, { disabled: false }])).toBe(1);
  });
});

describe('web/Menu matchByLetter', () => {
  const items = [
    { label: 'Umbenennen' },
    { label: 'Duplizieren' },
    { label: 'Drucken' },
    { label: 'Löschen', disabled: true },
    { label: 'Teilen' },
  ];

  it('lands on the first match from nothing focused', () => {
    expect(matchByLetter(items, -1, 'd')).toBe(1);
    expect(matchByLetter(items, -1, 'D')).toBe(1);
  });

  it('cycles through items sharing a letter and wraps', () => {
    expect(matchByLetter(items, 1, 'd')).toBe(2);
    expect(matchByLetter(items, 2, 'd')).toBe(1);
  });

  it('skips disabled items and returns -1 when nothing matches', () => {
    expect(matchByLetter(items, -1, 'l')).toBe(-1);
    expect(matchByLetter(items, -1, 'x')).toBe(-1);
    expect(matchByLetter([], -1, 'a')).toBe(-1);
    expect(matchByLetter(items, -1, '')).toBe(-1);
  });
});

describe('web/Menu isLetterKey', () => {
  it('accepts a printable character and rejects modifiers, named keys and whitespace', () => {
    expect(isLetterKey({ key: 'a' })).toBe(true);
    expect(isLetterKey({ key: 'a', ctrlKey: true })).toBe(false);
    expect(isLetterKey({ key: 'Enter' })).toBe(false);
    expect(isLetterKey({ key: ' ' })).toBe(false);
  });
});
