import { describe, expect, it } from 'vitest';
import { palettes, paletteKeys, type ThemeName } from './colors';
import {
  orgThemeNames, orgThemes, orgThemeBaseVars, orgThemeCssVars, resolveOrgPalette, isOrgThemeName,
} from './orgThemes';
import { paletteToCssVars, staticCssVars, renderCssVariables } from '../theme/CssVariables';
import { contrastRatio } from '../utils/contrast';

const MODES: ThemeName[] = ['light', 'dark'];

describe('tokens/orgThemes', () => {
  it('classic changes nothing', () => {
    for (const m of MODES) expect(resolveOrgPalette('classic', m)).toEqual(palettes[m]);
    expect(orgThemeCssVars('classic')).toEqual({});
    expect(paletteToCssVars('light')).toEqual(paletteToCssVars('light', 'classic'));
  });

  it('only overrides known palette keys', () => {
    for (const name of orgThemeNames) for (const m of MODES)
      for (const k of Object.keys(orgThemes[name].palette[m])) expect(paletteKeys).toContain(k);
  });

  it('every variable a theme sets has a classic base value (so switching back restores it)', () => {
    for (const name of orgThemeNames)
      for (const k of Object.keys(orgThemes[name].vars)) {
        expect(orgThemeBaseVars[k], `${name} sets ${k}`).toBeDefined();
        expect(staticCssVars[k], `${k} missing from staticCssVars`).toBe(orgThemeBaseVars[k]);
      }
  });

  it('keeps the soft-shadow fallback unset in classic', () => {
    expect(orgThemeBaseVars['--chaos-shadow-soft']).toBe('initial');
    for (const name of ['casual', 'corporate'] as const) expect(orgThemes[name].vars['--chaos-shadow-soft']).not.toBe('initial');
  });

  it('casual and corporate hide decoration and straighten tilt; classic shows it', () => {
    expect(orgThemeBaseVars['--chaos-decor-display']).toBe('block');
    for (const name of ['casual', 'corporate'] as const) {
      expect(orgThemes[name].vars['--chaos-decor-display']).toBe('none');
      expect(orgThemes[name].vars['--chaos-tilt']).toBe('0');
    }
  });

  it('keeps body text and the info accent readable in every theme and mode', () => {
    for (const name of orgThemeNames) for (const m of MODES) {
      const p = resolveOrgPalette(name, m);
      for (const bg of ['bg', 'cardBg', 'surfaceElevated'] as const) {
        expect(contrastRatio(p.ink, p[bg]), `${name}/${m} ink on ${bg}`).toBeGreaterThanOrEqual(7);
        expect(contrastRatio(p.inkMuted, p[bg]), `${name}/${m} inkMuted on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
      // Classic's white-on-sky labels are a recorded brand exception (see contrast.test.ts).
      if (name !== 'classic') expect(contrastRatio(p.onAccent, p.info), `${name}/${m} onAccent on info`).toBeGreaterThanOrEqual(3);
    }
  });

  it('renders org-theme variables into the SSR block', () => {
    expect(renderCssVariables('light', 'corporate')).toContain('--chaos-decor-display:none');
    expect(renderCssVariables('light', 'classic')).toContain('--chaos-decor-display:block');
  });

  it('isOrgThemeName validates', () => {
    expect(isOrgThemeName('casual')).toBe(true);
    expect(isOrgThemeName('neon')).toBe(false);
  });
});
