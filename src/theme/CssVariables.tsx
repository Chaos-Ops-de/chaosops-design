import { useEffect } from 'react';
import { paletteKeys, palettes, amberShades, type ThemeName } from '../tokens/colors';
import { cssShadows } from '../tokens/shadows';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';
import { itemTypeStyles } from '../tokens/itemTypes';
import { useTheme } from './ThemeContext';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

export function paletteToCssVars(theme: ThemeName): Record<string, string> {
  const palette = palettes[theme];
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
  return out;
})();

/**
 * Web-only. Emits palette CSS variables onto document.documentElement.
 * Mount once near the root, inside <ThemeProvider>.
 */
export const CssVariables: React.FC = () => {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const dynamic = paletteToCssVars(resolvedTheme);
    for (const [k, v] of Object.entries(dynamic)) root.style.setProperty(k, v);
    for (const [k, v] of Object.entries(staticCssVars)) root.style.setProperty(k, v);
    root.dataset.chaosTheme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);
  return null;
};

/**
 * Returns a stringified `:root { … }` block for SSR or manual injection.
 */
export function renderCssVariables(theme: ThemeName = 'light'): string {
  const all = { ...paletteToCssVars(theme), ...staticCssVars };
  const body = Object.entries(all).map(([k, v]) => `${k}:${v};`).join('');
  return `:root{${body}}`;
}
