import { describe, expect, it } from 'vitest';
import { nextHeaderIndex, normalizeOpen, toggleOpen } from './accordionLogic';

describe('web/Accordion toggleOpen (multiple)', () => {
  it('opens and closes items independently', () => {
    expect(toggleOpen([], 'a', 'multiple')).toEqual(['a']);
    expect(toggleOpen(['a'], 'b', 'multiple')).toEqual(['a', 'b']);
    expect(toggleOpen(['a', 'b'], 'a', 'multiple')).toEqual(['b']);
  });

  it('can close the last open item regardless of collapsible', () => {
    expect(toggleOpen(['a'], 'a', 'multiple', false)).toEqual([]);
  });

  it('does not mutate its input', () => {
    const open = ['a'];
    toggleOpen(open, 'b', 'multiple');
    expect(open).toEqual(['a']);
  });
});

describe('web/Accordion toggleOpen (single)', () => {
  it('opening one closes the others', () => {
    expect(toggleOpen(['a'], 'b', 'single')).toEqual(['b']);
    expect(toggleOpen([], 'a', 'single')).toEqual(['a']);
  });

  it('closes the open item when collapsible', () => {
    expect(toggleOpen(['a'], 'a', 'single', true)).toEqual([]);
    expect(toggleOpen(['a'], 'a', 'single')).toEqual([]);
  });

  it('keeps one item open when not collapsible', () => {
    expect(toggleOpen(['a'], 'a', 'single', false)).toEqual(['a']);
  });
});

describe('web/Accordion normalizeOpen', () => {
  it('trims a single accordion to its first open id and leaves multiple alone', () => {
    expect(normalizeOpen(['a', 'b'], 'single')).toEqual(['a']);
    expect(normalizeOpen(['a', 'b'], 'multiple')).toEqual(['a', 'b']);
    expect(normalizeOpen([], 'single')).toEqual([]);
  });
});

describe('web/Accordion nextHeaderIndex', () => {
  const disabled = [false, true, false, false];

  it('moves down and up with wrap, skipping disabled headers', () => {
    expect(nextHeaderIndex(0, 'ArrowDown', disabled)).toBe(2);
    expect(nextHeaderIndex(3, 'ArrowDown', disabled)).toBe(0);
    expect(nextHeaderIndex(2, 'ArrowUp', disabled)).toBe(0);
    expect(nextHeaderIndex(0, 'ArrowUp', disabled)).toBe(3);
  });

  it('jumps to the first and last enabled header', () => {
    expect(nextHeaderIndex(3, 'Home', [true, false, false, true])).toBe(1);
    expect(nextHeaderIndex(1, 'End', [true, false, false, true])).toBe(2);
  });

  it('returns -1 with no headers or none enabled', () => {
    expect(nextHeaderIndex(0, 'ArrowDown', [])).toBe(-1);
    expect(nextHeaderIndex(0, 'ArrowDown', [true, true])).toBe(-1);
    expect(nextHeaderIndex(0, 'Home', [true])).toBe(-1);
  });

  it('stays put when it is the only enabled header', () => {
    expect(nextHeaderIndex(1, 'ArrowDown', [true, false])).toBe(1);
  });
});
