import { useEffect } from 'react';
import { paletteKeys, amberShades, type ThemeName } from '../tokens/colors';
import { orgThemeBaseVars, orgThemeCssVars, resolveOrgPalette, defaultOrgTheme, type OrgThemeName } from '../tokens/orgThemes';
import { cssShadows, cssElevation } from '../tokens/shadows';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';
import { itemTypeStyles } from '../tokens/itemTypes';
import { durations, easings, timings } from '../tokens/motion';
import { touchTarget, rowHeights, gutters } from '../tokens/layout';
import { zIndex } from '../tokens/zIndex';
import { useTheme } from './ThemeContext';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

export function paletteToCssVars(theme: ThemeName, orgTheme: OrgThemeName = defaultOrgTheme): Record<string, string> {
  const palette = resolveOrgPalette(orgTheme, theme);
  const vars: Record<string, string> = {};
  for (const key of paletteKeys) {
    vars[`--chaos-${kebab(key)}`] = palette[key];
  }
  return vars;
}

export const staticCssVars: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(cssShadows)) out[`--chaos-shadow-${kebab(k)}`] = v;
  for (const [k, v] of Object.entries(radii)) out[`--chaos-radius-${kebab(k)}`] = typeof v === 'number' ? `${v}px` : String(v);
  for (const [k, v] of Object.entries(spacing)) out[`--chaos-space-${kebab(k)}`] = typeof v === 'number' ? `${v}px` : String(v);
  for (const [k, v] of Object.entries(amberShades)) out[`--chaos-amber-${k}`] = v;
  for (const [type, style] of Object.entries(itemTypeStyles)) out[`--chaos-item-${kebab(type)}`] = style.bgLight;
  for (const [k, v] of Object.entries(durations)) out[`--chaos-duration-${kebab(k)}`] = `${v}ms`;
  for (const [k, v] of Object.entries(easings)) out[`--chaos-ease-${kebab(k)}`] = v;
  for (const [k, v] of Object.entries(timings)) out[`--chaos-timing-${kebab(k)}`] = `${v}ms`;
  for (const [k, v] of Object.entries(cssElevation)) out[`--chaos-elevation-${kebab(k)}`] = v;
  for (const [k, v] of Object.entries(zIndex)) out[`--chaos-z-${kebab(k)}`] = String(v);
  for (const [k, v] of Object.entries(orgThemeBaseVars)) out[k] = v;
  out['--chaos-touch-target'] = `${touchTarget}px`;
  for (const [k, v] of Object.entries(rowHeights)) out[`--chaos-row-${kebab(k)}`] = `${v}px`;
  for (const [k, v] of Object.entries(gutters)) out[`--chaos-gutter-${kebab(k)}`] = `${v}px`;
  return out;
})();

/**
 * Web-only. Emits palette CSS variables onto document.documentElement.
 * Mount once near the root, inside <ThemeProvider>.
 */
export const CssVariables: React.FC = () => {
  const { resolvedTheme, orgTheme } = useTheme();
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const dynamic = paletteToCssVars(resolvedTheme, orgTheme);
    for (const [k, v] of Object.entries(dynamic)) root.style.setProperty(k, v);
    // Base values first, then the org theme on top — switching back to classic restores everything.
    for (const [k, v] of Object.entries(staticCssVars)) root.style.setProperty(k, v);
    for (const [k, v] of Object.entries(orgThemeCssVars(orgTheme))) root.style.setProperty(k, v);
    root.dataset.chaosTheme = resolvedTheme;
    root.dataset.chaosOrgTheme = orgTheme;
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, orgTheme]);
  return null;
};

/**
 * Returns a stringified `:root { … }` block for SSR or manual injection.
 */
export function renderCssVariables(theme: ThemeName = 'light', orgTheme: OrgThemeName = defaultOrgTheme): string {
  const all = { ...paletteToCssVars(theme, orgTheme), ...staticCssVars, ...orgThemeCssVars(orgTheme) };
  const body = Object.entries(all).map(([k, v]) => `${k}:${v};`).join('');
  return `:root{${body}}`;
}
