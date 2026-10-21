import { describe, expect, it } from 'vitest';
import { AVATAR_COLORS, colorForUserId, initialFor } from './avatarColor';
import { palettes } from '../tokens/colors';

describe('colorForUserId', () => {
  it('is deterministic and picks from the avatar palette', () => {
    expect(colorForUserId('user-1')).toBe(colorForUserId('user-1'));
    expect(AVATAR_COLORS).toContain(colorForUserId('user-1'));
  });

  it('spreads different ids over several colors', () => {
    const colors = new Set(Array.from({ length: 50 }, (_, i) => colorForUserId(`u${i}`)));
    expect(colors.size).toBeGreaterThan(2);
  });

  it('resolves to a concrete palette color when given a palette', () => {
    const c = colorForUserId('user-1', palettes.light);
    const values = (['blue', 'pink', 'orange', 'teal', 'violet'] as const).map((k) => palettes.light[k]);
    expect(values).toContain(c);
  });

  it('falls back to muted ink without an id', () => {
    expect(colorForUserId(null)).toBe('var(--chaos-ink-muted)');
    expect(colorForUserId(undefined, palettes.dark)).toBe(palettes.dark.inkMuted);
  });
});

describe('initialFor', () => {
  it('uppercases the first letter and falls back to ?', () => {
    expect(initialFor('  anna')).toBe('A');
    expect(initialFor('')).toBe('?');
    expect(initialFor(null)).toBe('?');
  });
});
