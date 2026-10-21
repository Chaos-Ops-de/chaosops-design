import { describe, expect, it } from 'vitest';
import { isKioskPath, schemeFromTimeOfDay } from './useSystemScheme';

describe('theme/useSystemScheme helpers', () => {
  it('detects kiosk paths', () => {
    expect(isKioskPath('/display/abc')).toBe(true);
    expect(isKioskPath('/register-display')).toBe(true);
    expect(isKioskPath('/dashboard')).toBe(false);
    expect(isKioskPath('/kiosk/1', ['/kiosk/'])).toBe(true);
  });

  it('uses dark between 20:00 and 07:00', () => {
    expect(schemeFromTimeOfDay(new Date(2026, 0, 1, 21))).toBe('dark');
    expect(schemeFromTimeOfDay(new Date(2026, 0, 1, 6))).toBe('dark');
    expect(schemeFromTimeOfDay(new Date(2026, 0, 1, 12))).toBe('light');
  });
});
