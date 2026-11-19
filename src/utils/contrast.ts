/**
 * WCAG contrast helpers. Platform-neutral (no DOM) so they run in tests,
 * on native, and in Storybook alike.
 */

/** Minimum contrast ratios by what is being drawn. */
export const contrastThresholds = {
  /** Body text. */
  text: 4.5,
  /** Large text: 24 px, or 19 px bold. */
  largeText: 3,
  /** Icons and input borders. */
  uiComponent: 3,
  /** Placeholder text is still text. */
  placeholder: 4.5,
} as const;

export type ContrastKind = keyof typeof contrastThresholds;

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Parses `#rgb`, `#rrggbb`, `rgb()` and `rgba()`. Anything else (`var()`, `color-mix()`) is `null`. */
export function parseColor(input: string): Rgba | null {
  const value = input.trim().toLowerCase();

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(value);
  if (hex) {
    const h = hex[1]!;
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
      a: 1,
    };
  }

  const fn = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(value);
  if (fn) {
    return { r: Number(fn[1]), g: Number(fn[2]), b: Number(fn[3]), a: fn[4] === undefined ? 1 : Number(fn[4]) };
  }

  return null;
}

/** Composites a possibly translucent `fg` over an opaque `bg`. */
export function blend(fg: Rgba, bg: Rgba): Rgba {
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1,
  };
}

const channel = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

/** Relative luminance (0 = black, 1 = white) of an opaque color. */
export function relativeLuminance({ r, g, b }: Rgba): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const WHITE: Rgba = { r: 255, g: 255, b: 255, a: 1 };

/**
 * Contrast ratio (1–21) of `fg` on `bg`. A translucent `bg` is composited over
 * `under` (white by default) first, then a translucent `fg` over that.
 * Returns `NaN` for colors that can't be parsed (`var()`, `color-mix()`).
 */
export function contrastRatio(fg: string, bg: string, under: string = '#ffffff'): number {
  const f = parseColor(fg);
  const b = parseColor(bg);
  const u = parseColor(under) ?? WHITE;
  if (!f || !b) return NaN;
  const opaqueBg = blend(b, blend(u, WHITE));
  const opaqueFg = blend(f, opaqueBg);
  const l1 = relativeLuminance(opaqueFg);
  const l2 = relativeLuminance(opaqueBg);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** True when `fg` on `bg` meets the minimum for `kind`. */
export function meetsContrast(fg: string, bg: string, kind: ContrastKind = 'text', under?: string): boolean {
  return contrastRatio(fg, bg, under) >= contrastThresholds[kind];
}
