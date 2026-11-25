import { palettes, type Palette, type ThemeName } from './colors';
import { webFontStack } from './fonts';

/**
 * Organisation themes — a *style* axis independent of light/dark.
 *
 * `classic` is the original ChaosOps look (flipchart, tape, handwritten
 * headings, offset sticker shadows) and overrides nothing. `casual` and
 * `corporate` re-skin the same components by swapping palette values and a
 * handful of CSS variables (fonts, radii, shadows, outline, decoration).
 */
export const orgThemeNames = ['classic', 'casual', 'corporate'] as const;
export type OrgThemeName = (typeof orgThemeNames)[number];
export const defaultOrgTheme: OrgThemeName = 'classic';

export function isOrgThemeName(value: unknown): value is OrgThemeName {
  return typeof value === 'string' && (orgThemeNames as readonly string[]).includes(value);
}

export interface OrgThemeDefinition {
  label: string;
  /** One-sentence description for theme pickers (German, like the rest of the UI). */
  description: string;
  /** Palette values replacing the base light/dark palette. Anything omitted keeps the base value. */
  palette: Record<ThemeName, Partial<Palette>>;
  /**
   * Non-palette CSS variables. Every key MUST also exist in `orgThemeBaseVars`
   * so switching back to `classic` restores the original value.
   */
  vars: Record<string, string>;
}

/** Classic values for every variable an org theme may override. */
export const orgThemeBaseVars: Record<string, string> = {
  '--chaos-font-display': webFontStack.display,
  '--chaos-font-body': webFontStack.body,
  /** Colour of the hard outlines drawn around cards, buttons and inputs. */
  '--chaos-outline': 'var(--chaos-ink)',
  /** `block` shows flipchart paper accents and masking tape; `none` hides them. */
  '--chaos-decor-display': 'block',
  /** Tilt (deg multiplier 0..1) for components that rotate like stuck-on stickers. */
  '--chaos-tilt': '1',
  /**
   * Soft replacement for any offset sticker shadow without a sized token. `initial` is the
   * guaranteed-invalid value, so `var(--chaos-shadow-soft, <hard shadow>)` keeps the hard
   * shadow in classic.
   */
  '--chaos-shadow-soft': 'initial',
  '--chaos-radius-sm': '4px',
  '--chaos-radius-md': '8px',
  '--chaos-radius-lg': '12px',
  '--chaos-radius-xl': '16px',
  '--chaos-shadow-offset-ink-press': '1px 2px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-sm': '2px 3px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink': '2px 4px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-hover': '3px 4px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-md': '3px 5px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-lg': '3px 6px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-md-hover': '4px 7px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-xs': '1px 1px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-2': '2px 2px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-3': '3px 3px 0 var(--chaos-ink)',
  '--chaos-shadow-offset-ink-4': '4px 4px 0 var(--chaos-ink)',
};

const softShadows = (s: { press: string; sm: string; base: string; hover: string; md: string; lg: string; mdHover: string }) => ({
  '--chaos-shadow-offset-ink-press': s.press,
  '--chaos-shadow-offset-ink-sm': s.sm,
  '--chaos-shadow-offset-ink': s.base,
  '--chaos-shadow-offset-ink-hover': s.hover,
  '--chaos-shadow-offset-ink-md': s.md,
  '--chaos-shadow-offset-ink-lg': s.lg,
  '--chaos-shadow-offset-ink-md-hover': s.mdHover,
  '--chaos-shadow-offset-ink-xs': s.press,
  '--chaos-shadow-offset-ink-2': s.sm,
  '--chaos-shadow-offset-ink-3': s.base,
  '--chaos-shadow-offset-ink-4': s.md,
});

