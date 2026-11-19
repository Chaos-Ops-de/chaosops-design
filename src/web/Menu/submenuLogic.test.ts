import { describe, expect, it } from 'vitest';
import { inSafeTriangle, placeSubmenu } from './menuLogic';

describe('web/Menu inSafeTriangle', () => {
  // Parent item at the left; the submenu opens to the right: its near edge is x = 200, y 50 to 150.
  const apex = { x: 100, y: 100 };
  const submenu = { left: 200, top: 50, right: 360, bottom: 150 };

  it('is true on the straight path to the submenu', () => {
    expect(inSafeTriangle({ x: 150, y: 100 }, apex, submenu)).toBe(true);
    expect(inSafeTriangle({ x: 190, y: 100 }, apex, submenu)).toBe(true);
  });

  it('is true on a diagonal inside the cone', () => {
    expect(inSafeTriangle({ x: 150, y: 80 }, apex, submenu)).toBe(true);
    expect(inSafeTriangle({ x: 150, y: 120 }, apex, submenu)).toBe(true);
  });

  it('is false when the pointer heads away from the submenu', () => {
    expect(inSafeTriangle({ x: 150, y: 20 }, apex, submenu)).toBe(false);
    expect(inSafeTriangle({ x: 150, y: 190 }, apex, submenu)).toBe(false);
    expect(inSafeTriangle({ x: 60, y: 100 }, apex, submenu)).toBe(false);
  });

  it('works for a submenu that opened to the left', () => {
    const left = { left: -60, top: 50, right: 80, bottom: 150 };
    // The gap between the parent (x = 100) and the submenu's near edge (x = 80).
    expect(inSafeTriangle({ x: 90, y: 100 }, { x: 100, y: 100 }, left)).toBe(true);
    expect(inSafeTriangle({ x: 90, y: 20 }, { x: 100, y: 100 }, left)).toBe(false);
    expect(inSafeTriangle({ x: 120, y: 100 }, { x: 100, y: 100 }, left)).toBe(false);
  });
});

describe('web/Menu placeSubmenu', () => {
  const viewport = { width: 800, height: 600 };
  const panel = { width: 200, height: 160 };

  it('opens to the right of the item, top-aligned', () => {
    const pos = placeSubmenu({ item: { left: 100, top: 200, right: 300, bottom: 236 }, panel, viewport });
    expect(pos.side).toBe('right');
    expect(pos.left).toBe(296);
    expect(pos.top).toBe(194);
  });

  it('flips to the left when the right side is clipped', () => {
    const pos = placeSubmenu({ item: { left: 500, top: 200, right: 700, bottom: 236 }, panel, viewport });
    expect(pos.side).toBe('left');
    expect(pos.left).toBe(304);
  });

  it('opens to the left first in right-to-left text, flipping right when clipped', () => {
    const rtl = placeSubmenu({ item: { left: 400, top: 200, right: 600, bottom: 236 }, panel, viewport, rtl: true });
    expect(rtl.side).toBe('left');
    const clipped = placeSubmenu({ item: { left: 20, top: 200, right: 220, bottom: 236 }, panel, viewport, rtl: true });
    expect(clipped.side).toBe('right');
  });

  it('slides up when it would run off the bottom', () => {
    const pos = placeSubmenu({ item: { left: 100, top: 560, right: 300, bottom: 596 }, panel, viewport });
    expect(pos.top).toBe(600 - 8 - 160);
  });

  it('never leaves the margin at the top or the left', () => {
    const pos = placeSubmenu({ item: { left: 10, top: 2, right: 30, bottom: 30 }, panel, viewport, rtl: true });
    expect(pos.top).toBeGreaterThanOrEqual(8);
    expect(pos.left).toBeGreaterThanOrEqual(8);
  });

  it('falls back to the right when neither side fits', () => {
    const pos = placeSubmenu({ item: { left: 10, top: 100, right: 190, bottom: 136 }, panel: { width: 400, height: 100 }, viewport: { width: 300, height: 400 } });
    expect(pos.left).toBeGreaterThanOrEqual(8);
  });
});
