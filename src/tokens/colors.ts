export type ThemeName = 'light' | 'dark';

export interface Palette {
  bg: string;
  cardBg: string;
  ink: string;
  inkMuted: string;
  border: string;
  headerBg: string;
  tabBarBg: string;
  tabBarBorder: string;
  amber: string;
  green: string;
  danger: string;
  inputBg: string;
  inputBorder: string;
  chipInactiveBg: string;
  /** Generic informational accent (info toasts/icons, help affordances). */
  info: string;
  /** Elevated-vs-base surface for floating chrome (modals, dropdowns, sheets) — brighter than cardBg in dark mode, per "dim, don't invert". */
  surfaceElevated: string;
  /** Modal/sheet backdrop scrim. */
  overlayScrim: string;
  /** :focus-visible ring color. */
  focusRing: string;
  /** Tertiary accent for a 5th semantic category beyond amber/green/danger/info (e.g. workshop-type badges, owner-tier indicators). */
  violet: string;
  /** Text-safe variant of `violet` for legible copy on a violet-tinted background. */
  violetInk: string;
  /** Extended accent set for multi-category UIs (e.g. PO dashboard tabs/role badges) beyond amber/green/danger/info/violet. Each has a text-safe `*Ink` variant for copy on a tinted background of the base hue. */
  blue: string;
  blueInk: string;
  pink: string;
  pinkInk: string;
  orange: string;
  orangeInk: string;
  teal: string;
  tealInk: string;
  /** Text/icon color on a saturated accent fill (danger/violet/green buttons, badges). */
  onAccent: string;
  /** Mid-strength body text — between `ink` and `inkMuted`. */
  inkSoft: string;
  /** Faintest readable text (hints, timestamps). Not for essential copy. */
  inkFaint: string;
  /** Text-safe variants of the semantic accents for copy on a tinted background of the same hue. */
  infoInk: string;
  greenInk: string;
  amberInk: string;
  dangerInk: string;
  /** Soft background tints of each accent hue (callouts, status pills, PDF/export fills). */
  infoTint: string;
  greenTint: string;
  amberTint: string;
  dangerTint: string;
  violetTint: string;
  pinkTint: string;
  orangeTint: string;
  tealTint: string;
  /** Strong scrim for full-bleed overlays (camera, guided tour) — darker than `overlayScrim`. */
  scrimStrong: string;
  /** Pressed/ripple overlay for tappable surfaces. */
  ripple: string;
}

export const palettes: Record<ThemeName, Palette> = {
  light: {
    bg: '#fffbe7',
    cardBg: '#ffffff',
    ink: '#181818',
    inkMuted: '#6b7280',
    border: '#181818',
    headerBg: '#fffbe7',
    tabBarBg: '#fffdf3',
    tabBarBorder: '#e5e7eb',
    amber: '#fbbf24',
    green: '#10b981',
    danger: '#ef4444',
    inputBg: '#ffffff',
    inputBorder: '#d1d5db',
    chipInactiveBg: '#f4f1e6',
    info: '#0ea5e9',
    surfaceElevated: '#ffffff',
    overlayScrim: 'rgba(24, 20, 14, 0.5)',
    focusRing: '#0ea5e9',
    violet: '#a855f7',
    violetInk: '#6d28d9',
    blue: '#0ea5e9',
    blueInk: '#0ea5e9',
    pink: '#f43f5e',
    pinkInk: '#be123c',
    orange: '#f97316',
    orangeInk: '#c2410c',
    teal: '#14b8a6',
    tealInk: '#0f766e',
    onAccent: '#ffffff',
    inkSoft: '#4b5563',
    inkFaint: '#9ca3af',
    infoInk: '#0369a1',
    greenInk: '#047857',
    amberInk: '#b45309',
    dangerInk: '#b91c1c',
    infoTint: '#e0f2fe',
    greenTint: '#d1fae5',
    amberTint: '#fef3c7',
    dangerTint: '#fee2e2',
    violetTint: '#f3e8ff',
    pinkTint: '#ffe4e6',
    orangeTint: '#ffedd5',
    tealTint: '#ccfbf1',
    scrimStrong: 'rgba(0, 0, 0, 0.6)',
    ripple: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    bg: '#171310',
    cardBg: '#231d16',
    ink: '#f5ecd8',
    inkMuted: '#b9ac95',
    border: '#4a4030',
    headerBg: '#1c1712',
    tabBarBg: '#1c1712',
    tabBarBorder: '#3a3126',
    amber: '#fbbf24',
    green: '#34d399',
    danger: '#f87171',
    inputBg: '#231d16',
    inputBorder: '#4a4030',
    chipInactiveBg: '#2a231a',
    info: '#38bdf8',
    surfaceElevated: '#2c2519',
    overlayScrim: 'rgba(0, 0, 0, 0.65)',
    focusRing: '#38bdf8',
    violet: '#c4b5fd',
    violetInk: '#c4b5fd',
    blue: '#60a5fa',
    blueInk: 'color-mix(in srgb, var(--chaos-info) 45%, var(--chaos-bg))',
    pink: '#fb7185',
    pinkInk: '#fda4af',
    orange: '#fb923c',
    orangeInk: '#fdba74',
    teal: '#2dd4bf',
    tealInk: '#5eead4',
    onAccent: '#181818',
    inkSoft: '#d3c8b2',
    inkFaint: '#8a7f6b',
    infoInk: '#7dd3fc',
    greenInk: '#6ee7b7',
    amberInk: '#fcd34d',
    dangerInk: '#fca5a5',
    infoTint: 'rgba(56, 189, 248, 0.16)',
    greenTint: 'rgba(52, 211, 153, 0.16)',
    amberTint: 'rgba(251, 191, 36, 0.16)',
    dangerTint: 'rgba(248, 113, 113, 0.16)',
    violetTint: 'rgba(196, 181, 253, 0.16)',
    pinkTint: 'rgba(251, 113, 133, 0.16)',
    orangeTint: 'rgba(251, 146, 60, 0.16)',
    tealTint: 'rgba(45, 212, 191, 0.16)',
    scrimStrong: 'rgba(0, 0, 0, 0.75)',
    ripple: 'rgba(255, 255, 255, 0.1)',
  },
};

