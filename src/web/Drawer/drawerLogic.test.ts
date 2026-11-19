import { describe, expect, it } from 'vitest';
import { clampDrawerWidth, drawerSlideOffset, DRAWER_DEFAULT_WIDTH, DRAWER_MIN_WIDTH } from './drawerLogic';

describe('web/Drawer clampDrawerWidth', () => {
  it('keeps the requested width inside the 320 px to 40% range', () => {
    expect(clampDrawerWidth(1440, 480)).toBe(480);
    expect(clampDrawerWidth(1440)).toBe(DRAWER_DEFAULT_WIDTH);
  });

  it('caps at 40% of the viewport', () => {
    expect(clampDrawerWidth(1440, 900)).toBe(576);
    expect(clampDrawerWidth(1000, 900)).toBe(400);
  });

  it('never goes below 320 px', () => {
    expect(clampDrawerWidth(1440, 100)).toBe(DRAWER_MIN_WIDTH);
  });

  it('lets the minimum win when 40% of the viewport is smaller than it', () => {
    expect(clampDrawerWidth(700, 500)).toBe(320);
    expect(clampDrawerWidth(800, 500)).toBe(320);
  });

  it('never exceeds the screen itself', () => {
    expect(clampDrawerWidth(300, 500)).toBe(300);
    expect(clampDrawerWidth(0, 500)).toBe(0);
  });

  it('falls back to the default for a bad request or viewport', () => {
    expect(clampDrawerWidth(1440, Number.NaN)).toBe(DRAWER_DEFAULT_WIDTH);
    expect(clampDrawerWidth(Number.NaN, 400)).toBe(0);
  });
});

describe('web/Drawer drawerSlideOffset', () => {
  it('slides in from the right for end in LTR and from the left in RTL', () => {
    expect(drawerSlideOffset('end', false)).toBe('100%');
    expect(drawerSlideOffset('end', true)).toBe('-100%');
  });

  it('is mirrored for start', () => {
    expect(drawerSlideOffset('start', false)).toBe('-100%');
    expect(drawerSlideOffset('start', true)).toBe('100%');
  });
});