export const orgThemes: Record<OrgThemeName, OrgThemeDefinition> = {
  classic: {
    label: 'Classic ChaosOps',
    description: 'Der gewohnte ChaosOps-Look: Flipchart, Klebeband und handgezeichnete Akzente.',
    palette: { light: {}, dark: {} },
    vars: {},
  },

  casual: {
    label: 'Casual',
    description: 'Freundlich und locker: warme Farben, weiche Rundungen, runde Schrift.',
    palette: {
      light: {
        bg: '#fff6ee', headerBg: '#fff6ee', tabBarBg: '#fffaf5', tabBarBorder: '#f0e0d2', cardBg: '#ffffff',
        ink: '#2d2a3e', inkSoft: '#4d4960', inkMuted: '#6b6780', inkFaint: '#9a96ad',
        border: '#e7d6c6', inputBorder: '#e0cfbf', chipInactiveBg: '#f7ebe0',
        hairline: 'rgba(45, 42, 62, 0.08)', shadowColor: 'rgba(120, 80, 40, 0.14)',
        info: '#7c5cf0', infoInk: '#5b3fd0', infoTint: '#ece7ff', infoLight: '#a996f7', infoDark: '#6a4ae0',
        glowInfo: 'rgba(124, 92, 240, 0.28)', focusRing: '#7c5cf0',
        amber: '#ffb547', green: '#2fbf8f', danger: '#f0526b', onInverse: '#fff6ee',
      },
      dark: {
        bg: '#1c1925', headerBg: '#211d2c', tabBarBg: '#211d2c', tabBarBorder: '#342f45', cardBg: '#272335',
        ink: '#f3effa', inkSoft: '#d8d2e6', inkMuted: '#b2abc4', inkFaint: '#867f9a',
        border: '#413b57', inputBg: '#272335', inputBorder: '#413b57', chipInactiveBg: '#2f2a40',
        surfaceElevated: '#302b42', hairline: 'rgba(243, 239, 250, 0.12)',
        info: '#a78bfa', infoInk: '#c4b5fd', focusRing: '#a78bfa',
      },
    },
    vars: {
      '--chaos-font-display': '"Nunito", "Comic Neue", Inter, system-ui, sans-serif',
      '--chaos-font-body': '"Nunito", "Comic Neue", Inter, system-ui, sans-serif',
      '--chaos-outline': 'var(--chaos-border)',
      '--chaos-decor-display': 'none',
      '--chaos-tilt': '0',
      '--chaos-shadow-soft': '0 4px 12px var(--chaos-shadow-color)',
      '--chaos-radius-sm': '8px',
      '--chaos-radius-md': '14px',
      '--chaos-radius-lg': '20px',
      '--chaos-radius-xl': '28px',
      ...softShadows({
        press: '0 1px 2px var(--chaos-shadow-color)',
        sm: '0 2px 6px var(--chaos-shadow-color)',
        base: '0 4px 12px var(--chaos-shadow-color)',
        hover: '0 6px 16px var(--chaos-shadow-color)',
        md: '0 6px 18px var(--chaos-shadow-color)',
        lg: '0 8px 24px var(--chaos-shadow-color)',
        mdHover: '0 10px 28px var(--chaos-shadow-color)',
      }),
    },
  },

  corporate: {
    label: 'Corporate',
    description: 'Sachlich und ruhig: neutrale Flächen, klares Blau, dezente Schatten.',
    palette: {
      light: {
        bg: '#f3f5f8', headerBg: '#ffffff', tabBarBg: '#ffffff', tabBarBorder: '#dde3ec', cardBg: '#ffffff',
        ink: '#1b2430', inkSoft: '#3b4757', inkMuted: '#5f6b7c', inkFaint: '#94a0b2',
        border: '#ccd4e0', inputBorder: '#c3ccda', chipInactiveBg: '#e8ecf2',
        hairline: 'rgba(27, 36, 48, 0.08)', shadowColor: 'rgba(16, 24, 40, 0.12)',
        info: '#1d4ed8', infoInk: '#1e40af', infoTint: '#dbe6fb', infoLight: '#60a5fa', infoDark: '#1e40af',
        glowInfo: 'rgba(29, 78, 216, 0.22)', focusRing: '#1d4ed8',
        amber: '#e0a526', green: '#0f9d6c', danger: '#d92d3f', onInverse: '#f3f5f8',
      },
      dark: {
        bg: '#10151c', headerBg: '#151b24', tabBarBg: '#151b24', tabBarBorder: '#252e3b', cardBg: '#18202a',
        ink: '#e6ebf2', inkSoft: '#c8d0dc', inkMuted: '#9aa6b8', inkFaint: '#738094',
        border: '#2c3645', inputBg: '#18202a', inputBorder: '#2c3645', chipInactiveBg: '#202a36',
        surfaceElevated: '#1e2733', hairline: 'rgba(230, 235, 242, 0.1)',
        info: '#60a5fa', infoInk: '#93c5fd', focusRing: '#60a5fa',
      },
    },
    vars: {
      '--chaos-font-display': 'Inter, "Segoe UI", Roboto, system-ui, sans-serif',
      '--chaos-font-body': 'Inter, "Segoe UI", Roboto, system-ui, sans-serif',
      '--chaos-outline': 'var(--chaos-border)',
      '--chaos-decor-display': 'none',
      '--chaos-tilt': '0',
      '--chaos-shadow-soft': '0 1px 3px var(--chaos-shadow-color)',
      '--chaos-radius-sm': '2px',
      '--chaos-radius-md': '4px',
      '--chaos-radius-lg': '6px',
      '--chaos-radius-xl': '8px',
      ...softShadows({
        press: 'none',
        sm: '0 1px 2px var(--chaos-shadow-color)',
        base: '0 1px 3px var(--chaos-shadow-color)',
        hover: '0 2px 6px var(--chaos-shadow-color)',
        md: '0 2px 6px var(--chaos-shadow-color)',
        lg: '0 4px 12px var(--chaos-shadow-color)',
        mdHover: '0 4px 14px var(--chaos-shadow-color)',
      }),
    },
  },
};

/** Base palette for `mode` with the org theme's overrides applied. */
export function resolveOrgPalette(orgTheme: OrgThemeName, mode: ThemeName): Palette {
  return { ...palettes[mode], ...orgThemes[orgTheme].palette[mode] };
}

/** Org-theme variable overrides (empty for `classic`). */
export function orgThemeCssVars(orgTheme: OrgThemeName): Record<string, string> {
  return { ...orgThemes[orgTheme].vars };
}