export const paletteKeys: Array<keyof Palette> = [
  'bg', 'cardBg', 'ink', 'inkMuted', 'border', 'headerBg',
  'tabBarBg', 'tabBarBorder', 'amber', 'green', 'danger',
  'inputBg', 'inputBorder', 'chipInactiveBg',
  'info', 'surfaceElevated', 'overlayScrim', 'focusRing', 'violet', 'violetInk',
  'blue', 'blueInk', 'pink', 'pinkInk', 'orange', 'orangeInk', 'teal', 'tealInk',
  'onAccent', 'inkSoft', 'inkFaint', 'infoInk', 'greenInk', 'amberInk', 'dangerInk',
  'infoTint', 'greenTint', 'amberTint', 'dangerTint', 'violetTint', 'pinkTint', 'orangeTint', 'tealTint',
  'scrimStrong', 'ripple',
];

/**
 * Darker amber shades used for hover/pressed states (e.g. CTA buttons).
 * Same values in both themes, so they aren't part of the light/dark Palette.
 */
export const amberShades = {
  700: '#a16207',
  900: '#7c2d12',
};

/**
 * Curated hue picker for user-assigned categorical colors (tags, workshop
 * colors, display zones, …) — not app theme, so these are a fixed set of
 * distinct hues rather than light/dark Palette entries. Reuses Palette
 * tokens (as CSS vars, theme-reactive) where a hue already exists there;
 * the remaining hues (yellow, lime, indigo, this specific violet/pink) have
 * no semantic-token equivalent and stay literal hex.
 */
export const presetColors: string[] = [
  'var(--chaos-danger)', // red
  'var(--chaos-amber)', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  'var(--chaos-green)', // green
  'var(--chaos-teal, #14b8a6)', // teal
  'var(--chaos-info)', // sky
  'var(--chaos-blue, #0ea5e9)', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  'var(--chaos-violet, #a855f7)', // purple
  '#ec4899', // pink
  'var(--chaos-ink-muted)', // slate
];

const camel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/**
 * Resolves a stored color that may be a themed CSS-var reference
 * (`var(--chaos-amber)` or `var(--chaos-teal, #14b8a6)`) to a concrete value for
 * the given palette — for native clients that can't use CSS variables. Plain
 * colors pass through; unknown vars fall back to their literal fallback if any.
 */
export function resolveColorToken(value: string, palette: Palette): string {
  const m = /^var\(--chaos-([a-z0-9-]+)\s*(?:,\s*([^)]+))?\)$/i.exec(value.trim());
  if (!m) return value;
  const key = camel(m[1]!) as keyof Palette;
  return palette[key] ?? m[2]?.trim() ?? value;
}
